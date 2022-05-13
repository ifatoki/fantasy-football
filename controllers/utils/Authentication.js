const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const { userErrors } = require('./Errors');
const { throwError } = require('./Generic');

/**
 * Compare user supplied password to hashed user password.
 * @function comparePassword
 *
 * @param {string} userPassword - Password supplied by user
 * @param {User} user - The user object
 *
 * @return {User} - The user
 */
const comparePassword = (userPassword, user) => {
  const match = bcrypt.compareSync(userPassword, user.hashedPassword);

  if (!match) throwError(userErrors.USER_INVALID_PASSWORD);
  return user;
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
 * Simulate inserting user in req after authentication
 * @function injectMockuser
 *
 * @param {object} req - Server request object
 * @param {object} res - Server response object
 * @param {function} next
 * =
 * @returns {void}
 */
const injectMockUser = (req, res, next) => {
  req.user = {
    id: 1,
    username: faker.internet.userName()
  };
  next();
};

module.exports = {
  comparePassword, encryptPassword, injectMockUser
};
