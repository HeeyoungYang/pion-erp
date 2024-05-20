<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :backDataMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <LoadingModalComponent :dialog-value="loading_dialog" hide-overlay></LoadingModalComponent>
      <v-row justify="center">
        <v-col cols="12" sm="8">
          <v-tabs
            v-model="tab_main"
            background-color="transparent"
          >
            <v-tab
              v-for="item in tab_items"
              :key="item"
            >
              {{ item }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab_main" class="pb-1">
            <!-- ▼ 노무비 산출 정보 -->
            <v-tab-item>
              <v-card elevation="1">
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <p class="float-left text-h6 font-weight-black mb-0">
                        <v-text-field
                          v-model="search_labor"
                          append-icon="mdi-magnify"
                          label="Search"
                          dense
                          single-line
                          hide-details
                        ></v-text-field>
                      </p>
                      <ModalDialogComponent
                        :dialog-value="laborDialog"
                        max-width="500px"
                        :title="formLaborTitle"
                        closeText="취소"
                        saveText="저장"
                        :persistent="true"
                        @close="close"
                        @save="uploadLaborItem"
                      >
                        <template v-slot:activator>
                          <v-btn color="primary" outlined class="mb-2 float-right" @click="registLaborItem">정보 추가</v-btn>
                        </template>
                        <v-container>
                            <!-- slot="cardText" -->
                          <v-form ref="laborForm">
                            <InputsFormComponent
                              clearable
                              :inputs="registLaborInputs"
                            ></InputsFormComponent>
                          </v-form>
                        </v-container>
                      </ModalDialogComponent>
                    </v-col>
                  </v-row>
                </v-card-text>
                <DataTableComponent
                  :headers="labor_headers"
                  :items="labor_data"
                  :search="search_labor"
                  editable
                  deletable
                  dense
                  @edit="editLaborItem"
                  @delete="deleteItem"
                  hide-default-footer
                  disable-pagination
                >
                </DataTableComponent>
                <ModalDialogComponent
                  :dialog-value="DialogDelete"
                  max-width="450px"
                  title-class="text-body-1 font-weight-black"
                  text-class="text-body-2"
                  save-text="삭제"
                  close-text="취소"
                  @save="deleteItemConfirm"
                  @close="closeDelete"
                >
                  <template v-slot:titleHTML>
                    <p class="mb-1" style="width: 100%;" v-if="tab_main == 0">
                      {{ editedLaborItem.name }} ( {{ editedLaborItem.type }} / {{ editedLaborItem.occupation }} )</p>
                    <p class="mb-1" style="width: 100%;" v-if="tab_main == 1">
                      {{ editedWageItem.occupation }}</p>
                    <p class="red--text">해당 정보를 삭제하시겠습니까?</p>
                  </template>
                  삭제 시 복구 불가능합니다.
                </ModalDialogComponent>
              </v-card>
            </v-tab-item>

            <!-- ▼ 시중노임단가 정보 -->
            <v-tab-item>

              <v-card elevation="1">
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <p class="float-left text-h6 font-weight-black mb-0">
                        <v-text-field
                          v-model="search_wage"
                          append-icon="mdi-magnify"
                          label="Search"
                          dense
                          single-line
                          hide-details
                        ></v-text-field>
                      </p>
                      <ModalDialogComponent
                        :dialog-value="wageDialog"
                        max-width="600px"
                        :title="formWageTitle"
                        closeText="취소"
                        saveText="저장"
                        :persistent="true"
                        @close="close"
                        @save="uploadWageItem"
                      >
                        <template v-slot:activator>
                          <v-btn color="primary" outlined class="mb-2 float-right" @click="registWageItem">정보 추가</v-btn>
                        </template>
                        <v-container>
                          <v-form ref="wageForm">
                            <InputsFormComponent
                              clearable
                              :inputs="registWageInputs"
                            ></InputsFormComponent>
                          </v-form>
                        </v-container>
                      </ModalDialogComponent>
                    </v-col>
                  </v-row>
                </v-card-text>
                <DataTableComponent
                  :headers="wage_headers"
                  :items="wage_data"
                  :search="search_wage"
                  editable
                  deletable
                  dense
                  hide-default-footer
                  disable-pagination
                  @edit="editWageItem"
                  @delete="deleteItem"
                >
                </DataTableComponent>
              </v-card>
            </v-tab-item>

            <!-- ▼ 산출비율 정보 -->
            <v-tab-item>
              <v-card elevation="1">
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <p class="float-left text-h6 font-weight-black mb-0">
                        <v-text-field
                          v-model="search_ratio"
                          append-icon="mdi-magnify"
                          label="Search"
                          dense
                          single-line
                          hide-details
                        ></v-text-field>
                      </p>
                      <ModalDialogComponent
                        :dialog-value="ratioDialog"
                        max-width="600px"
                        :title="formRatioTitle"
                        closeText="취소"
                        saveText="저장"
                        :persistent="true"
                        @close="close"
                        @save="uploadRatioItem"
                      >
                        <!-- <template v-slot:activator>
                          <v-btn color="primary" outlined class="mb-2 float-right" @click="registRatioItem">정보 추가</v-btn>
                        </template> -->
                        <v-container>
                          <v-form ref="ratioForm">
                            <InputsFormComponent
                              :inputs="registRatioInputs"
                            ></InputsFormComponent>
                          </v-form>
                          <p class="error--text">※ 백분율일 경우 '%' 기호 필수 입력(ex. 0.12%)</p>
                        </v-container>
                      </ModalDialogComponent>
                    </v-col>
                  </v-row>
                </v-card-text>
                <DataTableComponent
                  :headers="ratio_headers"
                  :items="ratio_data"
                  :search="search_ratio"
                  editable
                  dense
                  hide-default-footer
                  disable-pagination
                  @edit="editRatioItem"
                >
                </DataTableComponent>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>

<script>
import NavComponent from "@/components/NavComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent";
import DataTableComponent from "@/components/DataTableComponent";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import LaborCostBackDataPageConfig from "@/configure/LaborCostBackDataPageConfig.json";
import CheckPagePermission from "@/common_js/CheckPagePermission";
import mux from "@/mux";
import LoadingModalComponent from "@/components/LoadingModalComponent";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=LaborCostBackdataPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  components: {
    NavComponent,
    ModalDialogComponent,
    DataTableComponent,
    InputsFormComponent,
    LoadingModalComponent
  },
  data() {
    return {
      occupation_list:[],
      deleteDataList:{},

      //tabs
      tab_main: null,
      tab_items:LaborCostBackDataPageConfig.tab_items,

      //키워드 필터(검색)
      search_labor: '',
      search_wage: '',
      search_ratio: '',

      //Dialog
      laborDialog: false,
      DialogDelete: false,
      wageDialog: false,
      ratioDialog: false,
      // wageDialogDelete: false,


      //노무비 산출 정보
      labor_data: [],
      editedLaborIndex: -1,
      registLaborInputs:LaborCostBackDataPageConfig.registLaborInputs,
      labor_headers:LaborCostBackDataPageConfig.labor_headers,
      editedLaborItem: LaborCostBackDataPageConfig.editedLaborItem,
      defaultLaborItem:LaborCostBackDataPageConfig.defaultLaborItem,

      //시중노임단가 정보
      wage_data: [],
      editedWageIndex: -1,
      registWageInputs:LaborCostBackDataPageConfig.registWageInputs,
      wage_headers:LaborCostBackDataPageConfig.wage_headers,
      editedWageItem:LaborCostBackDataPageConfig.editedWageItem,
      defaultWageItem: LaborCostBackDataPageConfig.defaultWageItem,

      //산출비율 정보
      ratio_data: [],
      editedRatioIndex: -1,
      registRatioInputs:LaborCostBackDataPageConfig.registRatioInputs,
      ratio_headers: LaborCostBackDataPageConfig.ratio_headers,
      editedRatioItem: LaborCostBackDataPageConfig.editedRatioItem,
      defaultRatioItem: LaborCostBackDataPageConfig.defaultRatioItem,
    }
  },

  computed: {
    formLaborTitle () {
      return this.editedLaborIndex === -1 ? '정보 등록' : '정보 수정'
    },
    formLaborDisabled () {
      return this.editedLaborIndex === -1 ? false : true
    },
    formWageTitle () {
      return this.editedWageIndex === -1 ? '정보 등록' : '정보 수정'
    },
    formWageDisabled () {
      return this.editedWageIndex === -1 ? false : true
    },
    formRatioTitle () {
      return this.editedRatioIndex === -1 ? '정보 등록' : '정보 수정'
    },
    formRatioDisabled () {
      return this.editedRatioIndex === -1 ? false : true
    },
  },

  watch: {
    laborDialog (val) {
      val || this.close()
    },
    DialogDelete (val) {
      val || this.closeDelete()
    },
    wageDialog (val) {
      val || this.close()
    },
    ratioDialog (val) {
      val || this.close()
    },
    // wageDialogDelete (val) {
    //   val || this.closeDelete()
    // },
    wage_data: {
      handler(val) {
        if (!val){
          this.wage_data = [];
        }
        this.occupation_list = [];
        this.occupation_list.push('All');
        for(let d=0; d<this.wage_data.length; d++){
          this.occupation_list.push(this.wage_data[d].occupation)
        }
        this.registLaborInputs.find(data => data.column_name === 'occupation').list = this.occupation_list;
        this.registWageInputs.find(data => data.column_name === 'occupation').list = this.occupation_list;
      },
      deep: true
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    // eslint-disable-next-line no-unused-vars
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      // console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    async initialize () {

      this.loading_dialog = true;

      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/sample_rest_api/',
          "params": [
            {}
          ],
          "script_file_name": "rooting_원가_페이지_진입_24_05_20_10_42_VOT.json",
          "script_file_path": "data_storage_pion\\json_sql\\cost\\원가_페이지_진입_24_05_20_10_43_7F2"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0){
          const searchResult = result.data;

          this.labor_data = searchResult.labor_cost;
          this.wage_data = searchResult.labor_current_unit_price;
          this.ratio_data = searchResult.cost_ratio;

        }else{
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

    registLaborItem(item){
      this.editedLaborIndex = this.labor_data.indexOf(item)
      let labor_input = this.registLaborInputs;
      mux.Rules.rulesSet(labor_input);
      labor_input.forEach(data =>{
        if(data.column_name == 'name' || data.column_name == 'type' || data.column_name == 'no'){
          data.disabled = false
        }
        data.value = '';
      })
      this.laborDialog = true

    },
    editLaborItem (item) {
      this.editedLaborIndex = this.labor_data.indexOf(item)
      // this.editedLaborItem = Object.assign({}, item)
      let labor_input = this.registLaborInputs;
      mux.Rules.rulesSet(labor_input);
      labor_input.forEach(data =>{
        for(let i=0; i<Object.keys(item).length; i++){
          if(data.column_name == Object.keys(item)[i]){
            data.value = Object.values(item)[i];
          }
        }
        if(data.column_name == 'surcharge_ratio'){
          data.value = Number(data.value.replace('%', ''));
        }
        if(data.column_name == 'name' || data.column_name == 'type' || data.column_name == 'no'){
          data.disabled = true
        }
      })
      this.laborDialog = true

    },

    async uploadLaborItem () {
      let labor_input = this.registLaborInputs;
      let item = this.editedLaborItem;

      const validate = this.$refs.laborForm.validate();
      if(validate){
        labor_input.forEach(data =>{
          for(let i=0; i<Object.keys(item).length; i++){
            if(data.column_name == Object.keys(item)[i]){
              if(data.column_name == 'surcharge_ratio'){
                item[Object.keys(item)[i]] = data.value * 0.01;
              } else{
                item[Object.keys(item)[i]] = data.value;
              }
            }
          }
        })

        if (this.labor_data.find(x => x.name === item.name && x.type === item.type)) {
          alert('이미 등록된 공종 + 규격입니다.');
          return;
        }
        if(this.editedLaborIndex === -1){ // editedIndex가 -1이면 등록
          item.code = item.no + '/' + mux.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss.fff') + '/' + this.$cookies.get(this.$configJson.cookies.id.key);
          const prevURL = window.location.href;
          try {
            let sendData = {"labor_cost_table-insert": [
              {
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data":{
                  "code": item.code,
                  "no": item.no,
                  "name": item.name,
                  "type": item.type,
                  "occupation": item.occupation,
                  "man_per_day": item.man_per_day,
                  "surcharge_ratio": item.surcharge_ratio
                },
                "select_where": {"code": item.code},
                "rollback": "yes"
              }
            ]};
            let result = await mux.Server.post({
              path: '/api/sample_rest_api/',
              params: sendData
            });
            if (prevURL !== window.location.href) return;

            if (typeof result === 'string'){
              result = JSON.parse(result);
            }
            if(result['code'] == 0){
              // console.log('result :>> ', result);
              this.labor_data.push(item);
              alert('등록이 완료되었습니다.');
              this.laborDialog = false;
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
        }else{// 아니라면 수정
          const prevURL = window.location.href;
          try {
            let sendData = {"labor_cost_table-update": [
              {
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data":{
                  "no": item.no,
                  "name": item.name,
                  "type": item.type,
                  "occupation": item.occupation,
                  "man_per_day": item.man_per_day,
                  "surcharge_ratio": item.surcharge_ratio
                },
                "update_where": {"code": item.code},
                "rollback": "yes"
              }
            ]};
            let result = await mux.Server.post({
              path: '/api/sample_rest_api/',
              params: sendData
            });
            if (prevURL !== window.location.href) return;

            if (typeof result === 'string'){
              result = JSON.parse(result);
            }
            if(result['code'] == 0){
              // console.log('result :>> ', result);
              this.labor_data[this.editedLaborIndex] = JSON.parse(JSON.stringify(item));
              alert('수정이 완료되었습니다.');
              this.laborDialog = false;
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
        }
      }
    },
    editWageItem (item) {
      this.editedWageIndex = this.wage_data.indexOf(item)
      // this.editedWageItem = Object.assign({}, item)
      let wage_input = this.registWageInputs;
      mux.Rules.rulesSet(wage_input);
      wage_input.forEach(data =>{
        if(data.column_name == 'occupation'){
          data.disabled = true
        }
        for(let i=0; i<Object.keys(item).length; i++){
          if(data.column_name == Object.keys(item)[i]){
            data.value = Object.values(item)[i];
          }
        }
      })
      this.wageDialog = true
    },
    registWageItem(item){
      this.editedWageIndex = this.wage_data.indexOf(item)
      let wage_input = this.registWageInputs;
      mux.Rules.rulesSet(wage_input);
      wage_input.forEach(data =>{
        if(data.column_name == 'occupation'){
          data.disabled = false
        }
        data.value = '';
      })
      this.wageDialog = true

    },
    async uploadWageItem () {
      let wage_input = this.registWageInputs;
      let item = this.editedWageItem;
      const validate = this.$refs.wageForm.validate();

      if(validate){
        wage_input.forEach(data =>{
          for(let i=0; i<Object.keys(item).length; i++){
            if(data.column_name == Object.keys(item)[i]){
              item[Object.keys(item)[i]] = data.value;
            }
          }
        })

        if (this.wage_data.find(x => x.occupation === item.occupation)) {
          alert('이미 등록된 직종입니다.');
          return;
        }
        if(this.editedLaborIndex === -1){ // editedIndex가 -1이면 등록
          item.code = item.no + '/' + mux.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss.fff') + '/' + this.$cookies.get(this.$configJson.cookies.id.key);
          const prevURL = window.location.href;
          try {
            let sendData = {"labor_current_unit_price_table-insert": [
              {
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data":{
                  "occupation": item.occupation,
                  "unit_price": item.unit_price,
                  "adjustment_ratio": item.adjustment_ratio
                },
                "select_where": {"occupation": item.occupation},
                "rollback": "yes"
              }
            ]};
            let result = await mux.Server.post({
              path: '/api/sample_rest_api/',
              params: sendData
            });
            if (prevURL !== window.location.href) return;

            if (typeof result === 'string'){
              result = JSON.parse(result);
            }
            if(result['code'] == 0){
              // console.log('result :>> ', result);
              this.wage_data.push(item);
              alert('등록이 완료되었습니다.');
              this.wageDialog = false;
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
        }else{// 아니라면 수정
          const prevURL = window.location.href;
          try {
            let sendData = {"labor_current_unit_price_table-update": [
              {
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data":{
                  "unit_price": item.unit_price,
                  "adjustment_ratio": item.adjustment_ratio
                },
                "update_where": {"occupation": item.occupation},
                "rollback": "yes"
              }
            ]};
            let result = await mux.Server.post({
              path: '/api/sample_rest_api/',
              params: sendData
            });
            if (prevURL !== window.location.href) return;

            if (typeof result === 'string'){
              result = JSON.parse(result);
            }
            if(result['code'] == 0){
              // console.log('result :>> ', result);
              this.wage_data[this.editedWageIndex] = JSON.parse(JSON.stringify(item));
              alert('수정이 완료되었습니다.');
              this.wageDialog = false;
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
        }
      }
    },

    editRatioItem (item) {
      this.editedRatioIndex = this.ratio_data.findIndex(x => x.type === item.type);
      let ratio_input = this.registRatioInputs;
      mux.Rules.rulesSet(ratio_input);
      let split_formula = item.formula.split('X');
      item.formula1 = split_formula[0]
      item.formula2 = split_formula[1]
      item.formula3 = split_formula[2]

      if(split_formula.length == 3){
        ratio_input.push({label:'', column_name:'formula3', col:'12', sm:'3', lg:'3', value: '',
          rules: [
            v => !!v || '백분율(%) 혹은 숫자 입력',
          ]
        })
        ratio_input[2].suffix = 'X';
        ratio_input[2].sm = '3';
        ratio_input[2].lg = '3';
      }else{
        ratio_input.splice(3, 1)
        ratio_input[2].suffix = '';
        ratio_input[2].sm = '6';
        ratio_input[2].lg = '6';
      }
      ratio_input.forEach(data =>{
        if(data.column_name == 'type' || data.column_name == 'formula1'){
          data.disabled = true
        }
        for(let i=0; i<Object.keys(item).length; i++){
          if(data.column_name == Object.keys(item)[i]){
            data.value = Object.values(item)[i];
          }
        }
      })
      this.ratioDialog = true
    },
    async uploadRatioItem () {
      let ratio_input = this.registRatioInputs;
      let item = this.editedRatioItem;
      const validate = this.$refs.ratioForm.validate();
      let formula;
      if(validate){
        ratio_input.forEach(data =>{
          if(data.column_name == 'type'){
            item.type = data.value;
          }else if(data.column_name == 'formula1'){
            formula = data.value;
          }else if(data.column_name == 'formula2' || data.column_name == 'formula3'){
            formula = formula+'X'+data.value;
          }
        })

        let split_formula = formula.split('X');
        for(let i=1; i<split_formula.length; i++){
          let percent = split_formula[i].indexOf('%')
          if(percent > -1){
            let replace_percent = split_formula[i].replace('%', '');
            let change_percent = Math.round((replace_percent * 0.01) * 10000000) / 10000000;
            split_formula.splice(i, 1, change_percent);
          }
        }

        if(split_formula.length == 2){
          item.ratio = split_formula[1]
        }else{
          item.ratio =  Math.round((split_formula[1] * split_formula[2]) * 10000000) / 10000000;
        }

        item.formula = formula;
        // console.log('수정된 정보 : ' + JSON.stringify(item));
        const prevURL = window.location.href;
        try {
          let sendData = {"cost_ratio_table-update": [
            {
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "modifier"
              },
              "data":{
                "formula": item.formula,
                "ratio": item.ratio
              },
              "update_where": {"type": item.type},
              "rollback": "yes"
            }
          ]};
          let result = await mux.Server.post({
            path: '/api/sample_rest_api/',
            params: sendData
          });
          if (prevURL !== window.location.href) return;

          if (typeof result === 'string'){
            result = JSON.parse(result);
          }
          if(result['code'] == 0){
            // console.log('result :>> ', result);
            this.ratio_data[this.editedRatioIndex] = {type: item.type, formula: item.formula};
            this.ratio_data = JSON.parse(JSON.stringify(this.ratio_data));
            alert('수정이 완료되었습니다.');
            this.ratioDialog = false;
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
      }
    },

    deleteItem (item) {
      if(this.tab_main == 0){
        this.editedLaborIndex = this.labor_data.indexOf(item)
        this.editedLaborItem = Object.assign({}, item)
      }else if(this.tab_main == 1){
        this.editedWageIndex = this.wage_data.indexOf(item)
        this.editedWageItem = Object.assign({}, item)
      }
      this.DialogDelete = true
    },

    async deleteItemConfirm () {
      this.deleteDataList = {};

      if(this.tab_main == 0){
        this.deleteDataList.code = this.editedLaborItem.code;
        // console.log('노무비 정보 삭제 : ' + JSON.stringify(this.deleteDataList));
        const prevURL = window.location.href;
        try {
          let sendData = {"labor_cost_table-delete": [
            {
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "modifier"
              },
              "data":{},
              "delete_where": {"code": this.deleteDataList.code},
              "rollback": "yes"
            }
          ]};
          let result = await mux.Server.post({
            path: '/api/sample_rest_api/',
            params: sendData
          });
          if (prevURL !== window.location.href) return;

          if (typeof result === 'string'){
            result = JSON.parse(result);
          }
          if(result['code'] == 0){
            // console.log('result :>> ', result);
            this.labor_data.splice(this.editedLaborIndex, 1);
            alert('삭제가 완료되었습니다.');
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
      }else if(this.tab_main == 1){
        this.deleteDataList.occupation = this.editedWageItem.occupation;
        // console.log('시중노임단가 정보 삭제 : ' + JSON.stringify(this.deleteDataList));
        const prevURL = window.location.href;
        try {
          let sendData = {"labor_current_unit_price_table-delete": [
            {
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "modifier"
              },
              "data":{},
              "delete_where": {"occupation": this.deleteDataList.occupation},
              "rollback": "yes"
            }
          ]};
          let result = await mux.Server.post({
            path: '/api/sample_rest_api/',
            params: sendData
          });
          if (prevURL !== window.location.href) return;

          if (typeof result === 'string'){
            result = JSON.parse(result);
          }
          if(result['code'] == 0){
            // console.log('result :>> ', result);
            this.wage_data.splice(this.editedWageIndex, 1);
            alert('삭제가 완료되었습니다.');
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
      }

      this.closeDelete()
    },

    close () {
      this.laborDialog = false
      this.wageDialog = false
      this.ratioDialog = false
      this.$nextTick(() => {
        this.editedLaborItem = Object.assign({}, this.defaultLaborItem)
        this.editedLaborIndex = -1
        this.editedWageItem = Object.assign({}, this.defaultWageItem)
        this.editedWageIndex = -1
        this.editedRatioItem = Object.assign({}, this.defaultRatioItem)
        this.editedRatioIndex = -1
      })
    },

    closeDelete () {
      this.DialogDelete = false
      this.$nextTick(() => {
        this.editedLaborItem = Object.assign({}, this.defaultLaborItem)
        this.editedLaborIndex = -1
        this.editedWageItem = Object.assign({}, this.defaultWageItem)
        this.editedWageIndex = -1
      })
    },
  },
}
</script>

<style lang="">

</style>
