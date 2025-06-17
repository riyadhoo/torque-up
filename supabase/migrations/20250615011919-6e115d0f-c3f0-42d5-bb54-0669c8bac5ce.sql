
-- Create the 'cars' storage bucket for car images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cars', 'Car Images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the cars bucket
CREATE POLICY "Public Access for Cars"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'cars');

CREATE POLICY "Authenticated users can upload car images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'cars');

CREATE POLICY "Users can update car images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'cars');

CREATE POLICY "Users can delete car images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'cars');
