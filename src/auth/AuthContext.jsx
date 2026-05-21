import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

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

const publicShape = (user) => ({
  id: user.id,
  email: user.email,
  user_metadata: user.user_metadata
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSession(readSession());
    setLoading(false);

    // Stay in sync if the user logs in/out in another tab
    const onStorage = (e) => {
      if (e.key === SESSION_KEY) setSession(readSession());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

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
      user_metadata: { full_name: fullName || '' },
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
