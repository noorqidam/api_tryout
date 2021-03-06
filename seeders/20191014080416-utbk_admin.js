'use strict';
const uuid  =require('uuid/v4');
const bcrypt     =require('bcryptjs');
module.exports = {
  up: (queryInterface, Sequelize) => {
    const salt = bcrypt.genSaltSync(10);
    return queryInterface.bulkInsert('utbk_admins', [
      { 
        _id: uuid(),
        username: 'admin',
        displayname: 'admin',
        password: bcrypt.hashSync('rahasia123', salt),
        authorized: "EDUTORE", //publisher
        role: "ADMIN", /// admin , 
        accountkey:'EDUTORE', // publihser
        suspend: false
      },
      { 
        _id: uuid(),
        username: 'Edutore',
        displayname: 'Edutore',
        password: bcrypt.hashSync('Edutore', salt),
        authorized: "PARTNER", //publisher
        role: "ADMIN", /// admin , 
        accountkey:'EDUTORE', // publihser
        suspend: false
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('utbk_admins', null, {});
  }
};
