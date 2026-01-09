// Device information utility for API headers
import { Platform } from 'react-native';

export interface DeviceInfo {
  id: string;
  os: string;
  type: string;
  osVersion: string;
  appVersion: string;
  userAgent: string;
  model: string;
}

// Generate or retrieve device ID (stored in localStorage for web, or generated)
const getDeviceId = (): string => {
  if (typeof window !== 'undefined') {
    try {
      const storage = (window as any).localStorage;
      if (storage) {
        const stored = storage.getItem('device-id');
        if (stored) return stored;
        const newId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        storage.setItem('device-id', newId);
        return newId;
      }
    } catch (e) {
      // localStorage might not be available
    }
  }
  // For native, you might want to use a library like expo-device
  // For now, generate a new ID each time (you may want to use AsyncStorage in React Native)
  return `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get device OS
const getDeviceOS = (): string => {
  if (Platform.OS === 'web') {
    const ua = navigator.userAgent;
    if (ua.includes('Mac')) return 'Mac OS';
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Linux')) return 'Linux';
    return 'Unknown OS';
  }
  return Platform.OS === 'ios' ? 'iOS' : 'Android';
};

// Get device type
const getDeviceType = (): string => {
  if (Platform.OS === 'web') {
    return 'Desktop';
  }
  // For native, you might want to check if it's a tablet
  return 'Mobile';
};

// Get OS version
const getOSVersion = (): string => {
  if (Platform.OS === 'web') {
    const ua = navigator.userAgent;
    // Extract version from user agent (simplified)
    const match = ua.match(/(?:Mac OS X|Windows NT|Linux)\s+([\d._]+)/);
    return match ? match[1] : 'Unknown';
  }
  return Platform.Version.toString();
};

// Get user agent
const getUserAgent = (): string => {
  if (typeof window !== 'undefined') {
    const nav = (window as any).navigator;
    if (nav && nav.userAgent) {
      return nav.userAgent;
    }
  }
  return 'React Native';
};

// Get device model
const getDeviceModel = (): string => {
  if (Platform.OS === 'web') {
    const ua = navigator.userAgent;
    if (ua.includes('Mac')) return 'MacBook Pro';
    if (ua.includes('Windows')) return 'PC';
    return 'Desktop';
  }
  // For native, you might want to use expo-device
  return Platform.OS === 'ios' ? 'iPhone' : 'Android Device';
};

// Get app version (from package.json or constant)
const getAppVersion = (): string => {
  return '1.0.0'; // You can make this dynamic
};

// Get device info object
export const getDeviceInfo = (): DeviceInfo => {
  return {
    id: getDeviceId(),
    os: getDeviceOS(),
    type: getDeviceType(),
    osVersion: getOSVersion(),
    appVersion: getAppVersion(),
    userAgent: getUserAgent(),
    model: getDeviceModel(),
  };
};

// Get device headers for API requests
export const getDeviceHeaders = (): Record<string, string> => {
  const deviceInfo = getDeviceInfo();
  return {
    'device-id': deviceInfo.id,
    'device-os': deviceInfo.os,
    'device-type': deviceInfo.type,
    'device-os-version': deviceInfo.osVersion,
    'device-app-version': deviceInfo.appVersion,
    'device-user-agent': deviceInfo.userAgent,
    'device-model': deviceInfo.model,
  };
};
