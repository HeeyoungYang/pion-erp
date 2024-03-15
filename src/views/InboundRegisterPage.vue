<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productMenu="true" :inboundMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row justify="center">
        <v-col
          cols="12"
          sm="11"
        >
          <v-card
          elevation="1"
          >

            <v-card-text class=" pt-3">
              <v-row>
                <v-col
                  cols="12"
                  sm="4"
                  lg="2"
                >
                  <v-autocomplete
                    v-model="product_type"
                    :items="product_type_list"
                    dense
                    clearable
                    filled
                    hide-details
                    label="종류"
                  ></v-autocomplete>
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                  lg="2"
                >
                  <v-autocomplete
                    v-model="product_classification"
                    :items="product_classification_list"
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
                  lg="2"
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
                  align-self="center"
                >
                  <v-btn
                    color="primary"
                    elevation="2"
                  >
                    <v-icon>mdi-magnify</v-icon>검색
                  </v-btn>
                </v-col>
                <v-col
                  cols="12"
                >
                  <v-data-table
                    dense
                    v-model="product_inbound_data"
                    :headers="product_search_headers"
                    :items="product_search_data"
                    item-key="product_code"
                    class="elevation-1"
                    show-select
                  ></v-data-table>
                </v-col>
              </v-row>

              <v-row>

              </v-row>
            </v-card-text>
          </v-card>

          <v-card
          elevation="1"
          class="mt-5"
          >
            <v-card-text class=" pt-3">
              <v-row>
                <v-col cols="12" sm="3">
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
                        label="입고일자"
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
                </v-col>
                <v-col cols="12" sm="9" align-self="center">
                  <v-btn
                    small
                    color="default"
                    class="mr-2"
                  >
                    직접 입력
                  </v-btn>
                  <v-btn
                    small
                    color="success"
                  >
                    입고 승인 요청
                  </v-btn>
                </v-col>
                <v-col
                  cols="12"
                >
                  <v-data-table
                    dense
                    :headers="product_inbound_headers"
                    :items="product_inbound_data"
                    item-key="product_code"
                    class="elevation-1"
                  >
                    <template v-slot:item="{ item }">
                      <tr>
                        <td align="center">{{  item.product_type }}</td>
                        <td align="center">{{  item.product_classification }}</td>
                        <td align="center">{{  item.product_code }}</td>
                        <td align="center">{{  item.product_name }}</td>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            filled
                            type="number"
                            style="max-width:150px"
                            v-model="item.product_inbound_num"
                          >

                          </v-text-field>
                        </td>
                        <td align="center">{{  item.product_model }}</td>
                        <td align="center">{{  item.product_spec }}</td>
                        <td align="center">{{  item.manufacturer }}</td>
                        <td align="center">{{  item.pe_number }}</td>
                        <td align="center">{{  item.unit_price }}</td>
                        <td align="center">{{  item.product_price }}</td>
                      </tr>
                    </template>
                  </v-data-table>
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

export default {
  components: {
                NavComponent,
              },
  data(){
    return{
      product_type:'All',
      product_classification:'All',
      product_code: '',
      product_name: '',
      product_model: '',
      product_spec: '',
      product_manufacturer: '',
      product_condition: 'All',
      product_inbound_date: '2024-03-11',
      product_type_list: ['All', '원부자재', '반제품', '완제품'],
      product_classification_list: ['All', '일반', 'GFM', '전력변환기'],
      product_condition_list: ['All', 'G', 'B'],
      dates: [],
      menu: false,


      product_inbound_headers: [
        { text: '종류', align: 'center', value: 'product_type', },
        { text: '분류', align: 'center', value: 'product_classification', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '입고수량', align: 'center', value: 'product_inbound_num', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'stock_price', },
      ],

      product_inbound_data: [],

      product_search_headers: [
        { text: '종류', align: 'center', value: 'product_type', },
        { text: '분류', align: 'center', value: 'product_classification', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'stock_price', },
      ],

      product_search_data: [
        {
          product_type:'원부자재',
          product_classification:'일반',
          product_code: '공장2F_E-09-01',
          product_name: 'IGBT & SMPS',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          product_price: '',
        },
        {
          product_type:'원부자재',
          product_classification:'일반',
          product_code: '공장2F_E-09-02',
          product_name: 'SPD, 퓨즈',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          product_price: '',
        },
        {
          product_type:'원부자재',
          product_classification:'일반',
          product_code: '공장2F_E-09-03',
          product_name: '쿨링팬',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          product_price: '',
        },
        {
          product_type:'원부자재',
          product_classification:'일반',
          product_code: '공장2F_E-09-04',
          product_name: '보호회로',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          product_price: '',
        },
        {
          product_type:'원부자재',
          product_classification:'일반',
          product_code: '공장2F_E-09-05',
          product_name: '리액터',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          product_price: '',
        },
        {
          product_type:'원부자재',
          product_classification:'일반',
          product_code: '공장2F_E-09-06',
          product_name: 'MCCB',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          product_price: '',
        },
        {
          product_type:'반제품',
          product_classification:'일반',
          product_code: '공장2F_E-09-07',
          product_name: 'PCS Ass`Y',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          product_price: '',
        },
        {
          product_type:'반제품',
          product_classification:'일반',
          product_code: '공장2F_E-09-08',
          product_name: '제어기 Ass`Y',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          product_price: '',
        },
        {
          product_type:'완제품',
          product_classification:'일반',
          product_code: 'P-ESS-PC-380V500K60H-RT-24-R1',
          product_name: 'ESS GFM용 PCS',
          product_model: '',
          product_spec: '380VAC 500kW',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          product_price: '',
        },
      ],
    }
  },

  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  },
}
</script>
<style lang="">

</style>
