import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ResumePanelProps {
  isOpen: boolean
  onClose: () => void
  resume: string
  onResumeChange: (value: string) => void
}

export function ResumePanel({ isOpen, onClose, resume, onResumeChange }: ResumePanelProps) {
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
          <h3 className="text-slate-900">Resume Content</h3>
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
              <label htmlFor="resume-input" className="block text-slate-900 mb-2">
                Your Resume
              </label>
              <Textarea
                id="resume-input"
                placeholder="Paste your resume content here..."
                className="h-[calc(100vh-250px)] resize-none"
                value={resume}
                onChange={(e) => onResumeChange(e.target.value)}
              />
              <p className="text-slate-500 text-sm mt-2">
                This will be used to compare against job descriptions you provide
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
