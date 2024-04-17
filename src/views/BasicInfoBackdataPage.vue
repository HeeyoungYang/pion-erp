<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :backDataMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
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
                            hide-default-footer
                            disable-pagination
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
                            hide-default-footer
                            disable-pagination
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
                            hide-default-footer
                            disable-pagination
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
import CardComponent from "@/components/CardComponent.vue";
import BasicInfoBackDataPageConfig from "@/configure/BasicInfoBackDataPageConfig.json";


export default {
  components: {
    NavComponent,
    ModalDialogComponent,
    DataTableComponent,
    InputsFormComponent,
    CardComponent,
  },
  data() {
    return {
      tab_main: null,
      tab_items:BasicInfoBackDataPageConfig.tab_items,

      search_classification: '',
      search_manufacturer: '',
      search_spot: '',

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
    initialize () {
      this.classification_data = BasicInfoBackDataPageConfig.test_classification_data
      this.manufacturer_data = BasicInfoBackDataPageConfig.test_manufacturer_data
      this.spot_data = BasicInfoBackDataPageConfig.test_spot_data
    },
    rulesSet(inputs){
      inputs.forEach(input =>{
        if(input.text_type == 'number'){
          input.rules =  [v => !!v || input.label + " 입력(숫자)"]
        }else{
          input.rules =  [v => !!v || input.label + " 입력"]
        }
      })
    },
    registProductInfo(type){
      this.registProductInfoInputs = [];
      let product_input = this.ProductInfoInputsList;
      this.rulesSet(product_input);
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
      this.rulesSet(product_input);
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
        product_info.forEach(data =>{
          if(data.column_name == 'classification'){
            item.classification = data.value;
            if(this.editedBasicInfoIndex === -1){ // editedIndex가 -1이면 등록
            item.creater = 'user_id';
              alert('분류 등록이 완료되었습니다.');
            }else{// 아니라면 수정
            item.modifier = 'user_id';
              alert('분류 수정이 완료되었습니다.');
            }
          }else if(data.column_name == 'manufacturer'){
            item.manufacturer = data.value;
            if(this.editedBasicInfoIndex === -1){ // editedIndex가 -1이면 등록
            item.creater = 'user_id';
              alert('제조사 등록이 완료되었습니다.');
            }else{// 아니라면 수정
            item.modifier = 'user_id';
              alert('제조사 수정이 완료되었습니다.');
            }
          }else if(data.column_name == 'spot'){
            item.spot = data.value;
            if(this.editedBasicInfoIndex === -1){ // editedIndex가 -1이면 등록
            item.creater = 'user_id';
              alert('위치 등록이 완료되었습니다.');
            }else{// 아니라면 수정
            item.modifier = 'user_id';
              alert('위치 수정이 완료되었습니다.');
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

    deleteProductInfoConfirm () {
      this.deleteBasicInfo = {};
      this.deleteBasicInfo.modifier = 'user_id';

      if(Object.keys(this.editedBasicInfo) == 'classification'){
        this.deleteBasicInfo.classification = this.editedBasicInfo.classification;
        console.log('자재 분류 삭제 : ' + JSON.stringify(this.deleteBasicInfo));
        this.classification_data.splice(this.editedBasicInfoIndex, 1)
      }else if(Object.keys(this.editedBasicInfo) == 'manufacturer'){
        this.deleteBasicInfo.manufacturer = this.editedBasicInfo.manufacturer;
        console.log('제조사 삭제 : ' + JSON.stringify(this.deleteBasicInfo));
        this.manufacturer_data.splice(this.editedBasicInfoIndex, 1)
      }else if(Object.keys(this.editedBasicInfo) == 'spot'){
        this.deleteBasicInfo.spot = this.editedBasicInfo.spot;
        console.log('제조사 삭제 : ' + JSON.stringify(this.deleteBasicInfo));
        this.spot_data.splice(this.editedBasicInfoIndex, 1)
      }

      // 삭제 요청 = this.deleteBasicInfo

      this.closeDelete()
    },

    close () {
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
