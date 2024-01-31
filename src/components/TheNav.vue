<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      class="left_menu"
    >
      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="menu in menu_lists"
          :key="menu.title"
          link
          :to="menu.to"
        >
          <v-list-item-icon>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ menu.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app
      class="top_bar">
      <v-app-bar-nav-icon class="menu_icon" @click="drawer = !drawer"></v-app-bar-nav-icon>
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
              <v-icon class="indigo--text text-h5">{{ user.icon }}</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in items"
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
      user: {
          icon: 'mdi-account',
          fullName: 'John Doe',
          email: 'john.doe@doe.com',
        },
      menu_lists: [
          { title: 'Members', icon: 'mdi-account-group', to:'/member-list' },
        ],

      items: [
        { title: 'My page', to:'/my-page'},
        { title: 'Logout', to:'/'},
      ],
        right: null,
    }),
  }
</script>
<style lang="">

</style>
