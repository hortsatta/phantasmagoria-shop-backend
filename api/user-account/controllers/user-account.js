'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  // Create user account with linked user
  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services['user-account'].create(data, { files });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services['user-account'].create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models['user-account'] });
  },
  async update(ctx) {
    const { id } = ctx.params;

    const targetUserAccount = await strapi.services['user-account'].findOne({ id });

    if (!targetUserAccount) {
      return ctx.unauthorized('Card product does not exist.');
    }

    const updatedBy = (targetUserAccount.updatedBy && targetUserAccount.updatedBy.length)
      ? [
        ...targetUserAccount.updatedBy.map(item => ({
          user: item.user.id,
          datetime: item.datetime
        })),
        {
          user: ctx.state.user.id,
          datetime: Date.now(),
        },
      ] : [{
        user: ctx.state.user.id,
        datetime: Date.now(),
      }];

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.updated_by_user = updatedBy;
      entity = await strapi.services['user-account'].update({ id }, data, {
        files,
      });
    } else {
      ctx.request.body.updatedBy = updatedBy;
      entity = await strapi.services['user-account'].update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models['user-account'] });
  },
};
