import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '@/views/LoginPage'
import MainPage from '@/views/MainPage'
import MembersPage from '@/views/MembersPage'
import AuthorizationPage from '@/views/AuthorizationPage'
import ProductSearchPage from '@/views/ProductSearchPage'
import ProductSubsidiaryPage from '@/views/ProductSubsidiaryPage'
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
    path: '/product-search',
    name: 'ProductSearchPage',
    component: ProductSearchPage
  },
  {
    path: '/product-subsidiary',
    name: 'ProductSubsidiaryPage',
    component: ProductSubsidiaryPage
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

// if (process.env.NODE_ENV === 'production'){
//   // 네비게이션 가드를 사용하여 페이지 이동 시 세션 ID를 체크
//   router.beforeEach((to, from, next) => {
//     const sessionId = getSessionId();
//     if (to.path !== '/' && !sessionId) {
//         // 대시보드 페이지로 이동하는데 세션 ID가 없는 경우 로그인 페이지로 리다이렉트
//         next('/');
//     } else {
//         next();
//     }
//   });
// }

// // 세션 ID를 가져오는 함수
// function getSessionId() {
//   const cookies = document.cookie.split(';');
//   for (let i = 0; i < cookies.length; i++) {
//       const cookie = cookies[i].trim();
//       if (cookie.startsWith("sessionId=")) {
//           return cookie.substring("sessionId=".length, cookie.length);
//       }
//   }
//   return null;
// }

export default router
