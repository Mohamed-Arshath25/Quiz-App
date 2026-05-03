import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import API from '../services/api';

const AuthContext = createContext();

const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const clearToken = () => localStorage.removeItem('token');

const getErrorMessage = (error, fallbackMessage) => {
  return error.response?.data?.message || error.message || fallbackMessage;
};

export const authAxios = axios.create({
  baseURL: API ? `${API}/api` : '/api',
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
    try {
      const res = await authAxios.post('/auth/login', { email, password });
      setToken(res.data.token);
      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      setIsAuthenticated(true);
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Login failed'));
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authAxios.post('/auth/register', { name, email, password });
      setToken(res.data.token);
      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      setIsAuthenticated(true);
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Registration failed'));
    }
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
