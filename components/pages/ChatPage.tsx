import React, { useState, useRef, useEffect, useContext } from 'react';
import type { ChatMessage } from '../../types';
import { AppContext } from '../../App';
import { chatService } from '../../services/chatService';

const ChatPage: React.FC = () => {
    const { user, isLoggedIn, setIsSigninModalOpen, openSignupModal } = useContext(AppContext);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const loadMessages = async () => {
        try {
            const data = await chatService.getMessages();
            setMessages(data);
            setError(null);
        } catch (err: any) {
            console.error('Failed to load live chat messages:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newMessage.trim();
        if (!trimmed || !isLoggedIn || isSending) return;

        setIsSending(true);
        setError(null);

        try {
            const sent = await chatService.sendMessage(trimmed);
            setMessages((prev) => {
                if (prev.some((m) => m.id === sent.id)) return prev;
                return [...prev, sent];
            });
            setNewMessage('');
        } catch (err: any) {
            setError(err.message || 'Failed to send message.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <span>Community Live Chat</span>
                        <span className="inline-flex items-center gap-1 text-xs uppercase font-extrabold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            Live
                        </span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Global real-time chat for all RewardGrip users. Stored securely and open to everyone!
                    </p>
                </div>
            </div>
            
            <div className="bg-white dark:bg-[#151c2e] h-[65vh] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {isLoading && messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                            <i className="far fa-comments text-4xl mb-2 opacity-50"></i>
                            <p>No messages yet. Be the first to start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = user && (msg.userId === user.id || msg.user === user.username);
                            return (
                                <div key={msg.id} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                    <img
                                        src={msg.avatar && msg.avatar.trim() !== '' ? msg.avatar : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(msg.user)}`}
                                        alt={msg.user}
                                        className="w-9 h-9 rounded-full ring-2 ring-emerald-500/20 bg-slate-800 object-cover flex-shrink-0"
                                    />
                                    <div className={`p-3.5 rounded-2xl max-w-xs md:max-w-md ${
                                        isMe 
                                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-tr-none shadow-md shadow-emerald-500/20' 
                                            : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700/60'
                                    }`}>
                                        <div className="flex items-baseline justify-between gap-3 mb-1">
                                            <span className={`font-bold text-xs ${isMe ? 'text-white' : 'text-emerald-500 dark:text-emerald-400'}`}>
                                                {msg.user}
                                            </span>
                                            <span className={`text-[10px] ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={chatEndRef} />
                </div>
                
                {error && (
                    <div className="px-6 py-2 bg-rose-500/10 border-t border-rose-500/20 text-rose-400 text-xs flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="hover:text-white">&times;</button>
                    </div>
                )}

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f1422]">
                    {isLoggedIn ? (
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message to everyone..."
                                disabled={isSending}
                                maxLength={500}
                                className="flex-1 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 text-sm"
                            />
                            <button 
                                type="submit" 
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50 shadow-md shadow-emerald-500/20 cursor-pointer text-sm"
                                disabled={isSending || !newMessage.trim()}
                            >
                                <span>{isSending ? 'Sending...' : 'Send'}</span>
                                <i className="fas fa-paper-plane text-xs"></i>
                            </button>
                        </form>
                    ) : (
                        <div className="py-2 px-4 rounded-xl bg-slate-800/60 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                <p className="text-xs text-slate-300">
                                    You are viewing the live chat as a guest. Log in to write messages!
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsSigninModalOpen(true)}
                                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition-all"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => openSignupModal()}
                                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;