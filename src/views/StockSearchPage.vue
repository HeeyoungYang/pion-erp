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
                  >
                    총 재고 : 9
                  </v-chip>
                  <v-chip
                    class="ma-2"
                    color="indigo"
                    text-color="white"
                  >
                    총 금액 :
                  </v-chip>
                  <DataTableComponent
                    :headers="headers"
                    :items="product_data"
                    :item-key="product_data._code"
                    show-photo
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
    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import DataTableComponent from "@/components/DataTableComponent";
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import mux from "@/mux";

export default {
  components: {
                NavComponent,
                DataTableComponent,
                CardComponent,
                InputsFormComponent,
              },
  data(){
    return{
      stock_more_0: true,

      searchCardInputs:[
        {label:'종류', type:'auto', col:'12', sm:'4', lg:'2', value:'All', list:['All', '원부자재', '반제품', '완제품']},
        {label:'분류', type:'auto', list:['All', '일반', 'GFM', '전력변환기'], value:'All', col:'12', sm:'4', lg:'2'},
        {label:'상태', type:'auto', col:'12', sm:'4', lg:'2', value:'All', list:['All', 'G', 'B']},
        {label:'관리코드', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제품명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'모델명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'사양', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제조사', col:'12', sm:'4', lg:'3', value: ''},
        // {label:'일자', type:'date', range:true, value:[], col:'12', sm:'4', lg:'3'}
      ],
      headers: [
        { text: '종류', align: 'center', value: 'type', },
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: '_code', },
        { text: '제품명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '재고', align: 'center', value: 'stock_num', },
        { text: '상태', align: 'center', value: 'condition', },
        { text: 'PE No.', align: 'center', value: 'pe_no', },
        { text: '입고일자', align: 'center', value: 'inbound_date', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'stock_price', },
      ],

      product_data: [
        // {
        //   type:'원부자재',
        //   classification:'일반',
        //   product_code: '공장2F_E-09-01',
        //   name: 'IGBT & SMPS',
        //   model: '',
        //   spec: '',
        //   manufacturer: '파이온일렉트릭',
        //   stock_num: '1',
        //   condition: 'G',
        //   pe_number: '',
        //   inbound_date: '2024-03-11',
        //   unit_price: '',
        //   stock_price: '',
        // },
        // {
        //   type:'원부자재',
        //   classification:'일반',
        //   product_code: '공장2F_E-09-02',
        //   name: 'SPD, 퓨즈',
        //   model: '',
        //   spec: '',
        //   manufacturer: '파이온일렉트릭',
        //   stock_num: '1',
        //   condition: 'G',
        //   pe_number: '',
        //   inbound_date: '2024-03-11',
        //   unit_price: '',
        //   stock_price: '',
        // },
        // {
        //   type:'원부자재',
        //   classification:'일반',
        //   product_code: '공장2F_E-09-03',
        //   name: '쿨링팬',
        //   model: '',
        //   spec: '',
        //   manufacturer: '파이온일렉트릭',
        //   stock_num: '1',
        //   condition: 'G',
        //   pe_number: '',
        //   inbound_date: '2024-03-11',
        //   unit_price: '',
        //   stock_price: '',
        // },
        // {
        //   type:'원부자재',
        //   classification:'일반',
        //   product_code: '공장2F_E-09-04',
        //   name: '보호회로',
        //   model: '',
        //   spec: '',
        //   manufacturer: '파이온일렉트릭',
        //   stock_num: '1',
        //   condition: 'G',
        //   pe_number: '',
        //   inbound_date: '2024-03-11',
        //   unit_price: '',
        //   stock_price: '',
        // },
        // {
        //   type:'원부자재',
        //   classification:'일반',
        //   product_code: '공장2F_E-09-04',
        //   name: '리액터',
        //   model: '',
        //   spec: '',
        //   manufacturer: '파이온일렉트릭',
        //   stock_num: '1',
        //   condition: 'G',
        //   pe_number: '',
        //   inbound_date: '2024-03-11',
        //   unit_price: '',
        //   stock_price: '',
        // },
        // {
        //   type:'원부자재',
        //   classification:'일반',
        //   product_code: '공장2F_E-09-04',
        //   name: 'MCCB',
        //   model: '',
        //   spec: '',
        //   manufacturer: '파이온일렉트릭',
        //   stock_num: '1',
        //   condition: 'G',
        //   pe_number: '',
        //   inbound_date: '2024-03-11',
        //   unit_price: '',
        //   stock_price: '',
        // },
        // {
        //   type:'반제품',
        //   classification:'일반',
        //   product_code: '공장2F_E-09-06',
        //   name: 'PCS Ass`Y',
        //   model: '',
        //   spec: '',
        //   manufacturer: '파이온일렉트릭',
        //   stock_num: '1',
        //   condition: 'G',
        //   pe_number: '',
        //   inbound_date: '2024-03-11',
        //   unit_price: '',
        //   stock_price: '',
        // },
        // {
        //   type:'반제품',
        //   classification:'일반',
        //   product_code: '공장2F_E-09-06',
        //   name: '제어기 Ass`Y',
        //   model: '',
        //   spec: '',
        //   manufacturer: '파이온일렉트릭',
        //   stock_num: '1',
        //   condition: 'G',
        //   pe_number: '',
        //   inbound_date: '2024-03-11',
        //   unit_price: '',
        //   stock_price: '',
        // },
        // {
        //   type:'완제품',
        //   classification:'일반',
        //   product_code: 'P-ESS-PC-380V500K60H-RT-24-R1',
        //   name: 'ESS GFM용 PCS',
        //   model: '',
        //   spec: '380VAC 500kW',
        //   manufacturer: '파이온일렉트릭',
        //   stock_num: '1',
        //   condition: 'G',
        //   pe_number: '',
        //   inbound_date: '2024-03-11',
        //   unit_price: '',
        //   stock_price: '',
        // },
      ],
    }
  },

  computed: {

  },
  methods: {
    async searchButton() {
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
          "query_info":{
            "script_file_name":"rooting_product_table_stock_table_module_table_material_table_root_json_2024_03_27_10_33_27.json",
            "params":[
                        {                        
                            "key": "classification",
                            "type": "string",
                            "value": searchClassification
                        },
                        {                            
                            "key": "manufacturer",
                            "type": "string",
                            "value": searchManufacturer
                         
                        },
                        {                            
                            "key": "model",
                            "type": "string",
                            "value": searchModelName
                        },
                        {                            
                            "key": "name",
                            "type": "string",
                            "value": searchProductName
                         
                        },
                        {
                            "key": "_code",
                            "type": "string",
                            "value": searchProductCode
                        },
                        {                          
                            "key": "spec",
                            "type": "string",
                            "value": searchProductSpec
                        },
                        {                            
                            "key": "type",
                            "type": "string",
                            "value": searchType
                        },
                        {                            
                            "key": "condition",
                            "type": "string",
                            "value": searchCondition
                        },
                        {
                            "key": "stock_num",
                            "type": "int",
                            "value": searchStockMoreZero
                        }
                    ]
            }
                
          // "query_info":{
          //   "script_file_name": "rooting_stock_table_root_json_2024_03_18_15_49_08.json",
          //   "params":[
          //     {
          //       "key":"type",
          //       "type":"string",
          //       "value": searchType
          //     },
          //     {
          //       "key":"product_code",
          //       "type":"string",
          //       "value": searchProductCode
          //     },
          //     {
          //       "key":"condition",
          //       "type":"string",
          //       "value": searchCondition
          //     }
          //   ]
          // }
        });

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        result = result.map(a => {
          a.stock_price = Math.round(a.unit_price * a.stock_num)
          return a;
        });
        this.product_data = result;

      } catch (error) {
        alert(error);
      }

    }
  }
}
</script>
<style lang="">

</style>
