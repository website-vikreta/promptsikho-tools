import { useState, useCallback } from 'react'
import { analyzeJobDescription, continueConversation, parseMetricsFromResponse } from '@/lib/openai'

interface Message {
  id: number
  type: 'user' | 'bot'
  content: string
}

interface UseJobAnalyzerProps {
  resume: string
  prompt: string
}

export function useJobAnalyzer({ resume, prompt }: UseJobAnalyzerProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([])

  const analyzeJob = useCallback(
    async (jobDescription: string): Promise<Message | null> => {
      if (!resume.trim() || !prompt.trim()) {
        setError('Please add both resume and prompt before analyzing')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const context = {
          resume,
          prompt,
          conversationHistory,
        }

        const response = await analyzeJobDescription(jobDescription, context)

        // Add to conversation history
        const newHistory = [
          ...conversationHistory,
          {
            role: 'user' as const,
            content: `Please analyze this job description against my resume:\n\n${jobDescription}`,
          },
          {
            role: 'assistant' as const,
            content: response,
          },
        ]
        setConversationHistory(newHistory)

        // Parse metrics from response (just returns the text)
        const analysisText = parseMetricsFromResponse(response)

        const botMessage: Message = {
          id: Date.now(),
          type: 'bot',
          content: analysisText,
        }

        return botMessage
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to analyze job description'
        setError(errorMessage)
        console.error('Job analysis error:', err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [resume, prompt, conversationHistory]
  )

  const continueChat = useCallback(
    async (userMessage: string): Promise<Message | null> => {
      if (!resume.trim() || !prompt.trim()) {
        setError('Please add both resume and prompt before continuing')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const context = {
          resume,
          prompt,
          conversationHistory,
        }

        const response = await continueConversation(userMessage, context)

        // Add to conversation history
        const newHistory = [
          ...conversationHistory,
          {
            role: 'user' as const,
            content: userMessage,
          },
          {
            role: 'assistant' as const,
            content: response,
          },
        ]
        setConversationHistory(newHistory)

        const botMessage: Message = {
          id: Date.now(),
          type: 'bot',
          content: response,
        }

        return botMessage
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to continue conversation'
        setError(errorMessage)
        console.error('Conversation error:', err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [resume, prompt, conversationHistory]
  )

  const resetConversation = useCallback(() => {
    setConversationHistory([])
    setError(null)
  }, [])

  return {
    analyzeJob,
    continueChat,
    resetConversation,
    loading,
    error,
    conversationHistory,
  }
}
