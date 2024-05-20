<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productMenu="true" :inboundMenu="true"></NavComponent>

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
            v-if="!add_self"
          >
            <div slot="cardTitle">
              <span>자재 선택</span>
              <v-btn
                small
                color="success"
                class="mr-2 ml-4"
                @click="addProductInboundData"
              >
                직접 입력형 전환
              </v-btn>
            </div>
            <InputsFormComponent
              slot="cardText"
              dense
              clearable
              filled
              hide-details
              :inputs="searchCardInputs"
              @enter="searchProduct"
              v-if="select_product"
            >
              <v-col
                cols="12"
                sm="4"
                lg="3"
                align-self="center"
              >
                <v-btn
                  color="primary"
                  class="mr-2"
                  elevation="2"
                  @click="searchProduct"
                >
                  <v-icon>mdi-magnify</v-icon>검색
                </v-btn>
                <v-btn
                  color="default"
                  elevation="2"
                  @click="addItems"
                >추가</v-btn>
              </v-col>
              <v-col cols="12">
                <v-data-table
                  class="elevation-1"
                  dense
                  v-model="selected_product_data"
                  :headers="product_search_headers"
                  :items="product_search_data"
                  item-key="_code"
                  show-select
                  />
              </v-col>
            </InputsFormComponent>
          </CardComponent>
          <CardComponent
            elevation="1"
            card-class="mt-5"
            text-class=" pt-3"
            title-class="mb-0 font-weight-black"
            divider-class="mb-3"
          >
            <div slot="cardTitle">
              입고 정보 입력
            </div>
            <div slot="cardText">

              <MemberSearchDialogComponent
                :dialog-value="member_dialog"
                :persistent="true"
                @close="close"
                @setMember = "setMember"
                @members = "members"
              >
              </MemberSearchDialogComponent>
              <v-chip
                class="mr-2 mb-4"
                style="cursor:pointer"
                v-for="(member, i) in inbound_member_info"
                :key="i"
                :color="member.name ? 'success' : 'default'"
                @click="selectMemberDialog(i)"
              >
                {{ member.type }} : {{ member.name }}
              </v-chip>
              <v-form ref="inboundForm">
                <InputsFormComponent
                  dense
                  clearable
                  filled
                  hide-details
                  :inputs="inboundCardInfoInputs"
                  @dateSet = "dateSetImport"
                >
                  <v-col cols="12" sm="4" lg="2" align-self="center">
                    <v-radio-group
                      dense
                      hide-details
                      class="mt-0"
                      v-model="something_wrong_radio"
                      row
                    >
                      <v-radio
                        label="이상 없음"
                        value="이상 없음"
                        @click="something_wrong = false"
                      ></v-radio>
                      <v-radio
                        label="이상 있음"
                        value="이상 있음"
                        class="mr-0"
                        @click="something_wrong = true"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col cols="12" sm="4" lg="4" v-if="something_wrong">
                    <v-text-field
                      dense
                      hide-details
                      filled
                      label="사유"
                      v-model="something_wrong_reason"
                      :rules="[v => !!v || '사유 입력']"
                    ></v-text-field>
                  </v-col>
                </InputsFormComponent>
              </v-form>
              <v-divider class="my-5"></v-divider>
              <v-row>
                <v-col cols="12" sm="2" lg="2" align-self="center">
                  <v-autocomplete
                    v-model="set_spot_selected"
                    :items="spot_list"
                    label="위치"
                    dense
                    clearable
                    hide-details
                    style="width:200px"
                    v-if="product_inbound_data.length > 0"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" lg="6" align-self="center">
                  <v-btn
                    small
                    color="primary"
                    class="mr-2"
                    @click="setSpotAtOnce"
                    v-if="product_inbound_data.length > 0"
                  >
                    일괄 적용
                  </v-btn>
                  <v-btn
                    small
                    color="default"
                    class="mr-2"
                    @click="addProductInboundData"
                    v-if="add_self"
                  >
                    행 추가
                  </v-btn>

                </v-col>
                <v-col cols="12" sm="4" lg="4" align-self="center">
                  <v-btn
                    small
                    color="success"
                    class=" float-right"
                    @click="inboundApprovalRequest"
                  >
                    입고 승인 요청
                  </v-btn>
                  <v-btn
                    v-if="add_self"
                    small
                    color="error"
                    class="mr-2 float-right"
                    @click="addProductInboundDataCancle"
                  >
                    직접 입력형 취소
                  </v-btn>
                </v-col>
                <v-col
                  cols="12"
                >
                  <v-data-table
                    dense
                    :headers="product_inbound_headers"
                    :items="product_inbound_data"
                    hide-default-footer
                    disable-pagination
                    item-key="_code"
                    class="elevation-1"
                  >
                    <template v-slot:item="{ item, index }">
                      <tr v-if="!add_self">
                        <td align="center">{{ item.type }}</td>
                        <td align="center">{{ item.classification }}</td>
                        <td align="center">{{ item._code }}</td>
                        <td align="center">{{ item.name }}</td>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            filled
                            style="max-width:150px"
                            v-model="item.inbound_num"
                            :oninput="!item.inbound_num ? '' : item.inbound_num = item.inbound_num.replace(/^0+|\D+/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">
                          <v-autocomplete
                            v-model="item.spot"
                            :items="spot_list"
                            dense
                            filled
                            hide-details
                            style="width:150px"
                          ></v-autocomplete>
                        </td>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            filled
                            style="max-width:200px"
                            v-model="item.spec"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">{{  item.model }}</td>
                        <td align="center">{{  item.manufacturer }}</td>
                        <td align="center">{{  item.unit_price }}</td>
                        <td align="center">
                          <v-icon small color="default" style="cursor:pointer" @click="deleteInboundDataRow(index)">mdi-minus-thick</v-icon>
                        </td>
                      </tr>
                      <tr v-else-if="add_self">
                        <td align="center">
                          <v-autocomplete
                            v-model="item.type"
                            :items="type_list"
                            dense
                            filled
                            hide-details
                            style="width:150px"
                          ></v-autocomplete>
                        </td>
                        <td align="center">
                          <v-autocomplete
                            v-model="item.classification"
                            :items="classification_list.slice(1)"
                            dense
                            filled
                            hide-details
                            style="width:150px"
                          ></v-autocomplete>
                        </td>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            filled
                            v-model="item._code"
                            style="width:200px"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            filled
                            v-model="item.name"
                            style="width:150px"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            filled
                            type="number"
                            v-model="item.inbound_num"
                            style="width:150px"
                          >

                          </v-text-field>
                        </td>
                        <td align="center">
                          <v-autocomplete
                            v-model="item.spot"
                            :items="spot_list"
                            dense
                            filled
                            hide-details
                            style="width:150px"
                          ></v-autocomplete>
                        </td>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            filled
                            v-model="item.spec"
                            style="width:150px"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            filled
                            v-model="item.model"
                            style="width:150px"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            filled
                            v-model="item.manufacturer"
                            style="width:150px"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            filled
                            type="number"
                            v-model="item.unit_price"
                            style="width:150px"
                          >

                          </v-text-field>
                        </td>
                        <td align="center">
                          <v-icon color="default" style="cursor:pointer" @click="selectShipData(item, index)">mdi-magnify</v-icon>
                        </td>
                        <td align="center">
                          <v-icon small color="default" style="cursor:pointer" @click="deleteInboundDataRow(index)">mdi-minus-thick</v-icon>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </div>
          </CardComponent>
        </v-col>
      </v-row>

      <!-- 출하데이터 조회 Modal -->
      <ModalDialogComponent
        :dialog-value="ship_dialog"
        max-width="90%"
        title-class=" "
        :dialog-transition="'slide-x-transition'"
        :dialog-custom="'custom-dialog elevation-0 white'"
        :card-elevation="'0'"
        :persistent="true"
      >
        <v-container>
          <!-- 모달 내용 구성 -->
          <v-row>
            <v-col
              cols="6"
            >
              <p class="text-h6 font-weight-black float-left mb-0">출하 정보 검색</p>
            </v-col>
            <v-col
              cols="6"
            >
              <p class="text-h6 font-weight-black float-left mb-0">선택 출하 정보</p>
              <v-btn
                color="blue-grey darken-1"
                x-small
                class="mr-2 float-right white--text"
                elevation="2"
                @click="close"
                fab
              >
                <v-icon> mdi-close-thick </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="6">
              <InputsFormComponent
                dense
                filled
                clearable
                hide-details
                :inputs="searchShipaDataInputs"
                @enter="searchShipData"
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
                    small
                    @click="searchShipData"
                  >
                    검색
                  </v-btn>
                </v-col>
              </InputsFormComponent>
            </v-col>
            <v-col cols="6">
              <v-btn
                color="success"
                small
                class="ml-2 float-left"
                elevation="2"
                @click="applyToInboundData"
              >
                저장
              </v-btn>
            </v-col>
            <v-col cols="6">
              <DataTableComponent
                :headers="ship_search_headers"
                :items="ship_search_data"
                :item-key="ship_search_data.code"
                hide-default-footer
                disable-pagination
                children-key="belong_data"
                dense
                addToTable
                @addDataToTable="addShipData"
              />
            <!-- <v-data-table
              :headers="ship_search_headers"
              :items="ship_search_data"
              item-key="_code"
              show-select
              dense
            ></v-data-table> -->
            </v-col>
            <v-col cols="6">
              <DataTableComponent
                :headers="ship_search_headers"
                :items="ship_selected_data"
                item-key="code"
                hide-default-footer
                disable-pagination
                children-key="belong_data"
                dense
                exceptFromTable
                @exceptDataToTable="exceptShipData"
              />
            <!-- <v-data-table
              :headers="ship_search_headers"
              :items="ship_search_data"
              item-key="_code"
              show-select
              dense
            ></v-data-table> -->
            </v-col>
          </v-row>

        </v-container>
      </ModalDialogComponent>
    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import DataTableComponent from "@/components/DataTableComponent";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import ModalDialogComponent from "@/components/ModalDialogComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import MemberSearchDialogComponent from "@/components/MemberSearchDialogComponent.vue";
import LoadingModalComponent from "@/components/LoadingModalComponent.vue";
import InboundRegisterPageConfig from "@/configure/InboundRegisterPageConfig.json";
import CheckPagePermission from "@/common_js/CheckPagePermission";
import mux from "@/mux";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=InboundRegisterPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  components: {
                NavComponent,
                DataTableComponent,
                InputsFormComponent,
                CardComponent,
                MemberSearchDialogComponent,
                LoadingModalComponent,
                ModalDialogComponent,
              },
  data(){
    return{
      login_id:'',
      stock_more_0: false,
      member_dialog: false,
      loading_dialog: false,
      ship_dialog: false,
      add_self: false,
      select_product: true,
      inbound_index:-1,
      today:'',
      inbound_date_set:'',
      dates: [],
      members_list:[],
      manufacturer_list:[],
      classification_list:[],
      spot_list: [],
      menu: false,
      something_wrong:false,
      something_wrong_reason:'',
      set_spot_selected: '',
      something_wrong_radio: '이상 없음',
      selected_product_data:[],
      product_inbound_data: [],
      product_inbound_data_added: [],
      member_type_index:0,
      receiving_inspection_value:'',
      inspection_report_value:'',
      files_value:[],
      type_list:InboundRegisterPageConfig.type_list,
      inbound_member_info:InboundRegisterPageConfig.inbound_member_info,
      inbound_confirmation_data: InboundRegisterPageConfig.inbound_confirmation_data,
      searchCardInputs:InboundRegisterPageConfig.searchCardInputs,
      inboundCardInfoInputs:InboundRegisterPageConfig.inboundCardInfoInputs,
      product_inbound_headers:InboundRegisterPageConfig.product_inbound_headers,
      product_search_headers:InboundRegisterPageConfig.product_search_headers,
      searchShipaDataInputs:InboundRegisterPageConfig.searchShipaDataInputs,
      ship_search_headers:InboundRegisterPageConfig.ship_search_headers,
      product_search_data:[],
      ship_search_data:[],
      ship_selected_data:[]
    }
  },


  created () {
    this.initialize()
    this.members()
  },
  methods: {
    async initialize () {
      this.today = new Date();

      // this.manufacturer_list = InboundRegisterPageConfig.test_manufacturer_list;
      // this.classification_list = InboundRegisterPageConfig.test_classification_list;
      // this.spot_list = InboundRegisterPageConfig.test_spot_list;
      const prevURL = window.location.href;
      try {
        let result = await mux.Server.getPionBasicInfo();
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }

        this.classification_list = result.classification;
        this.manufacturer_list = result.manufacturer;
        this.spot_list = result.spot;

      } catch (error) {
        if (prevURL !== window.location.href) return;
        alert(error);
      }

      mux.List.addProductBasicInfoLists(this.searchCardInputs, this.classification_list, this.manufacturer_list, true);
      this.searchCardInputs = JSON.parse(JSON.stringify(this.searchCardInputs));
      mux.Rules.rulesSet(this.inboundCardInfoInputs);

      try {
        // console.log('사용자 계정 정보 가졍오기');
        // let result = await mux.Server.get({
        //   path: '/api/user/',
        // });
        if (prevURL !== window.location.href) return;
        // console.log('result :>> ', result);
        this.inbound_member_info[0].name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.inbound_member_info[0].email =  this.$cookies.get(this.$configJson.cookies.email.key);
        this.inbound_member_info[0].user_id =  this.$cookies.get(this.$configJson.cookies.id.key);
        this.login_id =  this.$cookies.get(this.$configJson.cookies.id.key);
      } catch (error) {
        if (prevURL !== window.location.href) return;
        alert(error);
      }

    },
    async searchProduct(){
      this.loading_dialog = true;

      // this.product_search_data = InboundRegisterPageConfig.test_product_search_data

      let searchType = this.searchCardInputs.find(x=>x.label === '종류').value;
      if (searchType === 'All')
        searchType = '%';
      let searchClassification = this.searchCardInputs.find(x=>x.label === '분류').value;
      if (searchClassification === 'All')
        searchClassification = '%';
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
          path: '/api/sample_rest_api/',
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

              "stock_table.conditions": "",
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
          this.product_search_data = product_data_arr;

          this.product_search_data.forEach(data =>{
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
    },
    // eslint-disable-next-line no-unused-vars
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      // console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },

    addItems(){
      let check_duplicate=[];
      let set_item = this.product_inbound_data
      let selected_item = this.selected_product_data;

      set_item.forEach(item => {
        for(let d=0; d<selected_item.length; d++){
          if(item.item_code === selected_item[d]._code){
            check_duplicate.push(item.item_code);
          }
        }
      })
      if(check_duplicate.length > 0){
        let duplicate = JSON.stringify(check_duplicate).replace( "[",'').replace( "]",'');
        alert(duplicate + '은(는) 이미 추가된 제품입니다.')
        return
      }else{
        selected_item.forEach(data =>{
          data.item_code = data._code
          set_item.push(data);
        })
        this.selected_product_data = []
      }
    },

    addProductInboundData(){
      if(this.add_self == false){
        alert('직접 입력형으로 전환되며 위에서 선택한 자재는 선택 해제됩니다. ');
        this.product_inbound_data = [];
        this.select_product = false;
      }
      this.product_inbound_headers.splice(this.product_inbound_headers.length-1, 0, { "text": "출하선택", "align": "center", "value": "ship_select"})

      this.add_self = true;
      this.product_inbound_data.push({
        type:'',
        classification:'',
        _code: '',
        name: '',
        inbound_num: '',
        spot: '',
        spec: '',
        model: '',
        manufacturer: '',
        unit_price: '',
        registe_type: '직접입력',
      });
    },
    addProductInboundDataCancle(){
      if(this.add_self == true){
        alert('자재 선택형으로 전환되며 아래 작성된 내용은 초기화됩니다.');
        this.product_inbound_data = [];
        this.select_product = true;
      }

      let ship_select = this.product_inbound_headers.findIndex(obj => obj.text === '출하선택');
      this.product_inbound_headers.splice(ship_select,1)
      this.add_self = false;
    },
    setSpotAtOnce(){
      this.product_inbound_data.forEach(data =>{
        data.spot = this.set_spot_selected
      })
    },
    async inboundApprovalRequest(){
      let inbound_input = this.inboundCardInfoInputs;
      let member_input = this.inbound_member_info;
      let item = this.inbound_confirmation_data;
      let success = true;
      const validate = this.$refs.inboundForm.validate();
      if(validate){
        inbound_input.forEach(data => {
          for(let i=0; i<Object.keys(item).length; i++){
            if(data.column_name == Object.keys(item)[i]){
              if(data.type == 'file'){
                if(data.value){
                  if(data.column_name === 'files'){
                    for(let f=0; f<data.value.length; f++){
                      if(f === 0){
                        item[Object.keys(item)[i]] = data.value[f].name
                      }else{
                        item[Object.keys(item)[i]] = item[Object.keys(item)[i]]+"/"+data.value[f].name
                      }
                      this.files_value.push(data.value[f])
                    }
                  }else if(data.column_name === 'receiving_inspection'){
                    this.receiving_inspection_value = data.value
                    item[Object.keys(item)[i]] = data.value.name;
                  }else if(data.column_name === 'inspection_report'){
                    this.inspection_report_value = data.value
                    item[Object.keys(item)[i]] = data.value.name;
                  }
                }else{
                  item[Object.keys(item)[i]] = '';
                }
              }else{
                item[Object.keys(item)[i]] = data.value;
              }
            }
          }
        })
        item.inbound_date = (this.inbound_date_set === "" ? mux.Date.format(this.today, 'yyyy-MM-dd') : this.inbound_date_set);
        item.creater = this.login_id;
        item.code = item.order_code + ":" + mux.Date.format(this.today, 'yyyy-MM-dd HH:mm:ss.fff');
        if(this.add_self){
          item.add_data = "직접기입형"
        }else{
          item.add_data = "선택형"
        }


        let receiving_inspection_thumbnail = 'NULL';
        let inspection_report_thumbnail = 'NULL';
        if(this.receiving_inspection_value){
          const getPdfThumbnail = await mux.Util.getPdfThumbnail(this.receiving_inspection_value, 1, true, 500, 500);
          receiving_inspection_thumbnail = mux.Util.uint8ArrayToHexString(getPdfThumbnail);
        }
        if(this.inspection_report_value){
          const getPdfThumbnail = await mux.Util.getPdfThumbnail(this.inspection_report_value, 1, true, 500, 500);
          inspection_report_thumbnail = mux.Util.uint8ArrayToHexString(getPdfThumbnail);
        }

        console.log(item);

        let empty_member = [];
        member_input.forEach(mem => {
          if(!mem.user_id){
            empty_member.push(mem.type)
          }else{
            if(mem.type === '확인'){
              item.checker = mem.name;
              item.checker_id = mem.user_id;
              if(item.checker_id == this.login_id){
                item.approval_phase = '미승인';
                item.checked_date = mux.Date.format(this.today, 'yyyy-MM-dd HH:mm:ss');
              }else{
                item.approval_phase = '미확인';
                item.checked_date = "";
              }
            }else if(mem.type === '승인'){
              item.approver = mem.name;
              item.approver_id = mem.user_id;
            }else if(mem.type === '구매담당자'){
              item.purchase_manager = mem.name;
            }else if(mem.type === '자재담당자'){
              item.material_manager = mem.name;
            }
          }
        })

        if(empty_member.length > 0){
          alert(empty_member+"를 선택해주세요.");
          return success = false;
        }

        let inbound_product_data = this.product_inbound_data
        if(inbound_product_data.length === 0){
          alert('자재를 선택해주세요.');
          return success = false;
        }else{
          if(!this.add_self){
            for(let d = 0; d < inbound_product_data.length; d++){
              if(inbound_product_data[d].inbound_num == '' || inbound_product_data[d].spec == '' || inbound_product_data[d].spot == ''){
                alert('입고수량, 입고장소, 규격 필수 입력');
                return success = false;
              }else if(inbound_product_data[d].inbound_num == 0){
                alert('입고수량은 0보다 커야합니다.');
                return success = false;
              }
            }
          }else{
            inbound_product_data.forEach(data => {
              for(let add = 0; add < Object.keys(data).length; add++){
                if(Object.keys(data)[add] != 'model' && Object.values(data)[add] === ''){
                  alert('모델을 제외한 모든 정보가 기입되어야 합니다.');
                  return success = false;
                }
              }
            })
          }
        }

        if(success == true){
          this.loading_dialog = true;
          // console.log('입고 정보 : ' + JSON.stringify(item));
          // console.log('입고 제품 : ' + JSON.stringify(inbound_product_data));

          let sendData = {
            "inbound_confirmation_table-insert": [{
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "code" : this.inbound_confirmation_data.code,
                "inbound_date": this.inbound_confirmation_data.inbound_date,
                "order_code" : this.inbound_confirmation_data.order_code,
                "project_code" : this.inbound_confirmation_data.project_code,
                "purchase_manager" : this.inbound_confirmation_data.purchase_manager,
                "material_manager" : this.inbound_confirmation_data.material_manager,
                "abnormal_reason" : this.inbound_confirmation_data.abnormal_reason,
                "approval_phase": this.inbound_confirmation_data.approval_phase,
                "checker" : this.inbound_confirmation_data.checker,
                "checker_id" : this.inbound_confirmation_data.checker_id,
                "checked_date" : this.inbound_confirmation_data.checked_date,
                "approver" : this.inbound_confirmation_data.approver,
                "approver_id" : this.inbound_confirmation_data.approver_id,
                "receiving_inspection_file" : this.inbound_confirmation_data.receiving_inspection,
                "receiving_inspection_thumbnail" : receiving_inspection_thumbnail,
                "inspection_report_file" : this.inbound_confirmation_data.inspection_report,
                "inspection_report_thumbnail" : inspection_report_thumbnail,
                "files" : this.inbound_confirmation_data.files,
                "note" : this.inbound_confirmation_data.note,
                "add_data": this.inbound_confirmation_data.add_data
              },
              "select_where": {"code": this.inbound_confirmation_data.code},
              "rollback": "yes"
            }]
          };

          let product_data = [];
          inbound_product_data.forEach(data =>{
            product_data.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "code" : this.inbound_confirmation_data.code,
                "type" : data.type,
                "classification" : data.classification,
                "product_code" : data._code,
                "name" : data.name,
                "inbound_num" : data.inbound_num.replace(/,/g,''),
                "spot" : data.spot,
                "spec" : data.spec,
                "model" : data.model,
                "manufacturer" : data.manufacturer,
                "unit_price" : data.unit_price.replace(/,/g,'').replace(/₩ /g,''),
                "ship_code" : data.ship_code,
              },
              "select_where": {"code": this.inbound_confirmation_data.code},
              "rollback": "yes"
            });
          });
          sendData["inbound_product_table-insert"] = product_data;

          sendData.path = '/api/files/';
          sendData.prefix = this.inbound_confirmation_data.code + '_';
          sendData.files = [];
          if (this.inbound_confirmation_data.receiving_inspection) {
            sendData.files.push({
              folder: 'inbound/receiving_inspection', 
              file: this.receiving_inspection_value, 
              name: this.inbound_confirmation_data.receiving_inspection
            });
          }
          if (this.inbound_confirmation_data.inspection_report) {
            sendData.files.push({
              folder: 'inbound/inspection_report', 
              file: this.inspection_report_value,
              name: this.inbound_confirmation_data.inspection_report
            });
          }
          if (this.inbound_confirmation_data.files && this.files_value.length > 0) {
            for (let i = 0; i < this.files_value.length; i++) {
              const file = this.files_value[i];
              sendData.files.push({
                folder: 'inbound/files', 
                file: file,
                name: this.inbound_confirmation_data.files[i]
              });
            }
          }
          

          const prevURL = window.location.href;
          try {
            // let result = await mux.Server.post({
            //   path: '/api/sample_rest_api/',
            //   params: sendData
            // });
            let result = await mux.Server.uploadFile(sendData);
            if (prevURL !== window.location.href) return;

            if (typeof result === 'string'){
              result = JSON.parse(result);
            }
            if(result['code'] == 0){
              // console.log('result :>> ', result);
              alert('입고 승인 요청이 완료되었습니다');
              this.receiving_inspection_value = '';
              this.inspection_report_value = '';
              this.files_value = [];
            } else {
              if (prevURL !== window.location.href) return;
              alert(result['failed_info']);
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
              alert(error.response['data']['failed_info'].msg);
            else
              alert(error);
          }
          this.loading_dialog = false;
        }
      }
    },
    deleteInboundDataRow(idx){
      if(this.product_inbound_data.length === 1){
        alert('행이 한 개 이상 존재해야 합니다.')
      }else{
        this.product_inbound_data.splice(idx, 1);
      }
    },
    selectMemberDialog(idx){
      this.member_type_index = idx
      this.member_dialog = true;
    },
    setMember(item){
      this.inbound_member_info[this.member_type_index].name = item.name
      this.inbound_member_info[this.member_type_index].user_id = item.user_id
      this.close();
    },
    members(data){
      this.members_list=data;
    },
    dateSetImport(item){
      this.inbound_date_set = item
    },
    close(){
      this.member_dialog = false;
      this.ship_dialog = false
      this.ship_search_data = [];
      this.ship_selected_data = [];
    },
    selectShipData(item, index){
      this.ship_dialog = true;
      this.inbound_index = index;
      if(item.belong_data){
        this.ship_selected_data = item.belong_data
      }
    },
    searchShipData(){
      this.ship_search_data = InboundRegisterPageConfig.test_ship_search_data;
    },
    addShipData(item){
      for(let i=0; i<this.ship_selected_data.length; i++){
        if(this.ship_selected_data[i].code === item.code){
          alert("이미 추가한 데이터입니다.");
          return;
        }
      }
      this.ship_selected_data.push(item)
    },
    exceptShipData(index){
      this.ship_selected_data.splice(index,1);
    },
    applyToInboundData(){
      this.product_inbound_data[this.inbound_index].belong_data = [];
      this.ship_selected_data.forEach((data, index) => {
        this.product_inbound_data[this.inbound_index].belong_data.push(data);
        if(index === 0){
          this.product_inbound_data[this.inbound_index].ship_code = data.code
        }else{
          this.product_inbound_data[this.inbound_index].ship_code = this.product_inbound_data.ship_code + "/" + data.ship_code
        }
      })
      this.close();
    }
  },

  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  },
}
</script>
<style lang="">

</style>
