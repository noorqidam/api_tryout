'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      
    */
    return queryInterface.bulkInsert('utbk_master_menus', [
      { name: 'Dashboard', url: '/', icon:'fa fa-dashboard',key:'EDUTORE',urutan:'1',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Bank soal', url: '/banksoals', icon:'fa fa-university',key:'EDUTORE',urutan:'2',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Ujian', url: '/ujian', icon:'fa fa-leanpub',key:'EDUTORE',urutan:'3',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Quiz', url: '/quiz', icon:'fa fa-leanpub',key:'EDUTORE',urutan:'4',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Module', url: '/books', icon:'fa fa-books',key:'EDUTORE',urutan:'5',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Langganan', url: '/subscription', icon:'fa fa-bell',key:'EDUTORE',urutan:'6',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Publisher', url: '/publisher', icon:'fa fa-book',key:'EDUTORE',urutan:'7',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Live Ujian', url: '/live-ujian', icon:'fa fa-leanpub',key:'EDUTORE',urutan:'8',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Live Quiz', url: '/live-quiz', icon:'fa fa-leanpub',key:'EDUTORE',urutan:'9',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Report', url: '/report', icon:'fa fa-bar-chart',key:'EDUTORE',urutan:'10',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Setting', url: '/setting', icon:'fa fa-cog',key:'EDUTORE',urutan:'11',createdAt: new Date() ,updatedAt: new Date()},

      { name: 'Dashboard', url: '/p', icon:'fa fa-dashboard',key:'PARTNER',urutan:'1',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Bank soal', url: '/p/banksoals', icon:'fa fa-university',key:'PARTNER',urutan:'2',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Ujian', url: '/p/ujian', icon:'fa fa-leanpub',key:'PARTNER',urutan:'3',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Quiz', url: '/p/quiz', icon:'fa fa-leanpub',key:'PARTNER',urutan:'4',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Module', url: '/p/books', icon:'fa fa-books',key:'PARTNER',urutan:'5',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Langganan', url: '/p/subscription', icon:'fa fa-bell',key:'PARTNER',urutan:'6',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Live Ujian', url: '/p/live-ujian', icon:'fa fa-leanpub',key:'PARTNER',urutan:'7',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Live Quiz', url: '/p/live-quiz', icon:'fa fa-leanpub',key:'PARTNER',urutan:'8',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Report', url: '/p/report', icon:'fa fa-bar-chart',key:'PARTNER',urutan:'9',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Setting', url: '/p/setting', icon:'fa fa-cog',key:'PARTNER',urutan:'10',createdAt: new Date() ,updatedAt: new Date()}
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
