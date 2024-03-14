<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productMenu="true" :shipMenu="true"></NavComponent>

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
                    v-model="approval"
                    :items="approval_list"
                    dense
                    clearable
                    filled
                    hide-details
                    label="승인"
                  ></v-autocomplete>
                </v-col>
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
                        label="출고일자"
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
                      align-self="center"
                    >
                      <v-btn
                        color="primary"
                        elevation="2"
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
                <v-col
                  cols="12"
                >
                  <v-chip
                    class="ma-2"
                    color="indigo"
                    text-color="white"
                  >
                    총 수량 :
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
                    :item-key="product_code"
                    show-photo
                    approval
                    show-files
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

export default {
  components: {
                NavComponent,
                DataTableComponent,
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
      approval: 'All',
      product_ship_date: '2024-03-11',
      stock_more_0: true,
      product_type_list: ['All', '원부자재', '반제품', '완제품'],
      product_classification_list: ['All', '일반', 'GFM', '전력변환기'],
      approval_list: ['All', '승인', '미승인', '반려'],
      dates: [],
      approval_return: false,
      approval_approved: false,
      approval_notapproved: false,

      headers: [
        { text: '신청자', align: 'center', value: 'ship_applicant', },
        { text: '종류', align: 'center', value: 'product_type', },
        { text: '분류', align: 'center', value: 'product_classification', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '출고수량', align: 'center', value: 'ship_num', },
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '출고일자', align: 'center', value: 'ship_date', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'stock_price', },
      ],

      product_data: [
        {
          ship_applicant:'윤준수',
          product_type:'원부자재',
          product_classification:'일반',
          product_code: '공장2F_E-09-01',
          product_name: 'IGBT & SMPS',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          ship_num: '1',
          approval: '승인',
          pe_number: '',
          ship_date: '2024-03-11',
          unit_price: '',
          product_price: '',
          approve_date:'2024-03-12',
          return_reason:'',
        },
        {
          ship_applicant:'윤준수',
          product_type:'반제품',
          product_classification:'일반',
          product_code: '공장2F_E-09-02',
          product_name: 'SPD, 퓨즈',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          ship_num: '1',
          approval: '미승인',
          pe_number: '',
          ship_date: '2024-03-11',
          unit_price: '',
          product_price: '',
          approve_date:'',
          return_reason:'',
          files:'warehouse.jpg,2021.10_MKOR_ERP_SYSTEM_MANUAL.pdf'
        },
        {
          ship_applicant:'윤준수',
          product_type:'완제품',
          product_classification:'일반',
          product_code: '공장2F_E-09-03',
          product_name: '쿨링팬',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          ship_num: '1',
          approval: '반려',
          pe_number: '',
          ship_date: '2024-03-11',
          unit_price: '',
          product_price: '',
          approve_date:'',
          return_reason:'반려사유노출영역',
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
