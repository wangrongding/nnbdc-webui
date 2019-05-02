<template>
  <div style="display:inline-block" v-if="hasPronounce">
    <!--英音、美音一致-->
    <span v-if="word.pronounce">[{{word.pronounce}}]</span>

    <!--美音-->
    <img src="../assets/america.jpg" width=12 v-if="word.americaPronounce"/><span
    v-if="word.americaPronounce">[{{word.americaPronounce}}]</span>

    <!--英音-->
    <img src="../assets/british.jpg" width=12 v-if="word.britishPronounce"/><span
    v-if="word.britishPronounce">[{{word.britishPronounce}}]</span>
  </div>
</template>
<style scoped>
  span {
    color: gray;
  }

  img {
    position: relative;
    top: 1px;
  }
</style>
<script>
  export default {
    components: {},
    props: ['word'],
    computed: {
      hasPronounce () {
        return this.word.pronounce || this.word.americaPronounce || this.word.britishPronounce
      }
    }
  }
</script>
