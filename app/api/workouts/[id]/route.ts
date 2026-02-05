import { NextResponse } from 'next/server';
import { authenticateRequest } from '../../../../lib/auth';
import { getSupabase } from '../../../../lib/supabase';

// DELETE /api/workouts/:id — удалить тренировку
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const supabase = getSupabase();
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', id)
    .eq('user_id', userId); // Убеждаемся что удаляем только своё

  if (error) {
    console.error('Delete workout error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
