
-- Create a table for user ratings (different from item ratings)
CREATE TABLE public.user_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rated_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rater_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure a user can only rate another user once
  UNIQUE(rated_user_id, rater_user_id),
  
  -- Ensure users cannot rate themselves
  CHECK (rated_user_id != rater_user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;

-- Users can view all user ratings (public information for trust)
CREATE POLICY "Anyone can view user ratings" 
  ON public.user_ratings 
  FOR SELECT 
  TO public
  USING (true);

-- Users can insert ratings for other users (not themselves)
CREATE POLICY "Authenticated users can rate others" 
  ON public.user_ratings 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    auth.uid() = rater_user_id 
    AND rated_user_id != rater_user_id
  );

-- Users can update their own ratings
CREATE POLICY "Users can update their own ratings" 
  ON public.user_ratings 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = rater_user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete their own ratings" 
  ON public.user_ratings 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = rater_user_id);

-- Create a view to get user rating statistics
CREATE OR REPLACE VIEW public.user_rating_stats AS
SELECT 
  rated_user_id,
  COUNT(*) as total_ratings,
  ROUND(AVG(rating)::numeric, 1) as average_rating
FROM public.user_ratings
GROUP BY rated_user_id;
