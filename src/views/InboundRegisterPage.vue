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
          >
            <div slot="cardTitle">
              <span>자재 선택</span>
              <v-btn
                small
                color="success"
                class="mr-2 ml-4"
                @click="addProductInboundData"
                v-if="!add_self"
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
              <!-- <v-row>
                <v-col cols="12" sm="3">
                  <v-row>
                    <v-col>확인</v-col>
                    <v-col>김OO</v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" sm="3">
                  승인
                </v-col>
                <v-col cols="12" sm="3">
                  구매담당자
                </v-col>
                <v-col cols="12" sm="3">
                  자재담당자
                </v-col>
              </v-row> -->

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

              <InputsFormComponent
                dense
                clearable
                filled
                hide-details
                :inputs="inboundCardInfoInputs"
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
                  ></v-text-field>
                </v-col>
              </InputsFormComponent>
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
                        <td align="center">{{  item.photo }}</td>
                      </tr>
                      <tr v-else-if="add_self">
                        <td align="center">
                          <v-autocomplete
                            v-model="item.product_type"
                            :items="product_classification_list.slice(1)"
                            dense
                            filled
                            hide-details
                            style="width:150px"
                          ></v-autocomplete>
                        </td>
                        <td align="center">
                          <v-autocomplete
                            v-model="item.product_classification"
                            :items="product_type_list.slice(1)"
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
                        <td align="center">
                          <v-file-input
                            small-chips
                            filled
                            dense
                            hide-details
                            hide-input
                            v-model="item.photo"
                            prepend-icon="mdi-image"
                          ></v-file-input>
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
      member_dialog: false,
      add_self: false,
      select_product: true,
      dates: [],
      members_list:[],
      manufacturer_list:[],
      classification_list:[],
      menu: false,
      something_wrong:false,
      something_wrong_reason:'',
      set_spot_selected: '',
      something_wrong_radio: '이상 없음',
      product_inbound_data: [],
      product_inbound_data_added: [],
      member_type_index:0,
      inbound_member_info:[
        {type:'확인', name:'', user_id:'', email:''},
        {type:'승인', name:'', user_id:'', email:''},
        {type:'구매담당자', name:'', user_id:'', email:''},
        {type:'자재담당자', name:'', user_id:'', email:''},
      ],

      spot_list: InboundRegisterPageConfig.spot_list,
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
      this.manufacturer_list = InboundRegisterPageConfig.test_manufacturer_list;
      this.classification_list = InboundRegisterPageConfig.test_classification_list;
      mux.List.addProductBasicInfoLists(this.searchCardInputs, this.classification_list, this.manufacturer_list);

      try {
        console.log('사용자 계정 정보 가졍오기');
        let result = await mux.Server.get({
          path: '/api/user/',
        });
        console.log('result :>> ', result);
        this.inbound_member_info[0].name = result.data.UserAttributes.find(attr => attr.Name === 'given_name').Value;
        this.inbound_member_info[0].email = result.data.UserAttributes.find(attr => attr.Name === 'email').Value;
      } catch (error) {
        alert(error);
      }

      this.members_list.forEach(mem => {
        if(this.inbound_member_info[0].name === mem.name && this.inbound_member_info[0].email === mem.email){
          this.inbound_member_info[0].user_id = mem.user_id;
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
        this.product_inbound_headers.push(
          { text: '제외', align: 'center', value: 'photo', },
        )
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
        this.product_inbound_headers.pop();
      }
      this.add_self = false;
    },
    setSpotAtOnce(){
      this.product_inbound_data.forEach(data =>{
        data.spot = this.set_spot_selected
      })
    },
    inboundApprovalRequest(){
      let inbound_data = this.product_inbound_data
      console.log('입고 데이터 : ' + JSON.stringify(inbound_data));
      alert('요청이 완료되었습니다.');
    },
    deleteInboundDataRow(idx){
      if(idx === 0){
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
