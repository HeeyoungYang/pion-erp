<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :backDataMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
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

export default {
  components: {
    NavComponent,
    ModalDialogComponent,
    DataTableComponent,
    InputsFormComponent,
  },
  data() {
    return {
      tab_main: null,
      tab_items:['노무비 산출 정보', '시중노임단가 정보', '산출비율 정보'],
      search_labor: '',
      search_wage: '',
      search_ratio: '',
      laborDialog: false,
      DialogDelete: false,
      wageDialog: false,
      ratioDialog: false,
      // wageDialogDelete: false,
      occupation_list:[],
      registLaborInputs:[
        {label:'품번', column_name:'no',  col:'12', sm:'6', lg:'6', value: '',
          rules: [
            v => !!v || '품번 입력',
          ]
        },
        {label:'공종', column_name:'name',  col:'12', sm:'6', lg:'6', value: '',
          rules: [
            v => !!v || '공종 입력',
          ]
        },
        {label:'규격', column_name:'type',  col:'12', sm:'6', lg:'6', value: '',
          rules: [
            v => !!v || '규격 입력',
          ]
        },
        {label:'직종', column_name:'occupation', type:'select', list:[], value:'', col:'12', sm:'6', lg:'6',
          rules: [
            v => !!v || '직종 선택',
          ]
        },
        {label:'공량(M/D)', column_name:'man_per_day', text_type:'number', col:'12', sm:'6', lg:'6', value: '',
          rules: [
            v => !!v || '공량 입력(숫자)',
          ]
        },
        {label:'할증율', column_name:'surcharge_ratio', text_type:'number', col:'12', sm:'6', lg:'6', value: '', suffix: '%',
          rules: [
            v => !!v || '할증율 입력(숫자)',
          ]
        },
      ],
      registWageInputs:[
        {label:'직종', column_name:'occupation', value:'', col:'12', sm:'6', lg:'6',
          rules: [
            v => !!v || '직종 입력',
          ]
        },
        {label:'단가', column_name:'unit_price', text_type:'number',  col:'12', sm:'6', lg:'6', value: '',
          rules: [
            v => !!v || '단가 입력(숫자)',
          ]
        },
        {label:'설계 조정율', column_name:'adjustment_ratio', text_type:'number', col:'12', sm:'6', lg:'6', value: '',
          rules: [
            v => !!v || '설계 조정율 입력(숫자)',
          ]
        },
      ],
      registRatioInputs:[
        {label:'종류', column_name:'type', value:'', col:'12', sm:'12', lg:'12',},
        {label:'', column_name:'formula1', col:'12', sm:'6', lg:'6', value: '', suffix: 'X',},
        {label:'', column_name:'formula2', col:'12', sm:'3', lg:'3', value: '', suffix: '',
          rules: [
            v => !!v || '백분율(%) 혹은 숫자 입력',
          ]
        },
      ],
      labor_headers: [
        { text: '품번', align: 'center', value: 'no'},
        { text: '공종', align: 'center', value: 'name', },
        { text: '규격', align: 'center', value: 'type', },
        { text: '직종', align: 'center', value: 'occupation', },
        { text: '공량(M/D)', align: 'center', value: 'man_per_day', },
        { text: '할증율', align: 'center', value: 'surcharge_ratio', },
      ],
      wage_headers: [
        { text: '직종', align: 'center', value: 'occupation'},
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '설계 조정률', align: 'center', value: 'adjustment_ratio', },
      ],
      ratio_headers: [
        { text: '종류', align: 'center', value: 'type'},
        { text: '계산식', align: 'center', value: 'formula', },
      ],
      labor_data: [],
      wage_data: [],
      ratio_data: [],
      editedLaborIndex: -1,
      editedLaborItem: {
        code:'',
        no:'',
        name: '',
        type: '',
        occupation: '',
        man_per_day: '',
        surcharge_ratio: '',
      },
      defaultLaborItem: {
        code:'',
        no:'',
        name: '',
        type: '',
        man_per_day: '',
        surcharge_ratio: '',
      },
      editedWageIndex: -1,
      editedWageItem: {
        occupation:'',
        unit_price: '',
        adjustment_ratio: '',
      },
      defaultWageItem: {
        occupation:'',
        unit_price: '',
        adjustment_ratio: '',
      },
      editedRatioIndex: -1,
      editedRatioItem: {
        type:'',
        formula: '',
        ratio: '',
      },
      defaultRatioItem: {
        type:'',
        formula: '',
        ratio: '',
      },
      deleteDataList:{},
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
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.labor_data = [
          {
            code:'code1',
            no:'품-1',
            name:'고압케이블 포설',
            type:'240㎟, 1C',
            occupation:'고압 케이블전공',
            man_per_day:'0.136',
            surcharge_ratio:'115%',
          },
          {
            code:'code2',
            no:'품-2',
            name:'저압케이블 포설',
            type:'6㎟, 2C',
            occupation:'저압 케이블전공',
            man_per_day:'0.018',
            surcharge_ratio:'120%',
          },
          {
            code:'code3',
            no:'품-2',
            name:'저압케이블 포설',
            type:'2.5㎟, 6C',
            occupation:'저압 케이블전공',
            man_per_day:'0.035',
            surcharge_ratio:'120%',
          },
          {
            code:'code4',
            no:'품-3',
            name:'전력케이블 단말처리',
            type:'240㎟, 1C',
            occupation:'ALL',
            man_per_day:'1.170',
            surcharge_ratio:'120%',
          },
          {
            code:'code5',
            no:'품-4',
            name:'Cubicle 설치',
            type:'6㎥, 1.5 Ton이하',
            occupation:'비계공',
            man_per_day:'2.00',
            surcharge_ratio:'100%',
          },
          {
            code:'code6',
            no:'품-4',
            name:'Cubicle 설치',
            type:'6㎥, 1.5 Ton이하',
            occupation:'변전전공',
            man_per_day:'4.05',
            surcharge_ratio:'100%',
          },
          {
            code:'code7',
            no:'품-4',
            name:'Cubicle 설치',
            type:'6㎥, 1.5 Ton이하',
            occupation:'보통인부',
            man_per_day:'3.3',
            surcharge_ratio:'100%',
          },
          {
            code:'code8',
            no:'품-4',
            name:'Cubicle 설치',
            type:'10㎥이하,3 Ton이하',
            occupation:'비계공',
            man_per_day:'4.00',
            surcharge_ratio:'100%',
          },
          {
            code:'code9',
            no:'품-4',
            name:'Cubicle 설치',
            type:'10㎥이하,3 Ton이하',
            occupation:'변전전공',
            man_per_day:'7.05',
            surcharge_ratio:'100%',
          },
          {
            code:'code10',
            no:'품-4',
            name:'Cubicle 설치',
            type:'10㎥이하,3 Ton이하',
            occupation:'보통인부',
            man_per_day:'5.6',
            surcharge_ratio:'100%',
          },
          {
            code:'code11',
            no:'품-5',
            name:'전기실 전원 케이블 포설',
            type:'50sq, 3C',
            occupation:'저압 케이블전공',
            man_per_day:'0.043',
            surcharge_ratio:'200%',
          },
          {
            code:'code12',
            no:'품-6',
            name:'케이블 트레이',
            type:'단면적 50,000㎟ 이하',
            occupation:'내선전공',
            man_per_day:'0.200',
            surcharge_ratio:'144%',
          },
          {
            code:'code13',
            no:'품-6',
            name:'케이블 트레이',
            type:'단면적 30,000㎟ 이하',
            occupation:'내선전공',
            man_per_day:'0.16',
            surcharge_ratio:'144%',
          },
          {
            code:'code14',
            no:'품-7',
            name:'통신케이블 포설',
            type:'지중 인력견인 포설',
            occupation:'보통인부',
            man_per_day:'1.410',
            surcharge_ratio:'100%',
          },
      ]
      this.wage_data = [
          {
            occupation:'저압 케이블전공',
            unit_price: '290333',
            adjustment_ratio: '1.0000',
          },
          {
            occupation:'고압 케이블전공',
            unit_price: '353395',
            adjustment_ratio: '1.0000',
          },
          {
            occupation:'비계공',
            unit_price: '281721',
            adjustment_ratio: '1.0000',
          },
          {
            occupation:'변전전공',
            unit_price: '451145',
            adjustment_ratio: '1.0000',
          },
          {
            occupation:'보통인부',
            unit_price: '161858',
            adjustment_ratio: '1.0000',
          },
          {
            occupation:'내선전공',
            unit_price: '269968',
            adjustment_ratio: '1.0000',
          },
      ]
      this.ratio_data = [
          {
            type:'간접 노무비',
            formula:'직접노무비X12.2%'
          },
          {
            type:'고용보험료',
            formula:'노무비X1.01%'
          },
          {
            type:'공구손료',
            formula:'직접노무비X3%'
          },
          {
            type:'여비교통 통신비',
            formula:'노무비X0.418%'
          },
          {
            type:'산재보험료',
            formula:'노무비X3.7%'
          },
          {
            type:'세금과공과',
            formula:'노무비X0.13%'
          },
          {
            type:'복리후생비',
            formula:'노무비X2.397%'
          },
          {
            type:'퇴직공제 부금비',
            formula:'직접노무비X2.3%'
          },
          {
            type:'소모품비',
            formula:'노무비X1.479%'
          },
          {
            type:'산업안전보건관리비',
            formula:'직접노무비X1.85%X1.2'
          },
          {
            type:'일반관리비',
            formula:'(재료비+노무비+경비)X6%'
          },
          {
            type:'이윤',
            formula:'(노무비+경비+일반관리비)X15%'
          },
      ]

      this.occupation_list.push('All');
      for(let d=0; d<this.wage_data.length; d++){
        this.occupation_list.push(this.wage_data[d].occupation)
      }
      this.registLaborInputs.forEach(data =>{
        if(data.column_name == 'occupation'){
          data.list = this.occupation_list;
        }
      })
      this.registWageInputs.forEach(data =>{
        if(data.column_name == 'occupation'){
          data.list = this.occupation_list;
        }
      })
    },
    registLaborItem(item){
      this.editedLaborIndex = this.labor_data.indexOf(item)
      let labor_input = this.registLaborInputs;
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

    uploadLaborItem () {
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

        if(this.editedLaborIndex === -1){ // editedIndex가 -1이면 등록
          this.editedLaborItem.creater = 'user_id';
          alert('등록이 완료되었습니다.');
        }else{// 아니라면 수정
          this.editedLaborItem.modifier = 'user_id';
          alert('수정이 완료되었습니다.');
        }
      }
    },
    editWageItem (item) {
      this.editedWageIndex = this.wage_data.indexOf(item)
      // this.editedWageItem = Object.assign({}, item)
      let wage_input = this.registWageInputs;
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
      wage_input.forEach(data =>{
        if(data.column_name == 'occupation'){
          data.disabled = false
        }
        data.value = '';
      })
      this.wageDialog = true

    },
    uploadWageItem () {
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

        if(this.editedLaborIndex === -1){ // editedIndex가 -1이면 등록
          this.editedLaborItem.creater = 'user_id';
        }else{// 아니라면 수정
          this.editedLaborItem.modifier = 'user_id';
        }
      }
    },

    editRatioItem (item) {
      this.editedRatioIndex = this.ratio_data.indexOf(item)
      let ratio_input = this.registRatioInputs;
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
    uploadRatioItem () {
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
        item.modifier = 'user_id';
        console.log('수정된 정보 : ' + JSON.stringify(item));
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

    deleteItemConfirm () {
      this.deleteDataList = {};
      this.deleteDataList.modifier = 'user_id';

      if(this.tab_main == 0){
        this.deleteDataList.code = this.editedLaborItem.code;
        console.log('노무비 정보 삭제 : ' + JSON.stringify(this.deleteDataList));
        this.labor_data.splice(this.editedLaborIndex, 1)
      }else if(this.tab_main == 1){
        this.deleteDataList.occupation = this.editedWageItem.occupation;
        console.log('시중노임단가 정보 삭제 : ' + JSON.stringify(this.deleteDataList));
        this.wage_data.splice(this.editedWageIndex, 1)
      }

      // 삭제 요청 = this.deleteDataList

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
