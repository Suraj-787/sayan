/**
 * This script seeds the Supabase database with initial data for schemes and FAQs.
 * It uses direct REST API calls to avoid Node.js fetch issues.
 * 
 * To run this script:
 * npx tsx scripts/seed-database-rest.ts
 */

import { schemes, faqs } from '../lib/seed-data'
import 'cross-fetch/polyfill'

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

async function makePostRequest(endpoint: string, data: any) {
  try {
    const response = await fetch(`${supabaseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Server responded with status ${response.status}: ${JSON.stringify(errorData)}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error making POST request to ${endpoint}:`, error)
    throw error
  }
}

async function seedScheme(scheme: any) {
  try {
    const result = await makePostRequest('/rest/v1/schemes', scheme)
    console.log(`Successfully inserted scheme: ${scheme.title}`)
    return result
  } catch (error) {
    console.error(`Failed to insert scheme ${scheme.title}:`, error)
    return null
  }
}

async function seedFaq(faq: any) {
  try {
    const result = await makePostRequest('/rest/v1/faqs', faq)
    console.log(`Successfully inserted FAQ: ${faq.question.substring(0, 30)}...`)
    return result
  } catch (error) {
    console.error(`Failed to insert FAQ ${faq.question.substring(0, 30)}...`, error)
    return null
  }
}

async function main() {
  console.log('Starting database seeding process...')
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase URL or key is missing. Check your environment variables.')
    process.exit(1)
  }
  
  try {
    // Seed schemes
    console.log('Seeding schemes...')
    for (const scheme of schemes) {
      await seedScheme(scheme)
    }
    
    // Seed FAQs
    console.log('Seeding FAQs...')
    for (const faq of faqs) {
      await seedFaq(faq)
    }
    
    console.log('✅ Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

// Run the script
main() 