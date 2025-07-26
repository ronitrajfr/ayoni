import { redis } from "./redis";
import { Ratelimit } from "@upstash/ratelimit";

const ratelimitCache: Record<string, Ratelimit> = {};

export function getRateLimiter(prefix: string): Ratelimit {
  if (!ratelimitCache[prefix]) {
    ratelimitCache[prefix] = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(8, "1m"),
      analytics: true,
      prefix: `ratelimit:${prefix}`,
    });
  }
  return ratelimitCache[prefix];
}
