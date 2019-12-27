<template>
  <v-app-bar app fixed clipped-left color="primary" dark>
    <v-app-bar-nav-icon class="hidden-lg-and-up" @click.stop="switchNavDrawer"></v-app-bar-nav-icon>
    <div class="d-flex align-center">
      <v-img
        alt="Logo"
        class="shrink mr-2"
        contain
        src="./../../assets/logo.png"
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
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'top-header',
  computed: mapState(['app']),
  methods: mapMutations(['switchNavDrawer']),
};
</script>
