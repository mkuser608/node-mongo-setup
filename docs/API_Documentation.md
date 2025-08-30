# Node MongoDB Backend API Documentation

## Overview
This API provides a complete backend system with user authentication, role-based authorization, and permission management. It includes Socket.io support for real-time communication.

**Base URL:** `http://localhost:5001/api`

## Authentication
Most endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## Common Response Format
All API responses follow this structure:
```json
{
  "success": boolean,
  "message": string,
  "data": object | array (optional)
}
```

## Error Responses
Error responses include:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "roleId": "role_id_here"
}
```

**Validation Rules:**
- `name`: 2-50 characters, required
- `email`: Valid email format, required
- `phone`: 10 digits, required
- `password`: Minimum 6 characters, required
- `roleId`: Valid role ID, required (cannot be SUPER_ADMIN)

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "USER"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

### 2. Login
**POST** `/auth/login`

Authenticate user and get access tokens.

**Request Body:**
```json
{
  "email": "john@example.com", // OR phone
  "phone": "1234567890", // OR email
  "password": "password123"
}
```

**Validation Rules:**
- Either `email` or `phone` is required
- `email`: Valid email format (if provided)
- `phone`: 10 digits (if provided)
- `password`: Minimum 6 characters, required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": {
        "name": "USER",
        "description": "Regular user role"
      }
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

### 3. Refresh Token
**POST** `/auth/refresh-token`

Get new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  }
}
```

### 4. Logout
**POST** `/auth/logout`

Logout user (invalidate refresh token).

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## User Management Endpoints
*All user endpoints require authentication*

### 1. Create User
**POST** `/users`

Create a new user (admin function).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "0987654321",
  "password": "password123",
  "roleId": "role_id_here",
  "image": "https://example.com/image.jpg" // optional
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "user_id",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "0987654321",
    "image": "https://example.com/image.jpg",
    "role": {
      "name": "USER",
      "description": "Regular user role"
    },
    "isActive": true,
    "emailVerified": false,
    "phoneVerified": false,
    "createdAt": "2023-08-30T10:00:00.000Z"
  }
}
```

### 2. Get All Users
**GET** `/users`

Retrieve all users with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term for name, email, or phone

**Example:** `/users?page=1&limit=10&search=john`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "image": null,
        "role": {
          "name": "USER",
          "description": "Regular user role"
        },
        "isActive": true,
        "emailVerified": true,
        "phoneVerified": false,
        "lastLogin": "2023-08-30T09:30:00.000Z",
        "createdAt": "2023-08-29T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 3. Search Users
**GET** `/users/search`

Search users by name, email, or phone.

**Query Parameters:**
- `q`: Search query (required)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Example:** `/users/search?q=john&page=1&limit=5`

### 4. Get User by ID
**GET** `/users/:id`

Get specific user details.

**Success Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "image": null,
    "role": {
      "name": "USER",
      "description": "Regular user role",
      "permissions": ["permission1", "permission2"]
    },
    "isActive": true,
    "emailVerified": true,
    "phoneVerified": false,
    "lastLogin": "2023-08-30T09:30:00.000Z",
    "createdAt": "2023-08-29T10:00:00.000Z",
    "updatedAt": "2023-08-30T08:00:00.000Z"
  }
}
```

### 5. Update User
**PUT** `/users/:id`

Update user information.

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "phone": "1111111111",
  "password": "newpassword123", // optional
  "roleId": "new_role_id", // optional
  "image": "https://example.com/new-image.jpg" // optional
}
```

### 6. Delete User
**DELETE** `/users/:id`

Soft delete a user.

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Role Management Endpoints
*All role endpoints require authentication*

### 1. Create Role
**POST** `/roles`

Create a new role.

**Request Body:**
```json
{
  "name": "MANAGER",
  "description": "Manager role with elevated permissions"
}
```

**Validation Rules:**
- `name`: 2-50 characters, required, will be converted to uppercase
- `description`: 5-200 characters, required

**Success Response (201):**
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "id": "role_id",
    "name": "MANAGER",
    "description": "Manager role with elevated permissions",
    "permissions": [],
    "createdAt": "2023-08-30T10:00:00.000Z"
  }
}
```

### 2. Get All Roles
**GET** `/roles`

Retrieve all active roles.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Roles retrieved successfully",
  "data": [
    {
      "id": "role_id",
      "name": "USER",
      "description": "Regular user role",
      "permissions": ["read_profile", "update_profile"],
      "createdAt": "2023-08-29T10:00:00.000Z"
    }
  ]
}
```

### 3. Search Roles
**GET** `/roles/search`

Search roles by name or description.

**Query Parameters:**
- `q`: Search query (required)

### 4. Get Role by ID
**GET** `/roles/:id`

Get specific role details with permissions.

### 5. Update Role
**PUT** `/roles/:id`

Update role information. Note: SUPER_ADMIN and ADMIN roles cannot be modified.

**Request Body:**
```json
{
  "name": "UPDATED_MANAGER",
  "description": "Updated manager role description"
}
```

### 6. Delete Role
**DELETE** `/roles/:id`

Soft delete a role. Note: SUPER_ADMIN and ADMIN roles cannot be deleted.

### 7. Set Role Permissions
**POST** `/roles/:id/permissions`

Assign permissions to a role. Note: SUPER_ADMIN and ADMIN role permissions cannot be modified.

**Request Body:**
```json
{
  "permissionIds": ["permission_id_1", "permission_id_2", "permission_id_3"]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Permissions updated successfully",
  "data": {
    "id": "role_id",
    "name": "MANAGER",
    "description": "Manager role",
    "permissions": [
      {
        "id": "permission_id_1",
        "name": "users:read",
        "description": "Read users"
      }
    ]
  }
}
```

---

## Permission Management Endpoints
*All permission endpoints require authentication*

### 1. Get All Permissions
**GET** `/permissions`

Retrieve all available permissions in the system.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "data": [
    {
      "id": "permission_id",
      "name": "users:read",
      "description": "Read user information",
      "resource": "users",
      "action": "read",
      "createdAt": "2023-08-29T10:00:00.000Z"
    }
  ]
}
```

### 2. Get My Permissions
**GET** `/permissions/my-permissions`

Get permissions for the currently authenticated user.

**Success Response (200):**
```json
{
  "success": true,
  "message": "User permissions retrieved successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "role": "MANAGER"
    },
    "permissions": [
      {
        "id": "permission_id",
        "name": "users:read",
        "description": "Read user information",
        "resource": "users",
        "action": "read"
      }
    ]
  }
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

## Common Error Messages

| Error | Description |
|-------|-------------|
| "Access token required" | No authorization header provided |
| "Invalid token" | Malformed JWT token |
| "Token expired" | JWT token has expired |
| "User not found" | User doesn't exist or is inactive |
| "Invalid credentials" | Wrong email/phone or password |
| "Cannot register with super admin role" | Attempting to register as SUPER_ADMIN |
| "Cannot delete admin roles" | Attempting to delete SUPER_ADMIN or ADMIN roles |
| "Cannot modify admin role permissions" | Attempting to change admin permissions |

## Socket.io Events

The server supports real-time communication via Socket.io on the same port.

**Connection URL:** `http://localhost:5001`

**Events:**
- `connect`: Client connected
- `disconnect`: Client disconnected
- Custom events can be added as needed

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Role-Based Access Control**: Hierarchical permission system
3. **Password Hashing**: bcrypt with salt rounds
4. **Input Validation**: Joi schema validation
5. **Rate Limiting**: Express rate limiting middleware
6. **CORS Protection**: Configurable CORS settings
7. **Helmet Security**: Security headers
8. **Admin Protection**: SUPER_ADMIN and ADMIN roles are protected from modification

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5001 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | mongodb://127.0.0.1:27017/node-mongo-setup |
| JWT_SECRET | JWT signing secret | (required) |
| JWT_EXPIRES_IN | JWT expiration time | 7d |
| SOCKET_CORS_ORIGIN | Socket.io CORS origin | http://localhost:3000 |