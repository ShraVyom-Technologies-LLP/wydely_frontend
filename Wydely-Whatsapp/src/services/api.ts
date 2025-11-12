// API service for handling all API calls
export interface SignUpData {
  name: string;
  companyName: string;
  companyEmail: string;
  companyWebsite: string;
  phone: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = "https://your-api-endpoint.com") {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
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
      console.error("API request failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async signUp(userData: SignUpData): Promise<ApiResponse> {
    // return this.makeRequest("/api/signup", {
    //   method: "POST",
    //   body: JSON.stringify(userData),
    // });
    return {
      success: true,
      data: { message: "Signup successful" },
    };
  }

  // Add other API methods here as needed
  // async login(credentials: LoginData): Promise<ApiResponse> { ... }
  // async getUserProfile(): Promise<ApiResponse> { ... }
}

// Export a singleton instance
export const apiService = new ApiService();
export default ApiService;
