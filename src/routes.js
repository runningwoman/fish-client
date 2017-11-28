import Login from './components/login/login.vue'
import Home from './components/Home.vue'


import index from '@/components/index/index.vue'
import novel from '@/components/novel/novel.vue'
import data from '@/components/database/datalist.vue'
import datainfos from '@/components/database/datainfos.vue'
import realdata from '@/components/database/realdatalist.vue'
import noveldata from '@/components/noveldata/noveldata.vue'
import copyrightprofit from '@/components/noveldata/copyrightprofit.vue'


let routes = [{
    path: '/login',
    component: Login,
    name: '',
    hidden: true
},
        {
            path: '/',
            name: '首页',
            component: Home,
            iconCls: 'ios-home',
            children: [
                { path: '/index', name: '首页', component: index }
            ]
        },
        {
            path: '/',
            name: '小说管理',
            component: Home,
            iconCls: 'ios-home',
            children: [
                { path: '/novel', name: '小说列表', component: novel }
            ]
        },
        {
            path: '/',
            name: '小说数据管理',
            component: Home,
            iconCls: 'ios-home',
            children: [
                { path: '/noveldata', name: '小说数据列表', component: noveldata },
                { path: '/copyrightprofit', name: '收益列表', component: copyrightprofit }
            ]
        },
        // {
        //     path: '/',
        //     name: '财务管理',
        //     component: Home,
        //     iconCls: 'ios-home',
        //     children: [
        //         { path: '/data', name: '消耗数据列表', component: data },
        //         { path: '/datainfos', name: '消耗数据明细', component: datainfos,hidden:true },
        //         { path: '/realdata', name: '消耗实时明细', component: realdata },
        //     ]
        // },

    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
