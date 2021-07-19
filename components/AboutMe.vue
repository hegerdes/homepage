<!-- Please remove this file from your project -->
<template>
<b-container class="bv-example-row">
    <b-row>
    <b-col>
       <b-img thumbnail rounded="circle" fluid src="~/assets/img/me.jpg" alt="Image of Henrik Gerdes"></b-img>
    </b-col>
    <b-col cols="9">
      <p>
            Welcome to my website. My name is Henrik Gerdes. I'm a computer
            scientist student at the university of Osnabrück (Germany). My
            passion is to solve general, specific and specially hard problems
            in an elegant and efficient way and to automate recurring tasks.
            In the last year I did some projects with computer/game graphics,
            low level socket programming and worked with routing in graphs.<br />
          </p>
          <p >
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