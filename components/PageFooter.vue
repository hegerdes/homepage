<template>
  <b-container fluid class="black-row p-4">
    <a name="conatact" ></a>
    <footer class="footer" style="padding-bottom: 50px">
      <a name="contact"></a>
      <b-row align-v="center" class="my-4">
        <b-col>
          <h1 class="centerTitle">CONTACT INFORMATION</h1>
        </b-col>
      </b-row>
      <ul class="centerLinks socialIcons">
        <li>
          <a :href="github"
            ><img src="~/static/img/icon/github.png" />
          </a>
        </li>
        <li>
          <a :href="'mailto:' + mail"
            ><img src="~/static/img/icon/email.png" />
          </a>
        </li>
      </ul>
      <b-row align-v="center">
        <b-col>
          <p class="centerTitle stealth-link">
            Email me with any suggestions, collaborations or just to talk!<br /><a
              :href="'mailto:' + mail"
              >{{ mail }}</a
            >
          </p>
        </b-col>
      </b-row>
    </footer>
  </b-container>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'Footer',
  data() {
    return {
      mail: process.env.PAGE_OWNER_MAIL,
      github: process.env.PAGE_OWNER_GITHUB,
    }
  },
})
</script>

<style>
.socialIcons li a img {
  vertical-align: middle;
  padding: 5px;
  height: 50px;
}
.socialIcons li {
  display: inline-block;
}

.centerLinks {
  list-style-type: none;
  padding: 0px;
  margin: 0px;
  text-align: center;
  padding-bottom: 1em;
}
</style>