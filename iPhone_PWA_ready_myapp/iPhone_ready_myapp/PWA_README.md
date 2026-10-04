# iPhoneホーム画面用PWA

このプロジェクトは、`www/` をWebサーバーから配信するとiPhoneのSafariからホーム画面へ追加できるPWA構成です。

## iPhoneでの追加方法

1. `www` フォルダをHTTPSで公開します（localhostではiPhoneからアクセスできないため、iPhoneと同じネットワーク上のPCサーバーを使う場合もHTTPSが必要です）。
2. iPhoneのSafariで `www/index.html` のURLを開きます。
3. 共有ボタン → 「ホーム画面に追加」を選択します。
4. 「モモンガレム」のアイコンから起動します。

## 注意

- PWAのService Workerは `file://` で直接index.htmlを開いただけでは動作しません。
- iPhoneではホーム画面追加後、SafariのWebViewとしてスタンドアロン表示されます。
- ローカルファイル選択、ブラウザの音声制限、外部URL/YouTubeなどはiOS側の制約を受ける場合があります。
- 設定JSONはアプリ内のJavaScript/localStorageを利用するため、通常のブラウザデータ削除で消える可能性があります。
