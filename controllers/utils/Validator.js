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
      this.errors.identifier = 'email is required';
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

  static validatePlayerListing({ askingPrice }) {
    this.errors = {};
    if (askingPrice === undefined || validator.isEmpty(askingPrice.toString())) {
      this.errors.askingPrice = 'askingPrice is required';
    } else if (!validator.isNumeric(askingPrice.toString())) {
      this.errors.askingPrice = 'askingPrice is invalid';
    } else if (+askingPrice < 0) {
      this.errors.askingPrice = 'askingPrice has to be greater than 0';
    }

    return resolveErrors(this.errors);
  }

  static validateTeamEdit({ name, country }) {
    this.errors = {};
    if (
      (name === undefined || validator.isEmpty(name.toString()))
      && (country === undefined || validator.isEmpty(country.toString()))
    ) {
      this.errors.name = "at least one of 'name' and 'country' is required";
    }

    return resolveErrors(this.errors);
  }

  static validatePlayerEdit({ firstName, lastName, country }) {
    this.errors = {};

    if (
      (firstName === undefined || validator.isEmpty(firstName.toString()))
      && (lastName === undefined || validator.isEmpty(lastName.toString()))
      && (country === undefined || validator.isEmpty(country.toString()))
    ) {
      this.errors.name = "at least one of 'firstname', 'lastname', and 'country' is required";
    }

    return resolveErrors(this.errors);
  }
}

module.exports = Validator;
