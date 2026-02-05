import { Workout, Settings } from '../types';

const CACHE_KEY = 'workout-tracker';
const SETTINGS_CACHE_KEY = 'workout-settings';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

function authHeaders(): HeadersInit {
  if (!authToken) return {};
  return { Authorization: `tma ${authToken}` };
}

function isAuthenticated(): boolean {
  return !!authToken;
}

// --- localStorage кэш ---
function getCachedWorkouts(): Workout[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setCachedWorkouts(workouts: Workout[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CACHE_KEY, JSON.stringify(workouts));
}

function getCachedSettings(): Settings {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(SETTINGS_CACHE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function setCachedSettings(settings: Settings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
}

// --- API + кэш ---
export const storage = {
  getWorkouts: async (): Promise<Workout[]> => {
    if (!isAuthenticated()) return getCachedWorkouts();

    try {
      const res = await fetch('/api/workouts', { headers: authHeaders() });
      if (!res.ok) throw new Error('API error');
      const workouts: Workout[] = await res.json();
      setCachedWorkouts(workouts);
      return workouts;
    } catch {
      return getCachedWorkouts();
    }
  },

  saveWorkout: async (workout: Omit<Workout, 'id'> & { id?: string }): Promise<void> => {
    if (!isAuthenticated()) {
      // Фоллбэк на localStorage
      const workouts = getCachedWorkouts();
      const w = { ...workout, id: workout.id || Date.now().toString() } as Workout;
      workouts.unshift(w);
      setCachedWorkouts(workouts);
      return;
    }

    const res = await fetch('/api/workouts', {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(workout),
    });

    if (!res.ok) throw new Error('Failed to save workout');

    // Обновляем кэш
    const { id } = await res.json();
    const workouts = getCachedWorkouts();
    workouts.unshift({ ...workout, id } as Workout);
    setCachedWorkouts(workouts);
  },

  deleteWorkout: async (id: string): Promise<void> => {
    if (!isAuthenticated()) {
      const workouts = getCachedWorkouts().filter(w => w.id !== id);
      setCachedWorkouts(workouts);
      return;
    }

    const res = await fetch(`/api/workouts/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    if (!res.ok) throw new Error('Failed to delete workout');

    const workouts = getCachedWorkouts().filter(w => w.id !== id);
    setCachedWorkouts(workouts);
  },

  getWorkout: async (id: string): Promise<Workout | undefined> => {
    const workouts = await storage.getWorkouts();
    return workouts.find(w => w.id === id);
  },

  getSettings: async (): Promise<Settings> => {
    if (!isAuthenticated()) return getCachedSettings();

    try {
      const res = await fetch('/api/settings', { headers: authHeaders() });
      if (!res.ok) throw new Error('API error');
      const settings: Settings = await res.json();
      setCachedSettings(settings);
      return settings;
    } catch {
      return getCachedSettings();
    }
  },

  updateSettings: async (settings: Settings): Promise<void> => {
    setCachedSettings(settings);

    if (!isAuthenticated()) return;

    await fetch('/api/settings', {
      method: 'PUT',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
  },
};
