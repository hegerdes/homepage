<template>
  <b-navbar
    toggleable
    class="sidenav bd-links d-none d-md-block"
  >
    <b-navbar-brand href="#">Other Stuff</b-navbar-brand>

    <b-nav-item href="#1">Link 1</b-nav-item>
    <b-nav-item href="#">Link 2</b-nav-item>
    <b-nav-item href="#">Disabled</b-nav-item>
  </b-navbar>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'BlogSide',
})
</script>

<style>
.sidenav {
  height: 100%;
  width: 250px;
  position: fixed;
  z-index: -2;
  top: 0;
  right: 0px;
  background-color: rgb(182, 182, 182);
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
}

.sidenav a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  display: block;
  transition: 0.3s;
}

.sidenav a:hover {
  color: #f1f1f1;
}

@media screen and (max-height: 450px) {
  .sidenav {
    padding-top: 15px;
  }
  .sidenav a {
    font-size: 18px;
  }
}
</style>
