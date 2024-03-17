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
          <InputsCardComponent
            elevation="1"
            text-class=" pt-3"
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
              offset-lg="9"
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
          </InputsCardComponent>
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
                    :item-key="product_data.material_code"
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
import InputsCardComponent from "@/components/InputsCardComponent.vue";

export default {
  components: {
                NavComponent,
                InputsCardComponent,
                DataTableComponent,
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
        {label:'일자', type:'date', range:true, value:[], col:'12', sm:'4', lg:'3'}
      ],

      headers: [
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: 'material_code', },
        { text: '제품명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '재고', align: 'center', value: 'stock_num', },
        { text: '상태', align: 'center', value: 'condition', },
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '입고일자', align: 'center', value: 'inbound_date', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'total_price', },
      ],

      product_data: [
        {
          classification:'일반',
          material_code: '공장2F_E-09-01',
          name: 'IGBT & SMPS',
          model: '',
          spec: '',
          manufacturer: '파이온일렉트릭',
          stock_num: '1',
          condition: 'G',
          pe_number: '',
          inbound_date: '2024-03-11',
          unit_price: '',
          total_price: '',
        },
        {
          classification:'일반',
          material_code: '공장2F_E-09-02',
          name: 'SPD, 퓨즈',
          model: '',
          spec: '',
          manufacturer: '파이온일렉트릭',
          stock_num: '1',
          condition: 'G',
          pe_number: '',
          inbound_date: '2024-03-11',
          unit_price: '',
          total_price: '',
        },
        {
          classification:'일반',
          material_code: '공장2F_E-09-03',
          name: '쿨링팬',
          model: '',
          spec: '',
          manufacturer: '파이온일렉트릭',
          stock_num: '1',
          condition: 'G',
          pe_number: '',
          inbound_date: '2024-03-11',
          unit_price: '',
          total_price: '',
        },
        {
          classification:'일반',
          material_code: '공장2F_E-09-05',
          name: '보호회로',
          model: '',
          spec: '',
          manufacturer: '파이온일렉트릭',
          stock_num: '1',
          condition: 'G',
          pe_number: '',
          inbound_date: '2024-03-11',
          unit_price: '',
          total_price: '',
        },
        {
          classification:'일반',
          material_code: '공장2F_E-09-06',
          name: '리액터',
          model: '',
          spec: '',
          manufacturer: '파이온일렉트릭',
          stock_num: '1',
          condition: 'G',
          pe_number: '',
          inbound_date: '2024-03-11',
          unit_price: '',
          total_price: '',
        },
        {
          classification:'일반',
          material_code: '공장2F_E-09-07',
          name: 'MCCB',
          model: '',
          spec: '',
          manufacturer: '파이온일렉트릭',
          stock_num: '1',
          condition: 'G',
          pe_number: '',
          inbound_date: '2024-03-11',
          unit_price: '',
          total_price: '',
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
