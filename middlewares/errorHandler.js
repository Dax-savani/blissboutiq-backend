// not found

const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  console.error(err.message, { stack: err.stack });

  res.json({
      status: 'error',
      statusCode,
      message: err?.message,
      stack: err?.stack
  });
};

// const errorHandler = (err, req, res, next) => {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   res.status(statusCode);
//   res.status(statusCode).json({
//     message: err?.message,
//     stack: err?.stack,
//   });
//   next();
// };

module.exports = { notFound, errorHandler };
