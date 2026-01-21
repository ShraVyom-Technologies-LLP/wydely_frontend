// API service for handling all API calls
import { getDeviceHeaders } from '../utils/deviceInfo';
import { getValidAuthData } from '../utils/authStorage';
import {
  ApiResponse,
  SignUpData,
  SignUpResponse,
  VerifyOtpData,
  VerifyOtpResponse,
  SendOtpResponse,
  LoginResponse,
  UserAccountProfile,
  TemplateOption,
  Contact,
  Campaign,
  CreateCampaignData,
  CreateCampaignResponse,
  Project,
  CreateProjectData,
  CreateProjectResponse,
  GetProjectsResponse,
  DashboardData,
} from '../utils/types';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // Use environment variable if available, otherwise fallback to default
    // For web builds, use EXPO_PUBLIC_API_URL
    // Can be overridden by passing baseUrl parameter
    const envBaseUrl =
      typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL
        ? process.env.EXPO_PUBLIC_API_URL
        : undefined;

    this.baseUrl = baseUrl || envBaseUrl || 'https://api.wydely.io';
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    includeDeviceHeaders: boolean = true,
    includeAuthHeaders: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(includeDeviceHeaders ? getDeviceHeaders() : {}),
        ...(options.headers as Record<string, string>),
      };

      // Add auth headers if needed
      if (includeAuthHeaders) {
        const authData = await getValidAuthData();
        console.log('authData', authData);
        if (authData) {
          headers['Authorization'] = `Bearer ${authData.accessToken}`;
          headers['X-Wydely-Business-Id'] = authData.wydelyBusinessId;
        }
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const responseData = await response?.json() || {};

      // Handle the new API response format
      if (responseData?.success === false) {
        // Error response with displayError format
        const errorMessage =
          responseData.error?.displayError ||
          (typeof responseData.error === 'string'
            ? responseData.error
            : 'Oops! Something went wrong');
        return {
          success: false,
          error: {
            displayError: errorMessage,
          },
        };
      }

      // Success response
      return {
        success: true,
        data: responseData.data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      let errorMessage = 'Oops! Something went wrong';

      if (error instanceof Error) {
        // Handle CORS and network errors
        if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
          errorMessage = 'Oops! Something went wrong';
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: {
          displayError: errorMessage,
        },
      };
    }
  }

  // Signup API
  async signUp(userData: SignUpData): Promise<ApiResponse<SignUpResponse>> {
    return this.makeRequest<SignUpResponse>(
      '/api/v1/sign-up',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      true, // Include device headers
      false // Don't include auth headers (not authenticated yet)
    );
  }

  // Verify OTP API (for signup)
  async verifyOtp(data: VerifyOtpData): Promise<ApiResponse<VerifyOtpResponse>> {
    return this.makeRequest<VerifyOtpResponse>(
      '/api/v1/verify-otp',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      false, // Don't include device headers for verify-otp
      false // Don't include auth headers for verify-otp (not authenticated yet)
    );
  }

  // Resend OTP API
  async resendOtp(email: string): Promise<ApiResponse<SendOtpResponse>> {
    return this.makeRequest<SendOtpResponse>(
      '/api/v1/resend-otp',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      },
      false, // Don't include device headers for resend-otp
      false // Don't include auth headers for resend-otp (not authenticated yet)
    );
  }

  // Check verification status
  async checkVerification(email: string): Promise<ApiResponse> {
    return this.makeRequest(
      `/api/v1/check-verification/${encodeURIComponent(email)}`,
      {
        method: 'GET',
      },
      false, // Don't include device headers
      false // Don't include auth headers (not authenticated yet)
    );
  }

  // Login APIs
  // Send OTP for login
  async sendLoginOtp(emailOrMobile: string): Promise<ApiResponse<SendOtpResponse>> {
    return this.makeRequest<SendOtpResponse>(
      `/api/v1/login/send-otp?emailOrMobile=${encodeURIComponent(emailOrMobile)}`,
      {
        method: 'POST',
      },
      true, // Include device headers
      false // Don't include auth headers (not authenticated yet)
    );
  }

  // Verify OTP and login
  async verifyLoginOtp(emailOrMobile: string, otp: string): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>(
      `/api/v1/login/verify-otp?emailOrMobile=${encodeURIComponent(emailOrMobile)}&otp=${otp}`,
      {
        method: 'POST',
      },
      true, // Include device headers
      false // Don't include auth headers (not authenticated yet)
    );
  }

  // Login with password
  async loginWithPassword(
    emailOrMobile: string,
    password: string
  ): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>(
      '/api/v1/login/password',
      {
        method: 'POST',
        body: JSON.stringify({
          emailOrMobile,
          password,
          loginType: 'password',
        }),
      },
      true, // Include device headers
      false // Don't include auth headers (not authenticated yet)
    );
  }

  // Unified login endpoint (supports both OTP and password)
  async login(
    emailOrMobile: string,
    loginType: 'otp' | 'password',
    otp?: string,
    password?: string
  ): Promise<ApiResponse<LoginResponse | SendOtpResponse>> {
    const body: Record<string, string> = {
      emailOrMobile,
      loginType,
    };

    if (loginType === 'otp' && otp) {
      body.otp = otp;
    } else if (loginType === 'password' && password) {
      body.password = password;
    }

    return this.makeRequest<LoginResponse | SendOtpResponse>(
      '/api/v1/login',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      true, // Include device headers
      false // Don't include auth headers (not authenticated yet)
    );
  }

  async getUserProfile(): Promise<ApiResponse<UserAccountProfile>> {
    return this.makeRequest<UserAccountProfile>('/profile-details', { method: 'GET' });
  }

  async updateUserProfile(
    updated: Partial<UserAccountProfile>
  ): Promise<ApiResponse<UserAccountProfile>> {
    return this.makeRequest<UserAccountProfile>('/update-profile', {
      method: 'POST',
      body: JSON.stringify(updated),
    });
  }

  async getExistingTemplates(): Promise<ApiResponse<TemplateOption[]>> {
    return this.makeRequest<{ templates: TemplateOption[] }>('/api/v1/get-existing-templates', {
      method: 'GET',
    }).then((response) => ({
      ...response,
      data: response.data?.templates || [],
    }));
  }

  async getAllTemplates(): Promise<ApiResponse<TemplateOption[]>> {
    return this.makeRequest<{ templates: TemplateOption[] }>('/api/v1/get-all-templates', {
      method: 'GET',
    }).then((response) => ({
      ...response,
      data: response.data?.templates || [],
    }));
  }

  async createTemplate(template: Omit<TemplateOption, 'id'>): Promise<ApiResponse<TemplateOption>> {
    return this.makeRequest<TemplateOption>('/create-template', {
      method: 'POST',
      body: JSON.stringify(template),
    });
  }

  async updateTemplate(
    id: string,
    template: Partial<Omit<TemplateOption, 'id'>>
  ): Promise<ApiResponse<TemplateOption>> {
    return this.makeRequest<TemplateOption>(`/update-template/${id}`, {
      method: 'PUT',
      body: JSON.stringify(template),
    });
  }

  async deleteTemplate(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/delete-template/${id}`, {
      method: 'DELETE',
    });
  }

  async getContacts(projectId?: string): Promise<ApiResponse<Contact[]>> {
    const queryParam = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
    return this.makeRequest<{ contacts: Contact[] }>(`/api/v1/get-contacts${queryParam}`, {
      method: 'GET',
    }).then((response) => ({
      ...response,
      data: response.data?.contacts || [],
    }));
  }

  async getExistingCampaigns(projectId?: string): Promise<ApiResponse<Campaign[]>> {
    const queryParam = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
    return this.makeRequest<{ campaigns: Campaign[] }>(
      `/api/v1/get-existing-campaigns${queryParam}`,
      {
        method: 'GET',
      }
    ).then((response) => ({
      ...response,
      data: response.data?.campaigns || [],
    }));
  }

  async createCampaign(data: CreateCampaignData): Promise<ApiResponse<CreateCampaignResponse>> {
    return this.makeRequest<CreateCampaignResponse>('/api/v1/create-campaign', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Projects API
  async getProjects(): Promise<ApiResponse<Project[]>> {
    // Import the raw API response type
    type RawProjectApiResponse = {
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
    };

    return this.makeRequest<RawProjectApiResponse[]>('/api/v1/project/list', {
      method: 'GET',
    }).then((response) => {
      if (!response.success || !response.data) {
        return {
          ...response,
          data: [],
        };
      }

      // Map API response to Project type
      // API returns data as an array directly
      const projects: Project[] = (Array.isArray(response.data) ? response.data : []).map(
        (item: RawProjectApiResponse) => {
          // Handle createdAt - prefer createdAt string, then createdAtTimestamp number
          let createdAt: string;
          if (item.createdAt) {
            createdAt = new Date(item.createdAt).toISOString();
          } else if (item.createdAtTimestamp) {
            createdAt = new Date(item.createdAtTimestamp).toISOString();
          } else {
            createdAt = new Date().toISOString();
          }

          return {
            // Core mapped fields
            id: item.projectId || String(item.id || ''),
            name: item.name || '',
            wabaPhoneNumber: item.waNumber || '',
            status: item.isWhatsappVerified ? ('verified' as const) : ('pending' as const),
            activePlan: item.activePlan || 'NONE',
            createdAt,

            // All other API fields
            projectId: item.projectId,
            type: item.type,
            businessId: item.businessId,
            planActivatedOn: item.planActivatedOn,
            sandbox: item.sandbox,
            createdAtTimestamp: item.createdAtTimestamp,
            updatedAtTimestamp: item.updatedAtTimestamp,
            planRenewalOn: item.planRenewalOn,
            scheduledSubscriptionChanges: item.scheduledSubscriptionChanges,
            waNumber: item.waNumber,
            waMessagingTier: item.waMessagingTier,
            billingCurrency: item.billingCurrency,
            timezone: item.timezone,
            subscriptionStartedOn: item.subscriptionStartedOn,
            isWhatsappVerified: item.isWhatsappVerified,
            dailyTemplateLimit: item.dailyTemplateLimit,
            wabaAppStatus: item.wabaAppStatus,
            error: item.error,
            userEmail: item.userEmail,
          };
        }
      );

      return {
        ...response,
        data: projects,
      };
    });
  }

  async createProject(data: CreateProjectData): Promise<ApiResponse<CreateProjectResponse>> {
    return this.makeRequest<CreateProjectResponse>('/api/v1/project/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Dashboard API
  async getDashboardData(projectId?: string): Promise<ApiResponse<DashboardData>> {
    const queryParam = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
    return this.makeRequest<DashboardData>(`/api/v1/dashboard${queryParam}`, {
      method: 'GET',
    });
  }

  async getAccountBalance(projectId?: string): Promise<ApiResponse<{ balance: number }>> {
    const queryParam = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
    return this.makeRequest<{ balance: number }>(`/api/v1/account/balance${queryParam}`, {
      method: 'GET',
    });
  }

  async getWalletBalances(projectId?: string): Promise<
    ApiResponse<{
      marketing: number;
      utility: number;
      authentication: number;
    }>
  > {
    const queryParam = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
    return this.makeRequest<{
      marketing: number;
      utility: number;
      authentication: number;
    }>(`/api/v1/wallet/balances${queryParam}`, {
      method: 'GET',
    });
  }

  async getReferralData(): Promise<
    ApiResponse<{
      referralLink: string;
      earningsAmount: number;
      pointsPerSignup: number;
    }>
  > {
    return this.makeRequest<{
      referralLink: string;
      earningsAmount: number;
      pointsPerSignup: number;
    }>('/api/v1/referral/data', {
      method: 'GET',
    });
  }

  async getKYCStatus(projectId?: string): Promise<
    ApiResponse<{
      status: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS';
      stepNumber: number;
    }>
  > {
    const queryParam = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
    return this.makeRequest<{
      status: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS';
      stepNumber: number;
    }>(`/api/v1/kyc/status${queryParam}`, {
      method: 'GET',
    });
  }

  async getCreditsBanner(projectId?: string): Promise<
    ApiResponse<{
      creditsAmount: number;
      steps: Array<{
        id: string;
        label: string;
        completed: boolean;
      }>;
    }>
  > {
    const queryParam = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
    return this.makeRequest<{
      creditsAmount: number;
      steps: Array<{
        id: string;
        label: string;
        completed: boolean;
      }>;
    }>(`/api/v1/credits/banner${queryParam}`, {
      method: 'GET',
    });
  }
}

// Export a singleton instance
export const apiService = new ApiService();
export default ApiService;
