import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiService } from "../services/api";

// Validation schema
const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  companyName: z.string().min(2, "Enter your company name"),
  companyEmail: z.string().email("Enter a valid company email"),
  companyWebsite: z.string().url("Enter a valid URL (https://...)"),
  phone: z.string().min(8, "Enter a valid number"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export type FormValues = z.infer<typeof schema>;

export const useSignUpForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      companyName: "",
      companyEmail: "",
      companyWebsite: "",
      phone: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: FormValues) => {
    console.log("SignUp payload:", values);

    const result = await apiService.signUp(values);

    if (result.success) {
      console.log("Signup successful:", result.data);
      // Handle success (e.g., navigate to next screen, show success message)
      return { success: true, data: result.data };
    } else {
      console.error("Signup failed:", result.error);
      // Handle error (e.g., show error message to user)
      return { success: false, error: result.error };
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
