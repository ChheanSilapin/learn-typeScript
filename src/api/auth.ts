import api from "./axios";
import { setAccessToken, clearAccessToken } from "../auth/token";
import { TokenResponse,LoginPayload,UserRead } from "../types/auth";


export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/login", payload, { withCredentials: true });
  if (!data?.access_token) throw new Error("Login failed: missing access_token");
  setAccessToken(data.access_token);
  return data;
}

export async function refresh(): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/refresh", null, { withCredentials: true });
  if (!data?.access_token) throw new Error("Refresh failed: missing access_token");
  setAccessToken(data.access_token);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } finally {
    clearAccessToken();
  }
}
export async function me(): Promise<UserRead> {
  const { data } = await api.get<UserRead>("/auth/me");
  return data;
}