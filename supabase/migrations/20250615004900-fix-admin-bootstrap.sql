
-- Create a security definer function to get current user email
CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS TEXT AS $$
  SELECT email FROM auth.users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop and recreate the INSERT policy with the new function
DROP POLICY IF EXISTS "Users can create their own roles if admin email" ON public.user_roles;

CREATE POLICY "Users can create their own roles if admin email" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND (
      public.has_role(auth.uid(), 'admin') OR 
      public.get_current_user_email() = 'torqueup.contact@gmail.com'
    )
  );
