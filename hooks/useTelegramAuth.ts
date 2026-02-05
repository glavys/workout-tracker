'use client';

import { useState, useEffect, useCallback } from 'react';
import { TelegramUser } from '../types';
import { setAuthToken } from '../lib/storage';

interface AuthState {
  user: TelegramUser | null;
  loading: boolean;
  error: string | null;
}

export function useTelegramAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const authenticate = useCallback(async () => {
    try {
      // Получаем initData из Telegram WebApp
      const tg = (window as any).Telegram?.WebApp;
      const initDataRaw = tg?.initData;

      if (!initDataRaw) {
        // Не в Telegram — работаем без авторизации (localStorage mode)
        setState({ user: null, loading: false, error: null });
        return;
      }

      // Сохраняем токен для дальнейших запросов
      setAuthToken(initDataRaw);

      // Отправляем на сервер для валидации
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { Authorization: `tma ${initDataRaw}` },
      });

      if (!res.ok) {
        throw new Error('Auth failed');
      }

      const data = await res.json();

      setState({
        user: {
          id: data.userId,
          firstName: data.firstName,
          username: data.username,
          photoUrl: data.photoUrl,
        },
        loading: false,
        error: null,
      });

      // Настраиваем Telegram WebApp
      tg?.ready();
      tg?.expand();
    } catch (err) {
      console.error('Telegram auth error:', err);
      setAuthToken(null);
      setState({
        user: null,
        loading: false,
        error: 'Ошибка авторизации',
      });
    }
  }, []);

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  return state;
}
