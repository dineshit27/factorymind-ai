// Firebase initialization and exported helpers
// Reads configuration from Vite environment variables (prefixed with VITE_)
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, Auth } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
} as const;

// Validate required env vars to avoid silent blank screen if missing
const requiredKeys: (keyof typeof firebaseConfig)[] = ['apiKey','authDomain','projectId','appId'];
const placeholderIndicators = ['your_api_key','your_project_id','000000000000','abcdefghijk12345','G-XXXXXXXXXX'];
const isPlaceholder = (val: unknown) => typeof val === 'string' && placeholderIndicators.some(p => val.includes(p));
const missing = requiredKeys.filter(k => !firebaseConfig[k] || isPlaceholder(firebaseConfig[k]));
let app; let initError: unknown = null;
if (missing.length) {
  console.warn('[Firebase] Missing or placeholder configuration keys:', missing.join(', '), '\nAuth features disabled until real VITE_FIREBASE_* values are provided in .env.');
} else {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  } catch (e) { initError = e; }
}
// Provide a guarded auth object so the rest of the app doesn't explode
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;
if (!initError && app) {
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
}
// Export possibly undefined; callers must guard
export { auth, googleProvider };
export const initFirebaseError = initError;
export const firebaseConfigured = !!app && !initFirebaseError;
export { RecaptchaVerifier, signInWithPhoneNumber };

// Utility to ensure reCAPTCHA is created only once
export const getRecaptchaVerifier = (containerId: string) => {
  if (!auth) throw new Error('Firebase not initialized');
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
  }
  return window.recaptchaVerifier;
};
export default app;