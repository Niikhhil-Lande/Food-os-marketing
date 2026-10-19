# FoodOS marketing website

Marketing site for **FoodOS**, a POS for Indian restaurants. React (JavaScript) frontend, Spring Boot (Java 21) backend, PostgreSQL.

```
frontend/   React 18 + Vite (JavaScript). Home, Features, Book a demo, Contact, admin leads dashboard
backend/    Spring Boot 3.3 REST API: leads, savings calculator, JWT admin login, email notifications
docker-compose.yml   PostgreSQL + Mailpit (test inbox) + backend + frontend (nginx)
```

## Run everything with Docker

```bash
cp .env.example .env        # set JWT_SECRET and ADMIN_PASSWORD
docker compose up --build
```

| What | Where |
|---|---|
| Website | http://localhost:3000 |
| Admin leads dashboard | http://localhost:3000/admin/login (email `ADMIN_EMAIL`, password `ADMIN_PASSWORD`) |
| Notification emails (test inbox) | http://localhost:8025 |

## Run locally for development

Requirements: Java 21, Maven, Node 20+, PostgreSQL (or `docker compose up db mailpit`).

```bash
# Backend  (http://localhost:8080)
cd backend
export JWT_SECRET='a-random-string-of-at-least-32-characters'
export ADMIN_PASSWORD='choose-one'
mvn spring-boot:run

# Frontend (http://localhost:5173, proxies /api to the backend)
cd frontend
npm install
npm run dev
```

Tests: `mvn test` (backend, uses in-memory H2) and `npm test` (frontend, Vitest).

## API

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/demo-bookings` | public | "Book a demo" form |
| POST | `/api/contact` | public | "Send an enquiry" form |
| POST | `/api/savings/calculate` | public | Savings calculator |
| POST | `/api/auth/login` | public | Returns an admin JWT |
| GET | `/api/admin/leads?type=&status=&page=&size=` | admin | List leads (newest first) |
| GET | `/api/admin/leads/stats` | admin | Counts by type and status |
| PATCH | `/api/admin/leads/{id}/status` | admin | `NEW`, `CONTACTED`, `QUALIFIED`, `WON`, `LOST` |
| DELETE | `/api/admin/leads/{id}` | admin | Delete a lead |
| GET | `/actuator/health` | public | Health check |

Validation errors return `400` with `{ "message": "...", "fields": { "fieldName": "reason" } }`.

## Configuration (environment variables)

| Variable | Default | Notes |
|---|---|---|
| `JWT_SECRET` | dev placeholder | **Set a real value** (32+ characters) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | `admin@foodos.in` / dev placeholder | First admin is created only if no admin exists. **Change the password.** |
| `DB_URL`, `DB_USER`, `DB_PASSWORD` | local PostgreSQL | |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Needed only if the API is on a different origin |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_SMTP_AUTH`, `MAIL_SMTP_STARTTLS` | Mailpit | SMTP for sales-team notifications |
| `NOTIFY_FROM`, `NOTIFY_TO`, `NOTIFICATIONS_ENABLED` | | Who gets the "new lead" email |

Frontend (`frontend/.env.example`): `VITE_API_URL`, `VITE_WHATSAPP_NUMBER`, `VITE_CONTACT_EMAIL`.

## Decisions and assumptions to review

This project was rebuilt from the text of the live Lovable site, not from its source code, so the layout and styling are an interpretation, not a pixel match.

1. **Savings formula is inferred.** The live site shows ₹18,012 for 1 outlet vs Petpooja. That equals ₹30,000 (assumed yearly Petpooja cost) minus ₹11,988 (₹999 × 12). The formula is `outlets × (annual POS cost − 11,988) + other software × 50%`, never below zero. The 50% share for "other software" is my assumption (`foodos.pricing.other-software-offset-percent`). The default costs for Posist and Square / other are placeholders (`frontend/src/lib/content.js`). Confirm all of these with the original Lovable logic.
2. **Contact method is required.** The live forms mark only business type and outlets as required, so a visitor could submit with no way to reach them. The forms here ask for a WhatsApp number or an email, and the API enforces it.
3. **Comparison claims are uncited.** The "Legacy POS ₹2,499+" column and the savings estimate need a source or a clear "typical" disclaimer before real marketing use.
4. **Contact details are copied from the live site** (`+91 88490 67601`, `hello@foodos.in`, hours 9:00–21:00 IST). Check they are correct and current.
5. **Admin login** is a single shared admin account with a JWT kept in `sessionStorage`. Fine for a small sales team; add roles and a password-reset flow if more people need access.
6. **Rate limiting is in-memory** (10 form submissions per hour per IP, 5 failed logins per 15 minutes). Use a shared store if you run several backend instances.
7. **Database schema** is created automatically (`ddl-auto: update`). For production, set `DDL_AUTO=validate` and manage migrations with Flyway or Liquibase.
8. **Privacy:** the forms collect names, phone numbers and emails. Add a privacy policy page and consent wording that matches your obligations (for example India's DPDP Act).
