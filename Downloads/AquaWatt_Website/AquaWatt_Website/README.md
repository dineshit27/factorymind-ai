# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/2c25d573-a0d8-45fa-a20e-12cd48fa2647

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2c25d573-a0d8-45fa-a20e-12cd48fa2647) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2c25d573-a0d8-45fa-a20e-12cd48fa2647) and click on Share -> Publish.

## Deploy to Firebase Hosting

1. Install the Firebase CLI (one-time):
	- npm i -g firebase-tools
2. Login and select the project:
	- firebase login
	- firebase use <your-firebase-project-id>
3. Build and deploy:
	- npm run deploy

## Database Schema & Automatic Updates

This project now uses Supabase migrations for deterministic schema evolution.

### Directory Layout

```
supabase/
	config.toml          # Project ref (project_id)
	schema.sql           # (Legacy) reference schema - avoid editing directly now
	seed.sql             # Sample / demo data (safe, idempotent-ish)
	migrations/          # Incremental migration files (authoritative)
		0001_initial_minimal_schema.sql
```

### Commands

Run these with the Supabase CLI installed and logged in:

```
npm run db:local   # Start local stack (optional for local dev)
npm run db:push    # Push all migrations to remote project
npm run db:diff    # Generate a new migration from DB vs. local state
npm run db:gen     # Regenerate TypeScript types from remote project
npm run db:seed    # Execute seed.sql against remote
npm run db:reset   # (Destructive) Reset remote linked DB and re-apply migrations
```

### Typical Workflow for a Schema Change
1. Edit or create a new migration file under `supabase/migrations` (never rewrite an applied migration in production).
2. Apply locally (optional): `supabase db push` (if using local stack) or `supabase db lint` for validation (if available).
3. Push to remote: `npm run db:push`.
4. Regenerate types: `npm run db:gen` (commit updated `types.generated.ts`).
5. Update service code to use new columns/functions.

### Generating a Migration from Manual Edits
If you temporarily edit the remote DB via the dashboard and want to capture changes:
```
npm run db:diff
```
This creates a timestamped migration you can review, adjust, and commit.

### Seeding Notes
`seed.sql` loops through all `auth.users`; create at least one user before running. Re-running is safe; it only fills gaps.

### Do Not
- Reorder or rename existing migration files once committed.
- Put large data loads or random seed logic in structural migrations (keep in `seed.sql`).

### CI Consideration
In CI you can enforce schema drift detection by running a diff and failing if a new diff appears unexpectedly.

---

## Firebase Authentication Integration

This project uses Firebase Authentication for Email/Password, Phone (OTP), Google OAuth, and Anonymous sign-in.

### 1. Enable Providers
In the Firebase Console > Authentication > Sign-in method, enable:
- Email/Password
- Phone
- Google
- Anonymous (optional)

### 2. Environment Variables
Create a `.env` file in the project root based on `.env.example`:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

Restart the dev server after adding env variables.

### 3. Phone Auth Notes
Firebase requires reCAPTCHA verification for web phone auth. An invisible reCAPTCHA is attached to the `#recaptcha-container` div when you request an OTP. Ensure the domain is authorized in Firebase Console > Authentication > Settings > Authorized domains.

### 4. Guest / Anonymous
Click the "Guest" button in the auth dialog to sign in anonymously. You can later link this account to a permanent credential if desired (not yet implemented).

### 5. Extending Providers
`src/lib/firebase.ts` centralizes initialization. Add more providers (e.g., GitHub, Microsoft) by importing from `firebase/auth` and calling `signInWithPopup` in the auth button.

### 6. Security
Do NOT commit your real `.env` values. For production, configure CI/CD or hosting environment variables securely.

Config files added:
- firebase.json (SPA rewrites, caching)
- .firebaserc (set your default project id)

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
