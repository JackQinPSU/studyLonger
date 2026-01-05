import { use, useEffect, useState } from "react";
import { startSession, endSession, getSessions } from "../services/sessions";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const LS_KEY = "activeSessionId";

export default function Dashboard() {
  const [activeSessionId, setActiveSessionId] = useState(
    () => localStorage.getItem(LS_KEY) || ""
  );
  const [startAt, setStartAt] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [subject, setSubject] = useState("");
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklySubjectData, setWeeklySubjectData] = useState([]);



  //Load weekly data
  useEffect(() => {
    (async () => {
      try {
        const sessions = await getSessions();
        setWeeklyData(buildWeelyMinutes(sessions));
        setMonthlyData(buildMonthlyMinutes(sessions, 30)); //Last 30 Days
        setWeeklySubjectData(buildWeeklySubjectData(sessions)); //Last 7 days, by subject
      } catch (e) {
        console.log("Failed to load sessions", e);
      }
    })();
  }, []);

  // Load start time for active session
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


  function buildWeelyMinutes(sessions) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const now = new Date()
    const buckets = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);

      buckets.push({
        day: days[d.getDay()],
        dateKey: d.toISOString().slice(0, 10), // YYYY-MM-DD
        minutes: 0,
      });
    }

    const map = new Map(buckets.map((b) => [b.dateKey, b]));

    for (const s of sessions) {
      const start = new Date(s.startTime || s.startedAt || s.createdAt);
      const end = s.endTime || s.endedAt ? new Date(s.endTime || s.endedAt) : null;
      if (!end) continue; // Doesnt count active sessions

      // Only group by the day it starts, make it simple
      const key = start.toISOString().slice(0, 10);
      const bucket = map.get(key);
      if (!bucket) continue;

      const minutes = Math.max(0, Math.round((end - start) / 60000));
      bucket.minutes += minutes;
    }

    // Data for recharts
    return buckets.map(({ day, minutes }) => ({ day, minutes }));
  }

  function buildMonthlyMinutes(sessions, daysBack = 30) {
    const now = new Date();
    const buckets = [];

    for (let i = daysBack - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);

      buckets.push({
        day: d.toLocaleDateString(undefined, { month: "short", day: "2-digit" }),
        dateKey: d.toISOString().slice(0, 10),
        minutes: 0,
      });
    }

    const map = new Map(buckets.map((b) => [b.dateKey, b]));
      for (const s of sessions) {
        const start = new Date(s.startTime);
        const end = (s.endTime) ? new Date(s.endTime) : null;
        if (!end) continue;

        const key = start.toISOString().slice(0, 10);
        const bucket = map.get(key);
        if (!bucket) continue;

        const minutes = Math.max(0, Math.round((end - start) / 60000));
        bucket.minutes += minutes;
      }

      return buckets.map(({ day, minutes }) => ({ day, minutes }));
  
  }

  function buildWeeklySubjectData(sessions) {
    const now = new Date ();
    const startWindow = new Date(now);
    startWindow.setDate(now.getDate() - 6);
    startWindow.setHours(0, 0, 0, 0);

    const subjectToMinutes = new Map();

    for (const s of sessions) {
      const start = new Date(s.startTime || s.startedAt || s.createdAt);
      const end = (s.endTime || s.endedAt) ? new Date(s.endTime || s.endedAt) : null;
      if (!end) continue;

      if (start < startWindow) continue;

      const minutes = Math.max(0, Math.round((end - start) / 60000));
      const subj = (s.subject || "Unknown").trim() || "Unknown";

      subjectToMinutes.set(subj, (subjectToMinutes.get(subj) || 0) + minutes);
    }

    // recharts pie wants: [{ name, value }]
    return Array.from(subjectToMinutes.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
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
          <LineChart data={weeklyData}>
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
      <div style={{ marginTop: 24 }}>
        <h3>Monthly Study Time (Last 30 Days)</h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" interval={4} /> {/* show fewer labels */}
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="minutes" stroke="#16a34a" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 24 }}>
        <h3>Weekly Time by Subject</h3>

        {weeklySubjectData.length === 0 ? (
          <p style={{ color: "#666" }}>No completed sessions in the last 7 days.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={weeklySubjectData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {weeklySubjectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}
