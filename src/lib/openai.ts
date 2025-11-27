import OpenAI from 'openai'

interface ChatContext {
  resume: string
  prompt: string
  conversationHistory: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  resumeEmbedded?: boolean
}

const apiKey = (import.meta as any).env.VITE_OPENAI_API_KEY
const model = (import.meta as any).env.VITE_OPENAI_MODEL || 'gpt-4o-mini'

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
})

/**
 * Compresses resume by extracting only essential information
 * Reduces token size significantly while keeping key details
 */
function compressResume(resume: string): string {
  // Extract key sections
  const lines = resume.split('\n')
  const compressed: string[] = []
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Keep section headers and key content
    if (trimmed.match(/^[A-Z\s]+$/) || // Section headers (all caps)
        trimmed.includes('•') || // Bullet points
        trimmed.match(/\d+\+?\s*years?/) || // Years of experience
        trimmed.match(/[A-Za-z]+(?:\.|,)/) && trimmed.length < 100) { // Short relevant lines
      compressed.push(line)
    }
  }
  
  return compressed.length > 0 ? compressed.join('\n') : resume
}

/**
 * Analyzes job description against resume
 * Smart caching: Only includes resume on first message
 */
export async function analyzeJobDescription(
  jobDescription: string,
  context: ChatContext
): Promise<string> {
  try {
    // Determine if this is the first analysis (resume not yet in context)
    const isFirstAnalysis = context.conversationHistory.length === 0
    
    let systemPrompt = context.prompt
    
    // Only include resume on first message to save tokens
    if (isFirstAnalysis) {
      const compressedResume = compressResume(context.resume)
      systemPrompt = `${context.prompt}\n\nUSER'S RESUME (for entire conversation):\n${compressedResume}`
    } else {
      // For follow-up messages, just remind AI about context
      systemPrompt = `${context.prompt}\n\nNote: You have already been provided with the user's resume in this conversation.`
    }

    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt,
      },
      ...context.conversationHistory,
      {
        role: 'user' as const,
        content: `Analyze this job description and score the match:\n\n${jobDescription}`,
      },
    ]

    const response = await openai.chat.completions.create({
      model,
      messages,
      max_completion_tokens: 2000,
      temperature: 0.7,
    })

    const rawResponse = response.choices[0]?.message?.content || 'No response received'
    return rawResponse
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new Error(`OpenAI API Error: ${error.message}`)
    }
    throw error
  }
}

/**
 * Continues conversation with the AI
 * Resume is already in conversation context, so not re-sent
 */
export async function continueConversation(
  userMessage: string,
  context: ChatContext
): Promise<string> {
  try {
    // Resume is already in context, just continue conversation
    const messages = [
      {
        role: 'system' as const,
        content: context.prompt,
      },
      ...context.conversationHistory,
      {
        role: 'user' as const,
        content: userMessage,
      },
    ]

    const response = await openai.chat.completions.create({
      model,
      messages,
      max_completion_tokens: 2000,
      temperature: 0.7,
    })

    const rawResponse = response.choices[0]?.message?.content || 'No response received'
    return rawResponse
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new Error(`OpenAI API Error: ${error.message}`)
    }
    throw error
  }
}

/**
 * Simple function to just return the response as is
 * No parsing needed - model returns plain text analysis with a score
 */
export function parseMetricsFromResponse(response: string): string {
  return response.trim()
}
