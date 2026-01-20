import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Password validation schema based on design requirements
const passwordSchema = z
  .string()
  .min(8, 'Must be atleast 8 characters')
  .regex(/\d/, 'Must contain atleast 1 number')
  .regex(/[A-Z]/, 'Must be atleast 1 in Capital Case')
  .regex(/[a-z]/, 'Must be atleast 1 letter in Small Case')
  .regex(/[^A-Za-z0-9]/, 'Must contain atleast 1 Special Character');

// Validation schema
const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  companyName: z.string().min(2, 'Enter your company name'),
  companyEmail: z.string().email('Enter a valid company email'),
  companyWebsite: z.string().url('Enter a valid URL (https://...)'),
  companySize: z.string().min(1, 'Select your company size'),
  phone: z.string().min(8, 'Enter a valid mobile number'),
  password: passwordSchema,
});

export type FormValues = z.infer<typeof schema>;

export const useSignUpForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      companyName: '',
      companyEmail: '',
      companyWebsite: '',
      companySize: '',
      phone: '',
      password: '',
    },
    mode: 'onBlur',
  });

  return form;
};
