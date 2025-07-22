# Sayan - Government Schemes Discovery Platform

A comprehensive Next.js application for discovering and interacting with government schemes in India, powered by MongoDB and Google Gemini AI.

## ✨ Features

- 🔍 **Smart Search & Filtering:** Advanced filtering by category, eligibility, location, income level, and more
- 💬 **AI-Powered Chatbot:** Interactive assistance using Google Gemini 2.0 Flash
- 🌐 **Multilingual Support:** Real-time translation powered by Sarvam AI
- 📋 **Detailed Scheme Information:** Comprehensive details, eligibility criteria, and application process
- 🎯 **Personalized Preferences:** Save user preferences and apply as filters automatically
- 🔐 **User Authentication:** Secure login/registration with JWT
- 📱 **Responsive Design:** Works seamlessly on desktop and mobile devices
- 🗣️ **Voice Assistant:** Voice interactions powered by Sarvam AI (In Development)

## 🚀 Tech Stack

- **Frontend:** Next.js 15.2.4, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, MongoDB with Mongoose
- **AI Integration:** Google Gemini 2.0 Flash, Sarvam AI
- **Authentication:** JWT with HTTP-only cookies
- **UI Components:** Radix UI, Lucide Icons, Sonner Toasts

## 📊 Database Schema

The application uses MongoDB with the following collections:

### Schemes Collection
```typescript
{
  title: string;
  description: string;
  category: string;
  eligibility: string;
  benefits: string;
  application_process: string;
  documents: string[];
  deadline: string;
  website: string;
  created_at: string;
}
```

### Users Collection  
```typescript
{
  name: string;
  email: string;
  password: string; // hashed
  preferences: {
    categories: string[];
    eligibility: string[];
    scheme_types: string[];
    income_level?: string;
    min_age?: number;
    max_age?: number;
    location?: string;
    occupation?: string;
  };
  created_at: Date;
}
```

### Other Collections
- **faqs:** Frequently asked questions for schemes
- **chats:** User chat sessions with AI
- **messages:** Individual chat messages

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm (recommended)
- MongoDB Atlas account or local MongoDB instance
- Google Gemini API key
- Sarvam AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Suraj-787/sayan.git
   cd sayan
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup**
   
   Copy the example environment file and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your actual values:
   ```bash
   # Google Gemini AI configuration
   NEXT_PUBLIC_GEMINI_API_KEY="your-gemini-api-key-here"

   # MongoDB configuration  
   MONGODB_URI="your-mongodb-connection-string-here"

   # JWT Secret for authentication
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

   # Sarvam API for translation services
   NEXT_PUBLIC_SARVAM_API_KEY="your-sarvam-api-key-here"
   ```

4. **Database Setup**
   
   Seed the database with initial schemes data:
   ```bash
   pnpm run seed
   # or
   npm run seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   # or  
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🔑 API Keys Setup

### Google Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` as `NEXT_PUBLIC_GEMINI_API_KEY`

### Sarvam AI API  
1. Visit [Sarvam AI Dashboard](https://dashboard.sarvam.ai/)
2. Get your API subscription key
3. Add it to your `.env.local` as `NEXT_PUBLIC_SARVAM_API_KEY`

### MongoDB Setup
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Add it to your `.env.local` as `MONGODB_URI`

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (pages)/           # Page components
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── chatbot/          # AI chatbot components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configs
├── scripts/              # Database scripts
└── types/                # TypeScript type definitions
```

```bash
pnpm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your MongoDB, Gemini API, and Sarvam API credentials.

```
# Add these to your .env.local file
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SARVAM_API_KEY=your_sarvam_api_key
```

4. Initialize and seed the database

```bash
pnpm run db:init
```

This will set up your MongoDB database with sample schemes and FAQs.

5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## MongoDB Setup

This application uses MongoDB as the database. Follow these steps to set up MongoDB:

1. Make sure you have MongoDB installed locally or have access to a MongoDB instance
2. Set the MongoDB connection string in `.env.local`:
   ```
   MONGODB_URI="mongodb://localhost:27017/sayan"
   ```
3. Initialize the database with required collections and indexes:
   ```
   pnpm run db:init
   ```

## Sarvam AI Integration

The application uses Sarvam AI for voice features including speech-to-text for the chatbot. To enable the voice features:

1. Get your Sarvam AI API subscription key from [Sarvam AI Dashboard](https://dashboard.sarvam.ai/admin)
2. Add your API key to the `.env.local` file as `NEXT_PUBLIC_SARVAM_API_KEY`

The Sarvam integration provides:
- Speech-to-text conversion for voice input
- Automatic language detection from speech
- Support for multiple Indian languages

## Gemini AI Integration

The application uses Google Gemini 2.0 Flash for the chatbot functionality. The AI is integrated to provide context-aware responses about government schemes based on the database content.

To set up Gemini:

1. Get an API key from [Google AI Studio](https://makersuite.google.com/)
2. Add your API key to the `.env.local` file

## API Routes

The application provides the following API routes:

- **/api/chat** - POST endpoint for generating AI responses about schemes
- **/api/seed** - POST endpoint for seeding the database (development only)

## License

MIT 