import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import colors from '../theme/colors';
import { RootStackParamList } from '../navigation/types';
import editIcon from '../../assets/images/edit_profile.png';
import EyeOffIcon from './icons/EyeOffIcon';
import EyeIcon from '../../assets/icons/eye.svg';
import { apiService, UserAccountProfile } from '../services/api';
import LoadingScreen from './LoadingScreen';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

const MyAccountPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [profile, setProfile] = useState<UserAccountProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editValues, setEditValues] = useState<{
    displayName: string;
    userName: string;
    password: string;
  } | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const response = await apiService.getUserProfile();
    if (response.success && response.data) {
      setProfile(response.data);
      setError(null);
    } else {
      setError(response.error || 'Failed to load profile');
      setProfile(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const displayName = profile?.displayName ?? '';
  const email = profile?.email ?? '';
  const whatsappNumber = profile?.whatsappNumber ?? '';
  const userName = profile?.userName ?? '';
  // We never receive password from backend; always treat it as write-only
  const userPasswordPlaceholder = '********';

  const initial = (displayName || userName || 'H').charAt(0).toUpperCase();

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const handleEditProfile = () => {
    if (!profile) return;
    setEditValues({
      displayName: profile.displayName,
      userName: profile.userName,
      password: '',
    });
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditValues(null);
  };

  const handleSaveProfile = async () => {
    if (!editValues) return;
    setSaving(true);
    const response = await apiService.updateUserProfile({
      displayName: editValues.displayName,
      userName: editValues.userName,
      password: editValues.password,
    });
    if (response.success && response.data) {
      setProfile(response.data);
      setError(null);
      setIsEditingProfile(false);
      setEditValues(null);
    } else {
      setError(response.error || 'Failed to update profile');
    }
    setSaving(false);
  };

  // Show common loading / error screen until profile loads successfully
  if (!profile || loading) {
    return (
      <LoadingScreen
        message="Loading profile..."
        error={!loading ? error : null}
        onRetry={!loading ? fetchProfile : undefined}
      />
    );
  }

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

          {error && <Text style={styles.errorText}>{error}</Text>}

          {loading && !profile && <Text style={styles.helperText}>Loading profile...</Text>}

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

              <TouchableOpacity
                onPress={() => {
                  handleEditProfile();
                }}
                style={styles.logoEditBadge}
              >
                <Image source={editIcon} style={{ width: 24, height: 24 }} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Fields */}
          <View style={styles.fieldsColumn}>
            <View style={styles.fieldRow}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Display Name</Text>
                <View style={styles.fieldValueContainer}>
                  {isEditingProfile ? (
                    <TextInput
                      style={styles.editInput}
                      value={editValues?.displayName ?? ''}
                      onChangeText={(text) =>
                        setEditValues((prev) =>
                          prev
                            ? { ...prev, displayName: text }
                            : { displayName: text, userName, password: '' }
                        )
                      }
                    />
                  ) : (
                    <Text style={styles.fieldValue}>{displayName}</Text>
                  )}
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
                  {isEditingProfile ? (
                    <TextInput
                      style={styles.editInput}
                      value={editValues?.userName ?? ''}
                      onChangeText={(text) =>
                        setEditValues((prev) =>
                          prev
                            ? { ...prev, userName: text }
                            : { displayName, userName: text, password: '' }
                        )
                      }
                    />
                  ) : (
                    <Text style={styles.fieldValue} numberOfLines={1} ellipsizeMode="tail">
                      {userName}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  {isEditingProfile ? (
                    <TextInput
                      style={styles.editInput}
                      value={editValues?.password ?? ''}
                      secureTextEntry={!showPassword}
                      onChangeText={(text) =>
                        setEditValues((prev) =>
                          prev
                            ? { ...prev, password: text }
                            : { displayName, userName, password: text }
                        )
                      }
                    />
                  ) : (
                    <Text style={styles.fieldValue} numberOfLines={1} ellipsizeMode="tail">
                      {userPasswordPlaceholder}
                    </Text>
                  )}
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

            {isEditingProfile && (
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleCancelEdit}
                  disabled={saving}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSaveProfile}
                  disabled={saving}
                >
                  <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
                </TouchableOpacity>
              </View>
            )}
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
  editInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
    paddingVertical: 0,
    paddingHorizontal: 0,
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
  errorText: {
    marginBottom: 16,
    fontSize: 12,
    color: colors.error,
  },
  helperText: {
    marginBottom: 16,
    fontSize: 12,
    color: colors.textMuted,
  },
  actionsRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    minWidth: 80,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  saveButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default MyAccountPage;
