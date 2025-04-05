"use client"

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // Use client-side only rendering to avoid hydration issues
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Show a simple placeholder during server render and hydration
  if (!isMounted) {
    return <div className={cn("prose prose-sm max-w-none dark:prose-invert break-words", className)}>
      {content}
    </div>
  }
  
  return (
    <div className={cn("prose prose-sm max-w-none dark:prose-invert break-words", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Root component wrapper
          root: ({ node, ...props }) => <div {...props} />,
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold mt-4 mb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-bold mt-3 mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-md font-bold mt-3 mb-1" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-2" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="pl-4 list-disc mb-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="pl-4 list-decimal mb-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mb-1" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-primary hover:underline" {...props} />
          ),
          code: ({ node, inline, ...props }) => (
            inline ? 
              <code className="px-1 py-0.5 bg-muted rounded text-xs" {...props} /> :
              <code className="block bg-muted p-2 rounded-md my-2 text-xs overflow-x-auto" {...props} />
          ),
          pre: ({ node, ...props }) => (
            <pre className="bg-muted rounded-md p-2 my-2 overflow-x-auto text-xs" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-muted pl-4 my-2 text-muted-foreground" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-4 border-muted" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-muted my-2 text-sm" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-muted" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-muted" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-3 py-2 whitespace-nowrap" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
} 