import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../theme/colors";
import WLogoIcon from "../../../assets/images/WLogoIcon.svg";
import ChatBubbleIcon from "../icons/ChatBubbleIcon";
import UsersGroupIcon from "../icons/UsersGroupIcon";
import ClockCounterIcon from "../icons/ClockCounterIcon";
import BellNotificationIcon from "../icons/BellNotificationIcon";
import SettingsAsteriskIcon from "../icons/SettingsAsteriskIcon";
import InfoIcon from "../icons/InfoIcon";

interface SidebarProps {
  activeIcon?: string;
  onIconPress?: (icon: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeIcon = "chat",
  onIconPress,
}) => {
  const topIcons = [
    { id: "chat", component: ChatBubbleIcon, hasBadge: true },
  ];

  const middleIcons = [
    { id: "users", component: UsersGroupIcon, hasBadge: true },
    { id: "clock", component: ClockCounterIcon, hasBadge: false },
  ];

  const bottomIcons = [
    { id: "bell", component: BellNotificationIcon, hasBadge: false },
    { id: "settings", component: SettingsAsteriskIcon, hasBadge: false },
    { id: "info", component: InfoIcon, hasBadge: false },
  ];

  const renderIcon = (
    id: string,
    IconComponent: any,
    hasBadge: boolean,
    isActive: boolean
  ) => {
    return (
      <TouchableOpacity
        key={id}
        style={[styles.iconButton, isActive && styles.iconButtonActive]}
        onPress={() => onIconPress?.(id)}
      >
        <View style={styles.iconWrapper}>
          <IconComponent width={20} height={20} color="#FFFFFF" />
          {hasBadge && <View style={styles.badge} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* W Logo */}
      <View style={styles.logoContainer}>
        <WLogoIcon width={32} height={32} />
      </View>

      {/* Top Icon - Chat */}
      <View style={styles.topIconsContainer}>
        {topIcons.map(({ id, component, hasBadge }) =>
          renderIcon(id, component, hasBadge, activeIcon === id)
        )}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Middle Icons */}
      <View style={styles.middleIconsContainer}>
        {middleIcons.map(({ id, component, hasBadge }) =>
          renderIcon(id, component, hasBadge, activeIcon === id)
        )}
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Bottom Icons */}
      <View style={styles.bottomIconsContainer}>
        {bottomIcons.map(({ id, component, hasBadge }) =>
          renderIcon(id, component, hasBadge, activeIcon === id)
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    backgroundColor: colors.sidebarBg,
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 16,
  },
  logoContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  topIconsContainer: {
    alignItems: "center",
    gap: 4,
  },
  divider: {
    width: 37,
    height: 1,
    backgroundColor: "#64748B",
    marginVertical: 24,
  },
  middleIconsContainer: {
    alignItems: "center",
    gap: 12,
  },
  spacer: {
    flex: 1,
  },
  bottomIconsContainer: {
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  iconButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  iconWrapper: {
    position: "relative",
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F9F916",
    borderWidth: 1,
    borderColor: colors.sidebarBg,
  },
});

export default Sidebar;