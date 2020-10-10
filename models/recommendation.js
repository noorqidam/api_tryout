'use strict';
module.exports = (sequelize, DataTypes) => {
  const recommendation = sequelize.define('recommendation', {
    name: DataTypes.STRING,
    position: DataTypes.CHAR
  }, {
    defaultScope: {
      attributes :['id','name','position']
    }
  });
  recommendation.associate = function(models) {
    // associations can be defined here
    recommendation.hasMany(models.module_recommendation, { as: 'rekomendasi_module', foreignKey: 'recommendation_id'}); 
  };
  return recommendation;
};