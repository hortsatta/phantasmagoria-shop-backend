module.exports = {
  definition: `
    type PaymentIntent {
      id: ID
      amount: Float
      currency: String
      customer: String
      description: String
      status: String
      clientSecret: String
      created: Int
    }
  `,
  query: `
    paymentIntent(id: ID!): PaymentIntent
  `,
  mutation: `
    upsertPaymentIntent: PaymentIntent
  `,
  type: {},
  resolver: {
    Query: {
      paymentIntent: {
        description: 'Get customer stripe payment intent',
        resolverOf: 'application::order.order.getPaymentIntent',
        resolver:  async (obj, options) => {
          const { id } = options;
          const data = await strapi.services.order.getStripePaymentIntent(id);
          return data;
        }
      }
    },
    Mutation: {
      upsertPaymentIntent: {
        description: 'Create or update stripe payment intent',
        resolver: 'application::order.order.upsertPaymentIntent',
      }
    },
  },
};
