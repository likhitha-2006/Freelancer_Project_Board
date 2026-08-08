import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        connectSocket(parsed._id);
      } catch (err) {
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    connectSocket(data._id);
    return data;
  };

  const register = async (name, email, password, role) => {
    const { data } = await API.post('/auth/register', { name, email, password, role });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    connectSocket(data._id);
    return data;
  };

  const googleLogin = async (payload) => {
    const { data } = await API.post('/auth/google', payload);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    connectSocket(data._id);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    disconnectSocket();
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('userInfo', JSON.stringify(newUser));
  };

  const refreshProfile = async () => {
    try {
      const { data } = await API.get('/users/profile');
      const newUser = { ...user, ...data };
      setUser(newUser);
      localStorage.setItem('userInfo', JSON.stringify(newUser));
      return data;
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        updateUser,
        refreshProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isClient: user?.role === 'client',
        isFreelancer: user?.role === 'freelancer'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
