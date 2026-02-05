'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Workout } from '../types';
import { storage } from '../lib/storage';
import { exportToCSV } from '../lib/csv';

const GROUP_NAMES: Record<string, string> = {
  chest: 'Грудь',
  back: 'Спина',
  legs: 'Ноги'
};

export default function Stats() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const loadWorkouts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await storage.getWorkouts();
      setWorkouts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  const exercises = useMemo(
    () => {
      const names = workouts.flatMap(w => w.exercises.map(e => e.name));
      return Array.from(new Set(names)).filter(Boolean) as string[];
    },
    [workouts]
  );

  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return {
      totalWorkouts: workouts.length,
      totalExercises: workouts.reduce((sum, w) => sum + w.exercises.length, 0),
      totalTime: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
      thisWeek: workouts.filter(w => new Date(w.date) > weekAgo).length,
      byGroup: {
        chest: workouts.filter(w => w.group === 'chest').length,
        back: workouts.filter(w => w.group === 'back').length,
        legs: workouts.filter(w => w.group === 'legs').length
      }
    };
  }, [workouts]);

  const exerciseProgress = useMemo(() => {
    if (!selectedExercise) return [];

    return workouts
      .flatMap(w =>
        w.exercises
          .filter(e => e.name === selectedExercise)
          .map(e => {
            let maxWeight = 0;
            let totalReps = 0;
            if (e.setsData && e.setsData.length > 0) {
              maxWeight = Math.max(...e.setsData.map(s => s.weight || 0));
              totalReps = e.setsData.reduce((sum, s) => sum + (s.reps || 0), 0);
            } else {
              maxWeight = e.weight || 0;
              totalReps = e.reps || 0;
            }
            return {
              date: w.date,
              group: w.group,
              weight: maxWeight,
              reps: totalReps,
              sets: e.sets
            };
          })
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [workouts, selectedExercise]);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
  }, []);

  const handleExport = useCallback(() => {
    exportToCSV(workouts);
  }, [workouts]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Статистика</h1>
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Статистика</h1>
        <button
          onClick={handleExport}
          disabled={workouts.length === 0}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Экспорт CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm">
          <p className="text-2xl md:text-3xl font-bold text-blue-600">{stats.totalWorkouts}</p>
          <p className="text-xs md:text-sm text-gray-400 mt-1">Тренировок</p>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm">
          <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.totalExercises}</p>
          <p className="text-xs md:text-sm text-gray-400 mt-1">Упражнений</p>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm">
          <p className="text-2xl md:text-3xl font-bold text-purple-600">{stats.totalTime}</p>
          <p className="text-xs md:text-sm text-gray-400 mt-1">Минут</p>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm">
          <p className="text-2xl md:text-3xl font-bold text-orange-600">{stats.thisWeek}</p>
          <p className="text-xs md:text-sm text-gray-400 mt-1">За неделю</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
        <div className="bg-blue-50 p-4 md:p-5 rounded-2xl">
          <p className="text-xl md:text-2xl font-bold text-blue-600">{stats.byGroup.chest}</p>
          <p className="text-sm text-gray-500">Грудь</p>
        </div>
        <div className="bg-green-50 p-4 md:p-5 rounded-2xl">
          <p className="text-xl md:text-2xl font-bold text-green-600">{stats.byGroup.back}</p>
          <p className="text-sm text-gray-500">Спина</p>
        </div>
        <div className="bg-emerald-50 p-4 md:p-5 rounded-2xl">
          <p className="text-xl md:text-2xl font-bold text-emerald-600">{stats.byGroup.legs}</p>
          <p className="text-sm text-gray-500">Ноги</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 text-gray-900">Прогресс по упражнениям</h2>
        <select
          value={selectedExercise}
          onChange={e => setSelectedExercise(e.target.value)}
          className="w-full p-3 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 shadow-sm text-gray-700"
        >
          <option value="">Выберите упражнение</option>
          {exercises.map(exercise => (
            <option key={exercise} value={exercise}>{exercise}</option>
          ))}
        </select>

        {selectedExercise && exerciseProgress.length > 0 && (
          <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm">
            {exerciseProgress.map((record, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-b-0">
                <div className="flex-1">
                  <span className="text-gray-600 font-medium">{formatDate(record.date)}</span>
                  <span className="ml-2 text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                    {GROUP_NAMES[record.group] || record.group}
                  </span>
                </div>
                <div className="flex gap-2 md:gap-4">
                  {record.weight > 0 && (
                    <span className="font-semibold text-blue-600 text-sm">{record.weight} кг</span>
                  )}
                  <span className="text-gray-400 text-sm">{record.sets} × {record.reps}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4 text-gray-900">Последние тренировки</h2>
        <div className="space-y-3">
          {workouts.slice(0, 5).map(workout => (
            <div key={workout.id} className="bg-white p-5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    {GROUP_NAMES[workout.group] || workout.group}
                  </span>
                  <p className="font-bold text-gray-900 mt-2">{formatDate(workout.date)}</p>
                </div>
                {workout.duration && (
                  <span className="text-sm text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md">{workout.duration} мин</span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {workout.exercises.map(e => e.name).join(', ')}
              </p>
            </div>
          ))}
          {workouts.length === 0 && (
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm text-center">
              <p className="text-gray-400">Тренировок пока нет</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
