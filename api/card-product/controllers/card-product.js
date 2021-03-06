'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  // Create card product with linked user
  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services['card-product'].create(data, { files });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services['card-product'].create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models['card-product'] });
  },
  async update(ctx) {
    const { id } = ctx.params;
    const targetCardProduct = await strapi.services['card-product'].findOne({ id });
    if (!targetCardProduct) {
      return ctx.unauthorized('Card product does not exist.');
    }

    const updatedBy = (targetCardProduct.updatedBy && targetCardProduct.updatedBy.length)
      ? [
        ...targetCardProduct.updatedBy.map(item => ({
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
      entity = await strapi.services['card-product'].update({ id }, data, {
        files,
      });
    } else {
      ctx.request.body.updatedBy = updatedBy;
      entity = await strapi.services['card-product'].update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models['card-product'] });
  },
  async delete(ctx) {
    const { id } = ctx.params;
    const targetCardProduct = await strapi.services['card-product'].findOne({ id });

    if (!targetCardProduct) {
      return ctx.unauthorized('Card product does not exist.');
    }

    const updatedBy = (targetCardProduct.updatedBy && targetCardProduct.updatedBy.length)
      ? [
        ...targetCardProduct.updatedBy.map(item => ({
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
      const { data } = parseMultipartData(ctx);
      data.updated_by_user = updatedBy;
      data.isActive = false;
      entity = await strapi.services['card-product'].update({ id }, data);
    } else {
      ctx.request.body.updatedBy = updatedBy;
      ctx.request.body.isActive = false;
      entity = await strapi.services['card-product'].update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models['card-product'] });
  },
};
