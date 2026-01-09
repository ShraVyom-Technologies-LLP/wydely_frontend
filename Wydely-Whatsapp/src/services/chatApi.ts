import { ChatItem } from '../components/dashboard/chatsDashboard/ChatListPanel';
import { Message, UserChatPanel } from '../components/dashboard/chatsDashboard/ChatPanel';
import { UserProfile } from '../components/dashboard/chatsDashboard/UserProfilePanel';

// Mock data
const mockChats: ChatItem[] = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'How are you doing?',
    timestamp: '16:45',
    isOnline: true,
    lastMessageStatus: 'SENT_DELIVERED_READ',
  },
  {
    id: '2',
    name: 'Robert Parker',
    lastMessage: 'Awesome!',
    timestamp: '16:45',
    isOnline: true,
    lastMessageStatus: 'SENT_DELIVERED_UNREAD',
  },
  {
    id: '3',
    name: 'Rick Owens',
    lastMessage: 'Good idea 🤩',
    timestamp: '16:45',
    isOnline: true,
    lastMessageStatus: 'SENT_UNDELIVERED',
  },
  {
    id: '4',
    name: 'Franz Kafka',
    lastMessage: 'Are you interested in',
    timestamp: '16:45',
    unreadCount: 2,
    isOnline: true,
    lastMessageStatus: 'RECEIVED_UNREAD',
  },
  {
    id: '5',
    name: 'Vivienne Westwood',
    lastMessage: 'This cat is so funny 😸',
    timestamp: '16:45',
    isOnline: true,
    lastMessageStatus: 'RECEIVED_READ',
  },
  {
    id: '6',
    name: 'Stan Smith',
    lastMessage: 'Want to see this kicks rn',
    timestamp: '16:45',
    isOnline: true,
    lastMessageStatus: 'RECEIVED_READ',
  },
  {
    id: '7',
    name: 'Kate Rose',
    lastMessage: 'See you tomorrow!',
    timestamp: '16:45',
    unreadCount: 1,
    isOnline: true,
    lastMessageStatus: 'RECEIVED_UNREAD',
  },
];

const mockMessages: Record<string, UserChatPanel> = {
  '1': {
    messages: [
      {
        id: 'm1',
        text: 'See you at office tomorrow!',
        timestamp: '15:03',
        isFromUser: false,
        status: 'RECEIVED_READ',
      },
      {
        id: 'm2',
        text: 'Thank you for work, see you!',
        timestamp: '16:05',
        isFromUser: true,
        status: 'SENT_DELIVERED_READ',
      },
    ],
    isSendEnabled: false,
  },
  '2': {
    messages: [
      {
        id: 'm5',
        text: 'Hey! How are you doing?',
        timestamp: '14:30',
        isFromUser: true,
        status: 'SENT_DELIVERED_UNREAD',
      },
    ],
    isSendEnabled: true,
  },
  '3': {
    messages: [
      {
        id: 'm6',
        text: 'Hey! How are you doing?',
        timestamp: '14:30',
        isFromUser: true,
        status: 'SENT_UNDELIVERED',
      },
    ],
    isSendEnabled: true,
  },
  '4': {
    messages: [
      {
        id: 'm7',
        text: 'Hey! How are you doing?',
        timestamp: '14:30',
        isFromUser: false,
        status: 'RECEIVED_UNREAD',
      },
      {
        id: 'm8',
        text: 'REPLY TO THIS MESSAGE',
        timestamp: '14:30',
        isFromUser: false,
        status: 'RECEIVED_UNREAD',
      },
    ],
    isSendEnabled: true,
  },
  '5': {
    messages: [
      {
        id: 'm9',
        text: 'Hey! How are you doing?',
        timestamp: '14:30',
        isFromUser: false,
        status: 'RECEIVED_READ',
      },
    ],
    isSendEnabled: true,
  },
  '6': {
    messages: [
      {
        id: 'm10',
        text: 'Hey! How are you doing?',
        timestamp: '14:30',
        isFromUser: false,
        status: 'RECEIVED_READ',
      },
    ],
    isSendEnabled: true,
  },
  '7': {
    messages: [
      {
        id: 'm11',
        text: 'Hey! How are you doing?',
        timestamp: '14:30',
        isFromUser: false,
        status: 'RECEIVED_UNREAD',
      },
    ],
    isSendEnabled: true,
  },
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
  '3': {
    id: '3',
    name: 'Rick Owens',
    phone: '(+91-9876543210)',
    status: 'Active',
    lastActive: '29/09/2025, 16:45',
    templateMessages: 5,
    sessionMessages: 12,
    source: 'WA Business App',
    mauStatus: 'Active',
    incoming: 'Allowed',
  },
  '4': {
    id: '4',
    name: 'Franz Kafka',
    phone: '(+91-9876543210)',
    status: 'Active',
    lastActive: '29/09/2025, 16:45',
    templateMessages: 5,
    sessionMessages: 12,
    source: 'WA Business App',
    mauStatus: 'Active',
    incoming: 'Allowed',
  },
  '5': {
    id: '5',
    name: 'Vivienne Westwood',
    phone: '(+91-9876543210)',
    status: 'Active',
    lastActive: '29/09/2025, 16:45',
    templateMessages: 5,
    sessionMessages: 12,
    source: 'WA Business App',
    mauStatus: 'Active',
    incoming: 'Allowed',
  },
  '6': {
    id: '6',
    name: 'Stan Smith',
    phone: '(+91-9876543210)',
    status: 'Active',
    lastActive: '29/09/2025, 16:45',
    templateMessages: 5,
    sessionMessages: 12,
    source: 'WA Business App',
    mauStatus: 'Active',
    incoming: 'Allowed',
  },
  '7': {
    id: '7',
    name: 'Kate Rose',
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
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class ChatApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Get chats based on tab/status
  async getChats(tab: string = 'active', projectId?: string): Promise<ChatItem[]> {
    if (USE_MOCK_DATA) {
      await delay(300); // Simulate network delay
      return [...mockChats];
    }

    try {
      const projectParam = projectId ? `&projectId=${encodeURIComponent(projectId)}` : '';
      const response = await fetch(`${this.baseUrl}/api/chats?tab=${tab}${projectParam}`, {
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
  async getMessagesPanel(chatId: string): Promise<UserChatPanel> {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockMessages[chatId];
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
      return mockMessages[chatId];
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
        status: 'SENT_UNDELIVERED',
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
