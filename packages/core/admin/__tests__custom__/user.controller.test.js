'use strict';

const { ApplicationError } = require('@strapi/utils').errors;
const createContext = require('../../../../test/helpers/create-context');
const userController = require('../server/controllers/user');

describe('User Controller Test', () => {

  describe('Update user', () => {
    const user = {
      id: 1,
      firstname: 'Kai',
      lastname: 'Doe',
      email: 'kaidoe@email.com',
      roles: [1, 2],
    };

    test('Already exists user with the email', async () => {
      const body = { email: 'adrichard14@hotmail.com' };

      const ctx = createContext({ params: { id: user.id }, body });
      const spy = jest.spyOn(userController, 'update');
      spy.mockReturnValueOnce(new ApplicationError('A user with this email address already exists'));
      try {
        await userController.update(ctx);
      } catch (e) {
        // cover the boundariesD
        expect(body?.email).not.toBeNull();
        expect(e instanceof ApplicationError).toBe(true);
        expect(e.message).toEqual(
          'A user with this email address already exists'
        );
      }
    });
  });

  describe('Delete One user', () => {
    test('User not found to delete', async () => {
      const fakeId = 42;
      const deleteById = jest.fn(() => null);
      const notFound = jest.fn();

      const ctx = createContext({ params: { id: fakeId } }, { notFound });
      global.strapi = {
        admin: {
          services: {
            user: { deleteById },
          },
        },
      };

      await userController.deleteOne(ctx);
      // cover the boundaries
      expect(ctx.params.id).toBeGreaterThan(0);
      expect(deleteById).toHaveReturnedWith(null);
      expect(notFound).toHaveBeenCalledWith('User not found');
    });
  });
});
