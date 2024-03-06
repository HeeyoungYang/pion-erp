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
                    v-model="search_finished_product_name"
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
                    v-model="register_finished_product_name"
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
                    v-model="register_finished_product_name"
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
                      <v-row>
                        <v-col cols="12">
                          <v-data-table
                            dense
                            v-model="dialog_selected_data"
                            :headers="dialog_headers"
                            :items="dialog_searched_data"
                            item-key="product_code"
                            class="elevation-1"
                            show-select
                          >
                          </v-data-table>
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
                  </v-data-table>
                </v-col>


              </v-row>
            </v-card-text>
          </v-card>


          <div>
            <v-expansion-panels
              elevation="1"
              class="mt-5"
              multiple
            >
              <v-expansion-panel
              v-for="(product, index) in product_data "
              :key="index"
              >
                <v-expansion-panel-header class="font-weight-black primary--text text-h6">
                  {{ product.product_capacity }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-divider class="mb-4"></v-divider>
                  <!-- <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                    >
                      <v-btn
                        v-if="product.button_toggle"
                        color="default"
                        elevation="1"
                        small
                        class="mr-2 "
                        @click="closeAll()"
                      >부제품 접기</v-btn>
                      <v-btn
                        v-if="!product.button_toggle"
                        color="default"
                        elevation="1"
                        small
                        class="mr-2 "
                        @click="openAll()"
                      >부제품 펼치기</v-btn>


                    </v-col>
                  </v-row> -->
                  <v-row>
                    <v-col cols="12">
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
                          <p class="mb-0">{{ product.product_capacity }}</p>
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
                            ><p class="font-weight-black primary--text text-h6 mr-4">{{ product.product_capacity }}</p>

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
                              <v-data-table
                                dense
                                :headers="dialog_edit_headers"
                                :items="product.product_info"
                                item-key="product_code"
                                class="elevation-1"
                                show-select
                              >
                              <!-- <template v-slot:item="{ item, expand, isExpanded }">
                                  <tr @click="expand(!isExpanded)">
                                    <td class="text-right">
                                      <v-btn small icon color="default" v-if="item.belong_data">
                                        <v-icon> {{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                                      </v-btn>
                                    </td>
                                    <td class="text-center">
                                      {{item.product_type}}
                                    </td>
                                    <td class="text-center">
                                      {{item.product_code}}
                                    </td>
                                    <td class="text-center">
                                      {{item.product_name}}
                                    </td>
                                    <td class="text-center">
                                      {{item.product_model}}
                                    </td>
                                    <td class="text-center">
                                      {{item.product_spec}}
                                    </td>
                                    <td class="text-center">
                                      {{item.manufacturer}}
                                    </td>
                                    <td class="text-center">
                                      {{item.product_num}}
                                    </td>
                                    <td class="text-center">
                                      {{item.stock_num}}
                                    </td>
                                    <td class="text-center">
                                      {{item.unit_price}}
                                    </td>
                                    <td class="text-center">
                                      {{item.product_price}}
                                    </td>
                                  </tr>
                                </template>

                                <template v-slot:expanded-item = "{item}">
                                  <tr v-for="(belong_data,index) in item.belong_data" :key="index" style="background-color: #efefef;">
                                    <td></td>
                                    <td></td>
                                    <td class="text-center">{{belong_data.product_code}}</td>
                                    <td class="text-center">{{belong_data.product_name}}</td>
                                    <td class="text-center">{{belong_data.product_model}}</td>
                                    <td class="text-center">{{belong_data.product_spec}}</td>
                                    <td class="text-center">{{belong_data.manufacturer}}</td>
                                    <td class="text-center">{{belong_data.product_num}}</td>
                                    <td class="text-center">{{belong_data.stock_num}}</td>
                                    <td class="text-center">{{belong_data.unit_price}}</td>
                                    <td class="text-center">{{belong_data.product_price}}</td>
                                  </tr>
                                </template> -->

                              </v-data-table>
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
                        :items="product.product_info"
                        :item-key="product.product_info.product_code"
                        group-default-open
                        editable
                        deletable
                        @delete="deleteItem"
                        group-by="product_type"
                      />
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent";
// import ExpandedTableRow from "@/components/ExpandedTableRow.vue";
import DataTableComponent from "@/components/DataTableComponent.vue";

export default {
  components: {
                NavComponent,
                ModalDialogComponent,
                // ExpandedTableRow
                DataTableComponent
              },
  mounted(){
    // this.closeAll()
  },
  data(){
    return{
      search_finished_product_name:'',
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
      register_finished_product_name: '',
      register_product_capacity: '',
      dialog_selected_data: [],
      checked_register_data: [],
      headers: [
        // { text: '부제품', align: 'center', value: '', },
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
          finished_product_name: '제품명AAA',
          product_capacity: '390VAC 500kW',
          id:'300vac_500kW',
          button_toggle:true,
          product_info: [
            {
              product_type:'PCS Ass`Y',
              product_code: '공장2F_E-09-02_PN-AF_SVG-001',
              product_name: '원자재1',
              product_model: '모델A',
              product_spec: '690V 100A',
              manufacturer: '제조사AA',
              product_num: '3',
              stock_num: '2',
              product_condition: 'G',
              pe_number: 'PE240207-001',
              inbound_date: '2024-02-07',
              unit_price: '100',
              product_price: '300',
              belong_data:[
                {
                  product_code: '공장2F_E-09-02_PN-AF_SVG-001',
                  product_name: '부자재1-1',
                  product_model: '모델A',
                  product_spec: '690V 100A',
                  manufacturer: '제조사AA',
                  product_num: '3',
                  stock_num: '2',
                  product_condition: 'G',
                  pe_number: 'PE240207-001',
                  inbound_date: '2024-02-07',
                  unit_price: '100',
                  product_price: '300',
                },
                {
                  product_code: '공장2F_E-09-02_PN-AF_SVG-001',
                  product_name: '부자재1-2',
                  product_model: '모델A',
                  product_spec: '690V 100A',
                  manufacturer: '제조사AA',
                  product_num: '3',
                  stock_num: '2',
                  product_condition: 'G',
                  pe_number: 'PE240207-001',
                  inbound_date: '2024-02-07',
                  unit_price: '100',
                  product_price: '300',
                }
              ]
            },
            {
              product_type:'PCS Ass`Y',
              product_code: '공장2F_E-09-02_PN-AF_SVG-002',
              product_name: '부자재2',
              product_model: '모델B',
              product_spec: '480V 100A',
              manufacturer: '제조사AA',
              product_num: '2',
              stock_num: '2',
              product_condition: 'G',
              pe_number: 'PE240207-002',
              inbound_date: '2024-02-07',
              unit_price: '200',
              product_price: '400',
            },
            {
              product_type:'제어기 Ass`Y',
              product_code: '공장2F_E-09-02_PN-AF_SVG-003',
              product_name: '부자재3',
              product_model: '모델C',
              product_spec: '690V 100A',
              manufacturer: '제조사AA',
              product_num: '5',
              stock_num: '2',
              product_condition: 'G',
              pe_number: 'PE240207-003',
              inbound_date: '2024-02-07',
              unit_price: '1,000',
              product_price: '5,000',
            },
          ],
        },
        {
          finished_product_name: '제품명AAA',
          product_capacity: '690VAC 500kW',
          id:'690vac_500kW',
          product_info: [
            {
              product_type:'PCS Ass`Y',
              product_code: '공장2F_E-09-02_PN-AF_SVG-002',
              product_name: '부자재2',
              product_model: '모델B',
              product_spec: '480V 100A',
              manufacturer: '제조사AA',
              product_num: '2',
              stock_num: '2',
              product_condition: 'G',
              pe_number: 'PE240207-002',
              inbound_date: '2024-02-07',
              unit_price: '200',
              product_price: '400',
            },
            {
              product_type:'제어기 Ass`Y',
              product_code: '공장2F_E-09-02_PN-AF_SVG-003',
              product_name: '부자재3',
              product_model: '모델C',
              product_spec: '690V 100A',
              manufacturer: '제조사AA',
              product_num: '5',
              stock_num: '2',
              product_condition: 'G',
              pe_number: 'PE240207-003',
              inbound_date: '2024-02-07',
              unit_price: '1,000',
              product_price: '5,000',
            },
            {
              product_type:'제어기 Ass`Y',
              product_code: '공장2F_E-09-02_PN-AF_SVG-004',
              product_name: '부자재4',
              product_model: '모델D',
              product_spec: '480V 100A',
              manufacturer: '제조사AA',
              product_num: '1',
              stock_num: '2',
              product_condition: 'G',
              pe_number: 'PE240207-004',
              inbound_date: '2024-02-07',
              unit_price: '100,000',
              stock_price: '100,000',
            },
          ]
        }
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
    // closeAll () {
    //     Object.keys(this.$refs).forEach(k => {
    //         console.log(this.$refs[k])
    //         console.log(this.$refs[k].$attrs['data-open'])
    //         if (this.$refs[k] && this.$refs[k].$attrs['data-open']) {
    //             this.$refs[k].$el.click()
    //         }
    //     })
    //     this.button_toggle = false;
    // },
    // openAll () {
    //     Object.keys(this.$refs).forEach(k => {
    //         if (this.$refs[k] && !this.$refs[k].attrs['data-open']) {
    //             this.$refs[k].$el.click()
    //         }
    //     })
    //     this.button_toggle = true;
    // },
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
