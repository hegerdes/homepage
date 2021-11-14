<template>
  <div>
    <a name="first"></a>
    <b-container>
      <b-row class="align-self-stretch justify-content-md-center my-5"> </b-row>
      <b-col class="my-5">
        <!-- <h1 style="text-align: center">COOMING SOON ...</h1> -->
      </b-col>
    </b-container>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'BlogEntry',
  props: ['blogcontent'],
})
</script>

<style >
</style>