<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row justify="center">
        <v-col
          cols="12"
          sm="11"
        >
          <v-card
          elevation="1"
          >

            <v-card-text class=" pt-3">
              <v-row>
                <v-col
                  cols="12"
                  sm="4"
                  lg="3"
                >
                  <v-text-field
                    v-model="finished_product_name"
                    dense
                    clearable
                    filled
                    hide-details
                    label="제품명"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                  lg="3"
                >
                  <v-text-field
                    v-model="product_name"
                    dense
                    clearable
                    filled
                    hide-details
                    label="부자재명"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="6"
                  sm="4"
                  lg="3"
                  align-self="center"
                >
                  <v-btn
                    color="primary"
                    elevation="2"
                  >
                    <v-icon>mdi-magnify</v-icon>검색
                  </v-btn>
                  <v-btn
                    color="teal darken-1"
                    class="white--text ml-2"
                    elevation="2"
                    @click="registerOpenButton()"
                    v-if="register_product_subsidiary == false"
                  >
                    <v-icon>mdi-plus</v-icon>등록
                  </v-btn>
                </v-col>
              </v-row>

              <v-row>

              </v-row>
            </v-card-text>
          </v-card>

          <v-card
            v-if="register_product_subsidiary"
            elevation="1"
            class="mt-5"
          >
            <v-card-title>
              <v-row>
                <v-col cols="12" sm="6" lg="4">
                  <v-text-field
                    v-model="register_finished_product_name"
                    dense
                    clearable
                    filled
                    hide-details
                    label="제품명 설정"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12" sm="6" lg="4"
                  align-self="center"
                >
                  <v-btn
                    color="success"
                    elevation="1"
                    small
                    class="mr-2 "
                  >
                    저장
                  </v-btn>
                  <v-btn
                    color="default"
                    elevation="1"
                    small
                    class="mr-2 "
                    @click="registerCloseButton()"
                  >
                    닫기
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
             <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col
                  cols="12" sm="6"
                >
                  <span class="text-h6 font-weight-black primary--text mr-5" style="vertical-align: middle;">제품 부자재</span>
                  <!-- 자재 불러오기 Modal -->
                  <ModalDialogComponent
                    :dialog-value="dialog"
                    max-width="1000px"
                    title-class=" "
                    :dialog-transition="'slide-x-transition'"
                    :dialog-custom="'custom-dialog elevation-0 white'"
                    :card-elevation="'0'"
                    :hide-overlay="true"
                    :persistent="true"
                  >
                    <template v-slot:activator>
                      <v-btn
                        color="blue-grey darken-1"
                        elevation="1"
                        small
                        class="mr-2 white--text"
                        @click="deleteSelectedData"
                      >
                        선택 삭제
                      </v-btn>
                      <v-btn
                        color="primary"
                        elevation="1"
                        small
                        class="mr-2 "
                        @click="dialog = true"
                      >
                        자재 불러오기
                      </v-btn>
                    </template>

                    <v-container>
                      <!-- 모달 내용 구성 -->
                      <v-row>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-btn
                            color="primary"
                            small
                            class="mr-2"
                            elevation="2"
                          >
                            검색
                          </v-btn>
                          <v-btn
                            color="success"
                            small
                            class="mr-2"
                            elevation="2"
                            @click="dialog=false"
                          >
                            완료
                          </v-btn>
                          <v-btn
                            color="default"
                            small
                            elevation="2"
                            @click="dialogCancelSelected=true"
                          >
                            취소
                          </v-btn>
                          <ModalDialogComponent
                            :dialog-value="dialogCancelSelected"
                            max-width="350px"
                            title-class="text-body-1 font-weight-black"
                            text-class="text-body-2"
                            save-text="예"
                            close-text="아니오"
                            @save="cancelDialogSelectedData"
                            @close="dialogCancelSelected=false"
                          >
                            <template v-slot:titleHTML>
                              <p class="red--text">선택한 내용이 모두 삭제됩니다.</p>
                              <p class="mb-0">취소하시겠습니까?</p>
                            </template>
                          </ModalDialogComponent>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-text-field
                            v-model="dialog_product_code"
                            dense
                            clearable
                            filled
                            hide-details
                            label="관리코드"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-text-field
                            v-model="dialog_product_name"
                            dense
                            clearable
                            filled
                            hide-details
                            label="제품명"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-text-field
                            v-model="dialog_product_model"
                            dense
                            clearable
                            filled
                            hide-details
                            label="모델명"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-text-field
                            v-model="dialog_product_spec"
                            dense
                            clearable
                            filled
                            hide-details
                            label="사양"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <v-data-table
                            dense
                            v-model="dialog_selected_data"
                            :headers="dialog_headers"
                            :items="product_data"
                            item-key="product_code"
                            class="elevation-1"
                            show-select
                          ></v-data-table>
                        </v-col>
                      </v-row>
                    </v-container>
                  </ModalDialogComponent>
                </v-col>
                <v-col cols="12">

                  <v-data-table
                    dense
                    v-model="checked_register_data"
                    :headers="dialog_selected_headers"
                    :items="dialog_selected_data"
                    item-key="product_code"
                    class="elevation-1"
                    show-select
                  ></v-data-table>
                </v-col>


              </v-row>
            </v-card-text>
          </v-card>

          <v-card
          elevation="1"
          class="mt-5"
          >
            <v-card-text class=" pt-3">
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-btn
                    v-if="button_toggle"
                    color="default"
                    elevation="1"
                    small
                    class="mr-2 "
                    @click="closeAll()"
                  >전체 접기</v-btn>
                  <v-btn
                    v-if="!button_toggle"
                    color="default"
                    elevation="1"
                    small
                    class="mr-2 "
                    @click="openAll()"
                  >전체 펼치기</v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-data-table
                    :headers="headers"
                    :items="product_data"
                    item-key="product_code"
                    group-by="finished_product_name"
                  >
                    <template v-slot:[`group.header`]="{ group, headers, toggle, isOpen }">
                      <td :colspan="headers.length-1" @click="toggle"  style="cursor: pointer;">
                          <v-btn small icon :ref="group" :data-open="isOpen">
                              <v-icon>{{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                          </v-btn>
                          {{ group }}
                      </td>
                      <td>
                        <v-icon
                          small
                          @click="deleteItem(item)"
                        >
                          mdi-pencil
                        </v-icon>
                        <v-icon
                          small
                          @click="deleteItem(item)"
                        >
                          mdi-delete
                        </v-icon>
                      </td>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>

              <v-row>

              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
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
  mounted(){
    this.closeAll()
  },
  data(){
    return{
      button_toggle:true,
      finished_product_name:'',
      product_name: '',
      menu: false,
      dialog: false,
      dialog_product_code:'',
      dialog_product_name:'',
      dialog_product_model:'',
      dialog_product_spec:'',
      dialogCancelSelected: false,
      register_product_subsidiary:false,
      register_finished_product_name: '',
      dialog_selected_data: [],
      checked_register_data: [],
      headers: [
        { text: '제품명', align: 'center', value: '', },
        { text: '제품명', align: 'center', value: 'finished_product_name', },
        { text: '분류', align: 'center', value: 'product_type', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '부자재명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '필요수량', align: 'center', value: 'product_num', },
        { text: '재고', align: 'center', value: 'product_num', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'stock_price', },
        { text: '편집', value: 'actions', },
      ],
      dialog_headers:[
        { text: '분류', align: 'center', value: 'product_type', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '부자재명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
      ],
      dialog_selected_headers:[
        { text: '분류', align: 'center', value: 'product_type', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '부자재명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '필요수량', align: 'center'},
      ],
      product_data: [
        {
          product_type:'일반',
          product_code: '공장2F_E-09-02_PN-AF_SVG-001',
          finished_product_name: '완제품1',
          product_name: '부자재1',
          product_model: '모델A',
          product_spec: '690V 100A',
          manufacturer: '제조사AA',
          product_num: '3',
          product_condition: 'G',
          pe_number: 'PE240207-001',
          inbound_date: '2024-02-07',
          unit_price: '100',
          stock_price: '300',
        },
        {
          product_type:'GFM',
          product_code: '공장2F_E-09-02_PN-AF_SVG-002',
          finished_product_name: '완제품1',
          product_name: '부자재2',
          product_model: '모델B',
          product_spec: '480V 100A',
          manufacturer: '제조사AA',
          product_num: '2',
          product_condition: 'G',
          pe_number: 'PE240207-002',
          inbound_date: '2024-02-07',
          unit_price: '200',
          stock_price: '400',
        },
        {
          product_type:'전력변환기',
          product_code: '공장2F_E-09-02_PN-AF_SVG-003',
          finished_product_name: '완제품2',
          product_name: '부자재3',
          product_model: '모델C',
          product_spec: '690V 100A',
          manufacturer: '제조사AA',
          product_num: '5',
          product_condition: 'G',
          pe_number: 'PE240207-003',
          inbound_date: '2024-02-07',
          unit_price: '1,000',
          stock_price: '5,000',
        },
        {
          product_type:'일반',
          product_code: '공장2F_E-09-02_PN-AF_SVG-004',
          finished_product_name: '완제품3',
          product_name: '부자재4',
          product_model: '모델D',
          product_spec: '480V 100A',
          manufacturer: '제조사AA',
          product_num: '1',
          product_condition: 'G',
          pe_number: 'PE240207-004',
          inbound_date: '2024-02-07',
          unit_price: '100,000',
          stock_price: '100,000',
        },
      ],
    }
  },

  methods: {
    closeAll () {
        Object.keys(this.$refs).forEach(k => {
            console.log(this.$refs[k])
            if (this.$refs[k] && this.$refs[k].$attrs['data-open']) {
                this.$refs[k].$el.click()
            }
        })
        this.button_toggle = false;
    },
    openAll () {
        Object.keys(this.$refs).forEach(k => {
            if (this.$refs[k] && !this.$refs[k].$attrs['data-open']) {
                this.$refs[k].$el.click()
            }
        })
        this.button_toggle = true;
    },
    registerOpenButton(){
      this.register_product_subsidiary = true;
    },
    registerCloseButton(){
      this.register_product_subsidiary = false;
    },
    cancelDialogSelectedData(){
      this.dialog_selected_data = [];
      this.dialog = false;
    },
    deleteSelectedData(){
      this.dialog_selected_data = this.dialog_selected_data.filter( x => !this.checked_register_data.includes(x));
      this.checked_register_data = [];
    },
  },
  computed: {
  },
}
</script>
<style>
.custom-dialog {
  position: absolute;
    right: 0;
    margin: 0;
    min-height: 100%;
}
</style>
