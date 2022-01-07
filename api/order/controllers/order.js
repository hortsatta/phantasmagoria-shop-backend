'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const Stripe = require('stripe');

module.exports = {
  // Create order with linked user
  async create(ctx) {
    const { user_account } = ctx.state.user || {};

    if (!user_account) {
      return ctx.unauthorized('User does not exist.');
    }

    ctx.request.body.user_account = user_account;
    ctx.request.body.date = new Date();
    const entity = await strapi.services.order.create(ctx.request.body);
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
  // Upsert stripe payment intent
  async upsertPaymentIntent(ctx) {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const { user_account } = ctx.state.user || {};
    // Return if user account or user cart does not exist.
    if (!user_account) {
      return ctx.unauthorized('User does not exist.');
    }

    const targetCart = await strapi.services.cart.findOne({ user_account });

    if (!targetCart) {
      return ctx.unauthorized('Cart does not exist.');
    }

    // Get cart items and stripe payment intent,
    // then recalculate total amount in cents.
    const { paymentIntent: cartPaymentIntent,  cartItems } = targetCart  || {};
    const totalPrice = cartItems.reduce((t, value) => {
      const { card_product, quantity } = value;
      return t + (card_product.price * quantity);
    }, 0);
    const amount = totalPrice * 100;
    // If stripe payment intent id does not exist on user's cart,
    // then create new payment intent and update cart.
    // Else, update existing payment intent. Finally, return client secret key.
    try {
      let clientSecret;
      if (!cartPaymentIntent) {
        const { id: paymentIntentId, client_secret } = await stripe.paymentIntents.create({
          amount,
          currency: 'usd',
          automatic_payment_methods: {
            enabled: true,
          },
        });
        await strapi.services.cart.update(
          { id: targetCart.id },
          { paymentIntent: paymentIntentId }
        );
        clientSecret = client_secret;
      } else {
        const { client_secret } = await stripe.paymentIntents.update(cartPaymentIntent, { amount });
        clientSecret = client_secret;
      }
      return ctx.send({ clientSecret });
    } catch (error) {
      return ctx.serverUnavailable(`We've encountered a problem.`);
    }
  },
};
