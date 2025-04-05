import { NextResponse } from 'next/server';
import { getAllSchemes } from '@/lib/mongoose-utils';
import { IScheme } from '@/lib/mongoose-models';

export async function GET() {
  try {
    const schemes = await getAllSchemes();
    
    // Convert MongoDB documents to plain objects with properly serialized _id
    const serializedSchemes = schemes.map((scheme: any) => ({
      ...scheme,
      _id: scheme._id.toString(),
      created_at: scheme.created_at.toISOString(),
    }));
    
    return NextResponse.json(serializedSchemes);
  } catch (error) {
    console.error('Error in GET /api/schemes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schemes' },
      { status: 500 }
    );
  }
} 