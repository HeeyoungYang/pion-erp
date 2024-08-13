<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :userMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row justify="center">
        <v-col cols="12" sm="6">
          <LoadingModalComponent :dialog-value="loading_dialog" hide-overlay></LoadingModalComponent>
          <v-card elevation="1">
            <v-card-title style="width:100%;">
              <v-row>
                <v-col cols="12">
                  <p class="float-left text-h6 font-weight-black mb-0">
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      label="Search"
                      dense
                      single-line
                      hide-details
                    ></v-text-field>
                  </p>
                </v-col>
              </v-row>
            </v-card-title>
            <!-- <v-data-table
              :headers="headers"
              :items="members"
              :search="search"
            >
            </v-data-table> -->
            <DataTableComponent
              :headers="headers"
              :items="members"
              :search="search"
              show-authority
              @changeAuthority="handleChangeAuthority"
            >
            </DataTableComponent>

          </v-card>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>

<script>
import mux from "@/mux";
import NavComponent from "@/components/NavComponent";
import DataTableComponent from "@/components/DataTableComponent";
import AuthorizationPageConfig from "@/configure/AuthorizationPageConfig.json";
// import ModalDialogComponent from "@/components/ModalDialogComponent";

import LoadingModalComponent from "@/components/LoadingModalComponent.vue";

export default {
  
  mounted() {
    
  },
  created () {
    this.initialize()
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    
    handleChangeAuthority(data) {
      // 사용자 권한 변경 결과를 확인하여 처리한다.
      // data ==> 변경된 사용자 정보
      // console.log('data :>> ', data);
      mux.Server.put({
        path: '/api/admin/user/groups/',
        user_name: data.user_id,
        group_names: data.authCheck
      }).then(result => {
        if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)) {
          this.members.find(member => member.user_id === data.user_id).authority = data.authCheck;
          mux.Util.showAlert('사용자 권한 변경이 완료되었습니다.', '변경 완료', 3000);
        } else {
          mux.Util.showAlert(result.message);
        }
      }).catch(error => {
        mux.Util.showAlert(error);
      });
    },
    async initialize () {
      mux.Util.showLoading();
      this.headers = AuthorizationPageConfig.table_header;
      // console.log("AuthorizationPageConfig.table_header=", AuthorizationPageConfig.table_header);

      let memberList = [];
      const prevURL = window.location.href;
      try {
        let result = await mux.Server.get({path:'/api/admin/users_authorization/'});
        if (prevURL !== window.location.href) return;
        if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          memberList = result.data.map(data => {
            let user = {};
            user.user_id = data.user_name;
            user.name = data.given_name;
            user.department = data.department;
            user.position = data.position;
            user.authority = data.groups;
            user.authCheck = data.groups;
            return user;
          });
        }else {
          mux.Util.hideLoading();
          mux.Util.showAlert(result.message);
          return;
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.hideLoading();
        mux.Util.showAlert(error);
        return;
      }

      const userPosition = this.$cookies.get(this.$configJson.cookies.position.key);
      if (userPosition !== 'master'){
        memberList = memberList.filter(data => data.position !== 'master' && !data.name.includes('TEST '));
      }

      this.members = memberList.sort((a, b) => a.name.localeCompare(b.name));
      mux.Util.hideLoading();
    },

    /*async initialize () {
      mux.Util.showLoading();
      this.headers = AuthorizationPageConfig.table_header;
      // console.log("AuthorizationPageConfig.table_header=", AuthorizationPageConfig.table_header);

      let memberList = [];
      const prevURL = window.location.href;
      try {
        let result = await mux.Server.get({path:'/api/admin/groups/'});
        if (prevURL !== window.location.href) return;
        if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          memberList = result.data.forEach(data => {
            this.groups.push({name: data.GroupName, users: []});
          });
        }else {
          mux.Util.hideLoading();
          mux.Util.showAlert(result.message);
          return;
        }

        for (let i = 0; i < this.groups.length; i++) {
          const group = this.groups[i];
          result = await mux.Server.get({path:`/api/admin/group/users/?group_name=${group.name}`});
          if (prevURL !== window.location.href) return;
          if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
            result.data.Users.forEach(data => {
              group.users.push(data.Username);
            });
          }else {
            mux.Util.hideLoading();
            mux.Util.showAlert(result.message);
            return;
          }
        }

        result = await mux.Server.get({path:'/api/admin/users/'});
        if (prevURL !== window.location.href) return;
        if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          memberList = result.data.Users.map(data => {
            let user = {};
            user.user_id = data.Username;
            user.name = (data.Attributes.find(x=>x.Name === 'given_name') ? data.Attributes.find(x=>x.Name === 'given_name').Value : '');
            user.department = data.Attributes.find(attr => attr.Name === 'custom:department').Value;
            user.position = data.Attributes.find(attr => attr.Name === 'custom:position').Value;
            user.authority = this.groups.filter(group => group.users.includes(user.user_id)).map(group => group.name);
            return user;
          });
        }else {
          mux.Util.hideLoading();
          mux.Util.showAlert(result.message);
          return;
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.hideLoading();
        mux.Util.showAlert(error);
        return;
      }
      const userPosition = this.$cookies.get(this.$configJson.cookies.position.key);
      if (userPosition !== 'master'){
        memberList = memberList.filter(data => data.position !== 'master' && !data.name.includes('TEST '));
      }

      this.members = memberList.sort((a, b) => a.name.localeCompare(b.name));
      mux.Util.hideLoading();
    }, */
  },

  components: {
    NavComponent,
    DataTableComponent,
    LoadingModalComponent,
    // ModalDialogComponent,
  },
  data() {
    return {
      loading_dialog: false,
      search: '',
      headers: AuthorizationPageConfig.headers,
      members: [],//AuthorizationPageConfig.test_members
      groups: [], // 사용하지 않음
    }
  },
}
</script>

<style lang="">

</style>
