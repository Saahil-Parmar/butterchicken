/*
  # Create exercises table and setup security

  1. New Tables
    - `exercises`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `exercise_name` (text)
      - `body_part` (text)
      - `date` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their own exercises
*/

CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  exercise_name text NOT NULL,
  body_part text NOT NULL,
  date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own exercises
CREATE POLICY "Users can read own exercises"
  ON exercises
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own exercises
CREATE POLICY "Users can insert own exercises"
  ON exercises
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS exercises_user_id_date_idx ON exercises(user_id, date);