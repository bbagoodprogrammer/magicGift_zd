<template>
    <div id="customLoading" class="customLoading" v-show="isLoading">
        <div class="loading">
            
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name: 'Loading',
    data () {
        return {}
    },
    computed:{
        ...mapState(['isLoading'])
    },
    props: {
        text: {
            type: String,
            default: 'Loading'
        },
        size: {
            type: Number,
            default: 30
        }
    }
}
</script>
<style>
.loading{
    position: fixed;
    left: 0;
    top:0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    background: rgba(0,0,0,.8) url(../assets/img/loading.gif) 50% no-repeat;
    background-size: 35px 28px;
  }
</style>