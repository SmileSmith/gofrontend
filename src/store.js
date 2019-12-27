import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    app: {
      showNavDrawer: true,
      breadcrumbs: [],
    },
  },
  mutations: {
    switchNavDrawer(state) {
      state.app.showNavDrawer = !state.app.showNavDrawer;
    },
  },
  actions: {},
});
