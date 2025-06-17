
interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 3, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    if (!entry) {
      this.attempts.set(identifier, { count: 1, firstAttempt: now });
      return true;
    }

    // Reset if window has passed
    if (now - entry.firstAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, firstAttempt: now });
      return true;
    }

    // Check if limit exceeded
    if (entry.count >= this.maxAttempts) {
      return false;
    }

    // Increment counter
    entry.count++;
    return true;
  }

  getRemainingTime(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry) return 0;

    const elapsed = Date.now() - entry.firstAttempt;
    return Math.max(0, this.windowMs - elapsed);
  }
}

export const contactFormRateLimiter = new RateLimiter(3, 15 * 60 * 1000); // 3 attempts per 15 minutes
