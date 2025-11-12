import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageSourcePropType,
} from "react-native";
import colors from "../../theme/colors";
import CheckIcon from "../icons/CheckIcon";

const isMobile = () => Dimensions.get("window").width < 768;

export interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  avatar?: ImageSourcePropType;
}

interface ChatListPanelProps {
  chats: ChatItem[];
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
}

const ChatListPanel: React.FC<ChatListPanelProps> = ({
  chats,
  selectedChatId,
  onChatSelect,
}) => {
  return (
    <View style={styles.container}>
      {/* Chat List */}
      <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
        {chats.map((chat) => {
          const isSelected = selectedChatId === chat.id;
          return (
            <TouchableOpacity
              key={chat.id}
              style={[styles.chatItem, isSelected && styles.chatItemActive]}
              onPress={() => onChatSelect(chat.id)}
            >
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {chat.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName} numberOfLines={1}>
                    {chat.name}
                  </Text>
                  <Text style={styles.timestamp}>{chat.timestamp}</Text>
                </View>
                <View style={styles.chatFooter}>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {chat.lastMessage}
                  </Text>
                  {chat.unreadCount ? (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{chat.unreadCount}</Text>
                    </View>
                  ) : (
                    <CheckIcon
                      width={16}
                      height={16}
                      color={colors.primary}
                      strokeWidth={3}
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: isMobile() ? "100%" : "21.3%",
    flex: isMobile() ? 1 : undefined,
    backgroundColor: colors.chatListBg,
    borderRightWidth: isMobile() ? 0 : 1,
    borderRightColor: colors.border,
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chatItemActive: {
    backgroundColor: colors.chatItemActive,
  },
  avatarContainer: {
    justifyContent: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  chatContent: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textMuted,
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textMuted,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  unreadText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default ChatListPanel;
