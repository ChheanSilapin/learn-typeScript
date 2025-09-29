import api from "./axios";
import type { Client, ListClientsParams } from "../types/client";



export async function listClients(params: ListClientsParams = {}): Promise<Client[]> {
  const { limit = 50, offset = 0, q } = params;
  const { data } = await api.get<Client[]>("/clients", { params: { limit, offset, q } });
  return data;
}

export async function getClientById(id: number): Promise<Client> {
  const { data } = await api.get<Client>(`/clients/${id}`);
  return data;
}