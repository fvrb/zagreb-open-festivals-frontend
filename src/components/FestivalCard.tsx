import { Badge, Button, Card, Group, Image, Stack, Text, Title } from '@mantine/core';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type ReactNode } from 'react';
import type { FestivalSummary } from '../types';
import { formatDate } from '../utils/format';

const fallbackImage =
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80';

interface FestivalCardProps {
  festival: FestivalSummary;
  action?: ReactNode;
}

function FestivalCardComponent({ festival, action }: FestivalCardProps) {
  return (
    <Card withBorder radius="md" padding="md" className="festival-card">
      <Card.Section>
        <Image src={festival.imageUrl || fallbackImage} alt={festival.name} fit="cover" style={{ height: 190, width: '100%' }} />
      </Card.Section>
      <Stack gap="sm" mt="md">
        <Group justify="space-between" align="flex-start" gap="sm">
          <Title order={3} size="h4" lineClamp={2}>
            {festival.name}
          </Title>
          <Group gap="xs">
            <Badge color="teal" variant="light">
              {formatDate(festival.date)}
            </Badge>
            {action}
          </Group>
        </Group>
        <Group gap={6} c="dimmed">
          <MapPin size={16} />
          <Text size="sm">{festival.location}</Text>
        </Group>
        <Text size="sm" c="dimmed" lineClamp={3}>
          {festival.shortDescription || 'Detalji festivala dostupni su na stranici festivala.'}
        </Text>
        <Button component={Link} to={`/festivals/${festival.id}`} variant="light" mt="auto">
          Detalji
        </Button>
      </Stack>
    </Card>
  );
}

export const FestivalCard = FestivalCardComponent;
