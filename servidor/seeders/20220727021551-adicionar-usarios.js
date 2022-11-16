'use strict';

const crip = require('../cripts') 
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('usuarios', [
      { name: 'John Doe', password: crip.encrypt('123'), user: 'jão' },
      { name: 'Picolo', password: crip.encrypt('123'), user: 'luiz' },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};
