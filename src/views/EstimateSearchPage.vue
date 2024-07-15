<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :salesMenu="true" :estimateMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <LoadingModalComponent :dialog-value="loading_dialog" hide-overlay></LoadingModalComponent>
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

          <v-row>
            <v-col
              cols="12"
              sm="12"
            >
              <v-card
              elevation="1"
              class="mt-5"
              >
                <v-card-text class=" pt-3">
                  <DataTableComponent
                    :headers="estimate_approve_headers"
                    :items="estimate_approve_data"
                    item-key="product_code"
                    approval="inbound"
                    dense
                    :loginId="login_info.id"
                    @clickTr="clickApproveData"
                    @setApprovalPhase="setApprovalPhase"
                    @cancleApprove="cancleApprove"
                    @setCanclePhase="setCanclePhase"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-main>

    <ModalDialogComponent
      :dialog-value="estimate_product_list_dialog"
      max-width="51%"
      title-class=" "
      :dialog-transition="'slide-x-transition'"
      :dialog-custom="'custom-dialog elevation-0 white'"
      :card-elevation="'0'"
      @close="closeProductList"
    >
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
                  @click="sendEstiamteMail"
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
                              : item.click === 'pdf' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data', '원가계산서') : ''"
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
          <v-row class="mt-3">
            <v-col cols="12" sm="4">
              <p class="font-weight-bold primary--text mb-0">▼ 승인서</p>
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
              <p class="font-weight-bold primary--text mb-0">▼ 도면</p>
              <div style="width:100%; background-color: #ccc; min-height:300px"></div>
            </v-col>
            <v-col cols="12" sm="4">
              <p class="font-weight-bold primary--text mb-0">▼ 기타 첨부</p>
              <v-chip
                color="grey lighten-2"
                class="ma-2"
              >
                기타첨부파일.jpg
              </v-chip>
              <v-chip
                color="grey lighten-2"
                class="ma-2"
              >
                기타첨부파일2.xlsx
              </v-chip>
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
                            : item.click === 'pdf' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data', '원가계산서') : ''"
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
                  :cost-num-edit-disabled="edit_survey_cost_num_disabled"
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
                    @click="item.click === 'print' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data')
                            : item.click === 'pdf' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data', '원가계산서') : ''"
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
          addSystemFiles="estimate"
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
              @click="test()"
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
import DataTableComponent from "@/components/DataTableComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import LoadingModalComponent from "@/components/LoadingModalComponent.vue";
import CostTableComponent from "@/components/CostTableComponent.vue";
import MailFormComponent from "@/components/MailFormComponent.vue";
import EstimateSearchPageConfig from "@/configure/EstimateSearchPageConfig.json";
import CheckPagePermission from "@/common_js/CheckPagePermission";
import mux from "@/mux";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=EstimateSearchPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  components: {
                NavComponent,
                DataTableComponent,
                ModalDialogComponent,
                CardComponent,
                InputsFormComponent,
                LoadingModalComponent,
                CostTableComponent,
                MailFormComponent,
              },
  data(){
    return{
      mux: mux,
      dates: [],
      estimate_product_list_dialog: false,
      loading_dialog: false,
      mailDialog: false,
      tab_search: null,
      receivingInspectionThumbnail: '',
      inspectionReportThumbnail: '',
      email_sign:'',
      estimate_checkbox:{
        product:true,
        labor_cost:true,
        expense:true,
        general_management:true,
        profit:true
      },
      estimate_info_data:{},
      estimate_product_list_data:[],

      change_approve:{},

      searched_products:[],

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
      calc_cost_detail_data: JSON.parse(JSON.stringify(EstimateSearchPageConfig.calc_cost_detail_data)),
      estimate_approve_data:EstimateSearchPageConfig.test_estimate_approve_data
    }
  },

  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  },
  watch:{
    estimate_product_list_dialog(val){
      val || this.closeProductList()
      this.mailData = JSON.parse(JSON.stringify(this.defaultMailData));
    },
  },
  created () {
    this.initialize()
    const inhouse_bid_number = this.$route.query.inhouse_bid_number;
    const company_bid_number = this.$route.query.company_bid_number;
    const company_name = this.$route.query.company_name;
    const created_time = this.$route.query.created_time;
    if (inhouse_bid_number && company_bid_number && company_name && created_time){
      this.setSearchCardInputs(inhouse_bid_number, company_bid_number, company_name, created_time);
      this.searchButton();
    }
  },
  methods:{
    async initialize () {
      const prevURL = window.location.href;
      try {
        // console.log('사용자 계정 정보 가졍오기');
        // let result = await mux.Server.get({
        //   path: '/api/user/',
        // });

        this.login_info.name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.login_info.email = this.$cookies.get(this.$configJson.cookies.email.key);
        this.login_info.id = this.$cookies.get(this.$configJson.cookies.id.key);
        this.login_info.position = this.$cookies.get(this.$configJson.cookies.position.key);
        this.login_info.department = this.$cookies.get(this.$configJson.cookies.department.key);
        this.login_info.office_phone_number = this.$cookies.get(this.$configJson.cookies.office_phone_number.key);
        this.login_info.phone_number = this.$cookies.get(this.$configJson.cookies.phone_number.key);
        console.log(this.login_info)
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }
      this.searchCardInputs = JSON.parse(JSON.stringify(this.searchCardInputs));
      this.email_sign =`<div><p style="color:#255fab; border-bottom:1px solid #255fab; border-top:1px solid #255fab;padding:15px 0px;"><strong>${this.login_info.name} 파이온 일렉트릭㈜ ${this.login_info.department} ${this.login_info.position} / Pion Electric Co., Ltd. </strong></p><p style="border-bottom:1px solid #333333;padding-bottom:20px; font-size:14px;">Home page : www.pionelectric.com<br>E-mail: ${this.login_info.email}  C/P: ${'+82(0)' + this.login_info.phone_number.slice(1)}<br> Tel: ${'+82(0)' + this.login_info.office_phone_number.slice(1)} Fax: +82(0)505-300-4179<br><br> 본사: (03722) 서울특별시 서대문구 연세로 50 연세대학교 공학원 116호<br> Head office: #116, Engineering Research Park, Yonsei University, 50, Yonsei-ro, Seodaemun-gu, Seoul, 03722, Republic of KOREA<br><br> 광명 사무소: (14348) 경기도 광명시 일직로 72  A-1818호<br> Gwangmyeong office: #A-1818, 72, Iljik-ro, Gwangmyeong-si, Gyeonggi-do, Republic of KOREA 14348<br><br> 광주 공장: (47580) 광주광역시 광산구 연산동 1247<br> Gwangju factory: 1247 Yeonsan-dong, Gwangsan-gu, Gwangju, Republic of KOREA 47580<br><br> 보령 공장: (33448) 충청남도 보령시 주교면 관창공단길 266<br> Boryeong factory: 266, Gwanchanggongdan-gil, Jugyo-myeon, Boryeong-si, Chungcheongnam-do, Republic of KOREA 33448<br><br></p> <p style="border-bottom:1px solid #333333;padding-bottom:20px; font-size:14px;"><strong>제품 및 서비스</strong><br> ∙ 고자기장 기반의 산업용 운용기기 (Development of Operating Device for Industrial Applications based on High Magnetic Field)<br> ∙ 광기기 기반의 전력전자 응용기기 (Development of Power Electronics Application Device based on Optical Device)<br> ∙ 신재생 에너지 개발 및 운영 (Development and Operation of Renewable Energy System)<br> ∙ 전력계통 진단 및 해석 (Power System Diagnosis and Analysis)<br> ∙ 전기공사면허</p> </div>`
    },
    // eslint-disable-next-line no-unused-vars
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      // console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    setSearchCardInputs(inhouse_bid_number, company_bid_number, company_name, created_time){
      this.searchCardInputs.find(x=>x.label === '사내 입찰번호').value = inhouse_bid_number;
      this.searchCardInputs.find(x=>x.label === '기업별 입찰번호').value = company_bid_number;
      this.searchCardInputs.find(x=>x.label === '업체명').value = company_name;
      if (created_time.includes(' ~ ')){
        this.searchCardInputs.find(x=>x.label === '발행일').value = created_time.split(' ~ ');
      } else {
        this.searchCardInputs.find(x=>x.label === '발행일').value = [created_time, created_time];
      }
    },
    async download(foldername, filename, prefix) {
      this.loading_dialog = true;
      try {
        await mux.Server.downloadFile(foldername, filename, prefix);
      } catch (error) {
        mux.Util.showAlert(error);
      }
      this.loading_dialog = false;
    },
    async searchButton(){
      this.loading_dialog = true;
      this.loading_dialog = false;
    },
    closeProductList(){
      this.estimate_product_list_dialog = false;
    },
    async clickApproveData(){
      this.estimate_product_list_dialog = true;
    },
    async setApprovalPhase(item, change, reason){
      console.log(item, change, reason);
    },
    async setCanclePhase(item, change, reason){
      console.log(item, change, reason);
    },
    async cancleApprove(item){
      console.log(item)
    },
    sendEstiamteMail(){
      // this.estimate_product_list_dialog = false;
      this.mailDialog = true;
    },
    async test(){
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

      let specificationFile = null;
      // 산출내역서 PDF 파일 생성
      if (sendData.specification) {
        const origin_tab = this.tab_search;
        this.tab_search = 1; // 산출내역서 탭을 load 한 적이 없는 것을 대비하여 이동
        await new Promise(resolve => setTimeout(resolve, 500));
        const specification = this.$refs.calcDetailCard.$el;
        try {
          // await mux.Util.downloadPDF(specification, 'specification');
          specificationFile = await mux.Util.getPDF(specification, '산출내역서');
          sendData.files.push(specificationFile);
        } catch (error) {
          this.tab_search = origin_tab;
          this.mailDialog = true;
          mux.Util.showAlert('산출내역서 PDF 파일 생성 중 오류가 발생했습니다.');
          return;
        }
        this.tab_search = origin_tab;
      }
      delete sendData.specification;


      let laborFile = null;
      // 노무비 산출 PDF 파일 생성
      if (sendData.labor) {
        const origin_tab = this.tab_search;
        this.tab_search = 2; // 노무비 산출 탭을 load 한 적이 없는 것을 대비하여 이동
        await new Promise(resolve => setTimeout(resolve, 500));
        const labor = this.$refs.calcLaborCard.$el;
        try {
          // await mux.Util.downloadPDF(labor, 'labor');
          laborFile = await mux.Util.getPDF(labor, '노무비 산출');
          sendData.files.push(laborFile);
        } catch (error) {
          this.tab_search = origin_tab;
          this.mailDialog = true;
          mux.Util.showAlert('노무비 산출 PDF 파일 생성 중 오류가 발생했습니다.');
          return;
        }
        this.tab_search = origin_tab;
      }
      delete sendData.labor;


      // S3에서 찾아서 첨부할 목록
      let attachment = [];

      if (sendData.blueprint) {
        attachment.push({folder: 'estimate/blueprint', fileName: 'blueprint_test.pdf', newName: '도면.pdf'});
      }
      delete sendData.blueprint;

      if (sendData.approval) {
        attachment.push({folder: 'estimate/approval', fileName: 'approval_test.pdf', newName: '승인서.pdf'});
      }
      delete sendData.approval;

      if (sendData.etc) {
        attachment.push({folder: 'estimate/etc', fileName: '기타첨부테스트.jpg', newName: '기타첨부파일.jpg'});
        attachment.push({folder: 'estimate/etc', fileName: '기타첨부테스트2.xlsx', newName: '기타첨부파일2.xlsx'});
      }
      delete sendData.etc;

      if (sendData.business_license) {
        attachment.push({folder: 'common', fileName: 'business_license_test.pdf', newName: '사업자등록증.pdf'});
      }
      delete sendData.business_license;

      sendData.attachment = attachment;

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
    estimateCheckbox(type, name){
      if(name !== '재료비' && !this.estimate_checkbox[type]){
        const confirm = mux.Util.showConfirm('재료비에 ' + name + '을(를) 포함하시겠습니까?', '금액 확인');
        if (!confirm){
          return
        }
      }
    },
  },
}
</script>

<style lang="">

</style>


