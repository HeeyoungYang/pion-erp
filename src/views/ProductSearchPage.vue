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
                <v-btn
                  color="primary"
                  elevation="2"
                  @click="searchButton"
                >
                  <v-icon>mdi-magnify</v-icon>검색
                </v-btn>
              </v-col>
            </InputsFormComponent>
          </CardComponent>
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
                    : {{ data.item_code }}
                  </span>
                  <v-menu
                    open-on-hover
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
                  <v-chip
                    class="ma-2"
                    color="indigo"
                    text-color="white"
                    small
                    v-for="(spot_stock, idx) in data.spot_stock"
                    :key="idx"
                  >
                    {{ spot_stock.spot }} : {{ spot_stock.stock_num }}개
                  </v-chip>
                  <DataTableComponent
                      :headers="headers"
                      :items="data.belong_data"
                      :item-key="data.belong_data.item_code"
                      hide-default-footer
                      disable-pagination
                      children-key="belong_data"
                      table-style=""
                      show-photo
                      dense
                      itemNumInfo
                      itemNumInfoBelong
                      show-item-details
                      @itemDetials="detailInfoItem"
                    />
                  </v-col>
                </v-row>
              </template>
            </ExpansionPanelComponent>
          </div>
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
import DataTableComponent from "@/components/DataTableComponent.vue";
import ExpansionPanelComponent from "@/components/ExpansionPanelComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import ModalDialogComponent from "@/components/ModalDialogComponent";

export default {
  components: {
                NavComponent,
                DataTableComponent,
                ExpansionPanelComponent,
                CardComponent,
                InputsFormComponent,
                ModalDialogComponent,
              },
  mounted(){
    // this.closeAll()
  },
  data(){
    return{
      menu: false,
      detail_dialog: false,
      stockDetails:[],
      inboundDetails:[],
      stock_detail_header:[
        { text: '위치', align: 'center', value: 'spot', },
        { text: '수량', align: 'center', value: 'stock_num', },
        { text: '상태', align: 'center', value: 'condition', },
      ],
      inbound_detail_header:[
        { text: '위치', align: 'center', value: 'spot', },
        { text: '수량', align: 'center', value: 'inbound_num', },
        { text: '입고일자', align: 'center', value: 'inbound_date', },
      ],

      searchCardInputs:[
        {label:'제품코드', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제품명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'사양', col:'12', sm:'4', lg:'3', value: ''},
      ],
      headers: [
        { text: '', align: 'center', value: '', },
        { text: '제품코드', align: 'center', value: 'item_code', },
        { text: '제품명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '단가', align: 'center', value: 'unit_price', },
        // { text: '필요수량', align: 'center', value: 'module_material_num', },
        // { text: '재고', align: 'center', value: 'stock_num', },
        // { text: '총액', align: 'center', value: 'total_price', },
      ],
      expanded: [],
      singleExpand: true,
      product_data: [
        {
          item_code: 'P-ESS-PC-380V500K60H-RT-24-R1',
          classification: 'GFM',
          model: '완제품모델1',
          manufacturer: '제조사2',
          name: 'ESS GFM용 PCS',
          spec: '380VAC 500kW',
          unit_price: '1000',
          photo:'productphoto.jpg',
          spot_stock: [
            {spot:'공장동 2층', stock_num:'4', condition: 'G'},
            {spot:'공장동 1층', stock_num:'2', condition: 'G'},
          ],
          belong_data: [
            {
              type:'반제품',
              classification: 'GFM',
              product_item_code:'P-ESS-PC-380V500K60H-RT-24-R1-01',
              item_code: 'PE-반제품-01',
              name: 'PCS Ass`Y',
              model: '반제품모델1',
              spec: '반제품스펙1',
              manufacturer: '파이온일렉트릭',
              item_num: '1',
              total_stock: 100,
              unit_price: 2,
              item_price: 100,
              spot_stock:[
                {spot: '공장동 1층', stock_num: 40, condition: 'G'},
                {spot: '공장동 2층', stock_num: 60, condition: 'G'},
              ],
              belong_data:[
                {
                  product_item_code:'P-ESS-PC-380V500K60H-RT-24-R1-01-01',
                  item_code: '원부자재01_001',
                  name: 'IGBT & SMPS',
                  model: '원부자재모델1',
                  spec: '원부자재사양1',
                  manufacturer: '파이온일렉트릭',
                  item_num: 400,
                  total_stock: 1000,
                  unit_price: 3,
                  spot_stock:[
                    {spot: '세종사무실', stock_num: 1000, condition: 'G'},
                  ],
                },
                {
                  product_item_code:'P-ESS-PC-380V500K60H-RT-24-R1-01-02',
                  item_code: '원부자재01_002',
                  name: 'SPD, 퓨즈',
                  model: '원부자재모델2',
                  spec: '원부자재사양2',
                  manufacturer: '파이온일렉트릭',
                  item_num: 200,
                  total_stock: 100,
                  unit_price: 4,
                  spot_stock:[
                    {spot: '세종사무실', stock_num: 450, condition: 'G'},
                    {spot: '공장동 1층', stock_num: 450, condition: 'G'},
                  ],
                },
              ]
            },
            {
              product_item_code:'P-ESS-PC-380V500K60H-RT-24-R1-02',
              item_code:'반제품02_002',
              classification: '일반',
              type:'반제품',
              name: '제어기 Ass`Y',
              model: '반제품모델2',
              spec: '반제품스펙2',
              manufacturer: '파이온일렉트릭',
              item_num: '1',
              total_stock: 120,
              unit_price: 1,
              item_price: 120,
              spot_stock:[
                {spot: '공장동 1층', stock_num: 50, condition: 'G'},
                {spot: '공장동 2층', stock_num: 70, condition: 'G'},
              ],
              belong_data:[]
            },
          ],
        },
      ],

    }
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
