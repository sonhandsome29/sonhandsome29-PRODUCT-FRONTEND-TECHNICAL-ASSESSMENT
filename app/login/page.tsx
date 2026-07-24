"use client";

import { ArrowRight, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ApiError, login } from "../lib/api";
import { getSession, saveSession } from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("Demo@123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getSession()) router.replace("/products");
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const session = await login(username.trim(), password);
      saveSession(session);
      router.replace("/products");
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to reach the sign-in service. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-story" aria-labelledby="story-title">
        <span className="brand-mark">NEXA</span>
        <div className="story-copy">
          <p className="eyebrow">Curated technology</p>
          <h1 id="story-title">Tools for better days.</h1>
          <p>
            Thoughtful devices, honest details, and less noise. Explore our
            considered collection for modern work and everyday life.
          </p>
        </div>
        <div className="story-note">
          <ShieldCheck size={18} aria-hidden="true" />
          Secure demo workspace
        </div>
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-form">
          <h2 id="login-title">Welcome back.</h2>
          <p>Sign in to browse the full NEXA collection.</p>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="username">Username</label>
              <div className="input-wrap">
                <UserRound size={18} aria-hidden="true" />
                <input
                  id="username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <LockKeyhole size={18} aria-hidden="true" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            {error ? (
              <p className="error-message" role="alert">
                {error}
              </p>
            ) : null}
            <button
              className="button button-accent"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Enter collection"}
              {!isSubmitting ? <ArrowRight size={18} aria-hidden="true" /> : null}
            </button>
          </form>
          <div className="demo-credentials">
            <strong>Demo access</strong>
            <br />
            Username: <code>demo</code> · Password: <code>Demo@123</code>
          </div>
        </div>
      </section>
    </main>
  );
}
