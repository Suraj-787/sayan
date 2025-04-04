/**
 * This script verifies if data was correctly inserted into the Supabase database.
 * 
 * To run this script:
 * npx tsx scripts/verify-data.ts
 */

import { supabase } from '../lib/supabase'
import 'cross-fetch/polyfill'

async function main() {
  console.log('Verifying database data...')
  
  try {
    // Check schemes
    const { data: schemes, error: schemesError } = await supabase
      .from('schemes')
      .select('*')
    
    if (schemesError) {
      console.error('Error fetching schemes:', schemesError)
      process.exit(1)
    }
    
    console.log(`Found ${schemes?.length || 0} schemes in the database`)
    
    if (schemes && schemes.length > 0) {
      console.log('Sample scheme:', {
        id: schemes[0].id,
        title: schemes[0].title,
        category: schemes[0].category
      })
    }
    
    // Check FAQs
    const { data: faqs, error: faqsError } = await supabase
      .from('faqs')
      .select('*')
    
    if (faqsError) {
      console.error('Error fetching FAQs:', faqsError)
      process.exit(1)
    }
    
    console.log(`Found ${faqs?.length || 0} FAQs in the database`)
    
    if (faqs && faqs.length > 0) {
      console.log('Sample FAQ:', {
        id: faqs[0].id,
        question: faqs[0].question,
        scheme_id: faqs[0].scheme_id
      })
    }
    
    console.log('\n✅ Database verification complete!')
  } catch (error) {
    console.error('Error verifying database:', error)
    process.exit(1)
  }
}

main() 