'use client';

import { useState, useEffect, useCallback } from 'react';
import { Exercise, Workout, SetData } from '../types';
import { storage } from '../lib/storage';
import { workoutGroups } from '../lib/workoutGroups';
import DateSelector from './DateSelector';
import SetInput from './SetInput';
import ExercisePicker from './ExercisePicker';

const STORAGE_KEY = 'current-workout';

interface CurrentWorkoutState {
  selectedGroup: string | null;
  exercises: Exercise[];
  date: string;
  duration: string;
  notes: string;
}

const BODYWEIGHT_EXERCISES = ['Подтягивания', 'Скручивания на пресс', 'Подъем на носки стоя'] as const;

export default function AddWorkout() {
  const [state, setState] = useState<CurrentWorkoutState>({
    selectedGroup: null,
    exercises: [],
    date: new Date().toISOString().split('T')[0],
    duration: '',
    notes: ''
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);

  const { selectedGroup, exercises, date, duration, notes } = state;

  const saveState = useCallback(() => {
    if (selectedGroup || exercises.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, selectedGroup, exercises.length]);

  const loadState = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: CurrentWorkoutState = JSON.parse(saved);
        setState(parsed);
      } catch {
        console.error('Failed to load state');
      }
    }
  }, []);

  useEffect(() => {
    loadState();
  }, [loadState]);

  useEffect(() => {
    const timeout = setTimeout(saveState, 500);
    return () => clearTimeout(timeout);
  }, [saveState]);

  const selectGroup = useCallback((groupId: string) => {
    const group = workoutGroups.find(g => g.id === groupId);
    if (!group) return;

    const newExercises: Exercise[] = group.exercises.map((e, index) => ({
      id: `${Date.now()}-${index}`,
      name: e.name,
      sets: e.sets,
      weight: e.weight,
      reps: e.reps,
      setsData: Array(e.sets).fill(null).map(() => ({ weight: e.weight, reps: e.reps }))
    }));

    setState(prev => ({ ...prev, selectedGroup: groupId, exercises: newExercises }));
  }, []);

  const removeExercise = useCallback((id: string) => {
    setState(prev => ({ ...prev, exercises: prev.exercises.filter(e => e.id !== id) }));
  }, []);

  const addCustomExercise = useCallback((name: string, sets: number, reps: number, weight?: number) => {
    const newExercise: Exercise = {
      id: `${Date.now()}`,
      name,
      sets,
      reps,
      weight,
      setsData: Array(sets).fill(null).map(() => ({ weight: weight || 0, reps }))
    };

    setState(prev => {
      if (pickerIndex !== null && pickerIndex >= 0 && pickerIndex <= prev.exercises.length) {
        const newExercises = [...prev.exercises];
        newExercises.splice(pickerIndex, 0, newExercise);
        return { ...prev, exercises: newExercises };
      }
      return { ...prev, exercises: [...prev.exercises, newExercise] };
    });

    setShowPicker(false);
    setPickerIndex(null);
  }, [pickerIndex]);

  const openPicker = useCallback((index?: number) => {
    setPickerIndex(index !== undefined ? index : null);
    setShowPicker(true);
  }, []);

  const updateExerciseSetsCount = useCallback((id: string, newSets: number) => {
    setState(prev => ({
      ...prev,
      exercises: prev.exercises.map(e => {
        if (e.id !== id) return e;

        const currentSets = e.setsData || [];
        if (newSets > currentSets.length) {
          const lastSet = currentSets[currentSets.length - 1] || { weight: 0, reps: 0 };
          return {
            ...e,
            sets: newSets,
            setsData: [...currentSets, ...Array(newSets - currentSets.length).fill(lastSet)]
          };
        }
        if (newSets < currentSets.length) {
          return {
            ...e,
            sets: newSets,
            setsData: currentSets.slice(0, newSets)
          };
        }
        return { ...e, sets: newSets };
      })
    }));
  }, []);

  const updateSetData = useCallback((exerciseId: string, setIndex: number, setData: SetData) => {
    setState(prev => ({
      ...prev,
      exercises: prev.exercises.map(e => {
        if (e.id !== exerciseId) return e;
        const newSetsData = [...(e.setsData || [])];
        newSetsData[setIndex] = setData;
        return { ...e, setsData: newSetsData };
      })
    }));
  }, []);

  const updateExerciseNotes = useCallback((exerciseId: string, notes: string) => {
    setState(prev => ({
      ...prev,
      exercises: prev.exercises.map(e =>
        e.id === exerciseId ? { ...e, notes: notes || undefined } : e
      )
    }));
  }, []);

  const resetWorkout = useCallback(() => {
    setState({
      selectedGroup: null,
      exercises: [],
      date: new Date().toISOString().split('T')[0],
      duration: '',
      notes: ''
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const saveWorkout = useCallback(async () => {
    if (!selectedGroup || saving) return;

    const validExercises = exercises.filter(e => e.name.trim());
    if (validExercises.length === 0) return;

    setSaving(true);

    try {
      const workout = {
        id: Date.now().toString(),
        date: new Date(date).toISOString(),
        group: selectedGroup,
        exercises: validExercises,
        duration: duration ? parseInt(duration) : undefined,
        notes: notes.trim() || undefined
      };

      await storage.saveWorkout(workout);
      setSaved(true);
      setTimeout(() => {
        resetWorkout();
        setSaved(false);
      }, 2000);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  }, [selectedGroup, exercises, date, duration, notes, resetWorkout, saving]);

  const hasWeight = useCallback((exerciseName: string) => {
    return !BODYWEIGHT_EXERCISES.includes(exerciseName as any);
  }, []);

  if (!selectedGroup) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        <h1 className="text-2xl font-bold mb-8 text-gray-900 text-center">Выберите группу тренировки</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workoutGroups.map(group => (
            <button
              key={group.id}
              onClick={() => selectGroup(group.id)}
              className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition text-left active:scale-[0.98]"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-1">{group.name}</h2>
              <p className="text-sm text-gray-400">{group.exercises.length} упражнений</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const groupName = workoutGroups.find(g => g.id === selectedGroup)?.name || '';

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6">
      <DateSelector value={date} onChange={date => setState(prev => ({ ...prev, date }))} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{groupName}</h1>
          <p className="text-sm text-gray-400 mt-0.5">Заполните данные тренировки</p>
        </div>
        <button
          onClick={resetWorkout}
          className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition font-medium"
        >
          ✕ Отмена
        </button>
      </div>

      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <div key={exercise.id} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 mr-3">
                <p className="font-bold text-gray-900">{index + 1}. {exercise.name}</p>
              </div>
              <button
                onClick={() => removeExercise(exercise.id)}
                className="px-3 py-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition text-sm"
              >
                ✕ Убрать
              </button>
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Количество подходов</label>
              <input
                type="number"
                value={exercise.sets}
                onChange={e => updateExerciseSetsCount(exercise.id, parseInt(e.target.value) || 0)}
                className="w-20 md:w-24 p-2.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
                min="1"
                max="10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Array.from({ length: exercise.sets }, (_, i) => (
                <SetInput
                  key={i}
                  setNumber={i + 1}
                  setData={exercise.setsData?.[i] || {}}
                  onUpdate={setData => updateSetData(exercise.id, i, setData)}
                  hasWeight={hasWeight(exercise.name)}
                />
              ))}
            </div>

            <input
              type="text"
              placeholder="Заметки к упражнению"
              value={exercise.notes || ''}
              onChange={e => updateExerciseNotes(exercise.id, e.target.value)}
              className="mt-4 w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-300"
            />
          </div>
        ))}

        {showPicker && (
          <div className="relative">
            <ExercisePicker
              onAdd={addCustomExercise}
              onClose={() => {
                setShowPicker(false);
                setPickerIndex(null);
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => openPicker()}
            className="py-3.5 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-blue-400 hover:text-blue-500 transition font-medium text-sm"
          >
            + Добавить упражнение
          </button>
          <div className="relative">
            <button
              onClick={() => openPicker(exercises.length)}
              className="w-full py-3.5 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-green-400 hover:text-green-500 transition font-medium text-sm"
            >
              + Вставить после последнего
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Длительность (мин)</label>
            <input
              type="number"
              value={duration}
              onChange={e => setState(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full p-3 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              min="0"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Заметки</label>
            <input
              type="text"
              value={notes}
              onChange={e => setState(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full p-3 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="Общее самочувствие"
            />
          </div>
        </div>

        <button
          onClick={saveWorkout}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-semibold text-base shadow-lg shadow-blue-600/25 active:scale-[0.98]"
        >
          {saved ? '✓ Сохранено!' : saving ? 'Сохранение...' : 'Сохранить тренировку'}
        </button>
      </div>
    </div>
  );
}
