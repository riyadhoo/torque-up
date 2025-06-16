
-- Drop the existing view and recreate it without SECURITY DEFINER
DROP VIEW IF EXISTS public.user_rating_stats;

-- Create the view without SECURITY DEFINER (uses SECURITY INVOKER by default)
CREATE VIEW public.user_rating_stats AS
SELECT 
  rated_user_id,
  COUNT(*) as total_ratings,
  ROUND(AVG(rating)::numeric, 1) as average_rating
FROM public.user_ratings
GROUP BY rated_user_id;
