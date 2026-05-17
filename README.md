# EduFlow
Complete web-based education dashboard

## Deploying to Vercel

The application code is located in the `eduflow` subdirectory. To ensure a smooth deployment to Vercel:

1. Push your repository to GitHub.
2. Go to Vercel and import your GitHub repository.
3. **Important:** In the Vercel project configuration, set the **Root Directory** to `eduflow`.
4. In the Environment Variables section, add the following keys from your Firebase setup:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
5. Also add: `NEXT_PUBLIC_USE_MOCK=false` for production (or `true` if you want to deploy with mock data).
6. Click Deploy. Vercel will automatically detect the Next.js framework inside the `eduflow` directory.
