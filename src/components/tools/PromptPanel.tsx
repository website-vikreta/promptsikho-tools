import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface PromptPanelProps {
  isOpen: boolean
  onClose: () => void
  prompt: string
  onPromptChange: (value: string) => void
}

export function PromptPanel({ isOpen, onClose, prompt, onPromptChange }: PromptPanelProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[500px] bg-white z-50 shadow-xl flex flex-col">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-slate-900">Prompt Configuration</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition-colors"
          >
            <i className="bi bi-x-lg text-xl"></i>
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt-input" className="block text-slate-900 mb-2">
                System Prompt
              </label>
              <Textarea
                id="prompt-input"
                placeholder="Enter your custom prompt here..."
                className="h-[calc(100vh-250px)] resize-none"
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
              />
              <p className="text-slate-500 text-sm mt-2">
                Customize how the AI analyzes job descriptions
              </p>
            </div>
          </div>
        </div>

        {/* Panel Footer */}
        <div className="px-6 py-4 border-t border-slate-200">
          <Button onClick={onClose} className="w-full">
            Save & Close
          </Button>
        </div>
      </div>
    </>
  )
}
