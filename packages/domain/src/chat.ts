const MAX_CHAT_LENGTH = 500;
const MIN_CHAT_LENGTH = 1;
const FORBIDDEN_PATTERNS = [/<script/i, /javascript:/i];

export interface ChatContentResult {
  ok: boolean;
  reason?: string;
  sanitized?: string;
}

export function validateChatContent(raw: string): ChatContentResult {
  const trimmed = raw.trim();

  if (trimmed.length < MIN_CHAT_LENGTH) {
    return { ok: false, reason: "empty" };
  }

  if (trimmed.length > MAX_CHAT_LENGTH) {
    return { ok: false, reason: "too_long" };
  }

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { ok: false, reason: "forbidden" };
    }
  }

  return { ok: true, sanitized: trimmed };
}

export function isChatContentAllowed(raw: string): boolean {
  return validateChatContent(raw).ok;
}

export { MAX_CHAT_LENGTH, MIN_CHAT_LENGTH };
