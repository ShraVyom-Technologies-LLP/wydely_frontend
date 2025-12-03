import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiService } from "../services/api";

// Validation schema
const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  companyName: z.string().min(2, "Enter your company name"),
  companyEmail: z.string().email("Enter a valid company email"),
  companyWebsite: z.string().url("Enter a valid URL (https://...)"),
  phone: z.string().min(8, "Enter a valid mobile number"),
  password: z.string().min(6, "Enter a strong password of at least 6 characters"),
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

  return form;
};
