
-- First, let's check the current view definition and drop it completely
DROP VIEW IF EXISTS public.user_rating_stats CASCADE;

-- Recreate the view explicitly without SECURITY DEFINER
CREATE VIEW public.user_rating_stats 
WITH (security_invoker = true)
AS
SELECT 
  rated_user_id,
  COUNT(*) as total_ratings,
  ROUND(AVG(rating)::numeric, 1) as average_rating
FROM public.user_ratings
GROUP BY rated_user_id;

-- Grant necessary permissions
GRANT SELECT ON public.user_rating_stats TO authenticated;
GRANT SELECT ON public.user_rating_stats TO anon;
