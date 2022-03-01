import * as moment from "moment";
import * as mixins from '../mixins';
import Vue from 'vue';

require("moment/locale/ja");

moment.locale("ja");

export default Vue.extend({
    data() {
        return {
            langArray: ["ja", "en"],
            currentLangIndex: 0,
            locale: {
                tourNumber: {
                    ja: "ツアーNo",
                    en: "Tour No.",
                },
                entranceTime: {
                    ja: "入場受付時間",
                    en: "Entrance Time",
                },
                pleasePrepare: {
                    ja: "入場用QRコードを準備してお待ち下さい",
                    en: "Please prepare to show your QR code for entrance.",
                },
            },
            currentPerformanceArray: <{
                id: string;
                day: string;
                hour: string;
                start_time: string;
                end_time: string;
                startDate: Date;
                endDate: Date;
                seat_status: number | undefined;
                tour_number: any;
                unavailable: boolean;
            }[]>[],
            timeoutInstance_IntervalFetch: <NodeJS.Timeout | null>null,
            timeoutInstance_changeLang: <NodeJS.Timeout | null>null,
        };
    },
    computed: {
        currentLang() {
            return this.$data.langArray[this.$data.currentLangIndex];
        },
    },
    methods: {
        fetchScheduleStatus: mixins.schedule.fetchScheduleStatus,
        getNextTickUnixtime: mixins.schedule.getNextTickUnixtime,
        manipulateScheduleData: mixins.schedule.manipulateScheduleData,
        getCurrentPerformance() {
            return new Promise<void>(async (resolve) => {
                try {
                    const scheduleArray = await this.fetchScheduleStatus(this.$store, {
                        day: moment().minute(0).second(0).milliseconds(0).format('YYYYMMDD'),
                    });
                    this.currentPerformanceArray = this.manipulateScheduleData(
                        scheduleArray,
                        {
                            setGateEndTime: true,
                        }
                    ).filter((pf) => {
                        return moment().isBetween(
                            moment(pf.startDate),
                            moment(pf.endDate).add(5, "minute")
                        );
                    });
                } catch (e) {
                    console.log(e);
                }
                return resolve();
            });
        },
        setFetchStatusDataInterval() {
            if (this.timeoutInstance_IntervalFetch !== null) {
                clearTimeout(this.timeoutInstance_IntervalFetch);
            }
            this.timeoutInstance_IntervalFetch = setTimeout(() => {
                this.getCurrentPerformance().then(() => {
                    this.setFetchStatusDataInterval();
                });
            }, this.getNextTickUnixtime());
        },
        setChangeLangTimeout(ms?: number) {
            if (this.timeoutInstance_changeLang !== null) {
                clearTimeout(this.timeoutInstance_changeLang);
            }
            this.timeoutInstance_changeLang = setTimeout(() => {
                this.currentLangIndex++;
                if (this.currentLangIndex > this.langArray.length - 1) {
                    this.currentLangIndex = 0;
                    this.setChangeLangTimeout(10000); // 先頭は日本語なので長く表示
                } else {
                    this.setChangeLangTimeout();
                }
                this.$emit("langChanged");
            }, ms || 5000);
        },
    },
    created() {
        this.$store.commit("SET_LOADINGMSG", "読み込み中");
        this.getCurrentPerformance().then(() => {
            this.$store.commit("CLEAR_LOADINGMSG");
            this.setFetchStatusDataInterval();
            this.setChangeLangTimeout(10000);
        });
    },
    beforeDestroy() {
        if (this.timeoutInstance_IntervalFetch !== null) {
            clearTimeout(this.timeoutInstance_IntervalFetch);
        }
        if (this.timeoutInstance_changeLang !== null) {
            clearTimeout(this.timeoutInstance_changeLang);
        }
    },
});