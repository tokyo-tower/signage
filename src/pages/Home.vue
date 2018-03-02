<template>
<div class="content" v-once>
    <div class="menu">
        <ul>
            <li>[東京タワーサイネージ]
                <ul>
                    <li><router-link to="/info"><span>チケット空き状況画面</span></router-link></li>
                </ul>
                <ul>
                    <li><router-link to="/guide/lane"><span>入場案内-トップデッキレーン</span></router-link></li>
                    <li><router-link to="/guide/lane?rightTop=true"><span>入場案内-トップデッキレーン (右回転)</span></router-link></li>
                </ul>
                <ul>
                    <li><router-link to="/guide/gate"><span>入場案内-トップデッキゲート</span></router-link></li>
                </ul>
                <ul>
                    <li><router-link to="/suspend"><span>ツアー休止中</span></router-link></li>
                    <li><router-link to="/vertical/suspend"><span>ツアー休止中(縦)</span></router-link></li>
                    <li><router-link to="/vertical/suspend?rightTop=true"><span>ツアー休止中(縦-右回転)</span></router-link></li>
                </ul>
                <ul>
                    <li><router-link to="/closed"><span>ツアー受付終了</span></router-link></li>
                    <li><router-link to="/vertical/closed"><span>ツアー受付終了(縦)</span></router-link></li>
                    <li><router-link to="/vertical/closed?rightTop=true"><span>ツアー受付終了(縦-右回転)</span></router-link></li>
                </ul>
                <ul>
                    <li><router-link to="/sleep"><span>営業時間外</span></router-link></li>
                    <li><router-link to="/vertical/sleep"><span>営業時間外(縦)</span></router-link></li>
                    <li><router-link to="/vertical/sleep?rightTop=true"><span>営業時間外(縦-右回転)</span></router-link></li>
                </ul>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
export default {
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
            ul {
                font-size: 1em;
            }
        }
    }
</style>
