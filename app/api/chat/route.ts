import { NextRequest, NextResponse } from 'next/server'
import { generateChatResponse } from '@/lib/gemini'
import { getAllSchemes } from '@/lib/mongoose-utils'

export async function POST(request: NextRequest) {
  try {
    const { messages, query } = await request.json()

    if (!query || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request body' }, 
        { status: 400 }
      )
    }

    // Get all schemes to provide as context
    const schemes = await getAllSchemes()
    
    // Generate context from schemes
    let context = ''
    if (schemes && schemes.length > 0) {
      // Format scheme information as context
      context = schemes.map(scheme => `
Scheme: ${scheme.title}
Category: ${scheme.category}
Description: ${scheme.description}
Eligibility: ${scheme.eligibility}
Benefits: ${scheme.benefits}
Application Process: ${scheme.application_process}
`).join('\n\n')
    }

    // Generate response from Gemini
    const response = await generateChatResponse(messages, query, context)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    )
  }
} 