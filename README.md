# Cinemayur — Professional Photographer Booking & Portfolio System

> **Cinemayur — Capturing Your Moments, Creating Your Story.**

**Cinemayur** is a luxury photography booking platform and studio management system owned and directed by **Mayur Gadade**. Built with **Next.js 14 App Router**, **React 18**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **SQLite / PostgreSQL**, and **Lucide React**.

---

## 📌 Business & Studio Identity

- **Owner & Administrator:** Mayur Gadade
- **Business Name:** Cinemayur
- **Location:** Murti, Taluka Baramati, District Pune, Maharashtra, India
- **Email:** gadademayur13@gmail.com
- **Instagram:** [@cinemayur_](https://www.instagram.com/cinemayur_/)

---

## 🌟 Key Features

### 📸 Public Customer Experience
- **Cinematic Visual Identity**: Dark luxury aesthetic (`#08090D`), gold accents (`#D4AF37`), glassmorphism panels, Playfair Display & Cinzel typography.
- **Hero & Services Showcase**: Interactive cards for Wedding, Pre-Wedding, Engagement, Maternity, Baby, and Corporate Photography.
- **Photo & Video Portfolio Gallery**: Filterable gallery with full-screen Lightbox modal viewer & native HTML5 video film player.
- **Admin-Controlled Offers**: Promotional discount cards created by Mayur Gadade with automatic expiry filtering.
- **Live Availability Checker**: Real-time conflict engine (`requestedStart < existingEnd AND requestedEnd > existingStart`).
- **Direct Request Booking**: Zod validated forms, direct request submission without online payments, auto-generated booking reference IDs (`CIN-2026-0001`).
- **Booking Confirmation**: Summary receipts, timeline tracker, and direct links to customer portal.

### 👤 Customer Dashboard
- **Booking Overview**: Statistics for total, upcoming, completed, and pending bookings.
- **Interactive Timeline**: Visual stepper (`Booking Requested` → `Reviewed` → `Confirmed` → `Event Completed`).

### 🛡️ Admin Studio Management Portal (Mayur Gadade)
- **Direct Photo & Video Upload**: Local file upload drag-and-drop picker for `.jpg`, `.png`, `.mp4`, `.webm`, `.mov` stored directly in `public/uploads/portfolio/`.
- **Offer Engine (CRUD)**: Create, toggle active/inactive status, set promo codes, valid dates, terms, and delete promotional offers.
- **Booking Management**: Approve, reject, complete, cancel, and update booking request statuses with conflict prevention.
- **Interactive Studio Calendar**: Month calendar grid with color-coded day statuses (Green: Available, Yellow: Pending, Blue: Confirmed, Red: Studio Blocked). Click to block/unblock dates or add custom maintenance reasons.
- **Package Management (CRUD)**: Create, edit, and toggle popular badges for photography packages.
- **Customer Directory**: Track client contact info and booking history.
- **Client Messages**: View contact inquiries submitted by visitors.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: Next.js Server Actions & API routes.
- **Database**: Prisma ORM with SQLite (zero-config local dev) / PostgreSQL (production).
- **Authentication**: JWT session via HTTP-only secure cookies with quick-login demo accounts.
- **Media Uploads**: Local file uploads (`public/uploads/portfolio/`) with Cloudinary / S3 production support.

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js >= 18.x
- npm or yarn

### 2. Clone and Install
```bash
cd photography
npm install
```

### 3. Database Setup & Seed
```bash
# Start with local SQLite and create its tables.
npm run db:push:local

# Optional: load local demo data. This resets existing local data.
npm run db:seed:local
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy to Vercel

1. Create a PostgreSQL database with [Neon](https://neon.tech/) and connect the project to Vercel. Add its connection string as `DATABASE_URL` in the Vercel project settings.
2. In Vercel, create a **public** Blob store and connect it to the project. Vercel supplies `BLOB_READ_WRITE_TOKEN` for uploads.
3. Set `JWT_SECRET` to a long, random value in the Vercel project settings. Keep all secrets out of source control.
4. Push the project to GitHub and import that repository in Vercel. Vercel builds with `npm run build`.
5. Before using the deployed app, push the Prisma schema to the new database with `npm run db:push` and the production `DATABASE_URL`.

To load the starter catalog into a new production database, set `ADMIN_PASSWORD`, `PHOTOGRAPHER_PASSWORD`, and `CUSTOMER_PASSWORD` to private values before running `npm run db:seed` with the production database URL. Production seeding refuses non-empty databases. The seed credentials shown below are for local development only.

---

## 🔑 Admin Credentials

These demo credentials are for local development only. Never use them for a public deployment.

| Role | Email | Password | Quick One-Click Sign In |
|---|---|---|---|
| **Admin (Mayur Gadade)** | `gadademayur13@gmail.com` | `admin123` | Click **Admin** button on `/login` |
| **Photographer** | `photographer@cinemayur.com` | `photo123` | Click **Photographer** button on `/login` |
| **Customer** | `customer@cinemayur.com` | `customer123` | Click **Customer** button on `/login` |

---

## 📄 License
Copyright © 2026 Cinemayur Photography. All rights reserved.
