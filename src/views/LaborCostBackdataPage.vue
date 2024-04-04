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
                          <InputsFormComponent
                            clearable
                            hide-details
                            :inputs="registLaborInputs"
                          ></InputsFormComponent>
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
                          <InputsFormComponent
                            clearable
                            hide-details
                            :inputs="registWageInputs"
                          ></InputsFormComponent>
                          <!-- <v-row>
                            <v-col
                              cols="12"
                              sm="6"
                              md="4"
                            >
                              <v-text-field
                                v-model="editedWageItem.occupation"
                                label="직종"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="6"
                              md="4"
                            >
                              <v-text-field
                                v-model="editedWageItem.unit_price"
                                label="단가"
                                type="number"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="6"
                              md="4"
                            >
                              <v-text-field
                                v-model="editedWageItem.adjustment_ratio"
                                label="설계 조정율"
                                type="number"
                              ></v-text-field>
                            </v-col>
                          </v-row> -->
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
                  @edit="editWageItem"
                  @delete="deleteItem"
                >
                </DataTableComponent>
                <!-- <ModalDialogComponent
                  :dialog-value="wageDialogDelete"
                  max-width="300px"
                  title-class="text-body-1 font-weight-black"
                  text-class="text-body-2"
                  save-text="삭제"
                  close-text="취소"
                  @save="deleteItemConfirm"
                  @close="closeDelete"
                >
                  <template v-slot:titleHTML>
                    <p class="mb-0">{{ editedWageItem.occupation }}</p>
                    <p class="red--text">삭제하시겠습니까?</p>
                  </template>
                  삭제된 시 복구 불가능합니다.
                </ModalDialogComponent> -->
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
      tab_items:['노무비 산출 정보', '시중노임단가 정보'],
      search_labor: '',
      search_wage: '',
      laborDialog: false,
      DialogDelete: false,
      wageDialog: false,
      // wageDialogDelete: false,
      occupation_list:[],
      registLaborInputs:[
        {label:'품번', column_name:'no',  col:'12', sm:'6', lg:'6', value: '', },
        {label:'공종', column_name:'name',  col:'12', sm:'6', lg:'6', value: '', },
        {label:'규격', column_name:'type',  col:'12', sm:'6', lg:'6', value: '', },
        {label:'직종', column_name:'occupation', type:'select', list:[], value:'', col:'12', sm:'6', lg:'6',},
        {label:'공량(M/D)', column_name:'man_per_day', text_type:'number', col:'12', sm:'6', lg:'6', value: ''},
        {label:'할증율', column_name:'surcharge_ratio', text_type:'number', col:'12', sm:'6', lg:'6', value: '', suffix: '%'},
      ],
      registWageInputs:[
        {label:'직종', column_name:'occupation', type:'select', list:[], value:'', col:'12', sm:'6', lg:'6',},
        {label:'단가', column_name:'unit_price', text_type:'number',  col:'12', sm:'6', lg:'6', value: ''},
        {label:'설계 조정율', column_name:'adjustment_ratio', text_type:'number', col:'12', sm:'6', lg:'6', value: ''},
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
      labor_data: [],
      wage_data: [],
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
            surcharge_ratio:'115',
          },
          {
            code:'code2',
            no:'품-2',
            name:'저압케이블 포설',
            type:'6㎟, 2C',
            occupation:'저압 케이블전공',
            man_per_day:'0.018',
            surcharge_ratio:'120',
          },
          {
            code:'code3',
            no:'품-2',
            name:'저압케이블 포설',
            type:'2.5㎟, 6C',
            occupation:'저압 케이블전공',
            man_per_day:'0.035',
            surcharge_ratio:'120',
          },
          {
            code:'code4',
            no:'품-3',
            name:'전력케이블 단말처리',
            type:'240㎟, 1C',
            occupation:'ALL',
            man_per_day:'1.170',
            surcharge_ratio:'120',
          },
          {
            code:'code5',
            no:'품-4',
            name:'Cubicle 설치',
            type:'6㎥, 1.5 Ton이하',
            occupation:'비계공',
            man_per_day:'2.00',
            surcharge_ratio:'100',
          },
          {
            code:'code6',
            no:'품-4',
            name:'Cubicle 설치',
            type:'6㎥, 1.5 Ton이하',
            occupation:'변전전공',
            man_per_day:'4.05',
            surcharge_ratio:'100',
          },
          {
            code:'code7',
            no:'품-4',
            name:'Cubicle 설치',
            type:'6㎥, 1.5 Ton이하',
            occupation:'보통인부',
            man_per_day:'3.3',
            surcharge_ratio:'100',
          },
          {
            code:'code8',
            no:'품-4',
            name:'Cubicle 설치',
            type:'10㎥이하,3 Ton이하',
            occupation:'비계공',
            man_per_day:'4.00',
            surcharge_ratio:'100',
          },
          {
            code:'code9',
            no:'품-4',
            name:'Cubicle 설치',
            type:'10㎥이하,3 Ton이하',
            occupation:'변전전공',
            man_per_day:'7.05',
            surcharge_ratio:'100',
          },
          {
            code:'code10',
            no:'품-4',
            name:'Cubicle 설치',
            type:'10㎥이하,3 Ton이하',
            occupation:'보통인부',
            man_per_day:'5.6',
            surcharge_ratio:'100',
          },
          {
            code:'code11',
            no:'품-5',
            name:'전기실 전원 케이블 포설',
            type:'50sq, 3C',
            occupation:'저압 케이블전공',
            man_per_day:'0.043',
            surcharge_ratio:'200',
          },
          {
            code:'code12',
            no:'품-6',
            name:'케이블 트레이',
            type:'단면적 50,000㎟ 이하',
            occupation:'내선전공',
            man_per_day:'0.200',
            surcharge_ratio:'144',
          },
          {
            code:'code13',
            no:'품-6',
            name:'케이블 트레이',
            type:'단면적 30,000㎟ 이하',
            occupation:'내선전공',
            man_per_day:'0.16',
            surcharge_ratio:'144',
          },
          {
            code:'code14',
            no:'품-7',
            name:'통신케이블 포설',
            type:'지중 인력견인 포설',
            occupation:'보통인부',
            man_per_day:'1.410',
            surcharge_ratio:'100',
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
        if(data.column_name == 'name' || data.column_name == 'type' || data.column_name == 'no'){
          data.disabled = true
        }
        for(let i=0; i<Object.keys(item).length; i++){
          if(data.column_name == Object.keys(item)[i]){
            data.value = Object.values(item)[i];
          }
        }
      })
      this.laborDialog = true

    },

    uploadLaborItem () {
      let labor_input = this.registLaborInputs;
      let item = this.editedLaborItem;
      let no_data = [];
      labor_input.forEach(data =>{
        if(!data.value){
          no_data.push(data.label);
        }
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

      if(no_data.length > 0){
        alert(no_data+' 항목이 공란입니다. 정보를 기입해주세요.');
        return;
      }

      if(this.editedLaborIndex === -1){ // editedIndex가 -1이면 등록
        this.editedLaborItem.creater = 'user_id';
      }else{// 아니라면 수정
        this.editedLaborItem.modifier = 'user_id';
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
      let no_data = [];
      wage_input.forEach(data =>{
        if(!data.value){
          no_data.push(data.label);
        }
        for(let i=0; i<Object.keys(item).length; i++){
          if(data.column_name == Object.keys(item)[i]){
            item[Object.keys(item)[i]] = data.value;
          }
        }
      })

      if(no_data.length > 0){
        alert(no_data+' 항목이 공란입니다. 정보를 기입해주세요.');
        return;
      }

      if(this.editedLaborIndex === -1){ // editedIndex가 -1이면 등록
        this.editedLaborItem.creater = 'user_id';
      }else{// 아니라면 수정
        this.editedLaborItem.modifier = 'user_id';
      }
    },
    // deleteWageItem (item) {
    //   this.editedWageIndex = this.wage_data.indexOf(item)
    //   this.editedWageItem = Object.assign({}, item)
    //   this.wageDialogDelete = true
    // },

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
      this.$nextTick(() => {
        this.editedLaborItem = Object.assign({}, this.defaultLaborItem)
        this.editedLaborIndex = -1
        this.editedWageItem = Object.assign({}, this.defaultWageItem)
        this.editedWageIndex = -1
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
