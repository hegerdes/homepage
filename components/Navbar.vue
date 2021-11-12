<template>
  <b-navbar toggleable="sm" type="light" variant="faded" :sticky="true">
    <b-navbar-brand tag="h1" href="/">Henrik Gerdes</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="/projects">Projects</b-nav-item>
        <b-nav-item href="/mix" >MixMax</b-nav-item>
        <b-nav-item href="/blog" >Blog</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="#contact" >Contact</b-nav-item>

      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'Navbar'
})
</script>