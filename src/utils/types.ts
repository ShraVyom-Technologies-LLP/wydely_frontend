export interface SignUpData {
  name: string;
  bizName: string;
  email: string;
  websiteUrl: string;
  mobileNo: string;
  password: string;
  businessSize: string;
}

export interface SignUpResponse {
  message: string;
  email: string;
  mobileNo: string;
  wydelyBusinessId: string;
  emailOtp?: string;
  whatsappOtp?: string;
}

export interface VerifyOtpData {
  email: string;
  emailOtp: string;
  // whatsappOtp: string;
}

export interface VerifyOtpResponse {
  accessTokenExpiresAt: string;
  sessionId: string;
  message: string;
  wydelyBusinessId: string;
  accessToken: string;
  email: string;
  refreshToken: string;
}

export interface LoginUser {
  id: number;
  wydelyBusinessId: string;
  businessName: string;
  businessEmail: string;
  businessWebsiteUrl: string;
  businessWhatsappNumber: string;
  isVerifiedUser: boolean;
  isActive: boolean;
  createdAt: string;
  appVersion: string;
}

export interface LoginResponse {
  accessTokenExpiresAt: string;
  sessionId: string;
  message: string;
  wydelyBusinessId: string;
  accessToken: string;
  email: string;
  refreshToken: string;
  loginMethod?: 'otp' | 'password';
}

export interface SendOtpResponse {
  message: string;
  email: string;
  mobileNo: string;
  otp?: string;
}

export interface ErrorResponse {
  displayError: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ErrorResponse | string; // Can be ErrorResponse object or string for backward compatibility
}

export interface TemplateOption {
  id: string;
  title: string;
  message: string;
  content: {
    text: boolean;
    image: boolean;
    button: boolean;
  };
  buttonText?: string;
  buttonCta?: string;
  tags: string[];
}

export interface UserAccountProfile {
  displayName: string;
  email: string;
  whatsappNumber: string;
  userName: string;
}

export type Contact = {
  id: string;
  name: string;
  mobileNumber: string;
  tags: string;
  source: string;
  status: 'Inactive' | 'Active';
  state: string;
  lastActive: string;
  optedIn: 'Yes' | 'No' | '-';
  mauStatus: 'Active' | 'Inactive';
  conversationStatus: 'Active' | 'Inactive';
};

type CampaignType = 'broadcast' | 'api';

export type Campaign = {
  id: string;
  name: string;
  type: CampaignType;
  createdAt: string;
  status: 'Active' | 'Inactive';
  audience: string;
};

export interface CreateCampaignData {
  campaignName: string;
  templateId: string;
  projectId?: string;
  // Add other filter criteria if needed
}

export interface CreateCampaignResponse {
  campaignName: string;
  templateName: string;
  templateContent: TemplateOption;
  audienceSize: number;
  campaignCost: number;
  walletBalance: number;
}

export type ProjectStatus = 'verified' | 'pending';

export type Project = {
  // Core fields (mapped from API)
  id: string; // from projectId
  name: string;
  wabaPhoneNumber: string; // from waNumber
  status: ProjectStatus; // derived from isWhatsappVerified
  activePlan: string;
  createdAt: string;

  // Additional API response fields
  projectId?: string;
  type?: string;
  businessId?: string;
  planActivatedOn?: number;
  sandbox?: boolean;
  createdAtTimestamp?: number;
  updatedAtTimestamp?: number;
  planRenewalOn?: number | null;
  scheduledSubscriptionChanges?: unknown | null;
  waNumber?: string;
  waMessagingTier?: string;
  billingCurrency?: string;
  timezone?: string;
  subscriptionStartedOn?: number | null;
  isWhatsappVerified?: boolean;
  dailyTemplateLimit?: number;
  wabaAppStatus?: string | null;
  error?: string | null;
  userEmail?: string;
  wabaId?: string;
};

export interface CreateProjectData {
  name: string;
}

export interface CreateProjectResponse {
  message: string;
  project: Project;
}

// Raw API response type (what the API actually returns)
export interface RawProjectApiResponse {
  id: number;
  type: string;
  projectId: string;
  name: string;
  businessId: string;
  planActivatedOn: number;
  status: string;
  sandbox: boolean;
  activePlan: string;
  createdAtTimestamp: number;
  updatedAtTimestamp: number;
  planRenewalOn: number | null;
  scheduledSubscriptionChanges: unknown | null;
  waNumber: string;
  waMessagingTier: string;
  billingCurrency: string;
  timezone: string;
  subscriptionStartedOn: number | null;
  isWhatsappVerified: boolean;
  dailyTemplateLimit: number;
  wabaAppStatus: string | null;
  error: string | null;
  userEmail: string;
  createdAt: string;
}

export interface GetProjectsResponse {
  projects: Project[];
}

// Dashboard Types
export interface DashboardData {
  companyName: string;
  balance: number;
  whatsappStatus: 'LIVE' | 'PENDING' | 'INACTIVE';
  qualityRating: 'LOW' | 'MEDIUM' | 'HIGH';
  remainingQuota: number;
  userProfile: {
    name: string;
    role: string;
    phoneNumber: string;
    avatarInitial: string;
  };
  balances: {
    marketing: number;
    utility: number;
    authentication: number;
  };
  kycStatus: {
    status: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS';
    stepNumber: number;
  };
  creditsBanner: {
    creditsAmount: number;
    steps: Array<{
      id: string;
      label: string;
      completed: boolean;
    }>;
  };
  referralData: {
    referralLink: string;
    earningsAmount: number;
    pointsPerSignup: number;
  };
}
