<template>
  <span class="clock"
    ><span>{{ HH }}<span class="colon">:</span>{{ mm }}</span></span
  >
</template>

<script lang="ts">
import Clock from './Clock';

export default Clock;
</script>

<style>
@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  51% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
.clock {
  user-select: none;
}
.colon {
  animation-name: blink;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
</style>
