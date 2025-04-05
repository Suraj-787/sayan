/**
 * This script seeds the MongoDB database with initial data for schemes and FAQs.
 * 
 * To run this script:
 * 1. Make sure you have set up your MongoDB environment variables
 * 2. Run: npx tsx scripts/seed-database.ts
 */

import { seedDatabase } from '../lib/mongoose-utils'

async function main() {
  console.log('Starting database seeding process...')
  
  try {
    const result = await seedDatabase()
    
    if (result) {
      console.log('✅ Database seeded successfully!')
    } else {
      console.error('❌ Failed to seed database')
      process.exit(1)
    }
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

main() 