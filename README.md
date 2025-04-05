# Government Schemes App

A Next.js application for discovering and interacting with government schemes, powered by MongoDB and Google Gemini AI.

## Features

- 🔍 Browse and search government schemes
- 💬 AI-powered chatbot using Google Gemini 2.0 Flash
- 🌐 Multilingual support with real-time translation
- 📋 Detailed scheme information and FAQs
- 🔖 Save and bookmark favorite schemes
- 🗣️ Voice assistant functionality

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** MongoDB (Database)
- **AI:** Google Gemini 2.0 Flash
- **Language:** TypeScript

## Database Model

The application uses MongoDB with the following collections:

- **schemes:** Government schemes information
- **faqs:** Frequently asked questions for each scheme
- **chats:** User chat sessions
- **messages:** Chat messages between users and the AI
- **bookmarks:** User bookmarks for schemes

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- MongoDB (local or remote)
- Google Gemini API key

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/gov-schemes-app.git
cd gov-schemes-app
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your MongoDB and Gemini API credentials.

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

## Database Structure

The application uses the following MongoDB collections:

- **schemes** - Government schemes/programs information
- **faqs** - Frequently asked questions for each scheme
- **chats** - User chat sessions
- **messages** - Individual messages within chat sessions
- **bookmarks** - User bookmarks for schemes

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