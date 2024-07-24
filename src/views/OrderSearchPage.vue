<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :purchaseMenu="true"></NavComponent>

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
              @enter="searchButton"
            >
              <!-- <v-col
                cols="12"
                sm="4"
                lg="3"
                align-self="center"
              >
                <v-radio-group
                  hide-details
                  v-model="code_criterion"
                  class="mt-0"
                  row
                >
                  <v-radio
                    label="프로젝트 기준"
                    value="project"
                  ></v-radio>
                  <v-radio
                    label="발주 기준"
                    value="order"
                  ></v-radio>
                </v-radio-group>
              </v-col> -->
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

          <div>

            <v-radio-group
              v-show="criterion"
              hide-details
              v-model="code_criterion"
              class="mt-7"
              row
            >
              <v-radio
                label="프로젝트 기준"
                value="project"
              ></v-radio>
              <v-radio
                label="발주 기준"
                value="order"
              ></v-radio>
            </v-radio-group>
            <ExpansionPanelComponent
              v-if="code_criterion === 'project'"
              :data="project_code_criterion_data"
              elevation="1"
              class="mt-5"
              multiple>

              <template v-slot:header="{ data }">
                <p
                  class=" mb-0"
                  item-align-center
                >
                  <span class="text-h6 font-weight-black">{{ data.project_code }}</span>
                </p>
              </template>
              <template v-slot:content="{ data }">
                <v-divider class="mb-4"></v-divider>
                <v-row>
                  <v-col
                    cols="12"
                  >
                    <v-btn
                      small
                      color="default"
                      class="mr-2"
                    >일괄 승인</v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <DataTableComponent
                      :headers="project_code_data_headers"
                      :items="data.belong_data"
                      :item-key="data.belong_data.order_company"
                      approval="inbound"
                      dense
                      :loginId="login_info.id"
                      @clickTr="clickApproveData"
                      @setApprovalPhase="setApprovalPhase"
                      @cancleApprove="cancleApprove"
                      @setCanclePhase="setCanclePhase"
                    />
                  </v-col>
                </v-row>
              </template>
            </ExpansionPanelComponent>
          </div>
          <div
            v-if="code_criterion === 'order'"
          >
            <ExpansionPanelComponent
              :data="order_code_criterion_data"
              elevation="1"
              class="mt-5"
              multiple>

              <template v-slot:header="{ data }">
                <p
                  class=" mb-0"
                  item-align-center
                >
                  <span class="text-h6 font-weight-black">{{ data.order_code }} ({{ data.order_company }})</span>
                </p>
              </template>
              <template v-slot:content="{ data }">
                <v-divider class="mb-4"></v-divider>
                <v-row>
                  <v-col
                    cols="12"
                  >
                    <!-- <v-btn
                      small
                      color="default"
                      class="mr-2"
                    >일괄 승인</v-btn> -->
                    <v-chip
                      small
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                    >
                      승인
                    </v-chip>
                    <v-btn
                      small
                      color="default"
                      class="ml-2"
                      @click="clickApproveData"
                    >상세 보기</v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <DataTableComponent
                      :headers="order_code_data_headers"
                      :items="data.belong_data"
                      :item-key="data.belong_data.project_code"
                      approval="order"
                      dense
                      :loginId="login_info.id"
                      @clickTr="clickApproveData"
                      @setApprovalPhase="setApprovalPhase"
                      @cancleApprove="cancleApprove"
                      @setCanclePhase="setCanclePhase"
                    />
                  </v-col>
                </v-row>
              </template>
            </ExpansionPanelComponent>
          </div>
        </v-col>
      </v-row>
    </v-main>

    <ModalDialogComponent
      :dialog-value="order_detail_dialog"
      max-width="50%"
      title-class=" "
      :dialog-transition="'slide-x-transition'"
      :dialog-custom="'custom-dialog elevation-0 white'"
      :card-elevation="'0'"
      @close="closeProductList"
    >
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-btn small color="default" @click="orderPurchase ? orderPurchase = false :orderPurchase = true">발주서 {{ orderPurchase ? '접기' : '펼치기'}}</v-btn>


          <v-menu offset-x
            v-if="orderPurchase"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="success"
                class="mx-3"
                fab
                x-small
                elevation="1"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small>mdi-content-save</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                dense
                @click="printInboundApprove('발주서')"
              >
                <v-list-item-title>PDF</v-list-item-title>
              </v-list-item>
              <v-list-item
                dense
                @click="printInboundApprove()"
              >
                <v-list-item-title>출력</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn
            v-if="orderPurchase"
            color="primary"
            elevation="0"
            fab
            x-small
            @click="mailDialog = true"
          >
            <v-icon >mdi-email</v-icon>
          </v-btn>
        </v-col>
        <v-col
          v-if="orderPurchase"
          cols="12"
          class="pa-4"
          style="border: 1px solid #c3c3c3;"
        >
          <orderPurchaseComponent
            ref="orderPurchaseComponent"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12">
          <v-col cols="12">
            <p class="font-weight-bold primary--text mb-0" style="font-size: 18px;">
              발주 상세 내역
            </p>
            <DataTableComponent
              :headers="order_detail_headers"
              :items="order_detail_data"
              dense
            />
          </v-col>
          <v-divider class="my-4"></v-divider>
          <v-col cols="12">
            <p class="font-weight-bold primary--text mb-0" style="font-size: 18px;">
              <v-btn
                color="primary"
                x-small
                elevation="0"
                @click="openUploadFilesDialog(orderCompanyFiles, false)"
              >
                관리
              </v-btn>
              발주 업체 관련 첨부
            </p>
            <v-chip v-for="(type, i) in orderCompanyFiles" :key="i"
              color="grey lighten-2"
              class="ma-2 ml-0"
            >
              {{ type }}
            </v-chip>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12">
            <p class="font-weight-bold primary--text mb-0" style="font-size: 18px;">
              <v-btn
                color="primary"
                x-small
                elevation="0"
                @click="openUploadFilesDialog('계산서', billNum)"
              >
                관리
              </v-btn>
              계산서
            </p>
            <v-chip v-for="idx in billNum" :key="idx"
              color="grey lighten-2"
              class="ma-2 ml-0"
            >
              {{ idx }}차 계산서
            </v-chip>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12">
            <p class="font-weight-bold primary--text mb-0" style="font-size: 18px;">
              <v-btn
                color="primary"
                x-small
                elevation="0"
                @click="openUploadFilesDialog('송금 확인증', billNum)"
              >
                관리
              </v-btn>
              송금 확인증
            </p>
            <v-chip v-for="idx in billNum" :key="idx"
              color="grey lighten-2"
              class="ma-2 ml-0"
            >
              {{ idx }}차 송금 확인증
            </v-chip>
            <v-btn
              color="success"
              small
              elevation="0"
              @click="completeOrder"
            >
              구매 완료
            </v-btn>
          </v-col>
        </v-col>
      </v-row>
    </v-container>
    </ModalDialogComponent>

    <v-dialog
      v-model="mailDialog"
      persistent
      max-width="1000px"
    >
      <!-- <MailFormComponent
        v-model="files"
        addSystemFiles="order"
        addCardClass="d-none"
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
            @click="test(), mailDialog = false"
          >
            발송
          </v-btn>
        </v-card-actions>
      </MailFormComponent> -->

      <v-form ref="mailForm">
        <MailFormComponent
          ref="mailFormComponent"
          v-model="mailData"
          addCardClass="d-none"
          addSystemFiles="order"
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

    <ModalDialogComponent
      :dialog-value="uploadFilesDialog"
      max-width="550px"
      title-class="display-none"
      text-class="pb-0"
      closeText="취소"
      saveText="저장"
      :persistent="true"
      @close="uploadFilesDialog = false"
      @save="uploadProductInfo"
    >
      <CardComponent
        elevation="0"
        text-class="pa-0 pt-4"
        title-class="pa-0"
      >
        <div slot="cardTitle">
          <span>파일 관리</span>
        </div>
        <InputsFormComponent
          slot="cardText"
          dense
          clearable
          filled
          hide-details
          :inputs="uploadFilesInputs"
        >
        </InputsFormComponent>
      </CardComponent>
    </ModalDialogComponent>
    <ModalDialogComponent
      :dialog-value="orderPurchaseDialog"
      max-width="900px"
      title-class="display-none"
      text-class="pb-0"
      :persistent="true"
    >
      <orderPurchaseComponent
      ref="orderPurchaseComponent"
      />
      <div style="position: sticky; bottom: 60px;">
        <p style="text-align: right;">
          <v-menu offset-x>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="success"
                fab
                x-small
                elevation="1"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small>mdi-content-save</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                dense
                @click="printInboundApprove('발주서')"
              >
                <v-list-item-title>PDF</v-list-item-title>
              </v-list-item>
              <v-list-item
                dense
                @click="printInboundApprove()"
              >
                <v-list-item-title>출력</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </p>
        <p style="text-align: right;">
          <v-btn
            color="primary"
            elevation="0"
            fab
            x-small
            @click="mailDialog = true"
          >
            <v-icon >mdi-email</v-icon>
          </v-btn>
        </p>
        <p style="text-align: right;">
          <v-btn
            fab
            color="blue-grey darken-1"
            x-small
            class="white--text"
            elevation="1"
            @click="orderPurchaseDialog=false"
          >
            <v-icon> mdi-close-thick </v-icon>
          </v-btn>
        </p>
      </div>
    </ModalDialogComponent>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import DataTableComponent from "@/components/DataTableComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import LoadingModalComponent from "@/components/LoadingModalComponent.vue";
import orderPurchaseComponent from "@/components/orderPurchaseComponent.vue";
import MailFormComponent from "@/components/MailFormComponent.vue";
import ExpansionPanelComponent from "@/components/ExpansionPanelComponent.vue";
import OrderSearchPageConfig from "@/configure/OrderSearchPageConfig.json";
import CheckPagePermission from "@/common_js/CheckPagePermission";
import mux from "@/mux";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=OrderSearchPage')],
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
                orderPurchaseComponent,
                MailFormComponent,
                ExpansionPanelComponent,
              },
  data(){
    return{
      mux: mux,
      billNum:3,
      dates: [],
      criterion: false,
      orderPurchase: false,
      order_detail_dialog: false,
      loading_dialog: false,
      mailDialog: false,
      uploadFilesDialog: false,
      tab_search: null,
      setPurchase: false,
      receivingInspectionThumbnail: '',
      inspectionReportThumbnail: '',
      uploadFilesTitle: '',
      code_criterion: 'project',

      inbound_info_data:{},
      inbound_product_list_data:[],

      change_approve:{},

      searched_products:[],
      uploadFilesInputs: [],

      purchase_member_info:OrderSearchPageConfig.purchase_member_info,
      login_info: OrderSearchPageConfig.login_info,
      searchCardInputs:OrderSearchPageConfig.searchCardInputs,
      setPurchaseInputs:OrderSearchPageConfig.setPurchaseInputs,
      project_code_data_headers:OrderSearchPageConfig.project_code_data_headers,
      order_code_data_headers:OrderSearchPageConfig.order_code_data_headers,
      orderCompanyFiles:OrderSearchPageConfig.orderCompanyFiles,
      order_detail_headers:OrderSearchPageConfig.order_detail_headers,
      bom_list_headers: OrderSearchPageConfig.bom_list_headers,
      bom_list_purchase_headers: OrderSearchPageConfig.bom_list_purchase_headers,
      bom_list_data: OrderSearchPageConfig.bom_list_test_data,
      bom_list_purchase_data: OrderSearchPageConfig.bom_list_purchase_test_data,
      survey_cost_headers: OrderSearchPageConfig.survey_cost_headers,
      labor_cost_headers: OrderSearchPageConfig.labor_cost_headers,
      calc_cost_detail_data: JSON.parse(JSON.stringify(OrderSearchPageConfig.calc_cost_detail_data)),
      // order_approve_data:[],
      order_detail_data: [],
      project_code_criterion_data:[],
      order_code_criterion_data:[],
      defaultMailData: OrderSearchPageConfig.default_mail_data,
    }
  },

  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  },
  watch:{
    order_detail_dialog(val){
      val || this.closeProductList()
      this.mailData = JSON.parse(JSON.stringify(this.defaultMailData));
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
        if (prevURL !== window.location.href) return;
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
      this.criterion = true;
      this.project_code_criterion_data = OrderSearchPageConfig.test_project_code_criterion_data
      this.order_code_criterion_data = OrderSearchPageConfig.test_order_code_criterion_data
      this.loading_dialog = false;
    },
    closeProductList(){
      this.order_detail_dialog = false;
    },
    async clickApproveData(item){
      this.order_detail_dialog = true;
      this.order_detail_data = item.belong_data;
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
              to_addrs: mailTo,
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
              to_addrs: mailTo,
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
              to_addrs: mailTo,
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
    openUploadFilesDialog(type, idx){
      this.uploadFilesDialog = true;
      this.uploadFilesInputs = [];
      if(idx > 0){
        for(let i=1; i<=idx; i++){
          this.uploadFilesInputs.push(
            {"label":i + "차 " + type, "column_name":(type === '계산서' ? 'bill_file_' : 'remittance_file_')+i, "type":"file", "col":"12", "sm":"12", "lg":"12", "icon":"", "appendIcon":"mdi-paperclip"},
          )
        }
      }else{
        for(let i=0; i<type.length; i++){
          this.uploadFilesInputs.push(
            {"label":type[i], "column_name":(type[i] === '통장 사본' ? 'bankbook_copy_file' : (type[i] === '사업자 등록증' ? 'business_registration_file': 'order_confirmation_file'))+idx, "type":"file", "col":"12", "sm":"12", "lg":"12", "icon":"", "appendIcon":"mdi-paperclip"},
          )
        }
      }
    },
    async completeOrder(){
      mux.Util.showAlert('송금 확인증을 1차 이상 등록해주세요.', '확인');
      const confirm = await mux.Util.showConfirm('송금 확인증이 1(혹은 2)차만 등록되었습니다. 구매 완료하시겠습니까?', '구매 완료 확인');
      if (!confirm){
        return;
      }
      mux.Util.showAlert('구매 완료 처리되었습니다.', '완료', 3000);
    }
  },
}
</script>

<style lang="">

</style>


