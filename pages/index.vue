<template>
  <div id="main">
    <div>
      <Navbar />
    </div>
    <div>
      <HomeImage />
    </div>
    <div>
      <AboutMe />
    </div>
    <div>
      <MyFavProjects :projectontent="projectContent"/>
    </div>
    <div>
      <Languages :language-content="languageContent" :skill-content="skillContent" />
    </div>
    <div>
      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import Navbar from '~/components/Navbar.vue'
import HomeImage from '~/components/HomeImage.vue'
import AboutMe from '~/components/AboutMe.vue'
import MyFavProjects from '~/components/MyFavProjects.vue'
import Languages from '~/components/Languages.vue'
import Footer from '~/components/PageFooter.vue'
import pageData from '~/meta-content/index-content.json'


Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

export default Vue.extend({
  components: {
    Navbar,
    HomeImage,
    AboutMe,
    MyFavProjects,
    Languages,
    Footer

  },
  data(){
    return {
      languageContent: {
          cols: 2,
          content: pageData.language
      },
      skillContent: {
          cols: 4,
          content: pageData.skill
      },
      projectContent: {
          cols: 3,
          content: pageData.fav_projects
      }
    }
  },
})
</script>

<style >

</style>
