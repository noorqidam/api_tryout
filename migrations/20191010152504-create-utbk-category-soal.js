'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('utbk_category_soals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      _id: { 
        type : Sequelize.STRING
      },
      category_name: {
        type: Sequelize.STRING
      },
      publish: {
        type: Sequelize.BOOLEAN
      },
      deleted: {
        type : Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('utbk_category_soals');
  }
};