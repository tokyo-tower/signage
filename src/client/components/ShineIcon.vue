<template>
  <span class="shineicon" v-once>
    <img ref="image" src="/static/images/logo-tdt.svg" @load.once="init" />
    <canvas ref="canvas"></canvas>
  </span>
</template>

<script lang="ts">
import ShineIcon from './ShineIcon';

export default ShineIcon;
</script>

<style lang="scss">
.shineicon {
  pointer-events: none;
  position: relative;
  z-index: 8;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: block;
  font-size: 0;
  margin: auto;
  transform: translateZ(0);
  > img {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: -1;
  }
}
</style>
