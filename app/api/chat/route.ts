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

    // Generate optimized context from schemes (summary instead of full details)
    let context = ''
    if (schemes && schemes.length > 0) {
      // Provide concise scheme information to avoid overwhelming the context
      context = `Available Government Schemes (${schemes.length} total):\n\n`

      // Group schemes by category for better organization
      const schemesByCategory: { [key: string]: any[] } = {}
      schemes.forEach(scheme => {
        if (!schemesByCategory[scheme.category]) {
          schemesByCategory[scheme.category] = []
        }
        schemesByCategory[scheme.category].push(scheme)
      })

      // Add summary by category
      Object.entries(schemesByCategory).forEach(([category, categorySchemes]) => {
        context += `${category} (${categorySchemes.length} schemes):\n`
        categorySchemes.forEach(scheme => {
          context += `• ${scheme.title}\n`
        })
        context += '\n'
      })

      context += `\nFor detailed information about any specific scheme, I can provide:\n• Eligibility criteria\n• Benefits\n• Application process\n• Required documents\n• Deadlines\n• Official website`
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