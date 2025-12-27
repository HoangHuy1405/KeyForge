# KeyForge API Documentation

## Overview

The KeyForge API is documented using **SpringDoc OpenAPI** (Swagger UI).

**Base URL:** `http://localhost:8080/api/v1`

## Accessing the API Docs

After starting the application, visit:

| Resource | URL |
|----------|-----|
| **Swagger UI** | http://localhost:8080/api/v1/swagger-ui.html |
| **OpenAPI JSON** | http://localhost:8080/api/v1/v3/api-docs |

## Authentication

Most endpoints require JWT Bearer authentication:

1. Call `POST /auth/login` with credentials
2. Copy the `accessToken` from response
3. In Swagger UI, click "Authorize" button
4. Enter: `Bearer <your-token>`

---

## Product Creation Flow (Multi-Step)

### Step 1: Create DRAFT
```
POST /api/products
{
  "name": "HMX Amber Switch",
  "description": "Clacky linear",
  "category": "SWITCH",
  "stockStatus": "IN_STOCK",
  "attributes": { "type": "LINEAR", "actuationForce": 50 },
  "imageUrls": []
}
```
→ Returns product in **DRAFT** status

### Step 2: Add Inventory
```
PUT /api/products/{id}/inventory
{
  "price": 12.99,
  "stockQuantity": 500
}
```

### Step 3: Add Logistics
```
PUT /api/products/{id}/logistics
{
  "location": "Ho Chi Minh City",
  "supportFastShipping": true,
  "supportRegularShipping": true
}
```

### Step 4: Activate
```
PUT /api/products/{id}/status?status=ACTIVE
```
→ Product is now **ACTIVE** and visible to buyers

---

## Key Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/products` | Create DRAFT | SELLER |
| `PUT` | `/api/products/{id}/inventory` | Update inventory | SELLER |
| `PUT` | `/api/products/{id}/logistics` | Update logistics | SELLER |
| `PUT` | `/api/products/{id}/status` | Change status | SELLER |
| `GET` | `/api/products/{id}` | Get product | Public |
| `GET` | `/api/products` | List products | Public |
| `DELETE` | `/api/products/{id}` | Delete product | SELLER |

## Notes
- SellerId is extracted from JWT token automatically
- Cannot activate product without setting inventory first
