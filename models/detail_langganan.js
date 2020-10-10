'use strict';
module.exports = (sequelize, DataTypes) => {
  const detail_langganan = sequelize.define('detail_langganan', {
    order_id: DataTypes.INTEGER,
    package_subscription_id: DataTypes.INTEGER,
    user_id: DataTypes.STRING
  }, {});
  detail_langganan.associate = function(models) {
    // associations can be defined here
    //detail_langganan.belongsTo(models.package_subsciption, { as: 'paket', foreignKey: 'package_subscription_id' ,targetKey:'id'});
  };
  return detail_langganan;
};