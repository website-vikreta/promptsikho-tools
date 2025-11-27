import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Promptsikho Tools</CardTitle>
          <CardDescription>React 19 + Vite + TypeScript + Tailwind + shadcn/ui</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full">Get Started</Button>
          <Button variant="outline" className="w-full">Learn More</Button>
        </CardContent>
      </Card>
    </div>
  )
}
