import { NextResponse } from 'next/server';
import { authenticateRequest } from '../../../lib/auth';
import { getSupabase } from '../../../lib/supabase';

// GET /api/settings — получить настройки пользователя
export async function GET(request: Request) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('users')
    .select('settings')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Get settings error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json(data?.settings || {});
}

// PUT /api/settings — обновить настройки
export async function PUT(request: Request) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await request.json();

  const supabase = getSupabase();
  const { error } = await supabase
    .from('users')
    .update({
      settings,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
