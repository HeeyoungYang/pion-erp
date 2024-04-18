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
import MaterialSearchPageConfig from "@/configure/MaterialSearchPageConfig.json";
// import mux from "@/mux";

export default {
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
  methods: {

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
      
      // let searchClassification = this.searchCardInputs.find(x=>x.label === '분류').value;
      // if (searchClassification === 'All')
      // searchClassification = '';
      // let searchCondition = this.searchCardInputs.find(x=>x.label === '상태').value;
      // if (searchCondition === 'All')
      //   searchCondition = '';
      // let searchMaterialCode = this.searchCardInputs.find(x=>x.label === '관리코드').value;
      // let searchName = this.searchCardInputs.find(x=>x.label === '제품명').value;
      // let searchModel = this.searchCardInputs.find(x=>x.label === '모델명').value;
      // let searchSpec = this.searchCardInputs.find(x=>x.label === '사양').value;
      // let searchManufacturer = this.searchCardInputs.find(x=>x.label === '제조사').value;

      // try {
      //   let result = await mux.Server.post({
      //     path: '/api/sample_rest_api/',
      //     "query_info":{
      //       "script_file_name":"rooting_material_table_stock_table_root_json_2024_03_18_17_49_52.json",
      //       "params": [
      //         {
      //             "key": "manufacturer",
      //             "type":"string",
      //             "value": searchManufacturer
      //         },
      //         {
      //             "key": "spec",
      //             "type":"string",
      //             "value": searchSpec
      //         },
      //         {
      //             "key": "model",
      //             "type":"string",
      //             "value": searchModel
      //         },
      //         {
      //             "key": "name",
      //             "type":"string",
      //             "value": searchName
      //         },
      //         {
      //             "key": "material_code",
      //             "type":"string",
      //             "value": searchMaterialCode
      //         },
      //         {
      //             "key": "condition",
      //             "type":"string",
      //             "value": searchCondition
      //         },
      //         {
      //             "key": "classification",
      //             "type":"string",
      //             "value": searchClassification
      //         }
      //       ]
      //     }
      //   });

      //   if (typeof result === 'string'){
      //     result = JSON.parse(result);
      //   }
      //   this.product_data = result;

      // } catch (error) {
      //   alert(error);
      // }

      this.product_data = MaterialSearchPageConfig.test_product_data;

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

  },
}
</script>
<style lang="">

</style>
