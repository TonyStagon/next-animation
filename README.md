# Dog Animation Project 🐕

An interactive Next.js application featuring a smooth, engaging dog animation that responds to user input. Built with modern web technologies and professional animation techniques.

## 🚀 How to Run Locally

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun

### Installation & Setup

1. **Clone and install dependencies:**

```bash
git clone <your-repo-url>
cd next-animation
npm install
```

2. **Set up environment variables:**

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Run the development server:**

```bash
npm run dev
```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠 Tech Stack & Architecture

### Frontend Stack

- **Next.js 14** - React framework with App Router for optimal performance
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable, accessible component library
- **GSAP** - Professional-grade animation library
- **Framer Motion** - Production-ready motion library

### Backend Stack

- **Supabase** - Backend-as-a-Service for database and authentication
- **PostgreSQL** - Robust relational database

### Why This Stack?

- **Next.js** provides excellent performance with server-side rendering and static generation
- **TypeScript** catches errors early and improves code maintainability
- **GSAP + Framer Motion** offer industry-standard animation capabilities
- **Supabase** eliminates backend complexity while providing real-time features
- **Tailwind + shadcn/ui** enable rapid, consistent UI development

## 🎬 Animation Approach & Smoothness

### Multi-Layer Animation System

**1. CSS Animations for Core Movements**

```css
/* Custom easing for natural motion */
animation: standUpSmooth 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
```

**2. GSAP for Complex Sequences**

```typescript
// Professional timeline sequencing
const tl = gsap.timeline();
tl.to("#head", { rotate: 4, duration: 1, ease: "power1.inOut" }).to(
  "#ears",
  { rotate: -2, duration: 1 },
  "<0.15"
);
```

**3. Promise-Based Orchestration**

```typescript
// Sequential animation flow
await wait(800); // Phase 1: Entrance
await mascotPromise; // Phase 2: Facial animation
await wait(1200); // Phase 3: Stand up
```

### Smoothness Techniques

- **Advanced Easing Curves**: Custom `cubic-bezier()` functions for natural motion
- **Squash & Stretch**: Traditional animation principles applied via CSS transforms
- **Performance Optimization**: Exclusive use of `transform` and `opacity` properties
- **Sequenced Timing**: Precise delays and durations for fluid transitions
- **Hardware Acceleration**: CSS transforms leverage GPU rendering

## 🔐 Backend & Secrets Management

### Backend Choice: Supabase

**Why Supabase?**

- **Real-time Capabilities**: Built-in WebSocket support for live updates
- **PostgreSQL Power**: Full SQL capabilities with modern tooling
- **Authentication**: Built-in auth with multiple providers
- **Edge Functions**: Serverless functions for custom business logic
- **Free Tier**: Generous free plan for prototyping

### Secrets Management

**Environment Variables Structure:**

```env
# Public variables (safe for frontend)
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_key

# Private variables (server-side only)
SUPABASE_SERVICE_ROLE_KEY=your_private_key
```

**Security Practices:**

- Public keys are safe for client-side use (limited permissions)
- Service role keys are kept server-side only
- `.env.local` is gitignored, `.env.example` provides template
- Environment validation at build time

## 🏗 Project Structure

```
next-animation/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui components
│   ├── MascotAnimation.tsx  # GSAP animation controller
│   └── MascotSVG.tsx   # Animated SVG component
├── lib/                # Utility functions and configurations
│   └── supabase.ts     # Supabase client configuration
├── public/             # Static assets
└── styles/             # Global styles and Tailwind config
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy to Vercel with environment variables configured
```

### Environment Setup for Production

1. Set environment variables in your hosting platform
2. Configure CORS in Supabase dashboard
3. Update allowed origins for your domain

## 📈 Performance Features

- **Static Export**: `output: 'export'` in Next.js config
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic chunk splitting for faster loads
- **Tree Shaking**: Unused code elimination in production builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning and development.
