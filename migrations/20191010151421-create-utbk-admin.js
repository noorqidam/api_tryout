'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('utbk_admins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      _id: {
        allowNull: false,
        unique: true,
        type : Sequelize.STRING,
      },
      username: {
        type: Sequelize.STRING
      },
      displayname: {
        type : Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      authorized: {
        type: Sequelize.ENUM,
        values:['EDUTORE','PARTNER']
      },
      role: {
        type: Sequelize.ENUM,
        values: ['ADMIN','STAF','AUTHOR']
      },
      accountkey: {
        allowNull: false,
        type: Sequelize.STRING
      },
      suspend: {
        type: Sequelize.BOOLEAN,
        defaultValue : false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue : new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue : new Date()
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('utbk_admins');
  }
};