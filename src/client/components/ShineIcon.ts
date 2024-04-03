/*
  光沢アニメーション付きロゴコンポーネント
  - APNGをCanvasに変換して制御できるライブラリ ( https://github.com/davidmz/apng-js ) を利用
  - propsでアニメーションタイミングを制御 (親からのイベント or 間隔指定)
  - 準備に失敗したら静止SVGを表示してしのぐ
*/
import * as axios from "axios";
import parseAPNG, { APNG } from "apng-js";
import Vue from 'vue';
import Player from "apng-js/types/library/player";

export default Vue.extend({
  props: {
    // this.$parentが$emitするイベント名
    targetEvent: {
      type: String,
      required: false,
      default: "",
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
      apng: <APNG | null>null,
      ctx: <CanvasRenderingContext2D | null>null,
      ctxplayer: <Player | null>null,
      timeout_resize: <NodeJS.Timeout | null>null,
      timeout_play: <NodeJS.Timeout | null>null,
    };
  },
  methods: {
    // APNGがうまいこと伸縮してくれないのでcontextのscaleを設定する
    resizeCanvas() {
      if (this.apng === null || this.ctx === null) {
        return false;
      }
      if (this.timeout_resize !== null) {
        clearTimeout(this.timeout_resize);
      }
      this.timeout_resize = setTimeout(() => {
        // 表示中(透明)の静止画像と同じ大きさにする
        const image = <Element>this.$refs.image;
        const style = window.getComputedStyle(image, null);
        const sizes = {
          width: parseInt(style.width.replace("px", ""), 10),
          height: parseInt(style.height.replace("px", ""), 10),
        };
        const canvas = (<Element>this.$refs.canvas);
        canvas.setAttribute("width", String(sizes.width));
        canvas.setAttribute("height", String(sizes.height));
        (<CanvasRenderingContext2D>this.ctx).scale(
          sizes.width / (<APNG>this.apng).width,
          sizes.height / (<APNG>this.apng).height
        );
        this.playAPNG();
      }, 200);
      return false;
    },
    // APNGを取得してCanvasに変換
    loadAPNG() {
      return new Promise<void>(async (resolve, reject) => {
        try {
          const buffer = await axios.default.get(
            "/static/images/logo_animated.png",
            { responseType: "arraybuffer" }
          );
          this.apng = <APNG>parseAPNG(buffer.data);
          const canvas = (<HTMLCanvasElement>this.$refs.canvas);
          this.ctx = canvas.getContext("2d");
          if (this.ctx === null) {
            throw new Error('ctx === null');
          }
          this.ctxplayer = await this.apng.getPlayer(this.ctx);
          this.resizeCanvas();
          return resolve();
        } catch (e) {
          console.log(e);
          return reject();
        }
      });
    },
    // APNGの再生
    playAPNG() {
      if (this.ctxplayer === null) {
        return;
      }
      this.ctxplayer.stop(); // 巻き戻し処理
      this.ctxplayer.play();
    },
    // Canvasを棄ててSVGの静止画像に切り替え
    abandon() {
     (<any>this.$refs.image).style.opacity = 1;
     (<any>this.$refs.canvas).outerHTML = "";
    },
    // 静止画SVGの読み込みが終わったら初期化開始
    init() {
      if (this.$route.query.noshine) {
        return this.abandon();
      }
      return this.loadAPNG()
        .then(() => {
          if (this.targetEvent && this.$parent) {
            this.$parent.$on(this.targetEvent, this.playAPNG);
          } else {
            (<Player>this.ctxplayer).on("end", () => {
              if (this.timeout_play !== null) {
                clearTimeout(this.timeout_play);
              }
              this.timeout_play = setTimeout(
                this.playAPNG,
                this.intervalMsIfNoEvent
              );
            });
            this.playAPNG();
          }
        })
        .catch(() => {
          this.abandon();
        });
    },
  },
  mounted() {
    window.addEventListener("resize", this.resizeCanvas, false);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCanvas);
    if (this.timeout_resize !== null) {
      clearTimeout(this.timeout_resize);
    }
    if (this.timeout_play !== null) {
      clearTimeout(this.timeout_play);
    }
    if(this.$parent) {
      this.$parent.$off(this.targetEvent, this.playAPNG);
    }
  },
});