"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "../lib/api";
import { clearSession, getSession } from "../lib/auth";

export function AppHeader() {
  const router = useRouter();
  const [name, setName] = useState("Guest");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // sessionStorage is an external browser source and is unavailable during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(getSession()?.user.name ?? "Guest");
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // A failed revoke should not leave a stale local session behind.
    } finally {
      clearSession();
      router.replace("/login");
    }
  }

  return (
    <header className="site-header">
      <Link className="brand-mark" href="/products" aria-label="NEXA home">
        NEXA
      </Link>
      <div className="header-actions">
        <div className="user-chip">
          <span className="user-avatar" aria-hidden="true">
            {name.slice(0, 1).toUpperCase()}
          </span>
          <span>{name}</span>
        </div>
        <button
          className="button button-ghost"
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut size={17} aria-hidden="true" />
          <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
        </button>
      </div>
    </header>
  );
}
