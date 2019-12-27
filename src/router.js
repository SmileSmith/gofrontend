import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, ...args) {
  if (this.app.$route.path === `/${location.path}`) return;
  return originalPush.call(this, location, ...args);
};

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
      component: () => import(/* webpackChunkName: "blog" */ './views/Blog.vue'),
    },
    {
      path: '/image',
      name: 'image',
      component: () => import(/* webpackChunkName: "image" */ './views/Image.vue'),
    },
    {
      path: '/tool',
      name: 'tool',
      component: () => import(/* webpackChunkName: "tool" */ './views/Tool.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
