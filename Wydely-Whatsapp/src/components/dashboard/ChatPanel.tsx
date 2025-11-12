import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import colors from "../../theme/colors";
import CheckIcon from "../icons/CheckIcon";
import ChatBackgroundPattern from "./ChatBackgroundPattern";

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isFromUser: boolean;
  senderAvatar?: string;
}

interface ChatPanelProps {
  messages: Message[];
  currentUser?: string;
  onSendMessage?: (text: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  currentUser = "You",
  onSendMessage,
}) => {
  const [messageText, setMessageText] = useState("");

  const handleSend = () => {
    if (messageText.trim() && onSendMessage) {
      onSendMessage(messageText.trim());
      setMessageText("");
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundContainer}>
        <ChatBackgroundPattern />
      </View>

      {/* Messages Area - Takes remaining space */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </ScrollView>

      {/* Input Area - Fixed at bottom */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textMuted}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !messageText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!messageText.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isFromUser = message.isFromUser;

  return (
    <View
      style={[
        styles.messageRow,
        isFromUser ? styles.messageRowUser : styles.messageRowOther,
      ]}
    >
      {!isFromUser && (
        <View style={styles.avatarContainer}>
          <Image
            source={require("../../../assets/icons/avatar-received.svg")}
            style={styles.avatar}
          />
        </View>
      )}

      <View style={styles.messageContent}>
        <View
          style={[
            styles.messageBubble,
            isFromUser ? styles.messageBubbleUser : styles.messageBubbleOther,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isFromUser ? styles.messageTextUser : styles.messageTextOther,
            ]}
          >
            {message.text}
          </Text>
        </View>
        <View
          style={[styles.messageFooter, isFromUser && styles.messageFooterUser]}
        >
          {isFromUser && (
            <View style={styles.checkmarks}>
              <CheckIcon width={14} height={14} color={colors.checkmark} />
            </View>
          )}
          <Text style={styles.timestamp}>{message.timestamp}</Text>
        </View>
      </View>

      {isFromUser && (
        <TouchableOpacity style={styles.actionButton}>
          <Image
            source={require("../../../assets/icons/action-icon.svg")}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.chatPanelBg,
    position: "relative",
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  messagesContainer: {
    flex: 1,
    zIndex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 100, // Extra padding for input area
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  messageRowUser: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  messageRowOther: {
    alignSelf: "flex-start",
  },
  avatarContainer: {
    marginTop: 0,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  messageContent: {
    maxWidth: "70%",
    gap: 4,
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
  },
  messageBubbleUser: {
    backgroundColor: colors.messageBubbleUser,
    alignItems: "flex-end",
  },
  messageBubbleOther: {
    backgroundColor: colors.messageBubbleOther,
    alignItems: "flex-start",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Albert Sans",
  },
  messageTextUser: {
    color: "#FFFFFF",
  },
  messageTextOther: {
    color: colors.text,
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
  },
  messageFooterUser: {
    justifyContent: "flex-end",
  },
  checkmarks: {
    flexDirection: "row",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: "Albert Sans",
  },
  actionButton: {
    marginTop: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#25D366",
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: "#FFFFFF",
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    zIndex: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.chatListBg,
    borderRadius: 20,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default ChatPanel;
