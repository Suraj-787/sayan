import { NextRequest, NextResponse } from 'next/server'
import { generateChatResponse } from '@/lib/gemini'

// Sample schemes data (since MongoDB is no longer used)
interface Scheme {
  title: string;
  category: string;
  description: string;
  eligibility: string;
  benefits: string;
  application_process: string;
}

const sampleSchemes: Scheme[] = [
  {
    title: "PM Kisan Samman Nidhi",
    category: "Agriculture",
    description: "Financial benefit to all land holding farmers' families in the country",
    eligibility: "All landholding farmers' families, subject to exclusions",
    benefits: "₹6,000 per year in three equal installments",
    application_process: "Apply online through the PM-KISAN portal or through Common Service Centers"
  },
  {
    title: "Ayushman Bharat",
    category: "Health",
    description: "Health insurance scheme for poor and vulnerable families",
    eligibility: "Poor and vulnerable families as per SECC database",
    benefits: "Health coverage up to ₹5 lakh per family per year",
    application_process: "Apply at Ayushman Bharat Kendra or government hospitals"
  }
];

export async function POST(request: NextRequest) {
  try {
    const { messages, query } = await request.json()

    if (!query || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request body' }, 
        { status: 400 }
      )
    }
    
    // Generate context from sample schemes
    let context = '';
    if (sampleSchemes && sampleSchemes.length > 0) {
      // Format scheme information as context
      context = sampleSchemes.map(scheme => `
Scheme: ${scheme.title}
Category: ${scheme.category}
Description: ${scheme.description}
Eligibility: ${scheme.eligibility}
Benefits: ${scheme.benefits}
Application Process: ${scheme.application_process}
`).join('\n\n');
    }

    // Add instruction to offer web scraping if no suitable schemes are found
    context += `\n\nIMPORTANT INSTRUCTION: If the user asks about a scheme or specific criteria that doesn't match the available schemes above, DO NOT just say you don't have information. Instead, offer to search for more schemes online by saying: "I don't have information about this specific scheme in my current database. Would you like me to search for more information online about [specific scheme or user's requirements]?"`

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