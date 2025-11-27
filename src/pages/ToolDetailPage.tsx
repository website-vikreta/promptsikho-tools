import { useParams, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { TOOLS } from '@/data/tools'
import { DEFAULT_RESUME, DEFAULT_PROMPT } from '@/data/defaults'
import { ChatMessage } from '@/components/tools/ChatMessage'
import { ResumePanel } from '@/components/tools/ResumePanel'
import { PromptPanel } from '@/components/tools/PromptPanel'

interface Message {
   id: number
   type: "user" | "bot"
   content: string
   results?: {
      matchScore: number
      compatibility: number
      skillsMatch: number
      experienceMatch: number
   }
}

export default function ToolDetailPage() {
   const { toolId } = useParams()

   const tool = TOOLS.find(t => t.id === toolId)

   if (!tool) {
      return (
         <div className="space-y-4">
            <h1 className="text-4xl font-bold">Tool Not Found</h1>
            <p className="text-muted-foreground">The tool you're looking for doesn't exist.</p>
            <Link to="/tools">
               <Button>Back to Tools</Button>
            </Link>
         </div>
      )
   }

   const [resume, setResume] = useState(DEFAULT_RESUME)
   const [prompt, setPrompt] = useState(DEFAULT_PROMPT)
   const [isResumePanelOpen, setIsResumePanelOpen] = useState(false)
   const [isPromptPanelOpen, setIsPromptPanelOpen] = useState(false)
   const [messages, setMessages] = useState<Message[]>([
      {
         id: 1,
         type: "bot",
         content: "Hello! I'm your Job Description Matcher assistant. I can help you analyze how well job descriptions match with your resume.\n\nTo get started, please add your resume content using the button in the top right, then paste a job description here."
      }
   ])
   const [input, setInput] = useState("")
   const [showWelcome, setShowWelcome] = useState(true)
   const messagesEndRef = useRef<HTMLDivElement>(null)

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
   }

   useEffect(() => {
      scrollToBottom()
   }, [messages])

   const handleSend = () => {
      if (!input.trim()) return

      if (!resume.trim()) {
         const newMessages: Message[] = [
            ...messages,
            {
               id: Date.now(),
               type: "user",
               content: input
            },
            {
               id: Date.now() + 1,
               type: "bot",
               content: "Please add your resume content first by clicking the 'Add Resume' button in the top right corner. This will help me compare the job description with your qualifications."
            }
         ]
         setMessages(newMessages)
         setInput("")
         return
      }

      // Add user message
      const userMessage: Message = {
         id: Date.now(),
         type: "user",
         content: input
      }

      // Generate mock results
      const mockResults = {
         matchScore: Math.floor(Math.random() * 25) + 70,
         compatibility: Math.floor(Math.random() * 30) + 65,
         skillsMatch: Math.floor(Math.random() * 25) + 70,
         experienceMatch: Math.floor(Math.random() * 30) + 60
      }

      // Add bot response with results
      const botMessage: Message = {
         id: Date.now() + 1,
         type: "bot",
         content: "I've analyzed the job description against your resume. Here are the key compatibility metrics:",
         results: mockResults
      }

      setMessages([...messages, userMessage, botMessage])
      setInput("")
      setShowWelcome(false)
   }

   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
         e.preventDefault()
         handleSend()
      }
   }


   return (
      <div className='flex flex-col h-[calc(100vh-12rem)] gap-4'>
         <div className='flex flex-col items-start lg:flex-row lg:justify-between lg:items-center gap-4'>
            <div>
            <h1 className="text-xl lg:text-2xl font-semibold">{tool.name}</h1>
            <p className="text-sm text-muted-foreground">{tool.desc}</p>
            </div>
            <div className='flex justify-start items-center gap-2'>
               <Button
                  onClick={() => setIsResumePanelOpen(true)}
                  className="gap-2"
                  size="sm"
                  variant='outline'
               >
                  <i className="bi bi-terminal"></i>
                  <span>{resume ? "Edit Resume" : "Add Resume"}</span>
               </Button>
               <Button
                  onClick={() => setIsPromptPanelOpen(true)}
                  className="gap-2"
                  size="sm"
                  variant='outline'
               >
                  <i className="bi bi-file-earmark-text"></i>
                  <span>{prompt ? "Edit Prompt" : "Add Prompt"}</span>
               </Button>
            </div>
         </div>


         <section className="flex-1 overflow-hidden bg-gray-50 rounded-lg border border-gray-200">
            <div className="h-full flex flex-col">
               {/* Chat Messages */}
               <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
                  {messages.map((message: Message) => (
                     <ChatMessage
                        key={message.id}
                        type={message.type}
                        content={message.content}
                        results={message.results}
                     />
                  ))}
                  <div ref={messagesEndRef} />
               </div>

               {/* Input Area */}
               <div className="px-4 lg:px-6 py-4 bg-white border-t border-slate-200">
                  <div className="flex gap-3 items-end">
                     <div className="flex-1">
                        <Input
                           placeholder="Paste a job description here to analyze..."
                           className="resize-none text-sm"
                           value={input}
                           onChange={(e) => setInput(e.target.value)}
                           onKeyPress={handleKeyPress}
                        />
                     </div>
                     <Button onClick={handleSend} size="sm" className="gap-2">
                        <i className="bi bi-send"></i>
                        <span>Send</span>
                     </Button>
                  </div>
               </div>
            </div>
         </section>

         {/* Resume Side Panel */}
         <ResumePanel
            isOpen={isResumePanelOpen}
            onClose={() => setIsResumePanelOpen(false)}
            resume={resume}
            onResumeChange={setResume}
         />

         {/* Prompt Side Panel */}
         <PromptPanel
            isOpen={isPromptPanelOpen}
            onClose={() => setIsPromptPanelOpen(false)}
            prompt={prompt}
            onPromptChange={setPrompt}
         />
      </div>
   )
}
