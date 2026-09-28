import { z } from 'zod';

export const bookingSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Please enter a valid email address'),
  customerPhone: z.string().min(10, 'Please enter a valid phone number'),
  eventType: z.string().min(1, 'Please select an event type'),
  eventDate: z.string().min(1, 'Please select an event date'),
  startTime: z.string().min(1, 'Please select a start time'),
  endTime: z.string().min(1, 'Please select an end time'),
  location: z.string().min(3, 'Please enter event location'),
  packageId: z.string().optional(),
  additionalNotes: z.string().optional(),
  paymentType: z.enum(['ADVANCE', 'FULL']).default('ADVANCE'),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  eventType: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const packageSchema = z.object({
  name: z.string().min(2, 'Package name is required'),
  eventType: z.string().min(1, 'Event type is required'),
  price: z.number().positive('Price must be greater than 0'),
  discountedPrice: z.number().nullable().optional(),
  duration: z.string().min(1, 'Duration is required'),
  photographers: z.number().min(1),
  editedPhotos: z.number().min(10),
  videoCoverage: z.boolean(),
  albumIncluded: z.boolean(),
  droneCoverage: z.boolean(),
  preWeddingSession: z.boolean(),
  features: z.string(), // JSON string array
  isPopular: z.boolean(),
  active: z.boolean(),
});

export const offerSchema = z.object({
  title: z.string().min(3, 'Offer title is required'),
  code: z.string().min(3, 'Offer code is required'),
  discountPercent: z.number().nullable().optional(),
  discountAmount: z.number().nullable().optional(),
  startDate: z.string(),
  endDate: z.string(),
  terms: z.string().min(5, 'Terms are required'),
  active: z.boolean(),
  packageId: z.string().nullable().optional(),
});
