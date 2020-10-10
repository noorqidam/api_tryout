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
  //  return queryInterface.bulkInsert('utbk_child_menu', [
  //   // { name: 'create', url: '/', icon:'fa fa-pencil',createdAt: new Date() ,updatedAt: new Date()},
  //   // { name: 'list', url: '/', icon:'fa fa-pencil',createdAt: new Date() ,updatedAt: new Date()},
  //   // { name: 'create', url: '/create', icon:'fa fa-leanpub',createdAt: new Date() ,updatedAt: new Date()},
  //   // { name: 'list', url: '/', icon:'fa fa-leanpub',createdAt: new Date() ,updatedAt: new Date()},
  // ], {});
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
