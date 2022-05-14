const { Transfer } = require('../../models');
const { transferErrors } = require('../utils/Errors');
const { throwError, getRandomPercentage } = require('../utils/Generic');
const { confirmPlayerExists } = require('./player');
const { debitTeam, creditTeam } = require('./team');

/**
 * Confirm the existence of a transfer listing
 * @function confirmListingExists
 *
 * @param {number} id - Transfer listing id to be validated
 *
 * @returns {Promise<Transer>} - Resolves to the transfer listing.
 */
const confirmListingExists = async (id) => {
  const transfer = await Transfer.findById(id);

  if (!transfer) throwError(transferErrors.TRANSFER_LISTING_NOT_FOUND);
  return transfer;
};

/**
 * Confirm is a listing is still pending
 * @function confirmListingIsPending
 *
 * @param {number} id - Transfer Listing id to be verified
 *
 * @returns {Promise<Transfer>} - Resolves to the pending transfer listing.
 */
const confirmListingIsPending = async (id) => {
  try {
    const listing = await confirmListingExists(id);
    const { status } = listing;

    switch (status) {
      case 'complete': {
        throwError(transferErrors.TRANSFER_COMPLETED_ALREADY);
        break;
      }
      case 'removed': {
        throwError(transferErrors.TRANSFER_DELISTED_ALREADY);
        break;
      }
      default:
    }

    return listing;
  } catch (e) {
    throwError(e.message);
  }
};

/**
 * Adds a player to the transfer list
 * @function listPlayer
 *
 * @param {number} id - Player id
 * @param {number} askingPrice - Asking price for the player
 *
 * @returns {Promise<Transfer>} - Resolves to the Transfer listing.
 */
const listPlayer = async (id, askingPrice) => {
  try {
    const player = await confirmPlayerExists(id);
    const team = await player.getTeam();
    const listing = await Transfer.create({
      price: askingPrice
    });

    await Promise.all([
      listing.setPlayer(player),
      listing.setFromTeam(team)
    ]);
    return listing;
  } catch (e) {
    throwError(e.message);
  }
};

/**
 * Remove a pending transfer listing.
 * @function delistTransfer
 *
 * @param {number} id - Transfer listing id
 *
 * @returns {Promise<Transfer>} - Resolves to the delisted Transfer.
 */
const delistTransfer = async (id) => {
  try {
    const listing = await confirmListingIsPending(id);

    return listing.set({ status: 'removed' }).save();
  } catch (e) {
    throwError(e.message);
  }
};

/**
 * Complete a transfer listing transaction in favor of a buyer.
 * @function completeTransfer
 *
 * @param {number} id - Transfer listing Id
 * @param {number} buyerId - Id of the purchasing team;
 *
 * @return {Promise<Transfer>} - Resolves to the completed Transfer.
 */
const completeTransfer = async (id, buyerId) => {
  try {
    const listing = await confirmListingIsPending(id);
    const seller = await listing.getFromTeam();
    const player = await listing.getPlayer();
    const { price } = listing;
    const { value } = player;

    // deduct price from buyers budget (check if they can afford it)
    const buyer = await debitTeam(buyerId, price);
    // add price to sellers budget
    await creditTeam(seller.id, price);
    // associate listing with the buyer team
    await listing.setToTeam(buyer);
    // associate the player with the buyer team
    await buyer.addPlayer(player);
    // increase plyaer value;
    await player.set({ value: value * (1 + (getRandomPercentage() / 100)) });
    // mark the listing as complete
    await listing.set({ status: 'complete' }).save();
    // return the successful listing
    return listing;
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
  listPlayer,
  delistTransfer,
  completeTransfer
};
