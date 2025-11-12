import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import colors from "../../theme/colors";

const isMobile = () => Dimensions.get("window").width < 768;

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  status: string;
  lastActive: string;
  templateMessages: number;
  sessionMessages: number;
  source: string;
  mauStatus: string;
  incoming: string;
}

interface UserProfilePanelProps {
  profile?: UserProfile;
}

const UserProfilePanel: React.FC<UserProfilePanelProps> = ({ profile }) => {
  if (profile) {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>User Profile</Text>

            {/* Profile Picture */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {profile.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Name and Phone */}
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.phone}>{profile.phone}</Text>

            {/* Status Information */}
            <View style={styles.infoSection}>
              <InfoRow label="Status" value={profile.status} />
              <InfoRow label="Last Active" value={profile.lastActive} />
              <InfoRow
                label="Template Messages"
                value={profile.templateMessages.toString()}
              />
              <InfoRow
                label="Session Messages"
                value={profile.sessionMessages.toString()}
              />
              <InfoRow label="Source" value={profile.source} />
              <InfoRow label="MAU Status" value={profile.mauStatus} />
              <InfoRow label="Incoming" value={profile.incoming} />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
};

const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: isMobile() ? "100%" : 376,
    flex: isMobile() ? 1 : undefined,
    backgroundColor: colors.chatListBg,
    borderRightWidth: isMobile() ? 0 : 1,
    borderRightColor: colors.border,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 24,
    alignSelf: "flex-start",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  phone: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 32,
  },
  infoSection: {
    width: "100%",
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
});

export default UserProfilePanel;
