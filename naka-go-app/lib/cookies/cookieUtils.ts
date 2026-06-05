export function extractTweetId(url: string): string | null {
  const match = url.match(/status\/(\d+)/);
  return match ? match[1] : null;
}

export function formatCookieText(message: string, isFullMoon: boolean): string {
  const moonEmoji = isFullMoon ? '🌕' : '🍦';
  return `🍪 Create one message that counts, for yourself\n${moonEmoji} ${message}\n🍪 Copy the cookies, and fill in your cream\n#${isFullMoon ? 'FullMoon ' : ''}NAKAGO`;
}

export function validateMessage(message: string): { valid: boolean; error?: string } {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  if (message.length > 200) {
    return { valid: false, error: 'Message must be 200 characters or less' };
  }
  return { valid: true };
}

export function validateXUrl(url: string): boolean {
  return /^https:\/\/(twitter\.com|x\.com)\/.*\/status\/\d+/.test(url);
}
