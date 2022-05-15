const {
  resolveError,
  sendData
} = require('./utils/Generic');
const { listingsFetch } = require('./helpers/transfer');

/**
 * Handles fetching transfers
 * @function transfersFetchController
 *
 * @param {any} req - Server request object
 * @param {any} res - Server response object
 *
 * @return {void}
 */
const transfersFetchController = async (req, res) => {
  try {
    const transfers = await listingsFetch({ status: 'pending' });

    sendData({ transfers }, 200, 'success', res);
  } catch (e) {
    resolveError(e, res);
  }
};

module.exports = {
  transfersFetchController
};
