import React, { useState, useRef, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { GoogleGenAI, Chat } from '@google/genai';

interface SupportChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ChatHistoryItem {
    role: 'user' | 'model' | 'system';
    text: string;
}

const SupportChatModal: React.FC<SupportChatModalProps> = ({ isOpen, onClose }) => {
    const { user } = useContext(AppContext);
    const [history, setHistory] = useState<ChatHistoryItem[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            if (process.env.API_KEY && !chatRef.current) {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                      systemInstruction: "You are a friendly and helpful customer support agent for a website called RewardGrip.com. Users earn money by completing tasks, surveys, and offers. Your goal is to assist users with their questions about the platform. Be concise and helpful. Start the conversation by greeting the user and asking how you can help.",
                    },
                });
                // Start with a welcome message from the model
                setHistory([{ role: 'model', text: 'Hello! I am the RewardGrip.com AI assistant. How can I help you today?' }]);
            }
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleTransitionEnd = () => {
        if (!isOpen) {
            setIsRendered(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chatRef.current) return;

        const userMessage: ChatHistoryItem = { role: 'user', text: input };
        setHistory(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await chatRef.current.sendMessageStream({ message: input });
            let text = '';
            
            // Add an empty model message to start streaming into
            setHistory(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of result) {
                text += chunk.text;
                setHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = { role: 'model', text };
                    return newHistory;
                });
            }
        } catch (error) {
            console.error("Error sending message to AI:", error);
            setHistory(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isRendered) {
        return null;
    }

    return (
        <div 
            className={`fixed inset-0 flex items-end sm:items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
            onTransitionEnd={handleTransitionEnd}
            aria-modal="true"
            role="dialog"
        >
            <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm"></div>
            <div 
                className={`bg-white dark:bg-[#141c2f] text-slate-800 dark:text-slate-200 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg h-[80vh] sm:h-auto sm:max-h-[80vh] flex flex-col transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full sm:scale-95'}`}
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Live Support</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Powered by Gemini</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center"
                        aria-label="Close modal"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </header>

                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {history.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <img 
                              src={msg.role === 'user' 
                                ? (user?.avatarUrl && user.avatarUrl.trim() !== '' ? user.avatarUrl : `https://i.pravatar.cc/100?u=${encodeURIComponent(user?.username || 'user')}`)
                                : 'https://i.imgur.com/8p2f2fn.png'
                              } 
                              alt={msg.role} 
                              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 object-cover" 
                            />
                            <div className={`p-3 rounded-lg max-w-xs md:max-w-md break-words ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                            <img src='https://i.imgur.com/8p2f2fn.png' alt="model" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            disabled={isLoading}
                            className="flex-1 bg-slate-100 dark:bg-slate-700 border border-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                        />
                        <button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform active:scale-95 disabled:bg-slate-500"
                            disabled={isLoading || !input.trim()}
                        >
                            <span>Send</span>
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default SupportChatModal;