const lodash = require('lodash');
const { userErrors } = require('./Errors');

/**
 * Send a message response for the server
 * @function sendMessage
 *
 * @param {string} message - Response message
 * @param {number} status - Server response code
 * @param {object} res - Server response object
 *
 * @return {void}
 */
const sendMessage = (message, status, res) => {
  res.status(status).send({
    message
  });
};

/**
 * Resolve errors generated on endpoints
 * @function resolveError
 *
 * @param {object} error - Error object
 * @param {any} res - Server response object
 *
 * @return {void}
 */
const resolveError = (error, res) => {
  let message;
  let status;

  switch (parseInt(error.message, 10)) {
    case userErrors.USER_DUPLICATE_EMAIL:
      message = 'user with this email already exists';
      status = 409;
      break;
    case userErrors.USER_DUPLICATE_USERNAME:
      status = 409;
      message = 'user with this username already exists';
      break;
    case userErrors.USER_INVALID_PASSWORD:
      status = 401;
      message = 'incorrect password';
      break;
    case userErrors.USER_NOT_FOUND:
      status = 404;
      message = 'user not found';
      break;
    default:
      status = 500;
      message = 'oops, our server just went rogue. please try again';
      break;
  }
  sendMessage(message, status, res);
};

/**
 * Create a string representation of a validation error object.
 * @function stringifyValidationErrors
 *
 * @param {object} errorsObject - validation error object
 *
 * @return {string} - A string containing validation errors
 */
const stringifyValidationErrors = (errorsObject) => (
  lodash.reduce(
    errorsObject,
    (error, cummulator) => `${cummulator}\n${error}`,
    ''
  )
);

/**
 * Throws a new Error with the passed error message
 * @function throwError
 *
 * @param {any} errorMessage - Error message
 *
 * @return {void}
 *
 * @throws {Error} - Error object with error message
 */
const throwError = (errorMessage) => {
  throw new Error(errorMessage);
};

/**
 * Generate a random date that is between 18 - 40 years ago
 * @function getRandomDOB
 *
 * @return {Date} - Random Date
 */
const getRandomDOB = () => new Date('01/28/1991');

module.exports = {
  resolveError,
  sendMessage,
  stringifyValidationErrors,
  throwError,
  getRandomDOB
};