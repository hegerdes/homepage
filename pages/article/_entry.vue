<template>
  <NuxtContent
    class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto"
    :document="page"
  />
</template>

<script>
export default {
  layout: 'blog-layout',

  async asyncData({ $content, params, error }) {
    console.log(params)
    const slug = params.entry || 'index'
    const page = await $content(slug)
      .fetch()
      .catch(() => {
        error({ statusCode: 404, message: 'Article not found' })
      })

    return {
      page,
    }
  },
    head: {
    // title: page.title,
  },
}
</script>
