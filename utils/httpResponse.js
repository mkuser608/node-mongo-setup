export const success = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const error = (res, message, data = null, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};