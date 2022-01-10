'use strict';

const Stripe = require('stripe');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async getStripePaymentIntent(id) {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    try {
      const rawPaymentIntent = await stripe.paymentIntents.retrieve(id);
      const { id: piid, amount, currency, customer, description, status, client_secret, created } = rawPaymentIntent;
      return {
        id: piid,
        amount,
        currency,
        customer,
        description,
        status,
        clientSecret: client_secret,
        created,
      }
    } catch (error) {
      return { response: {}, error: true }
    }
  }
};
