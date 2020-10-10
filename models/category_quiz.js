'use strict';
module.exports = (sequelize, DataTypes) => {
  const category_quiz = sequelize.define('category_quiz', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    publish: DataTypes.BOOLEAN
  }, {});
  category_quiz.associate = function(models) {
    // associations can be defined here
  };
  return category_quiz;
};