const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
async function connectToDatabase() {
  try {
    const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const mongoose = require('mongoose');
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
        console.error('MONGODB_URI environment variable is not set');
        process.exit(1);
    }
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Define Mongoose Schemas (simplified version)
const SchemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  eligibility: { type: String, required: true },
  benefits: { type: String, required: true },
  application_process: { type: String, required: true },
  documents: { type: [String], required: true },
  deadline: { type: String, required: true },
  website: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const FAQSchema = new mongoose.Schema({
  scheme_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

// Create models
const SchemeModel = mongoose.models.Scheme || mongoose.model('Scheme', SchemeSchema);
const FAQModel = mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);

// Load the new schemes data
const newSchemesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../lib/new-schemes-data.json'), 'utf8')
);

async function addNewSchemesToDatabase() {
  try {
    console.log('🔗 Connecting to database...');
    await connectToDatabase();
    
    console.log('📊 Checking existing schemes...');
    const existingSchemes = await SchemeModel.find({});
    console.log(`Found ${existingSchemes.length} existing schemes in database`);
    
    // Filter out schemes that already exist (by title)
    const existingTitles = existingSchemes.map(scheme => scheme.title.toLowerCase());
    const newSchemes = newSchemesData.schemes.filter(scheme => 
      !existingTitles.includes(scheme.title.toLowerCase())
    );
    
    console.log(`🆕 Found ${newSchemes.length} new schemes to add`);
    
    if (newSchemes.length === 0) {
      console.log('✅ No new schemes to add. Database is up to date!');
      return;
    }
    
    // Prepare schemes for database insertion
    const schemesToInsert = newSchemes.map(scheme => ({
      title: scheme.title,
      description: scheme.description,
      category: scheme.category,
      eligibility: scheme.eligibility,
      benefits: scheme.benefits,
      application_process: scheme.application_process,
      documents: scheme.documents,
      deadline: scheme.deadline,
      website: scheme.website,
      created_at: new Date()
    }));
    
    console.log('💾 Inserting new schemes into database...');
    const insertedSchemes = await SchemeModel.insertMany(schemesToInsert);
    
    console.log(`✅ Successfully added ${insertedSchemes.length} new schemes!`);
    
    // Create some sample FAQs for the new schemes
    console.log('❓ Adding sample FAQs for new schemes...');
    const sampleFAQs = [];
    
    insertedSchemes.forEach(scheme => {
      // Add 2-3 FAQs per scheme
      const faqs = [
        {
          scheme_id: scheme._id,
          question: `Who is eligible for ${scheme.title}?`,
          answer: scheme.eligibility,
          created_at: new Date()
        },
        {
          scheme_id: scheme._id,
          question: `What are the benefits of ${scheme.title}?`,
          answer: scheme.benefits,
          created_at: new Date()
        },
        {
          scheme_id: scheme._id,
          question: `How to apply for ${scheme.title}?`,
          answer: scheme.application_process,
          created_at: new Date()
        }
      ];
      sampleFAQs.push(...faqs);
    });
    
    const insertedFAQs = await FAQModel.insertMany(sampleFAQs);
    console.log(`✅ Successfully added ${insertedFAQs.length} FAQs for new schemes!`);
    
    // Summary by category
    console.log('\n📈 Summary of added schemes by category:');
    const categoryCount = {};
    insertedSchemes.forEach(scheme => {
      categoryCount[scheme.category] = (categoryCount[scheme.category] || 0) + 1;
    });
    
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} schemes`);
    });
    
    console.log('\n🎉 Database update completed successfully!');
    console.log(`Total schemes in database: ${existingSchemes.length + insertedSchemes.length}`);
    
  } catch (error) {
    console.error('❌ Error adding schemes to database:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Run the script
addNewSchemesToDatabase();
