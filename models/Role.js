import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [50, 'Role name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Role description is required'],
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  // Soft delete fields
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
roleSchema.index({ name: 1 });
roleSchema.index({ isDeleted: 1 });

// Virtual for users with this role
roleSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'role'
});

// Instance method to soft delete
roleSchema.methods.softDelete = function(deletedBy = null) {
  // Prevent deletion of admin roles
  if (this.name === 'SUPER_ADMIN' || this.name === 'ADMIN') {
    throw new Error('Cannot delete admin roles');
  }
  
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  return this.save();
};

// Static method to find active roles
roleSchema.statics.findActive = function(filter = {}) {
  return this.find({ ...filter, isDeleted: false });
};

// Pre-hook to exclude deleted roles by default
roleSchema.pre(/^find/, function(next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

// Pre-hook to prevent deletion of admin roles
roleSchema.pre('deleteOne', function(next) {
  if (this.getQuery().name === 'SUPER_ADMIN' || this.getQuery().name === 'ADMIN') {
    return next(new Error('Cannot delete admin roles'));
  }
  next();
});

// Pre-hook to prevent updates to admin role permissions
roleSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  const query = this.getQuery();
  
  if ((query.name === 'SUPER_ADMIN' || query.name === 'ADMIN') && update.permissions) {
    return next(new Error('Cannot modify admin role permissions'));
  }
  next();
});

roleSchema.pre('updateOne', function(next) {
  const update = this.getUpdate();
  const query = this.getQuery();
  
  if ((query.name === 'SUPER_ADMIN' || query.name === 'ADMIN') && update.permissions) {
    return next(new Error('Cannot modify admin role permissions'));
  }
  next();
});

const Role = mongoose.model('Role', roleSchema);

export default Role;