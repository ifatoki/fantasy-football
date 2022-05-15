const { faker } = require('@faker-js/faker');
const { Team, Player } = require('../../models');
const { TeamErrors, teamErrors } = require('../utils/Errors');
const { throwError } = require('../utils/Generic');
const { createPlayer } = require('./player');

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
 * Confirm the existence of a Team with the passed id
 * @function confirmTeamExists
 *
 * @param {number} id - Team id to be validated
 *
 * @returns {Promise<Team>} - Resolves to team or an error.
 */
const confirmTeamExists = async (id) => {
  const team = await Team.findByPk(id);

  if (!team) throwError(TeamErrors.TEAM_NOT_FOUND);
  return team;
};

/**
 * Get the details of a team
 * @function getTeam
 *
 * @param {number} id - Team id to fetch
 * @param {boolean} includePlayers - true, to include players in the dataset
 *
 * @returns {Promise<Team>} - Resolves to the requested TEam
 */
const getTeam = async (id, includePlayers = false) => {
  const options = {};

  if (includePlayers) options.include = Player;
  const team = await Team.findByPk(id, options);

  if (!team) throwError(teamErrors.TEAM_NOT_FOUND);
  return team;
};

/**
 * Debit an amount from a team
 * @function debitTeam
 *
 * @param {number} id - Team Id
 * @param {number} amount - Amount to be deducted from the team budget
 *
 * @returns {Promise<Team>} - Resolves to the team.
 */
const debitTeam = async (id, amount) => {
  const team = await confirmTeamExists(id);
  let { budget } = team;

  if (budget < amount) throwError(teamErrors.TEAM_INSUFFICIENT_BUDGET);
  budget -= amount;
  await team.set({ budget }).save();
  return team;
};

/**
 * Credit an amount to a team
 * @function creditTeam
 *
 * @param {number} id - Team Id
 * @param {number} amount - Amount to be included to the team budget
 *
 * @returns {Promise<Team>} - Resolves to the team.
 */
const creditTeam = async (id, amount) => {
  const team = await confirmTeamExists(id);
  let { budget } = team;

  budget += amount;
  await team.set({ budget }).save();
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

module.exports = {
  createTeam,
  creditTeam,
  debitTeam,
  confirmTeamExists,
  getTeam
};
