import { Alert, Button, Container, Group, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core';
import { RefreshCw, Search } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { FestivalCard } from '../components/FestivalCard';
import { festivalService } from '../services/festivalService';
import type { FestivalSummary } from '../types';

export function HomePage() {
  const [festivals, setFestivals] = useState<FestivalSummary[]>([]);
  const [search, setSearch] = useState('');

  const loadFestivals = async () => {
    // TODO (1.Z): povezi ovu funkciju s pretragom i proslijedi search query na backend.
    setFestivals(await festivalService.getAll());
  };

  const handleSearchSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await loadFestivals();
  };

  useEffect(() => {
    void loadFestivals();
  }, []);

  return (
    <Container size="lg">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-end" wrap="wrap" gap="md">
          <div>
            <Title>Zagreb Open Festivals</Title>
            <Text c="dimmed" mt={4}>
              Pregled festivala na otvorenom, lokacija i ponude hrane i pica.
            </Text>
          </div>

          <Group gap="sm" wrap="nowrap" align="flex-end">
            <form onSubmit={(event) => void handleSearchSubmit(event)}>
              {/* TODO (1.Z): povezi ovaj input sa search stateom i pokreni pretragu na submit. */}
              <TextInput
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                placeholder="Pretrazi festivale"
                leftSection={<Search size={16} />}
                w={280}
                aria-label="Pretrazi festivale"
              />
            </form>

            <Button variant="light" leftSection={<RefreshCw size={16} />} onClick={() => void loadFestivals()}>
              Osvjezi
            </Button>
          </Group>
        </Group>

        {/* TODO (4.Z): dodajte spinner i error state dok se festivali ucitavaju. */}
        {festivals.length > 0 ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {festivals.map((festival) => (
              <FestivalCard key={festival.id} festival={festival} />
            ))}
          </SimpleGrid>
        ) : (
          <Alert color="yellow" title="Nema festivala">
            Dodaj prvi festival kroz admin panel.
          </Alert>
        )}
      </Stack>
    </Container>
  );
}
