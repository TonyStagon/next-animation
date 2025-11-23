# Dog Treat Landing Page - Setup Instructions

A beautiful landing page with smooth dog animations that collects emails and saves them to Supabase.

## Features

- Email collection with validation
- Smooth, Duolingo-quality animations using SVG assets
- Responsive design for mobile and desktop
- Supabase backend for data persistence
- Row Level Security (RLS) enabled

## Animation Sequence

1. Dog appears with a smooth fade-in
2. Dog's tongue sticks out (receiving treat)
3. Dog sits down
4. Dog wags excitedly
5. Dog returns to standing idle pose

## Setup Instructions

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Settings** → **API**
3. Copy your:
   - Project URL (looks like `https://xxxxx.supabase.co`)
   - Anon/Public key (starts with `eyJ...`)

### 2. Configure Environment Variables

Update `.env.local` with your actual Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Create the Database Table

Run this SQL in your Supabase SQL Editor (Dashboard → SQL Editor):

```sql
CREATE TABLE IF NOT EXISTS emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit email"
  ON emails
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

### 4. Run the Project

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: CSS transitions and keyframes with SVG assets
- **Backend**: Supabase (PostgreSQL with RLS)
- **Type Safety**: TypeScript

## Animation Implementation

The animation uses CSS transitions and class-based state management for smooth, performant animations:

- Opacity transitions for seamless state changes
- CSS keyframe animations for the tail wag
- Proper timing with async/await for sequenced animations
- Transform-based scaling for smooth entrance

## Security

- Row Level Security (RLS) enabled on the emails table
- Only INSERT operations allowed for anonymous users
- Email validation on both client and server
- No read access to prevent data scraping
