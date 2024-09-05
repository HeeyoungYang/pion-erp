<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :salesMenu="true" :estimateMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row justify="center">
        <v-col
          cols="12"
          sm="11"
        >
          <CardComponent
            elevation="1"
            text-class=" pt-3"
            title-class="d-none"
          >
            <InputsFormComponent
              slot="cardText"
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
                lg="2"
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
          </CardComponent>
          <CardComponent
            elevation="1"
            card-class="mt-5"
            text-class="pt-3"
            title-class="d-none"
          >
            <div slot="cardText">
              <v-menu
                offset-y
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="default"
                    small
                    class="mb-4"
                    v-bind="attrs"
                    v-on="on"
                  >
                    기타 견적서 등록
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-content style="width: 250px;">
                      <v-autocomplete
                        v-model="estimate_checker"
                        :items="members"
                        label="확인"
                        filled
                        dense
                        clearable
                        hide-details
                        class="mb-4"
                      ></v-autocomplete>
                      <v-autocomplete
                        v-model="estimate_approver"
                        :items="members"
                        label="승인"
                        filled
                        dense
                        clearable
                        hide-details
                        class="mb-4"
                      ></v-autocomplete>
                      <v-radio-group
                        v-model="bid_write"
                        dense
                        hide-details
                        row
                        class="mt-0"
                      >
                        <v-radio
                          label="자동"
                          :value=true
                        ></v-radio>
                        <v-radio
                          label="직접입력"
                          :value=false
                        ></v-radio>
                      </v-radio-group>
                      <v-form
                        ref="etcForm"
                      >
                        <InputsFormComponent
                          dense
                          clearable
                          filled
                          hide-details
                          :inputs="etcRequestInputs"
                        />
                      </v-form>
                      <v-btn
                        small
                        color="primary"
                        class="mt-4"
                        @click="etcApprovalRequest"
                      >요청</v-btn>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>

              <EstimateDataTableComponent
                :headers="estimate_approve_headers"
                :items="estimate_approve_data"
                item-key="product_code"
                :approval="true"
                dense
                :loginId="login_info.id"
                @clickTr="clickApproveData"
                @setApprovalPhase="setApprovalPhase"
              />
            </div>
          </CardComponent>
        </v-col>
      </v-row>
    </v-main>

    <!-- 행 클릭 시 노출되는 모달 -->
    <ModalDialogComponent
      :dialog-value="estimate_product_list_dialog"
      max-width="51%"
      title-class=" "
      :dialog-transition="'slide-x-transition'"
      :dialog-custom="'custom-dialog elevation-0 white'"
      :card-elevation="'0'"
      @close="closeProductList"
    >
      <div v-if="etc_estimate">
        <v-row class="mt-3">
          <v-col cols="12" sm="12" class="py-0">
            <v-btn
              color="primary"
              elevation="0"
              fab
              x-small
              @click="openEstiamteMailForm"
              class="dont_print"
              data-html2canvas-ignore="true"
            >
              <v-icon >mdi-email</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" sm="12">
            <v-img
              v-if="clickedProductCost.approval_file"
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(clickedProductCost.approval_thumbnail)"
              transition="scale-transition"
              @click="download('estimate/approval', clickedProductCost.approval_file, clickedProductCost.cost_calc_code+'_')"
              style="cursor: pointer;"
            />
          </v-col>
          <v-col cols="12" sm="12">
            <p class="font-weight-bold primary--text mb-0">▼ 기타 첨부</p>
            <div v-if="clickedProductCost.etc_files">
              <v-chip
                v-for="(file, i) in clickedProductCost.etc_files.split('/')"
                :key="i"
                color="grey lighten-2"
                class="ma-2"
                @click="download('estimate/etc', file, clickedProductCost.cost_calc_code+'_')"
              >
                {{ file }}
              </v-chip>
            </div>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <v-tabs
          v-model="tab_search"
          background-color="transparent"
          class="tab_search"
        >
          <v-tab
            v-for="sub_item in search_tab_items"
            :key="sub_item"
          >
            {{ sub_item }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab_search" class="pb-1">
          <!-- 원가 계산서 -->
          <v-tab-item>
            <v-card ref="calcCostCard" style="border: 1px solid #ccc; overflow-x: auto" elevation="0">
              <v-row style="max-width: 868.5px;" class="dont_print" data-html2canvas-ignore="true">
                <v-col align-self="center" cols="12" sm="12" class="dont_print" data-html2canvas-ignore="true">
                  <v-checkbox
                    v-model="estimate_checkbox.product"
                    label="재료비 세부"
                    color="primary"
                    hide-details
                    class="float-left mr-3 dont_print"
                    data-html2canvas-ignore="true"
                    @click="estimateCheckbox('product', '재료비')"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="estimate_checkbox.labor_cost"
                    label="노무비"
                    color="primary"
                    hide-details
                    class="float-left mr-3 dont_print"
                    data-html2canvas-ignore="true"
                    @click="estimateCheckbox('labor_cost', '노무비')"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="estimate_checkbox.expense"
                    label="경비"
                    color="primary"
                    hide-details
                    class="float-left mr-3 dont_print"
                    data-html2canvas-ignore="true"
                    @click="estimateCheckbox('expense', '경비')"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="estimate_checkbox.general_management"
                    label="일반관리비"
                    color="primary"
                    hide-details
                    class="float-left mr-3 dont_print"
                    data-html2canvas-ignore="true"
                    @click="estimateCheckbox('general_management', '일반관리비')"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="estimate_checkbox.profit"
                    label="이윤"
                    color="primary"
                    hide-details
                    class="float-left dont_print"
                    data-html2canvas-ignore="true"
                    @click="estimateCheckbox('profit', '이윤')"
                  ></v-checkbox>
                  <v-btn
                    color="primary"
                    elevation="0"
                    fab
                    x-small
                    @click="openEstiamteMailForm"
                    class="mb-3 ml-3 float-right dont_print"
                    data-html2canvas-ignore="true"
                  >
                    <v-icon >mdi-email</v-icon>
                  </v-btn>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="success"
                        fab
                        x-small
                        class="float-right dont_print"
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
                                : item.click === 'pdf' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data', '견적서') : ''"
                      >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                </v-col>
              </v-row>
              <v-card-title style="max-width: 868.5px;">
                <v-row
                  class="px-3"
                  style="background: #efefef;"
                >
                  <v-col align-self="center" cols="12" sm="10">
                    <p style="font-weight: bold; font-size: 30px;" class="mb-0">견적서
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
                        <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">용역명</td>
                        <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.service_name ? clickedProductCost.service_name : '' }}</td>
                      </tr>
                      <tr>
                        <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">용역기간</td>
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
                  :items="estimate_detail_data"
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
            <v-row class="mt-3">
              <v-col cols="12" sm="4">
                <p class="font-weight-bold primary--text mb-0">▼ 승인서</p>
                <!-- <div style="width:100%; background-color: #ccc; min-height:300px"></div> -->
                <v-img
                  v-if="clickedProductCost.approval_file"
                  alt="thumbnail"
                  class="shrink mr-2"
                  contain
                  :src="mux.Util.imageBinary(clickedProductCost.approval_thumbnail)"
                  transition="scale-transition"
                  width="350"
                  @click="download('estimate/approval', clickedProductCost.approval_file.replace(clickedProductCost.approval_file.split('_')[0]+'_'+clickedProductCost.approval_file.split('_')[1]+'_', ''), clickedProductCost.approval_file.split('_')[0]+'_'+clickedProductCost.approval_file.split('_')[1]+'_')"
                  style="cursor: pointer;"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <p class="font-weight-bold primary--text mb-0">▼ 도면</p>
                <!-- <div style="width:100%; background-color: #ccc; min-height:300px"></div> -->
                <v-img
                  v-if="clickedProductCost.blueprint_file"
                  alt="thumbnail"
                  class="shrink mr-2"
                  contain
                  :src="mux.Util.imageBinary(clickedProductCost.blueprint_thumbnail)"
                  transition="scale-transition"
                  width="350"
                  @click="download('estimate/blueprint', clickedProductCost.blueprint_file.replace(clickedProductCost.blueprint_file.split('_')[0]+'_'+clickedProductCost.blueprint_file.split('_')[1]+'_', ''), clickedProductCost.blueprint_file.split('_')[0]+'_'+clickedProductCost.blueprint_file.split('_')[1]+'_')"
                  style="cursor: pointer;"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <p class="font-weight-bold primary--text mb-0">▼ 기타 첨부</p>
                <div v-if="clickedProductCost.etc_files">
                  <v-chip
                    v-for="(file, i) in clickedProductCost.etc_files.split('/')"
                    :key="i"
                    color="grey lighten-2"
                    class="ma-2"
                    @click="download('estimate/etc', file.replace(file.split('_')[0]+'_'+file.split('_')[1]+'_', ''), file.split('_')[0]+'_'+file.split('_')[1]+'_')"
                  >
                    {{ file.replace(file.split('_')[0]+'_'+file.split('_')[1]+'_', '') }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </v-tab-item>
          <!-- 산출내역서 -->
          <v-tab-item>
            <v-card ref="calcDetailCard" style="border: 1px solid #ccc;" elevation="0">
              <v-card-title>
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
                              : item.click === 'excel' ? mux.Excel.downloadTable(survey_cost_headers, calc_cost_detail_data, '산출내역서')
                              : item.click === 'pdf' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcDetailCard, 'edit_survey_cost_data', '산출내역서') : ''"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-title>
              <v-card-text>
                <v-form ref="surveyCostForm">
                  <CostTableComponent
                    :headers="survey_cost_headers"
                    :items="calc_cost_detail_data"
                    item-key="product_code"
                    trStyle="background-color:#efefef; "
                    trClass="font-weight-black estimate_title"
                    :cost-num-edit-disabled="true"
                    class="cost_table_border print_cost_table"
                  >
                  </CostTableComponent>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <!-- 노무비 산출 -->
          <v-tab-item>
            <v-card ref="calcLaborCard" style="border: 1px solid #ccc;" elevation="0">
              <v-card-title>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="success"
                      fab
                      x-small
                      class="float-right dont_print"
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
                      @click="item.click === 'print' ? printLaborCost()
                              : item.click === 'excel' ? mux.Excel.downloadTable(labor_cost_headers, labor_cost_data, '노무비 산출')
                              : item.click === 'pdf' ? printLaborCost('노무비 산출') : ''"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  dense
                  :headers="labor_cost_headers"
                  :items="labor_cost_data"
                  hide-default-footer
                  disable-pagination
                  class="elevation-1 labor_cost_list"
                  disable-sort
                >
                  <template v-slot:item="{ item, index }">
                    <tr>
                      <td align="center">{{ item.no }}</td>
                      <td align="center">{{ item.name }}</td>
                      <td align="center">{{ item.type }}</td>
                      <td align="center">{{ item.occupation }}</td>
                      <td align="center">{{ item.man_per_day }}</td>
                      <td align="center">{{ Math.round(item.surcharge_ratio * 100 * 10000000) / 10000000 }}%</td>
                      <td align="center">{{ item.adjustment_ratio }}</td>
                      <td align="center">{{ item.man_per_hour }}</td>
                      <td align="center">{{ mux.Number.withComma(item.unit_price) }}</td>
                      <td align="center">{{ mux.Number.withComma(item.quantity) }}</td>
                      <td align="center">{{  item.total_amount ? mux.Number.withComma(item.total_amount) : mux.Number.withComma((item.man_per_hour * item.quantity * item.unit_price).toFixed(0)) }}</td>
                      <td align="center" :class="calcRowSpan(item.name, index) == 0? 'd-none' : '' " :rowspan="calcRowSpan(item.name, index)">{{  item.no_total_amount ? mux.Number.withComma(item.no_total_amount) : mux.Number.withComma(calcNoTotalAmount(item.name)) }}</td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </ModalDialogComponent>

    <v-dialog
      v-model="mailDialog"
      persistent
      max-width="1000px"
    >
      <v-form ref="mailForm">
        <MailFormComponent
          ref="mailFormComponent"
          v-model="mailData"
          addCardClass="d-none"
          :addSystemFiles="etc_estimate ? 'estimate_etc' : 'estimate'"
          :loginInfo="this.login_info"
        >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="mailDialog = false"
            >
              취소
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="sendEstimateMail()"
            >
              발송
            </v-btn>
          </v-card-actions>
        </MailFormComponent>
      </v-form>
    </v-dialog>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import EstimateDataTableComponent from "@/components/EstimateDataTableComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import CostTableComponent from "@/components/CostTableComponent.vue";
import MailFormComponent from "@/components/MailFormComponent.vue";
import EstimateSearchPageConfig from "@/configure/EstimateSearchPageConfig.json";

import mux from "@/mux";

export default {

  mounted() {

  },
  components: {
                NavComponent,
                EstimateDataTableComponent,
                ModalDialogComponent,
                CardComponent,
                InputsFormComponent,
                CostTableComponent,
                MailFormComponent,
              },
  data(){
    return{
      mux: mux,
      searched_datas: {},
      dates: [],
      estimate_product_list_dialog: false,
      clickedProductCost: {},
      bid_write: true,
      mailDialog: false,
      tab_search: null,
      receivingInspectionThumbnail: '',
      inspectionReportThumbnail: '',
      email_sign:'',
      estimate_checker:'',
      estimate_approver:'',
      estimate_checkbox:{
        product:true,
        labor_cost:true,
        expense:true,
        general_management:true,
        profit:true
      },

      etc_estimate: false,
      show_childs_parent_index_arr: [0],
      show_grand_childs_parent_index_arr: [0, 1],
      estimate_info_data:{},
      estimate_product_list_data:[],

      change_approve:{},

      searched_products:[],

      etcRequestInputs: EstimateSearchPageConfig.etcRequestInputs,
      save_estimates: EstimateSearchPageConfig.save_estimates,
      defaultMailData: EstimateSearchPageConfig.default_mail_data,
      login_info: EstimateSearchPageConfig.login_info,
      searchCardInputs:EstimateSearchPageConfig.searchCardInputs,
      estimate_approve_headers:EstimateSearchPageConfig.estimate_approve_headers,
      estimate_product_list_headers:EstimateSearchPageConfig.estimate_product_list_headers,
      // inbound_approve_data:[],
      survey_cost_headers: EstimateSearchPageConfig.survey_cost_headers,
      search_tab_items: EstimateSearchPageConfig.search_tab_items,
      labor_cost_headers: EstimateSearchPageConfig.labor_cost_headers,
      labor_cost_data: [],
      merged_labor_cost_data: [],
      calc_cost_detail_data: JSON.parse(JSON.stringify(EstimateSearchPageConfig.calc_cost_detail_data)),
      estimate_detail_data: [],
      estimate_approve_data:[],
      members: [],

      print_labor_table: false,
    }
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
      this.mailData = JSON.parse(JSON.stringify(this.defaultMailData));
    },

    bid_write(val){
      this.etcRequestInputs.find(x=>x.label === '사내 견적번호').disabled = val;
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
  },
  created () {
    this.initialize()
    const inhouse_bid_number = this.$route.query.inhouse_bid_number;
    const company_bid_number = this.$route.query.company_bid_number;
    const company_name = this.$route.query.company_name;
    const issue_date = this.$route.query.issue_date;
    // const created_time = this.$route.query.created_time;
    if (inhouse_bid_number && company_bid_number && company_name && issue_date){
      this.setSearchCardInputs(inhouse_bid_number, company_bid_number, company_name, issue_date);
      this.searchButton();
    }
  },
  methods:{
    async initialize () {
      const prevURL = window.location.href;
      try {
        this.login_info.name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.login_info.email = this.$cookies.get(this.$configJson.cookies.email.key);
        this.login_info.id = this.$cookies.get(this.$configJson.cookies.id.key);
        this.login_info.position = this.$cookies.get(this.$configJson.cookies.position.key);
        this.login_info.department = this.$cookies.get(this.$configJson.cookies.department.key);
        this.login_info.office_phone_number = this.$cookies.get(this.$configJson.cookies.office_phone_number.key);
        this.login_info.phone_number = this.$cookies.get(this.$configJson.cookies.phone_number.key);
        console.log(this.login_info)

        const result = await mux.Server.get({path:'/api/admin/users/'});
        if (prevURL !== window.location.href) return;
        if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          result.data.Users.map(data => {
            let id = data.Username;
            let name = data.Attributes.find(x=>x.Name === 'given_name').Value;
            let department = data.Attributes.find(x=>x.Name === 'custom:department').Value
            this.members.push(department + '-' + name + '-' + id);
          });

        }else {
          mux.Util.showAlert(result.message);
          return;
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }
      this.searchCardInputs = JSON.parse(JSON.stringify(this.searchCardInputs));
      this.email_sign =`<div><p style="color:#255fab; border-bottom:1px solid #255fab; border-top:1px solid #255fab;padding:15px 0px;"><strong>${this.login_info.name} 파이온 일렉트릭㈜ ${this.login_info.department} ${this.login_info.position} / Pion Electric Co., Ltd. </strong></p><p style="border-bottom:1px solid #333333;padding-bottom:20px; font-size:14px;">Home page : www.pionelectric.com<br>E-mail: ${this.login_info.email}  C/P: ${'+82(0)' + this.login_info.phone_number.slice(1)}<br> Tel: ${'+82(0)' + this.login_info.office_phone_number.slice(1)} Fax: +82(0)505-300-4179<br><br> 본사: (03722) 서울특별시 서대문구 연세로 50 연세대학교 공학원 116호<br> Head office: #116, Engineering Research Park, Yonsei University, 50, Yonsei-ro, Seodaemun-gu, Seoul, 03722, Republic of KOREA<br><br> 광명 사무소: (14348) 경기도 광명시 일직로 72  A-1818호<br> Gwangmyeong office: #A-1818, 72, Iljik-ro, Gwangmyeong-si, Gyeonggi-do, Republic of KOREA 14348<br><br> 광주 공장: (47580) 광주광역시 광산구 연산동 1247<br> Gwangju factory: 1247 Yeonsan-dong, Gwangsan-gu, Gwangju, Republic of KOREA 47580<br><br> 보령 공장: (33448) 충청남도 보령시 주교면 관창공단길 266<br> Boryeong factory: 266, Gwanchanggongdan-gil, Jugyo-myeon, Boryeong-si, Chungcheongnam-do, Republic of KOREA 33448<br><br></p> <p style="border-bottom:1px solid #333333;padding-bottom:20px; font-size:14px;"><strong>제품 및 서비스</strong><br> ∙ 고자기장 기반의 산업용 운용기기 (Development of Operating Device for Industrial Applications based on High Magnetic Field)<br> ∙ 광기기 기반의 전력전자 응용기기 (Development of Power Electronics Application Device based on Optical Device)<br> ∙ 신재생 에너지 개발 및 운영 (Development and Operation of Renewable Energy System)<br> ∙ 전력계통 진단 및 해석 (Power System Diagnosis and Analysis)<br> ∙ 전기공사면허</p> </div>`


      this.etcRequestInputs = JSON.parse(JSON.stringify(this.etcRequestInputs));
      mux.Rules.rulesSet(this.etcRequestInputs);
    },
    // eslint-disable-next-line no-unused-vars

    //기타 타입 등록
    async etcApprovalRequest(){
      const validate = this.$refs.etcForm.validate();
      if(validate){
        const currDate = new Date();
        let basic_code =  'PEPQ_' + mux.Date.format(currDate, 'yyMMdd')
        if(this.estimate_checker === '' || this.estimate_approver === ''){
          mux.Util.showAlert('승인 정보를 모두 입력해주세요.');
          return;
        }
        mux.Util.showLoading();
        const new_cost_calc_code = mux.Date.format(currDate, 'yyyy-MM-dd HH-mm-ss-fff') + '_' + this.$cookies.get(this.$configJson.cookies.id.key);
        let confirmation_data = {};
        // inhouse_bid_number(사내 견적번호)
        if(!this.bid_write){
          if(this.etcRequestInputs.find(x=>x.column_name === 'inhouse_bid_number').value === ''){
            mux.Util.showAlert('사내 견적번호를 입력해주세요.');
            return;
          }else{
            confirmation_data.inhouse_bid_number = this.etcRequestInputs.find(x=>x.column_name === 'inhouse_bid_number').value;
          }
        }else{
          let currentCode = '';
          const prevURL = window.location.href;
          let reqURL = '/api/estimate/?inhouse_bid_number='+basic_code;
          try {
            let result = await mux.Server.get({path: reqURL});
            if (prevURL !== window.location.href) return;

            if (typeof result === 'string'){
              result = JSON.parse(result);
            }
            if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
              const searchResult = result.data;
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

              searchResult.confirmation.reverse(); // 최신순으로 정렬

              if(searchResult.confirmation.length === 0){
                currentCode = '';
              }else{
                currentCode = searchResult.confirmation[0].inhouse_bid_number;
              }

            }else{
              mux.Util.showAlert(result);
            }

          } catch (error) {
            if (prevURL !== window.location.href) return;
            mux.Util.hideLoading();
            mux.Util.showAlert(error);
          }
          if(currentCode === ''){
            confirmation_data.inhouse_bid_number = basic_code + '_001';
          }else{
            let calc_current_code = Number(currentCode.split('_')[2]) + 1;
            calc_current_code = ('00' + calc_current_code).slice(-3);
            confirmation_data.inhouse_bid_number = basic_code + '_' + calc_current_code;
          }

        }
        confirmation_data.cost_calc_code = new_cost_calc_code;
        confirmation_data.given_name = this.login_info.name;
        confirmation_data.estimate_type = '기타';
        confirmation_data.checker = this.estimate_checker.split('-')[1];
        confirmation_data.checker_id = this.estimate_checker.split('-')[2]
        confirmation_data.approver = this.estimate_checker.split('-')[1]
        confirmation_data.approver_id = this.estimate_checker.split('-')[2]
        if(confirmation_data.checker_id == this.login_info.id){
          confirmation_data.approval_phase = '미승인';
          confirmation_data.checked_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss')
        }else{
          confirmation_data.approval_phase = '미확인';
        }
        if(!this.bid_write){
          confirmation_data.inhouse_bid_number = this.etcRequestInputs.find(x=>x.column_name === 'inhouse_bid_number').value;
        }
        confirmation_data.issue_date = this.etcRequestInputs.find(x=>x.column_name === 'issue_date').value;
        confirmation_data.company_name = this.etcRequestInputs.find(x=>x.column_name === 'company_name').value;

        let approval_file = this.etcRequestInputs.find(x=>x.column_name === 'approval_file').value;
        confirmation_data.approval_file = approval_file.name;
        const getPdfThumbnail = await mux.Util.getPdfThumbnail(approval_file, 1, false);
        let approval_file_thumbnail = mux.Util.uint8ArrayToHexString(getPdfThumbnail);
        confirmation_data.approval_thumbnail = approval_file_thumbnail;

        let etc_files = this.etcRequestInputs.find(x=>x.column_name === 'etc_files').value;
        if(etc_files !== undefined){
          for(let f=0; f<etc_files.length; f++){
            if(f===0){
              confirmation_data.etc_files = etc_files[f].name;
            }else{
              confirmation_data.etc_files = confirmation_data.etc_files + "/" + etc_files[f].name;
            }

            const file = etc_files[f];
            sendData.files.push({
              folder: 'estimate/etc',
              file: file,
              name: file.name
            });
          }
        }

        let sendData = {
          "estimate_confirmation_table-insert": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "creater"
            },
            "data":confirmation_data,
            "select_where": {"cost_calc_code": new_cost_calc_code},
            "rollback": "yes"
          }]
        };

        let product_data = [];
        product_data.push({
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "creater"
          },
          "data":{
            "cost_calc_code" : new_cost_calc_code,
            "product_num" : 1,
            "product_unit_price" : this.etcRequestInputs.find(x=>x.column_name === 'product_unit_price').value
          },
          "select_where": {"cost_calc_code": new_cost_calc_code},
          "rollback": "yes"
        })

        sendData["estimate_cost_calc_detail_table-insert"] = product_data;

        sendData.path = '/api/multipart_rest_api/';
        sendData.prefix = new_cost_calc_code + '_';
        sendData.files = [];

        sendData.files.push({
          folder: 'estimate/approval',
          file: approval_file,
          name: approval_file.name
        });

        // if(etc_files.length > 0){
        //   for (let i = 0; i < etc_files.length; i++) {
        //     const file = etc_files[i];
        //     sendData.files.push({
        //       folder: 'estimate/etc',
        //       file: file,
        //       name: file.name
        //     });
        //   }
        // }

        console.log(sendData);

        const prevURL = window.location.href;
        try {
          let result = await mux.Server.uploadFile(sendData);
          if (prevURL !== window.location.href) return;

          if (typeof result === 'string'){
            result = JSON.parse(result);
          }

          if (result.code === undefined && result.data !== undefined && result.data.code !== undefined){
            result = result.data;
          }
          if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

              //메일 알림 관련
              let mailTo = [];
              if(confirmation_data.approval_phase === '미확인'){
                mailTo.push(confirmation_data.checker_id);
              }else {
                mailTo.push(confirmation_data.approver_id);
              }

            // 메일 본문 내용
            let content=`
            <html>
              <body>
                <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                  <h2 style="text-align: center; color:#13428a"> 기타 견적서 ${confirmation_data.approval_phase === '미확인' ? '확인' : '승인'} 요청 알림</h2>
                  <table style="width: 100%;border-spacing: 10px 10px;">
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">사내 견적번호</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${confirmation_data.inhouse_bid_number}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">발행일</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${confirmation_data.issue_date}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${confirmation_data.given_name}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">확인자</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${confirmation_data.checker}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">승인자</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${confirmation_data.approver}</td>
                    </tr>
                  </table>
                  <a style="color: white; text-decoration:none"href="${prevURL}?inhouse_bid_number=${confirmation_data.inhouse_bid_number}&company_name=${confirmation_data.company_name}&issue_date=${confirmation_data.issue_date}">
                    <p style="cursor:pointer; background: #13428a;color: white;font-weight: bold;padding: 13px;border-radius: 40px;font-size: 16px;text-align: center;margin-top: 25px; margin-bottom: 40px;">
                      확인하기
                    </p>
                  </a>
                </div>
              </body>
            </html>
            `;

              try {
                let sendEmailAlam = await mux.Server.post({
                  path: '/api/send_email/',
                  to_addrs: mailTo,
                  subject: "견적서 " + (confirmation_data.approval_phase === '미확인' ? '확인' : '승인') + " 요청 알림",
                  content: content
                });
                if (prevURL !== window.location.href) return;
                if(sendEmailAlam['code'] == 0 || (typeof sendEmailAlam['data'] === 'object' && sendEmailAlam['data']['code'] == 0) || (typeof sendEmailAlam['response'] === 'object' && typeof sendEmailAlam['response']['data'] === 'object' && sendEmailAlam['response']['data']['code'] == 0)){
                  mux.Util.showAlert('등록되었습니다.', '등록 완료', 3000);
                  mux.Util.hideLoading();
                } else {
                  if (prevURL !== window.location.href) return;
                  console.log('알림 메일 전송에 실패-sendEmailAlam :>> ', sendEmailAlam);
                  mux.Util.showAlert('등록되었으나 알림 메일 전송에 실패하였습니다.', '등록 완료');
                  mux.Util.hideLoading();
                }
              } catch (error) {
                if (prevURL !== window.location.href) return;
                console.log('알림 메일 전송에 실패-error :>> ', error);
                mux.Util.showAlert('등록되었으나 알림 메일 전송에 실패하였습니다.', '등록 완료');
                mux.Util.hideLoading();
              }
          } else {
            if (prevURL !== window.location.href) return;
            mux.Util.showAlert(result);
          }
        } catch (error) {
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(error);
        }
      }

    },
    setSearchCardInputs(inhouse_bid_number, company_bid_number, company_name, issue_date){
      this.searchCardInputs.find(x=>x.label === '사내 견적번호').value = inhouse_bid_number;
      this.searchCardInputs.find(x=>x.label === '기업별 입찰번호').value = company_bid_number;
      this.searchCardInputs.find(x=>x.label === '업체명').value = company_name;
      if (issue_date.includes(' ~ ')){
        this.searchCardInputs.find(x=>x.label === '발행일').value = issue_date.split(' ~ ');
      } else {
        this.searchCardInputs.find(x=>x.label === '발행일').value = [issue_date, issue_date];
      }
    },
    calcNoTotalAmount(labor){
      let labor_data = this.labor_cost_data
      let sum_no_total_amount = 0;
      labor_data.forEach(data =>{
        if(data.name == labor){
          sum_no_total_amount += Number((data.man_per_hour * data.quantity * data.unit_price).toFixed(0));
        }
      })
      return sum_no_total_amount;
    },
    calcRowSpan(labor, idx){
      let labor_data = this.labor_cost_data
      let rowspan = 0;
      if(idx > 0  && labor_data[idx].name == labor_data[idx-1].name){
        rowspan = 0;
      }else {
        labor_data.forEach(data =>{
          if(data.name == labor){
            rowspan++;
          }
        })
      }
      return rowspan;
    },
    printLaborCost(fileName){
      this.print_labor_table = true;

      setTimeout(async () => {
        if (fileName){
          mux.Util.downloadPDF(this.$refs.calcLaborCard, fileName);
          this.print_labor_table = false;
        }else {
          mux.Util.print(this.$refs.calcLaborCard);
          this.print_labor_table = false;
        }
      }, 500);

    },

    // 파일명 인자 있을 경우 PDF download, 없을 경우 print
    async costDetailPrintOrPDF(itemsThisKeyStr, element, editableVarThisKeyStr, fileName) {
      let items = this[itemsThisKeyStr];
      const originItems = JSON.parse(JSON.stringify(items));
      items = items.map(item => {
        for (let i = Object.keys(item).length - 1; i >= 0; i--) {
          const key = Object.keys(item)[i];
          if (key.includes('editable')){
            delete item[key];
          }
          if (key === 'belong_data'){
            for (let j = 0; j < item.belong_data.length; j++) {
              const innerItem = item.belong_data[j];
              for (let ii = Object.keys(innerItem).length - 1; ii >= 0; ii--) {
                const innerKey = Object.keys(innerItem)[ii];
                if (innerKey.includes('editable')){
                  delete innerItem[innerKey];
                }
                if (innerKey === 'belong_data'){
                  for (let j = 0; j < innerItem.belong_data.length; j++) {
                    const belongInnerItem = innerItem.belong_data[j];
                    for (let ii = Object.keys(belongInnerItem).length - 1; ii >= 0; ii--) {
                      const belongInnerKey = Object.keys(belongInnerItem)[ii];
                      if (belongInnerKey.includes('editable')){
                        delete belongInnerItem[belongInnerKey];
                      }
                      // if (belongInnerKey === 'belong_data'){

                      // }
                    }

                  }
                }
              }

            }
          }
        }
        return item;

      });

      this[editableVarThisKeyStr] = !this[editableVarThisKeyStr];

      // UI 적용을 위한 editable = false 1초 후 작동
      setTimeout(async () => {
        if (fileName){
          await mux.Util.downloadPDF(element, fileName);
        }else {
          await mux.Util.print(element);
        }
        this[editableVarThisKeyStr] = !this[editableVarThisKeyStr];

        this[itemsThisKeyStr] = originItems;
      }, 1000);


    },
    async download(foldername, filename, prefix) {
      mux.Util.showLoading();
      try {
        await mux.Server.downloadFile(foldername, filename, prefix);
      } catch (error) {
        mux.Util.showAlert(error);
      }
      mux.Util.hideLoading();
    },
    async searchButton(){
      mux.Util.showLoading();

      let inputs = [];
      this.searchCardInputs.forEach((input) => {
        if (input.value && String(input.value).trim()) {
          let inputValue = String(input.value).trim();
          if (inputValue === 'All'){
            inputValue = "";
          }
          inputs.push(inputValue);
        }else {
          inputs.push("");
        }
      });
      console.log('inputs :>> ', inputs);

      const prevURL = window.location.href;
      let reqURL = '/api/estimate/';
      // approval_phase = '';
      if (inputs[0]){
        reqURL += '?approval_phase=' + inputs[0];
      }
      if (inputs[1]){
        reqURL += inputs[0] ? '&inhouse_bid_number=' + inputs[1] : '?inhouse_bid_number=' + inputs[1];
      }
      if (inputs[2]){
        reqURL += (inputs[0] || inputs[1]) ? '&company_bid_number=' + inputs[2] : '?company_bid_number=' + inputs[2];
      }
      if (inputs[3]){
        reqURL += (inputs[0] || inputs[1] || inputs[2]) ? '&company_name=' + inputs[3] : '?company_name=' + inputs[3];
      }
      if (inputs[4]){
        reqURL += (inputs[0] || inputs[1] || inputs[2] || inputs[3]) ? '&issue_start_date=' + inputs[4].split(',')[0] : '?issue_start_date=' + inputs[4].split(',')[0];
        reqURL += inputs[4].split(',').length > 1 ? '&issue_end_date=' + inputs[4].split(',')[1] : '&issue_end_date=' + inputs[4].split(',')[0];
      }

      try {
        let result = await mux.Server.get({path: reqURL});
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          const searchResult = result.data;
        // const searchResult = JSON.parse(JSON.stringify(EstimateSearchPageConfig.test_estimate_approve_data));

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

        searchResult.confirmation.reverse(); // 최신순으로 정렬
        this.searchDataCalcProcess(searchResult);

        // 기타 타입 처리
        if (searchResult.confirmation.filter(x=>x.estimate_type === '기타').length > 0){
          this.estimate_approve_data = [...this.estimate_approve_data, ...searchResult.confirmation.filter(x=>x.estimate_type === '기타').map((item) => {
            item.cost_total_amount = 0;
            for (let i = 0; i < searchResult.product_cost_calc_detail.length; i++) {
              const a = searchResult.product_cost_calc_detail[i];
              if (a.cost_calc_code === item.cost_calc_code){
                item.cost_total_amount += Math.round(a.product_num * a.product_unit_price);
                break;
              }
            }
            item.cost_total_amount = mux.Number.withComma(item.cost_total_amount);
            item.created_time = mux.Date.format(item['created_time'], 'yyyy-MM-dd');
            return item;
          })];
        }

        }else{
          mux.Util.showAlert(result);
        }

      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }

      mux.Util.hideLoading();
    },
    searchDataCalcProcess(searchResult, isFirst){
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

        return info;
      });


      this.estimate_approve_data = productCostArr;
      this.searched_datas = searchResult;
    },
    closeProductList(){
      this.estimate_product_list_dialog = false;
      this.clickedProductCost = {};
      this.show_childs_parent_index_arr = [0];
      this.show_grand_childs_parent_index_arr = [0, 1];
      Object.keys(this.estimate_checkbox).forEach(key => {
        this.estimate_checkbox[key] = true;
      });
    },
    async clickApproveData(item){
      if(item.estimate_type === '기타'){
        this.etc_estimate = true;
      }else{
        this.etc_estimate = false;
      }
      this.clickedProductCost = {};
      this.clickedProductCost = item;
      this.estimate_product_list_dialog = true;
    },
    async setApprovalPhase(item, change, reason){
      console.log(item, change, reason);

      let new_approval_phase = '';
      let new_checked_date = null;
      let new_approved_date = null;
      let new_rejecter = '';
      let new_rejected_date = null;
      let new_reject_reason = '';

      if (change === true){
        if (item.approval_phase === '미확인'){
          new_approval_phase = '미승인';
          new_checked_date = mux.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        }else if (item.approval_phase === '미승인'){
          new_approval_phase = '승인';
          new_approved_date = mux.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        }

      }

      if (change === false){
        new_approval_phase = '반려';
        new_rejecter = this.login_info.name;
        new_rejected_date = mux.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        new_reject_reason = reason.trim();
        if(new_reject_reason === ''){
          mux.Util.showAlert('반려 사유 필수 기입');
          return;
        }
      }

      let sendData = {
        "estimate_confirmation_table-update": [{
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "modifier"
          },
          "data":{
            "approval_phase": new_approval_phase,
            "approved_date": new_approved_date,
            "rejecter": new_rejecter,
            "rejected_date": new_rejected_date,
            "reject_reason": new_reject_reason,
          },
          "update_where": {"cost_calc_code": item.cost_calc_code},
          "rollback": "yes"
        }],
      };

      if (new_approval_phase === '미승인'){
        sendData["estimate_confirmation_table-update"][0].data.checked_date = new_checked_date;
      }

      const prevURL = window.location.href;
      try {
        mux.Util.showLoading();

        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: sendData
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

          item.approval_phase = new_approval_phase;
          item.approved_date = new_approved_date ? new_approved_date : '';
          item.rejecter = new_rejecter;
          item.rejected_date = new_rejected_date ? new_rejected_date : '';
          item.reject_reason = new_reject_reason;
          if (new_approval_phase === '미승인'){
            item.checked_date = new_checked_date;
          }

          this.searched_datas.confirmation.forEach(confirmation => {
            if (confirmation.cost_calc_code === item.cost_calc_code){
              confirmation.approval_phase = item.approval_phase;
              confirmation.checked_date = item.checked_date;
              confirmation.approved_date = item.approved_date;
              confirmation.rejecter = item.rejecter;
              confirmation.rejected_date = item.rejected_date;
              confirmation.reject_reason = item.reject_reason;
            }
          });

          //메일 알림 관련
          let mailTo = [];
          let creater = this.$cookies.get(this.$configJson.cookies.id.key);
          let reject_info;
          if(item.approval_phase === '미승인'){
            mailTo.push(creater);
            mailTo.push(item.approver_id);
          }else if(item.approval_phase === '승인'){
            mailTo.push(creater);
            if(creater !== item.checker_id){
              mailTo.push(item.checker_id);
            }
          }else if(item.approval_phase === '반려' && !item.checked_date){
            mailTo.push(creater);
            reject_info=`
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려자</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.rejecter}</td>
              </tr>
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려일</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.rejected_date}</td>
              </tr>
            `
          }else if(item.approval_phase === '반려' && item.checked_date){
            mailTo.push(creater);
            mailTo.push(item.checker_id);
            reject_info=`
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려자</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.rejecter}</td>
              </tr>
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려일</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.rejected_date}</td>
              </tr>
            `
          }

          // 메일 본문 내용
          let content=`
          <html>
            <body>
              <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                <h2 style="text-align: center; color:#13428a">견적서 ${item.approval_phase === '미승인' ? '확인' : item.approval_phase} 처리 알림</h2>
                <table style="width: 100%;border-spacing: 10px 10px;">
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">사내 견적번호</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.inhouse_bid_number}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">발행일</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.issue_date}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.given_name}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">확인자</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.checker}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">승인자</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.approver}</td>
                  </tr>
                  ${reject_info ? reject_info : ''}
                </table>
                <a style="color: white; text-decoration:none"href="${prevURL}?inhouse_bid_number=${item.inhouse_bid_number}&company_bid_number=${item.company_bid_number}&company_name=${item.company_name}&issue_date=${item.issue_date}">
                  <p style="cursor:pointer; background: #13428a;color: white;font-weight: bold;padding: 13px;border-radius: 40px;font-size: 16px;text-align: center;margin-top: 25px; margin-bottom: 40px;">
                    확인하기
                  </p>
                </a>
              </div>
            </body>
          </html>
          `;


          try {
            let sendEmailAlam = await mux.Server.post({
              path: '/api/send_email/',
              to_addrs: mailTo,
              subject: "견적서 " + (item.approval_phase === '미승인' ? '확인' : item.approval_phase) + " 처리 알림",
              content: content
            });
            if (prevURL !== window.location.href) return;
            if(sendEmailAlam['code'] == 0 || (typeof sendEmailAlam['data'] === 'object' && sendEmailAlam['data']['code'] == 0) || (typeof sendEmailAlam['response'] === 'object' && typeof sendEmailAlam['response']['data'] === 'object' && sendEmailAlam['response']['data']['code'] == 0)){
              mux.Util.showAlert('저장되었습니다.', '저장 완료', 3000);
            } else {
              if (prevURL !== window.location.href) return;
              console.log('알림 메일 전송에 실패-sendEmailAlam :>> ', sendEmailAlam);
              mux.Util.showAlert('저장되었으나 알림 메일 전송에 실패하였습니다.', '저장 완료');
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            console.log('알림 메일 전송에 실패-error :>> ', error);
            mux.Util.showAlert('저장되었으나 알림 메일 전송에 실패하였습니다.', '저장 완료');
          }

        } else {
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(result);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }
      mux.Util.hideLoading();

    },
    openEstiamteMailForm(){
      // this.estimate_product_list_dialog = false;
      this.mailDialog = true;
    },
    async sendEstimateMail(){
      await this.$refs.mailFormComponent.dispatchEnterKeyToAllCombobox();
      const validate = this.$refs.mailForm.validate();
      if (!validate) return;

      mux.Util.showLoading();
      let mail_data = JSON.parse(JSON.stringify(this.mailData));
      // mail_data.content = mail_data.content.replaceAll("style=\"", "style="").replaceAll(";\"", ";"")

      mail_data.content += this.email_sign

      let sendData = {};
      for (let key in mail_data) {
        if(key === 'content'){
          sendData[key] = '<html><body>' + mail_data.content  + '</body></html>';
        }else{
          sendData[key] = mail_data[key];
        }
      }
      sendData.path = '/api/send_email_extention/';
      sendData.files = [];
      for (let i = 0; i < this.mailData.files.length; i++) {
        const file = this.mailData.files[i];
        sendData.files.push(file);
      }


      let estimateFile = null;
      let specificationFile = null;
      let laborFile = null;
      let attachment = [];

      if(this.etc_estimate){
        // S3에서 찾아서 첨부할 목록
        if (sendData.estimate) {
          attachment.push({folder: 'estimate/approval', fileName: this.clickedProductCost.cost_calc_code + '_' + this.clickedProductCost.approval_file, newName: this.clickedProductCost.approval_file});
        }
        delete sendData.approval;

        if (sendData.etc && this.clickedProductCost.etc_files) {
          this.clickedProductCost.etc_files.split('/').forEach(file => {
            attachment.push({folder: 'estimate/etc', fileName: this.clickedProductCost.cost_calc_code + '_' + file, newName: file});
          });
        }
        delete sendData.etc;

        if (sendData.business_license) {
          attachment.push({folder: 'common', fileName: 'business_license_test.pdf', newName: '사업자등록증.pdf'});
        }
        delete sendData.business_license;

        if (sendData.bankbook_copy) {
          attachment.push({folder: 'common', fileName: 'bankbook_copy_test.pdf', newName: '통장사본.pdf'});
        }
        delete sendData.bankbook_copy;

        sendData.attachment = attachment;
      }else{
        // 견적서 PDF 파일 생성
        if (sendData.estimate) {
          const estimate = this.$refs.calcCostCard.$el;
          try {
            // await mux.Util.downloadPDF(estimate, 'estimate');
            estimateFile = await mux.Util.getPDF(estimate, '견적서');
            sendData.files.push(estimateFile);
          } catch (error) {
            this.mailDialog = true;
            mux.Util.showAlert('견적서 PDF 파일 생성 중 오류가 발생했습니다.');
            return;
          }
        }
        delete sendData.estimate;

        // 산출내역서 PDF 파일 생성
        if (sendData.specification) {
          if (!this.$refs.calcDetailCard){ // 산출내역서 탭을 load 한 적이 없는 것을 대비
            const origin_tab = this.tab_search;
            this.tab_search = 1;
            let refLoadCount = 0
            while(refLoadCount < 50){
              if (this.$refs.calcDetailCard){
                break;
              }
              await new Promise(resolve => setTimeout(resolve, 100));
              refLoadCount++;
            }
            this.tab_search = origin_tab;
          }
          const specification = this.$refs.calcDetailCard.$el;
          try {
            // await mux.Util.downloadPDF(specification, 'specification');
            specificationFile = await mux.Util.getPDF(specification, '산출내역서');
            sendData.files.push(specificationFile);
          } catch (error) {
            this.mailDialog = true;
            mux.Util.showAlert('산출내역서 PDF 파일 생성 중 오류가 발생했습니다.');
            return;
          }
        }
        delete sendData.specification;

        // 노무비 산출 PDF 파일 생성
        if (sendData.labor) {
          if (!this.$refs.calcLaborCard){ // 노무비 산출 탭을 load 한 적이 없는 것을 대비
            const origin_tab = this.tab_search;
            this.tab_search = 2;
            let refLoadCount = 0
            while(refLoadCount < 50){
              if (this.$refs.calcLaborCard){
                break;
              }
              await new Promise(resolve => setTimeout(resolve, 100));
              refLoadCount++;
            }
            this.tab_search = origin_tab;
          }
          const labor = this.$refs.calcLaborCard.$el;
          try {
            // await mux.Util.downloadPDF(labor, 'labor');
            laborFile = await mux.Util.getPDF(labor, '노무비 산출');
            sendData.files.push(laborFile);
          } catch (error) {
            this.mailDialog = true;
            mux.Util.showAlert('노무비 산출 PDF 파일 생성 중 오류가 발생했습니다.');
            return;
          }
        }
        delete sendData.labor;


        // S3에서 찾아서 첨부할 목록
        if (sendData.blueprint) {
          attachment.push({folder: 'estimate/blueprint', fileName: this.clickedProductCost.blueprint_file, newName: this.clickedProductCost.blueprint_file.replace(this.clickedProductCost.blueprint_file.split('_')[0]+'_'+this.clickedProductCost.blueprint_file.split('_')[1]+'_', '')});
        }
        delete sendData.blueprint;

        if (sendData.approval) {
          attachment.push({folder: 'estimate/approval', fileName: this.clickedProductCost.approval_file, newName: this.clickedProductCost.approval_file.replace(this.clickedProductCost.approval_file.split('_')[0]+'_'+this.clickedProductCost.approval_file.split('_')[1]+'_', '')});
        }
        delete sendData.approval;

        if (sendData.etc && this.clickedProductCost.etc_files) {
          this.clickedProductCost.etc_files.split('/').forEach(file => {
            attachment.push({folder: 'estimate/etc', fileName: file, newName: file.replace(file.split('_')[0]+'_'+file.split('_')[1]+'_', '')});
          });
        }
        delete sendData.etc;

        if (sendData.business_license) {
          attachment.push({folder: 'common', fileName: 'business_license_test.pdf', newName: '사업자등록증.pdf'});
        }
        delete sendData.business_license;

        if (sendData.bankbook_copy) {
          attachment.push({folder: 'common', fileName: 'bankbook_copy_test.pdf', newName: '통장사본.pdf'});
        }
        delete sendData.bankbook_copy;

        sendData.attachment = attachment;
      }

      try {
        await mux.Server.sendEmail(sendData);
        mux.Util.showAlert('메일 발송이 완료되었습니다.', '발송 완료', 3000);
        this.mailDialog = false;
      } catch (error) {
        this.mailDialog = true;
        mux.Util.showAlert(error);
      }
      mux.Util.hideLoading();
    },
    async estimateCheckbox(type, name){
      if(name !== '재료비' && !this.estimate_checkbox[type]){
        const confirm = await mux.Util.showConfirm('재료비에 ' + name + '을(를) 포함하시겠습니까?', '금액 확인', false, '예', '아니오');

        if (confirm){
          this.estimate_detail_data.find(x=>x.cost_list === name).hidden = true;
          this.estimate_detail_data.find(x=>x.cost_list === '재료비').belong_data.push(this.estimate_detail_data.find(x=>x.cost_list === name));
          this.estimate_detail_data = this.estimate_detail_data.filter(x=>x.cost_list !== name);
        }else {

          this.estimate_detail_data.find(x=>x.cost_list === name).hidden = true;

        }

      }else if (name !== '재료비' && this.estimate_checkbox[type]){
        let movedData = this.estimate_detail_data.find(x=>x.cost_list === '재료비').belong_data.find(x=>x.cost_list === name);
        if (movedData){
          movedData.hidden = false;
          const productInnerIndex = this.estimate_detail_data.find(x=>x.cost_list === '재료비').belong_data.findIndex(x=>x.cost_list === name);

          const estimate_detail_data_order = ['재료비', '노무비', '경비', '일반관리비', '이윤'];
          const nameIndex = estimate_detail_data_order.findIndex(x=>x === name);
          let putIndex = 0;
          for (let i = 0; i < nameIndex; i++) {
            if (this.estimate_detail_data.find(x=>x.cost_list === estimate_detail_data_order[i])){
              putIndex++;
            }
          }
          this.estimate_detail_data.splice(putIndex, 0, this.estimate_detail_data.find(x=>x.cost_list === '재료비').belong_data.splice(productInnerIndex, 1)[0]);
        }else {
          this.estimate_detail_data.find(x=>x.cost_list === name).hidden = false;
        }
      }

      if (this.estimate_checkbox.product){
        this.show_childs_parent_index_arr = [0];
        this.show_grand_childs_parent_index_arr = [0, 1];
      }else {
        this.show_childs_parent_index_arr = [];
        this.show_grand_childs_parent_index_arr = [];
      }
    },


    async searchCurrentCode(){
      const currDate = new Date();
      const prevURL = window.location.href;
      let code = 'PEPQ_' + mux.Date.format(currDate, 'yyMMdd') + '_';
      let current_code = '';
      try {
        //견적서 REST API 스크립트 전달 받으면 수정 예정
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "order_confirmation_table.code": code
            }
          ],
          "script_file_name": "rooting_발주_데이터_order_product_confirm_fst_검색_24_08_08_09_39_OKJ.json",
          "script_file_path": "data_storage_pion\\json_sql\\order\\발주_데이터_order_product_confirm_fst_검색_24_08_08_09_39_3Q8"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

          let searched = result.data;
          // 정렬
          if(searched.length > 0){
            searched.sort((a,b) => a.code.localeCompare(b.code));
            current_code = searched[searched.length-1].code;
          } else {
            current_code = '';
          }
        } else {
          mux.Util.showAlert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.hideLoading();
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
      return current_code;
    },
  },
}
</script>

<style lang="">

</style>


