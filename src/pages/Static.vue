<template><transition name="fadeup">
<div :class="['container', 'container-static',
    {
        'container-vertical': ($route.meta.vertical),
        'container-sleep': ($route.name.indexOf('sleep') !== -1),
        'container-suspend': ($route.name.indexOf('suspend') !== -1),
        'container-closed': ($route.name.indexOf('closed') !== -1),
        'container-todaytdt': ($route.name.indexOf('todaytdt') !== -1),
    }
]">
    <clock v-if="!$route.meta.noclock" class="clock icon-clock" v-once></clock>
    <div class="content" v-once>
        <h1><shine-icon class="logo" src="/static/images/logo-tdt.svg"></shine-icon></h1>
        <div class="suspendcontent message">
            <h2>現在、トップデッキツアーは<br class="verticalcontent">休止しております</h2>
            <h3>The Top Deck Tour <br class="verticalcontent">is currently suspended</h3>
         </div>
        <div class="closedcontent message">
            <h2>本日のトップデッキツアー<br class="verticalcontent">受付は終了いたしました</h2>
            <h3>The Top Deck Tour <br class="verticalcontent">is closed for the day</h3>
         </div>
        <div class="todaytdtcontent message">
            <h2>トップデッキツアー 本日のチケット</h2>
            <h3>The Top Deck Tour Tickets for today<br>Top Deck Tour 当天的门票</h3>
         </div>
    </div>
</div>
</transition></template>

<script>
/*
  時計とロゴと文言だけの画面で共用
*/
export default {
};
</script>

<style lang="scss" scoped>
    .container-static {
        width: 100%;
        height: 100%;
        color: #fff;
        position: relative;
        text-align: center;
        padding-top: 76px; // 4vw;
        overflow: hidden;
        &::before {
            content: '';
            position: absolute;
            left: -20px;
            right: -20px;
            top: -20px;
            bottom: -20px;
            z-index: -1;
            background-image: url('/static/images/sleepbg.jpg');
            background-size: cover;
            background-position: 50%;
            background-repeat: no-repeat;
            filter: brightness(20%) blur(12px);
        }
    }
    .clock {
        display: block;
        font-size: 154px; // 8vw;
        color: #fff;
        &::before {
            width: 96px; // 5vw;
            height: 96px; // 5vw;
            margin-right: 38px; // 2vw;
        }
    }
    h1,h2,h3 {
        font-weight: normal;
        margin: 0;
    }
    .logo {
        width: 230px; // 12vw;
        height: 230px; // 12vw;
        margin: 60px auto 72px;
    }
    h2 {
        margin-bottom: 0.5em;
        letter-spacing: 2px;
    }

    .message {
        display: none;
        h2,h3 {
            font-size: 48px; // 2.5vw;
        }
    }


    .container-todaytdt {
        .logo {
            width: 300px;
            height: 300px;
            margin: 48px auto 96px;
        }
        .todaytdtcontent {
            display: block;
            h2, h3 {
                font-size: 88px;
            }
        }
    }

    .container-sleep {
        .logo {
            margin-top: 120px;
        }
    }

    .container-suspend {
        .suspendcontent {
            display: block;
        }
    }

    .container-closed {
        .closedcontent {
            display: block;
        }
    }

    .verticalcontent {
        display: none;
    }

    .container-vertical {
        padding-top: 172px; // 16vh;
        .verticalcontent {
            display: block;
        }
        .clock {
            font-size: 152px; // 14vh;
            &::before {
                width: 86px; // 8vh;
                height: 86px; // 8vh;
                margin-right: 42px; // 4vh;
            }
        }
        .logo {
            width: 324px; // 30vh;
            height: 324px; // 30vh;
            margin-top: 390px; // 36vh;
            margin-bottom: 130px; // 12vh;
        }
        h2 {
            font-size: 60px; // 5.5vh;
            margin-bottom: 1em;
        }
        h3 {
            font-size: 48px; // 4.5vh;
        }
        &.container-suspend,
        &.container-closed {
            .logo {
                margin-top: 130px; // 12vh;
            }
        }
    }
</style>
