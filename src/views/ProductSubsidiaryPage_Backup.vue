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
                    v-model="search_complete_product_name"
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
                    v-model="search_product_capacity"
                    dense
                    clearable
                    filled
                    hide-details
                    label="용량"
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
                  <v-btn
                    color="teal darken-1"
                    class="white--text ml-2"
                    elevation="2"
                    v-if="register_product_subsidiary == true"
                  >
                    <v-icon>mdi-content-save</v-icon>저장
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
                <v-col cols="12" sm="6" lg="3">
                  <v-text-field
                    v-model="register_complete_product_name"
                    dense
                    clearable
                    filled
                    hide-details
                    label="제품명 설정"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <v-text-field
                    v-model="register_product_capacity"
                    dense
                    clearable
                    filled
                    hide-details
                    label="용량 설정"
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
                    @click="addSubProduct()"
                  >
                    부제품 추가
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
            <v-card-text
              v-for="(sub, i) in sub_product"
              :key="i"
              :id="'sub_product'+i"
            >
             <v-divider class="mb-4"></v-divider>
              <v-row>
                <v-col
                  cols="12" sm="6" lg="3"
                >
                  <v-text-field
                    v-model="register_complete_product_name"
                    dense
                    clearable
                    filled
                    hide-details
                    label="부제품명 설정"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12" sm="6"
                  align-self="center"
                >
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
                        color="default"
                        elevation="1"
                        small
                        class="mr-2 "
                        @click="deleteSubProduct(i)"
                      >
                        취소
                      </v-btn>
                      <v-btn
                        color="default"
                        elevation="1"
                        small
                        class="mr-2 "
                      >
                        직접 입력
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
                      <!-- <v-row>
                        <v-col cols="12"> -->
                          <DataTableComponent
                            dense
                            v-model="dialog_selected_data"
                            :headers="dialog_headers"
                            :items="dialog_searched_data"
                            item-key="product_code"
                            class="elevation-1"
                            show-select
                          />
                        <!-- </v-col>
                      </v-row> -->
                    </v-container>
                  </ModalDialogComponent>
                </v-col>
                <v-col cols="12">
                  <DataTableComponent
                    dense
                    v-model="checked_register_data"
                    :headers="dialog_selected_headers"
                    :items="dialog_selected_data"
                    item-key="product_code"
                    class="elevation-1"
                    show-select
                  >
                  <template v-slot:[`item.product_num`]="{ item }">
                    <v-text-field
                      dense
                      small
                      outlined
                      single-line
                      hide-details
                      v-model="item.product_num"
                      type="number"
                      style="padding: 5px;"
                    ></v-text-field>
                  </template>
                  <template v-slot:[`item.addition`]="{ item }">
                    <v-btn
                      v-model="item.addition"
                        color="primary"
                        elevation="1"
                        small
                        class="mr-2 "
                        @click="dialog = true"
                      >자재</v-btn>
                    <v-btn
                      v-model="item.addition"
                        color="default"
                        elevation="1"
                        small
                        class="mr-2 "
                        @click="dialog = true"
                      >입력</v-btn>
                  </template>
                  </DataTableComponent>
                </v-col>


              </v-row>
            </v-card-text>
          </v-card>


          <div>
            <ExpansionPanelComponent
              :data="product_data"
              elevation="1"
              class="mt-5"
              multiple>

              <template v-slot:header="{ data }">
                {{ data.complete_product_name }} ({{ data.product_capacity }})
              </template>
              <template v-slot:content="{ data }">
                <v-divider class="mb-4"></v-divider>
                <v-row>
                  <v-col cols="6">
                    <p
                      class="text-h6 font-weight-black mb-0"
                      item-align-center
                    >
                      {{ data.product_code }}
                    </p>
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      color="blue-grey darken-1"
                      fab
                      x-small
                      class="mr-3 float-right white--text"
                      elevation="0"
                      @click="dialogDelete = true"
                    >
                      <v-icon
                        small
                      >mdi-delete</v-icon>
                    </v-btn>
                    <ModalDialogComponent
                      :dialog-value="dialogDelete"
                      max-width="300px"
                      title-class="text-body-1 font-weight-black"
                      text-class="text-body-2"
                      save-text="삭제"
                      close-text="취소"
                      @close="dialogDelete=false"
                    >
                      <template v-slot:titleHTML>
                        <p class="mb-0">{{ data.product_capacity }}</p>
                        <p class="red--text">데이터를 삭제하시겠습니까?</p>
                      </template>
                      삭제 후 복구는 불가능합니다.
                    </ModalDialogComponent>
                    <ModalDialogComponent
                      :dialog-value="dialog_edit"
                      max-width="1300px"
                      title-class=" "
                      :dialog-transition="'slide-x-transition'"
                      :dialog-custom="'custom-dialog elevation-0 white'"
                      :card-elevation="'0'"
                      :hide-overlay="true"
                      :persistent="true"
                    >
                      <template v-slot:activator>

                        <v-btn
                          color="primary"
                          fab
                          x-small
                          class="mr-3 float-right"
                          elevation="0"
                          @click="dialog_edit = true"
                        >
                          <v-icon
                            small
                          >mdi-pencil</v-icon>
                        </v-btn>

                      </template>

                      <v-container>
                        <!-- 모달 내용 구성 -->
                        <v-row>
                          <v-col
                            cols="12"
                          ><p class="font-weight-black primary--text text-h6 mr-4">{{ data.product_capacity }}</p>

                            <v-btn
                              color="primary"
                              elevation="1"
                              small
                              class="mr-2 "
                              @click="dialog = true"
                            >
                              자재 불러오기
                            </v-btn>
                            <v-btn
                              color="primary"
                              small
                              class="mr-2"
                              elevation="2"
                            >
                              직접 입력
                            </v-btn>
                            <v-btn
                              color="primary"
                              small
                              class="mr-2"
                              elevation="2"
                            >
                              하위 추가
                            </v-btn>
                            <v-btn
                              color="success"
                              small
                              class="mr-2"
                              elevation="2"
                            >
                              저장
                            </v-btn>
                            <v-btn
                              color="blue-grey darken-1"
                              small
                              class="mr-2 white--text"
                              elevation="2"
                              @click="dialog_edit =false"
                            >
                              삭제
                            </v-btn>
                            <v-btn
                              color="default"
                              small
                              class="mr-2"
                              elevation="2"
                              @click="dialog_edit =false"
                            >
                              닫기
                            </v-btn>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="4"
                            lg="3"
                          >
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12">
                            <DataTableComponent
                              dense
                              :headers="dialog_edit_headers"
                              :items="data.product_info"
                              item-key="product_code"
                              class="elevation-1"
                              show-select
                            />
                          </v-col>
                        </v-row>
                      </v-container>
                    </ModalDialogComponent>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                  <DataTableComponent
                      :headers="headers"
                      :items="data.product_info"
                      :item-key="data.product_info.product_code"
                      hide-default-footer
                      disable-pagination
                      children-key="belong_data"
                      table-style="border-bottom: 3px solid #c5c5c5"
                    />
                  </v-col>
                </v-row>
              </template>
            </ExpansionPanelComponent>
          </div>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent";
import DataTableComponent from "@/components/DataTableComponent.vue";
import ExpansionPanelComponent from "@/components/ExpansionPanelComponent.vue";

export default {
  components: {
                NavComponent,
                ModalDialogComponent,
                DataTableComponent,
                ExpansionPanelComponent
              },
  mounted(){
    // this.closeAll()
  },
  data(){
    return{
      search_complete_product_name:'',
      sub_product:1,
      search_product_capacity: '',
      menu: false,
      dialog: false,
      dialog_edit: false,
      dialogDelete: false,
      dialog_product_code:'',
      dialog_product_name:'',
      dialog_product_model:'',
      dialog_product_spec:'',
      dialogCancelSelected: false,
      register_product_subsidiary:false,
      register_complete_product_name: '',
      register_product_capacity: '',
      dialog_selected_data: [],
      checked_register_data: [],
      headers: [
        { text: '', align: 'center', value: '', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '필요수량', align: 'center', value: 'product_num', },
        { text: '재고', align: 'center', value: 'stock_num', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'product_price', },
      ],
      expanded: [],
      singleExpand: true,
      dialog_headers:[
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '단가', align: 'center', value: 'unit_price', },
      ],
      dialog_edit_headers:[
        { text: '부제품', align: 'center', value: 'product_type', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '필요수량', align: 'center', value: 'product_num', },
        { text: '재고', align: 'center', value: 'stock_num', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'product_price', },
      ],
      dialog_searched_data:[
        {
          product_code: '공장2F_E-09-02_PN-AF_SVG-001',
          product_name: '부자재1',
          product_model: '모델A',
          product_spec: '690V 100A',
          manufacturer: '제조사AA',
          unit_price: '100'
        },
        {
          product_code: '공장2F_E-09-02_PN-AF_SVG-002',
          product_name: '부자재2',
          product_model: '모델B',
          product_spec: '690V 100A',
          manufacturer: '제조사AB',
          unit_price: '100'
        },
        {
          product_code: '공장2F_E-09-02_PN-AF_SVG-003',
          product_name: '부자재3',
          product_model: '모델C',
          product_spec: '690V 100A',
          manufacturer: '제조사BB',
          unit_price: '100'
        },
        {
          product_code: '공장2F_E-09-02_PN-AF_SVG-004',
          product_name: '부자재4',
          product_model: '모델D',
          product_spec: '690V 100A',
          manufacturer: '제조사CD',
          unit_price: '100'
        }
      ],
      dialog_selected_headers:[
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '필요수량', align: 'center',value: 'product_num',  sortable: false},
        { text: '하위 추가', align: 'center',value: 'addition',  sortable: false},
      ],
      product_data: [
        {
          product_code: 'P-ESS-PC-380V500K60H-RT-24-R1',
          complete_product_name: 'ESS GFM용 PCS',
          product_capacity: '380VAC 500kW',
          id:'380vac_500kW',
          button_toggle:true,
          product_info: [
            {
              product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01',
              product_name: 'PCS Ass`Y',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
              belong_data:[
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-01',
                  product_name: 'IGBT & SMPS',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-02',
                  product_name: '부자재1-1',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-03',
                  product_name: '부자재1-2',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-04',
                  product_name: 'SPD, 퓨즈',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-05',
                  product_name: '쿨링팬',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-06',
                  product_name: '보호회로',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-07',
                  product_name: '리액터',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-08',
                  product_name: 'MCCB',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-09',
                  product_name: 'EMC',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-10',
                  product_name: 'DC Capacitor',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-11',
                  product_name: '외함 및 기구',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
              ]
            },
            {
              product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02',
              product_name: 'PCS Ass`Y',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
              belong_data:
              [
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-01',
                  product_name: '제어기(LK11)',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-02',
                  product_name: '인터페이스보드',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-03',
                  product_name: 'SMPS(15VDC)',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-04',
                  product_name: 'SMPS Bracket',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-05',
                  product_name: 'HMI PC',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-06',
                  product_name: 'PLC',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-07',
                  product_name: '통신케이블',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
              ]
            },
          ],
        },
        // {
        //   complete_product_name: '제품명AAA',
        //   product_capacity: '690VAC 500kW',
        //   id:'690vac_500kW',
        //   product_info: [
        //     {
        //       product_type:'PCS Ass`Y',
        //       product_code: '공장2F_E-09-02_PN-AF_SVG-002',
        //       product_name: '부자재2',
        //       product_model: '모델B',
        //       product_spec: '480V 100A',
        //       manufacturer: '제조사AA',
        //       product_num: '2',
        //       stock_num: '2',
        //       product_condition: 'G',
        //       pe_number: 'PE240207-002',
        //       inbound_date: '2024-02-07',
        //       unit_price: '200',
        //       product_price: '400',
        //     },
        //     {
        //       product_type:'제어기 Ass`Y',
        //       product_code: '공장2F_E-09-02_PN-AF_SVG-003',
        //       product_name: '부자재3',
        //       product_model: '모델C',
        //       product_spec: '690V 100A',
        //       manufacturer: '제조사AA',
        //       product_num: '5',
        //       stock_num: '2',
        //       product_condition: 'G',
        //       pe_number: 'PE240207-003',
        //       inbound_date: '2024-02-07',
        //       unit_price: '1,000',
        //       product_price: '5,000',
        //     },
        //     {
        //       product_type:'제어기 Ass`Y',
        //       product_code: '공장2F_E-09-02_PN-AF_SVG-004',
        //       product_name: '부자재4',
        //       product_model: '모델D',
        //       product_spec: '480V 100A',
        //       manufacturer: '제조사AA',
        //       product_num: '1',
        //       stock_num: '2',
        //       product_condition: 'G',
        //       pe_number: 'PE240207-004',
        //       inbound_date: '2024-02-07',
        //       unit_price: '100,000',
        //       product_price: '100,000',
        //     },
        //   ]
        // }
      ],

    }
  },

  methods: {
    deleteItem(item){
      if (confirm('정말 삭제하시겠습니까?')){
        let dataIndex = -1;
        let infoIndex = -1;
        for (let i = 0; i < this.product_data.length; i++) {
          infoIndex = this.product_data[i].product_info.findIndex(obj => {
              return obj === item
          });
          if (infoIndex !== -1){
            dataIndex = i;
            break;
          }
        }
        if (infoIndex !== -1){
          this.product_data[dataIndex].product_info.splice(infoIndex,1);
        }
      }
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
      this.dialogCancelSelected=false;
    },
    deleteSelectedData(){
      this.dialog_selected_data = this.dialog_selected_data.filter( x => !this.checked_register_data.includes(x));
      this.checked_register_data = [];
    },
    addSubProduct(){
      this.sub_product++;
    },
    // show_card(id){
    //   let set_id = document.querySelector('#'+id);
    //   set_id.style.display = 'block';
    // },
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
.v-row-group__header{background-color: #fffde9!important;}
</style>
