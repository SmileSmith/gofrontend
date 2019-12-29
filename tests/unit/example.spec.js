import { shallowMount } from '@vue/test-utils';
import About from '@/views/About.vue';
import Vue from 'vue';
import Vuex from 'vuex';
import store from '@/store';

Vue.use(Vuex);

describe('About.vue', () => {
  it('text: This is an about page', () => {
    const AboutComponent = shallowMount(About, { store });
    expect(AboutComponent.text()).toEqual('This is an about page');
  });
});
