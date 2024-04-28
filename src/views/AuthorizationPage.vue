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
import CheckPagePermission from "@/common_js/CheckPagePermission";
import LoadingModalComponent from "@/components/LoadingModalComponent.vue";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=AuthorizationPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  created () {
    this.initialize()
  },
  methods: {
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    handleChangeAuthority(data) {
      // 사용자 권한 변경 결과를 확인하여 처리한다.
      // data ==> 변경된 사용자 정보
      console.log('사용자 권한 변경 결과:', JSON.stringify(data));
    },
    async initialize () {
      this.loading_dialog = true;
      this.headers = AuthorizationPageConfig.table_header;
      console.log("AuthorizationPageConfig.table_header=", AuthorizationPageConfig.table_header);

      let memberList = [];
      try {
        let result = await mux.Server.get({path:'/api/admin/users_authorization/'});
        if (result.code == 0){
          memberList = result.data.map(data => {
            let user = {};
            user.user_id = data.user_name;
            user.name = data.family_name + data.given_name;
            user.department = data.department;
            user.position = data.position;
            user.authority = data.groups;
            return user;
          });
        }else {
          this.loading_dialog = false;
          alert(result.message);
          return;
        }
      } catch (error) {
        this.loading_dialog = false;
        alert(error);
        return;
      }
      this.members = memberList.sort((a, b) => b.name.localeCompare(a.name));
      this.loading_dialog = false;
    },

    /*async initialize () {
      this.loading_dialog = true;
      this.headers = AuthorizationPageConfig.table_header;
      console.log("AuthorizationPageConfig.table_header=", AuthorizationPageConfig.table_header);

      let memberList = [];
      try {
        let result = await mux.Server.get({path:'/api/admin/groups/'});
        if (result.code == 0){
          memberList = result.data.forEach(data => {
            this.groups.push({name: data.GroupName, users: []});
          });
        }else {
          this.loading_dialog = false;
          alert(result.message);
          return;
        }

        for (let i = 0; i < this.groups.length; i++) {
          const group = this.groups[i];
          result = await mux.Server.get({path:`/api/admin/group/users/?group_name=${group.name}`});
          if (result.code == 0){
            result.data.Users.forEach(data => {
              group.users.push(data.Username);
            });
          }else {
            this.loading_dialog = false;
            alert(result.message);
            return;
          }
        }

        result = await mux.Server.get({path:'/api/admin/users/'});
        if (result.code == 0){
          memberList = result.data.Users.map(data => {
            let user = {};
            user.user_id = data.Username;
            user.name = (data.Attributes.find(x=>x.Name === 'family_name') ? data.Attributes.find(x=>x.Name === 'family_name').Value : '') + (data.Attributes.find(x=>x.Name === 'given_name') ? data.Attributes.find(x=>x.Name === 'given_name').Value : '');
            user.department = data.Attributes.find(attr => attr.Name === 'custom:department').Value;
            user.position = data.Attributes.find(attr => attr.Name === 'custom:position').Value;
            user.authority = this.groups.filter(group => group.users.includes(user.user_id)).map(group => group.name);
            return user;
          });
        }else {
          this.loading_dialog = false;
          alert(result.message);
          return;
        }
      } catch (error) {
        this.loading_dialog = false;
        alert(error);
        return;
      }
      this.members = memberList.sort((a, b) => b.name.localeCompare(a.name));
      this.loading_dialog = false;
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
