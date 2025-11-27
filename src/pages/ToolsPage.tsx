import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { TOOLS } from '@/data/tools'

export default function ToolsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">PS Tools</h1>
        <p className="text-sm text-muted-foreground">Explore our collection of powerful tools</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map(tool => (
          <Card key={tool.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{tool.name}</CardTitle>
              <CardDescription>{tool.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={`/tools/${tool.id}`}>
                <Button className="w-full">View Details</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
