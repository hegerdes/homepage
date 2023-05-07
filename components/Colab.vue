<template>
  <b-container fluid>
    <b-row class="justify-content-center">
      <b-col class="justify-content-center my-4">
        <div class="collab">
          <h3>FOUND A BUG?</h3>
          <p>Let me know</p>
          <b-button size="lg" variant="success" href="https://github.com/hegerdes" >GitHub</b-button>

        </div>
      </b-col>
      <b-col class="justify-content-center my-4">
        <div class="collab">
          <h3>CONTRIBUTE HERE</h3>
          <p>Take part in the project</p>
          <b-button size="lg" href="#contact" >Contact Me</b-button>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'Colab',
})
</script>

<style>
.collab {
  min-height: 30em;
  text-align: center;
}
</style>
