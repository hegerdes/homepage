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
      style="text-shadow: 1px 1px 2px #333"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
    >
      <b-carousel-slide
        img-src="~/assets/img/home-sliede-1.jpg"
        img-alt="Sunset image"
      >
        <h1>{{ owner }}</h1>
        <p>{{ ownerSlug }}</p>
      </b-carousel-slide>

      <b-carousel-slide
        img-src="~/assets/img/home-sliede-2.jpg"
        content-visible-up="sm"
        img-alt="Plant on whater image"
      >
        <h1>{{ owner }}</h1>
        <p>{{ ownerSlug }}</p>
      </b-carousel-slide>

      <b-carousel-slide
        img-src="~/assets/img/home-sliede-3.jpg"
        content-visible-up="sm"
        img-alt="Sky with mountin summit image"
      >
        <h1>{{ owner }}</h1>
        <p>{{ ownerSlug }}</p>
      </b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'HomeImage',
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
.carousel-inner {
  max-height: 650px;
}
.carousel-inner .img {
  max-height: 650px;
}
.carousel-caption {
  top: 5%;
  right: 65%;
  left: auto;
  bottom: auto;
  text-align: left;
  padding-left: 2%;
}
</style>