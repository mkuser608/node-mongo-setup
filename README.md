# Node MongoDB Setup

A Node.js Express backend with MongoDB and Socket.io setup featuring User, Role, and Permission management.

## Features

- **Express.js** server with RESTful API
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time communication
- **JWT Authentication** with access and refresh tokens
- **Role-based Access Control (RBAC)**
- **User Management** with soft delete
- **Role and Permission Management**
- **Input Validation** with Joi
- **Error Handling** middleware
- **Database Seeding** for initial data

## Project Structure

```
node-mongo-setup/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── AuthController.js    # Authentication logic
│   ├── UserController.js    # User management
│   ├── RoleController.js    # Role management
│   └── PermissionController.js # Permission management
├── middleware/
│   ├── authMiddleware.js    # JWT authentication
│   └── errorHandler.js      # Global error handler
├── models/
│   ├── User.js             # User schema
│   ├── Role.js             # Role schema
│   └── Permission.js       # Permission schema
├── routes/
│   ├── index.js            # Main routes
│   ├── authRoutes.js       # Authentication routes
│   ├── userRoutes.js       # User routes
│   ├── roleRoutes.js       # Role routes
│   └── permissionRoutes.js # Permission routes
├── scripts/
│   └── seed.js             # Database seeding
├── services/
│   ├── AuthService.js      # Auth business logic
│   ├── UserService.js      # User business logic
│   ├── RoleService.js      # Role business logic
│   └── PermissionService.js # Permission business logic
├── utils/
│   ├── HttpError.js        # Custom error class
│   ├── httpResponse.js     # Response helpers
│   └── validation.js       # Joi validation schemas
├── .env                    # Environment variables
├── package.json
└── server.js              # Main server file
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Update the `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/node-mongo-setup
DB_NAME=node-mongo-setup

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d

# Socket.io Configuration
SOCKET_CORS_ORIGIN=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows with MongoDB installed
mongod

# Or if using MongoDB service
net start MongoDB
```

### 4. Seed Database

Run the seed script to create initial permissions, roles, and admin user:

```bash
npm run seed
```

This will create:
- **Permissions**: Various CRUD permissions for users, roles, etc.
- **Roles**: SUPER_ADMIN, ADMIN, USER
- **Admin User**: 
  - Email: `admin@example.com`
  - Password: `admin123`

### 5. Start Server

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## API Documentation

### Postman Collection

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/21196414-2ad84fb5-85ad-4383-a171-f911ab47caed?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D21196414-2ad84fb5-85ad-4383-a171-f911ab47caed%26entityType%3Dcollection%26workspaceId%3Db11cf522-d71c-4ccb-ba9a-f6326eaf11a5)

You can also import the Postman collection manually from `docs/Node_MongoDB_API.postman_collection.json`

For detailed API documentation, see [API_Documentation.md](docs/API_Documentation.md)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - User logout

### Users (Protected)
- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/search` - Search users with pagination
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Soft delete user

### Roles (Protected)
- `POST /api/roles` - Create role
- `GET /api/roles` - Get all roles
- `GET /api/roles/search` - Search roles with pagination
- `GET /api/roles/:id` - Get role by ID
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Soft delete role
- `POST /api/roles/:id/permissions` - Set permissions to role

### Permissions (Protected)
- `GET /api/permissions` - Get all permissions
- `GET /api/permissions/my-permissions` - Get current user's permissions

## Socket.io Events

The server supports real-time communication with these events:

- `connection` - User connects
- `disconnect` - User disconnects  
- `join-room` - Join a specific room
- `leave-room` - Leave a room
- `message` - Send/receive messages
- `notification` - Send/receive notifications

## Database Models

### User
- Basic info (name, email, phone, password)
- Role reference
- Verification status
- Soft delete support

### Role  
- Name and description
- Permission references
- Soft delete support

### Permission
- Name, description, resource, action
- Used for RBAC implementation

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with Joi
- CORS configuration
- Rate limiting ready (commented in server.js)
- Helmet for security headers (commented in server.js)

## Development

### Adding New Routes
1. Create controller in `controllers/`
2. Create service in `services/`
3. Create routes in `routes/`
4. Add to main routes in `routes/index.js`

### Adding New Permissions
Update the `scripts/seed.js` file with new permissions and re-run:
```bash
npm run seed
```

## Git Repository

To work with the Git repository:

### First Time Setup
```bash
# Pull the latest changes first
git pull https://github.com/mkuser608/node-mongo-setup.git

# Then push your changes
git add .
git commit -m "Your commit message"
git push https://github.com/mkuser608/node-mongo-setup.git
```

### Repository URL
https://github.com/mkuser608/node-mongo-setup.git

## License

MIT