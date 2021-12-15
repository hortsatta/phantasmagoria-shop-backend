module.exports = {
  definition: `
    type PhLocRegion {
      code: ID!
      name: String
    }

    type PhLocProvince {
      code: ID!
      name: String
      islandGroupCode: String
    }

    type PhLocMunicipality {
      code: ID!
      name: String
      oldName: String
      isCapital: Boolean
      isCity: Boolean
      isMunicipality: Boolean
      provinceCode: String
      islandGroupCode: String
    }

    type PhLocBarangay {
      code: ID!
      name: String
      oldName: String
      cityCode: String
      municipalityCode: String
      provinceCode: String
      islandGroupCode: String
    }
  `,
  query: `
    phLocRegions: [PhLocRegion]
    phLocProvinces(regionCode: ID!): [PhLocProvince]
    phLocMunicipalities(provinceCode: ID!): [PhLocMunicipality]
    phLocBarangays(municipalityCode: ID!): [PhLocBarangay]
  `,
  type: {},
  resolver: {
    Query: {
      phLocRegions: {
        description: 'Return the PH regions',
        resolver: 'application::ph-location.ph-location.findRegions',
      },
      phLocProvinces: {
        description: 'Return the PH provinces by region code',
        resolverOf: 'application::ph-location.ph-location.findProvinces',
        resolver: async (obj, options) => {
          const { regionCode } = options;
          const data = await strapi.services['ph-location'].findProvinces(regionCode);
          return data;
        }
      },
      phLocMunicipalities: {
        description: 'Return the PH municipalities by province code',
        resolverOf: 'application::ph-location.ph-location.findCitiesMunicipalities',
        resolver: async (obj, options) => {
          const { provinceCode } = options;
          const data = await strapi.services['ph-location'].findCitiesMunicipalities(provinceCode);
          return data;
        }
      },
      phLocBarangays: {
        description: 'Return the PH municipalities by province code',
        resolverOf: 'application::ph-location.ph-location.findBarangays',
        resolver: async (obj, options) => {
          const { municipalityCode } = options;
          const data = await strapi.services['ph-location'].findBarangays(municipalityCode);
          return data;
        }
      },
    },
  },
};
