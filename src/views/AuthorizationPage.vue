<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :userMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row justify="center">
        <v-col cols="12" sm="6">
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
            >
            </DataTableComponent>

          </v-card>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>

<script>
import NavComponent from "@/components/NavComponent";
import DataTableComponent from "@/components/DataTableComponent";
import AuthorizationPageConfig from "@/configure/AuthorizationPageConfig.json";
// import ModalDialogComponent from "@/components/ModalDialogComponent";
import CheckPagePermission from "@/common_js/CheckPagePermission";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=AuthorizationPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  methods: {
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    }
  },
  components: {
    NavComponent,
    DataTableComponent,
    // ModalDialogComponent,
  },
  data() {
    return {
      search: '',
      headers: AuthorizationPageConfig.headers,
      members: AuthorizationPageConfig.test_members
    }
  },
}
</script>

<style lang="">

</style>
