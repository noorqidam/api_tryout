'use strict';
module.exports = (sequelize, DataTypes) => {
  const module_subscriptions = sequelize.define('module_subscriptions', {
    package_subscription_id: DataTypes.INTEGER,
    module_id: DataTypes.INTEGER
  }, {});
  module_subscriptions.associate = function(models) {
    // associations can be defined here
    module_subscriptions.belongsTo(models.module, { as: 'module', foreignKey: 'module_id' , targetKey:'id'}); 
  };
  return module_subscriptions;
};