import * as moment from "moment";
import { schedule } from "../mixins";
import Vue from 'vue';

require("moment/locale/ja");

moment.locale("ja");

export default Vue.extend({
  data() {
    return {
      langArray: ["ja", "en", "zh-hans"],
      currentLangIndex: 0,
      locale: {
        tdt: {
          ja: "トップデッキツアー",
          en: "Top Deck Tour",
          "zh-hans": "Top Deck Tour",
        },
        tourNumber: {
          ja: "ツアーNo",
          en: "Tour No.",
          "zh-hans": "游览编号",
        },
        entranceTime: {
          ja: "入場受付時間",
          en: "Entrance Time",
          "zh-hans": "入场受理时间",
        },
        availability: {
          ja: "空き状況",
          en: "Availability",
          "zh-hans": "可预约情况",
        },
      },
      ticketinfoArray: [
        // ※ダイナミックプライシング導入後はAPIから取得
        {
          ticket_id: "001",
          price: 3000,
          ja: {
            name: "大人",
            cap: "",
          },
          en: {
            name: "Adult",
            cap: "(over 18 years)",
          },
          "zh-hans": {
            name: "大人",
            cap: "(19岁以上)",
          },
        },
        {
          ticket_id: "002",
          price: 2800,
          ja: {
            name: "高校生",
            cap: "",
          },
          en: {
            name: "High School",
            cap: "(16-18 years)",
          },
          "zh-hans": {
            name: "高中生",
            cap: "(16～18岁)",
          },
        },
        {
          ticket_id: "003",
          price: 2000,
          ja: {
            name: "子供",
            cap: "(小・中学生)",
          },
          en: {
            name: "Junior",
            cap: "(7-15 years)",
          },
          "zh-hans": {
            name: "儿童",
            cap: "(7～15岁)",
          },
        },
        {
          ticket_id: "004",
          price: 1400,
          ja: {
            name: "幼児",
            cap: "(4歳以上)",
          },
          en: {
            name: "Child",
            cap: "(4-6 years)",
          },
          "zh-hans": {
            name: "幼儿",
            cap: "(4～6岁)",
          },
        },
      ],
      nearStatusArray: <{
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
      futureAvgStatusArray: <{
        hours: string;
        seat_status: number;
        unavailable: boolean;
        is_avg: boolean;
      }[]>[],
      timeoutInstance_changeLang: <NodeJS.Timeout | null>null,
      timeoutInstance_IntervalFetch: <NodeJS.Timeout | null>null,
    };
  },
  computed: {
    currentLang() {
      return this.$data.langArray[this.$data.currentLangIndex];
    },
  },
  methods: {
    fetchScheduleStatus: schedule.fetchScheduleStatus,
    getNextTickUnixtime: schedule.getNextTickUnixtime,
    getStatusClassNameByPerformance: schedule.getStatusClassNameByPerformance,
    manipulateScheduleData: schedule.manipulateScheduleData,
    echoPrice(price: number) {
      return `￥${price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`;
    },
    updateStatus() {
      return new Promise<void>(async (resolve, reject) => {
        try {
          const scheduleArray = await this.fetchScheduleStatus(this.$store, {
            day: moment().minute(0).second(0).milliseconds(0).format('YYYYMMDD'),
            // startFrom: moment_start.toDate(),
            // startThrough: moment_start
            //   .add(4, "hour")
            //   .minute(59)
            //   .second(59)
            //   .toDate(),
          });

          const currentHour = moment().hour();
          const nearStatusArray: {
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
          }[] = [];

          // 直近4つをまとめつつ1hごとにまとめる
          const hourArray: string[] = [];
          const performancesByHour: any = {};
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
          const futureHourArray = [...Array(4)].map((_v, i) => {
            return i + 1 + currentHour;
          });

          // hourごとの performance の平均を求める
          this.futureAvgStatusArray = futureHourArray
            .filter((h) => {
              return typeof performancesByHour[h] === "object";
            })
            .map((hour) => {
              // seat_status の平均(小数点切り捨て)の数字で⚪△×判定する
              // unavailable は0として集計。hour内全てが unavailable だった時は平均も unavailable (「-」) にする
              let allUnavailable = true;
              const avgStatus = Math.floor(
                performancesByHour[hour].reduce((p: number, c: {
                  hours: string;
                  seat_status: number;
                  unavailable: boolean;
                  is_avg: boolean;
                }) => {
                  if (!c.unavailable) {
                    allUnavailable = false;
                    let num = c.seat_status;
                    if (isNaN(num)) {
                      num = 0;
                    }
                    return p + num;
                  }
                  return p; // unavailable だったので seat_status を加算しない
                }, 0) / performancesByHour[hour].length
              );
              return {
                hours: `${hour}:00～${`0${hour + 1}`.slice(1)}:00`,
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
      if (this.timeoutInstance_IntervalFetch !== null) {
        clearTimeout(this.timeoutInstance_IntervalFetch);
      }
      this.timeoutInstance_IntervalFetch = setTimeout(async () => {
        await this.updateStatus();
        this.setFetchStatusDataTimeout();
      }, this.getNextTickUnixtime());
    },
    setChangeLangTimeout(ms?: number) {
      if (this.timeoutInstance_changeLang !== null) {
        clearTimeout(this.timeoutInstance_changeLang);
      }
      this.timeoutInstance_changeLang = setTimeout(() => {
        this.$emit("langChanged");
        this.currentLangIndex++;
        if (this.currentLangIndex > this.langArray.length - 1) {
          this.currentLangIndex = 0;
          this.setChangeLangTimeout(6000); // 先頭は日本語なので長く表示
        } else {
          this.setChangeLangTimeout();
        }
      }, ms || 3000);
    },
  },
  created() {
    this.$store.commit("SET_LOADINGMSG", "最新の情報を取得中...");
    this.updateStatus().then(() => {
      this.$store.commit("CLEAR_LOADINGMSG");
      this.setFetchStatusDataTimeout();
      this.setChangeLangTimeout(6000);
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