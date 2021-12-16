'use strict';

module.exports = {
  async findRegions(ctx) {
    try {
      const data = await strapi.services['ph-location'].findRegions();
      return ctx.send(data);
    } catch (error) {
      console.error(error);
    }
  },
  async findProvinces(ctx) {
    try {
      const { code } = ctx.params;
      const data = await strapi.services['ph-location'].findProvinces(code);
      return ctx.send(data);
    } catch (error) {
      console.error(error);
    }
  },
  async findCitiesMunicipalities(ctx) {
    try {
      const { code } = ctx.params;
      const data = await strapi.services['ph-location'].findCitiesMunicipalities(code);
      return ctx.send(data);
    } catch (error) {
      console.error(error);
    }
  },
  async findBarangays(ctx) {
    try {
      const { code } = ctx.params;
      const data = await strapi.services['ph-location'].findBarangays(code);
      return ctx.send(data);
    } catch (error) {
      console.error(error);
    }
  }
};
