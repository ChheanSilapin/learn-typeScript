export interface TokenResponse {
  access_token: string;
  token_type?: string; // "bearer"
  expires_in?: number;
}

export interface LoginPayload {
  user_name: string;
  password: string;
}
export interface UserRead {
  id: number;
  user_name: string;
  role_id?: number | null;
  status: string;
  permissions?: string[] | null;
  created_at: string;
  updated_at: string;
}