# Гайд по запуску Telegram Mini App — Дневник тренировок

## Содержание
1. [Создание бота в Telegram](#1-создание-бота-в-telegram)
2. [Создание проекта в Supabase](#2-создание-проекта-в-supabase)
3. [Создание таблиц в базе данных](#3-создание-таблиц-в-базе-данных)
4. [Заполнение .env.local](#4-заполнение-envlocal)
5. [Локальный запуск и тестирование](#5-локальный-запуск-и-тестирование)
6. [Деплой на Vercel](#6-деплой-на-vercel)
7. [Привязка Mini App к боту](#7-привязка-mini-app-к-боту)
8. [Тестирование в Telegram](#8-тестирование-в-telegram)

---

## 1. Создание бота в Telegram

1. Открой Telegram, найди **@BotFather**
2. Напиши `/newbot`
3. Придумай имя бота (например: `Мой дневник тренировок`)
4. Придумай username бота (например: `my_workout_diary_bot`) — должен заканчиваться на `bot`
5. BotFather выдаст тебе **токен** вида:
   ```
   7123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
6. **Скопируй этот токен** — он понадобится на шаге 4

> ⚠️ Никому не показывай токен! Это пароль от твоего бота.

---

## 2. Создание проекта в Supabase

1. Перейди на **https://supabase.com** и зарегистрируйся (через GitHub — быстрее всего)
2. Нажми **"New Project"**
3. Заполни:
   - **Name:** `workout-tracker` (любое)
   - **Database Password:** придумай пароль (запиши его, он понадобится если захочешь подключиться напрямую к PostgreSQL)
   - **Region:** выбери ближайший к тебе (например `Central EU (Frankfurt)`)
4. Нажми **"Create new project"**
5. Подожди 1-2 минуты пока проект создастся

### Получение ключей

После создания проекта:

1. В левом меню нажми на иконку **шестерёнки (Settings)** внизу
2. Перейди в **API** (или Project Settings → API)
3. Тебе нужны 3 значения:

| Что | Где найти | Пример |
|-----|-----------|--------|
| **Project URL** | Раздел "Project URL" | `https://abcdefghijklm.supabase.co` |
| **anon (public) key** | Раздел "Project API keys" → `anon` `public` | `eyJhbGciOiJIUzI1NiIs...` (длинная строка) |
| **service_role key** | Раздел "Project API keys" → `service_role` `secret` | `eyJhbGciOiJIUzI1NiIs...` (другая длинная строка) |

> ⚠️ `service_role` ключ — секретный, он даёт полный доступ к БД. Не коммить его в git!

---

## 3. Создание таблиц в базе данных

1. В Supabase Dashboard в левом меню нажми **"SQL Editor"** (иконка терминала)
2. Нажми **"New Query"**
3. Вставь этот SQL и нажми **"Run"** (зелёная кнопка):

```sql
-- Таблица пользователей
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  first_name TEXT,
  username TEXT,
  photo_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Таблица тренировок
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL,
  muscle_group TEXT NOT NULL,
  exercises JSONB NOT NULL,
  duration INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Индексы для быстрых запросов
CREATE INDEX idx_workouts_user ON workouts(user_id);
CREATE INDEX idx_workouts_date ON workouts(user_id, date DESC);
```

4. Должно появиться **"Success. No rows returned"** — это нормально
5. Проверь: в левом меню нажми **"Table Editor"** — должны появиться таблицы `users` и `workouts`

---

## 4. Заполнение .env.local

Открой файл `.env.local` в корне проекта и заполни его реальными значениями:

```bash
# Токен бота из шага 1
BOT_TOKEN=7123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# URL проекта из шага 2
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklm.supabase.co

# anon key из шага 2
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# service_role key из шага 2
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 5. Локальный запуск и тестирование

### Запуск dev-сервера

```bash
cd ~/Desktop/workout-tracker2
npm run dev
```

Открой **http://localhost:3000** — приложение должно работать в режиме localStorage (без Telegram). Это хорошо для проверки что всё запускается.

### Тестирование API

Проверь что API routes отвечают. В другом терминале:

```bash
# Должен вернуть 401 (нет авторизации) — это правильно!
curl http://localhost:3000/api/workouts
```

Ожидаемый ответ: `{"error":"Unauthorized"}`

### Тестирование через Telegram (нужен ngrok)

Чтобы протестировать Telegram авторизацию локально, нужен туннель:

1. Установи ngrok: **https://ngrok.com/download** (бесплатно)
2. Зарегистрируйся на ngrok.com и получи authtoken
3. Запусти:
   ```bash
   ngrok http 3000
   ```
4. Скопируй HTTPS URL (вида `https://xxxx-xx-xx-xx-xx.ngrok-free.app`)
5. Этот URL используй на шаге 7 как Web App URL

---

## 6. Деплой на Vercel

### Подготовка: залить код на GitHub

Если проект ещё не в git:

```bash
cd ~/Desktop/workout-tracker2
git init
git add .
git commit -m "Initial commit: workout tracker with Telegram Mini App"
```

Создай репозиторий на **https://github.com/new** и пуш:

```bash
git remote add origin https://github.com/ТВОЙ_USERNAME/workout-tracker.git
git branch -M main
git push -u origin main
```

### Деплой на Vercel

1. Перейди на **https://vercel.com** и зарегистрируйся через GitHub
2. Нажми **"Add New..." → "Project"**
3. Найди свой репозиторий `workout-tracker` и нажми **"Import"**
4. **Framework Preset** — Vercel автоматически определит Next.js
5. Раскрой **"Environment Variables"** и добавь все 4 переменные:

   | Key | Value |
   |-----|-------|
   | `BOT_TOKEN` | `7123456789:AAHxxxx...` |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://abcdefghijklm.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` |

6. Нажми **"Deploy"**
7. Подожди 1-2 минуты
8. Vercel даст тебе URL вида: `https://workout-tracker-xxxxx.vercel.app`

> Запомни этот URL — он нужен на следующем шаге!

---

## 7. Привязка Mini App к боту

### Вариант A: Через кнопку меню (рекомендуется)

1. Открой Telegram → **@BotFather**
2. Напиши `/mybots`
3. Выбери своего бота
4. Нажми **"Bot Settings"**
5. Нажми **"Menu Button"**
6. Нажми **"Configure menu button"**
7. Введи URL: `https://workout-tracker-xxxxx.vercel.app` (твой Vercel URL)
8. Введи текст кнопки: `Открыть дневник`

Теперь в чате с ботом слева от поля ввода появится кнопка **"Открыть дневник"**.

### Вариант B: Через Web App (отдельное приложение)

1. Открой **@BotFather**
2. Напиши `/newapp`
3. Выбери своего бота
4. Введи название: `Дневник тренировок`
5. Введи описание: `Отслеживание тренировок`
6. Отправь картинку 640x360 (можешь любую заглушку)
7. Нажми пропустить GIF
8. Введи URL: `https://workout-tracker-xxxxx.vercel.app`
9. Введи short name: `workouts`

Теперь приложение доступно по прямой ссылке: `https://t.me/ТВОЙ_БОТ/workouts`

---

## 8. Тестирование в Telegram

1. Открой Telegram
2. Найди своего бота по username
3. Нажми **"Start"** (или кнопку меню)
4. Должно открыться мини-приложение
5. Проверь:
   - [ ] Приложение загрузилось без ошибок
   - [ ] Выбор группы тренировки работает
   - [ ] Сохранение тренировки работает
   - [ ] Тренировка появилась во вкладке "История"
   - [ ] Статистика отображается
6. Проверь в Supabase Dashboard → Table Editor:
   - В таблице `users` должна появиться запись с твоим Telegram ID
   - В таблице `workouts` должна появиться сохранённая тренировка

### Проверка изоляции данных

1. Попроси друга открыть твоего бота
2. Пусть он создаст тренировку
3. Убедись что ты не видишь его тренировки, а он — твои

---

## Как поделиться с друзьями

Просто отправь им ссылку на бота:
```
https://t.me/ТВОЙ_БОТ_USERNAME
```

Или если настроил Web App (вариант B):
```
https://t.me/ТВОЙ_БОТ_USERNAME/workouts
```

---

## Возможные проблемы

### "Загрузка..." бесконечная
- Проверь что `.env.local` заполнен правильно
- Проверь консоль браузера (F12 → Console) на ошибки
- Убедись что Vercel имеет все env variables (Settings → Environment Variables)

### "Database error" при сохранении
- Проверь что таблицы созданы в Supabase (Table Editor)
- Проверь что `SUPABASE_SERVICE_ROLE_KEY` правильный
- Посмотри логи в Vercel: Deployments → последний деплой → Functions → Logs

### Приложение не открывается в Telegram
- Убедись что URL в BotFather начинается с `https://`
- Попробуй очистить кэш Telegram (Settings → Data and Storage → Clear Cache)
- На десктопе: перезапусти Telegram

### Данные не сохраняются
- Открой Supabase Dashboard → Table Editor → workouts — есть ли записи?
- Если нет — проблема с авторизацией. Проверь BOT_TOKEN
