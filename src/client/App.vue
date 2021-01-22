<template>

<div id="app" :class="[verticalClassName]">
    <loading v-if="$store.state.loadingMsg"></loading>
    <transition name="fadeup">
        <router-view></router-view>
    </transition>
</div>

</template>

<script>
export default {
    components: {
        Loading: require('./components/Loading.vue').default,
    },
    computed: {
        verticalClassName() {
            if (!this.$route.meta.vertical) {
                return '';
            }
            if (this.$route.query.rightTop) {
                return 'vertical-rightTop';
            }
            return 'vertical';
        },
    },
    beforeDestroy() {
        this.$store.commit('CLEAR_LOADINGMSG');
    },
};

</script>

<style lang="scss">
* {
    box-sizing: border-box;
}

#app {
    position: relative;
    width: 1920px; // 100%;
    height: 1080px; // 100%;
}
/*
    BrightSignの画面認識はHorizontalのみなので、
    縦型モニタで表示するには全体丸ごとを90°回転させる必要がある
    ref. https://brightsign.zendesk.com/hc/en-us/articles/218066097-Can-I-display-HTML5-in-Portrait-Mode-
    ref. https://stackoverflow.com/questions/35856013/rotate-all-html-element-whole-page-90-degree-with-css/35856390#35856390
*/
.vertical {
    transform: rotate(-90deg) !important;
    transform-origin: bottom right !important;
    position: absolute !important;
    top: -1920px;
    left: 840px;
    right: 0px;
    height: 1920px;
    min-height: 1920px;
    width: 1080px !important;
    min-width: 1080px;
}

.vertical-rightTop {
    transform: rotate(90deg) !important;
    transform-origin: bottom left !important;
    position: absolute !important;
    top: -1920px;
    height: 1920px;
    min-height: 1920px;
    width: 1080px !important;
    min-width: 1080px;
}

img {
    max-width: 100%;
}

html {
    overflow: auto;
}

html,
body {
    width: 1920px; // 100%;
    height: 1080px; // 100%;
    margin: 0;
    padding: 0;
}

body {
    background-color: #fff;
}

.icon-clock {
    &::before {
        content: '';
        display: inline-block;
        background-size: cover;
        background-repeat: no-repeat;
        background-image: url('./assets/icon-clock.svg');
    }
}


.content {
    position: relative;
}

.fade-leave-to {
    display: none;
}
.fade-enter-active, .fade-leave-active {
    transition: all 1s;
}
.fade-enter, .fade-leave-active {
    opacity: 0;
}

.fadeup-leave-to {
    display: none;
}
.fadeup-enter-active, .fadeup-leave-active {
    transition: all 0.4s;
}
.fadeup-enter, .fadeup-leave-active {
    opacity: 0;
    transform: translateY(25px);
}

</style>
