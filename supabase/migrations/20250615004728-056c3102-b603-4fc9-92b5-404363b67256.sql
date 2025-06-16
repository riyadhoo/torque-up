
-- First, let's see what policies exist and drop them all to start fresh
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles; 
DROP POLICY IF EXISTS "Users can create their own roles if admin email" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete all roles" ON public.user_roles;

-- Now create the new policies
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own roles if admin email" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND (
      public.has_role(auth.uid(), 'admin') OR 
      (SELECT email FROM auth.users WHERE id = auth.uid()) = 'torqueup.contact@gmail.com'
    )
  );

CREATE POLICY "Admins can update all roles" 
  ON public.user_roles 
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete all roles" 
  ON public.user_roles 
  FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));
