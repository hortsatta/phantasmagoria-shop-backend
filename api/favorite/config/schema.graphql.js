module.exports = {
  definition: ``,
  mutation: `
    updateFavoriteItems(addItems: [ID], removeItems: [ID]): Favorite
  `,
  type: {},
  resolver: {
    Mutation: {
      updateFavoriteItems: {
        description: 'Add and remove favorite items from currennt user',
        resolver: 'application::favorite.favorite.updateItems',
      }
    },
  },
};
