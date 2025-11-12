// Mock data for SignUpPage component

export interface SignUpFormValues {
  name: string;
  companyName: string;
  companyEmail: string;
  companyWebsite: string;
  phone: string;
  password: string;
}

// Default form values for preview/testing
export const mockRootProps = {
  name: "John Doe",
  companyName: "",
  companyEmail: "",
  companyWebsite: "https://www.example.com",
  phone: "",
  password: "",
};

// Example of a completed form submission
export const mockCompletedForm: SignUpFormValues = {
  name: "John Doe",
  companyName: "Acme Corporation",
  companyEmail: "john@acme.com",
  companyWebsite: "https://www.acme.com",
  phone: "9876543210",
  password: "SecurePass123",
};