
-- Drop the problematic policy that's causing the permission error
DROP POLICY IF EXISTS "Users can create their own roles if admin email" ON public.user_roles;

-- Create a new policy that allows the admin email to create their role without checking the database
CREATE POLICY "Admin email can bootstrap role" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND 
    auth.email() = 'torqueup.contact@gmail.com'
  );

-- Also create a general policy for admins to create roles once they have the admin role
CREATE POLICY "Admins can create any roles" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
  );
