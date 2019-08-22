<template>
  <div class="kroom" :class="{active:activateState === 0}">
    <div class="wardsSample">
      <p>الترتيب حسب قيمة السحر في غرفة الغناء من الهدايا المتلقاة التالية</p>
      <div class="wards">
        <div class="wardsImg">
          <span class="water">
            <img src="../assets/img/motan.png" alt="">
            <em>السجادة السحرية</em>
          </span>
          <span class="cun">
            <img src="../assets/img/shengshui.png" alt="">
            <em>الماء السحري</em>
          </span>
          <span class="car">
            <img src="../assets/img/baodian.png" alt="">
            <em>الكتاب السحري</em>
          </span>
        </div>
      </div>
      <!-- <p class="fansong">在K房向參賽者送以上禮物，送禮者凌晨返金幣數的5%金幣</p> -->
    </div>
    <div class="wordsList" v-if="activateState !== 0">
      <div class="listTop">
        <div class="listItem" :class="'top'+ (index+1)" v-for="(item,index) in top" @click="goPersonalMsg(item.uid)" :key=index>
          <span>{{item.rank}}</span>
          <div class="userBox">
            <div class="imgBox">
              <img src="../assets/img/sunmmer.png" alt="" class="img1" v-if="index===0">
              <img v-lazy="item.avatar" alt="" class="img2">
            </div>
            <div class="userMsg">
              <p class="name">{{item.nick}}</p>
              <!-- <p class="id">UID:{{item.uid}}</p> -->
              <p class="charm"><em></em>{{item.score}}</p>
            </div>
          </div>
          <div class="wardsMsg">
            <span v-for="(item2,index) in item.gifts" :key=index>
              <em :style="{'backgroundImage': 'url('+item2.img+')',backgroundSize:'contain'}"></em>
              {{item2.total}}
            </span>
            <!-- <span class="cun">150</span>
                        <span class="car">180</span> -->
          </div>
        </div>
      </div>
      <div class="listBottom">
        <div class="listItem" v-for="(item,index) in bottom" @click="goPersonalMsg(item.uid)" :key=index>
          <span>{{item.rank}}</span>
          <div class="userBox">
            <div class="imgBox">
              <img v-lazy="item.avatar" alt="">
            </div>
            <div class="userMsg">
              <p class="name">{{item.nick}}</p>
              <!-- <p class="id">UID:{{item.uid}}</p> -->
              <p class="charm"><em></em>{{item.score}}</p>
            </div>
          </div>
          <div class="wardsMsg">
            <span v-for="(item2,index) in item.gifts" :key=index>
              <em :style="{'backgroundImage': 'url('+item2.img+')',backgroundSize:'contain'}"></em>
              {{item2.total}}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
export default {
  computed: {
    ...mapState(["kRoomArr", "activateState"]),
    top() {
      if (this.kRoomArr !== []) {
        return this.kRoomArr.slice(0, 3)
      }
    },
    bottom() {
      if (this.kRoomArr !== []) {
        return this.kRoomArr.slice(3)
      }
    }
  },
  methods: {
    goPersonalMsg(id) {
      location.href = `uid:${id}`
    }
  }
}
</script>

<style lang="scss" scope>
.kroom {
  padding-top: 0.13rem;
  &.active {
    padding-bottom: 1.8rem;
  }
  .wardsSample {
    width: 7.5rem;
    height: 2.7rem;
    // background: url(../assets/img/shanhu.png);
    background-size: 100% 100%;
    p {
      height: 0.5rem;
      text-align: center;
      color: #ffed6a;
      font-size: 80%;
      font-weight: bold;
    }
    .wards {
      height: 1.72rem;
      .wardsImg {
        // background: url(../assets/img/wardsSample.png) no-repeat;
        background-size: contain;
        margin: 0.2rem auto 0;
        width: 5rem;
        height: 1.2rem;
        position: relative;
        > span {
          display: inline-block;
          width: 33%;
          font-size: 80%;
          position: absolute;
          bottom: -0.4rem;
          img {
            display: block;
            width: 1.26rem;
            height: 1.23rem;
            margin: 0 auto;
          }
          em {
            display: block;
            // width: 3rem;
            text-align: center;
            white-space: nowrap;
            font-size: 80%;
            margin-left: 0.2rem;
            // transform: scale(0.8);
          }
          &.water {
            left: -0.4rem;
          }
          &.cun {
            left: 1.68rem;
          }
          &.car {
            left: 3.8rem;
          }
        }
      }
    }
    .fansong {
      font-size: 80%;
      color: #6ffff3;
      text-align: center;
    }
  }
  .wordsList {
    margin: 0.05rem 0.15rem 0;
    padding-bottom: 1.6rem;
    .listTop {
      .userBox {
        .userMsg {
          margin-left: 0;
        }
      }
      .listItem {
        > span {
          display: block;
          margin: 0 0 0 0.1rem;
          width: 0.84rem;
          height: 0.73rem;
          text-indent: -999rem;
        }
      }
      .top1 {
        background: url(../assets/img/top1Bg.png);
        background-size: 100% 100%;
        > span {
          background: url(../assets/img/top1.png);
          background-size: 100% 100%;
        }
      }
      .top2 {
        background: url(../assets/img/top2Bg.png);
        background-size: 100% 100%;
        > span {
          background: url(../assets/img/top2.png);
          background-size: 100% 100%;
        }
      }
      .top3 {
        background: url(../assets/img/top3Bg.png);
        background-size: 100% 100%;
        > span {
          background: url(../assets/img/top3.png);
          background-size: 100% 100%;
        }
      }
    }
    .listBottom {
    }
    .listItem {
      height: 1.24rem;
      background: url(../assets/img/listItem.png);
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      margin-top: 0.05rem;
      > span {
        width: 0.5rem;
        margin: 0 0.2rem 0 0.25rem;
        text-align: center;
        color: #63ffe2;
        font-size: 120%;
      }
      .userBox {
        width: 3rem;
        height: 1rem;
        display: flex;
        align-items: center;
        .imgBox {
          width: 1.2rem;
          height: 1.1rem;
          // background: url(../assets/img/sunmmer.png);
          // background-size: 100% 100%;
          z-index: 50;
          position: relative;
          img {
            margin: 0.1rem 0.1rem 0 0;
            width: 0.86rem;
            height: 0.86rem;
            border-radius: 50%;
          }
          .img1 {
            width: 0.93rem;
            height: 1.04rem;
            z-index: 999;
            position: absolute;
            margin: 0;
            right: 0.1rem;
          }
          .img2 {
            display: inline-block;
            width: 0.86rem;
            height: 0.86rem;
            position: absolute;
            top: 0.15rem;
            left: 0.2rem;
            margin: 0;
          }
        }
        .userMsg {
          .name {
            font-size: 85%;
            max-width: 1.7rem;
            overflow: hidden;
            text-overflow: ellipsis; //超出部分以省略号显示
            white-space: nowrap;
          }
          .id {
            color: #86edf1;
            font-size: 75%;
            height: 0.3rem;
          }
          .charm {
            height: 0.33rem;
            // padding-left: 0.35rem;
            // background: url(../assets/img/charm.png) no-repeat;
            background-size: 0.28rem 100%;
            font-size: 80%;
            color: #fff88c;
            line-height: 0.33rem;
            margin-top: 0.05rem;
            display: flex;
            align-items: center;
            em {
              display: inline-block;
              width: 0.3rem;
              height: 0.3rem;
              background: url(../assets/img/charm.png) no-repeat;
              background-size: contain;
              margin-left: 0.1rem;
            }
          }
        }
      }
      .wardsMsg {
        height: 0.4rem;
        display: flex;
        // justify-content: space-between;
        // padding-right:.5rem;
        color: #6ffff3;
        font-size: 80%;
        line-height: 0.4rem;
        flex: 1;
        padding: 0 0.05rem 0 0;
        > span {
          margin-right: 0.1rem;
          // padding-left: 0.43rem;
          // width: 0.45rem;
          width: 33.3%;
          em {
            display: inline-block;
            width: 0.39rem;
            height: 0.39rem;
            float: right;
            margin-left: 0.05rem;
          }
        }
        > span:first-child {
          margin-right: 0rem;
        }
      }
    }
  }
}
</style>
