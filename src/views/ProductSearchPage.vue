<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <LoadingModalComponent :dialog-value="loading_dialog" hide-overlay></LoadingModalComponent>
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
                    v-if="data.thumbnail"
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
                                :src="imageBinary(data.thumbnail)"
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
                    <v-btn
                      small
                      color="default"
                      class="mr-2"
                      @click="detailInfoItem(data, 'product')"
                    >완제품 상세</v-btn>
                    <v-btn
                      small
                      color="success"
                      @click="downloadToExcel"
                    >엑셀 다운로드</v-btn>
                    <!-- <v-chip
                      class="ma-2"
                      color="indigo"
                      text-color="white"
                      small
                      v-for="(spot_stock, idx) in data.spot_stock"
                      :key="idx"
                    >
                      {{ spot_stock.spot }} : {{ spot_stock.stock_num }}개
                    </v-chip> -->
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <DataTableComponent
                      v-if="data.belong_data"
                      :headers="headers"
                      :items="data.belong_data"
                      :item-key="data.belong_data.item_code"
                      hide-default-footer
                      disable-pagination
                      children-key="belong_data"
                      table-style=""
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
      @close="closeDetail"
      >
        <v-row>
          <v-col cols="12" :sm="detailForProduct ? 6 : 4" class="mb-3">
            <p class="text-h6 font-weight-bold primary--text">사진</p>
            <v-card class="pa-7 mt-5" color="grey lighten-3">
              <!-- <v-img
                alt="Pionelectric Logo"
                class="shrink mr-2"
                contain
                :src="imageBinary(item.thumbnail)"
                transition="scale-transition"
                width="350"
              /> -->
              <v-img
                alt="Pionelectric Logo"
                class="shrink"
                contain
                src="../assets/img/pion_logo.png"
                transition="scale-transition"
                style="margin:0px auto; width:100%"
              />
            </v-card>
          </v-col>
          <v-col cols="12" :sm="detailForProduct ? 6 : 4" v-if="detailForProduct">
            <p class="text-h6 font-weight-bold primary--text">기본 정보</p>
            <DataTableComponent
              :headers="product_detail_header"
              :items="product_data"
              hide-default-footer
              disable-pagination
              dense
            />
          </v-col>
          <v-col cols="12" :sm="detailForProduct ? 6 : 4">
            <p class="text-h6 font-weight-bold primary--text">재고 정보</p>
            <DataTableComponent
              :headers="stock_detail_header"
              :items="stockDetails"
              hide-default-footer
              disable-pagination
              dense
            />
          </v-col>
          <v-col cols="12" :sm="detailForProduct ? 6 : 4">
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
import LoadingModalComponent from "@/components/LoadingModalComponent";
import ProductSearchPageConfig from "@/configure/ProductSearchPageConfig.json";
import mux from "@/mux";
import CheckPagePermission from "@/common_js/CheckPagePermission";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=ProductSearchPage')],
  components: {
                NavComponent,
                DataTableComponent,
                ExpansionPanelComponent,
                CardComponent,
                InputsFormComponent,
                ModalDialogComponent,
                LoadingModalComponent,
              },
  mounted(){
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
    // this.closeAll()
  },
  data(){
    return{
      detailForProduct: false,
      menu: false,
      detail_dialog: false,
      stockDetails:[],
      inboundDetails:[],

      stock_detail_header:ProductSearchPageConfig.stock_detail_header,
      inbound_detail_header:ProductSearchPageConfig.inbound_detail_header,
      product_detail_header:ProductSearchPageConfig.product_detail_header,
      searchCardInputs:ProductSearchPageConfig.searchCardInputs,
      headers:ProductSearchPageConfig.headers,
      product_data: []
      // product_data:ProductSearchPageConfig.test_product_data
    }
  },

  watch: {
    detail_dialog (val) {
      val || this.closeDetail()
    },
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      // console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    detailInfoItem(item, type){
      this.detail_dialog = true;
      this.stockDetails = item.spot_stock
      if(type === 'product'){
        this.detailForProduct  = true;
      }else{
        this.detailForProduct  = false;
      }
    },
    closeDetail () {
      this.detail_dialog = false
    },

    imageBinary(thumbnail){
      if(thumbnail){
        try {
          let imgURL = mux.Util.binaryToURL(mux.Util.hexToUint8Array(thumbnail));
          return imgURL
        } catch{
          return '';
        }
      }
    },

    async searchButton() {
      this.loading_dialog = true;

      let searchProductCode = this.searchCardInputs.find(x=>x.label === '제품코드').value;
      if (!searchProductCode)
        searchProductCode = '%';
      let searchName = this.searchCardInputs.find(x=>x.label === '제품명').value;
      if (searchName)
        searchName = searchName.trim();
      let searchSpec = this.searchCardInputs.find(x=>x.label === '사양').value;
      if (searchSpec)
        searchSpec = searchSpec.trim();


      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/sample_rest_api/',
          "params": [
              {
                "product_table.name": searchName ? searchName : "",
                "product_table.product_code": searchProductCode ? searchProductCode : "",
                "product_table.spec": searchSpec ? searchSpec : ""
              }
          ],
          "script_file_name": "rooting_완제품_검색_24_05_01_12_44_A0W.json",
          "script_file_path": "data_storage_pion\\json_sql\\stock\\10_완제품_검색\\완제품_검색_24_05_01_12_45_GC6"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0){
          this.product_data = result['data'];
          this.product_data.forEach(data =>{
            data.item_code = data.code;
            delete data.code;

            if(data.belong_data){
              for(let b=0; b<data.belong_data.length; b++){
                data.belong_data[b].item_code = data.belong_data[b].code;
                delete data.belong_data[b].code;
                if(data.belong_data[b].belong_data){
                  for(let c=0; c<data.belong_data[b].belong_data.length; c++){
                    data.belong_data[b].belong_data[c].item_code = data.belong_data[b].belong_data[c].code;
                    delete data.belong_data[b].belong_data[c].code;
                  }
                }
              }
            }
            let stock_calc = 0;
            if (data.spot_stock){
              for(let d=0; d<data.spot_stock.length; d++){
                if (typeof data.spot_stock[d].stock_num === 'number'){
                  stock_calc += data.spot_stock[d].stock_num;
                }
              }
            }
            data.total_stock = stock_calc
            if (typeof data.unit_price === 'number'){
              data.item_price = data.unit_price * data.total_stock
            }else {
              data.item_price = 0;
            }
            // this.total_stock_num += data.total_stock
            // this.total_stock_price += data.item_price
          })
        }else{
          if (prevURL !== window.location.href) return;
          alert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        // console.error(error);
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          alert(error.response['data']['failed_info'].msg);
        else
          alert(error);
      }
      this.loading_dialog = false;
      // this.product_data = ProductSearchPageConfig.test_product_data;
    }
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
