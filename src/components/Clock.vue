<template>
    <span class="clock"><span>{{ HH }}<span class="colon">:</span>{{ mm }}</span></span>
</template>

<script>
import moment from 'moment';
import { getNextTickUnixtime } from '../mixins';


export default {
    data() {
        return {
            moment_now: moment(),
            timeoutInstance_updateMoment: null,
        };
    },
    computed: {
        HH() {
            return this.moment_now.format('HH');
        },
        mm() {
            return this.moment_now.format('mm');
        },
    },
    methods: {
        getNextTickUnixtime,
        setTimeoutUpdateMoment() {
            this.timeoutInstance_updateMoment = setTimeout(() => {
                this.moment_now = moment();
                this.setTimeoutUpdateMoment();
            }, this.getNextTickUnixtime());
        },

    },
    created() {
        this.setTimeoutUpdateMoment();
    },
    beforeDestroy() {
        clearTimeout(this.timeoutInstance_updateMoment);
    },
};
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
