# PlayaStays Operations — Airtable base specification

**Base name:** `PlayaStays Operations`  
**Purpose:** Internal operations database only (not CRM, not bank storage, not public forms).  
**HubSpot** = sales truth · **Airtable** = operations truth · **Google Drive** = document truth.

---

## Global rules

1. First column in each table = **primary field** (must be formula per spec).
2. Create tables in the order below so linked-record targets exist when links are added.
3. **Auto #** = field type **Autonumber** (start 1, increment 1).
4. All display IDs use the same padding pattern: **PREFIX-####** (4 digits).

### ID formula pattern (copy per table, change prefix)

```
PREFIX & "-" & RIGHT("0000" & {Auto #}, 4)
```

Replace `PREFIX` with: `LEAD`, `OWN`, `PRP`, `ONB`, `DOC`, `VEN` — in Airtable use string literal:

| Table        | Formula |
|-------------|---------|
| Leads Intake | `"LEAD-" & RIGHT("0000" & {Auto #}, 4)` |
| Owners       | `"OWN-" & RIGHT("0000" & {Auto #}, 4)` |
| Properties   | `"PRP-" & RIGHT("0000" & {Auto #}, 4)` |
| Onboarding   | `"ONB-" & RIGHT("0000" & {Auto #}, 4)` |
| Documents    | `"DOC-" & RIGHT("0000" & {Auto #}, 4)` |
| Vendors      | `"VEN-" & RIGHT("0000" & {Auto #}, 4)` |

Field names in formulas must match your exact Airtable field names (including `/` and spaces).

---

## Table build order

1. Vendors (no dependencies)  
2. Owners  
3. Properties — link **Owner** to Owners only; add **Onboarding Record** → Onboarding **after** step 4 exists (or leave empty until Onboarding rows exist).  
4. Onboarding (links Owners, Properties)  
5. Documents (links Owners, Properties, Onboarding)  
6. Leads Intake (links Owners, Properties)  

### Primary field + Auto #

The **primary field** must be the formula ID. In Airtable: add **Auto #** first, then add the **ID formula** field, then set the formula field as **primary** (table settings) or drag it to the first column and set as primary. Formula references `{Auto #}`.

### Call Booked Date

Use field type **Date** with **Include a time field** enabled (date/time), or a single **Date with time** field if your plan shows that option.  

---

## 1. Leads Intake

**Primary field:** `Lead Intake ID` (Formula)

### Fields (create in this order after Auto #)

| # | Field name | Type | Notes |
|---|------------|------|--------|
| 1 | Lead Intake ID | Formula | See ID formula above → `LEAD-0001` |
| 2 | Auto # | Autonumber | |
| 3 | HubSpot Contact ID | Single line text | |
| 4 | HubSpot Deal ID | Single line text | |
| 5 | Contact Full Name | Single line text | |
| 6 | Email | Email | |
| 7 | Phone | Phone | |
| 8 | WhatsApp Number | Phone | |
| 9 | Preferred Contact Method | Single select | Options below |
| 10 | Preferred Language | Single select | Options below |
| 11 | Lead Source | Single select | Options below |
| 12 | Service Needed | Single select | Options below |
| 13 | Property City | Single select | Options below |
| 14 | Property Summary | Long text | |
| 15 | Page URL Submitted From | URL | |
| 16 | Referrer | URL | (use URL type for consistency with “URL or single line”) |
| 17 | UTM Source | Single line text | |
| 18 | UTM Medium | Single line text | |
| 19 | UTM Campaign | Single line text | |
| 20 | UTM Term | Single line text | |
| 21 | UTM Content | Single line text | |
| 22 | Call Booked Date | Date | Include time: use **Date with time** if available |
| 23 | Lead Stage Snapshot | Single select | Options below |
| 24 | Qualified for Ops? | Checkbox | |
| 25 | Converted to Owner? | Checkbox | |
| 26 | Owner Link | Link to another record → **Owners** | Allow linking to multiple records = **Off** (single) |
| 27 | Property Link | Link to another record → **Properties** | Single |
| 28 | Internal Notes | Long text | |
| 29 | Created At | Created time | |

**Note:** If your workspace uses “Created time” only without separate field, Airtable provides it automatically; add **Created time** field from field type menu.

### Single select — Preferred Contact Method
Email · Phone · WhatsApp

### Single select — Preferred Language
English · Spanish

### Single select — Lead Source
Website Form · Facebook · Instagram · WhatsApp · Referral · Google Business Profile · LinkedIn · Phone Call · Direct Email · Manual Entry

### Single select — Service Needed
Vacation Rental Management · Airbnb Management · Long-Term Leasing · Seller Support · General Property Management · General Inquiry

### Single select — Property City
Playa del Carmen · Puerto Morelos · Tulum · Cancun · Cozumel · Riviera Maya Other

### Single select — Lead Stage Snapshot
New Lead · Contacted · Call Booked · Call Completed · Qualified · Proposal / Move Forward · Onboarding · Nurture · Not a Fit

### Views

| View name | Filter / sort |
|-----------|----------------|
| New Leads | `Lead Stage Snapshot` = "New Lead" (or is empty) — sort Created At descending |
| Call Booked | `Call Booked Date` is not empty OR `Lead Stage Snapshot` = "Call Booked" |
| Qualified for Ops | `Qualified for Ops?` is checked |
| Converted | `Converted to Owner?` is checked |
| Needs Review | `Lead Stage Snapshot` = "Not a Fit" OR `Qualified for Ops?` is unchecked and stage in Nurture/New |

Adjust “Needs Review” to ops preference; minimum: surface non-converted stale leads.

---

## 2. Owners

**Primary field:** `Owner Display Name` (Formula)

### Fields

| # | Field name | Type | Notes |
|---|------------|------|--------|
| 1 | Owner Display Name | Formula | See below |
| 2 | Owner ID | Formula | `"OWN-" & RIGHT("0000" & {Auto #}, 4)` |
| 3 | Auto # | Autonumber | |
| 4 | Full Name | Single line text | |
| 5 | Email | Email | |
| 6 | Primary Phone | Phone | |
| 7 | WhatsApp Number | Phone | |
| 8 | Preferred Contact Method | Single select | Same 3 options as Leads |
| 9 | Preferred Language | Single select | English · Spanish |
| 10 | Owner Type | Single select | Options below |
| 11 | HubSpot Contact ID | Single line text | |
| 12 | HubSpot Deal ID | Single line text | |
| 13 | Google Drive Owner Folder URL | URL | |
| 14 | Active Status | Single select | Options below |
| 15 | Properties | Link to another record → **Properties** | **Allow linking from Properties table** — here enable “allow multiple” |
| 16 | Internal Notes | Long text | |
| 17 | Created At | Created time | |

### Owner Display Name (formula)

```
IF(
  {Full Name},
  {Full Name} & " · " & {Owner ID},
  {Owner ID}
)
```

(If `Full Name` is empty, shows ID only.)

### Single select — Owner Type
Property Owner · Investor · Seller · Partner · Other

### Single select — Active Status
Prospect · Onboarding · Active Client · Inactive

### Views

| View name | Filter |
|-----------|--------|
| Prospects | `Active Status` = "Prospect" |
| Onboarding | `Active Status` = "Onboarding" |
| Active Clients | `Active Status` = "Active Client" |

---

## 3. Properties

**Primary field:** `Property Display Name` (Formula)

### Fields

| # | Field name | Type | Notes |
|---|------------|------|--------|
| 1 | Property Display Name | Formula | See below |
| 2 | Property ID | Formula | `"PRP-" & RIGHT("0000" & {Auto #}, 4)` |
| 3 | Auto # | Autonumber | |
| 4 | Property Name / Building | Single line text | |
| 5 | Unit Number | Single line text | |
| 6 | Short Address | Single line text | |
| 7 | City | Single select | Options below |
| 8 | Property Type | Single select | Options below |
| 9 | Rental Strategy | Single select | Options below |
| 10 | Owner | Link to another record → **Owners** | Single |
| 11 | Onboarding Record | Link to another record → **Onboarding** | Single (create Onboarding table first) |
| 12 | Google Drive Property Folder URL | URL | |
| 13 | Main Photo Folder URL | URL | |
| 14 | Inventory Doc URL | URL | |
| 15 | Management Agreement Doc URL | URL | |
| 16 | Listing Go-Live Target Date | Date | Date only |
| 17 | Ready for Listing Setup | Checkbox | |
| 18 | Ready for Go Live | Checkbox | |
| 19 | Active Listing | Checkbox | |
| 20 | Internal Notes | Long text | |
| 21 | Created At | Created time | |

### Property Display Name (formula)

```
TRIM(
  CONCATENATE(
    IF({Property Name / Building}, {Property Name / Building}, "Property"),
    IF({Unit Number}, " #" & {Unit Number}, ""),
    " · ",
    {Property ID}
  )
)
```

If CONCATENATE with empty parts errors, use:

```
IF(
  {Unit Number},
  {Property Name / Building} & " #" & {Unit Number} & " · " & {Property ID},
  IF(
    {Property Name / Building},
    {Property Name / Building} & " · " & {Property ID},
    {Property ID}
  )
)
```

### Single select — City
Playa del Carmen · Puerto Morelos · Tulum · Cancun · Cozumel · Other

### Single select — Property Type
Condo · Apartment · Villa · House · Studio · Multi-unit · Other

### Single select — Rental Strategy
Vacation Rental · Airbnb Management · Long-Term Leasing · Seller Support · Other

### Views

| View name | Filter |
|-----------|--------|
| Onboarding Properties | `Onboarding Record` is not empty |
| Ready for Listing Setup | `Ready for Listing Setup` is checked |
| Ready for Go Live | `Ready for Go Live` is checked |
| Active Listings | `Active Listing` is checked |

---

## 4. Onboarding

**Primary field:** `Onboarding Display Name` (Formula)

### Checkbox fields (exact names — used in % formula)

Use **Checkbox** type for each:

1. Lead Received  
2. Call Booked  
3. Call Completed  
4. Qualified  
5. Management Agreement Sent  
6. Management Agreement Signed  
7. Onboarding Questionnaire Sent  
8. Onboarding Questionnaire Complete  
9. Document Request Sent  
10. Documents Received  
11. Payout Info Requested  
12. Payout Info Received  
13. Photos Received / Scheduled  
14. Inventory Complete  
15. Compliance Confirmed  
16. Ready for Listing Setup  
17. Ready for Go Live  
18. Active Client  

### Date fields (Date; use date-only unless you need time)

- Agreement Sent Date  
- Agreement Signed Date  
- Questionnaire Sent Date  
- Questionnaire Completed Date  
- Document Request Sent Date  
- Documents Received Date  
- Payout Requested Date  
- Payout Received Date  
- Photos Date  
- Inventory Date  
- Compliance Date  
- Listing Setup Ready Date  
- Go Live Ready Date  

### All fields in order

| # | Field name | Type |
|---|------------|------|
| 1 | Onboarding Display Name | Formula | see below |
| 2 | Onboarding ID | Formula | `"ONB-" & RIGHT("0000" & {Auto #}, 4)` |
| 3 | Auto # | Autonumber |
| 4 | Owner | Link → Owners | single |
| 5 | Property | Link → Properties | single |
| 6 | Stage Status | Single select | options below |
| 7–24 | *(18 checkboxes)* | Checkbox | names exactly as listed above |
| 25–37 | *(13 date fields)* | Date | names exactly as listed above |
| 38 | Checklist Completion % | Formula | see below |
| 39 | Current Blocker | Long text |
| 40 | Internal Notes | Long text |
| 41 | Ops Owner | Single line text | *or use Collaborator if you prefer* |
| 42 | Created At | Created time |

### Onboarding Display Name (formula)

```
{Onboarding ID} &
IF({Property}, " · " & ARRAYJOIN({Property}, ", "), "") &
IF({Owner}, " · " & ARRAYJOIN({Owner}, ", "), "")
```

If Property/Owner are single links, in Airtable you may need lookup fields or:

```
{Onboarding ID} & IF({Property}, " · " & {Property}, "")
```

**Simplest reliable:**

```
CONCATENATE({Onboarding ID}, IF({Property}, " · ", ""), {Property})
```

(When Property is a linked record, Airtable shows primary field of linked row.)

### Stage Status — single select

Lead Received · Call Booked · Call Completed · Qualified · Agreement Sent · Awaiting Signature · Awaiting Questionnaire · Awaiting Docs · Awaiting Payout Info · Listing Setup Ready · Ready for Go Live · Active Client · Paused

### Checklist Completion % (formula)

Airtable treats checkboxes as `1` when checked in numeric context. Use SUM of 18 IFs:

```
ROUND(
  (
    IF({Lead Received}, 1, 0) +
    IF({Call Booked}, 1, 0) +
    IF({Call Completed}, 1, 0) +
    IF({Qualified}, 1, 0) +
    IF({Management Agreement Sent}, 1, 0) +
    IF({Management Agreement Signed}, 1, 0) +
    IF({Onboarding Questionnaire Sent}, 1, 0) +
    IF({Onboarding Questionnaire Complete}, 1, 0) +
    IF({Document Request Sent}, 1, 0) +
    IF({Documents Received}, 1, 0) +
    IF({Payout Info Requested}, 1, 0) +
    IF({Payout Info Received}, 1, 0) +
    IF({Photos Received / Scheduled}, 1, 0) +
    IF({Inventory Complete}, 1, 0) +
    IF({Compliance Confirmed}, 1, 0) +
    IF({Ready for Listing Setup}, 1, 0) +
    IF({Ready for Go Live}, 1, 0) +
    IF({Active Client}, 1, 0)
  ) / 18 * 100,
  0
)
```

**Important:** Replace `{Photos Received / Scheduled}` etc. with the exact field names Airtable created (slashes may become different). Open formula editor and insert fields from the menu to avoid typos.

### Views

| View name | Filter |
|-----------|--------|
| Awaiting Signature | `Stage Status` = "Awaiting Signature" |
| Awaiting Questionnaire | `Stage Status` = "Awaiting Questionnaire" |
| Awaiting Docs | `Stage Status` = "Awaiting Docs" |
| Awaiting Payout | `Stage Status` = "Awaiting Payout Info" |
| Ready for Listing Setup | `Stage Status` = "Listing Setup Ready" OR `Ready for Listing Setup` (checkbox) is checked |
| Ready for Go Live | `Stage Status` = "Ready for Go Live" OR checkbox `Ready for Go Live` |
| Active Clients | `Stage Status` = "Active Client" OR checkbox `Active Client` |

---

## 5. Documents

**Primary field:** `Document Display Name` (Formula)

### Fields

| # | Field name | Type |
|---|------------|------|
| 1 | Document Display Name | Formula | see below |
| 2 | Document ID | Formula | `"DOC-" & RIGHT("0000" & {Auto #}, 4)` |
| 3 | Auto # | Autonumber |
| 4 | Owner | Link → Owners |
| 5 | Property | Link → Properties |
| 6 | Onboarding | Link → Onboarding |
| 7 | Document Type | Single select | options below |
| 8 | Document Status | Single select | options below |
| 9 | Sent Date | Date |
| 10 | Received / Signed Date | Date |
| 11 | Google Drive File URL | URL |
| 12 | Source System | Single select | options below |
| 13 | Notes | Long text |
| 14 | Created At | Created time |

### Document Display Name (formula)

```
{Document ID} & " · " & {Document Type}
```

### Single select — Document Type

Management Agreement · Property Access Authorization · Photography / Marketing Consent · Inventory Acknowledgment · Owner ID · Proof of Ownership · SAT / Tax Document · HOA / Building Rules · Inventory Checklist · Property Photos · Other

### Single select — Document Status

Not Sent · Sent · Signed / Received · Needs Revision · Rejected

### Single select — Source System

Jotform Sign · Manual Upload · Email · Google Drive · Other

### Views

| View name | Filter |
|-----------|--------|
| Missing Critical Docs | `Document Status` is any of Not Sent, Sent AND `Document Type` is one of Management Agreement, Proof of Ownership, Owner ID (customize list) |
| Agreements | `Document Type` = "Management Agreement" |
| Signed Docs | `Document Status` = "Signed / Received" |
| Needs Revision | `Document Status` = "Needs Revision" |

---

## 6. Vendors

**Primary field:** `Vendor Display Name` (Formula)

### Fields

| # | Field name | Type |
|---|------------|------|
| 1 | Vendor Display Name | Formula | see below |
| 2 | Vendor ID | Formula | `"VEN-" & RIGHT("0000" & {Auto #}, 4)` |
| 3 | Auto # | Autonumber |
| 4 | Vendor Name | Single line text |
| 5 | Vendor Type | Single select | options below |
| 6 | Contact Name | Single line text |
| 7 | Phone | Phone |
| 8 | WhatsApp | Phone |
| 9 | Email | Email |
| 10 | Service Areas | Multiple select | *use same city list as Properties or: Playa del Carmen, Puerto Morelos, Tulum, Cancun, Cozumel, Riviera Maya Other* |
| 11 | Preferred Vendor | Checkbox |
| 12 | Active | Checkbox |
| 13 | Notes | Long text |
| 14 | Created At | Created time |

### Vendor Display Name (formula)

```
IF({Vendor Name}, {Vendor Name} & " · " & {Vendor ID}, {Vendor ID})
```

### Single select — Vendor Type

Cleaner · Maintenance General · Electrician · Plumber · HVAC / AC · Locksmith · Photographer · Runner / Errands · Other

### Views

| View name | Filter |
|-----------|--------|
| Active Vendors | `Active` is checked |
| Preferred Vendors | `Preferred Vendor` is checked |
| Cleaners | `Vendor Type` = "Cleaner" |
| Photographers | `Vendor Type` = "Photographer" |
| Maintenance | `Vendor Type` is one of Maintenance General, Electrician, Plumber, HVAC / AC, Locksmith |

---

## Relationships summary

| From | Field | To | Multiplicity |
|------|-------|-----|--------------|
| Leads Intake | Owner Link | Owners | Many-to-one (single link) |
| Leads Intake | Property Link | Properties | Single |
| Owners | Properties | Properties | One owner → many properties (allow multiple on Owners side) |
| Properties | Owner | Owners | Many-to-one |
| Properties | Onboarding Record | Onboarding | One-to-one preferred (single link) |
| Onboarding | Owner, Property | Owners, Properties | Single each |
| Documents | Owner, Property, Onboarding | respective tables | Single each |

**Inverse links:** When you add `Properties` on Owners, Airtable creates inverse on Properties — align **Owner** on Properties with that relationship (same linked table).

---

## Operational rules (enforced by process, not Airtable alone)

- Do not store full bank account numbers; payout tracking is checkbox + date + Drive link only.  
- Leads Intake = staging; promote to Owners/Properties/Onboarding only after qualification.  
- Signed PDFs live in **Google Drive**; Airtable stores **status + URL** only.

---

## Deliverable in this repo

This file is the build script. Create the base in Airtable manually or via Airtable’s API using these definitions.

No simplification: all tables, fields, options, and views are specified above.
