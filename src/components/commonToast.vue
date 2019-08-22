<template>
  <div class="toastBox">
    <div class="promptBox">
      <p>{{msg}}</p>
      <div class="ok">
        <a href="javascript:;" @click="close()">تحديد</a>
      </div>
    </div>

  </div>

</template>

<script>
export default {
  props: ["msg"],
  data() {
    return {
    }
  },
  methods: {
    close() {
      this.$emit('closeToast')
    }
  }
}
</script>

<style lang="scss">
.toastBox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10000;
}
.promptBox {
  position: fixed;
  left: 50%;
  top: 35%;
  background-color: #2e3846;
  text-align: center;
  border-radius: 0.2rem;
  margin-left: -3.2rem;
  z-index: 100;
  color: #000;
  width: 6.4rem;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
  p {
    font-size: 14px;
    color: #fff;
    padding: 10px 30px 5px;
  }
  .ok {
    white-space: nowrap;
    padding: 10px 30px;
    text-align: center;
    a {
      display: inline-block;
      width: auto;
      min-width: 90px;
      margin-left: 0px;
      margin-top: 2px;
      outline: none;
      background-color: #795aac;
      color: #fff;
      text-decoration: none;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 14px;
    }
  }
}
</style>
