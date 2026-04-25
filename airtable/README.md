# PlayaStays — Airtable Operations

This folder contains the **implementation specification** for the **PlayaStays Operations** base in Airtable.

## File

| File | Purpose |
|------|---------|
| [PLAYASTAYS_OPERATIONS_BASE.md](./PLAYASTAYS_OPERATIONS_BASE.md) | Full base definition: tables, fields, types, single-select options, formulas, views, links |

## How to use

1. In Airtable: **Add a base** → name it **PlayaStays Operations**.
2. Follow **PLAYASTAYS_OPERATIONS_BASE.md** table-by-table (build order is in the doc).
3. Paste formulas from the doc; insert field references via Airtable’s formula editor where names differ slightly.

Airtable bases cannot be generated from this repo without the Airtable API or manual UI work; this document is the authoritative **day-1 build script**.

## Boundaries (from spec)

- **Not** the CRM (HubSpot is sales truth).
- **Not** for full bank details.
- **Not** public-facing forms.
- **Google Drive** holds files; Airtable holds **status + links**.
