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
                    :item-key="product_data.material_code"
                    show-photo
                    dense
                    stockNumInfo
                    show-item-details
                    @itemDetials="detailInfoItem"
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
import DataTableComponent from "@/components/DataTableComponent";
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import ModalDialogComponent from "@/components/ModalDialogComponent";
import MaterialSearchPageConfig from "@/configure/MaterialSearchPageConfig.json";
import mux from "@/mux";
import CheckPagePermission from "@/common_js/CheckPagePermission";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=MaterialSearchPage')],
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
      manufacturer_list:[],
      classification_list:[],
      stockDetails:[],
      inboundDetails:[],

      stock_detail_header:MaterialSearchPageConfig.stock_detail_header,
      inbound_detail_header:MaterialSearchPageConfig.stock_detail_header,
      searchCardInputs:MaterialSearchPageConfig.searchCardInputs,
      headers:MaterialSearchPageConfig.headers,
      product_data:[],
    }
  },

  computed: {
  },

  watch: {
    detail_dialog (val) {
      val || this.closeDetail()
    },
  },

  created () {
    //this.initialize()
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
      // this.manufacturer_list = MaterialSearchPageConfig.test_manufacturer_list;
      // this.classification_list = MaterialSearchPageConfig.test_classification_list;
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
      let searchMaterialCode = this.searchCardInputs.find(x=>x.label === '관리코드').value;
      let searchName = this.searchCardInputs.find(x=>x.label === '제품명').value;
      let searchModel = this.searchCardInputs.find(x=>x.label === '모델명').value;
      let searchSpec = this.searchCardInputs.find(x=>x.label === '사양').value;
      let searchManufacturer = this.searchCardInputs.find(x=>x.label === '제조사').value;
      let searchStockMoreZero = this.stock_more_0 ? 0 : '';

      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/sample_rest_api/',
          params: [
            {
              "material_table.classification": searchClassification,
              "material_table.manufacturer": searchManufacturer,
              "material_table.model": searchModel,
              "material_table.name": searchName,
              "material_table.material_code": searchMaterialCode,
              "material_table.spec": searchSpec,
              "material_table.type": "원부자재",

              "stock_table.conditions": searchConditions,
              "stock_table.stock_num": searchStockMoreZero
            }
          ],
          "script_file_name": "rooting_재고_검색_24_05_01_11_35_BHW.json",
          "script_file_path": "data_storage_pion\\json_sql\\stock\\1_재고검색\\재고_검색_24_05_01_11_35_HPY"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        result = result.map(a => {
          a.stock_price = Math.round(a.unit_price * a.stock_num)
          return a;
        });
        let product_data_arr = [];
        result.forEach(data => {
          let isExist = false;
          for (let i = 0; i < product_data_arr.length; i++) {
            if (product_data_arr[i]._code === data._code) {
              product_data_arr[i].spot_stock.push({product_code: data._code, spot: data.spot, stock_num: data.stock_num, stock_price: Math.round(data.unit_price * data.stock_num)});
              isExist = true;
              break;
            }
          }
          if (!isExist) {
            data.spot_stock = [{product_code: data._code, spot: data.spot, stock_num: data.stock_num, stock_price: Math.round(data.unit_price * data.stock_num)}];
            product_data_arr.push(data);
          }
        });
        this.product_data = product_data_arr;
        // this.product_data = StockSearchPageConfig.test_product_data;

        this.product_data.forEach(data =>{
          let stock_calc = 0;
          for(let d=0; d<data.spot_stock.length; d++){
            stock_calc += data.spot_stock[d].stock_num;
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

      // this.product_data = MaterialSearchPageConfig.test_product_data;


    }

  },
}
</script>
<style lang="">

</style>
