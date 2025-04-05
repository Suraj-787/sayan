import { NextRequest, NextResponse } from 'next/server'
import { searchSchemesOnline, getSchemeDetails } from '@/lib/web-scraper'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, options } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Search for schemes based on the query
    const schemes = await searchSchemesOnline(query, options)

    return NextResponse.json({ schemes })
  } catch (error) {
    console.error('Error searching schemes:', error)
    return NextResponse.json(
      { error: 'Failed to search for schemes' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the scheme title from the URL parameter
    const { searchParams } = new URL(request.url)
    const schemeTitle = searchParams.get('title')

    if (!schemeTitle) {
      return NextResponse.json(
        { error: 'Scheme title is required' },
        { status: 400 }
      )
    }

    // Get detailed information about the scheme
    const schemeDetails = await getSchemeDetails(schemeTitle)

    if (!schemeDetails) {
      return NextResponse.json(
        { error: 'Scheme not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ scheme: schemeDetails })
  } catch (error) {
    console.error('Error getting scheme details:', error)
    return NextResponse.json(
      { error: 'Failed to get scheme details' },
      { status: 500 }
    )
  }
} 