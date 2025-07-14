Here's a complete `README.md` file for your **Tax Regime App**, which includes:

- ✅ Project overview
- ✅ Tech stack
- ✅ Folder structure
- ✅ Setup & run instructions
- ✅ How to customize UI
- ✅ Notes on PDF, auth, and regime logic

---

### ✅ `README.md`

```markdown
# 💰 Tax Regime App

A full-stack web application that allows users to register, log in, choose their tax regime (Old/New), and view/download related details. Includes role-based admin dashboard and PDF generation logic.

---

## 📦 Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend**: API Routes via Next.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT
- **PDF Generation**: jsPDF + jspdf-autotable

---

## 📁 Folder Structure
```

tax-regime-app/
├── public/
│ └── pdfs/
│ ├── regime-old.pdf # Old regime tax slab info
│ └── regime-new\.pdf # New regime tax slab info
├── prisma/
│ └── schema.prisma # Prisma DB schema
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ ├── register/
│ │ │ │ └── route.ts # Registration API
│ │ │ ├── login/
│ │ │ │ └── route.ts # Login API
│ │ │ ├── user/
│ │ │ │ └── regime/ # Regime POST/GET/Change APIs
│ │ │ └── admin/
│ │ │ └── users/ # Admin-only: fetch all users
│ │ ├── login/
│ │ ├── register/
│ │ ├── taxes/ # Regime selection UI
│ │ ├── report/ # Report showing user's tax data
│ │ └── dashboard/ # Main dashboard page
│ ├── lib/
│ │ ├── auth.ts # JWT token helpers
│ │ └── prisma.ts # Prisma client instance
│ └── layouts/
│ └── DashboardLayout.tsx
└── README.md

````

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-org/tax-regime-app.git
cd tax-regime-app
npm install
````

### 2. Set Environment Variables

Create a `.env` file:

```
DATABASE_URL=postgresql://username:password@localhost:5432/yourdb
JWT_SECRET=your_super_secret_key
```

### 3. Generate & Apply Prisma Schema

```bash
npx prisma migrate dev --name init
npx prisma generate
```

> ⚠️ If you get migration errors, especially when adding `pan` or `regimeChangedAt`, you may need to reset or manually update the database.

### 4. Run Dev Server

```bash
npm run dev
```

App runs at: [http://localhost:3000](http://localhost:3000)

---

## 🧑‍💻 Creating a User

Go to `/register` and fill in:

- Full name (editable later)
- PAN number
- Email
- Password
- Select regime: old or new

On successful registration:

- `regimeChangeCount` = 0
- `role` defaults to `user`

---

## 🔐 Auth Notes

- JWT token stored in `localStorage`
- Token sent via `Authorization: Bearer` header
- Admin access enforced in API and UI

---

## 📄 PDF Download Logic

- Files already stored:

  - `public/pdfs/regime-old.pdf`
  - `public/pdfs/regime-new.pdf`

- On regime change, user gets the corresponding PDF downloaded

---

## 🧠 Regime Change Logic

- User can switch regime only **once per financial year**
- `regimeChangeCount` is tracked per year
- Attempting more than 1 change shows a warning

---

## 🎨 How to Change the UI

- **Sidebar Links**: Edit in `src/layouts/DashboardLayout.tsx`
- **Dashboard or Taxes page**: Update components in `src/app/taxes/page.tsx`
- **Admin table**: Modify styles and columns in `src/app/admin/page.tsx`
- **PDF display text**: Modify static PDFs in `public/pdfs` or regenerate them
- **Tailwind colors/themes**: Adjust globally in `tailwind.config.js`

---

## 👩‍💼 Admin Panel

- Only users with `role: admin` can access `/admin`
- Non-admins are redirected or shown error messages
- Displays full user table with: name, email, PAN, regime, role

---

## 🧪 Testing Features

- Register a new user and test regime selection
- Try switching regimes again → should block if already changed once this year
- Log in as admin user to view the admin panel

---

## 🧰 Useful Commands

```bash
npx prisma studio        # GUI for DB
npx prisma migrate dev   # Apply DB migrations
npm run dev              # Run dev server
```

---
