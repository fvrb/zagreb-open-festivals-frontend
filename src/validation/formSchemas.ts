import * as yup from 'yup';

export const loginSchema = yup.object({
  username: yup.string().trim().required('Username je obavezan'),
  password: yup.string().required('Password je obavezan'),
});

export const registerSchema = yup.object({
  username: yup.string().trim().min(3, 'Username mora imati barem 3 znaka').required('Username je obavezan'),
  email: yup.string().trim().email('Email nije ispravan').required('Email je obavezan'),
  password: yup.string().min(6, 'Password mora imati barem 6 znakova').required('Password je obavezan'),
});

export const festivalSchema = yup.object({
  // TODO (3.Z): ovdje definirajte pravila za festival formu.
});

export const foodSchema = yup.object({
  name: yup.string().trim().required('Naziv je obavezan'),
  price: yup
    .number()
    .typeError('Cijena nije ispravnog tipa')
    .min(0, 'Cijena ne smije biti negativna')
    .required('Cijena je obavezna'),
});

export const drinkSchema = yup.object({
  name: yup.string().trim().required('Naziv je obavezan'),
  price: yup
    .number()
    .typeError('Cijena nije ispravnog tipa')
    .min(0, 'Cijena ne smije biti negativna')
    .required('Cijena je obavezna'),
});
