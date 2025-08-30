import Joi from 'joi';

export const validateRegister = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    password: Joi.string().min(6).required(),
    roleId: Joi.string().required()
  });

  return schema.validate(data);
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
    password: Joi.string().min(6).required()
  }).or('email', 'phone');

  return schema.validate(data);
};

export const validateCreateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    password: Joi.string().min(6).required(),
    roleId: Joi.string().required(),
    image: Joi.string().uri().optional()
  });

  return schema.validate(data);
};

export const validateUpdateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
    password: Joi.string().min(6).optional(),
    roleId: Joi.string().optional(),
    image: Joi.string().uri().optional()
  });

  return schema.validate(data);
};

export const validateCreateRole = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().min(5).max(200).required()
  });

  return schema.validate(data);
};

export const validateUpdateRole = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    description: Joi.string().min(5).max(200).optional()
  });

  return schema.validate(data);
};

export const validateSetPermissions = (data) => {
  const schema = Joi.object({
    permissionIds: Joi.array().items(Joi.string()).min(1).required()
  });

  return schema.validate(data);
};