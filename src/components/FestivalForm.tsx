import { Button, Group, Stack, TextInput, Textarea } from '@mantine/core';
import { type FormEvent, useEffect } from 'react';
import type { FestivalRequest, FestivalSummary } from '../types';

interface FestivalFormProps {
  initialValues?: Partial<FestivalSummary & { description?: string | null }>;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: FestivalRequest) => Promise<void> | void;
  onCancel?: () => void;
}

export function FestivalForm({ initialValues, loading, submitLabel, onSubmit, onCancel }: FestivalFormProps) {
  const defaultValues = {
    name: initialValues?.name ?? '',
    description: initialValues?.description ?? initialValues?.shortDescription ?? '',
    location: initialValues?.location ?? '',
    date: initialValues?.date ?? '',
    imageUrl: initialValues?.imageUrl ?? '',
  };

  useEffect(() => {
    void initialValues;
  }, [initialValues]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit({
      name: defaultValues.name,
      description: defaultValues.description,
      location: defaultValues.location,
      date: defaultValues.date,
      imageUrl: defaultValues.imageUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        {/* TODO (3.Z): ovdje dodajte useForm, validaciju i prikaz gresaka po poljima. */}
        <TextInput label="Naziv" withAsterisk defaultValue={defaultValues.name} />
        <Textarea label="Opis" minRows={4} defaultValue={defaultValues.description} />
        <TextInput label="Lokacija" withAsterisk defaultValue={defaultValues.location} />
        <TextInput label="Datum" type="date" withAsterisk defaultValue={defaultValues.date} />
        <TextInput label="URL slike" defaultValue={defaultValues.imageUrl} />
        <Group justify="flex-end">
          {onCancel && (
            <Button variant="default" onClick={onCancel}>
              Odustani
            </Button>
          )}
          <Button type="submit" loading={loading}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
