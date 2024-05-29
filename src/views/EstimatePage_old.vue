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
              <CardComponent
                elevation="1"
                text-class=" pt-3"
                title-class="d-none"
              >
                <div slot="cardText">
                  <InputsFormComponent
                    dense
                    clearable
                    filled
                    hide-details
                    :inputs="searchCardInputs"
                    @enter="searchButton"
                  >
                    <v-col
                      cols="12"
                      sm="4"
                      lg="3"
                      align-self="center"
                    >
                      <v-btn
                        color="primary"
                        elevation="2"
                        @click="searchButton"
                      >
                        <v-icon>mdi-magnify</v-icon>검색
                      </v-btn>
                    </v-col>
                  </InputsFormComponent>
                  <v-row>
                    <v-col
                      cols="12"
                    >
                      <DataTableComponent
                        dense
                        :headers="search_estimate_headers"
                        :items="search_estimate_data"
                        item-key="estimate_code"
                        deletable
                        editable
                      />
                    </v-col>
                  </v-row>
                </div>
              </CardComponent>
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

  <div class="text-center">
    <v-btn
      color="primary"
      elevation="1"
      style="position: fixed; right: 0px; bottom: 20px;"
      :href="`https://www.kpi.or.kr/www/member`"
      target="_blank"
    >
      물가정보 바로가기
    </v-btn>
  </div>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import DataTableComponent from "@/components/DataTableComponent.vue";
import EstimatePageConfig from "@/configure/EstimatePageConfig.json";
import CheckPagePermission from "@/common_js/CheckPagePermission";
import mux from "@/mux";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=EstimateSearchPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  components: {
                NavComponent,
                InputsFormComponent,
                CardComponent,
                DataTableComponent,
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
      this.search_estimate_data = EstimatePageConfig.test_estimate_data
    },
    test(){
      // console.log('test');
      // mux.Server.uploadFile({path: '/', folder:'somefolder', file: this.files[0]});
      mux.Server.uploadFile({path: '/', folder:'somefolder', files: this.files});
    }
  },
  data(){
    return{
      tab_main: null,
      tab_main_items: EstimatePageConfig.tab_main_items,
      searchCardInputs: EstimatePageConfig.searchCardInputs,
      search_estimate_headers: EstimatePageConfig.search_estimate_headers,
      search_estimate_data: {},
    }
  },
}
</script>
<style lang="">

</style>
