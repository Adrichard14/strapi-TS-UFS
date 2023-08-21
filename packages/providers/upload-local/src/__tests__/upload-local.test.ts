import type { File } from '@strapi/plugin-upload';
import localProvider from '../index';

jest.mock('fs', () => {
  return {
    writeFile: jest.fn((_path, _buffer, callback) => callback()),
  };
});

jest.mock('fs-extra', () => {
  return {
    pathExistsSync: jest.fn(() => true),
  };
});

describe('Local provider', () => {
  beforeAll(() => {
    globalThis.strapi = {};
    globalThis.strapi.dirs = { static: { public: '' } };
  });

  afterAll(() => {
    globalThis.strapi.dirs = undefined;
  });

  describe('upload', () => {
    test('Should have relative url to file object', async () => {
      const providerInstance = localProvider.init({});

      const file: File = {
        name: 'test',
        size: 100,
        url: '/',
        path: '/tmp/',
        hash: 'test',
        ext: '.json',
        mime: 'application/json',
        buffer: Buffer.from(''),
      };

      await providerInstance.upload(file);

      expect(file.url).toBeDefined();
      expect(file.url).toEqual('/uploads/test.json');
    });

    test('Should throw an error no buffer is provided', async () => {
      const providerInstance = localProvider.init({});

      const file: File = {
        name: 'test2',
        size: 100,
        url: '/',
        path: '/tmp/',
        hash: 'test2',
        ext: '.json',
        mime: 'application/json',
        // buffer: Buffer.from(''),
      };

      try {
        await providerInstance.upload(file);
      } catch (error) {
        expect(error).toHaveProperty('message', 'Missing file buffer');
      }
    });

    test('Should return an exception if the file to be deleted does not exists', async () => {
      const providerInstance = localProvider.init({});

      const existsSyncSpy = jest.spyOn(providerInstance, 'delete');

      const file: File = {
        name: 'test2',
        size: 100,
        url: '/',
        path: '/tmp/',
        hash: 'test2',
        ext: '.json',
        mime: 'application/json',
        buffer: Buffer.from(''),
      };

      existsSyncSpy.mockResolvedValue("File doesn't exist");

      try {
        await providerInstance.delete(file);
      } catch (error) {
        expect(error).toHaveProperty('message', "File doesn't exist");
      }
    });
  });
});
