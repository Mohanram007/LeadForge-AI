# LeadForge AI 🚀

> **Find businesses that need AI services — in minutes.**

LeadForge AI is a complete SaaS MVP for freelancers, agencies, and AI automation consultants. It discovers local businesses, analyzes their websites, scores AI opportunities, and generates personalized cold outreach emails.

---

## Features

- 🔍 **Business Discovery** — Search local businesses by category + location (Google Places API or demo data)
- 🌐 **Website Analysis** — Auto-detect contact forms, chat widgets, booking systems, SEO quality
- 📊 **AI Opportunity Scoring** — 0-100 score based on digital gaps
- 💡 **Smart Recommendations** — Tailored AI service recommendations per business
- ✉️ **AI Email Generation** — Personalized cold emails via OpenAI GPT-4o-mini
- 📥 **CSV Export** — Export all leads with one click
- 🔒 **Security Hardened** — Rate limiting, CSP headers, input validation, UUID protection
- 📱 **Fully Responsive** — Works on all devices

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd leadforge-ai
npm install
```

### 2. Set Up Supabase

1. Create a project at [app.supabase.com](https://app.supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/migrations/001_initial_schema.sql`
3. Go to **Project Settings → API** and copy your URL + keys

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-key          # Optional
GOOGLE_PLACES_API_KEY=your-key      # Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Change to production URL when deploying
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/dashboard` | Search + stats |
| `/results` | All leads table |
| `/leads/[id]` | Lead detail + AI analysis + email generator |

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/search` | Search businesses |
| POST | `/api/analyze/[id]` | Analyze website + score |
| POST | `/api/email/[id]` | Generate cold email |
| GET | `/api/leads` | List all leads |
| GET/PATCH | `/api/leads/[id]` | Get / update single lead |

---

## Tech Stack

- **Next.js 16** + **TypeScript** + **Tailwind CSS**
- **Supabase** (PostgreSQL)
- **OpenAI** GPT-4o-mini
- **TanStack Table** for leads table
- **PapaParse** for CSV export
- **Lucide React** for icons

---

## Security

The app includes multiple layers of protection:

| Layer | Protection |
|-------|------------|
| **Rate Limiting** | 60 req/min per IP on all API routes |
| **Input Validation** | UUID checks, search input allowlisting, field allowlisting on updates |
| **Security Headers** | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| **CORS** | Restricted to same-origin (not wildcard) |
| **DoS Protection** | 1MB request body size limit |
| **Injection Blocking** | SQL injection, XSS, path traversal patterns blocked at proxy level |
| **Mass Assignment** | PATCH routes only accept allowlisted fields |
| **Error Safety** | Internal errors never leaked to client responses |

---

## Deployment (Vercel)

```bash
vercel --prod
```

**Environment variables to set in Vercel dashboard:**

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
GOOGLE_PLACES_API_KEY
NEXT_PUBLIC_SITE_URL    # <- Set to your Vercel URL e.g. https://leadforge-ai.vercel.app
```

---

## Without API Keys

The app works without API keys in demo mode:
- **No Google Places key**: Uses realistic mock business data
- **No OpenAI key**: Uses template-based email generation
- **Supabase is required** for data persistence

---

## License

MIT
