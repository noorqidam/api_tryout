'use strict';
module.exports = (sequelize, DataTypes) => {
  const r_module_sale = sequelize.define('r_module_sale', {
    module_id: DataTypes.INTEGER,
    module_name: DataTypes.STRING,
    order_id: DataTypes.INTEGER,
    order_nomor: DataTypes.STRING,
    voucher: DataTypes.DOUBLE,
    voucher_code: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    payment_type: DataTypes.STRING,
    categories: DataTypes.STRING,
    payment_date: DataTypes.DATE,
    email: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    discountItem: DataTypes.DOUBLE,
    total_price: DataTypes.DOUBLE,
    total_payment: DataTypes.DOUBLE,
    toko_name: DataTypes.STRING,
    publisher: DataTypes.STRING
  }, {

  });
  r_module_sale.associate = function(models) {
    // associations can be defined here
    r_module_sale.belongsTo(models.module , { as:'module' , foreignKey: 'module_id' , targetKey: 'id'});
  };
  return r_module_sale;
};