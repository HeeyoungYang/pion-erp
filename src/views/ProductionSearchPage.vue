<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productionMenu="true"></NavComponent>

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
                  <ProductionDataTableComponent
                    :headers="production_data_headers"
                    :items="approval_datas"
                    item-key="code"
                    approval
                    dense
                    :loginId="login_info.id"
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
      :dialog-value="production_detail_dialog"
      max-width="50%"
      title-class=" "
      :dialog-transition="'slide-x-transition'"
      :dialog-custom="'custom-dialog elevation-0 white'"
      :card-elevation="'0'"
      @close="closeProductList"
    >
      <v-container>
        <v-row class="mb-4">
          <v-col cols="12" sm="12">
            <v-chip
              class="font-weight-bold mr-4"
              :color="production_details.status === '생산 완료' ? 'primary' : 'default'"
            >
              {{ production_details.status === '생산 완료' ? '생산 완료' : '생산 미완료' }}
            </v-chip>
            <v-menu
              offset-y
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="show_inbound_button"
                  small
                  color="success"
                  v-bind="attrs"
                  v-on="on"
                  :disabled="production_details.approval_phase === '승인' && (production_details.inbound_date === '' || production_details.inbound_date === null) ? false : true"
                >
                  입고 승인 요청
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-content style="width: 250px;">
                    <v-autocomplete
                      v-model="inbound_checker"
                      :items="members"
                      label="확인"
                      filled
                      dense
                      clearable
                      hide-details
                      class="mb-4"
                    ></v-autocomplete>
                    <v-autocomplete
                      v-model="inbound_approver"
                      :items="members"
                      label="승인"
                      filled
                      dense
                      clearable
                      hide-details
                      class="mb-4"
                    ></v-autocomplete>
                    <v-autocomplete
                      v-model="inbound_material_manager"
                      :items="members"
                      label="자재 담당자"
                      filled
                      dense
                      clearable
                      hide-details
                      class="mb-4"
                    ></v-autocomplete>
                    <InputsFormComponent
                      dense
                      clearable
                      filled
                      hide-details
                      :inputs="inboundRequestInputs"
                    />
                    <v-btn
                      small
                      color="primary"
                      class="mt-4"
                      @click="inboundApprovalRequest"
                    >요청</v-btn>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>

            <span
              v-if="production_details.inbound_date !== null"
              class="ml-2"
            >
              : 입고 요청 완료
              <span class="success--text font-weight-bold">( {{ production_details.inbound_approval_phase }} 상태 )</span>
            </span>

            <span
              v-if="production_details.inbound_approval_phase === '승인'"
              class="ml-2"
            >
              : <span class="success--text font-weight-bold"> {{ production_details.inbound_date }} </span> 입고

            </span>

          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 자체시험</p>
            <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(production_details.self_test_thumbnail)"
              transition="scale-transition"
              width="100%"
              @click="download('production/self_test', production_details.self_test_file, production_details.code+'_')"
              style="cursor: pointer;"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 공장시험</p>
            <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(production_details.factory_test_thumbnail)"
              transition="scale-transition"
              width="100%"
              @click="download('production/self_test', production_details.factory_test_file, production_details.code+'_')"
              style="cursor: pointer;"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 현장시험</p>
            <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(production_details.field_test_thumbnail)"
              transition="scale-transition"
              width="100%"
              @click="download('production/self_test', production_details.field_test_file, production_details.code+'_')"
              style="cursor: pointer;"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 시운전</p>
            <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(production_details.trial_run_thumbnail)"
              transition="scale-transition"
              width="100%"
              @click="download('production/self_test', production_details.trial_run_file, production_details.code+'_')"
              style="cursor: pointer;"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 전자세금계산서</p>
            <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(production_details.tax_invoice_thumbnail)"
              transition="scale-transition"
              width="100%"
              @click="download('production/self_test', production_details.tax_invoice_file, production_details.code+'_')"
              style="cursor: pointer;"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 하자보증증권 </p>
            <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(production_details.defect_warranty_thumbnail)"
              transition="scale-transition"
              width="100%"
              @click="download('production/self_test', production_details.defect_warranty_file, production_details.code+'_')"
              style="cursor: pointer;"
            />
          </v-col>

        </v-row>
      </v-container>
    </ModalDialogComponent>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";

import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import ProductionDataTableComponent from "@/components/ProductionDataTableComponent.vue";
import LoadingModalComponent from "@/components/LoadingModalComponent.vue";
import ModalDialogComponent from "@/components/ModalDialogComponent.vue";
import ProductionSearchPageConfig from "@/configure/ProductionSearchPageConfig.json";
import mux from "@/mux";
import { PDFDocument } from 'pdf-lib'

export default {

  mounted() {

  },
  components: {
                NavComponent,
                CardComponent,
                ProductionDataTableComponent,
                InputsFormComponent,
                LoadingModalComponent,
                ModalDialogComponent
              },

  watch:{
    production_detail_dialog(val){
      val || this.closeProductList()
    },
  },

  created () {
    this.initialize()
    const project_code = this.$route.query.project_code;
    const inhouse_bid_number = this.$route.query.inhouse_bid_number;
    const company_bid_number = this.$route.query.company_bid_number;
    const company_name = this.$route.query.company_name;
    if (project_code && inhouse_bid_number && company_bid_number && company_name){
      this.setSearchCardInputs(project_code, inhouse_bid_number, company_bid_number, company_name);
      this.searchButton();
    }
  },
  methods:{
    // eslint-disable-next-line no-unused-vars

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

      try {
        let result = await mux.Server.getPionBasicInfo();
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        this.spot_list = result.spot;

      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }


      try {
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
          mux.Util.hideLoading();
          mux.Util.showAlert(result.message);
          return;
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.hideLoading();
        mux.Util.showAlert(error);
        return;
      }
      this.inboundRequestInputs.find(x=>x.column_name === 'spot').list = this.spot_list;
      this.searchCardInputs = JSON.parse(JSON.stringify(this.searchCardInputs));
    },

    setSearchCardInputs(project_code, inhouse_bid_number, company_bid_number, company_name){
      this.searchCardInputs.find(x=>x.label === '프로젝트 코드').value = project_code;
      this.searchCardInputs.find(x=>x.label === '사내 견적번호').value = inhouse_bid_number;
      this.searchCardInputs.find(x=>x.label === '기업별 입찰번호').value = company_bid_number;
      this.searchCardInputs.find(x=>x.label === '업체명').value = company_name;
    },
    async clickApproveData(item){
      this.production_details = {};
      mux.Util.showLoading();
      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "production_confirmation_table.code": item.code
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

          if(result.length === 0){
            mux.Util.showAlert('검색 결과가 없습니다.');
          }
          this.production_details = result.data[0];
          this.production_details.approval_phase = item.approval_phase;
          this.production_details.inbound_approval_phase = item.inbound_approval_phase;
          this.production_details.project_code = item.project_code;
          this.production_details.inhouse_bid_number = item.inhouse_bid_number;
          this.production_details.company_bid_number = item.company_bid_number;
          this.production_details.company_name = item.company_name;
          this.production_details.obtain_cost_calc_code = item.obtain_cost_calc_code;

          //thumbnail
          try {
            let thumbnail_result = await mux.Server.post({
              path: '/api/common_rest_api/',
              params: [
                {
                  "production_confirmation_table.code": item.code
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
              this.production_details = Object.assign(this.production_details, thumbnail);

              // try {
              //   let result = await mux.Server.post({
              //     path: '/api/common_rest_api/',
              //     params: [
              //       {
              //         "obtain_confirmation_table.inhouse_bid_number": item.inhouse_bid_number,
              //         "obtain_confirmation_table.company_name": item.company_name,
              //         "obtain_confirmation_table.company_bid_number": item.company_bid_number,
              //         "obtain_confirmation_table.project_code": item.project_code
              //       }
              //     ],
              //     "script_file_name": "rooting_수주_정보_검색_24_08_08_13_53_89S.json",
              //     "script_file_path": "data_storage_pion\\json_sql\\obtain\\수주_정보_검색_24_08_08_13_54_EFQ"
              //   });
              //   if (prevURL !== window.location.href) return;

              //   if (typeof result === 'string'){
              //     result = JSON.parse(result);
              //   }
              //   if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

              //     if(result.length === 0){
              //       mux.Util.showAlert('검색 결과가 없습니다.');
              //     }
              //     this.item_product_list = result.data.obtain_cost_calc_detail;
              //   } else {
              //     mux.Util.showAlert(result['failed_info']);
              //   }
              // } catch (error) {
              //   if (prevURL !== window.location.href) return;
              //   mux.Util.hideLoading();
              //   if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
              //     mux.Util.showAlert(error.response['data']['failed_info'].msg);
              //   else
              //     mux.Util.showAlert(error);
              // }
            } else {
              mux.Util.showAlert(thumbnail_result['failed_info']);
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            mux.Util.hideLoading();
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
        mux.Util.hideLoading();
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
      mux.Util.hideLoading();
      this.production_detail_dialog = true;

      if(item.approval_phase === '승인' && item.obtain_type === '재고' || (item.inbound_approval_phase !== '' || item.inbound_approval_phase !== null)){
        this.show_inbound_button = true;
      }
      this.set_inbound_code = item.code;
      this.set_project_code = item.project_code;
    },
    closeProductList(){
      this.production_detail_dialog = false;
    },
    async searchButton(){
      mux.Util.showLoading();
      let searchProjectCode = this.searchCardInputs.find(x=>x.label === '프로젝트 코드').value;
      if (searchProjectCode)
        searchProjectCode = searchProjectCode.trim();
      let searchInhouseNumber = this.searchCardInputs.find(x=>x.label === '사내 견적번호').value;
      if (searchInhouseNumber)
        searchInhouseNumber = searchInhouseNumber.trim();
      let searchCompanyNumber = this.searchCardInputs.find(x=>x.label === '기업별 입찰번호').value;
      if (searchCompanyNumber)
        searchCompanyNumber = searchCompanyNumber.trim();
      let searchCompany = this.searchCardInputs.find(x=>x.label === '업체명').value;
      if (searchCompany)
      searchCompany = searchCompany.trim();

      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "production_confirmation_table.inhouse_bid_number": searchInhouseNumber ? searchInhouseNumber : "",
              "production_confirmation_table.company_name": searchCompany ? searchCompany : "",
              "production_confirmation_table.company_bid_number": searchCompanyNumber ? searchCompanyNumber : "",
              "production_confirmation_table.project_code": searchProjectCode ? searchProjectCode : "",
            "production_confirmation_table.approval_phase": ""
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

          if(result['data'].length === 0){
            mux.Util.showAlert('검색 결과가 없습니다.');
          } else{
            this.approval_datas = result.data.filter(x=>x.approval_phase !== '작성중');
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


      // this.approval_datas = ProductionSearchPageConfig.test_approval_datas;
      mux.Util.hideLoading();
    },
    async setApprovalPhase(item, change, reason){
      const currDate = new Date();
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

      console.log(phase + ' : ' + JSON.stringify(send_data));
      let sendData = {
        "production_confirmation_table-update": [{
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "modifier"
          },
          "data":send_data,
          "update_where": {"code": item.code},
          "rollback": "yes"
        }]
      };

      mux.Util.showLoading();

      const prevURL = window.location.href;
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
          mux.Util.hideLoading();
          mux.Util.showAlert('생산 ' + phase + ' 완료', '완료', 3000);

          //메일 알림 관련
          let mailTo = [];
          let reject_info;
          if(phase === '확인'){
            mailTo.push(item.creater);
            mailTo.push(item.approver_id);
          }else if(phase === '승인'){
            mailTo.push(item.creater);
            if(item.creater !== item.checker_id){
              mailTo.push(item.checker_id);
            }
          }else if(phase === '확인 반려'){
            mailTo.push(item.creater);
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
            mailTo.push(item.creater);
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
                <h2 style="text-align: center; color:#13428a">생산 ${phase} 처리 알림</h2>
                <table style="width: 100%;border-spacing: 10px 10px;">
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.project_code}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">사내 견적번호</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.inhouse_bid_number}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">기업별 입찰번호</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.company_bid_number}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">업체</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.company_name}</td>
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
                <a style="color: white; text-decoration:none"href="${prevURL}?project_code=${item.project_code}&inhouse_bid_number=${item.inhouse_bid_number}&company_bid_number=${item.company_bid_number}&company_name=${item.company_name}">
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
              subject: "생산 " + phase + " 처리 알림",
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
        if (prevURL !== window.location.href) return;
        mux.Util.hideLoading();
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
      mux.Util.hideLoading();
    },
    async inboundApprovalRequest(){
      const currDate = new Date();
      if(this.inbound_checker === '' || this.inbound_approver === '' || this.inbound_material_manager === ''){
        mux.Util.showAlert('입고 승인 요청 정보를 모두 입력해주세요.');
        return;
      }

      mux.Util.showLoading();
      console.log(this.inbound_checker + ' / ' + this.inbound_approver + ' / ' + this.inbound_material_manager);

      let confirmation_data = {};
      confirmation_data.code = this.set_inbound_code
      confirmation_data.project_code = this.set_project_code
      confirmation_data.purchase_manager = '-'
      confirmation_data.material_manager = this.inbound_material_manager.split('-')[1]
      confirmation_data.checker = this.inbound_checker.split('-')[1]
      confirmation_data.checker_id = this.inbound_checker.split('-')[2]
      confirmation_data.approver = this.inbound_approver.split('-')[1]
      confirmation_data.approver_id = this.inbound_approver.split('-')[2]

      if(confirmation_data.checker_id == this.login_info.id){
        confirmation_data.approval_phase = '미승인';
        confirmation_data.checked_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss')
      }else{
        confirmation_data.approval_phase = '미확인';
      }
      confirmation_data.inbound_date = this.inboundRequestInputs.find(x=>x.column_name === 'inbound_date').value;
      confirmation_data.note = this.inboundRequestInputs.find(x=>x.column_name === 'note').value ? this.inboundRequestInputs.find(x=>x.column_name === 'note').value : '';
      confirmation_data.add_data = '생산 입고';




      //입고 데이터용 파일 정리
      // 시험서 3종 병합 (PDF-LIB 라이브러리 사용)
      // let self_test_file = await mux.Server.getFileUrl('production/self_test', this.set_inbound_code + '_' + this.production_details.self_test_file, 'application/pdf');
      // let factory_test_file = await mux.Server.getFileUrl('production/factory_test', this.set_inbound_code + '_' + this.production_details.factory_test_file, 'application/pdf');
      // let field_test_file = await mux.Server.getFileUrl('production/field_test', this.set_inbound_code + '_' + this.production_details.field_test_file, 'application/pdf');

      // let urls = [self_test_file, factory_test_file, field_test_file];

      let urls = [];
      if(this.production_details.self_test_file !== null){
        let self_test_file = await mux.Server.getFileUrl('production/self_test', this.set_inbound_code + '_' + this.production_details.self_test_file, 'application/pdf');
        urls.push(self_test_file);
      }

      if(this.production_details.factory_test_file !== null){
        let factory_test_file = await mux.Server.getFileUrl('production/factory_test', this.set_inbound_code + '_' + this.production_details.factory_test_file, 'application/pdf');
        urls.push(factory_test_file);
      }

      if(this.production_details.field_test_file !== null){
        let field_test_file = await mux.Server.getFileUrl('production/field_test', this.set_inbound_code + '_' + this.production_details.field_test_file, 'application/pdf');
        urls.push(field_test_file);
      }
      console.log(urls)
      const pdfDoc = await PDFDocument.create()
      for(let u = 0; u < urls.length; u++) {
        const donorPdfBytes = await fetch(urls[u]).then(res => res.arrayBuffer());
        // load/convert the document into a PDFDocument object
        const donorPdfDoc = await PDFDocument.load(donorPdfBytes);
        // iterate over the document's pages
        const docLength = donorPdfDoc.getPageCount();
        for(let k = 0; k < docLength; k++) {
            // extract the page to copy
            const [donorPage] = await pdfDoc.copyPages(donorPdfDoc, [k]);

            // add the page to the overall merged document
            pdfDoc.addPage(donorPage);
        }
      }

      const pdfBytes  = await pdfDoc.save();
      const pdfByteArray = new Uint8Array(pdfBytes);
      const pdfBlob = new Blob([pdfByteArray], { type: 'application/octet-stream' });

      const inspection_report_file = new File([pdfBlob], '시험 성적서');
      console.log(inspection_report_file);
      const getPdfThumbnail = await mux.Util.getPdfThumbnail(inspection_report_file, 1, false, 1000, 1000);
      let inspection_report_thumbnail = mux.Util.uint8ArrayToHexString(getPdfThumbnail);

      confirmation_data.inspection_report_file = '시험성적서.pdf';
      confirmation_data.inspection_report_thumbnail = inspection_report_thumbnail;

      let sendData = {};
      sendData.files = [];
      sendData.files.push({
        folder: 'inbound/inspection_report',
        file: inspection_report_file,
        name: confirmation_data.inspection_report_file
      });

      // 시험서 3종 외 파일들 inbound_confirmation_table의 files에 저장하기 위한 설정
      // let trial_run_blob = await mux.Server.getFileData('production/trial_run', this.set_inbound_code + '_' + this.production_details.trial_run_file, 'application/pdf');
      // const trial_run_file = new File([trial_run_blob], this.production_details.trial_run_file);

      // let tax_invoice_blob = await mux.Server.getFileData('production/tax_invoice', this.set_inbound_code + '_' + this.production_details.tax_invoice_file, 'application/pdf');
      // const tax_invoice_file = new File([tax_invoice_blob], this.production_details.trial_run_file);

      // let defect_warranty_blob = await mux.Server.getFileData('production/defect_warranty', this.set_inbound_code + '_' + this.production_details.defect_warranty_file, 'application/pdf');
      // const defect_warranty_file = new File([defect_warranty_blob], this.production_details.trial_run_file);

      let check_file = 0;
      if(this.production_details.trial_run_file !== null){
        let trial_run_blob = await mux.Server.getFileData('production/trial_run', this.set_inbound_code + '_' + this.production_details.trial_run_file, 'application/pdf');
        const trial_run_file = new File([trial_run_blob], this.production_details.trial_run_file);
        sendData.files.push({
          folder: 'inbound/files',
          file: trial_run_file,
          name: this.production_details.trial_run_file
        });
        confirmation_data.files = this.production_details.trial_run_file;
        check_file++;
      }

      if(this.production_details.tax_invoice_file !== null){
        let tax_invoice_blob = await mux.Server.getFileData('production/tax_invoice', this.set_inbound_code + '_' + this.production_details.tax_invoice_file, 'application/pdf');
        const tax_invoice_file = new File([tax_invoice_blob], this.production_details.tax_invoice_file);
        sendData.files.push({
          folder: 'inbound/files',
          file: tax_invoice_file,
          name: this.production_details.tax_invoice_file
        });
        if(check_file === 0){
          confirmation_data.files = this.production_details.tax_invoice_file;
        } else{
          confirmation_data.files += "/" + this.production_details.tax_invoice_file;
        }
        check_file++;
      }

      if(this.production_details.defect_warranty_file !== null){
        let defect_warranty_blob = await mux.Server.getFileData('production/defect_warranty', this.set_inbound_code + '_' + this.production_details.defect_warranty_file, 'application/pdf');
        const defect_warranty_file = new File([defect_warranty_blob], this.production_details.defect_warranty_file);
        sendData.files.push({
          folder: 'inbound/files',
          file: defect_warranty_file,
          name: this.production_details.defect_warranty_file
        });
        if(check_file === 0){
          confirmation_data.files = this.production_details.defect_warranty_file;
        } else{
          confirmation_data.files += "/" + this.production_details.defect_warranty_file;
        }
      }


      // confirmation_data.files = this.production_details.trial_run_file + "/" + this.production_details.tax_invoice_file + "/" + this.production_details.defect_warranty_file;


      let insert_confirmation_data = [];
      insert_confirmation_data.push({
        "user_info": {
          "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
          "role": "creater"
        },
        "data":confirmation_data,
        "select_where": {"code": confirmation_data.code},
        "rollback": "yes"
      });
    // sendData = {
    //     "inbound_confirmation_table-insert": [{
    //       "user_info": {
    //         "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
    //         "role": "creater"
    //       },
    //       "data":confirmation_data,
    //       "select_where": {"code": confirmation_data.code},
    //       "rollback": "yes"
    //     }]
    //   };

      let update_production_data = [];
      update_production_data.push({
        "user_info": {
          "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
          "role": "modifier"
        },
        "data": {
          "inbound_date": confirmation_data.inbound_date,
          "inbound_approval_phase": confirmation_data.approval_phase
        },
        "update_where": {"code": confirmation_data.code},
        "rollback": "yes"
      })

      sendData["production_confirmation_table-update"] = update_production_data;
      sendData["inbound_confirmation_table-insert"] = insert_confirmation_data;

      sendData.path = '/api/multipart_rest_api/';
      sendData.prefix = confirmation_data.code + '_';

      const prevURL = window.location.href;
      let product_info = [];

      // let reqURL2 = '/api/design-production-search/?approval_phase=&project_code=' + this.production_details.project_code + '&inhouse_bid_number=' + this.production_details.inhouse_bid_number + '&company_bid_number=' + this.production_details.company_bid_number + '&company_name=' + this.production_details.company_name;

      let reqURL2 = `/api/design-production-search/?approval_phase=&project_code=${this.production_details.project_code}&inhouse_bid_number=${this.production_details.inhouse_bid_number}&company_bid_number=${this.production_details.company_bid_number}&company_name=${this.production_details.company_name}`;

      try {
        let result2 = await mux.Server.get({path: reqURL2});
        if (prevURL !== window.location.href) return;

        if (typeof result2 === 'string'){
          result2 = JSON.parse(result2);
        }
        if(result2['code'] == 0 || (typeof result2['data'] === 'object' && result2['data']['code'] == 0) || (typeof result2['response'] === 'object' && typeof result2['response']['data'] === 'object' && result2['response']['data']['code'] == 0)){
          const searchDesignResult = result2.data;
          // const searchDesignResult = JSON.parse(JSON.stringify(DesignProductionSearchPageConfig.test_design_data));
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

          let design_cost_calc_code = searchDesignResult.confirmation.find(x=>x.obtain_cost_calc_code === this.production_details.obtain_cost_calc_code).cost_calc_code;
          let product_list = searchDesignResult.product_cost_calc_detail.filter(x=>x.cost_calc_code === design_cost_calc_code);
          product_list.forEach(info => {
            product_info.push({
              //inbound_num, unit_price 추가 작업 해야함
              "code": confirmation_data.code,
              "type": "완제품",
              "classification": info.classification,
              "product_code": info.product_code,
              "name": info.product_name,
              "spot": this.inboundRequestInputs.find(x=>x.column_name === 'spot').value,
              "spec": info.product_spec,
              "model": info.product_model,
              "manufacturer": info.manufacturer,
              "inbound_num": info.product_num,
              "left_num": info.product_num,
              "unit_price": info.product_unit_price,
              "ship_code": "미선택"
            });
          })
          console.log(searchDesignResult);
          // 설계 이력 추가하기
          // searchResult.design_confirmation = searchDesignResult.confirmation;
          // searchResult.last_design_confirmation = searchDesignResult.last_design_confirmation;
          // if (searchDesignResult.product_cost && searchDesignResult.product_cost.length > 0){
          //   searchResult.product_cost = [...searchResult.product_cost, ...searchDesignResult.product_cost];
          // }
          // if (searchDesignResult.labor_cost_calc_detail && searchDesignResult.labor_cost_calc_detail.length > 0){
          //   searchResult.labor_cost_calc_detail = [...searchResult.labor_cost_calc_detail, ...searchDesignResult.labor_cost_calc_detail];
          // }
          // if (searchDesignResult.product_cost_calc_detail && searchDesignResult.product_cost_calc_detail.length > 0){
          //   searchResult.product_cost_calc_detail = [...searchResult.product_cost_calc_detail, ...searchDesignResult.product_cost_calc_detail];
          // }
          // if (searchDesignResult.construction_materials_data && searchDesignResult.construction_materials_data.length > 0){
          //   searchResult.construction_materials_data = [...searchResult.construction_materials_data, ...searchDesignResult.construction_materials_data];
          // }

          // searchResult.purchase_detail_data = searchDesignResult.purchase_detail_data;

          // this.searchDataCalcProcess(searchResult);

        }else{
          mux.Util.showAlert(result2);
        }

      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }
      // for(let i=0; i<this.item_product_list.length; i++){
      //   let product_code = this.item_product_list[i].product_code;
      //   try {
      //     let result = await mux.Server.post({
      //       path: '/api/common_rest_api/',
      //       "params": [
      //           {
      //             "product_table.product_code": product_code
      //           }
      //       ],
      //       "script_file_name": "rooting_완제품_검색_24_05_16_13_52_1IN.json",
      //       "script_file_path": "data_storage_pion\\json_sql\\stock\\10_완제품_검색\\완제품_검색_24_05_16_13_53_MZJ"
      //     });
      //     if (prevURL !== window.location.href) return;

      //     if (typeof result === 'string'){
      //       result = JSON.parse(result);
      //     }
      //     if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
      //       let info = result['data'][0];
      //       product_info.push({
      //         //inbound_num, unit_price 추가 작업 해야함
      //         "code": confirmation_data.code,
      //         "type": "완제품",
      //         "classification": info.classification,
      //         "product_code": info.code,
      //         "name": info.name,
      //         "spot": this.inboundRequestInputs.find(x=>x.column_name === 'spot').value,
      //         "spec": info.spec,
      //         "model": info.model,
      //         "manufacturer": info.manufacturer,
      //         "ship_code": "미선택"
      //       });
      //       console.log(product_info);
      //     }else{
      //       if (prevURL !== window.location.href) return;
      //       mux.Util.showAlert(result);
      //     }
      //   } catch (error) {
      //     if (prevURL !== window.location.href) return;
      //     mux.Util.hideLoading();
      //     // console.error(error);
      //     mux.Util.showAlert(error);
      //   }
      // }
      let product_data = [];
      for(let p=0; p<product_info.length; p++){
        product_data.push({
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "creater"
          },
          "data": product_info[p],
          "select_where": {"code": product_info[p].code, "product_code": product_info[p].product_code},
          "rollback": "yes"
        });
      }
      console.log(product_data);
      sendData["inbound_product_table-insert"] = product_data;


      try {
        let result = await mux.Server.uploadFile(sendData);
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result.data['code'] == 0){
          // console.log('result :>> ', result);
          mux.Util.showAlert('입고 승인 요청이 완료되었습니다', '요청 완료', 3000);

          //메일 알림 관련
          let mailTo = [];
          let phase;
          if(confirmation_data.approval_phase === '미확인'){
            mailTo.push(confirmation_data.checker_id);
            phase = '확인'
          }else if(confirmation_data.approval_phase === '미승인'){
            mailTo.push(confirmation_data.approver_id);
            phase = '승인'
          }

          // 메일 본문 내용
          let content=`
            <html>
              <body>
                <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                  <h2 style="text-align: center; color:#13428a">입고 ${phase} 요청 알림</h2>
                  <table style="width: 100%;border-spacing: 10px 10px;">
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${confirmation_data.project_code}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">입고 일자</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${confirmation_data.inbound_date}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.$cookies.get(this.$configJson.cookies.name.key).trim()}</td>
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
                  <a style="color: white; text-decoration:none"href="${prevURL.substring(0,prevURL.lastIndexOf('/'))}/inbound-search?inbound_date=${confirmation_data.inbound_date}">
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
              subject: "입고 " + phase + " 요청 알림",
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
        if (prevURL !== window.location.href) return;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
      mux.Util.hideLoading();

    }
  },
  data(){
    return{
      mux: mux,
      loading_dialog : false,
      production_detail_dialog: false,
      show_inbound_button: false,
      searchCardInputs: ProductionSearchPageConfig.searchCardInputs,
      login_info: ProductionSearchPageConfig.login_info,
      production_data_headers: ProductionSearchPageConfig.production_data_headers,
      inboundRequestInputs: ProductionSearchPageConfig.inboundRequestInputs,
      members: [],
      classification_list: [],
      spot_list: [],
      approval_datas: [],
      item_product_list:[],
      production_details:{},
      inbound_checker:'',
      inbound_approver:'',
      inbound_material_manager:'',
      set_inbound_code: '',
      set_project_code: ''
    }
  }
}
</script>
