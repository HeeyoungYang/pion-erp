<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :purchaseMenu="true"></NavComponent>

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
            title-class="mb-0 font-weight-black"
            divider-class="mb-3"
          >

            <div slot="cardTitle">
              <span>완제품 자재 선택</span>
              <v-btn
                small
                outlined
                color="primary"
                class="mr-2 ml-4"
                @click="itemSelect"
              >
                개별 자재 선택
              </v-btn>
            </div>
            <InputsFormComponent
              slot="cardText"
              dense
              clearable
              filled
              hide-details
              :inputs="add_data_type === '완제품자재' ? searchProductCardInputs : searchItemsCardInputs"
              @enter="searchProduct"
            >
              <v-col
                cols="6"
                sm="3"
                lg="3"
                align-self="center"
              >
                <v-btn
                  color="primary"
                  elevation="2"
                  @click="searchProduct"
                >
                  <v-icon>mdi-magnify</v-icon>검색
                </v-btn>
              </v-col>
              <v-col
                cols="12"
                sm="12"
              >
                <DataTableComponent
                  :headers="headers"
                  :items="product_data"
                  item-key="item_code"
                  children-key="belong_data"
                  dense
                  tableClass="elevation-0"
                  addToTable
                  addBelongToTable
                  @addDataToTable="addProductData"
                  @addBelongToTable="addBelongData"
                />
              </v-col>
            </InputsFormComponent>
          </CardComponent>

          <v-card
          elevation="1"
          class="mt-5"
          >
            <v-card-text class=" pt-3">
              <v-row>
                <v-col cols="12" sm="9" align-self="center">
                  <MemberSearchDialogComponent
                    :dialog-value="member_dialog"
                    :persistent="true"
                    @close="close"
                    @setMember = "setMember"
                    @members = "members"
                  >
                  </MemberSearchDialogComponent>
                  <v-chip
                    class="mr-2"
                    style="cursor:pointer"
                    v-for="(member, i) in purchase_member_info"
                    :key="i"
                    :color="member.name ? 'success' : 'default'"
                    @click="selectMemberDialog(i)"
                  >
                    {{ member.type }} : {{ member.name }}
                  </v-chip>
                </v-col>
              </v-row>

              <InputsFormComponent
                dense
                clearable
                filled
                hide-details
                :inputs="purchaseInfoInputs"
              >
                <v-col cols="12" sm="2" align-self="center">
                  <v-btn
                    v-if="add_data_type === '개별자재'"
                    small
                    class="mr-2"
                    @click="addItemSetting"
                  >입력 행 +</v-btn>
                  <v-btn
                    small
                   color="success"
                  >
                    요청
                  </v-btn>
                </v-col>
              </InputsFormComponent>
              <v-row>

                <v-col
                  cols="12"
                >
                  <v-data-table
                    v-if="add_data_type === '완제품자재'"
                    :headers="bom_list_purchase_items_headers"
                    :items="bom_list_purchase_data"
                    group-by="product_code"
                    item-key="item_code"
                    dense
                  >
                    <template v-slot:[`group.header`]="{items, isOpen, toggle}">
                      <th colspan="12">
                        <v-icon @click="toggle"
                          >{{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                        </v-icon>
                        {{ items[0].product_code }}
                      </th>
                      <th>
                        <v-icon
                          color="grey"
                          small
                          @click="cancleItem(items[0].product_code, false)"
                        >mdi-minus-thick</v-icon>
                      </th>
                    </template>
                    <template v-slot:[`item.purchase_num`] = "{ item }">
                      <v-text-field
                        dense
                        hide-details
                        v-model="item.purchase_num"
                        style="width:100px;font-size: 0.775rem !important;"
                        filled
                      ></v-text-field>
                    </template>
                    <template v-slot:[`item.estimate`] = "{ item }">
                      <div  style="min-width: 160px;">
                        <v-checkbox
                          label="미선택"
                          color="primary"
                          hide-details
                          class="float-left mr-3 mt-0 pt-0"
                          v-model="item.estimate"
                        ></v-checkbox>
                        <v-btn
                          color="primary"
                          class="float-left"
                          x-small
                          elevation="0"
                          @click="estiamteDialog"
                        >
                          견적서
                        </v-btn>
                      </div>
                    </template>
                    <template v-slot:[`item.cancle`] = "{ item }">
                      <v-icon
                        color="grey"
                        small
                        @click="cancleItem(item.product_code, item.item_code)"
                      >mdi-minus-thick</v-icon>
                    </template>
                  </v-data-table>

                  <v-data-table
                    v-if="add_data_type !== '완제품자재'"
                    dense
                    :headers="bom_list_purchase_items_headers"
                    :items="bom_list_purchase_items_data"
                    hide-default-footer
                    disable-pagination
                    item-key="product_code"
                    class="elevation-1"
                  >
                    <template v-slot:item="{ item }">
                      <tr>
                        <td align="center">
                          <v-autocomplete
                            v-if="item.data_type === 'added'"
                            style="width:150px; font-size: 12px;"
                            v-model="item.type"
                            :items="type_list"
                            dense
                            filled
                            hide-details
                          ></v-autocomplete>
                          {{ item.data_type === 'selected' ? item.type : '' }}
                        </td>
                        <td align="center">
                          <v-autocomplete
                            v-if="item.data_type === 'added'"
                            style="width:150px; font-size: 12px;"
                            v-model="item.classification"
                            :items="classification_list.slice(1)"
                            dense
                            filled
                            hide-details
                          ></v-autocomplete>
                          {{ item.data_type === 'selected' ? item.classification : '' }}
                        </td>
                        <td align="center">
                          <v-text-field
                            v-if="item.data_type === 'added'"
                            style="width:150px; font-size: 12px;"
                            dense
                            hide-details
                            filled
                            v-model="item.product_code"
                          >
                          </v-text-field>
                          {{ item.data_type === 'selected' ? item.product_code : '' }}
                        </td>
                        <td align="center">
                          <v-text-field
                            v-if="item.data_type === 'added'"
                            style="width:150px; font-size: 12px;"
                            dense
                            hide-details
                            filled
                            v-model="item.name"
                          >
                          </v-text-field>
                          {{ item.data_type === 'selected' ? item.name : '' }}
                        </td>
                        <td align="center">
                          <v-text-field
                            v-if="item.data_type === 'added'"
                            style="width:150px; font-size: 12px;"
                            dense
                            hide-details
                            filled
                            v-model="item.model"
                          >
                          </v-text-field>
                          {{ item.data_type === 'selected' ? item.model : '' }}
                        </td>
                        <td align="center">
                          <v-text-field
                            v-if="item.data_type === 'added'"
                            style="width:150px; font-size: 12px;"
                            dense
                            hide-details
                            filled
                            v-model="item.spec"
                          >
                          </v-text-field>
                          {{ item.data_type === 'selected' ? item.spec : '' }}
                        </td>
                        <td align="center">
                          <v-autocomplete
                            v-if="item.data_type === 'added'"
                            style="width:150px; font-size: 12px;"
                            v-model="item.manufacturer"
                            :items="manufacturer_list"
                            dense
                            hide-details
                            filled
                          ></v-autocomplete>
                          {{ item.data_type === 'selected' ? item.manufacturer : '' }}
                        </td>
                        <td align="center">
                          <v-text-field
                            v-if="item.data_type === 'added'"
                            style="width:150px; font-size: 12px;"
                            dense
                            hide-details
                            filled
                            v-model="item.unit_price"
                            :oninput="!item.unit_price ? '' : item.unit_price = item.unit_price.replace(/^0+|\D+/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')"
                          >
                          </v-text-field>
                          {{ item.data_type === 'selected' ? item.unit_price : '' }}
                        </td>
                        <td align="center"></td>

                        <td align="center">{{ item.stock_num }}</td>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            filled
                            v-model="item.purchase_num"
                            style="width:150px; font-size: 12px;"
                            @keyup="calcUnitPrice(item)"
                            :oninput="!item.purchase_num ? '' : item.purchase_num = item.purchase_num.replace(/^0+|\D+/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">
                          <div  style="min-width: 160px;">
                            <v-checkbox
                              label="미선택"
                              color="primary"
                              hide-details
                              class="float-left mr-3 mt-0 pt-0"
                              v-model="item.estimate"
                            ></v-checkbox>
                            <v-btn
                              color="primary"
                              class="float-left"
                              x-small
                              elevation="0"
                              @click="estiamteDialog"
                            >
                              견적서
                            </v-btn>
                          </div>
                        </td>
                        <td align="center">
                          <v-icon small color="default" style="cursor:pointer" @click="deleteInboundDataRow(index)">mdi-minus-thick</v-icon>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
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

      <v-dialog
        v-model="unestimatedMailDialog"
        persistent
        max-width="1000px"
      >
        <v-stepper v-model="unestimated_steppers">
          <v-stepper-header>
            <template v-for="n in unestimated_step">
              <v-stepper-step
                :key="`${n}-step`"
                :complete="unestimated_steppers > n"
                :step="n"
                editable
              >
                {{ n ===  1 ? '관련 자재 선택' : '견적 등록'}}
              </v-stepper-step>

              <v-divider
                v-if="n !== unestimated_step"
                :key="n"
              ></v-divider>
            </template>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content
              v-for="n in unestimated_step"
              :key="`${n}-content`"
              :step="n"
            >
              <div v-if="n === 1">
                <v-row>
                  <v-col cols="12">
                    <DataTableComponent
                      v-model="selected_unestimated_data"
                      :headers="bom_list_purchase_items_headers"
                      :items="bom_list_purchase_data"
                      table-class="elevation-0"
                      item-key="product_code"
                      show-select
                      dense
                    />
                  </v-col>
                </v-row>
                <v-btn
                  color="primary"
                  @click="unestimated_steppers = 2"
                >
                  다음 ▶
                </v-btn>

                <v-btn text color="error">
                  취소
                </v-btn>
              </div>
              <div v-if="n === 2">
                <v-card class="elevation-0">
                  <v-card-text class="pb-0">
                    <v-row>
                      <v-col cols="12">
                        <v-btn
                          x-small
                          color="primary"
                          @click="!show_selected_unestimated_data ? show_selected_unestimated_data = true :  show_selected_unestimated_data = false"
                        >관련 자재</v-btn>
                      </v-col>
                      <v-col cols="12" v-if="show_selected_unestimated_data">
                        <v-data-table
                        style="border:1px solid #c0c0c0"
                          :headers="purchase_detail_headers"
                          :items="selected_unestimated_data"
                          item-key="product_code"
                          dense
                        ></v-data-table>
                      </v-col>
                      <v-col cols="12" v-if="tab_search === 0">
                        <v-radio-group
                          v-model="unestimated_request"
                          row
                        >
                          <v-radio
                            label="메일 발송"
                            value="mailed"
                          ></v-radio>
                          <v-radio
                            label="요청 완료"
                            value="requested"
                          ></v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <v-divider v-if="tab_search === 0"></v-divider>
                <CardComponent
                  title-class="d-none"
                  class="elevation-0"
                >
                  <InputsFormComponent
                    slot="cardText"
                    dense
                    clearable
                    filled
                    hide-details
                    :inputs="estimateInfoInputs"
                  />
                </CardComponent>

                <v-card class="elevation-0">
                  <v-card-text>
                    <v-btn
                      color="primary"
                      @click="unestimated_steppers = 1"
                    >
                      ◀ 이전
                    </v-btn>
                    <v-btn
                      color="success"
                      @click="unestimatedMailDialog = false"
                    >
                      저장
                    </v-btn>

                    <v-btn
                      text
                      color="error"
                      @click="unestimatedMailDialog = false"
                    >
                      취소
                    </v-btn>

                  </v-card-text>
                </v-card>
              </div>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-dialog>
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
import MemberSearchDialogComponent from "@/components/MemberSearchDialogComponent";
import PurchasePageConfig from "@/configure/PurchasePageConfig.json";
import mux from "@/mux";
import CheckPagePermission from "@/common_js/CheckPagePermission";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=StockSearchPage')],
  mounted(){
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
    // this.closeAll()
  },
  components: {
                NavComponent,
                DataTableComponent,
                CardComponent,
                InputsFormComponent,
                ModalDialogComponent,
                LoadingModalComponent,
                MemberSearchDialogComponent,
              },
  data(){
    return{
      mux: mux,
      unestimated_steppers: 1,
      unestimated_step: 2,
      add_data_type: '완제품자재',
      detail_dialog: false,
      loading_dialog: false,
      member_dialog: false,
      unestimatedMailDialog: false,
      show_selected_unestimated_data: false,
      member_type_index:0,
      detailThumbnail: '',
      manufacturer_list:[],
      classification_list:[],
      stockDetails:[],
      inboundDetails:[],
      selected_product_data:[],
      members_list:[],
      stock_detail_header:PurchasePageConfig.stock_detail_header,
      inbound_detail_header:PurchasePageConfig.inbound_detail_header,
      searchProductCardInputs:PurchasePageConfig.searchProductCardInputs,
      searchItemsCardInputs:PurchasePageConfig.searchItemsCardInputs,
      estimateInfoInputs:PurchasePageConfig.estimateInfoInputs,
      purchaseInfoInputs:PurchasePageConfig.purchaseInfoInputs,
      headers:PurchasePageConfig.headers,
      bom_list_purchase_product_headers:PurchasePageConfig.bom_list_purchase_product_headers,
      bom_list_purchase_items_headers:PurchasePageConfig.bom_list_purchase_items_headers,

      // bom_list_purchase_data:PurchasePageConfig.bom_list_purchase_test_data,
      bom_list_purchase_data:[],
      bom_list_purchase_items_data:PurchasePageConfig.bom_list_purchase_items_test_data,
      purchase_member_info:PurchasePageConfig.purchase_member_info,
      setPurchaseInputs:PurchasePageConfig.setPurchaseInputs,
      product_data:[],
      // product_data:PurchasePageConfig.test_product_data,
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
      // this.manufacturer_list = PurchasePageConfig.test_manufacturer_list;
      // this.classification_list = PurchasePageConfig.test_classification_list;
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


      try {
        if (prevURL !== window.location.href) return;
        this.purchase_member_info[0].name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.purchase_member_info[0].email =  this.$cookies.get(this.$configJson.cookies.email.key);
        this.purchase_member_info[0].user_id =  this.$cookies.get(this.$configJson.cookies.id.key);
        this.login_id =  this.$cookies.get(this.$configJson.cookies.id.key);
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }

      mux.List.addProductBasicInfoLists(this.searchItemsCardInputs, this.classification_list, this.manufacturer_list, true);
      this.searchProductCardInputs = JSON.parse(JSON.stringify(this.searchProductCardInputs));
      this.searchItemsCardInputs = JSON.parse(JSON.stringify(this.searchItemsCardInputs));
    },
    // eslint-disable-next-line no-unused-vars
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      // console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },

    close(){
      this.member_dialog = false;
    },
    selectMemberDialog(idx){
      this.member_type_index = idx
      this.member_dialog = true;
    },
    setMember(item){
      this.purchase_member_info[this.member_type_index].name = item.name.trim()
      this.purchase_member_info[this.member_type_index].user_id = item.user_id
      this.close();
    },
    members(data){
      this.members_list=data;
    },
    async searchProduct() {
      this.loading_dialog = true;

      let searchProductCode = this.searchProductCardInputs.find(x=>x.label === '제품코드').value;
      if (!searchProductCode)
        searchProductCode = '%';
      let searchName = this.searchProductCardInputs.find(x=>x.label === '제품명').value;
      if (searchName)
        searchName = searchName.trim();
      let searchSpec = this.searchProductCardInputs.find(x=>x.label === '사양').value;
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

                let belong_stock_calc = 0;
                if (data.belong_data[b].spot_stock){
                  let spot_stock = data.belong_data[b].spot_stock;
                  for(let d=0; d<spot_stock.length; d++){
                    if (typeof spot_stock[d].stock_num === 'number'){
                      belong_stock_calc += spot_stock[d].stock_num;
                    }
                  }
                }
                data.belong_data[b].total_stock = belong_stock_calc
                data.belong_data[b].unit_price = '₩ '+ Number(data.belong_data[b].unit_price).toLocaleString()
              }
              console.log(JSON.stringify(data.belong_data) )
              data.belong_data.sort((a, b) => a.item_code.localeCompare(b.item_code));
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


            // data.belong_data.push({
            //   item_code: '총 재료비',
            //   unit_price: '',
            //   total_stock: 0,
            //   stock_price: '',
            //   num_price: data.unit_price
            // })
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
    addProductData(item){
      if(item.belong_data){
        item.belong_data.forEach(data => {
          data.product_code = item.item_code;
        })
        this.bom_list_purchase_data = this.bom_list_purchase_data.filter(param => param.product_code != item.item_code);
        this.bom_list_purchase_data.push(...item.belong_data);
      }
    },
    addBelongData(item, idx){
      if(this.bom_list_purchase_data.length === 0){
        item.belong_data[idx].product_code = item.item_code;
        this.bom_list_purchase_data.push(item.belong_data[idx]);
      }else{
        let add_data = {};
        for(let i=0; i<this.bom_list_purchase_data.length; i++){
          if(this.bom_list_purchase_data[i].product_code === item.item_code && this.bom_list_purchase_data[i].item_code === item.belong_data[idx].item_code){
            mux.Util.showAlert('이미 추가된 제품입니다.');
            return;
          }else{
            item.belong_data[idx].product_code = item.item_code;
            add_data=item.belong_data[idx];
          }
        }
        this.bom_list_purchase_data.push(add_data);
      }

      // this.bom_list_purchase_data.push(item);
    },
    cancleItem(product_code, item_code){
      if(item_code === false){
        this.bom_list_purchase_data = this.bom_list_purchase_data.filter(param => param.product_code != product_code);
      }else{
        this.bom_list_purchase_data.forEach((data, index) => {
          if(data.product_code === product_code && data.item_code === item_code){
            this.bom_list_purchase_data.splice(index, 1);
          }
        })
      }
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

      let searchType = this.searchCardInputs.find(x=>x.label === '종류').value;
      if (searchType === 'All')
        searchType = '%';
      let searchClassification = this.searchCardInputs.find(x=>x.label === '분류').value;
      if (searchClassification === 'All')
        searchClassification = '%';
      let searchConditions = this.searchCardInputs.find(x=>x.label === '상태').value;
      if (searchConditions === 'All')
        searchConditions = '%';
      let searchProductCode = this.searchCardInputs.find(x=>x.label === '관리코드').value;
      if (searchProductCode)
      searchProductCode = searchProductCode.trim();

      let searchProductName = this.searchCardInputs.find(x=>x.label === '제품명').value;
      if (searchProductName)
      searchProductName = searchProductName.trim();

      let searchModelName = this.searchCardInputs.find(x=>x.label === '모델명').value;
      if (searchModelName)
      searchModelName = searchModelName.trim();

      let searchProductSpec = this.searchCardInputs.find(x=>x.label === '사양').value;
      if (searchProductSpec)
      searchProductSpec = searchProductSpec.trim();

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
              "product_table.model": searchModelName ? searchModelName : "",
              "product_table.name": searchProductName ? searchProductName : "",
              "product_table.product_code": searchProductCode ? searchProductCode : "",
              "product_table.spec": searchProductSpec ? searchProductSpec : "",
              "product_table.type": searchType ? searchType : "",

              "module_table.classification": searchClassification ? searchClassification : "",
              "module_table.manufacturer": searchManufacturer ? searchManufacturer : "",
              "module_table.model": searchModelName ? searchModelName : "",
              "module_table.name": searchProductName ? searchProductName : "",
              "module_table.module_code": searchProductCode ? searchProductCode : "",
              "module_table.spec": searchProductSpec ? searchProductSpec : "",
              "module_table.type": searchType ? searchType : "",

              "material_table.classification": searchClassification ? searchClassification : "",
              "material_table.manufacturer": searchManufacturer ? searchManufacturer : "",
              "material_table.model": searchModelName ? searchModelName : "",
              "material_table.name": searchProductName ? searchProductName : "",
              "material_table.material_code": searchProductCode ? searchProductCode : "",
              "material_table.spec": searchProductSpec ? searchProductSpec : "",
              "material_table.type": searchType ? searchType : "",
              "material_table.directly_written": 0,

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
            mux.Util.showAlert('검색 결과가 없습니다.');
          }

          let product_data_arr = [];
          // result.forEach(data => {
          //   let isExist = false;
          //   if (!this.stock_more_0 || (data.stock_num && data.stock_num > 0)){
          //     for (let i = 0; i < product_data_arr.length; i++) {
          //       if (product_data_arr[i]._code === data._code) {
          //         if (data.stock_num){
          //           if (product_data_arr[i].spot_stock !== undefined){
          //             product_data_arr[i].spot_stock.push({product_code: data._code, spot: data.spot, stock_num: data.stock_num, conditions: data.conditions, stock_price: Math.round(data.unit_price * data.stock_num)});
          //           }else {
          //             product_data_arr[i].spot_stock = [{product_code: data._code, spot: data.spot, stock_num: data.stock_num, conditions: data.conditions, stock_price: Math.round(data.unit_price * data.stock_num)}];
          //           }
          //         }
          //         isExist = true;
          //         break;
          //       }
          //     }
          //     if (!isExist) {
          //       if (data.stock_num){
          //         data.spot_stock = [{product_code: data._code, spot: data.spot, stock_num: data.stock_num, conditions: data.conditions, stock_price: Math.round(data.unit_price * data.stock_num)}];
          //       }
          //       product_data_arr.push(data);
          //     }
          //   }
          // });
          this.product_data = product_data_arr;
          // this.product_data = PurchasePageConfig.test_product_data;

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
          })
        } else {
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
      this.loading_dialog = false;
    },
    async itemSelect(){
      this.selected_product_data = [];
      this.product_data = [];
      if(this.add_data_type == '완제품자재'){
        const confirm = await mux.Util.showConfirm('개별 자재 선택으로 전환되며, \n위에서 선택한 자재는 선택 해제됩니다. ', '전환 확인');
        if (!confirm){
          return;
        }
        this.bom_list_purchase_data = [];
      }
      this.add_data_type = '개별자재';
    },
    estiamteDialog(){
      this.unestimatedMailDialog = true;
    },
    addItemSetting(){
      this.bom_list_purchase_items_data.push(
        {
          "type":"",
          "classification":"",
          "item_code":"",
          "name":"",
          "model":"",
          "spec":"",
          "manufacturer":"",
          "unit_price":"",
          "purchase_num": "",
          "item_num": "",
          "stock_num":"",
          "estimate":"",
          "data_type": "added"
        }
      )
    }
  }
}
</script>
<style lang="">

</style>
