
-- Add user_type enum to distinguish between individual and store users
CREATE TYPE public.user_type AS ENUM ('individual', 'store');

-- Add user_type column to profiles table with default 'individual' for existing users
ALTER TABLE public.profiles 
ADD COLUMN user_type user_type DEFAULT 'individual';

-- Add store-specific fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN store_name text,
ADD COLUMN store_description text,
ADD COLUMN store_address text,
ADD COLUMN store_phone text,
ADD COLUMN store_website text,
ADD COLUMN store_opening_hours text;

-- Create index for better performance when filtering by user_type
CREATE INDEX idx_profiles_user_type ON public.profiles(user_type);

-- Update existing users to be 'individual' type (except admin who keeps privileges)
-- Admin user will be handled separately in the application logic
