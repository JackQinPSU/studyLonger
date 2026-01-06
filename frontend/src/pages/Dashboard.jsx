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
import Page from "../components/Page";
import Card from "../components/Card";
import { PrimaryButton, SecondaryButton } from "../components/Button";

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
  const COLORS = ["#4f46e5", "#16a34a", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7"];



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

      const sessions = await getSessions();
      setWeeklyData(buildWeelyMinutes(sessions));
      setMonthlyData(buildMonthlyMinutes(sessions, 30));
      setWeeklySubjectData(buildWeeklySubjectData(sessions));
    } catch (e) {
      setErr(e.message || "Failed to end session");
    } finally {
      setLoading(false);
    }
  }

  return (
  <Page title="Dashboard" subtitle="Track sessions and study trends.">
    {/* Session */}
    <Card>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-neutral-900">Session</p>
          <p className="mt-1 text-sm text-neutral-500">
            {activeSessionId ? (
              <>
                Active (id:{" "}
                <span className="font-mono text-neutral-700">
                  {activeSessionId}
                </span>
                )
              </>
            ) : (
              "Not in session"
            )}
          </p>

          {startAt && (
            <p className="mt-2 text-xs text-neutral-500">
              Started:{" "}
              <span className="text-neutral-700">
                {startAt.toLocaleString()}
              </span>
            </p>
          )}
        </div>

        <div className="text-sm text-neutral-500">
          {activeSessionId ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              In session
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-neutral-300" />
              Idle
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs font-medium text-neutral-600">Subject</span>
          <input
            className="h-10 rounded-md border border-neutral-200 px-3 text-sm outline-none transition focus:border-neutral-400 disabled:bg-neutral-50"
            placeholder="e.g. Math 230"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={!!activeSessionId}
          />
        </label>

        <div className="flex items-end gap-3">
          <PrimaryButton
            onClick={handleStart}
            disabled={loading || !!activeSessionId}
          >
            {loading ? "Working..." : "Start"}
          </PrimaryButton>

          <SecondaryButton
            onClick={handleEnd}
            disabled={loading || !activeSessionId}
          >
            {loading ? "Working..." : "End"}
          </SecondaryButton>
        </div>
      </div>

      {err && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </p>
      )}
    </Card>

    {/* Charts */}
    <div className="grid gap-6 md:grid-cols-2">
      {/* Weekly */}
      <Card>
        <div className="mb-3">
          <p className="text-sm font-medium text-neutral-900">
            Weekly study time
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Minutes per day (last 7 days)
          </p>
        </div>

        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="minutes" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Weekly by subject */}
      <Card>
        <div className="mb-3">
          <p className="text-sm font-medium text-neutral-900">
            Weekly time by subject
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Completed sessions only
          </p>
        </div>

        <div className="h-[240px]">
          {weeklySubjectData.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No completed sessions in the last 7 days.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={weeklySubjectData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {weeklySubjectData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>

    {/* Monthly */}
    <Card>
      <div className="mb-3">
        <p className="text-sm font-medium text-neutral-900">
          Monthly study time
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Minutes per day (last 30 days)
        </p>
      </div>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="day" interval={4} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="minutes" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  </Page>
);
}
