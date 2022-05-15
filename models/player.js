const { Model } = require('sequelize');
const { getAge } = require('../controllers/utils/Generic');

module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Player.belongsTo(models.Team);
      Player.hasMany(models.Transfer);
    }
  }
  Player.init({
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING
    },
    value: {
      type: DataTypes.BIGINT,
      defaultValue: 100000000,
      get() {
        return this.getDataValue('value') / 100;
      },
      set(value) {
        this.setDataValue('value', Math.floor(value * 100));
      }
    },
    position: {
      type: DataTypes.ENUM,
      values: ['gk', 'def', 'mid', 'att']
    },
    dob: {
      type: DataTypes.DATE
    },
    age: {
      type: DataTypes.VIRTUAL,
      get() {
        return getAge(this.getDataValue('dob'));
      },
      set() {
        throw new Error('Do not try to set the `age` value!');
      }
    }
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};
