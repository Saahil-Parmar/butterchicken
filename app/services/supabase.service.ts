import { createClient } from '@supabase/supabase-js';
import { Exercise } from '../models/exercise.model';

// In a real production app, you would want to use a secure way to store these values
// such as a configuration file that's not committed to version control
// or a secure key storage solution
const supabaseUrl = 'https://ajqqqrladwttouzavwmm.supabase.co';  // Replace this with your actual Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqcXFxcmxhZHd0dG91emF2d21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MDk4OTAsImV4cCI6MjA1MTk4NTg5MH0.oKEX5sjj4ZloRUMtE8ZRlYLqLTH8jEYtpZNV26VB1iI';  // Replace this with your actual Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function addExercise(exercise: Omit<Exercise, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('exercises')
    .insert([exercise])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getExercises(userId: string, daysAgo: number = 3) {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('user_id', userId)
    .gte('date', new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString())
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}