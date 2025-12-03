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

export interface UserAccountProfile {
  displayName: string;
  email: string;
  whatsappNumber: string;
  userName: string;
  // Password is never sent back from backend for security
  password?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://your-api-endpoint.com') {
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

  async signUp(_userData: SignUpData): Promise<ApiResponse> {
    // return this.makeRequest("/api/signup", {
    //   method: "POST",
    //   body: JSON.stringify(userData),
    // });
    await new Promise((resolve) => setTimeout(resolve, 10000));
    return {
      success: true,
      data: { message: 'Signup successful' },
    };
  }

  async resendOtp(_email: string): Promise<ApiResponse> {
    // return this.makeRequest("/api/resend-otp", {
    //   method: "POST",
    //   body: JSON.stringify({ email }),
    // });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      success: true,
      data: { message: 'OTP resent' },
    };
  }

  // Add other API methods here as needed
  // async login(credentials: LoginData): Promise<ApiResponse> { ... }

  async getUserProfile(): Promise<ApiResponse<UserAccountProfile>> {
    // return this.makeRequest<UserAccountProfile>("/api/profile", { method: "GET" });
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        displayName: 'Harshil',
        email: 'Harshilbhandari1997@gmail.com',
        whatsappNumber: '919690008019',
        userName: 'harshilbhandari1997@gmail.com',
      },
    };
  }

  async updateUserProfile(
    updated: Partial<UserAccountProfile>
  ): Promise<ApiResponse<UserAccountProfile>> {
    // return this.makeRequest<UserAccountProfile>("/api/profile", {
    //   method: "PUT",
    //   body: JSON.stringify(updated),
    // });
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In this mock, just echo back the updated fields merged with a default profile
    const base: UserAccountProfile = {
      displayName: 'Harshil',
      email: 'Harshilbhandari1997@gmail.com',
      whatsappNumber: '919690008019',
      userName: 'harshilbhandari1997@gmail.com',
    };

    return {
      success: true,
      data: { ...base, ...updated },
    };
  }
}

// Export a singleton instance
export const apiService = new ApiService();
export default ApiService;
