<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent ></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row justify="center">
        <v-col
          cols="12"
          sm="11">
          <v-card>
            <iframe src="https://i66x939r37.execute-api.ap-northeast-2.amazonaws.com/test/anonymous-embed-sample" width="100%" height="700"> </iframe>
          </v-card>
        </v-col>
      </v-row>

    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import CheckPagePermission from "@/common_js/CheckPagePermission";
// import mux from "@/mux";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=DashboardPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  components: {
                NavComponent,
              },

  created () {
    this.initialize()
  },

  methods:{
    // eslint-disable-next-line no-unused-vars
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      // console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    initialize(){
      // this.search_estimate_data = EstimatePageConfig.test_estimate_data
    },

  },
  data(){
    return{
    }
  },
}
</script>
