<template>
  <b-container fluid class="black-row p-4">
    <b-row align-v="center" class="my-4">
      <b-col>
        <h1 class="centerTitle">Languages</h1>
      </b-col>
    </b-row>
    <b-row
      v-for="n in languageContent.content.length / languageContent.cols"
      :key="n"
      class="align-self-stretch justify-content-md-center my-2"
    >
      <b-col
        v-for="(val, index) in languageContent.content.slice(
          (n - 1) * languageContent.cols,
          (n - 1) * languageContent.cols + languageContent.cols
        )"
        :key="index"
        :val="val"
        :index="index"
        :md="12 / languageContent.cols"
        language="language"
        class="d-flex justify-content-center my-4"
      >
        <b-card
          bg-variant="dark"
          text-variant="white"
          :title="val.title"
          title-tag="h2"
          style="max-width: 35rem"
          class="h-100"
        >
          <b-card-text text-tag="h5"> {{ val.msg }} </b-card-text>
          <template #footer>
            <p class="text-muted stealth-link">
              <a :href="val.link" style="border-width: 0px"> Example Project</a>
              |
              <a href="/projects.html"> View all projects </a>
            </p>
          </template>
        </b-card>
      </b-col>
    </b-row>
    <b-row align-v="center" class="mt-4">
      <b-col>
        <h1 class="centerTitle">Skills</h1>
      </b-col>
    </b-row>
    <b-row  class="align-self-stretch justify-content-md-center my-2">
      <b-col
        v-for="n in skillContent.cols"
        :key="n"
        language="language"
        class="d-flex justify-content-left"
      >
        <ul style="text" class="skill-list">
          <li
            v-for="(val, index) in skillContent.content.slice(
              (n - 1) * (skillContent.content.length / skillContent.cols),
              (n - 1) * (skillContent.content.length / skillContent.cols) + (skillContent.content.length / skillContent.cols)
            )"
            :key="index"
            class="d-flex justify-content-left"
          >
            {{ val }}
          </li>
        </ul>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang='ts'>
import Vue from 'vue'


export default Vue.extend({
  name: 'Languages',
  props: ['language-content', 'skill-content'],
  data() {
    return {
    }
  },
})
</script>

<style>
.black-row {
  color: white;
  background-color: #282828;
}

.skill-list li::before {
  padding-right:1em;
  content: "🔹";
  display: inline-block;
  margin-left: 4em;
}
</style>
