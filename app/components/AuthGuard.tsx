"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getSession } from "../lib/auth";
import { SessionSkeleton } from "./LoadingSkeletons";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!getSession()) {
      router.replace("/login");
      return;
    }
    // Authorization is derived from sessionStorage after client hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthorized(true);
  }, [router]);

  if (!isAuthorized) {
    return <SessionSkeleton />;
  }

  return children;
}
