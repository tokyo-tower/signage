import * as axios from 'axios';
import * as moment from 'moment';

// PHPなどのsleepと同じ。UI表示調整用
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 現在時刻から次の更新時刻までのsetTimeout用msを得る
export function getNextTickUnixtime() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), (now.getMinutes() + 1), 0, 0) - now;
}

// パフォーマンス情報を見てCSSクラス付与
const STATUS_THRESHOLD_CROWDED = 10; // 10未満なら△
export function getStatusClassNameByPerformance(momentObj, performance) {
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
export function fetchScheduleStatus(params) {
    const APPCONFIG = this.$store.state.APPCONFIG;
    params.now = Date.now();
    return new Promise((resolve) => {
        axios.get(APPCONFIG.API_STATUS_ENDPOINT, {
            params,
            timeout: APPCONFIG.API_TIMEOUT,
        }).then((res) => {
            this.$store.commit('UPDATE_MOMENTOBJ');
            let errorMsg = '';
            if (!Array.isArray(res.data)) {
                errorMsg = `(${this.$store.state.moment.format('HH:mm:ss')}) [取得データ異常]`;
            }
            if (errorMsg) {
                this.$store.commit('SET_ERRORMSG', errorMsg);
            } else {
                this.$store.commit('CLEAR_ERRORMSG');
            }
            return resolve(res.data.sort((a, b) => {
                if (a.startDate < b.startDate) { return -1; }
                if (a.startDate > b.startDate) { return 1; }
                return 0;
            }));
        }).catch((err) => {
            console.log(err);
            this.$store.commit('UPDATE_MOMENTOBJ');
            this.$store.commit('SET_ERRORMSG', `(${this.$store.state.moment.format('HH:mm:ss')}) [通信エラー][ステータス取得] ${err.message}`);
            return resolve([]);
        });
    });
}

// APIのレスポンスを整形
export function manipulateScheduleData(scheduleArray, _options) {
    if (!Array.isArray(scheduleArray)) {
        return [];
    }
    const options = _options || {};
    return scheduleArray.map((schedule) => {
        const moment_startDate = moment(schedule.startDate);
        const moment_endDate = moment(schedule.endDate);
        if (options.setGateEndTime) {
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
            tour_number: schedule.tourNumber,
            unavailable: (schedule.evServiceStatus === 'Suspended'),
        };
    });
}
