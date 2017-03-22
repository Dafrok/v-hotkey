<template lang="pug">
section
  transition(name="slide")
    router-view
</template>

<script>
</script>

<style lang="stylus">
.slide-enter-active, .slide-leave-active
  position absolute
  transition all .5s
.slide-enter, .slide-leave-active
  position absolute
  transform translateX(-50%)
  opacity 0

.fixed
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  display flex
  justify-content center
  align-items center
  text-align center
</style>