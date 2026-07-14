import { Alert, Button, Container, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../validation/formSchemas';

type LoginFormValues = {
  username: string;
  password: string;
};

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';

  return (
    <Container size={420}>
      <Paper withBorder radius="md" p="xl">
        <form
          onSubmit={handleSubmit(async (values) => {
            setLoading(true);
            setError(null);
            try {
              await login(values.username, values.password);
              navigate(from, { replace: true });
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Prijava nije uspjela');
            } finally {
              setLoading(false);
            }
          })}
        >
          <Stack>
            <div>
              <Title order={2}>Prijava</Title>
              <Text c="dimmed" size="sm">
                Test admin: admin / admin123, korisnik: marko / user123
              </Text>
            </div>
            {error && <Alert color="red">{error}</Alert>}
            <TextInput label="Username" withAsterisk error={errors.username?.message} {...register('username')} />
            <PasswordInput label="Password" withAsterisk error={errors.password?.message} {...register('password')} />
            <Button type="submit" loading={loading} leftSection={<LogIn size={16} />}>
              Prijavi se
            </Button>
            <Text size="sm" ta="center">
              Nemas racun? <Text component={Link} to="/register" c="teal" inherit>Registriraj se</Text>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
