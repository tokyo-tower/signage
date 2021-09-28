import Vue from 'vue';
import Vuex from 'vuex';
// import createPersistedState from 'vuex-persistedstate';
import * as axios from 'axios';
import * as moment from 'moment';

export interface IAppConfig {
    API_ENDPOINT?: string;
    SMART_THEATER_API_ENDPOINT?: string;
    API_STATUS_ENDPOINT?: string;
    API_TIMEOUT: string;
    ENV?: 'development' | 'test' | 'production';
    CHANGE_SCALE?: 'auto';
    PROJECT_ID?: string;
}

export interface IState {
    moment: moment.Moment;
    APPCONFIG?: IAppConfig;
    errorMsgStr: string;
    loadingMsg: string;
    scheduleStatus: any[];
}

Vue.use(Vuex);

const isProduction = (process.env.NODE_ENV === 'production');

export default new Vuex.Store<IState>({
    strict: !isProduction,

    // plugins: [createPersistedState({ storage: window.sessionStorage })],

    modules: {
    },

    state: {
        moment: moment(),
        // APPCONFIG: {},
        // token: '',
        // lang: 'ja',
        errorMsgStr: '',
        loadingMsg: '',
        scheduleStatus: [],
    },

    mutations: {
        SET_APPCONFIG(state, config: IAppConfig) {
            state.APPCONFIG = config;
        },

        SET_ERRORMSG(state, errorMsgStr) {
            state.errorMsgStr = errorMsgStr;
        },

        CLEAR_ERRORMSG(state) {
            state.errorMsgStr = '';
        },

        SET_LOADINGMSG(state, footermsg) {
            state.loadingMsg = footermsg;
        },

        CLEAR_LOADINGMSG(state) {
            state.loadingMsg = '';
        },

        SET_SCHEDULESTATUS(state, scheduleStatus) {
            state.scheduleStatus = scheduleStatus;
        },

        UPDATE_MOMENTOBJ(state) {
            state.moment = moment();
        },
    },

    actions: {
        FETCH_APPCONFIG({ commit }) {
            return new Promise<IAppConfig>(async (resolve, reject) => {
                const url = '/api/config';
                axios.default.get<IAppConfig>(url).then((res) => {
                    if (typeof res.data !== 'object'
                        || res.data.API_ENDPOINT === undefined) {
                        return reject();
                    }
                    if (res.data.API_TIMEOUT === undefined) {
                        res.data.API_TIMEOUT = '30000';
                    }
                    commit('SET_APPCONFIG', (res.data));
                    return resolve(res.data);
                }).catch((e) => {
                    console.error(e);
                    return reject();
                });
            });
        },

        QUIT() {
            return new Promise<void>(async (resolve) => {
                // ページごと初期化する
                // window.sessionStorage.removeItem('vuex');
                window.location.href = window.location.href.split('#')[0];
                resolve();
            });
        },
    },
});
