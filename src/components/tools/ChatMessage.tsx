interface ChatMessageProps {
   type: "user" | "bot"
   content: string
}

export function ChatMessage({ type, content }: ChatMessageProps) {
   return (
      <div className={`flex gap-2 text-sm ${type === "user" ? "justify-end" : "justify-start"}`}>
         {type === "bot" && (
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
               <i className="bi bi-robot text-white"></i>
            </div>
         )}

         <div className={`w-full max-w-[70%] ${type === "user" ? "order-first" : ""}`}>
            <div
               className={`rounded-lg p-3 ${type === "user"
                     ? "bg-slate-900 text-white"
                     : "bg-white border border-slate-200"
                  }`}
            >
               <p className="whitespace-pre-wrap">{content}</p>
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
