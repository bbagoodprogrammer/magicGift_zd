// 创建axios实例
import axios from 'axios'
import store from "../store/stores.js"
import getString from "../utils/getString.js"




//const defaultUid = 4979504;
//const defaultToken = '2Jf2TkRqVcwS2JXvsi-WKI3NdIS2ZY7vLvnSOnV1aju-wXWtgE-_q5vWRPuNOdn6yYypAfzdMfeczNtH0Rk0joaKKx6GXhJjvjWhuobVsX0nqOSBIxwI0mvxid12srNO_1rNWwveBZduxMTdQ_8Ky3Rcu_BBF53tQLjLNvwMbHVGn227imB0f6EcZMDgTCYb';
let token = getString("token")
let uid = getString("uid")

// var num = 0
// axios.interceptors.request.use(function (config) {  //在请求发出之前进行一些操作
//     num++
//     store.dispatch("setloading",true)
//     return config
// });
// axios.interceptors.response.use(response => {        // 接受请求后num--，判断请求所有请求是否完成
//     num--
//     if (num <= 0) {
//         store.dispatch("setloading",false)    
//     } else {
//         store.dispatch("setloading",true)      
//     }
// })
// axios.create({
//     timeout: 5000          // 请求超时时间
//   });
// axios.defaults.baseURL = "http://activity.17sing.tw"
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';//配置请求头
//包装axios.get，实现统一处理Loading
function get(url, config) {
    // if (store.state.isShare) {
    //     //分享时识别对应接口，自动切换或直接使用本地数据
    //     for (let regx in share) {
    //         if (url.indexOf(regx) != -1) {
    //             const conf = share[regx];
    //             if (typeof conf == 'string') {
    //                 url = conf;
    //             } else {
    //                 return new Promise(resolve => {
    //                     resolve({
    //                         data: {
    //                             response_status: {error:'', code:0},
    //                             response_data: conf
    //                         }
    //                     });
    //                 });
    //             }
    //         }
    //     }
    // }

    return new Promise((resolve, reject) => {
        store.dispatch("setloading", true) // 打开loading
        axios.get(url, config)
            .then(response => {
                store.dispatch("setloading", false)
                // console.log(response)
                resolve(response);
            })
            .catch(error => {
                store.dispatch("setloading", false)
                reject(error);
            });
    });
}

//获取活动基础信息
function getDefault(t) {
    if (token) {
        return get(`/summer_gift_battle/default.php?uid=${uid}&token=${token}&t=${t}`);
    } else {
        return get(`/summer_gift_battle/default.php`);
    }
}
//加载更多
function getMoreList(t, from) {
    if (!store.state.isShare) {
        return axios.get(`/summer_gift_battle/rank.php?uid=${uid}&token=${token}&t=${t}&from=${from}`)
    } else {
        return get(`/summer_gift_battle/rank.php?t=${t}&from=${from}`)
    }
}
//报名
function singUp(t) {
    return get(`/summer_gift_battle/register.php?uid=${uid}&token=${token}&t=${t}`);
}
//获取歌单列表
function songList() {
    return get(`/summer_gift_battle/songs.php?uid=${uid}&token=${token}`)
}
//选择歌曲参赛
function choiceSong(songId) {
    return get(`/summer_gift_battle/postsongs.php?uid=${uid}&token=${token}&sids=${songId}`)
}
const httpConfig = {
    getDefault,
    getMoreList,
    singUp,
    songList,
    choiceSong
}
export default httpConfig