<template>
  <div class="song">
    <h5>اختيار أعمالك المرضية</h5>
    <div class="songList" v-if="songList.length > 0">
      <ul>
        <li v-for="(item,index) in songList" :key=index>
          <span class="name">{{item.name}}</span>
          <span class="joinBtn" @click="choiceSong(item.sid,index)">اختيار</span>
        </li>
      </ul>
    </div>
    <div class="goSing">
      <p v-if="songList.length > 0">لا توجد أغاني ترضيك؟</p>
      <p v-else>ليس لديك أعمال تليق بشروط المسابقة</p>
      <div class="sing" @click="goSing()">اذهب إلى غناء</div>
      <span>ذكر إعادة هنا لإكمال التسجيل</span>
    </div>
    <div class="determinePup" v-if="showPup">
      <div class="determinCon">
        <p>أنت متأكد من رفع هذا العمل لاشتراك المسابقة</p>
        <div class="chang">
          <span class="ok" @click="changed()">تحديد</span>
          <span class="no" @click="hdPup()">إلغاء</span>
        </div>
      </div>
    </div>
    <msg-toast :msg="tastMsg" @closeToast="closeToast()" v-show="showT"></msg-toast>
    <p class="bMsg">يجب على الأعمال المشتركة أن تنشر بعد 12:00 في يوم 22 من أغسطس بتوقيت دبي</p>
    <Loading></Loading>
  </div>
</template>
<script>
import api from "../../api/apiConfig.js"
import Loading from "../../components/Loading"
import msgToast from "../../components/commonToast"
export default {
  components: { Loading, msgToast },
  data() {
    return {
      songList: [],
      showPup: false,
      songid: null,
      tastMsg: '',
      showT: false,
      songIndex: null
    }
  },
  created() {
    api.songList().then((res) => { //请求歌曲列表
      if (res.data.response_status && res.data.response_status.code === 0) {
        this.songList = res.data.response_data.songs
      }
    })
  },
  methods: {
    goSing() {
      location.href = "goto:songLibrary"
    },
    choiceSong(itemId, index) { //选择歌曲
      this.songid = itemId  //當前歌曲ID
      this.showPup = true
      this.songIndex = index //當前歌曲索引
    },
    changed() {
      api.choiceSong(this.songid).then((res) => {
        if (res.data.response_status.code === 0) { //提交成功顯示OK提示
          this.showPup = false
          this.tastMsg = 'نجاح في رفعه'
          this.showT = true
          //刪除當前歌曲
          this.songList.splice(this.songIndex, 1)
        }
      })
    },
    hdPup() {
      this.showPup = false
    },
    closeToast() {
      this.showT = false
    }
  }
}
</script>
<style lang="scss">
.song {
  padding: 1.58rem 0.24rem 0;
  direction: rtl;
  .determinePup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10000;
    .determinCon {
      position: absolute;
      background: #2e3846;
      padding: 0.2rem 0.2rem 0.3rem;
      top: 5rem;
      left: 1rem;
      width: 5.5rem;
      text-align: center;
      .chang {
        margin-top: 0.2rem;
        span {
          display: inline-block;
          width: 2rem;
          height: 0.5rem;
        }
        .ok {
          background: #795aac;
          margin-left: 0.2rem;
        }
        .no {
          background: #f44a56;
        }
      }
    }
  }
  > h5 {
    color: #999999;
    font-size: 90%;
  }
  .bMsg {
    color: #999;
    margin-top: 0.2rem;
  }
  .songList {
    ul {
      border: 0.01rem solid #d9d9d9;
      border-radius: 0.12rem;
      padding: 0 0.25rem;
      margin-top: 0.31rem;
    }
    li {
      height: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 0.01rem solid #d9d9d9;
      .name {
        color: #333333;
        font-size: 108%;
      }
      .joinBtn {
        width: 1.8rem;
        height: 0.56rem;
        background: #2fbb6d;
        text-align: center;
        border-radius: 0.28rem;
        line-height: 0.52rem;
      }
    }
    li:last-child {
      border: none;
    }
  }
  .goSing {
    height: 1.95rem;
    border: 0.01rem solid #d9d9d9;
    border-radius: 0.12rem;
    margin-top: 0.24rem;
    padding-top: 0.85rem;
    position: relative;
    > p {
      color: #333333;
      font-size: 108%;
      text-align: center;
    }
    .sing {
      width: 1.8rem;
      height: 0.56rem;
      background: #2fbb6d;
      border-radius: 0.28rem;
      text-align: center;
      line-height: 0.52rem;
      margin: 0.2rem auto 0;
    }
    span {
      color: #999999;
      font-size: 80%;
      position: absolute;
      right: 0.17rem;
      bottom: 0.2rem;
    }
  }
}
@import "../../assets/scss/common.scss";
</style>
