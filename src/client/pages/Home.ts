import Vue from 'vue';

export default Vue.extend({
    computed: {
        // 全routeを分類ごとに分ける
        pagesByGroup() {
            const ret: any = {};
            (<any>this.$router).options.routes.forEach((route: any) => {
                if (!route.meta.group) { return true; }
                ret[route.meta.group] = ret[route.meta.group] || [];
                return ret[route.meta.group].push({
                    title: route.meta.title.replace('東京タワー ', ''),
                    path: route.path,
                });
            });
            return ret;
        },
    },
});