# モモンガレム アプリ化用プロジェクト

## フォルダ構成
- `www/index.html` : メイン画面
- `www/assets/images/` : 画像素材
- `www/assets/audio/` : 音声・BGM素材
- `www/assets/data/` : 設定JSON
- `main.js` : Electron起動用

この構成は、現在のHTMLを壊さずにWebアプリ/PWA/iOS（Capacitor等）へ移行しやすくするための整理です。

## Windowsで確認
`npm install` → `npm start`

## 注意
YouTubeなど外部URLを使う機能は、iPhoneアプリ化後もインターネット接続が必要です。
