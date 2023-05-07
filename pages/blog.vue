<template>
  <div id="main">
    <Navbar />
    <HomeRow
      :hometitle="'BLOG STUFF...'"
      :homeimg="'/img/blog_narrow.png'"
      :homemsg="'Blog Posts'"
    />
    <BlogEntry />
    <v-container v-if="articles.length > 0">
      <v-row v-for="n in Math.floor(articles.length / 2)" :key="n" class="mx-4">
        <v-col
          v-for="(val, index) in articles.slice((n - 1) * 2, (n - 1) * 2 + 2)"
          :key="index"
          class="d-flex justify-content-center my-4"
        >
          <v-card
            class="d-flex flex-no-wrap card-outter my-card"
            :href="'/articles/' + val.path.split('/')[3]"
            color="blue"
            dark
            :max-width="max_width"
          >
            <div>
              <v-img
                class="align-end"
                max-height="350"
                :max-width="max_width"
                :src="val.pic"
              ></v-img>
              <v-card-title class="text-h5" v-text="val.title"></v-card-title>

              <v-card-subtitle v-text="val.description"> </v-card-subtitle>
              <v-card-actions class="card-actions">
                <v-btn
                  :href="'/articles/' + val.path.split('/')[3]"
                  text
                  color="deep-purple accent-4"
                >
                  Read More
                </v-btn>
              </v-card-actions>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <Footer />
  </div>
</template>

<script lang='ts'>
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
  data() {
    return {
      max_width: 500,
      articles: [],
    }
  },

  async fetch() {
    this.articles = await this.$ssrContext
      .$content('articles', { deep: true })
      .only(['title', 'description', 'date', 'pic', 'path'])
      .sortBy('date', 'desc')
      .fetch()
  },
  mounted() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
    if (window && window.innerWidth < 450) {
        this.max_width = 320
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      if (window.innerWidth < 450) {
        this.max_width = 320
      }else{
        this.max_width = 500
      }
    },
  },

})
</script>

<style scoped>
.card-outter {
  padding-bottom: 50px;
}
.card-actions {
  position: absolute;
  bottom: 0;
}

@media (max-width: 800px) {
  .my-card {
    margin-left: 10% !important;
    margin-right: 10% !important;
  }
}
</style>
