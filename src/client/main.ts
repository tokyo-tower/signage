// iPad前提だったがIEでも利用される可能性が出てきたのでpolyfillを入れておく
import 'es6-promise/auto';
import 'mdn-polyfills/Array.prototype.findIndex';

import Vue from 'vue';
import Store, { IAppConfig } from './store';
import Router from './router';
import { util } from './mixins';

Vue.component('ErrorOneline', require('./components/ErrorOneline.vue').default);
Vue.component('Clock', require('./components/Clock.vue').default);
Vue.component('ShineIcon', require('./components/ShineIcon.vue').default);

// APPCONFIGをVuexで保存してから初期化
Store.dispatch('FETCH_APPCONFIG').then((APPCONFIG: IAppConfig) => {
    console.log('APPCONFIG', APPCONFIG);
    /* eslint-disable no-new */
    new Vue({
        el: '#VueApp',
        router: Router,
        store: Store,
        render: h => h(require('./App.vue').default),
        created: () => {
            if (APPCONFIG.CHANGE_SCALE === 'auto') {
                util.changeScale();
                window.addEventListener('resize', util.changeScale, false);
            }
        }
    });
}).catch(() => {
    return alert('CONFIG LOAD ERROR');
});

util.checkVersion();