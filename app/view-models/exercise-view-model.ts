import { Observable } from '@nativescript/core';
import { Exercise, BodyPart, bodyParts } from '../models/exercise.model';
import { addExercise, getExercises } from '../services/supabase.service';
import { subDays } from 'date-fns';

export class ExerciseViewModel extends Observable {
  private exercises: Exercise[] = [];
  private _selectedBodyPart = 0;
  private _exerciseName: string = '';
  private _inactiveBodyParts: BodyPart[] = [...bodyParts];

  constructor() {
    super();
    console.log('Initializing ExerciseViewModel');
    
    // Set initial values
    this.set('bodyParts', bodyParts);
    this.set('exerciseName', '');
    this.set('selectedBodyPart', 0);
    this.set('inactiveBodyParts', [...bodyParts]);
    
    // Load exercises after initialization
    this.loadExercises().catch(error => {
      console.log('Failed to load exercises:', error);
    });
  }

  get bodyParts(): readonly string[] {
    return bodyParts;
  }

  get selectedBodyPart(): number {
    return this._selectedBodyPart;
  }

  set selectedBodyPart(value: number) {
    console.log('Setting selectedBodyPart:', value);
    if (this._selectedBodyPart !== value) {
      this._selectedBodyPart = value;
      this.notifyPropertyChange('selectedBodyPart', value);
    }
  }

  get exerciseName(): string {
    return this._exerciseName;
  }

  set exerciseName(value: string) {
    console.log('Setting exerciseName:', value);
    if (this._exerciseName !== value) {
      this._exerciseName = value;
      this.notifyPropertyChange('exerciseName', value);
    }
  }

  get inactiveBodyParts(): BodyPart[] {
    return this._inactiveBodyParts;
  }

  async addExercise() {
    try {
      console.log('Adding exercise:', this.exerciseName);
      if (!this.exerciseName) {
        console.log('Exercise name is empty, skipping');
        return;
      }

      const selectedBodyPart = bodyParts[this.selectedBodyPart];
      console.log('Selected body part:', selectedBodyPart);

      const exercise = {
        user_id: 'test-user',
        exercise_name: this.exerciseName,
        body_part: selectedBodyPart,
        date: new Date().toISOString()
      };

      await addExercise(exercise);
      console.log('Exercise added successfully');
      
      this.set('exerciseName', '');
      await this.loadExercises();
    } catch (error) {
      console.log('Error adding exercise:', error);
    }
  }

  async loadExercises() {
    try {
      console.log('Loading exercises');
      this.exercises = await getExercises('test-user');
      console.log('Exercises loaded:', this.exercises.length);
      this.updateInactiveBodyParts();
    } catch (error) {
      console.log('Error loading exercises:', error);
      this.exercises = [];
      this.updateInactiveBodyParts();
    }
  }

  private updateInactiveBodyParts() {
    try {
      console.log('Updating inactive body parts');
      const threeDaysAgo = subDays(new Date(), 3);
      const recentlyExercised = new Set(
        this.exercises
          .filter(ex => new Date(ex.date) >= threeDaysAgo)
          .map(ex => ex.body_part)
      );

      this._inactiveBodyParts = bodyParts.filter(
        part => !recentlyExercised.has(part)
      );
      
      console.log('Inactive body parts:', this._inactiveBodyParts);
      this.set('inactiveBodyParts', this._inactiveBodyParts);
    } catch (error) {
      console.log('Error updating inactive body parts:', error);
      this._inactiveBodyParts = [...bodyParts];
      this.set('inactiveBodyParts', this._inactiveBodyParts);
    }
  }
}