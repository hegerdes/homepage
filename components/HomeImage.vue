<template>
  <div>
    <b-carousel
      id="carousel-1"
      v-model="slide"
      :interval="4000"
      controls
      fade
      indicators
      background="#ababab"
      img-width="1024"
      img-height="480"
      class="d-flex align-items-center justify-content-center min-vh-90"
      style="text-shadow: 1px 1px 2px #333"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
    >
      <b-carousel-slide
        v-for="(val, index) in homeRowContent"
        :key="index"
        :img-src="val.pic"
        content-visible-up="sm"
        img-alt="Image Carusel"
      >
        <h1>{{ owner }}</h1>
        <p>{{ val.msg }}</p>
      </b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'HomeImage',
  props: ['homeRowContent'],
  data() {
    return {
      slide: 0,
      sliding: false,
      owner: process.env.PAGE_OWNER,
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

.carousel-caption {
  top: 5%;
  right: 65%;
  left: auto;
  bottom: auto;
  text-align: left;
  padding-left: 2%;
}
</style>