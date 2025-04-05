import { NextRequest, NextResponse } from 'next/server';
import { getAllFAQs } from '@/lib/mongoose-utils';

export async function GET(req: NextRequest) {
  try {
    const faqs = await getAllFAQs();
    return NextResponse.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
} 