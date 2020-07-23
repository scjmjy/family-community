import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import VFamily from '../views/VFamily.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'App Index',
        component: VFamily
    },
    {
        path: '/world',
        name: 'User Sign In',
        component: () => import('../views/VWorld.vue')
    },
    {
        path: '/about',
        name: 'App About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/VAppAbout.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
