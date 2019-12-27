import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import(/* webpackChunkName: "about" */ './views/Blog.vue'),
    },
    {
      path: '/image',
      name: 'image',
      component: () => import(/* webpackChunkName: "about" */ './views/Image.vue'),
    },
    {
      path: '/tool',
      name: 'tool',
      component: () => import(/* webpackChunkName: "about" */ './views/Tool.vue'),
    },
  ],
});
