<template>
  <b-container fluid class="p-4">
    <b-row align-v="center">
      <b-col>
        <h2 class="centerTitle">My Favorite Projects</h2>
      </b-col>
    </b-row>
    <b-row cols="1" cols-sm="1" cols-lg="3" cols-md="1" align-v="center">
      <b-col>
        <b-card
          title="Galaxy Fight"
          img-src="~assets/img/galaxy.png"
          img-alt="Image"
          img-top
          tag="article"
          class="mb-2"
        >
          <b-card-text>
            A round based 2D strategy game with 3D PvP fights.
          </b-card-text>
          <b-card-text>
            Its basically a collection of my C++ skills. Including
            Templates,Boost, QT, OpenGL and SDL.
          </b-card-text>
        </b-card>
      </b-col>
      <b-col>
        <b-card
          title="Pacmap"
          img-src="~assets/img/pac.png"
          img-alt="Image"
          img-top
          tag="article"
          class="mb-2"
        >
          <b-card-text>
            Want to play Pacman in your home town streets? Want to compete with
            your friends?
          </b-card-text>
          <b-card-text>
            Than play Pacmap. Its an multiplayer Pacman on street maps.
          </b-card-text>
        </b-card>
      </b-col>
      <b-col>
        <b-card
          title="Beeblebrox CTF"
          img-src="~assets/img/ctf.png"
          img-alt="Image"
          img-top
          tag="article"
          class="mb-2"
        >
          <b-card-text>
            A VM for IT-Sec starters to learn Unix and find common IT Security
            flaws.
          </b-card-text>
          <b-card-text>
            It includes Bash-Scripting, Web-Scraping and manipulation of
            Web-Authentication.
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
    <b-row align-v="center">
      <b-col class="text-center"
        ><b-button href="view/content/projects.html" size="lg"
          >Learn More</b-button
        ></b-col
      >
    </b-row>
  </b-container>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'MyFavProjects',
})
</script>

<style>
.centerTitle {
  text-align: center;
  font-family: Gravity-Regular;
}
</style>