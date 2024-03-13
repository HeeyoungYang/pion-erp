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
          <v-card
          elevation="1"
          >

            <v-card-text class=" pt-3">
              <v-row>
                <v-col
                  cols="12"
                  sm="4"
                  lg="3"
                >
                  <v-text-field
                    v-model="search_complete_product_name"
                    dense
                    clearable
                    filled
                    hide-details
                    label="제품코드"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                  lg="3"
                >
                  <v-text-field
                    v-model="search_complete_product_name"
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
                    v-model="search_complete_product_capacity"
                    dense
                    clearable
                    filled
                    hide-details
                    label="용량"
                  ></v-text-field>
                </v-col>
                <v-col
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
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <div>
            <ExpansionPanelComponent
              :data="product_data"
              elevation="1"
              class="mt-5"
              multiple>

              <template v-slot:header="{ data }">
                <p
                  class="text-h6 font-weight-black mb-0"
                  item-align-center
                >
                  {{ data.complete_product_name }} ({{ data.product_capacity }})
                  <span
                    class="text-body-1 font-weight-bold black--text ml-2"
                    item-align-center
                  >
                    : {{ data.complete_product_code }}
                  </span>
                  <v-menu
                    open-on-hover
                    v-model="inbound_approval_approved"
                    :close-on-content-click="false"
                    :nudge-width="100"
                    offset-x
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        small
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-image
                      </v-icon>
                    </template>

                    <v-card class="pa-0">
                      <v-list class="pa-0">
                        <v-list-item class="pa-0">
                          <v-list-item-content class="pa-3">
                            <v-list-item-subtitle>
                              제품이미지영역
                              <v-img
                                alt="Pionelectric Logo"
                                class="shrink mr-2"
                                contain
                                src="../assets/img/pion_logo.png"
                                transition="scale-transition"
                                width="150"
                              />
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-menu>
                </p>

              </template>
              <template v-slot:content="{ data }">
                <v-divider class="mb-4"></v-divider>
                <v-row>
                  <v-col
                    cols="12"
                  >
                  <DataTableComponent
                      :headers="headers"
                      :items="data.product_info"
                      :item-key="data.product_info.complete_product_code"
                      hide-default-footer
                      disable-pagination
                      children-key="belong_data"
                      table-style=""
                      show-photo
                    />
                  </v-col>
                </v-row>
              </template>
            </ExpansionPanelComponent>
          </div>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import DataTableComponent from "@/components/DataTableComponent.vue";
import ExpansionPanelComponent from "@/components/ExpansionPanelComponent.vue";

export default {
  components: {
                NavComponent,
                DataTableComponent,
                ExpansionPanelComponent
              },
  mounted(){
    // this.closeAll()
  },
  data(){
    return{
      menu: false,
      search_complete_product_name:'',
      search_complete_product_capacity: '',
      headers: [
        { text: '', align: 'center', value: '', },
        { text: '제품코드', align: 'center', value: 'complete_product_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '필요수량', align: 'center', value: 'product_num', },
        { text: '재고', align: 'center', value: 'stock_num', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'product_price', },
      ],
      expanded: [],
      singleExpand: true,
      product_data: [
        {
          complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1',
          complete_product_name: 'ESS GFM용 PCS',
          product_capacity: '380VAC 500kW',
          id:'380vac_500kW',
          button_toggle:true,
          product_info: [
            {
              complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01',
              product_name: 'PCS Ass`Y',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
              belong_data:[
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-01',
                  product_name: 'IGBT & SMPS',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-04',
                  product_name: 'SPD, 퓨즈',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-05',
                  product_name: '쿨링팬',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-06',
                  product_name: '보호회로',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-07',
                  product_name: '리액터',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-08',
                  product_name: 'MCCB',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-09',
                  product_name: 'EMC',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-10',
                  product_name: 'DC Capacitor',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-11',
                  product_name: '외함 및 기구',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
              ]
            },
            {
              complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02',
              product_name: '제어기 Ass`Y',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
              belong_data:
              [
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-01',
                  product_name: '제어기(LK11)',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-02',
                  product_name: '인터페이스보드',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-03',
                  product_name: 'SMPS(15VDC)',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-04',
                  product_name: 'SMPS Bracket',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-05',
                  product_name: 'HMI PC',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-06',
                  product_name: 'PLC',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-07',
                  product_name: '통신케이블',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
              ]
            },
          ],
        },
      ],

    }
  },

  methods: {
  },
  computed: {
  },
}
</script>
<style>
.custom-dialog {
  position: absolute;
    right: 0;
    margin: 0;
    min-height: 100%;
}
.v-row-group__header{background-color: #fffde9!important;}
</style>
