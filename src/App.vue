<template>
  <v-app>
    <top-header></top-header>
    <navigation></navigation>
    <v-content app>
      <v-breadcrumbs :items="app.breadcrumbs" divider="/"></v-breadcrumbs>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import Navigation from './components/Layout/Navigation';
import TopHeader from './components/Layout/TopHeader';

export default {
  name: 'App',
  components: { Navigation, TopHeader },
  computed: mapState(['app']),
};
</script>
