<template>
  <div id="main">
    <Navbar/>
    <HomeRow :hometitle="'THEORETICAL WORK'" :homeimg="'/img/paper1.png'" :homemsg="'Papers | Certs | Presentations | Thesis'"/>
    <PaperEntry :papers="papers"/>
    <Footer/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import Navbar from '~/components/Navbar.vue'
import HomeRow from '~/components/HomeRow.vue'
import PaperEntry from '~/components/PaperEntry.vue'
import Footer from '~/components/PageFooter.vue'
import mixData from '~/content/mix-content.json'


Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

export default Vue.extend({
  components: { Navbar, Footer, HomeRow, PaperEntry },
  data() {
    return {
      papers: mixData.papers
    }
  }})
</script>
