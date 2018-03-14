<template>
<div class="content" v-once>
    <div class="menu">
        <ul v-for="(pages, group) in pagesByGroup" :key="group">
            <li v-for="page in pages" :key="page.path">
                <router-link :to="page.path"><span>{{ page.title }}</span></router-link>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
export default {
    computed: {
        // 全routeを分類ごとに分ける
        pagesByGroup() {
            const ret = {};
            this.$router.options.routes.forEach((route) => {
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
};
</script>

<style lang="scss" scoped>
    .menu{
        padding: 20px;
    }
    ul {
        font-size: 2em;
        margin-bottom: 1em;
        li {
            list-style-type: square;
            a {
                color: #a3bad2;
                text-decoration: none;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
</style>
