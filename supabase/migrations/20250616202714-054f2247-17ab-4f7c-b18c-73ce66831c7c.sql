
-- Update image URLs in the cars table
UPDATE cars 
SET image_url = REPLACE(image_url, '/lovable-uploads/', '/uploads/')
WHERE image_url LIKE '/lovable-uploads/%';

-- Update image URLs in the parts table
UPDATE parts 
SET image_url = REPLACE(image_url, '/lovable-uploads/', '/uploads/')
WHERE image_url LIKE '/lovable-uploads/%';

-- Update image URLs in the approved_parts table
UPDATE approved_parts 
SET image_url = REPLACE(image_url, '/lovable-uploads/', '/uploads/')
WHERE image_url LIKE '/lovable-uploads/%';

-- Update avatar URLs in the profiles table
UPDATE profiles 
SET avatar_url = REPLACE(avatar_url, '/lovable-uploads/', '/uploads/')
WHERE avatar_url LIKE '/lovable-uploads/%';
