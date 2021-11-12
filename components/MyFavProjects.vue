<template>
  <b-container fluid class="p-4">
    <b-row align-v="center" class="mt-4">
      <b-col>
        <h2 class="centerTitle">My Favorite Projects</h2>
      </b-col>
    </b-row>

    <b-row class="align-self-stretch justify-content-md-center my-2">
      <b-col
        v-for="(val, index) in projectontent.content.slice(
          0,
          projectontent.cols
        )"
        :key="index"
        :val="val"
        :index="index"
        :md="12 / projectontent.cols"
        class="d-flex justify-content-center my-4"
      >
        <b-card
          :title="val.title"
          :img-src="val.pic"
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 25rem"
          class="h-100"
        >
          <b-card-text>
            A round based 2D strategy game with 3D PvP fights.
          </b-card-text>
          <b-card-text>
            Its basically a collection of my C++ skills. Including
            Templates,Boost, QT, OpenGL and SDL.
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
    <b-row align-v="center">
      <b-col class="text-center"
        ><b-button href="view/content/projects.html" size="lg"
          >Learn More</b-button
        ></b-col
      >
    </b-row>
  </b-container>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'MyFavProjects',
  props: ['projectontent'],
  data() {
    return {}
  },
})
</script>

