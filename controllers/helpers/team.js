const { faker } = require('@faker-js/faker');
const { Team, Player } = require('../../models');
const { TeamErrors, teamErrors } = require('../utils/Errors');
const { throwError } = require('../utils/Generic');
const { createPlayer } = require('./player');

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
 * Change team name and / or country
 * @function editTeam
 *
 * @param {number} id - Team id
 * @param {object} data - Data to append to the team
 *
 * @return {Promise<Team>} - Resolves to the edited team
 */
const editTeam = async (id, { name, country }) => {
  const data = {};
  let team = await confirmTeamExists(id);

  if (name) data.name = name;
  if (country) data.country = country;
  team = await team.set(data).save();
  return team;
};

/**
 * Debit an amount from a team
 * @function debitTeam
 *
 * @param {number} id - Team Id
 * @param {number} amount - Amount to be deducted from the team budget
 * @param {object} transaction - The transaction this is a part of.
 *
 * @returns {Promise<Team>} - Resolves to the team.
 */
const debitTeam = async (id, amount, transaction) => {
  const team = await confirmTeamExists(id);
  let { budget } = team;

  if (budget < amount) throwError(teamErrors.TEAM_INSUFFICIENT_BUDGET);
  budget -= amount;
  await team.set({ budget }).save({ transaction });
  return team;
};

/**
 * Credit an amount to a team
 * @function creditTeam
 *
 * @param {number} id - Team Id
 * @param {number} amount - Amount to be included to the team budget
 * @param {object} transaction - The transaction this is a part of.
 *
 * @returns {Promise<Team>} - Resolves to the team.
 */
const creditTeam = async (id, amount, transaction) => {
  const team = await confirmTeamExists(id);
  let { budget } = team;

  budget += amount;
  await team.set({ budget }).save({ transaction });
  return team;
};

/**
 * Generate the initial players in a team.
 * @function initializePlayers
 *
 * @param {Team} team - Team to initialize the players in.
 * @param {object} transaction - The transaction this is a part of.
 *
 * @return {Promise<void>}
 */
const initializePlayers = async (team, transaction) => {
  const playersPromises = [];
  const playersMap = new Map(Object.entries({
    gk: 3,
    def: 6,
    mid: 6,
    att: 5
  }));

  playersMap.forEach((count, pos) => {
    for (let i = 1; i <= count; i += 1) {
      playersPromises.push(createPlayer(pos, transaction));
    }
  });
  const players = await Promise.all(playersPromises);

  team.addPlayers(players, { transaction });
  await team.set({ value: 1000000 * players.length }).save({ transaction });
};

/**
 * Creates new Team in the database
 * @function createTeam
 *
 * @param {object} transaction - The transaction this is a part of.
 *
 * @returns {Promise<Team>} - Resolves to Team object or Error
 */
const createTeam = async (transaction) => {
  try {
    const team = await Team.create({
      name: faker.random.word(),
      country: faker.address.country()
    }, { transaction });

    await initializePlayers(team, transaction);
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
  getTeam,
  editTeam
};
