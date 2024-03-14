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
      <!-- 1차 메뉴형 -->
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

      <!-- 2차 메뉴형 -->
        <v-list-group
          :value="productMenu"
          prepend-icon="mdi-archive-search"
        >
          <template v-slot:activator>
            <v-list-item-title>생산용 재고</v-list-item-title>
          </template>

          <v-list-item
              v-for="([title, icon, to], i) in productPages"
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
              v-for="([title, icon, to], i) in inboundPages"
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
              v-for="([title, icon, to], i) in shipPages"
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
          :value="backDataMenu"
          prepend-icon="mdi-file-cog"
        >
          <template v-slot:activator>
            <v-list-item-title>B`Data</v-list-item-title>
          </template>

          <v-list-item
              v-for="([title, icon, to], i) in backDataPages"
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
          :value="userMenu"
          prepend-icon="mdi-account-circle"
        >
          <template v-slot:activator>
            <v-list-item-title>계정 관리</v-list-item-title>
          </template>

          <v-list-item
              v-for="([title, icon, to], i) in adminPages"
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
  export default {
    props: ['userMenu', 'productMenu', 'inboundMenu', 'shipMenu', 'estimateMenu', 'backDataMenu'],
    data: () => ({
      drawer: null,
      menuList: [
          { title: 'Members', icon: 'mdi-account-group', to:'/member-list' },
        ],

      userMenuList: [
        { title: 'My page', to:'/my-page'},
        { title: 'Logout', to:'/'},
      ],
        right: null,

      productPages: [
        ['재고 현황', '', '/product-search'],
        ['원부자재', '', '/product-material'],
        ['반제품', '', '/product-module'],
        ['완제품', '', '/product-completed'],
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
        ['견적 작성', '', '/home'],
        ['견적 조회', '', '/estimate-search'],
      ],

      backDataPages: [
        ['재고 정보', '', '/product-backdata'],
        ['노무비 정보', '', '/labor-cost-backdata'],
      ],

      adminPages: [
        ['계정 목록', '', '/member-list'],
        ['권한 설정', '', '/member-authorization'],
      ],
    }),
  }
</script>
<style>
.v-list-group__items{background-color: #efefef;}

</style>
