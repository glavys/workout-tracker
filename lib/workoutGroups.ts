import { WorkoutGroup, ExerciseTemplate } from '../types';

export const workoutGroups: WorkoutGroup[] = [
  {
    id: 'day_a',
    name: 'День A — Фулбоди',
    exercises: [
      { name: 'Жим ногами', sets: 4, reps: 10, weight: 100, guideUrl: 'https://youtu.be/IZxyjW7MPJQ' },
      { name: 'Сгибание ног в тренажере', sets: 3, reps: 12, weight: 40, guideUrl: 'https://youtu.be/1Tq3QdYUuHs' },
      { name: 'Жим штанги лежа', sets: 4, reps: 8, weight: 50, guideUrl: 'https://youtu.be/rT7DgCr-3pg' },
      { name: 'Армейский жим гантелей сидя', sets: 3, reps: 10, weight: 12, guideUrl: 'https://youtu.be/qEwKCR5JCog' },
      { name: 'Подтягивания', sets: 3, reps: 10, guideUrl: 'https://youtu.be/eGo4IYlbE5g' },
      { name: 'Тяга гантели одной рукой в наклоне', sets: 3, reps: 10, weight: 25, guideUrl: 'https://youtu.be/pYcpY20QaE8' },
      { name: 'Подъем гантелей на бицепс сидя', sets: 3, reps: 10, weight: 10, guideUrl: 'https://youtu.be/sAq_ocpRh_I' },
      { name: 'Подъем ног в висе', sets: 3, reps: 12 }
    ]
  },
  {
    id: 'day_b',
    name: 'День B — Фулбоди',
    exercises: [
      { name: 'Жим ногами', sets: 3, reps: 12, weight: 90, guideUrl: 'https://youtu.be/IZxyjW7MPJQ' },
      { name: 'Сгибание ног в тренажере', sets: 3, reps: 12, weight: 40, guideUrl: 'https://youtu.be/1Tq3QdYUuHs' },
      { name: 'Жим гантелей на наклонной скамье', sets: 4, reps: 10, weight: 17, guideUrl: 'https://youtu.be/8iPEnn-ltC8' },
      { name: 'Тяга горизонтального блока к поясу', sets: 3, reps: 12, weight: 45, guideUrl: 'https://youtu.be/GZbfZ033f74' },
      { name: 'Тяга верхнего блока к груди', sets: 3, reps: 12, weight: 45, guideUrl: 'https://youtu.be/CAwf7n6Luuc' },
      { name: 'Разведение гантелей в стороны', sets: 3, reps: 12, weight: 10, guideUrl: 'https://youtu.be/3VcKaXpzqRo' },
      { name: 'Разведение гантелей в наклоне', sets: 3, reps: 12, weight: 10, guideUrl: 'https://youtu.be/eozdVDA78K0' },
      { name: 'Тяга косички на трицепс стоя', sets: 3, reps: 10, weight: 12, guideUrl: 'https://youtu.be/2-LAMcpzODU' },
      { name: 'Планка', sets: 3, reps: 45 }
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
