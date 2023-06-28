'use strict';

const { hasSuperAdminRole } = require('../server/domain/user');


describe('User Domain', () => {
  describe('hasSuperAdminRole', () => {
    test('Should trow an error if no roles attribute is given in the user object', () => {
      try {
        hasSuperAdminRole({
          id: 1,
          firstname: 'Any name',
          lastname: 'Any lastName',
          username: 'Any username',
        });
      } catch (error) {
        expect(error).toHaveProperty('message', `The given user has no attribute role`);
      }
    });
  });
});