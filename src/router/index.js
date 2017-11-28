import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import picsort from '@/components/picture/picsort.vue'
import piclist from '@/components/picture/piclist.vue'


import Login from '@/components/login/login.vue'
import news from '@/components/news/news.vue'
import cases from '@/components/case/case.vue'
import team from '@/components/team/team.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/login',
            component: Login,
            name: '',
            hidden: true
        },
        {
            path: '/',
            name: '图片管理',
            component: Home,
            iconCls: 'ios-home',
            children: [
                { path: '/picsort', name: '类别管理', component: picsort },
                { path: '/piclist', name: '图片列表', component: piclist }
            ]
        },
        {
            path: '/',
            name: '新闻管理',
            component: Home,
            iconCls: 'ios-home',
            children: [
                { path: '/news', name: '新闻列表', component: news }
            ]
        },
        {
            path: '/',
            name: '成功案例管理',
            component: Home,
            iconCls: 'ios-home',
            children: [
                { path: '/cases', name: '成功案例列表', component: cases }
            ]
        },
        {
            path: '/',
            name: '团队管理',
            component: Home,
            iconCls: 'ios-home',
            children: [
                { path: '/team', name: '团队列表', component: team }
            ]
        }
    ]
})