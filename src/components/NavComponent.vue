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
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-calendar</v-icon>
        </v-list-item-icon>

        <v-list-item-title>일정관리</v-list-item-title>
      </v-list-item>

      <!-- 2차 메뉴형 -->
      <v-list-group
        :value="true"
        prepend-icon="mdi-account-circle"
      >
        <template v-slot:activator>
          <v-list-item-title>계정관리</v-list-item-title>
        </template>

        <v-list-item
            v-for="([title, icon, to], i) in admins"
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
              <v-icon class="indigo--text text-h5"> mdi-account </v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <!-- ▼ User 아이콘 클릭 시 노출되는 리스트(dropdown) -->
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

      admins: [
        ['계정목록', '', '/member-list'],
      ],
    }),
  }
</script>
<style lang="">

</style>
