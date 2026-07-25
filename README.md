# NEXA Product Showcase

A responsive product showcase built for the GEEK Up Product Frontend Technical Assessment. The application includes mock authentication, a searchable and filterable catalog of 120 products, product detail pages, logout, and a two-service Docker setup.

## Demo credentials

- Username: `demo`
- Password: `Demo@123`

## Requirements

- Node.js 22.13 or newer
- npm 10 or newer
- Docker Desktop (recommended), or Mockoon CLI for local development

## Run with Docker

Make sure Docker Desktop is running, then:

```bash
docker compose up --build
```

Open:

- Frontend: http://localhost:8080
- Mock API: http://localhost:3001

Stop the services with:

```bash
docker compose down
```

## Run locally

Install dependencies and regenerate the deterministic mock data:

```bash
npm install
npm run mock:generate
```

Start Mockoon in the first terminal:

```bash
npx @mockoon/cli@9.6.1 start --data ./mockoon-data.json --port 3001
```

Start the frontend in a second terminal:

```bash
npm run dev
```

Open the local URL printed by the development server, normally http://localhost:3000.

## Available scripts

```bash
npm run dev            # Start the frontend development server
npm run build          # Create the production build
npm run start          # Serve the production build
npm run test           # Build and run rendered HTML checks
npm run lint           # Run ESLint
npm run mock:generate  # Regenerate mockoon-data.json with 120 products
```

## Application routes

- `/login` - username/password form
- `/products` - protected product catalog
- `/products/:id` - protected product detail

## Mock API routes

- `POST /api/login`
- `GET /api/product`
- `GET /api/product/:id`
- `POST /api/logout`

The product endpoint is a Mockoon CRUD route and supports:

- Search by product name: `name_like`
- Filters: `category_eq`, `brand_eq`, `inStock_eq`
- Sorting: `sort`, `order`
- Pagination: `page`, `limit`

## Project structure

```text
app/
  api/[...path]/       Frontend-to-Mockoon proxy
  components/          Shared interface components
  lib/                 API client and session storage
  login/               Login screen
  products/            Product list and detail screens
  types/               TypeScript models
scripts/
  generate-mock-data.mjs
mockoon-data.json
Dockerfile
docker-compose.yml
APPROACH.md
DECISION_LOG.md
```

## Verification checklist

- Valid credentials return access and refresh tokens.
- Invalid credentials return HTTP 401.
- Search only targets the product name.
- Category, brand, availability, sort, and pagination can be combined.
- Product detail is fetched from `/api/product/:id`.
- Logout calls `/api/logout`, clears the session, and redirects to login.
- Desktop and mobile layouts are supported.
- The browser calls same-origin `/api`; the frontend server proxies requests to the `mock-api` Docker service.

## Submission

Before submitting:

1. Add screenshots to `screenshots/`.
2. Review and update `DECISION_LOG.md` with any additional prompts or decisions.
3. Do not include `node_modules`, `dist`, `.git`, `.vinext`, or `.wrangler`.
4. Zip the source folder and upload it together with the running-result screenshots.
