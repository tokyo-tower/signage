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

    <div class="tournumber">
        <h2>{{ locale.tourNumber[currentLang] }}</h2>
        <h3 v-if="currentPerformance && currentPerformance.tour_number">{{ currentPerformance.tour_number }}</h3>
    </div>

    <div class="time" v-if="currentPerformance && currentPerformance.start_time">
        <h2>{{ locale.entranceTime[currentLang] }}</h2>
        <h3>{{ currentPerformance.start_time }} ～ {{ currentPerformance.end_time }}</h3>
        <p>{{ locale.PleasePrepare[currentLang] }}</p>
    </div>

    <footer>
        <div class="qrguide">
            <h2>{{ locale.howtoGetQr[currentLang] }}</h2>
            <div class="qrguidesteps">
                <div>
                    <h3>1.</h3>
                    <p v-html="locale.scanBelowQr[currentLang]"></p>
                    <figure class="qrimage" v-once>
                        <img class="langcontent langcontent-ja" src="/static/images/qr-inquiry-ja.svg" alt="https://reference.tokyotower.co.jp/inquiry/search">
                        <img class="langcontent langcontent-en" src="/static/images/qr-inquiry-en.svg" alt="https://reference.tokyotower.co.jp/inquiry/search?locale=en">
                    </figure>
                </div>
                <div>
                    <h3>2.</h3>
                    <p>{{ locale.enterNumbers[currentLang] }}</p>
                    <figure class="formimage" v-once>
                        <img class="langcontent langcontent-ja" src="/static/images/figure-inquiryform-ja.png">
                        <img class="langcontent langcontent-en" src="/static/images/figure-inquiryform-en.png">
                    </figure>
                </div>
            </div>
        </div>
    </footer>

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
                PleasePrepare: {
                    ja: '入場用QRコードを準備してお待ち下さい',
                    en: 'Please prepare to show your QR code for entrance.',
                },
                howtoGetQr: {
                    ja: '入場用QRコード入手方法',
                    en: 'How to get your QR code for entrance',
                },
                scanBelowQr: {
                    ja: '以下のQRコードから<br>チケット紹介ページへ',
                    en: 'Go to the Check Ticket page by scanning the below QR code.',
                },
                enterNumbers: {
                    ja: 'チケット購入番号と購入時の電話番号を入力して照会',
                    en: 'Enter the purchase number and the telephone number.',
                },
            },
            currentPerformance: {},
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

                    this.currentPerformance = this.manipulateScheduleData(scheduleArray).filter((pf) => {
                        return (moment().isBetween(moment(pf.startDate), moment(pf.endDate)));
                    })[0];
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
        width: 1080px; // 100%;
        height: 1920px; // 100%;
        overflow: hidden;
        position: relative;
        padding-bottom: 490px; // 25.6vw;
        user-select: none;
    }
    h2, h3, p {
        font-weight: normal;
        margin: 0;
    }
    header {
        color: #fff;
        background-color: #000;
        height: 238px; // 12.4vw;
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
            width: 238px; // 12.4vw;
            // background: #191919;
            .logo {
                width: 162px; // 15vh;
                height: 162px; // 15vh;
            }
        }
        .clockwrapper {
            background: #212121;
        }
        .clock {
            font-size: 152px; // 14vh;
        }
        .icon-clock {
            &::before {
                width: 98px; // 9vh;
                height: 98px; // 9vh;
                margin-right: 32px; // 3vh;
            }
        }
    }
    .tournumber {
        text-align: center;
        padding: 120px 0; // 8vw 0;
        height: 740px; // 42vw;
        background: linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(220,220,220,1) 100%);
        h2 {
            font-size: 60px;
        }
        h3 {
            font-size: 308px; // 16vw;
        }
    }
    .time {
        background-color: #efefef;
        text-align: center;
        height: 50%;
        h2 {
            font-size: 48px; // 2.5vw;
            color: #777;
            padding: 58px 0 20px; // 3vw 0 1vw;
        }
        h3 {
            font-size: 98px; // 9vh;
            margin-bottom: 20px; // 1vw;
        }
        p {
            font-size: 40px;
        }
    }

    footer {
        color: #fff;
        background-color: #000;
        height: 490px; // 25.5vw;
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
    }
    .qrguide {
        height: 100%;
        h2 {
            text-align: center;
            border-bottom: 1px solid #5c5c5c;
            line-height: 2.4;
            font-size: 36px; // 1.9vw;
        }
        h3 {
            text-align: left;
            color: #aaa;
            font-size: 38px; // 2vw;
            padding: 6px 0 0 6px; // 0.5vh 0 0 0.5vh;
        }
        .qrguidesteps {
            display: table;
            width: 100%;
            height: 100%;
            >div {
                display: table-cell;
                width: 50%;
                text-align: center;
                &:first-child {
                    border-right: 1px solid #5c5c5c;
                }
                p {
                    padding: 0 22px; // 0 2vh;
                    font-size: 38px; // 2vw;
                    line-height: 1.2;
                }
            }
        }
        figure {
            margin: 22px auto 0; // 2vh auto 0;
        }
        .qrimage {
            width: 152px; // 14vh;
            height: 152px; // 14vh;
            padding: 10px; // 1vh;
            background: #fff;
            img {
                image-rendering: pixelated;
                vertical-align: middle;
            }
        }
        .formimage {
            max-width: 260px; // 24vh;
        }
    }
</style>
