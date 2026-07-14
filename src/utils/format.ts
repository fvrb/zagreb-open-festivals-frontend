export function formatDate(value: string) {
  return new Intl.DateTimeFormat('hr-HR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

export function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { detail?: string; errors?: string[] } } }).response;
    const errors = response?.data?.errors;

    if (errors?.length) {
      return errors.join(', ');
    }

    if (response?.data?.detail) {
      return response.data.detail;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Dogodila se neočekivana greška';
}
