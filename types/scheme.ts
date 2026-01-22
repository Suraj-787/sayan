// Type definitions for Scheme data structure
export interface Scheme {
    _id: string;
    title: string;
    description: string;
    category: string;
    eligibility: string;
    benefits: string;
    application_process: string;
    documents_required: string[];
    official_website: string;
    tags: string[];
    gender?: string[];
    min_age?: number;
    max_age?: number;
    state?: string[];
    residence_area?: string[];
    social_category?: string[];
    differently_abled?: string;
    minority?: string;
    student?: string;
    bpl?: string;
    created_at: string;
    updated_at?: string;
}

export interface SchemeFilters {
    category?: string;
    eligibility?: string;
    search?: string;
    limit?: string;
    gender?: string;
    age?: string;
    state?: string;
    residence?: string;
    socialCategory?: string;
    differentlyAbled?: string;
    minority?: string;
    student?: string;
    bpl?: string;
}
