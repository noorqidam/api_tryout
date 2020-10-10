'use strict';
module.exports = (sequelize, DataTypes) => {
  var order = sequelize.define('order', {
    order_nomor: DataTypes.STRING,
    user_id: DataTypes.STRING,
    total_price: DataTypes.DOUBLE,
    voucher: DataTypes.DOUBLE,
    code_voucher: DataTypes.STRING,
    payment_status : DataTypes.BOOLEAN,
    total_payment : DataTypes.DOUBLE,
    deleted : DataTypes.BOOLEAN,
    expire_at: DataTypes.DATE,
    redirect_url : DataTypes.STRING,
    payment_method: DataTypes.STRING,
    ip_address : DataTypes.STRING,
    categories :DataTypes.STRING,
    email : DataTypes.STRING
  }, {
   
    scopes: {
      deleted: {
        where: {
          deleted: false
        }
      },
    }
  });
  order.associate = function(models) {
    // associations can be defined here
    order.hasMany(models.detail_order , { as:'order_details' , foreignKey: 'order_id'});
    order.belongsTo(models.detail_langganan , { as:'langganan' , foreignKey: 'id' , targetKey: 'order_id'});
    
    order.belongsTo(models.voucher_detail, { as: 'vouchers', foreignKey: 'code_voucher' ,targetKey:'voucher_code'}); 
    order.belongsTo(models.payments_status, { as: 'payments', foreignKey: 'id' ,targetKey:'order_id'});
    order.belongsTo(models.payments_status, { as: 'info_payment', foreignKey: 'order_nomor' ,targetKey:'order_id'}); //untuk module
    order.belongsTo(models.voucher,{ as :'vouchertoko', foreignKey :'code_voucher', targetKey :'voucher_code'});
    order.belongsTo(models.customer,{ as :'user', foreignKey :'user_id', targetKey :'user_id'});
    
  };
  return order;
};