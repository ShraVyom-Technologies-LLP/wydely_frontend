// Utility for storing and retrieving authentication data
// Works with both web (localStorage) and React Native (AsyncStorage)

const AUTH_STORAGE_KEY = 'wydely-auth-data';

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  wydelyBusinessId: string;
  accessTokenExpiresAt: string; // ISO date string
  email: string;
}

// Helper to normalize date string to ISO format
// Ensures UTC dates are properly formatted for storage
const normalizeDateString = (dateString: string | undefined | null): string => {
  if (!dateString) {
    throw new Error('accessTokenExpiresAt is required');
  }

  try {
    let date: Date;

    // Check if the string has a timezone indicator (Z, +HH:MM, or -HH:MM)
    // Examples: "2026-01-16T09:10:13Z", "2026-01-16T09:10:13+05:30", "2026-01-16T09:10:13-05:00"
    const hasTimezone = dateString.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateString);

    console.log('normalizeDateString - Input:', dateString, 'Has timezone:', hasTimezone);

    if (hasTimezone) {
      // Has timezone indicator, parse directly
      date = new Date(dateString);
    } else {
      // No timezone indicator - assume it's UTC and append 'Z'
      // This handles cases like "2026-01-16T09:10:13" which should be treated as UTC
      // Important: API returns UTC times, so we must treat them as UTC, not local time
      const utcDateString = `${dateString}Z`;
      console.log('normalizeDateString - No timezone, appending Z:', utcDateString);
      date = new Date(utcDateString);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string: ${dateString}`);
    }

    // Convert to ISO string with UTC timezone (always ends with 'Z')
    // This ensures consistent format regardless of input format
    const normalized = date.toISOString();
    console.log('normalizeDateString - Normalized to:', normalized);
    return normalized;
  } catch (error) {
    console.error('Failed to normalize date string:', error, 'Input:', dateString);
    throw new Error(`Failed to normalize date string: ${dateString}`);
  }
};

// Helper to get storage
const getStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const storage = (window as { localStorage?: Storage }).localStorage;
      if (storage) {
        return {
          type: 'localStorage' as const,
          storage,
        };
      }
    } catch (e) {
      // localStorage not available
    }
  }
  return null;
};

// Save auth data to storage
export const saveAuthData = async (data: AuthData): Promise<void> => {
  try {
    // Normalize the accessTokenExpiresAt to ensure it's in proper ISO format
    const normalizedData: AuthData = {
      ...data,
      accessTokenExpiresAt: normalizeDateString(data.accessTokenExpiresAt),
    };

    const storageInfo = getStorage();
    if (storageInfo && storageInfo.type === 'localStorage') {
      storageInfo.storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedData));
    }
    // For React Native, you would need to import AsyncStorage:
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedData));
  } catch (error) {
    console.error('Failed to save auth data:', error);
    throw error;
  }
};

// Retrieve auth data from storage
export const getAuthData = async (): Promise<AuthData | null> => {
  try {
    const storageInfo = getStorage();
    if (storageInfo && storageInfo.type === 'localStorage') {
      const data = storageInfo.storage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    }
    // For React Native:
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // const data = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    // return data ? JSON.parse(data) : null;
    return null;
  } catch (error) {
    console.error('Failed to retrieve auth data:', error);
    return null;
  }
};

// Clear auth data from storage
export const clearAuthData = async (): Promise<void> => {
  try {
    const storageInfo = getStorage();
    if (storageInfo && storageInfo.type === 'localStorage') {
      storageInfo.storage.removeItem(AUTH_STORAGE_KEY);
    }
    // For React Native:
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear auth data:', error);
    throw error;
  }
};

// Check if access token is expired
export const isTokenExpired = (expiresAt: string): boolean => {
  try {
    // Ensure the expiry date string is treated as UTC
    // If it doesn't have 'Z', append it to force UTC parsing
    const utcExpiresAt = expiresAt.endsWith('Z') ? expiresAt : `${expiresAt}Z`;
    const expiryDate = new Date(utcExpiresAt);

    // Get current time in UTC for accurate comparison
    const now = new Date();

    // Log for debugging (shows local time, but comparison is done in UTC)
    console.log(
      'isTokenExpired - Expiry (UTC):',
      expiryDate.toISOString(),
      'Now (UTC):',
      now.toISOString()
    );
    console.log('isTokenExpired - Expiry (Local):', expiryDate, 'Now (Local):', now);

    // Compare UTC timestamps directly
    // Add 30 second buffer to account for clock skew and network delays
    const expiryTime = expiryDate.getTime();
    const nowTime = now.getTime();
    const isExpired = nowTime >= expiryTime - 30000;

    console.log(
      'isTokenExpired - Expiry timestamp:',
      expiryTime,
      'Now timestamp:',
      nowTime,
      'Is expired:',
      isExpired
    );

    return isExpired;
  } catch (error) {
    console.error('Failed to check token expiration:', error, 'ExpiresAt:', expiresAt);
    return true; // Assume expired if we can't parse the date
  }
};

// Get auth data and check if token is valid
export const getValidAuthData = async (): Promise<AuthData | null> => {
  const authData = await getAuthData();
  console.log('getValidAuthData', authData);
  if (!authData) {
    return null;
  }

  // Check if token is expired
  if (isTokenExpired(authData.accessTokenExpiresAt)) {
    // Token is expired, clear it
    console.log('token is expired, clearing auth data');
    await clearAuthData();
    return null;
  }

  return authData;
};
