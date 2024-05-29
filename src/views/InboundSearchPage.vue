<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productMenu="true" :inboundMenu="true"></NavComponent>

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
            <table style="width:100%">
              <tr>
                <td class="approve_title" style="width:10%">프로젝트 코드</td>
                <td class="approve_text" style="width:15%">{{ inbound_info_data.project_code }}</td>
                <td class="approve_title" style="width:10%">품질검사결과</td>
                <td class="approve_text" style="width:25%">
                  <p class="mb-0 font-weight-bold">{{ inbound_info_data.abnormal_reason == '' ? '이상 없음' : '이상 있음' }}</p>
                  <p class="mb-0 error--text" v-if="inbound_info_data.abnormal_reason != ''"> : {{ inbound_info_data.abnormal_reason }}</p>
                </td>
                <td class="approve_title" style="width:10%">비고</td>
                <td class="approve_text" style="width:30%">
                  {{  inbound_info_data.note }}
                </td>
              </tr>
            </table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <DataTableComponent
              :headers="inbound_product_list_headers"
              :items="inbound_product_list_data"
              :item-key="inbound_product_list_data.product_code"
              children-key="belong_data"
              dense
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4" v-if="inbound_info_data.receiving_inspection_file">
            <p class="font-weight-bold primary--text mb-0">▼ 수입검사서</p>
            <!-- <iframe width="100%" style="height:450px" :src="'https://mkorbucket-public.s3.ap-northeast-2.amazonaws.com/'+inbound_info_data.receiving_inspection"></iframe> -->
            <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(receivingInspectionThumbnail)"
              transition="scale-transition"
              width="350"
              @click="download('inbound/receiving_inspection', inbound_info_data.receiving_inspection_file, inbound_info_data.code+'_')"
              style="cursor: pointer;"
            />
          </v-col>
          <v-col cols="12" sm="4" v-if="inbound_info_data.inspection_report_file">
            <p class="font-weight-bold primary--text mb-0">▼ 시험성적서</p>
            <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(inspectionReportThumbnail)"
              transition="scale-transition"
              width="350"
              @click="download('inbound/inspection_report', inbound_info_data.inspection_report_file, inbound_info_data.code+'_')"
              style="cursor: pointer;"
            />
            <!-- <iframe width="100%" style="height:450px" :src="'https://mkorbucket-public.s3.ap-northeast-2.amazonaws.com/'+inbound_info_data.inspection_report"></iframe> -->
          </v-col>
          <v-col cols="12" sm="4" v-if="inbound_info_data.files">
            <p class="font-weight-bold primary--text mb-0">▼ 기타 첨부</p>
            <v-chip
             color="grey lighten-2"
             class="ma-2"
              v-for="(file, i) in inbound_info_data.files"
              :key="i"
              @click="download('inbound/files', file, inbound_info_data.code+'_')">
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
import InboundSearchPageConfig from "@/configure/InboundSearchPageConfig.json";
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
              },
  data(){
    return{
      mux: mux,
      dates: [],
      inbound_product_list_dialog: false,
      loading_dialog: false,
      receivingInspectionThumbnail: '',
      inspectionReportThumbnail: '',

      inbound_info_data:{},
      inbound_product_list_data:[],

      change_approve:{},

      searched_products:[],

      login_info: InboundSearchPageConfig.login_info,
      searchCardInputs:InboundSearchPageConfig.searchCardInputs,
      inbound_approve_headers:InboundSearchPageConfig.inbound_approve_headers,
      inbound_product_list_headers:InboundSearchPageConfig.inbound_product_list_headers,
      inbound_approve_data:[],
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
    const product_code = this.$route.query.product_code;
    const product_name = this.$route.query.product_name;
    const inbound_date = this.$route.query.inbound_date;
    if (order_code && inbound_date){
      this.setSearchCardInputs(order_code, product_code, product_name, inbound_date);
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
    setSearchCardInputs(order_code, product_code, product_name, inbound_date){
      this.searchCardInputs.find(x=>x.label === '발주번호').value = order_code;
      this.searchCardInputs.find(x=>x.label === '관리코드').value = product_code;
      this.searchCardInputs.find(x=>x.label === '제품명').value = product_name;
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
        alert(error);
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
          "script_file_name": "rooting_입고_검색_24_05_22_12_56_I7K.json",
          "script_file_path": "data_storage_pion\\json_sql\\inbound\\입고_검색_24_05_22_12_56_52V"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0){
          if(result['data'].length === 0){
            alert('검색 결과가 없습니다.');
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
          this.inbound_approve_data  = result.data
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
      // this.inbound_approve_data = InboundSearchPageConfig.test_inbound_approve_data
      this.loading_dialog = false;
    },
    closeProductList(){
      this.inbound_product_list_dialog = false;
    },
    async clickApproveData(item){

      let belong_datas = item.belong_data
      this.inbound_product_list_data = [];
      this.inbound_info_data = {};
      belong_datas.forEach(data =>{
        data.inbound_price = '₩ ' + Number(data.unit_price.replace(/,/g,'').replace(/₩ /g,'') * data.inbound_num.replace(/,/g,'')).toLocaleString();
        this.inbound_product_list_data.push(data);

        if(data.belong_data){
          data.belong_data.forEach(shipdata => {
          shipdata.inbound_price = ""
        })
        }
      })
      let file_name = item.files.split('/');
      if(!file_name[0]){
        file_name = ""
      }
      this.inbound_info_data = {
        code:item.code,
        project_code:item.project_code,
        spot:item.spot,
        abnormal_reason : item.abnormal_reason,
        receiving_inspection_file : item.receiving_inspection_file,
        inspection_report_file : item.inspection_report_file,
        note: item.note,
        files: file_name,
      }

      const prevURL = window.location.href;
      try {
        this.loading_dialog = true;
        // 제품의 썸네일
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "inbound_confirmation_table.code": item.code
            }
          ],
          "script_file_name": "rooting_입고_thumbnail_검색_24_05_16_15_32_Z97.json",
          "script_file_path": "data_storage_pion\\json_sql\\inbound\\입고_thumbnail_검색_24_05_16_15_32_7VD"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0){
          let receiving_inspection_thumbnail = '';
          let inspection_report_thumbnail = '';
          if (result['data'].length > 0){
            receiving_inspection_thumbnail = result['data'][0].receiving_inspection_thumbnail;
            inspection_report_thumbnail = result['data'][0].inspection_report_thumbnail;
          }
          this.receivingInspectionThumbnail = receiving_inspection_thumbnail;
          this.inspectionReportThumbnail = inspection_report_thumbnail;
          this.loading_dialog = false;
        } else {
          this.loading_dialog = false;
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
          alert(error.response['data']['failed_info'].msg);
        else
          alert(error);
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
            alert('반려 사유 필수 기입');
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
            alert('반려 사유 필수 기입');
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
          alert('입고 ' + phase + ' 완료');

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
                    현황 확인
                  </p>
                </a>
              </div>
            </body>
          </html>
          `;

          // 메일 알림 요청 정보
          let mailData = {
            "mailTo": mailTo,
            "subject": "입고 " + phase + " 처리 알림",
            "content": content
          };

          console.log(mailData);
        } else {
          if (prevURL !== window.location.href) return;
          alert(resultInbound['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          alert(error.response['data']['failed_info'].msg);
        else
          alert(error);
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
            alert('취소 반려 사유 필수 기입');
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
            alert('취소 반려 사유 필수 기입');
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

          alert('입고 ' + phase + ' 완료');

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
                      취소 현황 확인
                    </p>
                  </a>
                </div>
              </body>
            </html>
          `;

          // 메일 알림 요청 정보
          let mailData = {
            "mailTo": mailTo,
            "subject": "입고 " + phase + " 처리 알림",
            "content": content
          };

          console.log(mailData);
        } else {
          if (prevURL !== window.location.href) return;
          alert(resultInbound['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          alert(error.response['data']['failed_info'].msg);
        else
          alert(error);
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
          
          alert(send_confirmation_data.approval_phase === '취소' ? '취소 완료' : '취소 요청 완료');

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
                      ${phase} 확인
                    </p>
                  </a>
                </div>
              </body>
            </html>
          `;

          // 메일 알림 요청 정보
          let mailData = {
            "mailTo": mailTo,
            "subject": "입고 " + phase + " 알림",
            "content": content
          };

          console.log(mailData);
        } else {
          if (prevURL !== window.location.href) return;
          alert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          alert(error.response['data']['failed_info'].msg);
        else
          alert(error);
      }
      console.log('sendData :: ' + JSON.stringify(sendData))
    }
  },
}
</script>

<style lang="">

</style>


