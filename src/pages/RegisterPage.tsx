import { Alert, Button, Container, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { registerSchema } from '../validation/formSchemas';

type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
};

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  return (
    <Container size={460}>
      <Paper withBorder radius="md" p="xl">
        <form
          onSubmit={handleSubmit(async (values) => {
            setLoading(true);
            setError(null);
            try {
              await register(values.username, values.email, values.password);
              navigate('/login');
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Registracija nije uspjela');
            } finally {
              setLoading(false);
            }
          })}
        >
          <Stack>
            <Title order={2}>Registracija</Title>
            {error && <Alert color="red">{error}</Alert>}
            <TextInput label="Username" withAsterisk error={errors.username?.message} {...registerField('username')} />
            <TextInput label="Email" withAsterisk error={errors.email?.message} {...registerField('email')} />
            <PasswordInput label="Password" withAsterisk error={errors.password?.message} {...registerField('password')} />
            <Button type="submit" loading={loading} leftSection={<UserPlus size={16} />}>
              Kreiraj racun
            </Button>
            <Text size="sm" ta="center">
              Vec imas racun? <Text component={Link} to="/login" c="teal" inherit>Prijavi se</Text>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
