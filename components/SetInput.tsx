'use client';

import { memo } from 'react';
import { SetData } from '../types';

interface SetInputProps {
  setNumber: number;
  setData: SetData;
  onUpdate: (setData: SetData) => void;
  hasWeight?: boolean;
}

function SetInput({ setNumber, setData, onUpdate, hasWeight = true }: SetInputProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl">
      <span className="text-xs font-medium text-gray-400 min-w-[20px] text-center">
        {setNumber}
      </span>
      {hasWeight && (
        <input
          type="number"
          placeholder="кг"
          value={setData.weight ?? ''}
          onChange={e => onUpdate({ ...setData, weight: parseInt(e.target.value) || 0 })}
          className="w-16 p-2 text-sm bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 font-medium"
          min="0"
          inputMode="numeric"
        />
      )}
      <input
        type="number"
        placeholder="повт"
        value={setData.reps ?? ''}
        onChange={e => onUpdate({ ...setData, reps: parseInt(e.target.value) || 0 })}
        className="flex-1 p-2 text-sm bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 font-medium"
        min="0"
        inputMode="numeric"
      />
    </div>
  );
}

export default memo(SetInput);
