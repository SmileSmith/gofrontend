<template>
  <v-app>
    <v-app-bar app fixed clipped-left color="primary" dark>
      <v-app-bar-nav-icon class="hidden-lg-and-up" @click.stop="showNavDrawer = !showNavDrawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
          alt="Logo"
          class="shrink mr-2"
          contain
          src="./assets/logo.png"
          transition="scale-transition"
          width="40"
        />

        <v-toolbar-title>Go Frontend</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
        <span class="mr-2">Github</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <Navigation v-model="showNavDrawer"></Navigation>
    <v-content app>
      <v-breadcrumbs :items="items" divider="/"></v-breadcrumbs>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import Navigation from './components/Navigation';
export default {
  name: 'App',
  components: { Navigation },
  data: () => ({
    showNavDrawer: true,
    items: [],
  }),
};
</script>
