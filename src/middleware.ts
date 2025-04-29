import { clerkMiddleware } from "@clerk/astro/server";

// The most basic middleware implementation
export const onRequest = clerkMiddleware();