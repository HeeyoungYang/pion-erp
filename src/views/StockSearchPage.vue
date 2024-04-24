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
                    :item-key="product_data._code"
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
      :hide-overlay="true"
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
import StockSearchPageConfig from "@/configure/StockSearchPageConfig.json";
import mux from "@/mux";
import CheckPagePermission from "@/common_js/CheckPagePermission";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=StockSearchPage')],
  mounted(){
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
    // this.closeAll()
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
      total_stock_num:0,
      total_stock_price:0,
      manufacturer_list:[],
      classification_list:[],
      stock_more_0: true,
      detail_dialog: false,
      stockDetails:[],
      inboundDetails:[],
      stock_detail_header:StockSearchPageConfig.stock_detail_header,
      inbound_detail_header:StockSearchPageConfig.inbound_detail_header,
      searchCardInputs:StockSearchPageConfig.searchCardInputs,
      headers:StockSearchPageConfig.headers,
      product_data:[],
      // product_data:StockSearchPageConfig.test_product_data,
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
    this.initialize()
  },
  methods: {
    // addLists(inputType){
    //   inputType.forEach( inputs => {
    //       if(inputs.label == '분류'){
    //         inputs.list = this.classification_list;
    //         inputs.list.unshift('All');
    //       }else if(inputs.label == '제조사'){
    //         inputs.list = this.manufacturer_list;
    //       }
    //     })
    // },
    async initialize () {
      this.manufacturer_list = StockSearchPageConfig.test_manufacturer_list;
      this.classification_list = StockSearchPageConfig.test_classification_list;
      mux.List.addLists(this.searchCardInputs, this.classification_list, this.manufacturer_list);
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
      this.total_stock_num = 0;
      this.total_stock_price = 0;
      // alert(this.searchCardInputs.find(x=>x.label === '일자').value.sort());

      let searchType = this.searchCardInputs.find(x=>x.label === '종류').value;
      if (searchType === 'All')
        searchType = '';
      let searchClassification = this.searchCardInputs.find(x=>x.label === '분류').value;
      if (searchClassification === 'All')
      searchClassification = '';
      let searchCondition = this.searchCardInputs.find(x=>x.label === '상태').value;
      if (searchCondition === 'All')
      searchCondition = '';
      let searchProductCode = this.searchCardInputs.find(x=>x.label === '관리코드').value;
      let searchProductName = this.searchCardInputs.find(x=>x.label === '제품명').value;
      let searchModelName = this.searchCardInputs.find(x=>x.label === '모델명').value;
      let searchProductSpec = this.searchCardInputs.find(x=>x.label === '사양').value;
      let searchManufacturer = this.searchCardInputs.find(x=>x.label === '제조사').value;
      let searchStockMoreZero = this.stock_more_0 ? 0 : '';

      try {
        let result = await mux.Server.post({
          path: '/api/sample_rest_api/',
          params: [
            {
              "classification": searchClassification,
              "manufacturer": searchManufacturer,
              "model": searchModelName,
              "name": searchProductName,
              "_code": searchProductCode,
              "spec": searchProductSpec,
              "type": searchType,
              "condition": searchCondition,
              "stock_num": searchStockMoreZero
            }
          ],
          script_file_name: "rooting_재고_검색_24_04_21_17_44_FKE.json",
          script_file_path: "data_storage_pion\\json_sql\\stock\\stock_search\\재고_검색_24_04_21_17_45_RGC"
        });

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        result = result.map(a => {
          a.stock_price = Math.round(a.unit_price * a.stock_num)
          return a;
        });
        this.product_data = result;
        // this.product_data = StockSearchPageConfig.test_product_data;

      } catch (error) {
        alert(error);
      }


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

    }
  }
}
</script>
<style lang="">

</style>
