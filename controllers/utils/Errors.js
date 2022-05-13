const userErrors = {
  USER_DUPLICATE_EMAIL: 201,
  USER_NOT_FOUND: 202,
  USER_INVALID_ID: 203,
  USER_INVALID_PASSWORD: 204
};

const teamErrors = {
  TEAM_NOT_FOUND: 302,
  TEAM_INVALID_ID: 303
};

const playerErrors = {
  PLAYER_NOT_FOUND: 402,
  PLAYER_INVALID_ID: 403
};

const genericErrors = {
  INVALID_ID: 102,
  VALIDATION_ERROR: 103,
};

module.exports = {
  userErrors,
  teamErrors,
  playerErrors,
  genericErrors
};
