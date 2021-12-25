<template>
  <b-navbar
    id="my-nav"
    toggleable="sm"
    type="light"
    variant="faded"
    :sticky="true"
    class="navbar-nav shadow"
  >
    <b-navbar-brand href="/" class="nav-brand mr-auto">{{
      owner
    }}</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse" class="mr-auto"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item v-if="!mobile">|</b-nav-item>
        <b-nav-item href="/projects">Projects</b-nav-item>
        <b-nav-item v-if="!mobile">|</b-nav-item>
        <b-nav-item href="/papers">Academic </b-nav-item>
        <b-nav-item v-if="!mobile">|</b-nav-item>
        <b-nav-item href="/blog">Blog</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="#contact">Contact</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang='ts'>
import Vue from 'vue'
import Vuetify from 'vuetify'
import { NavbarPlugin } from 'bootstrap-vue'
Vue.use(NavbarPlugin)
Vue.use(Vuetify)

export default Vue.extend({
  name: 'Navbar',
  data() {
    return {
      nav_cllapsed: true,
      owner: process.env.PAGE_OWNER,
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.xs
    },
  },
})
</script>

<style >
.nav-brand {
  padding-left: 10px;
}

.navbar-nav {
  font-size: 1.1em;
  background-color: rgb(255, 255, 255);
}

.navbar-nav {
  -webkit-transition: all 0.7s ease-out;
  transition: all 0.7s ease-out;
}
</style>