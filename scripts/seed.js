import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Permission from '../models/Permission.js';
import Role from '../models/Role.js';
import User from '../models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const seedPermissions = async () => {
  const permissions = [
    // User permissions
    { name: 'CREATE_USER', description: 'Create new users', resource: 'USER', action: 'CREATE' },
    { name: 'READ_USER', description: 'View user details', resource: 'USER', action: 'READ' },
    { name: 'UPDATE_USER', description: 'Update user information', resource: 'USER', action: 'UPDATE' },
    { name: 'DELETE_USER', description: 'Delete users', resource: 'USER', action: 'DELETE' },
    { name: 'MANAGE_USER', description: 'Full user management', resource: 'USER', action: 'MANAGE' },
    
    // Role permissions
    { name: 'CREATE_ROLE', description: 'Create new roles', resource: 'ROLE', action: 'CREATE' },
    { name: 'READ_ROLE', description: 'View role details', resource: 'ROLE', action: 'READ' },
    { name: 'UPDATE_ROLE', description: 'Update role information', resource: 'ROLE', action: 'UPDATE' },
    { name: 'DELETE_ROLE', description: 'Delete roles', resource: 'ROLE', action: 'DELETE' },
    { name: 'MANAGE_ROLE', description: 'Full role management', resource: 'ROLE', action: 'MANAGE' },
    
    // Permission permissions
    { name: 'READ_PERMISSION', description: 'View permissions', resource: 'PERMISSION', action: 'READ' },
    { name: 'MANAGE_PERMISSION', description: 'Manage permissions', resource: 'PERMISSION', action: 'MANAGE' },
    
    // Dashboard permissions
    { name: 'READ_DASHBOARD', description: 'View dashboard', resource: 'DASHBOARD', action: 'READ' },
    { name: 'MANAGE_DASHBOARD', description: 'Manage dashboard', resource: 'DASHBOARD', action: 'MANAGE' },
  ];

  for (const permission of permissions) {
    await Permission.findOneAndUpdate(
      { name: permission.name },
      permission,
      { upsert: true, new: true }
    );
  }

  console.log('✅ Permissions seeded successfully');
  return await Permission.find();
};

const seedRoles = async (permissions) => {
  // Get permission IDs
  const allPermissions = await Permission.find();
  const userPermissions = allPermissions.filter(p => p.resource === 'USER');
  const rolePermissions = allPermissions.filter(p => p.resource === 'ROLE');
  const permissionPermissions = allPermissions.filter(p => p.resource === 'PERMISSION');
  const dashboardPermissions = allPermissions.filter(p => p.resource === 'DASHBOARD');

  const roles = [
    {
      name: 'SUPER_ADMIN',
      description: 'Super Administrator with full access',
      permissions: allPermissions.map(p => p._id)
    },
    {
      name: 'ADMIN',
      description: 'Administrator with most permissions',
      permissions: [
        ...userPermissions.filter(p => !p.name.includes('DELETE')).map(p => p._id),
        ...rolePermissions.filter(p => p.action === 'READ').map(p => p._id),
        ...permissionPermissions.filter(p => p.action === 'READ').map(p => p._id),
        ...dashboardPermissions.map(p => p._id)
      ]
    },
    {
      name: 'USER',
      description: 'Regular user with basic permissions',
      permissions: [
        ...permissionPermissions.filter(p => p.action === 'READ').map(p => p._id),
        ...dashboardPermissions.filter(p => p.action === 'READ').map(p => p._id)
      ]
    }
  ];

  for (const role of roles) {
    await Role.findOneAndUpdate(
      { name: role.name },
      role,
      { upsert: true, new: true }
    );
  }

  console.log('✅ Roles seeded successfully');
  return await Role.find();
};

const seedAdminUser = async (roles) => {
  const superAdminRole = roles.find(r => r.name === 'SUPER_ADMIN');
  
  const adminUser = {
    name: 'Super Admin',
    email: 'admin@example.com',
    phone: '9999999999',
    password: await bcrypt.hash('admin123', 12),
    role: superAdminRole._id,
    emailVerified: true,
    phoneVerified: true,
    isActive: true
  };

  await User.findOneAndUpdate(
    { email: adminUser.email },
    adminUser,
    { upsert: true, new: true }
  );

  console.log('✅ Admin user seeded successfully');
  console.log('📧 Admin Email: admin@example.com');
  console.log('🔐 Admin Password: admin123');
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🌱 Starting database seeding...');

    // Clear existing data (optional)
    // await Permission.deleteMany({});
    // await Role.deleteMany({});
    // await User.deleteMany({});

    const permissions = await seedPermissions();
    const roles = await seedRoles(permissions);
    await seedAdminUser(roles);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📦 Database connection closed');
  }
};

seedDatabase();