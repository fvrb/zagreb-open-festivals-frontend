import type { Drink, DrinkRequest } from '../types';
import { api, plainApi } from './api';

export const drinkService = {
  async getAllByFestival(festivalId: number) {
    const { data } = await plainApi.get<Drink[]>(`/festivals/${festivalId}/drinks`);
    return data;
  },

  async create(festivalId: number, payload: DrinkRequest) {
    const { data } = await api.post<Drink>(`/festivals/${festivalId}/drinks`, payload);
    return data;
  },

  async update(id: number, payload: DrinkRequest) {
    const { data } = await api.put<Drink>(`/drinks/${id}`, payload);
    return data;
  },

  async remove(id: number) {
    await api.delete(`/drinks/${id}`);
  },
};
