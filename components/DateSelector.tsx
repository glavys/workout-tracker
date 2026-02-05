'use client';

import { useState, useEffect } from 'react';

interface DateSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const DAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] as const;

export default function DateSelector({ value, onChange }: DateSelectorProps) {
  const [localDate, setLocalDate] = useState(value);

  useEffect(() => {
    if (value !== localDate) {
      setLocalDate(value);
    }
  }, [value]);

  const handleDateChange = (newDate: string) => {
    setLocalDate(newDate);
    onChange(newDate);
  };

  const today = new Date().toISOString().split('T')[0];
  const isToday = localDate === today;
  const dayOfWeek = DAYS[new Date(localDate).getDay()];

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm mb-5">
      <label className="text-xs font-medium text-gray-400 mb-2 block">Дата тренировки</label>
      <div className="flex gap-3 items-center">
        <input
          type="date"
          value={localDate}
          onChange={e => handleDateChange(e.target.value)}
          className="flex-1 p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
        <div className={`px-5 py-3 rounded-xl font-semibold text-center min-w-[60px] ${
          isToday ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {dayOfWeek}
        </div>
      </div>
    </div>
  );
}
