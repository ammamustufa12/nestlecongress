import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, getAuthToken, setAuthToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const existing = getAuthToken();
    if (!existing) {
      setReady(true);
      return;
    }
    api('/me')
      .then(setUser)
      .catch(() => setAuthToken(null))
      .finally(() => setReady(true));
  }, []);

  const signIn = async ({ email, password, demo } = {}) => {
    const body = demo || (!email?.trim() && !password)
      ? { email: 'dr.testing@congress.com', password: 'password' }
      : { email: email.trim(), password };
    const data = await api('/login', { method: 'POST', body });
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signUp = async ({ name, email, password, organization }) => {
    const data = await api('/register', {
      method: 'POST',
      body: { name, email, password, organization },
    });
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signOut = async () => {
    try {
      await api('/logout', { method: 'POST' });
    } catch (error) {
      // The local session still ends if the token is already gone.
    }
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, ready, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
