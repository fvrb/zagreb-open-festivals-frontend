import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Container,
  Group,
  Modal,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { ExternalLink, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FestivalForm } from '../components/FestivalForm';
import { festivalService } from '../services/festivalService';
import type { FestivalRequest, FestivalSummary } from '../types';
import { formatDate, getErrorMessage } from '../utils/format';

export function AdminDashboardPage() {
  const [festivals, setFestivals] = useState<FestivalSummary[]>([]);
  const [saving, setSaving] = useState(false);
  const [createOpened, setCreateOpened] = useState(false);
  const [editing, setEditing] = useState<FestivalSummary | null>(null);

  const loadFestivals = async () => {
    // TODO (4.Z): dodajte spinner i error state dok se festivali ucitavaju.
    setFestivals(await festivalService.getAll());
  };

  useEffect(() => {
    void loadFestivals();
  }, []);

  const handleCreate = async (values: FestivalRequest) => {
    setSaving(true);
    try {
      await festivalService.create(values);
      await loadFestivals();
      setCreateOpened(false);
      notifications.show({ color: 'green', title: 'Festival kreiran', message: values.name });
    } catch (err) {
      notifications.show({ color: 'red', title: 'Greska', message: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (values: FestivalRequest) => {
    if (!editing) return;

    setSaving(true);
    try {
      await festivalService.update(editing.id, values);
      await loadFestivals();
      setEditing(null);
      notifications.show({ color: 'green', title: 'Festival azuriran', message: values.name });
    } catch (err) {
      notifications.show({ color: 'red', title: 'Greska', message: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (festival: FestivalSummary) => {
    modals.openConfirmModal({
      title: 'Obrisati festival?',
      children: <Text size="sm">Festival {festival.name} bit ce trajno obrisan.</Text>,
      labels: { confirm: 'Obrisi', cancel: 'Odustani' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await festivalService.remove(festival.id);
          await loadFestivals();
          notifications.show({ color: 'green', title: 'Festival obrisan', message: festival.name });
        } catch (err) {
          notifications.show({ color: 'red', title: 'Greska', message: getErrorMessage(err) });
        }
      },
    });
  };

  const rows = festivals.map((festival) => (
    <Table.Tr key={festival.id}>
      <Table.Td>
        <Text fw={600}>{festival.name}</Text>
        <Text size="sm" c="dimmed" lineClamp={1}>
          {festival.shortDescription || 'Bez opisa'}
        </Text>
      </Table.Td>
      <Table.Td>{festival.location}</Table.Td>
      <Table.Td>
        <Badge variant="light">{formatDate(festival.date)}</Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <Tooltip label="Otvori detalje">
            <ActionIcon component={Link} to={`/festivals/${festival.id}`} variant="subtle">
              <ExternalLink size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Uredi">
            <ActionIcon variant="subtle" onClick={() => setEditing(festival)}>
              <Pencil size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Obrisi">
            <ActionIcon color="red" variant="subtle" onClick={() => confirmDelete(festival)}>
              <Trash2 size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-end">
          <div>
            <Title>Admin panel</Title>
            <Text c="dimmed">CRUD festivala i administracija ponude.</Text>
          </div>
          <Group>
            <Button variant="light" leftSection={<RefreshCw size={16} />} onClick={() => void loadFestivals()}>
              Osvjezi
            </Button>
            <Button leftSection={<Plus size={16} />} onClick={() => setCreateOpened(true)}>
              Novi festival
            </Button>
          </Group>
        </Group>

        <Table.ScrollContainer minWidth={760}>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Naziv</Table.Th>
                <Table.Th>Lokacija</Table.Th>
                <Table.Th>Datum</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {festivals.length === 0 && <Alert color="yellow">Nema festivala za prikaz.</Alert>}

        <Modal opened={createOpened} onClose={() => setCreateOpened(false)} title="Novi festival" size="lg">
          <FestivalForm submitLabel="Kreiraj festival" loading={saving} onSubmit={handleCreate} onCancel={() => setCreateOpened(false)} />
        </Modal>

        <Modal opened={Boolean(editing)} onClose={() => setEditing(null)} title="Uredi festival" size="lg">
          {editing && (
            <FestivalForm
              initialValues={editing}
              submitLabel="Spremi promjene"
              loading={saving}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          )}
        </Modal>
      </Stack>
    </Container>
  );
}
