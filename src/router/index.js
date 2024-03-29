import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '@/views/LoginPage'
import MainPage from '@/views/MainPage'
import MembersPage from '@/views/MembersPage'
import AuthorizationPage from '@/views/AuthorizationPage'
import StockSearchPage from '@/views/StockSearchPage'
import MaterialSearchPage from '@/views/MaterialSearchPage'
import ModuleSearchPage from '@/views/ModuleSearchPage'
import ProductSearchPage from '@/views/ProductSearchPage'
import ProductCostPage from '@/views/ProductCostPage'
import InboundSearchPage from '@/views/InboundSearchPage'
import InboundRegisterPage from '@/views/InboundRegisterPage'
import ShipSearchPage from '@/views/ShipSearchPage'
import ShipRegisterPage from '@/views/ShipRegisterPage'
import EstimateSearchPage from '@/views/EstimateSearchPage'
import ProductBackdataPage from '@/views/ProductBackdataPage'
import LaborCostBackdataPage from '@/views/LaborCostBackdataPage'
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
    path: '/material-search',
    name: 'MaterialSearchPage',
    component: MaterialSearchPage
  },
  {
    path: '/module-search',
    name: 'ModuleSearchPage',
    component: ModuleSearchPage
  },
  {
    path: '/product-search',
    name: 'ProductSearchPage',
    component: ProductSearchPage
  },
  {
    path: '/product-cost',
    name: 'ProductCostPage',
    component: ProductCostPage
  },
  {
    path: '/inbound-search',
    name: 'InboundSearchPage',
    component: InboundSearchPage
  },
  {
    path: '/inbound-register',
    name: 'InboundRegisterPage',
    component: InboundRegisterPage
  },
  {
    path: '/ship-search',
    name: 'ShipSearchPage',
    component: ShipSearchPage
  },
  {
    path: '/ship-register',
    name: 'ShipRegisterPage',
    component: ShipRegisterPage
  },
  {
    path: '/estimate-search',
    name: 'EstimateSearchPage',
    component: EstimateSearchPage
  },
  {
    path: '/product-backdata',
    name: 'ProductBackdataPage',
    component: ProductBackdataPage
  },
  {
    path: '/labor-cost-backdata',
    name: 'LaborCostBackdataPage',
    component: LaborCostBackdataPage
  },
  {
    path: '/member-list',
    name: 'MembersPage',
    component: MembersPage
  },
  {
    path: '/member-authorization',
    name: 'AuthorizationPage',
    component: AuthorizationPage
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
});

export default router
