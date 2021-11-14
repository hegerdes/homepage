<template>
  <v-app>
    <Navbar />
    <v-navigation-drawer right app class="mt-16">
      <h4>See also:</h4>
      <article-card
        v-for="(val, index) in articles"
        :key="index"
        :title="val.title"
        :desc="val.description"
        :path="val.path.split('/')[3]"
        :pic="val.pic"
      >
      </article-card>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid class="mb-8">
        <v-row>
          <v-col>
            <v-switch
              v-model="$vuetify.theme.dark"
              class="ma-0"
              label="Switch Theme"
              dense
              @change="themeToggle"
            ></v-switch>
          </v-col>
          <v-col>
            <p class="text-right mr-6">Published on: {{ page.date }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="post-margin">
            <NuxtContent :document="page" />
          </v-col>
        </v-row>

        <v-row class="ml-14">
          <v-col class="post-magrin">
            <ShareNetwork
              v-for="(val, index) in social"
              :key="index"
              :network="val"
              :url="baseurl + '/articles/' + page.path.split('/')[3]"
              :title="page.title"
              :description="page.description"
            >
              <v-icon large color=""> mdi-{{ val }} </v-icon>
            </ShareNetwork>
          </v-col>
        </v-row>
      </v-container>
      <Footer />
    </v-main>
  </v-app>
</template>

<script >
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { Store } from 'vuex'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import VueSocialSharing from 'vue-social-sharing'
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/PageFooter.vue'
import ArticleCard from '~/components/ArticleCard.vue'

Vue.use(Vuetify)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueSocialSharing)

const mystore = new Store({
  state: {
    darkmode: false,
  },
})

const myvuetify = new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    dark: mystore.state.darkmode,
    themes: {
      light: {
        primary: '#607d8b',
        secondary: '#009688',
        accent: '#00bcd4',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3',
        success: '#4caf50',
        background: 'F2F2F2',
      },
      dark: {
        primary: '#607d8b',
        secondary: '#009688',
        accent: '#00bcd4',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3',
        success: '#4caf50',
        background: '212428',
      },
    },
  },
})

export default {
  components: { Navbar, Footer, ArticleCard },
  store: mystore,
  vuetify: myvuetify,
    data() {
    return {
      articles: [],
      baseurl: process.env.BASE_URL,
      page: {},
      social: [
      'facebook',
      'twitter',
      'reddit',
      'whatsapp',
      'linkedin',
      'email',
    ]
    }
  },
  async fetch() {
    const file = this.$nuxt.$route.path.split('/')[2]
    const year = file.split('-')[0]
    const slug = 'articles/' + year + '/' + file
    this.page = await this.$ssrContext.$content(slug)
      .fetch()

    this.articles = await this.$ssrContext
      .$content('articles', { deep: true })
      .only(['title', 'description', 'date', 'pic', 'path'])
      .sortBy('date', 'desc')
      .fetch()
  },
  // computed: {

  // },
  // async asyncData({ $content, params, error }) {
  //   let slug
  //   if (params.entry) {
  //     slug = 'articles/' + params.entry.split('-')[0] + '/' + params.entry
  //   } else {
  //     slug = 'index'
  //   }
  //   const page = await $content(slug)
  //     .fetch()
  //     .catch(() => {
  //       error({ statusCode: 404, message: 'Article not found' })
  //     })
  //   const articles = await $content('articles', { deep: true })
  //     .only(['title', 'description', 'date', 'pic'])
  //     .sortBy('date', 'desc')
  //     .limit(4)
  //     .fetch()

  //   const baseurl = process.env.BASE_URL
    // const social = [
    //   'facebook',
    //   'twitter',
    //   'reddit',
    //   'whatsapp',
    //   'linkedin',
    //   'email',
    // ]

  //   return {
  //     page,
  //     articles,
  //     baseurl,
  //     social,
  //   }
  // },
  head() {
    return {
      title: this.page.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.page.description,
        },
        { hid: 'og:title', property: 'og:title', content: this.page.title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.page.description,
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.page.title,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.page.description,
        },
      ],
    }
  },
  mounted() {},
  methods: {
    themeToggle() {
      this.$store.state.darkmode = this.$vuetify.theme.dark
    },
  },
}
</script>
<style>
.v-application {
  background-color: var(--v-background-base) !important;
}

.nuxt-content p {
  line-height: 1.7em;
  font-size: 1.2em;
  text-align: justify;
}
.nuxt-content img {
  margin-left: auto !important;
  margin-right: auto !important;
  display: block;
  width: 100%;
}

.nuxt-content table {
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  border: 2px solid #575757;
  margin-bottom: 20px;
}
.nuxt-content th {
  border-bottom: 1px solid #575757;
}
.nuxt-content hr {
  border: 1px solid #575757;
}
.nuxt-content ol ul {
  font-size: 1.1em;
}

.post-margin {
  margin-left: 10%;
  margin-right: 10%;
  padding-left: 5%;
  padding-right: 5%;
}

@media (max-width: 1200px) {
  .post-margin {
    margin-left: 5%;
    margin-right: 5%;
    padding-left: 2%;
    padding-right: 2%;
  }
}

.line-numbers {
  background: #f4f4f4;
  border: 2px solid #ddd;
  border-left: 3px solid #f36d33;
  border-right: 3px solid #f36d33;
  color: #666;
  page-break-inside: avoid;
  font-family: monospace;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 1.6em;
  max-width: 100%;
  overflow: auto;
  padding: 1em 1.5em;
  display: block;
  word-wrap: break-word;
}
</style>
