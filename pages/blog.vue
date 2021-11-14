<template>
  <div id="main">
    <Navbar />
    <HomeRow
      :hometitle="'BLOG STUFF...'"
      :homeimg="'/img/blog_narrow.png'"
      :homemsg="'Plog Posts'"
    />
    <BlogEntry />
    <b-container v-if="articles.length > 0">
      <b-row v-for="n in articles.length / 2" :key="n" class="mx-4">
        <b-col
          v-for="(val, index) in articles.slice((n - 1) * 2, (n - 1) * 2 + 2)"
          :key="index"
          class="d-flex justify-content-center my-4"
        >
          <v-card color="blue" dark>
            <div class="d-flex flex-no-wrap justify-space-between">
              <v-avatar class="ma-3" size="125" tile>
                <v-img :src="val.pic"></v-img>
              </v-avatar>
              <div>
                <v-card-title class="text-h5" v-text="val.title"></v-card-title>

                <v-card-subtitle v-text="val">
                  {{val}}
                </v-card-subtitle>

                <v-card-actions>
                  <v-btn
                    :href="'/articles/' + val.path.split('/')[3]"
                    text
                    color="deep-purple accent-4"
                  >
                    Read More
                  </v-btn>
                </v-card-actions>
              </div>
            </div>
          </v-card>
        </b-col>
      </b-row>
    </b-container>
    <Footer />
  </div>
</template>

<script >
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
  // async asyncData({ $content, error }) {
  //   let articles = await $content('articles', { deep: true })
  //     .only(['title', 'description', 'date', 'pic'])
  //     .sortBy('date', 'desc')
  //     .fetch()
  //     .catch(() => {
  //       error({ statusCode: 404, message: 'Page not found' })
  //     })
  //   if (!articles) {
  //     articles = []
  //   }

  //   return {
  //     articles,
  //   }
  // },
})
</script>
