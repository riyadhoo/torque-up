import { z } from "zod";

// Input sanitization utilities
export const sanitizeText = (text: string): string => {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .trim();
};

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - remove dangerous tags and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
};

// Enhanced validation schemas
export const partValidationSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .refine(val => sanitizeText(val).length > 0, "Title cannot be empty after sanitization"),
  description: z.string()
    .max(2000, "Description must be less than 2000 characters")
    .optional()
    .transform(val => val ? sanitizeHtml(val) : val),
  price: z.number()
    .min(0.01, "Price must be greater than 0")
    .max(1000000, "Price must be less than 1,000,000")
    .refine(val => Number.isFinite(val), "Price must be a valid number"),
  condition: z.enum(["New", "Used", "Refurbished"], {
    errorMap: () => ({ message: "Please select a valid condition" })
  }),
  compatibleCars: z.array(z.string().min(1).max(50)).max(20, "Too many compatible cars listed")
});

export const messageValidationSchema = z.object({
  content: z.string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message must be less than 1000 characters")
    .transform(val => sanitizeText(val))
});

export const profileValidationSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
    .transform(val => sanitizeText(val)),
  bio: z.string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .transform(val => val ? sanitizeText(val) : val),
  phone_number: z.string()
    .regex(/^\+?[\d\s\-\(\)]{10,15}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal(""))
});

// File validation utilities
export const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (file.size > maxSize) {
    return { isValid: false, error: "File size must be less than 5MB" };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: "Only JPEG, PNG, WebP, and GIF files are allowed" };
  }
  
  // Check file extension matches MIME type
  const extension = file.name.toLowerCase().split('.').pop();
  const expectedExtensions: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp'],
    'image/gif': ['gif']
  };
  
  const validExtensions = expectedExtensions[file.type];
  if (!validExtensions || !validExtensions.includes(extension || '')) {
    return { isValid: false, error: "File extension doesn't match file type" };
  }
  
  return { isValid: true };
};

// Rate limiting utilities
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  constructor(private maxAttempts: number, private windowMs: number) {}
  
  isAllowed(key: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }
    
    if (record.count >= this.maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  getRemainingAttempts(key: string): number {
    const record = this.attempts.get(key);
    if (!record || Date.now() > record.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - record.count);
  }
}
