<template>
  <div class="bigBox">
    <div class="header">
      <a href="./index2.html"></a>
    </div>
    <a href="" class="share" v-if="isShare" @click.prevent="goShare()"></a>
    <div class="wardsBox">
    </div>
    <div class="listTab">
      <a href="" class="works" :class="{active:showComponent === 'works'}" @click.prevent="updateWorks('works')">قائمة هدايا الأعمال</a>
      <a href="" class="kRoom" :class="{active:showComponent === 'kRoom'}" @click.prevent="updateKroom('kRoom')">قائمة هدايا لغرفة الغناء</a>
    </div>
    <component :is="showComponent"></component>
    <div class="footer" v-if="!isShare">
      <a class="singUp" @click.prevent="singUp()" v-if="showFooter === 2">التسجيل الآن</a>
      <span v-if="showFooter === 0">لم يبدأ النشاط</span>
      <span v-if="showFooter === 1">انتهى النشاط</span>
      <div class="myMsg" v-show="showComponent === 'works' && (showFooter === 3 || showFooter == 4)">
        <img :src="WardsMyMsg.avatar" alt="">
        <div class="msgBox">
          <div class="msgBottom">
            ترتيبك:<span>{{WardsMyMsg.rank}}</span>
          </div>
          <div class="msgTop">
            قيمة السحر لأعمالك:<span>{{WardsMyMsg.score}}</span>
          </div>

        </div>
        <div class="uploadBtn" @click="uploadSong()">
          <span>رفع أعمالك لاشتراك المسابقة</span>
        </div>
      </div>
      <div class="myMsg" v-show="showComponent === 'kRoom' && (showFooter === 3 || showFooter == 4)">
        <img :src="kRommMyMsg.avatar" alt="" class="mr">
        <div class="msgBox">
          <div class="msgBottom">
            ترتيبك:<span>{{kRommMyMsg.rank}}</span>
          </div>
          <div class="msgTop">
            قيمة السحر في غرفة الغناء:<span>{{kRommMyMsg.score}}</span>
          </div>
        </div>
      </div>
    </div>
    <msg-toast :msg="tastMsg" @closeToast="closeToast()" v-show="showT"></msg-toast>
    <loading></loading>
    <a href="" @click.prevent="refresh()" class="refresh" :style="{transform:'rotate('+rotatePx+'deg)'}" v-show="showFooter != 0 || !isShare"></a>
  </div>
</template>

<script>

import getString from "../utils/getString.js"
import api from "../api/apiConfig.js"
import Loading from "../components/Loading.vue"
import APP from "../utils/openApp.js"
import KRoom from "../components/Kroom.vue"
import Works from "../components/Works.vue"
import msgToast from "../components/commonToast"
export default {
  components: { KRoom, Works, Loading, msgToast },
  data() {
    return {
      isShare: false, //是否分享
      showComponent: "works",
      activite: 1,   //活動狀態
      userState: 1,    //當前用戶是否報名，0未報名，1已報名
      defaultData: {}, //初始數據 
      wardArr: [],    //作品排行数组长度
      kRoomArr: [],      //k房排行数组长度
      WardsMyMsg: {},     //作品底部個人排行信息
      kRommMyMsg: {},   //K歌底部个人信息
      isMore: true,     //避免滾動重複請求
      singUped: false,   //报名后要重新加载个人信息的标示
      rotatePx: 0,    //刷新旋转动画
      rotatec: 0,
      could: true,      //避免刷新重复加载
      kRoomLoaded: false,  // K房列表是否家再過
      tastMsg: '',  //提示信息
      showT: false
    }
  },
  computed: {
    showFooter() {  //底部現實組件
      var activite = this.activite
      if (activite === 0) { //活動未開始
        return 0
      } else if (activite === 2 && this.userState === 0) { //活動已結束,展示活动已结束字样
        return 1
      } else if (activite === 2 && this.userState === 1) { //活動已結束,用户已报名展示排名
        return 4
      } else if (activite === 1 && this.userState === 0) { //活動開始用戶未報名
        return 2
      } else if (activite === 1 && this.userState === 1) { //活動開始用戶已報名
        return 3
      }
    }
  },
  created() {
    this.judgeShare()  //判斷分享狀態
    if (!this.isShare) {  //非分享下页面初始化
      this.getDefaultData()   //頁面初始化
    }
  },
  mounted() {
    if (this.isShare) return
    window.addEventListener('scroll', this.onScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    judgeShare() {
      let that = this
      //判断是否为分享环境,请求相应的接口 
      let regstr = getString('token')
      if (regstr) {
        that.isShare = false
      } else {
        that.isShare = true
      }
      that.$store.commit('changShareState', that.isShare) //分享状态
    },
    getDefaultData() { //獲取數據
      var that = this
      api.getDefault(0).then(function (res) {
        if (res.data.response_status.code == 20000) {  //活动未开始
          that.activite = 0
          that.$store.commit('changActivateState', that.activite) //當前活動狀態
        } else if (res.data.response_status.code == 0) {
          const { rank, step, uinfo } = res.data.response_data
          if (uinfo.rank === 0) { //改变用户报名报名状态
            that.userState = 0
          } else if (uinfo.rank > 0) {
            that.userState = 1
          }
          that.activite = step //当前活动状态  
          that.WardsMyMsg = uinfo  // 作品排行榜底部个人信息 
          that.wardArr = rank // 当前数组（分页用）    
          // console.log(that.wardArr)
          that.$store.commit('changActivateState', that.activite) //當前活動狀態
          that.$store.commit('changeWorksArr', rank)  //存入作品排行榜
        }
      })

    },
    singUp() { //報名后轉換用戶狀態
      // var WardsMyMsg = {
      //   avatar: "http://ufile.gosingapp.com/uc/img/head_5015907_1553821305.png_small",
      //   nick: "handsome zhang",
      //   rank: 1,
      //   score: 0,
      //   uid: 5015907
      // }
      // this.wardArr.push(WardsMyMsg)
      // this.$store.commit('changeWorksArr', this.wardArr)
      if (this.isShare) {
        APP()
        return
      } else {
        var that = this
        if (that.showComponent === "works") {
          api.singUp(0).then(function (res) {  //报名后修改用户信息和状态
            const { uinfo } = res.data.response_data
            that.WardsMyMsg = uinfo
            that.userState = 1
            that.singUped = true  //切换TAB时更新另一个tab的数据
            if (that.wardArr.length < 20) {
              that.wardArr.push(that.WardsMyMsg)
              that.$store.commit('changeWorksArr', that.wardArr)
            }
          })
        } else if (that.showComponent === "kRoom") {
          api.singUp(1).then(function (res) {
            const { uinfo } = res.data.response_data
            that.kRommMyMsg = uinfo
            that.userState = 1
            that.singUped = true
            if (that.kRoomArr.length < 20) {
              that.kRoomArr.push(that.kRommMyMsg)
              that.$store.commit('changekRoomArr', that.kRoomArr) //存入K歌排行榜
            }
          })
        }
      }
    },
    updateWorks() { //点击时更新个人信息
      var that = this
      if (that.showComponent === "works") {
        return
      }
      if (!that.singUped) {   //如果未点击报名直接切换  否则是刚报完名后重新拉取个人信息
        that.showComponent = "works"
        return
      } else {
        that.showComponent = "works"
        api.getDefault(0).then(function (res) {
          const { uinfo } = res.data.response_data
          that.WardsMyMsg = uinfo  // 作品排行榜底部个人信息 
          that.singUped = false
        })
      }
    },
    updateKroom(val) { //点击时更新个人信息
      var that = this
      if (that.showComponent === "kRoom") {
        return
      }
      if (!this.kRoomLoaded) {  //如果是沒加載過請求數據
        api.getDefault(1).then(function (res) {
          if (res.data.response_status.code == 20000) {
            that.activite = 0
          } else if (res.data.response_status.code == 0) {
            const { rank, uinfo } = res.data.response_data
            that.kRommMyMsg = uinfo       //k房底部个人信息
            that.kRoomArr = rank   //当前数组（分页用） 
            that.$store.commit('changekRoomArr', that.kRoomArr) //存入K歌排行榜
          }
        })
        this.kRoomLoaded = true
      }
      if (!that.singUped) { //如果未点击报名直接切换  否则是刚报完名后重新拉取个人信息
        that.showComponent = "kRoom"
        return
      } else {
        that.showComponent = "kRoom"
        api.getDefault(1).then(function (res) {
          const { uinfo } = res.data.response_data
          that.kRommMyMsg = uinfo       //k房底部个人信息
          that.singUped = false
        })
      }
    },
    onScroll() { //滾動加載
      if (this.showFooter === 0) return
      const scrollToBottom = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight >= document.body.scrollHeight - 100
      var that = this
      if (scrollToBottom) { //加載更多合併數組存入vuex
        if (that.showComponent === "works" && that.isMore && that.wardArr.length >= 20) {
          that.isMore = false
          var from = that.wardArr.length
          api.getMoreList(0, from).then(function (val) {
            that.isMore = true   //重置开关
            var newArr = val.data.response_data.rank
            if (newArr.length >= 0) {
              that.wardArr = that.wardArr.concat(newArr)
              that.$store.commit('changeWorksArr', that.wardArr)  //存入作品排行榜
            } else {
              return
            }
          })
        } else if (that.showComponent === "kRoom" && that.isMore && that.kRoomArr.length >= 20) {
          that.isMore = false
          var from = that.kRoomArr.length
          api.getMoreList(1, from).then(function (val) {
            that.isMore = true   //重置开关
            var newArr = val.data.response_data.rank
            if (newArr.length >= 0) {
              that.kRoomArr = that.kRoomArr.concat(newArr)
              that.$store.commit('changekRoomArr', that.kRoomArr)  //存入作品排行榜
            } else {
              return
            }
          })
        }
      }
    },
    refresh() {
      var that = this
      that.rotatePx = 540 * ++that.rotatec  //旋转动画
      window.removeEventListener("scroll", that.onScroll)  //去除滚动加载事件，避免减少数组后滚动条到底默认加载一次
      if (that.showComponent === "works") {  //刷新当前榜单数据
        if (that.could) {  //避免重复请求
          that.could = false
          var from = 0
          api.getMoreList(0, from).then(function (val) {
            that.could = true   //重置开关
            var newArr = val.data.response_data.rank
            if (newArr.length >= 0) {
              that.wardArr = newArr
              that.$store.commit('changeWorksArr', that.wardArr)  //存入作品排行榜
              setTimeout(function () {  //重新监听事件
                window.addEventListener("scroll", that.onScroll)
              }, 500)
            } else {
              return
            }
          })
        }
      } else if (that.showComponent === "kRoom") {
        if (that.could) {  //避免重复请求
          that.could = false
          var from = 0
          api.getMoreList(1, from).then(function (val) {
            that.could = true   //重置开关
            var newArr = val.data.response_data.rank
            if (newArr.length >= 0) {
              that.kRoomArr = newArr
              that.$store.commit('changekRoomArr', that.kRoomArr)  //存入作品排行榜
              setTimeout(function () {
                window.addEventListener("scroll", that.onScroll)
              }, 500)
            } else {
              return
            }
          })
        }
      }
    },
    uploadSong() {
      if (this.isShare) {
        APP()
        return
      } else if (this.activite === 0) {
        this.showT = true
        this.tastMsg = `لم يبدأ النشاط`
        return
      } else if (this.activite === 2) {
        this.showT = true
        this.tastMsg = `انتهى النشاط`
        return
      } else {
        let regstr = getString('token')
        location.href = `./index3.html?token=${regstr}`
      }
    },
    closeToast() {
      this.showT = false
    },
    goShare() {
      APP()
    }
  }
}
</script>
<style lang='scss'>
body {
  max-width: 7.5rem;
  position: relative;
  margin: auto;
  background: #4124d6 url(../assets/img/bigBg.png) no-repeat;
  background-size: 100% auto;
  direction: rtl;
}
.bigBox {
  max-width: 7.5rem;
  margin: auto;
  overflow-x: hidden;
  .header {
    height: 9.47rem;
    position: relative;
    a {
      display: block;
      width: 1.99rem;
      height: 0.66rem;
      position: absolute;
      right: 0;
      top: 0.48rem;
      text-align: center;
      text-indent: 0.2rem;
      background: url(../assets/img/ruleBg.png);
      background-size: 100% 100%;
    }
  }
  .wardsBox {
    width: 4.54rem;
    height: 3.45rem;
    margin: 0 auto;
    background: url(../assets/img/wards.png);
    background-size: 100% 100%;
  }
  .listTab {
    width: 6.9rem;
    height: 0.9rem;
    margin: 0.32rem auto 0;
    background: url(../assets/img/listTabBg.png);
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    > a {
      display: block;
      width: 49%;
      height: 0.76rem;
      text-align: center;
      line-height: 0.79rem;
      color: #bb81fb;
      font-weight: bold;
      font-size: 90%;
      &.active {
        // width: 49%;
        // height: 0.75rem;
        background: url(../assets/img/listActive.png);
        background-size: 100% 100%;
        color: #fff;
      }
      &.works {
        margin: 0.02rem 0.1rem 0 0;
      }
      &.kRoom {
        margin: 0 0 0 0.1rem;
      }
    }
  }
  .footer {
    height: 1.26rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background: url(../assets/img/footer.png);
    background-size: 100% 100%;
    .singUp {
      display: block;
      width: 3.51rem;
      height: 0.76rem;
      background: linear-gradient(
        0deg,
        rgba(165, 68, 233, 1),
        rgba(219, 74, 158, 1),
        rgba(255, 204, 106, 1)
      );
      border-radius: 0.38rem;
      font-size: 120%;
      line-height: 0.76rem;
      text-align: center;
      position: absolute;
      left: 2rem;
      top: 0.3rem;
    }
    > span {
      position: absolute;
      left: 2.8rem;
      top: 0.5rem;
      font-size: 120%;
    }
    .myMsg {
      width: 100%;
      padding-right: 0.61rem;
      height: 0.9rem;
      display: flex;
      margin: 0.27rem auto;
      position: relative;
      .mr {
        margin-right: 1rem;
      }
      img {
        width: 0.86rem;
        height: 0.86rem;
        border-radius: 50%;
      }
      .msgBox {
        margin-right: 0.34rem;
        span {
          margin-right: 0.1rem;
        }
        .msgTop {
          font-size: 80%;
          height: 50%;
          white-space: nowrap;
          span {
            color: #ffe000;
          }
        }
        .msgBottom {
          font-size: 80%;
          height: 50%;
          white-space: nowrap;
          span {
            color: #63ffe2;
          }
        }
      }
      .uploadBtn {
        margin-top: 0.1rem;
        width: 2.46rem;
        height: 0.66rem;
        background: url(../assets/img/listActive.png);
        background-size: 100% 100%;
        font-size: 80%;
        text-align: center;
        // line-height: 0.55rem;
        display: flex;
        align-items: center;
        position: absolute;
        left: 0.65rem;
        // white-space: nowrap;
        span {
          transform: scale(0.8);
        }
      }
    }
  }
  .share {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 1.2rem;
    background: url(../assets/img/share_bar.png);
    background-size: 100% 100%;
    z-index: 999;
  }
  .refresh {
    display: block;
    width: 0.94rem;
    height: 1rem;
    position: fixed;
    left: 0.2rem;
    bottom: 1.3rem;
    z-index: 999;
    background: url(../assets/img/refresh.png);
    background-size: 100% 100%;
    transition: all 1s;
  }
}
</style>


