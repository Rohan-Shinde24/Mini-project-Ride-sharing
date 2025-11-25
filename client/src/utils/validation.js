import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address.')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required'),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .min(3, 'Name must be at least 3 characters.')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address.')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password is too weak. Needs 8 chars, 1 number.')
    .matches(/[0-9]/, 'Password must contain at least one number.')
    .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.')
    .required('Password is required'),
});

export const createRideSchema = yup.object({
  from: yup
    .string()
    .min(3, 'Please enter a valid city or address.')
    .required('Source is required'),
  to: yup
    .string()
    .min(3, 'Please enter a valid city or address.')
    .required('Destination is required'),
  date: yup
    .date()
    .min(new Date(), 'You cannot schedule a ride in the past.')
    .required('Date is required')
    .typeError('Please enter a valid date'),
  time: yup
    .string()
    .required('Time is required'),
  price: yup
    .number()
    .min(0, 'Price cannot be negative.')
    .required('Price is required')
    .typeError('Price must be a number'),
  seats: yup
    .number()
    .integer('Seats must be an integer')
    .min(1, 'Vehicle capacity must be between 1 and 8.')
    .max(8, 'Vehicle capacity must be between 1 and 8.')
    .required('Number of seats is required')
    .typeError('Seats must be a number'),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  description: yup
    .string()
    .max(200, 'Description is too long'),
});

export const profileUpdateSchema = yup.object({
  name: yup
    .string()
    .min(3, 'Name must be at least 3 characters.')
    .required('Name is required'),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .nullable(),
  address: yup
    .string()
    .max(200, 'Address must be less than 200 characters')
    .nullable(),
  bio: yup
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .nullable(),
});
