const Validator = require('./utils/Validator');
const {
  confirmEmailUniqueness, getUserByIdentifier, createUser, sendUser
} = require('./helpers/user');
const { comparePassword, encryptPassword } = require('./utils/AuthenticationHelpers');
const { resolveError, sendMessage, stringifyValidationErrors } = require('./utils/GenericHelpers');

/**
 * Sign user in
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

      comparePassword(password, user);
      sendUser(user, 200, res);
    } catch (e) {
      resolveError(e, res);
    }
  } else {
    sendMessage(stringifyValidationErrors(validator.errors), 400, res);
  }
};

/**
 * Create new user account
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

      sendUser(user, 201, res);
    } catch (e) {
      resolveError(e, res);
    }
  } else {
    sendMessage(stringifyValidationErrors(validator.errors), 400, res);
  }
};

module.exports = {
  signIn,
  signUp
};
