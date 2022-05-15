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

/**
 * List a player on the transfer table
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
 * Buy an already listed player on the transfer table
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
 * Remove a player from the transfer table
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
  playerListingController,
  playerDelistingController,
  playerBuyingController
};
