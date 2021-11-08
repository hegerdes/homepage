<template>
  <div id="main">
    <Navbar/>
    <HomeRow :hometitle="'THEORETICAL WORK'" :homeimg="'/img/paper1.png'" :homemsg="'Essays | Papers | Presentations | Thesis'"/>
    <Footer/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import Navbar from '~/components/Navbar.vue'
import HomeRow from '~/components/HomeRow.vue'
import Footer from '~/components/PageFooter.vue'


Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

export default Vue.extend({
  components: { Navbar, Footer, HomeRow },})
</script>
