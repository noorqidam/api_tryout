'use strict';
module.exports = (sequelize, DataTypes) => {
  const module_recommendation = sequelize.define('module_recommendation', {
    recommendation_id: DataTypes.INTEGER,
    module_id: DataTypes.INTEGER
  }, {});
  module_recommendation.associate = function(models) {
    // associations can be defined here
    module_recommendation.belongsTo(models.module, { as:'modules', foreignKey: 'module_id' ,targetKey:'id'});
  };
  return module_recommendation;
};