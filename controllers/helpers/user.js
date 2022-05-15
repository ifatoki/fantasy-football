const { Op } = require('sequelize');
const { User, Team } = require('../../models');
const { userErrors } = require('../utils/Errors');
const { createTeam } = require('./team');
const { throwError } = require('../utils/Generic');

/**
 * Confirm if email is unique
 * @function confirmEmailUniqueness
 *
 * @param {string} email - Email Address to check
 *
 * @return {Promise<void>}
 *
 * @throws {Error} - Error indicating duplication
 */
const confirmEmailUniqueness = async (email) => {
  const user = await User.findOne({ where: { email } });

  if (user) throwError(userErrors.USER_DUPLICATE_EMAIL);
};

/**
 * Confirm the existence of a user with the passed id
 * @function confirmUserExists
 *
 * @param {number} id - User id to be validated
 *
 * @returns {Promise<User>} - Resolves to user or an error.
 */
const confirmUserExists = async (id) => {
  const user = await User.findByPk(id);

  if (!user) throwError(userErrors.USER_NOT_FOUND);
  return user;
};

/**
 * Creates new user in the database
 * @function createUser
 *
 * @param {object} userData - Userdata for creating new user
 * @param {string} hashedPassword - Encrypted user password
 *
 * @returns {Promise} - Resolves to User object or Error
 */
const createUser = async (userData, hashedPassword) => {
  try {
    const [team, user] = await Promise.all([
      createTeam(),
      User.create({
        ...userData,
        hashedPassword
      })
    ]);

    await user.setTeam(team);
    return user;
  } catch (e) {
    throwError(e.message);
  }
};

/**
 * Filter the user object before returning it
 * @function filterUser
 *
 * @param {object} userData - User data to be filtered
 *
 * @return {object} - Filtered user object
 */
const filterUser = ({
  id, alias, email
}) => ({
  id,
  alias,
  email
});

/**
 * Get a user by email or username
 * @function getUserByIdentifier
 *
 * @param {string} identifier - User email or username
 * @param {boolean} includeTeam - true, to include the Team.
 *
 * @return {Promise<User>} - Resolves to user or error
 */
const getUserByIdentifier = async (identifier, includeTeam = false) => {
  const query = {
    where: {
      [Op.or]: [
        { alias: identifier },
        { email: identifier }
      ]
    }
  };

  if (includeTeam) query.include = Team;
  const user = await User.findOne(query);
  if (!user) throwError(userErrors.USER_NOT_FOUND);
  return user;
};

/**
 * Send the user object with the response object from the server
 * @function sendUser
 *
 * @param {object} user - User object to be sent
 * @param {number} status - Server status
 * @param {object} res - Server response object
 *
 * @return {void}
 */
const sendUser = (user, status, res) => res.status(status).send({
  user: filterUser(user)
});

module.exports = {
  confirmEmailUniqueness,
  createUser,
  getUserByIdentifier,
  sendUser
};
