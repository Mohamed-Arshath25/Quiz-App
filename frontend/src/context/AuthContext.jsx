import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'const API = import.meta.env.VITE_API_URL';

const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const clearToken = () => localStorage.removeItem('token');

export const authAxios = axios.create({
  baseURL: API_BASE + '/api',
});

authAxios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(API_BASE + '/api/auth/login', { email, password });
    setToken(res.data.token);
    if (res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    setIsAuthenticated(true);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(API_BASE + '/api/auth/register', { name, email, password });
    setToken(res.data.token);
    setIsAuthenticated(true);
    return res.data;
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('quizData');
    localStorage.removeItem('currentAttempt');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;
