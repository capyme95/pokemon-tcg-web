# Pokemon TCG Web

A Next.js web application for browsing Pokemon Trading Card Game cards.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS (Black & White theme)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Features

- 📁 Browse cards by Set
- 🔍 Card details with attacks & abilities
- 🌍 International prints (equivalent cards)
- ⚡ Server-side rendering for performance
- 🎨 Dark theme inspired by LimitlessTCG

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home - All Sets |
| `/sets` | Set list (by release date, desc) |
| `/sets/[setCode]` | Set detail - Card grid (by card number, asc) |
| `/cards/[cardId]` | Card detail - Image, stats, attacks, abilities, equivalent cards |

## Environment Setup

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update the values in `.env.local` with your Supabase credentials.

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Option 2: GitHub + Vercel Dashboard

1. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/pokemon-tcg-web.git
git push -u origin main
```

2. Import to Vercel:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Set environment variables from `.env.local`
   - Deploy

### Option 3: Direct Upload

```bash
# Build locally
npm run build

# Deploy with Vercel CLI
vercel deploy --prebuilt
```

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build
npm run build
```

## Data Source

- Card images: LimitlessTCG CDN
- Card data: Supabase database
