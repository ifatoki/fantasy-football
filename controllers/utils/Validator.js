const validator = require('validator');
const isEmpty = require('lodash/isEmpty');

/**
 * Create an object to hold all errors and isValid property.
 * @function resolveErrors
 *
 * @param {object} errors - All validation errors
 *
 * @return {object} - An object containing errors and isValid property
 */
const resolveErrors = (errors) => ({
  errors,
  isValid: isEmpty(errors),
});

/**
 * A class to help validate all requests and posts made to the server.
 * @export Validator
 *
 * @class Validator
 */
class Validator {
  /**
   * Validate data for creating new message and adding it to a group
   * @function validateAddNewMessageToGroup
   *
   * @static
   *
   * @param {object} actionData - Object containing message and group data
   *
   * @returns {object} - An object containing errors and isValid
   *
   * @memberof Validator
   */
  static validateAddNewMessageToGroup({
    groupId, title
  }) {
    this.errors = {};

    if (!validator.isNumeric(groupId.toString())) {
      this.errors.groupId = 'groupId is invalid. enter a number';
    }
    if (title === undefined || validator.isEmpty(title.toString())) {
      this.errors.title = 'title is required';
    }

    return resolveErrors(this.errors);
  }

  /**
   * Validate data for adding user to group
   * @function validateAddUserToGroup
   *
   * @static
   *
   * @param {object} actionData
   *
   * @returns {object} - An object containing errors and isValid
   *
   * @memberof Validator
   */
  static validateAddUserToGroup({
    groupId, userId
  }) {
    this.errors = {};

    if (!validator.isNumeric(groupId.toString())) {
      this.errors.groupId = 'groupId is invalid. enter a number';
    }
    if (userId === undefined) {
      this.errors.userId = 'userId is required';
    } else if (!validator.isNumeric(userId.toString())) {
      this.errors.userId = 'userId is invalid. enter a number';
    }
    return resolveErrors(this.errors);
  }

  /**
   * Confirms the validity of data used to create new groups
   * @method validateNewGroup
   *
   * @static
   *
   * @param {object} groupData - Data for creating new group
   *
   * @returns {object} - An object containing errors and isValid
   *
   * @memberof Validator
   */
  static validateNewGroup({ name }) {
    this.errors = {};
    if (name === undefined || validator.isEmpty(name.toString())) {
      this.errors.name = 'group name is required';
    }
    return resolveErrors(this.errors);
  }

  /**
   * Confirms validity of groupId to be used to fetch messages
   * @method validateFetchGroupMessages
   *
   * @static
   *
   * @param {number} groupId - Id of group whose messages should be fetched
   *
   * @returns {object} - An object containing errors and isValid
   *
   * @memberof Validator
   */
  static validateFetchGroupMessages(groupId) {
    this.errors = {};

    if (!validator.isNumeric(groupId.toString())) {
      this.errors.groupId = 'groupId is invalid. enter a number';
    }

    return resolveErrors(this.errors);
  }

  /**
   * Confirms the validity of user login data
   * @method validateSignIn
   *
   * @static
   *
   * @param {object} userData - An object containing user login data
   *
   * @returns {object} - An object containing errors and isValid
   *
   * @memberof Validator
   */
  static validateSignIn({
    identifier, password
  }) {
    this.errors = {};
    if (identifier === undefined || validator.isEmpty(identifier.toString())) {
      this.errors.identifier = 'email or username is required';
    }
    if (password === undefined || validator.isEmpty(password.toString())) {
      this.errors.password = 'password is required';
    }
    return resolveErrors(this.errors);
  }

  /**
   * Confirms validity of user signup data
   * @method validateSignUp
   *
   * @static
   *
   * @param {object} userData - Supplied user data
   *
   * @returns {object} - An object containing errors and isValid
   *
   * @memberof Validator
   */
  static validateSignUp({
    alias, email, password, confirmPassword
  }) {
    this.errors = {};
    if (alias === undefined || validator.isEmpty(alias.toString())) {
      this.errors.alias = 'alias is required';
    }
    if (email === undefined || validator.isEmpty(email.toString())) {
      this.errors.email = 'email is required';
    } else if (!validator.isEmail(email.toString())) {
      this.errors.email = 'email is invalid';
    }
    if (password === undefined || validator.isEmpty(password.toString())) {
      this.errors.password = 'password is required';
    } else if (
      confirmPassword === undefined
      || validator.isEmpty(confirmPassword.toString())
    ) {
      this.errors.password = 'confirmation password is required';
    } else if (password !== confirmPassword) {
      this.errors.password = "passwords don't match";
    }

    return resolveErrors(this.errors);
  }
}

module.exports = Validator;


// "$2a$10$4KKjllx8kzFotk/T5uW1fuDTM.2LiBWN7EGeqeNwEqOWsxl6i/fDq"