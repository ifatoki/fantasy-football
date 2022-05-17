const Validator = require('./utils/Validator');
const {
  editPlayer,
  confirmPlayerExists,
  playerIsTransferListed
} = require('./helpers/player');
const {
  resolveError,
  sendMessage,
  stringifyValidationErrors,
  sendData,
  throwError
} = require('./utils/Generic');
const { genericErrors } = require('./utils/Errors');

/**
 * Handles getting player details
 * @function playerGetController
 *
 * @param {any} req - Server request object
 * @param {any} res - Server response object
 *
 * @return {void}
 */
const playerGetController = async (req, res) => {
  try {
    const team = await req.user.getTeam();
    const player = await confirmPlayerExists(req.params.id);
    const isTransferListed = await playerIsTransferListed(player);

    if (!isTransferListed && player.TeamId !== team.id) {
      throwError(genericErrors.UNAUTHORIZED);
    }

    sendData({ player }, 200, 'success', res);
  } catch (e) {
    resolveError(e, res);
  }
};

/**
 * Handles editing player details
 * @function editPlayerController
 *
 * @param {any} req - Server request object
 * @param {any} res - Server response object
 *
 * @return {void}
 */
const editPlayerController = async (req, res) => {
  const validator = Validator.validatePlayerEdit(req.body);

  if (validator.isValid) {
    try {
      const team = await req.user.getTeam();
      let player = await confirmPlayerExists(req.params.id);

      if (player.TeamId !== team.id) {
        throwError(genericErrors.UNAUTHORIZED);
      }

      player = await editPlayer(req.params.id, req.body);
      sendData({ player }, 200, 'success', res);
    } catch (e) {
      resolveError(e, res);
    }
  } else {
    sendMessage(stringifyValidationErrors(validator.errors), 400, 'failed', res);
  }
};

module.exports = {
  editPlayerController,
  playerGetController
};
