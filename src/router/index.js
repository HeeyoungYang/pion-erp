import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '@/views/LoginPage'
import MainPage from '@/views/MainPage'
import MembersPage from '@/views/MembersPage'
import StockSearchPage from '@/views/StockSearchPage'
import EstimateSearchPage from '@/views/EstimateSearchPage'
import MyPage from '@/views/MyPage'
import CalendarPage from '@/views/CalendarPage'
import Vue2Editor from "vue2-editor"

Vue.use(VueRouter)
Vue.use(Vue2Editor);

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
    path: '/stock-search',
    name: 'StockSearchPage',
    component: StockSearchPage
  },
  {
    path: '/estimate-search',
    name: 'EstimateSearchPage',
    component: EstimateSearchPage
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
  {
    path: '/calendar',
    name: 'CalendarPage',
    component: CalendarPage
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
