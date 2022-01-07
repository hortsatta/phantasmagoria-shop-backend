module.exports = {
  definition: `
    type PaymentIntent {
      clientSecret: String
    }
  `,
  mutation: `
    upsertPaymentIntent: PaymentIntent
  `,
  type: {},
  resolver: {
    Mutation: {
      upsertPaymentIntent: {
        description: 'Create or update stripe payment intent',
        resolver: 'application::order.order.upsertPaymentIntent',
      }
    },
  },
};
