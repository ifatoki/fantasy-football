const { faker } = require('@faker-js/faker');
const { Player } = require('../../models');
const { playerErrors } = require('../utils/Errors');
const { throwError, getRandomDOB } = require('../utils/Generic');

// /**
//  * Confirm if email is unique
//  * @function confirmEmailUniqueness
//  *
//  * @param {string} email - Email Address to check
//  *
//  * @return {Promise<void>}
//  *
//  * @throws {Error} - Error indicating duplication
//  */
// const confirmEmailUniqueness = async (email) => {
//   const user = await User.findOne({ where: { email } });

//   if (user) throwError(userErrors.USER_DUPLICATE_EMAIL);
// };

/**
 * Confirm the existence of a player with the passed id
 * @function confirmPlayerExists
 *
 * @param {number} id - Player id to be validated
 *
 * @returns {Promise<Player>} - Resolves to player or an error.
 */
const confirmPlayerExists = async (id) => {
  const player = await Player.findById(id);

  if (!player) throwError(playerErrors.PLAYER_NOT_FOUND);
  return player;
};

/**
 * Creates new Player in the database
 * @function createPlayer
 *
 * @param {string} position - Position the player plays.
 *
 * @returns {Promise<Player>} - Resolves to Player object or Error.
 */
const createPlayer = async (position) => {
  try {
    const player = await Player.create({
      firstName: faker.name.firstName('male'),
      lastName: faker.name.lastName('male'),
      country: faker.address.country(),
      position,
      dob: getRandomDOB()
    });

    return player;
  } catch (e) {
    throwError(e.message);
  }
};

// /**
//  * Filter the user object before returning it
//  * @function filterUser
//  *
//  * @param {object} userData - User data to be filtered
//  *
//  * @return {object} - Filtered user object
//  */
// const filterUser = ({ id, username, email }) => ({
//   id,
//   username,
//   email
// });

// /**
//  * Get a user by email or username
//  * @function getUserByIdentifier
//  *
//  * @param {string} identifier - User email or username
//  *
//  * @return {Promise} - Resolves to user or error
//  */
// const getUserByIdentifier = (identifier) => User.findOne({
//   where: {
//     $or: {
//       username: identifier,
//       email: identifier
//     }
//   }
// })
//   .then((user) => {
//     if (!user) throwError(userErrors.USER_NOT_FOUND);
//     return user;
//   });

// /**
//  * Send the user object with the response object from the server
//  * @function sendUser
//  *
//  * @param {object} user - User object to be sent
//  * @param {number} status - Server status
//  * @param {object} res - Server response object
//  *
//  * @return {void}
//  */
// const sendUser = (user, status, res) => res.status(status).send({
//   user: filterUser(user)
// });

module.exports = {
  createPlayer,
  confirmPlayerExists
};
