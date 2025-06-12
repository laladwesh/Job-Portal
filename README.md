# Hirrd – Job Portal Platform

**Hirrd** is a modern job portal web application where candidates can search, apply, and save jobs, while recruiters can post, manage, and track applications for their job listings.

---

## 🚀 Features

- **Secure Authentication**  
  User sign-up/sign-in and onboarding via [Clerk.dev](https://clerk.dev/)
- **Modern UI & Theming**  
  Responsive React app, light/dark/system mode, beautiful design
- **Job Listings & Search**  
  View, filter, and search jobs; detailed job pages
- **Apply to Jobs**  
  Upload resume (PDF/Word), track status (`applied`, `interviewing`, `hired`, `rejected`)
- **Save Jobs**  
  One-click save/unsave for candidates
- **Recruiter Panel**  
  Post jobs, manage listings, toggle hiring status
- **Company Management**  
  Add companies (with logo upload)
- **Onboarding Flow**  
  First-time users pick candidate or recruiter role
- **Protected Routing**  
  Role-based and authentication-based routing throughout
- **Supabase Backend**  
  All data and file storage handled via [Supabase](https://supabase.com/)

---

## 📁 Folder Structure



src/
├── api/ # Supabase API functions
├── components/ # Reusable React components
├── hooks/ # Custom hooks (eg. useFetch)
├── layouts/ # Layout wrappers
├── pages/ # Page components
├── utils/ # Supabase client config
├── index.css # Global styles
└── App.jsx # Main app & router


---

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project (DB + storage)
- A [Clerk.dev](https://clerk.dev/) account (for authentication)

### Installation

```sh
git clone https://github.com/your-username/hirrd-job-portal.git
cd hirrd-job-portal
npm install
Environment Variables
Create a .env file in the project root:

VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
Run the App

npm run dev
The app will be available at http://localhost:5173 (or your configured port).

🛡️ Authentication & Roles
ClerkProvider is used for all authentication

Onboarding flow requires every user to select a role (candidate/recruiter)

<ProtectedRoute> guards all non-public pages, ensuring correct role access

🗂️ Core Pages & Routing
Route	Who?	Description
/	Everyone	Landing page
/onboarding	All users	Select role on first sign-in
/jobs	Candidates	Browse and search jobs
/job/:id	Candidates	View job details, apply
/post-job	Recruiters	Post a new job
/my-jobs	Both	Candidates: My applications, Recruiters: My jobs
/saved-jobs	Candidates	See saved jobs

🛠️ Tech Stack
Frontend: React, Vite, Tailwind CSS, Clerk.dev

Backend: Supabase (DB + Storage)

Validation & Forms: React Hook Form, Zod

State: React Context, custom hooks

📦 Key Files
App.jsx: App-wide router and context setup

theme-provider.jsx: System/light/dark theming

protected-route.jsx: Guards for authentication & onboarding

api/*.js: Supabase data and storage functions

components/*.jsx: All UI and logic component