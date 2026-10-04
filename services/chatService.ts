import { API_URL } from '../constants';
import type { ChatMessage } from '../types';

export interface LiveChatMessage {
  id: number | string;
  userId?: number;
  user: string;
  avatar: string;
  message: string;
  timestamp: string;
  createdAt?: string;
  isSelf?: boolean;
}

// Initial fallback messages if network is offline
const INITIAL_FALLBACK_MESSAGES: LiveChatMessage[] = [
  {
    id: 1,
    user: 'Alex_R',
    avatar: 'https://i.pravatar.cc/100?u=Alex',
    message: 'Hey everyone! Just cashed out $25 via Litecoin 🚀',
    timestamp: 'Just now',
  },
  {
    id: 2,
    user: 'Sarah99',
    avatar: 'https://i.pravatar.cc/100?u=Sarah',
    message: 'Nice! CPX surveys are paying high today, finished two already.',
    timestamp: '2m ago',
  },
  {
    id: 3,
    user: 'CryptoGamer',
    avatar: 'https://i.pravatar.cc/100?u=CryptoGamer',
    message: 'Anyone playing Zombie Survivor? What level pays the $210 bonus?',
    timestamp: '5m ago',
  },
  {
    id: 4,
    user: 'Zannatul_M',
    avatar: 'https://i.pravatar.cc/100?u=Zannatul',
    message: 'You need to reach headquarters level 15 within 14 days, super easy with the starter pack.',
    timestamp: '8m ago',
  },
  {
    id: 5,
    user: 'DevRider',
    avatar: 'https://i.pravatar.cc/100?u=DevRider',
    message: 'RewardGrip payouts are super fast today! ❤️',
    timestamp: '12m ago',
  },
];

export const chatService = {
  /**
   * Fetch recent community chat messages from DB
   * Open to everyone (guests and logged-in users)
   */
  async getMessages(currentUsername?: string): Promise<LiveChatMessage[]> {
    if (API_URL) {
      try {
        const res = await fetch(`${API_URL}/api/chat/messages`);
        if (res.ok) {
          const data: LiveChatMessage[] = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return data.map((msg) => ({
              ...msg,
              isSelf: currentUsername ? msg.user.toLowerCase() === currentUsername.toLowerCase() : false,
            }));
          }
        }
      } catch (err) {
        console.warn('[ChatService] Error fetching chat messages from backend:', err);
      }
    }

    // Return cached or fallback messages
    const local = localStorage.getItem('rewardgrip_chat_cache');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((msg) => ({
            ...msg,
            isSelf: currentUsername ? msg.user.toLowerCase() === currentUsername.toLowerCase() : false,
          }));
        }
      } catch (e) {
        // ignore JSON parse error
      }
    }

    return INITIAL_FALLBACK_MESSAGES.map((msg) => ({
      ...msg,
      isSelf: currentUsername ? msg.user.toLowerCase() === currentUsername.toLowerCase() : false,
    }));
  },

  /**
   * Send a new message to the community chat (Requires user token)
   */
  async sendMessage(message: string, token: string, user: { username: string; avatarUrl?: string }): Promise<LiveChatMessage> {
    const trimmed = message.trim();
    if (!trimmed) {
      throw new Error('Message cannot be empty.');
    }

    if (API_URL && token) {
      try {
        const res = await fetch(`${API_URL}/api/chat/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: trimmed }),
        });

        if (res.ok) {
          const savedMessage = await res.json();
          return {
            ...savedMessage,
            isSelf: true,
          };
        } else {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to send message.');
        }
      } catch (err: any) {
        console.warn('[ChatService] Backend send failed:', err);
        throw err;
      }
    }

    // Local fallback for client-side demo if backend is offline
    const fallbackMsg: LiveChatMessage = {
      id: Date.now(),
      user: user.username,
      avatar: user.avatarUrl || `https://i.pravatar.cc/100?u=${encodeURIComponent(user.username)}`,
      message: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };

    // Save to local cache
    try {
      const existing = await this.getMessages(user.username);
      const updated = [...existing, fallbackMsg].slice(-100);
      localStorage.setItem('rewardgrip_chat_cache', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    return fallbackMsg;
  },
};
