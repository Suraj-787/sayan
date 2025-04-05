const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read the .env.local file
const envFile = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envFile, 'utf8');

// Parse the MongoDB URI
const match = envContent.match(/MONGODB_URI="([^"]+)"/);
if (!match) {
  console.error('Could not find MONGODB_URI in .env.local');
  process.exit(1);
}

const mongodbUri = match[1];

// Set the environment variable and run the seed script
console.log(`Using MongoDB URI: ${mongodbUri}`);
process.env.MONGODB_URI = mongodbUri;

try {
  console.log('Running seed script...');
  execSync('npx tsx scripts/seed-database.ts', { 
    stdio: 'inherit',
    env: { ...process.env, MONGODB_URI: mongodbUri }
  });
} catch (error) {
  console.error('Error running seed script:', error);
  process.exit(1);
} 