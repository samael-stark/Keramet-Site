"use client";

import { auth } from "@/lib/firebase";

// fetch() for admin API routes: waits for Firebase to restore the login,
// then sends the admin's ID token so the server can verify it.
export async function adminFetch(input: string, init: RequestInit = {}) {
  await auth.authStateReady();

  const user = auth.currentUser;
  if (!user) {
    throw new Error("Session not found. Please sign in again.");
  }

  const idToken = await user.getIdToken();

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${idToken}`);

  return fetch(input, { ...init, headers });
}
