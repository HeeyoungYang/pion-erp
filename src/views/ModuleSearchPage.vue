<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
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
                lg="3"
              >
                <v-row>
                  <v-col
                    cols="6"
                    sm="6"
                    lg="6"
                  >
                    <v-checkbox
                      v-model="stock_more_0"
                      label="재고 > 0"
                    ></v-checkbox>
                  </v-col>
                  <v-col
                    cols="6"
                    sm="6"
                    lg="6"
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
                </v-row>
              </v-col>
            </InputsFormComponent>
          </CardComponent>

          <v-card
          elevation="1"
          class="mt-5"
          >
            <v-card-text class=" pt-3">
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-chip
                    class="ma-2"
                    color="indigo"
                    text-color="white"
                    small
                  >
                    총 재고 : {{ total_stock_num }}
                  </v-chip>
                  <v-chip
                    class="ma-2"
                    color="indigo"
                    text-color="white"
                    small
                  >
                    총 금액 : {{ total_stock_price }}
                  </v-chip>
                  <DataTableComponent
                    :headers="headers"
                    :items="product_data"
                    :item-key="product_data.item_code"
                    hide-default-footer
                    disable-pagination
                    children-key="belong_data"
                    table-style=""
                    show-photo
                    stockNumInfo
                    itemNumInfoBelong
                    show-item-details
                    @itemDetials="detailInfoItem"
                    dense
                  />
                </v-col>
              </v-row>

              <v-row>

              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <ModalDialogComponent
      :dialog-value="detail_dialog"
      max-width="50%"
      title-class="display-none"
      :dialog-transition="'slide-x-transition'"
      :dialog-custom="'custom-dialog elevation-0 white'"
      :card-elevation="'0'"
      @close="closeDetail"
      >
        <v-row>
          <v-col cols="12" sm="6">
            <p class="text-h6 font-weight-bold primary--text">재고 정보</p>
            <DataTableComponent
              :headers="stock_detail_header"
              :items="stockDetails"
              hide-default-footer
              disable-pagination
              dense
            />
          </v-col>
          <v-col cols="12" sm="6">
            <p class="text-h6 font-weight-bold primary--text">입고 정보</p>
            <DataTableComponent
              :headers="inbound_detail_header"
              :items="inboundDetails"
              hide-default-footer
              disable-pagination
              dense
            />
          </v-col>
        </v-row>
      </ModalDialogComponent>
    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import DataTableComponent from "@/components/DataTableComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import ModalDialogComponent from "@/components/ModalDialogComponent";
import ModuleSearchPageConfig from "@/configure/ModuleSearchPageConfig.json";
import mux from "@/mux";
import CheckPagePermission from "@/common_js/CheckPagePermission";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=ModuleSearchPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  components: {
                NavComponent,
                DataTableComponent,
                CardComponent,
                InputsFormComponent,
                ModalDialogComponent,
              },
  data(){
    return{
      stock_more_0: true,
      total_stock_num:0,
      total_stock_price:0,
      detail_dialog: false,
      stockDetails:[],
      inboundDetails:[],
      manufacturer_list:[],
      classification_list:[],

      stock_detail_header:ModuleSearchPageConfig.stock_detail_header,
      inbound_detail_header:ModuleSearchPageConfig.inbound_detail_header,
      searchCardInputs:ModuleSearchPageConfig.searchCardInputs,
      headers:ModuleSearchPageConfig.headers,
      product_data: []
    }
  },


  watch: {
    detail_dialog (val) {
      val || this.closeDetail()
    },
  },

  created () {
    this.initialize()
  },
  methods: {
    addProductBasicInfoLists(inputType){
      inputType.forEach( inputs => {
          if(inputs.label == '분류'){
            inputs.list = this.classification_list;
            inputs.list.unshift('All');
          }else if(inputs.label == '제조사'){
            inputs.list = this.manufacturer_list;
          }
        })
    },
    async initialize () {
      // this.manufacturer_list = ModuleSearchPageConfig.test_manufacturer_list;
      // this.classification_list = ModuleSearchPageConfig.test_classification_list;
      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/sample_rest_api/',
          "params": [

          ],
          "script_file_name": "완제품_검색_24_05_01_12_45_GC6.json",
          "script_file_path": "data_storage_pion\\json_sql\\stock\\10_완제품_검색\\완제품_검색_24_05_01_12_45_GC6"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        this.classification_list = result;

        result = await mux.Server.post({
          path: '/api/sample_rest_api/',
          "params": [

          ],
          "script_file_name": "제조사목록전체검색.json",
          "script_file_path": "data_storage_pion\\json_sql\\stock\\10_완제품_검색\\제조사목록전체검색"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        this.manufacturer_list = result;

        // result = await mux.Server.post({
        //   path: '/api/sample_rest_api/',
        //   "params": [

        //   ],
        //   "script_file_name": "자재위치목록전체검색.json",
        //   "script_file_path": "data_storage_pion\\json_sql\\stock\\10_완제품_검색\\자재위치목록전체검색"
        // });
        // if (prevURL !== window.location.href) return;

        // if (typeof result === 'string'){
        //   result = JSON.parse(result);
        // }
        // this.spot_list = result;

      } catch (error) {
        if (prevURL !== window.location.href) return;
        alert(error);
      }
      mux.List.addProductBasicInfoLists(this.searchCardInputs, this.classification_list, this.manufacturer_list);

    },
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },

    detailInfoItem(item){
      this.detail_dialog = true;
      this.stockDetails = item.spot_stock
    },
    closeDetail () {
      this.detail_dialog = false
    },


    async searchButton() {
      //검색 시 총 재고, 총 금액 초기화
      this.total_stock_num = 0;
      this.total_stock_price = 0;

      let searchClassification = this.searchCardInputs.find(x=>x.label === '분류').value;
      if (searchClassification === 'All')
        searchClassification = '%';
      let searchConditions = this.searchCardInputs.find(x=>x.label === '상태').value;
      if (searchConditions === 'All')
        searchConditions = '%';
      let searchModuleCode = this.searchCardInputs.find(x=>x.label === '관리코드').value;
      let searchName = this.searchCardInputs.find(x=>x.label === '제품명').value;
      let searchModel = this.searchCardInputs.find(x=>x.label === '모델명').value;
      let searchSpec = this.searchCardInputs.find(x=>x.label === '사양').value;
      let searchManufacturer = this.searchCardInputs.find(x=>x.label === '제조사').value;
      let searchStockMoreZero = this.stock_more_0 ? 0 : '';

      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/sample_rest_api/',
          "params": [
                {
                    "module_table.classification": searchClassification,
                    "module_table.manufacturer": searchManufacturer,
                    "module_table.model": searchModel,
                    "module_table.module_code": searchModuleCode,
                    "module_table.name": searchName,
                    "module_table.spec": searchSpec,
                    // "material_table.classification": "",
                    // "material_table.manufacturer": "",
                    // "material_table.material_code": "",
                    // "material_table.model": "",
                    // "material_table.name": "",
                    // "material_table.spec": "",
                    "stock_table.conditions": "",
                    "stock_table.stock_num": searchStockMoreZero
                }
            ],
            "script_file_name": "rooting_반제품_검색_24_05_01_12_50_9BS.json",
            "script_file_path": "data_storage_pion\\json_sql\\stock\\6_반제품_검색\\반제품_검색_24_05_01_12_50_CZR"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        this.product_data = result;

        this.product_data.forEach(data =>{
          data.item_code = data.code;
          delete data.code;

          if(data.belong_data){
            for(let b=0; b<data.belong_data.length; b++){
              data.belong_data[b].item_code = data.belong_data[b].code;
              delete data.belong_data[b].code;
            }
          }
          let stock_calc = 0;
          if (data.spot_stock){
            for(let d=0; d<data.spot_stock.length; d++){
              stock_calc += data.spot_stock[d].stock_num;
            }
          }
          data.total_stock = stock_calc
          data.item_price = data.unit_price * data.total_stock
          this.total_stock_num += data.total_stock
          this.total_stock_price += data.item_price
        })
      } catch (error) {
        if (prevURL !== window.location.href) return;
        alert(error);
      }

      // this.product_data = ModuleSearchPageConfig.test_product_data;


    }
  }
}
</script>
<style lang="">

</style>
