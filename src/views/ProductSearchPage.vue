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

            <!-- <v-card-text class=" pt-3">
              <v-row>
                <v-col
                  cols="12"
                  sm="4"
                  lg="3"
                >
                  <v-autocomplete
                    v-model="product_type"
                    :items="product_type_list"
                    dense
                    clearable
                    filled
                    hide-details
                    label="분류"
                  ></v-autocomplete>
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                  lg="3"
                >
                  <v-text-field
                    v-model="product_code"
                    dense
                    clearable
                    filled
                    hide-details
                    label="관리코드"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                  lg="3"
                >
                  <v-text-field
                    v-model="product_name"
                    dense
                    clearable
                    filled
                    hide-details
                    label="제품명"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                  lg="3"
                >
                  <v-text-field
                    v-model="product_model"
                    dense
                    clearable
                    filled
                    hide-details
                    label="모델명"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                  lg="3"
                >
                  <v-text-field
                    v-model="product_spec"
                    dense
                    clearable
                    filled
                    hide-details
                    label="사양"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                  lg="3"
                >
                  <v-text-field
                    v-model="product_manufacturer"
                    dense
                    clearable
                    filled
                    hide-details
                    label="제조사"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                  lg="3"
                >
                  <v-autocomplete
                    v-model="product_condition"
                    :items="product_condition_list"
                    dense
                    clearable
                    filled
                    hide-details
                    label="상태"
                  ></v-autocomplete>
                </v-col> -->
                <!-- <v-col
                  cols="12"
                  sm="4"
                  lg="3"
                >
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="dates"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateRangeText"
                        dense
                        clearable
                        filled
                        hide-details
                        label="일자"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="dates"
                      no-title
                      scrollable
                      range
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="menu = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(dates)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col> -->
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
                <!-- <v-col
                  cols="6"
                  sm="4"
                  lg="3"
                  align-self="center"
                >
                  <v-btn
                    color="primary"
                    elevation="2"
                  >
                    <v-icon>mdi-magnify</v-icon>검색
                  </v-btn>
                </v-col> -->
              <!-- </v-row>

              <v-row>

              </v-row>
            </v-card-text> -->
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
                      총 재고 : 11
                  </v-chip>
                  <v-chip
                    class="ma-2"
                    color="indigo"
                    text-color="white"
                  >
                    총 금액 : 105,700
                  </v-chip>
                  <v-data-table
                    dense
                    :headers="headers"
                    :items="product_data"
                    item-key="product_code"
                    class="elevation-1"
                  ></v-data-table>
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
import InputsCardComponent from "@/components/InputsCardComponent.vue";
import NavComponent from "@/components/NavComponent";

export default {
  components: {
                NavComponent,
                InputsCardComponent
              },
  data(){
    return{
      searchCardInputs:[
        {label:'분류', type:'auto', list:this.product_type_list, value:'All', col:'12', sm:'4', lg:'3'},
        {label:'관리코드', col:'12', sm:'4', lg:'3'},
        {label:'제품명', col:'12', sm:'4', lg:'3'},
        {label:'모델명', col:'12', sm:'4', lg:'3'},
        {label:'사양', col:'12', sm:'4', lg:'3'},
        {label:'제조사', col:'12', sm:'4', lg:'3'},
        {label:'상태', type:'auto', col:'12', sm:'4', lg:'3', value:'All', list:this.product_condition_list},
        {label:'일자', type:'date', range:true, list:this.product_type_list, value:[], col:'12', sm:'4', lg:'3'}
      ],
      product_type:'All',
      product_code: '',
      product_name: '',
      product_model: '',
      product_spec: '',
      product_manufacturer: '',
      product_condition: 'All',
      product_inbound_date: '',
      stock_more_0: true,
      product_type_list: ['All', '일반', 'GFM', '전력변환기'],
      product_condition_list: ['All', 'G', 'B'],
      dates: [],
      menu: false,

      headers: [
        { text: '분류', align: 'center', value: 'product_type', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '재고', align: 'center', value: 'product_num', },
        { text: '상태', align: 'center', value: 'product_condition', },
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '입고일자', align: 'center', value: 'inbound_date', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'stock_price', },
      ],

      product_data: [
        {
          product_type:'일반',
          product_code: '공장2F_E-09-02_PN-AF_SVG-001',
          product_name: '제품1',
          product_model: '모델A',
          product_spec: '690V 100A',
          manufacturer: '파이온일렉트릭',
          product_num: '3',
          product_condition: 'G',
          pe_number: 'PE240207-001',
          inbound_date: '2024-02-07',
          unit_price: '100',
          stock_price: '300',
        },
        {
          product_type:'GFM',
          product_code: '공장2F_E-09-02_PN-AF_SVG-002',
          product_name: '제품2',
          product_model: '모델B',
          product_spec: '480V 100A',
          manufacturer: '파이온일렉트릭',
          product_num: '2',
          product_condition: 'G',
          pe_number: 'PE240207-002',
          inbound_date: '2024-02-07',
          unit_price: '200',
          stock_price: '400',
        },
        {
          product_type:'전력변환기',
          product_code: '공장2F_E-09-02_PN-AF_SVG-003',
          product_name: '제품3',
          product_model: '모델C',
          product_spec: '690V 100A',
          manufacturer: '파이온일렉트릭',
          product_num: '5',
          product_condition: 'G',
          pe_number: 'PE240207-003',
          inbound_date: '2024-02-07',
          unit_price: '1,000',
          stock_price: '5,000',
        },
        {
          product_type:'일반',
          product_code: '공장2F_E-09-02_PN-AF_SVG-004',
          product_name: '제품4',
          product_model: '모델D',
          product_spec: '480V 100A',
          manufacturer: '파이온일렉트릭',
          product_num: '1',
          product_condition: 'G',
          pe_number: 'PE240207-004',
          inbound_date: '2024-02-07',
          unit_price: '100,000',
          stock_price: '100,000',
        },
      ],
    }
  },

  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  },
  methods: {
    searchButton() {
      alert(this.searchCardInputs.find(x=>x.label === '일자').value.sort());
    }
  }
}
</script>
<style lang="">

</style>
