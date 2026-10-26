# AGENTS.md — BD Solar Energy

## Project overview

This repository contains the BD Solar Energy e-commerce application for solar and electrical products, including solar panels, inverters, batteries, wires, cables, circuit protection, lighting, and accessories.

- `frontend/`: React and TypeScript application.
- `backend/`: Django REST Framework API and database.
- The backend database and API are the source of truth for dynamic business data.
- The storefront uses a purple visual identity. Preserve the established design unless the task explicitly requests a redesign.

Read the relevant nested `AGENTS.md` before changing files under `frontend/` or `backend/`.

## General working rules

1. Inspect the repository, relevant code, Git status, and existing conventions before editing.
2. Make focused, incremental changes. Do not rewrite working systems without a demonstrated need.
3. Preserve existing uncommitted work. Never reset, discard, or overwrite unrelated changes.
4. Do not commit, push, reset a database, delete migrations, or perform destructive operations unless explicitly authorized.
5. Follow the existing dependency manager and project configuration. Inspect manifests before assuming commands or versions.
6. Do not add dependencies unless they materially help solve the task. Check compatibility before adding or upgrading packages.
7. Do not claim a test, build, migration, endpoint, or feature works unless you actually verified it. State checks that could not be run and why.
8. Update relevant tests and documentation whenever behavior, APIs, schemas, or setup steps change.
9. Prefer readable, maintainable solutions over clever abstractions or unnecessary architecture.
10. If requirements are ambiguous or a change could destroy data, inspect further and ask for clarification before taking a risky action.

## Full-stack architecture and data flow

- Keep the React frontend and Django REST Framework backend aligned through explicit, documented API contracts.
- Dynamic business data must come from backend API responses, not hardcoded frontend seed arrays or mock services in normal application flow.
- Static presentation content (navigation labels, icons, layout configuration) may remain in the frontend.
- Development sample products should be created in the backend database using fixtures or management commands and fetched by the frontend through the API.
- Do not silently replace failed API responses with demo data. Show an appropriate loading, empty, retry, or error state.
- Keep HTTP requests in the frontend service/API layer rather than scattering fetch logic across UI components.
- Keep business rules and authoritative calculations on the backend.
- Align TypeScript types with serializer responses, including UUIDs, nullable fields, image URLs, decimals, and DRF pagination (`count`, `next`, `previous`, `results`).
- When changing an API contract, update all consumers, tests, and documentation in the same change.

## Security and data integrity

- Never commit secrets, credentials, private keys, access tokens, refresh tokens, or real customer data.
- Use environment variables for environment-specific configuration and keep `.env.example` files free of real secrets.
- Never trust client-supplied prices, discounts, stock quantities, order totals, roles, or permissions.
- Enforce authentication, authorization, and ownership checks on the backend; frontend route guards are not a security boundary.
- Do not expose one customer's profile, address, cart, wishlist, or orders to another customer.
- Preserve order history and existing customer data.
- Treat database and migration changes as potentially destructive; inspect the current schema and migration history before modifying them.

## Authentication

- Use the authentication architecture already established in the backend; do not create a second, competing authentication system.
- JWT issuance, validation, refresh, and revocation must follow the configured backend packages and documented API contract.
- Never implement fake login, hardcoded authenticated users, or frontend-only authentication.
- Do not store passwords or long-lived refresh tokens in browser storage.
- Keep frontend session handling consistent with the backend's actual token/cookie strategy, including refresh, logout, CSRF, and CORS behavior where applicable.
- Test unauthenticated access, expired/invalid tokens, logout, and object-level permissions when authentication-related code changes.

## Standard workflow

For each task:

1. Inspect the relevant code and instructions.
2. Summarize the intended change and identify risks.
3. Implement the smallest complete solution.
4. Add or update tests.
5. Run the relevant lint, type-check, test, migration, or build commands discovered in project configuration.
6. Review the diff for regressions, secrets, unrelated edits, and missing documentation.
7. Report files changed, checks actually run, results, and unresolved issues.

Do not stop after producing an audit or plan when the request asks for implementation.

## Completion criteria

A task is complete only when the requested behavior is implemented, relevant tests/checks have been run where possible, API consumers remain synchronized, and any unverified assumptions or remaining failures are clearly reported.
