import { request } from "./api";

export function login(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  // 你后端目前没有 logout 路由（我们 Step 6 再加）
  return Promise.resolve();
}

export function me() {
  return request("/api/auth/me");
}