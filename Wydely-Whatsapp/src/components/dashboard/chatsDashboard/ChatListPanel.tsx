import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageSourcePropType,
  Platform,
} from 'react-native';
import Svg, { Circle, Line, Path, G } from 'react-native-svg';
import colors from '../../../theme/colors';

// Import avatar SVGs as components
// Note: Path goes from src/components/dashboard/ up to project root, then to assets/
import Avatar1SVG from '../../../../assets/images/avatar-1.svg';
import Avatar2SVG from '../../../../assets/images/avatar-1.svg';
import Avatar3SVG from '../../../../assets/images/avatar-1.svg';
import Avatar4SVG from '../../../../assets/images/avatar-1.svg';

const isMobile = () => Dimensions.get('window').width < 768;

export interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  avatar?: ImageSourcePropType;
  avatarId?: string; // For identifying which SVG to use (e.g., 'avatar-1', 'avatar-2')
  isOnline?: boolean;
  status?: 'double-check' | 'single-check' | 'check' | 'unread';
}

interface ChatListPanelProps {
  chats: ChatItem[];
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
}

// Online status indicator
const OnlineIndicator = () => (
  <View style={styles.onlineIndicatorContainer}>
    <Svg width="8" height="8" viewBox="0 0 8 8">
      <Circle cx="4" cy="4" r="3.5" fill="#27AE60" stroke="white" />
    </Svg>
  </View>
);

// Avatar component with online status
const Avatar = ({
  avatarId,
  name,
  isOnline,
}: {
  source?: ImageSourcePropType;
  avatarId?: string;
  name: string;
  isOnline?: boolean;
}) => {
  // Try to get SVG component if available
  const getSVGComponent = () => {
    if (avatarId === 'avatar-1' || avatarId === '1') return Avatar1SVG;
    if (avatarId === 'avatar-2' || avatarId === '2') return Avatar2SVG;
    if (avatarId === 'avatar-3' || avatarId === '3') return Avatar3SVG;
    if (avatarId === 'avatar-4' || avatarId === '4') return Avatar4SVG;
    return null;
  };

  const AvatarSVG = getSVGComponent();
  const initial = name && name.length > 0 ? name.charAt(0).toUpperCase() : '?';

  // Temporarily disable SVG rendering to show initials
  const useSVG = false; // Set to true when SVG images are fixed

  return (
    <View style={styles.avatarWrapper}>
      {AvatarSVG && useSVG ? (
        <View style={styles.svgContainer}>
          <AvatarSVG width={36} height={36} />
        </View>
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
      )}
      {isOnline && <OnlineIndicator />}
    </View>
  );
};

// Double check icon
const DoubleCheckIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 14 14">
    <G>
      <Path
        d="M4.08341 7.00008L6.41675 9.33341L12.2501 3.50008M1.75008 7.00008L4.08341 9.33341M9.33341 3.50008L7.58341 5.25008"
        fill="none"
        stroke="#27AE60"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);

// Single check icon
const SingleCheckIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 14 14">
    <G>
      <Path
        d="M11.6666 3.5L4.66663 10.5L1.33329 7.16667"
        fill="none"
        stroke="#27AE60"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);

// White check icon (read status)
const WhiteCheckIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 12 12">
    <G>
      <Path
        d="M10 3L4 9L1 6"
        fill="none"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);

// Unread badge
const UnreadBadge = ({ count }: { count: number }) => (
  <View style={styles.unreadBadge}>
    <Text style={styles.unreadText}>{count}</Text>
  </View>
);

// Status indicator
const StatusIndicator = ({ status, unreadCount }: { status?: string; unreadCount?: number }) => {
  if (status === 'unread' && unreadCount) {
    return <UnreadBadge count={unreadCount} />;
  }
  if (status === 'double-check') {
    return <DoubleCheckIcon />;
  }
  if (status === 'single-check') {
    return <SingleCheckIcon />;
  }
  if (status === 'check') {
    return <WhiteCheckIcon />;
  }
  return null;
};

// Separator line
const Separator = () => (
  <View style={styles.separatorContainer}>
    <Svg width="100%" height="1" viewBox="0 0 366 1" preserveAspectRatio="none">
      <Line x1="0.5" y1="0.5" x2="365.5" y2="0.5" stroke="#EAECF0" strokeLinecap="round" />
    </Svg>
  </View>
);

const ChatListPanel: React.FC<ChatListPanelProps> = ({ chats, selectedChatId, onChatSelect }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {chats.map((chat, index) => {
            const isSelected = selectedChatId === chat.id;
            return (
              <React.Fragment key={chat.id}>
                <TouchableOpacity
                  style={[styles.chatItem, isSelected && styles.chatItemActive]}
                  onPress={() => onChatSelect(chat.id)}
                >
                  <View style={styles.chatItemInner}>
                    <View style={styles.leftSection}>
                      <Avatar avatarId={chat.avatarId} name={chat.name} isOnline={chat.isOnline} />
                      <View style={styles.textContainer}>
                        <Text style={styles.name} numberOfLines={1}>
                          {chat.name}
                        </Text>
                        <Text
                          style={[
                            styles.message,
                            chat.lastMessage.startsWith('you:') && styles.messageYou,
                          ]}
                          numberOfLines={1}
                        >
                          {chat.lastMessage}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rightSection}>
                      <Text style={styles.time}>{chat.timestamp}</Text>
                      <View style={styles.statusContainer}>
                        <StatusIndicator status={chat.status} unreadCount={chat.unreadCount} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                {index < chats.length - 1 && <Separator />}
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.borderRight} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: isMobile() ? '100%' : '21.3%',
    flex: isMobile() ? 1 : undefined,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  chatList: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 12,
  },
  chatItem: {
    height: 60,
    width: '100%',
  },
  chatItemActive: {
    backgroundColor: 'rgba(218, 237, 213, 0.7)',
  },
  chatItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarWrapper: {
    width: 36,
    height: 36,
    position: 'relative',
  },
  svgContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary, // Purple color from avatar SVGs
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicatorContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 8,
    height: 8,
  },
  avatarText: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif-medium',
      default: 'Albert Sans',
    }),
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  textContainer: {
    gap: 2,
    flex: 1,
  },
  name: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif-medium',
      default: 'Albert Sans',
    }),
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 16,
    color: '#0C111D',
  },
  message: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'Albert Sans',
    }),
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#98A2B3',
  },
  messageYou: {
    color: '#0C111D',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 6,
  },
  time: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'Albert Sans',
    }),
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#475467',
  },
  statusContainer: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadge: {
    backgroundColor: '#27AE60',
    borderRadius: 91,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'Albert Sans',
    }),
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 16,
    color: '#FFFFFF',
  },
  separatorContainer: {
    height: 1,
    width: '100%',
  },
  borderRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#EAECF0',
  },
});

export default ChatListPanel;
