<template>
  <b-container fluid class="black-row p-4 my-footer" >
    <a name="conatact" ></a>
    <footer  style="padding-bottom: 50px">
      <a name="contact"></a>
      <b-row align-v="center" class="my-4 d-print-none">
        <b-col>
          <h1 class="centerTitle ">CONTACT INFORMATION</h1>
        </b-col>
      </b-row>
      <ul class="centerLinks socialIcons d-print-none">
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
        <li>
          <a :href="linkedin"
            ><img src="~/static/img/icon/linkedIn.png" />
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
      linkedin: process.env.PAGE_OWNER_LINKEDIN,
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

.black-row {
  background-color: #282828;
  color: white;
}

.my-footer {
    z-index: 1;
}

.centerLinks {
  list-style-type: none;
  padding: 0px;
  margin: 0px;
  text-align: center;
  padding-bottom: 1em;
}
</style>