import logger from "../lib/logger";

function error(err, req, res, next) {
  logIfAppError(err);

  if (res.headersSent || !err.httpCode) {
    return next(err);
  }

  res.status(err.httpCode).send(err);
}

function logIfAppError(err) {
  if (!err.httpCode || err.httpCode >= 500) {
    logger.warn(err);
  }
}

export { error };
