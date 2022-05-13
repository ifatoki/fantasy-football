const { faker } = require('@faker-js/faker');
const { Team } = require('../../models');
const { TeamErrors } = require('../utils/Errors');
const { throwError } = require('../utils/Generic');
const { createPlayer } = require('./players');

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
 * Confirm the existence of a user with the passed id
 * @function confirmUserExists
 *
 * @param {number} id - User id to be validated
 *
 * @returns {Promise<User>} - Resolves to user or an error.
 */
const confirmTeamExists = async (id) => {
  const team = await Team.findById(id);

  if (!team) throwError(TeamErrors.TEAM_NOT_FOUND);
  return team;
};

/**
 * Generate the initial players in a team.
 * @function initializePlayers
 *
 * @param {Team} team - Team to initialize the players in.
 *
 * @return {Promise<void>}
 */
const initializePlayers = async (team) => {
  const playersPromises = [];
  const playersMap = new Map(Object.entries({
    gk: 3,
    def: 6,
    mid: 6,
    att: 5
  }));

  playersMap.forEach((count, pos) => {
    for (let i = 1; i <= count; i += 1) {
      playersPromises.push(createPlayer(pos));
    }
  });
  const players = await Promise.all(playersPromises);

  team.addPlayers(players);
};

/**
 * Creates new Team in the database
 * @function createTeam
 *
 * @returns {Promise<Team>} - Resolves to Team object or Error
 */
const createTeam = async () => {
  try {
    const team = await Team.create({
      name: faker.random.word(),
      country: faker.address.country()
    });

    await initializePlayers(team);
    return team;
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
  createTeam,
  confirmTeamExists
};
