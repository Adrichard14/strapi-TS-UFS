'use strict';

const { SUPER_ADMIN_CODE } = require('../services/constants');

/**
 * Create a new user model by merging default and specified attributes
 * @param attributes A partial user object
 */
function createUser(attributes) {
  return {
    roles: [],
    isActive: false,
    username: null,
    ...attributes,
  };
}

const hasSuperAdminRole = (user) => {
  if (!user.roles || user.roles.length < 1) {
    throw new Error('The given user has no attribute role')
  }
  return user.roles.filter((role) => role.code === SUPER_ADMIN_CODE).length > 0;
};

const ADMIN_USER_ALLOWED_FIELDS = ['id', 'firstname', 'lastname', 'username'];

module.exports = {
  createUser,
  hasSuperAdminRole,
  ADMIN_USER_ALLOWED_FIELDS,
};
