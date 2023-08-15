'use strict';

const userDomain = require('../server/domain/user');


describe('User Domain', () => {
  describe('hasSuperAdminRole', () => {
    test('Should trow an error if no roles attribute is given in the user object', () => {
      const body = {
        id: 1,
        firstname: 'Any name',
        lastname: 'Any lastName',
        username: 'Any username',
      };
      const hasSuperAdminRoleSpy = jest.spyOn(userDomain, 'hasSuperAdminRole');
      try {
        userDomain.hasSuperAdminRole(body);
      } catch (error) {
        expect(hasSuperAdminRoleSpy).toHaveBeenCalledWith(body);
        // Cover the boundaries
        expect(body?.role).toBe(undefined);
        expect(error).toHaveProperty('message', `The given user has no attribute role`);
      }
    });
  });
});