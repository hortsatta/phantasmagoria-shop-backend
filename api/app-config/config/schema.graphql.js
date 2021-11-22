module.exports = {
  definition: `
    scalar Modules

    type AppModule {
      modules: Modules
    }
  `,
  query: `
    appModules: AppModule
  `,
  type: {},
  resolver: {
    Query: {
      appModules: {
        description: 'Return the app modules',
        resolver: 'application::app-config.app-config.modules',
      }, 
    },
  },
};
