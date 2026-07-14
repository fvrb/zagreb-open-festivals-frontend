# Zagreb Open Festivals - Frontend

## Pokretanje

Backend očekuje CORS s `http://localhost:5173`, pa frontend koristi isti port.

```bash
npm install
npm run dev
```

Ako backend ne radi na `http://localhost:8080`, kopiraj `.env.example` u `.env` i promijeni:

```bash
VITE_API_URL=http://localhost:8080
```
