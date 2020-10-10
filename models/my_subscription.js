'use strict';
module.exports = (sequelize, DataTypes) => {
  const my_subscription = sequelize.define('my_subscription', {
    order_subscription_id : DataTypes.BIGINT,
    package_subscription_id: DataTypes.INTEGER,
    user_id: DataTypes.STRING,
    buy_at: DataTypes.DATE,
    expire_at: DataTypes.DATE,
    duration: DataTypes.INTEGER
  }, {
    
  });
  my_subscription.associate = function(models) {
    // associations can be defined here
    //my_subscription.belongsTo(models.package_subsciption, { as: 'paket_langganan', foreignKey: 'package_subscription_id' ,targetKey:'id'}); 
    my_subscription.belongsTo(models.order, { as: 'order', foreignKey: 'order_subscription_id' ,targetKey:'id'}); 
    my_subscription.belongsTo(models.customer, { as: 'user', foreignKey: 'user_id' ,targetKey:'user_id'}); 
  };
  return my_subscription;
};