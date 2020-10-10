'use strict';
module.exports = (sequelize, DataTypes) => {
  var my_module = sequelize.define('my_module', {
    module_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    user_id: DataTypes.STRING,
    buy_at: DataTypes.DATE
  }, {

  });
  my_module.associate = function(models) {
    // associations can be defined here
    my_module.belongsTo(models.module, { as: 'module', foreignKey: 'module_id' ,targetKey:'id'}); 
    my_module.belongsTo(models.order, { as: 'order', foreignKey: 'order_id' ,targetKey:'id'}); 

    //my_module.hasMany(models.module , { as:'module' , foreignKey: 'module_id'});
  };
  return my_module;
};