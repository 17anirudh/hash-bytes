import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Check, Copy } from "lucide-react"

export default function Clipboard({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="my-4">
      <div className="relative p-3 leading-7 [&:not(:first-child)]:mt-6 font-mono [overflow-wrap:anywhere] whitespace-pre-wrap border-2 border-neutral-400 dark:border-neutral-800">
        {value}
        <Button
          size="icon"
          variant="ghost"
          onClick={copyToClipboard}
          className="absolute top-2 right-2 dark:text-zinc-400 dark:hover:text-zinc-100 text-zinc-900 hover:text-zinc-950"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </Button>
      </div>
    </div>
  )
}
