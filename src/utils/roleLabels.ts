import type { Role } from '../types';

export const ROLE_LABELS: Record<'ROLE_ADMIN' | 'ROLE_USER', string> = {
  ROLE_USER: 'Korisnik',
  ROLE_ADMIN: 'Administrator',
};

export function getRoleLabel(role?: Role | null) {
  if (role === 'ROLE_USER' || role === 'ROLE_ADMIN') {
    return ROLE_LABELS[role];
  }

  return role ?? '';
}
