-- Create schemes table
CREATE TABLE IF NOT EXISTS schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  benefits TEXT NOT NULL,
  application_process TEXT NOT NULL,
  documents TEXT[] NOT NULL,
  deadline TEXT NOT NULL,
  website TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id UUID NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  scheme_id UUID NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, scheme_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_faqs_scheme_id ON faqs(scheme_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_scheme_id ON bookmarks(scheme_id);

-- Enable Row Level Security
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to schemes and FAQs
CREATE POLICY "Allow public read access to schemes" 
  ON schemes FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access to FAQs" 
  ON faqs FOR SELECT 
  USING (true);

-- Create policies for chat management
CREATE POLICY "Allow users to manage their own chats"
  ON chats FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow users to manage their own messages"
  ON messages FOR ALL
  USING (
    chat_id IN (
      SELECT id FROM chats WHERE auth.uid() = user_id OR user_id IS NULL
    )
  );

-- Create policies for bookmark management
CREATE POLICY "Allow users to manage their own bookmarks"
  ON bookmarks FOR ALL
  USING (auth.uid() = user_id); 