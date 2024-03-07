<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :backDataMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
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
        <v-tab-item>
          <v-row justify="center">
            <v-col cols="12">
              <v-card elevation="1">
                <v-card-title style="width:100%;">
                  <v-row>
                    <v-col cols="12">
                      <p class="float-left text-h6 font-weight-black mb-0">
                        <v-text-field
                          v-model="search"
                          append-icon="mdi-magnify"
                          label="Search"
                          dense
                          single-line
                          hide-details
                        ></v-text-field>
                      </p>
                      <!-- ▼ 계정 추가 버튼 혹은 수정 아이콘(연필모양) 클릭 시 노출되는 Dialog(모달) -->
                      <ModalDialogComponent
                        :dialog-value="dialog"
                        max-width="700px"
                        :title="formTitle"
                        closeText="취소"
                        saveText="저장"
                        :persistent="true"
                        @close="close"
                        @save="save"
                      >
                        <template v-slot:activator>
                          <!-- ▼ 계정 추가 버튼 -->
                          <v-btn color="primary" small class="mb-2 mr-2 float-right" @click="dialog = true">등록</v-btn>
                          <v-btn color="primary" small outlined class="mb-2 float-right" @click="dialog_excel = true">엑셀 업로드</v-btn>
                        </template>
                        <!-- ▼ 버튼 혹은 아이콘 클릭 시 노출되는 모달 창 내용 -->
                        <v-container>
                          <!-- 모달 내용 구성 -->
                          <v-row>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedProductItem.product_type"
                                label="분류"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedProductItem.product_outsourcing"
                                label="외주"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedProductItem.product_code"
                                label="관리코드"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedProductItem.product_name"
                                label="자재명"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedProductItem.product_model"
                                label="모델명"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedProductItem.product_spec"
                                label="사양"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedProductItem.manufacturer"
                                label="제조사"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedProductItem.unit_price"
                                label="단가"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                            <v-file-input
                              small-chips
                              label="사진"
                            ></v-file-input>
                            </v-col>
                          </v-row>
                        </v-container>
                      </ModalDialogComponent>
                    </v-col>
                  </v-row>
                </v-card-title>

                <!-- ▼ 구분선 -->
                <v-divider></v-divider>

                <!-- ▼ 키워드 검색 영역 (Vuetify Datatable 기능 사용)-->
                <!-- 이 부분은 원래 코드와 동일하게 유지됩니다 -->

                <!-- ▼ 시스템 전체 계정(임직원) 테이블 (Vuetify Datatable 사용)-->
                <v-data-table
                  :headers="product_headers"
                  :items="product_data"
                  :search="search"
                  actionsSlotName="actions"
                  :edited-item="editedProductItem"
                >
                  <template v-slot:[`item.actions`]="{ item }">
                    <!-- ▼ 수정 아이콘(연필) -->
                    <v-icon small class="mr-2" @click="editItem(item, 'product')">mdi-pencil</v-icon>
                    <!-- ▼ 삭제 아이콘(휴지통) -->
                    <v-icon small @click="deleteItem(item, 'product')">mdi-delete</v-icon>
                  </template>
                </v-data-table>
                <ModalDialogComponent
                  :dialog-value="dialogDelete"
                  max-width="350px"
                  title-class="text-body-1 font-weight-black"
                  text-class="text-body-2"
                  save-text="삭제"
                  close-text="취소"
                  @save="deleteItemConfirm('product')"
                  @close="closeDelete"
                >
                  <template v-slot:titleHTML>
                    <p class="mb-0">{{ editedProductItem.product_code }}</p>
                    <p class="red--text">자재를 삭제하시겠습니까?</p>
                  </template>
                  삭제 시 복구 불가능합니다.
                </ModalDialogComponent>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>

        <v-tab-item>
          <v-row justify="center">
            <v-col cols="12">
              <v-card elevation="1">
                <v-card-title style="width:100%;">
                  <v-row>
                    <v-col cols="12">
                      <p class="float-left text-h6 font-weight-black mb-0">
                        <v-text-field
                          v-model="search"
                          append-icon="mdi-magnify"
                          label="Search"
                          dense
                          single-line
                          hide-details
                        ></v-text-field>
                      </p>
                      <!-- ▼ 계정 추가 버튼 혹은 수정 아이콘(연필모양) 클릭 시 노출되는 Dialog(모달) -->
                      <ModalDialogComponent
                        :dialog-value="dialog"
                        max-width="700px"
                        :title="formTitle"
                        closeText="취소"
                        saveText="저장"
                        :persistent="true"
                        @close="close"
                        @save="save"
                      >
                        <template v-slot:activator>
                          <!-- ▼ 계정 추가 버튼 -->
                          <v-btn color="primary" small class="mb-2 mr-2 float-right" @click="dialog = true">등록</v-btn>
                          <v-btn color="primary" small outlined class="mb-2 float-right" @click="dialog_excel = true">엑셀 업로드</v-btn>
                        </template>
                        <!-- ▼ 버튼 혹은 아이콘 클릭 시 노출되는 모달 창 내용 -->
                        <v-container>
                          <!-- 모달 내용 구성 -->
                          <v-row>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedStockItem.product_type"
                                label="분류"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedStockItem.product_outsourcing"
                                label="외주"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedStockItem.product_code"
                                label="관리코드"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedStockItem.product_name"
                                label="자재명"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedStockItem.product_model"
                                label="모델명"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedStockItem.product_spec"
                                label="사양"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedStockItem.manufacturer"
                                label="제조사"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedStockItem.product_num"
                                label="재고"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedStockItem.product_condition"
                                label="상태"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedStockItem.pe_number"
                                label="PE No."
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedStockItem.inbound_date"
                                label="입고일자"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedStockItem.unit_price"
                                label="단가"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="4"
                            >
                              <v-text-field
                                v-model="editedStockItem.stock_price"
                                label="총액"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </ModalDialogComponent>
                    </v-col>
                  </v-row>
                </v-card-title>

                <!-- ▼ 구분선 -->
                <v-divider></v-divider>

                <!-- ▼ 키워드 검색 영역 (Vuetify Datatable 기능 사용)-->
                <!-- 이 부분은 원래 코드와 동일하게 유지됩니다 -->

                <!-- ▼ 시스템 전체 계정(임직원) 테이블 (Vuetify Datatable 사용)-->
                <v-data-table
                  :headers="stock_headers"
                  :items="product_data"
                  :search="search"
                  actionsSlotName="actions"
                  :edited-item="editedStockItem"
                >
                  <template v-slot:[`item.actions`]="{ item }">
                    <!-- ▼ 수정 아이콘(연필) -->
                    <v-icon small class="mr-2" @click="editItem(item, 'stock')">mdi-pencil</v-icon>
                    <!-- ▼ 삭제 아이콘(휴지통) -->
                    <v-icon small @click="deleteItem(item, 'stock')">mdi-delete</v-icon>
                  </template>
                </v-data-table>
                <ModalDialogComponent
                  :dialog-value="dialogDelete"
                  max-width="350px"
                  title-class="text-body-1 font-weight-black"
                  text-class="text-body-2"
                  save-text="삭제"
                  close-text="취소"
                  @save="deleteItemConfirm('stock')"
                  @close="closeDelete"
                >
                  <template v-slot:titleHTML>
                    <p class="mb-0">{{ editedStockItem.product_code }}</p>
                    <p class="red--text">자재를 삭제하시겠습니까?</p>
                  </template>
                  삭제 시 복구 불가능합니다.
                </ModalDialogComponent>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-main>
  </div>
</template>

<script>
import NavComponent from "@/components/NavComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent";

export default {
  components: {
    NavComponent,
    ModalDialogComponent,
  },
  data() {
    return {
      search: '',
      tab_main: null,
      tab_items:['원부자재 정보', '반제품 정보', '완제품 정보'],
      dialog: false,
      dialogDelete: false,
      department_list: ['기획관리', '영업팀'],
      position_list: ['사원', '주임', '대리', '매니저'],
      product_headers: [
        { text: '분류', align: 'center', value: 'product_type', },
        { text: '외주', align: 'center', value: 'product_outsourcing', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '사진', align: 'center', value: 'product_photo', },
        { text: '편집', value: 'actions', sortable: false },
      ],
      stock_headers: [
        { text: '분류', align: 'center', value: 'product_type', },
        { text: '외주', align: 'center', value: 'product_outsourcing', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '재고', align: 'center', value: 'product_num', },
        { text: '상태', align: 'center', value: 'product_condition', },
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '입고일자', align: 'center', value: 'inbound_date', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'stock_price', },
        { text: '편집', value: 'actions', sortable: false },
      ],
      product_data: [],
      editedProductIndex: -1,
      editedProductItem: {
        product_type:'',
        product_outsourcing: '',
        product_code: '',
        product_name: '',
        product_model: '',
        product_spec: '',
        manufacturer: '',
        unit_price: '',
        product_photo: '',
      },
      defaultProductItem: {
        product_type:'',
        product_outsourcing: '',
        product_code: '',
        product_name: '',
        product_model: '',
        product_spec: '',
        manufacturer: '',
        unit_price: '',
        product_photo: '',
      },
      editedStockIndex: -1,
      editedStockItem: {
        product_type:'',
        product_outsourcing: '',
        product_code: '',
        product_name: '',
        product_model: '',
        product_spec: '',
        manufacturer: '',
        product_num: '',
        product_condition: '',
        pe_number: '',
        inbound_date: '',
        unit_price: '',
        stock_price: '',
      },
      defaultStockItem: {
        product_type:'',
        product_outsourcing: '',
        product_code: '',
        product_name: '',
        product_model: '',
        product_spec: '',
        manufacturer: '',
        product_num: '',
        product_condition: '',
        pe_number: '',
        inbound_date: '',
        unit_price: '',
        stock_price: '',
        product_photo: '',
      },
    }
  },

  computed: {
    formTitle () {
      return this.editedProductIndex === -1 ? '등록' : '수정'
    },
    formDisabled () {
      return this.editedProductIndex === -1 ? false : true
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.product_data = [
        {
          product_type:'일반',
          product_outsourcing:'Y',
          product_code: '공장2F_E-09-02_PN-AF_SVG-001',
          product_name: '제품1',
          product_model: '모델A',
          product_spec: '690V 100A',
          manufacturer: '제조사AA',
          product_num: '',
          product_condition: '',
          pe_number: '',
          inbound_date: '',
          unit_price: '100',
          stock_price: '',
          product_photo: '',
        },
        {
          product_type:'GFM',
          product_outsourcing:'Y',
          product_code: '공장2F_E-09-02_PN-AF_SVG-002',
          product_name: '제품2',
          product_model: '모델B',
          product_spec: '480V 100A',
          manufacturer: '제조사AA',
          product_num: '',
          product_condition: '',
          pe_number: '',
          inbound_date: '',
          unit_price: '200',
          stock_price: '',
          product_photo: '',
        },
        {
          product_type:'전력변환기',
          product_outsourcing:'N',
          product_code: '공장2F_E-09-02_PN-AF_SVG-003',
          product_name: '제품3',
          product_model: '모델C',
          product_spec: '690V 100A',
          manufacturer: '제조사AA',
          product_num: '5',
          product_condition: 'G',
          pe_number: 'PE240207-003',
          inbound_date: '2024-02-07',
          unit_price: '1,000',
          stock_price: '5,000',
          product_photo: '',
        },
        {
          product_type:'일반',
          product_outsourcing:'N',
          product_code: '공장2F_E-09-02_PN-AF_SVG-004',
          product_name: '제품4',
          product_model: '모델D',
          product_spec: '480V 100A',
          manufacturer: '제조사AA',
          product_num: '1',
          product_condition: 'G',
          pe_number: 'PE240207-004',
          inbound_date: '2024-02-07',
          unit_price: '100,000',
          stock_price: '100,000',
          product_photo: '',
        },
      ]
    },

    editItem (item, type) {
      if(type == 'product'){
        this.editedProductIndex = this.product_data.indexOf(item)
        this.editedProductItem = Object.assign({}, item)
      }else if(type == 'stock'){
        this.editedStockIndex = this.product_data.indexOf(item)
        this.editedStockItem = Object.assign({}, item)
      }
      this.dialog = true
    },

    deleteItem (item, type) {
      if(type == 'product'){
        this.editedProductIndex = this.product_data.indexOf(item)
        this.editedProductItem = Object.assign({}, item)
      }else if(type == 'stock'){
        this.editedStockIndex = this.product_data.indexOf(item)
        this.editedStockItem = Object.assign({}, item)
      }
      this.dialogDelete = true
    },

    deleteItemConfirm (type) {
      if(type == 'product'){
        this.product_data.splice(this.editedProductIndex, 1)
      }else if(type == 'stock'){
        this.product_data.splice(this.editedStockIndex, 1)
      }
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedProductItem = Object.assign({}, this.defaultProductItem)
        this.editedProductIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedProductItem = Object.assign({}, this.defaultProductItem)
        this.editedProductIndex = -1
      })
    },

    save () {
      if (this.editedProductIndex > -1) {
        Object.assign(this.product_data[this.editedProductIndex], this.editedProductItem)
      } else {
        this.product_data.push(this.editedProductItem)
      }
      this.close()
    },
  },
}
</script>

<style lang="">

</style>
