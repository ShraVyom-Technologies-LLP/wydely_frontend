import { ChatItem } from '../components/dashboard/chatsDashboard/ChatListPanel';
import { Message } from '../components/dashboard/chatsDashboard/ChatPanel';
import { UserProfile } from '../components/dashboard/chatsDashboard/UserProfilePanel';

// Mock data
const mockChats: ChatItem[] = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'How are you doing?',
    timestamp: '16:45',
    unreadCount: undefined,
    avatar: require('../../assets/images/avatar-1.svg'),
    avatarId: 'avatar-1',
    isOnline: true,
    status: 'double-check',
  },
  {
    id: '2',
    name: 'Robert Parker',
    lastMessage: 'Awesome!',
    timestamp: '16:45',
    unreadCount: 2,
    avatar: require('../../assets/images/avatar-1.svg'),
    avatarId: 'avatar-2',
    isOnline: true,
    status: 'unread',
  },
  {
    id: '3',
    name: 'Rick Owens',
    lastMessage: 'Good idea 🤩',
    timestamp: '16:45',
    unreadCount: undefined,
    avatar: require('../../assets/images/avatar-1.svg'),
    avatarId: 'avatar-3',
    isOnline: true,
    status: 'check',
  },
  {
    id: '4',
    name: 'Franz Kafka',
    lastMessage: 'Are you interested in',
    timestamp: '16:45',
    unreadCount: undefined,
    avatar: require('../../assets/images/avatar-1.svg'),
    avatarId: 'avatar-4',
    isOnline: true,
    status: 'double-check',
  },
  {
    id: '5',
    name: 'Vivienne Westwood',
    lastMessage: 'This cat is so funny 😸',
    timestamp: '16:45',
    unreadCount: undefined,
    avatar: require('../../assets/images/avatar-1.svg'),
    avatarId: 'avatar-1',
    isOnline: true,
    status: 'double-check',
  },
  {
    id: '6',
    name: 'Stan Smith',
    lastMessage: 'Want to see this kicks rn',
    timestamp: '16:45',
    unreadCount: undefined,
    avatar: require('../../assets/images/avatar-1.svg'),
    avatarId: 'avatar-2',
    isOnline: true,
    status: 'double-check',
  },
  {
    id: '7',
    name: 'Kate Rose',
    lastMessage: 'you: See you tomorrow!',
    timestamp: '16:45',
    unreadCount: undefined,
    avatar: require('../../assets/images/avatar-1.svg'),
    avatarId: 'avatar-3',
    isOnline: true,
    status: 'single-check',
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      text: 'See you at office tomorrow!',
      timestamp: '15:03',
      isFromUser: false,
      senderAvatar: require('../../assets/images/avatar-1.svg'),
    },
    {
      id: 'm2',
      text: 'Thank you for work, see you!',
      timestamp: '16:05',
      isFromUser: true,
      actionIcon: require('../../assets/images/action-icon-1.svg'),
    },
    {
      id: 'm3',
      text: 'See you at office tomorrow!',
      timestamp: '15:03',
      isFromUser: false,
      senderAvatar: require('../../assets/images/avatar-1.svg'),
    },
    {
      id: 'm4',
      text: 'Thank you for work, see you!',
      timestamp: '16:05',
      isFromUser: true,
      actionIcon: require('../../assets/images/action-icon-1.svg'),
    },
    {
      id: 'm5',
      text: 'See you at office tomorrow!',
      timestamp: '15:03',
      isFromUser: false,
      senderAvatar: require('../../assets/images/avatar-1.svg'),
    },
    {
      id: 'm6',
      text: 'Thank you for work, see you!',
      timestamp: '16:05',
      isFromUser: true,
      actionIcon: require('../../assets/images/action-icon-1.svg'),
    },
    {
      id: 'm7',
      text: 'See you at office tomorrow!',
      timestamp: '15:03',
      isFromUser: false,
      senderAvatar: require('../../assets/images/avatar-1.svg'),
    },
    {
      id: 'm8',
      text: 'Thank you for work, see you!',
      timestamp: '16:05',
      isFromUser: true,
      actionIcon: require('../../assets/images/action-icon-1.svg'),
    },
  ],
  '2': [
    {
      id: 'm5',
      text: 'Hey! How are you doing?',
      timestamp: '14:30',
      isFromUser: false,
    },
    {
      id: 'm6',
      text: 'Awesome!',
      timestamp: '16:45',
      isFromUser: false,
    },
  ],
};

const mockProfiles: Record<string, UserProfile> = {
  '1': {
    id: '1',
    name: 'John Doe',
    phone: '(+91-7891716568)',
    status: 'Inactive',
    lastActive: '29/09/2025, 15:08',
    templateMessages: 0,
    sessionMessages: 26,
    source: 'WA Business App',
    mauStatus: 'Active',
    incoming: 'Allowed',
  },
  '2': {
    id: '2',
    name: 'Robert Parker',
    phone: '(+91-9876543210)',
    status: 'Active',
    lastActive: '29/09/2025, 16:45',
    templateMessages: 5,
    sessionMessages: 12,
    source: 'WA Business App',
    mauStatus: 'Active',
    incoming: 'Allowed',
  },
};

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.wydely.com';
const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class ChatApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Get chats based on tab/status
  async getChats(tab: string = 'active'): Promise<ChatItem[]> {
    if (USE_MOCK_DATA) {
      await delay(300); // Simulate network delay
      return [...mockChats];
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/chats?tab=${tab}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth token here if needed
          // Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch chats: ${response.statusText}`);
      }

      const data = await response.json();
      return data.chats || [];
    } catch (error) {
      console.error('Error fetching chats:', error);
      // Fallback to mock data on error
      return [...mockChats];
    }
  }

  // Get messages for a specific chat
  async getMessages(chatId: string): Promise<Message[]> {
    if (USE_MOCK_DATA) {
      await delay(200);
      return [...(mockMessages[chatId] || [])];
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/chats/${chatId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback to mock data on error
      return [...(mockMessages[chatId] || [])];
    }
  }

  // Send a message
  async sendMessage(chatId: string, text: string): Promise<Message> {
    if (USE_MOCK_DATA) {
      await delay(200);
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        text,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
        isFromUser: true,
      };
      return newMessage;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get user profile
  async getProfile(chatId: string): Promise<UserProfile> {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockProfiles[chatId] || mockProfiles['1']; // Fallback to first profile
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/chats/${chatId}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();
      return data.profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to mock data on error
      return mockProfiles[chatId] || mockProfiles['1'];
    }
  }

  // Mark chat as read
  async markAsRead(chatId: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay(100);
      return;
    }

    try {
      await fetch(`${this.baseUrl}/api/chats/${chatId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }
}

export const chatApi = new ChatApiService();
