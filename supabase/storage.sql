
-- Check if the bucket already exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'parts') THEN
        -- Create a new bucket for part images
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('parts', 'Parts Images', true);
    END IF;
END $$;

-- Set up a policy to allow public read access
CREATE POLICY IF NOT EXISTS "Public Access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'parts');

-- Allow authenticated users to upload images
CREATE POLICY IF NOT EXISTS "Authenticated users can upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'parts');

-- Allow users to update and delete their own images
CREATE POLICY IF NOT EXISTS "Users can update their own images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'parts' AND auth.uid() = owner);

CREATE POLICY IF NOT EXISTS "Users can delete their own images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'parts' AND auth.uid() = owner);
