import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { useDashboard } from "../context/DashboardContext";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ChatTabs from "../components/dashboard/ChatTabs";
import ChatListPanel from "../components/dashboard/ChatListPanel";
import UserProfilePanel from "../components/dashboard/UserProfilePanel";
import ChatPanel from "../components/dashboard/ChatPanel";
import colors from "../theme/colors";

// Responsive breakpoint
const isMobile = () => {
  const { width } = Dimensions.get("window");
  return width < 768;
};

export default function DashboardPage() {
  const {
    activeTab,
    setActiveTab,
    filteredChats,
    searchQuery,
    setSearchQuery,
    selectedChatId,
    setSelectedChatId,
    selectedChat,
    currentProfile,
    messages,
    sendMessage,
    activeIcon,
    setActiveIcon,
    isLoading,
    error,
  } = useDashboard();

  const [mobileView, setMobileView] = useState<"list" | "chat" | "profile">(
    "list"
  );
  const [showSidebar, setShowSidebar] = useState(false);

  const handleThemeToggle = () => {
    // Theme toggle functionality
    console.log("Theme toggle");
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    if (isMobile()) {
      setMobileView("chat");
    }
  };

  const handleBackToList = () => {
    setMobileView("list");
    setSelectedChatId(undefined);
  };

  const handleShowProfile = () => {
    if (isMobile()) {
      setMobileView("profile");
    }
  };

  const handleBackToChat = () => {
    setMobileView("chat");
  };

  const mobile = isMobile();

  return (
    <View style={styles.container}>
      {/* Sidebar - Hidden on mobile unless toggled */}
      {(!mobile || showSidebar) && (
        <View style={[styles.sidebarContainer, mobile && styles.sidebarMobile]}>
          <Sidebar
            activeIcon={activeIcon}
            onIconPress={(icon) => {
              setActiveIcon(icon);
              if (mobile) setShowSidebar(false);
            }}
          />
        </View>
      )}

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Header */}
        <DashboardHeader
          onSearchChange={setSearchQuery}
          onThemeToggle={handleThemeToggle}
        />

        {/* Tabs */}
        <ChatTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          chats={filteredChats}
        />

        {/* Mobile Navigation */}
        {mobile && (
          <View style={styles.mobileNav}>
            <TouchableOpacity
              onPress={() => setShowSidebar(!showSidebar)}
              style={styles.mobileNavButton}
            >
              <Text style={styles.mobileNavText}>☰</Text>
            </TouchableOpacity>
            {mobileView === "chat" && (
              <>
                <TouchableOpacity
                  onPress={handleBackToList}
                  style={styles.mobileNavButton}
                >
                  <Text style={styles.mobileNavText}>←</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleShowProfile}
                  style={styles.mobileNavButton}
                >
                  <Text style={styles.mobileNavText}>👤</Text>
                </TouchableOpacity>
              </>
            )}
            {mobileView === "profile" && (
              <TouchableOpacity
                onPress={handleBackToChat}
                style={styles.mobileNavButton}
              >
                <Text style={styles.mobileNavText}>←</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Content Panels */}
        {mobile ? (
          // Mobile View - Single panel at a time
          <View style={styles.mobileContainer}>
            {mobileView === "list" && (
              <ChatListPanel
                chats={filteredChats}
                selectedChatId={selectedChatId}
                onChatSelect={handleChatSelect}
              />
            )}
            {mobileView === "chat" && selectedChatId && (
              <ChatPanel
                messages={messages}
                onSendMessage={(text) => sendMessage(selectedChatId, text)}
              />
            )}
            {mobileView === "profile" && (
              <UserProfilePanel profile={currentProfile} />
            )}
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
              <View style={styles.emptyChatContainer}>
                <Text style={styles.emptyChatText}>
                  Select a chat to start messaging
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Loading/Error Indicators */}
        {/* {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )} */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.bg,
  },
  sidebarContainer: {
    zIndex: 10,
  },
  sidebarMobile: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  mainContent: {
    flex: 1,
    flexDirection: "column",
  },
  mobileNav: {
    flexDirection: "row",
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
    alignItems: "center",
  },
  mobileNavText: {
    fontSize: 20,
    color: colors.text,
  },
  panelsContainer: {
    flex: 1,
    flexDirection: "row",
    minHeight: 0,
    ...(Platform.OS === "web" && {
      overflow: "hidden",
    }),
  },
  mobileContainer: {
    flex: 1,
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.chatPanelBg,
  },
  emptyChatText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  loadingContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
  },
  loadingText: {
    color: colors.primary,
    fontSize: 14,
  },
  errorContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: colors.error,
    alignItems: "center",
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});
