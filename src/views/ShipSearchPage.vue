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
                    reshipment
                    :loginId="login_info.id"
                    @clickTr="clickApproveData"
                    @setApprovalPhase="setApprovalPhase"
                    @cancleApprove="cancleApprove"
                    @setCanclePhase="setCanclePhase"
                    @addShip="addShip"
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
              :headers="phase_check
                        ? (pricePermission ? ship_approved_product_list_headers : ship_approved_product_list_headers.filter(x => x.value !== 'unit_price' && x.value !== 'ship_price'))
                        : (pricePermission ? ship_product_list_headers : ship_product_list_headers.filter(x => x.value !== 'unit_price' && x.value !== 'ship_price'))"
              :items="ship_product_list_data"
              item-key="product_code"
              class="elevation-1"
              dense
            >
              <template v-slot:[`item.ship_num`] = "{ item }">
                <span :class="!phase_check && item.ship_num > item.stock_num ? 'red--text font-weight-bold' : ''">
                  {{ Number(item.ship_num).toLocaleString() }}
                </span>
              </template>
              <template v-slot:[`item.stock_num`] = "{ item }">
                <span :class="item.ship_num > item.stock_num ? 'red--text font-weight-bold' : ''">
                  {{ Number(item.stock_num).toLocaleString() }}
                </span>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0">
            <table style="width:100%">
              <tr>
                <td class="approve_title" style="width:15%">{{ ship_info_data.approval_phase === '추가 미확인' || ship_info_data.approval_phase === '추가 미승인' ? '추가 사유' : '비고' }} </td>
                <td class="approve_text" style="width:85%">
                  {{  ship_info_data.note }}
                </td>
              </tr>
            </table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4" v-if="ship_info_data.inspection_report_file">
            <p class="font-weight-bold primary--text mb-0">▼ 시험성적서</p>
            <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(inspectionReportThumbnail)"
              transition="scale-transition"
              width="350"
              @click="download('ship/inspection_report', ship_info_data.inspection_report_file, ship_info_data.code+'_')"
              style="cursor: pointer;"
            />
            <!-- <iframe width="100%" style="height:450px" :src="'https://mkorbucket-public.s3.ap-northeast-2.amazonaws.com/'+ship_info_data.inspection_report"></iframe> -->
          </v-col>
          <v-col cols="12" sm="4" v-if="ship_info_data.files">
            <p class="font-weight-bold primary--text mb-0">▼ 기타 첨부</p>
            <v-chip
             color="grey lighten-2"
             class="ma-2"
              v-for="(file, i) in ship_info_data.files"
              :key="i"
              @click="download('ship/files', file, ship_info_data.code+'_')"
            >
              {{ file }}
            </v-chip>
            <!-- <v-chip
             color="grey lighten-2"
             class="ma-2"
              v-for="(file, i) in ship_info_data.files"
              :key="i"
              :src="'https://mkorbucket-public.s3.ap-northeast-2.amazonaws.com/'+file"
            >
              {{ file }}
            </v-chip> -->
          </v-col>
        </v-row>
      </v-container>
    </ModalDialogComponent>

    <ModalDialogComponent
      :dialog-value="reshipment_dialog"
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
            <InputsFormComponent
              dense
              clearable
              filled
              hide-details
              @dateChanged = "dateChangedImport"
              :inputs="reshipmentCardInfoInputs">
              <v-col cols="12" sm="1" align-self="center">
                <v-btn
                  color="primary"
                  @click="reshipmentApprovalRequest"
                >요청</v-btn>
              </v-col>
            </InputsFormComponent>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="pricePermission ? ship_product_list_headers : ship_product_list_headers.filter(x => x.value !== 'unit_price' && x.value !== 'ship_price')"
              :items="ship_product_list_data"
              item-key="product_code"
              class="elevation-1"
              dense
            >
              <template v-slot:[`item.ship_num`] = "{ item }">
                <v-text-field
                  dense
                  hide-details
                  filled
                  v-model="item.reshipment_num"
                  style="max-width:150px"
                ></v-text-field>
              </template>
              <template v-slot:[`item.stock_num`] = "{ item }">
                {{ item.stock_num }}
              </template>
              <template v-slot:[`item.ship_price`] = "{ item }">
                {{ !item.reshipment_num ? 0 : item.reshipment_num * (item.unit_price).replace(/,/g,'').replace(/₩ /g,'') }}
              </template>
            </v-data-table>
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

import mux from "@/mux";

export default {

  components: {
                NavComponent,
                DataTableComponent,
                ModalDialogComponent,
                CardComponent,
                InputsFormComponent,
                LoadingModalComponent,
              },
  mounted(){

    // this.closeAll()
  },
  data(){
    return{
      mux: mux,
      menu: false,
      dates: [],
      ship_product_list_dialog: false,
      reshipment_dialog: false,
      loading_dialog: false,
      phase_check:false,
      clickTrSet:true,
      inspectionReportThumbnail:'',
      ship_date_set:'',

      ship_info_data:{},
      ship_product_list_data:[],

      change_approve:true,
      stock_info:[],

      login_info: ShipSearchPageConfig.login_info,
      searchCardInputs:ShipSearchPageConfig.searchCardInputs,
      ship_approve_headers:ShipSearchPageConfig.ship_approve_headers,
      ship_product_list_headers:ShipSearchPageConfig.ship_product_list_headers,
      reshipmentCardInfoInputs:ShipSearchPageConfig.reshipmentCardInfoInputs,
      ship_approved_product_list_headers:ShipSearchPageConfig.ship_approved_product_list_headers,
      ship_approve_data:[],

      shipNumRules: [
        v => !!( v <= this.check_stock_num) || '출하 수량 > 재고 수량',
      ],
    }
  },

  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
    pricePermission(){
      const permission_group_ids = this.$cookies.get(this.$configJson.cookies.permission_group_ids.key).split(',');
      if (permission_group_ids.some(id => this.$configJson.pricePermissionGroupIds.includes(id))){
        return true;
      }else {
        return false;
      }
    }
  },
  watch:{
    ship_product_list_dialog(val){
      val || this.closeProductList()
    },
    reshipment_dialog(val){
      val || this.closeProductList()
    },
    ship_approve_data(newData){
      console.log(newData)
      this.ship_approve_data = newData
    }
  },
  created () {
    this.initialize()
    const project_code = this.$route.query.project_code;
    const purpose = this.$route.query.purpose;
    const ship_date = this.$route.query.ship_date;
    if (project_code && purpose && ship_date){
      this.setSearchCardInputs(project_code, purpose, ship_date);
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
        this.login_info.name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.login_info.email = this.$cookies.get(this.$configJson.cookies.email.key);
        this.login_info.id = this.$cookies.get(this.$configJson.cookies.id.key);
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }
      this.searchCardInputs = JSON.parse(JSON.stringify(this.searchCardInputs));
    },
    // eslint-disable-next-line no-unused-vars

    setSearchCardInputs(project_code, purpose, ship_date){
      this.searchCardInputs.find(x=>x.label === '프로젝트').value = project_code;
      this.searchCardInputs.find(x=>x.label === '출고목적').value = purpose;
      if (ship_date.includes(' ~ ')){
        this.searchCardInputs.find(x=>x.label === '출고 요청일').value = ship_date.split(' ~ ');
      } else {
        this.searchCardInputs.find(x=>x.label === '출고 요청일').value = [ship_date, ship_date];
      }
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
          path: '/api/common_rest_api/',
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
            "script_file_name": "rooting_출하_검색_24_06_07_10_09_W4U.json",
            "script_file_path": "data_storage_pion\\json_sql\\ship\\출하_검색_24_06_07_10_09_F1C"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          if(result['data'].length === 0){
            mux.Util.showAlert('검색 결과가 없습니다.');
          }

          result.data.forEach(datas =>{
            if (datas.belong_data){
              for(let d=0; d<datas.belong_data.length; d++){
                // datas.belong_data[d].ship_num = Number(datas.belong_data[d].ship_num).toLocaleString();
                // datas.belong_data[d].stock_num = Number(datas.belong_data[d].stock_num).toLocaleString();
                datas.belong_data[d].unit_price = '₩ ' + Number(datas.belong_data[d].unit_price).toLocaleString();
                if(datas.belong_data[d].belong_data){
                  for(let dd=0; dd<datas.belong_data[d].belong_data.length; dd++){
                    datas.belong_data[d].belong_data[dd].ship_num="";
                    datas.belong_data[d].belong_data[dd].unit_price = '₩ ' + Number(datas.belong_data[d].belong_data[dd].unit_price).toLocaleString();
                    datas.belong_data[d].ship_date="";
                  }
                }
              }
            }

          })


          this.ship_approve_data  = result.data.reverse(); // 최신순으로 정렬
          mux.Util.hideLoading();
        }else{
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
    },
    closeProductList(){
      this.ship_product_list_dialog = false;
      this.reshipment_dialog = false;
    },
    clickApproveData(item){
      if(this.clickTrSet === true)
        this.loadApproveData(item);
    },
    async loadApproveData(item){
      if(item.approval_phase == '승인' || item.approval_phase == '추가 승인' || item.approval_phase == '반려'){
        this.phase_check = true;
      }else{
        this.phase_check = false;
      }
      let belong_datas = item.belong_data

      mux.Util.hideLoading();
      this.ship_product_list_data = [];
      this.ship_info_data = {};
      belong_datas.forEach(data =>{
        data.ship_price = '₩ ' + Number(data.unit_price.replace(/,/g,'').replace(/₩ /g,'') * data.ship_num).toLocaleString();
        this.ship_product_list_data.push(data);
      })
      let file_name = item.files.split('/');
      if(!file_name[0]){
        file_name = ""
      }
      this.ship_info_data = {
        approval_phase:item.approval_phase,
        code:item.code,
        project_code:item.project_code,
        inspection_report_file : item.inspection_report_file,
        note: item.note,
        files: file_name,
      }

      const prevURL = window.location.href;
      try {
        mux.Util.showLoading();
        // 제품의 썸네일
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "ship_confirmation_table.code": item.code
            }
          ],
          "script_file_name": "rooting_출하_thumbnail_검색_24_05_16_15_28_61S.json",
          "script_file_path": "data_storage_pion\\json_sql\\ship\\출하_thumbnail_검색_24_05_16_15_28_V7A"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          let inspection_report_thumbnail = '';
          if (result['data'].length > 0){
            inspection_report_thumbnail = result['data'][0].inspection_report_thumbnail;
          }
          this.inspectionReportThumbnail = inspection_report_thumbnail;
          mux.Util.hideLoading();
        } else {
          mux.Util.hideLoading();
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
      this.ship_product_list_dialog = true;
    },
    async setApprovalPhase(item, change, reason){
      const prevURL = window.location.href;
      const currDate = new Date();

      let phase;
      let send_data = {};
      let send_data_belong = {};
      send_data.code = item.code;
      // 현 승인 상태에 따른 필요 정보 정리
      if(item.approval_phase === '미확인' || item.approval_phase === '추가 미확인'){
        if(change === true){
          send_data.checked_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
          send_data.approval_phase = (item.approval_phase === '미확인' ? '미승인' : '추가 미승인');
          phase = '확인';
        }else{
          if(reason === ''){
            mux.Util.showAlert('반려 사유 필수 기입');
            return;
          }else{
            send_data.reject_reason = reason;
            send_data.rejecter = this.login_info.name;
            send_data.rejected_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
            send_data.approval_phase = (item.approval_phase === '미확인' ? '반려' : '추가 반려');
            phase = '확인 반려';
          }
        }
      }else if(item.approval_phase === '미승인' || item.approval_phase === '추가 미승인'){
        if(change === true){
          send_data.approved_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
          send_data.approval_phase = (item.approval_phase === '미승인' ? '승인' : '추가 승인');
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
            send_data.approval_phase = (item.approval_phase === '미승인' ? '반려' : '추가 반려');
            phase = '승인 반려';
          }
        }
      }
      console.log(phase);

      let sendData = {};

      mux.Util.showLoading();
      // 미승인에서 승인으로 변경하는 경우
      if(send_data_belong.length > 0){
        let update_stock_data = [];
        let update_inbound_data = [];
        let update_inbound_data_products = [];
        for(let sd = 0; sd < send_data_belong.length; sd++){
          let belong = send_data_belong[sd];
          update_inbound_data_products.push({
            "product_code": belong.product_code,
            "type": belong.type
          })
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
          let inbound_check = await mux.Server.post({
            path: '/api/common_rest_api/',
            params: [
              {
                "inbound_product_table.product_code": belong.product_code,
                "inbound_confirmation_table.approval_phase": "승인"
              }
            ],
            "script_file_name": "rooting_입고_상세_검색_24_05_22_10_53_9P7.json",
            "script_file_path": "data_storage_pion\\json_sql\\inbound\\입고_상세_검색_24_05_22_10_54_7AL"
          });
          if (prevURL !== window.location.href) return;

          if (typeof stock_check === 'string'){
            stock_check = JSON.parse(stock_check);
          }
          if (typeof inbound_check === 'string'){
            inbound_check = JSON.parse(inbound_check);
          }
          if(stock_check['code'] == 0){
            let searched_stock_data = [];
            if(stock_check['data'].length > 0){
              searched_stock_data = stock_check['data']
            }
            let searched_stock_num = 0;
            let searched_usable_num = 0;
            for(let s = 0; s<searched_stock_data.length; s++){
              if(belong.product_code === searched_stock_data[s]._code && belong.spot === searched_stock_data[s].spot){
                searched_stock_num = searched_stock_data[s].stock_num;
                searched_usable_num = searched_stock_data[s].usable_num;
              }
            }
            update_stock_data.push({
              "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data":{
                  "stock_num": Number(searched_stock_num) - Number(belong.ship_num),
                  "usable_num": Number(searched_usable_num) - Number(belong.ship_num)
                },
                "update_where": {"product_code": belong.product_code, "spot": belong.spot},
                "rollback": "yes"
            })

          }
          if(inbound_check['code'] == 0){
            let searched_inbound_data = [];
            if(inbound_check['data'].length > 0){
              searched_inbound_data = inbound_check['data'].filter(x=>x.spot === belong.spot);
            }
            searched_inbound_data.sort((a, b) => new Date(a.inbound_date) - new Date(b.inbound_date));
            let ship_num = belong.ship_num
            for(let i = 0; i<searched_inbound_data.length; i++){
              let calc_left_num = searched_inbound_data[i].left_num
              if(ship_num > 0){
                calc_left_num = calc_left_num - ship_num;
                ship_num = ship_num - searched_inbound_data[i].left_num;
                update_inbound_data.push({
                  "user_info": {
                      "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                      "role": "modifier"
                    },
                    "data":{
                      "left_num": calc_left_num < 0 ? 0 : calc_left_num
                    },
                    "update_where": {"id": searched_inbound_data[i].id},
                    "rollback": "yes"
                })
              }
            }

          }
        }

        sendData["stock_table-update"] = update_stock_data;
        sendData["inbound_product_table-update"] = update_inbound_data;
        sendData["ship_confirmation_table-update"] = [{
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "modifier"
          },
          "data": send_data,
          "update_where": {"code": item.code},
          "rollback": "yes"
        }];
        console.log(sendData);

        update_inbound_data_products = update_inbound_data_products.reduce((prev, now) => {
          if(!prev.some(obj => obj.product_code === now.product_code )){
            prev.push(now);
          }
          return prev;
        }, [])
        console.log(update_inbound_data_products);

        try {
          let resultShip = await mux.Server.post({
            path: '/api/common_rest_api/',
            params: sendData
          });
          if (prevURL !== window.location.href) return;

          if (typeof resultShip === 'string'){
            resultShip = JSON.parse(resultShip);
          }
          if(resultShip['code'] == 0){

            await this.refreshUnitPrice(update_inbound_data_products)
            item.approval_phase = send_data.approval_phase;
            item.approved_date = send_data.approved_date;

            mux.Util.hideLoading();
            mux.Util.showAlert('출고 승인 완료', '승인 완료', 3000)

            //메일 알림 관련
            let mailTo = [];
            let creater = this.$cookies.get(this.$configJson.cookies.id.key);
            mailTo.push(creater);
            if(creater !== item.checker_id){
              mailTo.push(item.checker_id);
            }

            // 메일 본문 내용
            let content=`
              <html>
                <body>
                  <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                    <h2 style="text-align: center; color:#13428a">출고 승인 처리 알림</h2>
                    <table style="width: 100%;border-spacing: 10px 10px;">
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.project_code}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">출고 요청일</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.ship_date}</td>
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
                    </table>
                    <a style="color: white; text-decoration:none"href="${prevURL}-search?project_code=${item.project_code}&purpose=${item.purpose}&ship_date=${item.ship_date}">
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
                subject: "출고 승인 처리 알림",
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
            mux.Util.showAlert(resultShip['failed_info']);
          }
        } catch (error) {
          mux.Util.hideLoading();
          if (prevURL !== window.location.href) return;
          if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
            mux.Util.showAlert(error.response['data']['failed_info'].msg);
          else
            mux.Util.showAlert(error);
        }
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

          mux.Util.showLoading();
          let resultShip = await mux.Server.post({
            path: '/api/common_rest_api/',
            params: sendData
          });
          if (prevURL !== window.location.href) return;

          if (typeof resultShip === 'string'){
            resultShip = JSON.parse(resultShip);
          }
          if(resultShip['code'] == 0){

            item.approval_phase = send_data.approval_phase;
            item.approved_date = send_data.approved_date;

            mux.Util.showAlert('출고 ' + phase + ' 완료', '완료', 3000);
            mux.Util.hideLoading();

            //메일 알림 관련
            let mailTo = [];
            let creater = this.$cookies.get(this.$configJson.cookies.id.key);
            let reject_info;
            if(phase === '확인'){
              mailTo.push(creater);
              mailTo.push(item.approver_id);
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
                    <h2 style="text-align: center; color:#13428a">출고 ${phase} 처리 알림</h2>
                    <table style="width: 100%;border-spacing: 10px 10px;">
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.project_code}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">출고 요청일</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.ship_date}</td>
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
                    <a style="color: white; text-decoration:none"href="${prevURL}-search?project_code=${item.project_code}&purpose=${item.purpose}&ship_date=${item.ship_date}">
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
                subject: "출고 " + phase + " 처리 알림",
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
            mux.Util.showAlert(resultShip['failed_info']);
          }
        } catch (error) {
          mux.Util.hideLoading();
          if (prevURL !== window.location.href) return;
          if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
            mux.Util.showAlert(error.response['data']['failed_info'].msg);
          else
            mux.Util.showAlert(error);
        }
      }
    },

    async refreshUnitPrice(products){
      console.log(products);
      let searched_inbound_data = [];
      let sendProductData = {};
      let set_data = [];
      let update_material_data = [];
      let update_module_data = [];
      let update_product_data = [];
      const prevURL = window.location.href;
      
      for(let i=0; i<products.length; i++){
        let product = products[i];
        let inbound_check = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "inbound_product_table.product_code": product.product_code,
              "inbound_confirmation_table.approval_phase": "승인"
            }
          ],
          "script_file_name": "rooting_입고_상세_검색_24_05_22_10_53_9P7.json",
          "script_file_path": "data_storage_pion\\json_sql\\inbound\\입고_상세_검색_24_05_22_10_54_7AL"
        });
        if (prevURL !== window.location.href) return;
        if (typeof inbound_check === 'string'){
          inbound_check = JSON.parse(inbound_check);
        }
        if(inbound_check['code'] == 0){
          searched_inbound_data.push(...inbound_check['data'].filter(x=>x.left_num !== 0));
          // inbound_num과 created_time으로 sort
          searched_inbound_data.sort((a, b) => new Date(a.inbound_date) - new Date(b.inbound_date));
          set_data.push(searched_inbound_data[0])
        }
      }

      // 가장 오래된 단가로 원부자재 혹은 반제품 혹은 완제품 단가 수정
      set_data.forEach(data => {
        if(data.type === '원부자재'){
          update_material_data.push({
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{
              "unit_price": data.unit_price
            },
            "update_where": {"material_code": data.product_code},
            "rollback": "yes"
          });
        }else if(data.type === '반제품'){
          update_module_data.push({
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{
              "unit_price": data.unit_price
            },
            "update_where": {"module_code": data.product_code},
            "rollback": "yes"
          });
        }else if(data.type === '완제품'){
          update_product_data.push({
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{
              "unit_price": data.unit_price
            },
            "update_where": {"product_code": data.product_code},
            "rollback": "yes"
          });
        }
      })
      sendProductData["material_table-update"] = update_material_data;
      sendProductData["module_table-update"] = update_module_data;
      sendProductData["product_table-update"] = update_product_data;
      console.log("sendData ::: ", sendProductData);

      try {
        let resultUpdate = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: sendProductData
        });
        if (prevURL !== window.location.href) return;

        if (typeof resultUpdate === 'string'){
          resultUpdate = JSON.parse(resultUpdate);
        }
        if(resultUpdate['code'] == 0){
          console.log(resultUpdate['message']);
          return true;
        } else {
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(resultUpdate['failed_info']);
          return false;
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);

        return false;
      }
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
        let insert_product_data = [];
        let update_stock_data = [];

        for (let i = 0; i < send_data_belong.length; i++) {
          const belong = send_data_belong[i];
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
              searched_stock_data = stock_check['data']
            }
            let searched_stock_num = 0;
            let searched_usable_num = 0;
            for(let s = 0; s<searched_stock_data.length; s++){
              if(belong.product_code === searched_stock_data[s]._code && belong.spot === searched_stock_data[s].spot){
                searched_stock_num = searched_stock_data[s].stock_num;
                searched_usable_num = searched_stock_data[s].usable_num;
              }
            }
            update_stock_data.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "modifier"
              },
              "data": {
                "stock_num" : Number(searched_stock_num) + Number(belong.ship_num),
                "usable_num" : Number(searched_usable_num) + Number(belong.ship_num),
              },
              "update_where": {"product_code": belong.product_code, "spot": belong.spot},
              "rollback": "yes"
            })
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
                  "ship_num" : '-' + belong.ship_num,
                  "spot" : belong.spot,
                  "spec" : belong.spec,
                  "model" : belong.model,
                  "manufacturer" : belong.manufacturer,
                  "unit_price" : belong.unit_price.replace(/,/g,'').replace(/₩ /g,'')
              },
              "select_where": {"product_code": "!JUST_INSERT!"},
              "rollback": "no"
            })

            sendData["ship_product_table-insert"] = insert_product_data;
            sendData["stock_table-update"] = update_stock_data;

          }
        }

      }


      sendData["ship_confirmation_table-update"] = [{
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
              minus_send_product_data = item.belong_data ? JSON.parse(JSON.stringify(item.belong_data)) : [];
              minus_send_product_data.forEach(data => {
                data.ship_num = '-' + data.ship_num;
                data.ship_price = '₩ ' + Number(data.unit_price.replace(/,/g,'').replace(/₩ /g,'') * data.ship_num).toLocaleString();
                item.belong_data.push(data);
              });
              break;

            default:
              break;
          }
          // console.log('result :>> ', result);
          mux.Util.showAlert('출고 ' + phase + ' 완료', '완료', 3000);
          mux.Util.hideLoading();

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
                  <h2 style="text-align: center; color:#13428a">출고 ${phase} 처리 알림</h2>
                  <table style="width: 100%;border-spacing: 10px 10px;">
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.project_code}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">출고 요청일</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.ship_date}</td>
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
                  <a style="color: white; text-decoration:none"href="${prevURL}-search?project_code=${item.project_code}&purpose=${item.purpose}&ship_date=${item.ship_date}">
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
              subject: "출고 " + phase + " 처리 알림",
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
        mux.Util.hideLoading();
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
        let insert_product_data = [];
        let update_stock_data = [];

        for (let i = 0; i < send_product_data.length; i++) {
          const product = send_product_data[i];
          // product_code기준 재고(자재)검색
          let stock_check = await mux.Server.post({
            path: '/api/common_rest_api/',
            params: [
              {
                "product_table.product_code": product.product_code,
                "module_table.module_code": product.product_code,
                "material_table.material_code": product.product_code,
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
              searched_stock_data = stock_check['data']
            }
            let searched_stock_num = 0;
            let searched_usable_num = 0;
            for(let s = 0; s<searched_stock_data.length; s++){
              if(product.product_code === searched_stock_data[s]._code && product.spot === searched_stock_data[s].spot){
                searched_stock_num = searched_stock_data[s].stock_num;
                searched_usable_num = searched_stock_data[s].usable_num;
              }
            }
            update_stock_data.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "modifier"
              },
              "data": {
                "stock_num" : Number(searched_stock_num) + Number(product.ship_num),
                "usable_num" : Number(searched_usable_num) + Number(product.ship_num),
              },
              "update_where": {"product_code": product.product_code, "spot": product.spot},
              "rollback": "yes"
            })
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
                  "ship_num" : '-' + product.ship_num,
                  "spot" : product.spot,
                  "spec" : product.spec,
                  "model" : product.model,
                  "manufacturer" : product.manufacturer,
                  "unit_price" : product.unit_price.replace(/,/g,'').replace(/₩ /g,'')
              },
              "select_where": {"product_code": "!JUST_INSERT!"},
              "rollback": "no"
            })

            sendData["ship_product_table-insert"] = insert_product_data;
            sendData["stock_table-update"] = update_stock_data;
          }
        }

      }

      sendData["ship_confirmation_table-update"] = [{
        "user_info": {
          "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
          "role": "modifier"
        },
        "data": send_confirmation_data,
        "update_where": {"code": item.code},
        "rollback": "yes"
      }];

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
          let minus_send_product_data = [];
          item.approval_phase = send_confirmation_data.approval_phase;
          switch (send_confirmation_data.approval_phase) {
            case '취소':
              item.approved_date = send_confirmation_data.approved_date;
              minus_send_product_data = item.belong_data ? JSON.parse(JSON.stringify(item.belong_data)) : [];
              minus_send_product_data.forEach(data => {
                data.ship_num = '-' + data.ship_num;
                data.ship_price = '₩ ' + Number(data.unit_price.replace(/,/g,'').replace(/₩ /g,'') * data.ship_num).toLocaleString();
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
          // console.log('result :>> ', result);
          mux.Util.showAlert(send_confirmation_data.approval_phase === '취소' ? '취소 완료' : '취소 요청 완료', '완료', 3000);
          mux.Util.hideLoading();


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
                  <h2 style="text-align: center; color:#13428a">출고 ${phase} 알림</h2>
                  <table style="width: 100%;border-spacing: 10px 10px;">
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.project_code}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">출고 요청일</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.ship_date}</td>
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
                  </table>
                  <a style="color: white; text-decoration:none"href="${prevURL}-search?project_code=${item.project_code}&purpose=${item.purpose}&ship_date=${item.ship_date}">
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
              subject: "출고 " + phase + " 알림",
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
        mux.Util.hideLoading();
        if (prevURL !== window.location.href) return;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
      console.log('sendData :: ' + JSON.stringify(sendData))
    },
    addShip(item){
      this.ship_product_list_data = [];
      this.ship_info_data = {};
      this.clickTrSet = false;
      this.reshipment_dialog = true;

      this.ship_info_data = item
      let belong_datas = item.belong_data;

      belong_datas.forEach(data =>{
        data.ship_price = '₩ ' + Number(data.unit_price.replace(/,/g,'').replace(/₩ /g,'') * data.ship_num).toLocaleString();
        this.ship_product_list_data.push(data);
      })
      // alert(item)
    },
    async reshipmentApprovalRequest(){
      let ship_confirmation = this.ship_info_data;
      let inputs = this.reshipmentCardInfoInputs;
      let ship_product_data = this.ship_product_list_data;
      for(let i=0; i<inputs.length; i++){
        if(inputs[i].column_name === 'note'){
          if(inputs[i].value === ''){
            mux.Util.showAlert('추가 출고 사유를 입력해주세요');
            return;
          }else{
            ship_confirmation.note = inputs[i].value;
          }
        }
      }
      for(let s=0; s<ship_product_data.length; s++){
        if(Number(ship_product_data[s].reshipment_num) > Number(ship_product_data[s].stock_num)){
          mux.Util.showAlert('재고 수량보다 많은 수량을 입력하셨습니다');
          return;
        }
      }

      const currDate = new Date();
      ship_confirmation.ship_date = (this.ship_date_set === "" ? mux.Date.format(currDate, 'yyyy-MM-dd') : this.ship_date_set);
      let add_code = ship_confirmation.code + '+추가';
      let phase;
      if(ship_confirmation.checker_id === this.login_info.id){
        ship_confirmation.approval_phase = '추가 미승인';
        ship_confirmation.checked_date = mux.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        ship_confirmation.approved_date = null;
        phase = '승인 요청';
      }else{
        ship_confirmation.approval_phase = '추가 미확인';
        ship_confirmation.checked_date = null;
        ship_confirmation.approved_date = null;
        phase = '확인 요청';
      }

      let sendData = {
        "ship_confirmation_table-insert": [{
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "creater"
          },
          "data":{
            "code" : add_code,
            "ship_date": ship_confirmation.ship_date,
            "project_code" : ship_confirmation.project_code,
            "ship_place" : ship_confirmation.ship_place,
            "purpose" : ship_confirmation.purpose,
            "approval_phase": ship_confirmation.approval_phase,
            "checker" : ship_confirmation.checker,
            "checker_id" : ship_confirmation.checker_id,
            "checked_date" : ship_confirmation.checked_date,
            "approver" : ship_confirmation.approver,
            "approver_id" : ship_confirmation.approver_id,
            "inspection_report_file" : ship_confirmation.inspection_report,
            "files" : ship_confirmation.files,
            "note" : ship_confirmation.note,
            "inbound_code": ship_confirmation.inbound_code,
          },
          "select_where": {"code": "!JUST_INSERT!"},
          "rollback": "no"
        }]
      };

      let product_data = [];
      ship_product_data.forEach(data =>{
        if(data.reshipment_num && data.reshipment_num * (data.unit_price).replace(/,/g,'').replace(/₩ /g,'') !== 0){
          product_data.push({
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "creater"
            },
            "data":{
              "code" : add_code,
              "type" : data.type,
              "classification" : data.classification,
              "product_code" : data.product_code,
              "name" : data.name,
              "ship_num" : data.reshipment_num,
              "spot" : data.spot,
              "spec" : data.spec,
              "model" : data.model,
              "manufacturer" : data.manufacturer,
              "unit_price" : data.unit_price.replace(/,/g,'').replace(/₩ /g,''),
            },
            "select_where": {"code": "!JUST_INSERT!", "product_code": "!JUST_INSERT!"},
            "rollback": "no"
          });
        }
      });
      sendData["ship_product_table-insert"] = product_data;
      if(product_data.length === 0){
        mux.Util.showAlert('추가 출고 수량을 입력해주세요');
        return;
      }else{


        const prevURL = window.location.href;
        try {
          let result = await mux.Server.post({
            path: '/api/common_rest_api/',
            params: sendData
          });

          // let result = await mux.Server.uploadFile(sendData);
          if (prevURL !== window.location.href) return;

          if (typeof result === 'string'){
            result = JSON.parse(result);
          }
          if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
            // console.log('result :>> ', result);
            mux.Util.showAlert('추가 출고 승인 요청이 완료되었습니다', '요청 완료', 3000);
            mux.Util.hideLoading();

            //메일 알림 관련
            let mailTo = [];
            if(phase === '승인 요청'){
              mailTo.push(ship_confirmation.approver_id);
            }else if(phase ==='확인 요청'){
              mailTo.push(ship_confirmation.checker_id);
            }

            // 메일 본문 내용
            let content=`
              <html>
                <body>
                  <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                    <h2 style="text-align: center; color:#13428a">추가 출고 ${phase} 알림</h2>
                    <table style="width: 100%;border-spacing: 10px 10px;">
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${ship_confirmation.project_code}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">출고 요청일</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${ship_confirmation.ship_date}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${ship_confirmation.given_name}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">확인자</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${ship_confirmation.checker}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">승인자</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${ship_confirmation.approver}</td>
                      </tr>
                    </table>
                    <a style="color: white; text-decoration:none"href="${prevURL.substring(0,prevURL.lastIndexOf('/'))}/ship-search?project_code=${ship_confirmation.project_code}&purpose=${ship_confirmation.purpose}&ship_date=${ship_confirmation.ship_date}">
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
                subject: "추가 출고 " + phase + " 알림",
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


            this.receiving_inspection_value = '';
            this.inspection_report_value = '';
            this.files_value = [];
          } else {
            if (prevURL !== window.location.href) return;
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
    },
    dateChangedImport(item){
      this.ship_date_set = item
    },
  },
}
</script>
<style>
</style>
