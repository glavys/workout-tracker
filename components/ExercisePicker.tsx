'use client';

import { useState, useRef, useEffect } from 'react';
import { additionalExercises } from '../lib/workoutGroups';

interface ExercisePickerProps {
  onAdd: (name: string, sets: number, reps: number, weight?: number) => void;
  onClose: () => void;
}

export default function ExercisePicker({ onAdd, onClose }: ExercisePickerProps) {
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const filteredExercises = additionalExercises.filter(exercise =>
    exercise.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
      <div className="p-3 border-b border-gray-100">
        <input
          type="text"
          placeholder="Поиск упражнения..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      </div>

      <div className="overflow-y-auto flex-1">
        {filteredExercises.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Упражнения не найдены
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredExercises.map(exercise => (
              <button
                key={exercise.name}
                onClick={() => onAdd(exercise.name, exercise.sets, exercise.reps, exercise.weight)}
                className="w-full p-3 text-left hover:bg-blue-50 transition flex justify-between items-center group"
              >
                <p className="text-sm text-gray-900 group-hover:text-blue-600">{exercise.name}</p>
                <span className="text-gray-400 group-hover:text-blue-600 text-lg font-light">+</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
