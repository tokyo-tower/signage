# frontend_tttssignnage
> 東京電波塔-サイネージ画面
- Vue-Cliのwebpackテンプレートを元に作成したSPA
- 使用領域 = 
-- 1Fチケットカウンターの空き情報掲示
-- トップデッキレーンの入場案内
-- トップデッキゲートの入場案内

### アプリ設定
configを設置先の環境変数から変えられた方がよいということで
buildされたアプリはPHPファイル (`/static/config/prd.php`) 経由で必要な環境変数を読み込む
(開発時はローカルのjson (`/static/config/dev.json`) が読まれる。(この処理は `/src/store` 内で分岐している)
※値は全て必須で空のものがあるとエラー終了
| Name                                   | Required | Purpose                               |
| -------------------------------------  | -------- | ------------------------------------- |
| `API_STATUS_ENDPOINT`                  | true     | 現況APIエンドポイント                      |
| `API_TIMEOUT`                          | true     | APIタイムアウト時間(ms)                   |

### その他
`/toRootDir`に入れたファイルはドキュメントルートになる`dist`にそのままコピーされる (Web.configなど必要ならここに入れる)

## Build Setup
※デプロイはpush後に /dist/ をドキュメントルートとして参照すればよいので開発しないなら install や build は不要

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
