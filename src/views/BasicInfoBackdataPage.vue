<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :backDataMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <LoadingModalComponent :dialog-value="loading_dialog" hide-overlay></LoadingModalComponent>
      <v-row justify="center">
        <v-col cols="12" sm="11">
          <v-tabs
            v-model="tab_main"
            background-color="transparent"
          >
            <v-tab
              v-for="item in tab_items"
              :key="item"
            >
              {{ item }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab_main" class="pb-1">
            <!-- ▼ 자재 기본 정보 -->
            <v-tab-item>
              <v-row>
                <v-col cols="12" sm="4">
                  <CardComponent
                    elevation="1"
                    text-class=" pt-3"
                    title-class="mb-0 font-weight-black"
                    divider-class="mb-3"
                  >
                    <div slot="cardTitle">
                      <span>자재 분류</span>
                      <v-btn color="success" class="ml-2 elevation-0" x-small @click="registProductInfo('classification')">
                        추가
                      </v-btn>
                    </div>
                    <div slot="cardText">
                      <v-row>
                        <v-col cols="12">
                          <p class="float-left text-h6 font-weight-black mb-0">
                            <v-text-field
                              v-model="search_classification"
                              append-icon="mdi-magnify"
                              label="Search"
                              dense
                              single-line
                              hide-details
                            ></v-text-field>
                          </p>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <DataTableComponent
                            :headers="classification_headers"
                            :items="classification_data"
                            :search="search_classification"
                            editable
                            deletable
                            dense
                            @edit="editProductInfo"
                            @delete="deleteProductInfo"
                            
                          >
                          </DataTableComponent>
                        </v-col>
                      </v-row>
                    </div>
                  </CardComponent>
                </v-col>
                <v-col cols="12" sm="4">
                  <CardComponent
                    elevation="1"
                    text-class=" pt-3"
                    title-class="mb-0 font-weight-black"
                    divider-class="mb-3"
                  >
                    <div slot="cardTitle">
                      <span>제조사 목록</span>
                      <v-btn color="success" class="ml-2 elevation-0" x-small @click="registProductInfo('manufacturer')">
                        추가
                      </v-btn>
                    </div>
                    <div slot="cardText">
                      <v-row>
                        <v-col cols="12">
                          <p class="float-left text-h6 font-weight-black mb-0">
                            <v-text-field
                              v-model="search_manufacturer"
                              append-icon="mdi-magnify"
                              label="Search"
                              dense
                              single-line
                              hide-details
                            ></v-text-field>
                          </p>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <DataTableComponent
                            :headers="manufacturer_headers"
                            :items="manufacturer_data"
                            :search="search_manufacturer"
                            editable
                            deletable
                            dense
                            @edit="editProductInfo"
                            @delete="deleteProductInfo"
                            
                          >
                          </DataTableComponent>
                        </v-col>
                      </v-row>
                    </div>
                  </CardComponent>
                </v-col>
                <v-col cols="12" sm="4">
                  <CardComponent
                    elevation="1"
                    text-class=" pt-3"
                    title-class="mb-0 font-weight-black"
                    divider-class="mb-3"
                  >
                    <div slot="cardTitle">
                      <span>자재 위치 목록</span>
                      <v-btn color="success" class="ml-2 elevation-0" x-small @click="registProductInfo('spot')">
                        추가
                      </v-btn>
                    </div>
                    <div slot="cardText">
                      <v-row>
                        <v-col cols="12">
                          <p class="float-left text-h6 font-weight-black mb-0">
                            <v-text-field
                              v-model="search_spot"
                              append-icon="mdi-magnify"
                              label="Search"
                              dense
                              single-line
                              hide-details
                            ></v-text-field>
                          </p>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <DataTableComponent
                            :headers="spot_headers"
                            :items="spot_data"
                            :search="search_spot"
                            editable
                            deletable
                            dense
                            @edit="editProductInfo"
                            @delete="deleteProductInfo"
                            
                          >
                          </DataTableComponent>
                        </v-col>
                      </v-row>
                    </div>
                  </CardComponent>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
      <ModalDialogComponent
        :dialog-value="productInfoDialog"
        max-width="300px"
        :title="formProductInfoTitle"
        text-class="pb-0"
        closeText="취소"
        saveText="저장"
        :persistent="true"
        @close="close"
        @save="uploadProductInfo"
      >
        <v-container>
            <!-- slot="cardText" -->
          <v-form ref="laborForm">
            <InputsFormComponent
              clearable
              :inputs="registProductInfoInputs"
            ></InputsFormComponent>
          </v-form>
        </v-container>
      </ModalDialogComponent>
      <ModalDialogComponent
        :dialog-value="DialogDelete"
        max-width="400px"
        title-class="text-body-1 font-weight-black"
        text-class="text-body-2"
        save-text="삭제"
        close-text="취소"
        @save="deleteProductInfoConfirm"
        @close="closeDelete"
      >
        <template v-slot:titleHTML>
          <p class="mb-1" style="width: 100%;">{{ deleteInfo }}</p>
          <p class="red--text">해당 정보를 삭제하시겠습니까?</p>
        </template>
        삭제 시 복구 불가능합니다.
      </ModalDialogComponent>
    </v-main>
  </div>
</template>

<script>
import NavComponent from "@/components/NavComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent";
import DataTableComponent from "@/components/DataTableComponent";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import LoadingModalComponent from "@/components/LoadingModalComponent";
import CardComponent from "@/components/CardComponent.vue";
import BasicInfoBackDataPageConfig from "@/configure/BasicInfoBackDataPageConfig.json";
import mux from "@/mux";

import CheckPagePermission from "@/common_js/CheckPagePermission";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=BaseicInfoBackdataPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  components: {
    NavComponent,
    ModalDialogComponent,
    DataTableComponent,
    InputsFormComponent,
    CardComponent,
    LoadingModalComponent,
  },
  data() {
    return {
      tab_main: null,
      tab_items:BasicInfoBackDataPageConfig.tab_items,

      search_classification: '',
      search_manufacturer: '',
      search_spot: '',

      loading_dialog: false,
      productInfoDialog: false,
      DialogDelete: false,

      editedBasicInfo: {},
      defaultBasicInfo: {},
      deleteBasicInfo:{},
      deleteInfo:'',

      spot_data: [],
      manufacturer_data: [],
      classification_data: [],

      editedBasicInfoIndex: -1,
      registProductInfoInputs:[],
      ProductInfoInputsList:BasicInfoBackDataPageConfig.ProductInfoInputsList,
      classification_headers: BasicInfoBackDataPageConfig.classification_headers,
      manufacturer_headers:BasicInfoBackDataPageConfig.manufacturer_headers,
      spot_headers: BasicInfoBackDataPageConfig.spot_headers,
    }
  },

  computed: {
    formProductInfoTitle () {
      return this.editedBasicInfoIndex === -1 ? '정보 등록' : '정보 수정'
    },
  },

  watch: {
    productInfoDialog (val) {
      val || this.close()
    },
    DialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    // eslint-disable-next-line no-unused-vars
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      // console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    async initialize () {
      // this.classification_data = BasicInfoBackDataPageConfig.test_classification_data
      // this.manufacturer_data = BasicInfoBackDataPageConfig.test_manufacturer_data
      // this.spot_data = BasicInfoBackDataPageConfig.test_spot_data
      this.loading_dialog = true;
      const prevURL = window.location.href;
      try {
        let result = await mux.Server.getPionBasicInfo();
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }

        this.classification_data = result.classification.map(data => {
          return {classification: data}
        });
        this.manufacturer_data = result.manufacturer.map(data => {
          return {manufacturer: data}
        });
        this.spot_data = result.spot.map(data => {
          return {spot: data}
        });

      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        mux.Util.showAlert(error);
      }
      this.loading_dialog = false;
    },
    registProductInfo(type){
      this.registProductInfoInputs = [];
      let product_input = this.ProductInfoInputsList;
      mux.Rules.rulesSet(product_input);
      this.editedBasicInfoIndex = -1
      product_input.forEach(data =>{
          data.value = '';
        if(data.column_name === type){
          this.registProductInfoInputs.push(data);
        }
      })
      this.productInfoDialog = true
    },
    editProductInfo (item) {
      this.registProductInfoInputs = [];
      let product_input = this.ProductInfoInputsList;
      mux.Rules.rulesSet(product_input);
      product_input.forEach(data =>{
        if(data.column_name == Object.keys(item)){
          if(data.column_name == 'classification'){
            this.editedBasicInfoIndex = this.classification_data.indexOf(item)
            data.value = Object.values(this.classification_data[this.editedBasicInfoIndex]);
            this.registProductInfoInputs.push(data);
          }else if(data.column_name == 'manufacturer'){
            this.editedBasicInfoIndex = this.manufacturer_data.indexOf(item)
            data.value = Object.values(this.manufacturer_data[this.editedBasicInfoIndex]);
            this.registProductInfoInputs.push(data);
          }else if(data.column_name == 'spot'){
            this.editedBasicInfoIndex = this.spot_data.indexOf(item)
            data.value = Object.values(this.spot_data[this.editedBasicInfoIndex]);
            this.registProductInfoInputs.push(data);
          }
        }
      })
      this.productInfoDialog = true
    },

    uploadProductInfo () {
      let product_info = this.registProductInfoInputs;
      let item = this.editedBasicInfo;

      const validate = this.$refs.laborForm.validate();
      if(validate){
        product_info.forEach(async data =>{
          if(data.column_name == 'classification'){
            item.classification_update = data.value;
            if (this.classification_data.some(x => x.classification === item.classification_update)) {
              mux.Util.showAlert('이미 등록된 분류입니다.');
              return;
            }
            if(this.editedBasicInfoIndex === -1){ // editedIndex가 -1이면 등록
              const prevURL = window.location.href;
              try {
                let result = await mux.Server.post({
                  path: '/api/common_rest_api/',
                  params: {
                    "classification_table-insert": [{
                      "user_info": {
                        "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                        "role": "creater"
                      },
                      "data":{
                        "classification": item.classification_update
                      },
                      "select_where": {"classification": item.classification_update},
                      "rollback": "yes"
                    }]
                  }
                });
                if (prevURL !== window.location.href) return;

                if (typeof result === 'string'){
                  result = JSON.parse(result);
                }
                if(result['code'] == 0){
                  // console.log('result :>> ', result);
                  mux.Util.showAlert('분류 등록이 완료되었습니다.', '등록 완료', 1000);
                  this.classification_data.push({classification: item.classification_update})
                  data.value = '';
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
            }else{// 아니라면 수정
              item.classification = this.classification_data[this.editedBasicInfoIndex].classification;
              const prevURL = window.location.href;
              try {
                let result = await mux.Server.post({
                  path: '/api/common_rest_api/',
                  params: {
                    "classification_table-update": [{
                      "user_info": {
                        "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                        "role": "modifier"
                      },
                      "data":{
                        "classification": item.classification_update
                      },
                      "update_where": {"classification": item.classification},
                      "rollback": "yes"
                    }]
                  }
                });
                if (prevURL !== window.location.href) return;

                if (typeof result === 'string'){
                  result = JSON.parse(result);
                }
                if(result['code'] == 0){
                  // console.log('result :>> ', result);
                  mux.Util.showAlert('분류 수정이 완료되었습니다.', '수정 완료', 1000);
                  this.classification_data[this.editedBasicInfoIndex].classification = item.classification_update+'';
                  this.productInfoDialog = false;
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
          }else if(data.column_name == 'manufacturer'){
            item.manufacturer_update = data.value;
            if (this.manufacturer_data.some(x => x.manufacturer === item.manufacturer_update)) {
              mux.Util.showAlert('이미 등록된 제조사입니다.');
              return;
            }
            if(this.editedBasicInfoIndex === -1){ // editedIndex가 -1이면 등록
              const prevURL = window.location.href;
              try {
                let result = await mux.Server.post({
                  path: '/api/common_rest_api/',
                  params: {
                    "manufacturer_table-insert": [{
                      "user_info": {
                        "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                        "role": "creater"
                      },
                      "data":{
                        "manufacturer": item.manufacturer_update
                      },
                      "select_where": {"manufacturer": item.manufacturer_update},
                      "rollback": "yes"
                    }]
                  }
                });
                if (prevURL !== window.location.href) return;

                if (typeof result === 'string'){
                  result = JSON.parse(result);
                }
                if(result['code'] == 0){
                  // console.log('result :>> ', result);
                  mux.Util.showAlert('제조사 등록이 완료되었습니다.', '등록 완료', 1000);
                  this.manufacturer_data.push({manufacturer: item.manufacturer_update})
                  data.value = '';
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
            }else{// 아니라면 수정
              item.manufacturer = this.manufacturer_data[this.editedBasicInfoIndex].manufacturer;
              const prevURL = window.location.href;
              try {
                let result = await mux.Server.post({
                  path: '/api/common_rest_api/',
                  params: {
                    "manufacturer_table-update": [{
                      "user_info": {
                        "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                        "role": "modifier"
                      },
                      "data":{
                        "manufacturer": item.manufacturer_update
                      },
                      "update_where": {"manufacturer": item.manufacturer},
                      "rollback": "yes"
                    }]
                  }
                });
                if (prevURL !== window.location.href) return;

                if (typeof result === 'string'){
                  result = JSON.parse(result);
                }
                if(result['code'] == 0){
                  // console.log('result :>> ', result);
                  mux.Util.showAlert('제조사 수정이 완료되었습니다.', '수정 완료', 1000);
                  this.manufacturer_data[this.editedBasicInfoIndex].manufacturer = item.manufacturer_update+'';
                  this.productInfoDialog = false;
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
          }else if(data.column_name == 'spot'){
            item.spot_update = data.value;
            if (item.spot_update === 'EMPTY') {
              mux.Util.showAlert('불가능한 단어입니다.');
              return;
            }
            if (this.spot_data.some(x => x.spot === item.spot_update)) {
              mux.Util.showAlert('이미 등록된 위치입니다.');
              return;
            }
            if(this.editedBasicInfoIndex === -1){ // editedIndex가 -1이면 등록
              const prevURL = window.location.href;
              try {
                let result = await mux.Server.post({
                  path: '/api/common_rest_api/',
                  params: {
                    "spot_table-insert": [{
                      "user_info": {
                        "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                        "role": "creater"
                      },
                      "data":{
                        "spot": item.spot_update
                      },
                      "select_where": {"spot": item.spot_update},
                      "rollback": "yes"
                    }]
                  }
                });
                if (prevURL !== window.location.href) return;

                if (typeof result === 'string'){
                  result = JSON.parse(result);
                }
                if(result['code'] == 0){
                  // console.log('result :>> ', result);
                  mux.Util.showAlert('위치 등록이 완료되었습니다.', '등록 완료', 1000);
                  this.spot_data.push({spot: item.spot_update})
                  data.value = '';
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
            }else{// 아니라면 수정
              item.spot = this.spot_data[this.editedBasicInfoIndex].spot;
              const prevURL = window.location.href;
              try {
                let result = await mux.Server.post({
                  path: '/api/common_rest_api/',
                  params: {
                    "spot_table-update": [{
                      "user_info": {
                        "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                        "role": "modifier"
                      },
                      "data":{
                        "spot": item.spot_update
                      },
                      "update_where": {"spot": item.spot},
                      "rollback": "yes"
                    }]
                  }
                });
                if (prevURL !== window.location.href) return;

                if (typeof result === 'string'){
                  result = JSON.parse(result);
                }
                if(result['code'] == 0){
                  // console.log('result :>> ', result);
                  mux.Util.showAlert('위치 수정이 완료되었습니다.', '수정 완료', 1000);
                  this.spot_data[this.editedBasicInfoIndex].spot = item.spot_update+'';
                  this.productInfoDialog = false;
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
        })

      }
    },
    deleteProductInfo (item) {
      this.deleteInfo = '';
      if(Object.keys(item) == 'classification'){
        this.editedBasicInfoIndex = this.classification_data.indexOf(item)
        this.editedBasicInfo = Object.assign({}, item)
      }else if(Object.keys(item) == 'manufacturer'){
        this.editedBasicInfoIndex = this.manufacturer_data.indexOf(item)
        this.editedBasicInfo = Object.assign({}, item)
      }else if(Object.keys(item) == 'spot'){
        this.editedBasicInfoIndex = this.spot_data.indexOf(item)
        this.editedBasicInfo = Object.assign({}, item)
      }
      this.deleteInfo = String(Object.values(item));
      this.DialogDelete = true
    },

    async deleteProductInfoConfirm () {
      this.deleteBasicInfo = {};
      this.deleteBasicInfo.modifier = 'user_id';

      if(Object.keys(this.editedBasicInfo) == 'classification'){
        this.deleteBasicInfo.classification = this.editedBasicInfo.classification;
        // console.log('자재 분류 삭제 : ' + JSON.stringify(this.deleteBasicInfo));
        const prevURL = window.location.href;
        try {
          let result = await mux.Server.post({
            path: '/api/common_rest_api/',
            params: {
              "classification_table-delete": [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data":{},
                "delete_where": {"classification": this.deleteBasicInfo.classification},
                "rollback": "yes"
              }]
            }
          });
          if (prevURL !== window.location.href) return;

          if (typeof result === 'string'){
            result = JSON.parse(result);
          }
          if(result['code'] == 0){
            // console.log('result :>> ', result);
            mux.Util.showAlert('분류 삭제가 완료되었습니다.', '삭제 완료', 1000);
            this.classification_data.splice(this.editedBasicInfoIndex, 1)
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
      }else if(Object.keys(this.editedBasicInfo) == 'manufacturer'){
        this.deleteBasicInfo.manufacturer = this.editedBasicInfo.manufacturer;
        // console.log('제조사 삭제 : ' + JSON.stringify(this.deleteBasicInfo));
        const prevURL = window.location.href;
        try {
          let result = await mux.Server.post({
            path: '/api/common_rest_api/',
            params: {
              "manufacturer_table-delete": [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data":{},
                "delete_where": {"manufacturer": this.deleteBasicInfo.manufacturer},
                "rollback": "yes"
              }]
            }
          });
          if (prevURL !== window.location.href) return;

          if (typeof result === 'string'){
            result = JSON.parse(result);
          }
          if(result['code'] == 0){
            // console.log('result :>> ', result);
            mux.Util.showAlert('제조사 삭제가 완료되었습니다.', '삭제 완료', 1000);
            this.manufacturer_data.splice(this.editedBasicInfoIndex, 1)
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
      }else if(Object.keys(this.editedBasicInfo) == 'spot'){
        this.deleteBasicInfo.spot = this.editedBasicInfo.spot;
        // console.log('위치 삭제 : ' + JSON.stringify(this.deleteBasicInfo));
        const prevURL = window.location.href;
        try {
          let result = await mux.Server.post({
            path: '/api/common_rest_api/',
            params: {
              "spot_table-delete": [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data":{},
                "delete_where": {"spot": this.deleteBasicInfo.spot},
                "rollback": "yes"
              }]
            }
          });
          if (prevURL !== window.location.href) return;

          if (typeof result === 'string'){
            result = JSON.parse(result);
          }
          if(result['code'] == 0){
            // console.log('result :>> ', result);
            mux.Util.showAlert('위치 삭제가 완료되었습니다.', '삭제 완료', 1000);
            this.spot_data.splice(this.editedBasicInfoIndex, 1)
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

      // 삭제 요청 = this.deleteBasicInfo

      this.closeDelete()
    },

    close () {
      this.loading_dialog = false
      this.productInfoDialog = false
      this.$nextTick(() => {
        this.editedBasicInfo = Object.assign({}, this.defaultBasicInfo)
        this.editedBasicInfoIndex = -1
      })
    },

    closeDelete () {
      this.DialogDelete = false
      this.$nextTick(() => {
        this.editedBasicInfo = Object.assign({}, this.defaultBasicInfo)
        this.editedBasicInfoIndex = -1
      })
    },
  },
}
</script>

<style lang="">

</style>
