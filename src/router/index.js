import Vue from 'vue';
import VueRouter from 'vue-router';
import Store from '../store';

Vue.use(VueRouter);

const Router = new VueRouter({
    routes: [
        {
            name: 'home',
            path: '/',
            component: resolve => require(['../pages/Home'], resolve),
            meta: {
                title: '東京タワー サイネージ画面一覧',
            },
        },
        {
            name: 'info',
            path: '/info',
            component: resolve => require(['../pages/Info'], resolve),
            meta: {
                title: '東京タワー TDTチケット空き状況',
            },
        },
        {
            name: 'guide_lane',
            path: '/guide/lane',
            component: resolve => require(['../pages/GuideLane'], resolve),
            meta: {
                title: '東京タワー 入場案内 トップデッキレーン',
                vertical: true,
            },
        },
        {
            name: 'guide_gate',
            path: '/guide/gate',
            component: resolve => require(['../pages/GuideGate'], resolve),
            meta: {
                title: '東京タワー 入場案内 トップデッキゲート',
            },
        },
        {
            name: 'suspend',
            path: '/suspend',
            component: resolve => require(['../pages/Sleep'], resolve),
            meta: {
                title: '東京タワー トップデッキツアー休止中',
            },
        },
        {
            name: 'suspend.vertical',
            path: '/vertical/suspend',
            component: resolve => require(['../pages/Sleep'], resolve),
            meta: {
                title: '東京タワー トップデッキツアー休止中',
                vertical: true,
            },
        },
        {
            name: 'closed',
            path: '/closed',
            component: resolve => require(['../pages/Sleep'], resolve),
            meta: {
                title: '東京タワー トップデッキツアー受付終了',
            },
        },
        {
            name: 'closed.vertical',
            path: '/vertical/closed',
            component: resolve => require(['../pages/Sleep'], resolve),
            meta: {
                title: '東京タワー トップデッキツアー受付終了',
                vertical: true,
            },
        },
        {
            name: 'sleep',
            path: '/sleep',
            component: resolve => require(['../pages/Sleep'], resolve),
            meta: {
                title: '東京タワー 営業時間外',
            },
        },
        {
            name: 'sleep.vertical',
            path: '/vertical/sleep',
            component: resolve => require(['../pages/Sleep'], resolve),
            meta: {
                title: '東京タワー 営業時間外',
                vertical: true,
            },
        },
    ],
});

Router.beforeEach((to, from, next) => {
    // ページVueを遅延ロードにした場合はローディング出した方がよい？
    // Store.commit('SET_LOADINGMSG', 'Loading...');
    window.document.title = to.meta.title;
    return next();
});
Router.afterEach(() => {
    // ページ出たらローディングは消す
    Store.commit('CLEAR_LOADINGMSG');
});
export default Router;
