<template>
  <div id="main">
    <div>
      <Navbar />
    </div>
    <div>
    <HomeImage />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import Navbar from '~/components/Navbar.vue'
import HomeImage from '~/components/HomeImage.vue'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

export default Vue.extend({
  components: { Navbar, HomeImage },
})
</script>

    HomeImage