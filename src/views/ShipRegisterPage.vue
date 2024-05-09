<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productMenu="true" :shipMenu="true"></NavComponent>

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
              <span>자재 선택</span>
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
                  @click="searchButton"
                >
                  <v-icon>mdi-magnify</v-icon>검색
                </v-btn>
              </v-col>
              <v-col cols="12">
                <DataTableComponent
                  dense
                  v-model="product_ship_data"
                  :headers="product_search_headers"
                  :items="product_search_data"
                  item-key="product_info"
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
              출고 정보 입력
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
                v-for="(member, i) in approve_member_info"
                :key="i"
                :color="member.name ? 'success' : 'default'"
                @click="selectMemberDialog(i)"
              >
                {{ member.type }} : {{ member.name }}
              </v-chip>

              <v-form ref="shipForm">
                <InputsFormComponent
                  dense
                  clearable
                  filled
                  hide-details
                  :inputs="shipCardInputs"
                  @dateSet = "dateSetImport"
                >
                </InputsFormComponent>
              </v-form>
              <v-row>
                  <v-col cols="12" sm="12" lg="12" align-self="center">
                    <v-btn
                      small
                      color="success"
                    class=" float-right"
                      @click="shipApprovalRequest"
                    >
                      출고 승인 요청
                    </v-btn>
                  </v-col>
                <v-col
                  cols="12"
                >
                  <v-data-table
                    dense
                    :headers="product_ship_headers"
                    :items="product_ship_data"
                    item-key="product_info"
                    class="elevation-1"
                  >
                    <template v-slot:item="{ item }">
                      <tr>
                        <td align="center">{{  item.type }}</td>
                        <td align="center">{{  item.classification }}</td>
                        <td align="center">{{  item.product_code }}</td>
                        <td align="center">{{  item.name }}</td>
                        <td align="center">
                          <v-text-field
                            dense
                            filled
                            hide-details
                            type="number"
                            style="max-width:150px"
                            v-model="item.ship_num"
                            @click="check_stock_num = item.stock_num"
                            :rules="shipNumRules"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">{{  item.model }}</td>
                        <td align="center">{{  item.spec }}</td>
                        <td align="center">{{  item.manufacturer }}</td>
                        <td align="center">{{  item.spot }}</td>
                        <td align="center">{{  item.stock_num }}</td>
                        <td align="center">{{  item.unit_price }}</td>
                        <td align="center">
                          <v-icon small color="default" style="cursor:pointer" @click="deleteShipDataRow(index)">mdi-minus-thick</v-icon>
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
import LoadingModalComponent from "@/components/LoadingModalComponent.vue";
import ShipRegisterPageConfig from "@/configure/ShipRegisterPageConfig.json";
import CheckPagePermission from "@/common_js/CheckPagePermission";
import mux from "@/mux";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=ShipRegisterPage')],
  components: {
                NavComponent,
                DataTableComponent,
                InputsFormComponent,
                CardComponent,
                MemberSearchDialogComponent,
                LoadingModalComponent,
              },
  mounted(){
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
    // this.closeAll()
  },
  data(){
    return{
      today:'',
      ship_date_set:'',
      select_product: true,
      dates: [],
      menu: false,
      member_dialog: false,
      loading_dialog: false,

      member_type_index:0,
      members_list:[],
      manufacturer_list:[],
      classification_list:[],

      product_ship_data: [],
      product_ship_data_added: [],
      shipNumRules: [
        v => !!( v <= this.check_stock_num) || '출하 수량 > 재고 수량',
      ],

      approve_member_info:ShipRegisterPageConfig.approve_member_info,
      searchCardInputs:ShipRegisterPageConfig.searchCardInputs,
      shipCardInputs:ShipRegisterPageConfig.shipCardInputs,
      ship_confirmation_data:ShipRegisterPageConfig.ship_confirmation_data,
      product_ship_headers:ShipRegisterPageConfig.product_ship_headers,
      product_search_headers:ShipRegisterPageConfig.product_search_headers,
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

      // this.manufacturer_list = ShipRegisterPageConfig.test_manufacturer_list;
      // this.classification_list = ShipRegisterPageConfig.test_classification_list;
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
      mux.Rules.rulesSet(this.shipCardInputs);

      try {
        // console.log('사용자 계정 정보 가졍오기');
        // let result = await mux.Server.get({
        //   path: '/api/user/',
        // });
        if (prevURL !== window.location.href) return;
        // console.log('result :>> ', result);
        this.approve_member_info[0].name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.approve_member_info[0].email =  this.$cookies.get(this.$configJson.cookies.email.key);
        this.approve_member_info[0].user_id =this.$cookies.get(this.$configJson.cookies.email.key);
        this.login_id = this.$cookies.get(this.$configJson.cookies.email.key);
      } catch (error) {
        if (prevURL !== window.location.href) return;
        alert(error);
      }

    },
    searchButton(){
      this.loading_dialog = true;
      this.product_search_data = ShipRegisterPageConfig.test_product_search_data;
      this.product_search_data.forEach(data => {
        data.product_info = data.product_code + '/' + data.spot
      })

      this.loading_dialog = false;
    },
    // eslint-disable-next-line no-unused-vars
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      // console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    selectMemberDialog(idx){
      this.member_type_index = idx
      this.member_dialog = true;
    },
    setMember(item){
      this.approve_member_info[this.member_type_index].name = item.name
      this.approve_member_info[this.member_type_index].user_id = item.user_id
      this.close();
    },
    members(data){
      this.members_list=data;
    },
    deleteShipDataRow(idx){
      if(this.product_ship_data.length === 1){
        alert('행이 한 개 이상 존재해야 합니다.')
      }else{
        this.product_ship_data.splice(idx, 1);
      }
    },
    shipApprovalRequest(){
      let ship_input = this.shipCardInputs;
      let member_input = this.approve_member_info;
      let item = this.ship_confirmation_data;
      let success = true;
      const validate = this.$refs.shipForm.validate();
      if(validate){
        ship_input.forEach(data => {
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
        item.ship_date = (this.ship_date_set === "" ? mux.Date.format(this.today, 'yyyy-MM-dd') : this.ship_date_set);
        item.creater = this.login_id;
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
            }
          }
        })

        if(empty_member.length > 0){
          alert(empty_member+"을(를) 선택해주세요.");
          return success = false;
        }

        let ship_product_data = this.product_ship_data
        if(ship_product_data.length === 0){
          alert('자재를 선택해주세요.');
          return success = false;
        }else{
          for(let d = 0; d < ship_product_data.length; d++){
            if(ship_product_data[d].ship_num == '' || ship_product_data[d].ship_num == undefined){
              alert('출고 수량 필수 입력');
              return success = false;
            }else if(ship_product_data[d].ship_num == 0){
                alert('출고수량은 0보다 커야합니다.');
                return success = false;
            }else if(ship_product_data[d].ship_num > ship_product_data[d].stock_num){
              alert('재고보다 출고 수량이 많습니다.');
              return success = false;
            }
          }
        }

        if(success == true){
          this.loading_dialog = true;
          // console.log('출고 정보 : ' + JSON.stringify(item));
          // console.log('출고 제품 : ' + JSON.stringify(ship_product_data));
          alert('요청이 완료되었습니다.');
          this.loading_dialog = false;
        }
      }
    },
    dateSetImport(item){
      this.ship_date_set = item
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
