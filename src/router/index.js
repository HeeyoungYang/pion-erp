import Vue from 'vue'
import VueRouter from 'vue-router'
import UserLogin from '@/views/UserLogin'
import MainPage from '@/views/MainPage'
import MemberList from '@/views/MemberList'
import MyPage from '@/views/MyPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/',
    name: 'UserLogin',
    component: UserLogin
  },
  {
    path: '/member-list',
    name: 'MemberList',
    component: MemberList
  },
  {
    path: '/my-page',
    name: 'MyPage',
    component: MyPage
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
