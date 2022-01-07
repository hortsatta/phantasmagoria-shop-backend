'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async updateItems(ctx) {
    const { user_account } = ctx.state.user;
    const { addItems = [], removeItems = [] } = ctx.request.body;
    const targetFav = await strapi.services.favorite.findOne({ user_account });

    let entity;
    if (targetFav) {
      const mergedItems = [...addItems.map(item => ({ id: item })), ...targetFav.card_products];
      const set = new Set();
      // Remove duplicates
      const newItems = mergedItems.filter(item => {
        if (!set.has(item.id)) {
          set.add(item.id);
          return true;
        }
        return false;
      }, set);
      // And filter removed items
      const filteredNewItems = newItems
        .filter(cp => !removeItems.some(item => cp.id.toString() === item.toString()))
        .map(cp => cp.id)

      entity = await strapi.services.favorite.update(
        { id: targetFav.id },
        { card_products: filteredNewItems });
    } else {
      entity = await strapi.services.favorite.create({
        user_account,
        card_products: addItems.map(item => ({ id: item }))
      });
    }
 
    return sanitizeEntity(entity, { model: strapi.models.favorite });
  },
};
