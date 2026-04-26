import React, { createContext, useContext, useMemo } from 'react';

export interface User {
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextValue {
  user: User;
  isAuthenticated: true;
}

const fakeUser: User = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'JD',
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<AuthContextValue>(() => ({ user: fakeUser, isAuthenticated: true }), []);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
