import { createHmac } from 'crypto';

/**
 * Валидация Telegram initData через HMAC-SHA256.
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateInitData(initDataRaw: string, botToken: string): boolean {
  try {
    const params = new URLSearchParams(initDataRaw);
    const hash = params.get('hash');
    if (!hash) return false;

    params.delete('hash');

    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
    const computedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    return computedHash === hash;
  } catch {
    return false;
  }
}

/**
 * Извлечение user из initData.
 */
export function parseInitDataUser(initDataRaw: string) {
  const params = new URLSearchParams(initDataRaw);
  const userJson = params.get('user');
  if (!userJson) return null;

  try {
    const user = JSON.parse(userJson);
    return {
      id: user.id as number,
      firstName: (user.first_name || '') as string,
      lastName: (user.last_name || undefined) as string | undefined,
      username: (user.username || undefined) as string | undefined,
      photoUrl: (user.photo_url || undefined) as string | undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Аутентификация запроса — извлекает userId из заголовка Authorization.
 * Формат: "tma <initDataRaw>"
 */
export function authenticateRequest(request: Request): number | null {
  const botToken = process.env.BOT_TOKEN;
  if (!botToken) return null;

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('tma ')) return null;

  const initDataRaw = authHeader.slice(4);

  if (!validateInitData(initDataRaw, botToken)) return null;

  const user = parseInitDataUser(initDataRaw);
  return user?.id ?? null;
}
