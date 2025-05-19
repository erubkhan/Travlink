-- Add current location fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS current_city TEXT,
ADD COLUMN IF NOT EXISTS current_country TEXT;
