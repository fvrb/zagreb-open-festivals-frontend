import type { FestivalDetail, FestivalRequest, FestivalSummary } from '../types';
import { api, plainApi } from './api';

export const festivalService = {
  async getAll(search?: string) {
    void search;
    // TODO (1.Z): ovdje dodajte query parametar `search` kada korisnik pretrazuje festivale.
    const { data } = await plainApi.get<FestivalSummary[]>('/festivals');
    return data;
  },

  async getById(id: number) {
    const { data } = await plainApi.get<FestivalDetail>(`/festivals/${id}`);
    return data;
  },

  async create(payload: FestivalRequest) {
    const { data } = await api.post<FestivalDetail>('/festivals', payload);
    return data;
  },

  async update(id: number, payload: FestivalRequest) {
    const { data } = await api.put<FestivalDetail>(`/festivals/${id}`, payload);
    return data;
  },

  async remove(id: number) {
    await api.delete(`/festivals/${id}`);
  },
};
