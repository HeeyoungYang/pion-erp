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
            >
              <v-btn
                color="primary"
                elevation="2"
                @click="searchButton"
              >
                <v-icon>mdi-magnify</v-icon>검색
              </v-btn>
            </v-col>
          </InputsCardComponent>

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
                  {{ data.name }} ({{ data.spec }})
                  <span
                    class="text-body-1 font-weight-bold black--text ml-2"
                    item-align-center
                  >
                    : {{ data.product_code }}
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
                      :item-key="data.product_info.product_code"
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
import InputsCardComponent from "@/components/InputsCardComponent.vue";

export default {
  components: {
                NavComponent,
                DataTableComponent,
                ExpansionPanelComponent,
                InputsCardComponent
              },
  mounted(){
    // this.closeAll()
  },
  data(){
    return{
      menu: false,

      searchCardInputs:[
        {label:'제품코드', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제품명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'사양', col:'12', sm:'4', lg:'3', value: ''},
      ],
      headers: [
        { text: '', align: 'center', value: '', },
        { text: '제품코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'module_material_name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '필요수량', align: 'center', value: 'module_material_num', },
        { text: '재고', align: 'center', value: 'stock_num', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'total_price', },
      ],
      expanded: [],
      singleExpand: true,
      product_data: [
        {
          product_code: 'P-ESS-PC-380V500K60H-RT-24-R1',
          name: 'ESS GFM용 PCS',
          spec: '380VAC 500kW',
          id:'380vac_500kW',
          button_toggle:true,
          product_info: [
            {
              product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01',
              module_material_name: 'PCS Ass`Y',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              module_material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              total_price: '',
              belong_data:[
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-01',
                  module_material_name: 'IGBT & SMPS',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  total_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-04',
                  module_material_name: 'SPD, 퓨즈',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  total_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-05',
                  module_material_name: '쿨링팬',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  total_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-06',
                  module_material_name: '보호회로',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  total_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-07',
                  module_material_name: '리액터',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  total_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-08',
                  module_material_name: 'MCCB',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  total_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-09',
                  module_material_name: 'EMC',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  total_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-10',
                  module_material_name: 'DC Capacitor',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  total_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-11',
                  module_material_name: '외함 및 기구',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  total_price: '',
                },
              ]
            },
            {
              product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02',
              module_material_name: '제어기 Ass`Y',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              module_material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              total_price: '',
              belong_data:
              [
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-01',
                  module_material_name: '제어기(LK11)',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  total_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-02',
                  module_material_name: '인터페이스보드',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  total_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-03',
                  module_material_name: 'SMPS(15VDC)',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  total_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-04',
                  module_material_name: 'SMPS Bracket',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  total_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-05',
                  module_material_name: 'HMI PC',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  total_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-06',
                  module_material_name: 'PLC',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  total_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-07',
                  module_material_name: '통신케이블',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  total_price: '',
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
