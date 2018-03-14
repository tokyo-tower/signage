<template>
    <span class="shineicon" v-once>
        <img ref="image" src="/static/images/logo-tdt.svg" @load.once="init">
        <canvas ref="canvas"></canvas>
    </span>
</template>

<script>
/*
  光沢アニメーション付きロゴコンポーネント
  - APNGをCanvasに変換して制御できるライブラリ ( https://github.com/davidmz/apng-js ) を利用
  - propsでアニメーションタイミングを制御 (親からのイベント or 間隔指定)
  - 準備に失敗したら静止SVGを表示してしのぐ
*/
import * as axios from 'axios';
import parseAPNG from 'apng-js';

export default {
    props: {
        // this.$parentが$emitするイベント名
        targetEvent: {
            type: String,
            required: false,
            default: '',
        },
        // ↑が指定されてなかった時に勝手にループする間隔MS
        intervalMsIfNoEvent: {
            type: Number,
            required: false,
            default: 15000,
        },
    },
    data() {
        return {
            apng: null,
            ctx: null,
            ctxplayer: null,
            timeout_resize: null,
            timeout_play: null,
        };
    },
    methods: {
        // APNGがうまいこと伸縮してくれないのでcontextのscaleを設定する
        resizeCanvas() {
            if (!this.apng) { return false; }
            clearTimeout(this.timeout_resize);
            this.timeout_resize = setTimeout(() => {
                // 表示中の静止画像(透明)と同じ大きさにする
                const style = window.getComputedStyle(this.$refs.image, null);
                const sizes = {
                    width: parseInt(style.width.replace('px', ''), 10),
                    height: parseInt(style.height.replace('px', ''), 10),
                };
                this.$refs.canvas.setAttribute('width', sizes.width);
                this.$refs.canvas.setAttribute('height', sizes.height);
                this.ctx.scale((sizes.width / this.apng.width), (sizes.height / this.apng.height));
                this.playAPNG();
            }, 200);
            return false;
        },
        // APNGを取得してCanvasに変換
        loadAPNG() {
            return new Promise(async (resolve, reject) => {
                try {
                    const buffer = await axios.get('/static/images/logo_animated.png', { responseType: 'arraybuffer' });
                    this.apng = parseAPNG(buffer.data);
                    this.ctx = this.$refs.canvas.getContext('2d');
                    this.ctxplayer = await this.apng.getPlayer(this.ctx);
                    this.resizeCanvas();
                    return resolve();
                } catch (e) {
                    console.log(e);
                    return reject();
                }
            });
        },
        playAPNG() {
            this.ctxplayer.stop(); // 巻き戻し処理
            this.ctxplayer.play();
        },
        // 初期化に失敗したらCanvasを消して静止画に切り替え
        init() {
            this.loadAPNG().then(() => {
                if (this.targetEvent) {
                    this.$parent.$on('langChanged', this.playAPNG);
                } else {
                    this.ctxplayer.on('end', () => {
                        clearTimeout(this.timeout_play);
                        this.timeout_play = setTimeout(this.playAPNG, this.intervalMsIfNoEvent);
                    });
                }
                this.playAPNG();
            }).catch(() => {
                this.$refs.image.style.opacity = 1;
                this.$refs.canvas.outerHTML = '';
            });
        },
    },
    mounted() {
        window.addEventListener('resize', this.resizeCanvas, false);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeCanvas);
        clearTimeout(this.timeout_resize);
        clearTimeout(this.timeout_play);
        this.$parent.$off('langChanged', this.playAPNG);
    },
};
</script>

<style lang="scss">
.shineicon {
    position: relative;
    z-index: 8;
    overflow: hidden;
    width: 100%;
    display: block;
    font-size: 0;
    margin: auto;
    >img {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        z-index: -1;
    }
}
</style>
