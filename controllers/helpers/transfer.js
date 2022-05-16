const { Transfer, sequelize } = require('../../models');
const {
  transferErrors,
  teamErrors
} = require('../utils/Errors');
const {
  throwError,
  getRandomInRange
} = require('../utils/Generic');
const { getCurrentOpenPlayerListing } = require('./player');
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
  const transfer = await Transfer.findByPk(id);

  if (!transfer) throwError(transferErrors.TRANSFER_LISTING_NOT_FOUND);
  return transfer;
};

/**
 * Fetch transfer listings based on filter
 * @function listingsFetch
 *
 * @param {object} filter - Filter for transfers
 *
 * @returns {Promise<[Transfer]>} - Resolves to array of matching Transfers
 */
const listingsFetch = async (filter) => {
  const transfers = await Transfer.findAll({ where: filter });

  return transfers;
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
 * @param {object} player - Player object
 * @param {number} askingPrice - Asking price for the player
 *
 * @returns {Promise<Transfer>} - Resolves to the Transfer listing.
 */
const listPlayer = async (player, askingPrice) => {
  const transaction = await sequelize.transaction();

  try {
    const openListing = await getCurrentOpenPlayerListing(player);

    if (openListing) throwError(transferErrors.TRANSFER_LISTED_ALREADY);
    const team = await player.getTeam();
    const listing = await Transfer.create({
      price: askingPrice
    }, { transaction });

    await Promise.all([
      listing.setPlayer(player, { transaction }),
      listing.setFromTeam(team, { transaction })
    ]);
    await transaction.commit();
    return listing;
  } catch (e) {
    await transaction.rollback();
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

    return listing.set({ status: 'removed', removedAt: Date.now() }).save();
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
  const transaction = await sequelize.transaction();

  try {
    const listing = await confirmListingIsPending(id);
    const seller = await listing.getFromTeam();
    const player = await listing.getPlayer();
    const { price } = listing;
    const { value } = player;

    if (seller.id === buyerId) {
      throwError(teamErrors.TEAM_PLAYER_ALREADY_OWNED);
    }
    const buyer = await debitTeam(buyerId, price, transaction);
    await creditTeam(seller.id, price, transaction);
    await listing.setToTeam(buyer, { transaction });

    const buyerValue = buyer.value;
    const sellerValue = seller.value;

    // Subtract presale value from seller value
    await seller.set({ value: sellerValue - player.value }).save({ transaction });
    await buyer.addPlayer(player, { transaction });
    await player
      .set({ value: value * (1 + (getRandomInRange(10, 101) / 100)) })
      .save({ transaction });

    // Add postsale value to buyer value
    await buyer.set({ value: buyerValue + player.value }).save({ transaction });
    await listing.set({ status: 'complete', completedAt: Date.now() }).save({ transaction });
    await transaction.commit();
    return listing;
  } catch (e) {
    await transaction.rollback();
    throwError(e.message);
  }
};

module.exports = {
  listingsFetch,
  listPlayer,
  delistTransfer,
  completeTransfer
};
