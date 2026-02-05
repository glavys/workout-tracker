import { WorkoutGroup } from '../types';

export const workoutGroups: WorkoutGroup[] = [
  {
    id: 'chest',
    name: 'Грудь',
    exercises: [
      { name: 'Жим штанги лежа', sets: 4, reps: 8, weight: 50 },
      { name: 'Жим гантелей на наклонной скамье', sets: 3, reps: 10, weight: 20 },
      { name: 'Разведение гантелей в наклоне', sets: 3, reps: 12, weight: 10 },
      { name: 'Армейский жим гантелей сидя', sets: 3, reps: 10, weight: 12 },
      { name: 'Разведение гантелей в стороны', sets: 3, reps: 12, weight: 6 },
      { name: 'Скручивания на пресс', sets: 3, reps: 15 }
    ]
  },
  {
    id: 'back',
    name: 'Спина',
    exercises: [
      { name: 'Тяга горизонтального блока к поясу', sets: 4, reps: 12, weight: 40 },
      { name: 'Подтягивания', sets: 4, reps: 8 },
      { name: 'Тяга гантели одной рукой в наклоне', sets: 3, reps: 10, weight: 16 },
      { name: 'Тяга верхнего блока к груди', sets: 3, reps: 12, weight: 30 },
      { name: 'Скручивания на пресс', sets: 3, reps: 15 }
    ]
  },
  {
    id: 'legs',
    name: 'Ноги',
    exercises: [
      { name: 'Жим ногами', sets: 4, reps: 10, weight: 100 },
      { name: 'Разгибание ног в тренажере', sets: 3, reps: 12, weight: 30 },
      { name: 'Сведение ног в тренажере', sets: 3, reps: 12, weight: 25 },
      { name: 'Выпады с гантелями', sets: 3, reps: 10, weight: 12 },
      { name: 'Подъем на носки стоя', sets: 3, reps: 15, weight: 30 },
      { name: 'Скручивания на пресс', sets: 3, reps: 15 }
    ]
  }
];

export const additionalExercises = [
  { name: 'Подъем гантелей на бицепс стоя', sets: 3, reps: 10, weight: 12 },
  { name: 'Подъем гантелей на бицепс сидя', sets: 3, reps: 10, weight: 10 },
  { name: 'Подъем штанги на бицепс стоя', sets: 4, reps: 8, weight: 20 },
  { name: 'Французский жим гантели из-за головы', sets: 3, reps: 10, weight: 12 },
  { name: 'Французский жим гантели стоя', sets: 3, reps: 10, weight: 10 },
  { name: 'Сгибания запястий со штангой', sets: 3, reps: 12, weight: 10 },
  { name: 'Разгибания запястий со штангой', sets: 3, reps: 12, weight: 8 },
  { name: 'Шраги со штангой', sets: 4, reps: 12, weight: 40 },
  { name: 'Шраги с гантелями', sets: 4, reps: 12, weight: 20 },
  { name: 'Жим гантелей сидя', sets: 3, reps: 10, weight: 12 },
  { name: 'Тяга штанги к подбородку', sets: 3, reps: 12, weight: 20 },
  { name: 'Махи гантелей в стороны', sets: 3, reps: 12, weight: 6 },
  { name: 'Махи гантелей перед собой', sets: 3, reps: 12, weight: 6 },
  { name: 'Махи гантелей в наклоне', sets: 3, reps: 12, weight: 6 }
];
