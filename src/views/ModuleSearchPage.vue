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
                  sm="7"
                >
                  <v-chip
                    class="mr-2"
                    color="indigo"
                    text-color="white"
                    small
                  >
                    총 재고 : {{ Number(total_stock_num).toLocaleString() }}
                  </v-chip>
                  <v-chip
                    color="indigo"
                    text-color="white"
                    small
                  >
                    총 금액 : ₩ {{ Number(total_stock_price).toLocaleString() }}
                  </v-chip>
                </v-col>
                <v-col
                  cols="12"
                  sm="5"
                >
                  <v-btn
                    small
                    color="success"
                    class="float-right"
                    @click="downloadToExcel"
                  >엑셀 다운로드</v-btn>
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  cols="12"
                >
                  <DataTableComponent
                    :headers="headers"
                    :items="product_data"
                    :item-key="product_data.item_code"

                    children-key="belong_data"
                    table-style=""
                    stockNumInfo
                    stockPriceInfo
                    itemNumInfoBelong
                    itemPriceInfoBelong
                    show-item-details
                    @itemDetials="detailInfoItem"
                    dense
                  />
                </v-col>
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
      @close="closeDetail"
      >
        <v-row>
          <v-col cols="12" sm="4">
            <p class="text-h6 font-weight-bold primary--text">사진</p>
            <v-card class="pa-1 mt-5" color="grey lighten-3">
              <v-img
                alt="thumbnail"
                class="shrink mr-2"
                contain
                :src="mux.Util.imageBinary(detailThumbnail)"
                transition="scale-transition"
                width="350"
              />
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <p class="text-h6 font-weight-bold primary--text">재고 정보</p>
            <DataTableComponent
              :headers="stock_detail_header"
              :items="stockDetails"
              dense
            />
          </v-col>
          <v-col cols="12" sm="4">
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
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import ModalDialogComponent from "@/components/ModalDialogComponent";
import LoadingModalComponent from "@/components/LoadingModalComponent";
import ModuleSearchPageConfig from "@/configure/ModuleSearchPageConfig.json";
import mux from "@/mux";
import CheckPagePermission from "@/common_js/CheckPagePermission";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=ModuleSearchPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  components: {
                NavComponent,
                DataTableComponent,
                CardComponent,
                InputsFormComponent,
                ModalDialogComponent,
                LoadingModalComponent,
              },
  data(){
    return{
      mux: mux,
      stock_more_0: true,
      total_stock_num:0,
      total_stock_price:0,
      detail_dialog: false,
      loading_dialog: false,
      detailThumbnail: '',
      stockDetails:[],
      inboundDetails:[],
      manufacturer_list:[],
      classification_list:[],

      stock_detail_header:ModuleSearchPageConfig.stock_detail_header,
      inbound_detail_header:ModuleSearchPageConfig.inbound_detail_header,
      searchCardInputs:ModuleSearchPageConfig.searchCardInputs,
      headers:ModuleSearchPageConfig.headers,
      product_data: []
    }
  },


  watch: {
    detail_dialog (val) {
      val || this.closeDetail()
    },
  },

  created () {
    this.initialize()
  },
  methods: {
    async initialize () {
      // this.manufacturer_list = ModuleSearchPageConfig.test_manufacturer_list;
      // this.classification_list = ModuleSearchPageConfig.test_classification_list;
      const prevURL = window.location.href;
      try {
        let result = await mux.Server.getPionBasicInfo();
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }

        this.classification_list = result.classification;
        this.manufacturer_list = result.manufacturer;
        // this.spot_list = result.spot;

      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }
      mux.List.addProductBasicInfoLists(this.searchCardInputs, this.classification_list, this.manufacturer_list, true);
      this.searchCardInputs = JSON.parse(JSON.stringify(this.searchCardInputs));
    },
    // eslint-disable-next-line no-unused-vars
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      // console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },

    async detailInfoItem(item){
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
    },
    closeDetail () {
      this.detail_dialog = false
    },


    async searchButton() {
      this.loading_dialog = true;
      //검색 시 총 재고, 총 금액 초기화
      this.total_stock_num = 0;
      this.total_stock_price = 0;

      let searchClassification = this.searchCardInputs.find(x=>x.label === '분류').value;
      if (searchClassification === 'All')
        searchClassification = '%';
      let searchConditions = this.searchCardInputs.find(x=>x.label === '상태').value;
      if (searchConditions === 'All')
        searchConditions = '';
      let searchModuleCode = this.searchCardInputs.find(x=>x.label === '관리코드').value;
      if (searchModuleCode)
      searchModuleCode = searchModuleCode.trim();

      let searchName = this.searchCardInputs.find(x=>x.label === '제품명').value;
      if (searchName)
      searchName = searchName.trim();

      let searchModel = this.searchCardInputs.find(x=>x.label === '모델명').value;
      if (searchModel)
      searchModel = searchModel.trim();

      let searchSpec = this.searchCardInputs.find(x=>x.label === '사양').value;
      if (searchSpec)
      searchSpec = searchSpec.trim();

      let searchManufacturer = this.searchCardInputs.find(x=>x.label === '제조사').value;
      if (searchManufacturer)
      searchManufacturer = searchManufacturer.trim();

      let searchStockMoreZero = '';

      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          "params": [
                {
                    "module_table.classification": searchClassification ? searchClassification : "",
                    "module_table.manufacturer": searchManufacturer ? searchManufacturer : "",
                    "module_table.model": searchModel ? searchModel : "",
                    "module_table.module_code": searchModuleCode ? searchModuleCode : "",
                    "module_table.name": searchName ? searchName : "",
                    "module_table.spec": searchSpec ? searchSpec : "",
                    // "material_table.classification": "",
                    // "material_table.manufacturer": "",
                    // "material_table.material_code": "",
                    // "material_table.model": "",
                    // "material_table.name": "",
                    // "material_table.spec": "",
                    "stock_table.conditions": searchConditions ? searchConditions : "",
                    "stock_table.stock_num": searchStockMoreZero
                }
            ],
            "script_file_name": "rooting_반제품_검색_24_05_16_13_23_FD4.json",
            "script_file_path": "data_storage_pion\\json_sql\\stock\\6_반제품_검색\\반제품_검색_24_05_16_13_24_YJO"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0){

          if(result['data'].length === 0){
            mux.Util.showAlert('검색 결과가 없습니다.');
          }
          this.product_data = result['data'].filter(data=>(!this.stock_more_0 || (data.spot_stock && data.spot_stock.length > 0 && data.spot_stock.find(x=>x.stock_num > 0)) ));

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
            if (typeof data.unit_price === 'number'){
              // data.item_price = data.unit_price * data.total_stock
              let total_unit_price = 0;
              if(data.belong_data){
                for(let b=0; b<data.belong_data.length; b++){
                  total_unit_price += data.belong_data[b].unit_price * data.belong_data[b].num;
                }
                data.item_price = total_unit_price * data.total_stock
                data.unit_price = '₩ '+ Number(total_unit_price).toLocaleString()
              }else{
                data.item_price = data.unit_price * data.total_stock
                data.unit_price = '₩ '+ Number(data.unit_price).toLocaleString()
              }
            }else {
              data.item_price = 0;
            }

            if(data.belong_data){
              for(let b=0; b<data.belong_data.length; b++){
                data.belong_data[b].item_code = data.belong_data[b].code;
                data.belong_data[b].used_num = data.total_stock * data.belong_data[b].num
                delete data.belong_data[b].code;
                data.belong_data[b].unit_price = '₩ '+ Number(data.belong_data[b].unit_price).toLocaleString()
              }
            }
            this.total_stock_num += data.total_stock
            this.total_stock_price += data.item_price
          })
        }else{
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(result['failed_info'].msg);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
      this.loading_dialog = false;
      // this.product_data = ModuleSearchPageConfig.test_product_data;
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
        for(let i=0; i<data.belong_data.length; i++){
          for(let s=0; s<data.belong_data[i].spot_stock.length; s++){
            total_stock_calc += data.belong_data[i].spot_stock[s].stock_num
          }
          data.belong_data[i].total_stock = Number(total_stock_calc).toLocaleString();
          data.belong_data[i].stock_price = Number(total_stock_calc* data.belong_data[i].unit_price.replace(/,/g,'').replace(/₩ /g,'')).toLocaleString();
          data.belong_data[i].num_price = Number(data.belong_data[i].num* data.belong_data[i].unit_price.replace(/,/g,'').replace(/₩ /g,'')).toLocaleString();
          data.belong_data[i].no = (index+1)+'-'+(i+1)
          total_stock_calc = 0;
        }
        data.no = index+1;
        items.push(data)
      })

      items.forEach(data =>{
        data.total_stock = typeof data.total_stock === "number" ? Number(data.total_stock).toLocaleString() : data.total_stock;
        data.stock_price = '₩ '+Number(data.total_stock.replace(/,/g,'') * data.unit_price.replace(/,/g,'').replace(/₩ /g,'')).toLocaleString();
      })
      mux.Excel.downloadTable(excelHeaders, items, '반제품_엑셀다운로드');
    }
  }
}
</script>
<style lang="">

</style>
