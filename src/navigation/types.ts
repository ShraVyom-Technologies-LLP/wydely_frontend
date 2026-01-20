// Navigation types for type safety
export type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  OTP: { email: string; phoneNumber: string; from?: 'login' | 'signup' };
  Projects: undefined;
  Dashboard: { initialIcon?: string; userName?: string; projectId?: string } | undefined;
  Profile: undefined;
  BroadcastCampaign: { projectId?: string } | undefined;
  BroadcastCampaignPreview: {
    campaignName: string;
    templateName: string;
    templateContent: string;
    audienceSize?: number | string;
    projectId?: string;
    campaignCost: number;
    walletBalance: number;
  };
  ExistingCampaigns: { projectId?: string } | undefined;
  CreateCampaigns: { projectId?: string } | undefined;
  // Add more screens as needed
};

// Screen names as constants
export const SCREENS = {
  SIGN_UP: 'SignUp',
  LOGIN: 'Login',
  OTP: 'OTP',
  PROJECTS: 'Projects',
  DASHBOARD: 'Dashboard',
  PROFILE: 'Profile',
  BROADCAST_CAMPAIGN: 'BroadcastCampaign',
  BROADCAST_CAMPAIGN_PREVIEW: 'BroadcastCampaignPreview',
  EXISTING_CAMPAIGNS: 'ExistingCampaigns',
  CREATE_CAMPAIGNS: 'CreateCampaigns',
} as const;
