import { NextRequest, NextResponse } from 'next/server';
import { getAllSchemes, getFilteredSchemes } from '@/lib/mongoose-utils';
import { IScheme } from '@/lib/mongoose-models';
import type { Scheme } from '@/types/scheme';

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
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');

    // New eligibility form parameters
    const gender = searchParams.get('gender');
    const age = searchParams.get('age');
    const state = searchParams.get('state');
    const residence = searchParams.get('residence');
    const socialCategory = searchParams.get('category');
    const differentlyAbled = searchParams.get('differently_abled');
    const minority = searchParams.get('minority');
    const student = searchParams.get('student');
    const bpl = searchParams.get('bpl');

    // Prepare filter object
    const filters: Record<string, string[] | string | number> = {};

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
    let schemes = hasFilters
      ? await getFilteredSchemes(filters)
      : await getAllSchemes();

    // Apply text search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      schemes = schemes.filter((scheme: any) =>
        scheme.title.toLowerCase().includes(searchLower) ||
        scheme.description.toLowerCase().includes(searchLower) ||
        scheme.category.toLowerCase().includes(searchLower) ||
        (scheme.tags && scheme.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Apply eligibility form filters (client-side filtering)

    if (gender) {
      schemes = schemes.filter((scheme: any) => {
        if (!scheme.gender || scheme.gender.length === 0) return true;
        // SMART FILTERING: Exclude schemes with ONLY "All", include specific matches
        const hasOnlyAll = scheme.gender.length === 1 && scheme.gender[0] === 'All';
        if (hasOnlyAll) return false; // Hide universal schemes when filtering
        return scheme.gender.includes(gender);
      });
    }

    if (age) {
      // Parse age range from form (e.g., "18-25")
      const [minAge, maxAge] = age.includes('+')
        ? [parseInt(age), 999]
        : age.split('-').map(a => parseInt(a));

      schemes = schemes.filter((scheme: any) => {
        if (!scheme.min_age && !scheme.max_age) return true;
        const schemeMin = scheme.min_age || 0;
        const schemeMax = scheme.max_age || 999;
        // Check if there's any overlap between user age range and scheme age range
        return !(maxAge < schemeMin || minAge > schemeMax);
      });
    }

    if (state) {
      schemes = schemes.filter((scheme: any) => {
        if (!scheme.state || scheme.state.length === 0) return true;
        // INCLUSIVE: Show schemes for selected state OR "All India"
        return scheme.state.includes(state) || scheme.state.includes('All India');
      });
    }

    if (residence) {
      schemes = schemes.filter((scheme: any) => {
        if (!scheme.residence_area || scheme.residence_area.length === 0) return true;
        // INCLUSIVE: Show schemes for selected residence OR "Both"
        return scheme.residence_area.includes(residence) || scheme.residence_area.includes('Both');
      });
    }

    if (socialCategory) {
      const categories = socialCategory.split(',');
      schemes = schemes.filter((scheme: any) => {
        if (!scheme.social_category || scheme.social_category.length === 0) return true;
        // INCLUSIVE: Show schemes for selected categories OR "All"
        return categories.some(cat => scheme.social_category.includes(cat)) || scheme.social_category.includes('All');
      });
    }

    if (differentlyAbled === 'Yes') {
      schemes = schemes.filter((scheme: any) => {
        if (!scheme.differently_abled) return true;
        // INCLUSIVE: Show schemes for differently abled OR "Both"
        return scheme.differently_abled === 'Yes' || scheme.differently_abled === 'Both';
      });
    }

    if (minority === 'Yes') {
      schemes = schemes.filter((scheme: any) => {
        if (!scheme.minority) return true;
        // INCLUSIVE: Show schemes for minorities OR "Both"
        return scheme.minority === 'Yes' || scheme.minority === 'Both';
      });
    }

    if (student === 'Yes') {
      schemes = schemes.filter((scheme: any) => {
        if (!scheme.student) return true;
        // INCLUSIVE: Show schemes for students OR "Both"
        return scheme.student === 'Yes' || scheme.student === 'Both';
      });
    }

    if (bpl === 'Yes') {
      schemes = schemes.filter((scheme: any) => {
        if (!scheme.bpl) return true;
        // STRICT: Only "Yes", exclude "Both"
        return scheme.bpl === 'Yes';
      });
    }


    // Apply limit if provided
    if (limit) {
      const limitNum = parseInt(limit);
      schemes = schemes.slice(0, limitNum);
    }

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