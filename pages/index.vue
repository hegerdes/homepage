<template>
  <div id="main">
    <div>
      <Navbar/>
    </div>
    <div>
      <div>
        <h1>HENRIK GERDES</h1>
        <h3>
          an university student form Osnabrück with passion for coding.
        </h3>
      </div>
      <!-- <div class="homeSouth">
        <h4>
          <a class="stealthLink subTitle" style="color: white;" href="#me">Read More</a>
        </h4>
        <button class="smoothScrollBtn " type="button">
          <img src="static/img/icon/arrow_white.png" width="30" />
        </button>
      </div> -->
    </div>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import Navbar from '~/components/Navbar.vue'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

export default Vue.extend({
  components: { Navbar },})
</script>
