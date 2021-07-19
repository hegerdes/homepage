<template>
  <b-navbar toggleable="lg" type="light" variant="faded" :sticky="true">
    <b-navbar-brand tag="h1" href="/">Henrik Gerdes</b-navbar-brand>
    <div class="container">
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#">Projects</b-nav-item>
        <b-nav-item href="#" >Career</b-nav-item>
        <b-nav-item href="#" >Papers</b-nav-item>
        <b-nav-item href="#" >Tools</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="#" >Contact</b-nav-item>

      </b-navbar-nav>
    </b-collapse>
    </div>
  </b-navbar>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'Navbar'
})
</script>