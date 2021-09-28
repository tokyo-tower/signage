# frontend_tttssignnage

> 東京電波塔-サイネージ画面

-   Vue-Cli の webpack テンプレートを元に作成した SPA
-   使用領域 =
    -- 1F チケットカウンターの空き情報掲示
    -- トップデッキレーンの入場案内
    -- トップデッキゲートの入場案内

### 環境変数

※値は全て必須で空のものがあるとエラー終了
| Name | Required | Purpose |
| ----------------------------- | ----- | ------------------------------------- |
| `SMART_THEATER_API_ENDPOINT`  | true  | API エンドポイント                     |
| `API_TIMEOUT`                 | true  | API タイムアウト時間(ms)               |
| `CLIENT_ID`                   | true  | CLIENT ID                             |
| `CLIENT_SECRET              ` | true  | CLIENT SECRET                         |
| `AUTHORIZATION_SERVER_DOMAIN` | true  | DOMAIN                                |
| `PROJECT_ID`                  | true  | プロジェクト ID                        |
| `CHANGE_SCALE`                | false | スケール変更                           |

### 廃止された環境変数

| Name                               | Required | Purpose                 |
| ---------------------------------- | -------- | ----------------------- |
| `API_ENDPOINT`                     | true     | API エンドポイント      |
| `API_STATUS_ENDPOINT`              | true     | 現況 API エンドポイント |
| `CLIENT_CREDENTIALS_CLIENT_ID`     | true     | CLIENT ID               |
| `CLIENT_CREDENTIALS_CLIENT_SECRET` | true     | CLIENT SECRET           |
| `CLIENT_CREDENTIALS_DOMAIN`        | true     | DOMAIN                  |

### その他

`/toRootDir`に入れたファイルはドキュメントルートになる`dist`にそのままコピーされる (Web.config など必要ならここに入れる)

## Build Setup

```bash
# install dependencies
npm install

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
