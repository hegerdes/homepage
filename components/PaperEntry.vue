<template>
  <div>
    <a name="first"></a>
    <b-container v-for="(val, index) in papers" :key="index">
      <b-row class="mb-0">
        <b-col class="paper-header pb-4">
          <h2 v-if="val.title.includes('-')">
            {{ val.title.split('-')[0] }} -
            <br />
            {{ val.title.split('-')[1] }}
          </h2>
          <h2 v-else>
            {{ val.title }}
          </h2>
        </b-col>
      </b-row>
      <b-row class="paper align-self-stretch justify-content-md-center mb-4">
        <b-col md="4" class="justify-content-center">
          <a :href="val.link.url">
            <b-img fluid-grow :src="val.pic" class="paperImg"> </b-img
          ></a>
        </b-col>
        <b-col lg="8" md="12">
          <p style="font-size: 1.5em; margin-bottom: 1.5em; padding-left: 20px">
            <em><i>Abstract:</i></em>
          </p>
          <p
            v-for="(msg, msg_index) in val.msg"
            :key="msg_index"
            class="paper-paragraph"
            style="margin-top: -0.8em"
          >
            {{ msg }}
          </p>
          <p style="font-size: 1.5em; padding-left: 60px">
            {{ val.link.text }}
            <a :href="val.link.url">here.</a>
          </p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'PaperEntry',
  props: ['papers'],
  data() {
    return {}
  },
})
</script>

<style >
.container {
  max-width: 1700px;
}

.paper-paragraph {
  padding-left: 60px;
  padding-right: 60px;
  font-family: 'Gravity-Regular';
  font-size: 1.5em;
  letter-spacing: 1px;
  text-align: justify;
}

.paper-header {
  font-family: 'Gravity-Regular';
  font-size: 3em;
  text-align: center;
  letter-spacing: 8px;
}
.paper {
  padding-left: 15%;
  padding-right: 15%;
}

.paperImg {
  border: 1px solid #101010;
}

@media (max-width: 1800px) {
  .container {
    max-width: 1200px;
  }

  .paper {
    padding-left: 1%;
    padding-right: 1%;
  }
}
@media (max-width: 600px) {
  .container {
    max-width: 800px;
  }

  .paper {
    padding-left: 1%;
    padding-right: 1%;
  }

  .paper-paragraph {
    padding-left: 15px !important;
    padding-right: 15px !important;
  }
}

</style>