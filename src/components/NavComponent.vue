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
        v-for="([title, icon, to], i) in pagesInfo(dashboardPages)"
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
          v-if="pagesInfo(productPages).length > 0 || pagesInfo(inboundPages).length > 0 || pagesInfo(shipPages).length > 0"
          :value="productMenu"
          prepend-icon="mdi-archive-search"
        >
          <template v-slot:activator>
            <v-list-item-title>생산용 재고</v-list-item-title>
          </template>

          <v-list-item
              v-for="([title, icon, to], i) in pagesInfo(productPages)"
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
            v-if="pagesInfo(inboundPages).length > 0"
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
              v-for="([title, icon, to], i) in pagesInfo(inboundPages)"
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
            v-if="pagesInfo(shipPages).length > 0"
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
              v-for="([title, icon, to], i) in pagesInfo(shipPages)"
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
          v-if="pagesInfo(estimatePages).length > 0 || pagesInfo(obtainOrderPages).length > 0"
          :value="salesMenu"
          prepend-icon="mdi-clipboard-text"
        >
          <template v-slot:activator>
            <v-list-item-title>영업관리</v-list-item-title>
          </template>

          <v-list-group
            v-if="pagesInfo(estimatePages).length > 0"
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
              v-for="([title, icon, to], i) in pagesInfo(estimatePages)"
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
            v-if="pagesInfo(obtainOrderPages).length > 0"
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
              v-for="([title, icon, to], i) in pagesInfo(obtainOrderPages)"
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
          v-if="pagesInfo(designProductionPages).length > 0"
          :value="designProductionMenu"
          prepend-icon="mdi-message-cog"
        >
          <template v-slot:activator>
            <v-list-item-title>설계 관리</v-list-item-title>
          </template>

          <v-list-item
              v-for="([title, icon, to], i) in pagesInfo(designProductionPages)"
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
          v-if="pagesInfo(purchasePages).length > 0"
          :value="purchaseMenu"
          prepend-icon="mdi-account-cash"
        >
          <template v-slot:activator>
            <v-list-item-title>구매 관리</v-list-item-title>
          </template>

          <v-list-item
              v-for="([title, icon, to], i) in pagesInfo(purchasePages)"
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
          v-if="pagesInfo(productionPages).length > 0"
          :value="productionMenu"
          prepend-icon="mdi-wrench-cog"
        >
          <template v-slot:activator>
            <v-list-item-title>생산 관리</v-list-item-title>
          </template>

          <v-list-item
              v-for="([title, icon, to], i) in pagesInfo(productionPages)"
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
          v-if="pagesInfo(backDataPages).length > 0"
          :value="backDataMenu"
          prepend-icon="mdi-file-cog"
        >
          <template v-slot:activator>
            <v-list-item-title>B`Data</v-list-item-title>
          </template>

          <v-list-item
              v-for="([title, icon, to], i) in pagesInfo(backDataPages)"
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
          v-if="pagesInfo(adminPages).length > 0"
          :value="userMenu"
          prepend-icon="mdi-account-circle"
        >
          <template v-slot:activator>
            <v-list-item-title>계정 관리</v-list-item-title>
          </template>

          <v-list-item
              v-for="([title, icon, to], i) in pagesInfo(adminPages)"
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
    props: ['userMenu', 'productMenu', 'inboundMenu', 'shipMenu', 'estimateMenu', 'backDataMenu', 'salesMenu', 'obtainOrderMenu', 'designProductionMenu', 'purchaseMenu', 'productionMenu'],
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
        ['DashBoard', 'mdi-chart-areaspline', '/dashboard'],
      ],

      productPages: [
        ['재고 현황', '', '/stock-search'],
        ['원부자재', '', '/material-search'],
        ['반제품', '', '/module-search'],
        ['완제품', '', '/product-search'],
        ['원가', '', '/product-cost'],
      ],

      inboundPages: [
        ['입고 현황', '', '/inbound-search'],
        ['입고 신청', '', '/inbound-register'],
      ],

      shipPages: [
        ['출고 현황', '', '/ship-search'],
        ['출고 신청', '', '/ship-register'],
      ],

      estimatePages: [
        ['견적서', '', '/estimate'],
        ['견적서 현황', '', '/estimate-search'],
      ],
      obtainOrderPages: [
        ['수주서 및 확인서', '', '/obtain-order'],
        ['수주 현황', '', '/obtain-order-search'],
        ['진행 사항', '', '/obtain-progress'],
      ],
      designProductionPages: [
        ['설계', '', '/design-production'],
        ['설계 현황', '', '/design-production-search'],
      ],
      purchasePages: [
        ['구매 요청', '', '/purchase-request'],
        ['구매 요청 현황', '', '/purchase-search'],
        ['발주 현황', '', '/order-search'],
      ],
      productionPages: [
        ['생산', '', '/production-request'],
        ['생산 현황', '', '/production-search'],
      ],
      // estimatePages: [
      //   ['견적 작성', '', '/home'],
      //   ['견적 조회', '', '/estimate-search'],
      // ],

      backDataPages: [
        ['재고 정보', '', '/product-backdata'],
        ['노무비 정보', '', '/labor-cost-backdata'],
        ['기본 정보', '', '/basic-info-backdata'],
      ],

      adminPages: [
        ['계정 목록', '', '/member-list'],
        ['권한 설정', '', '/member-authorization'],
        ['페이지 설정', '', '/page-setting'],
      ],
    }),
    computed: {
      
    },
    methods: {
      pagesInfo(pages) {
        let allowed_urls = this.$cookies.get(this.$configJson.cookies.allowed_urls.key).split(',');

        let pagesInfo = [];
        pages.forEach(data => {
          let info = allowed_urls.indexOf(data[2]);
          if (info !== -1){
            pagesInfo.push(data);
          }
        });
        return pagesInfo;
      },
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
