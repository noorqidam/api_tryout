'use strict';
module.exports = (sequelize, DataTypes) => {
  const voucher_theme = sequelize.define('voucher_theme', {
    theme: DataTypes.STRING,
    bundling: DataTypes.STRING,
    voucher_value: DataTypes.DOUBLE,
    voucher_price: DataTypes.DOUBLE,
    category : DataTypes.STRING,
    publish: DataTypes.BOOLEAN,
  }, {});
  voucher_theme.associate = function(models) {
    // associations can be defined here
  };
  return voucher_theme;
};