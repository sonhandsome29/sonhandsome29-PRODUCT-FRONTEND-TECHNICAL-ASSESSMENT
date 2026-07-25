# Technical Approach

## Product direction

NEXA is a fictional curated technology store. The visual direction uses editorial typography, warm neutral surfaces, navy text, and orange/lime accents to avoid a generic admin-dashboard appearance while keeping the catalog easy to scan.

## Technology choices

- **React 19 and TypeScript** provide component composition and compile-time models.
- **Next-compatible App Router through Vinext/Vite** supplies file-based routes and server-side API handlers.
- **Lucide React** supplies consistent, accessible icons.
- **Native Fetch API** keeps the networking layer small. A shared client attaches the bearer token and normalizes errors.
- **Mockoon CLI** satisfies the mock API requirement. A CRUD route provides product lookup, filtering, sorting, and pagination.
- **Docker Compose** runs the frontend and official `mockoon/cli` image together.

## Authentication

The mock login returns both access and refresh tokens. The session is stored in `sessionStorage`, so it is removed when the browser session ends and is not shared permanently across tabs. Requests attach the access token as a bearer token.

This is an explicit tradeoff for a frontend assessment. A production application should prefer a backend-issued secure, HTTP-only cookie and implement real token rotation.

## API communication

Browser code calls relative `/api` URLs. A catch-all server route proxies those calls to the Mockoon service.

This avoids exposing Docker's internal hostname to the browser:

```text
Browser -> frontend:3000/api/* -> mock-api:3000/api/*
```

Locally, the proxy defaults to `http://127.0.0.1:3001`. In Docker, `MOCK_API_URL` is set to `http://mock-api:3000`.

## Product data and filtering

The generator creates 120 deterministic products with:

- Name
- Image
- Description
- Category
- Brand
- Color
- Price and original price
- Rating and review count
- Availability and stock
- Badge and SKU

The catalog uses Mockoon's server-side query parameters. Product-name search uses `name_like` rather than Mockoon's generic `search` parameter so the feature cannot accidentally match descriptions or other fields.

## Resilience and accessibility

- Loading skeletons prevent empty layout flashes.
- Error states include a retry action.
- Empty filters include a reset action.
- Form controls have associated labels.
- Interactive elements have visible keyboard focus.
- Images have descriptive alt text.
- Motion is reduced when the operating system requests it.
- Responsive breakpoints cover large desktop, tablet, and mobile layouts.

## Known assessment boundaries

- Tokens are static mock values and are not cryptographically verified.
- Logout simulates revocation but does not maintain a persistent revocation list.
- Placeholder product artwork uses the DiceBear endpoint permitted by the assessment.
- The “Reserve this object” action is visual only because cart or checkout behavior is outside the requested scope.
