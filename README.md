# Flip Me

Mobile-first puzzle game. Tap a triangle (or hex) to flip it and its neighbors between red and green. Win by turning every cell green in the exact tap count.

Two worlds: **Flip it Tron** (triangles, neon) and **Flip it Honey** (hexagons, beehive). Each has 20 pre-baked levels + a random mode.

## Stack

Next.js 16 (App Router) + TypeScript + Tailwind 4. Supabase for auth (Google OAuth) and the puzzle catalog. Hosted on Railway.

## Local dev

```bash
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev
```

The dev script preloads the Zscaler CA from `certs/corporate-ca.pem` if present. Production runs don't need it.

## Schema

Tables live in the `flip_me` schema on Supabase. Apply `supabase/migrations/0001_init.sql` then `supabase/migrations/0002_seed_puzzles.sql` to seed the 40 puzzles.

Regenerate the seed: `npm run seed` (writes a fresh `0002_seed_puzzles.sql` using a deterministic RNG).
