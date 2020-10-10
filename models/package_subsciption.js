'use strict';
module.exports = (sequelize, DataTypes) => {
  const package_subsciption = sequelize.define('package_subsciption', {
    _id : DataTypes.STRING,
    package_name: DataTypes.STRING,
    basic_price: DataTypes.DOUBLE,
    sale_price: DataTypes.DOUBLE,
    offline_price : DataTypes.DOUBLE,
    duration: DataTypes.INTEGER,
    bonus_duration: DataTypes.INTEGER,
    discount: DataTypes.INTEGER,
    descriptions: DataTypes.TEXT,
    referal_code : DataTypes.STRING,
    deleted : DataTypes.BOOLEAN,
    publish : DataTypes.BOOLEAN
  }, {
    defaultScope: {
      where : {
        deleted : false
      }
    },
  });
  package_subsciption.associate = function(models) {
    // associations can be defined here
    package_subsciption.hasMany(models.module_subscriptions, { as:'modules_langganan', foreignKey: 'package_subscription_id'});
  };
  return package_subsciption;
};