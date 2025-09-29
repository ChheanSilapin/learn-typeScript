export interface Client {
  id: number;
  name: string;
  description?: string | null;
  email: string;
  phone?: string | null;
  created_at: string;
  project_names: string[];
}
export interface ListClientsParams {
  limit?: number;
  offset?: number;
  q?: string;
}
