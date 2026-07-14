import { Button, Container, Group, Stack, Text, Title } from '@mantine/core';
import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FestivalSummary } from '../types';

export function FavouritesPage() {
  const [favourites, setFavourites] = useState<FestivalSummary[]>([]);

  const reload = async () => {
    // TODO (2.Z): dohvatite favorite preko favouritesService.getUserFavourites() i prikazite ih.
    setFavourites([]);
  };

  useEffect(() => {
    void reload();
  }, []);

  return (
    <Container size="lg">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-end">
          <div>
            <Title>Zanima me</Title>
            <Text c="dimmed" mt={4}>
              Popis festivala koje pratis.
            </Text>
          </div>
          <Button variant="light" leftSection={<RefreshCw size={16} />} onClick={() => void reload()}>
            Osvjezi
          </Button>
        </Group>

        {/* TODO (2.Z): ovdje prikazite spinner, error state i kartice favorita. */}
        {favourites.length === 0 ? (
          <Text c="dimmed">Jos nema festivala u listi interesa.</Text>
        ) : (
          <Text c="dimmed">Popis favorita je pripremljen za prikaz.</Text>
        )}
      </Stack>
    </Container>
  );
}
