import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface UserProfileCardProps {
  // These will come from API
  name?: string;
  role?: string;
  phoneNumber?: string;
  avatarInitial?: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  name = 'Harshil Bhandari',
  role = 'ADMIN',
  phoneNumber = '+919690008019',
  avatarInitial = 'HB',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{avatarInitial}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.roleBadge}>
        <Text style={styles.roleText}>{role}</Text>
      </View>
      <Text style={styles.phoneNumber}>{phoneNumber}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAECF0',
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#A8F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
  },
  roleBadge: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#667085',
    fontFamily: 'Albert Sans',
  },
  phoneNumber: {
    fontSize: 14,
    fontWeight: '400',
    color: '#667085',
    fontFamily: 'Albert Sans',
  },
});

export default UserProfileCard;
