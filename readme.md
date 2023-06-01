<img src="http://counter.seku.su/cmoe?name=sukeMILVEC&theme=r34" alt="sukeMILVEC" /><br>
# 概要
ミラティブとobsを繋げ、OBSの自動操作やギフトなどの情報の受け取りなどのAPIを管理するサーバーです。
Mirattiv_cmなどと連携させることを前提としています。

# できること
1. Mirattiv_CMで取得したコメントの情報を独自のapi経由で別のブラウザソースに転送します。
1. （実装済み:公開前）ミラティブに簡易的な自動配信システムを実装し、ストリームキーやURLなどを直接OBSに入力しなくても自動的に配信を開始してくれるようにします。



# 要求要件
- 実行環境
    - windows 10/11 (64bit)
    - linux x86
    - macos 
- (元々のソースコードを実行するんならOBSとNode.jsが動けば何でも動くんじゃね（）)
- 必要ソフト
    - obs(v27以降を推奨します)
    - obs-websocket(obs v28以降なら同梱されています)


# 連携ソフト
1. termpermonkey系
    1. https://github.com/suke0930/Mirattiv_cm　(コメント読み上げツール　ギフトやフォローなどの情報の取得元です。)
    1. Mirrativ Auto Stream Button (まだ公開前。　ミラティブを自動的に配信する際に、情報の取得やボタンの押下などをします。)
1. 動作サンプル
    1. https://htmlpreview.github.io/?https://raw.githubusercontent.com/suke0930/Mirrativ-OBS-Live-Connect-Milivec-/master/effect/giftsample.html (こちらをOBSブラウザソースとして追加することで、MirattivCMと連携しギフトやフォローなどの情報をOBSに反映させエフェクトを表示できます。)



# 動作サンプルについて
Mirattiv_CMで取得した情報を本サーバーを通して受信し、画面にギフト（星やハート）を降らせることが可能なサンプルです。
そのまま使うことも可能ですが、今のところ存在しないAPIについての情報（そのうちつくる）を取得できます。
そのまま使用する際は本サーバーを起動した上で、obsにブラウザソースとして追加してください。


# 必認事項
実行ファイルと同ディレクトリにある"/config/"の中にconfig.jsonが必要です。
obs-websocketのIPとパスワードを以下の形式で記述してください。
## 記述例
```
{
    "ip": "ws://localhost:4455",
    "token": "YOURPASSWORDHERE",
    "bouyomi": "棒読みちゃんのショートカットのパス.lnk",
    "OBS": "obsのショートカットのパス.lnk"
}
```
## スタートアップ登録について
実行ファイルに同梱してある"server.vbs"のショートカットを作成し、それをスタートアップに登録することにより
windowsの起動時に本体を自動起動することが可能です。
あたりまえだけど実行ファイル本体のファイル移動とかしたらショートカット死ぬからな☆
