import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ImageSourcePropType, Text } from 'react-native';
import WLogoIcon from '../icons/WLogoIcon';

interface SidebarProps {
  activeIcon?: string;
  onIconPress?: (icon: string) => void;
  userInitial?: string;
}

const navItems: { [key: string]: ImageSourcePropType } = {
  home: require('../../../assets/images/nav_item_1.png'),
  messages: require('../../../assets/images/nav_item_2.png'),
  campaigns: require('../../../assets/images/nav_item_4.png'),
  contacts: require('../../../assets/images/nav_item_5.png'),
  notifications: require('../../../assets/images/nav_item_6.png'),
  settings: require('../../../assets/images/nav_item_7.png'),
  help: require('../../../assets/images/nav_item_8.png'),
};

const NavItem = ({
  isActive,
  onPress,
  icon,
}: {
  isActive: boolean;
  onPress: () => void;
  icon: ImageSourcePropType;
}) => (
  <TouchableOpacity style={[styles.navItem, isActive && styles.navItemActive]} onPress={onPress}>
    <Image
      source={icon}
      style={[styles.navIcon, { tintColor: isActive ? '#0B1A07' : '#FFFFFF' }]}
      resizeMode="contain"
    />
  </TouchableOpacity>
);

const Sidebar: React.FC<SidebarProps> = ({ activeIcon = 'home', onIconPress, userInitial }) => {
  const initial = (userInitial || 'P').charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      {/* W Logo */}
      <View style={styles.logoContainer}>
        <WLogoIcon width={32} height={32} />
      </View>

      {/* Top Navigation Group */}
      <View style={styles.nav}>
        <NavItem
          isActive={activeIcon === 'home'}
          onPress={() => onIconPress?.('home')}
          icon={navItems.home}
        />
        <NavItem
          isActive={activeIcon === 'messages'}
          onPress={() => onIconPress?.('messages')}
          icon={navItems.messages}
        />
        <NavItem
          isActive={activeIcon === 'campaigns'}
          onPress={() => onIconPress?.('campaigns')}
          icon={navItems.campaigns}
        />
        <NavItem
          isActive={activeIcon === 'contacts'}
          onPress={() => onIconPress?.('contacts')}
          icon={navItems.contacts}
        />
      </View>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
      </View>

      {/* Bottom Navigation Group */}
      <View style={styles.nav}>
        <NavItem
          isActive={activeIcon === 'notifications'}
          onPress={() => onIconPress?.('notifications')}
          icon={navItems.notifications}
        />
        <NavItem
          isActive={activeIcon === 'settings'}
          onPress={() => onIconPress?.('settings')}
          icon={navItems.settings}
        />
        <NavItem
          isActive={activeIcon === 'help'}
          onPress={() => onIconPress?.('help')}
          icon={navItems.help}
        />
      </View>

      {/* Profile Avatar at bottom */}
      <View style={styles.profileContainer}>
        <TouchableOpacity
          onPress={() => onIconPress?.('profile')}
          style={[styles.profileAvatar, activeIcon === 'profile' && styles.profileAvatarActive]}
        >
          <Text style={styles.profileInitial}>{initial}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: '100%',
    alignSelf: 'stretch', // fills parent height in row layout
    flexShrink: 0,
    backgroundColor: '#0B1A07',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 24,
    paddingBottom: 24,
    gap: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.07,
    shadowRadius: 44,
    elevation: 5,
  },
  logoContainer: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  nav: {
    flexDirection: 'column',
    gap: 4,
    paddingHorizontal: 8,
  },
  navItem: {
    padding: 12,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItemActive: {
    backgroundColor: '#FFFFFF',
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  dividerContainer: {
    width: 36,
    height: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#64748B',
    width: '100%',
  },
  profileContainer: {
    marginTop: 'auto',
    paddingHorizontal: 8,
  },
  profileAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#A8F8FF',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarActive: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  profileInitial: {
    fontSize: 20,
    fontWeight: '500',
    color: '#0C111D',
  },
});

export default Sidebar;
