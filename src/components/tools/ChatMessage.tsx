interface ChatMessageProps {
  type: "user" | "bot"
  content: string
  results?: {
    matchScore: number
    compatibility: number
    skillsMatch: number
    experienceMatch: number
  }
}

export function ChatMessage({ type, content, results }: ChatMessageProps) {
  return (
    <div className={`flex gap-2 text-sm ${type === "user" ? "justify-end" : "justify-start"}`}>
      {type === "bot" && (
        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
          <i className="bi bi-robot text-white"></i>
        </div>
      )}
      
      <div className={`max-w-[70%] ${type === "user" ? "order-first" : ""}`}>
        <div
          className={`rounded-lg p-2 px-3 ${
            type === "user"
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200"
          }`}
        >
          <p className="whitespace-pre-wrap">{content}</p>
          
          {results && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-slate-600 text-sm mb-1">Match Score</p>
                  <p className="text-slate-900 text-2xl">{results.matchScore}%</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-slate-600 text-sm mb-1">Compatibility</p>
                  <p className="text-slate-900 text-2xl">{results.compatibility}%</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-slate-600 text-sm mb-1">Skills Match</p>
                  <p className="text-slate-900 text-2xl">{results.skillsMatch}%</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-slate-600 text-sm mb-1">Experience</p>
                  <p className="text-slate-900 text-2xl">{results.experienceMatch}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {type === "user" && (
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
          <i className="bi bi-person text-slate-600"></i>
        </div>
      )}
    </div>
  )
}
