import { io } from 'socket.io-client';

const URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/';

export const socket = io(URL, {
  autoConnect: false,
});

export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit('joinRoom', userId);
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
