import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../App';
import { chatService, type LiveChatMessage } from '../services/chatService';

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_EMOJIS = ['🚀', '🔥', '💰', '🎉', '❤️', '👍', '⚡', '🤑'];

const LiveChatModal: React.FC<LiveChatModalProps> = ({ isOpen, onClose }) => {
  const { user, isLoggedIn, setIsSigninModalOpen, openSignupModal } = useContext(AppContext);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [onlineCount, setOnlineCount] = useState(138);
  const [isRendered, setIsRendered] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Animate open/close
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      // Realistic random variation of online users
      setOnlineCount(Math.floor(125 + Math.random() * 25));
    }
  }, [isOpen]);

  const handleTransitionEnd = () => {
    if (!isOpen) {
      setIsRendered(false);
    }
  };

  // Fetch initial messages and set up live polling
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const loadMessages = async (initial = false) => {
      if (initial) setIsLoading(true);
      try {
        const msgs = await chatService.getMessages(user?.username);
        if (isMounted) {
          setMessages(msgs);
        }
      } catch (e) {
        console.error('Error fetching live chat:', e);
      } finally {
        if (initial && isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMessages(true);

    // Poll every 3.5 seconds for new messages from the database
    const interval = setInterval(() => {
      loadMessages(false);
    }, 3500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOpen, user?.username]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isOpen]);

  // Focus input on open if logged in
  useEffect(() => {
    if (isOpen && isLoggedIn) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, isLoggedIn]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !user || isSending) return;

    const textToSend = newMessage.trim();
    setIsSending(true);

    // Optimistic UI update
    const optimisticMsg: LiveChatMessage = {
      id: `opt-${Date.now()}`,
      user: user.username,
      avatar: user.avatarUrl || `https://i.pravatar.cc/100?u=${encodeURIComponent(user.username)}`,
      message: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMessage('');

    try {
      const token = localStorage.getItem('token') || '';
      await chatService.sendMessage(textToSend, token, {
        username: user.username,
        avatarUrl: user.avatarUrl,
      });

      // Refresh to get official DB record
      const updated = await chatService.getMessages(user.username);
      setMessages(updated);
    } catch (err: any) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const addEmoji = (emoji: string) => {
    if (!isLoggedIn) return;
    setNewMessage((prev) => `${prev}${emoji}`);
    inputRef.current?.focus();
  };

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 transition-opacity duration-300 ease-out ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
      onTransitionEnd={handleTransitionEnd}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#070a13]/85 backdrop-blur-md transition-opacity duration-300" />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-xl h-[620px] max-h-[92vh] flex flex-col bg-gradient-to-b from-[#171e30] via-[#121726] to-[#0d121f] text-white rounded-3xl border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.85)] transform transition-all duration-300 ease-out overflow-hidden ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glowing accent line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-[#00D26A] to-teal-400" />

        {/* Ambient background glows */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between relative z-10 shrink-0 bg-[#121726]/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00D26A] to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
              <i className="fas fa-comments text-base" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Live Community Chat
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <i className="fas fa-users text-[10px]" />
                  {onlineCount} Online
                </span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-slate-400">Open to all users &bull; DB Synced</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              aria-label="Close modal"
            >
              <i className="fas fa-times text-xs" />
            </button>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {isLoading && messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
              <i className="fas fa-circle-notch fa-spin text-2xl text-emerald-400" />
              <p className="text-xs font-medium">Connecting to community chat...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-6">
              <i className="fas fa-comment-dots text-3xl text-slate-600 mb-2" />
              <p className="text-sm font-bold text-white">No messages yet</p>
              <p className="text-xs text-slate-400 mt-1">Be the first to say hello to everyone!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isSelf = msg.isSelf || (user?.username && msg.user.toLowerCase() === user.username.toLowerCase());
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 transition-all ${
                    isSelf ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <img
                    src={msg.avatar && msg.avatar.trim() !== '' ? msg.avatar : `https://i.pravatar.cc/100?u=${encodeURIComponent(msg.user)}`}
                    alt={msg.user}
                    className="w-8 h-8 rounded-full border border-white/10 object-cover flex-shrink-0 mt-0.5 shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://i.pravatar.cc/100?u=${encodeURIComponent(msg.user)}`;
                    }}
                  />

                  <div className={`max-w-[78%] flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-baseline gap-2 mb-1 px-1">
                      <span
                        className={`text-xs font-bold tracking-tight ${
                          isSelf ? 'text-emerald-400' : 'text-slate-200'
                        }`}
                      >
                        {msg.user}
                      </span>
                      {isSelf && (
                        <span className="text-[9px] uppercase font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                          You
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed break-words shadow-md ${
                        isSelf
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none border border-emerald-400/30'
                          : 'bg-[#1a2133] text-slate-200 rounded-tl-none border border-white/10'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer Area: Switch between Active Input (Logged In) vs Locked Banner (Logged Out) */}
        <div className="shrink-0 relative z-10 border-t border-white/10 bg-[#0d121f]/95">
          {!isLoggedIn ? (
            /* Logged-Out Guest View: Read-only with prompt to Login */
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-emerald-950/20 via-[#0d121f] to-teal-950/20">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                  <i className="fas fa-lock text-sm" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Join the Community Live Chat</p>
                  <p className="text-[11px] text-slate-400">
                    You can view all messages. Login or create an account to start writing!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setIsSigninModalOpen(true);
                  }}
                  className="flex-1 sm:flex-initial py-2 px-4 rounded-xl bg-[#00D26A] hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20"
                >
                  Sign In to Chat
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openSignupModal();
                  }}
                  className="flex-1 sm:flex-initial py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-all"
                >
                  Register
                </button>
              </div>
            </div>
          ) : (
            /* Logged-In User View: Full composer */
            <div className="p-3 sm:p-4 space-y-2">
              {/* Quick Emojis */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-sm scrollbar-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
                  <i className="fas fa-smile text-slate-500" />
                </span>
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => addEmoji(emoji)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 flex items-center justify-center text-sm transition-all hover:scale-110 active:scale-95"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="relative flex-1 flex items-center bg-[#171e30] border border-white/10 rounded-xl focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write a message in community chat..."
                    maxLength={500}
                    disabled={isSending}
                    className="w-full bg-transparent text-white px-3.5 py-2.5 text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none"
                  />
                  {newMessage.length > 0 && (
                    <span className="pr-3 text-[10px] text-slate-500 font-mono">
                      {newMessage.length}/500
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00D26A] to-emerald-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-md shadow-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  {isSending ? (
                    <i className="fas fa-circle-notch fa-spin text-xs" />
                  ) : (
                    <>
                      <span>Send</span>
                      <i className="fas fa-paper-plane text-xs" />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                <span>
                  Posting as <strong className="text-emerald-400 font-semibold">{user?.username}</strong>
                </span>
                <span>Messages stored permanently in database</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveChatModal;
