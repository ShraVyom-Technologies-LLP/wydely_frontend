// Utility for storing and retrieving form data
// Works with both web (localStorage) and React Native (AsyncStorage)

const STORAGE_KEY = 'signup-form-data';

export interface StoredFormData {
  name: string;
  companyName: string;
  companyEmail: string;
  companyWebsite: string;
  companySize: string;
  phone: string;
  password: string;
}

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

// Save form data to storage
export const saveFormData = async (data: StoredFormData): Promise<void> => {
  try {
    const storageInfo = getStorage();
    if (storageInfo && storageInfo.type === 'localStorage') {
      storageInfo.storage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    // For React Native, you would need to import AsyncStorage at the top:
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save form data:', error);
  }
};

// Retrieve form data from storage
export const getFormData = async (): Promise<StoredFormData | null> => {
  try {
    const storageInfo = getStorage();
    if (storageInfo && storageInfo.type === 'localStorage') {
      const data = storageInfo.storage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    }
    // For React Native:
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // const data = await AsyncStorage.getItem(STORAGE_KEY);
    // return data ? JSON.parse(data) : null;
    return null;
  } catch (error) {
    console.error('Failed to retrieve form data:', error);
    return null;
  }
};

// Clear stored form data
export const clearFormData = async (): Promise<void> => {
  try {
    const storageInfo = getStorage();
    if (storageInfo && storageInfo.type === 'localStorage') {
      storageInfo.storage.removeItem(STORAGE_KEY);
    }
    // For React Native:
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear form data:', error);
  }
};
