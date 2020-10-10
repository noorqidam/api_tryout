'use strict';
module.exports = (sequelize, DataTypes) => {
  const my_subscribe_module = sequelize.define('my_subscribe_module', {
    my_subscribe_id: DataTypes.INTEGER,
    module_id: DataTypes.INTEGER,
    user_id: DataTypes.STRING,
    expire_at: DataTypes.DATE
  }, {});
  my_subscribe_module.associate = function(models) {
    // associations can be defined here
  };
  return my_subscribe_module;
};