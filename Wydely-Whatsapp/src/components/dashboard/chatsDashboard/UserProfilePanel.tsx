import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import colors from '../../../theme/colors';

const isMobile = () => Dimensions.get('window').width < 768;

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  status?: string;
  lastActive?: string;
  templateMessages?: number;
  sessionMessages?: number;
  source?: string;
  mauStatus?: string;
  incoming?: string;
}

interface UserProfilePanelProps {
  profile?: UserProfile;
}

// Three-dot menu icon
const MenuIcon: React.FC = () => (
  <View style={styles.menuIcon}>
    <View style={styles.menuDot} />
    <View style={styles.menuDot} />
    <View style={styles.menuDot} />
  </View>
);

const UserProfilePanel: React.FC<UserProfilePanelProps> = ({ profile }) => {
  if (profile) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header with title and menu */}
            <View style={styles.header}>
              <Text style={styles.title}>User Profile</Text>
              <TouchableOpacity>
                <MenuIcon />
              </TouchableOpacity>
            </View>

            {/* Profile Picture with Ring */}
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarRing}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{profile.name.charAt(0).toUpperCase()}</Text>
                  </View>
                </View>
              </View>

              {/* Name and Phone */}
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{profile.name}</Text>
                <Text style={styles.phone}>{profile.phone}</Text>
              </View>
            </View>

            {/* Status Information */}
            <View style={styles.infoSection}>
              <View style={styles.infoContainer}>
                <View style={styles.labelsColumn}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <Text style={styles.infoLabel}>Last Active</Text>
                  <Text style={styles.infoLabel}>Template Messages</Text>
                  <Text style={styles.infoLabel}>Session Messages</Text>
                  <Text style={styles.infoLabel}>Source</Text>
                  <Text style={styles.infoLabel}>MAU Status</Text>
                  <Text style={styles.infoLabel}>Incoming</Text>
                </View>
                <View style={styles.valuesColumn}>
                  <Text style={styles.infoValue}>{profile.status}</Text>
                  <Text style={styles.infoValue}>{profile.lastActive}</Text>
                  <Text style={styles.infoValue}>{profile.templateMessages.toString()}</Text>
                  <Text style={styles.infoValue}>{profile.sessionMessages.toString()}</Text>
                  <Text style={styles.infoValue}>{profile.source}</Text>
                  <Text style={styles.infoValue}>{profile.mauStatus}</Text>
                  <Text style={styles.infoValue}>{profile.incoming}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    width: isMobile() ? '100%' : 376,
    flex: isMobile() ? 1 : undefined,
    backgroundColor: '#FFFFFF',
    borderRightWidth: isMobile() ? 0 : 1,
    borderRightColor: colors.border,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0C111D',
    textTransform: 'capitalize',
  },
  menuIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '90deg' }],
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0C111D',
    marginVertical: 2,
  },
  profileSection: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 36,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8E5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0C111D',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  phone: {
    fontSize: 14,
    fontWeight: '400',
    color: '#667085',
    textAlign: 'center',
  },
  infoSection: {
    width: '100%',
  },
  infoContainer: {
    backgroundColor: '#F7F9FB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelsColumn: {
    flexDirection: 'column',
    gap: 12,
    alignItems: 'flex-start',
  },
  valuesColumn: {
    flexDirection: 'column',
    gap: 12,
    alignItems: 'flex-end',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#475467',
    lineHeight: 18,
  },
  infoValue: {
    fontSize: 12,
    color: '#0C111D',
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'right',
  },
});

export default UserProfilePanel;
