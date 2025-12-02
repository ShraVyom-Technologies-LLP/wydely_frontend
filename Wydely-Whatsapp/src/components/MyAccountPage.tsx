import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import colors from '../theme/colors';
import { RootStackParamList } from '../navigation/types';
import editIcon from '../../assets/images/edit_profile.png';
import EyeOffIcon from './icons/EyeOffIcon';
import EyeIcon from '../../assets/icons/eye.svg';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

const displayName = 'Harshil';
const email = 'Harshilbhandari1997@gmail.com';
const whatsappNumber = '919690008019';
const userName = 'harshilbhandari1997@gmail.com';
const userPassword = 'arpi7890.';

const MyAccountPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const initial = displayName.charAt(0).toUpperCase();
  const [showPassword, setShowPassword] = useState(false);

  const displayedPassword = showPassword ? userPassword : userPassword.replace(/./g, '*');

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Account</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile</Text>

          {/* Company Logo / Initial */}
          <View style={styles.logoBlock}>
            <Text style={styles.logoLabel}>
              Company Logo
              <Text style={styles.logoRequired}>*</Text>
            </Text>

            <View style={styles.logoAvatarWrapper}>
              <View style={styles.logoAvatar}>
                <Text style={styles.logoInitial}>{initial}</Text>
              </View>

              <View style={styles.logoEditBadge}>
                <Image source={editIcon} style={{ width: 24, height: 24 }} />
              </View>
            </View>
          </View>

          {/* Fields */}
          <View style={styles.fieldsColumn}>
            <View style={styles.fieldRow}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Display Name</Text>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValue}>{displayName}</Text>
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Email</Text>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValue} numberOfLines={1} ellipsizeMode="tail">
                    {email}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>WhatsApp Number</Text>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValue}>{whatsappNumber}</Text>
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>User Name</Text>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValue} numberOfLines={1} ellipsizeMode="tail">
                    {userName}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <Text style={styles.fieldValue} numberOfLines={1} ellipsizeMode="tail">
                    {displayedPassword}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    style={styles.passwordIconButton}
                  >
                    {showPassword ? (
                      <EyeIcon width={20} height={20} color="#344054" />
                    ) : (
                      <EyeOffIcon width={20} height={20} color="#344054" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.fieldPlaceholder} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(28,28,28,0.10)',
    backgroundColor: colors.bg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  logoutButton: {
    height: 36,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#344054',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#344054',
  },
  scrollContent: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 992,
    backgroundColor: colors.bg,
    borderRadius: 24,
    padding: 48,
    borderWidth: 1,
    borderColor: '#EAECF0',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0C111D',
    marginBottom: 32,
  },
  logoBlock: {
    marginBottom: 24,
  },
  logoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#344054',
    marginBottom: 8,
  },
  logoRequired: {
    color: '#FF0004',
  },
  logoAvatarWrapper: {
    width: 84,
    height: 84,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D9DBE9',
    backgroundColor: '#00E0A4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoAvatar: {
    width: 84,
    height: 84,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInitial: {
    fontSize: 40,
    fontWeight: '500',
    color: '#0C111D',
  },
  logoEditBadge: {
    position: 'absolute',
    right: 6,
    bottom: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4A3AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEditText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  fieldsColumn: {
    flex: 1,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  field: {
    flex: 1,
  },
  fieldPlaceholder: {
    flex: 1,
    opacity: 0,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#344054',
    marginBottom: 8,
  },
  fieldValueContainer: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F5F7F9',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
  },
  passwordContainer: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F5F7F9',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passwordIconButton: {
    paddingLeft: 8,
  },
});

export default MyAccountPage;
