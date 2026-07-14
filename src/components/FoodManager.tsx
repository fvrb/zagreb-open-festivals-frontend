import { ActionIcon, Button, Group, Modal, NumberInput, Paper, Stack, Table, Text, TextInput, Title, Tooltip } from '@mantine/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { notifications } from '@mantine/notifications';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { foodService } from '../services/foodService';
import type { Food, FoodRequest } from '../types';
import { formatPrice, getErrorMessage } from '../utils/format';
import { foodSchema } from '../validation/formSchemas';

interface FoodManagerProps {
  festivalId: number;
  initialFoods?: Food[];
  editable: boolean;
}

export function FoodManager({ festivalId, initialFoods = [], editable }: FoodManagerProps) {
  const [foods, setFoods] = useState<Food[]>(initialFoods);
  const [editing, setEditing] = useState<Food | null>(null);
  const [formOpened, setFormOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [deletingFood, setDeletingFood] = useState<Food | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    control,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors },
  } = useForm<FoodRequest>({
    resolver: yupResolver(foodSchema),
    defaultValues: { name: '', price: 0 },
  });

  useEffect(() => {
    setFoods(initialFoods);
  }, [initialFoods]);

  const reloadFoods = async () => {
    const nextFoods = await foodService.getAllByFestival(festivalId);
    setFoods(nextFoods);
  };

  const resetForm = () => {
    setEditing(null);
    reset({ name: '', price: 0 });
  };

  const openCreateModal = () => {
    resetForm();
    setFormOpened(true);
  };

  const openEditModal = (food: Food) => {
    setEditing(food);
    reset({ name: food.name, price: Number(food.price) });
    setFormOpened(true);
  };

  const closeFormModal = () => {
    setFormOpened(false);
    resetForm();
  };

  const submitFood = async (values: FoodRequest) => {
    setSaving(true);
    try {
      if (editing) {
        await foodService.update(editing.id, values);
      } else {
        await foodService.create(festivalId, values);
      }

      await reloadFoods();
      closeFormModal();
      notifications.show({ color: 'green', title: 'Spremljeno', message: 'Ponuda hrane je azurirana.' });
    } catch (error) {
      notifications.show({ color: 'red', title: 'Greska', message: getErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (food: Food) => {
    setDeletingFood(food);
    setDeleteOpened(true);
  };

  const closeDeleteModal = () => {
    setDeleteOpened(false);
    setDeletingFood(null);
  };

  const confirmDelete = async () => {
    if (!deletingFood) return;

    setDeleting(true);
    try {
      await foodService.remove(deletingFood.id);
      await reloadFoods();
      notifications.show({ color: 'green', title: 'Obrisano', message: `${deletingFood.name} je uklonjen iz ponude.` });
      closeDeleteModal();
    } catch (error) {
      notifications.show({ color: 'red', title: 'Greska', message: getErrorMessage(error) });
    } finally {
      setDeleting(false);
    }
  };

  const rows = foods.map((food) => (
    <Table.Tr key={food.id}>
      <Table.Td>{food.name}</Table.Td>
      <Table.Td>{formatPrice(Number(food.price))}</Table.Td>
      {editable && (
        <Table.Td>
          <Group gap="xs" justify="flex-end">
            <Tooltip label="Uredi">
              <ActionIcon
                variant="subtle"
                onClick={() => openEditModal(food)}
              >
                <Pencil size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Obrisi">
              <ActionIcon color="red" variant="subtle" onClick={() => openDeleteModal(food)}>
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
            Hrana
          </Title>
          {editable && (
            <Button variant="light" leftSection={<Plus size={16} />} onClick={openCreateModal}>
              Dodaj hranu
            </Button>
          )}
        </Group>

        {foods.length > 0 ? (
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
          <Text c="dimmed">Nema unesene hrane za ovaj festival.</Text>
        )}

        <Modal
          opened={formOpened}
          onClose={closeFormModal}
          title={editing ? 'Uredi hranu' : 'Dodaj hranu'}
          centered
        >
          <form onSubmit={handleFormSubmit(submitFood)}>
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

        <Modal opened={deleteOpened} onClose={closeDeleteModal} title="Obrisi hranu" centered>
          <Stack>
            <Text>
              {deletingFood ? `Jesi li siguran da zelis obrisati "${deletingFood.name}"?` : 'Jesi li siguran da zelis obrisati ovaj zapis?'}
            </Text>
            <Group justify="flex-end">
              <Button variant="default" onClick={closeDeleteModal}>
                Odustani
              </Button>
              <Button color="red" loading={deleting} onClick={() => void confirmDelete()}>
                Obrisi
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Paper>
  );
}
