<template>
<b-container fluid class="black-row p-4" >
    <b-row cols="1" cols-sm="1" cols-lg="2" cols-md="1" align-v="center" >
    <b-col class="pt-4 pb-4">
      <div cols="4">
        <b-img center thumbnail fluid rounded="circle" width="400" src="~/assets/img/me.jpg" alt="Image of Henrik Gerdes"></b-img>
      </div>
    </b-col>
    <b-col class="text-center justify-content-center" align-v="stretch">
      <p align="justify">
            Welcome to my website. My name is Henrik Gerdes. I'm a computer
            scientist student at the university of Osnabrück (Germany). My
            passion is to solve general, specific and specially hard problems
            in an elegant and efficient way and to automate recurring tasks.
            In the last year I did some projects with computer/game graphics,
            low level socket programming and worked with routing in graphs.<br/>
          </p>
          <p align="justify">
            Recently I did an internship at a security company and started
            learning some web- technology. Examples are in the software
            area.<br /><br />
          </p>
    </b-col>
  </b-row>
</b-container>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'AboutMe'
})
</script>

<style>
.black-row {
  color: white;
  background-color: #282828;
}
</style>