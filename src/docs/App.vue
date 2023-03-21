<template lang="pug">
section.hero.is-fullheight
  .hero-body
    .container.has-text-centered
      router-view(v-slot="{ Component }")
        transition(name="slide", mode="out-in")
          component(:is="Component")
</template>

<script>
</script>

<style lang="stylus">
html, body
  margin 0

.hero
  background-image url(./img/bg.jpg)
  background-size cover
  background-attachment fixed
.box
  opacity 0.5
  &.active
    opacity 1
    background-color rgba(255, 255, 255, 0.5)!important
.slide-enter-active, .slide-leave-active
  transition all .3s
.slide-enter, .slide-leave-active
  transform translateX(-50%)
  opacity 0

kbd
  display inline-block
  padding 3px 5px
  font 11px "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace
  line-height 10px
  color #444d56
  vertical-align middle
  background-color #fcfcfc
  border solid 1px #c6cbd1
  border-bottom-color #959da5
  border-radius 3px
  box-shadow inset 0 -1px 0 #959da5
.hero-section
  margin-top 1.5rem
</style>
