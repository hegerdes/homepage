<template>
  <b-container fluid class="black-row p-4">
    <b-row cols="1" cols-sm="1" cols-lg="2" cols-md="1" align-v="center" class="mx-4">
      <b-col md="4" class="pt-4 pb-4">
        <div cols="4">
          <b-img
            center
            thumbnail
            fluid
            rounded="circle"
            width="400"
            :src="aboutmeontent.pic"
            alt="Image of Henrik Gerdes"
          ></b-img>
        </div>
      </b-col>
      <b-col
        md="8"
        class="text-center justify-content-center"
        align-v="stretch"
      >
        <p
          v-for="(val, index) in aboutmeontent.msg"
          :key="index"
          align="justify"
        >
          {{ val }} <br />
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'AboutMe',
  props: ['aboutmeontent'],
})
</script>

<style>
.black-row {
  color: white;
  background-color: #282828;
}
</style>
