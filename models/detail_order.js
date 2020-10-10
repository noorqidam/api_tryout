'use strict';
module.exports = (sequelize, DataTypes) => {
  var detail_order = sequelize.define('detail_order', {
    order_id: DataTypes.INTEGER,
    module_id: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    total_price: DataTypes.DOUBLE,
    discountItem : DataTypes.DOUBLE
  }, {});
  detail_order.associate = function(models) {
    // associations can be defined here
    detail_order.belongsTo(models.module , { as:'module' , foreignKey: 'module_id'});
    detail_order.belongsTo(models.order, { as :'order' , foreignKey :'order_id'});
  };
  return detail_order;
};