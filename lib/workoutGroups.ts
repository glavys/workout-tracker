import { WorkoutGroup, ExerciseTemplate } from '../types';

export const workoutGroups: WorkoutGroup[] = [
  {
    id: 'chest',
    name: 'Грудь',
    exercises: [
      { name: 'Жим штанги лежа', sets: 4, reps: 8, weight: 50, guideUrl: 'https://youtu.be/rT7DgCr-3pg' },
      { name: 'Жим гантелей на наклонной скамье', sets: 3, reps: 10, weight: 20, guideUrl: 'https://youtu.be/8iPEnn-ltC8' },
      { name: 'Разведение гантелей в наклоне', sets: 3, reps: 12, weight: 10, guideUrl: 'https://youtu.be/eozdVDA78K0' },
      { name: 'Армейский жим гантелей сидя', sets: 3, reps: 10, weight: 12, guideUrl: 'https://youtu.be/qEwKCR5JCog' },
      { name: 'Разведение гантелей в стороны', sets: 3, reps: 12, weight: 6, guideUrl: 'https://youtu.be/3VcKaXpzqRo' },
      { name: 'Скручивания на пресс', sets: 3, reps: 15, guideUrl: 'https://youtu.be/Xyd_fa5zoEU' }
    ]
  },
  {
    id: 'back',
    name: 'Спина',
    exercises: [
      { name: 'Тяга горизонтального блока к поясу', sets: 4, reps: 12, weight: 40, guideUrl: 'https://youtu.be/GZbfZ033f74' },
      { name: 'Подтягивания', sets: 4, reps: 8, guideUrl: 'https://youtu.be/eGo4IYlbE5g' },
      { name: 'Тяга гантели одной рукой в наклоне', sets: 3, reps: 10, weight: 16, guideUrl: 'https://youtu.be/pYcpY20QaE8' },
      { name: 'Тяга верхнего блока к груди', sets: 3, reps: 12, weight: 30, guideUrl: 'https://youtu.be/CAwf7n6Luuc' },
      { name: 'Скручивания на пресс', sets: 3, reps: 15, guideUrl: 'https://youtu.be/Xyd_fa5zoEU' }
    ]
  },
  {
    id: 'legs',
    name: 'Ноги',
    exercises: [
      { name: 'Жим ногами', sets: 4, reps: 10, weight: 100, guideUrl: 'https://youtu.be/IZxyjW7MPJQ' },
      { name: 'Разгибание ног в тренажере', sets: 3, reps: 12, weight: 30, guideUrl: 'https://youtu.be/YyvSfVjQeL0' },
      { name: 'Сгибание ног в тренажере', sets: 3, reps: 12, weight: 25, guideUrl: 'https://youtu.be/1Tq3QdYUuHs' },
      { name: 'Сведение ног в тренажере', sets: 3, reps: 12, weight: 25, guideUrl: 'https://youtu.be/2z2gJBGQyKE' },
      { name: 'Подъем на носки стоя', sets: 3, reps: 15, weight: 30, guideUrl: 'https://youtu.be/gwLzBJYoWlI' },
      { name: 'Скручивания на пресс', sets: 3, reps: 15, guideUrl: 'https://youtu.be/Xyd_fa5zoEU' }
    ]
  }
];

export const additionalExercises: ExerciseTemplate[] = [
  { name: 'Подъем гантелей на бицепс стоя', sets: 3, reps: 10, weight: 12, guideUrl: 'https://youtu.be/ykJmrZ5v0Oo' },
  { name: 'Подъем гантелей на бицепс сидя', sets: 3, reps: 10, weight: 10, guideUrl: 'https://youtu.be/sAq_ocpRh_I' },
  { name: 'Подъем штанги на бицепс стоя', sets: 4, reps: 8, weight: 20, guideUrl: 'https://youtu.be/kwG2ipFRgFo' },
  { name: 'Тяга косички на трицепс стоя', sets: 3, reps: 10, weight: 12, guideUrl: 'https://youtu.be/2-LAMcpzODU' },
  { name: 'Тяга косички на трицепс из-за головы', sets: 3, reps: 10, weight: 10, guideUrl: 'https://youtu.be/nRiJVZDpdL0' },
  { name: 'Сгибания запястий со штангой', sets: 3, reps: 12, weight: 10, guideUrl: 'https://youtu.be/DBzfDMQ4xzE' },
  { name: 'Разгибания запястий со штангой', sets: 3, reps: 12, weight: 8, guideUrl: 'https://youtu.be/FW-uN9geaWo' },
  { name: 'Шраги со штангой', sets: 4, reps: 12, weight: 40, guideUrl: 'https://youtu.be/cJRVVxmytaM' },
  { name: 'Шраги с гантелями', sets: 4, reps: 12, weight: 20, guideUrl: 'https://youtu.be/cJRVVxmytaM' },
  { name: 'Жим гантелей сидя', sets: 3, reps: 10, weight: 12, guideUrl: 'https://youtu.be/qEwKCR5JCog' },
  { name: 'Тяга штанги к подбородку', sets: 3, reps: 12, weight: 20, guideUrl: 'https://youtu.be/amCU-ziHITM' },
  { name: 'Махи гантелей в стороны', sets: 3, reps: 12, weight: 6, guideUrl: 'https://youtu.be/3VcKaXpzqRo' },
  { name: 'Махи гантелей перед собой', sets: 3, reps: 12, weight: 6, guideUrl: 'https://youtu.be/-t7fuZ0KhDA' },
  { name: 'Махи гантелей в наклоне', sets: 3, reps: 12, weight: 6, guideUrl: 'https://youtu.be/EA7u4Q_8HQ0' }
];

// Маппинг guideUrl по имени упражнения для быстрого доступа из UI
const _allExercises = [...workoutGroups.flatMap(g => g.exercises), ...additionalExercises];
export const exerciseGuides: Record<string, string> = {};
for (const e of _allExercises) {
  if (e.guideUrl) exerciseGuides[e.name] = e.guideUrl;
}
