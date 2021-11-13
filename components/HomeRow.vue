<template>
  <b-container fluid>
    <b-row align-v="center" class="mt-4">
      <b-col class="text-center">
        <h1 style="letter-spacing: 8px">{{hometitle}}</h1>
      </b-col>
    </b-row>
    <b-row align-self-stretch justify-content-md-center>
      <b-col class="d-flex justify-content-center my-4">
        <b-card
          :img-src="homeimg"
          img-alt="Card Image"
          text-variant="white"
          no-body
          style="max-width: 60rem"
        >
        </b-card>
      </b-col>
    </b-row>
    <b-row align-v="center" class="my-5">
      <b-col class="text-center">
        <h3 style="line-height: 150%; letter-spacing: 5px">
          {{ homemsg }}
        </h3>
      </b-col>
    </b-row>
    <b-row align-v="center" class="mb-3">
      <b-col class="text-center">
        <h4 class="stealth-link stealth-link-inv">
          <a href="#first">VIEW PROJECTS</a>
        </h4>
      </b-col>
    </b-row>
  </b-container>
</template>



<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'HomeImage',
  props: ['homeimg', 'homemsg', 'hometitle'],
  data() {
    return {
      slide: 0,
      sliding: false,
      owner: process.env.PAGE_OWNER,
      ownerSlug: process.env.PAGE_OWNER_SLUG,
    }
  },
  methods: {
    onSlideStart() {
      this.sliding = true
    },
    onSlideEnd() {
      this.sliding = false
    },
  },
})
</script>

<style>

</style>