import { useState } from "react";
import { RequirementInputPanel } from "@/components/tools/RequirementInputPanel";
import PromptOutputPanel from "@/components/tools/PromptOutputPanel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRequirementCompiler } from "@/hooks/useRequirementCompiler";

export default function AIRequirementCompilerPage() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<
    | "idle"
    | "uploading"
    | "generating"
    | "clarification-required"
    | "oversized-warning"
    | "failed"
  >("idle");
  const [clarifications, setClarifications] = useState<string[]>([]);
  const [clarAnswers, setClarAnswers] = useState<Record<number, string>>({});
  const [output, setOutput] = useState("");
  const {
    compileRequirements,
    detectClarifications,
    loading: aiLoading,
    error: aiError,
  } = useRequirementCompiler({
    requirementText: input,
    files,
  });

  const handleGenerate = async () => {
    console.log("🎬 handleGenerate called, input length:", input.length);

    // Oversized-scope detection
    if (input && input.length > 3000) {
      console.log("⚠️  Oversized scope detected");
      setState("oversized-warning");
      return;
    }

    // Detect if clarifications are needed
    setState("generating");
    setOutput("");

    try {
      console.log("📋 Detecting clarifications...");
      const cqs = await detectClarifications(input);
      console.log("DEBUG clarification questions:", cqs);
      console.log("✅ Clarifications detection complete, count:", cqs?.length);

      if (cqs && cqs.length > 0) {
        console.log("❓ Clarifications needed, showing clarification UI");
        setClarifications(cqs);
        setState("clarification-required");
        return;
      }

      // No clarifications needed, generate prompt directly
      console.log("✨ No clarifications needed, compiling requirements...");
      const compiled = await compileRequirements();
      console.log("✅ Compilation complete, output length:", compiled?.length);
      console.log("📝 Output preview:", compiled?.substring(0, 100) || "empty");
      setOutput(compiled);
      setState("idle");
    } catch (err) {
      console.error("❌ Error during generation:", err);
      setState("failed");
      setOutput(`Error: ${aiError || "Failed to generate prompt"}`);
    }
  };

  const handleConfirmClarifications = async () => {
    if (!resolvedAll) {
      console.log("⚠️ Waiting for all clarification answers");
      return;
    }
    console.log("✅ Confirming clarifications with answers");
    setState("generating");
    setOutput("");

    try {
      const qaList = clarifications
        .map((q, idx) => ({
          question: q,
          answer: clarAnswers[idx]?.trim() || "",
        }))
        .filter((qa) => qa.answer.length > 0);

      console.log("📋 Sending clarifications to compiler");
      const compiled = await compileRequirements(qaList);
      console.log("✅ Compilation with clarifications complete");
      setOutput(compiled);
      setState("idle");
      setClarifications([]);
      setClarAnswers({});
    } catch (err) {
      console.error("❌ Error during clarification compilation:", err);
      setState("failed");
      setOutput(`Error: ${aiError || "Failed to generate prompt"}`);
    }
  };

  const handleFilesChange = (fs: File[]) => {
    setFiles(fs);
  };

  const handleAnswerClarification = (index: number, answer: string) => {
    setClarAnswers((prev) => ({ ...prev, [index]: answer }));
  };

  // If clarifications answered, allow generation
  const resolvedAll =
    clarifications.length > 0 &&
    clarifications.every(
      (_, i) => clarAnswers[i] && clarAnswers[i].trim().length > 0,
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">AI Requirement Compiler</h1>
        <p className="text-sm text-muted-foreground">
          Transform raw notes into structured GitHub Copilot Agent prompts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        <RequirementInputPanel
          value={input}
          onChange={setInput}
          files={files}
          onFilesChange={handleFilesChange}
          onGenerate={
            state === "clarification-required"
              ? handleConfirmClarifications
              : handleGenerate
          }
          state={state}
          clarificationQuestions={clarifications}
          onAnswerClarification={handleAnswerClarification}
        />

        <div className="flex flex-col h-full min-h-0 overflow-hidden">
          {state === "oversized-warning" && (
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <h3 className="font-semibold text-yellow-900">Scope Too Large</h3>
              <p className="text-sm text-yellow-800 mt-2">
                Split this into smaller, focused requirements for deterministic
                prompts. Consider separating by feature, module, or phase.
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setState("idle");
                    setOutput("");
                    setClarifications([]);
                    setClarAnswers({});
                  }}
                >
                  Edit & Reduce Scope
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setState("generating");
                    compileRequirements()
                      .then((result) => {
                        setOutput(result);
                        setState("idle");
                      })
                      .catch(() => setState("failed"));
                  }}
                  disabled={aiLoading}
                >
                  Generate Anyway
                </Button>
              </div>
            </Card>
          )}

          {state === "failed" && (
            <Card className="p-4 border-red-200 bg-red-50">
              <h3 className="font-semibold text-red-800">Generation Failed</h3>
              <p className="text-sm text-red-700 mt-1">
                {aiError || "Unknown error occurred. Please try again."}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => {
                  setState("idle");
                  setOutput("");
                }}
              >
                Dismiss
              </Button>
            </Card>
          )}

          <PromptOutputPanel
            generating={state === "generating"}
            output={output}
          />
        </div>
      </div>
    </div>
  );
}
