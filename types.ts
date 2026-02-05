export interface SetData {
  weight?: number;
  reps?: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  weight?: number;
  reps?: number;
  setsData?: SetData[];
  notes?: string;
}

export interface Workout {
  id: string;
  date: string;
  group: string;
  exercises: Exercise[];
  duration?: number;
  notes?: string;
}

export interface WorkoutGroup {
  id: string;
  name: string;
  exercises: Omit<Exercise, 'id' | 'setsData'>[];
}

export interface Settings {
  customGroups?: WorkoutGroup[];
  customExercises?: Omit<Exercise, 'id' | 'setsData'>[];
  preferences?: {
    defaultSets?: number;
    defaultReps?: number;
  };
}

export interface TelegramUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
}
