// not found

const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error Handler

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.log("err : ",statusCode)
  res.status(statusCode);
  res.status(statusCode).json({
    message: err?.message,
    stack: err?.stack,
  });
  next();
};

module.exports = { notFound, errorHandler };
