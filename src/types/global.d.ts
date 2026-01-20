/// <reference types="react" />
/// <reference types="react-native" />

// Global window type for web platform checks
declare global {
  interface Window {
    location: Location;
  }

  let window: Window | undefined;
}

export {};
