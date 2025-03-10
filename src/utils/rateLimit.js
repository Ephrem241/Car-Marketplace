import { NextResponse } from "next/server";

// Simple in-memory store for rate limiting
const rateLimit = new Map();

class RateLimiter {
  constructor(interval, maxRequests) {
    this.interval = interval;
    this.maxRequests = maxRequests;
    this.requests = new Map();
  }

  async check(request, cost = 1, key = "") {
    // Get IP address from request headers or forwarded headers
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Combine IP and key for unique rate limiting
    const uniqueKey = `${ip}-${key}`;

    const now = Date.now();
    const requestData = this.requests.get(uniqueKey) || {
      count: 0,
      start: now,
    };

    // Reset if interval has passed
    if (now - requestData.start > this.interval) {
      requestData.count = 0;
      requestData.start = now;
    }

    // Check if adding this request would exceed the limit
    if (requestData.count + cost > this.maxRequests) {
      throw new Error("Rate limit exceeded");
    }

    // Update request count
    requestData.count += cost;
    this.requests.set(uniqueKey, requestData);

    // Clean up old entries periodically
    if (Math.random() < 0.1) {
      // 10% chance to clean up
      this.cleanup();
    }

    return true;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, data] of this.requests.entries()) {
      if (now - data.start > this.interval) {
        this.requests.delete(key);
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

export { RateLimiter };
