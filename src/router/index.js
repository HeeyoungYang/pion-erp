import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '@/views/LoginPage'
import MainPage from '@/views/MainPage'
import MembersPage from '@/views/MembersPage'
import AuthorizationPage from '@/views/AuthorizationPage'
import PageSettingPage from '@/views/PageSettingPage'
import StockSearchPage from '@/views/StockSearchPage'
import MaterialSearchPage from '@/views/MaterialSearchPage'
import ModuleSearchPage from '@/views/ModuleSearchPage'
import ProductSearchPage from '@/views/ProductSearchPage'
import ProductCostPage from '@/views/ProductCostPage'
import InboundSearchPage from '@/views/InboundSearchPage'
import InboundRegisterPage from '@/views/InboundRegisterPage'
import ShipSearchPage from '@/views/ShipSearchPage'
import ShipRegisterPage from '@/views/ShipRegisterPage'
import DashboardPage from '@/views/DashboardPage'
import EstimatePage from '@/views/EstimatePage'
import EstimateSearchPage from '@/views/EstimateSearchPage'
import PurchasePage from '@/views/PurchasePage'
import PurchaseSearchPage from '@/views/PurchaseSearchPage'
import ProductionPage from '@/views/ProductionPage'
import ProductionSearchPage from '@/views/ProductionSearchPage'
import OrderSearchPage from '@/views/OrderSearchPage'
import DesignProductionPage from '@/views/DesignProductionPage'
import DesignProductionSearchPage from '@/views/DesignProductionSearchPage'
import ObtainOrderPage from '@/views/ObtainOrderPage'
import ObtainProgressPage from '@/views/ObtainProgressPage'
import ObtainOrderSearchPage from '@/views/ObtainOrderSearchPage'
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
      permission: ['guest']
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
      permission: []
    }
  },
  {
    path: '/material-search',
    name: 'MaterialSearchPage',
    component: MaterialSearchPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/module-search',
    name: 'ModuleSearchPage',
    component: ModuleSearchPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/product-search',
    name: 'ProductSearchPage',
    component: ProductSearchPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/product-cost',
    name: 'ProductCostPage',
    component: ProductCostPage,
    meta: {
      permission: []
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
      permission: []
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
      permission: []
    }
  },
  {
    path: '/dashboard',
    name: 'DashboardPage',
    component: DashboardPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/estimate',
    name: 'EstimatePage',
    component: EstimatePage,
    meta: {
      permission: []
    }
  },
  {
    path: '/estimate-search',
    name: 'EstimateSearchPage',
    component: EstimateSearchPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/purchase-request',
    name: 'PurchasePage',
    component: PurchasePage,
    meta: {
      permission: []
    }
  },
  {
    path: '/purchase-search',
    name: 'PurchaseSearchPage',
    component: PurchaseSearchPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/production-request',
    name: 'ProductionPage',
    component: ProductionPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/production-search',
    name: 'ProductionSearchPage',
    component: ProductionSearchPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/order-search',
    name: 'OrderSearchPage',
    component: OrderSearchPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/design-production',
    name: 'DesignProductionPage',
    component: DesignProductionPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/design-production-search',
    name: 'DesignProductionSearchPage',
    component: DesignProductionSearchPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/obtain-order',
    name: 'ObtainOrderPage',
    component: ObtainOrderPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/obtain-progress',
    name: 'ObtainProgressPage',
    component: ObtainProgressPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/obtain-order-search',
    name: 'ObtainOrderSearchPage',
    component: ObtainOrderSearchPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/product-backdata',
    name: 'ProductBackdataPage',
    component: ProductBackdataPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/labor-cost-backdata',
    name: 'LaborCostBackdataPage',
    component: LaborCostBackdataPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/basic-info-backdata',
    name: 'BasicInfoBackdataPage',
    component: BasicInfoBackdataPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/member-list',
    name: 'MembersPage',
    component: MembersPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/member-authorization',
    name: 'AuthorizationPage',
    component: AuthorizationPage,
    meta: {
      permission: []
    }
  },
  {
    path: '/page-setting',
    name: 'PageSettingPage',
    component: PageSettingPage,
    meta: {
      permission: []
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

// 페이지 이동 권한 처리
import mux from '@/mux'
router.beforeEach(async (to, from, next) => {
  const permissions = to.meta.permission;
  // 로컬스토리지에 AccessToken 이 없거나 RefreshToken 쿠키가 없을 때,
  if ((!localStorage.getItem('AccessToken') || !Vue.$cookies.get(Vue.prototype.$configJson.cookies.RefreshToken.key))){
    // meta.permission 에 guest 가 있으면 페이지 이동
    if (permissions.includes('guest')) {
      return next();
    // meta.permission 에 guest 가 없으면 로그아웃
    }else {
      mux.Util.showAlert('로그인이 필요합니다.');
      mux.Server.logOut();
      return;
    }
  }

  // meta.permission 에 guest 혹은 member 가 있으면 페이지 이동
  if (permissions.includes('guest') || permissions.includes('member')) {
    return next();
  }

  // 유저 권한 목록 가져오기
  try {
    let result = await mux.Server.get({path:'/api/admin/page_resources/'});
    if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
      if( result.data.length > 0) {
        let page_resourceList = result.data.map(data => {
          let page_resource = {};
          page_resource.page_name = data.page_name;
          page_resource.page_alias = data.page_alias
          page_resource.page_url = data.page_url;
          return page_resource;
        });
        page_resourceList.sort((a, b) => b.page_name.localeCompare(a.page_name));

        try {
          let response = await mux.Server.get({
            path: `/api/check_page_permission?page_name=${page_resourceList.find(page => page.page_url === to.path).page_name}`
          });
          if (response.code === 0){
            return next();
          }else {
            // 권한 없을 경우 홈 화면으로 보냄
            mux.Util.showAlert('페이지 접근 권한이 없습니다.');
            return next({ name: 'MainPage' });
          }
        } catch (error) {
          mux.Util.showAlert('페이지 권한을 확인할 수 없습니다.');
          return next({ name: 'MainPage' });
        }
      }
    }else {
      mux.Util.showAlert('페이지 권한을 확인할 수 없습니다.');
      return next({ name: 'MainPage' });
    }
  } catch(error) {
    mux.Util.showAlert('페이지 권한을 확인할 수 없습니다.');
    return next({ name: 'MainPage' });
  }

  

  // checkResult.permissions = []; // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
  // checkResult.permissions.push(Vue.$cookies.get(Vue.prototype.$configJson.cookies.department.key)); // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
  // checkResult.permissions.push(Vue.$cookies.get(Vue.prototype.$configJson.cookies.position.key)); // 현재 권한 체계 안되어 있기에 임시로 직책을 배열에 넣음

  // // meta.permission 중 하나라도 권한자라면 페이지 이동
  // const userPermissionArr = checkResult.permissions;
  // for (let i = 0; i < userPermissionArr.length; i++) {
  //   if (permissions.includes(userPermissionArr[i])){
  //     return next();
  //   }
  // }

  // // 권한 없을 경우 홈 화면으로 보냄
  // mux.Util.showAlert('페이지 접근 권한이 없습니다.');
  // return next({ name: 'MainPage' });
});

export default router
