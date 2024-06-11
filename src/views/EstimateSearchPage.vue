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
      max-width="50%"
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
          <v-card ref="calcCostCard" style="border: 1px solid #ccc;">
            <v-row>
              <v-col align-self="center" cols="12" sm="12">
                <v-checkbox
                  v-model="estimate_checkbox.labor_cost"
                  label="노무비"
                  color="primary"
                  hide-details
                  class="float-left mr-3"
                ></v-checkbox>
                <v-checkbox
                  v-model="estimate_checkbox.expense"
                  label="경비"
                  color="primary"
                  hide-details
                  class="float-left mr-3"
                ></v-checkbox>
                <v-checkbox
                  v-model="estimate_checkbox.general_management"
                  label="일반관리비"
                  color="primary"
                  hide-details
                  class="float-left mr-3"
                ></v-checkbox>
                <v-checkbox
                  v-model="estimate_checkbox.profit"
                  label="이윤"
                  color="primary"
                  hide-details
                  class="float-left"
                ></v-checkbox>
                <v-btn
                  color="primary"
                  elevation="0"
                  fab
                  x-small
                  @click="sendEstiamteMail"
                  class="mb-3 float-right"
                >
                  <v-icon >mdi-email</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-card-title>
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
          <v-row class="mt-3">
            <v-col cols="12" sm="4">
              <p class="font-weight-bold primary--text mb-0">▼ 도면</p>
              <div style="width:100%; background-color: #ccc; height:300px"></div>
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
              <p class="font-weight-bold primary--text mb-0">▼ 승인서</p>
              <div style="width:100%; background-color: #ccc; height:300px"></div>
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
              <p class="font-weight-bold primary--text mb-0">▼ 기타 첨부</p>
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
        </v-tab-item>
        <!-- 산출내역서 -->
        <v-tab-item>
          <v-card ref="calcDetailCard">
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
          <v-card>
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
      <MailFormComponent v-model="mailData">
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
            @click="test(), mailDialog = false"
          >
            발송
          </v-btn>
        </v-card-actions>
      </MailFormComponent>
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
      estimate_checkbox:{
        labor_cost:true,
        expense:true,
        general_management:true,
        profit:true
      },
      estimate_info_data:{},
      estimate_product_list_data:[],

      change_approve:{},

      searched_products:[],

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
        if (prevURL !== window.location.href) return;
        // console.log('result :>> ', result);
        // this.login_info.name = (result.data.UserAttributes.find(attr => attr.Name === 'given_name').Value).trim();
        // this.login_info.email = result.data.UserAttributes.find(attr => attr.Name === 'email').Value;
        this.login_info.name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.login_info.email = this.$cookies.get(this.$configJson.cookies.email.key);
        this.login_info.id = this.$cookies.get(this.$configJson.cookies.id.key);
        console.log(this.login_info)
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }
      this.searchCardInputs = JSON.parse(JSON.stringify(this.searchCardInputs));
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
      this.estimate_product_list_dialog = false;
      this.mailDialog = true;
    },

    async test(){
      console.log('this.mailData :>> ', this.mailData);
      
      let sendData = JSON.parse(JSON.stringify(this.mailData));
      sendData.path = '/api/email/send/';
      sendData.files = this.mailData.files;
      sendData.to = sendData.to.trim();
      sendData.to = sendData.to.split(/,|\/|\s/); // 콤마, 슬래시, 공백으로 구분
      sendData.to = sendData.to.filter(x => x !== '');
      sendData.cc = sendData.cc.trim();
      sendData.cc = sendData.cc.split(/,|\/|\s/); // 콤마, 슬래시, 공백으로 구분
      sendData.cc = sendData.cc.filter(x => x !== '');
      sendData.bcc = sendData.bcc.trim();
      sendData.bcc = sendData.bcc.split(/,|\/|\s/); // 콤마, 슬래시, 공백으로 구분
      sendData.bcc = sendData.bcc.filter(x => x !== '');
      
      let attachment = [];
      if (sendData.estimate) {
        attachment.push({folder: 'estimate', fileName: 'estimate.pdf'});
      }
      delete sendData.estimate;

      if (sendData.specification) {
        attachment.push({folder: 'specification', fileName: 'specification.pdf'});
      }
      delete sendData.specification;

      if (sendData.drawing) {
        attachment.push({folder: 'drawing', fileName: 'drawing.pdf'});
      }
      delete sendData.drawing;

      if (sendData.approval) {
        attachment.push({folder: 'approval', fileName: 'approval.pdf'});
      }
      delete sendData.approval;

      if (sendData.etc) {
        attachment.push({folder: 'etc', fileName: 'etc.pdf'});
      }
      delete sendData.etc;

      if (sendData.business_license) {
        attachment.push({folder: 'business_license', fileName: 'business_license.pdf'});
      }
      delete sendData.business_license;

      sendData.attachment = attachment;

      try {
        await mux.Server.sendEmail(sendData);
        mux.Util.showAlert('메일 발송이 완료되었습니다.', '발송 완료', 3000);
        this.mailDialog = false;
      } catch (error) {
        mux.Util.showAlert(error);
      }
    }
  },
}
</script>

<style lang="">

</style>


