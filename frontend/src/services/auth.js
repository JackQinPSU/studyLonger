import { request } from "./api";

export function login(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return Promise.resolve();
}

export function me() {
  return request("/api/auth/me");
}