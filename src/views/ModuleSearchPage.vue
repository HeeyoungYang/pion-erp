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
        { text: '제품명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '필요수량', align: 'center', value: 'material_num', },
        { text: '재고', align: 'center', value: 'stock_num', },
        { text: '상태', align: 'center', value: 'product_condition', },
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '입고일자', align: 'center', value: 'inbound_date', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'total_price', },
      ],

      product_data: [
      {
        classification: 'GFM',
        module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01',
        name: 'PCS Ass`Y',
        model: '',
        spec: '',
        manufacturer: '파이온일렉트릭',
        material_num: '',
        stock_num: '',
        product_condition: '',
        pe_number: '',
        inbound_date: '',
        unit_price: '',
        total_price: '',
        belong_data:[
          {
            classification: 'GFM',
            module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-01',
            name: 'IGBT & SMPS',
            model: '',
            spec: '',
            manufacturer: '파이온일렉트릭',
            material_num: '1',
            stock_num: '10',
            product_condition: '',
            pe_number: '',
            inbound_date: '',
            unit_price: '',
            total_price: '',
          },
          {
            classification: 'GFM',
            module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-04',
            name: 'SPD, 퓨즈',
            model: '',
            spec: '',
            manufacturer: '파이온일렉트릭',
            material_num: '1',
            stock_num: '10',
            product_condition: '',
            pe_number: '',
            inbound_date: '',
            unit_price: '',
            total_price: '',
          },
          {
            classification: 'GFM',
            module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-05',
            name: '쿨링팬',
            model: '',
            spec: '',
            manufacturer: '파이온일렉트릭',
            material_num: '1',
            stock_num: '10',
            product_condition: '',
            pe_number: '',
            inbound_date: '',
            unit_price: '',
            total_price: '',
          },
          {
            classification: 'GFM',
            module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-06',
            name: '보호회로',
            model: '',
            spec: '',
            manufacturer: '파이온일렉트릭',
            material_num: '1',
            stock_num: '10',
            product_condition: '',
            pe_number: '',
            inbound_date: '',
            unit_price: '',
            total_price: '',
          },
          {
            classification: 'GFM',
            module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-07',
            name: '리액터',
            model: '',
            spec: '',
            manufacturer: '파이온일렉트릭',
            material_num: '1',
            stock_num: '10',
            product_condition: '',
            pe_number: '',
            inbound_date: '',
            unit_price: '',
            total_price: '',
          },
          {
            classification: 'GFM',
            module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-08',
            name: 'MCCB',
            model: '',
            spec: '',
            manufacturer: '파이온일렉트릭',
            material_num: '1',
            stock_num: '10',
            product_condition: '',
            pe_number: '',
            inbound_date: '',
            unit_price: '',
            total_price: '',
          },
          {
            classification: 'GFM',
            module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-09',
            name: 'EMC',
            model: '',
            spec: '',
            manufacturer: '파이온일렉트릭',
            material_num: '1',
            stock_num: '10',
            product_condition: '',
            pe_number: '',
            inbound_date: '',
            unit_price: '',
            total_price: '',
          },
          {
            classification: 'GFM',
            module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-10',
            name: 'DC Capacitor',
            model: '',
            spec: '',
            manufacturer: '파이온일렉트릭',
            material_num: '1',
            stock_num: '10',
            product_condition: '',
            pe_number: '',
            inbound_date: '',
            unit_price: '',
            total_price: '',
          },
          {
            classification: 'GFM',
            module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-11',
            name: '외함 및 기구',
            model: '',
            spec: '',
            manufacturer: '파이온일렉트릭',
            material_num: '1',
            stock_num: '10',
            product_condition: '',
            pe_number: '',
            inbound_date: '',
            unit_price: '',
            total_price: '',
          },
        ]
      },
      {
        classification: 'GFM',
        module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02',
        name: '제어기 Ass`Y',
        model: '',
        spec: '',
        manufacturer: '파이온일렉트릭',
        material_num: '',
        stock_num: '1',
        product_condition: '',
        pe_number: '',
        inbound_date: '',
        unit_price: '',
        total_price: '',
        belong_data:
        [
          {
            classification: 'GFM',
            module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-01',
            name: '제어기(LK11)',
            model: '',
            spec: '',
            manufacturer: '파이온일렉트릭',
            material_num: '1',
            stock_num: '10',
            product_condition: '',
            pe_number: '',
            inbound_date: '',
            unit_price: '',
            total_price: '',
          },
          {
            classification: 'GFM',
            module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-02',
            name: '인터페이스보드',
            model: '',
            spec: '',
            manufacturer: '파이온일렉트릭',
            material_num: '1',
            stock_num: '10',
            product_condition: '',
            pe_number: '',
            inbound_date: '',
            unit_price: '',
            total_price: '',
          },
          {
            classification: 'GFM',
            module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-03',
            name: 'SMPS(15VDC)',
            model: '',
            spec: '',
            manufacturer: '파이온일렉트릭',
            material_num: '1',
            stock_num: '10',
            product_condition: '',
            pe_number: '',
            inbound_date: '',
            unit_price: '',
            total_price: '',
          },
          {
            classification: 'GFM',
            module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-04',
            name: 'SMPS Bracket',
            model: '',
            spec: '',
            manufacturer: '파이온일렉트릭',
            material_num: '1',
            stock_num: '10',
            product_condition: '',
            pe_number: '',
            inbound_date: '',
            unit_price: '',
            total_price: '',
          },
          {
            classification: 'GFM',
            module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-05',
            name: 'HMI PC',
            model: '',
            spec: '',
            manufacturer: '파이온일렉트릭',
            material_num: '1',
            stock_num: '10',
            product_condition: '',
            pe_number: '',
            inbound_date: '',
            unit_price: '',
            total_price: '',
          },
          {
            classification: 'GFM',
            module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-06',
            name: 'PLC',
            model: '',
            spec: '',
            manufacturer: '파이온일렉트릭',
            material_num: '1',
            stock_num: '10',
            product_condition: '',
            pe_number: '',
            inbound_date: '',
            unit_price: '',
            total_price: '',
          },
          {
            classification: 'GFM',
            module_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-07',
            name: '통신케이블',
            model: '',
            spec: '',
            manufacturer: '파이온일렉트릭',
            material_num: '1',
            stock_num: '10',
            product_condition: '',
            pe_number: '',
            inbound_date: '',
            unit_price: '',
            total_price: '',
          },
        ]
      },
      ],
    }
  },

  computed: {
  },
}
</script>
<style lang="">

</style>
