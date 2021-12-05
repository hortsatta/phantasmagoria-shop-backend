'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  // Create order with linked user
  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services.order.create(data, { files });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services.order.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.order });
  },
  async update(ctx) {
    const { id } = ctx.params;

    const targetOrder = await strapi.services.order.findOne({ id });

    if (!targetOrder) {
      return ctx.unauthorized('Order does not exist.');
    }

    const updatedBy = (targetOrder.updatedBy && targetOrder.updatedBy.length)
      ? [
        ...targetOrder.updatedBy.map(item => ({
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
      entity = await strapi.services.order.update({ id }, data, {
        files,
      });
    } else {
      ctx.request.body.updatedBy = updatedBy;
      entity = await strapi.services.order.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.order });
  },
};
