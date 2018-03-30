<template>
<div :class="['container', 'container-ticketstatus', `lang-${currentLang}`, {'onerror': $store.state.errorMsgStr}]">
    <errorOneline v-if="$store.state.errorMsgStr" :errorMsgStr="`通信エラーが発生しています ${$store.state.errorMsgStr}`"></errorOneline>

    <div class="area area-info" v-once>
        <div class="mainvisual">
            <p>
                <shine-icon targetEvent="langChanged"></shine-icon>
            </p>
        </div>
        <div class="prices">
            <section v-for="ticketinfo in ticketinfoArray" :key="ticketinfo.ticket_id">
                <div>
                    <h2>
                        <span v-for="lang in langArray" :key="`ticketname_${lang}`" :class="`langcontent langcontent-${lang}`">{{ ticketinfo[lang].name }}</span>
                    <span class="cap">
                        <span v-for="lang in langArray" :key="`ticketcap_${lang}`" :class="`langcontent langcontent-${lang}`">{{ ticketinfo[lang].cap }}</span>
                    </span></h2>
                    <p>{{ echoPrice(ticketinfo.price) }}</p>
                </div>
            </section>
        </div>
    </div>

    <div class="area area-schedule">
        <div class="header" v-once>
            <span class="tdt">Top Deck Tour</span>
            <span class="separator"></span>
            <clock class="iconBefore icon-clock"></clock>
        </div>
        <table class="table-main">
            <thead v-once>
                <tr>
                    <th>
                        <span v-for="lang in langArray" :key="`tourNumber_${lang}`" :class="`langcontent langcontent-${lang}`">{{ locale.tourNumber[lang] }}</span>
                    </th>
                    <th class="time">
                        <span v-for="lang in langArray" :key="`entranceTime_${lang}`" :class="`langcontent langcontent-${lang}`">{{ locale.entranceTime[lang] }}</span>
                    </th>
                    <th>
                        <span v-for="lang in langArray" :key="`availability_${lang}`" :class="`langcontent langcontent-${lang}`">{{ locale.availability[lang] }}</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="performance in nearStatusArray" :key="performance.id" :class="['item', getStatusClassNameByPerformance($store.state.moment, performance, 10)]">
                    <td>{{ performance.tour_number }}</td>
                    <td class="time">{{ performance.start_time }} ～ {{ performance.end_time }}</td>
                    <td class="wrapper-status"><span class="status">{{ performance.seat_status }}</span></td>
                </tr>
            </tbody>
            <tfoot>
                <tr><td colspan="3">
                    <div v-for="(futureAvgStatus, nearIndex) in futureAvgStatusArray" :key="nearIndex"
                    :class="['houritem', getStatusClassNameByPerformance($store.state.moment, futureAvgStatus)]">
                        <p class="hours">{{ futureAvgStatus.hours }}</p>
                        <div class="wrapper-status">
                            <p class="status">{{ futureAvgStatus.seat_status }}</p>
                        </div>
                    </div>
                </td></tr>
            </tfoot>
        </table>

    </div>

</div>
</template>


<script>
import * as moment from 'moment';
import { fetchScheduleStatus, getNextTickUnixtime, getStatusClassNameByPerformance, manipulateScheduleData } from '../mixins';

require('moment/locale/ja');

moment.locale('ja');

export default {
    data() {
        return {
            langArray: [
                'ja',
                'en',
                'zh-hans',
            ],
            currentLangIndex: 0,
            locale: {
                tourNumber: {
                    ja: 'ツアーNo',
                    en: 'Tour No.',
                    'zh-hans': '游览编号',
                },
                entranceTime: {
                    ja: '入場受付時間',
                    en: 'Entrance Time',
                    'zh-hans': '入场受理时间',
                },
                availability: {
                    ja: '空き状況',
                    en: 'Availability',
                    'zh-hans': '可预约情况',
                },
            },
            ticketinfoArray: [ // ※ダイナミックプライシング導入後はAPIから取得
                {
                    ticket_id: '001',
                    price: 2800,
                    ja: {
                        name: '大人',
                        cap: '高校生以上',
                    },
                    en: {
                        name: 'Adult',
                        cap: '16 years or over',
                    },
                    'zh-hans': {
                        name: '成人',
                        cap: '16岁以上',
                    },
                },
                {
                    ticket_id: '002',
                    price: 1800,
                    ja: {
                        name: '子供',
                        cap: '小・中学生',
                    },
                    en: {
                        name: 'Junior',
                        cap: '7 to 15 years',
                    },
                    'zh-hans': {
                        name: '儿童',
                        cap: '7～15岁',
                    },
                },
                {
                    ticket_id: '003',
                    price: 1200,
                    ja: {
                        name: '幼児',
                        cap: '4歳以上',
                    },
                    en: {
                        name: 'Child',
                        cap: '4 to 6 years',
                    },
                    'zh-hans': {
                        name: '幼儿',
                        cap: '4～6岁',
                    },
                },
            ],
            nearStatusArray: [],
            futureAvgStatusArray: [],
            timeoutInstance_changeLang: null,
            timeoutInstance_IntervalFetch: null,
        };
    },
    computed: {
        currentLang() {
            return this.langArray[this.currentLangIndex];
        },
    },
    methods: {
        fetchScheduleStatus,
        getNextTickUnixtime,
        getStatusClassNameByPerformance,
        manipulateScheduleData,
        echoPrice(price) {
            return `￥${price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;
        },
        updateStatus() {
            return new Promise(async (resolve, reject) => {
                try {
                    const moment_start = moment().minute(0).second(0);
                    const scheduleArray = await this.fetchScheduleStatus({
                        startFrom: moment_start.toISOString(),
                        startThrough: moment_start.add(4, 'hour').minute(59).second(59).toISOString(),
                    });

                    const currentHour = moment().hour();
                    const nearStatusArray = [];

                    // 直近4つをまとめつつ1hごとにまとめる
                    const hourArray = [];
                    const performancesByHour = {};
                    this.manipulateScheduleData(scheduleArray).forEach((performance) => {
                        try {
                            if (moment().isAfter(moment(performance.endDate))) {
                                return true;
                            }
                            if (hourArray.indexOf(performance.hour) === -1) {
                                hourArray.push(performance.hour);
                                performancesByHour[performance.hour] = [];
                            }
                            performancesByHour[performance.hour].push(performance);
                            if (nearStatusArray.length < 4) {
                                nearStatusArray.push(performance);
                            }
                        } catch (e) {
                            console.log(e);
                            return true;
                        }
                        return true;
                    });

                    this.nearStatusArray = nearStatusArray;

                    // 現在の4枠先から4時間分のHour配列
                    const futureHourArray = [...Array(4)].map((v, i) => { return (i + 1 + currentHour); });

                    // hourごとの performance の平均を求める
                    this.futureAvgStatusArray = futureHourArray.filter((h) => { return (typeof performancesByHour[h] === 'object'); }).map((hour) => {
                        // seat_status の平均(小数点切り捨て)の数字で⚪△×判定する
                        // unavailable は0として集計。hour内全てが unavailable だった時は平均も unavailable (「-」) にする
                        let allUnavailable = true;
                        const avgStatus = Math.floor((performancesByHour[hour].reduce((p, c) => {
                            if (!c.unavailable) {
                                allUnavailable = false;
                                let num = parseInt(c.seat_status, 10);
                                if (isNaN(num)) {
                                    num = 0;
                                }
                                return (p + num);
                            }
                            return p; // unavailable だったので seat_status を加算しない
                        }, 0) / performancesByHour[hour].length));
                        return {
                            hours: `${hour}:00～${`0${(parseInt(hour, 10) + 1)}`.slice(1)}:00`,
                            seat_status: avgStatus,
                            unavailable: allUnavailable,
                            is_avg: true,
                        };
                    });
                } catch (e) {
                    return reject(e);
                }
                return resolve();
            });
        },
        setFetchStatusDataTimeout() {
            clearTimeout(this.timeoutInstance_IntervalFetch);
            this.timeoutInstance_IntervalFetch = setTimeout(async () => {
                await this.updateStatus();
                this.setFetchStatusDataTimeout();
            }, this.getNextTickUnixtime());
        },
        setChangeLangTimeout(ms) {
            clearTimeout(this.timeoutInstance_changeLang);
            this.timeoutInstance_changeLang = setTimeout(() => {
                this.$emit('langChanged');
                this.currentLangIndex++;
                if (this.currentLangIndex > this.langArray.length - 1) {
                    this.currentLangIndex = 0;
                    this.setChangeLangTimeout(6000); // 先頭は日本語なので長く表示
                } else {
                    this.setChangeLangTimeout();
                }
            }, (ms || 3000));
        },
    },
    created() {
        this.$store.commit('SET_LOADINGMSG', '最新の情報を取得中...');
        this.updateStatus().then(() => {
            this.$store.commit('CLEAR_LOADINGMSG');
            this.setFetchStatusDataTimeout();
            this.setChangeLangTimeout(6000);
        });
    },
    beforeDestroy() {
        clearTimeout(this.timeoutInstance_IntervalFetch);
        clearTimeout(this.timeoutInstance_changeLang);
    },
};
</script>

<style lang="scss">
    .langcontent {
        display: none;
    }

    $langArray:
        'ja',
        'en',
        'zh-hans',
    ;
    @each $lang in $langArray {
        .lang-#{$lang} {
            .langcontent-#{$lang} {
                display: inline;
            }
        }
    }

.container-ticketstatus {
    display: table;
    // width: 100%;
    // height: 100%;
    width: 1920px;
    height: 1080px;
    margin: auto;
    overflow: hidden;
    background-color: #000;
    pointer-events: none;
    user-select: none;


    >.area {
        mix-blend-mode: screen;
        display: table-cell;
        vertical-align: top;
    }
    .area-info {
        width: 23%;
    }

    .mainvisual {
        display: table;
        width: 100%;
        padding: 16%;
        height: 46%;
        >p {
            vertical-align: middle;
            display: table-cell;
            width: 100%;
            height: 100%;
        }
    }

    .prices {
        height: 54%;
        color: #fff;
        section {
            border-top: 1px solid #999;
            padding: 1em;
            display: table;
            width: 100%;
            height: 33.3%;
            >div {
                display: table-cell;
                vertical-align: middle;
                height: 100%;
            }
            h2, p {
                margin: 0;
            }
            h2 {
                font-size: 32px; // 1.6vw;
                font-weight: normal;
                span.cap {
                    margin-left: 10px; // 0.5vw;
                }
            }
            p {
                font-size: 38px; // 2vw;
            }
        }
    }

    .error-oneline {
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 9999;
        opacity: 0.9;
    }

    .header {
        display: table;
        width: 100%;
        background-color: #2d2d2d;
        color: #fff;
        position: relative;
        z-index: 16;
        height: 132px; // 7vw;
        .tdt {
            display: table-cell;
            vertical-align: middle;
            font-size: 70px;
            text-align: right;
            width: 48%;
        }
        .separator {
            display: table-cell;
            width: 4%;
            text-align: center;
            vertical-align: middle;
            &::after {
                content: '';
                display: inline-block;
                height: 64%;
                vertical-align: middle;
                border-right: 1px solid #666;
            }
        }
        .clock {
            font-size: 88px; // 4.6vw;
            display: table-cell;
            text-align: left;
            width: 48%;
            margin: 0;
        }

    }


    .icon-clock {
        &::before {
            width: 58px; // 3vw;
            height: 58px; // 3vw;
            margin-right: 18px; // 1vw;
        }
    }

    .wrapper-status {
        display: table;
        width: 100%;
        height: 100%;
        user-select: none;
        .status {
            display: table-cell;
            vertical-align: middle;
            text-align: center;
            font-size: 0;
            &::before {
                content: '';
                display: inline-block;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center center;
            }
        }
    }

    .table-main {
        width: 100%;
        table-layout: fixed;
        border-spacing: 0;
        background-color: #fff;
        padding-top: 132px; // 7vw;
        margin-top: -132px; // -7vw;
        height: 100%;
        td {
            font-size: 64px; // 58px; // 3vw;
            text-align: center;
        }
        .time {
            border-left: 1px solid #686866;
            border-right: 1px solid #686866;
            width: 58%;
        }
        thead {
            background-color: #444;
            color: #fff;
            th {
                font-size: 34px; // 1.8vw;
                font-weight: normal;
                line-height: 2;
            }
        }
        tbody {
            tr:nth-child(odd) {
                background-color: #ededed;
            }
            .status {
                &::before {
                    width: 100px; // 5.2vw;
                    height: 100px; // 5.2vw;
                }
            }
        }
        tfoot {
            color: #fff;
            background-color: #999;
            td {
                text-align: left;
            }
            .houritem {
                width: 25%;
                display: inline-block;
                text-align: center;
                vertical-align: top;
                padding: 0;
            }
            .houritem:nth-child(odd) {
                background-color: #7c7c7c;
                .hours {
                    background-color: #545454;
                }
            }
            .hours {
                background-color: #777;
                margin: 0;
                font-size: 34px; // 1.8vw;
                line-height: 1.8;
                height: 64px; // 3.4vw;
            }
            .status {
                height: 130px;
                &::before {
                    vertical-align: middle;
                    width: 76px; // 4vw;
                    height: 76px; // 4vw;
                }
            }
            .houritem:not(.item-last) .status::before {
                filter: invert(100%); // last以外はアイコン色を反転
            }
        }
    }


    .item-capable {
        .status::before {
            background-image: url(../assets/icon-status-capable.svg);
        }
    }
    .item-crowded {
        .status::before {
            background-image: url(../assets/icon-status-crowded.svg);
        }
    }
    .item-soldout {
        .wrapper-status {
            color: #fff;
        }
        .status::before {
            background-image: url(../assets/icon-status-soldout.svg);
        }
    }
    .item-suspended, .item-unavailable {
        .status::before {
            background-image: url(../assets/icon-status-unavailable.svg);
        }
    }

}
</style>
