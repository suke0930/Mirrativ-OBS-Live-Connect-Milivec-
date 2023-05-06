const WebSocket = require('ws');
const fs = require('fs');//FILE読み書きするやつ
const { default: OBSWebSocket } = require('obs-websocket-js');
const sceneName = "汎用（ミラティブ）"//使うシーンの名前
const { exec } = require('child_process');
//const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
let effecters = []//エフェクターを複数化するための機構
const time = 60000 * 20//配信する時間

const suke = false//sukeじゃないなら切れ！a
const config = JSON.parse(fs.readFileSync(".././config.json", 'utf8').toString());
console.log(config)


const websocketip = config.ip
const websocketkey = config.token

// const websocketip = ""//とりあえずここら編いじればいいと思うンゴ
// const websocketkey = ""//
const obspath = "C:\ミラティブ.lnk"//obsのファイルパス
const bouyomipath = "C:\BOUYOMI.lnk"//棒読みちゃんのパス

/**
 * 
 * @param {string} url//接続先URL 
 * @param {string} key //接続先key
 * @param {string} status2 obsの起動ステータス
 */




async function setrtmp(url, key) {
    const rtmp_custom = {
        server: url,
        key: key

    }

    obs.call("SetStreamServiceSettings", {
        streamServiceType: 'rtmp_common',
        streamServiceSettings: rtmp_custom
    }
    )
}
async function streamcheck(obs) {//配信中かチェックする
    const flag = await obs.call("GetStreamStatus")
    //console.log("フラグ")
    //console.log(flag)
    //   console.log(flag)
    if (flag.outputActive === true) {
        console.log("まだ配信しとるやんけ！")
        obs.call("StopStream")
        setTimeout(() => {
            streamcheck(obs);
        }, 500);
    }
}
/**
 * 
 * @param {string} url RTMPURL 
 * @param {string} key RTMPKEY 
 * @param {number} time 配信時間 
 * @param {object} ws //websocketの本体
 * @param {string} status //afkかどうか
 * @param {boolean} suke //sukeなら音にしろ
 * @param {boolean} wantboot //obs起動フラグ
 */
async function obs3(url, key, time, ws, status, suke, wantboot) {
    // console.log("???s")
    if (status === "afk") {//afk
        try {
            const {
                obsWebSocketVersion,
                negotiatedRpcVersion
            } = await obs.connect(websocketip, websocketkey, {
                rpcVersion: 1
            });

            console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)
            streamcheck(obs);

            setTimeout(() => {

                exec('start ' + bouyomipath, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        //     return;
                    }
                    // console.log(`stdout: ${stdout}`);
                    //   console.error(`stderr: ${stderr}`);
                });
                setTimeout(async () => {
                    if (suke === true) {
                        await soureactive("AC２", true)
                        await soureactive("AC", true)
                    }
                    await setrtmp(url, key)//後で要変更
                    setTimeout(() => {
                        //             obs.call('StopStream')
                        obs.call('StartStream');
                        ws.send('400 ok');//配信開始のws
                        let status2 =
                            console.log("400 ok")
                        setTimeout(() => {
                            ws.send('500 ok');
                            console.log("500 ok")
                            obs.call('StopStream')
                            setTimeout(async () => {
                                if (suke === true) {
                                    await soureactive("AC２", false)
                                    await soureactive("AC", false)
                                }
                                await obs.disconnect()
                            }, 1000);
                        }, time);//配信停止するまでの時間
                    }, 1000);

                }, 1000);
            }, 2000);


            // obs.call('StartStream');


        } catch (error) {

            console.error('Failed to connect', error.code, error.message);
            if (wantboot === true) {
                obsstart(obspath)
                setTimeout(() => {
                    obs3(url, key, time, ws, status, suke, false);
                }, 5000);

            } else {
                setTimeout(() => {
                    obs3(url, key, time, ws, status, suke, false);
                }, 5000);
            }
        }
    }
    if (status === "nonafk") {//nonafk
        try {
            const {
                obsWebSocketVersion,
                negotiatedRpcVersion
            } = await obs.connect(websocketip, websocketkey, {
                rpcVersion: 1
            });

            console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)
            streamcheck(obs);
            setTimeout(() => {
                exec('start ' + bouyomipath, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        //     return;
                    }
                    // console.log(`stdout: ${stdout}`);
                    //   console.error(`stderr: ${stderr}`);
                });

                setTimeout(async () => {
                    await setrtmp(url, key)//後で要変更
                    setTimeout(() => {
                        //        obs.call('StopStream')





                        obs.call('StartStream');
                        ws.send('400 ok');//配信開始のws
                        console.log("400 ok")
                    }, 1000);

                }, 1000);
            }, 2000);

            // obs.call('StartStream');


        } catch (error) {

            console.error('Failed to connect', error.code, error.message);
            if (wantboot === true) {
                obsstart(obspath)
                setTimeout(() => {
                    obs3(url, key, time, ws, status, suke, false);
                }, 5000);

            } else {
                setTimeout(() => {
                    obs3(url, key, time, ws, status, suke, false);
                }, 5000);
            }

        }
    }
}

/**
 * 
 * @param {string} name 呼び出したいソースの名前
 * @param {boolean} status 　有効か無効か 
 */
async function soureactive(name, status) {//ソースの有効無効を簡単に切り替える
    const IDsearch = {
        sceneName: sceneName,
        sourceName: name,
        searchOffset: 0
    }

    const itemid = await obs.call('GetSceneItemId', IDsearch);
    //  console.log(itemid)



    obs.call('SetSceneItemEnabled', {//切り替える対象のオブジェクトの定義
        sceneName: "汎用（ミラティブ）",
        sceneItemId: itemid.sceneItemId,
        sceneItemEnabled: status
    }
    );

}
async function obsstart(obspath) {//obs起動

    exec('start ' + obspath, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);


    });



}

async function main() {
    const wss = new WebSocket.Server({ port: 8877 });

    await wss.on('connection', async function connection(ws) {//コネクション



        await ws.on('message', async function incoming(message) {//メッセージ受信時の挙動

            const json = JSON.parse(message.toString());
            console.log('Received JSON:', json);

            const forrow = "9999"//dummy
            if (json.status === "commentlisner") {

                if (json.effect === "forrow") {
                    //フォローされたときの何かを書く
                }
                if (json.effect === "gift") {
                    //ギフトされたときの何かを書く
                }
                if (json.effect === "open") {
                    //初期接続か何かを書く
                }



            }


            if (json.status === "effecter") {
                effecters.push(ws)//エフェクトを+する
                console.log("このインスタンスを登録しました")
            }

            if (json.status === "media") {
                //OBSのエフェクトウィンドウがオンラインのときの何かを書く
                ws.send("SERVER IS OK")
            }

            if (json.status === "afk") {
                console.log("放置厨かよ！")

                obs3(json.url, json.key, time, ws, json.status, suke, true);
            }
            if (json.status === "nonafk") {
                console.log("非放置厨みたいなオワコンミラティブに住んでる私はどうすりゃいいですか?")

                obs3(json.url, json.key, time, ws, json.status, suke, true);
            }
            // ws.send('400 ok');
            setTimeout(() => {
                //    ws.send('500 ok');
            }, 10000);

        });
    });
};
main();
















