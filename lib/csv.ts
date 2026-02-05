import { Workout } from '../types';

export const exportToCSV = (workouts: Workout[]) => {
  if (workouts.length === 0) return;

  const groupNames: Record<string, string> = {
    chest: 'Грудь',
    back: 'Спина',
    legs: 'Ноги'
  };

  const headers = ['Группа', 'Дата', 'Упражнение', 'Подход №', 'Вес (кг)', 'Повторения', 'Длительность (мин)', 'Заметки'];

  const rows = workouts.flatMap(workout =>
    workout.exercises.map(exercise => {
      if (exercise.setsData && exercise.setsData.length > 0) {
        return exercise.setsData.map((setData, i) => [
          groupNames[workout.group] || workout.group,
          new Date(workout.date).toLocaleDateString('ru-RU'),
          exercise.name,
          i + 1,
          setData.weight || '',
          setData.reps || '',
          workout.duration || '',
          `${workout.notes || ''} ${exercise.notes || ''}`.trim()
        ]);
      }
      return [[
        groupNames[workout.group] || workout.group,
        new Date(workout.date).toLocaleDateString('ru-RU'),
        exercise.name,
        1,
        exercise.weight || '',
        exercise.reps || '',
        workout.duration || '',
        `${workout.notes || ''} ${exercise.notes || ''}`.trim()
      ]];
    })
  ).flat();

  const csvContent = [
    headers.join(';'),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `workouts-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};
