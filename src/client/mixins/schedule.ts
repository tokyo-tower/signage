import axios from "axios";
import * as moment from "moment";
import { IAppConfig } from "../store";
import { sleep } from "./util";
import { getCredentials } from "./authorize";

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
        return "item-unavailable"; // 「-」
    }

    let className = "";
    const ymd = momentObj.format("YYYY-MM-DD");

    // 詳細パフォーマンス
    if (!performance.is_avg) {
        // 開場中ならcurrent
        if (
            momentObj.isBetween(
                `${ymd} ${performance.start_time}:00`,
                `${ymd} ${performance.end_time}:59`
            )
        ) {
            className += "item-current";
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

export interface IEvent {
    id: string;
    attributes: IAttributes;
}

export interface IAttributes {
    day: string;
    open_time: string;
    start_time: string;
    end_time: string;
    seat_status: string;
    tour_number: string;
    wheelchair_available: number;
    ticket_types: ITickettype[];
    online_sales_status: string;
}

export interface ITickettype {
    charge: number;
    name: IName;
    id: string;
    available_num: number;
}

export interface IName {
    en: string;
    ja: string;
}

/**
 * パフォーマンス検索
 */
export async function fetchScheduleStatus(
    store: any,
    params: {
        day: string;
        performanceId?: string;
    }
) {
    try {
        const APPCONFIG: IAppConfig = store.state.APPCONFIG;
        if (APPCONFIG.API_STATUS_ENDPOINT === undefined) {
            new Error("API_STATUS_ENDPOINT undefined");
        }

        const credentials = await getCredentials();
        const accessToken = credentials.accessToken;
        const API_ENDPOINT = APPCONFIG.SMART_THEATER_API_ENDPOINT;
        const PROJECT_ID = APPCONFIG.PROJECT_ID;
        const API_TIMEOUT = Number(APPCONFIG.API_TIMEOUT);
        const url = `${API_ENDPOINT}/projects/${PROJECT_ID}/performances`;

        const limit = 100;
        let page = 1;
        let roop = true;
        let result: IEvent[] = [];
        while (roop) {
            const searchResult = (
                await axios.get<{ data: IEvent[] }>(url, {
                    params: { ...params, page, limit },
                    headers: {
                        Authorization: "Bearer " + accessToken
                    },
                    timeout: API_TIMEOUT || 50000
                })
            ).data.data;

            result = [...result, ...searchResult];
            page++;
            roop = searchResult.length === limit;
            if (roop) {
                await sleep(1000);
            }
        }
        store.commit("UPDATE_MOMENTOBJ");
        let errorMsg = "";
        if (!Array.isArray(result)) {
            errorMsg = `(${store.state.moment.format(
                "HH:mm:ss"
            )}) [取得データ異常]`;
            store.commit("SET_ERRORMSG", errorMsg);
            return [];
        } else if (result.length === 0) {
            errorMsg = `(${store.state.moment.format(
                "HH:mm:ss"
            )})[スケジュールデータが見つかりませんでした]`;
            store.commit("SET_ERRORMSG", errorMsg);
            return [];
        }
        store.commit("CLEAR_ERRORMSG");
        const sortResult = result.sort((a, b) => {
            const startDateA = `${a.attributes.day}${a.attributes.start_time}`;
            const startDateB = `${b.attributes.day}${b.attributes.start_time}`;
            if (startDateA < startDateB) {
                return -1;
            }
            if (startDateA > startDateB) {
                return 1;
            }
            return 0;
        });
        const convertResult = sortResult.map(s => performance2result(s));
        return convertResult;
    } catch (error) {
        console.log(error);
        store.commit("UPDATE_MOMENTOBJ");
        store.commit(
            "SET_ERRORMSG",
            `(${store.state.moment.format(
                "HH:mm:ss"
            )}) [通信エラー][ステータス取得] ${error.message}`
        );
        return [];
    }
}

// APIのレスポンスを整形
export function manipulateScheduleData(
    scheduleArray: IPerformance[],
    options?: { setGateEndTime: boolean }
) {
    if (!Array.isArray(scheduleArray)) {
        return [];
    }
    return scheduleArray.map(schedule => {
        const moment_startDate = moment(schedule.startDate);
        const moment_endDate = moment(schedule.endDate);
        if (options !== undefined && options.setGateEndTime) {
            moment_endDate.add(5, "minute");
        }
        return {
            id: schedule.id,
            day: moment_startDate.format("YYYYMMDD"),
            hour: moment_startDate.format("HH"),
            start_time: moment_startDate.format("HH:mm"),
            end_time: moment_endDate.format("HH:mm"),
            startDate: schedule.startDate,
            endDate: schedule.endDate,
            seat_status: schedule.remainingAttendeeCapacity,
            tour_number: schedule.tourNumber,
            unavailable:
                schedule.evServiceStatus !== "Normal" ||
                schedule.onlineSalesStatus !== "Normal" // ※ 「オンライン販売を止めて現場でのみ売る」という運用は無い ( TTTS-393#comment-55927483 )
        };
    });
}

// 現在時刻から次の更新時刻までのsetTimeout用msを得る
export function getNextTickUnixtime() {
    const now = moment();
    return moment(now.format("YYYYMMDD HHmm"), "YYYYMMDD HHmm")
        .add(1, "minutes")
        .diff(now, "milliseconds");
}

export interface IPerformance {
    id: string;
    startDate: Date;
    endDate: Date;
    eventStatus: string;
    remainingAttendeeCapacity?: number;
    tourNumber?: string;
    evServiceStatus: string;
    onlineSalesStatus: string;
}

// tslint:disable-next-line:max-func-body-length
export function performance2result(event: IEvent): IPerformance {
    return {
        id: event.id,
        startDate: moment(
            `${event.attributes.day}${event.attributes.start_time}`,
            "YYYYMMDDHHmm"
        ).toDate(),
        endDate: moment(
            `${event.attributes.day}${event.attributes.end_time}`,
            "YYYYMMDDHHmm"
        ).toDate(),
        eventStatus: event.attributes.online_sales_status,
        remainingAttendeeCapacity: Number(event.attributes.seat_status),
        tourNumber: event.attributes.tour_number,
        evServiceStatus: event.attributes.online_sales_status,
        onlineSalesStatus: event.attributes.online_sales_status
    };
}
