import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

if (process.env.NODE_ENV === 'production') {
    require('bootstrap/dist/js/bootstrap.min.js')
    require('bootstrap/dist/css/bootstrap.min.css')
} else {
    require('bootstrap/dist/js/bootstrap.js')
    require('bootstrap/dist/css/bootstrap.css')
}

Vue.config.productionTip = false

const vueRoot = new Vue({
    router,
    store,
    created() {
        this.$store.commit('user/init', this)
    },
    render: h => h(App)
})

vueRoot.$mount('#id-app')
