<template>
    <span class="shineicon" v-once>
        <img src="/static/images/logo-tdt.svg">
        <span class="shine"></span>
    </span>
</template>

<script>
export default {
};
</script>

<style lang="scss">
.shineicon {
    position: relative;
    z-index: 8;
    overflow: hidden;
    width: 100%;
    display: block;
    font-size: 0;
    margin: auto;
    >img {
        position: relative;
        top: 0;
        left: 0;
        z-index: 11111;
        background-color: #000;
        mix-blend-mode: hard-light;
    }
    .shine {
        position: absolute;
        width: 150%;
        height: 150%;
        left: -25%;
        top: -75%;
        background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 77%,
            rgba(255, 255, 255, 0.6) 92%,
            rgba(255, 255, 255, 0.0) 100%
        );
        transform-origin: top left;
        animation-name: shine;
        animation-duration: 5s;
        animation-iteration-count: infinite;
        animation-timing-function: cubic-bezier(.12,.89,.98,.47);
    }
}
@keyframes shine {
    0% {
        opacity: 0;
        transform: translate(-100%, -100%) rotate(30deg);
    }
    4% {
        opacity: 1;
    }
    80% {
        transform: translate(100%, 100%) rotate(30deg);
    }

}

</style>
