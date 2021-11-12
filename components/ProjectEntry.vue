<template>
  <div>
    <a name="first"></a>
    <b-container v-for="(val, index) in projectontent" :key="index" fluid>
      <a :name="val.title"></a>
      <div class="proj">
        <b-row class="align-self-stretch justify-content-md-center my-5">
          <b-col lg="5" class="d-flex justify-content-center">
            <div class="projPicCenter">
              <b-img :src="val.pic" fluid-grow alt="Responsive image"></b-img>
            </div>
          </b-col>
          <b-col class="px-5 pb-2 mx-auto">
            <h3>{{ val.title }}</h3>
            <p class="subP italic">{{ val.undertitle }}</p>
            <p
              v-for="(msg, msg_index) in val.msg"
              :key="msg_index"
              class="subText white extPad"
            >
              {{ msg }}
            </p>
            <br />
            <b-button
              v-for="(link, link_index) in val.links"
              :key="link_index"
              :href="link.url"
              class="mr-2 mb-2"
              >{{ link.text }}
            </b-button>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'ProjectEntry',
  props: ['projectontent'],
  data() {
    return {}
  },
})
</script>

<style >
.proj {
  margin-right: 10%;
  margin-left: 10%;
  padding-left: 70px;
  padding-right: 70px;
}
.proj h3 {
  padding-top: 5%;
}

.projPicCenter {
  padding-top: 15%;
  padding-bottom: 15%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.proj .row {
  border-width: 2px;
  border-radius: 5px;
  border-style: solid;
  border-color: #282828;
}

.proj .row:hover,
.proj h3,
.proj p {
  -webkit-transform: scale(1.05);
  -moz-transform: scale(1.05);
  -o-transform: scale(1.05);
  -ms-transform: scale(1.05);
  transform: scale(1.05);
  z-index: 5;
}

@media (max-width: 900px) {
  .proj {
    padding-left: 2%;
    padding-right: 2%;
    padding-left: 10px;
    padding-right: 10px;
  }
  .proj h3 {
    padding-top: 0%;
  }
  .projPicCenter {
    margin-top: 0%;
    margin-bottom: 0%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
}
</style>