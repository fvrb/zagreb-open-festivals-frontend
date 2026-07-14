import type { FestivalSummary } from '../types';
import { api } from './api';

export const favouritesService = {
  async getUserFavourites() {
    const { data } = await api.get<FestivalSummary[]>('/favorites/me');
    return data;
  },

  async add(festivalId: number) {
    await api.post(`/favorites/${festivalId}`);
  },

  async remove(festivalId: number) {
    await api.delete(`/favorites/${festivalId}`);
  },
};
