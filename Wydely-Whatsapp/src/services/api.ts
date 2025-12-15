// API service for handling all API calls
export interface SignUpData {
  name: string;
  companyName: string;
  companyEmail: string;
  companyWebsite: string;
  phone: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TemplateOption {
  id: string;
  name: string;
  content: string;
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

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async signUp(userData: SignUpData): Promise<ApiResponse> {
    return this.makeRequest('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email: string, password: string): Promise<ApiResponse> {
    return this.makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async resendOtp(email?: string, phone?: string): Promise<ApiResponse> {
    return this.makeRequest('/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email, phone }),
    });
  }

  async verifyOtp(
    email: string,
    phone: string,
    emailOtp: string,
    phoneOtp: string
  ): Promise<ApiResponse> {
    return this.makeRequest('/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, phone, emailOtp, phoneOtp }),
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

  async getTemplates(): Promise<ApiResponse<TemplateOption[]>> {
    return this.makeRequest<TemplateOption[]>('/get-templates', { method: 'GET' });
  }

  async getContacts(): Promise<ApiResponse<Contact[]>> {
    return this.makeRequest<Contact[]>('/get-contacts', { method: 'GET' });
  }

  async getExistingCampaigns(): Promise<ApiResponse<Campaign[]>> {
    return this.makeRequest<Campaign[]>('/get-existing-campaigns', { method: 'GET' });
  }
}

// Export a singleton instance
export const apiService = new ApiService();
export default ApiService;
