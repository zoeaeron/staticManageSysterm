// history模式
import {
    createRouter,
    createWebHashHistory,
} from 'vue-router'
import { store, initStore } from '../store'
import { getToken,removeToken } from "@/utils/auth";

const routes = [
    // 路由的默认路径
    {
        path: '/',
        redirect: '/login'
    },
    {
        name: 'Login',
        path: '/login',
        component: () => import('../components/login/index.vue')
    },
    {
        name: 'Home',
        path: '/home',
        component: () => import('../components/Home.vue'),
        children: [
            {
                name: 'image',
                path: '/imagPage',
                component: () => import('../components/imagPage/index.vue'),
            },
            {
                path: '/imagDetail',
                component: () => import('../components/imagPage/detail.vue'),
            },
            {
                name: 'icon',
                path: '/iconPage',
                component: () => import('../components/iconPage/index.vue')
            },
            {
                name: 'font',
                path: '/fontsPage',
                component: () => import('../components/fontsPage/index.vue')
            },
            {
                name: 'uiframe',
                path: '/otherPage',
                component: () => import('../components/otherPage/index.vue')
            },
            {
                name: 'user',
                path: '/userPage',
                component: () => import('../components/userPage/index.vue')
            },
        ]
    },
]

// 创建路由对象
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {  
    if (to.name == 'Login') {
        removeToken();
        next();
        return;
    }else{
        let token = getToken();
        if( token == null || token == "" ){
            next({name:'Login'});
            return;
        }
    }


    if (JSON.stringify(store.navList) == '{}') {
        //console.log('init');
        async function init() {
            const v1 = await initStore();
            setTimeout(() => {
                // 初始默认路由进哪个页面
                if( from.name == 'Login' && to.name == 'Home' && store.auth == 1){
                    next({name:'image'});
                }else if( store.auth == 0){
                    next({name:'user'});
                }else if( to.name == 'user' && store.auth == 1 ){
                    next({name:'image'});
                }else{
                    next();
                }
            }, 800);
        }
        init();
    } else {
        next();
    }
})
export default router;
