<template>
  <div id="main">
    <Navbar />
    <HomeRow
      :hometitle="'BLOG STUFF...'"
      :homeimg="'/img/blog_narrow.png'"
      :homemsg="'Plog Posts'"
    />
    <BlogEntry />
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import Navbar from '~/components/Navbar.vue'
import HomeRow from '~/components/HomeRow.vue'
import BlogEntry from '~/components/BlogEntry.vue'
import Footer from '~/components/PageFooter.vue'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

export default Vue.extend({
  components: { Navbar, Footer, HomeRow, BlogEntry },
  // async asyncData({ $content }) {
  //   const page = await $content('hello').fetch()

  //   return {
  //     page,
  //   }
  // },
})
</script>
