'use client';

import { useState, useEffect } from 'react';
import AddWorkout from '../components/AddWorkout';
import WorkoutList from '../components/WorkoutList';
import Stats from '../components/Stats';
import { useTelegramAuth } from '../hooks/useTelegramAuth';

type Tab = 'add' | 'history' | 'stats';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('add');
  const [mounted, setMounted] = useState(false);
  const { user, loading: authLoading } = useTelegramAuth();

  useEffect(() => {
    setMounted(true);
    const savedTab = localStorage.getItem('active-tab') as Tab;
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('active-tab', activeTab);
    }
  }, [activeTab, mounted]);

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Загрузка...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'add' as Tab, label: 'Новая тренировка' },
    { id: 'history' as Tab, label: 'История' },
    { id: 'stats' as Tab, label: 'Статистика' }
  ];

  return (
    <div className="min-h-screen pb-20">
      <nav className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 font-medium transition-colors relative text-sm md:text-base ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-blue-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="py-6 md:py-8">
        {activeTab === 'add' && <AddWorkout />}
        {activeTab === 'history' && <WorkoutList />}
        {activeTab === 'stats' && <Stats />}
      </div>
    </div>
  );
}
