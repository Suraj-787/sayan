const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'sayan';

async function addSchemesToDatabase() {
    if (!MONGODB_URI) {
        console.error('Error: MONGODB_URI not found in environment variables');
        process.exit(1);
    }

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(DB_NAME);
        const schemesCollection = db.collection('schemes');

        // Load scheme data files
        const rausSchemes = JSON.parse(fs.readFileSync('lib/raus-schemes-data.json', 'utf8'));
        const msmeSchemes = JSON.parse(fs.readFileSync('lib/msme-schemes-data.json', 'utf8'));
        const additionalSchemes = JSON.parse(fs.readFileSync('lib/additional-schemes-data.json', 'utf8'));

        const allSchemes = [...rausSchemes, ...msmeSchemes, ...additionalSchemes];

        console.log(`\nTotal schemes to add: ${allSchemes.length}`);
        console.log('- Raus Pre-Compass schemes: ' + rausSchemes.length);
        console.log('- MSME schemes: ' + msmeSchemes.length);
        console.log('- Additional active schemes: ' + additionalSchemes.length);

        let addedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const scheme of allSchemes) {
            try {
                // Check if scheme already exists by title
                const existing = await schemesCollection.findOne({ title: scheme.title });

                if (existing) {
                    console.log(`⏭️  Skipped (already exists): ${scheme.title}`);
                    skippedCount++;
                    continue;
                }

                // Add created_at timestamp
                const schemeWithDate = {
                    ...scheme,
                    created_at: new Date()
                };

                // Insert scheme
                const result = await schemesCollection.insertOne(schemeWithDate);

                if (result.acknowledged) {
                    console.log(`✅ Added: ${scheme.title}`);
                    addedCount++;
                }
            } catch (error) {
                console.error(`❌ Error adding ${scheme.title}:`, error.message);
                errorCount++;
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log('SUMMARY');
        console.log('='.repeat(80));
        console.log(`✅ Successfully added: ${addedCount} schemes`);
        console.log(`⏭️  Skipped (duplicates): ${skippedCount} schemes`);
        console.log(`❌ Errors: ${errorCount} schemes`);
        console.log(`📊 Total in database: ${await schemesCollection.countDocuments()} schemes`);
        console.log('='.repeat(80));

    } catch (error) {
        console.error('Database error:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('\nDatabase connection closed');
    }
}

// Run the script
addSchemesToDatabase();
