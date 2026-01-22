# Backend (MongoDB)

This backend now uses MongoDB (via Mongoose) instead of MySQL.

## Setup

- Set `PORT` and optional `MONGO_URI` in `.env` (defaults to `mongodb://127.0.0.1:27017/auric_krystal`).
- Install deps and start:

```
npm install
npm run dev
```

## Health & Init

- Health: GET /api/health
- Init DB (ensures indexes): POST /api/setup/init-database
- DB Status: GET /api/setup/database-status
- Seed sample data: POST /api/seed/seed-data

## Notes

- Numeric `id` fields are preserved using an auto-increment counter per collection.
- Collections mirror previous SQL tables: users, categories, sub_categories, products, orders, quiz_questions (partial).
