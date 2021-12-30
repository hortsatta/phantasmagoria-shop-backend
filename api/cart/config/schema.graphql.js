module.exports = {
  definition: `
    extend input ComponentCartItemCartItemInput {
      cardProduct: ID
    }
  `,
  mutation: `
    updateCartItems(updateItems: [ComponentCartItemCartItemInput], removeItems: [ComponentCartItemCartItemInput]): Cart
    clearCartItems: Cart
  `,
  type: {},
  resolver: {
    Mutation: {
      updateCartItems: {
        description: 'Add and remove cart items from current user',
        resolver: 'application::cart.cart.updateItems',
      },
      clearCartItems: {
        description: 'Clear all cart items from current user',
        resolver: 'application::cart.cart.clearItems',
      }
    },
  },
};
