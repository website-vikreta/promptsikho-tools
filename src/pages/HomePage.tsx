
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[70vh] px-4">

      <div className="max-w-3xl space-y-6">

        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight">
            Prompt<span className="font-semibold">Sikho</span>
          </h1>

          <p className="text-lg text-muted-foreground">
            Transform raw ideas, screenshots, and feature requirements
            into production-ready AI prompts for GitHub Copilot,
            ChatGPT, Claude, and more.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          
          <Link to="/tools">
            <Button size="lg">
              Explore Tools
            </Button>
          </Link>

          <Button variant="outline" size="lg">
            Learn More
          </Button>

        </div>

      </div>

    </div>
  )
}