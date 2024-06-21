<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :salesMenu="true" :obtainOrderMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>

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
                  />
                </v-col>
              </v-row>
            </div>
          </CardComponent>
        </v-col>
        <v-col cols="12" sm="7">
          <v-card>
            <v-tabs
              v-model="tab_progress"
              background-color="transparent"
              class="tab_progress"
            >
              <v-tab
                v-for="sub_item in progress_tab_items"
                :key="sub_item"
              >
                {{ sub_item }}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab_progress" class="pb-1">
              <!-- 수주서 -->
              <v-tab-item>
                <v-card class="elevation-0">
                  <div style="text-align: right;">
                    <v-menu offset-y>
                      <template v-slot:activator="{ on, attrs }">
                          <v-btn
                          color="success"
                          fab
                          x-small
                          class="dont_print"
                          elevation="0"
                          v-bind="attrs"
                          v-on="on"
                          data-html2canvas-ignore="true"
                        >
                          <v-icon
                            small
                          >mdi-content-save</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          v-for="(item, index) in save_costs"
                          :key="index"
                          dense
                          @click="item.click === 'print' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data')
                                  : item.click === 'pdf' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data', '원가계산서') : ''"
                        >
                          <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                  <v-card-title>
                    <v-row
                      class="px-3"
                      style="background: #efefef;"
                    >
                      <v-col align-self="center" cols="12" sm="10">
                        <p style="font-weight: bold; font-size: 30px;" class="mb-0">수주서
                        </p>
                      </v-col>
                      <v-col align-self="center" cols="12" sm="2">
                        <v-img
                          alt="Pionelectric Logo"
                          class="float-right"
                          contain
                          src="../assets/img/pion_logo.png"
                          transition="scale-transition"
                          width="140"
                          style="margin-top:10px"
                        />
                      </v-col>
                    </v-row>
                  </v-card-title>
                  <v-card-text>
                    <v-row class="mt-5" justify="space-between">
                      <v-col align-self="center" cols="12" sm="5" class="pb-0">
                        <v-row style="border-bottom:1px solid #b4b4b4; font-size: 15px;" class="mb-4">
                          <v-col cols="12" sm="10" class="font-weight-bold">업체A</v-col>
                          <v-col cols="12" sm="2">귀하</v-col>
                        </v-row>
                        <table style=" border-spacing: 0px; width: 100%;" class="mt-1">
                          <tr class="text-body-1">
                            <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">발행일</td>
                            <td class="estimate_info" style="border-bottom: 0px;">2024-05-29</td>
                          </tr>
                          <tr>
                            <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">용역명</td>
                            <td class="estimate_info" style="border-bottom: 0px;"></td>
                          </tr>
                          <tr>
                            <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">용역기간</td>
                            <td class="estimate_info" style="border-bottom: 0px;"></td>
                          </tr>
                          <tr>
                            <td class="estimate_info estimate_title text-center" style="border-left:1px solid #b6b6b6">유효기간</td>
                            <td class="estimate_info"></td>
                          </tr>
                        </table>
                        <p style=" font-size: 12px;" class="mt-3 text-center font-weight-bold">하기와 같이 견적 드립니다.</p>
                      </v-col>
                      <v-col align-self="center" cols="12" sm="6" style="position: relative;" class="pb-0">
                        <v-img
                          alt="직인"
                          contain
                          src="../assets/img/pion_stamp.png"
                          transition="scale-transition"
                          width="40"
                          style="position: absolute; right:25px; top:25px"
                        />
                        <table style=" border-spacing: 0px; width: 100%;" class="mt-1">
                          <tr>
                            <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">등록번호</td>
                            <td colspan="3" class="estimate_info" style="border-bottom: 0px;">851 - 86 - 00038</td>
                          </tr>
                          <tr>
                            <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">상호</td>
                            <td class="estimate_info" style="border-bottom: 0px;">파이온일렉트릭(주)</td>
                            <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;">대표자</td>
                            <td class="estimate_info" style="border-bottom: 0px;">윤광희</td>
                          </tr>
                          <tr>
                            <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">주소</td>
                            <td colspan="3" class="estimate_info" style="border-bottom: 0px;">서울특별시 서대문구 연세로 50, 116호 (연세대학교 공학원)</td>
                          </tr>
                          <tr>
                            <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">업태</td>
                            <td class="estimate_info" style="border-bottom: 0px;">제조업</td>
                            <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;">종목</td>
                            <td class="estimate_info" style="border-bottom: 0px;">전력전자기기</td>
                          </tr>
                          <tr>
                            <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">대표전화</td>
                            <td class="estimate_info" style="border-bottom: 0px;">070-5096-4179</td>
                            <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;">팩스</td>
                            <td class="estimate_info" style="border-bottom: 0px;">0505-300-4179</td>
                          </tr>
                          <tr>
                            <td class="estimate_info estimate_title text-center" style="border-left:1px solid #b6b6b6">담당자</td>
                            <td class="estimate_info" >OOO</td>
                            <td class="estimate_info estimate_title text-center" >연락처</td>
                            <td class="estimate_info">070-1234-5678</td>
                          </tr>
                        </table>
                      </v-col>
                      <v-col cols="12" sm="12" class="pt-0">
                        <table style=" border-spacing: 0px; width: 100%;" class="mb-5">
                          <tr>
                            <td class="estimate_price_info estimate_price_title text-center">일금</td>
                            <td class="estimate_price_info"><span class="font-weight-bold">일천일백만 원정 </span>(￦ 11,000,000) <span style="font-size:11px" class="pl-10">* 부가가치세(VAT) 별도</span></td>
                          </tr>
                        </table>
                      </v-col>
                    </v-row>
                    <CostTableComponent
                      :headers="survey_cost_headers"
                      :items="calc_cost_detail_data"
                      item-key="product_code"
                      :childTrStyle="'background-color:#efefef'"
                      prevent-editable
                      prevent-button
                      hide-children
                      :show-childs-parent-index-arr="[0]"
                      class="cost_table_border"
                    />
                  </v-card-text>
                </v-card>
              </v-tab-item>

              <!-- 설계 -->
              <v-tab-item>
                <v-card class="elevation-0">
                  <v-card-text>
                    <v-row class="mt-3">
                      <v-col cols="12" sm="12">
                        <p class="font-weight-bold primary--text mb-0">BOM List</p>
                        <DataTableComponent
                          :headers="bom_list_headers"
                          :items="bom_list_data"
                          item-key="product_code"
                          children-key="belong_data"
                          dense
                          tableClass="elevation-0"
                          addToTable
                          @addDataToTable="addShipData"
                        />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="font-weight-bold primary--text mb-0">승인도서</p>
                        <div style="width:100%; background-color: #ccc; min-height:300px"></div>
                        <!-- <v-img
                          alt="thumbnail"
                          class="shrink mr-2"
                          contain
                          :src="mux.Util.imageBinary(receivingInspectionThumbnail)"
                          transition="scale-transition"
                          width="350"
                          @click="download('inbound/receiving_inspection', inbound_info_data.receiving_inspection_file, inbound_info_data.code+'_')"
                          style="cursor: pointer;"
                        /> -->
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="font-weight-bold primary--text mb-0">제작사양서</p>
                        <div style="width:100%; background-color: #ccc; min-height:300px"></div>
                        <!-- <v-img
                          alt="thumbnail"
                          class="shrink mr-2"
                          contain
                          :src="mux.Util.imageBinary(receivingInspectionThumbnail)"
                          transition="scale-transition"
                          width="350"
                          @click="download('inbound/receiving_inspection', inbound_info_data.receiving_inspection_file, inbound_info_data.code+'_')"
                          style="cursor: pointer;"
                        /> -->
                      </v-col>

                      <v-col cols="12" sm="4">
                        <p class="font-weight-bold primary--text mb-0">상세 도면</p>
                        <v-chip
                          color="grey lighten-2"
                          class="ma-2"
                        >
                          배치도
                        </v-chip>
                        <v-chip
                          color="grey lighten-2"
                          class="ma-2"
                        >
                          구조도
                        </v-chip>
                        <v-chip
                          color="grey lighten-2"
                          class="ma-2"
                        >
                          단선도
                        </v-chip>
                        <v-chip
                          color="grey lighten-2"
                          class="ma-2"
                        >
                          삼선도
                        </v-chip>
                        <v-chip
                          color="grey lighten-2"
                          class="ma-2"
                        >
                          회로도
                        </v-chip>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="font-weight-bold primary--text mb-0">기타</p>
                        <v-chip
                          color="grey lighten-2"
                          class="ma-2"
                        >
                          기타첨부파일.pdf
                        </v-chip>
                        <v-chip
                          color="grey lighten-2"
                          class="ma-2"
                        >
                          기타첨부파일2.xlsx
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <!-- 구매 -->
              <v-tab-item>
                <v-card class="elevation-0">
                  <v-card-text>
                    <DataTableComponent
                      dense
                      :headers="purchase_detail_headers"
                      :items="search_estimate_data"
                      item-key="estimate_code"
                    />
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>

          </v-card>
        </v-col>
      </v-row>

    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import DataTableComponent from "@/components/DataTableComponent.vue";
import ObtainProgressPageConfig from "@/configure/ObtainProgressPageConfig.json";
import CheckPagePermission from "@/common_js/CheckPagePermission";
import CostTableComponent from "@/components/CostTableComponent";
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
                CostTableComponent,
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
      // this.search_estimate_data = ObtainProgressPageConfig.test_estimate_data
    },
    async searchButton(){
      this.loading_dialog = true;
      this.search_estimate_data = ObtainProgressPageConfig.test_estimate_data
      this.loading_dialog = false;
    },
    test(){
      // console.log('test');
      // mux.Server.uploadFile({path: '/', folder:'somefolder', file: this.files[0]});
      mux.Server.uploadFile({path: '/', folder:'somefolder', files: this.files});
    },
  },
  data(){
    return{
      tab_progress: null,
      dialog_search_product: false,
      dialog_calculate_labor: false,

      save_costs: ObtainProgressPageConfig.save_costs,
      search_estimate_headers: ObtainProgressPageConfig.search_estimate_headers,
      purchase_detail_headers: ObtainProgressPageConfig.purchase_detail_headers,
      bom_list_headers: ObtainProgressPageConfig.bom_list_headers,
      survey_cost_headers: ObtainProgressPageConfig.survey_cost_headers,
      dialog_search_product_headers: ObtainProgressPageConfig.dialog_search_product_headers,
      construction_materials_headers: ObtainProgressPageConfig.construction_materials_headers,

      calc_cost_detail_data: JSON.parse(JSON.stringify(ObtainProgressPageConfig.calc_cost_detail_data)),

      labor_cost_data: [],
      merged_labor_cost_data: [],


      progress_tab_items: ObtainProgressPageConfig.progress_tab_items,
      write_tab_items: ObtainProgressPageConfig.write_tab_items,
      searchCardInputs: ObtainProgressPageConfig.searchCardInputs,
      estimateDefaultInfoInputs: ObtainProgressPageConfig.estimateDefaultInfoInputs,
      estimateCompanyInfoInputs: ObtainProgressPageConfig.estimateCompanyInfoInputs,
      estimateFilesInputs: ObtainProgressPageConfig.estimateFilesInputs,
      search_estimate_data: [],
    }
  },
}
</script>
<style>
.estimate_info{border:1px solid #b6b6b6; padding: 2px 15px; font-size: 11px; border-left: 0px;}
.estimate_title{background-color: #efefef; font-weight: bold;}
.estimate_price_info{border-top:3px solid #b6b6b6; border-bottom:3px solid #b6b6b6; padding: 5px 15px; font-size: 16px; border-left: 0px;}
.estimate_price_title{background-color: #efefef; font-weight: bold;}

</style>
