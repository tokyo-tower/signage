<template><transition name="fadeup">
<div :class="[
    'container',
    'container-checkintime',
    `lang-${currentLang}`,
    {
        'onerror': $store.state.errorMsgStr,
    }]">
    <errorOneline v-if="$store.state.errorMsgStr" :errorMsgStr="`データ取得エラーが発生しています ${$store.state.errorMsgStr}`"></errorOneline>

    <header v-once>
        <div class="inner">
            <div class="iconwrapper">
                <shine-icon class="logo"></shine-icon>
            </div>
            <div class="clockwrapper">
                <clock class="icon-clock"></clock>
            </div>
        </div>
    </header>

    <table class="table-tours">
        <thead>
            <tr>
                <th>{{ locale.tourNumber[currentLang] }}</th><th>{{ locale.entranceTime[currentLang] }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="currentPerformance in currentPerformanceArray" v-if="currentPerformance.id" :key="currentPerformance.id">
                <td>{{ currentPerformance.tour_number }}</td><td>{{ currentPerformance.start_time }} ～ {{ currentPerformance.end_time }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2">{{ locale.pleasePrepare[currentLang] }}</td>
            </tr>
        </tfoot>
    </table>

</div>
</transition></template>


<script>
import * as moment from 'moment';
import { fetchScheduleStatus, getNextTickUnixtime, manipulateScheduleData } from '../mixins';

require('moment/locale/ja');

moment.locale('ja');

export default {
    data() {
        return {
            langArray: [
                'ja',
                'en',
            ],
            currentLangIndex: 0,
            locale: {
                tourNumber: {
                    ja: 'ツアーNo',
                    en: 'Tour No.',
                },
                entranceTime: {
                    ja: '入場受付時間',
                    en: 'Entrance Time',
                },
                pleasePrepare: {
                    ja: '入場用QRコードを準備してお待ち下さい',
                    en: 'Please prepare to show your QR code for entrance.',
                },
            },
            currentPerformanceArray: [],
            timeoutInstance_IntervalFetch: null,
            timeoutInstance_changeLang: null,
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
        manipulateScheduleData,
        getCurrentPerformance() {
            return new Promise(async (resolve) => {
                try {
                    const moment_start = moment().minute(0).second(0);
                    const scheduleArray = await this.fetchScheduleStatus({
                        startFrom: moment_start.toISOString(),
                        startThrough: moment_start.minute(59).second(59).toISOString(),
                    });
                    this.currentPerformanceArray = this.manipulateScheduleData(scheduleArray, {
                        setGateEndTime: true,
                    }).filter((pf) => {
                        return (moment().isBetween(moment(pf.startDate), moment(pf.endDate).add(5, 'minute')));
                    });
                } catch (e) {
                    console.log(e);
                }
                return resolve();
            });
        },
        setFetchStatusDataInterval() {
            this.timeoutInstance_IntervalFetch = setTimeout(() => {
                this.getCurrentPerformance().then(() => {
                    this.setFetchStatusDataInterval();
                });
            }, this.getNextTickUnixtime());
        },
        setChangeLangTimeout(ms) {
            this.timeoutInstance_changeLang = setTimeout(() => {
                this.currentLangIndex++;
                if (this.currentLangIndex > this.langArray.length - 1) {
                    this.currentLangIndex = 0;
                    this.setChangeLangTimeout(10000); // 先頭は日本語なので長く表示
                } else {
                    this.setChangeLangTimeout();
                }
            }, (ms || 5000));
        },
    },
    created() {
        this.$store.commit('SET_LOADINGMSG', '読み込み中');
        this.getCurrentPerformance().then(() => {
            this.$store.commit('CLEAR_LOADINGMSG');
            this.setFetchStatusDataInterval();
            this.setChangeLangTimeout(10000);
        });
    },
    beforeDestroy() {
        clearTimeout(this.timeoutInstance_IntervalFetch);
        clearTimeout(this.timeoutInstance_changeLang);
    },
};
</script>

<style lang="scss" scoped>
    .langcontent {
        display: none;
    }
    .lang-en {
        .langcontent-en {
            display: block;
        }
    }
    .lang-ja {
        .langcontent-ja {
            display: block;
        }
    }
    .container {
        width: 1920px; // 100%;
        height: 1080px; // 100%;
        overflow: hidden;
        position: relative;
        user-select: none;
    }
    h2, h3, p {
        font-weight: normal;
        margin: 0;
    }
    header {
        color: #fff;
        background-color: #000;
        height: 200px; // 10.5vw;
        text-align: center;
        >.inner {
            display: table;
            width: 100%;
            height: 100%;
            >div {
                display: table-cell;
                text-align: center;
                vertical-align: middle;
            }
        }
        .iconwrapper {
            width: 200px; // 10.5vw;
            .logo {
                width: 150px; // 8vw;
                height: 150px; // 8vw;
            }
        }
        .clockwrapper {
            background: #212121;
        }
        .clock {
            margin-left: -200px; // -10.5vw;
            font-size: 110px;
        }
        .icon-clock {
            &::before {
                width: 76px; // 4vw;
                height: 76px; // 4vw;
                margin-right: 30px; // 1.6vw;
            }
        }
    }
    .table-tours {
        width: 100%;
        height: 100%;
        table-layout: fixed;
        position: absolute;
        margin-top: -200px; // -10.5vw;
        padding-top: 200px; // 10.5vw;
        z-index: -1;
        border-spacing: 0;
        background-color: #fff;
        td {
            font-size: 192px; // 3vw;
            text-align: center;
        }
        thead,tbody {
            th:first-child,
            td:first-child {
                border-right: 1px solid #686866;
                width: 36%;
            }
        }
        thead {
            background-color: #444;
            color: #fff;
            th {
                font-size: 60px;
                font-weight: normal;
                line-height: 1.2;
            }
        }
        tbody {
            tr:nth-child(odd) {
                background-color: #ededed;
            }
            td:first-child {
                font-size: 192px; // 10vw;
            }
            td:last-child {
                font-size: 136px; // 7vw;
            }
        }
        tfoot {
            color: #000;
            background-color: #e8e8e8;
            height: 100px;
            text-align: center;
            td {
                font-size: 54px; // 2.8vw;
                line-height: 1.8;
            }
        }
    }

</style>
