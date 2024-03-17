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
            <!-- ▼ 노무비 산철 정보 -->
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
                        @save="save"
                      >
                        <template v-slot:activator>
                          <v-btn color="primary" outlined class="mb-2 float-right" @click="laborDialog = true">정보 추가</v-btn>
                        </template>
                        <v-container>
                          <v-row>
                            <v-col
                              cols="12"
                              sm="6"
                              md="6"
                            >
                              <v-text-field
                                v-model="editedLaborItem.labor_no"
                                label="품번"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="6"
                              md="6"
                            >
                              <v-text-field
                                v-model="editedLaborItem.labor_contract_name"
                                label="공종"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="6"
                              md="6"
                            >
                              <v-text-field
                                v-model="editedLaborItem.labor_contract_type"
                                label="규격"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="6"
                              md="6"
                            >
                              <v-text-field
                                v-model="editedLaborItem.labor_man_day"
                                label="공량(M/D)"
                                type="number"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="6"
                              md="6"
                            >
                              <v-text-field
                                v-model="editedLaborItem.labor_surcharge_rate"
                                label="할증율"
                                type="number"
                                suffix="%"
                              ></v-text-field>
                            </v-col>
                          </v-row>
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
                  @delete="deleteLaborItem"
                >
                </DataTableComponent>
                <ModalDialogComponent
                  :dialog-value="laborDialogDelete"
                  max-width="300px"
                  title-class="text-body-1 font-weight-black"
                  text-class="text-body-2"
                  save-text="삭제"
                  close-text="취소"
                  @save="deleteItemConfirm"
                  @close="closeDelete"
                >
                  <template v-slot:titleHTML>
                    <p class="mb-0">{{ editedLaborItem.labor_contract_name }}</p>
                    <p class="red--text">삭제하시겠습니까?</p>
                  </template>
                  삭제된 시 복구 불가능합니다.
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
                        @save="save"
                      >
                        <template v-slot:activator>
                          <v-btn color="primary" outlined class="mb-2 float-right" @click="wageDialog = true">정보 추가</v-btn>
                        </template>
                        <v-container>
                          <v-row>
                            <v-col
                              cols="12"
                              sm="6"
                              md="4"
                            >
                              <v-text-field
                                v-model="editedWageItem.wage_occupation"
                                label="직종"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="6"
                              md="4"
                            >
                              <v-text-field
                                v-model="editedWageItem.wage_unit_price"
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
                                v-model="editedWageItem.wage_adjustment_rate"
                                label="설계 조정율"
                                type="number"
                              ></v-text-field>
                            </v-col>
                          </v-row>
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
                  @delete="deleteWageItem"
                >
                </DataTableComponent>
                <ModalDialogComponent
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
                    <p class="mb-0">{{ editedWageItem.wage_occupation }}</p>
                    <p class="red--text">삭제하시겠습니까?</p>
                  </template>
                  삭제된 시 복구 불가능합니다.
                </ModalDialogComponent>
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

export default {
  components: {
    NavComponent,
    ModalDialogComponent,
    DataTableComponent,
  },
  data() {
    return {
      tab_main: null,
      tab_items:['노무비 산출 정보', '시중노임단가 정보'],
      search_labor: '',
      search_wage: '',
      laborDialog: false,
      laborDialogDelete: false,
      wageDialog: false,
      wageDialogDelete: false,
      labor_headers: [
        { text: '품번', align: 'center', value: 'labor_no'},
        { text: '공종', align: 'center', value: 'labor_contract_name', },
        { text: '규격', align: 'center', value: 'labor_contract_type', },
        { text: '공량(M/D)', align: 'center', value: 'labor_man_day', },
        { text: '할증율', align: 'center', value: 'labor_surcharge_rate', },
      ],
      wage_headers: [
        { text: '직종', align: 'center', value: 'wage_occupation'},
        { text: '단가', align: 'center', value: 'wage_unit_price', },
        { text: '설계 조정률', align: 'center', value: 'wage_adjustment_rate', },
      ],
      labor_data: [],
      wage_data: [],
      editedLaborIndex: -1,
      editedLaborItem: {
        labor_no:'',
        labor_contract_name: '',
        labor_contract_type: '',
        labor_man_day: '',
        labor_surcharge_rate: '',
      },
      defaultLaborItem: {
        labor_no:'',
        labor_contract_name: '',
        labor_contract_type: '',
        labor_man_day: '',
        labor_surcharge_rate: '',
      },
      editedWageIndex: -1,
      editedWageItem: {
        wage_occupation:'',
        wage_unit_price: '',
        wage_adjustment_rate: '',
      },
      defaultWageItem: {
        wage_occupation:'',
        wage_unit_price: '',
        wage_adjustment_rate: '',
      },
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
    laborDialogDelete (val) {
      val || this.closeDelete()
    },
    wageDialog (val) {
      val || this.close()
    },
    wageDialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.labor_data = [
          {
            labor_no:'품-1',
            labor_contract_name:'고압케이블 포설',
            labor_contract_type:'240㎟, 1C',
            labor_man_day:'0.136',
            labor_surcharge_rate:'115',
          },
          {
            labor_no:'품-2',
            labor_contract_name:'저압케이블 포설',
            labor_contract_type:'6㎟, 2C',
            labor_man_day:'0.018',
            labor_surcharge_rate:'120',
          },
          {
            labor_no:'품-2',
            labor_contract_name:'저압케이블 포설',
            labor_contract_type:'2.5㎟, 6C',
            labor_man_day:'0.035',
            labor_surcharge_rate:'120',
          },
          {
            labor_no:'품-3',
            labor_contract_name:'전력케이블 단말처리',
            labor_contract_type:'240㎟, 1C',
            labor_man_day:'1.170',
            labor_surcharge_rate:'120',
          },
          {
            labor_no:'품-4',
            labor_contract_name:'Cubicle 설치',
            labor_contract_type:'6㎥, 1.5 Ton이하',
            labor_man_day:'2.00',
            labor_surcharge_rate:'100',
          },
          {
            labor_no:'품-5',
            labor_contract_name:'전기실  전원 케이블 포설',
            labor_contract_type:'50sq, 3C',
            labor_man_day:'0.043',
            labor_surcharge_rate:'200',
          },
          {
            labor_no:'품-6',
            labor_contract_name:'케이블 트레이',
            labor_contract_type:'단면적 50,000㎟ 이하',
            labor_man_day:'0.200',
            labor_surcharge_rate:'144',
          },
          {
            labor_no:'품-7',
            labor_contract_name:'통신케이블 포설',
            labor_contract_type:'지중 인력견인 포설',
            labor_man_day:'1.410',
            labor_surcharge_rate:'100',
          },
      ]
      this.wage_data = [
          {
            wage_occupation:'저압 케이블전공',
            wage_unit_price: '290333',
            wage_adjustment_rate: '1.0000',
          },
          {
            wage_occupation:'고압 케이블전공',
            wage_unit_price: '353395',
            wage_adjustment_rate: '1.0000',
          },
          {
            wage_occupation:'비계공',
            wage_unit_price: '281721',
            wage_adjustment_rate: '1.0000',
          },
          {
            wage_occupation:'변전전공',
            wage_unit_price: '451145',
            wage_adjustment_rate: '1.0000',
          },
          {
            wage_occupation:'보통인부',
            wage_unit_price: '161858',
            wage_adjustment_rate: '1.0000',
          },
          {
            wage_occupation:'내선전공',
            wage_unit_price: '269968',
            wage_adjustment_rate: '1.0000',
          },
      ]
    },

    editLaborItem (item) {
      this.editedLaborIndex = this.labor_data.indexOf(item)
      this.editedLaborItem = Object.assign({}, item)
      this.laborDialog = true
    },

    editWageItem (item) {
      this.editedWageIndex = this.wage_data.indexOf(item)
      this.editedWageItem = Object.assign({}, item)
      this.wageDialog = true
    },

    deleteLaborItem (item) {
      this.editedLaborIndex = this.labor_data.indexOf(item)
      this.editedLaborItem = Object.assign({}, item)
      this.laborDialogDelete = true
    },
    deleteWageItem (item) {
      this.editedWageIndex = this.wage_data.indexOf(item)
      this.editedWageItem = Object.assign({}, item)
      this.wageDialogDelete = true
    },

    deleteItemConfirm () {
      this.labor_data.splice(this.editedLaborIndex, 1)
      this.wage_data.splice(this.editedWageIndex, 1)
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
      this.laborDialogDelete = false
      this.wageDialogDelete = false
      this.$nextTick(() => {
        this.editedLaborItem = Object.assign({}, this.defaultLaborItem)
        this.editedLaborIndex = -1
        this.editedWageItem = Object.assign({}, this.defaultWageItem)
        this.editedWageIndex = -1
      })
    },

    save () {
      if (this.editedLaborIndex > -1) {
        Object.assign(this.labor_data[this.editedLaborIndex], this.editedLaborItem)
      } else {
        this.labor_data.push(this.editedLaborItem)
      }
      if (this.editedWageIndex > -1) {
        Object.assign(this.wage_data[this.editedWageIndex], this.editedWageItem)
      } else {
        this.wage_data.push(this.editedWageItem)
      }
      this.close()
    },
  },
}
</script>

<style lang="">

</style>
