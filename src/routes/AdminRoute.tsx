import { Alert, Anchor, Center, Loader, Stack } from '@mantine/core';
import { ShieldAlert } from 'lucide-react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Center mih="50vh">
        <Loader />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return (
      <Center mih="50vh">
        <Stack maw={520}>
          <Alert color="red" icon={<ShieldAlert size={18} />} title="Pristup odbijen">
            Admin panel je dostupan samo korisnicima s rolom administratora.
          </Alert>
          <Anchor component={Link} to="/">
            Povratak na festivale
          </Anchor>
        </Stack>
      </Center>
    );
  }

  return <Outlet />;
}
