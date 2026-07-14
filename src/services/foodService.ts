import type { Food, FoodRequest } from '../types';
import { api, plainApi } from './api';

export const foodService = {
  async getAllByFestival(festivalId: number) {
    const { data } = await plainApi.get<Food[]>(`/festivals/${festivalId}/foods`);
    return data;
  },

  async create(festivalId: number, payload: FoodRequest) {
    const { data } = await api.post<Food>(`/festivals/${festivalId}/foods`, payload);
    return data;
  },

  async update(id: number, payload: FoodRequest) {
    const { data } = await api.put<Food>(`/foods/${id}`, payload);
    return data;
  },

  async remove(id: number) {
    await api.delete(`/foods/${id}`);
  },
};
