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
                    @clickTr="clickEstimateData"
                    item-key="estimate_code"
                  />
                </v-col>
              </v-row>
            </div>
          </CardComponent>
        </v-col>
        <v-col cols="12" sm="7"  v-if="show_detail">
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
                {{ sub_item.tab_name }}
                <v-icon
                  :color="sub_item.tab_color"
                  class="ml-2"
                > mdi-circle-medium </v-icon>
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab_progress" class="pb-1">
              <!-- 수주서 -->
              <v-tab-item>
                <v-card>
                  <v-card-text>
                    <div style="width:100%; background-color: #ccc; min-height:700px">
                      ※ 수주서 PDF 미리보기 영역
                    </div>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <!-- 수주 확인서 -->
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
                    <v-row>
                      <v-col cols="12" sm="5">
                        <v-combobox
                          label="version"
                          filled
                          value="3차 수주 설계"
                          :items="versions"
                        ></v-combobox>
                      </v-col>
                    </v-row>
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
                          addBelongToTable
                          @addDataToTable="addShipData"
                        />
                      </v-col>
                    </v-row>

                    <v-row class="mt-4">
                      <v-col cols="12" sm="4">
                        <p class="font-weight-bold primary--text mb-0">▼ 배치도</p>
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
                        <p class="font-weight-bold primary--text mb-0">▼ 구조도</p>
                        <div style="width:100%; background-color: #ccc; min-height:300px"></div>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="font-weight-bold primary--text mb-0">▼ 단선도</p>
                        <div style="width:100%; background-color: #ccc; min-height:300px"></div>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="font-weight-bold primary--text mb-0">▼ 삼선도</p>
                        <div style="width:100%; background-color: #ccc; min-height:300px"></div>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="font-weight-bold primary--text mb-0">▼ 회로도</p>
                        <div style="width:100%; background-color: #ccc; min-height:300px"></div>
                      </v-col>
                    </v-row>
                    <v-divider class="mt-7"></v-divider>
                    <v-row class="mt-3">
                      <v-col cols="12" sm="4">
                        <p class="font-weight-bold primary--text mb-0">▼ 승인도서</p>
                        <div style="width:100%; background-color: #ccc; min-height:300px"></div>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="font-weight-bold primary--text mb-0">▼ 제작사양서</p>
                        <div style="width:100%; background-color: #ccc; min-height:300px"></div>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="font-weight-bold primary--text mb-0">▼ 기타</p>
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
                    <p v-if="search_purchase_data.length === 0" class="error--text">※ 등록된 구매관련 데이터가 없습니다.</p>
                    <DataTableComponent
                      v-else
                      dense
                      :headers="purchase_detail_headers"
                      :items="search_purchase_data"
                      item-key="estimate_code"
                    />
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <!-- 생산 -->
              <v-tab-item>
                <v-card class="elevation-0">
                  <v-card-text>
                    <p v-if="search_production_data.length === 0" class="error--text">※ 등록된 생산관련 데이터가 없습니다.</p>
                    <v-row v-else>
                      <v-col cols="12" sm="412">
                        <v-chip
                          class="font-weight-bold"
                          :color="search_production_data.status === '생산 완료' ? 'primary' : 'default'"
                        >
                          {{ search_production_data.status === '생산 완료' ? '생산 완료' : '생산 미완료' }}
                        </v-chip>
                        <span
                          v-if="search_production_data.inbound_date !== '' && search_production_data.inbound_approval_phase !== '승인'"
                          class="ml-1"
                        >
                          : 입고 요청 완료
                          <span class="success--text font-weight-bold">( {{ search_production_data.inbound_approval_phase }} 상태 )</span>
                        </span>

                        <span
                          v-if="search_production_data.inbound_date !== '' && search_production_data.inbound_approval_phase === '승인'"
                          class="ml-1"
                        >
                          : <span class="success--text font-weight-bold"> {{ search_production_data.inbound_date }} </span> 입고

                        </span>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="font-weight-bold primary--text mb-0">▼ 자체시험</p>
                        <v-img
                          alt="thumbnail"
                          class="shrink mr-2"
                          contain
                          :src="mux.Util.imageBinary(search_production_data.self_test_thumbnail)"
                          transition="scale-transition"
                          width="100%"
                          @click="download('production/self_test', search_production_data.self_test_file, search_production_data.code+'_')"
                          style="cursor: pointer;"
                        />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="font-weight-bold primary--text mb-0">▼ 공장시험</p>
                        <v-img
                          alt="thumbnail"
                          class="shrink mr-2"
                          contain
                          :src="mux.Util.imageBinary(search_production_data.factory_test_thumbnail)"
                          transition="scale-transition"
                          width="100%"
                          @click="download('production/self_test', search_production_data.factory_test_file, search_production_data.code+'_')"
                          style="cursor: pointer;"
                        />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="font-weight-bold primary--text mb-0">▼ 현장시험</p>
                        <v-img
                          alt="thumbnail"
                          class="shrink mr-2"
                          contain
                          :src="mux.Util.imageBinary(search_production_data.field_test_thumbnail)"
                          transition="scale-transition"
                          width="100%"
                          @click="download('production/self_test', search_production_data.field_test_file, search_production_data.code+'_')"
                          style="cursor: pointer;"
                        />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="font-weight-bold primary--text mb-0">▼ 시운전</p>
                        <v-img
                          alt="thumbnail"
                          class="shrink mr-2"
                          contain
                          :src="mux.Util.imageBinary(search_production_data.trial_run_thumbnail)"
                          transition="scale-transition"
                          width="100%"
                          @click="download('production/self_test', search_production_data.trial_run_file, search_production_data.code+'_')"
                          style="cursor: pointer;"
                        />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="font-weight-bold primary--text mb-0">▼ 전자세금계산서</p>
                        <v-img
                          alt="thumbnail"
                          class="shrink mr-2"
                          contain
                          :src="mux.Util.imageBinary(search_production_data.tax_invoice_thumbnail)"
                          transition="scale-transition"
                          width="100%"
                          @click="download('production/self_test', search_production_data.tax_invoice_file, search_production_data.code+'_')"
                          style="cursor: pointer;"
                        />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="font-weight-bold primary--text mb-0">▼ 하자보증증권 </p>
                        <v-img
                          alt="thumbnail"
                          class="shrink mr-2"
                          contain
                          :src="mux.Util.imageBinary(search_production_data.defect_warranty_thumbnail)"
                          transition="scale-transition"
                          width="100%"
                          @click="download('production/self_test', search_production_data.defect_warranty_file, search_production_data.code+'_')"
                          style="cursor: pointer;"
                        />
                      </v-col>

                    </v-row>
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
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=ObtainProgressPage')],
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
      mux.Util.showLoading();
      this.search_estimate_data = ObtainProgressPageConfig.test_estimate_data
      mux.Util.hideLoading();
    },
    async clickEstimateData(item){
      mux.Util.showLoading();
      this.tab_progress = 0;

      //구매,발주 탭 데이터
      await this.searchPurchaseData(item.project_code);

      //생산 탭 데이터
      await this.searchProductionData(item.project_code, item.company_name, item.company_bid_number, item.inhouse_bid_number);
      // this.search_production_data = ObtainProgressPageConfig.test_production_data[0];




      //승인 상태에 따른 탭 아이콘 색상
      let order_count = 0;
      this.search_purchase_data.forEach(item => {
        if(item.purchase_phase === '구매 완료')
        order_count++
      })

      if(order_count === this.search_purchase_data.length)
        this.progress_tab_items.find(x=> x.tab_name === '구매/발주').tab_color = 'success';
      if(this.search_production_data.status === '생산 완료')
        this.progress_tab_items.find(x=> x.tab_name === '생산').tab_color = 'success';

      this.progress_tab_items.find(x=> x.tab_name === '수주서').tab_color = 'success';
      mux.Util.hideLoading();
      this.show_detail = true;
    },

    async searchPurchaseData(pjt_code){
      let purchase_result = [];
      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "purchase_confirmation_table.project_code": pjt_code,
            }
          ],
          "script_file_name": "rooting_구매요청_검색_24_08_08_11_45_79G.json",
          "script_file_path": "data_storage_pion\\json_sql\\purchase\\구매요청_검색_24_08_08_11_45_QAW"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

          purchase_result = result.data;

          let set_data = []
          purchase_result.forEach(item =>{
            for(let p=0; p<item.belong_data.length; p++){
              let belongs = item.belong_data[p];
              if(belongs.order_code === "" || belongs.order_code === null){
                belongs.purchase_phase = item.approval_phase
                belongs.order_phase = "미요청"
              }else{
                belongs.purchase_phase = "발주요청"
              }
            }
            set_data.push(...item.belong_data);
          })


          for(let i=0; i<set_data.length; i++){
            let set = set_data[i];
            if(typeof set.order_code === 'string'){
              try {
                let order_result = await mux.Server.post({
                  path: '/api/common_rest_api/',
                  params: [
                    {
                      "order_confirmation_table.code": set.order_code ?  set.order_code : ""
                    }
                  ],
                  "script_file_name": "rooting_발주_데이터_order_product_confirm_fst_검색_24_08_08_09_39_OKJ.json",
                  "script_file_path": "data_storage_pion\\json_sql\\order\\발주_데이터_order_product_confirm_fst_검색_24_08_08_09_39_3Q8"
                });
                if (prevURL !== window.location.href) return;

                if (typeof order_result === 'string'){
                  order_result = JSON.parse(order_result);
                }
                if(order_result['code'] == 0 || (typeof order_result['data'] === 'object' && order_result['data']['code'] == 0) || (typeof order_result['response'] === 'object' && typeof order_result['response']['data'] === 'object' && order_result['response']['data']['code'] == 0)){

                  set.order_phase = order_result.data[0].approval_phase;
                } else {
                  mux.Util.showAlert(order_result['failed_info']);
                }
              } catch (error) {
                if (prevURL !== window.location.href) return;
                if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
                  mux.Util.showAlert(error.response['data']['failed_info'].msg);
                else
                  mux.Util.showAlert(error);
              }
            }
          }
          this.search_purchase_data = set_data
        } else {
          mux.Util.showAlert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }

    },
    async searchProductionData(project_code, company_name, company_bid_number, inhouse_bid_number){
      // this.search_production_data = ObtainProgressPageConfig.test_production_data[0];
      const prevURL = window.location.href;
      let confirm = {};
      let info = {};
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "production_confirmation_table.inhouse_bid_number": inhouse_bid_number,
              "production_confirmation_table.company_name": company_name,
              "production_confirmation_table.company_bid_number": company_bid_number,
              "production_confirmation_table.project_code": project_code
            }
          ],
          "script_file_name": "rooting_생산_데이터_검색_24_08_08_14_50_844.json",
          "script_file_path": "data_storage_pion\\json_sql\\production\\생산_데이터_검색_24_08_08_14_51_36C"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

          if(result.data.length !== 0){
            confirm = result.data[0];
            try {
              let result = await mux.Server.post({
                path: '/api/common_rest_api/',
                params: [
                  {
                    "production_confirmation_table.code": confirm.code
                  }
                ],
                "script_file_name": "rooting_생산_thumbnail_데이터_검색_24_08_08_14_19_37H.json",
                "script_file_path": "data_storage_pion\\json_sql\\production\\생산_thumbnail_데이터_검색_24_08_08_14_19_TDF"
              });
              if (prevURL !== window.location.href) return;

              if (typeof result === 'string'){
                result = JSON.parse(result);
              }
              if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

                info = result.data[0];

                //thumbnail
                try {
                  let thumbnail_result = await mux.Server.post({
                    path: '/api/common_rest_api/',
                    params: [
                      {
                        "production_confirmation_table.code": confirm.code
                      }
                    ],
                    "script_file_name": "rooting_생산_thumbnaile_검색_24_08_08_14_21_IIN.json",
                    "script_file_path": "data_storage_pion\\json_sql\\production\\생산_thumbnaile_검색_24_08_08_14_21_NAM"
                  });
                  if (prevURL !== window.location.href) return;

                  if (typeof thumbnail_result === 'string'){
                    thumbnail_result = JSON.parse(thumbnail_result);
                  }
                  if(thumbnail_result['code'] == 0 || (typeof thumbnail_result['data'] === 'object' && thumbnail_result['data']['code'] == 0) || (typeof thumbnail_result['response'] === 'object' && typeof thumbnail_result['response']['data'] === 'object' && thumbnail_result['response']['data']['code'] == 0)){

                    let thumbnail = thumbnail_result.data[0];
                    info = Object.assign(info, thumbnail);
                  } else {
                    mux.Util.showAlert(thumbnail_result['failed_info']);
                  }
                } catch (error) {
                  if (prevURL !== window.location.href) return;
                  if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
                    mux.Util.showAlert(error.response['data']['failed_info'].msg);
                  else
                    mux.Util.showAlert(error);
                }
              } else {
                mux.Util.showAlert(result['failed_info']);
              }
            } catch (error) {
              if (prevURL !== window.location.href) return;
              if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
                mux.Util.showAlert(error.response['data']['failed_info'].msg);
              else
                mux.Util.showAlert(error);
            }
          }

        } else {
          mux.Util.showAlert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }

      this.search_production_data = Object.assign(confirm, info);
    },
  },
  data(){
    return{
      mux: mux,
      show_detail: false,
      tab_progress: null,
      versions:['1차 수주 설계', '2차 수주 설계', '3차 수주 설계'],

      save_costs: ObtainProgressPageConfig.save_costs,
      search_estimate_headers: ObtainProgressPageConfig.search_estimate_headers,
      purchase_detail_headers: ObtainProgressPageConfig.purchase_detail_headers,
      bom_list_headers: ObtainProgressPageConfig.bom_list_headers,
      survey_cost_headers: ObtainProgressPageConfig.survey_cost_headers,
      dialog_search_product_headers: ObtainProgressPageConfig.dialog_search_product_headers,
      calc_cost_detail_data: JSON.parse(JSON.stringify(ObtainProgressPageConfig.calc_cost_detail_data)),

      progress_tab_items: ObtainProgressPageConfig.progress_tab_items,
      searchCardInputs: ObtainProgressPageConfig.searchCardInputs,
      search_estimate_data: [],
      search_purchase_data: [],
      search_production_data: [],
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
