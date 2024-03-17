<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-tabs
        v-model="tab_main"
        background-color="transparent"
      >
        <v-tab
          v-for="item in tab_main_items"
          :key="item"
        >
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab_main" class="pb-1">
        <v-tab-item>
          <v-row class=" mt-5">
            <v-col cols="12" sm="5">
              <v-card
                elevation="1"
              >
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <v-text-field
                      v-model="product_name"
                      dense
                      clearable
                      filled
                      hide-details
                      label="제품명"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    align-self="center"
                  >
                    <v-btn
                      color="primary"
                      elevation="2"
                    >
                      <v-icon>mdi-magnify</v-icon>검색
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                  >
                    <DataTableComponent
                      dense
                      :headers="search_cost_headers"
                      :items="search_cost_data"
                      :item-key="product_code"
                      deletable
                      @delete="deleteItem"
                    />
                    <ModalDialogComponent
                      :dialog-value="dialogDelete"
                      max-width="300px"
                      title-class="text-body-1 font-weight-black"
                      text-class="text-body-2"
                      save-text="삭제"
                      close-text="취소"
                      @save="deleteItemConfirm"
                      @close="closeDelete"
                    >
                      <template v-slot:titleHTML>
                        <p class="mb-0">{{ search_cost_data.product_name }}</p>
                        <p class="red--text">원가를 삭제하시겠습니까?</p>
                      </template>
                      삭제된 계정은 복구가 불가능합니다.
                    </ModalDialogComponent>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="12" sm="7">
              <v-tabs
                v-model="tab_search"
                background-color="transparent"
                class="tab_search"
              >
                <v-tab
                  v-for="sub_item in search_tab_items"
                  :key="sub_item"
                >
                  {{ sub_item }}
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab_search" class="pb-1">
                <!-- 원가 계산서 -->
                <v-tab-item>
              <div style="position:absolute">test</div>
                  <v-card>
                    <v-card-title>
                      <v-row>
                        <v-col align-self="center" cols="12" sm="10">
                          <p class="text-h5 font-weight-black black--text mb-3">ESS GFM용 PCS (380VAC 500kW)<br>
                            <!-- <span>2024-02-29</span> -->
                            <table style="  border-spacing: 0px;" class="mt-1">
                              <tr class="text-body-1">
                                <td class="cost_search_info info_title" style="border-left:1px solid #b6b6b6">작성자</td>
                                <td class="cost_search_info">김OO</td>
                                <td class="cost_search_info info_title">작성일</td>
                                <td class="cost_search_info">2024-02-29</td>
                              </tr>
                            </table>
                          </p>
                        </v-col>
                        <v-col align-self="center" cols="12" sm="2">
                          <v-img
                            alt="Pionelectric Logo"
                            class="float-right"
                            contain
                            src="../assets/img/pion_logo.png"
                            transition="scale-transition"
                            width="140"
                          />
                        </v-col>
                      </v-row>
                    </v-card-title>
                    <v-card-text>
                      <CostTableComponent
                        :headers="survey_cost_headers"
                        :items="survey_cost_data"
                        item-key="product_code"
                        :childTrStyle="'background-color:#efefef'"
                        class="cost_table_border"
                      />
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <!-- 산출내역서 -->
                <v-tab-item>
                  <v-card>
                    <v-card-title>
                      <v-row>
                        <v-col cols="12" sm="10">
                          <p class="text-h5 font-weight-black black--text mb-0">ESS GFM용 PCS (380VAC 500kW) 산출내역서</p>
                        </v-col>

                        <v-col cols="12" sm="2">
                          <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                color="success"
                                fab
                                x-small
                                class="float-right"
                                elevation="0"
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon
                                  small
                                >mdi-content-save</v-icon>
                              </v-btn>
                            </template>
                            <v-list>
                              <v-list-item
                                v-for="(item, index) in content_save_items"
                                :key="index"
                                dense
                              >
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>

                          <v-btn
                            v-if="edit_survey_cost_data"
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right"
                            elevation="0"
                            @click="edit_survey_cost_data = false"
                          >
                            <v-icon
                              small
                            >mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            v-if="!edit_survey_cost_data"
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right"
                            elevation="0"
                            @click="edit_survey_cost_data = true"
                          >
                            <v-icon
                              small
                            >mdi-check</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>

                    </v-card-title>
                    <v-card-text>
                      <CostTableComponent
                        :headers="survey_cost_headers"
                        :items="calc_cost_detail_data"
                        item-key="product_code"
                        trStyle="background-color:#efefef"
                        trClass="font-weight-black info_title"
                        :cost-num-edit-disabled="edit_survey_cost_data"
                        class="cost_table_border"
                      >

                      </CostTableComponent>
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <!-- 노무비 산출 -->
                <v-tab-item>
                  <v-card>
                    <v-card-title>
                      <v-row>
                        <v-col cols="12" sm="10">
                          <p class="text-h5 font-weight-black black--text mb-0">ESS GFM용 PCS (380VAC 500kW) 노무비 산출</p>
                        </v-col>
                        <v-col cols="12" sm="2">
                          <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                color="success"
                                fab
                                x-small
                                class="float-right"
                                elevation="0"
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon
                                  small
                                >mdi-content-save</v-icon>
                              </v-btn>
                            </template>
                            <v-list>
                              <v-list-item
                                v-for="(item, index) in content_save_items"
                                :key="index"
                                dense
                              >
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>

                          <v-btn
                            v-if="edit_labor_cost_data"
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right"
                            elevation="0"
                            @click="edit_labor_cost_data = false"
                          >
                            <v-icon
                              small
                            >mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            v-if="!edit_labor_cost_data"
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right"
                            elevation="0"
                            @click="edit_labor_cost_data = true"
                          >
                            <v-icon
                              small
                            >mdi-check</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>

                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        dense
                        :headers="labor_cost_headers"
                        :items="labor_cost_data"
                        hide-default-footer
                        disable-pagination
                        class="elevation-1 labor_cost_list"
                        disable-sort
                      >
                        <template v-slot:item="{ item, index }">
                          <tr>
                            <td align="center">{{ item.no }}</td>
                            <td align="center">{{ item.contract_name }}</td>
                            <td align="center">{{ item.contract_type }}</td>
                            <td align="center">
                              <v-select
                                :items="labor_occupation_list"
                                dense
                                hide-details
                                v-model="item.occupation"
                                label=""
                                style="max-width:200px"
                                @change="selectOccupationFunc(item.occupation, index)"
                                :disabled="edit_labor_cost_data"
                              ></v-select>
                            </td>
                            <td align="center">{{ item.man_day }}</td>
                            <td align="center">{{ item.surcharge_rate }}</td>
                            <td align="center">{{ item.adjustment_rate }}</td>
                            <td align="center">{{ item.man_hour }}</td>
                            <td align="center">{{ item.man_day_unit_price }}</td>
                            <td align="center">
                              <v-text-field
                                dense
                                hide-details
                                style="max-width:200px"
                                :disabled="edit_labor_cost_data"
                              ></v-text-field>
                            </td>
                            <td align="center"></td>
                            <td align="center"></td>
                            <td align="center">
                              <v-icon
                                color="primary"
                                small
                                @click="addLaborCostList(item, index)"
                              >mdi-plus-thick</v-icon>
                              <v-icon
                                color="grey"
                                small
                                class="ml-3"
                              >mdi-minus-thick</v-icon>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-col>
          </v-row>
        </v-tab-item>

        <!-- 계산 -->
        <v-tab-item>
          <v-row class=" mt-5">
            <v-col cols="12" sm="5">
              <v-card>
                <v-card-title>
                  <v-row>
                    <v-col cols="12" sm="11">
                          <p class="text-h5 font-weight-black black--text mb-0">{{ dialog_selected_product_data.complete_product_name }} ({{ dialog_selected_product_data.product_spec }}) 산출내역서</p>
                        </v-col>
                        <v-col cols="12" sm="1">
                          <v-btn
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right"
                            elevation="0"
                          >
                            <v-icon
                              small
                            >mdi-content-save</v-icon>
                          </v-btn>
                        </v-col>
                  </v-row>

                </v-card-title>
                <v-card-text>
                  <CostTableComponent
                    :headers="survey_cost_headers"
                    :items="calc_cost_detail_data2"
                    item-key="product_code"
                    trStyle="background-color:#efefef"
                    trClass="font-weight-black info_title"
                    class="cost_table_border"
                  >
                  </CostTableComponent>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="7">
              <v-card style="position: fixed; min-width:930px">
                <v-card-title>
                  <v-row>
                    <v-col align-self="center" cols="12" sm="10">
                      <p class="text-h5 font-weight-black black--text mb-3">{{ dialog_selected_product_data.complete_product_name }} ({{ dialog_selected_product_data.product_spec }})<br>
                        <table style="  border-spacing: 0px;" class="mt-1">
                          <tr class="text-body-1">
                            <td class="cost_search_info info_title" style="border-left:1px solid #b6b6b6">작성자</td>
                            <td class="cost_search_info"></td>
                            <td class="cost_search_info info_title">작성일</td>
                            <td class="cost_search_info"></td>
                            <td class="cost_search_info info_title">제품코드</td>
                            <td class="cost_search_info">{{ dialog_selected_product_data.product_code }}</td>
                          </tr>
                        </table>
                      </p>
                    </v-col>
                    <v-col align-self="center" cols="12" sm="2">
                      <v-img
                        alt="Pionelectric Logo"
                        class="float-right"
                        contain
                        src="../assets/img/pion_logo.png"
                        transition="scale-transition"
                        width="140"
                      />
                    </v-col>
                  </v-row>
                </v-card-title>
                <v-card-text>
                  <CostTableComponent
                    :headers="survey_cost_headers"
                    :items="calc_cost_detail_data2"
                    item-key="product_code"
                    :childTrStyle="'background-color:#efefef'"
                    prevent-editable
                    prevent-button
                    hide-children
                    :show-childs-parent-index-arr="[0]"
                    class="cost_table_border"
                  >

                  </CostTableComponent>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-main>

    <!-- 제품 불러오기 Modal -->
    <ModalDialogComponent
        :dialog-value="dialog_search_product"
        max-width="1300px"
        title-class=" "
        :dialog-transition="'slide-x-transition'"
        :dialog-custom="'custom-dialog elevation-0 white'"
        :card-elevation="'0'"
        :hide-overlay="true"
        :persistent="true"
      >
        <v-container>
          <!-- 모달 내용 구성 -->
          <v-row>
            <v-col
              cols="12"
            >
              <span class="font-weight-black primary--text text-h5 mr-4">제품 불러오기</span>
              <v-btn
                color="blue-grey darken-1"
                x-small
                class="mr-2 float-right white--text"
                elevation="2"
                @click="dialog_search_product =false"
                fab
              >
                <v-icon> mdi-close-thick </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="my-6"></v-divider>
          <v-row>
            <v-col
              cols="12"
              sm="4"
              lg="3"
            >
              <v-text-field
                v-model="search_complete_product_code"
                dense
                clearable
                filled
                hide-details
                label="제품코드"
              ></v-text-field>
            </v-col>
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
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-data-table
                dense
                :headers="dialog_search_product_headers"
                :items="dialog_search_product_data"
                item-key="product_code"
                class="elevation-1"
              >
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  color="success"
                  x-small
                  class="ml-3"
                  elevation="0"
                  @click="addCostList(item)"
                >적용
                </v-btn>
              </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </ModalDialogComponent>

    <!-- 노무비 산출 Modal -->
      <ModalDialogComponent
        :dialog-value="dialog_calculate_labor"
        max-width="90%"
        title-class=" "
        :dialog-transition="'slide-x-transition'"
        :dialog-custom="'custom-dialog elevation-0 white'"
        :card-elevation="'0'"
        :hide-overlay="true"
        :persistent="true"
      >
        <v-container>
          <!-- 모달 내용 구성 -->
          <v-row>
            <v-col
              cols="12"
            ><span class="font-weight-black primary--text text-h6 mr-4">노무비 산출</span>
              <v-btn
                color="success"
                small
                class="mr-2"
                elevation="2"
              >
                저장
              </v-btn>
              <v-btn
                color="default"
                small
                class="mr-2"
                elevation="2"
                @click="dialog_calculate_labor =false"
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
            <v-col>
              <v-data-table
                dense
                :headers="labor_cost_headers"
                :items="labor_cost_list"
                hide-default-footer
                disable-pagination
                class="elevation-1"
                disable-sort
              >
                <template v-slot:item="{ item, index }">
                  <tr>
                    <td align="center">{{ item.no }}</td>
                    <td align="center">{{ item.contract_name }}</td>
                    <td align="center">{{ item.contract_type }}</td>
                    <td align="center">
                      <v-select
                        :items="labor_occupation_list"
                        filled
                        dense
                        hide-details
                        v-model="item.occupation"
                        label=""
                        style="max-width:200px"
                        @change="selectOccupationFunc(item.occupation, index)"
                      ></v-select>
                    </td>
                    <td align="center">{{ item.man_day }}</td>
                    <td align="center">{{ item.surcharge_rate }}</td>
                    <td align="center">{{ item.adjustment_rate }}</td>
                    <td align="center">{{ item.man_hour }}</td>
                    <td align="center">{{ item.man_day_unit_price }}</td>
                    <td align="center">
                      <v-text-field
                        dense
                        hide-details
                        filled
                      ></v-text-field>
                    </td>
                    <td align="center"></td>
                    <td align="center"></td>
                    <td align="center">
                      <v-icon
                        color="primary"
                        small
                        @click="addLaborCostList(item, index)"
                      >mdi-plus-thick</v-icon>
                      <v-icon
                        color="grey"
                        small
                        class="ml-3"
                      >mdi-minus-thick</v-icon>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </ModalDialogComponent>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent";
import DataTableComponent from "@/components/DataTableComponent";
import CostTableComponent from "@/components/CostTableComponent";

export default {
  components: {
                NavComponent,
                ModalDialogComponent,
                DataTableComponent,
                CostTableComponent,
              },
  data(){
    return{
        tab_main: null,
        tab_search: null,
        tab_calculate: null,
        search_complete_product_code: '',
        search_complete_product_name: '',
        search_product_capacity: '',
        dialog_search_product: false,
        dialog_calculate_labor: false,
        dialogDelete: false,
        edit_labor_cost_data: true,
        edit_survey_cost_data: true,
        editedIndex: -1,
        product_name:'',
        content_save_items: [
          {title:'출력', click:''},
          {title:'엑셀', click:''},
          {title:'PDF', click:''},
        ],
        labor_occupation_list:['저압 케이블전공', '고압 케이블전공', '비계공', '변전전공', '보통인부', '내선전공'],
        tab_main_items: [
          '조회', '계산',
        ],
        search_tab_items: [
          '계산서', '산출내역서', '노무비 산출'
        ],
        calculate_tab_items: [
          '산출내역서', '노무비 산출'
        ],
        search_cost_headers: [
          { text: '제품명', align: 'center', value: 'product_name', },
          { text: '작성일', align: 'center', value: 'cost_created_time', },
          { text: '작성자', align: 'center', value: 'cost_creater', },
          { text: '총액', align: 'center', value: 'cost_total_amount', },
        ],
        survey_cost_headers: [
          { text: 'No.', align: 'center', value: 'cost_no', },
          { text: '항목', align: 'center', value: 'cost_list', },
          { text: '단위', align: 'center', value: 'cost_unit', },
          { text: '수량', align: 'center', value: 'cost_num', },
          { text: '단가', align: 'center', value: 'cost_unit_price', },
          { text: '합계', align: 'center', value: 'cost_total', },
        ],
        labor_cost_headers: [
          { text: '품번', align: 'center', value: 'no'},
          { text: '공종', align: 'center', value: 'contract_name', },
          { text: '규격', align: 'center', value: 'contract_type', },
          { text: '직종', align: 'center', value: 'occupation', },
          { text: '공량(M/D)', align: 'center', value: 'man_day', },
          { text: '할증율', align: 'center', value: 'surcharge_rate', },
          { text: '설계조정률', align: 'center', value: 'adjustment_rate', },
          { text: '공량(M/H)', align: 'center', value: 'man_hour', },
          { text: '단가(M/D)', align: 'center', value: 'man_day_unit_price', },
          { text: '수량', align: 'center', value: 'quantity', },
          { text: '금액', align: 'center', value: 'total_amount', },
          { text: '공정별 금액', align: 'center', value: 'no_total_amount', },
          { text: '추가', align: 'center', value: '', },
        ],
        dialog_search_product_headers:[
          { text: '', align: 'center', value:'actions'},
          { text: '제품코드', align: 'center', value: 'product_code', },
          { text: '제품명', align: 'center', value: 'complete_product_name', },
          { text: '모델명', align: 'center', value: 'product_model', },
          { text: '사양', align: 'center', value: 'product_spec', },
          { text: '제조사', align: 'center', value: 'manufacturer', },
          { text: '단가', align: 'center', value: 'unit_price', },
          { text: '총액', align: 'center', value: 'product_price', },
        ],

        dialog_labor_cost_headers: [
          { text: '품번', align: 'center', value: 'no'},
          { text: '공종', align: 'center', value: 'contract_name', },
          { text: '규격', align: 'center', value: 'contract_type', },
          { text: '직종', align: 'center', value: 'occupation', },
          { text: '공량(M/D)', align: 'center', value: 'man_day', },
          { text: '할증율', align: 'center', value: 'surcharge_rate', },
          { text: '설계조정률', align: 'center', value: 'adjustment_rate', },
          { text: '공량(M/H)', align: 'center', value: 'man_hour', },
          { text: '단가(M/D)', align: 'center', value: 'man_day_unit_price', },
          { text: '수량', align: 'center', value: 'quantity', },
          { text: '금액', align: 'center', value: 'total_amount', },
          { text: '삭제', align: 'center', value: 'actions', },
        ],
        dialog_search_product_data:[
          {
            product_code:'P-ESS-PC-380V500K60H-RT-24-R1',
            complete_product_name:'ESS GFM용 PCS',
            product_model:'a',
            product_spec:'380VAC 500kW',
            manufacturer:'a',
            unit_price:'a',
            product_price:'a',
            belong_data:[
              {cost_list : 'PCS Ass`Y', cost_unit:'SET', cost_num: 1, cost_unit_price: 100},
              {cost_list : '제어기 Ass`Y', cost_unit:'SET', cost_num: 1, cost_unit_price: 100},
            ]
          },
        ],
        dialog_selected_product_data:[

        ],
        dialog_labor_cost_data:[
          {
            idx:0,
            no:'',
            contract_name:'',
            contract_type:'',
            occupation:'',
            man_day:'',
            surcharge_rate:'',
            adjustment_rate:'',
            man_hour:'',
            man_day_unit_price:'',
            quantity:'',
            total_amount:'',
            no_total_amount:'',
          },
        ],
        search_cost_data: [
          {
            product_name: 'ESS GFM용 PCS (380VAC 500kW)',
            cost_created_time: '2024-02-29',
            cost_creater: '김OO',
            cost_total_amount: '1000,000'
          },
        ],
        survey_cost_data: [
          {
            cost_no: 1,
            cost_list: '재료비',
            cost_list_colspan: 4,

            belong_data: [
              {
                cost_list: '제품A',
                cost_unit: '제품',
                cost_num: 1,
                cost_unit_price: 15000
              },
              {
                cost_list: '제품B',
                cost_unit: '제품',
                cost_num: 2,
                cost_unit_price: 10000
              }
            ]
          },
          {
            cost_no: 2,
            cost_list: '노무비',
            cost_unit: '식',
            cost_num: 1,
            cost_unit_price: 220290071
          },
          {
            cost_no: 3,
            cost_list: '경비',
            cost_unit: '식',
            cost_num: 1,
            cost_unit_price: 34885831
          },
          {
            cost_no: 4,
            cost_list: '일반관리비',
            cost_unit: '식',
            cost_num: 1,
            cost_unit_price: 15310554
          },
          {
            cost_no: 5,
            cost_list: '이윤',
            cost_unit: '식',
            cost_num: 1,
            cost_unit_price: 40572968
          }

        ],

        calc_cost_detail_data: [
          {
            cost_no: 1,
            cost_list: '재료비',
            cost_list_colspan: 4,

            belong_data: [

            ]
          },
          {
            cost_no: 2,
            cost_list: '노무비',
            cost_list_colspan: 4,
            belong_data: [
              {
                cost_list: '가. 직접 노무비',
                cost_list_colspan: 4,
                belong_data: [
                  {cost_list:'고압케이블 포설', cost_unit: '식',cost_num:'1',cost_unit_price:103530425},
                  {cost_list:'저압케이블 포설', cost_unit: '식',cost_num:'1',cost_unit_price:20639191},
                  {cost_list:'전력케이블 단말처리', cost_unit: '식', cost_num:'1', cost_unit_price:5953998},
                  {cost_list:'Cubicle 설치', cost_unit: '식', cost_num:'1', cost_unit_price:5953998},
                  {cost_list:'전기실 전원 케이블 포설', cost_unit: '식', cost_num:'1', cost_unit_price:5992473},
                  {cost_list:'케이블 트레이', cost_unit: '식', cost_num:'1', cost_unit_price:9096841},
                  {cost_list:'통신케이블 포설', cost_unit: '식', cost_num:'1', cost_unit_price:639015}
                ]
              },
              {
                cost_list: '나. 간접 노무비',
                cost_unit: '식',
                cost_num: 1,
                cost_unit_price: 23953109,
                belong_data: [
                  {
                    cost_list: '- (직접노무비) X 12.2%',
                    cost_list_colspan: 5
                  }
                ]
              }
            ]
          },
          {
            cost_no: 3,
            cost_list: '경비',
            cost_list_colspan: 4,
            belong_data: [
              {
                cost_list: '가. 고용보험료',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 2224929,
                belong_data: [
                  {
                    cost_list: '- (노무비) X 1.01%',
                    cost_list_colspan: 5
                  }
                ]
              },
              {
                cost_list: '나. 공구손료',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 5890108,
                belong_data: [
                  {
                    cost_list: '- (직접노무비) X 3%',
                    cost_list_colspan: 5
                  }
                ]
              },
              {
                cost_list: '다. 여비교통 통신비',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 920812,
                belong_data: [
                  {
                    cost_list: '- (노무비) X 0.418%',
                    cost_list_colspan: 5
                  }
                ]
              },
              {
                cost_list: '라. 산재보험료',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 8150732,
                belong_data: [
                  {
                    cost_list: '- (노무비) X 3.7%',
                    cost_list_colspan: 5
                  }
                ]
              },
              {
                cost_list: '마. 세금과공과',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 286377,
                belong_data: [
                  {
                    cost_list: '- (노무비) X 0.13%',
                    cost_list_colspan: 5
                  }
                ]
              },
              {
                cost_list: '바. 복리후생비',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 5280353,
                belong_data: [
                  {
                    cost_list: '- (노무비) X 2.397%',
                    cost_list_colspan: 5
                  }
                ]
              },
              {
                cost_list: '사. 퇴직공제 부금비',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 4515750,
                belong_data: [
                  {
                    cost_list: '- (직접노무비) X 2.3%',
                    cost_list_colspan: 5
                  }
                ]
              },
              {
                cost_list: '아. 소모품비',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 	3258090,
                belong_data: [
                  {
                    cost_list: '- (노무비) X 1.479%',
                    cost_list_colspan: 5
                  }
                ]
              },
              {
                cost_list: '자. 산업안전보건관리비',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 4358680,
                belong_data: [
                  {
                    cost_list: '- ((직접 노무비) X 1.85% X 1.2)',
                    cost_list_colspan: 5
                  }
                ]
              }
            ]
          },
          {
            cost_no: 4,
            cost_list: '일반관리비',
            cost_unit: '식',
            cost_num: 1,
            cost_unit_price: 15310554,
            cost_num_editable: true,
            allow_edit_decimal_point: true,
            belong_data: [
              {
                cost_list: '- (재료비+노무비+경비) X 6%',
                cost_list_colspan: 5
              }
            ]
          },
          {
            cost_no: 5,
            cost_list: '이윤',
            cost_unit: '식',
            cost_num: 1,
            cost_num_editable: true,
            allow_edit_decimal_point: true,
            cost_unit_price: 40572968,
            belong_data: [
              {
                cost_list: '- (노무비+경비+일반관리비) X %',
                cost_list_colspan: 5
              }
            ]
          }

        ],


        calc_cost_detail_data2: [
          {
            cost_no: 1,
            cost_list: '재료비',
            cost_list_colspan: 4,
            costListBtn: {
              text: '제품 불러오기',
              click: ()=>{this.dialog_search_product = true}
            },
            belong_data: []
          },
          {
            cost_no: 2,
            cost_list: '노무비',
            cost_list_colspan: 4,
            belong_data: [
              {
                cost_list: '가. 직접 노무비',
                cost_list_colspan: 4,
                costListBtn: {
                  text: '산출',
                  click: ()=>{this.dialog_calculate_labor = true}
                },
                belong_data: [
                  {cost_list:'고압케이블 포설', cost_unit: '식',cost_num:'1',cost_unit_price:103530425},
                  {cost_list:'저압케이블 포설', cost_unit: '식',cost_num:'1',cost_unit_price:20639191},
                  {cost_list:'전력케이블 단말처리', cost_unit: '식', cost_num:'1', cost_unit_price:5953998},
                  {cost_list:'Cubicle 설치', cost_unit: '식', cost_num:'1', cost_unit_price:5953998},
                  {cost_list:'전기실 전원 케이블 포설', cost_unit: '식', cost_num:'1', cost_unit_price:5992473},
                  {cost_list:'케이블 트레이', cost_unit: '식', cost_num:'1', cost_unit_price:9096841},
                  {cost_list:'통신케이블 포설', cost_unit: '식', cost_num:'1', cost_unit_price:639015}
                ]
              },
              {
                cost_list: '나. 간접 노무비',
                cost_unit: '식',
                cost_num: 1,
                cost_unit_price: 23953109,
                belong_data: [
                  {
                    cost_list: '- (직접노무비) X 12.2%',
                    cost_list_colspan: 5
                  }
                ]
              }
            ]
          },
          {
            cost_no: 3,
            cost_list: '경비',
            cost_list_colspan: 4,
            belong_data: [
              {
                cost_list: '가. 고용보험료',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 2224929,
                belong_data: [
                  {
                    cost_list: '- (노무비) X 1.01%',
                    cost_list_colspan: 5
                  }
                ]
              },
              {
                cost_list: '나. 공구손료',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 5890108,
                belong_data: [
                  {
                    cost_list: '- (직접노무비) X 3%',
                    cost_list_colspan: 5
                  }
                ]
              },
              {
                cost_list: '다. 여비교통 통신비',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 920812,
                belong_data: [
                  {
                    cost_list: '- (노무비) X 0.418%',
                    cost_list_colspan: 5
                  }
                ]
              },
              {
                cost_list: '라. 산재보험료',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 8150732,
                belong_data: [
                  {
                    cost_list: '- (노무비) X 3.7%',
                    cost_list_colspan: 5
                  }
                ]
              },
              {
                cost_list: '마. 세금과공과',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 286377,
                belong_data: [
                  {
                    cost_list: '- (노무비) X 0.13%',
                    cost_list_colspan: 5
                  }
                ]
              },
              {
                cost_list: '바. 복리후생비',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 5280353,
                belong_data: [
                  {
                    cost_list: '- (노무비) X 2.397%',
                    cost_list_colspan: 5
                  }
                ]
              },
              {
                cost_list: '사. 퇴직공제 부금비',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 4515750,
                belong_data: [
                  {
                    cost_list: '- (직접노무비) X 2.3%',
                    cost_list_colspan: 5
                  }
                ]
              },
              {
                cost_list: '아. 소모품비',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 	3258090,
                belong_data: [
                  {
                    cost_list: '- (노무비) X 1.479%',
                    cost_list_colspan: 5
                  }
                ]
              },
              {
                cost_list: '자. 산업안전보건관리비',
                cost_unit: '식',
                cost_num: 1,
                cost_num_editable: true,
                cost_unit_price: 4358680,
                belong_data: [
                  {
                    cost_list: '- ((직접 노무비) X 1.85% X 1.2)',
                    cost_list_colspan: 5
                  }
                ]
              }
            ]
          },
          {
            cost_no: 4,
            cost_list: '일반관리비',
            cost_unit: '식',
            cost_num: 1,
            cost_unit_price: 15310554,
            cost_num_editable: true,
            allow_edit_decimal_point: true,
            belong_data: [
              {
                cost_list: '- (재료비+노무비+경비) X 6%',
                cost_list_colspan: 5
              }
            ]
          },
          {
            cost_no: 5,
            cost_list: '이윤',
            cost_unit: '식',
            cost_num: 1,
            cost_num_editable: true,
            allow_edit_decimal_point: true,
            cost_unit_price: 40572968,
            belong_data: [
              {
                cost_list: '- (노무비+경비+일반관리비) X %',
                cost_list_colspan: 5
              }
            ]
          }

        ],

        labor_cost_data: [
          {
            no:'품-1',
            contract_name:'고압케이블 포설',
            contract_type:'240㎟, 1C',
            occupation:'저압 케이블전공',
            man_day:'0.136',
            surcharge_rate:'115%',
            adjustment_rate:'1.0000',
            man_hour:'0.156',
            man_day_unit_price:'290,333',
            quantity:'2,280',
            total_amount:'103,530,425',
            no_total_amount:'103,530,425',
          },
          {
            no:'품-2',
            contract_name:'저압케이블 포설',
            contract_type:'6㎟, 2C',
            occupation:'저압 케이블전공',
            man_day:'0.018',
            surcharge_rate:'120%',
            adjustment_rate:'1.0000',
            man_hour:'0.022',
            man_day_unit_price:'290,333',
            quantity:'880',
            total_amount:'5,518,649',
            no_total_amount:'20,639,191',
          },
          {
            no:'품-2',
            contract_name:'저압케이블 포설',
            contract_type:'2.5㎟, 6C',
            occupation:'저압 케이블전공',
            man_day:'0.035',
            surcharge_rate:'120%',
            adjustment_rate:'1.0000',
            man_hour:'0.042',
            man_day_unit_price:'290,333',
            quantity:'1240',
            total_amount:'15,120,542',
            no_total_amount:'20,639,191',
          },
          {
            no:'품-3',
            contract_name:'전력케이블 단말처리',
            contract_type:'240㎟, 1C',
            occupation:'고압 케이블전공',
            man_day:'1.170',
            surcharge_rate:'120%',
            adjustment_rate:'1.0000',
            man_hour:'1.404',
            man_day_unit_price:'353,395',
            quantity:'12',
            total_amount:'5,953,998',
            no_total_amount:'5,953,998',
          },
          {
            no:'품-4',
            contract_name:'Cubicle 설치',
            contract_type:'6㎥, 1.5 Ton이하',
            occupation:'비계공',
            man_day:'2.00',
            surcharge_rate:'100%',
            adjustment_rate:'1.0000',
            man_hour:'2.000',
            man_day_unit_price:'281,721',
            quantity:'3',
            total_amount:'1,690,326',
            no_total_amount:'50,485,019',
          },
          {
            no:'품-4',
            contract_name:'Cubicle 설치',
            contract_type:'6㎥, 1.5 Ton이하',
            occupation:'변전전공',
            man_day:'4.05',
            surcharge_rate:'100%',
            adjustment_rate:'1.0000',
            man_hour:'4.050',
            man_day_unit_price:'451,145',
            quantity:'3',
            total_amount:'5,481,411',
            no_total_amount:'50,485,019',
          },
          {
            no:'품-4',
            contract_name:'Cubicle 설치',
            contract_type:'6㎥, 1.5 Ton이하',
            occupation:'보통인부',
            man_day:'3.30',
            surcharge_rate:'100%',
            adjustment_rate:'1.0000',
            man_hour:'3.300',
            man_day_unit_price:'161,858',
            quantity:'3',
            total_amount:'1,602,394',
            no_total_amount:'50,485,019',
          },
          {
            no:'품-4',
            contract_name:'Cubicle 설치',
            contract_type:'10㎥, 3 Ton 이하',
            occupation:'비계공',
            man_day:'4.00',
            surcharge_rate:'100%',
            adjustment_rate:'1.0000',
            man_hour:'4.000',
            man_day_unit_price:'281,721',
            quantity:'8',
            total_amount:'9,015,072',
            no_total_amount:'50,485,019',
          },
          {
            no:'품-4',
            contract_name:'Cubicle 설치',
            contract_type:'10㎥, 3 Ton 이하',
            occupation:'변전전공',
            man_day:'7.05',
            surcharge_rate:'100%',
            adjustment_rate:'1.0000',
            man_hour:'7.050',
            man_day_unit_price:'451,145',
            quantity:'8',
            total_amount:'25,444,578',
            no_total_amount:'50,485,019',
          },
          {
            no:'품-4',
            contract_name:'Cubicle 설치',
            contract_type:'10㎥, 3 Ton 이하',
            occupation:'보통인부',
            man_day:'5.60',
            surcharge_rate:'100%',
            adjustment_rate:'1.0000',
            man_hour:'5.600',
            man_day_unit_price:'161,858',
            quantity:'8',
            total_amount:'7,251,238',
            no_total_amount:'50,485,019',
          },
          {
            no:'품-5',
            contract_name:'전기실  전원 케이블 포설',
            contract_type:'50sq, 3C',
            occupation:'저압 케이블전공',
            man_day:'0.043',
            surcharge_rate:'200%',
            adjustment_rate:'1.0000',
            man_hour:'0.086',
            man_day_unit_price:'290,333',
            quantity:'240',
            total_amount:'5,992,473',
            no_total_amount:'5,992,473',
          },
          {
            no:'품-6',
            contract_name:'케이블 트레이',
            contract_type:'단면적 50,000㎟ 이하',
            occupation:'내선전공',
            man_day:'0.200',
            surcharge_rate:'144%',
            adjustment_rate:'1.0000',
            man_hour:'0.288',
            man_day_unit_price:'269,968',
            quantity:'105',
            total_amount:'8,163,832',
            no_total_amount:'9,096,841',
          },
          {
            no:'품-6',
            contract_name:'케이블 트레이',
            contract_type:'단면적 30,000㎟ 이하',
            occupation:'내선전공',
            man_day:'0.160',
            surcharge_rate:'144%',
            adjustment_rate:'1.0000',
            man_hour:'0.230',
            man_day_unit_price:'269,968',
            quantity:'15',
            total_amount:'933,009',
            no_total_amount:'9,096,841',
          },
          {
            no:'품-7',
            contract_name:'통신케이블 포설',
            contract_type:'지중 인력견인 포설',
            occupation:'보통인부',
            man_day:'1.410',
            surcharge_rate:'100%',
            adjustment_rate:'1.0000',
            man_hour:'1.410',
            man_day_unit_price:'161,858',
            quantity:'2.8',
            total_amount:'639,015',
            no_total_amount:'639,015',
          },
        ],

        labor_cost_list: [
          {
            no:'품-1',
            contract_name:'고압케이블 포설',
            contract_type:'240㎟, 1C',
            occupation:'',
            man_day:'0.136',
            surcharge_rate:'115%',
            adjustment_rate:'',
            man_hour:'0.156',
            man_day_unit_price:'',
            quantity:'2,280',
            total_amount:'103,530,425',
            no_total_amount:'103,530,425',
          },
          {
            no:'품-2',
            contract_name:'저압케이블 포설',
            contract_type:'6㎟, 2C',
            occupation:'',
            man_day:'0.018',
            surcharge_rate:'120%',
            adjustment_rate:'',
            man_hour:'0.022',
            man_day_unit_price:'',
            quantity:'880',
            total_amount:'5,518,649',
            no_total_amount:'20,639,191',
          },
          {
            no:'품-2',
            contract_name:'저압케이블 포설',
            contract_type:'2.5㎟, 6C',
            occupation:'',
            man_day:'0.035',
            surcharge_rate:'120%',
            adjustment_rate:'',
            man_hour:'0.042',
            man_day_unit_price:'',
            quantity:'1240',
            total_amount:'15,120,542',
            no_total_amount:'20,639,191',
          },
          {
            no:'품-3',
            contract_name:'전력케이블 단말처리',
            contract_type:'240㎟, 1C',
            occupation:'',
            man_day:'1.170',
            surcharge_rate:'120%',
            adjustment_rate:'',
            man_hour:'1.404',
            man_day_unit_price:'',
            quantity:'12',
            total_amount:'5,953,998',
            no_total_amount:'5,953,998',
          },
          {
            no:'품-4',
            contract_name:'Cubicle 설치',
            contract_type:'6㎥, 1.5 Ton이하',
            occupation:'',
            man_day:'2.00',
            surcharge_rate:'100%',
            adjustment_rate:'',
            man_hour:'2.000',
            man_day_unit_price:'',
            quantity:'3',
            total_amount:'1,690,326',
            no_total_amount:'50,485,019',
          },
          {
            no:'품-4',
            contract_name:'Cubicle 설치',
            contract_type:'10㎥, 3 Ton 이하',
            occupation:'',
            man_day:'4.00',
            surcharge_rate:'100%',
            adjustment_rate:'',
            man_hour:'4.000',
            man_day_unit_price:'',
            quantity:'8',
            total_amount:'9,015,072',
            no_total_amount:'50,485,019',
          },
          {
            no:'품-5',
            contract_name:'전기실  전원 케이블 포설',
            contract_type:'50sq, 3C',
            occupation:'',
            man_day:'0.043',
            surcharge_rate:'200%',
            adjustment_rate:'',
            man_hour:'0.086',
            man_day_unit_price:'',
            quantity:'240',
            total_amount:'5,992,473',
            no_total_amount:'5,992,473',
          },
          {
            no:'품-6',
            contract_name:'케이블 트레이',
            contract_type:'단면적 50,000㎟ 이하',
            occupation:'',
            man_day:'0.200',
            surcharge_rate:'144%',
            adjustment_rate:'',
            man_hour:'0.288',
            man_day_unit_price:'',
            quantity:'105',
            total_amount:'8,163,832',
            no_total_amount:'9,096,841',
          },
          {
            no:'품-6',
            contract_name:'케이블 트레이',
            contract_type:'단면적 30,000㎟ 이하',
            occupation:'',
            man_day:'0.160',
            surcharge_rate:'144%',
            adjustment_rate:'',
            man_hour:'0.230',
            man_day_unit_price:'',
            quantity:'15',
            total_amount:'933,009',
            no_total_amount:'9,096,841',
          },
          {
            no:'품-7',
            contract_name:'통신케이블 포설',
            contract_type:'지중 인력견인 포설',
            occupation:'',
            man_day:'1.410',
            surcharge_rate:'100%',
            adjustment_rate:'',
            man_hour:'1.410',
            man_day_unit_price:'',
            quantity:'2.8',
            total_amount:'639,015',
            no_total_amount:'639,015',
          },
        ],

        wage_unit_price_list:[
          {occupation : '저압 케이블전공', man_day_unit_price:'290333', adjustment_rate:'1.0000'},
          {occupation : '고압 케이블전공', man_day_unit_price:'353395', adjustment_rate:'1.0000'},
          {occupation : '비계공', man_day_unit_price:'281721', adjustment_rate:'1.0000'},
          {occupation : '변전전공', man_day_unit_price:'451145', adjustment_rate:'1.0000'},
          {occupation : '보통인부', man_day_unit_price:'161858', adjustment_rate:'1.0000'},
          {occupation : '내선전공', man_day_unit_price:'269968', adjustment_rate:'1.0000'},
        ],

    }
  },

  methods: {
    addCostList(item){
      this.dialog_search_product = false;
      this.dialog_selected_product_data = item;
      this.calc_cost_detail_data2[0].belong_data = item.belong_data;
    },
    selectOccupationFunc(data, idx){
      let wage_list = this.wage_unit_price_list
      for(let i = 0; i < wage_list.length; i++){
        if(data == wage_list[i].occupation){
          this.labor_cost_list[idx].man_day_unit_price = wage_list[i].man_day_unit_price
          this.labor_cost_list[idx].adjustment_rate = wage_list[i].adjustment_rate
        }
      }
    },
    addLaborCostList(item, idx){
      this.labor_cost_list.splice(idx, 0, item)
    },
    deleteItem () {
      this.dialogDelete = true;
    },
    deleteItemConfirm () {
      this.search_cost_data.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    closeDelete(){
      this.dialogDelete = false;
    },
  },

  computed: {
  },
}
</script>
<style>
.theme--light.v-tabs-items{background-color: transparent;}
.tab_search .v-tabs-bar{height: 30px;}
.tab_search .v-tab{background-color: white; padding: 0px;border-radius: 10px 10px 0px 0px;}
.tab_search .v-tab--active{background-color: #1976d2 ; color: white; font-weight: bold;}
.cost_search_info{border:1px solid #b6b6b6; padding: 5px 15px; font-size: 13px; border-left: 0px;}
.info_title{background-color: #efefef;}
.labor_cost_list th{border-right: 1px solid #b6b6b6;}
.labor_cost_list thead th:last-child,
.labor_cost_list tbody td:last-child{border-right: 0px;}
.labor_cost_list td{border-right: 1px solid #b6b6b6; }
.labor_cost_list{text-align: center;}
.labor_cost_list table{min-width: 100rem!important;}
</style>
