<template>
  <div>
    <Navbar />
    <BlogSidebar/>
    <article>
      <b-row class="blog-side">
        <b-col class="ml-5 ">
          <Nuxt />
        </b-col>
      </b-row>
    </article>
    <Footer />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/PageFooter.vue'
import BlogSidebar from '~/components/BlogSidebar.vue'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

export default Vue.extend({
  components: { Navbar, Footer, BlogSidebar },
})
</script>

<style>
.nuxt-content h1 {
  color: aqua;
}

.blog-side {
    margin-right: 20em;
}

@media (max-width: 766px) {
.blog-side {
    margin-right: 5em;
}
}


</style>
