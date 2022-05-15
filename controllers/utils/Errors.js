const userErrors = {
  USER_DUPLICATE_EMAIL: 201,
  USER_NOT_FOUND: 202,
  USER_INVALID_ID: 203,
  USER_INVALID_PASSWORD: 204
};

const teamErrors = {
  TEAM_NOT_FOUND: 302,
  TEAM_INVALID_ID: 303,
  TEAM_INSUFFICIENT_BUDGET: 304,
  TEAM_PLAYER_ALREADY_OWNED: 305
};

const playerErrors = {
  PLAYER_NOT_FOUND: 402,
  PLAYER_INVALID_ID: 403,
  PLAYER_NOT_TRANSFER_LISTED: 404
};

const transferErrors = {
  TRANSFER_LISTING_NOT_FOUND: 502,
  TRANSFER_INVALID_ID: 503,
  TRANSFER_COMPLETED_ALREADY: 504,
  TRANSFER_DELISTED_ALREADY: 505,
  TRANSFER_LISTED_ALREADY: 506
};

const authenticationErrors = {
  AUTH_INVALID_TOKEN: 603
};

const genericErrors = {
  UNAUTHORIZED: 701
};

module.exports = {
  userErrors,
  teamErrors,
  playerErrors,
  transferErrors,
  genericErrors,
  authenticationErrors
};
