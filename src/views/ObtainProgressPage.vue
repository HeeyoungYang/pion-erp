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
                <v-card ref="calcCostCard" style="border: 1px solid #ccc;" elevation="0">
                  <v-card-text>
                    <div style="width:100%; background-color: #ccc; min-height:700px">
                      {{ clickedProductCost.obtain_file ? '' : '※ 수주서 PDF 미리보기 영역' }}
                      <v-img
                        v-if="clickedProductCost.obtain_file"
                        alt="thumbnail"
                        class="shrink mr-2"
                        contain
                        :src="mux.Util.imageBinary(clickedProductCost.obtain_thumbnail)"
                        transition="scale-transition"
                        width="100%"
                        @click="download('obtain/obtain', clickedProductCost.obtain_file.replace(clickedProductCost.obtain_file.split('_')[0]+'_'+clickedProductCost.obtain_file.split('_')[1]+'_', ''), clickedProductCost.obtain_file.split('_')[0]+'_'+clickedProductCost.obtain_file.split('_')[1]+'_')"
                        style="cursor: pointer;"
                      />
                    </div>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <!-- 수주 확인서 -->
              <v-tab-item>
                <v-card ref="calcCostCard" style="border: 1px solid #ccc;" elevation="0">
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
                        v-for="(item, index) in save_estimates"
                        :key="index"
                        dense
                        @click="item.click === 'print' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data')
                                : item.click === 'pdf' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data', '원가계산서') : ''"
                      >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <v-card-title style="max-width: 868.5px;">
                    <v-row
                      class="px-3"
                      style="background: #efefef;"
                    >
                      <v-col align-self="center" cols="12" sm="10">
                        <p style="font-weight: bold; font-size: 30px;" class="mb-0">수주 확인서
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
                  <v-card-text style="max-width: 868.5px;">
                    <v-row class="mt-5" justify="space-between">
                      <v-col align-self="center" cols="12" sm="5" class="pb-0">
                        <v-row style="border-bottom:1px solid #b4b4b4; font-size: 15px;" class="mb-4">
                          <v-col cols="12" sm="10" class="font-weight-bold">{{ clickedProductCost.company_name ? clickedProductCost.company_name : '' }}</v-col>
                          <v-col cols="12" sm="2">귀하</v-col>
                        </v-row>
                        <table style=" border-spacing: 0px; width: 100%;" class="mt-1">
                          <tr class="text-body-1">
                            <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">발행일</td>
                            <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.issue_date ? mux.Date.format(clickedProductCost.issue_date, 'yyyy-MM-dd') : '' }}</td>
                          </tr>
                          <tr>
                            <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">{{ clickedProductCost.obtain_type === '용역' ? '용역명' : '프로젝트명' }}</td>
                            <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.service_name ? clickedProductCost.service_name : '' }}</td>
                          </tr>
                          <tr>
                            <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">{{ clickedProductCost.obtain_type === '용역' ? '용역기간' : '프로젝트기간' }}</td>
                            <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.service_period ? clickedProductCost.service_period : '' }}</td>
                          </tr>
                          <tr>
                            <td class="estimate_info estimate_title text-center" style="border-left:1px solid #b6b6b6">유효기간</td>
                            <td class="estimate_info"> 발행일로부터 30일 이내 </td>
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
                            <td class="estimate_info" >{{ clickedProductCost.given_name ? clickedProductCost.given_name : '' }}</td>
                            <td class="estimate_info estimate_title text-center" >연락처</td>
                            <td class="estimate_info">{{ clickedProductCost.office_phone_number ? clickedProductCost.office_phone_number : '' }}</td>
                          </tr>
                        </table>
                      </v-col>
                      <v-col cols="12" sm="12" class="pt-0">
                        <table style=" border-spacing: 0px; width: 100%;" class="mb-5">
                          <tr>
                            <td class="estimate_price_info estimate_price_title text-center">일금</td>
                            <td class="estimate_price_info"><span class="font-weight-bold">{{ !total_cost || isNaN(total_cost) ? '' : mux.Number.toKorean(total_cost, ' 원정') }} </span>{{ !total_cost || isNaN(total_cost) ? '' : `(￦ ${mux.Number.withComma(total_cost)})` }} <span style="font-size:11px" class="pl-10">* 부가가치세(VAT) 별도</span></td>
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
                      :show-childs-parent-index-arr="show_childs_parent_index_arr"
                      :show-grand-childs-parent-index-arr="show_grand_childs_parent_index_arr"
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
                          v-model="version"
                          :items="versions"
                        ></v-combobox>
                      </v-col>
                    </v-row>
                    <v-row class="mt-3">
                      <v-col cols="12" sm="12">
                        <p class="font-weight-bold primary--text mb-0">BOM List</p>
                        <!-- <DataTableComponent
                          :headers="bom_list_headers"
                          :items="bom_list_data"
                          item-key="product_code"
                          children-key="belong_data"
                          dense
                          tableClass="elevation-0"
                          addToTable
                          addBelongToTable
                          @addDataToTable="addShipData"
                        /> -->
                        <DataTableComponent
                          :headers="bom_list_headers"
                          :items="bom_list_data"
                          item-key="product_code"
                          children-key="belong_data"
                          dense
                          tableClass="elevation-0"
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
                    <p v-if="Object.keys(search_production_data).length === 0" class="error--text">※ 등록된 생산관련 데이터가 없습니다.</p>
                    <v-row v-else>
                      <v-col cols="12" sm="412">
                        <v-chip
                          class="font-weight-bold"
                          :color="search_production_data.status === '생산 완료' ? 'primary' : 'default'"
                        >
                          {{ search_production_data.status === '생산 완료' ? '생산 완료' : '생산 미완료' }}
                        </v-chip>
                        <span
                          v-if="search_production_data.inbound_date !== null"
                          class="ml-2"
                        >
                          : 입고 요청 완료
                          <span class="success--text font-weight-bold">( {{ search_production_data.inbound_approval_phase }} 상태 )</span>
                        </span>

                        <span
                          v-if="search_production_data.inbound_approval_phase === '승인'"
                          class="ml-2"
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

import CostTableComponent from "@/components/CostTableComponent";
import mux from "@/mux";

export default {

  mounted() {

  },
  components: {
                NavComponent,
                InputsFormComponent,
                CardComponent,
                DataTableComponent,
                CostTableComponent,
              },
              computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
    total_cost(){
      return this.total_product_cost + this.total_labor_cost + this.total_expense_fee + this.normal_maintenance_fee + this.profite;
    },
    total_product_cost(){
      if (!this.calc_cost_detail_data_product_cost.belong_data || this.calc_cost_detail_data_product_cost.belong_data.length === 0) return 0;
      if (this.calc_cost_detail_data_product_cost.belong_data[0].belong_data && this.calc_cost_detail_data_product_cost.belong_data[0].belong_data.length !== 0){
        return this.calc_cost_detail_data_product_cost.belong_data.reduce((aa,bb)=>{
          return aa + bb.belong_data.reduce((a,b)=>{
            return a + Math.round(b.cost_unit_price * b.cost_num);
          }, 0)
        }, 0);
      }else {
        return this.calc_cost_detail_data_product_cost.belong_data.reduce((a,b)=>{
          return a + Math.round(b.cost_unit_price * b.cost_num);
        }, 0)
      }
    },
    direct_labor_cost(){ return this.merged_labor_cost_data.reduce((a,b)=>{
        return a + Math.round(b.cost_unit_price * b.cost_num);
      }, 0)},
    indirect_labor_cost_unit_price(){ return Math.round(this.direct_labor_cost * this.clickedProductCost.indirect_labor_ratio)},
    indirect_labor_cost(){ return this.calc_cost_detail_data_indirect_labor.cost_num * this.indirect_labor_cost_unit_price},
    total_labor_cost(){ return this.direct_labor_cost + this.indirect_labor_cost},
    total_expense_fee(){ return Math.round(this.calc_cost_detail_data_employment_insurance.cost_unit_price * this.calc_cost_detail_data_employment_insurance.cost_num)
      + Math.round(this.calc_cost_detail_data_tool_rent_fee.cost_unit_price * this.calc_cost_detail_data_tool_rent_fee.cost_num)
      + Math.round(this.calc_cost_detail_data_transportation_fee.cost_unit_price * this.calc_cost_detail_data_transportation_fee.cost_num)
      + Math.round(this.calc_cost_detail_data_industrial_accident.cost_unit_price * this.calc_cost_detail_data_industrial_accident.cost_num)
      + Math.round(this.calc_cost_detail_data_taxes_dues.cost_unit_price * this.calc_cost_detail_data_taxes_dues.cost_num)
      + Math.round(this.calc_cost_detail_data_welfare_benefits.cost_unit_price * this.calc_cost_detail_data_welfare_benefits.cost_num)
      + Math.round(this.calc_cost_detail_data_retirement.cost_unit_price * this.calc_cost_detail_data_retirement.cost_num)
      + Math.round(this.calc_cost_detail_data_expendables.cost_unit_price * this.calc_cost_detail_data_expendables.cost_num)
      + Math.round(this.calc_cost_detail_data_industrial_safety.cost_unit_price * this.calc_cost_detail_data_industrial_safety.cost_num)},
    normal_maintenance_fee_unit_price(){ return Math.round((this.total_product_cost + this.total_labor_cost + this.total_expense_fee) * this.clickedProductCost.normal_maintenance_fee_ratio)},
    normal_maintenance_fee(){ return Math.round(this.normal_maintenance_fee_unit_price * this.calc_cost_detail_data_normal_maintenance_fee.cost_num)},
    profite_unit_price() { return Math.round((this.total_labor_cost + this.total_expense_fee + this.normal_maintenance_fee) * this.clickedProductCost.profite_ratio)},
    profite(){ return Math.round(this.profite_unit_price * this.calc_cost_detail_data_profite.cost_num)},

    calc_cost_detail_data_product_cost(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='재료비' || x.cost_list==='기술료')},
    calc_cost_detail_data_direct_labor(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='노무비').belong_data.find(x=>x.cost_list.includes('직접 노무비'))},
    calc_cost_detail_data_indirect_labor(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='노무비').belong_data.find(x=>x.cost_list.includes('간접 노무비'))},
    calc_cost_detail_data_employment_insurance(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('고용보험료'))},
    calc_cost_detail_data_tool_rent_fee(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('공구손료'))},
    calc_cost_detail_data_transportation_fee(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('여비교통 통신비'))},
    calc_cost_detail_data_industrial_accident(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('산재보험료'))},
    calc_cost_detail_data_taxes_dues(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('세금과공과'))},
    calc_cost_detail_data_welfare_benefits(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('복리후생비'))},
    calc_cost_detail_data_retirement(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('퇴직공제 부금비'))},
    calc_cost_detail_data_expendables(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('소모품비'))},
    calc_cost_detail_data_industrial_safety(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('산업안전보건관리비'))},
    calc_cost_detail_data_normal_maintenance_fee(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='일반관리비')},
    calc_cost_detail_data_profite(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='이윤')},

    // input_issue_date() { return this.estimateSearchDefaultInfoInputs.find(x=>x.label === '발행일') },
    // input_inhouse_bid_number() { return this.estimateSearchDefaultInfoInputs.find(x=>x.label === '사내 견적번호') },
    // input_company_bid_number() { return this.estimateSearchDefaultInfoInputs.find(x=>x.label === '기업별 입찰번호') },
    // input_due_date() { return this.estimateSearchDefaultInfoInputs2.find(x=>x.label === '납기') },
    // input_service_name() { return this.estimateSearchDefaultInfoInputs2.find(x=>x.label === '용역명') },
    // input_service_period() { return this.estimateSearchDefaultInfoInputs2.find(x=>x.label === '용역기간') },
    // input_remark() { return this.estimateSearchDefaultInfoInputs2.find(x=>x.label === '특이사항') },
    // input_company_name() { return this.estimateSearchCompanyInfoInputs.find(x=>x.label === '업체명') },
    // input_company_manager() { return this.estimateSearchCompanyInfoInputs.find(x=>x.label === '담당자') },
    // input_company_manager_email() { return this.estimateSearchCompanyInfoInputs.find(x=>x.label === '담당자 E-mail') },
    // input_company_manager_phone() { return this.estimateSearchCompanyInfoInputs.find(x=>x.label === '담당자 연락처') },
    // input_approval_file() { return this.estimateFilesInputs.find(x=>x.column_name === 'approval')},
    // input_blueprint_file() { return this.estimateFilesInputs.find(x=>x.column_name === 'blueprint')},
    // input_etc_file() { return this.estimateFilesInputs.find(x=>x.column_name === 'files')},
  },
  watch:{
    estimate_product_list_dialog(val){
      val || this.closeProductList()
    },
    clickedProductCost: {
      handler(item){
        if (Object.keys(item).length > 0) {
          // this.estimate_member_info[0].name = item.checker;
          // this.estimate_member_info[0].user_id = item.checker_id;
          // this.estimate_member_info[0].checked_date = item.checked_date;
          // this.estimate_member_info[1].name = item.approver;
          // this.estimate_member_info[1].user_id = item.approver_id;
          // this.estimate_member_info[1].checked_date = item.approved_date;
          this.bom_list_data = [];
          this.purchase_detail_data = [];
          if (!item.obtain_file){
            if (this.searched_datas.product_cost_calc_detail.filter(x=>x.cost_calc_code === item.cost_calc_code).length > 0){
              this.bom_list_data = [
                  ...this.searched_datas.product_cost_calc_detail.filter(x=>x.cost_calc_code === item.cost_calc_code).map((a) => {
                    a.type = '완제품';
                    a.classification = a.product_classification;
                    // a.product_code = a.product_code;
                    a.name = a.product_name;
                    a.model = a.product_model;
                    a.spec = a.product_spec;
                    // a.manufacturer = a.manufacturer;
                    a.unit_price = a.product_unit_price;
                    a.item_num = a.product_num;
                    a.belong_data = [
                      ...a.belong_data.map((b) => {
                        b.type = b.module_type;
                        b.classification = b.module_classification;
                        b.product_code = b.module_code;
                        b.name = b.module_name;
                        b.model = b.module_model;
                        b.spec = b.module_spec;
                        b.manufacturer = b.module_manufacturer;
                        b.unit_price = b.module_unit_price;
                        b.item_num = b.module_num;
                        return b;
                      })
                    ];
                    return a;
                  })
                ];
            }

            if (this.searched_datas.purchase_detail_data.filter(x=>x.cost_calc_code === item.cost_calc_code).length > 0){
              this.purchase_detail_data = [
                  ...this.searched_datas.purchase_detail_data.filter(x=>x.cost_calc_code === item.cost_calc_code).map((a) => {
                    let item_num = 0;

                    item_num = Math.round(Number(this.bom_list_data.find(x=>x.belong_data.find(y=>y.product_code === a.item_code)).belong_data.find(y=>y.product_code === a.item_code).item_num) * Number(this.bom_list_data.find(x=>x.belong_data.find(y=>y.product_code === a.item_code)).item_num));

                    a.item_num = item_num;

                    a.purchase_estimate_file = a.purchase_estimate_file ? a.purchase_estimate_file : '';
                    a.purchase_estimate_thumbnail = a.purchase_estimate_thumbnail ? a.purchase_estimate_thumbnail : '';
                    return a;
                  })
                ];
            }
          }

          this.labor_cost_data = this.searched_datas.labor_cost_calc_detail.filter(x=>x.cost_calc_code === item.cost_calc_code);
          this.calc_cost_detail_data_product_cost.belong_data = [];
          if (this.searched_datas.product_cost_calc_detail.filter(x=>x.cost_calc_code === item.cost_calc_code).length > 0){
            this.calc_cost_detail_data_product_cost.belong_data.push({
              "cost_list": "가. 재료",
              "cost_list_colspan": 4,
              "belong_data": this.searched_datas.product_cost_calc_detail.filter(x=>x.cost_calc_code === item.cost_calc_code).map((a) => {
                a.cost_list = a.product_name;
                a.cost_list_sub = a.product_spec;
                a.cost_num = a.product_num;
                a.cost_unit_price = a.product_unit_price;
                a.cost_unit = '제품';
                return a;
              })
            });
          }
          if (this.searched_datas.construction_materials_data.filter(x=>x.cost_calc_code === item.cost_calc_code).length > 0) {
            this.calc_cost_detail_data_product_cost.belong_data.push({
              "cost_list": `${this.calc_cost_detail_data_product_cost.belong_data.length > 0 ? '나' : '가'}. 공사 자재`,
              "cost_list_colspan": 4,
              "belong_data": this.searched_datas.construction_materials_data.filter(x=>x.cost_calc_code === item.cost_calc_code).map((a) => {
                a.cost_list = a.construction_materials;
                a.cost_num = a.construction_materials_num;
                a.cost_unit_price = a.construction_materials_unit_price;
                a.cost_unit = '개';
                return a;
              })
            });
          }
          // if (this.searched_datas.technical_fee_data.filter(x=>x.cost_calc_code === item.cost_calc_code).length > 0) {
          //   this.calc_cost_detail_data_product_cost.belong_data = this.searched_datas.technical_fee_data.filter(x=>x.cost_calc_code === item.cost_calc_code).map((a) => {
          //     a.cost_list = a.technical_fee;
          //     a.cost_num = a.technical_fee_num;
          //     a.cost_unit_price = a.technical_fee_unit_price;
          //     a.cost_unit = '건';
          //     a.belong_data = [];
          //     return a;
          //   });
          // }
          // set num
          this.calc_cost_detail_data_employment_insurance.cost_num = item.employment_insurance_num;
          this.calc_cost_detail_data_tool_rent_fee.cost_num = item.tool_rent_fee_num;
          this.calc_cost_detail_data_transportation_fee.cost_num = item.transportation_fee_num;
          this.calc_cost_detail_data_industrial_accident.cost_num = item.industrial_accident_num;
          this.calc_cost_detail_data_taxes_dues.cost_num = item.taxes_dues_num;
          this.calc_cost_detail_data_welfare_benefits.cost_num = item.welfare_benefits_num;
          this.calc_cost_detail_data_retirement.cost_num = item.retirement_num;
          this.calc_cost_detail_data_expendables.cost_num = item.expendables_num;
          this.calc_cost_detail_data_industrial_safety.cost_num = item.industrial_safety_num;
          this.calc_cost_detail_data_normal_maintenance_fee.cost_num = item.normal_maintenance_fee_num;
          this.calc_cost_detail_data_profite.cost_num = item.profite_num;
          // set formula
          this.calc_cost_detail_data_indirect_labor.belong_data[0].cost_list = ' - ' + item.indirect_labor_formula;
          this.calc_cost_detail_data_employment_insurance.belong_data[0].cost_list = ' - ' + item.employment_insurance_formula;
          this.calc_cost_detail_data_tool_rent_fee.belong_data[0].cost_list = ' - ' + item.tool_rent_fee_formula;
          this.calc_cost_detail_data_transportation_fee.belong_data[0].cost_list = ' - ' + item.transportation_fee_formula;
          this.calc_cost_detail_data_industrial_accident.belong_data[0].cost_list = ' - ' + item.industrial_accident_formula;
          this.calc_cost_detail_data_taxes_dues.belong_data[0].cost_list = ' - ' + item.taxes_dues_formula;
          this.calc_cost_detail_data_welfare_benefits.belong_data[0].cost_list = ' - ' + item.welfare_benefits_formula;
          this.calc_cost_detail_data_retirement.belong_data[0].cost_list = ' - ' + item.retirement_formula;
          this.calc_cost_detail_data_expendables.belong_data[0].cost_list = ' - ' + item.expendables_formula;
          this.calc_cost_detail_data_industrial_safety.belong_data[0].cost_list = ' - ' + item.industrial_safety_formula;
          this.calc_cost_detail_data_normal_maintenance_fee.belong_data[0].cost_list = ' - ' + item.normal_maintenance_fee_formula;
          this.calc_cost_detail_data_profite.belong_data[0].cost_list = ' - ' + item.profite_formula;

          // this.input_issue_date.value = item.issue_date;
          // this.input_inhouse_bid_number.value = item.inhouse_bid_number;
          // this.input_company_bid_number.value = item.company_bid_number;
          // this.input_due_date.value = item.due_date;
          // this.input_service_name.value = item.service_name;
          // this.input_service_period.value = item.service_period;
          // this.input_remark.value = item.remark;
          // this.input_company_name.value = item.company_name;
          // this.input_company_manager.value = item.company_manager;
          // this.input_company_manager_email.value = item.company_manager_email;
          // this.input_company_manager_phone.value = item.company_manager_phone;

        }
      },
      deep: true
    },
    calc_cost_detail_data_product_cost: {
      handler(new_calc_cost_detail_data_product_cost){
        let belongs = new_calc_cost_detail_data_product_cost.belong_data;
        for (let i = belongs.length-1; i >= 0; i--) {
          const belong = belongs[i];
          if (belong.belong_data.length === 0) {
            belongs.splice(i, 1);
          }
        }
        if (belongs.length === 1 && belongs[0].cost_list === '나. 공사 자재') {
          belongs[0].cost_list = '가. 공사 자재';
        }else if (belongs.length === 2 && belongs[1].cost_list === '가. 공사 자재') {
          belongs[1].cost_list = '나. 공사 자재';
        }
      },
      deep: true
    },
    // 조회 - 노무비 데이터 변경
    labor_cost_data: {
      handler(new_labor_cost_data){
        this.merged_labor_cost_data = [];
        new_labor_cost_data.forEach(labor => {
          const sameNameIndex = this.merged_labor_cost_data.findIndex(x=>x.cost_list === labor.name);
          const mergedUnitPrice = Math.round(labor.unit_price * labor.quantity * labor.man_per_hour);
          if (sameNameIndex >= 0){
            this.merged_labor_cost_data[sameNameIndex].cost_unit_price += mergedUnitPrice;
          }else {
            this.merged_labor_cost_data.push({cost_list:labor.name, cost_unit:'식', cost_num:'1', cost_unit_price:mergedUnitPrice});
          }
        });

      // 조회 - 직접 노무비 리스트 적용
      this.calc_cost_detail_data_direct_labor.belong_data = this.merged_labor_cost_data;
      // 조회 - 간접 노무비 적용
      this.calc_cost_detail_data_indirect_labor.cost_unit_price = this.indirect_labor_cost_unit_price;
      // 조회 - 고용보험료 적용
      this.calc_cost_detail_data_employment_insurance.cost_unit_price = Math.round(this.total_labor_cost * this.clickedProductCost.employment_insurance_ratio);
      // 조회 - 공구손료 적용
      this.calc_cost_detail_data_tool_rent_fee.cost_unit_price = Math.round(this.direct_labor_cost * this.clickedProductCost.tool_rent_fee_ratio);
      // 조회 - 여비교통 통신비 적용
      this.calc_cost_detail_data_transportation_fee.cost_unit_price = Math.round(this.total_labor_cost * this.clickedProductCost.transportation_fee_ratio);
      // 조회 - 산재보험료 적용
      this.calc_cost_detail_data_industrial_accident.cost_unit_price = Math.round(this.total_labor_cost * this.clickedProductCost.industrial_accident_ratio);
      // 조회 - 세금과공과 적용
      this.calc_cost_detail_data_taxes_dues.cost_unit_price = Math.round(this.total_labor_cost * this.clickedProductCost.taxes_dues_ratio);
      // 조회 - 복리후생비 적용
      this.calc_cost_detail_data_welfare_benefits.cost_unit_price = Math.round(this.total_labor_cost * this.clickedProductCost.welfare_benefits_ratio);
      // 조회 - 퇴직공제 부금비 적용
      this.calc_cost_detail_data_retirement.cost_unit_price = Math.round(this.direct_labor_cost * this.clickedProductCost.retirement_ratio);
      // 조회 - 소모품비 적용
      this.calc_cost_detail_data_expendables.cost_unit_price = Math.round(this.total_labor_cost * this.clickedProductCost.expendables_ratio);
      // 조회 - 산업안전보건관리비 적용
      this.calc_cost_detail_data_industrial_safety.cost_unit_price = Math.round(this.direct_labor_cost * this.clickedProductCost.industrial_safety_ratio);

      // 조회 - 일반관리비 적용
      this.calc_cost_detail_data_normal_maintenance_fee.cost_unit_price = this.normal_maintenance_fee_unit_price;
      // 조회 - 이윤 적용
      this.calc_cost_detail_data_profite.cost_unit_price = this.profite_unit_price;
      },
      deep: true // 객체 내부 속성 변경 감지
    },

    // 조회 - 데이터 변경
    calc_cost_detail_data: {
      handler(){
        // 조회 - 일반관리비 적용
        this.calc_cost_detail_data_normal_maintenance_fee.cost_unit_price = this.normal_maintenance_fee_unit_price;
        // 조회 - 이윤 적용
        this.calc_cost_detail_data_profite.cost_unit_price = this.profite_unit_price;

        // 비연동 견적서 테이블 데이터 복사
        this.estimate_detail_data = [];
        this.estimate_detail_data = JSON.parse(JSON.stringify(this.calc_cost_detail_data));
        // this.total_labor_cost
        this.estimate_detail_data.find(x=>x.cost_list === '노무비').cost_unit_price = this.total_labor_cost;
        this.estimate_detail_data.find(x=>x.cost_list === '노무비').cost_num = this.total_labor_cost === 0 ? 0 : 1;
        // this.total_expense_fee
        this.estimate_detail_data.find(x=>x.cost_list === '경비').cost_unit_price = this.total_expense_fee;
        this.estimate_detail_data.find(x=>x.cost_list === '경비').cost_num = this.total_expense_fee === 0 ? 0 : 1;
      },
      deep: true // 객체 내부 속성 변경 감지
    },

    version(version){
      if (version === '수주 원본'){
        this.clickedProductCost = this.relatedClickedProductCost[0];
      }else {
        this.clickedProductCost = this.relatedClickedProductCost[Number(version.substring(0,1))];
      }
    },

  },
  created () {
    this.initialize()
  },

  methods:{
    // eslint-disable-next-line no-unused-vars

    initialize(){
      // this.search_estimate_data = ObtainProgressPageConfig.test_estimate_data
    },
    async searchButton(){
      // mux.Util.showLoading();
      // this.search_estimate_data = ObtainProgressPageConfig.test_estimate_data
      // mux.Util.hideLoading();
      mux.Util.showLoading();

      let inputs = this.searchCardInputs.find(x=> x.label === '프로젝트 코드').value;


      const prevURL = window.location.href;
      let reqURL = '/api/obtain-order/?project_code=' + inputs;

      try {
        let result = await mux.Server.get({path: reqURL});
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          const searchResult = result.data;
          // 이력 제거 후 실제 데이터만 남기기
          searchResult.confirmation = searchResult.confirmation.filter(x=> searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          const uniqueConfirmation = [];
          const confirmationMap = new Map();

          searchResult.confirmation.forEach(item => {
            const code = item.cost_calc_code;
            const time = new Date(item.modified_time).getTime();

            if (!confirmationMap.has(code) || time > confirmationMap.get(code)) {
              confirmationMap.set(code, time);
            }
          });
          confirmationMap.forEach((time, code) => {
            const item = searchResult.confirmation.find(item => item.cost_calc_code === code && new Date(item.modified_time).getTime() === time);
            uniqueConfirmation.push(item);
          });
          searchResult.confirmation = uniqueConfirmation;
          searchResult.product_cost = searchResult.product_cost.filter(x=> searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          searchResult.labor_cost_calc_detail = searchResult.labor_cost_calc_detail.filter(x=> searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          searchResult.product_cost_calc_detail = searchResult.product_cost_calc_detail.filter(x=> searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          searchResult.construction_materials_data = searchResult.construction_materials_data.filter(x=> searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));

          // 최신 순으로 정렬
          searchResult.confirmation.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));

          let reqURL2 = '/api/design-production-search/';
          // approval_phase = '';
          if (inputs[1]){
            reqURL2 += '?project_code=' + inputs[1];
          }
          if (inputs[2]){
            reqURL2 += (inputs[1]) ? '&inhouse_bid_number=' + inputs[2] : '?inhouse_bid_number=' + inputs[2];
          }
          if (inputs[3]){
            reqURL2 += (inputs[1] || inputs[2]) ? '&company_bid_number=' + inputs[3] : '?company_bid_number=' + inputs[3];
          }
          if (inputs[4]){
            reqURL2 += (inputs[1] || inputs[2] || inputs[3]) ? '&company_name=' + inputs[4] : '?company_name=' + inputs[4];
          }
          if (inputs[5]){
            reqURL2 += (inputs[1] || inputs[2] || inputs[3] || inputs[4]) ? '&issue_start_date=' + inputs[5].split(',')[0] : '?issue_start_date=' + inputs[5].split(',')[0];
            reqURL2 += inputs[5].split(',').length > 1 ? '&issue_end_date=' + inputs[5].split(',')[1] : '&issue_end_date=' + inputs[5].split(',')[0];
          }

          try {
            let result2 = await mux.Server.get({path: reqURL2});
            if (prevURL !== window.location.href) return;

            if (typeof result2 === 'string'){
              result2 = JSON.parse(result2);
            }
            if(result2['code'] == 0 || (typeof result2['data'] === 'object' && result2['data']['code'] == 0) || (typeof result2['response'] === 'object' && typeof result2['response']['data'] === 'object' && result2['response']['data']['code'] == 0)){
              const searchDesignResult = result2.data;
              // const searchDesignResult = JSON.parse(JSON.stringify(ObtainOrderSearchPageConfig.test_design_data));
              // 오래된 순으로 정렬
              searchDesignResult.confirmation.sort((a, b) => new Date(a.created_time) - new Date(b.created_time));
              const uniqueDesignConfirmation = [];
              const designConfirmationMap = new Map();

              searchDesignResult.confirmation.forEach(item => {
                const code = item.cost_calc_code;
                const time = new Date(item.modified_time).getTime();

                if (!designConfirmationMap.has(code) || time > designConfirmationMap.get(code)) {
                  designConfirmationMap.set(code, time);
                }
              });
              designConfirmationMap.forEach((time, code) => {
                const item = searchDesignResult.confirmation.find(item => item.cost_calc_code === code && new Date(item.modified_time).getTime() === time);
                uniqueDesignConfirmation.push(item);
              });
              searchDesignResult.confirmation = uniqueDesignConfirmation;

              console.log(searchDesignResult)
              // 설계 이력 추가하기
              searchResult.design_confirmation = searchDesignResult.confirmation;
              if (searchDesignResult.product_cost && searchDesignResult.product_cost.length > 0){
                searchResult.product_cost = [...searchResult.product_cost, ...searchDesignResult.product_cost];
              }
              if (searchDesignResult.labor_cost_calc_detail && searchDesignResult.labor_cost_calc_detail.length > 0){
                searchResult.labor_cost_calc_detail = [...searchResult.labor_cost_calc_detail, ...searchDesignResult.labor_cost_calc_detail];
              }
              if (searchDesignResult.product_cost_calc_detail && searchDesignResult.product_cost_calc_detail.length > 0){
                searchResult.product_cost_calc_detail = [...searchResult.product_cost_calc_detail, ...searchDesignResult.product_cost_calc_detail];
              }
              if (searchDesignResult.construction_materials_data && searchDesignResult.construction_materials_data.length > 0){
                searchResult.construction_materials_data = [...searchResult.construction_materials_data, ...searchDesignResult.construction_materials_data];
              }

              searchResult.purchase_detail_data = searchDesignResult.purchase_detail_data;

              this.searchDataCalcProcess(searchResult);

            }else{
              mux.Util.showAlert(result2);
            }

          } catch (error) {
            if (prevURL !== window.location.href) return;
            mux.Util.showAlert(error);
          }

        }else{
          mux.Util.showAlert(result);
        }

      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.hideLoading();
        mux.Util.showAlert(error);
      }

      mux.Util.hideLoading();
    },

    searchDataCalcProcess(searchResult, isFirst){
      const productTotalCost = {};
      searchResult.product_cost_calc_detail.forEach(a=>{
        if ((a.product_num && !a.product_unit_price) && a.belong_data && a.belong_data.length > 0){
          a.product_unit_price = 0;
          for (let i = 0; i < a.belong_data.length; i++) {
            const belongData = a.belong_data[i];

            if ((belongData.module_num && !belongData.module_unit_price) && belongData.belong_data && belongData.belong_data.length > 0){
              belongData.module_unit_price = 0;
              for (let i = 0; i < belongData.belong_data.length; i++) {
                const belongBelongData = belongData.belong_data[i];
                if (belongBelongData.material_num && belongBelongData.material_unit_price){
                  belongData.module_unit_price += belongBelongData.material_num * belongBelongData.material_unit_price;
                }
              }
              belongData.module_unit_price = Math.round(belongData.module_unit_price / belongData.module_num);
            }

            if (belongData.module_num && belongData.module_unit_price){
              a.product_unit_price += belongData.module_num * belongData.module_unit_price;
            }
          }
          a.product_unit_price = Math.round(a.product_unit_price / a.product_num);
        }

        if (!productTotalCost[a.cost_calc_code]){
          productTotalCost[a.cost_calc_code] = Math.round(a.product_num && a.product_unit_price ? a.product_num * a.product_unit_price : a.module_num && a.module_unit_price ? a.module_num * a.module_unit_price : a.material_num && a.material_unit_price ? a.material_num * a.material_unit_price : 0);
        }else {
          productTotalCost[a.cost_calc_code] += Math.round(a.product_num && a.product_unit_price ? a.product_num * a.product_unit_price : a.module_num && a.module_unit_price ? a.module_num * a.module_unit_price : a.material_num && a.material_unit_price ? a.material_num * a.material_unit_price : 0);
        }
      });
      searchResult.construction_materials_data.forEach(a=>{
        if (!productTotalCost[a.cost_calc_code]){
          productTotalCost[a.cost_calc_code] = Math.round(a.construction_materials_num * a.construction_materials_unit_price);
        }else {
          productTotalCost[a.cost_calc_code] += Math.round(a.construction_materials_num * a.construction_materials_unit_price);
        }
      });
      // searchResult.technical_fee_data.forEach(a=>{
      //   if (!productTotalCost[a.cost_calc_code]){
      //     productTotalCost[a.cost_calc_code] = Math.round(a.technical_fee_num * a.technical_fee_unit_price);
      //   }else {
      //     productTotalCost[a.cost_calc_code] += Math.round(a.technical_fee_num * a.technical_fee_unit_price);
      //   }
      // });
      const directLaborCost = {};
      searchResult.labor_cost_calc_detail.forEach(a=>{
        if (!directLaborCost[a.cost_calc_code]){
          directLaborCost[a.cost_calc_code] = Math.round(a.unit_price * a.quantity * a.man_per_hour);
        }else {
          directLaborCost[a.cost_calc_code] += Math.round(a.unit_price * a.quantity * a.man_per_hour);
        }
      });

      const productCostArr = searchResult.product_cost.map((info)=> {
        const productTotalCostInfo = productTotalCost[info.cost_calc_code] ? productTotalCost[info.cost_calc_code] : 0;
        const directLaborCostInfo = directLaborCost[info.cost_calc_code];

        let indirectLaborUnitPrice = Math.round(directLaborCostInfo * info.indirect_labor_ratio);
        const indirectLaborCost = Math.round(indirectLaborUnitPrice * info.indirect_labor_num);
        const totalLaborCost = directLaborCostInfo + indirectLaborCost;
        let employmentInsuranceUnitPrice = Math.round(totalLaborCost * info.employment_insurance_ratio);
        const employmentInsuranceCost = Math.round(employmentInsuranceUnitPrice * info.employment_insurance_num);
        let toolRentFeeUnitPrice = Math.round(directLaborCostInfo * info.tool_rent_fee_ratio);
        const toolRentFeeCost = Math.round(toolRentFeeUnitPrice * info.tool_rent_fee_num);
        let transportationFeeUnitPrice = Math.round(totalLaborCost * info.transportation_fee_ratio);
        const transportationFeeCost = Math.round(transportationFeeUnitPrice * info.transportation_fee_num);
        let industrialAccidentUnitPrice = Math.round(totalLaborCost * info.industrial_accident_ratio);
        const industrialAccidentCost = Math.round(industrialAccidentUnitPrice * info.industrial_accident_num);
        let taxesDuesUnitPrice = Math.round(totalLaborCost * info.taxes_dues_ratio);
        const taxesDuesCost = Math.round(taxesDuesUnitPrice * info.taxes_dues_num);
        let welfareBenefitsUnitPrice = Math.round(totalLaborCost * info.welfare_benefits_ratio);
        const welfareBenefitsCost = Math.round(welfareBenefitsUnitPrice * info.welfare_benefits_num);
        let retirementUnitPrice = Math.round(directLaborCostInfo * info.retirement_ratio);
        const retirementCost = Math.round(retirementUnitPrice * info.retirement_num);
        let expendablesUnitPrice = Math.round(totalLaborCost * info.expendables_ratio);
        const expendablesCost = Math.round(expendablesUnitPrice * info.expendables_num);
        let industrialSafetyUnitPrice = Math.round(directLaborCostInfo * info.industrial_safety_ratio);
        const industrialSafetyCost = Math.round(industrialSafetyUnitPrice * info.industrial_safety_num);
        const totalExpenseFeeCost = employmentInsuranceCost + toolRentFeeCost + transportationFeeCost + industrialAccidentCost + taxesDuesCost + welfareBenefitsCost + retirementCost + expendablesCost + industrialSafetyCost;
        let normalMaintenanceFeeUnitPrice = Math.round((productTotalCostInfo + totalLaborCost + totalExpenseFeeCost) * info.normal_maintenance_fee_ratio);
        const normalMaintenanceFeeCost = Math.round(normalMaintenanceFeeUnitPrice * info.normal_maintenance_fee_num);
        let profiteUnitPrice = Math.round((totalLaborCost + totalExpenseFeeCost + normalMaintenanceFeeCost) * info.profite_ratio);
        const profiteCost = Math.round(profiteUnitPrice * info.profite_num);

        const allTotalCost = productTotalCostInfo + totalLaborCost + totalExpenseFeeCost + normalMaintenanceFeeCost + profiteCost;
        info.cost_total_amount = mux.Number.withComma(allTotalCost);
        if (isFirst){
          info.product_name += '('+info.product_spec+')';
        }
        if (info.created_time){
          info.full_created_time = info.created_time + "";
          info.created_time = mux.Date.format(info.created_time, 'yyyy-MM-dd');
        }

        searchResult.confirmation.forEach(confirmation => {
          if (confirmation.cost_calc_code === info.cost_calc_code){
            Object.keys(confirmation).forEach(key=> {
              if (key === 'created_time'){
                confirmation[key] = mux.Date.format(confirmation[key], 'yyyy-MM-dd');
              }
              info[key] = confirmation[key];
            });
          }
        });

        if (searchResult.design_confirmation){
          searchResult.design_confirmation.forEach(confirmation => {
            if (confirmation.cost_calc_code === info.cost_calc_code){
              Object.keys(confirmation).forEach(key=> {
                if (key === 'created_time'){
                  confirmation[key] = mux.Date.format(confirmation[key], 'yyyy-MM-dd');
                }
                info[key] = confirmation[key];
              });
            }
          });
        }

        return info;
      });


      this.search_estimate_data = productCostArr.filter(x=>searchResult.last_confirmation.find(xx=>xx.cost_calc_code === x.cost_calc_code));
      this.searched_datas = searchResult;
    },
    async clickEstimateData(item){
      mux.Util.showLoading();
      this.tab_progress = 0;
      await this.setObtainData(item);
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

      if(this.search_purchase_data.length !== 0 && order_count === this.search_purchase_data.length)
        this.progress_tab_items.find(x=> x.tab_name === '구매/발주').tab_color = 'success';
      if(this.search_production_data.status === '생산 완료')
        this.progress_tab_items.find(x=> x.tab_name === '생산').tab_color = 'success';

      this.progress_tab_items.find(x=> x.tab_name === '수주서').tab_color = 'success';
      this.progress_tab_items.find(x=> x.tab_name === '수주 확인서').tab_color = 'success';
      mux.Util.hideLoading();
      this.show_detail = true;
    },

    async setObtainData(item){
      this.clickedProductCost = {};
      this.clickedProductCost = item;

      this.versions = ['수주 원본'];
      this.version = '수주 원본';

      this.relatedClickedProductCost = [this.clickedProductCost];
      this.searched_datas.design_confirmation.forEach(confirmation => {
        if (confirmation.obtain_cost_calc_code === item.cost_calc_code){
          this.relatedClickedProductCost.push(this.getCalcProcessedData(this.searched_datas, confirmation.cost_calc_code));
          this.versions.push(`${this.versions.length}차 수주 설계`);
        }
      });

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

    getCalcProcessedData(searchResult, costCalcCode){
      const productTotalCost = {};
      searchResult.product_cost_calc_detail.forEach(a=>{
        if (!productTotalCost[a.cost_calc_code]){
          productTotalCost[a.cost_calc_code] = Math.round(a.product_num && a.product_unit_price ? a.product_num * a.product_unit_price : a.module_num && a.module_unit_price ? a.module_num * a.module_unit_price : a.material_num && a.material_unit_price ? a.material_num * a.material_unit_price : 0);
        }else {
          productTotalCost[a.cost_calc_code] += Math.round(a.product_num && a.product_unit_price ? a.product_num * a.product_unit_price : a.module_num && a.module_unit_price ? a.module_num * a.module_unit_price : a.material_num && a.material_unit_price ? a.material_num * a.material_unit_price : 0);
        }
      });
      searchResult.construction_materials_data.forEach(a=>{
        if (!productTotalCost[a.cost_calc_code]){
          productTotalCost[a.cost_calc_code] = Math.round(a.construction_materials_num * a.construction_materials_unit_price);
        }else {
          productTotalCost[a.cost_calc_code] += Math.round(a.construction_materials_num * a.construction_materials_unit_price);
        }
      });
      // searchResult.technical_fee_data.forEach(a=>{
      //   if (!productTotalCost[a.cost_calc_code]){
      //     productTotalCost[a.cost_calc_code] = Math.round(a.technical_fee_num * a.technical_fee_unit_price);
      //   }else {
      //     productTotalCost[a.cost_calc_code] += Math.round(a.technical_fee_num * a.technical_fee_unit_price);
      //   }
      // });
      const directLaborCost = {};
      searchResult.labor_cost_calc_detail.forEach(a=>{
        if (!directLaborCost[a.cost_calc_code]){
          directLaborCost[a.cost_calc_code] = Math.round(a.unit_price * a.quantity * a.man_per_hour);
        }else {
          directLaborCost[a.cost_calc_code] += Math.round(a.unit_price * a.quantity * a.man_per_hour);
        }
      });

      let info = searchResult.product_cost.find(x=>x.cost_calc_code === costCalcCode);
      const productTotalCostInfo = productTotalCost[info.cost_calc_code] ? productTotalCost[info.cost_calc_code] : 0;
      const directLaborCostInfo = directLaborCost[info.cost_calc_code];

      let indirectLaborUnitPrice = Math.round(directLaborCostInfo * info.indirect_labor_ratio);
      const indirectLaborCost = Math.round(indirectLaborUnitPrice * info.indirect_labor_num);
      const totalLaborCost = directLaborCostInfo + indirectLaborCost;
      let employmentInsuranceUnitPrice = Math.round(totalLaborCost * info.employment_insurance_ratio);
      const employmentInsuranceCost = Math.round(employmentInsuranceUnitPrice * info.employment_insurance_num);
      let toolRentFeeUnitPrice = Math.round(directLaborCostInfo * info.tool_rent_fee_ratio);
      const toolRentFeeCost = Math.round(toolRentFeeUnitPrice * info.tool_rent_fee_num);
      let transportationFeeUnitPrice = Math.round(totalLaborCost * info.transportation_fee_ratio);
      const transportationFeeCost = Math.round(transportationFeeUnitPrice * info.transportation_fee_num);
      let industrialAccidentUnitPrice = Math.round(totalLaborCost * info.industrial_accident_ratio);
      const industrialAccidentCost = Math.round(industrialAccidentUnitPrice * info.industrial_accident_num);
      let taxesDuesUnitPrice = Math.round(totalLaborCost * info.taxes_dues_ratio);
      const taxesDuesCost = Math.round(taxesDuesUnitPrice * info.taxes_dues_num);
      let welfareBenefitsUnitPrice = Math.round(totalLaborCost * info.welfare_benefits_ratio);
      const welfareBenefitsCost = Math.round(welfareBenefitsUnitPrice * info.welfare_benefits_num);
      let retirementUnitPrice = Math.round(directLaborCostInfo * info.retirement_ratio);
      const retirementCost = Math.round(retirementUnitPrice * info.retirement_num);
      let expendablesUnitPrice = Math.round(totalLaborCost * info.expendables_ratio);
      const expendablesCost = Math.round(expendablesUnitPrice * info.expendables_num);
      let industrialSafetyUnitPrice = Math.round(directLaborCostInfo * info.industrial_safety_ratio);
      const industrialSafetyCost = Math.round(industrialSafetyUnitPrice * info.industrial_safety_num);
      const totalExpenseFeeCost = employmentInsuranceCost + toolRentFeeCost + transportationFeeCost + industrialAccidentCost + taxesDuesCost + welfareBenefitsCost + retirementCost + expendablesCost + industrialSafetyCost;
      let normalMaintenanceFeeUnitPrice = Math.round((productTotalCostInfo + totalLaborCost + totalExpenseFeeCost) * info.normal_maintenance_fee_ratio);
      const normalMaintenanceFeeCost = Math.round(normalMaintenanceFeeUnitPrice * info.normal_maintenance_fee_num);
      let profiteUnitPrice = Math.round((totalLaborCost + totalExpenseFeeCost + normalMaintenanceFeeCost) * info.profite_ratio);
      const profiteCost = Math.round(profiteUnitPrice * info.profite_num);

      const allTotalCost = productTotalCostInfo + totalLaborCost + totalExpenseFeeCost + normalMaintenanceFeeCost + profiteCost;
      info.cost_total_amount = mux.Number.withComma(allTotalCost);

      if (info.created_time){
        info.full_created_time = info.created_time + "";
        info.created_time = mux.Date.format(info.created_time, 'yyyy-MM-dd');
      }

      searchResult.confirmation.forEach(confirmation => {
        if (confirmation.cost_calc_code === info.cost_calc_code){
          Object.keys(confirmation).forEach(key=> {
            if (key === 'created_time'){
              confirmation[key] = mux.Date.format(confirmation[key], 'yyyy-MM-dd');
            }
            info[key] = confirmation[key];
          });
        }
      });

      if (searchResult.design_confirmation){
        searchResult.design_confirmation.forEach(confirmation => {
          if (confirmation.cost_calc_code === info.cost_calc_code){
            Object.keys(confirmation).forEach(key=> {
              if (key === 'created_time'){
                confirmation[key] = mux.Date.format(confirmation[key], 'yyyy-MM-dd');
              }
              info[key] = confirmation[key];
            });
          }
        });
      }

      return info;

    },
  },
  data(){
    return{
      mux: mux,
      show_detail: false,
      tab_progress: null,
      versions:['수주 원본'], // '1차 수주 설계', '2차 수주 설계' ...
      version: '수주 원본',
      save_costs: ObtainProgressPageConfig.save_costs,
      search_estimate_headers: ObtainProgressPageConfig.search_estimate_headers,
      purchase_detail_headers: ObtainProgressPageConfig.purchase_detail_headers,
      bom_list_headers: ObtainProgressPageConfig.bom_list_headers,
      survey_cost_headers: ObtainProgressPageConfig.survey_cost_headers,
      dialog_search_product_headers: ObtainProgressPageConfig.dialog_search_product_headers,
      calc_cost_detail_data: JSON.parse(JSON.stringify(ObtainProgressPageConfig.calc_cost_detail_data)),

      progress_tab_items: ObtainProgressPageConfig.progress_tab_items,
      searchCardInputs: ObtainProgressPageConfig.searchCardInputs,
      clickedProductCost: {},
      searched_datas: {},
      bom_list_data: [],
      relatedClickedProductCost: [],
      search_estimate_data: [],
      search_purchase_data: [],
      search_production_data: [],
      merged_labor_cost_data: [],
      estimate_detail_data: [],
      show_childs_parent_index_arr: [0],
      show_grand_childs_parent_index_arr: [0, 1],
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
