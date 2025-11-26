// Navigation types for type safety
export type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  OTP: { email: string; from?: 'login' | 'signup' };
  Dashboard: { initialIcon?: string } | undefined;
  Profile: undefined;
  BroadcastCampaign: undefined;
  // Add more screens as needed
};

// Screen names as constants
export const SCREENS = {
  SIGN_UP: 'SignUp',
  LOGIN: 'Login',
  OTP: 'OTP',
  DASHBOARD: 'Dashboard',
  PROFILE: 'Profile',
  BROADCAST_CAMPAIGN: 'BroadcastCampaign',
} as const;
