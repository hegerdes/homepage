<template>
  <div id="main">
      <Navbar />
      <HomeImage :homeRowContent="homeRowContent"/>
      <AboutMe :aboutmeontent="aboutMeContent"/>
      <MyFavProjects :projectontent="projectContent"/>
      <Languages :language-content="languageContent" :skill-content="skillContent" />
      <Footer />
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
      },
      homeRowContent: pageData.home_row,
      aboutMeContent: pageData.about_me
    }
  },
})
</script>

<style >

</style>
