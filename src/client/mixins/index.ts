import { factory } from '@cinerino/sdk';
import * as axios from 'axios';
import * as moment from 'moment';

// PHPなどのsleepと同じ。UI表示調整用
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 現在時刻から次の更新時刻までのsetTimeout用msを得る
export function getNextTickUnixtime() {
    const now = moment();
    return moment(now.format('YYYYMMDD HHmm'), 'YYYYMMDD HHmm').add(1, 'minutes').diff(now, 'milliseconds');
}

// パフォーマンス情報を見てCSSクラス付与
const STATUS_THRESHOLD_CROWDED = 38; // 38未満なら△
export function getStatusClassNameByPerformance(
    momentObj: moment.Moment,
    performance: {
        is_avg: boolean;
        start_time: string;
        end_time: string;
        seat_status: string;
        unavailable: boolean;
    }
) {
    if (performance.unavailable) {
        return 'item-unavailable'; // 「-」
    }

    let className = '';
    const ymd = momentObj.format('YYYY-MM-DD');

    // 詳細パフォーマンス
    if (!performance.is_avg) {
        // 開場中ならcurrent
        if (momentObj.isBetween(`${ymd} ${performance.start_time}:00`, `${ymd} ${performance.end_time}:59`)) {
            className += 'item-current';
        }
        // 開場時間を過ぎてたらsoldout
        if (momentObj.isAfter(`${ymd} ${performance.end_time}:59`)) {
            return `${className} item-soldout`;
        }
    }

    // 残数で分岐
    const num = parseInt(performance.seat_status, 10) || 0;
    if (num < STATUS_THRESHOLD_CROWDED && num > 0) {
        return `${className} item-crowded`;
    } else if (num === 0) {
        return `${className} item-soldout`;
    }
    return `${className} item-capable`;
}

// APIからステータス取得
export function fetchScheduleStatus(store: any, params: {
    startFrom: string;
    startThrough: string;
}) {
    const APPCONFIG = store.state.APPCONFIG;
    return new Promise<factory.chevre.event.screeningEvent.IEvent[]>((resolve) => {
        axios.default.get(APPCONFIG.API_STATUS_ENDPOINT, {
            params: { ...params, now: Date.now() },
            timeout: APPCONFIG.API_TIMEOUT,
        }).then((res) => {
            store.commit('UPDATE_MOMENTOBJ');
            let errorMsg = '';
            if (!Array.isArray(res.data)) {
                errorMsg = `(${store.state.moment.format('HH:mm:ss')}) [取得データ異常]`;
            }
            if (errorMsg) {
                store.commit('SET_ERRORMSG', errorMsg);
            } else {
                store.commit('CLEAR_ERRORMSG');
            }
            return resolve(res.data.sort((a: factory.chevre.event.screeningEvent.IEvent, b: factory.chevre.event.screeningEvent.IEvent) => {
                if (a.startDate < b.startDate) { return -1; }
                if (a.startDate > b.startDate) { return 1; }
                return 0;
            }));
        }).catch((err) => {
            console.log(err);
            store.commit('UPDATE_MOMENTOBJ');
            store.commit('SET_ERRORMSG', `(${store.state.moment.format('HH:mm:ss')}) [通信エラー][ステータス取得] ${err.message}`);
            return resolve([]);
        });
    });
}

// APIのレスポンスを整形
export function manipulateScheduleData(
    scheduleArray: factory.chevre.event.screeningEvent.IEvent[],
    options?: { setGateEndTime: boolean; }) {
    if (!Array.isArray(scheduleArray)) {
        return [];
    }
    return scheduleArray.map((schedule) => {
        const moment_startDate = moment(schedule.startDate);
        const moment_endDate = moment(schedule.endDate);
        if (options !== undefined && options.setGateEndTime) {
            moment_endDate.add(5, 'minute');
        }
        return {
            id: schedule.id,
            day: moment_startDate.format('YYYYMMDD'),
            hour: moment_startDate.format('HH'),
            start_time: moment_startDate.format('HH:mm'),
            end_time: moment_endDate.format('HH:mm'),
            startDate: schedule.startDate,
            endDate: schedule.endDate,
            seat_status: schedule.remainingAttendeeCapacity,
            tour_number: (<any>schedule).tourNumber,
            unavailable: ((<any>schedule).evServiceStatus !== 'Normal' || (<any>schedule).onlineSalesStatus !== 'Normal'), // ※ 「オンライン販売を止めて現場でのみ売る」という運用は無い ( TTTS-393#comment-55927483 )
        };
    });
}
