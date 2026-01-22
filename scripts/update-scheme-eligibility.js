// Script to update schemes with specific eligibility criteria
// This makes the eligibility form filtering actually useful

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sayan';

// Schemes that should be women-specific
const WOMEN_SCHEMES = [
    'Pradhan Mantri Matru Vandana Yojana',
    'Beti Bachao Beti Padhao',
    'Pradhan Mantri Ujjwala Yojana',
    'Sukanya Samriddhi Yojana'
];

// Schemes for students
const STUDENT_SCHEMES = [
    'National Scholarship Portal',
    'Post Matric Scholarship',
    'Pre Matric Scholarship'
];

// Schemes for SC/ST
const SC_ST_SCHEMES = [
    'Post Matric Scholarship for SC Students',
    'National Fellowship for SC Students',
    'Stand Up India Scheme'
];

// Schemes for senior citizens (60+)
const SENIOR_SCHEMES = [
    'Pradhan Mantri Vaya Vandana Yojana',
    'Senior Citizen Savings Scheme'
];

// Schemes for BPL families
const BPL_SCHEMES = [
    'Pradhan Mantri Ujjwala Yojana',
    'Pradhan Mantri Awas Yojana',
    'Ayushman Bharat'
];

async function updateSchemes() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db();
        const schemes = db.collection('schemes');

        // Update women-specific schemes
        for (const title of WOMEN_SCHEMES) {
            const result = await schemes.updateMany(
                { title: { $regex: title, $options: 'i' } },
                {
                    $set: {
                        gender: ['Female'],
                        updated_at: new Date()
                    }
                }
            );
            console.log(`Updated ${result.modifiedCount} schemes for: ${title}`);
        }

        // Update student schemes
        for (const title of STUDENT_SCHEMES) {
            const result = await schemes.updateMany(
                { title: { $regex: title, $options: 'i' } },
                {
                    $set: {
                        student: 'Yes',
                        updated_at: new Date()
                    }
                }
            );
            console.log(`Updated ${result.modifiedCount} student schemes for: ${title}`);
        }

        // Update SC/ST schemes
        for (const title of SC_ST_SCHEMES) {
            const result = await schemes.updateMany(
                { title: { $regex: title, $options: 'i' } },
                {
                    $set: {
                        social_category: ['SC', 'ST'],
                        updated_at: new Date()
                    }
                }
            );
            console.log(`Updated ${result.modifiedCount} SC/ST schemes for: ${title}`);
        }

        // Update senior citizen schemes
        for (const title of SENIOR_SCHEMES) {
            const result = await schemes.updateMany(
                { title: { $regex: title, $options: 'i' } },
                {
                    $set: {
                        min_age: 60,
                        max_age: 999,
                        updated_at: new Date()
                    }
                }
            );
            console.log(`Updated ${result.modifiedCount} senior schemes for: ${title}`);
        }

        // Update BPL schemes
        for (const title of BPL_SCHEMES) {
            const result = await schemes.updateMany(
                { title: { $regex: title, $options: 'i' } },
                {
                    $set: {
                        bpl: 'Yes',
                        updated_at: new Date()
                    }
                }
            );
            console.log(`Updated ${result.modifiedCount} BPL schemes for: ${title}`);
        }

        // Get counts
        const totalSchemes = await schemes.countDocuments();
        const femaleSchemes = await schemes.countDocuments({ gender: ['Female'] });
        const studentSchemes = await schemes.countDocuments({ student: 'Yes' });
        const scStSchemes = await schemes.countDocuments({ social_category: { $in: ['SC', 'ST'] } });
        const bplSchemes = await schemes.countDocuments({ bpl: 'Yes' });

        console.log('\n=== Summary ===');
        console.log(`Total schemes: ${totalSchemes}`);
        console.log(`Female-specific schemes: ${femaleSchemes}`);
        console.log(`Student schemes: ${studentSchemes}`);
        console.log(`SC/ST schemes: ${scStSchemes}`);
        console.log(`BPL schemes: ${bplSchemes}`);

    } catch (error) {
        console.error('Error updating schemes:', error);
    } finally {
        await client.close();
        console.log('\nDisconnected from MongoDB');
    }
}

updateSchemes();
