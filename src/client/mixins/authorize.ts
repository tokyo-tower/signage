import axios from 'axios';
import moment from 'moment';
import { sleep } from './util';

export interface ISmartTheaterCredentials {
    accessToken: string;
    expiryDate: number;
    clientId: string;
}

let smartTheaterCredentials: ISmartTheaterCredentials;

/**
 * 認証情報取得
 */
 export const getCredentials = async () => {
    try {
        // eslint-disable-next-line prettier/prettier
        if (smartTheaterCredentials !== undefined && smartTheaterCredentials.expiryDate !== undefined) {
            const { expiryDate } = smartTheaterCredentials;
            const isTokenExpired =
                expiryDate !== undefined
                    ? moment(expiryDate)
                          .add(-5, 'minutes')
                          .unix() <= moment().unix()
                    : false;
            if (!isTokenExpired) {
                // 期限が5分以上あるならアクセストークン更新しない
                return smartTheaterCredentials;
            }
        }
        const url = '/api/authorize/getToken';
        const limit = 5;
        let count = 0;
        let loop = true;
        while (loop) {
            loop = false;
            try {
                const result = (await axios.post<{ accessToken: string; expiryDate: number; clientId: string; }>(url)).data;
                smartTheaterCredentials = result;
                break;
            } catch (error) {
                if (error.status !== undefined && error.status >= 500) {
                    loop = count < limit;
                    count++;
                    await sleep(20000);
                    continue;
                }
                throw error;
            }
        }
        return smartTheaterCredentials;
    } catch (e) {
        console.log('[catched][getCredentials]', e);
        throw typeof e === 'string' ? new Error(`Auth Error: ${e}`) : e;
    }
};
