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
      type: DataTypes.VIRTUAL,
      get() {
        const players = this.Players;

        const val = players.reduce((sum, player) => (sum + player.value), 0);
        return val;
      },
      set() {
        throw new Error('Do not try to set the value field');
      }
    }
  }, {
    sequelize,
    modelName: 'Team',
  });
  return Team;
};
