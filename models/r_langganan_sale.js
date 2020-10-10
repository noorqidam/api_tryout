'use strict';
module.exports = (sequelize, DataTypes) => {
  const r_langganan_sale = sequelize.define('r_langganan_sale', {
    order_id: DataTypes.INTEGER,
    order_nomor: DataTypes.STRING,
    voucher: DataTypes.DOUBLE,
    voucher_code: DataTypes.STRING,
    total_price: DataTypes.DOUBLE,
    total_payment: DataTypes.DOUBLE,
    user_id: DataTypes.STRING,
    email: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    package_subscription_id: DataTypes.INTEGER,
    package_name: DataTypes.STRING,
    payment_date: DataTypes.DATE,
    toko_name: DataTypes.STRING,
    payment_type: DataTypes.STRING
  }, {});
  r_langganan_sale.associate = function(models) {
    // associations can be defined here
  };
  return r_langganan_sale;
};