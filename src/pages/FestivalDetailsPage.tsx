import {
  Alert,
  Badge,
  Button,
  Center,
  Container,
  Grid,
  Group,
  Image,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DrinkManager } from '../components/DrinkManager';
import { FoodManager } from '../components/FoodManager';
import { useAuth } from '../context/AuthContext';
import { festivalService } from '../services/festivalService';
import type { FestivalDetail } from '../types';
import { formatDate, getErrorMessage } from '../utils/format';

const fallbackImage = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=80';

export function FestivalDetailsPage() {
  const { id } = useParams();
  const festivalId = Number(id);
  const { isAdmin } = useAuth();
  const [festival, setFestival] = useState<FestivalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFestival = async () => {
      if (!festivalId) return;

      setLoading(true);
      setError(null);

      try {
        setFestival(await festivalService.getById(festivalId));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    void loadFestival();
  }, [festivalId]);

  if (loading) {
    return (
      <Center mih="60vh">
        <Loader />
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="md">
        <Stack>
          <Alert color="red" title="Detalji festivala trenutno nisu dostupni">
            {error}
          </Alert>
          <Button component={Link} to="/" variant="light">
            Povratak na festivale
          </Button>
        </Stack>
      </Container>
    );
  }

  if (!festival) return null;

  return (
    <Container size="lg">
      <Stack gap="xl">
        <Paper withBorder radius="md" p={0} className="detail-hero">
          <Grid gap={0}>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <div style={{ height: 420, overflow: 'hidden' }}>
                <Image src={festival.imageUrl || fallbackImage} alt={festival.name} fit="cover" style={{ height: '100%', width: '100%' }} />
              </div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack p="xl" gap="md">
                <Group justify="space-between" align="flex-start">
                  <div>
                    <Title>{festival.name}</Title>
                    <Group mt="sm" c="dimmed">
                      <MapPin size={18} />
                      <Text>{festival.location}</Text>
                    </Group>
                  </div>
                  <Badge size="lg" color="teal" variant="light">
                    {formatDate(festival.date)}
                  </Badge>
                </Group>
                <Text>{festival.description || 'Opis festivala jos nije unesen.'}</Text>
                <Group>
                  {/* TODO (2.Z): ovdje dodajte favorite logiku i prikaz gumba. */}
                  {isAdmin && (
                    <Button component={Link} to="/admin" variant="default">
                      Uredi u admin panelu
                    </Button>
                  )}
                </Group>
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <FoodManager festivalId={festival.id} initialFoods={festival.foods} editable={isAdmin} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <DrinkManager festivalId={festival.id} initialDrinks={festival.drinks} editable={isAdmin} />
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
