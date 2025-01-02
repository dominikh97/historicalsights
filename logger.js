// logger.js
const winston = require('winston');

// Create a custom logger
const logger = winston.createLogger({
  level: 'info', // Log level - could be 'info', 'warn', 'error', etc.
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'logs/app.log' })
  ],
});

// Custom logging methods
const logInfo = (message) => logger.info(message);
const logError = (message) => logger.error(message);
const logWarn = (message) => logger.warn(message);

module.exports = {
  logInfo,
  logError,
  logWarn
};
