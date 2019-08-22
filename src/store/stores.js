import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const store = new Vuex.Store({
    state:{
        isLoading:0, //loading效果
        isShare:false, //分享
        activateState:0, //活動狀態 0 1 2
        worksArr:[],    //作品排行榜數組
        kRoomArr:[]     //K房排行數組 
    },
    mutations:{
        isLoaging(state,boolean){
            boolean ? ++state.isLoading : --state.isLoading
        },
        changShareState(state,boolean){
            state.isShare = boolean
        },
        changActivateState(state,val){
            state.activateState = val
        },
        changeWorksArr(state,val){
            state.worksArr = val
        },
        changekRoomArr(state,val){
            state.kRoomArr = val
        }
    },
    actions:{
        setloading({commit},boolean){
            commit('isLoaging',boolean)
        }
    },
    getters:{}
}) 
export default store;