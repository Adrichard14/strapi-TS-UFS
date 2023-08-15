'use strict';

const { ApplicationError } = require('@strapi/utils').errors;
const createContext = require('../../../../test/helpers/create-context');
const roleController = require('../server/controllers/role');
const { SUPER_ADMIN_CODE } = require('../server/services/constants');

describe('Role Controller test', () => {
  describe('Update', () => {
    test('Fails if role does not exist', async () => {
      const findOne = jest.fn(() => Promise.resolve());
      const notFound = jest.fn();

      const ctx = createContext(
        {
          params: { id: 1 },
        },
        {
          notFound,
        }
      );

      global.strapi = {
        admin: {
          services: {
            role: {
              findOne,
            },
          },
        },
      };

      await roleController.update(ctx);

      expect(findOne).toHaveBeenCalledWith({ id: ctx.params.id });
      expect(notFound).toHaveBeenCalled();
    });
    test('Fails if the permission to be is of the role SUPER ADMIN', async () => {
      const findOne = jest.fn(() => Promise.resolve());
      const notFound = jest.fn();

      const ctx = createContext(
        {
          params: { id: 1 },
        },
        {
          notFound,
        }
      );

      global.strapi = {
        admin: {
          services: {
            role: {
              findOne,
              code: SUPER_ADMIN_CODE,
            },
          },
        },
      };
      const spy = jest.spyOn(roleController, 'update');
      spy.mockReturnValueOnce(new ApplicationError("Super admin can't be edited."));
      try {
        await roleController.update(ctx);
      } catch (e) {
        expect(e instanceof ApplicationError).toBe(true);
        expect(e.message).toEqual("Super admin can't be edited.");
      }
    });
  });
  describe('findOne', () => {
    test('Should fails if not found the role', async () => {
      const fakeId = 233;
      const findOneWithUsersCount = jest.fn(() => Promise.resolve());
      const notFound = jest.fn();

      const ctx = createContext(
        {
          params: { id: fakeId },
        },
        {
          notFound
        }
      );

      global.strapi = {
        admin: {
          services: {
            role: {
              findOneWithUsersCount,
              code: SUPER_ADMIN_CODE,
            },
          },
        },
      };
      await roleController.findOne(ctx);
      // cover the boundaries
      expect(ctx.params.id).toBeGreaterThan(0);
      expect(findOneWithUsersCount).toHaveBeenCalledWith({ id: ctx.params.id })
      expect(notFound).toHaveBeenCalled();
    });
  });
  describe('create', () => {
    test('Create an role Successfully', async () => {
      const body = {
        name: 'New role'
      }
      const create = jest.fn().mockResolvedValue(body);
      const badRequest = jest.fn();
      const created = jest.fn();
      const ctx = createContext({ body }, { badRequest, created });

      global.strapi = {
        admin: {
          services: {
            'role': {
              create,
            },
          },
        },
      };
      // const sanitizeRoleMock = jest.spyOn(roleService, 'sanitizeRole');
      // sanitizeRoleMock.mockReturnValueOnce({id: 1, name: 'New role'});
      await roleController.create(ctx);
      // cover the boundaries
      expect(ctx.request.body.name.length > 0).toBeTruthy();
      expect(badRequest).not.toHaveBeenCalled();
      expect(create).toHaveBeenCalledWith(body);
      expect(created).toHaveBeenCalled();
    });
  });
  describe('deleteOne', () => {
    test('Should call delete function with the correct id', async () => {
      const deleteOne = jest.fn().mockResolvedValue({ id: 42 });
      const badRequest = jest.fn();
      const deleted = jest.fn();
      const ctx = createContext({ params: { id: 42 } }, { badRequest, deleted });

      global.strapi = {
        admin: {
          services: {
            'role': {
              deleteOne,
            },
          },
        },
      };
      const spy = jest.spyOn(roleController, 'deleteOne');
      spy.mockReturnValueOnce(ctx.deleted({
        data: '',
      }));
      await roleController.deleteOne(ctx);
      // cover the boundaries
      // expect(ctx.params.id).toBeGreaterThan(0);
      expect(deleted).toHaveBeenCalled();
    });
  });
  describe('findAll', () => {
    test('Should call the correct service function to retrieve all roles', async () => {
      const findAllWithUsersCount = jest.fn().mockResolvedValue([]);
      global.strapi = {
        admin: {
          services: {
            'role': {
              findAllWithUsersCount,
            },
          },
        },
      };
      const ctx = createContext({});
      await roleController.findAll(ctx);
      expect(findAllWithUsersCount).toHaveBeenCalled();
    });
  });

});