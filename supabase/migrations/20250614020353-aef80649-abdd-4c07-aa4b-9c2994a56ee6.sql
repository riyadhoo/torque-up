
-- Create the missing 'parts' storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('parts', 'Parts Images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the parts bucket (drop existing ones first to avoid conflicts)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

CREATE POLICY "Public Access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'parts');

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'parts');

CREATE POLICY "Users can update their own images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'parts' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'parts' AND auth.uid() = owner);

-- Enable RLS on all tables that don't have it
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view approved parts" ON public.parts;
DROP POLICY IF EXISTS "Users can view their own parts" ON public.parts;
DROP POLICY IF EXISTS "Users can create their own parts" ON public.parts;
DROP POLICY IF EXISTS "Users can update their own parts" ON public.parts;
DROP POLICY IF EXISTS "Users can delete their own parts" ON public.parts;

DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own sent messages" ON public.messages;

DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Anyone can view ratings" ON public.ratings;
DROP POLICY IF EXISTS "Authenticated users can create ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can update their own ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can delete their own ratings" ON public.ratings;

DROP POLICY IF EXISTS "Anyone can view cars" ON public.cars;

DROP POLICY IF EXISTS "Anyone can view user ratings" ON public.user_ratings;
DROP POLICY IF EXISTS "Authenticated users can rate others" ON public.user_ratings;
DROP POLICY IF EXISTS "Users can update their own user ratings" ON public.user_ratings;
DROP POLICY IF EXISTS "Users can delete their own user ratings" ON public.user_ratings;

-- Parts table policies
CREATE POLICY "Users can view approved parts"
  ON public.parts
  FOR SELECT
  USING (approval_status = 'approved');

CREATE POLICY "Users can view their own parts"
  ON public.parts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can create their own parts"
  ON public.parts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own parts"
  ON public.parts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own parts"
  ON public.parts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = seller_id);

-- Messages table policies
CREATE POLICY "Users can view their own messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own sent messages"
  ON public.messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id);

-- Profiles table policies
CREATE POLICY "Anyone can view profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ratings table policies
CREATE POLICY "Anyone can view ratings"
  ON public.ratings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create ratings"
  ON public.ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON public.ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
  ON public.ratings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Cars table policies (public read access)
CREATE POLICY "Anyone can view cars"
  ON public.cars
  FOR SELECT
  USING (true);

-- User ratings table policies
CREATE POLICY "Anyone can view user ratings"
  ON public.user_ratings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can rate others"
  ON public.user_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = rater_user_id 
    AND rated_user_id != rater_user_id
  );

CREATE POLICY "Users can update their own user ratings"
  ON public.user_ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = rater_user_id);

CREATE POLICY "Users can delete their own user ratings"
  ON public.user_ratings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = rater_user_id);
