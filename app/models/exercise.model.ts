export interface Exercise {
  id: string;
  user_id: string;
  exercise_name: string;
  body_part: string;
  date: string;
  created_at: string;
}

export const bodyParts = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'legs',
  'abs',
  'cardio'
] as const;

export type BodyPart = typeof bodyParts[number];