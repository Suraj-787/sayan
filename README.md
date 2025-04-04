# Government Schemes App

A Next.js application for discovering and interacting with government schemes, powered by Supabase and Google Gemini AI.

## Features

- 🔍 Browse and search government schemes
- 💬 AI-powered chatbot using Google Gemini 2.0 Flash
- 🌐 Multilingual support with real-time translation
- 📋 Detailed scheme information and FAQs
- 🔖 Save and bookmark favorite schemes
- 🗣️ Voice assistant functionality

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **AI:** Google Gemini 2.0 Flash
- **Language:** TypeScript

## Database Model

The application uses Supabase with the following database tables:

- **schemes:** Government schemes information
- **faqs:** Frequently asked questions for each scheme
- **chats:** User chat sessions
- **messages:** Chat messages between users and the AI
- **bookmarks:** User bookmarks for schemes

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account
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

Edit `.env.local` and add your Supabase and Gemini API credentials.

4. Seed the database

```bash
pnpm seed
```

This will populate your Supabase database with sample schemes and FAQs.

5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Supabase Setup

1. Create a new Supabase project
2. Set up the following tables:

### schemes
- id (uuid, primary key)
- title (text)
- description (text)
- category (text)
- eligibility (text)
- benefits (text)
- application_process (text)
- documents (text[])
- deadline (text)
- website (text)
- created_at (timestamp with time zone)

### faqs
- id (uuid, primary key)
- scheme_id (uuid, foreign key to schemes.id)
- question (text)
- answer (text)
- created_at (timestamp with time zone)

### chats
- id (uuid, primary key)
- user_id (uuid, nullable)
- created_at (timestamp with time zone)

### messages
- id (uuid, primary key)
- chat_id (uuid, foreign key to chats.id)
- role (text, enum: 'user', 'assistant')
- content (text)
- created_at (timestamp with time zone)

### bookmarks
- id (uuid, primary key)
- user_id (uuid)
- scheme_id (uuid, foreign key to schemes.id)
- created_at (timestamp with time zone)

## Gemini AI Integration

The application uses Google Gemini 2.0 Flash for the chatbot functionality. The AI is integrated to provide context-aware responses about government schemes based on the database content.

To set up Gemini:

1. Get an API key from [Google AI Studio](https://makersuite.google.com/)
2. Add your API key to the `.env.local` file

## License

MIT 