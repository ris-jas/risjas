# Risjas D2C E-commerce

Production-ready full-stack D2C e-commerce website for **Risjas** (`risjas.com`) built with Next.js App Router, TypeScript, PostgreSQL, Prisma, Auth.js, and Tailwind.

## Features

- Storefront: home, products, product detail, cart, checkout, order success, tracking, policies, about, contact
- Admin panel: dashboard, products, categories, orders, coupons, banners, reviews, customers, contact queries
- Auth: NextAuth credentials login with ADMIN/CUSTOMER role structure
- Payments: COD + Razorpay order creation and signature verification
- Uploads: Cloudinary upload API for admin usage
- Data: Prisma schema with complete requested models/enums and seed data
- Architecture: Route Handler/Action -> Controller -> Service -> Repository -> Prisma

## Tech Stack

- Next.js (App Router)
- TypeScript
- PostgreSQL
- Prisma ORM
- Tailwind CSS
- React Hook Form + Zod
- Auth.js (NextAuth)
- Cloudinary
- Razorpay

## Setup

1. Install dependencies

```bash
npm install
```

2. Create env file

```bash
cp .env.example .env
```

3. Fill required env variables (`DATABASE_URL`, auth, admin, cloudinary, razorpay)

4. Generate Prisma client

```bash
npm run prisma:generate
```

5. Run migrations

```bash
npm run prisma:migrate
```

6. Seed initial data (admin + categories + products + banners + reviews)

```bash
npm run prisma:seed
```

7. Start dev server

```bash
npm run dev
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:seed`
- `npm run prisma:studio`

## Admin Login

Admin credentials are created from:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Use `/dashboard/admin` to login. (`/admin` automatically redirects to this URL.)

## Razorpay Setup

- Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- Checkout API creates Razorpay order
- Verify API validates signature and updates `Order`/`Payment`

## Cloudinary Setup

- Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Admin upload endpoint: `POST /api/admin/uploads` (multipart form `file`)

## Deploy (Vercel + PostgreSQL)

1. Push repo to GitHub
2. Import in Vercel
3. Add all env variables in Vercel project settings
4. Provision PostgreSQL (Neon/Supabase/RDS)
5. Set `DATABASE_URL`
6. Run migration in deploy environment:

```bash
npx prisma migrate deploy
npx prisma db seed
```

7. Set custom domain to `risjas.com`

## Future Improvements

- Signed-in customer account journeys (order history, saved addresses)
- Advanced inventory dashboard + analytics charts
- Automated Razorpay webhooks and refund workflows
- Caching/search indexing for larger catalogs
- Media upload UX with drag-and-drop and asset manager
