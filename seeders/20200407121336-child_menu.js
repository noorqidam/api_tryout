'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return queryInterface.bulkInsert('mymenu_children', [
     { name: 'Create', url: '/ujian/create', icon:'fa fa-plus', mymenu_id: '3', createdAt: new Date() ,updatedAt: new Date()},
     { name: 'List', url: '/ujian', icon:'fa fa-list-alt', mymenu_id: '3', createdAt: new Date() ,updatedAt: new Date()},
     { name: 'Create', url: '/quiz/create', icon:'fa fa-plus', mymenu_id: '4', createdAt: new Date() ,updatedAt: new Date()},
     { name: 'List', url: '/quiz', icon:'fa fa-list-alt', mymenu_id: '4', createdAt: new Date() ,updatedAt: new Date()},
     { name: 'Ujian', url: '/report/ujian', icon:'fa fa-leanpub', mymenu_id: '10', createdAt: new Date() ,updatedAt: new Date()},
     { name: 'Quiz', url: '/report/quiz', icon:'fa fa-leanpub', mymenu_id: '10', createdAt: new Date() ,updatedAt: new Date()},
     { name: 'Module', url: '/report/books', icon:'fa fa-book', mymenu_id: '10', createdAt: new Date() ,updatedAt: new Date()},
     { name: 'Langganan', url: '/report/subscription', icon:'fa fa-bell', mymenu_id: '10', createdAt: new Date() ,updatedAt: new Date()},
     { name: 'Admin', url: '/setting/admin', icon:'fa fa-users', mymenu_id: '11', createdAt: new Date() ,updatedAt: new Date()},
     { name: 'Create', url: '/ujian/create', icon:'fa fa-plus', mymenu_id: '14', createdAt: new Date() ,updatedAt: new Date()},
     { name: 'List', url: '/ujian', icon:'fa fa-list-alt', mymenu_id: '14', createdAt: new Date() ,updatedAt: new Date()},
     { name: 'Create', url: '/quiz/create', icon:'fa fa-plus', mymenu_id: '15', createdAt: new Date() ,updatedAt: new Date()},
     { name: 'List', url: '/quiz', icon:'fa fa-list-alt', mymenu_id: '15', createdAt: new Date() ,updatedAt: new Date()},
     { name: 'Ujian', url: '/report/ujian', icon:'fa fa-leanpub', mymenu_id: '20', createdAt: new Date() ,updatedAt: new Date()},
     { name: 'Quiz', url: '/report/quiz', icon:'fa fa-leanpub', mymenu_id: '20', createdAt: new Date() ,updatedAt: new Date()},
     { name: 'Module', url: '/report/books', icon:'fa fa-book', mymenu_id: '20', createdAt: new Date() ,updatedAt: new Date()},
     { name: 'Langganan', url: '/report/subscription', icon:'fa fa-bell', mymenu_id: '20', createdAt: new Date() ,updatedAt: new Date()},
     { name: 'Admin', url: '/setting/admin', icon:'fa fa-users', mymenu_id: '21', createdAt: new Date() ,updatedAt: new Date()},
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
