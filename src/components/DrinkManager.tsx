import { ActionIcon, Button, Group, Modal, NumberInput, Paper, Stack, Table, Text, TextInput, Title, Tooltip } from '@mantine/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { notifications } from '@mantine/notifications';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { drinkService } from '../services/drinkService';
import type { Drink, DrinkRequest } from '../types';
import { formatPrice, getErrorMessage } from '../utils/format';
import { drinkSchema } from '../validation/formSchemas';

interface DrinkManagerProps {
  festivalId: number;
  initialDrinks?: Drink[];
  editable: boolean;
}

export function DrinkManager({ festivalId, initialDrinks = [], editable }: DrinkManagerProps) {
  const [drinks, setDrinks] = useState<Drink[]>(initialDrinks);
  const [editing, setEditing] = useState<Drink | null>(null);
  const [formOpened, setFormOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [deletingDrink, setDeletingDrink] = useState<Drink | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    control,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors },
  } = useForm<DrinkRequest>({
    resolver: yupResolver(drinkSchema),
    defaultValues: { name: '', price: 0 },
  });

  useEffect(() => {
    setDrinks(initialDrinks);
  }, [initialDrinks]);

  const reloadDrinks = async () => {
    const nextDrinks = await drinkService.getAllByFestival(festivalId);
    setDrinks(nextDrinks);
  };

  const resetForm = () => {
    setEditing(null);
    reset({ name: '', price: 0 });
  };

  const openCreateModal = () => {
    resetForm();
    setFormOpened(true);
  };

  const openEditModal = (drink: Drink) => {
    setEditing(drink);
    reset({ name: drink.name, price: Number(drink.price) });
    setFormOpened(true);
  };

  const closeFormModal = () => {
    setFormOpened(false);
    resetForm();
  };

  const submitDrink = async (values: DrinkRequest) => {
    setSaving(true);
    try {
      if (editing) {
        await drinkService.update(editing.id, values);
      } else {
        await drinkService.create(festivalId, values);
      }

      await reloadDrinks();
      closeFormModal();
      notifications.show({ color: 'green', title: 'Spremljeno', message: 'Ponuda pića je ažurirana.' });
    } catch (error) {
      notifications.show({ color: 'red', title: 'Greška', message: getErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (drink: Drink) => {
    setDeletingDrink(drink);
    setDeleteOpened(true);
  };

  const closeDeleteModal = () => {
    setDeleteOpened(false);
    setDeletingDrink(null);
  };

  const confirmDelete = async () => {
    if (!deletingDrink) return;

    setDeleting(true);
    try {
      await drinkService.remove(deletingDrink.id);
      await reloadDrinks();
      notifications.show({ color: 'green', title: 'Obrisano', message: `${deletingDrink.name} je uklonjen iz ponude.` });
      closeDeleteModal();
    } catch (error) {
      notifications.show({ color: 'red', title: 'Greška', message: getErrorMessage(error) });
    } finally {
      setDeleting(false);
    }
  };

  const rows = drinks.map((drink) => (
    <Table.Tr key={drink.id}>
      <Table.Td>{drink.name}</Table.Td>
      <Table.Td>{formatPrice(Number(drink.price))}</Table.Td>
      {editable && (
        <Table.Td>
          <Group gap="xs" justify="flex-end">
            <Tooltip label="Uredi">
              <ActionIcon variant="subtle" onClick={() => openEditModal(drink)}>
                <Pencil size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Obriši">
              <ActionIcon color="red" variant="subtle" onClick={() => openDeleteModal(drink)}>
                <Trash2 size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Table.Td>
      )}
    </Table.Tr>
  ));

  return (
    <Paper withBorder radius="md" p="md">
      <Stack>
        <Group justify="space-between">
          <Title order={3} size="h4">
            Piće
          </Title>
          {editable && (
            <Button variant="light" leftSection={<Plus size={16} />} onClick={openCreateModal}>
              Dodaj piće
            </Button>
          )}
        </Group>

        {drinks.length > 0 ? (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Naziv</Table.Th>
                <Table.Th>Cijena</Table.Th>
                {editable && <Table.Th />}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        ) : (
          <Text c="dimmed">Nema unesenog pića za ovaj festival.</Text>
        )}

        <Modal
          opened={formOpened}
          onClose={closeFormModal}
          title={editing ? 'Uredi piće' : 'Dodaj piće'}
          centered
        >
          <form onSubmit={handleFormSubmit(submitDrink)}>
            <Stack>
              <TextInput label="Naziv" placeholder="Unesite naziv..." withAsterisk error={errors.name?.message} {...register('name')} />
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    label="Cijena"
                    decimalScale={2}
                    min={0}
                    withAsterisk
                    value={field.value}
                    onChange={(value) => field.onChange(typeof value === 'number' ? value : 0)}
                    error={errors.price?.message}
                    ref={field.ref}
                    name={field.name}
                    onBlur={field.onBlur}
                  />
                )}
              />
              <Group justify="flex-end">
                <Button variant="default" onClick={closeFormModal}>
                  Odustani
                </Button>
                <Button type="submit" loading={saving} leftSection={<Plus size={16} />}>
                  {editing ? 'Spremi' : 'Dodaj'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        <Modal opened={deleteOpened} onClose={closeDeleteModal} title="Obriši piće" centered>
          <Stack>
            <Text>
              {deletingDrink ? `Jesi li siguran da želiš obrisati "${deletingDrink.name}"?` : 'Jesi li siguran da želiš obrisati ovaj zapis?'}
            </Text>
            <Group justify="flex-end">
              <Button variant="default" onClick={closeDeleteModal}>
                Odustani
              </Button>
              <Button color="red" loading={deleting} onClick={() => void confirmDelete()}>
                Obriši
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Paper>
  );
}
