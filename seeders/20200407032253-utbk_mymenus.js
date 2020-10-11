'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      
    */
    return queryInterface.bulkInsert('utbk_mymenus', [
      { name: 'Dashboard', url: '/', icon:'fa fa-dashboard', user_id: '1' , urutan:'1',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Bank soal', url: '/banksoals', icon:'fa fa-university', user_id: '1' , urutan:'2',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Ujian', url: '/ujian', icon:'fa fa-leanpub', user_id: '1' , urutan:'3',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Quiz', url: '/quiz', icon:'fa fa-leanpub', user_id: '1' , urutan:'4',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Module', url: '/books', icon:'fa fa-books', user_id: '1' , urutan:'5',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Langganan', url: '/subscription', icon:'fa fa-bell', user_id: '1' , urutan:'6',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Publisher', url: '/publisher', icon:'fa fa-book', user_id: '1' , urutan:'7',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Live Ujian', url: '/live-ujian', icon:'fa fa-leanpub', user_id: '1' , urutan:'8',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Live Quiz', url: '/live-quiz', icon:'fa fa-leanpub', user_id: '1' , urutan:'9',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Report', url: '/report', icon:'fa fa-bar-chart', user_id: '1' , urutan:'10',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Setting', url: '/setting', icon:'fa fa-cog', user_id: '1' , urutan:'11',createdAt: new Date() ,updatedAt: new Date()},

      { name: 'Dashboard', url: '/p', icon:'fa fa-dashboard', user_id: '2' , urutan:'1',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Bank soal', url: '/p/banksoals', icon:'fa fa-university', user_id: '2' , urutan:'2',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Ujian', url: '/p/ujian', icon:'fa fa-leanpub', user_id: '2' , urutan:'3',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Quiz', url: '/p/quiz', icon:'fa fa-leanpub', user_id: '2' , urutan:'4',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Module', url: '/p/books', icon:'fa fa-books', user_id: '2' , urutan:'5',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Langganan', url: '/p/subscription', icon:'fa fa-bell', user_id: '2' , urutan:'6',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Live Ujian', url: '/p/live-ujian', icon:'fa fa-leanpub', user_id: '2' , urutan:'7',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Live Quiz', url: '/p/live-quiz', icon:'fa fa-leanpub', user_id: '2' , urutan:'8',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Report', url: '/p/report', icon:'fa fa-bar-chart', user_id: '2' , urutan:'9',createdAt: new Date() ,updatedAt: new Date()},
      { name: 'Setting', url: '/p/setting', icon:'fa fa-cog', user_id: '2' , urutan:'10',createdAt: new Date() ,updatedAt: new Date()}
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
