const Validator = require('./utils/Validator');
const {
  comparePassword,
  encryptPassword,
  generateUserToken
} = require('./utils/Authentication');
const {
  confirmEmailUniqueness,
  getUserByIdentifier,
  createUser
} = require('./helpers/user');
const {
  resolveError,
  sendMessage,
  stringifyValidationErrors,
  sendData
} = require('./utils/Generic');

/**
 * Handles getting user details
 * @function getUserController
 *
 * @param {any} req - Server request object
 * @param {any} res - Server response object
 *
 * @return {void}
 */
const getUserController = async (req, res) => {
  try {
    const { user } = req;

    sendData({ user }, 200, 'success', res);
  } catch (e) {
    resolveError(e, res);
  }
};

/**
 * Handles the sign in operation
 * @function signInController
 *
 * @param {any} req - Server request object
 * @param {any} res - Server response object
 *
 * @return {void}
 */
const signInController = async (req, res) => {
  const validator = Validator.validateSignIn(req.body);

  if (validator.isValid) {
    try {
      const { identifier, password } = req.body;
      const user = await getUserByIdentifier(identifier);

      comparePassword(password, user.hashedPassword);
      const token = await generateUserToken(user);
      const { id, alias, email } = user;

      const data = {
        token,
        user: { id, alias, email }
      };

      sendData(data, 200, 'success', res);
    } catch (e) {
      resolveError(e, res);
    }
  } else {
    sendMessage(stringifyValidationErrors(validator.errors), 400, 'failed', res);
  }
};

/**
 * Handles the sign up operation
 * @function signUpController
 *
 * @param {any} req - Server request object
 * @param {any} res - Server response object
 *
 * @return {void}
 */
const signUpController = async (req, res) => {
  const validator = Validator.validateSignUp(req.body);
  const { email, password } = req.body;

  if (validator.isValid) {
    try {
      await confirmEmailUniqueness(email);
      const hash = encryptPassword(password);
      const user = await createUser(req.body, hash);
      const token = await generateUserToken(user);
      const { id, alias } = user;

      const data = {
        token,
        user: { id, alias, email }
      };

      sendData(data, 201, 'success', res);
    } catch (e) {
      resolveError(e, res);
    }
  } else {
    sendMessage(stringifyValidationErrors(validator.errors), 400, 'failed', res);
  }
};

module.exports = {
  signInController,
  signUpController,
  getUserController
};
