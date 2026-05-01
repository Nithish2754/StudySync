import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('studysync_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('studysync_token');
    if (token) {
      API.get('/auth/me')
        .then(res => { setUser(res.data.user); localStorage.setItem('studysync_user', JSON.stringify(res.data.user)); })
        .catch(() => { localStorage.clear(); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('studysync_token', res.data.token);
    localStorage.setItem('studysync_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success(`Welcome back, ${res.data.user.name}! 🎉`);
    return res.data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password });
    localStorage.setItem('studysync_token', res.data.token);
    localStorage.setItem('studysync_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success(`Account created! Welcome, ${res.data.user.name}! 🚀`);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('studysync_token');
    localStorage.removeItem('studysync_user');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('studysync_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
