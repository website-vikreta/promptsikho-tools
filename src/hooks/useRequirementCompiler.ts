import { useState } from "react";
import OpenAI from "openai";

interface UseRequirementCompilerProps {
  requirementText: string;
  files: File[];
}

interface ClarificationQA {
  question: string;
  answer: string;
}

const apiKey = (import.meta as any).env.VITE_OPENAI_API_KEY;
const generationModel =
  (import.meta as any).env.VITE_OPENAI_MODEL || "gpt-4o-mini";

const clarificationModel = "gpt-4o";

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `You are an AI-native Product Owner and Requirement Compiler specialized in transforming raw user requirements into deterministic GitHub Copilot Agent Mode prompts.

Your responsibility is converting:
- rough notes
- screenshots
- fragmented requirements
- feature requests
- content dumps

If screenshots are NOT provided:
- do not reference screenshots
- do not assume visual layouts
- do not hallucinate UI structure
- generate prompts strictly from textual requirements

into:
- structured implementation prompts
- production-grade execution instructions
- repository-aware implementation guidance
- token-efficient GitHub Copilot Agent prompts

Core Behavior:
- optimize for execution reliability first
- maintain intelligent token efficiency
- prioritize deterministic implementation behavior
- preserve repository consistency
- preserve exact wording when required
- infer implementation logic intelligently
- avoid hallucinated architecture decisions
- avoid enterprise PRD verbosity

Repository Assumptions:
- repository already contains design system
- repository already contains instruction files
- repository already contains architecture conventions
- repository already contains approved libraries
- repository already contains agentic workflows
Do not repeatedly restate repository guardrails unless task-specific.

Output Format Rules:
- NEVER generate raw implementation code unless explicitly requested
- NEVER generate HTML/CSS/JS directly
- ALWAYS generate GitHub Copilot Agent style prompts
- output must be instruction-oriented
- prompts must describe implementation requirements
- prompts should guide AI coding agents
- use markdown formatting
- use sections, bullets, and implementation constraints
- generate prompts developers can paste into Copilot Chat or Cursor AI

Clarification Rules:
- Ask clarification questions ONLY if essential implementation details are missing
- Ask concise, implementation-focused questions
- Avoid generic or obvious questions
- Avoid repeating information already visible in screenshots or requirements
- Prefer intelligent inference whenever possible
- Ask only questions that materially improve implementation quality
- Group related ambiguities into fewer precise questions
- If requirements are sufficiently clear, generate output directly
- Once clarification answers are provided, NEVER ask additional questions
- Use screenshots heavily to reduce clarification needs

Implementation Rules:
- enforce production-ready implementation behavior
- avoid TODO placeholders
- avoid pseudocode
- encourage reusable architecture
- infer responsiveness automatically
- infer accessibility automatically
- infer semantic structure automatically

Content Preservation Rules:
- preserve exact wording
- preserve links
- preserve HTML formatting
- preserve JSON structures
- never paraphrase content unless explicitly requested

Final Generation Rules:
- CRITICAL: Once you have clarifications (Q&A provided), DO NOT ask for more information
- Use the clarifications as additional context and generate the FINAL complete prompt
- Generate production-ready prompts that developers can immediately paste into Copilot
- Include all necessary details, constraints, and requirements in ONE comprehensive prompt
- Do not request additional information in the output

Preferred Output Structure:

# Objective
Describe what needs to be built

# UI Requirements
Describe layout and design

# Functional Requirements
Describe interactions and behavior

# Technical Requirements
Mention frameworks, responsiveness, accessibility, animations, etc.

# Constraints
Mention restrictions and implementation expectations

# Deliverables
Describe expected output from the coding agent

When generating prompts:
- optimize for GitHub Copilot Agent Mode
- prioritize implementation clarity
- maintain compact but deterministic structure`;

export function useRequirementCompiler({
  requirementText,
  files,
}: UseRequirementCompilerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState("");
  const [clarifications, setClarifications] = useState<string[]>([]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = reject;
    });
  };

  const compileRequirements = async (
    clarificationAnswers?: ClarificationQA[],
  ): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      console.log("🚀 compileRequirements called");
      console.log("API Key configured:", !!apiKey);
      console.log("Model:", generationModel);

      if (!apiKey || apiKey.trim() === "") {
        const noKeyError =
          "VITE_OPENAI_API_KEY environment variable is not set or empty";
        console.error("❌", noKeyError);
        setError(noKeyError);
        throw new Error(noKeyError);
      }

      // Build user message with requirement text and clarification answers
      let textContent = `
          Generate a GitHub Copilot Agent Mode prompt.

          Do NOT generate implementation code.

          Generate a structured markdown AI prompt that a developer can paste into:
          - GitHub Copilot
          - Cursor AI
          - Claude
          - ChatGPT


          Requirements:
          ${requirementText}
          `;

      if (files && files.length > 0) {
        textContent += `

Analyze uploaded screenshots carefully and convert the UI into implementation instructions rather than code.

Focus on:
- layout hierarchy
- spacing
- responsiveness
- interactions
- visual structure
- reusable UI patterns
`;
      }

      if (clarificationAnswers && clarificationAnswers.length > 0) {
        textContent += `\n\nClarifications from user:\n`;

        clarificationAnswers.forEach((qa, idx) => {
          textContent += `Q${idx + 1}: ${qa.question}\nA: ${qa.answer}\n`;
        });

        textContent += `

Generate the FINAL implementation prompt using the provided clarification answers.

Do NOT ask additional questions.
Do NOT request more information.
Generate the complete final prompt directly.
`;
      }

      const contentParts: any[] = [
        {
          type: "text",
          text: textContent,
        },
      ];

      if (files && files.length > 0) {
        console.log("🖼️ Processing uploaded images:", files.length);

        for (const file of files) {
          const base64 = await fileToBase64(file);

          contentParts.push({
            type: "image_url",
            image_url: {
              url: base64,
            },
          });
        }
      }

      console.log("📝 Sending request to OpenAI...");
      console.log("   - Requirement text length:", requirementText.length);

      // Call OpenAI with streaming or regular completion
      const response = await openai.chat.completions.create({
        model: generationModel,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: contentParts,
          },
        ],
        max_completion_tokens: 4000,
        temperature: 0.15,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      console.log("✅ OpenAI response received");
      console.log(
        "   - Content length:",
        response.choices[0]?.message?.content?.length,
      );

      const compiledPrompt =
        response.choices[0]?.message?.content || "No response generated";
      console.log("📤 Setting output with compiled prompt");
      setOutput(compiledPrompt);
      return compiledPrompt;
    } catch (err) {
      const errorMsg =
        err instanceof OpenAI.APIError
          ? `OpenAI API Error (${err.status}): ${err.message}`
          : err instanceof Error
            ? err.message
            : "Unknown error occurred";
      console.error("❌ Error:", errorMsg, err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const detectClarifications = async (text: string): Promise<string[]> => {
    try {
      console.log("🔍 detectClarifications called, text length:", text.length);

      if (!apiKey || apiKey.trim() === "") {
        console.warn(
          "⚠️  API key not configured, skipping clarification detection",
        );
        return [];
      }

      // Build clarification detection message with images
      const contentParts: any[] = [
        {
          type: "text",
          text: `You are evaluating whether the provided requirements are implementation-ready for an AI coding agent.

Your job is NOT to generate the solution.

Your job is ONLY to determine whether important implementation details are missing.

Analyze:
- requirements
- screenshots
- flows
- business logic
- integrations
- user interactions
- permissions
- responsiveness
- edge cases
- navigation
- states
- APIs
- data handling

Before deciding:
- mentally evaluate implementation readiness from 1-10
- if readiness is below 8/10, ask clarification questions
- if readiness is 8+/10, return []

IMPORTANT:
If the request is short, vague, or missing feature-specific details, you MUST ask clarification questions.

Examples requiring clarification:
- "build navbar"
- "create dashboard"
- "make landing page"
- "build admin panel"
- "create authentication page"

For UI-related requests, clarify:
- navigation items
- CTA buttons
- responsiveness
- authentication behavior
- mobile/hamburger behavior
- dropdowns
- interactions
- sections
- routing/navigation behavior
- animations
- forms/search behavior

For common UI components like navbars, dashboards, landing pages, forms, or admin panels:
- verify important sections and interactions are defined
- ask about missing component behavior
- ask about responsiveness when not specified
- ask about navigation structure when unclear

Ask clarification questions ONLY when missing information would realistically block or significantly affect implementation quality.

Examples of GOOD clarification areas:
- authentication flow unclear
- missing dashboard behavior
- unclear navigation behavior
- unclear API/data handling
- unclear responsive behavior
- unclear user roles/permissions
- unclear form submission logic
- unclear CRUD operations
- unclear realtime behavior
- unclear integrations

Examples of BAD clarification areas:
- asking color preferences
- asking obvious screenshot details
- asking styling preferences
- asking things inferable from UI
- asking unnecessary implementation choices

Rules:
- ask concise implementation-focused questions
- ask only high-value questions
- combine related ambiguities
- return [] ONLY when feature scope, interactions, behavior, and implementation expectations are sufficiently clear
- ask clarification questions if important feature details are missing even when partial implementation is technically possible

Return ONLY a valid JSON array of question strings.

Requirements:
${text}`,
        },
      ];

      // Include images in clarification analysis
      if (files && files.length > 0) {
        console.log("🖼️ Including images in clarification analysis");
        for (const file of files) {
          const base64 = await fileToBase64(file);
          contentParts.push({
            type: "image_url",
            image_url: {
              url: base64,
            },
          });
        }
      }

      const response = await openai.chat.completions.create({
        model: clarificationModel,
        messages: [
          {
            role: "system",
            content: `
You are a senior product analyst and AI requirements architect.

Your task is to generate only high-value clarification questions that are essential for accurate implementation.


Rules:
- determine whether missing information could materially affect implementation quality
- mentally evaluate implementation readiness from 1-10 before deciding
- if readiness is below 8/10, ask clarification questions
- if readiness is 8+/10, return []
- ask clarification questions when important behavior, scope, flows, permissions, data handling, responsiveness, or integrations are unclear
- ask concise implementation-focused questions
- avoid generic or unnecessary questions
- avoid asking things already visible in screenshots
- avoid asking preference-only questions unless implementation-critical
- group related ambiguities into fewer questions
- infer only minor visual styling details when safe
- return [] ONLY when requirements are genuinely implementation-ready
- ask clarification questions if important feature details are missing even when partial implementation is technically possible

Return ONLY a valid JSON array of question strings.
Do not include explanations, markdown, numbering, or extra text.
      `,
          },
          {
            role: "user",
            content: contentParts,
          },
        ],
        max_completion_tokens: 400,
        temperature: 0,
      });

      const content = response.choices[0]?.message?.content || "[]";

      console.log("📋 Clarification response:", content.substring(0, 100));

      try {
        const cleanedContent = content
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const parsed = JSON.parse(cleanedContent);

        const cqs = Array.isArray(parsed) ? parsed : [];

        console.log(
          "✅ Detected",
          cqs.length,
          "critical clarification questions",
        );

        setClarifications(cqs);

        return cqs;
      } catch {
        console.warn("⚠️ Failed to parse clarification JSON");

        setClarifications([]);

        return [];
      }
    } catch (err) {
      // Silently fail clarification detection
      console.error("❌ Error in detectClarifications:", err);
      return [];
    }
  };

  return {
    compileRequirements,
    detectClarifications,
    loading,
    error,
    output,
    clarifications,
  };
}
