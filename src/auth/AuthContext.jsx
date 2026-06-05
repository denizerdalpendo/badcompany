import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { accountFromEmail } from './accountFromEmail.js';

// DEMO ONLY: localStorage-backed mock auth for prototyping.
// Passwords are stored in plaintext in the browser. Do not ship to real users.

const USERS_KEY = 'demo-auth-users';
const SESSION_KEY = 'demo-auth-session';

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const readSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
};

const writeSession = (session) => {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
};

const publicShape = (user) => {
  // Always recompute `account` from email so older records get it too
  const account = accountFromEmail(user.email);
  return {
    id: user.id,
    email: user.email,
    user_metadata: { ...(user.user_metadata || {}), account }
  };
};

const identifyPendo = (user) => {
  if (typeof pendo === 'undefined' || typeof pendo.identify !== 'function') return;
  if (!user) {
    // Anonymous — Pendo will treat as a new visitor
    pendo.identify({ visitor: { id: null }, account: { id: null } });
    return;
  }
  const account = user.user_metadata?.account || '';
  pendo.identify({
    visitor: {
      id: user.email,
      email: user.email,
      full_name: user.user_metadata?.full_name || '',
      account
    },
    account: {
      id: account || 'unknown',
      name: account || 'unknown'
    }
  });
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initial = readSession();
    setSession(initial);
    setLoading(false);

    // Stay in sync if the user logs in/out in another tab
    const onStorage = (e) => {
      if (e.key === SESSION_KEY) setSession(readSession());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Re-identify in Pendo whenever the session changes
  useEffect(() => {
    identifyPendo(session?.user ?? null);
  }, [session]);

  const signUp = async ({ email, password, fullName }) => {
    const normalized = (email || '').trim().toLowerCase();
    if (!normalized) throw new Error('Email is required');
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const users = readUsers();
    if (users.some((u) => u.email === normalized)) {
      throw new Error('An account with this email already exists');
    }

    const newUser = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()),
      email: normalized,
      password,
      user_metadata: {
        full_name: fullName || '',
        account: accountFromEmail(normalized)
      },
      created_at: new Date().toISOString()
    };
    writeUsers([...users, newUser]);

    const user = publicShape(newUser);
    const newSession = { user };
    writeSession(newSession);
    setSession(newSession);
    return { session: newSession, user };
  };

  const signIn = async ({ email, password }) => {
    const normalized = (email || '').trim().toLowerCase();
    const users = readUsers();
    const match = users.find(
      (u) => u.email === normalized && u.password === password
    );
    if (!match) throw new Error('Invalid email or password');

    const user = publicShape(match);
    const newSession = { user };
    writeSession(newSession);
    setSession(newSession);
    return { session: newSession, user };
  };

  const signOut = async () => {
    if (typeof pendo !== 'undefined') {
      const sessionStart = session?.user?.created_at
        ? new Date(session.user.created_at).getTime()
        : null;
      pendo.track('user_signed_out', {
        sessionDurationMs: sessionStart ? Date.now() - sessionStart : 0
      });
    }
    writeSession(null);
    setSession(null);
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signIn,
      signUp,
      signOut
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
