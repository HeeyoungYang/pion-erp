<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productMenu="true" :inboundMenu="true"></NavComponent>

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
                  elevation="2"
                  @click="searchProduct"
                >
                  <v-icon>mdi-magnify</v-icon>검색
                </v-btn>
              </v-col>
              <v-col cols="12">
                <DataTableComponent
                  dense
                  v-model="product_inbound_data"
                  :headers="product_search_headers"
                  :items="product_search_data"
                  item-key="product_code"
                  show-select
                  show-photo
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
                    item-key="product_code"
                    class="elevation-1"
                  >
                    <template v-slot:item="{ item, index }">
                      <tr v-if="!add_self">
                        <td align="center">{{  item.product_type }}</td>
                        <td align="center">{{  item.product_classification }}</td>
                        <td align="center">{{  item.product_code }}</td>
                        <td align="center">{{  item.product_name }}</td>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            filled
                            type="number"
                            style="max-width:150px"
                            v-model="item.inbound_num"
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
                            v-model="item.product_spec"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">{{  item.product_model }}</td>
                        <td align="center">{{  item.manufacturer }}</td>
                        <td align="center">{{  item.unit_price }}</td>
                        <td align="center">
                          <v-icon small color="default" style="cursor:pointer" @click="deleteInboundDataRow(index)">mdi-minus-thick</v-icon>
                        </td>
                      </tr>
                      <tr v-else-if="add_self">
                        <td align="center">
                          <v-autocomplete
                            v-model="item.product_type"
                            :items="type_list"
                            dense
                            filled
                            hide-details
                            style="width:150px"
                          ></v-autocomplete>
                        </td>
                        <td align="center">
                          <v-autocomplete
                            v-model="item.product_classification"
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
                            v-model="item.product_code"
                            style="width:200px"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            filled
                            v-model="item.product_name"
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
                            v-model="item.product_spec"
                            style="width:150px"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            filled
                            v-model="item.product_model"
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
                        <!-- <td align="center">
                          <v-file-input
                            small-chips
                            filled
                            dense
                            hide-details
                            hide-input
                            v-model="item.photo"
                            prepend-icon="mdi-image"
                          ></v-file-input>
                        </td> -->
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
    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import DataTableComponent from "@/components/DataTableComponent";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import MemberSearchDialogComponent from "@/components/MemberSearchDialogComponent.vue";
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
              },
  data(){
    return{
      login_id:'',
      member_dialog: false,
      add_self: false,
      select_product: true,
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
      product_inbound_data: [],
      product_inbound_data_added: [],
      member_type_index:0,
      type_list:InboundRegisterPageConfig.type_list,
      inbound_member_info:InboundRegisterPageConfig.inbound_member_info,
      inbound_confirmation_data: InboundRegisterPageConfig.inbound_confirmation_data,
      searchCardInputs:InboundRegisterPageConfig.searchCardInputs,
      inboundCardInfoInputs:InboundRegisterPageConfig.inboundCardInfoInputs,
      product_inbound_headers:InboundRegisterPageConfig.product_inbound_headers,
      product_search_headers:InboundRegisterPageConfig.product_search_headers,
      product_search_data:[],
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
        let result = await mux.Server.post({
          path: '/api/sample_rest_api/',
          "params": [

          ],
          "script_file_name": "완제품_검색_24_05_01_12_45_GC6.json",
          "script_file_path": "data_storage_pion\\json_sql\\stock\\10_완제품_검색\\완제품_검색_24_05_01_12_45_GC6"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        this.classification_list = result;

        result = await mux.Server.post({
          path: '/api/sample_rest_api/',
          "params": [

          ],
          "script_file_name": "제조사목록전체검색.json",
          "script_file_path": "data_storage_pion\\json_sql\\stock\\10_완제품_검색\\제조사목록전체검색"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        this.manufacturer_list = result;

        result = await mux.Server.post({
          path: '/api/sample_rest_api/',
          "params": [

          ],
          "script_file_name": "자재위치목록전체검색.json",
          "script_file_path": "data_storage_pion\\json_sql\\stock\\10_완제품_검색\\자재위치목록전체검색"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        this.spot_list = result;

      } catch (error) {
        if (prevURL !== window.location.href) return;
        alert(error);
      }

      mux.List.addProductBasicInfoLists(this.searchCardInputs, this.classification_list, this.manufacturer_list);
      mux.Rules.rulesSet(this.inboundCardInfoInputs);

      try {
        console.log('사용자 계정 정보 가졍오기');
        let result = await mux.Server.get({
          path: '/api/user/',
        });
        if (prevURL !== window.location.href) return;
        console.log('result :>> ', result);
        this.inbound_member_info[0].name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.inbound_member_info[0].email =  this.$cookies.get(this.$configJson.cookies.email.key);
      } catch (error) {
        if (prevURL !== window.location.href) return;
        alert(error);
      }

      this.members_list.forEach(mem => {
        if(this.inbound_member_info[0].name === mem.name && this.inbound_member_info[0].email === mem.email){
          this.inbound_member_info[0].user_id = mem.user_id;
          this.login_id = mem.user_id
        }
      })


    },
    searchProduct(){
      this.product_search_data = InboundRegisterPageConfig.test_product_search_data
    },
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    addProductInboundData(){
      if(this.add_self == false){
        alert('직접 입력형으로 전환되며 위에서 선택한 자재는 선택 해제됩니다. ');
        this.product_inbound_data = [];
        this.select_product = false;
      }
      this.add_self = true;
      this.product_inbound_data.push({
        product_type:'',
        product_classification:'',
        product_code: '',
        product_name: '',
        inbound_num: '',
        spot: '',
        product_spec: '',
        product_model: '',
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
      this.add_self = false;
    },
    setSpotAtOnce(){
      this.product_inbound_data.forEach(data =>{
        data.spot = this.set_spot_selected
      })
    },
    inboundApprovalRequest(){
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
                  item[Object.keys(item)[i]] = data.value.name;
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
        if(this.add_self){
          item.add_data = "직접기입형"
        }else{
          item.add_data = "선택형"
        }

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
                item.checked_date = mux.Date.format(this.today, 'yyyy-MM-dd');
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
                if(Object.keys(data)[add] != 'product_model' && Object.values(data)[add] === ''){
                  alert('모델을 제외한 모든 정보가 기입되어야 합니다.');
                  return success = false;
                }
              }
            })
          }
        }

        if(success == true){
          console.log('입고 정보 : ' + JSON.stringify(item));
          console.log('입고 제품 : ' + JSON.stringify(inbound_product_data));
          alert('요청이 완료되었습니다.');
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
      this.member_dialog = false
    },
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
