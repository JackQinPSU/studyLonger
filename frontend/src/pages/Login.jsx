import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import Page from "../components/Page";
import Card from "../components/Card";
import { PrimaryButton, SecondaryButton } from "../components/Button";


export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const nav = useNavigate();
  const loc = useLocation();
  const redirectTo = loc.state?.from || "/dashboard";

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      await login(email, password); // ✅ 只调用 AuthContext
      nav(redirectTo, { replace: true });
    } catch (e) {
      setErr(e.message || "Login failed");
    }
  }

  return (
    <Page title="Log in" subtitle="Welcome back">
      <div className="mx-auto max-w-md">
        <Card>
          <form onSubmit={onSubmit} className="grid gap-4">
            <label className="grid gap-1">
              <span className="text-xs font-medium text-neutral-600">
                Email
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-md border border-neutral-200 px-3 text-sm outline-none transition focus:border-neutral-400"
                required
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs font-medium text-neutral-600">
                Password
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded-md border border-neutral-200 px-3 text-sm outline-none transition focus:border-neutral-400"
                required
              />
            </label>

            <PrimaryButton type="submit">
              Log in
            </PrimaryButton>

            <SecondaryButton onClick={() => nav("/register")}>
              Register
            </SecondaryButton>

            {err && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </p>
            )}
          </form>
        </Card>
      </div>
    </Page>
  );
}
