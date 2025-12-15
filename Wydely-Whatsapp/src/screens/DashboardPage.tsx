import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  Text,
  ImageBackground,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useDashboard } from '../context/DashboardContext';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/chatsDashboard/DashboardHeader';
import ChatTabs from '../components/dashboard/chatsDashboard/ChatTabs';
import ChatListPanel from '../components/dashboard/chatsDashboard/ChatListPanel';
import UserProfilePanel from '../components/dashboard/chatsDashboard/UserProfilePanel';
import ChatPanel from '../components/dashboard/chatsDashboard/ChatPanel';
import ContactsPage from '../components/ContactsPage';
import MyAccountPage from '../components/MyAccountPage';
import colors from '../theme/colors';
import { RootStackParamList } from '../navigation/types';
import ExistingCampaignsPage from '../components/ExistingCampaignsPage';

// Placeholder components for other pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderTitle}>{title}</Text>
    <Text style={styles.placeholderText}>This page is under construction</Text>
  </View>
);

// Responsive breakpoint
const isMobile = () => {
  const { width } = Dimensions.get('window');
  return width < 768;
};

export default function DashboardPage() {
  const {
    activeTab,
    setActiveTab,
    filteredChats,
    setSearchQuery,
    selectedChatId,
    setSelectedChatId,
    currentProfile,
    messages,
    sendMessage,
    activeIcon,
    setActiveIcon,
    error,
  } = useDashboard();

  const route = useRoute<RouteProp<RootStackParamList, 'Dashboard'>>();

  // When coming from other screens (e.g. BroadcastCampaign), respect requested initial icon
  useEffect(() => {
    if (route.params?.initialIcon) {
      setActiveIcon(route.params.initialIcon);
    }
  }, [route.params?.initialIcon, setActiveIcon]);

  const [mobileView, setMobileView] = useState<'list' | 'chat' | 'profile'>('list');
  const [showSidebar, setShowSidebar] = useState(false);

  const userInitial = (route.params?.userName || '').trim()
    ? route.params!.userName!.trim().charAt(0).toUpperCase()
    : 'P';

  const handleThemeToggle = () => {
    // Theme toggle functionality
    // TODO: Implement theme toggle
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    if (isMobile()) {
      setMobileView('chat');
    }
  };

  const handleBackToList = () => {
    setMobileView('list');
    setSelectedChatId(undefined);
  };

  const handleShowProfile = () => {
    if (isMobile()) {
      setMobileView('profile');
    }
  };

  const handleBackToChat = () => {
    setMobileView('chat');
  };

  const mobile = isMobile();

  // Render Messages page (chatsDashboard)
  const renderMessagesPage = () => (
    <>
      {/* Header */}
      <DashboardHeader
        onSearchChange={setSearchQuery}
        onThemeToggle={handleThemeToggle}
        title="Chats"
      />

      {/* Tabs */}
      <ChatTabs activeTab={activeTab} onTabChange={setActiveTab} chats={filteredChats} />

      {/* Mobile Navigation */}
      {mobile && (
        <View style={styles.mobileNav}>
          <TouchableOpacity
            onPress={() => setShowSidebar(!showSidebar)}
            style={styles.mobileNavButton}
          >
            <Text style={styles.mobileNavText}>☰</Text>
          </TouchableOpacity>
          {mobileView === 'chat' && (
            <>
              <TouchableOpacity onPress={handleBackToList} style={styles.mobileNavButton}>
                <Text style={styles.mobileNavText}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShowProfile} style={styles.mobileNavButton}>
                <Text style={styles.mobileNavText}>👤</Text>
              </TouchableOpacity>
            </>
          )}
          {mobileView === 'profile' && (
            <TouchableOpacity onPress={handleBackToChat} style={styles.mobileNavButton}>
              <Text style={styles.mobileNavText}>←</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Content Panels */}
      {mobile ? (
        // Mobile View - Single panel at a time
        <View style={styles.mobileContainer}>
          {mobileView === 'list' && (
            <ChatListPanel
              chats={filteredChats}
              selectedChatId={selectedChatId}
              onChatSelect={handleChatSelect}
            />
          )}
          {mobileView === 'chat' && selectedChatId && (
            <ChatPanel
              messages={messages}
              onSendMessage={(text) => sendMessage(selectedChatId, text)}
            />
          )}
          {mobileView === 'profile' && <UserProfilePanel profile={currentProfile} />}
        </View>
      ) : (
        // Desktop View - All panels side by side
        <View style={styles.panelsContainer}>
          <ChatListPanel
            chats={filteredChats}
            selectedChatId={selectedChatId}
            onChatSelect={setSelectedChatId}
          />

          <UserProfilePanel profile={currentProfile} />

          {selectedChatId ? (
            <ChatPanel
              messages={messages}
              onSendMessage={(text) => sendMessage(selectedChatId, text)}
            />
          ) : (
            <ImageBackground
              source={require('../../assets/images/chat-background.png')}
              style={styles.emptyChatContainer}
              imageStyle={styles.backgroundImage}
              resizeMode="cover"
            >
              <Text style={styles.emptyChatText}>Select a chat to start messaging</Text>
            </ImageBackground>
          )}
        </View>
      )}

      {/* Error Indicator */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </>
  );

  // Render content based on active icon
  const renderPageContent = () => {
    switch (activeIcon) {
      case 'home':
        return <PlaceholderPage title="Home Dashboard" />;
      case 'messages':
        return renderMessagesPage();
      case 'campaigns':
        return <ExistingCampaignsPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'profile':
        return <MyAccountPage />;
      case 'notifications':
        return <PlaceholderPage title="Notifications" />;
      case 'settings':
        return <PlaceholderPage title="Settings" />;
      case 'help':
        return <PlaceholderPage title="Help & Support" />;
      default:
        return renderMessagesPage();
    }
  };

  return (
    <View style={styles.container}>
      {/* Sidebar - Hidden on mobile unless toggled */}
      {(!mobile || showSidebar) && (
        <View style={[styles.sidebarContainer, mobile && styles.sidebarMobile]}>
          <Sidebar
            activeIcon={activeIcon}
            userInitial={userInitial}
            onIconPress={(icon) => {
              setActiveIcon(icon);
              if (mobile) setShowSidebar(false);
            }}
          />
        </View>
      )}

      {/* Main Content Area */}
      <View style={styles.mainContent}>{renderPageContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.bg,
  },
  sidebarContainer: {
    zIndex: 10,
  },
  sidebarMobile: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  mobileNav: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  mobileNavButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  mobileNavText: {
    fontSize: 20,
    color: colors.text,
  },
  panelsContainer: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 0,
    ...(Platform.OS === 'web' && {
      overflow: 'hidden',
    }),
  },
  mobileContainer: {
    flex: 1,
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.chatPanelBg,
    ...(Platform.OS === 'web' && {
      width: '100%',
      height: '100%',
    }),
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  emptyChatText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  loadingContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
  },
  loadingText: {
    color: colors.primary,
    fontSize: 14,
  },
  errorContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: colors.error,
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
    padding: 20,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
