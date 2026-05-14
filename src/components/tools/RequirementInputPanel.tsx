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
  state: "idle" | "uploading" | "generating" | "clarification-required" | "oversized-warning" | "failed";
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
  const [isDragging, setIsDragging] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

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
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => {
              setIsDragging(false);
            }}
            onDrop={(e) => {
              setIsDragging(false);
              handleDrop(e);
            }}
            className={`
relative overflow-hidden border-2 border-dashed rounded-2xl
p-6 min-h-[260px]
flex flex-col justify-center gap-4
transition-all duration-300 ease-in-out

${
  isDragging
    ? "scale-[1.02] bg-gray-100 border-violet-400 shadow-[0_0_50px_rgba(139,92,246,0.35)]"
    : "bg-white border-gray-200"
}
`}
            aria-label="Upload screenshots or files"
          >
            {isDragging && (
              <>
                {/* Glow Overlay */}
                <div className="absolute inset-0 bg-violet-500/5 pointer-events-none" />

                {/* Scanning Line */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-violet-400/30 to-transparent animate-[scan_2s_linear_infinite]" />
                </div>
              </>
            )}
            <div className="flex flex-col items-center justify-center text-center gap-4">
              {/* AI Icon */}
              <div
                className={`
      w-16 h-16 rounded-2xl flex items-center justify-center
      transition-all duration-300 animate-[float_3s_ease-in-out_infinite]
      ${isDragging ? "bg-violet-100 scale-110" : "bg-slate-100"}
    `}
              >
                <i
                  className={`
        bi bi-stars text-2xl transition-all duration-300
        ${isDragging ? "text-violet-600 animate-pulse" : "text-slate-500"}
      `}
                />
              </div>

              {/* Upload Text */}
              <div className="space-y-1">
                <p className="text-base font-semibold">
                  {isDragging
                    ? "✨ AI analyzing screenshots..."
                    : "Upload screenshots"}
                </p>

                <p className="text-sm text-muted-foreground">
                  Drag & drop UI screenshots, wireframes, or designs
                </p>
              </div>

              {/* Upload Chips */}
              <div className="flex flex-wrap justify-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100">
                  UI Screenshots
                </span>

                <span className="text-xs px-2 py-1 rounded-full bg-slate-100">
                  Wireframes
                </span>

                <span className="text-xs px-2 py-1 rounded-full bg-slate-100">
                  Figma Exports
                </span>
              </div>

              {/* Upload Button */}
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
                  Upload Files
                </Button>
              </div>
            </div>
            {uploading && (
              <div className="flex items-center justify-center gap-2 text-sm text-violet-600 font-medium">
                <i className="bi bi-stars animate-pulse" />
                <span>AI processing screenshots...</span>
              </div>
            )}

            {uploadError && (
              <div className="text-sm text-red-600">{uploadError}</div>
            )}

            {files && files.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="relative border rounded-xl overflow-hidden group bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <img
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      onClick={() => setPreviewImage(URL.createObjectURL(f))}
                      className="w-full h-40 object-cover rounded-xl cursor-pointer hover:scale-[1.03] hover:shadow-xl transition-all duration-300"
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
              <div className="flex items-center gap-2">
                <i className="bi bi-hourglass-split animate-spin" />{" "}
                <span>Generating...</span>
              </div>
            ) : state === "clarification-required" ? (
              <div className="flex items-center gap-2">
                <i className="bi bi-check-circle" />
                <span>Confirm & Generate Prompt</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <i className="bi bi-stars" />
                <span>Generate Prompt</span>
              </div>
            )}
          </Button>
        </div>
      </CardFooter>
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
            />

            <button
              className="absolute top-3 right-3 bg-black/70 text-white w-10 h-10 rounded-full"
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default RequirementInputPanel;
