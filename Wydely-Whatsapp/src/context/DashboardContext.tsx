import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { ChatItem } from "../components/dashboard/ChatListPanel";
import { Message } from "../components/dashboard/ChatPanel";
import { UserProfile } from "../components/dashboard/UserProfilePanel";
import { chatApi } from "../services/chatApi";

interface DashboardState {
  // Tabs
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Chats
  chats: ChatItem[];
  setChats: (chats: ChatItem[]) => void;
  filteredChats: ChatItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Selected Chat
  selectedChatId: string | undefined;
  setSelectedChatId: (chatId: string | undefined) => void;
  selectedChat: ChatItem | undefined;
  currentProfile: UserProfile | undefined;

  // Messages
  messages: Message[];
  addMessage: (chatId: string, message: Message) => void;
  sendMessage: (chatId: string, text: string) => Promise<void>;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Sidebar
  activeIcon: string;
  setActiveIcon: (icon: string) => void;

  // Refresh data
  refreshChats: () => Promise<void>;
  refreshMessages: (chatId: string) => Promise<void>;
}

const DashboardContext = createContext<DashboardState | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState("active");
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIcon, setActiveIcon] = useState("chat");

  // Filter chats based on search and tab
  const filteredChats = React.useMemo(() => {
    let filtered = chats;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tab (in a real app, this would filter by status)
    // For now, we'll just return all chats
    return filtered;
  }, [chats, searchQuery, activeTab]);

  // Get selected chat details
  const selectedChat = React.useMemo(() => {
    if (!selectedChatId) return undefined;
    return chats.find((chat) => chat.id === selectedChatId);
  }, [chats, selectedChatId]);

  // Get current profile
  const currentProfile = React.useMemo(() => {
    if (!selectedChatId) return undefined;
    return profiles[selectedChatId];
  }, [profiles, selectedChatId]);

  // Add message to state
  const addMessage = useCallback((chatId: string, message: Message) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), message],
    }));
  }, []);

  // Send message (API call + state update)
  const sendMessage = useCallback(
    async (chatId: string, text: string) => {
      if (!text.trim()) return;

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        isFromUser: true,
      };

      // Optimistically add message
      addMessage(chatId, newMessage);

      try {
        // Update chat list with new last message
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  lastMessage: text.trim(),
                  timestamp: newMessage.timestamp,
                }
              : chat
          )
        );

        // Send to API
        await chatApi.sendMessage(chatId, text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
        // In a real app, you might want to rollback the optimistic update
      }
    },
    [addMessage]
  );

  // Refresh chats from API
  const refreshChats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await chatApi.getChats(activeTab);
      setChats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chats");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  // Refresh messages for a chat
  const refreshMessages = useCallback(async (chatId: string) => {
    try {
      const data = await chatApi.getMessages(chatId);
      setMessages((prev) => ({
        ...prev,
        [chatId]: data,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    }
  }, []);

  // Load initial data
  useEffect(() => {
    refreshChats();
  }, [refreshChats]);

  // Load messages when chat is selected
  useEffect(() => {
    if (selectedChatId) {
      if (!messages[selectedChatId]) {
        refreshMessages(selectedChatId);
      }
      // Load profile if not loaded
      if (!profiles[selectedChatId]) {
        chatApi
          .getProfile(selectedChatId)
          .then((profile) => {
            setProfiles((prev) => ({
              ...prev,
              [selectedChatId]: profile,
            }));
          })
          .catch((err) => {
            console.error("Failed to load profile:", err);
          });
      }
    }
  }, [selectedChatId, refreshMessages]);

  // Refresh chats when tab changes
  useEffect(() => {
    refreshChats();
  }, [activeTab, refreshChats]);

  const value: DashboardState = {
    activeTab,
    setActiveTab,
    chats,
    setChats,
    filteredChats,
    searchQuery,
    setSearchQuery,
    selectedChatId,
    setSelectedChatId,
    selectedChat,
    currentProfile,
    messages: messages[selectedChatId || ""] || [],
    addMessage,
    sendMessage,
    isLoading,
    error,
    activeIcon,
    setActiveIcon,
    refreshChats,
    refreshMessages,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
};
