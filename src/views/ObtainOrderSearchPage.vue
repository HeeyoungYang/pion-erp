<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :salesMenu="true" :obtainOrderMenu="true"></NavComponent>

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
                    :headers="inbound_approve_headers"
                    :items="inbound_approve_data"
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
      :dialog-value="inbound_product_list_dialog"
      max-width="50%"
      title-class=" "
      :dialog-transition="'slide-x-transition'"
      :dialog-custom="'custom-dialog elevation-0 white'"
      :card-elevation="'0'"
      @close="closeProductList"
    >

    <v-row>
        <v-col cols="12" sm="5">
          <v-combobox
            label="version"
            filled
            value="3차 수정"
            :items="versions"
          ></v-combobox>
        </v-col>
      </v-row>
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
              <p class="font-weight-bold primary--text mb-0">▼ 수주 확인서</p>
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
            <v-col cols="12" sm="12">
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
      <MailFormComponent v-model="files">
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
import ObtainOrderSearchPageConfig from "@/configure/ObtainOrderSearchPageConfig.json";
import CheckPagePermission from "@/common_js/CheckPagePermission";
import mux from "@/mux";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=InboundSearchPage')],
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
      versions:['1차 수정', '2차 수정', '3차 수정'],
      inbound_product_list_dialog: false,
      loading_dialog: false,
      tab_search: null,
      receivingInspectionThumbnail: '',
      inspectionReportThumbnail: '',

      inbound_info_data:{},
      inbound_product_list_data:[],

      change_approve:{},

      searched_products:[],

      login_info: ObtainOrderSearchPageConfig.login_info,
      searchCardInputs:ObtainOrderSearchPageConfig.searchCardInputs,
      inbound_approve_headers:ObtainOrderSearchPageConfig.inbound_approve_headers,
      inbound_product_list_headers:ObtainOrderSearchPageConfig.inbound_product_list_headers,
      // inbound_approve_data:[],
      survey_cost_headers: ObtainOrderSearchPageConfig.survey_cost_headers,
      search_tab_items: ObtainOrderSearchPageConfig.search_tab_items,
      labor_cost_headers: ObtainOrderSearchPageConfig.labor_cost_headers,
      calc_cost_detail_data: JSON.parse(JSON.stringify(ObtainOrderSearchPageConfig.calc_cost_detail_data)),
      inbound_approve_data:ObtainOrderSearchPageConfig.test_inbound_approve_data
    }
  },

  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  },
  watch:{
    inbound_product_list_dialog(val){
      val || this.closeProductList()
    },
  },
  created () {
    this.initialize()
    const order_code = this.$route.query.order_code;
    const inbound_date = this.$route.query.inbound_date;
    if (order_code && inbound_date){
      this.setSearchCardInputs(order_code, inbound_date);
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
    setSearchCardInputs(order_code, inbound_date){
      this.searchCardInputs.find(x=>x.label === '발주번호').value = order_code;
      if (inbound_date.includes(' ~ ')){
        this.searchCardInputs.find(x=>x.label === '입고일자').value = inbound_date.split(' ~ ');
      } else {
        this.searchCardInputs.find(x=>x.label === '입고일자').value = [inbound_date, inbound_date];
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

      let searchApprovalPhase = this.searchCardInputs.find(x=>x.label === '승인').value;
      if (searchApprovalPhase === 'All')
        searchApprovalPhase = '';
      let searchOrderCode = this.searchCardInputs.find(x=>x.label === '발주번호').value;
      if (searchOrderCode)
      searchOrderCode = searchOrderCode.trim();

      let searchProductCode = this.searchCardInputs.find(x=>x.label === '관리코드').value;
      if (searchProductCode)
      searchProductCode = searchProductCode.trim();

      let searchProductName = this.searchCardInputs.find(x=>x.label === '제품명').value;
      if (searchProductName)
      searchProductName = searchProductName.trim();

      let searchInboundDate = this.searchCardInputs.find(x=>x.label === '입고일자').value;
      let searchInboundStartDate = searchInboundDate[0];
      let searchInboundEndDate = searchInboundDate[1];


      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
            "inbound_confirmation_table.approval_phase": searchApprovalPhase ? searchApprovalPhase : "",
            "inbound_product_table.product_code": searchProductCode ? searchProductCode : "",
            "inbound_product_table.name": searchProductName ?  searchProductName: "",
            "inbound_confirmation_table.order_code": searchOrderCode ? searchOrderCode : "",
            "inbound_confirmation_table.inbound_date_start_date": searchInboundStartDate ? searchInboundStartDate : "",
            "inbound_confirmation_table.inbound_date_end_date": searchInboundEndDate ? searchInboundEndDate : ""
            }
          ],
          "script_file_name": "rooting_입고_검색_24_06_07_10_34_C6Q.json",
          "script_file_path": "data_storage_pion\\json_sql\\inbound\\입고_검색_24_06_07_10_34_T59"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0){
          if(result['data'].length === 0){
            mux.Util.showAlert('검색 결과가 없습니다.');
          }
          result.data.forEach(datas =>{
            for(let d=0; d<datas.belong_data.length; d++){
              datas.belong_data[d].inbound_num = Number(datas.belong_data[d].inbound_num).toLocaleString();
              datas.belong_data[d].unit_price = '₩ ' + Number(datas.belong_data[d].unit_price).toLocaleString();
              if(datas.belong_data[d].belong_data){
                for(let dd=0; dd<datas.belong_data[d].belong_data.length; dd++){
                  datas.belong_data[d].belong_data[dd].inbound_num="";
                  datas.belong_data[d].belong_data[dd].unit_price = '₩ ' + Number(datas.belong_data[d].belong_data[dd].unit_price).toLocaleString();
                  datas.belong_data[d].ship_date="";
                }
              }
            }

          })
          this.inbound_approve_data  = result.data.reverse();
        }else{
          mux.Util.showAlert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
      // this.inbound_approve_data = ObtainOrderSearchPageConfig.test_inbound_approve_data
      this.loading_dialog = false;
    },
    closeProductList(){
      this.inbound_product_list_dialog = false;
    },
    async clickApproveData(){

      // let belong_datas = item.belong_data
      // this.inbound_product_list_data = [];
      // this.inbound_info_data = {};
      // belong_datas.forEach(data =>{
      //   data.inbound_price = '₩ ' + Number(data.unit_price.replace(/,/g,'').replace(/₩ /g,'') * data.inbound_num.replace(/,/g,'')).toLocaleString();
      //   this.inbound_product_list_data.push(data);

      //   if(data.belong_data){
      //     data.belong_data.forEach(shipdata => {
      //     shipdata.inbound_price = ""
      //   })
      //   }
      // })
      // let file_name = item.files.split('/');
      // if(!file_name[0]){
      //   file_name = ""
      // }
      // this.inbound_info_data = {
      //   code:item.code,
      //   project_code:item.project_code,
      //   spot:item.spot,
      //   abnormal_reason : item.abnormal_reason,
      //   receiving_inspection_file : item.receiving_inspection_file,
      //   inspection_report_file : item.inspection_report_file,
      //   note: item.note,
      //   files: file_name,
      // }

      // const prevURL = window.location.href;
      // try {
      //   this.loading_dialog = true;
      //   // 제품의 썸네일
      //   let result = await mux.Server.post({
      //     path: '/api/common_rest_api/',
      //     params: [
      //       {
      //         "inbound_confirmation_table.code": item.code
      //       }
      //     ],
      //     "script_file_name": "rooting_입고_thumbnail_검색_24_05_16_15_32_Z97.json",
      //     "script_file_path": "data_storage_pion\\json_sql\\inbound\\입고_thumbnail_검색_24_05_16_15_32_7VD"
      //   });
      //   if (prevURL !== window.location.href) return;

      //   if (typeof result === 'string'){
      //     result = JSON.parse(result);
      //   }
      //   if(result['code'] == 0){
      //     let receiving_inspection_thumbnail = '';
      //     let inspection_report_thumbnail = '';
      //     if (result['data'].length > 0){
      //       receiving_inspection_thumbnail = result['data'][0].receiving_inspection_thumbnail;
      //       inspection_report_thumbnail = result['data'][0].inspection_report_thumbnail;
      //     }
      //     this.receivingInspectionThumbnail = receiving_inspection_thumbnail;
      //     this.inspectionReportThumbnail = inspection_report_thumbnail;
      //     this.loading_dialog = false;
      //   } else {
      //     this.loading_dialog = false;
      //     mux.Util.showAlert(result['failed_info']);
      //   }
      // } catch (error) {
      //   if (prevURL !== window.location.href) return;
      //   this.loading_dialog = false;
      //   if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
      //     mux.Util.showAlert(error.response['data']['failed_info'].msg);
      //   else
      //     mux.Util.showAlert(error);
      // }
      this.inbound_product_list_dialog = true;
    },

    async searchItemStock(data){
      const prevURL = window.location.href;
      try {
        data.forEach(async datas => {
          let stock_check = await mux.Server.post({
            path: '/api/common_rest_api/',
            params: [
              {
                "product_table.product_code": datas.product_code,

                "module_table.module_code": datas.product_code,

                "material_table.material_code": datas.product_code,
                "material_table.directly_written": 0,
              }
            ],
            "script_file_name": "rooting_재고_검색_24_05_07_11_46_16P.json",
            "script_file_path": "data_storage_pion\\json_sql\\stock\\1_재고검색\\재고_검색_24_05_07_11_46_H8D"
          });
          if (prevURL !== window.location.href) return;

          if (typeof stock_check === 'string'){
            stock_check = JSON.parse(stock_check);
          }
          if(stock_check['code'] == 0){

            stock_check = stock_check['data'].map(a => {
              if (!a.stock_num){
                a.stock_price = 0;
              }else {
                a.stock_price = Math.round(a.unit_price * a.stock_num)
              }
              return a;
            });

            console.log(stock_check);

            stock_check.forEach(data => {
              this.searched_products.push(data);
            });
          }

        })

      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
    },
    async setApprovalPhase(item, change, reason){
      const currDate = new Date();
      const prevURL = window.location.href;
      let phase;
      let send_data = {};
      let send_data_belong = {};
      send_data.code = item.code;
      // 현 승인 상태에 따른 필요 정보 정리
      if(item.approval_phase === '미확인'){
        if(change === true){
          send_data.checked_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
          send_data.approval_phase = '미승인';
          phase = '확인';
        }else{
          if(reason === ''){
            mux.Util.showAlert('반려 사유 필수 기입');
            return;
          }else{
            send_data.reject_reason = reason;
            send_data.rejecter = this.login_info.name;
            send_data.rejected_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
            send_data.approval_phase = '반려';
            phase = '확인 반려';
          }
        }
      }else if(item.approval_phase === '미승인'){
        if(change === true){
          send_data.approved_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
          send_data.approval_phase = '승인';
          send_data_belong = item.belong_data
          console.log(send_data_belong);
          phase = '승인';
        }else{
          if(reason === ''){
            mux.Util.showAlert('반려 사유 필수 기입');
            return;
          }else{
            send_data.reject_reason = reason;
            send_data.rejecter = this.login_info.name;
            send_data.rejected_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
            send_data.approval_phase = '반려';
            phase = '승인 반려';
          }
        }
      }

      console.log(phase);

      let sendData = {};

      // 미승인에서 승인으로 변경하는 경우
      if(send_data_belong.length > 0){
        for (let i = 0; i < send_data_belong.length; i++) {
          const belong = send_data_belong[i];

          let update_stock_data = [];
          let insert_stock_data = [];
          let insert_material_data = [];
          let insert_module_data = [];
          let belong_module_data = [];
          let insert_product_data = [];
          let belong_product_module_data = [];
          let belong_product_material_data = [];

          // product_code기준 재고(자재)검색
          let stock_check = await mux.Server.post({
            path: '/api/common_rest_api/',
            params: [
              {
                "product_table.product_code": belong.product_code,
                "module_table.module_code": belong.product_code,
                "material_table.material_code": belong.product_code,
                "material_table.directly_written": 0,
              }
            ],
            "script_file_name": "rooting_재고_검색_24_05_07_11_46_16P.json",
            "script_file_path": "data_storage_pion\\json_sql\\stock\\1_재고검색\\재고_검색_24_05_07_11_46_H8D"
          });
          if (prevURL !== window.location.href) return;

          if (typeof stock_check === 'string'){
            stock_check = JSON.parse(stock_check);
          }
          if(stock_check['code'] == 0){
            let searched_stock_data = [];
            if(stock_check['data'].length > 0){
              searched_stock_data = stock_check['data'][0]
            }

            // 요청할 데이터의 product_code와 검색된 데이터의 product_code가 동일하며
            if(belong.product_code === searched_stock_data._code){
              // 두 데이터의 spot이 동일할 경우 재고 테이블 stock_num update
              if(belong.spot === searched_stock_data.spot){
                let add_stock = Number(belong.inbound_num.replace(/,/g,'')) + Number(searched_stock_data.stock_num)
                update_stock_data.push({
                  "user_info": {
                    "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                    "role": "modifier"
                  },
                  "data":{
                    "stock_num": add_stock
                  },
                  "update_where": {"product_code": belong.product_code, "spot": belong.spot},
                  "rollback": "yes"
                });
              // 두 데이터의 spot이 상이할 경우 재고 테이블에 insert
              }else{
                insert_stock_data.push({
                  "user_info": {
                    "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                    "role": "creater"
                  },
                  "data":{
                    "conditions": "G",
                    "product_code": belong.product_code,
                    "spot": belong.spot,
                    "stock_num": belong.inbound_num.replace(/,/g,''),
                    "type": belong.type
                  },
                  "select_where": {"product_code": belong.product_code, "spot": belong.spot},
                  "rollback": "yes"
                });
              }

            // 요청할 데이터의 product_code와 검색된 데이터의 product_code가 상이하며
            }else{
              // 요청할 데이터가 원부자재일 경우 material_table에 정보 insert
              if(belong.type === '원부자재'){
                insert_material_data.push({
                  "user_info": {
                    "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                    "role": "creater"
                  },
                "data":{
                  "material_code": belong.product_code,
                  "classification": belong.classification,
                  "manufacturer": belong.manufacturer,
                  "model": belong.model,
                  "name": belong.name,
                  "spec": belong.spec,
                  "type": belong.type,
                  "unit_price": belong.unit_price.replace(/,/g,'').replace(/₩ /g,''),
                },
                "select_where": {"material_code": belong.product_code},
                "rollback": "yes"
                });
              // 요청할 데이터가 반제품일 경우 module_table에 정보 insert
              }else if(belong.type === '반제품'){
                insert_module_data.push({
                  "user_info": {
                    "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                    "role": "creater"
                  },
                  "data":{
                    "module_code": belong.product_code,
                    "classification": belong.classification,
                    "manufacturer": belong.manufacturer,
                    "model": belong.model,
                    "name": belong.name,
                    "spec": belong.spec,
                    "type": belong.type,
                    "unit_price": belong.unit_price.replace(/,/g,'').replace(/₩ /g,''),
                  },
                  "select_where": {"module_code": belong.product_code},
                  "rollback": "yes"
                });
                // 만약 요청할 데이터가 belong_data를 가지고 있는 경우 module_material_table에 insert
                if(belong.belong_data){
                  for(let bd = 0; bd < belong.belong_data.length; bd++){
                    belong_module_data.push({
                      "user_info": {
                        "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                        "role": "creater"
                      },
                      "data":{
                        "module_code": belong.product_code,
                        "material_code": belong.belong_data[bd].product_code,
                        "material_num": belong.belong_data[bd].ship_num / belong.inbound_num.replace(/,/g,'')
                      },
                      "select_where": {"module_code": belong.product_code},
                      "rollback": "yes"
                    })
                  }
                }
              // 요청할 데이터가 완제품일 경우 product_table에 정보 insert
              }else{
                insert_product_data.push({
                  "user_info": {
                    "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                    "role": "creater"
                  },
                  "data":{
                    "product_code": belong.product_code,
                    "classification": belong.classification,
                    "manufacturer": belong.manufacturer,
                    "model": belong.model,
                    "name": belong.name,
                    "spec": belong.spec,
                    "type": belong.type,
                    "unit_price": belong.unit_price
                  },
                  "select_where": {"product_code": belong.product_code},
                  "rollback": "yes"
                });
                // 만약 요청할 데이터가 belong_data를 가지고 있고
                if(belong.belong_data){
                  for(let bp = 0; bp < belong.belong_data.length; bp++){
                    //belong_data의 type이 원부자재일 경우 product_material_table에 insert
                    if(belong.belong_data[bp].type === '원부자재'){
                      belong_product_material_data.push({
                        "user_info": {
                          "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                          "role": "creater"
                        },
                        "data":{
                          "product_code": belong.product_code,
                          "material_code": belong.belong_data[bp].product_code,
                          "material_num": belong.belong_data[bp].ship_num / belong.inbound_num.replace(/,/g,'')
                        },
                        "select_where": {"product_code": belong.product_code},
                        "rollback": "yes"
                      })
                    //belong_data의 type이 반제품일 경우 product_module_table에 insert
                    }else if(belong.belong_data[bp].type === '반제품'){
                      belong_product_module_data.push({
                        "user_info": {
                          "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                          "role": "creater"
                        },
                        "data":{
                          "product_code": belong.product_code,
                          "module_code": belong.belong_data[bp].product_code,
                          "module_num": belong.belong_data[bp].ship_num / belong.inbound_num.replace(/,/g,'')
                        },
                        "select_where": {"product_code": belong.product_code},
                        "rollback": "yes"
                      })
                    }

                  }
                }
              }

              // stock_table에 insert
              insert_stock_data.push({
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data":{
                  "conditions": "G",
                  "product_code": belong.product_code,
                  "spot": belong.spot,
                  "stock_num": belong.inbound_num.replace(/,/g,''),
                  "type": belong.type
                },
                "select_where": {"product_code": belong.product_code, "spot": belong.spot},
                "rollback": "yes"
              });

            }

            sendData["stock_table-update"] = update_stock_data;
            sendData["stock_table-insert"] = insert_stock_data;
            sendData["material_table-insert"] = insert_material_data;
            sendData["module_table-insert"] = insert_module_data;
            sendData["module_material_table-insert"] = belong_module_data;
            sendData["product_table-insert"] = insert_product_data;
            sendData["product_material_table-insert"] = belong_product_material_data;
            sendData["product_module_table-insert"] = belong_product_module_data;
          }
        }

      }

      sendData["inbound_confirmation_table-update"] = [{
        "user_info": {
          "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
          "role": "modifier"
        },
        "data": send_data,
        "update_where": {"code": item.code},
        "rollback": "yes"
      }];
      console.log("sendData ::: ", sendData);

      try {
        this.loading_dialog = true;
        let resultInbound = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: sendData
        });
        if (prevURL !== window.location.href) return;

        if (typeof resultInbound === 'string'){
          resultInbound = JSON.parse(resultInbound);
        }
        if(resultInbound['code'] == 0){
          item.approval_phase = send_data.approval_phase;
          switch (item.approval_phase) {
            case '미승인':
              item.checked_date = send_data.checked_date;
              break;
            case '반려':
              item.reject_reason = send_data.reject_reason;
              item.rejecter = send_data.rejecter;
              item.rejected_date = send_data.rejected_date;
              break;
            case '승인':
              item.approved_date = send_data.approved_date;
              break;

            default:
              break;
          }
          this.loading_dialog = false;
          mux.Util.showAlert('입고 ' + phase + ' 완료', '완료', 3000);

          //메일 알림 관련
          let mailTo = [];
          let creater = this.$cookies.get(this.$configJson.cookies.id.key);
          let reject_info;
          if(phase === '확인'){
            mailTo.push(creater);
            mailTo.push(item.approver_id);
          }else if(phase === '승인'){
            mailTo.push(creater);
            if(creater !== item.checker_id){
              mailTo.push(item.checker_id);
            }
          }else if(phase === '확인 반려'){
            mailTo.push(creater);
            reject_info=`
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려자</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${send_data.rejecter}</td>
              </tr>
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려일</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${send_data.rejected_date}</td>
              </tr>
            `
          }else if(phase === '승인 반려'){
            mailTo.push(creater);
            mailTo.push(item.checker_id);
            reject_info=`
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려자</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${send_data.rejecter}</td>
              </tr>
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려일</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${send_data.rejected_date}</td>
              </tr>
            `
          }

          // 메일 본문 내용
          let content=`
          <html>
            <body>
              <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                <h2 style="text-align: center; color:#13428a">입고 ${phase} 처리 알림</h2>
                <table style="width: 100%;border-spacing: 10px 10px;">
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">발주 번호</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.order_code}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">입고 일자</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.inbound_date}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.$cookies.get(this.$configJson.cookies.name.key).trim()}</td>
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
                <a style="color: white; text-decoration:none"href="${prevURL}?order_code=${item.order_code}&inbound_date=${item.inbound_date}">
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
              mailTo: mailTo,
              subject: "입고 " + phase + " 처리 알림",
              content: content
            });
            if (prevURL !== window.location.href) return;
            if(sendEmailAlam['code'] == 0){
              console.log(sendEmailAlam['message']);
            } else {
              if (prevURL !== window.location.href) return;
              mux.Util.showAlert(sendEmailAlam['failed_info']);
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
              mux.Util.showAlert(error.response['data']['failed_info'].msg);
            else
              mux.Util.showAlert(error);
          }
        } else {
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(resultInbound['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
      // console.log(JSON.stringify(this.change_approve));
    },
    async setCanclePhase(item, change, reason){
      const currDate = new Date();
      const prevURL = window.location.href;
      let phase;
      let send_data = {};
      let send_data_belong = {};
      send_data.code = item.code;
      // 현 승인 상태에 따른 필요 정보 정리
      if(item.approval_phase === '취소 미확인'){
        if(change === true){
          send_data.checked_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
          send_data.approval_phase = '취소 미승인';
          phase = '취소 확인';
        }else{
          if(reason === ''){
            mux.Util.showAlert('취소 반려 사유 필수 기입');
            return;
          }else{
            send_data.reject_reason = reason;
            send_data.rejecter = this.login_info.name;
            send_data.rejected_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
            send_data.approval_phase = '취소 반려';
            phase = '취소 확인 반려';
          }
        }
      }else if(item.approval_phase === '취소 미승인'){
        if(change === true){
          send_data.approved_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
          send_data.approval_phase = '취소';
          send_data_belong = item.belong_data
          console.log(send_data_belong);
          phase = '취소 승인';
        }else{
          if(reason === ''){
            mux.Util.showAlert('취소 반려 사유 필수 기입');
            return;
          }else{
            send_data.reject_reason = reason;
            send_data.rejecter = this.login_info.name;
            send_data.rejected_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
            send_data.approval_phase = '취소 반려';
            phase = '취소 승인 반려';
          }
        }
      }

      console.log(phase);

      let sendData = {};

      //취소 미승인에서 취소로 변경하는 경우
      if(send_data_belong.length > 0){
        for (let i = 0; i < send_data_belong.length; i++) {
          const belong = send_data_belong[i];

          let insert_product_data = [];
          let update_stock_data = [];
          // product_code기준 재고(자재)검색
          let stock_check = await mux.Server.post({
            path: '/api/common_rest_api/',
            params: [
              {
                "product_table.product_code": belong.product_code,
                "module_table.module_code": belong.product_code,
                "material_table.material_code": belong.product_code,
                "material_table.directly_written": 0,
                "stock_table.spot": belong.spot
              }
            ],
            "script_file_name": "rooting_재고_검색_24_05_07_11_46_16P.json",
            "script_file_path": "data_storage_pion\\json_sql\\stock\\1_재고검색\\재고_검색_24_05_07_11_46_H8D"
          });
          if (prevURL !== window.location.href) return;

          if (typeof stock_check === 'string'){
            stock_check = JSON.parse(stock_check);
          }
          if(stock_check['code'] == 0){
            let searched_stock_data = [];
            if(stock_check['data'].length > 0){
              searched_stock_data = stock_check['data'][0]
            }
            if(belong.product_code === searched_stock_data._code && belong.spot === searched_stock_data.spot){
              let minus_stock = Number(searched_stock_data.stock_num) - Number(belong.inbound_num.replace(/,/g,''));
              update_stock_data.push({
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data": {
                  "stock_num" : minus_stock
                },
                "update_where": {"product_code": belong.product_code, "spot": belong.spot},
                "rollback": "yes"
              })
            }
            insert_product_data.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                  "code" : item.code,
                  "type" : belong.type,
                  "classification" : belong.classification,
                  "product_code" : belong.product_code,
                  "name" : belong.name,
                  "inbound_num" : '-' + belong.inbound_num.replace(/,/g,''),
                  "spot" : belong.spot,
                  "spec" : belong.spec,
                  "model" : belong.model,
                  "manufacturer" : belong.manufacturer,
                  "unit_price" : belong.unit_price.replace(/,/g,'').replace(/₩ /g,''),
                  "ship_code" : belong.ship_code,
              },
              "select_where": {"product_code": "!JUST_INSERT!"},
              "rollback": "no"
            })

            sendData["inbound_product_table-insert"] = insert_product_data;
            sendData["stock_table-update"] = update_stock_data;
          }
        }

      }


      sendData["inbound_confirmation_table-update"] = [{
        "user_info": {
          "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
          "role": "modifier"
        },
        "data": send_data,
        "update_where": {"code": item.code},
        "rollback": "yes"
      }];
      console.log(sendData);

      try {
        this.loading_dialog = true;
        let resultInbound = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: sendData
        });
        if (prevURL !== window.location.href) return;

        if (typeof resultInbound === 'string'){
          resultInbound = JSON.parse(resultInbound);
        }
        if(resultInbound['code'] == 0){
          let minus_send_product_data = [];
          item.approval_phase = send_data.approval_phase;
          switch (item.approval_phase) {
            case '취소 미승인':
              item.checked_date = send_data.checked_date;
              break;
            case '취소 반려':
              item.reject_reason = send_data.reject_reason;
              item.rejecter = send_data.rejecter;
              item.rejected_date = send_data.rejected_date;
              break;
            case '취소 승인':
              item.approved_date = send_data.approved_date;
              minus_send_product_data = JSON.parse(JSON.stringify(item.belong_data));
              minus_send_product_data.forEach(data => {
                data.inbound_num = '-' + data.inbound_num;
                data.inbound_price = '₩ ' + Number(data.unit_price.replace(/,/g,'').replace(/₩ /g,'') * data.inbound_num.replace(/,/g,'')).toLocaleString();
                item.belong_data.push(data);
              });
              break;

            default:
              break;
          }

          this.loading_dialog = false;
          mux.Util.showAlert('입고 ' + phase + ' 완료', '완료', 3000);

          //메일 알림 관련
          let mailTo = [];
          let creater = this.$cookies.get(this.$configJson.cookies.id.key);
          let reject_info;
          if(phase === '취소 확인'){
            mailTo.push(creater);
            mailTo.push(item.approver_id);
          }else if(phase === '취소 승인'){
            mailTo.push(creater);
            if(creater !== item.checker_id){
              mailTo.push(item.checker_id);
            }
          }else if(phase === '취소 확인 반려'){
            mailTo.push(creater);
            reject_info=`
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려자</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${send_data.rejecter}</td>
              </tr>
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려일</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${send_data.rejected_date}</td>
              </tr>
            `
          }else if(phase === '취소 승인 반려'){
            mailTo.push(creater);
            mailTo.push(item.checker_id);
            reject_info=`
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려자</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${send_data.rejecter}</td>
              </tr>
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려일</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${send_data.rejected_date}</td>
              </tr>
            `
          }

          // 메일 본문 내용
          let content=`
            <html>
              <body>
                <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                  <h2 style="text-align: center; color:#13428a">입고 ${phase} 처리 알림</h2>
                  <table style="width: 100%;border-spacing: 10px 10px;">
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">발주 번호</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.order_code}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">입고 일자</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.inbound_date}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.$cookies.get(this.$configJson.cookies.name.key).trim()}</td>
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
                  <a style="color: white; text-decoration:none"href="${prevURL}?order_code=${item.order_code}&inbound_date=${item.inbound_date}">
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
              mailTo: mailTo,
              subject: "입고 " + phase + " 처리 알림",
              content: content
            });
            if (prevURL !== window.location.href) return;
            if(sendEmailAlam['code'] == 0){
              console.log(sendEmailAlam['message']);
            } else {
              if (prevURL !== window.location.href) return;
              mux.Util.showAlert(sendEmailAlam['failed_info']);
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
              mux.Util.showAlert(error.response['data']['failed_info'].msg);
            else
              mux.Util.showAlert(error);
          }
        } else {
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(resultInbound['failed_info']);
        }
      } catch (error) {
        this.loading_dialog = false;
        if (prevURL !== window.location.href) return;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
      // console.log(JSON.stringify(this.change_approve));
    },
    async cancleApprove(item){
      // console.log(item)
      const currDate = new Date();

      const prevURL = window.location.href;
      let send_confirmation_data = {}
      let send_product_data = {}

      if(this.login_info.id === item.approver_id){
        send_confirmation_data.approval_phase = '취소';
        send_confirmation_data.approved_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
        send_product_data = item.belong_data;
      }else if(this.login_info.id === item.checker_id){
        send_confirmation_data.approval_phase = "취소 미승인";
        send_confirmation_data.approved_date = null;
      }else{
        send_confirmation_data.approval_phase = "취소 미확인";
        send_confirmation_data.checked_date = null;
        send_confirmation_data.approved_date = null;
      }

      let sendData = {};

      if(send_product_data.length > 0){
        for (let i = 0; i < send_product_data.length; i++) {
          const product = send_product_data[i];

          let insert_product_data = [];
          let update_stock_data = [];
          // product_code기준 재고(자재)검색
          let stock_check = await mux.Server.post({
            path: '/api/common_rest_api/',
            params: [
              {
                "product_table.product_code": product.product_code,
                "module_table.module_code": product.product_code,
                "material_table.material_code": product.product_code,
                "material_table.directly_written": 0,
                "stock_table.spot": product.spot
              }
            ],
            "script_file_name": "rooting_재고_검색_24_05_07_11_46_16P.json",
            "script_file_path": "data_storage_pion\\json_sql\\stock\\1_재고검색\\재고_검색_24_05_07_11_46_H8D"
          });
          if (prevURL !== window.location.href) return;

          if (typeof stock_check === 'string'){
            stock_check = JSON.parse(stock_check);
          }
          if(stock_check['code'] == 0){
            let searched_stock_data = [];
            if(stock_check['data'].length > 0){
              searched_stock_data = stock_check['data'][0]
            }
            if(product.product_code === searched_stock_data._code && product.spot === searched_stock_data.spot){
              let minus_stock = searched_stock_data.stock_num - product.inbound_num.replace(/,/g,'');
              update_stock_data.push({
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data": {
                  "stock_num" : minus_stock
                },
                "update_where": {"product_code": product.product_code, "spot": product.spot},
                "rollback": "yes"
              })
            }
            insert_product_data.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                  "code" : item.code,
                  "type" : product.type,
                  "classification" : product.classification,
                  "product_code" : product.product_code,
                  "name" : product.name,
                  "inbound_num" : '-' + product.inbound_num.replace(/,/g,''),
                  "spot" : product.spot,
                  "spec" : product.spec,
                  "model" : product.model,
                  "manufacturer" : product.manufacturer,
                  "unit_price" : product.unit_price.replace(/,/g,'').replace(/₩ /g,''),
                  "ship_code" : product.ship_code,
              },
              "select_where": {"product_code": "!JUST_INSERT!"},
              "rollback": "no"
            })

            sendData["inbound_product_table-insert"] = insert_product_data;
            sendData["stock_table-update"] = update_stock_data;
          }
        }

      }

      sendData["inbound_confirmation_table-update"] = [{
        "user_info": {
          "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
          "role": "modifier"
        },
        "data": send_confirmation_data,
        "update_where": {"code": item.code},
        "rollback": "yes"
      }];

      try {
        this.loading_dialog = true;
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: sendData
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0){
          let minus_send_product_data = [];
          item.approval_phase = send_confirmation_data.approval_phase;
          switch (send_confirmation_data.approval_phase) {
            case '취소':
              item.approved_date = send_confirmation_data.approved_date;
              minus_send_product_data = JSON.parse(JSON.stringify(item.belong_data));
              minus_send_product_data.forEach(data => {
                data.inbound_num = '-' + data.inbound_num;
                data.inbound_price = '₩ ' + Number(data.unit_price.replace(/,/g,'').replace(/₩ /g,'') * data.inbound_num.replace(/,/g,'')).toLocaleString();
                item.belong_data.push(data);
              });
              break;
            case '취소 미승인':
              item.approved_date = null;
              break;
            case '취소 미확인':
              item.checked_date = null;
              item.approved_date = null;
              break;

            default:
              break;
          }

          mux.Util.showAlert(send_confirmation_data.approval_phase === '취소' ? '취소 완료' : '취소 요청 완료', '완료', 3000);
          this.loading_dialog = false;

          //메일 알림 관련
          let mailTo = [];
          let creater = this.$cookies.get(this.$configJson.cookies.id.key);
          let phase;
          if(send_confirmation_data.approval_phase === '취소'){
            mailTo.push(creater);
            if(creater !== item.checker_id){
              mailTo.push(item.checker_id);
            }
            phase = '취소 처리'
          }else if(send_confirmation_data.approval_phase === '취소 미승인'){
            mailTo.push(item.approver_id);
            phase ='취소 승인 요청'
          }else if(send_confirmation_data.approval_phase === '취소 미확인'){
            mailTo.push(item.checker_id);
            phase ='취소 확인 요청'
          }

          // 메일 본문 내용
          let content=`
            <html>
              <body>
                <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                  <h2 style="text-align: center; color:#13428a">입고 ${phase} 알림</h2>
                  <table style="width: 100%;border-spacing: 10px 10px;">
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">발주 번호</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.order_code}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">입고 일자</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.inbound_date}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.$cookies.get(this.$configJson.cookies.name.key).trim()}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">확인자</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.checker}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">승인자</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.approver}</td>
                    </tr>
                  </table>
                  <a style="color: white; text-decoration:none"href="${prevURL}?order_code=${item.order_code}&inbound_date=${item.inbound_date}">
                    <p style="cursor:pointer; background: #13428a;color: white;font-weight: bold;padding: 13px;border-radius: 40px;font-size: 16px;text-align: center;margin-top: 25px; margin-bottom: 40px;">
                      확인하기
                    </p>
                  </a>
                </div>
              </body>
            </html>
          `;

          // 메일 알림 요청 정보

          try {
            let sendEmailAlam = await mux.Server.post({
              path: '/api/send_email/',
              mailTo: mailTo,
              subject: "입고 " + phase + " 알림",
              content: content
            });
            if (prevURL !== window.location.href) return;
            if(sendEmailAlam['code'] == 0){
              console.log(sendEmailAlam['message']);
            } else {
              if (prevURL !== window.location.href) return;
              mux.Util.showAlert(sendEmailAlam['failed_info']);
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
              mux.Util.showAlert(error.response['data']['failed_info'].msg);
            else
              mux.Util.showAlert(error);
          }
        } else {
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(result['failed_info']);
        }
      } catch (error) {
        this.loading_dialog = false;
        if (prevURL !== window.location.href) return;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
      console.log('sendData :: ' + JSON.stringify(sendData))
    },
  },
}
</script>

<style lang="">

</style>


