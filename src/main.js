// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './routes'
import axios from 'axios'
import iview from 'iview'
import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'
import 'iview/dist/styles/iview.css'
import http from './fetch/http'
var qs = require('qs');
Vue.prototype.qs = qs;
Vue.prototype.$http = http;
Vue.use(VueRouter)
Vue.use(iview)
const router = new VueRouter({
    routes
})
router.beforeEach((to, from, next) => {

    // to.abc = to.path

    if (to.path == '/login') {
        sessionStorage.removeItem('user');
    }
    let user = JSON.parse(sessionStorage.getItem('user'));
    console.log(user);
    if (!user && to.path != '/login') {
        next({ path: '/login' })
    } else {
        next()
    }
})
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})