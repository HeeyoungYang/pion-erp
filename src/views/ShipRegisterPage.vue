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
            title-class="mb-0 font-weight-black"
            divider-class="mb-3"
          >
            <div slot="cardTitle">
              <span>자재 선택</span>
            </div>
            <InputsFormComponent
              slot="cardText"
              dense
              clearable
              filled
              hide-details
              :inputs="searchCardInputs"
              v-if="select_product"
              @enter="searchProduct"
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
                  class="mr-2"
                  @click="searchProduct"
                >
                  <v-icon>mdi-magnify</v-icon>검색
                </v-btn>
                <v-btn
                  color="default"
                  elevation="2"
                  @click="addItems"
                >추가</v-btn>
              </v-col>
              <v-col cols="12">
                <v-data-table
                  dense
                  class="elevation-1"
                  v-model="selected_product_data"
                  :headers="pricePermission ? product_search_headers : product_search_headers.filter(x => x.value !== 'unit_price')"
                  :items="product_search_data"
                  item-key="stock_code"
                  show-select
                  />
              </v-col>
            </InputsFormComponent>
          </CardComponent>


          <CardComponent
            elevation="1"
            card-class="mt-5"
            text-class=" pt-3"
            title-class="mb-0 font-weight-black"
            divider-class="mb-3"
          >
            <div slot="cardTitle">
              출고 정보 입력
            </div>
            <div slot="cardText">
              <MemberSearchDialogComponent
                :dialog-value="member_dialog"
                :persistent="true"
                @close="close"
                @setMember = "setMember"
                @members = "members"
              >
              </MemberSearchDialogComponent>
              <v-chip
                class="mr-2 mb-4"
                style="cursor:pointer"
                v-for="(member, i) in approve_member_info"
                :key="i"
                :color="member.name ? 'success' : 'default'"
                @click="selectMemberDialog(i)"
              >
                {{ member.type }} : {{ member.name }}
              </v-chip>

              <v-form ref="shipForm">
                <InputsFormComponent
                  dense
                  clearable
                  filled
                  hide-details
                  :inputs="shipCardInputs"
                  @dateChanged = "dateChangedImport"
                >
                </InputsFormComponent>
              </v-form>
              <v-row>
                  <v-col cols="12" sm="12" lg="12" align-self="center">
                    <v-btn
                      small
                      color="success"
                    class=" float-right"
                      @click="shipApprovalRequest"
                    >
                      출고 승인 요청
                    </v-btn>
                  </v-col>
                <v-col
                  cols="12"
                >
                  <v-data-table
                    dense
                    :headers="pricePermission ? product_ship_headers : product_ship_headers.filter(x => x.value !== 'unit_price')"
                    :items="product_ship_data"
                    hide-default-footer
                    disable-pagination
                    item-key="product_info"
                    class="elevation-1"
                  >
                    <template v-slot:item="{ item }">
                      <tr>
                        <td align="center">{{  item.type }}</td>
                        <td align="center">{{  item.classification }}</td>
                        <td align="center">{{  item._code }}</td>
                        <td align="center">{{  item.name }}</td>
                        <td align="center">
                          <v-text-field
                            dense
                            filled
                            hide-details
                            style="max-width:150px"
                            v-model="item.ship_num"
                            :oninput="!item.ship_num ? '' : item.ship_num = item.ship_num.replace(/^0+|\D+/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')"
                            @click="check_stock_num = item.stock_num"
                            :rules="shipNumRules"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">{{  item.model }}</td>
                        <td align="center">{{  item.spec }}</td>
                        <td align="center">{{  item.manufacturer }}</td>
                        <td align="center">{{  item.spot }}</td>
                        <td align="center">{{  item.stock_num }}</td>
                        <td v-if="pricePermission" align="center">{{  item.unit_price }}</td>
                        <td align="center">
                          <v-icon small color="default" style="cursor:pointer" @click="deleteShipDataRow(index)">mdi-minus-thick</v-icon>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </div>
          </CardComponent>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
// import DataTableComponent from "@/components/DataTableComponent";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import MemberSearchDialogComponent from "@/components/MemberSearchDialogComponent.vue";
import LoadingModalComponent from "@/components/LoadingModalComponent.vue";
import ShipRegisterPageConfig from "@/configure/ShipRegisterPageConfig.json";

import mux from "@/mux";

export default {
  
  components: {
                NavComponent,
                // DataTableComponent,
                InputsFormComponent,
                CardComponent,
                MemberSearchDialogComponent,
                LoadingModalComponent,
              },
  mounted(){
    
    // this.closeAll()
  },
  data(){
    return{
      ship_date_set:'',
      select_product: true,
      dates: [],
      menu: false,
      member_dialog: false,
      loading_dialog: false,
      inspection_report_value:'',
      files_value:[],
      selected_product_data:[],

      member_type_index:0,
      members_list:[],
      manufacturer_list:[],
      classification_list:[],

      product_ship_data: [],
      product_ship_data_added: [],
      shipNumRules: [
        v => !!( v <= this.check_stock_num) || '출하 수량 > 재고 수량',
      ],

      approve_member_info:ShipRegisterPageConfig.approve_member_info,
      searchCardInputs:ShipRegisterPageConfig.searchCardInputs,
      shipCardInputs:ShipRegisterPageConfig.shipCardInputs,
      ship_confirmation_data:ShipRegisterPageConfig.ship_confirmation_data,
      product_ship_headers:ShipRegisterPageConfig.product_ship_headers,
      product_search_headers:ShipRegisterPageConfig.product_search_headers,
      product_search_data:[],
    }
  },
  created () {
    this.initialize()
    this.members()
  },
  methods: {
    async initialize () {

      // this.manufacturer_list = ShipRegisterPageConfig.test_manufacturer_list;
      // this.classification_list = ShipRegisterPageConfig.test_classification_list;
      const prevURL = window.location.href;
      try {
        let result = await mux.Server.getPionBasicInfo();
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }

        this.classification_list = result.classification;
        this.manufacturer_list = result.manufacturer;
        // this.spot_list = result.spot;

      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }

      mux.List.addProductBasicInfoLists(this.searchCardInputs, this.classification_list, this.manufacturer_list, true);
      this.searchCardInputs = JSON.parse(JSON.stringify(this.searchCardInputs));
      this.shipCardInputs = JSON.parse(JSON.stringify(this.shipCardInputs));
      mux.Rules.rulesSet(this.shipCardInputs);

      try {
        // console.log('사용자 계정 정보 가졍오기');
        // let result = await mux.Server.get({
        //   path: '/api/user/',
        // });
        if (prevURL !== window.location.href) return;
        // console.log('result :>> ', result);
        this.approve_member_info[0].name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.approve_member_info[0].email =  this.$cookies.get(this.$configJson.cookies.email.key);
        this.approve_member_info[0].user_id =this.$cookies.get(this.$configJson.cookies.email.key);
        this.login_id = this.$cookies.get(this.$configJson.cookies.email.key);
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }

    },

    async searchProduct(){
      mux.Util.showLoading();

      // this.product_search_data = InboundRegisterPageConfig.test_product_search_data

      let searchType = this.searchCardInputs.find(x=>x.label === '종류').value;
      if (searchType === 'All')
        searchType = '%';
      let searchClassification = this.searchCardInputs.find(x=>x.label === '분류').value;
      if (searchClassification === 'All')
        searchClassification = '%';
      let searchCondition = this.searchCardInputs.find(x=>x.label === '상태').value;
      if (searchCondition === 'All')
        searchCondition = '%';
      let searchProductCode = this.searchCardInputs.find(x=>x.label === '관리코드').value;
      if (searchProductCode)
      searchProductCode = searchProductCode.trim();

      let searchProductName = this.searchCardInputs.find(x=>x.label === '제품명').value;
      if (searchProductName)
      searchProductName = searchProductName.trim();

      let searchModelName = this.searchCardInputs.find(x=>x.label === '모델명').value;
      if (searchModelName)
      searchModelName = searchModelName.trim();

      let searchProductSpec = this.searchCardInputs.find(x=>x.label === '사양').value;
      if (searchProductSpec)
      searchProductSpec = searchProductSpec.trim();

      let searchManufacturer = this.searchCardInputs.find(x=>x.label === '제조사').value;
      if (searchManufacturer)
      searchManufacturer = searchManufacturer.trim();

      let searchStockMoreZero = '';

      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "product_table.classification": searchClassification ? searchClassification : "",
              "product_table.manufacturer": searchManufacturer ? searchManufacturer : "",
              "product_table.model": searchModelName ? searchModelName : "",
              "product_table.name": searchProductName ? searchProductName : "",
              "product_table.product_code": searchProductCode ? searchProductCode : "",
              "product_table.spec": searchProductSpec ? searchProductSpec : "",
              "product_table.type": searchType ? searchType : "",

              "module_table.classification": searchClassification ? searchClassification : "",
              "module_table.manufacturer": searchManufacturer ? searchManufacturer : "",
              "module_table.model": searchModelName ? searchModelName : "",
              "module_table.name": searchProductName ? searchProductName : "",
              "module_table.module_code": searchProductCode ? searchProductCode : "",
              "module_table.spec": searchProductSpec ? searchProductSpec : "",
              "module_table.type": searchType ? searchType : "",

              "material_table.classification": searchClassification ? searchClassification : "",
              "material_table.manufacturer": searchManufacturer ? searchManufacturer : "",
              "material_table.model": searchModelName ? searchModelName : "",
              "material_table.name": searchProductName ? searchProductName : "",
              "material_table.material_code": searchProductCode ? searchProductCode : "",
              "material_table.spec": searchProductSpec ? searchProductSpec : "",
              "material_table.type": searchType ? searchType : "",
              "material_table.directly_written": 0,

              "stock_table.conditions": searchCondition ? searchCondition : "",
              "stock_table.stock_num": searchStockMoreZero
            }
          ],
          "script_file_name": "rooting_재고_검색_24_05_07_11_46_16P.json",
          "script_file_path": "data_storage_pion\\json_sql\\stock\\1_재고검색\\재고_검색_24_05_07_11_46_H8D"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

          if(result['data'].length === 0){
            mux.Util.showAlert('검색 결과가 없습니다.');
          }
          result = result['data'].map(a => {
            if (!a.stock_num){
              a.stock_price = 0;
            }else {
              a.stock_price = Math.round(a.unit_price * a.stock_num)
            }
            return a;
          });

          let product_data_arr = [];
          result.forEach(data => {
            product_data_arr.push(data);
          });
          this.product_search_data = product_data_arr;

          this.product_search_data.forEach(data =>{
            data.stock_num = Number(data.stock_num).toLocaleString()
            data.stock_code = data._code + ':'+data.spot
            if (typeof data.unit_price === 'number'){
              data.item_price = data.unit_price * data.total_stock
              data.unit_price = '₩ '+ Number(data.unit_price).toLocaleString()
            }else {
              data.item_price = 0;
            }
          })
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


      mux.Util.hideLoading();
    },
    // eslint-disable-next-line no-unused-vars
    


    addItems(){
      let check_duplicate=[];
      let set_item = this.product_ship_data
      let selected_item = this.selected_product_data;

      set_item.forEach(item => {
        for(let d=0; d<selected_item.length; d++){
          if(item.item_code === selected_item[d]._code){
            check_duplicate.push(item.item_code);
          }
        }
      })
      if(check_duplicate.length > 0){
        let duplicate = JSON.stringify(check_duplicate).replace( "[",'').replace( "]",'');
        mux.Util.showAlert(duplicate + '은(는) 이미 추가된 제품입니다.')
        return
      }else{
        selected_item.forEach(data =>{
          data.item_code = data._code
          set_item.push(data);
        })
        this.selected_product_data = []
      }
    },
    selectMemberDialog(idx){
      this.member_type_index = idx
      this.member_dialog = true;
    },
    setMember(item){
      this.approve_member_info[this.member_type_index].name = item.name
      this.approve_member_info[this.member_type_index].user_id = item.user_id
      this.close();
    },
    members(data){
      this.members_list=data;
    },
    deleteShipDataRow(idx){
      if(this.product_ship_data.length === 1){
        mux.Util.showAlert('행이 한 개 이상 존재해야 합니다.')
      }else{
        this.product_ship_data.splice(idx, 1);
      }
    },
    async shipApprovalRequest(){
      let ship_input = this.shipCardInputs;
      let member_input = this.approve_member_info;
      let item = this.ship_confirmation_data;
      let success = true;
      const validate = this.$refs.shipForm.validate();
      if(validate){
        this.files_value = [];
        ship_input.forEach(data => {
          for(let i=0; i<Object.keys(item).length; i++){
            if(data.column_name == Object.keys(item)[i]){
              if(data.type == 'file'){
                if(data.value){
                  if(data.column_name === 'files'){
                    for(let f=0; f<data.value.length; f++){
                      if(f === 0){
                        item[Object.keys(item)[i]] = data.value[f].name
                      }else{
                        item[Object.keys(item)[i]] = item[Object.keys(item)[i]]+"/"+data.value[f].name
                      }
                      this.files_value.push(data.value[f])
                    }
                  }else if(data.column_name === 'inspection_report'){
                    this.inspection_report_value = data.value
                    item[Object.keys(item)[i]] = data.value.name;
                  }
                }else{
                  item[Object.keys(item)[i]] = '';
                }
              }else{
                item[Object.keys(item)[i]] = data.value;
              }
            }
          }
        })
        const currDate = new Date();
        item.ship_date = (this.ship_date_set === "" ? mux.Date.format(currDate, 'yyyy-MM-dd') : this.ship_date_set);
        item.creater = this.login_id;
        item.code = item.project_code + ":" + mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss.fff');

        let inspection_report_thumbnail = 'NULL';
        if(this.inspection_report_value){
          const getPdfThumbnail = await mux.Util.getPdfThumbnail(this.inspection_report_value, 1, false, 1000, 1000);
          inspection_report_thumbnail = mux.Util.uint8ArrayToHexString(getPdfThumbnail);
        }

        console.log(item);
        let empty_member = [];
        member_input.forEach(mem => {
          if(!mem.user_id){
            empty_member.push(mem.type)
          }else{
            if(mem.type === '확인'){
              item.checker = mem.name;
              item.checker_id = mem.user_id;
              if(item.checker_id == this.login_id){
                item.approval_phase = '미승인';
                item.checked_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
              }else{
                item.approval_phase = '미확인';
                item.checked_date = null;
              }
            }else if(mem.type === '승인'){
              item.approver = mem.name;
              item.approver_id = mem.user_id;
            }
          }
        })

        if(empty_member.length > 0){
          mux.Util.showAlert(empty_member+"을(를) 선택해주세요.");
          return success = false;
        }

        let ship_product_data = this.product_ship_data
        if(ship_product_data.length === 0){
          mux.Util.showAlert('자재를 선택해주세요.');
          return success = false;
        }else{
          for(let d = 0; d < ship_product_data.length; d++){
            if(ship_product_data[d].ship_num == '' || ship_product_data[d].ship_num == undefined){
              mux.Util.showAlert('출고 수량 필수 입력');
              return success = false;
            }else if(ship_product_data[d].ship_num == 0){
                mux.Util.showAlert('출고수량은 0보다 커야합니다.');
                return success = false;
            }else if(ship_product_data[d].ship_num > ship_product_data[d].stock_num){
              mux.Util.showAlert('재고보다 출고 수량이 많습니다.');
              return success = false;
            }
          }
        }

        if(success == true){
          mux.Util.showLoading();
          // console.log('출고 정보 : ' + JSON.stringify(item));
          // console.log('출고 제품 : ' + JSON.stringify(ship_product_data));

          let sendData = {
            "ship_confirmation_table-insert": [{
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "code" : this.ship_confirmation_data.code,
                "ship_date": this.ship_confirmation_data.ship_date,
                "project_code" : this.ship_confirmation_data.project_code,
                "ship_place" : this.ship_confirmation_data.ship_place,
                "purpose" : this.ship_confirmation_data.purpose,
                "approval_phase": this.ship_confirmation_data.approval_phase,
                "checker" : this.ship_confirmation_data.checker,
                "checker_id" : this.ship_confirmation_data.checker_id,
                "checked_date" : this.ship_confirmation_data.checked_date,
                "approver" : this.ship_confirmation_data.approver,
                "approver_id" : this.ship_confirmation_data.approver_id,
                "inspection_report_file" : this.ship_confirmation_data.inspection_report,
                "inspection_report_thumbnail" : inspection_report_thumbnail,
                "files" : this.ship_confirmation_data.files,
                "note" : this.ship_confirmation_data.note,
              },
              "select_where": {"code": this.ship_confirmation_data.code},
              "rollback": "yes"
            }]
          };

          let product_data = [];
          ship_product_data.forEach(data =>{
            product_data.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "code" : this.ship_confirmation_data.code,
                "type" : data.type,
                "classification" : data.classification,
                "product_code" : data._code,
                "name" : data.name,
                "ship_num" : data.ship_num.replace(/,/g,''),
                "spot" : data.spot,
                "spec" : data.spec,
                "model" : data.model,
                "manufacturer" : data.manufacturer,
                "unit_price" : data.unit_price.replace(/,/g,'').replace(/₩ /g,''),
              },
              "select_where": {"code": this.ship_confirmation_data.code, "product_code": data._code},
              "rollback": "yes"
            });
          });
          sendData["ship_product_table-insert"] = product_data;

          sendData.path = '/api/multipart_rest_api/';
          sendData.prefix = this.ship_confirmation_data.code + '_';
          sendData.files = [];
          if (this.ship_confirmation_data.inspection_report) {
            sendData.files.push({
              folder: 'ship/inspection_report',
              file: this.inspection_report_value,
              name: this.ship_confirmation_data.inspection_report
            });
          }
          if (this.ship_confirmation_data.files && this.files_value.length > 0) {
            for (let i = 0; i < this.files_value.length; i++) {
              const file = this.files_value[i];
              sendData.files.push({
                folder: 'ship/files',
                file: file,
                name: this.ship_confirmation_data.files.split('/')[i]
              });
            }
          }


          const prevURL = window.location.href;
          try {
            // let result = await mux.Server.post({
            //   path: '/api/common_rest_api/',
            //   params: sendData
            // });

            let result = await mux.Server.uploadFile(sendData);
            if (prevURL !== window.location.href) return;

            if (typeof result === 'string'){
              result = JSON.parse(result);
            }
            if(result.data['code'] == 0){
              // console.log('result :>> ', result);
              mux.Util.showAlert('출고 승인 요청이 완료되었습니다', '승인 완료', 3000);
              mux.Util.hideLoading();

              //메일 알림 관련
              let mailTo = [];
              let phase;
              if(item.approval_phase === '미확인'){
                mailTo.push(item.checker_id);
                phase = '확인'
              }else if(item.approval_phase === '미승인'){
                mailTo.push(item.approver_id);
                phase = '승인'
              }

              // 메일 본문 내용
              let content=`
                <html>
                  <body>
                    <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                      <h2 style="text-align: center; color:#13428a">출고 ${phase} 요청 알림</h2>
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
                      <a style="color: white; text-decoration:none"href="${prevURL.substring(0,prevURL.lastIndexOf('/'))}/ship-search?project_code=${item.project_code}&purpose=${item.purpose}&ship_date=${item.ship_date}">
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
                  subject: "출고 " + phase + " 요청 알림",
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
      }
    },
    dateChangedImport(item){
      this.ship_date_set = item
    },
    close(){
      this.member_dialog = false
    },
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
}
</script>
<style lang="">

</style>
