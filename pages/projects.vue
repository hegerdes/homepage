<template>
  <div id="main">
    <Navbar />
    <HomeRow :hometitle="'CODE REPOSITORY'" :homeimg="homeimg" :homemsg="'JAVA | C/C++ | Python | WEB | IT-Sec'"/>
    <ProjectEntry/>
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/PageFooter.vue'
import HomeRow from '~/components/HomeRow.vue'
import ProjectEntry from '~/components/ProjectEntry.vue'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

export default Vue.extend({
  components: { Navbar, Footer, HomeRow, ProjectEntry },
  data() {
    return {
      homeimg: '/img/code.jpg',
    }
  },
})
</script>
