'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async create(ctx) {
    const { user_account } = ctx.state.user  || {};
    const { cartItems } = ctx.request.body;

    if (!user_account) {
      return ctx.unauthorized('User does not exist.');
    }

    const entity = await strapi.services.cart.create({
      user_account,
      cartItems: cartItems.map(({ quantity, cardProduct }) => ({ quantity, card_product: cardProduct }))
    });
    return sanitizeEntity(entity, { model: strapi.models.cart });
  },
  async updateItems(ctx) {
    const { user_account } = ctx.state.user || {};

    if (!user_account) {
      return ctx.unauthorized('User does not exist.');
    }

    const { updateItems = [], removeItems = [] } = ctx.request.body;
    const targetCart = await strapi.services.cart.findOne({ user_account });

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
        .filter(item => {
          if (!set.has(item.card_product)) {
            set.add(item.card_product);
            return true;
          }
          return false;
        }, set)
        .map(item => {
          if (item.id !== undefined) { return item; }
          const target = targetCart.cartItems.find(ci => ci.card_product.id.toString() === item.card_product);
          return target ? { ...item, id: target.id, quantity: target.quantity + item.quantity } : item;
        });
      // And filter removed items
      const filteredNewItems = newItems.filter(ci => (
        !removeItems.some(item => ci.card_product.toString() === item.cardProduct.toString()))
      );

      entity = await strapi.services.cart.update(
        { id: targetCart.id },
        { cartItems: filteredNewItems });
    } else {
      entity = await strapi.services.cart.create({
        user_account,
        cartItems: updateItems.map(({ quantity, cardProduct }) => ({ quantity, card_product: cardProduct }))
      });
    }

    return sanitizeEntity(entity, { model: strapi.models.cart });
  },
  async clearItems(ctx) {
    const { user_account } = ctx.state.user || {};

    if (!user_account) {
      return ctx.unauthorized('User does not exist.');
    }

    const targetCart = await strapi.services.cart.findOne({ user_account });

    if (!targetCart) {
      return ctx.unauthorized('Cart not found.');
    }

    const entity = await strapi.services.cart.update(
      { id: targetCart.id },
      { cartItems: [] }
    );

    return sanitizeEntity(entity, { model: strapi.models.cart });
  },
  async clearCart(ctx) {
    const { user_account } = ctx.state.user || {};

    if (!user_account) {
      return ctx.unauthorized('User does not exist.');
    }

    const targetCart = await strapi.services.cart.findOne({ user_account });

    if (!targetCart) {
      return ctx.unauthorized('Cart not found.');
    }

    const entity = await strapi.services.cart.update(
      { id: targetCart.id },
      { cartItems: [], paymentIntent: null }
    );

    return sanitizeEntity(entity, { model: strapi.models.cart });
  },
};
