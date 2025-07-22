import { NextRequest, NextResponse } from 'next/server';
import { getAllSchemes, getFilteredSchemes } from '@/lib/mongoose-utils';
import { IScheme } from '@/lib/mongoose-models';

export async function GET(req: NextRequest) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(req.url);
    
    // Extract filter parameters
    const category = searchParams.get('category');
    const eligibility = searchParams.get('eligibility');
    const scheme_types = searchParams.get('scheme_types');
    const income_level = searchParams.get('income_level');
    const min_age = searchParams.get('min_age');
    const max_age = searchParams.get('max_age');
    const location = searchParams.get('location');
    
    // Prepare filter object
    const filters: any = {};
    
    if (category) {
      filters.categories = category.split(',');
    }
    
    if (eligibility) {
      filters.eligibility = eligibility.split(',');
    }
    
    if (scheme_types) {
      filters.scheme_types = scheme_types.split(',');
    }
    
    if (income_level && income_level !== 'any') {
      filters.income_level = income_level;
    }
    
    if (min_age) {
      filters.min_age = parseInt(min_age);
    }
    
    if (max_age) {
      filters.max_age = parseInt(max_age);
    }
    
    if (location && location !== 'any') {
      filters.location = location;
    }
    
    // Get filtered schemes or all schemes if no filters
    const hasFilters = Object.keys(filters).length > 0;
    const schemes = hasFilters 
      ? await getFilteredSchemes(filters)
      : await getAllSchemes();
    
    // Convert MongoDB documents to plain objects with properly serialized _id
    const serializedSchemes = schemes.map((scheme: any) => ({
      ...scheme,
      _id: scheme._id.toString(),
      created_at: scheme.created_at.toISOString(),
    }));
    
    return NextResponse.json(serializedSchemes);
  } catch (error) {
    console.error('Error fetching schemes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schemes' },
      { status: 500 }
    );
  }
} 