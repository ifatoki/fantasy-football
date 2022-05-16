const { faker } = require('@faker-js/faker');
const { Player } = require('../../models');
const { playerErrors } = require('../utils/Errors');
const { throwError, getRandomDOB } = require('../utils/Generic');

/**
 * Confirm the existence of a player with the passed id
 * @function confirmPlayerExists
 *
 * @param {number} id - Player id to be validated
 *
 * @returns {Promise<Player>} - Resolves to player or an error.
 */
const confirmPlayerExists = async (id) => {
  const player = await Player.findByPk(id);

  if (!player) throwError(playerErrors.PLAYER_NOT_FOUND);
  return player;
};

/**
 * Get the current open transfer listing for this player
 * @function getCurrentOpenPlayerListing
 *
 * @param {Player} player - Player
 *
 * @return {Promise<Transfer>} - Resolves to the open transfer listing for this player
 */
const getCurrentOpenPlayerListing = async (player) => {
  const transfers = await player.getTransfers();

  return transfers.find(({ status }) => (status === 'pending'));
};

/**
 * Change player firstname, lastname and/or country
 * @function editPlayer
 *
 * @param {number} id - Player id
 * @param {object} data - Data to append to the player
 *
 * @return {Promise<Player>} - Resolves to the edited Player
 */
const editPlayer = async (id, { firstName, lastName, country }) => {
  const data = {};
  let player = await confirmPlayerExists(id);

  if (firstName) data.firstName = firstName;
  if (lastName) data.lastName = lastName;
  if (country) data.country = country;
  player = await player.set(data).save();
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

module.exports = {
  createPlayer,
  confirmPlayerExists,
  editPlayer,
  getCurrentOpenPlayerListing
};
