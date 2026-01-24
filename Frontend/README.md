# Auric Krystal Frontend

Frontend for the Auric Krystal Astrology E-commerce platform built with React + Vite.

## Environment Configuration

The application uses a centralized API configuration. To configure the backend API URL:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `VITE_API_URL` in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

For production, update this to your production backend URL.

### API Configuration

All API calls use the centralized configuration in `src/config/api.js`. This allows you to:
- Change the API URL in one place (via environment variable)
- Avoid hardcoding URLs throughout the application
- Easy switching between development and production environments

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
