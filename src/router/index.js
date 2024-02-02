import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '@/views/LoginPage'
import MainPage from '@/views/MainPage'
import MembersPage from '@/views/MembersPage'
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
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/member-list',
    name: 'MembersPage',
    component: MembersPage
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
