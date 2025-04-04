import { NextRequest, NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/supabase-utils'

// This route should be protected in a real application
export async function POST(request: NextRequest) {
  try {
    const result = await seedDatabase()
    
    if (result) {
      return NextResponse.json({ success: true, message: 'Database seeded successfully' })
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to seed database' }, 
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { success: false, message: 'Error seeding database' }, 
      { status: 500 }
    )
  }
} 