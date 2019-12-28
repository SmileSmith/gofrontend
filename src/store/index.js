import Vue from 'vue';
import Vuex from 'vuex';
import { SWITCH_NAV_DRAWER } from './type';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    app: {
      showNavDrawer: true,
      breadcrumbs: [],
    },
  },
  mutations: {
    [SWITCH_NAV_DRAWER](state, payload) {
      if (typeof payload === 'boolean') {
        state.app.showNavDrawer = payload;
        return;
      }
      state.app.showNavDrawer = !state.app.showNavDrawer;
    },
  },
  actions: {},
});
