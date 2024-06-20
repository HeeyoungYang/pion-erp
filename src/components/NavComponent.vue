<template>
  <div>
    <!-- ▼ 좌측 메뉴 영역 -->
    <v-navigation-drawer
      v-model="drawer"
      app
      class="left_menu"
    >
      <v-list
        dense
        nav
      >
      <!-- ▼ 캘린더 -->
      <!-- <v-list-item
        link
        to="/calendar"
      >
        <v-list-item-icon>
          <v-icon>mdi-calendar</v-icon>
        </v-list-item-icon>

        <v-list-item-title>일정관리</v-list-item-title>
      </v-list-item> -->


      <v-list-item
        v-for="([title, icon, to], i) in dashboardPagesInfo"
        :key="i"
        link
        :to="to"
      >
        <v-list-item-icon>
          <v-icon v-text="icon"></v-icon>
        </v-list-item-icon>

        <v-list-item-title v-text="title"></v-list-item-title>
      </v-list-item>

        <v-list-group
          v-if="productPagesInfo.length > 0 || inboundPagesInfo.length > 0 || shipPagesInfo.length > 0"
          :value="productMenu"
          prepend-icon="mdi-archive-search"
        >
          <template v-slot:activator>
            <v-list-item-title>생산용 재고</v-list-item-title>
          </template>

          <v-list-item
              v-for="([title, icon, to], i) in productPagesInfo"
              :key="i"
              link
              :to="to"
              class="pl-6"
          >
            <v-list-item-title v-text="title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>

          <v-list-group
            v-if="inboundPagesInfo.length > 0"
            no-action
            sub-group
            :value="inboundMenu"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>입고</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="([title, icon, to], i) in inboundPagesInfo"
              :key="i"
              link
              :to="to"
              class="pl-6 grey lighten-3 ml-6"
            >
              <v-list-item-title v-text="title"></v-list-item-title>

              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>

          <v-list-group
            v-if="shipPagesInfo.length > 0"
            no-action
            sub-group
            :value="shipMenu"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>출고</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="([title, icon, to], i) in shipPagesInfo"
              :key="i"
              link
              :to="to"
              class="pl-6 grey lighten-3 ml-6"
            >
              <v-list-item-title v-text="title"></v-list-item-title>

              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
        </v-list-group>

        <v-list-group
          v-if="estimatePagesInfo.length > 0 || obtainOrderPagesInfo.length > 0"
          :value="salesMenu"
          prepend-icon="mdi-clipboard-text"
        >
          <template v-slot:activator>
            <v-list-item-title>영업관리</v-list-item-title>
          </template>

          <v-list-group
            v-if="estimatePagesInfo.length > 0"
            no-action
            sub-group
            :value="estimateMenu"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>견적 / 입찰</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="([title, icon, to], i) in estimatePagesInfo"
              :key="i"
              link
              :to="to"
              class="pl-6 grey lighten-3 ml-6"
            >
              <v-list-item-title v-text="title"></v-list-item-title>

              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>

          <v-list-group
            v-if="obtainOrderPagesInfo.length > 0"
            no-action
            sub-group
            :value="obtainOrderMenu"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>수주 / 프로젝트</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="([title, icon, to], i) in obtainOrderPagesInfo"
              :key="i"
              link
              :to="to"
              class="pl-6 grey lighten-3 ml-6"
            >
              <v-list-item-title v-text="title"></v-list-item-title>

              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
        </v-list-group>

        <v-list-group
          v-if="designProductionPagesInfo.length > 0"
          :value="designProductionMenu"
          prepend-icon="mdi-cogs"
        >
          <template v-slot:activator>
            <v-list-item-title>설계 관리</v-list-item-title>
          </template>

          <v-list-item
              v-for="([title, icon, to], i) in designProductionPagesInfo"
              :key="i"
              link
              :to="to"
              class="pl-6"
          >
            <v-list-item-title v-text="title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <v-list-group
          v-if="purchasePagesInfo.length > 0"
          :value="purchaseMenu"
          prepend-icon="mdi-account-cash"
        >
          <template v-slot:activator>
            <v-list-item-title>구매 관리</v-list-item-title>
          </template>

          <v-list-item
              v-for="([title, icon, to], i) in purchasePagesInfo"
              :key="i"
              link
              :to="to"
              class="pl-6"
          >
            <v-list-item-title v-text="title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <!-- <v-list-group
          :value="estimateMenu"
          prepend-icon="mdi-invoice-list"
        >
          <template v-slot:activator>
            <v-list-item-title>입찰/견적 관리</v-list-item-title>
          </template>

          <v-list-item
              v-for="([title, icon, to], i) in estimatePages"
              :key="i"
              link
              :to="to"
              class="pl-6 grey lighten-3"
          >
            <v-list-item-title v-text="title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group> -->
        <v-list-group
          v-if="backDataPagesInfo.length > 0"
          :value="backDataMenu"
          prepend-icon="mdi-file-cog"
        >
          <template v-slot:activator>
            <v-list-item-title>B`Data</v-list-item-title>
          </template>

          <v-list-item
              v-for="([title, icon, to], i) in backDataPagesInfo"
              :key="i"
              link
              :to="to"
              class="pl-6 grey lighten-3"
          >
            <v-list-item-title v-text="title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
        <v-list-group
          v-if="adminPagesInfo.length > 0"
          :value="userMenu"
          prepend-icon="mdi-account-circle"
        >
          <template v-slot:activator>
            <v-list-item-title>계정 관리</v-list-item-title>
          </template>

          <v-list-item
              v-for="([title, icon, to], i) in adminPagesInfo"
              :key="i"
              link
              :to="to"
              class="pl-6 grey lighten-3"
          >
            <v-list-item-title v-text="title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <!-- ▼ 상단 바 영역 -->
    <v-app-bar app
      class="top_bar">
      <v-app-bar-nav-icon class="menu_icon" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <!-- ▼ 로고. 클릭 시 Home으로 이동 -->
      <v-toolbar-title>
        <router-link to="/home">
          <v-img
            alt="Pionelectric Logo"
            class="shrink mr-2"
            contain
            src="../assets/img/pion_logo_white.png"
            transition="scale-transition"
            width="150"
          />
        </router-link>
      </v-toolbar-title>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <!-- ▼ 우측 User 아이콘 -->
          <v-btn
            icon
            x-large
            v-bind="attrs"
            v-on="on"
            class="user_icon_button"
          >
            <v-avatar
              color="white"
              size="30"
            >
              <v-icon class="indigo--text text-h6"> mdi-account </v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <!-- ▼ 계정관리 클릭 시 노출되는 리스트(dropdown) -->
        <v-list>
          <v-list-item
            v-for="(item, index) in userMenuList"
            :key="index"
            :to=item.to
            @click="clickUserMenu(item)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<style>
  @import "../assets/css/index.css";
</style>
<script>
import mux from '@/mux';

  export default {
    props: ['userMenu', 'productMenu', 'inboundMenu', 'shipMenu', 'estimateMenu', 'backDataMenu', 'salesMenu', 'obtainOrderMenu', 'designProductionMenu', 'purchaseMenu'],
    data: () => ({
      drawer: null,
      menuList: [
          { title: 'Members', icon: 'mdi-account-group', to:'/member-list' },
        ],

      userMenuList: [
        { title: 'My page', to:'/my-page'},
        { title: 'Logout'},
      ],
        right: null,

      dashboardPages: [
        ['DashBoard', 'mdi-chart-areaspline', '/dashboard', ['master']],
      ],

      productPages: [
        ['재고 현황', '', '/stock-search', []],
        ['원부자재', '', '/material-search', []],
        ['반제품', '', '/module-search', []],
        ['완제품', '', '/product-search', []],
        ['원가', '', '/product-cost', []],
      ],

      inboundPages: [
        ['입고 현황', '', '/inbound-search', []],
        ['입고 신청', '', '/inbound-register', []],
      ],

      shipPages: [
        ['출고 현황', '', '/ship-search', []],
        ['출고 신청', '', '/ship-register', []],
      ],

      estimatePages: [
        ['견적서', '', '/estimate', ['master', '매니저']],
        ['견적서 현황', '', '/estimate-search', ['master', '매니저']],
      ],
      obtainOrderPages: [
        ['수주서', '', '/obtain-order', ['master', '매니저']],
        ['수주서 현황', '', '/obtain-order-search', ['master', '매니저']],
        ['진행 사항', '', '/obtain-progress', ['master', '매니저']],
      ],
      designProductionPages: [
        ['설계', '', '/design-production', ['master', '매니저']],
        ['설계 현황', '', '/design-production-search', ['master', '매니저']],
      ],
      purchasePages: [
        ['구매 요청', '', '/purchase-request', ['master', '매니저']],
        ['구매 요청 현황', '', '/purchase-search', ['master', '매니저']],
        ['발주 현황', '', '/order-search', ['master', '매니저']],
      ],
      // estimatePages: [
      //   ['견적 작성', '', '/home'],
      //   ['견적 조회', '', '/estimate-search'],
      // ],

      backDataPages: [
        ['재고 정보', '', '/product-backdata', ['master', '매니저']],
        ['노무비 정보', '', '/labor-cost-backdata', ['master', '매니저']],
        ['기본 정보', '', '/basic-info-backdata', ['master', '매니저']],
      ],

      adminPages: [
        ['계정 목록', '', '/member-list', ['master', '매니저']],
        ['권한 설정', '', '/member-authorization', ['master']],
        ['페이지 설정', '', '/page-setting', ['master']],
      ],
    }),
    computed: {
      dashboardPagesInfo() {
        const permissionArr = []; // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.department.key)); // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.position.key)); // 현재 권한 체계 안되어 있기에 임시로 직책을 배열에 넣음
        let dashboardPagesInfo = [];
        this.dashboardPages.forEach(data => {
          if (data[data.length-1].length === 0){
            dashboardPagesInfo.push(data);
          } else {
            data[data.length-1].forEach(permission => {
              if (permissionArr.includes(permission)){
                dashboardPagesInfo.push(data);
              }
            });
          }
        });
        return dashboardPagesInfo;
      },
      productPagesInfo() {
        const permissionArr = []; // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.department.key)); // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.position.key)); // 현재 권한 체계 안되어 있기에 임시로 직책을 배열에 넣음
        let productPagesInfo = [];
        this.productPages.forEach(data => {
          if (data[data.length-1].length === 0){
            productPagesInfo.push(data);
          } else {
            data[data.length-1].forEach(permission => {
              if (permissionArr.includes(permission)){
                productPagesInfo.push(data);
              }
            });
          }
        });
        return productPagesInfo;
      },
      designProductionPagesInfo() {
        const permissionArr = []; // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.department.key)); // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.position.key)); // 현재 권한 체계 안되어 있기에 임시로 직책을 배열에 넣음
        let designProductionPagesInfo = [];
        this.designProductionPages.forEach(data => {
          if (data[data.length-1].length === 0){
            designProductionPagesInfo.push(data);
          } else {
            data[data.length-1].forEach(permission => {
              if (permissionArr.includes(permission)){
                designProductionPagesInfo.push(data);
              }
            });
          }
        });
        return designProductionPagesInfo;
      },
      purchasePagesInfo() {
        const permissionArr = []; // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.department.key)); // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.position.key)); // 현재 권한 체계 안되어 있기에 임시로 직책을 배열에 넣음
        let purchasePagesInfo = [];
        this.purchasePages.forEach(data => {
          if (data[data.length-1].length === 0){
            purchasePagesInfo.push(data);
          } else {
            data[data.length-1].forEach(permission => {
              if (permissionArr.includes(permission)){
                purchasePagesInfo.push(data);
              }
            });
          }
        });
        return purchasePagesInfo;
      },
      inboundPagesInfo() {
        const permissionArr = []; // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.department.key)); // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.position.key)); // 현재 권한 체계 안되어 있기에 임시로 직책을 배열에 넣음
        let inboundPagesInfo = [];
        this.inboundPages.forEach(data => {
          if (data[data.length-1].length === 0){
            inboundPagesInfo.push(data);
          } else {
            data[data.length-1].forEach(permission => {
              if (permissionArr.includes(permission)){
                inboundPagesInfo.push(data);
              }
            });
          }
        });
        return inboundPagesInfo;
      },
      shipPagesInfo() {
        const permissionArr = []; // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.department.key)); // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.position.key)); // 현재 권한 체계 안되어 있기에 임시로 직책을 배열에 넣음
        let shipPagesInfo = [];
        this.shipPages.forEach(data => {
          if (data[data.length-1].length === 0){
            shipPagesInfo.push(data);
          } else {
            data[data.length-1].forEach(permission => {
              if (permissionArr.includes(permission)){
                shipPagesInfo.push(data);
              }
            });
          }
        });
        return shipPagesInfo;
      },
      estimatePagesInfo() {
        const permissionArr = []; // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.department.key)); // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.position.key)); // 현재 권한 체계 안되어 있기에 임시로 직책을 배열에 넣음
        let estimatePagesInfo = [];
        this.estimatePages.forEach(data => {
          if (data[data.length-1].length === 0){
            estimatePagesInfo.push(data);
          } else {
            data[data.length-1].forEach(permission => {
              if (permissionArr.includes(permission)){
                estimatePagesInfo.push(data);
              }
            });
          }
        });
        return estimatePagesInfo;
      },
      obtainOrderPagesInfo() {
        const permissionArr = []; // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.department.key)); // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.position.key)); // 현재 권한 체계 안되어 있기에 임시로 직책을 배열에 넣음
        let obtainOrderPagesInfo = [];
        this.obtainOrderPages.forEach(data => {
          if (data[data.length-1].length === 0){
            obtainOrderPagesInfo.push(data);
          } else {
            data[data.length-1].forEach(permission => {
              if (permissionArr.includes(permission)){
                obtainOrderPagesInfo.push(data);
              }
            });
          }
        });
        return obtainOrderPagesInfo;
      },
      backDataPagesInfo() {
        const permissionArr = []; // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.department.key)); // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.position.key)); // 현재 권한 체계 안되어 있기에 임시로 직책을 배열에 넣음
        let backDataPagesInfo = [];
        this.backDataPages.forEach(data => {
          if (data[data.length-1].length === 0){
            backDataPagesInfo.push(data);
          } else {
            data[data.length-1].forEach(permission => {
              if (permissionArr.includes(permission)){
                backDataPagesInfo.push(data);
              }
            });
          }
        });
        return backDataPagesInfo;
      },
      adminPagesInfo() {
        const permissionArr = []; // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.department.key)); // 현재 권한 체계 안되어 있기에 임시로 부서를 배열에 넣음
        permissionArr.push(this.$cookies.get(this.$configJson.cookies.position.key)); // 현재 권한 체계 안되어 있기에 임시로 직책을 배열에 넣음
        let adminPagesInfo = [];
        this.adminPages.forEach(data => {
          if (data[data.length-1].length === 0){
            adminPagesInfo.push(data);
          } else {
            data[data.length-1].forEach(permission => {
              if (permissionArr.includes(permission)){
                adminPagesInfo.push(data);
              }
            });
          }
        });
        return adminPagesInfo;
      },
    },
    methods: {
      clickUserMenu(item) {
        if (!item.to){
          mux.Server.logOut();
          return false;
        }
      }
    }
  }
</script>
<style>
.v-list-group__items{background-color: #efefef;}

</style>
