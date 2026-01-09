// API service for handling all API calls
import { getDeviceHeaders } from '../utils/deviceInfo';

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
  message: string;
  email: string;
  wydelyBusinessId: string;
  aisensyBusinessId: string;
  aisensyProjectIds: string[];
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
  message: string;
  user: LoginUser;
  loginMethod: 'otp' | 'password';
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
  id: string;
  name: string;
  wabaPhoneNumber: string;
  status: ProjectStatus;
  activePlan: string;
  createdAt: string;
  wabaId?: string;
};

export interface CreateProjectData {
  name: string;
}

export interface CreateProjectResponse {
  message: string;
  project: Project;
}

export interface GetProjectsResponse {
  projects: Project[];
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // Default to localhost:3000 for Mockoon
    // Can be overridden by passing baseUrl parameter
    // this.baseUrl = baseUrl || 'http://localhost:3000';
    this.baseUrl = baseUrl || 'http://72.60.100.178:8080';
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    includeDeviceHeaders: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(includeDeviceHeaders ? getDeviceHeaders() : {}),
        ...(options.headers as Record<string, string>),
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const responseData = await response.json();

      // Handle the new API response format
      if (responseData.success === false) {
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
    return this.makeRequest<SignUpResponse>('/api/v1/sign-up', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Verify OTP API (for signup)
  async verifyOtp(data: VerifyOtpData): Promise<ApiResponse<VerifyOtpResponse>> {
    return this.makeRequest<VerifyOtpResponse>(
      '/api/v1/verify-otp',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      false
    ); // Don't include device headers for verify-otp
  }

  // Resend OTP API
  async resendOtp(email: string): Promise<ApiResponse<SendOtpResponse>> {
    return this.makeRequest<SendOtpResponse>(
      '/api/v1/resend-otp',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      },
      false
    ); // Don't include device headers for resend-otp
  }

  // Check verification status
  async checkVerification(email: string): Promise<ApiResponse> {
    return this.makeRequest(
      `/api/v1/check-verification/${encodeURIComponent(email)}`,
      {
        method: 'GET',
      },
      false
    );
  }

  // Login APIs
  // Send OTP for login
  async sendLoginOtp(emailOrMobile: string): Promise<ApiResponse<SendOtpResponse>> {
    return this.makeRequest<SendOtpResponse>(
      `/api/v1/login/send-otp?emailOrMobile=${encodeURIComponent(emailOrMobile)}`,
      {
        method: 'POST',
      }
    );
  }

  // Verify OTP and login
  async verifyLoginOtp(emailOrMobile: string, otp: string): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>(
      `/api/v1/login/verify-otp?emailOrMobile=${encodeURIComponent(emailOrMobile)}&otp=${otp}`,
      {
        method: 'POST',
      }
    );
  }

  // Login with password
  async loginWithPassword(
    emailOrMobile: string,
    password: string
  ): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/api/v1/login/password', {
      method: 'POST',
      body: JSON.stringify({
        emailOrMobile,
        password,
        loginType: 'password',
      }),
    });
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

    return this.makeRequest<LoginResponse | SendOtpResponse>('/api/v1/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
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
    return this.makeRequest<GetProjectsResponse>('/api/v1/projects', {
      method: 'GET',
    }).then((response) => ({
      ...response,
      data: response.data?.projects || [],
    }));
  }

  async createProject(data: CreateProjectData): Promise<ApiResponse<CreateProjectResponse>> {
    return this.makeRequest<CreateProjectResponse>('/api/v1/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Export a singleton instance
export const apiService = new ApiService();
export default ApiService;
