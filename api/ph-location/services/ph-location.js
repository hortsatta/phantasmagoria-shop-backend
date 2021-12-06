'use strict';

const axios = require('axios');
const instance = axios.create({
  baseURL: 'https://psgc.gitlab.io/api',
  timeout: 5000,
  headers: {'Content-Type': 'application/json'}
});

module.exports = {
  async findRegions() {
    try {
      const { data } = await instance.get('/island-groups.json');
      return data;
    } catch (error) {
      return { response: {}, error: true }
    }
  },
  async findProvinces(code) {
    try {
      const { data } = await instance.get(`/island-groups/${code}/provinces.json`);
      return data;
    } catch (error) {
      return { response: {}, error: true }
    }
  },
  async findCitiesMunicipalities(code) {
    try {
      const { data } = await instance.get(`/provinces/${code}/cities-municipalities.json`);
      return data;
    } catch (error) {
      return { response: {}, error: true }
    }
  },
  async findBarangays(code) {
    try {
      const { data } = await instance.get(`/cities-municipalities/${code}/barangays.json`);
      return data;
    } catch (error) {
      return { response: {}, error: true }
    }
  },
};
