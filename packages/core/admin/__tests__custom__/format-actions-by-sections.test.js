'use strict';

const formatActionsBySections = require('../server/controllers/formatters/format-actions-by-sections');

describe('Format actions by sections', () => {
  describe('formatActionsBySections', () => {
    test('Should return false if formatActionsBySections is called with an string instead an array', () => {
      const actions = 'settings';
      const result = formatActionsBySections(actions);

      expect(result).toBe(false);
    });

    test('Should trow an error if section is unknown', () => {
      const uknownType = 'unknown';
      const actions = [
        {
          uid: 'api-te.teste',
          displayName: 'Read',
          pluginName: 'admin',
          section: 'settings',
          category: 'api teste',
          subCategory: 'general',
        },
        {
          uid: 'api-te.teste',
          displayName: 'teste',
          pluginName: 'teste',
          section: uknownType,
          category: 'api teste',
          subCategory: 'general',
        },
      ];
      try {
        formatActionsBySections(actions);
      } catch (error) {
        expect(error).toHaveProperty('message', `Unknown section ${uknownType}`);
      }
    });
  });
});