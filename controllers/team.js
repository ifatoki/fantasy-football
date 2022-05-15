const Validator = require('./utils/Validator');
const {
  resolveError,
  sendMessage,
  stringifyValidationErrors,
  throwError,
  sendData
} = require('./utils/Generic');
const {
  confirmPlayerExists,
  getCurrentOpenPlayerListing
} = require('./helpers/player');
const {
  listPlayer,
  completeTransfer,
  delistTransfer
} = require('./helpers/transfer');
const {
  playerErrors,
  genericErrors
} = require('./utils/Errors');
const { getTeam } = require('./helpers/team');

/**
 * Handles getting team details
 * @function getTeamController
 *
 * @param {any} req - Server request object
 * @param {any} res - Server response object
 *
 * @return {void}
 */
const getTeamController = async (req, res) => {
  try {
    const { TeamId } = req.user;
    const team = await getTeam(TeamId, true);

    sendData({ team }, 200, 'success', res);
  } catch (e) {
    resolveError(e, res);
  }
};

/**
 * Handles listing a player on the transfer table
 * @function playerListingController
 *
 * @param {any} req - Server request object
 * @param {any} res - Server response object
 *
 * @return {void}
 */
const playerListingController = async (req, res) => {
  const validator = Validator.validatePlayerListing(req.body);

  if (validator.isValid) {
    try {
      const { askingPrice } = req.body;
      const team = await req.user.getTeam();
      const player = await confirmPlayerExists(req.params.id);

      if (player.TeamId !== team.id) {
        throwError(genericErrors.UNAUTHORIZED);
      }
      const listing = await listPlayer(player, askingPrice);

      sendData({ listing }, 201, 'success', res);
    } catch (e) {
      resolveError(e, res);
    }
  } else {
    sendMessage(stringifyValidationErrors(validator.errors), 400, 'failed', res);
  }
};

/**
 * Handles the purchase of an already listed player
 * @function playerBuyingController
 *
 * @param {any} req - Server request object
 * @param {any} res - Server response object
 *
 * @return {void}
 */
const playerBuyingController = async (req, res) => {
  try {
    const team = await req.user.getTeam();
    const player = await confirmPlayerExists(req.params.id);
    let listing = await getCurrentOpenPlayerListing(player);

    if (!listing) throwError(playerErrors.PLAYER_NOT_TRANSFER_LISTED);
    listing = await completeTransfer(listing.id, team.id);
    sendData({ listing }, 201, 'success', res);
  } catch (e) {
    resolveError(e, res);
  }
};

/**
 * Handles the removal of a player from the transfer list
 * @function playerDelistingController
 *
 * @param {any} req - Server request object
 * @param {any} res - Server response object
 *
 * @return {void}
 */
const playerDelistingController = async (req, res) => {
  try {
    const team = await req.user.getTeam();
    const player = await confirmPlayerExists(req.params.id);

    if (player.TeamId !== team.id) {
      throwError(genericErrors.UNAUTHORIZED);
    }
    let listing = await getCurrentOpenPlayerListing(player);

    if (!listing) throwError(playerErrors.PLAYER_NOT_TRANSFER_LISTED);
    listing = await delistTransfer(listing.id);
    sendData({ listing }, 200, 'success', res);
  } catch (e) {
    resolveError(e, res);
  }
};

module.exports = {
  getTeamController,
  playerListingController,
  playerDelistingController,
  playerBuyingController
};
