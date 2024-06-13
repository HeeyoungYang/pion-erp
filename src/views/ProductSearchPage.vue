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
                align-self="center"
              >
                <v-btn
                  color="primary"
                  elevation="2"
                  class="mr-2"
                  @click="searchButton"
                >
                  <v-icon>mdi-magnify</v-icon>검색
                </v-btn>
                <v-btn
                  color="success"
                  @click="downloadToExcel"
                >엑셀 다운로드</v-btn>
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
                  class=" mb-0"
                  item-align-center
                >
                  <span class="text-h6 font-weight-black">{{ data.name }} ({{ data.spec }})</span>
                  <span
                    class="text-body-1 font-weight-bold black--text ml-2"
                    item-align-center
                  >
                    : {{ data.item_code }}
                  </span>
                </p>
              </template>
              <template v-slot:content="{ data }">
                <v-divider class="mb-4"></v-divider>
                <v-row>
                  <v-col
                    cols="12"
                  >
                    <!-- <v-chip
                      class="mr-2"
                      color="success"
                      small
                    >
                      총 재료비 : {{ data.unit_price }}
                    </v-chip> -->

                    <v-chip
                      class="mr-2 font-weight-bold white--text"
                      color="indigo"
                      small
                    >
                      총 재고 : {{ data.total_stock }}개
                    </v-chip>
                    <v-chip
                      class="mr-2 font-weight-bold white--text"
                      color="indigo"
                      small
                    >
                      총 재고 금액 : {{ data.total_stock_price }}
                    </v-chip>
                    <v-btn
                      small
                      color="default"
                      class="mr-2"
                      @click="detailInfoItem(data, 'product')"
                    >상세 보기</v-btn>

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
                      itemPriceInfo
                      itemPriceInfoBelong
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
            <v-card class="pa-1 mt-5" color="grey lighten-3">
              <v-img
                alt="thumbnail"
                class="shrink"
                contain
                :src="mux.Util.imageBinary(detailThumbnail)"
                transition="scale-transition"
                style="margin:0px auto; width:100%"
              />
            </v-card>
          </v-col>
          <v-col cols="12" :sm="detailForProduct ? 6 : 4" v-if="detailForProduct">
            <p class="text-h6 font-weight-bold primary--text">기본 정보</p>
            <DataTableComponent
              :headers="product_detail_header"
              :items="productDetails"
              dense
            />
          </v-col>
          <v-col cols="12" :sm="detailForProduct ? 6 : 4">
            <p class="text-h6 font-weight-bold primary--text">재고 정보</p>
            <DataTableComponent
              :headers="stock_detail_header"
              :items="stockDetails"
              dense
            />
          </v-col>
          <v-col cols="12" :sm="detailForProduct ? 6 : 4">
            <p class="text-h6 font-weight-bold primary--text">입고 정보</p>
            <DataTableComponent
              :headers="inbound_detail_header"
              :items="inboundDetails"
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
      mux: mux,
      detailForProduct: false,
      menu: false,
      detail_dialog: false,
      loading_dialog: false,
      detailThumbnail: '',
      productDetails:[],
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
    async detailInfoItem(item, type){
      this.productDetails= [];
      this.stockDetails= [];
      this.inboundDetails= [];

      this.productDetails.push({model:item.model, manufacturer:item.manufacturer, unit_price:item.unit_price })

      const prevURL = window.location.href;
      try {
        this.loading_dialog = true;
        let params;
        let script_file_name;
        let script_file_path;
        if (item.type === '완제품'){
          params = [
            {
              "product_table.product_code": item.item_code
            }
          ];
          script_file_name = "rooting_product_thumbname_검색_24_05_09_12_05_UP0.json";
          script_file_path = "data_storage_pion\\json_sql\\stock\\thumbnail_검색\\product_thumbname_검색_24_05_09_12_06_FHY";
        }else if (item.type === '반제품'){
          params = [
            {
              "module_table.module_code": item.item_code
            }
          ];
          script_file_name = "rooting_module_thumbnail_검색_24_05_09_12_09_X4X.json";
          script_file_path = "data_storage_pion\\json_sql\\stock\\thumbnail_검색\\module_thumbnail_검색_24_05_09_12_10_4PG";
        }else {
          params = [
            {
              "material_table.material_code": item.item_code
            }
          ];
          script_file_name = "rooting_material_thumbnail_검색_24_05_09_12_12_AHK.json";
          script_file_path = "data_storage_pion\\json_sql\\stock\\thumbnail_검색\\material_thumbnail_검색_24_05_09_12_13_SAK";
        }
        // 제품의 썸네일
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: params,
          "script_file_name": script_file_name,
          "script_file_path": script_file_path
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0){
          let thumbnail = '';
          if (result['data'].length > 0){
            thumbnail = result['data'][0].thumbnail;
          }
          this.detailThumbnail = thumbnail;

          // 제품의 입고 정보
          let result2 = await mux.Server.post({
            path: '/api/common_rest_api/',
            params: [
              {
                "inbound_product_table.product_code": item.item_code,
                "inbound_confirmation_table.approval_phase": "승인"
              }
            ],
            "script_file_name": "rooting_입고_상세_검색_24_05_22_10_53_9P7.json",
            "script_file_path": "data_storage_pion\\json_sql\\inbound\\입고_상세_검색_24_05_22_10_54_7AL"
          });
          if (prevURL !== window.location.href) return;

          if (typeof result2 === 'string'){
            result2 = JSON.parse(result2);
          }
          if(result2['code'] == 0){
            let inbounds = [];
            if (result2['data'].length > 0){
              inbounds = result2['data'];
            }
            this.inboundDetails = inbounds;

            this.detail_dialog = true;
            this.stockDetails = item.spot_stock ? JSON.parse(JSON.stringify(item.spot_stock)) : [];
            this.stockDetails.forEach(data => {
              data.stock_num = Number(data.stock_num).toLocaleString();
            });
            this.loading_dialog = false;
          } else {
            this.loading_dialog = false;
            mux.Util.showAlert(result2['failed_info']);
          }
        } else {
          this.loading_dialog = false;
          mux.Util.showAlert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }

      if(type === 'product'){
        this.detailForProduct  = true;
      }else{
        this.detailForProduct  = false;
      }
    },
    closeDetail () {
      this.detail_dialog = false
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
          path: '/api/common_rest_api/',
          "params": [
              {
                "product_table.name": searchName ? searchName : "",
                "product_table.product_code": searchProductCode ? searchProductCode : "",
                "product_table.spec": searchSpec ? searchSpec : ""
              }
          ],
          "script_file_name": "rooting_완제품_검색_24_05_16_13_52_1IN.json",
          "script_file_path": "data_storage_pion\\json_sql\\stock\\10_완제품_검색\\완제품_검색_24_05_16_13_53_MZJ"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0){
          if(result['data'].length === 0){
            mux.Util.showAlert('검색 결과가 없습니다.');
          }
          this.product_data = result['data'];
          this.product_data.forEach(data =>{
            data.item_code = data.code;
            delete data.code;
            let stock_calc = 0;
            if (data.spot_stock){
              for(let d=0; d<data.spot_stock.length; d++){
                if (typeof data.spot_stock[d].stock_num === 'number'){
                  stock_calc += data.spot_stock[d].stock_num;
                }
              }
            }
            data.total_stock = stock_calc



            if(data.belong_data){
              for(let b=0; b<data.belong_data.length; b++){
                data.belong_data[b].item_code = data.belong_data[b].code;
                data.belong_data[b].used_num = data.total_stock * data.belong_data[b].num
                delete data.belong_data[b].code;


                // let total_item_unit_price = 0;
                // data.belong_data[b].unit_price = '₩ '+ Number(data.belong_data[b].unit_price).toLocaleString()
                if(data.belong_data[b].belong_data){
                  for(let c=0; c<data.belong_data[b].belong_data.length; c++){
                    data.belong_data[b].belong_data[c].item_code = data.belong_data[b].belong_data[c].code;
                    data.belong_data[b].belong_data[c].used_num = data.total_stock * data.belong_data[b].used_num * data.belong_data[b].belong_data[c].num
                    delete data.belong_data[b].belong_data[c].code;
                    // total_item_unit_price += data.belong_data[b].belong_data[c].unit_price * data.belong_data[b].belong_data[c].num;
                    data.belong_data[b].belong_data[c].unit_price = '₩ '+ Number(data.belong_data[b].belong_data[c].unit_price).toLocaleString()
                  }
                  // data.belong_data[b].unit_price = '₩ '+ Number(total_item_unit_price).toLocaleString()

                  data.belong_data[b].unit_price = '₩ '+ Number(data.belong_data[b].unit_price).toLocaleString()
                }else{
                  data.belong_data[b].unit_price = '₩ '+ Number(data.belong_data[b].unit_price).toLocaleString()
                }
              }
            }


            if (typeof data.unit_price === 'number'){
              data.item_price = data.unit_price * data.total_stock
              let total_unit_price = 0;
              if(data.belong_data){
                for(let b=0; b<data.belong_data.length; b++){
                  total_unit_price += (data.belong_data[b].unit_price).replace(/,/g,'').replace(/₩ /g,'') * data.belong_data[b].num;
                }
                data.total_stock_price = '₩ '+ Number(data.total_stock * total_unit_price).toLocaleString();
                data.unit_price = '₩ '+ Number(total_unit_price).toLocaleString()
              }else{
                data.unit_price = '₩ '+ Number(data.unit_price).toLocaleString()
              }
            }else {
              data.item_price = 0;
            }


            data.belong_data.push({
              item_code: '총 재료비',
              unit_price: '',
              total_stock: 0,
              stock_price: '',
              num_price: data.unit_price
            })
            // this.total_stock_num += data.total_stock
            // this.total_stock_price += data.item_price
          })
        }else{
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        // console.error(error);
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
      this.loading_dialog = false;
      // this.product_data = ProductSearchPageConfig.test_product_data;
    },
    downloadToExcel(){
      if( this.product_data.length === 0){
        mux.Util.showAlert('다운로드할 데이터가 검색 결과에 없습니다.')
        return;
      }
      let excelHeaders = [];
      this.headers.forEach(data => {
        excelHeaders.push(data)
      })
      excelHeaders.shift();
      excelHeaders.push({ "text": "필요수량", "align": "center", "value": "num" });
      excelHeaders.push({ "text": "금액", "align": "center", "value": "num_price" });
      excelHeaders.push({ "text": "총 재고", "align": "center", "value": "total_stock" });
      excelHeaders.push({ "text": "총 재고금액", "align": "center", "value": "stock_price" });
      excelHeaders.unshift({ "text": "No.", "align": "center", "value": "no" });

      let items = [];
      this.product_data.forEach((data, index) => {
        let total_stock_calc = 0;
        let belong_total_stock_calc = 0;
        for(let i=0; i<data.belong_data.length; i++){
          for(let s=0; s<data.belong_data[i].spot_stock.length; s++){
            total_stock_calc += data.belong_data[i].spot_stock[s].stock_num
          }
          if(data.belong_data[i].belong_data){
            for(let b=0; b<data.belong_data[i].belong_data.length; b++){
              for(let bs=0; bs<data.belong_data[i].belong_data[b].spot_stock.length; bs++){
                belong_total_stock_calc += data.belong_data[i].belong_data[b].spot_stock[bs].stock_num
              }
              data.belong_data[i].belong_data[b].total_stock = Number(belong_total_stock_calc).toLocaleString();
              data.belong_data[i].belong_data[b].stock_price = '₩ '+ Number(belong_total_stock_calc* data.belong_data[i].belong_data[b].unit_price.replace(/,/g,'').replace(/₩ /g,'')).toLocaleString();
              data.belong_data[i].belong_data[b].num_price = '₩ '+ Number(data.belong_data[i].belong_data[b].num* data.belong_data[i].belong_data[b].unit_price.replace(/,/g,'').replace(/₩ /g,'')).toLocaleString();
              data.belong_data[i].belong_data[b].no = (index+1)+'-'+(i+1)+'-'+(b+1)
              belong_total_stock_calc = 0;
            }
          }
          data.belong_data[i].total_stock = Number(total_stock_calc).toLocaleString();
          data.belong_data[i].stock_price = '₩ '+ Number(total_stock_calc* data.belong_data[i].unit_price.replace(/,/g,'').replace(/₩ /g,'')).toLocaleString();
          data.belong_data[i].num_price = '₩ '+ Number(data.belong_data[i].num* data.belong_data[i].unit_price.replace(/,/g,'').replace(/₩ /g,'')).toLocaleString();
          data.belong_data[i].no = (index+1)+'-'+(i+1)
          total_stock_calc = 0;
        }
        data.no = index+1;
        items.push(data)
      })

      items.forEach(data =>{
        data.total_stock = typeof data.total_stock === "number" ? Number(data.total_stock).toLocaleString() : data.total_stock;
        data.stock_price = '₩ '+ Number(data.total_stock.replace(/,/g,'') * data.unit_price.replace(/,/g,'').replace(/₩ /g,'')).toLocaleString();
      })
      mux.Excel.downloadTable(excelHeaders, items, items[0].name+'_엑셀다운로드');
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
