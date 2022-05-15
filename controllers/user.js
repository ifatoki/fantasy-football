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
 * Get User Controller
 * @function getUserHandler
 *
 * @param {any} req - Server request object
 * @param {any} res - Server response object
 *
 * @return {void}
 */
const getUserHandler = async (req, res) => {
  try {
    const { user } = req;

    sendData({ user }, 200, 'success', res);
  } catch (e) {
    resolveError(e, res);
  }
};

/**
 * Sign In Controller
 * @function signIn
 *
 * @param {any} req - Server request object
 * @param {any} res - Server response object
 *
 * @return {void}
 */
const signIn = async (req, res) => {
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
 * Sign Up Controller
 * @function signUp
 *
 * @param {any} req - Server request object
 * @param {any} res - Server response object
 *
 * @return {void}
 */
const signUp = async (req, res) => {
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
  signIn,
  signUp,
  getUserHandler
};
