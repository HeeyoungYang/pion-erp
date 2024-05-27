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
                    :item-key="product_data.material_code"
                    dense
                    stockNumInfo
                    stockPriceInfo
                    show-item-details
                    @itemDetials="detailInfoItem"
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
                class="shrink"
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
              hide-default-footer
              disable-pagination
              dense
            />
          </v-col>
          <v-col cols="12" sm="4">
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
import DataTableComponent from "@/components/DataTableComponent";
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import ModalDialogComponent from "@/components/ModalDialogComponent";
import LoadingModalComponent from "@/components/LoadingModalComponent";
import MaterialSearchPageConfig from "@/configure/MaterialSearchPageConfig.json";
import mux from "@/mux";
import CheckPagePermission from "@/common_js/CheckPagePermission";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=MaterialSearchPage')],
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
      manufacturer_list:[],
      classification_list:[],
      stockDetails:[],
      inboundDetails:[],

      stock_detail_header:MaterialSearchPageConfig.stock_detail_header,
      inbound_detail_header:MaterialSearchPageConfig.stock_detail_header,
      searchCardInputs:MaterialSearchPageConfig.searchCardInputs,
      headers:MaterialSearchPageConfig.headers,
      product_data:[],
    }
  },

  computed: {
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
      // this.manufacturer_list = MaterialSearchPageConfig.test_manufacturer_list;
      // this.classification_list = MaterialSearchPageConfig.test_classification_list;
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
        alert(error);
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
              "product_table.product_code": item._code
            }
          ];
          script_file_name = "rooting_product_thumbname_검색_24_05_09_12_05_UP0.json";
          script_file_path = "data_storage_pion\\json_sql\\stock\\thumbnail_검색\\product_thumbname_검색_24_05_09_12_06_FHY";
        }else if (item.type === '반제품'){
          params = [
            {
              "module_table.module_code": item._code
            }
          ];
          script_file_name = "rooting_module_thumbnail_검색_24_05_09_12_09_X4X.json";
          script_file_path = "data_storage_pion\\json_sql\\stock\\thumbnail_검색\\module_thumbnail_검색_24_05_09_12_10_4PG";
        }else {
          params = [
            {
              "material_table.material_code": item._code
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
                "inbound_product_table.product_code": item._code,
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
            this.stockDetails = JSON.parse(JSON.stringify(item.spot_stock));
            this.stockDetails.forEach(data => {
              data.stock_num = Number(data.stock_num).toLocaleString();
            });
            this.loading_dialog = false;
          } else {
            this.loading_dialog = false;
            alert(result2['failed_info']);
          }
        } else {
          this.loading_dialog = false;
          alert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          alert(error.response['data']['failed_info'].msg);
        else
          alert(error);
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
      let searchMaterialCode = this.searchCardInputs.find(x=>x.label === '관리코드').value;
      if (searchMaterialCode)
      searchMaterialCode = searchMaterialCode.trim();

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
          params: [
            {
              "product_table.classification": searchClassification ? searchClassification : "",
              "product_table.manufacturer": searchManufacturer ? searchManufacturer : "",
              "product_table.model": searchModel ? searchModel : "",
              "product_table.name": searchName ? searchName : "",
              "product_table.product_code": searchMaterialCode ? searchMaterialCode : "",
              "product_table.spec": searchSpec ? searchSpec : "",
              "product_table.type": "원부자재",
              "module_table.classification": searchClassification ? searchClassification : "",
              "module_table.manufacturer": searchManufacturer ? searchManufacturer : "",
              "module_table.model": searchModel ? searchModel : "",
              "module_table.name": searchName ? searchName : "",
              "module_table.module_code": searchMaterialCode ? searchMaterialCode : "",
              "module_table.spec": searchSpec ? searchSpec : "",
              "module_table.type": "원부자재",
              "material_table.classification": searchClassification ? searchClassification : "",
              "material_table.manufacturer": searchManufacturer ? searchManufacturer : "",
              "material_table.model": searchModel ? searchModel : "",
              "material_table.name": searchName ? searchName : "",
              "material_table.material_code": searchMaterialCode ? searchMaterialCode : "",
              "material_table.spec": searchSpec ? searchSpec : "",
              "material_table.type": "원부자재",

              "stock_table.conditions": searchConditions ? searchConditions : "",
              "stock_table.stock_num": searchStockMoreZero
            }
          ],
          "script_file_name": "rooting_재고_검색_24_05_07_11_46_16P.json",
          "script_file_path": "data_storage_pion\\json_sql\\stock\\1_재고검색\\재고_검색_24_05_07_11_46_H8D"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0){
          result = result['data'].map(a => {
            if (!a.stock_num){
              a.stock_price = 0;
            }else {
              a.stock_price = Math.round(a.unit_price * a.stock_num)
            }
            return a;
          });

          if(result.length === 0){
            alert('검색 결과가 없습니다.');
          }
          let product_data_arr = [];
          result.forEach(data => {
            let isExist = false;
            if (!this.stock_more_0 || (data.stock_num && data.stock_num > 0)){
              for (let i = 0; i < product_data_arr.length; i++) {
                if (product_data_arr[i]._code === data._code) {
                  if (data.stock_num){
                    if (product_data_arr[i].spot_stock !== undefined){
                      product_data_arr[i].spot_stock.push({product_code: data._code, spot: data.spot, stock_num: data.stock_num, conditions: data.conditions, stock_price: Math.round(data.unit_price * data.stock_num)});
                    }else {
                      product_data_arr[i].spot_stock = [{product_code: data._code, spot: data.spot, stock_num: data.stock_num, conditions: data.conditions, stock_price: Math.round(data.unit_price * data.stock_num)}];
                    }
                  }
                  isExist = true;
                  break;
                }
              }
              if (!isExist) {
                if (data.stock_num){
                  data.spot_stock = [{product_code: data._code, spot: data.spot, stock_num: data.stock_num, conditions: data.conditions, stock_price: Math.round(data.unit_price * data.stock_num)}];
                }
                product_data_arr.push(data);
              }
            }
          });
          this.product_data = product_data_arr;

          this.product_data.forEach(data =>{
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
              data.unit_price = '₩ '+ Number(data.unit_price).toLocaleString()
            }else {
              data.item_price = 0;
            }
            this.total_stock_num += data.total_stock
            this.total_stock_price += data.item_price
          })
        } else {
          alert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          alert(error.response['data']['failed_info'].msg);
        else
          alert(error);
      }
      this.loading_dialog = false;
      // this.product_data = MaterialSearchPageConfig.test_product_data;
    },
    downloadToExcel(){
      if( this.product_data.length === 0){
        alert('다운로드할 데이터가 검색 결과에 없습니다.')
        return;
      }
      let excelHeaders = [];
      this.headers.forEach(data => {
        excelHeaders.push(data)
      })
      excelHeaders.push({ "text": "총 재고", "align": "center", "value": "stock_num" });
      excelHeaders.push({ "text": "총 재고금액", "align": "center", "value": "stock_price" })
      excelHeaders.unshift({ "text": "No.", "align": "center", "value": "no" });

      let items = [];
      this.product_data.forEach((data, index) => {
        data.no = index+1;
        data.stock_num = typeof data.stock_num === "number" ? Number(data.stock_num).toLocaleString() : data.stock_num;
        data.stock_price = typeof data.stock_price === "number" ? '₩ '+ Number(data.stock_price).toLocaleString() : data.stock_price;
        items.push(data)
      });
      // this.product_data.forEach(data => {
      //   items.push(data)
      // })
      mux.Excel.downloadTable(excelHeaders, items, '원부자재_엑셀다운로드');
    }
  },
}
</script>
<style lang="">

</style>
