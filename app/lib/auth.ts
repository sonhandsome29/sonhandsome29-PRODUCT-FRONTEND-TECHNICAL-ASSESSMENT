import type { AuthSession } from "../types/product";

const AUTH_STORAGE_KEY = "nexa.auth.session";

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const rawSession = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function saveSession(session: AuthSession) {
  window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
}
