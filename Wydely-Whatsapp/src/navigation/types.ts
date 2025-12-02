// Navigation types for type safety
export type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  OTP: { email: string; from?: 'login' | 'signup' };
  Dashboard: { initialIcon?: string; userName?: string } | undefined;
  Profile: undefined;
  BroadcastCampaign: undefined;
  BroadcastCampaignPreview: {
    campaignName: string;
    templateName: string;
    templateContent: string;
    audienceSize?: number | string;
  };
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
  BROADCAST_CAMPAIGN_PREVIEW: 'BroadcastCampaignPreview',
} as const;
