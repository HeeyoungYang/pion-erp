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
                    :item-key="product_data.item_code"
                    hide-default-footer
                    disable-pagination
                    children-key="belong_data"
                    table-style=""
                    show-photo
                    stockNumInfo
                    itemNumInfoBelong
                    show-item-details
                    @itemDetials="detailInfoItem"
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
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import ModalDialogComponent from "@/components/ModalDialogComponent";

export default {
  components: {
                NavComponent,
                DataTableComponent,
                CardComponent,
                InputsFormComponent,
                ModalDialogComponent,
              },
  data(){
    return{
      stock_more_0: true,
      total_stock_num:0,
      total_stock_price:0,
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
        { text: '관리코드', align: 'center', value: 'item_code', },
        { text: '제품명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '단가', align: 'center', value: 'unit_price', },
      ],

      product_data: [
        {
          classification: 'GFM',
          item_code: 'PE-반제품-01',
          name: 'PCS Ass`Y',
          model: '반제품모델1',
          spec: '반제품스펙1',
          manufacturer: '파이온일렉트릭',
          item_num: '',
          total_stock: 100,
          unit_price: 2,
          item_price: 100,
          photo: 'testt.jpg',
          spot_stock:[
            {spot: '공장동 1층', stock_num: 40, condition: 'G'},
            {spot: '공장동 2층', stock_num: 60, condition: 'G'},
          ],
          belong_data:[
            {
              classification: 'GFM',
              item_code: 'PE-원부자재-01',
              name: 'IGBT & SMPS',
              model: '원부자재모델1',
              spec: '원부자재사양1',
              manufacturer: '파이온일렉트릭',
              item_num: 400,
              total_stock: 1000,
              unit_price: 3,
              item_price: 1000,
              spot_stock:[
                {spot: '세종사무실', stock_num: 1000, condition: 'G'},
              ],
            },
            {
              classification: 'GFM',
              item_code: 'PE-원부자재-02',
              name: 'SPD, 퓨즈',
              model: '원부자재모델2',
              spec: '원부자재사양2',
              manufacturer: '파이온일렉트릭',
              item_num: 200,
              total_stock: 100,
              unit_price: 4,
              item_price: 900,
              spot_stock:[
                {spot: '세종사무실', stock_num: 450, condition: 'G'},
                {spot: '공장동 1층', stock_num: 450, condition: 'G'},
              ],
            },
          ]
        },
        {
          classification: 'GFM',
          item_code: 'PE-반제품-02',
          name: '제어기 Ass`Y',
          model: '반제품모델2',
          spec: '반제품스펙2',
          manufacturer: '파이온일렉트릭',
          item_num: '',
          total_stock: 120,
          unit_price: 1,
          item_price: 120,
          photo: 'testt.jpg',
          spot_stock:[
            {spot: '공장동 1층', stock_num: 50, condition: 'G'},
            {spot: '공장동 2층', stock_num: 70, condition: 'G'},
          ],
          belong_data:[]
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
