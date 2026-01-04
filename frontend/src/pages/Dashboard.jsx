import { useEffect, useState } from "react";
import { startSession, endSession } from "../services/sessions";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const LS_KEY = "activeSessionId";

const mockWeeklyData = [
  { day: "Mon", minutes: 60 },
  { day: "Tue", minutes: 90 },
  { day: "Wed", minutes: 30 },
  { day: "Thu", minutes: 120 },
  { day: "Fri", minutes: 75 },
  { day: "Sat", minutes: 45 },
  { day: "Sun", minutes: 0 },
];

export default function Dashboard() {
  const [activeSessionId, setActiveSessionId] = useState(
    () => localStorage.getItem(LS_KEY) || ""
  );
  const [startAt, setStartAt] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    const savedStartAt = localStorage.getItem("activeSessionStartAt");
    if (savedStartAt) setStartAt(new Date(savedStartAt));
  }, []);

  async function handleStart() {
    setErr("");

    if (!subject.trim()) {
      setErr("Subject cannot be empty");
      return;
    }
    setLoading(true);
    try {
      console.log("[handleStart] sending request with subject:", subject.trim()); // 2) 发请求前
      const session = await startSession(subject);
      console.log("START SESSION RESPONSE:", session);

   
      const id = session.id;
      if (!id) throw new Error("Backend did not return session id");

      setActiveSessionId(String(id));
      localStorage.setItem(LS_KEY, String(id));


      const t = session.startTime || new Date().toISOString();
      setStartAt(new Date(t));
      localStorage.setItem("activeSessionStartAt", t);
    } catch (e) {
      setErr(e.message || "Failed to start session");
    } finally {
      setLoading(false);
    }
  }

  async function handleEnd() {
    if (!activeSessionId) return;
    setErr("");
    setLoading(true);
    try {
      await endSession(activeSessionId);

      setActiveSessionId("");
      setStartAt(null);
      localStorage.removeItem(LS_KEY);
      localStorage.removeItem("activeSessionStartAt");
    } catch (e) {
      setErr(e.message || "Failed to end session");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
      <h2>Dashboard</h2>

      <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        <p style={{ marginTop: 0 }}>
          Status:{" "}
          {activeSessionId ? (
            <b>IN SESSION (id: {activeSessionId})</b>
          ) : (
            <b>Not in session</b>
          )}
        </p>

        {startAt && (
          <p style={{ marginTop: 0 }}>
            Started at: {startAt.toLocaleString()}
          </p>
        )}

        <label style={{ display: "grid", gap: 6, marginBottom: 10 }}>
          <span>Subject</span>
          <input
            placeholder="e.g. Math 230"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={!!activeSessionId}
          />
        </label>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleStart} disabled={loading || !!activeSessionId}>
            {loading ? "Working..." : "Start Session"}
          </button>

          <button onClick={handleEnd} disabled={loading || !activeSessionId}>
            {loading ? "Working..." : "End Session"}
          </button>
        </div>

        {err && <p style={{ color: "crimson", marginBottom: 0 }}>{err}</p>}
      </div>
      <div style={{ marginTop: 24 }}>
        <h3>Weekly Study Time</h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={mockWeeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="minutes"
              stroke="#4f46e5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
