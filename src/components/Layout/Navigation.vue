<template>
  <v-navigation-drawer app fixed clipped v-model="showNavDrawer">
    <template v-slot:prepend>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="https://pic4.zhimg.com/v2-f0934d5fd72ab1b092c4e29e991bf384_im.jpg"></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link two-line>
          <v-list-item-content>
            <v-list-item-title class="title">Smile Smith</v-list-item-title>
            <v-list-item-subtitle>longde_chen@163.com</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </template>

    <v-divider></v-divider>

    <v-list nav dense>
      <v-list-item link v-for="nav in navList" :key="nav.title" @click.stop="goNav(nav)">
        <v-list-item-icon>
          <v-icon>{{ nav.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ nav.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
import { SWITCH_NAV_DRAWER } from '../../store/type';

// @see https://dev.materialdesignicons.com/icons
const navList = [
  {
    icon: 'mdi-image-multiple',
    title: '我的图床',
    path: 'image',
  },
  {
    icon: 'mdi-post',
    title: '我的文章',
    path: 'blog',
  },
  {
    icon: 'mdi-tools',
    title: '我的工具',
    path: 'tool',
  },
];

export default {
  name: 'Navigation',
  data: () => ({
    navList,
  }),
  computed: {
    ...mapState(['app']),
    showNavDrawer: {
      get() {
        return this.$store.state.app.showNavDrawer;
      },
      set(value) {
        this.$store.commit(SWITCH_NAV_DRAWER, value);
      },
    },
  },
  methods: {
    goNav(nav) {
      this.$router.push({ path: nav.path });
    },
  },
};
</script>
