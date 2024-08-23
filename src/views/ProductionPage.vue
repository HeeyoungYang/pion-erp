<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productionMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row class=" mt-5">
        <v-col cols="12" sm="5">
          <CardComponent
            elevation="1"
            text-class=" pt-3"
            title-class="d-none"
          >
            <div slot="cardText">
              <InputsFormComponent
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
                  lg="3"
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
              <v-row>
                <v-col
                  cols="12"
                >
                  <DataTableComponent
                    dense
                    :headers="search_production_headers"
                    :items="search_obtain_data"
                    item-key="estimate_code"
                    @clickTr="productionDetail"
                  />
                </v-col>
              </v-row>
            </div>
          </CardComponent>
        </v-col>
        <v-col cols="12" sm="7">
          <CardComponent
            elevation="1"
            text-class=" pt-3"
            v-if="show_detail"
          >
            <v-row slot="cardTitle">
              <v-col cols="12" sm="12">
                <v-chip
                  v-if="production_detail.approval_phase"
                  class="mr-2"
                  outlined
                  :color="production_detail.approval_phase === '작성중' ? 'default': (production_detail.approval_phase === '미승인' || production_detail.approval_phase === '미확인' ? 'amber darken-2' : (production_detail.approval_phase === '승인' ? 'primary' : 'error'))"
                >
                  {{ production_detail.approval_phase }}
                </v-chip>
                <MemberSearchDialogComponent
                  :dialog-value="member_dialog"
                  :persistent="true"
                  @close="close"
                  @setMember = "setMember"
                  @members = "members"
                >
                </MemberSearchDialogComponent>
                <v-chip
                  class="mr-2"
                  style="cursor:pointer"
                  v-for="(member, i) in member_info"
                  :key="i"
                  :color="member.name ? 'success' : 'default'"
                  @click="edit_data ? selectMemberDialog(i) : ''"
                >
                  {{ member.type }} : {{ member.name }}
                </v-chip>
                <v-chip
                  v-if="!edit_data"
                  class="font-weight-bold mr-4"
                  :color="production_detail.status === '생산 완료' ? 'primary' : 'default'"
                >
                  {{ production_detail.status === '생산 완료' ? '생산 완료' : '생산 미완료' }}
                </v-chip>
                <v-btn
                  v-if="!edit_data && (production_detail.approval_phase === '작성중' || production_detail.approval_phase === '반려')"
                  color="grey lighten-2"
                  fab
                  x-small
                  elevation="0"
                  class="float-right"
                  @click="edit_data = true"
                >
                  <v-icon
                    small
                  >mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  v-if="edit_data"
                  class="float-right"
                  color="primary"
                  small
                  elevation="0"
                  @click="saveProduction('승인요청')"
                >
                  승인 요청
                </v-btn>
                <v-btn
                  v-if="edit_data"
                  color="primary"
                  class="mr-2 float-right"
                  small
                  outlined
                  elevation="0"
                  @click="saveProduction('저장')"
                >
                  진행사항 저장
                </v-btn>
                <v-btn
                  v-if="edit_data"
                  color="error"
                  class="mr-2 float-right"
                  small
                  outlined
                  elevation="0"
                  @click="edit_data = false"
                >
                  취소
                </v-btn>
              </v-col>
            </v-row>
            <div slot="cardText"
              v-if="!edit_data"
            >
              <v-row>
                <v-col cols="12" sm="4">
                  <p class="font-weight-bold primary--text mb-0">▼ 자체시험</p>
                  <v-img
                    alt="thumbnail"
                    class="shrink mr-2"
                    contain
                    :src="mux.Util.imageBinary(production_detail.self_test_thumbnail)"
                    transition="scale-transition"
                    width="350"
                    @click="download('production/self_test', production_detail.self_test_file, production_detail.code+'_')"
                    style="cursor: pointer;"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <p class="font-weight-bold primary--text mb-0">▼ 공장시험</p>
                  <v-img
                    alt="thumbnail"
                    class="shrink mr-2"
                    contain
                    :src="mux.Util.imageBinary(production_detail.factory_test_thumbnail)"
                    transition="scale-transition"
                    width="350"
                    @click="download('production/factory_test', production_detail.factory_test_file, production_detail.code+'_')"
                    style="cursor: pointer;"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <p class="font-weight-bold primary--text mb-0">▼ 현장시험</p>
                  <v-img
                    alt="thumbnail"
                    class="shrink mr-2"
                    contain
                    :src="mux.Util.imageBinary(production_detail.field_test_thumbnail)"
                    transition="scale-transition"
                    width="350"
                    @click="download('production/field_test', production_detail.field_test_file, production_detail.code+'_')"
                    style="cursor: pointer;"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <p class="font-weight-bold primary--text mb-0">▼ 시운전</p>
                  <v-img
                    alt="thumbnail"
                    class="shrink mr-2"
                    contain
                    :src="mux.Util.imageBinary(production_detail.trial_run_thumbnail)"
                    transition="scale-transition"
                    width="350"
                    @click="download('production/trial_run', production_detail.trial_run_file, production_detail.code+'_')"
                    style="cursor: pointer;"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <p class="font-weight-bold primary--text mb-0">▼ 전자세금계산서</p>
                  <v-img
                    alt="thumbnail"
                    class="shrink mr-2"
                    contain
                    :src="mux.Util.imageBinary(production_detail.tax_invoice_thumbnail)"
                    transition="scale-transition"
                    width="350"
                    @click="download('production/tax_invoice', production_detail.tax_invoice_file, production_detail.code+'_')"
                    style="cursor: pointer;"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <p class="font-weight-bold primary--text mb-0">▼ 하자보증증권 </p>
                  <v-img
                    alt="thumbnail"
                    class="shrink mr-2"
                    contain
                    :src="mux.Util.imageBinary(production_detail.defect_warranty_thumbnail)"
                    transition="scale-transition"
                    width="350"
                    @click="download('production/defect_warranty', production_detail.defect_warranty_file, production_detail.code+'_')"
                    style="cursor: pointer;"
                  />
                </v-col>

              </v-row>
            </div>
            <div slot="cardText"
              v-else
            >
              <v-checkbox
                hide-details
                class="my-2"
                label="생산 완료"
                v-model="status"
              ></v-checkbox>

              <InputsFormComponent
                v-if="production_detail.code === ''"
                dense
                clearable
                filled
                hide-details
                :inputs="editDataInputs"
              />
              <v-row
                v-else
              >
                <v-col v-for="(input, n) in editDataInputs" :key="n" :cols="input.col" :sm="input.sm">
                  <v-row>
                    <v-col cols="12" sm="10">
                      <v-file-input
                        dense
                        clearable
                        filled
                        hide-details
                        v-model="input.value"
                        :prepend-icon="input.icon"
                        :append-icon="input.appendIcon"
                        :label="input.label"
                        :disabled="input.disabled"
                        :accept="input.accept"
                        @change="input.accept ?
                        input.accept.includes('jpg') ? mux.Util.checkTypeImage($event, $refs[input.ref ? input.ref : 'file' + input.accept + index][0]) :
                        input.accept.includes('pdf') ? mux.Util.checkTypePdf($event, $refs[input.ref ? input.ref : 'file' + input.accept + index][0]) :
                        input.accept.includes('xlsx') ? mux.Util.checkTypeExcel($event, $refs[input.ref ? input.ref : 'file' + input.accept + index][0]) :  ''
                        : ''"
                      ></v-file-input>
                    </v-col>
                    <v-menu
                        open-on-hover
                        :close-on-content-click="false"
                        :nudge-width="100"
                        offset-x
                      >
                        <!-- v-if="this.registMaterialInputs[this.registMaterialInputs.length-1].value" -->
                        <template v-slot:activator="{ on, attrs }">
                          <v-col cols="12" sm="2" align-self="center">
                            <v-icon
                              :color="setThumbnail(input.column_name, 'name') !== '' ? 'primary' : 'default'"
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-image-multiple-outline
                            </v-icon>
                          </v-col>
                        </template>

                        <v-card class="pa-0">
                          <v-list class="pa-0">
                            <v-list-item class="pa-0">
                              <v-list-item-content class="pa-3">
                                <v-list-item-subtitle>
                                  <p class="mb-0">{{ setThumbnail(input.column_name, 'name') !== '' ? setThumbnail(input.column_name, 'name') : '미첨부' }}</p>
                                  <v-img
                                    alt="thumbnail"
                                    class="shrink mr-2"
                                    contain
                                    :src="setThumbnail(input.column_name, 'thumbnail')"
                                    transition="scale-transition"
                                    width="500"
                                  />
                                </v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-card>
                      </v-menu>
                  </v-row>
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

import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import DataTableComponent from "@/components/DataTableComponent.vue";
import MemberSearchDialogComponent from "@/components/MemberSearchDialogComponent.vue";
import ProductionPageConfig from "@/configure/ProductionPageConfig.json";
import mux from "@/mux";

export default {

  mounted() {

  },
  components: {
                NavComponent,
                CardComponent,
                DataTableComponent,
                MemberSearchDialogComponent,
                InputsFormComponent
              },

  created () {
    this.initialize()
  },

  methods:{
    // eslint-disable-next-line no-unused-vars

    initialize(){
      // this.search_obtain_data = ProductionPageConfig.test_estimate_data
      const prevURL = window.location.href;
      try {
        if (prevURL !== window.location.href) return;
        this.member_info[0].name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.member_info[0].email =  this.$cookies.get(this.$configJson.cookies.email.key);
        this.member_info[0].user_id =this.$cookies.get(this.$configJson.cookies.id.key);
        this.login_id = this.$cookies.get(this.$configJson.cookies.id.key);
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }

      this.production_detail = JSON.parse(JSON.stringify(ProductionPageConfig.production_detail));
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
              "obtain_confirmation_table.inhouse_bid_number": searchInhouseNumber ? searchInhouseNumber : "",
              "obtain_confirmation_table.company_name": searchCompany ? searchCompany : "",
              "obtain_confirmation_table.company_bid_number": searchCompanyNumber ? searchCompanyNumber : "",
              "obtain_confirmation_table.project_code": searchProjectCode ? searchProjectCode : "",
              "obtain_confirmation_table.approval_phase": "승인"
            }
          ],
          "script_file_name": "rooting_수주_정보_검색_24_08_08_13_53_89S.json",
          "script_file_path": "data_storage_pion\\json_sql\\obtain\\수주_정보_검색_24_08_08_13_54_EFQ"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

          if(result.length === 0){
            mux.Util.showAlert('검색 결과가 없습니다.');
          }
          this.search_obtain_data = result.data.obtain_confirmation;
          // result.data.obtain_cost_calc_detail;
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
    async productionDetail(item){
      // this.search_production_data = ProductionPageConfig.test_production_data;

      mux.Util.showLoading();

      const prevURL = window.location.href;
      let confirm = {};
      let info = {};
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "production_confirmation_table.inhouse_bid_number": item.inhouse_bid_number,
              "production_confirmation_table.company_name": item.company_name,
              "production_confirmation_table.company_bid_number": item.company_bid_number,
              "production_confirmation_table.project_code": item.project_code
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

          if(result.length === 0){
            mux.Util.showAlert('검색 결과가 없습니다.');
          }
          confirm = result.data[0];
          if(confirm !== undefined){

            try {
              let result = await mux.Server.post({
                path: '/api/common_rest_api/',
                params: [
                  {
                    "production_confirmation_table.code": confirm.code
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
                info = result.data[0];

                //thumbnail
                try {
                  let thumbnail_result = await mux.Server.post({
                    path: '/api/common_rest_api/',
                    params: [
                      {
                        "production_confirmation_table.code": confirm.code
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
                    info = Object.assign(info, thumbnail);
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



      console.log('confirm : ' + confirm);
      console.log('info : ' + info);

      if(confirm !== undefined && info !== undefined){
        this.search_production_data = Object.assign(confirm, info);
      }

      mux.Util.hideLoading();

      this.show_detail = true;
      // 데이터가 없을 경우
      if(this.search_production_data.length === 0){
        this.edit_data = true;
        this.production_detail.project_code = item.project_code
        this.production_detail.company_name = item.company_name
        this.production_detail.obtain_type = item.obtain_type
        this.production_detail.inhouse_bid_number = item.inhouse_bid_number
        this.production_detail.company_bid_number = item.company_bid_number
      }else{// 데이터가 있을 경우
        // this.search_production_data.forEach((data) => {
        //   for(let i=0; i<Object.keys(this.production_detail).length; i++){
        //     let key = Object.keys(this.production_detail)[i];
        //     this.production_detail[key] = data[key];
        //   }
        // });
        this.production_detail = JSON.parse(JSON.stringify(this.search_production_data));
        this.member_info.find(x => x.type === '확인').name = this.production_detail.checker;
        this.member_info.find(x => x.type === '확인').user_id = this.production_detail.checker_id;
        this.member_info.find(x => x.type === '승인').name = this.production_detail.approver;
        this.member_info.find(x => x.type === '승인').user_id = this.production_detail.approver_id;
        if(this.production_detail.status === '생산 완료'){
          this.status = true;
        }
      }
    },
    selectMemberDialog(idx){
      this.member_type_index = idx
      this.member_dialog = true;
    },
    setMember(item){
      this.member_info[this.member_type_index].name = item.name
      this.member_info[this.member_type_index].user_id = item.user_id
      this.close();
    },
    members(data){
      this.members_list=data;
    },
    close(){
      this.member_dialog = false
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
    setThumbnail(column_name, type){
      let thumbnail = this.production_detail[column_name + '_thumbnail'];
      let file_name = this.production_detail[column_name + '_file'];
      if(type === 'name'){
        return file_name;
      }else{
        return mux.Util.imageBinary(thumbnail);
      }
    },
    async saveProduction(type){
      mux.Util.showLoading();
      const currDate = new Date();
      let production_data = this.production_detail;
      let checker_info = this.member_info.find(x => x.type === '확인');
      let approver_info = this.member_info.find(x => x.type === '승인');
      let production_files = this.editDataInputs


      if(production_data.code === ''){
        let set = '';
        if(this.status){
          production_data.status = '생산 완료';
        }else{
          production_data.status = '';
        }

        if(type === '저장'){
          production_data.approval_phase = '작성중';
          set = '진행사항 저장'
        }else{
          if(approver_info.user_id === ''){
            mux.Util.showAlert('승인자를 선택해주세요.');
            return;
          }else{
            if(checker_info.user_id == this.login_id){
              production_data.approval_phase = '미승인';
              production_data.checked_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
            }else{
              production_data.approval_phase = '미확인';
            }
          }
          set = '승인 요청'
        }

        for(let p=0; p<production_files.length; p++){
          let item = production_files[p];
          if(item.value){
            production_data[item.column_name + '_file'] = item.value.name;
            const getPdfThumbnail = await mux.Util.getPdfThumbnail(item.value, 1, false);
            let file_thumbnail = mux.Util.uint8ArrayToHexString(getPdfThumbnail);
            production_data[item.column_name + '_thumbnail'] = file_thumbnail;
            this.files_value.find(x => x.type === item.column_name).file = item.value;
            this.files_value.find(x => x.type === item.column_name).file_name = item.value.name;
          }
        }

        production_data.checker = checker_info.name;
        production_data.checker_id = checker_info.user_id;
        production_data.approver = approver_info.name;
        production_data.approver_id = approver_info.user_id;


        production_data.code = "production"+mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
        let sendData = {
          "production_confirmation_table-insert": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "creater"
            },
            "data":production_data,
            "select_where": {"code": production_data.code},
            "rollback": "yes"
          }]
        };
        sendData.path = '/api/multipart_rest_api/';
        sendData.prefix = production_data.code + '_';
        sendData.files = [];

        this.files_value.forEach(data => {
          if(data.file){
            sendData.files.push({
              folder: 'production/'+data.type,
              file: data.file,
              name: data.file_name
            });
          }
        })
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
            mux.Util.showAlert(set + '이 완료되었습니다', set, 3000);
            if(set === '승인 요청'){
              let mailTo = [];
              let phase = '';
              if(production_data.approval_phase === '미확인'){
                mailTo.push(production_data.checker_id);
                phase = '확인';
              }else if(production_data.approval_phase === '미승인'){
                mailTo.push(production_data.approver_id);
                phase = '승인';
              }

              let content=`
                <html>
                  <body>
                    <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                      <h2 style="text-align: center; color:#13428a">생산 ${phase} 요청 알림</h2>
                      <table style="width: 100%;border-spacing: 10px 10px;">
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.$cookies.get(this.$configJson.cookies.name.key).trim()}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${production_data.project_code}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">사내 견적번호</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${production_data.inhouse_bid_number}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">기업별 입찰번호</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${production_data.company_bid_number}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">업체</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${production_data.company_name}</td>
                        </tr>
                      </table>
                      <a style="color: white; text-decoration:none"href="${prevURL.substring(0,prevURL.lastIndexOf('/'))}/purchase-search?project_code=${production_data.project_code}">
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
                  subject: "생산 " + phase + " 요청 알림",
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
            }
            mux.Util.hideLoading();
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
      }else{
        let update_data = {};
        let set = '';

        if(type === '저장'){
          update_data.approval_phase = '작성중';
          set = '진행사항 저장'
        }else{
          if(approver_info.user_id === ''){
            mux.Util.showAlert('승인자를 선택해주세요.');
            return;
          }else{
            update_data.checker = checker_info.name;
            update_data.checker_id = checker_info.user_id;
            update_data.approver = approver_info.name;
            update_data.approver_id = approver_info.user_id;

            if(checker_info.user_id == this.login_id){
              update_data.approval_phase = '미승인';
              update_data.rejecter = null;
              update_data.rejected_date = null;
              update_data.reject_reason = null;
              update_data.checked_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
            }else{
              update_data.approval_phase = '미확인';
              update_data.rejecter = null;
              update_data.rejected_date = null;
              update_data.reject_reason = null;
            }
          }
          set = '승인 요청'
        }

        // let confirm = await mux.Util.showConfirm(set + ' 시 수정이 불가능합니다.<br>'+ set+'을 하시겠습니까?', '승인 요청', false, '예', '아니오');

        if(this.status){
          update_data.status = '생산 완료';
        }else{
          update_data.status = '';
        }

        for(let p=0; p<production_files.length; p++){
          let item = production_files[p];
          if(item.value){
            update_data[item.column_name + '_file'] = item.value.name;
            const getPdfThumbnail = await mux.Util.getPdfThumbnail(item.value, 1, false);
            let file_thumbnail = mux.Util.uint8ArrayToHexString(getPdfThumbnail);
            update_data[item.column_name + '_thumbnail'] = file_thumbnail;
            this.files_value.find(x => x.type === item.column_name).file = item.value;
            this.files_value.find(x => x.type === item.column_name).file_name = item.value.name;
          }
        }
        console.log(update_data);
        let sendData = {
          "production_confirmation_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":update_data,
            "update_where": {"code": production_data.code},
            "rollback": "yes"
          }]
        };
        sendData.path = '/api/multipart_rest_api/';
        sendData.prefix = production_data.code + '_';
        sendData.files = [];

        this.files_value.forEach(data => {
          if(data.file){
            sendData.files.push({
              folder: 'production/'+data.type,
              file: data.file,
              name: data.file_name
            });
          }
        })
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
            mux.Util.showAlert(set + '이 완료되었습니다', set, 3000);
            if(set === '승인 요청'){
              let mailTo = [];
              let phase = '';
              if(update_data.approval_phase === '미확인'){
                mailTo.push(checker_info.user_id);
                phase = '확인';
              }else if(update_data.approval_phase === '미승인'){
                mailTo.push(approver_info.user_id);
                phase = '승인';
              }

              let content=`
                <html>
                  <body>
                    <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                      <h2 style="text-align: center; color:#13428a">생산 ${phase} 요청 알림</h2>
                      <table style="width: 100%;border-spacing: 10px 10px;">
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${production_data.given_name}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${production_data.project_code}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">사내 견적번호</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${production_data.inhouse_bid_number}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">기업별 입찰번호</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${production_data.company_bid_number}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">업체</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${production_data.company_name}</td>
                        </tr>
                      </table>
                      <a style="color: white; text-decoration:none"href="${prevURL.substring(0,prevURL.lastIndexOf('/'))}/purchase-search?project_code=${production_data.project_code}">
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
                  subject: "생산 알림",
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
            }
            mux.Util.hideLoading();
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
  },
  data(){
    return{
      mux: mux,
      edit_data : false,
      show_detail: false,
      member_dialog: false,
      status: false,
      files_value:[
        {type:'self_test', file:''},
        {type:'factory_test', file:''},
        {type:'field_test', file:''},
        {type:'trial_run', file:''},
        {type:'tax_invoice', file:''},
        {type:'defect_warranty', file:''}
      ],
      // self_test_file_value:'',
      // factory_test_file_value:'',
      // field_test_file_value:'',
      // trial_run_file_value:'',
      // tax_invoice_file_value:'',
      // defect_warranty_file_value:'',
      member_info: ProductionPageConfig.member_info,
      searchCardInputs: ProductionPageConfig.searchCardInputs,
      editDataInputs: ProductionPageConfig.editDataInputs,
      search_production_headers: ProductionPageConfig.search_production_headers,
      production_detail: [],
      search_obtain_data: [],
      search_production_data: []
    }
  }
}
</script>
