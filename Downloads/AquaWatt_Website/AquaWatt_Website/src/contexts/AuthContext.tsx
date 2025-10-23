import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import {
  auth,
  googleProvider,
  getRecaptchaVerifier,
  signInWithPhoneNumber,
  initFirebaseError,
} from '@/lib/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInAnonymously,
  signInWithPopup,
  User as FirebaseUser,
  ConfirmationResult
} from 'firebase/auth';

export interface AuthUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  phoneNumber?: string | null;
  isAnonymous?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  updateUserProfile: (updates: { displayName?: string }) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signInAnonymous: () => Promise<void>;
  sendPhoneCode: (phone: string, recaptchaId: string) => Promise<ConfirmationResult>;
  confirmPhoneCode: (confirmation: ConfirmationResult, code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapUser = (fbUser: FirebaseUser | null): AuthUser | null => {
  if (!fbUser) return null;
  const { uid, email, displayName, phoneNumber, isAnonymous } = fbUser;
  return { uid, email, displayName, phoneNumber, isAnonymous };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const authUnavailable = !auth || initFirebaseError;

  useEffect(() => {
    if (authUnavailable) {
      // Skip subscription if auth is not initialized (missing env vars / init error)
      setLoading(false);
      if (initFirebaseError) {
        console.warn('[Auth] Firebase initialization error:', initFirebaseError);
      } else {
        console.warn('[Auth] Firebase auth not configured. Populate .env with VITE_FIREBASE_* variables.');
      }
      return;
    }
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setUser(mapUser(fbUser));
      setLoading(false);
    });
    return () => unsub();
  }, [authUnavailable]);

  const requireAuth = () => {
    if (!auth) throw new Error('Firebase auth not configured');
  };

  const signInEmail = useCallback(async (email: string, password: string) => {
    requireAuth();
    await signInWithEmailAndPassword(auth!, email, password);
  }, []);

  const signUpEmail = useCallback(async (email: string, password: string) => {
    requireAuth();
    await createUserWithEmailAndPassword(auth!, email, password);
  }, []);

  const signOutUser = useCallback(async () => {
    requireAuth();
    await signOut(auth!);
  }, []);

  const updateUserProfile = useCallback(async (updates: { displayName?: string }) => {
    requireAuth();
    if (auth!.currentUser) {
      await updateProfile(auth!.currentUser, updates);
      setUser(mapUser(auth!.currentUser));
    }
  }, []);

  const signInGoogle = useCallback(async () => {
    requireAuth();
    if (!googleProvider) throw new Error('Google provider unavailable');
    await signInWithPopup(auth!, googleProvider);
  }, []);

  const signInAnonymous = useCallback(async () => {
    requireAuth();
    await signInAnonymously(auth!);
  }, []);

  const sendPhoneCode = useCallback(async (phone: string, recaptchaId: string) => {
    requireAuth();
    const verifier = getRecaptchaVerifier(recaptchaId);
    return await signInWithPhoneNumber(auth!, phone, verifier);
  }, []);

  const confirmPhoneCode = useCallback(async (confirmation: ConfirmationResult, code: string) => {
    await confirmation.confirm(code);
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading,
    signInEmail,
    signUpEmail,
    signOutUser,
    updateUserProfile,
    signInGoogle,
    signInAnonymous,
    sendPhoneCode,
    confirmPhoneCode,
  }), [user, loading, signInEmail, signUpEmail, signOutUser, updateUserProfile, signInGoogle, signInAnonymous, sendPhoneCode, confirmPhoneCode]);

  // If auth is unavailable, still render children so non-auth parts of the app work
  // Optionally we could show a banner here; keeping minimal to avoid layout shifts.

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
