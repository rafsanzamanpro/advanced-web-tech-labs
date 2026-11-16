# Lab Task 04 — Product Inventory API

## 1. PostgreSQL database

Create a new database named `product_inventory_db` in pgAdmin. Keep your existing project's database unchanged. Use your local PostgreSQL username/password in `src/app.module.ts`; replace `your_postgres_password` with your own password. The app connects to the same PostgreSQL server but only to this separate database.

## 2. Install packages (from this folder)

```bash
npm install @nestjs/typeorm typeorm pg class-validator class-transformer @nestjs/mapped-types
npm install -D @types/pg
```

## 3. Run

```bash
npm run start:dev
```

With PostgreSQL running and the database/password correct, TypeORM creates the `products` table automatically (`synchronize: true`).

## 4. Postman

Use Body → raw → JSON for POST, PUT, and PATCH. Routes:

- POST /products
- GET /products
- GET /products/search?keyword=phone
- GET /products/category/Electronics
- GET /products/1
- PATCH /products/1
- PUT /products/1
- DELETE /products/1
- PATCH /products/1/toggle

Example create body: `{"name":"iPhone 15","price":999.99,"stock":50,"category":"Electronics"}`.
