'use client';

import { useState, useEffect, useCallback } from 'react';
import { Workout } from '../types';
import { storage } from '../lib/storage';

const GROUP_NAMES: Record<string, string> = {
  chest: 'Грудь',
  back: 'Спина',
  legs: 'Ноги',
  day_a: 'День A',
  day_b: 'День B'
};

export default function WorkoutList() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  const deleteWorkout = useCallback(async (id: string) => {
    await storage.deleteWorkout(id);
    const data = await storage.getWorkouts();
    setWorkouts(data);
    if (selectedId === id) {
      setSelectedId(null);
    }
  }, [selectedId]);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, []);

  const formatExerciseSets = useCallback((exercise: any) => {
    if (exercise.setsData && exercise.setsData.length > 0) {
      const setsInfo = exercise.setsData.map((set: any) => {
        const weight = set.weight ? `${set.weight}кг` : '';
        return `${weight}${set.reps || 0}`;
      }).join(', ');
      return `${exercise.sets} подходов (${setsInfo})`;
    }
    return `${exercise.sets} × ${exercise.reps}`;
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">История тренировок</h1>
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">История тренировок</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {workouts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
              <p className="text-gray-400">Тренировок пока нет</p>
            </div>
          ) : (
            workouts.map(workout => (
              <div
                key={workout.id}
                onClick={() => setSelectedId(workout.id)}
                className={`p-5 bg-white rounded-2xl shadow-sm cursor-pointer transition hover:shadow-md ${
                  selectedId === workout.id ? 'ring-2 ring-blue-500/30' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      {GROUP_NAMES[workout.group] || workout.group}
                    </span>
                    <p className="font-bold text-gray-900 mt-2">{formatDate(workout.date)}</p>
                    <p className="text-sm text-gray-400">{workout.exercises.length} упражнени{workout.exercises.length === 1 ? 'е' : 'я'}</p>
                  </div>
                  {workout.duration && (
                    <span className="text-sm text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md">{workout.duration} мин</span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {workout.exercises.slice(0, 2).map(e => e.name).join(', ')}
                  {workout.exercises.length > 2 && '...'}
                </div>
              </div>
            ))
          )}
        </div>

        {selectedId && (() => {
          const selectedWorkout = workouts.find(w => w.id === selectedId);
          if (!selectedWorkout) return null;

          return (
            <div className="bg-white p-5 rounded-2xl shadow-sm h-fit sticky top-24">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    {GROUP_NAMES[selectedWorkout.group] || selectedWorkout.group}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 mt-2">{formatDate(selectedWorkout.date)}</h2>
                  {selectedWorkout.duration && (
                    <p className="text-sm text-gray-400 mt-1">{selectedWorkout.duration} минут</p>
                  )}
                </div>
                <button
                  onClick={() => deleteWorkout(selectedWorkout.id)}
                  className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition"
                >
                  Удалить
                </button>
              </div>

              <div className="space-y-3">
                {selectedWorkout.exercises.map((exercise, index) => (
                  <div key={exercise.id} className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-900">{index + 1}. {exercise.name}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      {formatExerciseSets(exercise)}
                    </div>
                    {exercise.notes && (
                      <p className="text-sm text-gray-400 mt-2">{exercise.notes}</p>
                    )}
                  </div>
                ))}
              </div>

              {selectedWorkout.notes && (
                <div className="mt-5 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">{selectedWorkout.notes}</p>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
