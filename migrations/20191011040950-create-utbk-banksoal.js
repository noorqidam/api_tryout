'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('utbk_banksoals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      _id: {
        allowNull: false,
        type: Sequelize.STRING
      },
      soal_text: {
        type: Sequelize.TEXT
      },
      soal_image: {
        type: Sequelize.STRING
      },
      soal_video: {
        type: Sequelize.STRING
      },
      category_id : {
        type: Sequelize.STRING
      },
      category_name: {
        type: Sequelize.STRING,
        allowNull: false,
        //type: Sequelize.ENUM('SD','SMP','SMA','SMK','PERGURUAN TINGGI','PROFESIONAL'),
      },
      matpel_id: {
        type: Sequelize.STRING
      },
      school_level: {
        allowNull : true,
        type: Sequelize.STRING
        //type: Sequelize.ENUM('SD','SMP','SMA','SMK','PERGURUAN TINGGI','PROFESIONAL'),
      },
      publisher_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      publisher_name: {
        type : Sequelize.STRING
      },
      mode_soal: {
        type: Sequelize.STRING
      },
      model_penilaian: {
        type: Sequelize.STRING
      },
      publish: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('utbk_banksoals');
  }
};