import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Page from "../components/Page";
import Card from "../components/Card";
import { PrimaryButton, SecondaryButton } from "../components/Button";

export default function Register() {
    const { register } = useAuth(); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [err, setErr] = useState("");

    const nav = useNavigate();
    const loc = useLocation();
    const redirectTo = loc.state?.from || "/dashboard";

    async function onSubmit(e) {
        e.preventDefault();
        setErr("");

        if (password.length < 6) {
            setErr("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirm) {
            setErr("Passwords do not match.");
            return;
        }

        try {
            await register(email, password);
            nav(redirectTo, { replace: true });
        } catch (e) {
            setErr(e.message || "Registration failed");
        }
    }

    return (
        <Page title="Create account" subtitle="Start tracking your study sessions">
        <div className="mx-auto max-w-md">
            <Card>
            <form onSubmit={onSubmit} className="grid gap-4">
                <label className="grid gap-1">
                <span className="text-xs font-medium text-neutral-600">Email</span>
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
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 rounded-md border border-neutral-200 px-3 text-sm outline-none transition focus:border-neutral-400"
                    required
                />
                </label>

                <label className="grid gap-1">
                <span className="text-xs font-medium text-neutral-600">
                    Confirm password
                </span>
                <input
                    type="password"
                    placeholder="Repeat password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="h-10 rounded-md border border-neutral-200 px-3 text-sm outline-none transition focus:border-neutral-400"
                    required
                />
                </label>

                <PrimaryButton type="submit">Create account</PrimaryButton>

                <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Already have an account?</span>
                <Link to="/login">
                    <SecondaryButton type="button">Log in</SecondaryButton>
                </Link>
                </div>

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