const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { userErrors, authenticationErrors } = require('./Errors');
const { throwError, resolveError } = require('./Generic');
const { getUserByIdentifier } = require('../helpers/user');

/**
 * Compare user supplied password to hashed user password.
 * @function comparePassword
 *
 * @param {string} userPassword - Password supplied by user
 * @param {string} hashedPassword - The hashed password
 *
 * @return {void}
 */
const comparePassword = (userPassword, hashedPassword) => {
  const match = bcrypt.compareSync(userPassword, hashedPassword);

  if (!match) throwError(userErrors.USER_INVALID_PASSWORD);
};

/**
 * Encrypt password before writing it to database.
 * @function encryptPassword
 *
 * @param {string} password - Password to be encrypted
 *
 * @return {string} - Encrypted password or an error
 */
const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);

  return bcrypt.hashSync(password, salt);
};

/**
 * Generate a jwt token for the passed user;
 * @function generateUserToken
 *
 * @param {object} user - User to generate token for
 *
 * @return {Promise<string>} - Resolves to the generated jwt
 */
const generateUserToken = async (user) => {
  const { id, alias, email } = user;

  return jwt.sign({ id, alias, email }, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
};

/**
 * Authenticate the request
 * @function authenticate
 *
 * @param {object} req - Server request object
 * @param {object} res - Server response object
 * @param {function} next
 * =
 * @returns {void}
 */
const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];

    if (!token) throwError(authenticationErrors.AUTH_INVALID_TOKEN);
    let user = jwt.verify(token, process.env.TOKEN_SECRET);

    user = await getUserByIdentifier(user.email);
    req.user = user;
    next();
  } catch (e) {
    resolveError(new Error(authenticationErrors.AUTH_INVALID_TOKEN), res);
  }
};

module.exports = {
  comparePassword,
  encryptPassword,
  authenticate,
  generateUserToken
};
