import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import colors from '../../../theme/colors';
import { StatusIndicator } from './ChatListPanel';
import TemplateMessage, { TemplateFooterItem } from '../../TemplateMessage';

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isFromUser: boolean;
  status:
    | 'RECEIVED_READ'
    | 'SENT_DELIVERED_READ'
    | 'SENT_DELIVERED_UNREAD'
    | 'SENT_UNDELIVERED'
    | 'RECEIVED_UNREAD';
  // Template message properties (optional)
  isTemplate?: boolean;
  templateHeaderImage?: { uri: string } | null;
  templateFooter?: TemplateFooterItem[];
}

export interface UserChatPanel {
  messages: Message[];
  isSendEnabled: boolean;
}

interface ChatPanelProps {
  messages: Message[];
  isSendEnabled: boolean;
  onSendMessage?: (text: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isSendEnabled }) => {
  const [messageText, setMessageText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      // Use a small timeout to ensure the content is rendered before scrolling
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (messageText.trim() && onSendMessage) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={require('../../../../assets/images/chat-background.png')}
        style={styles.backgroundContainer}
        resizeMode="cover"
      />

      {/* Messages Area - Scrollable with fixed height */}
      <View style={styles.messagesWrapper}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </ScrollView>
      </View>

      {/* Input Area - Fixed at bottom */}
      {isSendEnabled && (
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
              style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!messageText.trim()}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isFromUser = message.isFromUser;

  // Render template message if it's a template
  if (message.isTemplate) {
    return (
      <View
        style={[styles.messageRow, isFromUser ? styles.messageRowUser : styles.messageRowOther]}
      >
        <View style={styles.messageContent}>
          <TemplateMessage
            headerImage={message.templateHeaderImage}
            body={message.text}
            footer={message.templateFooter}
            isFromUser={isFromUser}
            showTimestamp={false}
            containerStyle={
              isFromUser ? styles.templateMessageContainerUser : styles.templateMessageContainer
            }
          />
          <View style={[styles.timestampRow, isFromUser && styles.timestampRowUser]}>
            {isFromUser && message.status && <StatusIndicator lastMessageStatus={message.status} />}
            <Text style={styles.timestamp}>{message.timestamp}</Text>
          </View>
        </View>
      </View>
    );
  }

  // Render regular message bubble
  return (
    <View style={[styles.messageRow, isFromUser ? styles.messageRowUser : styles.messageRowOther]}>
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
        <View style={[styles.timestampRow, isFromUser && styles.timestampRowUser]}>
          {isFromUser && message.status && <StatusIndicator lastMessageStatus={message.status} />}
          <Text style={styles.timestamp}>{message.timestamp}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.chatPanelBg,
    position: 'relative',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  messagesWrapper: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 92, // Height for input container (adjust as needed)
    zIndex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  messageRowUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  messageRowOther: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  messageContent: {
    gap: 4,
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  messageBubbleUser: {
    backgroundColor: colors.messageBubbleUser,
  },
  messageBubbleOther: {
    backgroundColor: colors.messageBubbleOther,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: 'Albert Sans',
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  messageTextOther: {
    color: colors.text,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timestampRowUser: {
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    lineHeight: 14,
    color: colors.textMuted,
    fontFamily: 'Albert Sans',
  },
  actionIcon: {
    width: 36,
    height: 36,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    zIndex: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
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
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  templateMessageContainer: {
    maxWidth: '30%', // Smaller width for chat context to match regular message bubbles better
  },
  templateMessageContainerUser: {
    maxWidth: '30%',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});

export default ChatPanel;
