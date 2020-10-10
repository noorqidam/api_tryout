'use strict';
module.exports = (sequelize, DataTypes) => {
  const order_subscriptions = sequelize.define('order_subscriptions', {
    order_nomor: DataTypes.STRING,
    user_id: DataTypes.STRING,
    total_price: DataTypes.DOUBLE,
    voucher: DataTypes.DOUBLE,
    code_voucher: DataTypes.STRING,
    payment_status: DataTypes.BOOLEAN,
    package_subscription_id: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    deleted: DataTypes.BOOLEAN
  }, {});
  order_subscriptions.associate = function(models) {
    // associations can be defined here
  };
  return order_subscriptions;
};