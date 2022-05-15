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
      type: DataTypes.INTEGER,
      get() {
        return this.getDataValue('price') / 100;
      },
      set(value) {
        this.setDataValue('price', Math.floor(value * 100));
      }
    },
    status: {
      type: DataTypes.ENUM,
      values: ['complete', 'pending', 'removed'],
      defaultValue: 'pending'
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
