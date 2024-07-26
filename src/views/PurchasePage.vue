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
              <span>{{ add_data_type === '완제품자재' ? '완제품 자재' : '개별 자재'}} 선택</span>
              <v-btn
                v-if="add_data_type === '완제품자재'"
                small
                outlined
                color="primary"
                class="mr-2 ml-4"
                @click="itemSelect"
              >
                개별 자재 선택
              </v-btn>
              <v-btn
                v-if="add_data_type === '개별자재'"
                small
                outlined
                color="primary"
                class="mr-2 ml-4"
                @click="itemSelect"
              >
                완제품 자재 선택
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
                <v-btn
                  v-if="add_data_type === '개별자재'"
                  color="default"
                  elevation="2"
                  class="ml-2"
                  @click="addItems"
                >
                  추가
                </v-btn>
              </v-col>
              <v-col
                cols="12"
                sm="12"
              >
                <DataTableComponent
                  v-if="add_data_type === '완제품자재'"
                  :headers="headers"
                  :items="product_data"
                  item-key="item_id"
                  children-key="belong_data"
                  dense
                  tableClass="elevation-0"
                  addToTable
                  addBelongToTable
                  @addDataToTable="addProductData"
                  @addBelongToTable="addBelongData"
                />
                <v-data-table
                  v-else
                  class="elevation-1"
                  dense
                  v-model="selected_item_data"
                  :headers="item_headers"
                  :items="product_data"
                  item-key="item_code"
                  show-select
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
                  <v-autocomplete
                    v-model="select_purchase_manager"
                    :items="purchasers"
                    label="구매 담당자"
                    dense
                    clearable
                    hide-details
                    style="width:200px"
                  ></v-autocomplete>
                  <!-- <MemberSearchDialogComponent
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
                  </v-chip> -->
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
                   @click="purchaseApprovalRequest"
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
                    :headers="bom_list_purchase_product_headers"
                    :items="bom_list_purchase_data"
                    item-key="item_id"
                    group-by="product_code"
                    dense
                  >
                    <template v-slot:[`group.header`]="{items, isOpen, toggle}">
                      <th colspan="13">
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
                        :oninput="!item.purchase_num ? 0 : item.purchase_num = item.purchase_num.replace(/^0+|\D+/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')"
                      ></v-text-field>
                    </template>
                    <template v-slot:[`item.purchase_price`] = "{ item }">
                        {{  calcTotal(item) }}
                    </template>
                    <template v-slot:[`item.estimate`] = "{ item }">
                      <div  style="min-width: 160px;">
                        <v-checkbox
                          label="미선택"
                          color="primary"
                          hide-details
                          class="float-left mr-3 mt-0 pt-0"
                          v-model="item.purchase_estimate_check"
                          @click="clickDontSelect(item.item_id)"
                        ></v-checkbox>
                        <v-btn
                          :color="item.purchase_estimate_company === '' ?'grey' : 'primary' "
                          :class="item.purchase_estimate_company === '' ? 'float-left white--text':'float-left mr-3'"
                          x-small
                          elevation="0"
                          @click="estimateDialog(item)"
                        >
                          견적서
                        </v-btn>


                        <v-menu
                          v-if="item.purchase_estimate_company !== ''"
                          open-on-hover
                          top
                          offset-y
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-chip
                              v-bind="attrs"
                              v-on="on"
                              small
                              class="primary--text mb-0 float-left"
                            >{{ item.purchase_estimate_company }}
                            </v-chip>
                          </template>

                          <v-list>
                            <v-list-item>
                              <v-list-item-content>
                                <v-img
                                  alt="thumbnail"
                                  class="shrink mr-2"
                                  contain
                                  :src="item.purchase_estimate_thumbnail_img"
                                  transition="scale-transition"
                                  width="600"
                                />
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-menu>
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
                    item-key="item_code"
                    class="elevation-1"
                  >
                    <template v-slot:item="{ item }">
                      <tr>
                        <td align="center">
                          {{ item.data_type === 'selected' ? item.type : '' }}
                          <v-autocomplete
                            v-if="item.data_type === 'added'"
                            style="width:150px; font-size: 12px;"
                            v-model="item.type"
                            :items="type_list"
                            dense
                            filled
                            hide-details
                          ></v-autocomplete>
                        </td>
                        <td align="center">
                          {{ item.data_type === 'selected' ? item.classification : '' }}
                          <v-autocomplete
                            v-if="item.data_type === 'added'"
                            style="width:150px; font-size: 12px;"
                            v-model="item.classification"
                            :items="classification_list.slice(1)"
                            dense
                            filled
                            hide-details
                          ></v-autocomplete>
                        </td>
                        <td align="center">
                          {{ item.item_code }}
                        </td>
                        <td align="center">
                          {{ item.data_type === 'selected' ? item.name : '' }}
                          <v-text-field
                            v-if="item.data_type === 'added'"
                            style="width:150px; font-size: 12px;"
                            dense
                            hide-details
                            filled
                            v-model="item.name"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">
                          {{ item.data_type === 'selected' ? item.model : '' }}
                          <v-text-field
                            v-if="item.data_type === 'added'"
                            style="width:150px; font-size: 12px;"
                            dense
                            hide-details
                            filled
                            v-model="item.model"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">
                          {{ item.data_type === 'selected' ? item.spec : '' }}
                          <v-text-field
                            v-if="item.data_type === 'added'"
                            style="width:150px; font-size: 12px;"
                            dense
                            hide-details
                            filled
                            v-model="item.spec"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">
                          {{ item.data_type === 'selected' ? item.manufacturer : '' }}
                          <v-autocomplete
                            v-if="item.data_type === 'added'"
                            style="width:150px; font-size: 12px;"
                            v-model="item.manufacturer"
                            :items="manufacturer_list"
                            dense
                            hide-details
                            filled
                          ></v-autocomplete>
                        </td>
                        <td align="center">
                          {{ item.data_type === 'selected' ? item.unit_price : '' }}
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
                        </td>
                        <td align="center">{{ item.usable_num }}</td>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            v-model="item.purchase_num"
                            style="width:100px;font-size: 0.775rem !important;"
                            filled
                            :oninput="!item.purchase_num ? 0 : item.purchase_num = item.purchase_num.replace(/^0+|\D+/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')"
                          ></v-text-field>
                        </td>
                        <td align="center">{{  calcTotal(item) }}</td>
                        <td align="center">
                          <div  style="min-width: 160px;">
                            <v-checkbox
                              label="미선택"
                              color="primary"
                              hide-details
                              class="float-left mr-3 mt-0 pt-0"
                              v-model="item.purchase_estimate_check"
                              @click="clickDontSelect(item.item_code)"
                            ></v-checkbox>
                            <v-btn
                              :color="item.purchase_estimate_company === '' ?'grey' : 'primary' "
                              :class="item.purchase_estimate_company === '' ? 'float-left white--text':'float-left mr-3'"
                              x-small
                              elevation="0"
                              @click="estimateDialog(item)"
                            >
                              견적서
                            </v-btn>
                            <v-menu
                              v-if="item.purchase_estimate_company !== ''"
                              open-on-hover
                              top
                              offset-y
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-chip
                                  v-bind="attrs"
                                  v-on="on"
                                  small
                                  class="primary--text mb-0 float-left"
                                >{{ item.purchase_estimate_company }}
                                </v-chip>
                              </template>

                              <v-list>
                                <v-list-item>
                                  <v-list-item-content>
                                    <v-img
                                      alt="thumbnail"
                                      class="shrink mr-2"
                                      contain
                                      :src="item.purchase_estimate_thumbnail_img"
                                      transition="scale-transition"
                                      width="600"
                                    />
                                  </v-list-item-content>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </div>
                        </td>
                        <td align="center">
                          <v-icon
                            color="grey"
                            small
                            @click="cancleItem(false, item.item_code)"
                          >mdi-minus-thick
                          </v-icon>
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
                      :headers="selected_unestimated_headers"
                      :items="bom_list_need_estiamte_data"
                      :item-key="add_data_type === '완제품자재' ? 'item_id' : 'item_code'"
                      table-class="elevation-0"
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

                <v-btn
                  text color="error"
                  @click="close"
                >
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
                          :headers="selected_unestimated_headers"
                          :items="selected_unestimated_data"
                          :item-key="add_data_type === '완제품자재' ? 'item_id' : 'item_code'"
                          dense
                        ></v-data-table>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <CardComponent
                  title-class="d-none"
                  class="elevation-0"
                >
                  <div slot="cardText">
                    <v-form
                      ref="estimateForm"
                    >
                      <InputsFormComponent
                        dense
                        clearable
                        filled
                        hide-details
                        :inputs="estimateInfoInputs"
                      ></InputsFormComponent>
                    </v-form>
                  </div>
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
                      @click="savePurchaseEstimate"
                    >
                      저장
                    </v-btn>

                    <v-btn
                      text
                      color="error"
                      @click="close"
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
import LoadingModalComponent from "@/components/LoadingModalComponent";
// import MemberSearchDialogComponent from "@/components/MemberSearchDialogComponent";
import PurchasePageConfig from "@/configure/PurchasePageConfig.json";
import mux from "@/mux";
import CheckPagePermission from "@/common_js/CheckPagePermission";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=PurchasePage')],
  mounted(){
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
    // this.closeAll()
  },
  components: {
                NavComponent,
                DataTableComponent,
                CardComponent,
                InputsFormComponent,
                LoadingModalComponent,
                // MemberSearchDialogComponent,
              },
  data(){
    return{
      mux: mux,
      member_type_index:0,
      unestimated_steppers: 1,
      unestimated_step: 2,
      add_data_type: '완제품자재',
      select_purchase_manager: '',

      loading_dialog: false,
      unestimatedMailDialog: false,
      show_selected_unestimated_data: false,

      manufacturer_list:[],
      classification_list:[],
      bom_list_need_estiamte_data:[],
      selected_unestimated_data:[],
      members_list:[],
      selected_unestimated_headers:[],
      bom_list_purchase_data:[],
      bom_list_purchase_items_data:[],
      product_data:[],
      selected_item_data:[],
      purchasers:[],

      type_list:PurchasePageConfig.type_list,
      searchProductCardInputs:PurchasePageConfig.searchProductCardInputs,
      searchItemsCardInputs:PurchasePageConfig.searchItemsCardInputs,
      estimateInfoInputs:PurchasePageConfig.estimateInfoInputs,
      purchaseInfoInputs:PurchasePageConfig.purchaseInfoInputs,
      headers:PurchasePageConfig.headers,
      item_headers: PurchasePageConfig.item_headers,
      bom_list_purchase_product_headers:PurchasePageConfig.bom_list_purchase_product_headers,
      bom_list_purchase_items_headers:PurchasePageConfig.bom_list_purchase_items_headers,
      purchase_member_info:PurchasePageConfig.purchase_member_info,
    }
  },

  computed: {

  },

  watch: {
    select_purchase_manager(val){
      if(val !== null) {
        let user_id = val.split('(')[1].split(')')[0];
        let user_name = val.split('(')[0];
        this.purchase_member_info[1].name = user_name;
        this.purchase_member_info[1].user_id =  user_id;
      }else{
        this.purchase_member_info[1].name = '';
        this.purchase_member_info[1].user_id =  '';
      }
    }
  },

  created () {
    this.initialize()
  },
  methods: {
    async initialize () {
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
        // this.login_id =  this.$cookies.get(this.$configJson.cookies.id.key);
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }

      // 구매담당자 리스트업 (설계 > 작성 > 구매요청 step > 구매담당자 선택을 위함)
      try {
        const result = await mux.Server.get({path:'/api/admin/users/'});
        if (prevURL !== window.location.href) return;
        if (result.code == 0){
          result.data.Users.map(data => {
            if(data.Attributes.find(x=>x.Name === 'custom:department').Value === '기획관리부'){
              this.purchasers.push((data.Attributes.find(x=>x.Name === 'given_name') ? data.Attributes.find(x=>x.Name === 'given_name').Value : '') + '(' + data.Username + ')');
            }
          });

        }else {
          this.loading_dialog = false;
          mux.Util.showAlert(result.message);
          return;
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        mux.Util.showAlert(error);
        return;
      }

      mux.List.addProductBasicInfoLists(this.searchItemsCardInputs, this.classification_list, this.manufacturer_list, true);
      this.searchProductCardInputs = JSON.parse(JSON.stringify(this.searchProductCardInputs));
      this.searchItemsCardInputs = JSON.parse(JSON.stringify(this.searchItemsCardInputs));
      this.estimateInfoInputs = JSON.parse(JSON.stringify(this.estimateInfoInputs));
      mux.Rules.rulesSet(this.estimateInfoInputs);
    },
    // eslint-disable-next-line no-unused-vars
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      // console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },

    close(){
      this.unestimatedMailDialog = false;
      this.unestimated_steppers = 1;
      this.estimateInfoInputs.forEach(input => {
        input.value = '';
        if(input.type === 'file'){
          input.value.name = '';
        }
      });
    },
    async searchProduct() {
      this.loading_dialog = true;

      if(this.add_data_type === '완제품자재'){
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
                  data.belong_data[b].item_id = data.item_code + '_' + data.belong_data[b].id;
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
      }else{
        let searchType = this.searchItemsCardInputs.find(x=>x.label === '종류').value;
        let searchClassification = this.searchItemsCardInputs.find(x=>x.label === '분류').value;
        if (searchClassification === 'All')
          searchClassification = '%';
        let searchProductCode = this.searchItemsCardInputs.find(x=>x.label === '관리코드').value;
        if (searchProductCode)
        searchProductCode = searchProductCode.trim();

        let searchProductName = this.searchItemsCardInputs.find(x=>x.label === '제품명').value;
        if (searchProductName)
        searchProductName = searchProductName.trim();

        let searchModelName = this.searchItemsCardInputs.find(x=>x.label === '모델명').value;
        if (searchModelName)
        searchModelName = searchModelName.trim();

        let searchProductSpec = this.searchItemsCardInputs.find(x=>x.label === '사양').value;
        if (searchProductSpec)
        searchProductSpec = searchProductSpec.trim();

        let searchManufacturer = this.searchItemsCardInputs.find(x=>x.label === '제조사').value;
        if (searchManufacturer)
        searchManufacturer = searchManufacturer.trim();

        // let searchStockMoreZero = '';

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

                "stock_table.conditions": "",
                "stock_table.stock_num": ""
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

            if(result['data'].length === 0){
              mux.Util.showAlert('검색 결과가 없습니다.');
            }
            result = result['data'].map(a => {
              if (!a.stock_num){
                a.stock_price = 0;
              }else {
                a.stock_price = Math.round(a.unit_price * a.stock_num)
              }
              return a;
            });

            let product_data_arr = [];
            result.forEach(data => {
              let isExist = false;
              if (!this.stock_more_0 || (data.stock_num && data.stock_num > 0)){
                for (let i = 0; i < product_data_arr.length; i++) {
                  if (product_data_arr[i]._code === data._code) {
                    if (data.stock_num){
                      if (product_data_arr[i].spot_stock !== undefined){
                        product_data_arr[i].spot_stock.push({_code: data._code, spot: data.spot, stock_num: data.stock_num, conditions: data.conditions, stock_price: Math.round(data.unit_price * data.stock_num)});
                      }else {
                        product_data_arr[i].spot_stock = [{_code: data._code, spot: data.spot, stock_num: data.stock_num, conditions: data.conditions, stock_price: Math.round(data.unit_price * data.stock_num)}];
                      }
                    }
                    isExist = true;
                    break;
                  }
                }
                if (!isExist) {
                  if (data.stock_num){
                    data.spot_stock = [{_code: data._code, spot: data.spot, stock_num: data.stock_num, conditions: data.conditions, stock_price: Math.round(data.unit_price * data.stock_num)}];
                  }
                  product_data_arr.push(data);
                }
              }
            });
            this.product_data = product_data_arr;

            this.product_data.forEach(data =>{

              data.item_code = data._code;
              delete data._code;

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
      }
      this.loading_dialog = false;
      // this.product_data = ProductSearchPageConfig.test_product_data;
    },
    addProductData(item){
      if(item.belong_data){
        item.belong_data.forEach(data => {
          data.product_code = item.item_code;
          data.purchase_price = '';

          data.purchase_estimate_check = false;
          data.purchase_estimate_company = '';
          data.purchase_estimate_file_name = '';
          data.purchase_estimate_thumbnail = '';
        })
        this.bom_list_purchase_data = this.bom_list_purchase_data.filter(param => param.product_code != item.item_code);
        this.bom_list_purchase_data.push(...item.belong_data);
      }
    },
    addBelongData(item, idx){
      if(this.bom_list_purchase_data.length === 0){
        item.belong_data[idx].product_code = item.item_code;
        item.belong_data[idx].purchase_price = '';
        item.belong_data[idx].purchase_estimate_check = false;
        item.belong_data[idx].purchase_estimate_company = '';
        item.belong_data[idx].purchase_estimate_file_name = '';
        item.belong_data[idx].purchase_estimate_thumbnail = '';
        this.bom_list_purchase_data.push(item.belong_data[idx]);
      }else{
        let add_data = {};
        for(let i=0; i<this.bom_list_purchase_data.length; i++){
          if(this.bom_list_purchase_data[i].product_code === item.item_code && this.bom_list_purchase_data[i].item_code === item.belong_data[idx].item_code){
            mux.Util.showAlert('이미 추가된 제품입니다.');
            return;
          }else{
            item.belong_data[idx].product_code = item.item_code;
            item.belong_data[idx].purchase_price = '';
            item.belong_data[idx].purchase_estimate_check = false;
            item.belong_data[idx].purchase_estimate_company = '';
            item.belong_data[idx].purchase_estimate_file_name = '';
            item.belong_data[idx].purchase_estimate_thumbnail = '';
            add_data=item.belong_data[idx];
          }
        }
        this.bom_list_purchase_data.push(add_data);
      }
    },
    cancleItem(product_code, item_code){
      if(item_code === false){
        this.bom_list_purchase_data = this.bom_list_purchase_data.filter(param => param.product_code != product_code);
      }else if(product_code === false){
        this.bom_list_purchase_items_data = this.bom_list_purchase_items_data.filter(param => param.item_code != item_code);
      }else{
        this.bom_list_purchase_data.forEach((data, index) => {
          if(data.product_code === product_code && data.item_code === item_code){
            this.bom_list_purchase_data.splice(index, 1);
          }
        })
      }
    },

    calcTotal(item){
      let total = Number(item.purchase_num ? item.unit_price.replace(/,/g,'').replace(/₩ /g,'') * item.purchase_num.replace(/,/g,'') :  0).toLocaleString();
      return total;
    },

    async clickDontSelect(item_id){
      let bom_data;
      let item_check;
      if(this.add_data_type === '완제품자재'){
        bom_data = this.bom_list_purchase_data;
        item_check = 'item_id';
      }
      else{
        bom_data = this.bom_list_purchase_items_data;
        item_check = 'item_code';
      }

      for(let i=0; i<bom_data.length; i++){
        if(bom_data[i][item_check] === item_id){
          if(bom_data[i].purchase_estimate_company !== ''){
            const confirm = await mux.Util.showConfirm('미선택 체크 시 적용한 견적서는 초기화됩니다.  ', '선택 확인');
              if (!confirm){
                return;
              }
            bom_data[i].purchase_estimate_company = '';
            bom_data[i].purchase_estimate_file_name = '';
            bom_data[i].purchase_estimate_thumbnail = '';
          }
        }

      }
      this.selected_unestimated_data = []
    },
    estimateDialog(item){
      let bom_data;
      let item_check;
      let set_headers = [];
      this.selected_unestimated_headers = [];
      if(this.add_data_type === '완제품자재'){
        bom_data = this.bom_list_purchase_data;
        item_check = 'item_id';
        set_headers = PurchasePageConfig.selected_unestimated_product_headers
      }
      else{
        bom_data = this.bom_list_purchase_items_data;
        item_check = 'item_code';
        set_headers = PurchasePageConfig.selected_unestimated_item_headers
      }

      this.bom_list_need_estiamte_data = [];
      this.selected_unestimated_data = [];

      for(let i=0; i<bom_data.length; i++){
        if(bom_data[i][item_check] === item[item_check]){
          if(bom_data[i].purchase_estimate_check){
            const confirm = mux.Util.showAlert('미선택이 체크되어 있습니다. <br> 체크 해제 후 출하 선택이 가능합니다.', '선택 확인');
            if (!confirm){
              return;
            }
            return;
          }
          this.unestimatedMailDialog = true;
          this.selected_unestimated_data.push(item);
          this.bom_list_need_estiamte_data.push(item);
          this.selected_unestimated_headers = set_headers;
        }else{
          if(!bom_data[i].purchase_estimate_check && bom_data[i].purchase_estimate_company === ''){
            this.bom_list_need_estiamte_data.push(bom_data[i]);
          }
        }
      }
    },
    async savePurchaseEstimate(){
      let selected_data = this.selected_unestimated_data;
      let estimate_info = this.estimateInfoInputs;
      let product_data;
      let item_check;
      if(this.add_data_type === '완제품자재'){
        product_data = this.bom_list_purchase_data;
        item_check = 'item_id';
      } else{
        product_data = this.bom_list_purchase_items_data;
        item_check = 'item_code';
      }

      const validate = this.$refs.estimateForm[0].validate();
      if(validate){
        let estimate_company = estimate_info.find(x=>x.column_name === 'purchase_estimate_company').value
        let estimate_file_value = estimate_info.find(x=>x.column_name === 'purchase_estimate_file').value;
        let estimate_file_name = estimate_file_value.name;
        const getPdfThumbnail = await mux.Util.getPdfThumbnail(estimate_file_value, 1, false);
        let estimate_file_thumbnail = mux.Util.uint8ArrayToHexString(getPdfThumbnail);
        let estimate_thumbnail_img = mux.Util.imageBinary(estimate_file_thumbnail);

        selected_data.forEach(selected => {
          for(let i=0; i<product_data.length; i++){
            if(selected[item_check] === product_data[i][item_check]){
              product_data[i].purchase_estimate_company = estimate_company;
              product_data[i].purchase_estimate_file_value = estimate_file_value;
              product_data[i].purchase_estimate_file_name = estimate_file_name;
              product_data[i].purchase_estimate_thumbnail = estimate_file_thumbnail;
              product_data[i].purchase_estimate_thumbnail_img = estimate_thumbnail_img;
            }
          }
        })
        product_data.push();
        this.close()
      }
    },

    async itemSelect(){
      if(this.add_data_type == '완제품자재'){
        const confirm = await mux.Util.showConfirm('개별 자재 선택으로 전환되며, \n작성하던 내용은 초기화됩니다. ', '전환 확인');
        if (!confirm){
          return;
        }
        this.bom_list_purchase_data = [];
        this.add_data_type = '개별자재';
      }else{
        const confirm = await mux.Util.showConfirm('완제품 자재 선택으로 전환되며, \n작성하던 내용은 초기화됩니다. ', '전환 확인');
        if (!confirm){
          return;
        }
        this.bom_list_purchase_items_data = [];
        this.add_data_type = '완제품자재';
      }
      this.product_data = [];
    },

    async purchaseApprovalRequest(){
      const currDate = new Date();
      let bom_data;
      if(this.add_data_type === '완제품자재'){
        bom_data = this.bom_list_purchase_data;
      } else{
        bom_data = this.bom_list_purchase_items_data;
      }

      let confirmation_data = {};
      let member_input = this.purchase_member_info;
      let success = true;

      let code = 'PE-' + mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss.fff');

      confirmation_data.project_code = this.purchaseInfoInputs.find(x=>x.label === '프로젝트 코드').value;
      confirmation_data.note = this.purchaseInfoInputs.find(x=>x.label === '비고').value;
      confirmation_data.approval_phase = '요청';
      // confirmation_data.checker_id = this.purchase_member_info[0].user_id;
      // confirmation_data.checker = this.purchase_member_info[0].name;

      if(this.select_purchase_manager === '' || this.select_purchase_manager === null){
        mux.Util.showAlert('구매담당자를 선택해주세요.');
        return success = false;
      }else{
        member_input.forEach(mem => {
          if(mem.type === '확인'){
            confirmation_data.checker = mem.name;
            confirmation_data.checker_id = mem.user_id;
          }else if(mem.type === '승인'){
            confirmation_data.approver = mem.name;
            confirmation_data.approver_id = mem.user_id;
          }
        })
      }

      let unestimated_data = [];
      if(bom_data.length === 0){
        mux.Util.showAlert('구매요청할 제품을 선택해주세요.');
        return success = false;
      }else{
        for(let b=0; b<bom_data.length; b++){
          if(!bom_data[b].purchase_num  || bom_data[b].purchase_num === '' || bom_data[b].purchase_num === 0){
            mux.Util.showAlert('구매 요청 수량 0이상 필수 입력');
            return success = false;
          }
          if(bom_data[b].type === '' || bom_data[b].classification === '' || bom_data[b].name === ''){
            mux.Util.showAlert('종류, 분류, 제품명 필수 입력');
            return success = false;
          }
          if(!bom_data[b].purchase_estimate_check && bom_data[b].purchase_estimate_company === ''){
            unestimated_data.push({"product_code": bom_data[b].product_code, "item_code" : bom_data[b].item_code});
          }
        }
      }

      if(unestimated_data.length > 0){
        let message = '';
        for(let u=0; u<unestimated_data.length; u++){
          message += '· ' + unestimated_data[u].product_code + ' - ' + unestimated_data[u].item_code + '<br>';
        }
        mux.Util.showAlert('견적서를 등록하지 않은 제품이 있습니다. <br>'+message);
        return success = false;
      }



      if(success == true){
        this.loading_dialog = true;
        let sendData = {
          "purchase_confirmation_table-insert": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "creater"
            },
            "data":{
              "code" : code,
              "project_code" : confirmation_data.project_code ,
              "approval_phase": confirmation_data.approval_phase,
              "checker" : confirmation_data.checker,
              "checker_id" : confirmation_data.checker_id,
              "checked_date" : mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss'),
              "approver" : confirmation_data.approver,
              "approver_id" : confirmation_data.approver_id,
              "note" : confirmation_data.note
              // ,
              // "add_data": confirmation_data.add_data
            },
            "select_where": {"code": code},
            "rollback": "yes"
          }]
        };
        // if(sendData["purchase_confirmation_table-insert"][0].data.approval_phase === '미승인'){
        //   sendData["purchase_confirmation_table-insert"][0].data.checked_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
        // }

        let bom_data_insert = [];

        let files_unique=[];
        bom_data.forEach(bom => {
          if(this.add_data_type === '완제품자재'){
            bom_data_insert.push({
              "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data":{
                  "code" : code,
                  "type" : bom.type,
                  "classification" : bom.classification,
                  "product_code" : bom.product_code,
                  "item_code" : bom.item_code,
                  "name" : bom.name,
                  "model" : bom.model,
                  "spec" : bom.spec,
                  "manufacturer" : bom.manufacturer,
                  "unit_price" : bom.unit_price.replace(/,/g,'').replace(/₩ /g,''),
                  "purchase_num" : bom.purchase_num.replace(/,/g,''),
                  "purchase_estimate_phase" : bom.purchase_estimate_company === '' ? '미요청' : '완료',
                  "purchase_estimate_company" : bom.purchase_estimate_company,
                  "purchase_estimate_file" : bom.purchase_estimate_file_name,
                  "purchase_estimate_thumbnail" : bom.purchase_estimate_thumbnail,
                },
                "select_where": {"code": code, "product_code": bom.product_code, "item_code": bom.item_code},
                "rollback": "yes"
            });
          }else{
            bom_data_insert.push({
              "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data":{
                  "code" : code,
                  "type" : bom.type,
                  "classification" : bom.classification,
                  "item_code" : bom.item_code,
                  "name" : bom.name,
                  "model" : bom.model,
                  "spec" : bom.spec,
                  "manufacturer" : bom.manufacturer,
                  "unit_price" : bom.data_type === 'selected' ? bom.unit_price.replace(/,/g,'').replace(/₩ /g,'') : (bom.unit_price === '' ? 0 : bom.unit_price.replace(/,/g,'')),
                  "purchase_num" : bom.purchase_num.replace(/,/g,''),
                  "purchase_estimate_phase" : bom.purchase_estimate_company === '' ? '미요청' : '완료',
                  "purchase_estimate_code" : bom.purchase_estimate_company === '' ? '' : bom.purchase_estimate_company + '/' + mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss.fff') + '/' + this.$cookies.get(this.$configJson.cookies.id.key),
                  "purchase_estimate_company" : bom.purchase_estimate_company,
                  "purchase_estimate_file" : bom.purchase_estimate_file_name,
                  "purchase_estimate_thumbnail" : bom.purchase_estimate_thumbnail,
                },
                "select_where": {"code": code, "product_code": bom.product_code, "item_code": bom.item_code},
                "rollback": "yes"
            });
          }
          if(bom.purchase_estimate_file_value){
            files_unique.push({
              folder: 'purchase/purchase_estimate',
              file: bom.purchase_estimate_file_value,
              name: bom.purchase_estimate_file_name
            });
          }
        })
        sendData["purchase_product_table-insert"] = bom_data_insert;

        let set = new Set(files_unique);
        sendData.files = [...set];

        sendData.path = '/api/multipart_rest_api/';
        sendData.prefix = code + '_';
        // if (this.inbound_confirmation_data.receiving_inspection) {
        //   sendData.files.push({
        //     folder: 'inbound/receiving_inspection',
        //     file: this.receiving_inspection_value,
        //     name: this.inbound_confirmation_data.receiving_inspection
        //   });
        // }
        // if (this.inbound_confirmation_data.inspection_report) {
        //   sendData.files.push({
        //     folder: 'inbound/inspection_report',
        //     file: this.inspection_report_value,
        //     name: this.inbound_confirmation_data.inspection_report
        //   });
        // }

        const prevURL = window.location.href;
          try {
            // let result = await mux.Server.post({
            //   path: '/api/common_rest_api/',
            //   params: sendData
            // });
            let result = await mux.Server.uploadFile(sendData);
            if (prevURL !== window.location.href) return;

            if (typeof result === 'string'){
              result = JSON.parse(result);
            }
            if(result.data['code'] == 0){
              mux.Util.showAlert('구매 요청이 완료되었습니다', '요청 완료', 3000);

              //메일 알림 관련
              let mailTo = [];
              mailTo.push(confirmation_data.approver_id);
              // let phase;
              // if(confirmation_data.approval_phase === '미확인'){
              //   mailTo.push(confirmation_data.checker_id);
              //   phase = '확인'
              // }else if(confirmation_data.approval_phase === '미승인'){
              //   mailTo.push(confirmation_data.approver_id);
              //   phase = '승인'
              // }

              // 메일 본문 내용
              let content=`
                <html>
                  <body>
                    <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                      <h2 style="text-align: center; color:#13428a">구매 요청 알림</h2>
                      <table style="width: 100%;border-spacing: 10px 10px;">
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${confirmation_data.project_code === '' ? '-' : confirmation_data.project_code}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">비고</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${confirmation_data.note === '' ? '-' : confirmation_data.note}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.$cookies.get(this.$configJson.cookies.name.key).trim()}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">구매담당자</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${confirmation_data.approver}</td>
                        </tr>
                      </table>
                      <a style="color: white; text-decoration:none"href="${prevURL.substring(0,prevURL.lastIndexOf('/'))}/purchase-search?project_code=${confirmation_data.project_code}">
                        <p style="cursor:pointer; background: #13428a;color: white;font-weight: bold;padding: 13px;border-radius: 40px;font-size: 16px;text-align: center;margin-top: 25px; margin-bottom: 40px;">
                          확인하기
                        </p>
                      </a>
                    </div>
                  </body>
                </html>
              `;
              try {
                let sendEmailAlam = await mux.Server.post({
                  path: '/api/send_email/',
                  to_addrs: mailTo,
                  subject: "구매 요청 알림",
                  content: content
                });
                if (prevURL !== window.location.href) return;
                if(sendEmailAlam['code'] == 0){
                  console.log(sendEmailAlam['message']);
                } else {
                  if (prevURL !== window.location.href) return;
                  mux.Util.showAlert(sendEmailAlam['failed_info']);
                }
              } catch (error) {
                if (prevURL !== window.location.href) return;
                if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
                  mux.Util.showAlert(error.response['data']['failed_info'].msg);
                else
                  mux.Util.showAlert(error);
              }
            } else {
              if (prevURL !== window.location.href) return;
              mux.Util.showAlert(result['failed_info']);
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
              mux.Util.showAlert(error.response['data']['failed_info'].msg);
            else
              mux.Util.showAlert(error);
          }
          this.loading_dialog = false;
          this.bom_list_purchase_data=[];
          this.bom_list_purchase_items_data=[];
      }
    },

    addItems(){
      let check_duplicate=[];
      let set_item = this.bom_list_purchase_items_data;
      let selected_item = this.selected_item_data;

      set_item.forEach(item => {
        for(let d=0; d<selected_item.length; d++){
          if(item.item_code === selected_item[d].item_code){
            check_duplicate.push(item.item_code);
          }
        }
      })
      if(check_duplicate.length > 0){
        let duplicate = JSON.stringify(check_duplicate).replace( "[",'').replace( "]",'');
        mux.Util.showAlert(duplicate + '은(는) 이미 추가된 제품입니다.')
        return
      }else{
        selected_item.forEach(data =>{
          data.purchase_price = '';
          data.purchase_estimate_check = false;
          data.purchase_estimate_company = '';
          data.purchase_estimate_file_name = '';
          data.purchase_estimate_thumbnail = '';
          data.data_type = 'selected'
          set_item.push(data);
        })
        this.selected_item_data = [];
      }
    },
    addItemSetting(){
      let added=0;
      for(let i=0; i<this.bom_list_purchase_items_data.length; i++){
        if(this.bom_list_purchase_items_data[i].data_type === 'added'){
          added ++;
        }
      }
      this.bom_list_purchase_items_data.push(
        {
          "type":"",
          "classification":"",
          "item_code": '임시코드-'+ ('00' + (added + 1)).slice(-3),
          "name":"",
          "model":"",
          "spec":"",
          "manufacturer":"",
          "unit_price":"",
          "purchase_num": "",
          "item_num": "",
          "stock_num":"",
          "estimate":"",
          "data_type": "added",
          "purchase_estimate_check":false,
          "purchase_estimate_company" :"",
          "purchase_estimate_file_name" :"",
          "purchase_estimate_thumbnail" :""
        }
      )
    },

    showEstiamteSet(item){
      console.log(mux.Util.imageBinary(item.purchase_estimate_thumbnail));
    },

  }
}
</script>
<style lang="">

</style>
