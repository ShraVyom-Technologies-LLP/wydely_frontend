import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChatItem } from './ChatListPanel';

interface ChatTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  chats: ChatItem[];
}

const ChatTabs: React.FC<ChatTabsProps> = ({ activeTab, onTabChange, chats }) => {
  // Calculate tab counts from chats (in a real app, this would come from the API)
  const getTabCount = (tabId: string): number => {
    // For now, return mock counts. In a real app, filter chats by status
    const tabCounts: Record<string, number> = {
      active: chats.filter((c) => !c.unreadCount || c.unreadCount === 0).length || 1,
      requesting: 4,
      intervened: 8,
      history: chats.length || 34,
    };
    return tabCounts[tabId] || 0;
  };

  const tabs = [
    { id: 'active', label: 'Active', count: getTabCount('active') },
    { id: 'requesting', label: 'Requesting', count: getTabCount('requesting') },
    { id: 'intervened', label: 'Intervened', count: getTabCount('intervened') },
    {
      id: 'history',
      label: 'History',
      count: getTabCount('history'),
      hasSeparator: true,
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <React.Fragment key={tab.id}>
            {tab.hasSeparator && <View style={styles.tabSeparator} />}
            <TouchableOpacity
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onTabChange(tab.id)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
              <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
                <Text style={[styles.countText, isActive && styles.countTextActive]}>
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
      <View style={styles.tabSpacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#EAECF0',
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 44,
    width: '100%',
    gap: 7,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
    gap: 6,
    marginRight: 28,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#155A03',
  },
  tabSeparator: {
    width: 1,
    height: 25,
    backgroundColor: '#98A2B3',
    marginRight: 28,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#667085',
    fontFamily: 'Albert Sans',
  },
  tabTextActive: {
    color: '#155A03',
  },
  countBadge: {
    backgroundColor: '#D3D3D3',
    borderRadius: 5,
    paddingHorizontal: 0,
    paddingVertical: 0,
    minWidth: 18,
    minHeight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeActive: {
    backgroundColor: '#155A03',
  },
  countText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 12,
    color: '#667085',
    fontFamily: 'Albert Sans',
  },
  countTextActive: {
    color: '#FFFFFF',
  },
  tabSpacer: {
    flex: 1,
    backgroundColor: '#EAECF0',
  },
});

export default ChatTabs;
