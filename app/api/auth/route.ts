import { NextResponse } from 'next/server';
import { validateInitData, parseInitDataUser } from '../../../lib/auth';
import { getSupabase } from '../../../lib/supabase';

export async function POST(request: Request) {
  const botToken = process.env.BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('tma ')) {
    return NextResponse.json({ error: 'Missing authorization' }, { status: 401 });
  }

  const initDataRaw = authHeader.slice(4);

  if (!validateInitData(initDataRaw, botToken)) {
    return NextResponse.json({ error: 'Invalid init data' }, { status: 401 });
  }

  const user = parseInitDataUser(initDataRaw);
  if (!user) {
    return NextResponse.json({ error: 'No user data' }, { status: 401 });
  }

  // Upsert пользователя в БД
  const supabase = getSupabase();
  const { error } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      first_name: user.firstName,
      username: user.username || null,
      photo_url: user.photoUrl || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) {
    console.error('Supabase upsert error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json({
    userId: user.id,
    firstName: user.firstName,
    username: user.username,
    photoUrl: user.photoUrl,
  });
}
