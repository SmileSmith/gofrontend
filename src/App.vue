<template>
  <v-app>
    <top-header></top-header>
    <navigation></navigation>
    <v-content app>
      <v-breadcrumbs :items="app.breadcrumbs" divider="/"></v-breadcrumbs>
      <router-view />
    </v-content>
    <bottom-footer></bottom-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import Navigation from './components/Layout/Navigation';
import TopHeader from './components/Layout/TopHeader';
import BottomFooter from './components/Layout/BottomFooter';

export default {
  name: 'App',
  components: { Navigation, TopHeader, BottomFooter },
  computed: mapState(['app']),
};
</script>
