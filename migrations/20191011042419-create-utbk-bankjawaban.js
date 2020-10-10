'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('utbk_bankjawabans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      soal_id: {
        allowNull: false,
        reference: {
          model:'utbk_banksoals',
          key:'_id'
        },
        type: Sequelize.STRING
      },
      jawaban_text: {
        type: Sequelize.STRING
      },
      jawaban_image: {
        type: Sequelize.STRING
      },
      is_correct: {
        type: Sequelize.BOOLEAN
      },
      point: {
        type: Sequelize.DOUBLE
      },
      deleted: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('utbk_bankjawabans');
  }
};