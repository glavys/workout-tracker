import { NextResponse } from 'next/server';
import { authenticateRequest } from '../../../lib/auth';
import { getSupabase } from '../../../lib/supabase';

// GET /api/workouts — список тренировок пользователя
export async function GET(request: Request) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Get workouts error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // Конвертация из формата БД в формат фронтенда
  const workouts = (data || []).map(row => ({
    id: row.id,
    date: row.date,
    group: row.muscle_group,
    exercises: row.exercises,
    duration: row.duration || undefined,
    notes: row.notes || undefined,
  }));

  return NextResponse.json(workouts);
}

// POST /api/workouts — сохранить новую тренировку
export async function POST(request: Request) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('workouts')
    .insert({
      user_id: userId,
      date: body.date,
      muscle_group: body.group,
      exercises: body.exercises,
      duration: body.duration || null,
      notes: body.notes || null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Save workout error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
