import * as React from 'react'
import { Button } from '@/components/ui/button'

interface CopyButtonProps {
  text: string
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // noop
    }
  }

  return (
    <Button size="sm" variant="outline" onClick={handleCopy} className="gap-2">
      <i className={copied ? 'bi bi-check-lg' : 'bi bi-clipboard'} />
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </Button>
  )
}

export default CopyButton
