import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import {
  Send,
  Paperclip,
  User,
  MessageSquare,
  FileText,
  Download,
  Smile,
  Circle
} from 'lucide-react';

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('user');
  const targetProjectId = searchParams.get('project');

  const { user } = useContext(AuthContext);
  const { socket, resetUnread } = useContext(SocketContext);

  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const { data } = await API.get('/messages/conversations/list');
      setConversations(data);

      // If user came via query params with specific user ID
      if (targetUserId) {
        const existing = data.find((c) => c.user._id === targetUserId);
        if (existing) {
          setActivePartner(existing.user);
        } else {
          // Fetch target user profile to initiate conversation
          const { data: partnerData } = await API.get(`/users/${targetUserId}`);
          setActivePartner(partnerData);
        }
      } else if (data.length > 0 && !activePartner) {
        setActivePartner(data[0].user);
      }
    } catch (err) {
      console.error('Error fetching chat conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagesWithPartner = async (partnerId) => {
    try {
      const params = targetProjectId ? `?projectId=${targetProjectId}` : '';
      const { data } = await API.get(`/messages/${partnerId}${params}`);
      setMessages(data);
      resetUnread();
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [targetUserId]);

  useEffect(() => {
    if (activePartner) {
      fetchMessagesWithPartner(activePartner._id);
    }
  }, [activePartner]);

  // Real-time socket message handler
  useEffect(() => {
    if (socket) {
      const handleReceive = (incoming) => {
        if (activePartner && (incoming.senderId._id === activePartner._id || incoming.senderId === activePartner._id)) {
          setMessages((prev) => [...prev, incoming]);
        }
        fetchConversations();
      };

      const handleTyping = (data) => {
        setIsTyping(data.isTyping);
      };

      socket.on('receiveMessage', handleReceive);
      socket.on('userTyping', handleTyping);

      return () => {
        socket.off('receiveMessage', handleReceive);
        socket.off('userTyping', handleTyping);
      };
    }
  }, [socket, activePartner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !attachment) || !activePartner) return;

    try {
      const formData = new FormData();
      formData.append('receiverId', activePartner._id);
      if (targetProjectId) formData.append('projectId', targetProjectId);
      if (newMessage.trim()) formData.append('message', newMessage);
      if (attachment) formData.append('attachment', attachment);

      const { data } = await API.post('/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessages((prev) => [...prev, data]);
      setNewMessage('');
      setAttachment(null);
      fetchConversations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message');
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (socket && activePartner) {
      socket.emit('typing', { receiverId: activePartner._id, isTyping: e.target.value.length > 0 });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="glass-panel rounded-2xl h-[80vh] flex overflow-hidden border border-slate-800 shadow-2xl">
        {/* Left Conversations Sidebar */}
        <div className="w-full md:w-80 bg-slate-900/90 border-r border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" /> Real-Time Chat
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No active conversations yet.
              </div>
            ) : (
              conversations.map((c) => {
                const isActive = activePartner?._id === c.user._id;
                return (
                  <button
                    key={c.user._id}
                    onClick={() => setActivePartner(c.user)}
                    className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                      isActive ? 'bg-blue-600/15 border-l-4 border-blue-500' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <img
                      src={c.user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user.name)}`}
                      alt={c.user.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-xs truncate">{c.user.name}</span>
                        <span className="text-[10px] text-slate-500 capitalize">{c.user.role}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {c.lastMessage?.message || 'File attached'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Chat Stream */}
        {activePartner ? (
          <div className="flex-1 flex flex-col bg-slate-950">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-3">
                <img
                  src={activePartner.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(activePartner.name)}`}
                  alt={activePartner.name}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <h3 className="font-bold text-white text-sm">{activePartner.name}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                    <Circle className="w-2 h-2 fill-emerald-400" /> Active Now
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Log */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((m, idx) => {
                const isMe = (m.senderId._id || m.senderId) === user._id;
                return (
                  <div key={m._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md p-3.5 rounded-2xl space-y-1 ${
                      isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
                    }`}>
                      <p className="text-xs leading-relaxed">{m.message}</p>

                      {m.attachment && (
                        <a
                          href={m.attachment.path}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 p-2 bg-black/20 rounded-lg text-xs font-semibold hover:underline mt-1"
                        >
                          <FileText className="w-4 h-4" /> {m.attachment.filename}
                        </a>
                      )}

                      <span className="text-[9px] text-slate-400 block text-right">
                        {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="text-xs text-slate-400 italic">Typing...</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center gap-3">
              <label className="cursor-pointer p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
                <Paperclip className="w-5 h-5" />
                <input
                  type="file"
                  onChange={(e) => setAttachment(e.target.files[0])}
                  className="hidden"
                />
              </label>

              {attachment && (
                <span className="text-xs text-blue-400 bg-blue-950 px-2 py-1 rounded border border-blue-800">
                  {attachment.name}
                </span>
              )}

              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}
