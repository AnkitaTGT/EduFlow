# Edu Flow (Next.js 14 App Router Version)

A modern, responsive SaaS-style dashboard for schools or online learning programs.
Built with Next.js 14, Tailwind CSS, shadcn/ui, Recharts, and Firebase.

## Setup Instructions

1. Clone the repository.
2. Navigate to the `eduflow` directory: `cd eduflow`
3. Run `npm install` to install dependencies.
4. Configure your Firebase environment variables.

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_USE_MOCK=true
```

> **Note:** Set `NEXT_PUBLIC_USE_MOCK=true` to use the application entirely with local mock data without connecting to a real Firebase instance.

## Testing with Mock Data

1. Ensure `NEXT_PUBLIC_USE_MOCK=true` is in your `.env.local`.
2. Run `npm run dev`
3. On the login page, you can use any email/password, as the mock auth bypasses real validation. Use `admin@eduflow.com` to login as Admin.
4. Go to `/dashboard/admin/quizzes` and double-click the version number badge (e.g. "v1.0.4") next to the title to reveal the obfuscated CSV/TXT upload feature for new quizzes.

## Deploying to Vercel

To ensure a seamless deployment to Vercel:

1. Push your repository to GitHub.
2. Go to Vercel and import your GitHub repository.
3. **Important Configuration:** In the project configuration step, set the **Root Directory** to `eduflow`. This ensures Vercel correctly builds the Next.js app inside the subfolder.
4. In the Environment Variables section, expand it and add all the `NEXT_PUBLIC_FIREBASE_*` variables mentioned above. You can easily copy and paste the contents of `.env.example` directly into the Vercel UI.
5. Add `NEXT_PUBLIC_USE_MOCK` and set it to `false` for a real database connection, or `true` if you wish to deploy the mock version.
6. Click Deploy. Vercel will automatically detect the Next.js framework and handle the build process.

*To upload quizzes:* In the Admin dashboard -> Quizzes page, double click the version badge (top right) to open the file selection dialog for CSV uploads.
