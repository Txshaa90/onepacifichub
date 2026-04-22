# Shopify Metafield Schema - OnePacificHub

## Overview
This document defines the standardized metafield structure for all automotive/fitment products in the headless Shopify store.

---

## Core Product Info Metafields

| Field Key | Label | Type | Description | Example |
|-----------|-------|------|-------------|---------|
| `custom.sku` | SKU | text | Stock keeping unit | `HC-001` |
| `custom.brand` | Brand | text | Product brand | `Fuel Rider` |
| `custom.category` | Category | text | Product category | `Hubcaps` |

---

## Fitment Metafields (Structured Vehicle Data)

| Field Key | Label | Type | Description | Example |
|-----------|-------|------|-------------|---------|
| `custom.year` | Year | text | Vehicle year | `2015-2020` or `2015` |
| `custom.make` | Make | text | Vehicle make | `Toyota` |
| `custom.model` | Model | text | Vehicle model | `Camry` |
| `custom.submodel` | Submodel | text | Vehicle submodel (optional) | `SE`, `XLE` |
| `custom.body_type` | Body Type | text | Vehicle body style | `Sedan`, `SUV` |
| `custom.doors` | Doors | text | Number of doors | `4`, `2` |
| `custom.position` | Position | text | Wheel position | `Front`, `Rear`, `All` |

---

## Notes & Details Metafields

| Field Key | Label | Type | Description | Example |
|-----------|-------|------|-------------|---------|
| `custom.fitment_notes` | Fitment Notes | text | Important fitment info | `Requires 16" factory alloy wheels` |
| `custom.notes` | Additional Notes | text | Extra product notes | `Chrome finish may show minor scratches` |

---

## Advanced: JSON Vehicle Array (Optional)

For products that fit multiple vehicles, use a JSON metafield:

**Field Key:** `custom.vehicles`
**Type:** json

**Example JSON Structure:**
```json
[
  {
    "year": "2015",
    "make": "Toyota",
    "model": "Camry",
    "submodel": "SE",
    "body_type": "Sedan",
    "doors": "4",
    "position": "All"
  },
  {
    "year": "2016",
    "make": "Toyota",
    "model": "Camry",
    "submodel": "XLE",
    "body_type": "Sedan",
    "doors": "4",
    "position": "All"
  }
]
```

---

## How to Set Up Metafields in Shopify

### Step 1: Define Metafields
1. Go to **Shopify Admin** → **Settings** → **Custom Data**
2. Select **Products**
3. Click **Add definition**
4. Fill in the details from the tables above

### Step 2: Connect to Theme (for non-headless)
- Use dynamic sources in the theme editor to connect metafields to your templates

### Step 3: Access in Headless (React)
```javascript
// Example: Accessing metafields in your React component
const sku = product.metafields.custom?.sku
const year = product.metafields.custom?.year
const make = product.metafields.custom?.make
```

---

## Excel/CSV Import Template

When importing products via CSV, your column headers should match the metafield keys:

```
sku,brand,category,year,make,model,submodel,body_type,doors,position,fitment_notes,notes
HC-001,Fuel Rider,Hubcaps,2015-2020,Toyota,Camry,SE,Sedan,4,All,Requires 16" factory alloy wheels,
```

---

## Component Mapping (React)

| Metafield | React Component | Display |
|-----------|-----------------|---------|
| `custom.sku` | ProductSpecs | SKU row |
| `custom.brand` | ProductSpecs | Brand row |
| `custom.category` | ProductSpecs | Category row |
| `custom.year` | FitmentTable | Year column |
| `custom.make` | FitmentTable | Make column |
| `custom.model` | FitmentTable | Model column |
| `custom.submodel` | FitmentTable | Submodel column |
| `custom.body_type` | FitmentTable | Body column |
| `custom.doors` | FitmentTable | Doors column |
| `custom.position` | FitmentTable | Position column |
| `custom.fitment_notes` | FitmentTable | Fitment notes box |
| `custom.notes` | ProductNotes | Additional notes box |

---

## Product Data Flow

```
Excel/CSV → Shopify Import → Metafields → React Components → Clean UI
                                      ↓
                              ProductSpecs.jsx
                              FitmentTable.jsx
                              ProductNotes.jsx
```

---

## Important Notes

1. **Do NOT use description for structured data** - Keep descriptions for marketing copy only
2. **Always use exact column names** - Match the metafield keys exactly
3. **For multi-vehicle fitment** - Use the JSON `vehicles` metafield OR create multiple entries
4. **Null handling** - Components gracefully handle missing metafields with fallback extraction

---

## Future Enhancements

- Add `custom.warranty` metafield
- Add `custom.shipping_weight` metafield
- Add `custom.compatible_wheels` for cross-reference data
