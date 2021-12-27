'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async updateItems(ctx) {
    const { user_account } = ctx.state.user;
    const { updateItems = [], removeItems = [] } = ctx.request.body;
    const targetCart = await strapi.services['cart'].findOne({ user_account });

    if (!updateItems.length && !removeItems.length) {
      return ctx.unauthorized('No item to update.');
    }

    let entity;
    if (targetCart) {
      const mergedItems = [
        ...updateItems.map(({ quantity, cardProduct }) => ({ quantity, card_product: cardProduct })),
        ...targetCart.cartItems.map(({ id, quantity, card_product }) => ({ id, quantity, card_product: card_product.id.toString() })),
      ];
      const set = new Set();
      // Remove duplicates
      const newItems = mergedItems
        .map(item => {
          if (!set.has(item.card_product)) {
            set.add(item.card_product);
            const target = mergedItems.find(mi => mi.card_product === item.card_product && mi.id !== undefined)
            return target ? { ...item, id: target.id } : item;
          }
          return null;
        }, set)
        .filter(item => !!item);
      // And filter removed items
      const filteredNewItems = newItems.filter(ci => (
        !removeItems.some(item => ci.card_product.toString() === item.cardProduct.toString()))
      );

      entity = await strapi.services['cart'].update(
        { id: targetCart.id },
        { cartItems: filteredNewItems });
    } else {
      entity = await strapi.services['cart'].create({
        user_account,
        cartItems: updateItems.map(({ quantity, cardProduct }) => ({ quantity, card_product: cardProduct }))
      });
    }

    return sanitizeEntity(entity, { model: strapi.models['cart'] });
  },
};
