import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CopyButton from "./CopyButton";

interface PromptOutputPanelProps {
  generating: boolean;
  output: string;
}

export function PromptOutputPanel({
  generating,
  output,
}: PromptOutputPanelProps) {
  React.useEffect(() => {
    if (output && output.length > 0) {
      console.log(
        "📊 PromptOutputPanel received output:",
        output.length,
        "chars",
      );
    }
  }, [output]);

  return (
    <Card className="flex-1 flex flex-col min-h-0">
      <CardHeader>
        <CardTitle>Generated Prompt</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {generating ? (
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-slate-100 rounded" />
            <div className="h-6 bg-slate-100 rounded w-5/6" />
            <div className="h-40 bg-slate-100 rounded" />
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-auto rounded border border-dashed border-slate-200 bg-white p-4 text-sm font-mono">
              <pre className="text-sm leading-snug whitespace-pre-wrap break-words overflow-x-auto">
                {output || "No prompt generated yet."}
              </pre>
            </div>
            <div className="mt-3 flex justify-end">
              <CopyButton text={output} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PromptOutputPanel;
