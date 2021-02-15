import Vue from 'vue';
import VueRouter from 'vue-router';
import Store from '../store';

Vue.use(VueRouter);

const Router = new VueRouter({
    routes: [
        {
            name: 'home',
            path: '/',
            // component: resolve => require(['../pages/Home'], resolve),
            component: require('../pages/Home.vue').default,
            meta: {
                title: '東京タワー サイネージ画面一覧',
            },
        },
        {
            name: 'todaytdt',
            path: '/todaytdt',
            // component: resolve => require(['../pages/Static'], resolve),
            component: require('../pages/Static.vue').default,
            meta: {
                group: '1fticket',
                title: '東京タワー 「トップデッキツアー 本日のチケット」',
                noclock: true,
            },
        },
        {
            name: 'info',
            path: '/info',
            // component: resolve => require(['../pages/Info'], resolve),
            component: require('../pages/Info.vue').default,
            meta: {
                group: '1fticket',
                title: '東京タワー トップデッキツアー チケット空き状況',
            },
        },
        {
            name: 'guide_lane',
            path: '/guide/lane',
            // component: resolve => require(['../pages/GuideLane'], resolve),
            component: require('../pages/GuideLane.vue').default,
            meta: {
                group: 'lane',
                title: '東京タワー 入場案内 トップデッキレーン',
                vertical: true,
            },
        },
        {
            name: 'guide_gate',
            path: '/guide/gate',
            // component: resolve => require(['../pages/GuideGate'], resolve),
            component: require('../pages/GuideGate.vue').default,
            meta: {
                group: 'gate',
                title: '東京タワー 入場案内 トップデッキゲート',
            },
        },
        {
            name: 'suspend',
            path: '/suspend',
            // component: resolve => require(['../pages/Static'], resolve),
            component: require('../pages/Static.vue').default,
            meta: {
                group: 'suspend',
                title: '東京タワー トップデッキツアー休止中',
            },
        },
        {
            name: 'suspend.vertical',
            path: '/vertical/suspend',
            // component: resolve => require(['../pages/Static'], resolve),
            component: require('../pages/Static.vue').default,
            meta: {
                group: 'suspend',
                title: '東京タワー トップデッキツアー休止中 (縦)',
                vertical: true,
            },
        },
        {
            name: 'suspend.vertical',
            path: '/vertical/suspend?rightTop=true',
            // component: resolve => require(['../pages/Static'], resolve),
            component: require('../pages/Static.vue').default,
            meta: {
                group: 'suspend',
                title: '東京タワー トップデッキツアー休止中 (縦-右回転)',
                vertical: true,
            },
        },
        {
            name: 'closed',
            path: '/closed',
            // component: resolve => require(['../pages/Static'], resolve),
            component: require('../pages/Static.vue').default,
            meta: {
                group: 'closed',
                title: '東京タワー トップデッキツアー受付終了',
            },
        },
        {
            name: 'closed.vertical',
            path: '/vertical/closed',
            // component: resolve => require(['../pages/Static'], resolve),
            component: require('../pages/Static.vue').default,
            meta: {
                group: 'closed',
                title: '東京タワー トップデッキツアー受付終了 (縦)',
                vertical: true,
            },
        },
        {
            name: 'closed.vertical',
            path: '/vertical/closed?rightTop=true',
            // component: resolve => require(['../pages/Static'], resolve),
            component: require('../pages/Static.vue').default,
            meta: {
                group: 'closed',
                title: '東京タワー トップデッキツアー受付終了 (縦-右回転)',
                vertical: true,
            },
        },
        {
            name: 'sleep',
            path: '/sleep',
            // component: resolve => require(['../pages/Static'], resolve),
            component: require('../pages/Static.vue').default,
            meta: {
                group: 'sleep',
                title: '東京タワー 営業時間外',
            },
        },
        {
            name: 'sleep.vertical',
            path: '/vertical/sleep',
            // component: resolve => require(['../pages/Static'], resolve),
            component: require('../pages/Static.vue').default,
            meta: {
                group: 'sleep',
                title: '東京タワー 営業時間外 (縦)',
                vertical: true,
            },
        },
        {
            name: 'sleep.vertical',
            path: '/vertical/sleep?rightTop=true',
            // component: resolve => require(['../pages/Static'], resolve),
            component: require('../pages/Static.vue').default,
            meta: {
                group: 'sleep',
                title: '東京タワー 営業時間外 (縦-右回転)',
                vertical: true,
            },
        },
    ],
});

Router.beforeEach((to, _from, next) => {
    window.document.title = to.meta.title;
    return next();
});
Router.afterEach(() => {
    Store.commit('CLEAR_LOADINGMSG');
});
export default Router;
