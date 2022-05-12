const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transfer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transfer.belongsTo(models.Player);
      Transfer.belongsTo(models.Team, { as: 'fromTeam' });
      Transfer.belongsTo(models.Team, { as: 'toTeam' });
    }
  }
  Transfer.init({
    price: {
      type: DataTypes.DECIMAL
    },
    status: {
      type: DataTypes.STRING
    },
    completedAt: {
      type: DataTypes.DATE,
    },
    removedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Transfer',
  });
  return Transfer;
};
