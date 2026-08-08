import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../services/socket';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?._id) {
      socket.on('receiveMessage', (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        setUnreadCount((prev) => prev + 1);
      });
    }

    return () => {
      socket.off('receiveMessage');
    };
  }, [user]);

  const resetUnread = () => setUnreadCount(0);

  return (
    <SocketContext.Provider value={{ socket, messages, unreadCount, resetUnread }}>
      {children}
    </SocketContext.Provider>
  );
};
