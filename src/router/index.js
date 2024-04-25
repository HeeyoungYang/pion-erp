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
import BasicInfoBackdataPage from '@/views/BasicInfoBackdataPage'
import MyPage from '@/views/MyPage'
import CalendarPage from '@/views/CalendarPage'
import Vue2Editor from "vue2-editor"

Vue.use(VueRouter)
Vue.use(Vue2Editor);

const routes = [
  {
    path: '/home',
    name: 'MainPage',
    component: MainPage,
    meta: {
      permission: ['member']
    }
  },
  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage,
    meta: {
      permission: ['guest']
    }
  },
  {
    path: '/stock-search',
    name: 'StockSearchPage',
    component: StockSearchPage,
    meta: {
      permission: ['member']
    }
  },
  {
    path: '/material-search',
    name: 'MaterialSearchPage',
    component: MaterialSearchPage,
    meta: {
      permission: ['member']
    }
  },
  {
    path: '/module-search',
    name: 'ModuleSearchPage',
    component: ModuleSearchPage,
    meta: {
      permission: ['member']
    }
  },
  {
    path: '/product-search',
    name: 'ProductSearchPage',
    component: ProductSearchPage,
    meta: {
      permission: ['member']
    }
  },
  {
    path: '/product-cost',
    name: 'ProductCostPage',
    component: ProductCostPage,
    meta: {
      permission: ['member']
    }
  },
  {
    path: '/inbound-search',
    name: 'InboundSearchPage',
    component: InboundSearchPage,
    meta: {
      permission: ['member']
    }
  },
  {
    path: '/inbound-register',
    name: 'InboundRegisterPage',
    component: InboundRegisterPage,
    meta: {
      permission: ['member']
    }
  },
  {
    path: '/ship-search',
    name: 'ShipSearchPage',
    component: ShipSearchPage,
    meta: {
      permission: ['member']
    }
  },
  {
    path: '/ship-register',
    name: 'ShipRegisterPage',
    component: ShipRegisterPage,
    meta: {
      permission: ['member']
    }
  },
  {
    path: '/estimate-search',
    name: 'EstimateSearchPage',
    component: EstimateSearchPage,
    meta: {
      permission: ['member']
    }
  },
  {
    path: '/product-backdata',
    name: 'ProductBackdataPage',
    component: ProductBackdataPage,
    meta: {
      permission: ['manager', 'admin', 'master']
    }
  },
  {
    path: '/labor-cost-backdata',
    name: 'LaborCostBackdataPage',
    component: LaborCostBackdataPage,
    meta: {
      permission: ['manager', 'admin', 'master']
    }
  },
  {
    path: '/basic-info-backdata',
    name: 'BasicInfoBackdataPage',
    component: BasicInfoBackdataPage,
    meta: {
      permission: ['manager', 'admin', 'master']
    }
  },
  {
    path: '/member-list',
    name: 'MembersPage',
    component: MembersPage,
    meta: {
      permission: ['admin', 'master']
    }
  },
  {
    path: '/member-authorization',
    name: 'AuthorizationPage',
    component: AuthorizationPage,
    meta: {
      permission: ['admin', 'master']
    }
  },
  {
    path: '/my-page',
    name: 'MyPage',
    component: MyPage,
    meta: {
      permission: ['member']
    }
  },
  {
    path: '/calendar',
    name: 'CalendarPage',
    component: CalendarPage,
    meta: {
      permission: ['member']
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
});

// // 페이지 이동 권한 처리
// import mux from '@/mux'
// router.beforeEach(async (to, from, next) => {
//   const permissions = to.meta.permission;
//   // 로컬스토리지에 AccessToken 이 없거나 RefreshToken 쿠키가 없을 때,
//   if ((!localStorage.getItem('AccessToken') || !Vue.$cookies.get(Vue.prototype.$configJson.cookies.RefreshToken.key))){
//     // meta.permission 에 guest 가 있으면 페이지 이동
//     if (permissions.includes('guest')) {
//       return next();
//     // meta.permission 에 guest 가 없으면 로그아웃
//     }else {
//       mux.Server.logOut();
//       return;
//     }
//   }

//   // 유저 권한 목록 가져오기
//   let checkResult;
//   try {
//     checkResult = mux.Server.get({path:'/checkPermission/'});
//   } catch (error) {
//     // 에러 발생 시 로그아웃
//     mux.Server.logOut();
//     return;
//   }
//   // 결과 없으면 로그아웃
//   if (!checkResult || !checkResult.permissions){
//     mux.Server.logOut();
//     return;
//   }

//   // meta.permission 에 guest 가 있으면 홈 화면으로 보냄
//   if (permissions.includes('guest')) {
//     return next({ name: 'MainPage' });
//   }
//   // meta.permission 에 member 가 있으면 페이지 이동
//   if (permissions.includes('member')) {
//     return next();
//   }
//   // meta.permission 중 하나라도 권한자라면 페이지 이동
//   const userPermissionArr = checkResult.permissions;
//   for (let i = 0; i < userPermissionArr.length; i++) {
//     if (permissions.includes(userPermissionArr[i])){
//       return next();
//     }
//   }

//   // 권한 없을 경우 홈 화면으로 보냄
//   alert('페이지 권한이 없습니다.');
//   return next({ name: 'MainPage' });
// });

export default router
