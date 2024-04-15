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
                    :item-key="product_data.module_code"
                    hide-default-footer
                    disable-pagination
                    children-key="belong_data"
                    table-style=""
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
import DataTableComponent from "@/components/DataTableComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";

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
      total_stock_num:0,
      total_stock_price:0,
      searchCardInputs:[
        {label:'분류', type:'auto', list:['All', '일반', 'GFM', '전력변환기'], value:'All', col:'12', sm:'4', lg:'3'},
        {label:'상태', type:'auto', col:'12', sm:'4', lg:'3', value:'All', list:['All', 'G', 'B']},
        {label:'관리코드', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제품명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'모델명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'사양', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제조사', col:'12', sm:'4', lg:'3', value: ''},
        // {label:'일자', type:'date', range:true, value:[], col:'12', sm:'4', lg:'3'}
      ],

      headers: [
        { text: '', align: 'center', value: '', },
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: 'module_code', },
        { text: '위치', align: 'center', value: 'spot', },
        { text: '제품명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '필요수량', align: 'center', value: 'material_num', },
        { text: '재고', align: 'center', value: 'stock_num', },
        { text: '상태', align: 'center', value: 'condition', },
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '입고일자', align: 'center', value: 'inbound_date', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'total_price', },
      ],

      product_data: [
        {
          classification: 'GFM',
          module_code: '공장2F_E-01-01',
          spot:'공장동 1층',
          name: 'PCS Ass`Y',
          model: '반제품모델1',
          spec: '반제품스펙1',
          manufacturer: '파이온일렉트릭',
          material_num: '',
          stock_num: '10',
          condition: 'G',
          pe_number: 'PE240202-001',
          inbound_date: '',
          unit_price: '',
          photo: 'testt.jpg',
          belong_data:[
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-01',
              spot:'',
              name: 'IGBT & SMPS',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-02',
              spot:'',
              name: 'SPD, 퓨즈',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-03',
              spot:'',
              name: '쿨링팬',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              unit_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-04',
              spot:'',
              name: '보호회로',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              unit_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-05',
              spot:'',
              name: '리액터',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              unit_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-06',
              spot:'',
              name: 'MCCB',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              unit_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-07',
              spot:'',
              name: 'EMC',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              unit_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-08',
              spot:'',
              name: 'DC Capacitor',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              unit_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-09',
              spot:'',
              name: '외함 및 기구',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              unit_price: '',
            },
          ]
        },
        {
          classification: 'GFM',
          module_code: '공장2F_E-02-01',
          spot:'공장동 2층',
          name: '제어기 Ass`Y',
          model: '',
          spec: '',
          manufacturer: '파이온일렉트릭',
          material_num: '',
          stock_num: '10',
          condition: '',
          pe_number: '',
          inbound_date: '',
          unit_price: '',
          belong_data:
          [
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-11',
              spot:'',
              name: '제어기(LK11)',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-12',
              spot:'',
              name: '인터페이스보드',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-13',
              spot:'',
              name: 'SMPS(15VDC)',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-14',
              spot:'',
              name: 'SMPS Bracket',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-15',
              spot:'',
              name: 'HMI PC',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-16',
              spot:'',
              name: 'PLC',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-17',
              spot:'',
              name: '통신케이블',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
            },
          ]
        },
      ],
    }
  },

  computed: {
  },
  methods: {
    searchButton() {
      //검색 시 총 재고, 총 금액 초기화
      this.total_stock_num = 0;
      this.total_stock_price = 0;




      //검색 후 총 재고, 총 금액 계산
      this.product_data.forEach(data =>{
        this.total_stock_num += data.stock_num
        this.total_stock_price += data.stock_price
      })
    }
  }
}
</script>
<style lang="">

</style>
