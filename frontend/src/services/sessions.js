import { request } from "./api";

export async function startSession(subject) {
    const data = await request("/api/sessions/create", {
        method: "POST",
        body: JSON.stringify({ subject }),
    });
    return data.session ?? data;
}

export async function getSessions() {
    const data = await request("/api/sessions/");
    return data.sessions ?? data;
}

export async function endSession(sessionId) {
    const data = await request(`/api/sessions/${sessionId}/end`, { method: "PATCH" });
    return data.session ?? data;
}