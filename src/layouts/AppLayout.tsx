import { AppShell, Burger, Button, Group, Menu, Text, UnstyledButton, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { CalendarDays, Heart, LogIn, LogOut, User, UserPlus } from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Festivali', to: '/' },
  { label: 'Admin', to: '/admin', adminOnly: true },
];

export function AppLayout() {
  const [opened, { toggle, close }] = useDisclosure();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const visibleItems = navItems.filter((item) => {
    if (item.adminOnly) return isAdmin;
    return true;
  });

  const handleLogout = async () => {
    await logout();
    close();
    navigate('/');
  };

  return (
    <AppShell header={{ height: 64 }} navbar={{ width: 260, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <UnstyledButton component={Link} to="/" onClick={close}>
              <Group gap="xs">
                <CalendarDays size={24} color="var(--mantine-color-teal-7)" />
                <Text fw={800} size="lg">
                  Zagreb Open Festivals
                </Text>
              </Group>
            </UnstyledButton>
          </Group>

          <Group gap="xs" visibleFrom="sm">
            {visibleItems.map((item) => (
              <Button key={item.to} component={NavLink} to={item.to} variant="subtle" color="gray">
                {item.label}
              </Button>
            ))}
            {isAuthenticated && (
              <Button variant="light" leftSection={<Heart size={16} />}>
                Zanima me
              </Button>
            )}
          </Group>

          <Group visibleFrom="sm">
            {isAuthenticated ? (
              <Menu position="bottom-end">
                <Menu.Target>
                  <Button variant="light" leftSection={<User size={16} />}>
                    {user?.username ?? 'Profil'}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item component={Link} to="/profile" leftSection={<User size={rem(16)} />}>
                    Profil
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item color="red" leftSection={<LogOut size={rem(16)} />} onClick={handleLogout}>
                    Odjava
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Group gap="xs">
                <Button component={Link} to="/login" variant="light" leftSection={<LogIn size={16} />}>
                  Prijava
                </Button>
                <Button component={Link} to="/register" leftSection={<UserPlus size={16} />}>
                  Registracija
                </Button>
              </Group>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {visibleItems.map((item) => (
          <Button key={item.to} component={NavLink} to={item.to} variant="subtle" color="gray" justify="flex-start" onClick={close}>
            {item.label}
          </Button>
        ))}
        {isAuthenticated ? (
          <Button mt="md" color="red" variant="light" leftSection={<LogOut size={16} />} onClick={handleLogout}>
            Odjava
          </Button>
        ) : (
          <Group mt="md" grow>
            <Button component={Link} to="/login" variant="light" onClick={close}>
              Prijava
            </Button>
            <Button component={Link} to="/register" onClick={close}>
              Registracija
            </Button>
          </Group>
        )}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
