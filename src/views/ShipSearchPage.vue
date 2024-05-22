<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productMenu="true" :shipMenu="true"></NavComponent>

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
                    :headers="ship_approve_headers"
                    :items="ship_approve_data"
                    item-key="product_code"
                    approval="ship"
                    dense
                    @clickTr="clickApproveData"
                    @setApprovalPhase="setApprovalPhase"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-main>

    <ModalDialogComponent
      :dialog-value="ship_product_list_dialog"
      max-width="70%"
      title-class=" "
      :dialog-transition="'slide-x-transition'"
      :dialog-custom="'custom-dialog elevation-0 white'"
      :card-elevation="'0'"
      @close="closeProductList"
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="phase_check ? ship_approved_product_list_headers : ship_product_list_headers"
              :items="ship_product_list_data"
              item-key="product_code"
              class="elevation-1"
              dense
            >
              <template v-slot:[`item.ship_num`] = "{ item }">
                <span :class="!phase_check && item.ship_num > item.stock_num ? 'red--text font-weight-bold' : ''">
                  {{ item.ship_num }}
                </span>
              </template>
              <template v-slot:[`item.stock_num`] = "{ item }">
                <span :class="item.ship_num > item.stock_num ? 'red--text font-weight-bold' : ''">
                  {{ item.stock_num }}
                </span>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0">
            <table style="width:100%">
              <tr>
                <td class="approve_title" style="width:15%">비고</td>
                <td class="approve_text" style="width:85%">
                  {{  ship_info_data.note }}
                </td>
              </tr>
            </table>
          </v-col>
        </v-row>
        <v-row>

          <v-col cols="12" sm="4" v-if="ship_info_data.inspection_report">
            <p class="font-weight-bold primary--text mb-0">▼ 시험성적서</p>
            <iframe width="100%" style="height:450px" :src="'https://mkorbucket-public.s3.ap-northeast-2.amazonaws.com/'+ship_info_data.inspection_report"></iframe>
          </v-col>
          <v-col cols="12" sm="4" v-if="ship_info_data.files">
            <p class="font-weight-bold primary--text mb-0">▼ 기타 첨부</p>
            <v-chip
             color="grey lighten-2"
             class="ma-2"
              v-for="(file, i) in ship_info_data.files"
              :key="i"
              :src="'https://mkorbucket-public.s3.ap-northeast-2.amazonaws.com/'+file"
            >
              {{ file }}
            </v-chip>
          </v-col>
        </v-row>
      </v-container>
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
import ShipSearchPageConfig from "@/configure/ShipSearchPageConfig.json";
import CheckPagePermission from "@/common_js/CheckPagePermission";
import mux from "@/mux";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=ShipSearchPage')],
  components: {
                NavComponent,
                DataTableComponent,
                ModalDialogComponent,
                CardComponent,
                InputsFormComponent,
                LoadingModalComponent,
              },
  mounted(){
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
    // this.closeAll()
  },
  data(){
    return{
      today:'',
      menu: false,
      dates: [],
      ship_product_list_dialog: false,
      loading_dialog: false,
      phase_check:false,

      ship_info_data:{},
      ship_product_list_data:[],

      change_approve:true,
      stock_info:[],

      login_info: ShipSearchPageConfig.login_info,
      searchCardInputs:ShipSearchPageConfig.searchCardInputs,
      ship_approve_headers:ShipSearchPageConfig.ship_approve_headers,
      ship_product_list_headers:ShipSearchPageConfig.ship_product_list_headers,
      ship_approved_product_list_headers:ShipSearchPageConfig.ship_approved_product_list_headers,
      ship_approve_data:[],
    }
  },

  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  },
  watch:{
    ship_product_list_dialog(val){
      val || this.closeProductList()
    },
    ship_approve_data(newData){
      console.log(newData)
      this.ship_approve_data = newData
    }
  },
  created () {
    this.initialize()
  },
  methods:{
    async initialize () {
      this.today = new Date();
      const prevURL = window.location.href;
      try {
        // console.log('사용자 계정 정보 가졍오기');
        // let result = await mux.Server.get({
        //   path: '/api/user/',
        // });
        if (prevURL !== window.location.href) return;
        // console.log('result :>> ', result);
        this.login_info.name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.login_info.email = this.$cookies.get(this.$configJson.cookies.email.key);
      } catch (error) {
        if (prevURL !== window.location.href) return;
        alert(error);
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
    async searchButton(){
      this.loading_dialog = true;

      let searchApprovalPhase = this.searchCardInputs.find(x=>x.label === '승인').value;
      if (searchApprovalPhase === 'All')
        searchApprovalPhase = '';

      let searchProjectCode = this.searchCardInputs.find(x=>x.label === '프로젝트').value;
      if (searchProjectCode)
      searchProjectCode = searchProjectCode.trim();

      let searchProductCode = this.searchCardInputs.find(x=>x.label === '관리코드').value;
      if (searchProductCode)
      searchProductCode = searchProductCode.trim();

      let searchProductName = this.searchCardInputs.find(x=>x.label === '제품명').value;
      if (searchProductName)
      searchProductName = searchProductName.trim();

      let searchPurpose = this.searchCardInputs.find(x=>x.label === '출고목적').value;
      if (searchPurpose)
      searchPurpose = searchPurpose.trim();

      let searchShipDate = this.searchCardInputs.find(x=>x.label === '출고 요청일').value;
      let searchShipStartDate = searchShipDate[0];
      let searchShipEndDate = searchShipDate[1];


      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/sample_rest_api/',
          params: [
            {
              "ship_confirmation_table.approval_phase": searchApprovalPhase ? searchApprovalPhase : "",
              "ship_confirmation_table.ship_date_start_date": searchShipStartDate ? searchShipStartDate : "",
              "ship_confirmation_table.ship_date_end_date": searchShipEndDate ? searchShipEndDate : "",
              "ship_product_table.product_code": searchProductCode ? searchProductCode : "",
              "ship_product_table.name": searchProductName ?  searchProductName : "",
              "ship_confirmation_table.project_code": searchProjectCode ? searchProjectCode : "",
              "ship_confirmation_table.purpose": searchPurpose ? searchPurpose : ""
            }
          ],
          "script_file_name": "rooting_출하_검색_24_05_22_10_49_FBE.json",
          "script_file_path": "data_storage_pion\\json_sql\\ship\\출하_검색_24_05_22_10_49_WDH"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0){
          this.ship_approve_data  = result.data
              this.loading_dialog = false;
        }else{
          alert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          alert(error.response['data']['failed_info'].msg);
        else
          alert(error);
      }
    },
    closeProductList(){
      this.ship_product_list_dialog = false;
    },
    clickApproveData(item){
      if(item.approval_phase == '승인'){
        this.phase_check = true;
      }else{
        this.phase_check = false;
      }
      let belong_datas = item.belong_data

      this.loading_dialog = false;
      this.ship_product_list_dialog = true;
      this.ship_product_list_data = [];
      this.ship_info_data = {};
      belong_datas.forEach(data =>{
        data.ship_price = data.unit_price * data.ship_num;
        this.ship_product_list_data.push(data);
      })
      let file_name = item.files.split('/');
      if(!file_name[0]){
        file_name = ""
      }
      this.ship_info_data = {
        inspection_report : item.inspection_report,
        note: item.note,
        files: file_name,
      }
    },
    async setApprovalPhase(item, change, reason){
      const prevURL = window.location.href;

      let phase;
      let send_data = {};
      let send_data_belong = {};
      send_data.code = item.code;
      // 현 승인 상태에 따른 필요 정보 정리
      if(item.approval_phase === '미확인'){
        if(change === true){
          send_data.checked_date = mux.Date.format(this.today, 'yyyy-MM-dd HH:mm:ss');
          send_data.approval_phase = '미승인';
          phase = '확인';
        }else{
          if(reason === ''){
            alert('반려 사유 필수 기입');
          }else{
            send_data.reject_reason = reason;
            send_data.rejecter = this.login_info.name;
            send_data.rejected_date = mux.Date.format(this.today, 'yyyy-MM-dd HH:mm:ss');
            send_data.approval_phase = '반려';
            phase = '반려';
          }
        }
      }else if(item.approval_phase === '미승인'){
        if(change === true){
          send_data.approved_date = mux.Date.format(this.today, 'yyyy-MM-dd HH:mm:ss');
          send_data.approval_phase = '승인';
          send_data_belong = item.belong_data
          console.log(send_data_belong);
          phase = '승인';
        }else{
          if(reason === ''){
            alert('반려 사유 필수 기입');
          }else{
            send_data.reject_reason = reason;
            send_data.rejecter = this.login_info.name;
            send_data.rejected_date = mux.Date.format(this.today, 'yyyy-MM-dd HH:mm:ss');
            send_data.approval_phase = '반려';
            phase = '반려';
          }
        }
      }
      console.log(phase);

      // 미승인에서 승인으로 변경하는 경우
      if(send_data_belong.length > 0){

        send_data_belong.forEach(async belong => {
          let stock_check = await mux.Server.post({
            path: '/api/sample_rest_api/',
            params: [
              {
                "product_table.product_code": belong.product_code,
                "module_table.module_code": belong.product_code,
                "material_table.material_code": belong.product_code,
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
            let update_stock_data = [];
            let searched_stock_data = [];
            if(stock_check['data'].length > 0){
              searched_stock_data = stock_check['data'][0]
            }
              let minus_stock = searched_stock_data.stock_num - belong.ship_num;
                update_stock_data.push({
                  "user_info": {
                    "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                    "role": "modifier"
                  },
                  "data":{
                    "stock_num": minus_stock
                  },
                  "update_where": {"product_code": belong.product_code, "spot": belong.spot},
                  "rollback": "yes"
                });
              let sendItemData = {};
              sendItemData["stock_table-update"] = update_stock_data;

              console.log("sendItemData ::: " + sendItemData);
              try {
                let resultItem = await mux.Server.post({
                  path: '/api/sample_rest_api/',
                  params: sendItemData
                });
                if (prevURL !== window.location.href) return;

                if (typeof resultItem === 'string'){
                  resultItem = JSON.parse(resultItem);
                }
                if(resultItem['code'] == 0){
                  console.log('result :>> ', resultItem);
                } else {
                  if (prevURL !== window.location.href) return;
                  alert(resultItem['failed_info']);
                }
              } catch (error) {
                if (prevURL !== window.location.href) return;
                if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
                  alert(error.response['data']['failed_info'].msg);
                else
                  alert(error);
              }

              let sendApproveData = {
                "ship_confirmation_table-update": [{
                  "user_info": {
                    "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                    "role": "modifier"
                  },
                  "data": send_data,
                  "update_where": {"code": item.code},
                  "rollback": "yes"
                }]
              };
              console.log(sendApproveData);

              try {
                let resultShip = await mux.Server.post({
                  path: '/api/sample_rest_api/',
                  params: sendApproveData
                });
                if (prevURL !== window.location.href) return;

                if (typeof resultShip === 'string'){
                  resultShip = JSON.parse(resultShip);
                }
                if(resultShip['code'] == 0){
                  console.log('result :>> ', resultShip);
                } else {
                  if (prevURL !== window.location.href) return;
                  alert(resultShip['failed_info']);
                }
              } catch (error) {
                if (prevURL !== window.location.href) return;
                if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
                  alert(error.response['data']['failed_info'].msg);
                else
                  alert(error);
              }
          }
        })
        alert('출고 승인 완료')
      }else{
        let sendData = {
          "ship_confirmation_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data": send_data,
            "update_where": {"code": item.code},
            "rollback": "yes"
          }]
        };
        console.log(sendData);

        try {
          let resultShip = await mux.Server.post({
            path: '/api/sample_rest_api/',
            params: sendData
          });
          if (prevURL !== window.location.href) return;

          if (typeof resultShip === 'string'){
            resultShip = JSON.parse(resultShip);
          }
          if(resultShip['code'] == 0){
            alert('출고 ' + phase + ' 완료');
          } else {
            if (prevURL !== window.location.href) return;
            alert(resultShip['failed_info']);
          }
        } catch (error) {
          if (prevURL !== window.location.href) return;
          if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
            alert(error.response['data']['failed_info'].msg);
          else
            alert(error);
        }
      }




    }
  },
}
</script>
<style>
</style>
