<template>
  <v-card class="mx-auto" max-width="344">
    <v-img
      :src=" pic || 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg'"
      height="100px"
    ></v-img>

    <v-card-title>
      <a :href="path">{{ title }} </a>
    </v-card-title>

    <v-card-subtitle>
      {{ desc }}
    </v-card-subtitle>
    <v-card-actions>
      <v-spacer></v-spacer>
<!--
      <v-btn icon>
        <v-icon>mdi-bookmark</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-share-variant</v-icon>
      </v-btn> -->
    </v-card-actions>
  </v-card>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'ArticleCard',
  props: ['img', 'title', 'desc' , 'path', 'pic'],
})
</script>

<style>
</style>
