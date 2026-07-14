import { Badge, Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { User, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleLabel } from '../utils/roleLabels';

export function ProfilePage() {
  const { user, reloadUser } = useAuth();

  return (
    <Container size="md">
      <Stack gap="xl">
        <Paper withBorder radius="md" p="xl">
          <Group justify="space-between" align="flex-start">
            <Group>
              <User size={32} color="var(--mantine-color-teal-7)" />
              <div>
                <Title order={2}>{user?.username}</Title>
                <Text c="dimmed">{user?.email}</Text>
              </div>
            </Group>
            <Badge size="lg" variant="light">
              {getRoleLabel(user?.role)}
            </Badge>
          </Group>
          <Button mt="lg" variant="light" onClick={() => void reloadUser()}>
            Osvjezi profil
          </Button>
        </Paper>

        <Paper withBorder radius="md" p="xl">
          <Stack gap="sm">
            <Group gap="xs">
              <Heart size={20} />
              <Title order={3}>Interesi</Title>
            </Group>
            <Text c="dimmed">Popis festivala koje pratiš.</Text>
            <Button component={Link} to="/favourites" variant="light" w="fit-content">
              Otvori interese
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
