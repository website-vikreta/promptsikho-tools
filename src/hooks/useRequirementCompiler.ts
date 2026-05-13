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
const model = (import.meta as any).env.VITE_OPENAI_MODEL || "gpt-4o-mini";

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
- ask clarification questions when ambiguity exists
- do not generate output unless sufficiently confident
- ask clarification when screenshot intent is unclear
- ask users to split oversized requests into smaller scopes

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
      console.log("Model:", model);

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

          Analyze uploaded screenshots carefully and convert the UI into implementation instructions rather than code.

          Requirements:
          ${requirementText}
          `;

      if (clarificationAnswers && clarificationAnswers.length > 0) {
        textContent += `\n\nClarifications from user:\n`;

        clarificationAnswers.forEach((qa, idx) => {
          textContent += `Q${idx + 1}: ${qa.question}\nA: ${qa.answer}\n`;
        });
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
        model,
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
        temperature: 0.3,
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

      // Quick check to see if clarifications are needed
      const response = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a requirements analyst. Analyze the given requirements and respond with a JSON array of clarification questions needed (or empty array if none needed). Return ONLY valid JSON, nothing else.",
          },
          {
            role: "user",
            content: `Requirements:\n${text}\n\nRespond with a JSON array of clarification questions as strings, or [] if no clarifications needed.`,
          },
        ],
        max_completion_tokens: 500,
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content || "[]";
      console.log("📋 Clarification response:", content.substring(0, 100));
      try {
        const parsed = JSON.parse(content);
        const cqs = Array.isArray(parsed) ? parsed : [];
        console.log("✅ Detected", cqs.length, "clarification questions");
        setClarifications(cqs);
        return cqs;
      } catch {
        // If JSON parse fails, return empty
        console.warn("⚠️  Failed to parse clarification JSON");
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
