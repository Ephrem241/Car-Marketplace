import { NextResponse } from "next/server";

// Simple in-memory store for rate limiting
const rateLimit = new Map();

export class RateLimiter {
  constructor(windowMs = 15 * 60 * 1000, max = 100) {
    this.windowMs = windowMs;
    this.max = max;
  }

  async check(request, customMax, key) {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const identifier = key ? `${ip}-${key}` : ip;
    const now = Date.now();
    const userRequests = rateLimit.get(identifier) || {
      count: 0,
      timestamp: now,
    };

    // Reset if window has passed
    if (now - userRequests.timestamp > this.windowMs) {
      userRequests.count = 1;
      userRequests.timestamp = now;
    } else if (userRequests.count >= (customMax || this.max)) {
      throw new Error("Rate limit exceeded");
    } else {
      userRequests.count++;
    }

    rateLimit.set(identifier, userRequests);

    // Clean up old entries every hour
    if (now % (60 * 60 * 1000) < 1000) {
      this.cleanup();
    }
  }

  cleanup() {
    const now = Date.now();
    for (const [key, value] of rateLimit.entries()) {
      if (now - value.timestamp > this.windowMs) {
        rateLimit.delete(key);
      }
    }
  }
}

// Create default instance
export const defaultLimiter = new RateLimiter();

// Middleware for rate limiting
export async function rateLimitMiddleware(request, customMax, key) {
  try {
    await defaultLimiter.check(request, customMax, key);
  } catch (error) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }
  return null;
}
