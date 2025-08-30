import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Permission name is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [100, 'Permission name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Permission description is required'],
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  resource: {
    type: String,
    required: [true, 'Resource is required'],
    uppercase: true,
    trim: true,
    maxlength: [50, 'Resource cannot be more than 50 characters']
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    uppercase: true,
    trim: true,
    enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    maxlength: [20, 'Action cannot be more than 20 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
permissionSchema.index({ name: 1 });
permissionSchema.index({ resource: 1 });
permissionSchema.index({ action: 1 });
permissionSchema.index({ resource: 1, action: 1 });

// Virtual for roles that have this permission
permissionSchema.virtual('roles', {
  ref: 'Role',
  localField: '_id',
  foreignField: 'permissions'
});

// Static method to find by resource and action
permissionSchema.statics.findByResourceAction = function(resource, action) {
  return this.findOne({ 
    resource: resource.toUpperCase(), 
    action: action.toUpperCase() 
  });
};

// Static method to find all permissions for a resource
permissionSchema.statics.findByResource = function(resource) {
  return this.find({ resource: resource.toUpperCase() });
};

const Permission = mongoose.model('Permission', permissionSchema);

export default Permission;