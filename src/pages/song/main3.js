// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import main3 from './Main3.vue'
import store from '../../store/stores.js'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { main3 },
    store,
    template: '<main3/>'
})