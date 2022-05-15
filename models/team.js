const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Team.hasOne(models.User);
      Team.hasMany(models.Player);
    }
  }
  Team.init({
    name: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING
    },
    budget: {
      type: DataTypes.BIGINT,
      defaultValue: 500000000,
      get() {
        return this.getDataValue('budget') / 100;
      },
      set(value) {
        this.setDataValue('budget', Math.floor(value * 100));
      }
    },
    value: {
      type: DataTypes.BIGINT,
      get() {
        return this.getDataValue('value') / 100;
      },
      set(value) {
        this.setDataValue('value', Math.floor(value * 100));
      }
    }
  }, {
    sequelize,
    modelName: 'Team',
  });
  return Team;
};
