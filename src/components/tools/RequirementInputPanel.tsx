import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface RequirementInputPanelProps {
  value: string;
  onChange: (v: string) => void;
  onFilesChange: (files: File[]) => void;
  files: File[];
  onGenerate: () => void;
  state: "idle" | "uploading" | "generating" | "clarification-required";
  clarificationQuestions: string[];
  onAnswerClarification: (index: number, answer: string) => void;
}

export function RequirementInputPanel({
  value,
  onChange,
  onFilesChange,
  files,
  onGenerate,
  state,
  clarificationQuestions,
  onAnswerClarification,
}: RequirementInputPanelProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleFiles = (fileList?: FileList | null) => {
    if (!fileList) return;
    const list = Array.from(fileList);
    // Validate images only and max 6MB per file
    const allowed = list.filter(
      (f) => /^image\//.test(f.type) && f.size <= 6 * 1024 * 1024,
    );
    const rejected = list.length - allowed.length;
    if (rejected > 0)
      setUploadError(
        "Some files were rejected. Only images under 6MB are allowed.",
      );
    else setUploadError(null);
    // Simulate async processing/upload state
    setUploading(true);
    setTimeout(() => {
      onFilesChange(allowed);
      setUploading(false);
    }, 300);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <Card className="h-full flex flex-col min-h-0 overflow-hidden">
      <CardHeader>
        <CardTitle>Requirements</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          <label className="sr-only" htmlFor="req-input">
            Requirements
          </label>
          <Textarea
            id="req-input"
            placeholder="Paste raw requirements, screenshots, feature ideas, references, or implementation notes..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[180px] resize-none"
          />

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border border-dashed rounded-md p-3 flex flex-col gap-3"
            aria-label="Upload screenshots or files"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Upload screenshots (drag & drop supported)
              </p>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload
                </Button>
              </div>
            </div>
            {uploading && (
              <div className="text-sm text-muted-foreground">
                Processing uploads...
              </div>
            )}

            {uploadError && (
              <div className="text-sm text-red-600">{uploadError}</div>
            )}

            {files && files.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="relative border rounded overflow-hidden group"
                  >
                    <img
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      className="w-full h-24 object-cover"
                    />

                    <p className="text-xs p-1 truncate">{f.name}</p>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const updatedFiles = files.filter(
                          (_, index) => index !== i,
                        );
                        onFilesChange(updatedFiles);

                        // reset input if all removed
                        if (updatedFiles.length === 0 && fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {clarificationQuestions && clarificationQuestions.length > 0 && (
            <div className="space-y-2">
              {clarificationQuestions.map((q, idx) => (
                <div key={idx} className="p-3 border rounded-md">
                  <p className="text-sm mb-2">{q}</p>
                  <input
                    aria-label={`clarify-${idx}`}
                    className="w-full rounded border px-3 py-2"
                    onBlur={(e) => onAnswerClarification(idx, e.target.value)}
                    placeholder="Answer here"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <div className="w-full">
          <Button
            onClick={onGenerate}
            className="w-full"
            disabled={state === "generating" || state === "uploading"}
          >
            {state === "generating" ? (
              <>
                <i className="bi bi-hourglass-split animate-spin" />{" "}
                <span>Generating...</span>
              </>
            ) : (
              <>
                <i className="bi bi-robot" /> <span>Generate Prompt</span>
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default RequirementInputPanel;
