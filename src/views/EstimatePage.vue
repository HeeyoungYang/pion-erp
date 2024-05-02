<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :salesMenu="true" :estimateMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-tabs
        v-model="tab_main"
        background-color="transparent"
      >
        <v-tab
          v-for="item in tab_main_items"
          :key="item"
        >
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab_main" class="pb-1">
        <!-- 조회 탭 -->
        <v-tab-item>
          <v-row class=" mt-5">
            <v-col cols="12" sm="5">
              <v-card
                elevation="1"
              >
              </v-card>
            </v-col>
            <v-col cols="12" sm="7">
              <v-card
                elevation="1"
              >
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
        <!-- 작성 탭 -->
        <v-tab-item>
          <v-row class=" mt-5">
            <v-col cols="12" sm="5">
              <v-card
                elevation="1"
              >
              </v-card>
            </v-col>
            <v-col cols="12" sm="7">
              <v-card
                elevation="1"
              >
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>

    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import EstimatePageConfig from "@/configure/EstimatePageConfig.json";
import mux from "@/mux";
import CheckPagePermission from "@/common_js/CheckPagePermission";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=EstimateSearchPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  components: {
                NavComponent,
              },
  methods:{
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    test(){
      console.log('test');
      // mux.Server.uploadFile({path: '/', folder:'somefolder', file: this.files[0]});
      mux.Server.uploadFile({path: '/', folder:'somefolder', files: this.files});
    }
  },
  data(){
    return{
      tab_main: null,
      tab_main_items: EstimatePageConfig.tab_main_items,
    }
  },
}
</script>
<style lang="">

</style>
