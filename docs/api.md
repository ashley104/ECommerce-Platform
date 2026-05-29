# API Reference

This document covers the routes exposed by the admin and web Next.js apps in this workspace. The APIs are split by app because each app runs on its own port and owns a different set of routes.

## Base URLs

- Web app: `http://localhost:3001`
- Admin app: `http://localhost:3002`

## Authentication

Both apps use NextAuth with GitHub as the sign-in provider.

- Sign in and sign out are handled through `/api/auth/[...nextauth]`.
- Session state is JWT-based and stored in cookies by NextAuth.
- Protected server routes check the active session with `getServerSession`.

## Web API

### `GET` and `POST` `/api/auth/[...nextauth]`

Handles the NextAuth OAuth flow, session lookups, and callback exchange for the web app.

Authentication: not required to reach the route itself. The route is used by the auth system.

Parameters: none that are defined directly by this project. NextAuth handles its own callback/query parameters.

Example response:

```json
{
  "user": {
    "name": "Ada Lovelace",
    "email": "ada@example.com"
  }
}
```

### `POST` `/api/checkout`

Creates a Stripe Checkout session for the provided cart items.

Authentication: not required by the handler.

Request body:

```json
{
  "items": [
    {
      "name": "Example Product",
      "imageUrl": "https://example.com/product.png",
      "price": 19.99,
      "quantity": 2
    }
  ]
}
```

Required parameters:

- `items` must be an array.
- Each item should include `name`, `imageUrl`, `price`, and `quantity`.

Example response:

```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_123"
}
```

Limitations:

- The route depends on a valid Stripe configuration.
- The code does not currently validate the body shape before mapping items.

### `POST` `/api/orders`

Creates an order for the signed-in customer and marks it as paid.

Authentication: required. The handler calls `getServerSession` and returns `401` if no signed-in user exists.

Request body:

```json
{
  "items": [
    {
      "productId": 12,
      "quantity": 1
    }
  ]
}
```

Required parameters:

- `items` should contain one or more objects with `productId` and `quantity`.

Example response:

```json
{
  "order": {
    "id": "ord_123",
    "status": "PAID",
    "total": 19.99
  }
}
```

## Admin API

### `GET` and `POST` `/api/auth/[...nextauth]`

Handles the NextAuth OAuth flow, session lookups, and callback exchange for the admin app.

Authentication: not required to reach the route itself. The route is used by the auth system.

Required parameters: none that are defined directly by this project.

Example response:

```json
{
  "user": {
    "name": "Ada Lovelace",
    "email": "ada@example.com"
  }
}
```

### `POST` `/api/products`

Creates a new product or updates an existing one when `id` is supplied.

Authentication: not enforced by the route handler. The admin UI is expected to gate access.

Request body:

```json
{
  "name": "Running Shoe",
  "category": "Footwear",
  "description": "Comfortable all-day shoe",
  "imageUrl": "https://example.com/shoe.png",
  "price": 79.99,
  "stock": 20,
  "active": true
}
```

Required parameters:

- `name`
- `category`
- `description`
- `imageUrl`
- `price`
- `stock`

Optional parameters:

- `id` to update an existing product instead of creating a new one.
- `active` when updating an existing product.

Example response:

```json
{
  "success": true,
  "message": "Product saved successfully"
}
```

Validation rules:

- `name`, `category`, `description`, and `imageUrl` are required.
- `imageUrl` must be a valid `http` or `https` URL.
- `price` must be a finite non-negative number.
- `stock` must be a whole number greater than or equal to zero.

### `DELETE` `/api/products/[id]`

Deletes a product by numeric id.

Authentication: not enforced by the route handler.

Required parameters:

- `id` in the path, for example `/api/products/42`.

Example response:

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### `GET` `/api/purchase`

Returns the order list used by the admin dashboard.

Authentication: not enforced by the route handler.

Required parameters: none.

Example response:

```json
[
  {
    "id": "ord_123",
    "userEmail": "ada@example.com",
    "status": "PAID",
    "total": 79.99,
    "items": []
  }
]
```