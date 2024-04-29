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
                      v-model="searching_product_name"
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
                      @click="search"
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
                      item-key="product_code"
                      deletable
                      @delete="deleteItem"
                      @clickTr="clickSearchedTr"
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
                        <p class="mb-0">{{ clickedProductCost.product_name }}</p>
                        <p class="red--text">원가를 삭제하시겠습니까?</p>
                      </template>
                      삭제된 원가는 복구가 불가능합니다.
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
                  <v-card>
                    <v-card-title>
                      <v-row>
                        <v-col align-self="center" cols="12" sm="10">
                          <p class="text-h5 font-weight-black black--text mb-3">{{ clickedProductCost.product_name ? clickedProductCost.product_name : '' }}<br>
                            <!-- <span>2024-02-29</span> -->
                            <table style="  border-spacing: 0px;" class="mt-1">
                              <tr class="text-body-1">
                                <td class="cost_search_info info_title" style="border-left:1px solid #b6b6b6">작성자</td>
                                <td class="cost_search_info">{{ clickedProductCost.cost_creater ? clickedProductCost.cost_creater : '' }}</td>
                                <td class="cost_search_info info_title">작성일</td>
                                <td class="cost_search_info">{{ clickedProductCost.cost_created_time ? clickedProductCost.cost_created_time : '' }}</td>
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
                        :items="calc_cost_detail_data"
                        item-key="product_code"
                        :childTrStyle="'background-color:#efefef'"
                        prevent-editable
                        prevent-button
                        hide-children
                        :show-childs-parent-index-arr="[0]"
                        class="cost_table_border"
                      />
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <!-- 산출내역서 -->
                <v-tab-item>
                  <v-card ref="calcDetailCard">
                    <v-card-title>
                      <v-row>
                        <v-col cols="12" sm="10">
                          <p class="text-h5 black--text mb-0 font-weight-black"  style="font-weight: bold;">{{ clickedProductCost.product_name ? clickedProductCost.product_name : '' }} 산출내역서</p>
                        </v-col>

                        <v-col v-show="edit_buttons_show" cols="12" sm="2">
                          <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                v-show="edit_survey_cost_num_disabled"
                                color="success"
                                fab
                                x-small
                                class="float-right dont_print"
                                elevation="0"
                                v-bind="attrs"
                                v-on="on"
                                data-html2canvas-ignore="true"
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
                                @click="item.click === 'print' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcDetailCard, 'edit_survey_cost_data')
                                        : item.click === 'excel' ? mux.Excel.downloadTable(survey_cost_headers, calc_cost_detail_data, '산출내역서')
                                        : item.click === 'pdf' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcDetailCard, 'edit_survey_cost_data', '산출내역서') : ''"
                              >
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                          <v-btn
                            v-show="!edit_survey_cost_num_disabled"
                            color="error"
                            fab
                            x-small
                            class="float-right dont_print"
                            elevation="0"
                            data-html2canvas-ignore="true"
                            @click="edit_survey_cost_num_disabled = true"
                          >
                            <v-icon
                              small
                            >mdi-undo-variant</v-icon>
                          </v-btn>
                          <v-btn
                            v-if="edit_survey_cost_num_disabled"
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right dont_print"
                            elevation="0"
                            data-html2canvas-ignore="true"
                            @click="edit_survey_cost_num_disabled = false"
                          >
                            <v-icon
                              small
                            >mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            v-if="!edit_survey_cost_num_disabled"
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right dont_print"
                            elevation="0"
                            data-html2canvas-ignore="true"
                            @click="surveyCostNumEditSave"
                          >
                            <v-icon
                              small
                            >mdi-check</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>

                    </v-card-title>
                    <v-card-text>
                      <v-form ref="surveyCostForm">
                        <CostTableComponent
                          :headers="survey_cost_headers"
                          :items="calc_cost_detail_data"
                          item-key="product_code"
                          trStyle="background-color:#efefef; "
                          trClass="font-weight-black info_title"
                          :cost-num-edit-disabled="edit_survey_cost_num_disabled"
                          class="cost_table_border print_cost_table"
                        >
                        </CostTableComponent>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <!-- 노무비 산출 -->
                <v-tab-item>
                  <v-card>
                    <v-card-title>
                      <v-row>
                        <v-col cols="12" sm="10">
                          <p class="text-h5 font-weight-black black--text mb-0">{{ clickedProductCost.product_name ? clickedProductCost.product_name : '' }} 노무비 산출</p>
                        </v-col>
                        <v-col v-show="edit_buttons_show" cols="12" sm="2">
                          <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                color="success"
                                fab
                                x-small
                                class="float-right dont_print"
                                elevation="0"
                                v-bind="attrs"
                                v-on="on"
                                data-html2canvas-ignore="true"
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
                                @click="item.click === 'print' ? printLaborCost()
                                        : item.click === 'excel' ? mux.Excel.downloadTable(labor_cost_headers, labor_cost_data, '노무비 산출')
                                        : item.click === 'pdf' ? printLaborCost('노무비 산출') : ''"
                              >
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>

                          <v-btn
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right dont_print"
                            elevation="0"
                            data-html2canvas-ignore="true"
                            @click="dialog_calculate_labor = true"
                          >
                            <v-icon
                              small
                            >mdi-pencil</v-icon>
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
                            <td align="center">{{ item.name }}</td>
                            <td align="center">{{ item.type }}</td>
                            <td align="center">{{ item.occupation }}</td>
                            <td align="center">{{ item.man_per_day }}</td>
                            <td align="center">{{ Math.round(item.surcharge_ratio * 100) }}%</td>
                            <td align="center">{{ item.adjustment_ratio }}</td>
                            <td align="center">{{ item.man_per_hour }}</td>
                            <td align="center">{{ mux.Number.withComma(item.unit_price) }}</td>
                            <td align="center">{{ mux.Number.withComma(item.quantity) }}</td>
                            <td align="center">{{  item.total_amount ? mux.Number.withComma(item.total_amount) : mux.Number.withComma((item.man_per_hour * item.quantity * item.unit_price).toFixed(0)) }}</td>
                            <td align="center" :class="calcRowSpan(item.name, index) == 0? 'd-none' : '' " :rowspan="calcRowSpan(item.name, index)">{{  item.no_total_amount ? mux.Number.withComma(item.no_total_amount) : mux.Number.withComma(calcNoTotalAmount(item.name)) }}</td>
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
                            @click="save()"
                          >
                            <v-icon
                              small
                            >mdi-content-save</v-icon>
                          </v-btn>
                        </v-col>
                  </v-row>

                </v-card-title>
                <v-card-text>
                  <v-form ref="surveyCostForm2">
                    <CostTableComponent
                      :headers="survey_cost_headers"
                      :items="calc_cost_detail_data2"
                      item-key="product_code"
                      trStyle="background-color:#efefef"
                      trClass="font-weight-black info_title"
                      class="cost_table_border"
                    >
                    </CostTableComponent>
                  </v-form>
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
                            <td class="cost_search_info">{{ username }}</td>
                            <td class="cost_search_info info_title">작성일</td>
                            <td class="cost_search_info">{{ todayDate }}</td>
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

      <!-- 노무비 산출 출력 화면 -->
      <div ref="calcLaborCard" style="background-color: white;" v-show="print_labor_table" id="print_labor_cost">
        <p class="text-h5 font-weight-black black--text mb-5">{{ clickedProductCost.product_name ? clickedProductCost.product_name : '' }} 노무비 산출</p>
          <v-data-table
            dense
            :headers="labor_cost_headers"
            :items="labor_cost_data"
            hide-default-footer
            disable-pagination
            disable-sort
          >
            <template v-slot:item="{ item, index }">
              <tr>
                <td align="center">{{ item.no }}</td>
                <td align="center">{{ item.name }}</td>
                <td align="center">{{ item.type }}</td>
                <td align="center">{{ item.occupation }}</td>
                <td align="center">{{ item.man_per_day }}</td>
                <td align="center">{{ Math.round(item.surcharge_ratio * 100) }}%</td>
                <td align="center">{{ item.adjustment_ratio }}</td>
                <td align="center">{{ item.man_per_hour }}</td>
                <td align="center">{{ mux.Number.withComma(item.unit_price) }}</td>
                <td align="center">{{ mux.Number.withComma(item.quantity) }}</td>
                <td align="center">{{  item.total_amount ? mux.Number.withComma(item.total_amount) : mux.Number.withComma((item.man_per_hour * item.quantity * item.unit_price).toFixed(0)) }}</td>
                <td align="center" :class="calcRowSpan(item.name, index) == 0? 'print_labor_cost_dnone' : '' " :rowspan="calcRowSpan(item.name, index)">{{  item.no_total_amount ? mux.Number.withComma(item.no_total_amount) : mux.Number.withComma(calcNoTotalAmount(item.name)) }}</td>
              </tr>
            </template>
          </v-data-table>
      </div>
    </v-main>

    <!-- 제품 불러오기 Modal -->
    <ModalDialogComponent
        :dialog-value="dialog_search_product"
        max-width="1300px"
        title-class=" "
        :dialog-transition="'slide-x-transition'"
        :dialog-custom="'custom-dialog elevation-0 white'"
        :card-elevation="'0'"
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
                @click="searchProduct"
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
                @click="saveLabor"
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
                :headers="labor_list_headers"
                :items="tab_main === 0 ? labor_cost_data : labor_cost_list"
                hide-default-footer
                disable-pagination
                class="elevation-1"
                disable-sort
              >
                <template v-slot:item="{ item, index }">
                  <tr>
                    <td align="center">{{ tab_main === 0 ? (labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')) ? labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).no : '') : (labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')) ? labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).no : '') }}</td>
                    <td align="center">
                      <v-select
                        :items="tab_main === 0 ? labor_data.map(x=> x.name) : labor_list.map(x=> x.name)"
                        filled
                        dense
                        hide-details
                        v-model="item.name"
                        label=""
                        style="max-width:160px; font-size:0.775rem!important"
                      ></v-select>
                    </td>
                    <td align="center">
                      <v-select
                        :items="tab_main === 0 ? labor_data.map(x=> {if(x.name == item.name){return x.type;}}) : labor_list.map(x=> {if(x.name == item.name){return x.type;}})"
                        filled
                        dense
                        hide-details
                        v-model="item.type"
                        label=""
                        style="max-width:160px; font-size:0.775rem!important"
                      ></v-select>
                    </td>
                    <td align="center">
                      <v-select
                        :items="tab_main === 0 ? (labor_data.map(x=> {if(x.name == item.name && x.type == item.type){return x.occupation;}}).includes('ALL') ? labor_occupation_data.map(x => x.name) : labor_data.map(x=> {if(x.name == item.name && x.type == item.type){return x.occupation;}})) : (labor_list.map(x=> {if(x.name == item.name && x.type == item.type){return x.occupation;}}).includes('ALL') ? labor_occupation_list.map(x => x.name) : labor_list.map(x=> {if(x.name == item.name && x.type == item.type){return x.occupation;}}))"
                        filled
                        dense
                        hide-details
                        v-model="item.occupation"
                        label=""
                        style="max-width:160px; font-size:0.775rem!important"
                        @change="selectOccupationFunc(item, item.occupation, index)"
                      ></v-select>
                    </td>
                    <!-- man_per_day -->
                    <td align="center">{{ tab_main === 0 ? (labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')) ? labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).man_per_day : '') : (labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')) ? labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).man_per_day : '') }}</td>
                    <!-- surcharge_ratio -->
                    <td align="center">{{ tab_main === 0 ? (labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')) ? labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).surcharge_ratio : '') : (labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')) ? labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).surcharge_ratio : '') }}</td>
                    <!-- adjustment_ratio -->
                    <td align="center">{{ tab_main === 0 ? (labor_occupation_data.find(x=> x.name == item.occupation) ? labor_occupation_data.find(x=> x.name == item.occupation).adjustment_ratio : '') : (labor_occupation_list.find(x=> x.name == item.occupation) ? labor_occupation_list.find(x=> x.name == item.occupation).adjustment_ratio : '') }}</td>
                    <!-- man_per_hour -->
                    <td align="center">{{
                      (tab_main === 0 ? (labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')) ? labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).man_per_day : '') : (labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')) ? labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).man_per_day : ''))
                      && (tab_main === 0 ? (labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')) ? labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).surcharge_ratio : '') : (labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')) ? labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).surcharge_ratio : ''))
                      && (tab_main === 0 ? (labor_occupation_data.find(x=> x.name == item.occupation) ? labor_occupation_data.find(x=> x.name == item.occupation).adjustment_ratio : '') : (labor_occupation_list.find(x=> x.name == item.occupation) ? labor_occupation_list.find(x=> x.name == item.occupation).adjustment_ratio : ''))
                      ? parseFloat((
                          (tab_main === 0 ? labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).man_per_day : labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).man_per_day)
                          * (tab_main === 0 ? labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).surcharge_ratio : labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).surcharge_ratio)
                          * (tab_main === 0 ? labor_occupation_data.find(x=> x.name == item.occupation).adjustment_ratio : labor_occupation_list.find(x=> x.name == item.occupation).adjustment_ratio)
                        ).toFixed(3)) : ''
                    }}</td>
                    <!-- unit_price -->
                    <td align="center">{{ tab_main === 0 ? (labor_occupation_data.find(x=> x.name == item.occupation) ? mux.Number.withComma(labor_occupation_data.find(x=> x.name == item.occupation).unit_price) : '') : (labor_occupation_list.find(x=> x.name == item.occupation) ? mux.Number.withComma(labor_occupation_list.find(x=> x.name == item.occupation).unit_price) : '') }}</td>
                    <td align="center">
                      <v-text-field
                        v-model="item.quantity"
                        dense
                        hide-details
                        filled
                        type="number"
                        style="max-width:110px; font-size:0.775rem!important"
                      ></v-text-field>
                    </td>
                    <!-- total_amount -->
                    <td align="center">{{
                      ((tab_main === 0 ? (labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')) ? labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).man_per_day : '') : (labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')) ? labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).man_per_day : ''))
                      && (tab_main === 0 ? (labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')) ? labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).surcharge_ratio : '') : (labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')) ? labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).surcharge_ratio : ''))
                      && (tab_main === 0 ? (labor_occupation_data.find(x=> x.name == item.occupation) ? labor_occupation_data.find(x=> x.name == item.occupation).adjustment_ratio : '') : (labor_occupation_list.find(x=> x.name == item.occupation) ? labor_occupation_list.find(x=> x.name == item.occupation).adjustment_ratio : ''))
                      && (tab_main === 0 ? (labor_occupation_data.find(x=> x.name == item.occupation) ? labor_occupation_data.find(x=> x.name == item.occupation).unit_price : '') : (labor_occupation_list.find(x=> x.name == item.occupation) ? labor_occupation_list.find(x=> x.name == item.occupation).unit_price : ''))
                      ? mux.Number.withComma((
                          ((tab_main === 0 ? labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).man_per_day : labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).man_per_day)
                          * (tab_main === 0 ? labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).surcharge_ratio : labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).surcharge_ratio)
                          * (tab_main === 0 ? labor_occupation_data.find(x=> x.name == item.occupation).adjustment_ratio : labor_occupation_list.find(x=> x.name == item.occupation).adjustment_ratio)).toFixed(3)
                          * (tab_main === 0 ? labor_occupation_data.find(x=> x.name == item.occupation).unit_price : labor_occupation_list.find(x=> x.name == item.occupation).unit_price)
                          * item.quantity
                        ).toFixed(0))
                      : '')
                    }}</td>
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
                        @click="deleteLaborCostList(index)"
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
import mux from "@/mux";
import ProductCostPageConfig from "@/configure/ProductCostPageConfig.json";
import CheckPagePermission from "@/common_js/CheckPagePermission";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=ProductCostPage')],
  components: {
                NavComponent,
                ModalDialogComponent,
                DataTableComponent,
                CostTableComponent,
              },
  data(){
    return{
      mux: mux,
      todayDate: '',
      username: '',
      searching_product_name: '',
      searched_datas: {},
      tab_main: null,
      tab_search: null,
      tab_calculate: null,
      search_complete_product_code: '',
      search_complete_product_name: '',
      search_product_capacity: '',
      dialog_search_product: false,
      dialog_calculate_labor: false,
      dialogDelete: false,
      // edit_labor_cost_data: true,
      edit_survey_cost_num_disabled: true,
      edit_buttons_show: false,
      print_labor_table: false,
      editedIndex: -1,
      content_save_items: ProductCostPageConfig.content_save_items,
      labor_selectable: [],
      labor_occupation_selectable: [],

      labor_data:[],
      labor_list:[],
      labor_occupation_list:[],

      tab_main_items: ProductCostPageConfig.tab_main_items,
      search_tab_items: ProductCostPageConfig.search_tab_items,
      calculate_tab_items: ProductCostPageConfig.calculate_tab_items,
      search_cost_headers: ProductCostPageConfig.search_cost_headers,
      survey_cost_headers: ProductCostPageConfig.survey_cost_headers,
      labor_cost_headers: ProductCostPageConfig.labor_cost_headers,
      labor_list_headers: ProductCostPageConfig.labor_list_headers,
      dialog_search_product_headers: ProductCostPageConfig.dialog_search_product_headers,
      dialog_labor_cost_headers: ProductCostPageConfig.dialog_labor_cost_headers,

      dialog_search_product_data:[],
      dialog_selected_product_data:[],
      search_cost_data: [

      ],

      calc_cost_detail_data: [
        {
          cost_list: '재료비',
          cost_list_colspan: 4,

          belong_data: []
        },
        {
          cost_list: '노무비',
          cost_list_colspan: 4,
          belong_data: [
            {
              cost_list: '가. 직접 노무비',
              cost_list_colspan: 4,
              belong_data: []
            },
            {
              cost_list: '나. 간접 노무비',
              cost_unit: '식',
              cost_num: 1,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            }
          ]
        },
        {
          cost_list: '경비',
          cost_list_colspan: 4,
          belong_data: [
            {
              cost_list: '가. 고용보험료',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            },
            {
              cost_list: '나. 공구손료',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            },
            {
              cost_list: '다. 여비교통 통신비',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            },
            {
              cost_list: '라. 산재보험료',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            },
            {
              cost_list: '마. 세금과공과',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            },
            {
              cost_list: '바. 복리후생비',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            },
            {
              cost_list: '사. 퇴직공제 부금비',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            },
            {
              cost_list: '아. 소모품비',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 	0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            },
            {
              cost_list: '자. 산업안전보건관리비',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            }
          ]
        },
        {
          cost_list: '일반관리비',
          cost_unit: '식',
          cost_num: 1,
          cost_unit_price: 0,
          cost_num_editable: true,
          allow_edit_decimal_point: true,
          belong_data: [
            {
              cost_list: '',
              cost_list_colspan: 5
            }
          ]
        },
        {
          cost_list: '이윤',
          cost_unit: '식',
          cost_num: 1,
          cost_num_editable: true,
          allow_edit_decimal_point: true,
          cost_unit_price: 0,
          belong_data: [
            {
              cost_list: '',
              cost_list_colspan: 5
            }
          ]
        }

      ],


      calc_cost_detail_data2: [
        {
          cost_list: '재료비',
          cost_list_colspan: 4,
          costListBtn: {
            text: '제품 불러오기',
            click: ()=>{this.dialog_search_product = true}
          },
          belong_data: []
        },
        {
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

              ]
            },
            {
              cost_list: '나. 간접 노무비',
              cost_unit: '식',
              cost_num: 1,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            }
          ]
        },
        {
          cost_list: '경비',
          cost_list_colspan: 4,
          belong_data: [
            {
              cost_list: '가. 고용보험료',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            },
            {
              cost_list: '나. 공구손료',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            },
            {
              cost_list: '다. 여비교통 통신비',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            },
            {
              cost_list: '라. 산재보험료',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            },
            {
              cost_list: '마. 세금과공과',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            },
            {
              cost_list: '바. 복리후생비',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            },
            {
              cost_list: '사. 퇴직공제 부금비',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            },
            {
              cost_list: '아. 소모품비',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 	0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            },
            {
              cost_list: '자. 산업안전보건관리비',
              cost_unit: '식',
              cost_num: 1,
              cost_num_editable: true,
              cost_unit_price: 0,
              belong_data: [
                {
                  cost_list: '',
                  cost_list_colspan: 5
                }
              ]
            }
          ]
        },
        {
          cost_list: '일반관리비',
          cost_unit: '식',
          cost_num: 1,
          cost_unit_price: 0,
          cost_num_editable: true,
          allow_edit_decimal_point: true,
          belong_data: [
            {
              cost_list: '',
              cost_list_colspan: 5
            }
          ]
        },
        {
          cost_list: '이윤',
          cost_unit: '식',
          cost_num: 1,
          cost_num_editable: true,
          allow_edit_decimal_point: true,
          cost_unit_price: 0,
          belong_data: [
            {
              cost_list: '',
              cost_list_colspan: 5
            }
          ]
        }

      ],

      labor_cost_data: [],
      merged_labor_cost_data: [],

      labor_cost_list: [
        {
          no:'',
          name:'',
          type:'',
          occupation:'',
          man_per_day:0,
          surcharge_ratio:0,
          adjustment_ratio:0,
          man_per_hour:0,
          unit_price:0,
          quantity:0,
          total_amount:0,
          no_total_amount:0,
        }
      ],
      merged_labor_cost_list: [],

      clickedProductCost: {},

      new_cost_calc_code: '',
      new_product_code: '',
      new_product_name: '',
      new_product_spec: '',
      new_indirect_labor_num: 1,
      new_indirect_labor_ratio: 0.122,
      new_indirect_labor_formula: '직접노무비X12.2%',
      new_employment_insurance_num: 1,
      new_employment_insurance_ratio: 0.0101,
      new_employment_insurance_formula: '노무비X1.01%',
      new_tool_rent_fee_num: 1,
      new_tool_rent_fee_ratio: 0.03,
      new_tool_rent_fee_formula: '직접노무비X3%',
      new_transportation_fee_num: 1,
      new_transportation_fee_ratio: 0.00418,
      new_transportation_fee_formula: '노무비X0.418%',
      new_industrial_accident_num: 1,
      new_industrial_accident_ratio: 0.037,
      new_industrial_accident_formula: '노무비X3.7%',
      new_taxes_dues_num: 1,
      new_taxes_dues_ratio: 0.0013,
      new_taxes_dues_formula: '노무비X0.13%',
      new_welfare_benefits_num: 1,
      new_welfare_benefits_ratio: 0.02397,
      new_welfare_benefits_formula: '노무비X2.397%',
      new_retirement_num: 1,
      new_retirement_ratio: 0.023,
      new_retirement_formula: '직접노무비X2.3%',
      new_expendables_num: 1,
      new_expendables_ratio: 0.01479,
      new_expendables_formula: '노무비X1.479%',
      new_industrial_safety_num: 1,
      new_industrial_safety_ratio: 0.0222,
      new_industrial_safety_formula: '직접노무비X1.85%X1.2',
      new_normal_maintenance_fee_num: 1,
      new_normal_maintenance_fee_ratio: 0.06,
      new_normal_maintenance_fee_formula: '(재료비+노무비+경비)X6%',
      new_profite_num: 1,
      new_profite_ratio: 0.15,
      new_profite_formula: '(노무비+경비+일반관리비)X15%',
    }
  },

  watch: {
    // 노무비 Dialog show and hide
    dialog_calculate_labor(show) {
      if(this.tab_main === 0){
        if(show){
          this.labor_data = ProductCostPageConfig.labor_data;
          this.labor_occupation_data = ProductCostPageConfig.labor_occupation_data;

          this.origin_labor_cost_data = JSON.parse(JSON.stringify(this.labor_cost_data));
        }else {
          this.labor_cost_data = this.origin_labor_cost_data;
        }
      }else {
        if(show){
          this.origin_labor_cost_list = JSON.parse(JSON.stringify(this.labor_cost_list));
        }else {
          this.labor_cost_list = this.origin_labor_cost_list;
        }
      }
    },
    edit_survey_cost_num_disabled(disable) {
      if(disable){
        this.calc_cost_detail_data = this.origin_calc_cost_detail_data;
      }else {
        this.origin_calc_cost_detail_data = JSON.parse(JSON.stringify(this.calc_cost_detail_data));
      }
    },
    // 조회 - 노무비 데이터 변경
    labor_cost_data: {
      handler(new_labor_cost_data){
        this.merged_labor_cost_data = [];
        new_labor_cost_data.forEach(labor => {
          const sameNameIndex = this.merged_labor_cost_data.findIndex(x=>x.cost_list === labor.name);
          const mergedUnitPrice = Math.round(labor.unit_price * labor.quantity * labor.man_per_hour);
          if (sameNameIndex >= 0){
            this.merged_labor_cost_data[sameNameIndex].cost_unit_price += mergedUnitPrice;
          }else {
            this.merged_labor_cost_data.push({cost_list:labor.name, cost_unit:'식', cost_num:'1', cost_unit_price:mergedUnitPrice});
          }
        });

      // 조회 - 직접 노무비 리스트 적용
      this.calc_cost_detail_data_direct_labor.belong_data = this.merged_labor_cost_data;
      // 조회 - 간접 노무비 적용
      this.calc_cost_detail_data_indirect_labor.cost_unit_price = this.indirect_labor_cost_unit_price;
      // 조회 - 고용보험료 적용
      this.calc_cost_detail_data_employment_insurance.cost_unit_price = Math.round(this.total_labor_cost * this.clickedProductCost.employment_insurance_ratio);
      // 조회 - 공구손료 적용
      this.calc_cost_detail_data_tool_rent_fee.cost_unit_price = Math.round(this.direct_labor_cost * this.clickedProductCost.tool_rent_fee_ratio);
      // 조회 - 여비교통 통신비 적용
      this.calc_cost_detail_data_transportation_fee.cost_unit_price = Math.round(this.total_labor_cost * this.clickedProductCost.transportation_fee_ratio);
      // 조회 - 산재보험료 적용
      this.calc_cost_detail_data_industrial_accident.cost_unit_price = Math.round(this.total_labor_cost * this.clickedProductCost.industrial_accident_ratio);
      // 조회 - 세금과공과 적용
      this.calc_cost_detail_data_taxes_dues.cost_unit_price = Math.round(this.total_labor_cost * this.clickedProductCost.taxes_dues_ratio);
      // 조회 - 복리후생비 적용
      this.calc_cost_detail_data_welfare_benefits.cost_unit_price = Math.round(this.total_labor_cost * this.clickedProductCost.welfare_benefits_ratio);
      // 조회 - 퇴직공제 부금비 적용
      this.calc_cost_detail_data_retirement.cost_unit_price = Math.round(this.direct_labor_cost * this.clickedProductCost.retirement_ratio);
      // 조회 - 소모품비 적용
      this.calc_cost_detail_data_expendables.cost_unit_price = Math.round(this.total_labor_cost * this.clickedProductCost.expendables_ratio);
      // 조회 - 산업안전보건관리비 적용
      this.calc_cost_detail_data_industrial_safety.cost_unit_price = Math.round(this.direct_labor_cost * this.clickedProductCost.industrial_safety_ratio);

      // 조회 - 일반관리비 적용
      this.calc_cost_detail_data_normal_maintenance_fee.cost_unit_price = this.normal_maintenance_fee_unit_price;
      // 조회 - 이윤 적용
      this.calc_cost_detail_data_profite.cost_unit_price = this.profite_unit_price;
      },
      deep: true // 객체 내부 속성 변경 감지
    },

    // 조회 - 데이터 변경
    calc_cost_detail_data: {
      handler(){
        // 조회 - 일반관리비 적용
        this.calc_cost_detail_data_normal_maintenance_fee.cost_unit_price = this.normal_maintenance_fee_unit_price;
        // 조회 - 이윤 적용
        this.calc_cost_detail_data_profite.cost_unit_price = this.profite_unit_price;
      },
      deep: true // 객체 내부 속성 변경 감지
    },


    // 계산 - 노무비 데이터 변경
    labor_cost_list: {
      handler(new_labor_cost_data){
        this.merged_labor_cost_list = [];
        new_labor_cost_data.forEach(labor => {
          const sameNameIndex = this.merged_labor_cost_list.findIndex(x=>x.cost_list === labor.name);
          const mergedUnitPrice = Math.round(labor.unit_price * labor.quantity * labor.man_per_hour);
          if (sameNameIndex >= 0){
            this.merged_labor_cost_list[sameNameIndex].cost_unit_price += mergedUnitPrice;
          }else {
            this.merged_labor_cost_list.push({cost_list:labor.name, cost_unit:'식', cost_num:'1', cost_unit_price:mergedUnitPrice});
          }
        });

      // 계산 - 직접 노무비 리스트 적용
      this.calc_cost_detail_data_direct_labor2.belong_data = this.merged_labor_cost_list;
      // 계산 - 간접 노무비 적용
      this.calc_cost_detail_data_indirect_labor2.cost_unit_price = this.indirect_labor_cost_unit_price2;
      // 계산 - 고용보험료 적용
      this.calc_cost_detail_data_employment_insurance2.cost_unit_price = Math.round(this.total_labor_cost2 * this.new_employment_insurance_ratio);
      // 계산 - 공구손료 적용
      this.calc_cost_detail_data_tool_rent_fee2.cost_unit_price = Math.round(this.direct_labor_cost2 * this.new_tool_rent_fee_ratio);
      // 계산 - 여비교통 통신비 적용
      this.calc_cost_detail_data_transportation_fee2.cost_unit_price = Math.round(this.total_labor_cost2 * this.new_transportation_fee_ratio);
      // 계산 - 산재보험료 적용
      this.calc_cost_detail_data_industrial_accident2.cost_unit_price = Math.round(this.total_labor_cost2 * this.new_industrial_accident_ratio);
      // 계산 - 세금과공과 적용
      this.calc_cost_detail_data_taxes_dues2.cost_unit_price = Math.round(this.total_labor_cost2 * this.new_taxes_dues_ratio);
      // 계산 - 복리후생비 적용
      this.calc_cost_detail_data_welfare_benefits2.cost_unit_price = Math.round(this.total_labor_cost2 * this.new_welfare_benefits_ratio);
      // 계산 - 퇴직공제 부금비 적용
      this.calc_cost_detail_data_retirement2.cost_unit_price = Math.round(this.direct_labor_cost2 * this.new_retirement_ratio);
      // 계산 - 소모품비 적용
      this.calc_cost_detail_data_expendables2.cost_unit_price = Math.round(this.total_labor_cost2 * this.new_expendables_ratio);
      // 계산 - 산업안전보건관리비 적용
      this.calc_cost_detail_data_industrial_safety2.cost_unit_price = Math.round(this.direct_labor_cost2 * this.new_industrial_safety_ratio);

      // 계산 - 일반관리비 적용
      this.calc_cost_detail_data_normal_maintenance_fee2.cost_unit_price = this.normal_maintenance_fee_unit_price2;
      // 계산 - 이윤 적용
      this.calc_cost_detail_data_profite2.cost_unit_price = this.profite_unit_price2;
      },
      deep: true // 객체 내부 속성 변경 감지
    },

    // 계산 - 데이터 변경
    calc_cost_detail_data2: {
      handler(){
        // 계산 - 일반관리비 적용
        this.calc_cost_detail_data_normal_maintenance_fee2.cost_unit_price = this.normal_maintenance_fee_unit_price2;
        // 계산 - 이윤 적용
        this.calc_cost_detail_data_profite2.cost_unit_price = this.profite_unit_price2;
      },
      deep: true // 객체 내부 속성 변경 감지
    },

  },

  computed: {
    total_product_cost(){ return this.calc_cost_detail_data_product_cost.belong_data.reduce((a,b)=>{
        return a + Math.round(b.cost_unit_price * b.cost_num);
      }, 0)},
    direct_labor_cost(){ return this.merged_labor_cost_data.reduce((a,b)=>{
        return a + Math.round(b.cost_unit_price * b.cost_num);
      }, 0)},
    indirect_labor_cost_unit_price(){ return Math.round(this.direct_labor_cost * this.clickedProductCost.indirect_labor_ratio)},
    indirect_labor_cost(){ return this.calc_cost_detail_data_indirect_labor.cost_num * this.indirect_labor_cost_unit_price},
    total_labor_cost(){ return this.direct_labor_cost + this.indirect_labor_cost},
    total_expense_fee(){ return Math.round(this.calc_cost_detail_data_employment_insurance.cost_unit_price * this.calc_cost_detail_data_employment_insurance.cost_num)
      + Math.round(this.calc_cost_detail_data_tool_rent_fee.cost_unit_price * this.calc_cost_detail_data_tool_rent_fee.cost_num)
      + Math.round(this.calc_cost_detail_data_transportation_fee.cost_unit_price * this.calc_cost_detail_data_transportation_fee.cost_num)
      + Math.round(this.calc_cost_detail_data_industrial_accident.cost_unit_price * this.calc_cost_detail_data_industrial_accident.cost_num)
      + Math.round(this.calc_cost_detail_data_taxes_dues.cost_unit_price * this.calc_cost_detail_data_taxes_dues.cost_num)
      + Math.round(this.calc_cost_detail_data_welfare_benefits.cost_unit_price * this.calc_cost_detail_data_welfare_benefits.cost_num)
      + Math.round(this.calc_cost_detail_data_retirement.cost_unit_price * this.calc_cost_detail_data_retirement.cost_num)
      + Math.round(this.calc_cost_detail_data_expendables.cost_unit_price * this.calc_cost_detail_data_expendables.cost_num)
      + Math.round(this.calc_cost_detail_data_industrial_safety.cost_unit_price * this.calc_cost_detail_data_industrial_safety.cost_num)},
    normal_maintenance_fee_unit_price(){ return Math.round((this.total_product_cost + this.total_labor_cost + this.total_expense_fee) * this.clickedProductCost.normal_maintenance_fee_ratio)},
    normal_maintenance_fee(){ return Math.round(this.normal_maintenance_fee_unit_price * this.calc_cost_detail_data_normal_maintenance_fee.cost_num)},
    profite_unit_price() { return Math.round((this.total_labor_cost + this.total_expense_fee + this.normal_maintenance_fee) * this.clickedProductCost.profite_ratio)},
    profite(){ return Math.round(this.profite_unit_price * this.calc_cost_detail_data_profite.cost_num)},

    calc_cost_detail_data_product_cost(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='재료비')},
    calc_cost_detail_data_direct_labor(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='노무비').belong_data.find(x=>x.cost_list.includes('직접 노무비'))},
    calc_cost_detail_data_indirect_labor(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='노무비').belong_data.find(x=>x.cost_list.includes('간접 노무비'))},
    calc_cost_detail_data_employment_insurance(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('고용보험료'))},
    calc_cost_detail_data_tool_rent_fee(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('공구손료'))},
    calc_cost_detail_data_transportation_fee(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('여비교통 통신비'))},
    calc_cost_detail_data_industrial_accident(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('산재보험료'))},
    calc_cost_detail_data_taxes_dues(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('세금과공과'))},
    calc_cost_detail_data_welfare_benefits(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('복리후생비'))},
    calc_cost_detail_data_retirement(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('퇴직공제 부금비'))},
    calc_cost_detail_data_expendables(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('소모품비'))},
    calc_cost_detail_data_industrial_safety(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('산업안전보건관리비'))},
    calc_cost_detail_data_normal_maintenance_fee(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='일반관리비')},
    calc_cost_detail_data_profite(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='이윤')},

    total_product_cost2(){ return this.calc_cost_detail_data_product_cost2.belong_data.reduce((a,b)=>{
        return a + Math.round(b.cost_unit_price * b.cost_num);
      }, 0)},
    direct_labor_cost2(){ return this.merged_labor_cost_list.reduce((a,b)=>{
        return a + Math.round(b.cost_unit_price * b.cost_num);
      }, 0)},
    indirect_labor_cost_unit_price2(){ return Math.round(this.direct_labor_cost2 * this.new_indirect_labor_ratio)},
    indirect_labor_cost2(){ return this.calc_cost_detail_data_indirect_labor2.cost_num * this.indirect_labor_cost_unit_price2},
    total_labor_cost2(){ return this.direct_labor_cost2 + this.indirect_labor_cost2},
    total_expense_fee2(){ return Math.round(this.calc_cost_detail_data_employment_insurance2.cost_unit_price * this.calc_cost_detail_data_employment_insurance2.cost_num)
      + Math.round(this.calc_cost_detail_data_tool_rent_fee2.cost_unit_price * this.calc_cost_detail_data_tool_rent_fee2.cost_num)
      + Math.round(this.calc_cost_detail_data_transportation_fee2.cost_unit_price * this.calc_cost_detail_data_transportation_fee2.cost_num)
      + Math.round(this.calc_cost_detail_data_industrial_accident2.cost_unit_price * this.calc_cost_detail_data_industrial_accident2.cost_num)
      + Math.round(this.calc_cost_detail_data_taxes_dues2.cost_unit_price * this.calc_cost_detail_data_taxes_dues2.cost_num)
      + Math.round(this.calc_cost_detail_data_welfare_benefits2.cost_unit_price * this.calc_cost_detail_data_welfare_benefits2.cost_num)
      + Math.round(this.calc_cost_detail_data_retirement2.cost_unit_price * this.calc_cost_detail_data_retirement2.cost_num)
      + Math.round(this.calc_cost_detail_data_expendables2.cost_unit_price * this.calc_cost_detail_data_expendables2.cost_num)
      + Math.round(this.calc_cost_detail_data_industrial_safety2.cost_unit_price * this.calc_cost_detail_data_industrial_safety2.cost_num)},
    normal_maintenance_fee_unit_price2(){ return Math.round((this.total_product_cost2 + this.total_labor_cost2 + this.total_expense_fee2) * this.new_normal_maintenance_fee_ratio)},
    normal_maintenance_fee2(){ return Math.round(this.normal_maintenance_fee_unit_price2 * this.calc_cost_detail_data_normal_maintenance_fee2.cost_num)},
    profite_unit_price2() { return Math.round((this.total_labor_cost2 + this.total_expense_fee2 + this.normal_maintenance_fee2) * this.new_profite_ratio)},
    profite2(){ return Math.round(this.profite_unit_price2 * this.calc_cost_detail_data_profite2.cost_num)},

    calc_cost_detail_data_product_cost2(){ return this.calc_cost_detail_data2.find(x=>x.cost_list==='재료비')},
    calc_cost_detail_data_direct_labor2(){ return this.calc_cost_detail_data2.find(x=>x.cost_list==='노무비').belong_data.find(x=>x.cost_list.includes('직접 노무비'))},
    calc_cost_detail_data_indirect_labor2(){ return this.calc_cost_detail_data2.find(x=>x.cost_list==='노무비').belong_data.find(x=>x.cost_list.includes('간접 노무비'))},
    calc_cost_detail_data_employment_insurance2(){ return this.calc_cost_detail_data2.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('고용보험료'))},
    calc_cost_detail_data_tool_rent_fee2(){ return this.calc_cost_detail_data2.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('공구손료'))},
    calc_cost_detail_data_transportation_fee2(){ return this.calc_cost_detail_data2.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('여비교통 통신비'))},
    calc_cost_detail_data_industrial_accident2(){ return this.calc_cost_detail_data2.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('산재보험료'))},
    calc_cost_detail_data_taxes_dues2(){ return this.calc_cost_detail_data2.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('세금과공과'))},
    calc_cost_detail_data_welfare_benefits2(){ return this.calc_cost_detail_data2.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('복리후생비'))},
    calc_cost_detail_data_retirement2(){ return this.calc_cost_detail_data2.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('퇴직공제 부금비'))},
    calc_cost_detail_data_expendables2(){ return this.calc_cost_detail_data2.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('소모품비'))},
    calc_cost_detail_data_industrial_safety2(){ return this.calc_cost_detail_data2.find(x=>x.cost_list==='경비').belong_data.find(x=>x.cost_list.includes('산업안전보건관리비'))},
    calc_cost_detail_data_normal_maintenance_fee2(){ return this.calc_cost_detail_data2.find(x=>x.cost_list==='일반관리비')},
    calc_cost_detail_data_profite2(){ return this.calc_cost_detail_data2.find(x=>x.cost_list==='이윤')},
  },

  async mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
    console.log('this.$cookies.keys() :>> ', this.$cookies.keys());
    console.log('this.$configJson.cookies.name.key :>> ', this.$configJson.cookies.name.key);
    console.log('this.$cookies.get(this.$configJson.cookies.name.key) :>> ', this.$cookies.get(this.$configJson.cookies.name.key));
    this.username = this.$cookies.get(this.$configJson.cookies.name.key);
    console.log('this.username :>> ', this.username);
    this.todayDate = mux.Date.format(new Date(), 'yyyy-MM-dd');
    // const prevURL = window.location.href;
    // try {
    //   const current_data = await mux.Server.get({path:'/product-cost/'});
    //   if (prevURL !== window.location.href) return;
    //   this.new_indirect_labor_ratio = current_data.cost_ratio.find(x=> x.type === '간접 노무비').ratio;
    //   this.new_indirect_labor_formula = current_data.cost_ratio.find(x=> x.type === '간접 노무비').formula;
    //   this.new_employment_insurance_ratio = current_data.cost_ratio.find(x=> x.type === '고용보험료').ratio;
    //   this.new_employment_insurance_formula = current_data.cost_ratio.find(x=> x.type === '고용보험료').formula;
    //   this.new_tool_rent_fee_ratio = current_data.cost_ratio.find(x=> x.type === '공구손료').ratio;
    //   this.new_tool_rent_fee_formula = current_data.cost_ratio.find(x=> x.type === '공구손료').formula;
    //   this.new_transportation_fee_ratio = current_data.cost_ratio.find(x=> x.type === '여비교통 통신비').ratio;
    //   this.new_transportation_fee_formula = current_data.cost_ratio.find(x=> x.type === '여비교통 통신비').formula;
    //   this.new_industrial_accident_ratio = current_data.cost_ratio.find(x=> x.type === '산재보험료').ratio;
    //   this.new_industrial_accident_formula = current_data.cost_ratio.find(x=> x.type === '산재보험료').formula;
    //   this.new_taxes_dues_ratio = current_data.cost_ratio.find(x=> x.type === '세금과공과').ratio;
    //   this.new_taxes_dues_formula = current_data.cost_ratio.find(x=> x.type === '세금과공과').formula;
    //   this.new_welfare_benefits_ratio = current_data.cost_ratio.find(x=> x.type === '복리후생비').ratio;
    //   this.new_welfare_benefits_formula = current_data.cost_ratio.find(x=> x.type === '복리후생비').formula;
    //   this.new_retirement_ratio = current_data.cost_ratio.find(x=> x.type === '퇴직공제 부금비').ratio;
    //   this.new_retirement_formula = current_data.cost_ratio.find(x=> x.type === '퇴직공제 부금비').formula;
    //   this.new_expendables_ratio = current_data.cost_ratio.find(x=> x.type === '소모품비').ratio;
    //   this.new_expendables_formula = current_data.cost_ratio.find(x=> x.type === '소모품비').formula;
    //   this.new_industrial_safety_ratio = current_data.cost_ratio.find(x=> x.type === '산업안전보건관리비').ratio;
    //   this.new_industrial_safety_formula = current_data.cost_ratio.find(x=> x.type === '산업안전보건관리비').formula;
    //   this.new_normal_maintenance_fee_ratio = current_data.cost_ratio.find(x=> x.type === '일반관리비').ratio;
    //   this.new_normal_maintenance_fee_formula = current_data.cost_ratio.find(x=> x.type === '일반관리비').formula;
    //   this.new_profite_ratio = current_data.cost_ratio.find(x=> x.type === '이윤').ratio;
    //   this.new_profite_formula = current_data.cost_ratio.find(x=> x.type === '이윤').formula;
    // } catch (error) {
    //   if (prevURL !== window.location.href) return;
    //   alert(error);
    // }

    this.labor_list = ProductCostPageConfig.labor_list;
    this.labor_occupation_list = ProductCostPageConfig.labor_occupation_list;

    // set num
    this.calc_cost_detail_data_employment_insurance2.cost_num = this.new_employment_insurance_num;
    this.calc_cost_detail_data_tool_rent_fee2.cost_num = this.new_tool_rent_fee_num;
    this.calc_cost_detail_data_transportation_fee2.cost_num = this.new_transportation_fee_num;
    this.calc_cost_detail_data_industrial_accident2.cost_num = this.new_industrial_accident_num;
    this.calc_cost_detail_data_taxes_dues2.cost_num = this.new_taxes_dues_num;
    this.calc_cost_detail_data_welfare_benefits2.cost_num = this.new_welfare_benefits_num;
    this.calc_cost_detail_data_retirement2.cost_num = this.new_retirement_num;
    this.calc_cost_detail_data_expendables2.cost_num = this.new_expendables_num;
    this.calc_cost_detail_data_industrial_safety2.cost_num = this.new_industrial_safety_num;
    this.calc_cost_detail_data_normal_maintenance_fee2.cost_num = this.new_normal_maintenance_fee_num;
    this.calc_cost_detail_data_profite2.cost_num = this.new_profite_num;
    // set formula
    this.calc_cost_detail_data_indirect_labor2.belong_data[0].cost_list = ' - ' + this.new_indirect_labor_formula;
    this.calc_cost_detail_data_employment_insurance2.belong_data[0].cost_list = ' - ' + this.new_employment_insurance_formula;
    this.calc_cost_detail_data_tool_rent_fee2.belong_data[0].cost_list = ' - ' + this.new_tool_rent_fee_formula;
    this.calc_cost_detail_data_transportation_fee2.belong_data[0].cost_list = ' - ' + this.new_transportation_fee_formula;
    this.calc_cost_detail_data_industrial_accident2.belong_data[0].cost_list = ' - ' + this.new_industrial_accident_formula;
    this.calc_cost_detail_data_taxes_dues2.belong_data[0].cost_list = ' - ' + this.new_taxes_dues_formula;
    this.calc_cost_detail_data_welfare_benefits2.belong_data[0].cost_list = ' - ' + this.new_welfare_benefits_formula;
    this.calc_cost_detail_data_retirement2.belong_data[0].cost_list = ' - ' + this.new_retirement_formula;
    this.calc_cost_detail_data_expendables2.belong_data[0].cost_list = ' - ' + this.new_expendables_formula;
    this.calc_cost_detail_data_industrial_safety2.belong_data[0].cost_list = ' - ' + this.new_industrial_safety_formula;
    this.calc_cost_detail_data_normal_maintenance_fee2.belong_data[0].cost_list = ' - ' + this.new_normal_maintenance_fee_formula;
    this.calc_cost_detail_data_profite2.belong_data[0].cost_list = ' - ' + this.new_profite_formula;
  },

  methods: {
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    search(){
      const keyword = this.searching_product_name.trim();
      console.log('keyword :>> ', keyword);

      const searchResult = ProductCostPageConfig.search_result;

      this.clearClicked();
      this.searchDataCalcProcess(searchResult, true);

    },
    searchProduct(){
      const product_code = this.search_complete_product_code.trim();
      const product_name = this.search_complete_product_name.trim();
      const product_capacity = this.search_product_capacity.trim();
      console.log(`${product_code} / ${product_name} / ${product_capacity}`);

      const searchResult = ProductCostPageConfig.dialog_search_product_data;

      this.dialog_search_product_data = searchResult;
    },
    searchDataCalcProcess(searchResult, isFirst){
      const productTotalCost = searchResult.product_cost_calc_detail.reduce((a,b)=>{
        return a + Math.round(b.module_num > 0 ? b.module_num * b.module_unit_price : b.material_num * b.material_unit_price);
      }, 0);
      const directLaborCost = searchResult.labor_cost_calc_detail.reduce((a,b)=>{
        return a + Math.round(b.unit_price * b.quantity * b.man_per_hour);
      }, 0);

      const productCostArr = searchResult.product_cost.map((info)=> {
        let indirectLaborUnitPrice = Math.round(directLaborCost * info.indirect_labor_ratio);
        const indirectLaborCost = Math.round(indirectLaborUnitPrice * info.indirect_labor_num);
        const totalLaborCost = directLaborCost + indirectLaborCost;
        let employmentInsuranceUnitPrice = Math.round(totalLaborCost * info.employment_insurance_ratio);
        const employmentInsuranceCost = Math.round(employmentInsuranceUnitPrice * info.employment_insurance_num);
        let toolRentFeeUnitPrice = Math.round(directLaborCost * info.tool_rent_fee_ratio);
        const toolRentFeeCost = Math.round(toolRentFeeUnitPrice * info.tool_rent_fee_num);
        let transportationFeeUnitPrice = Math.round(totalLaborCost * info.transportation_fee_ratio);
        const transportationFeeCost = Math.round(transportationFeeUnitPrice * info.transportation_fee_num);
        let industrialAccidentUnitPrice = Math.round(totalLaborCost * info.industrial_accident_ratio);
        const industrialAccidentCost = Math.round(industrialAccidentUnitPrice * info.industrial_accident_num);
        let taxesDuesUnitPrice = Math.round(totalLaborCost * info.taxes_dues_ratio);
        const taxesDuesCost = Math.round(taxesDuesUnitPrice * info.taxes_dues_num);
        let welfareBenefitsUnitPrice = Math.round(totalLaborCost * info.welfare_benefits_ratio);
        const welfareBenefitsCost = Math.round(welfareBenefitsUnitPrice * info.welfare_benefits_num);
        let retirementUnitPrice = Math.round(directLaborCost * info.retirement_ratio);
        const retirementCost = Math.round(retirementUnitPrice * info.retirement_num);
        let expendablesUnitPrice = Math.round(totalLaborCost * info.expendables_ratio);
        const expendablesCost = Math.round(expendablesUnitPrice * info.expendables_num);
        let industrialSafetyUnitPrice = Math.round(directLaborCost * info.industrial_safety_ratio);
        const industrialSafetyCost = Math.round(industrialSafetyUnitPrice * info.industrial_safety_num);
        const totalExpenseFeeCost = employmentInsuranceCost + toolRentFeeCost + transportationFeeCost + industrialAccidentCost + taxesDuesCost + welfareBenefitsCost + retirementCost + expendablesCost + industrialSafetyCost;
        let normalMaintenanceFeeUnitPrice = Math.round((productTotalCost + totalLaborCost + totalExpenseFeeCost) * info.normal_maintenance_fee_ratio);
        const normalMaintenanceFeeCost = Math.round(normalMaintenanceFeeUnitPrice * info.normal_maintenance_fee_num);
        let profiteUnitPrice = Math.round((totalLaborCost + totalExpenseFeeCost + normalMaintenanceFeeCost) * info.profite_ratio);
        const profiteCost = Math.round(profiteUnitPrice * info.profite_num);

        const allTotalCost = productTotalCost + totalLaborCost + totalExpenseFeeCost + normalMaintenanceFeeCost + profiteCost;
        info.cost_total_amount = mux.Number.withComma(allTotalCost);
        if (isFirst){
          info.product_name += '('+info.product_spec+')';
        }
        return info;
      });

      this.search_cost_data = productCostArr;
      this.searched_datas = searchResult;
    },
    addCostList(item){
      this.dialog_search_product = false;
      this.dialog_selected_product_data = item;
      this.calc_cost_detail_data2[0].belong_data = item.belong_data;
    },
    selectOccupationFunc(item, data){
      let wage_list;
      if (this.tab_main == 0){
        wage_list = this.labor_occupation_data;
      }else {
        wage_list = this.labor_occupation_list;
      }
      for(let i = 0; i < wage_list.length; i++){
        if(data == wage_list[i].name){
          item.unit_price = wage_list[i].unit_price
          item.adjustment_ratio = wage_list[i].adjustment_ratio
          item.man_per_hour =  (item.man_per_day * item.surcharge_ratio * item.adjustment_ratio).toFixed(3);
        }
      }
    },
    addLaborCostList(item, idx){
      const newItem = JSON.parse(JSON.stringify(item));
      if(this.tab_main == 0){
        this.labor_cost_data.splice(idx, 0, newItem)
      }else if (this.tab_main == 1){
        this.labor_cost_list.splice(idx, 0, newItem)
      }
    },
    deleteLaborCostList(idx){
      let target_labor_cost;
      if(this.tab_main == 0){
        target_labor_cost = this.labor_cost_data;
      }else if (this.tab_main == 1){
        target_labor_cost = this.labor_cost_list;
      }

      if (target_labor_cost.length === 1){
        alert('모든 행을 삭제할 수 없습니다.');
        return;
      }

      target_labor_cost.splice(idx, 1);
    },
    clickSearchedTr(item) {
      this.edit_survey_cost_num_disabled = true;
      this.edit_buttons_show = true;
      this.clickedProductCost = item;
      this.labor_cost_data = this.searched_datas.labor_cost_calc_detail.filter(x=>x.cost_calc_code === item.cost_calc_code);
      this.calc_cost_detail_data_product_cost.belong_data = this.searched_datas.product_cost_calc_detail.filter(x=>x.cost_calc_code === item.cost_calc_code).map((a) => {
        if (a.module_name){
          a.cost_list = a.module_name;
          a.cost_num = a.module_num;
          a.cost_unit_price = a.module_unit_price;
        }else {
          a.cost_list = a.material_name;
          a.cost_num = a.material_num;
          a.cost_unit_price = a.material_unit_price;
        }
        a.cost_unit = '제품';
        return a;
      });
      // set num
      this.calc_cost_detail_data_employment_insurance.cost_num = this.clickedProductCost.employment_insurance_num;
      this.calc_cost_detail_data_tool_rent_fee.cost_num = this.clickedProductCost.tool_rent_fee_num;
      this.calc_cost_detail_data_transportation_fee.cost_num = this.clickedProductCost.transportation_fee_num;
      this.calc_cost_detail_data_industrial_accident.cost_num = this.clickedProductCost.industrial_accident_num;
      this.calc_cost_detail_data_taxes_dues.cost_num = this.clickedProductCost.taxes_dues_num;
      this.calc_cost_detail_data_welfare_benefits.cost_num = this.clickedProductCost.welfare_benefits_num;
      this.calc_cost_detail_data_retirement.cost_num = this.clickedProductCost.retirement_num;
      this.calc_cost_detail_data_expendables.cost_num = this.clickedProductCost.expendables_num;
      this.calc_cost_detail_data_industrial_safety.cost_num = this.clickedProductCost.industrial_safety_num;
      this.calc_cost_detail_data_normal_maintenance_fee.cost_num = this.clickedProductCost.normal_maintenance_fee_num;
      this.calc_cost_detail_data_profite.cost_num = this.clickedProductCost.profite_num;
      // set formula
      this.calc_cost_detail_data_indirect_labor.belong_data[0].cost_list = ' - ' + this.clickedProductCost.indirect_labor_formula;
      this.calc_cost_detail_data_employment_insurance.belong_data[0].cost_list = ' - ' + this.clickedProductCost.employment_insurance_formula;
      this.calc_cost_detail_data_tool_rent_fee.belong_data[0].cost_list = ' - ' + this.clickedProductCost.tool_rent_fee_formula;
      this.calc_cost_detail_data_transportation_fee.belong_data[0].cost_list = ' - ' + this.clickedProductCost.transportation_fee_formula;
      this.calc_cost_detail_data_industrial_accident.belong_data[0].cost_list = ' - ' + this.clickedProductCost.industrial_accident_formula;
      this.calc_cost_detail_data_taxes_dues.belong_data[0].cost_list = ' - ' + this.clickedProductCost.taxes_dues_formula;
      this.calc_cost_detail_data_welfare_benefits.belong_data[0].cost_list = ' - ' + this.clickedProductCost.welfare_benefits_formula;
      this.calc_cost_detail_data_retirement.belong_data[0].cost_list = ' - ' + this.clickedProductCost.retirement_formula;
      this.calc_cost_detail_data_expendables.belong_data[0].cost_list = ' - ' + this.clickedProductCost.expendables_formula;
      this.calc_cost_detail_data_industrial_safety.belong_data[0].cost_list = ' - ' + this.clickedProductCost.industrial_safety_formula;
      this.calc_cost_detail_data_normal_maintenance_fee.belong_data[0].cost_list = ' - ' + this.clickedProductCost.normal_maintenance_fee_formula;
      this.calc_cost_detail_data_profite.belong_data[0].cost_list = ' - ' + this.clickedProductCost.profite_formula;
    },
    deleteItem () {
      this.dialogDelete = true;
    },
    deleteItemConfirm () {
      for (let i = this.search_cost_data.length - 1; i >= 0; i--) {
        const data = this.search_cost_data[i];
        if (data.cost_calc_code === this.clickedProductCost.cost_calc_code){
          this.search_cost_data.splice(i, 1);
        }
      }
      Object.keys(this.searched_datas).forEach(key => {
        for (let i = this.searched_datas[key].length - 1; i >= 0; i--) {
          const data = this.searched_datas[key][i];
          if (data.cost_calc_code === this.clickedProductCost.cost_calc_code){
            this.searched_datas[key].splice(i, 1);
          }
        }
      });

      this.clearClicked();
      this.closeDelete();
    },
    closeDelete(){
      this.dialogDelete = false;
    },
    clearClicked() {
      this.calc_cost_detail_data_product_cost.belong_data = [];
      // 조회 - 직접 노무비 리스트 적용
      this.calc_cost_detail_data_direct_labor.belong_data = [];
      // 조회 - 간접 노무비 적용
      this.calc_cost_detail_data_indirect_labor.cost_unit_price = 0;
      // 조회 - 고용보험료 적용
      this.calc_cost_detail_data_employment_insurance.cost_unit_price = 0;
      // 조회 - 공구손료 적용
      this.calc_cost_detail_data_tool_rent_fee.cost_unit_price = 0;
      // 조회 - 여비교통 통신비 적용
      this.calc_cost_detail_data_transportation_fee.cost_unit_price = 0;
      // 조회 - 산재보험료 적용
      this.calc_cost_detail_data_industrial_accident.cost_unit_price = 0;
      // 조회 - 세금과공과 적용
      this.calc_cost_detail_data_taxes_dues.cost_unit_price = 0;
      // 조회 - 복리후생비 적용
      this.calc_cost_detail_data_welfare_benefits.cost_unit_price = 0;
      // 조회 - 퇴직공제 부금비 적용
      this.calc_cost_detail_data_retirement.cost_unit_price = 0;
      // 조회 - 소모품비 적용
      this.calc_cost_detail_data_expendables.cost_unit_price = 0;
      // 조회 - 산업안전보건관리비 적용
      this.calc_cost_detail_data_industrial_safety.cost_unit_price = 0;

      // 조회 - 일반관리비 적용
      this.calc_cost_detail_data_normal_maintenance_fee.cost_unit_price = 0;
      // 조회 - 이윤 적용
      this.calc_cost_detail_data_profite.cost_unit_price = 0;

      this.calc_cost_detail_data_indirect_labor.belong_data[0].cost_list = '';
      this.calc_cost_detail_data_employment_insurance.belong_data[0].cost_list = '';
      this.calc_cost_detail_data_tool_rent_fee.belong_data[0].cost_list = '';
      this.calc_cost_detail_data_transportation_fee.belong_data[0].cost_list = '';
      this.calc_cost_detail_data_industrial_accident.belong_data[0].cost_list = '';
      this.calc_cost_detail_data_taxes_dues.belong_data[0].cost_list = '';
      this.calc_cost_detail_data_welfare_benefits.belong_data[0].cost_list = '';
      this.calc_cost_detail_data_retirement.belong_data[0].cost_list = '';
      this.calc_cost_detail_data_expendables.belong_data[0].cost_list = '';
      this.calc_cost_detail_data_industrial_safety.belong_data[0].cost_list = '';
      this.calc_cost_detail_data_normal_maintenance_fee.belong_data[0].cost_list = '';
      this.calc_cost_detail_data_profite.belong_data[0].cost_list = '';

      this.edit_survey_cost_num_disabled = true;
      this.edit_buttons_show = false;
      this.labor_cost_data = [];
      this.clickedProductCost = {};
    },
    calcNoTotalAmount(labor){
      let labor_data = this.labor_cost_data
      let sum_no_total_amount = 0;
      labor_data.forEach(data =>{
        if(data.name == labor){
          sum_no_total_amount += Number((data.man_per_hour * data.quantity * data.unit_price).toFixed(0));
        }
      })
      return sum_no_total_amount;
    },
    calcRowSpan(labor, idx){
      let labor_data = this.labor_cost_data
      let rowspan = 0;
      if(idx > 0  && labor_data[idx].name == labor_data[idx-1].name){
        rowspan = 0;
      }else {
        labor_data.forEach(data =>{
          if(data.name == labor){
            rowspan++;
          }
        })
      }
      return rowspan;
    },
    printLaborCost(fileName){
      this.print_labor_table = true;

      setTimeout(async () => {
        if (fileName){
          mux.Util.downloadPDF(this.$refs.calcLaborCard, fileName);
          this.print_labor_table = false;
        }else {
          mux.Util.print(this.$refs.calcLaborCard);
          this.print_labor_table = false;
        }
      }, 500);

    },

    // 파일명 인자 있을 경우 PDF download, 없을 경우 print
    async costDetailPrintOrPDF(itemsThisKeyStr, element, editableVarThisKeyStr, fileName) {
      let items = this[itemsThisKeyStr];
      const originItems = JSON.parse(JSON.stringify(items));
      items = items.map(item => {
        for (let i = Object.keys(item).length - 1; i >= 0; i--) {
          const key = Object.keys(item)[i];
          if (key.includes('editable')){
            delete item[key];
          }
          if (key === 'belong_data'){
            for (let j = 0; j < item.belong_data.length; j++) {
              const innerItem = item.belong_data[j];
              for (let ii = Object.keys(innerItem).length - 1; ii >= 0; ii--) {
                const innerKey = Object.keys(innerItem)[ii];
                if (innerKey.includes('editable')){
                  delete innerItem[innerKey];
                }
                if (innerKey === 'belong_data'){
                  for (let j = 0; j < innerItem.belong_data.length; j++) {
                    const belongInnerItem = innerItem.belong_data[j];
                    for (let ii = Object.keys(belongInnerItem).length - 1; ii >= 0; ii--) {
                      const belongInnerKey = Object.keys(belongInnerItem)[ii];
                      if (belongInnerKey.includes('editable')){
                        delete belongInnerItem[belongInnerKey];
                      }
                      // if (belongInnerKey === 'belong_data'){

                      // }
                    }

                  }
                }
              }

            }
          }
        }
        return item;

      });

      this[editableVarThisKeyStr] = !this[editableVarThisKeyStr];

      // UI 적용을 위한 editable = false 1초 후 작동
      setTimeout(async () => {
        if (fileName){
          await mux.Util.downloadPDF(element, fileName);
        }else {
          await mux.Util.print(element);
        }
        this[editableVarThisKeyStr] = !this[editableVarThisKeyStr];

        this[itemsThisKeyStr] = originItems;
      }, 1000);


    },

    async saveLabor() {
      let isValid = true;
      if(this.tab_main === 0){
        // 조회
        // 입력 데이터 기준 데이터 동기화
        this.labor_cost_data = this.labor_cost_data.map(item => {
          if (this.labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL'))){
            item.no = this.labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).no;
            item.man_per_day = this.labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).man_per_day;
            item.surcharge_ratio = this.labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).surcharge_ratio;
          }else {
            isValid = false;
          }

          if (isValid && this.labor_occupation_data.find(x=> x.name == item.occupation)){
            item.adjustment_ratio = this.labor_occupation_data.find(x=> x.name == item.occupation).adjustment_ratio;
            item.unit_price = this.labor_occupation_data.find(x=> x.name == item.occupation).unit_price;
          }else {
            isValid = false;
          }

          if (isValid){
            item.man_per_hour = parseFloat((item.man_per_day * item.surcharge_ratio * item.adjustment_ratio).toFixed(3));
            item.total_amount = (item.man_per_hour * item.unit_price * item.quantity).toFixed(0);
          }

          return item;
        });
        if (!isValid){
          alert('양식이 잘못되었습니다.');
          return;
        }

        // 수량 0행 존재 확인 후, 선택에 따라 모두 삭제
        let isConfirm = false;
        for (let i = this.labor_cost_data.length - 1; i >= 0; i--) {
          if (!this.labor_cost_data[i].quantity || this.labor_cost_data[i].quantity == 0){
            if (i === 0 && this.labor_cost_data.length === 1){
              alert('최소 한 개의 행은 수량이 입력되어야 합니다.');
              return;
            }
            if (!isConfirm){
              if (confirm('수량이 없는 행이 존재합니다.\n수량이 없는 행을 삭제하시겠습니까?')){
                isConfirm = true;
              }else {
                return;
              }
            }
            this.labor_cost_data.splice(i, 1);
          }
        }

        // 중복 데이터(공종, 규격, 직종) 존재 검사
        for (let i = 0; i < this.labor_cost_data.length; i++) {
          const laborDataI = this.labor_cost_data[i];
          for (let j = i+1; j < this.labor_cost_data.length; j++) {
            const laborDataJ = this.labor_cost_data[j];
            if (laborDataI.name === laborDataJ.name
                && laborDataI.type === laborDataJ.type
                && laborDataI.occupation === laborDataJ.occupation){
                  alert(`중복 데이터가 존재합니다.\n${laborDataI.no}\n${laborDataI.name} / ${laborDataI.type} / ${laborDataI.occupation}`);
                  return;
                }
          }
        }

        // 품번 기준 정렬
        this.labor_cost_data.sort((a,b) => a.no.localeCompare(b.no));
        
        // const prevURL = window.location.href;
        // try {
        //   const result = await mux.Server.put({path:'/api/product-cost/labor', data: this.labor_cost_data});
        //   if (prevURL !== window.location.href) return;
        //   if (result.code === 0){
            this.origin_labor_cost_data = this.labor_cost_data;
            this.searched_datas.labor_cost_calc_detail = this.searched_datas.labor_cost_calc_detail.filter(x=>x.cost_calc_code !== this.clickedProductCost.cost_calc_code);
            this.labor_cost_data.forEach(data => {
              this.searched_datas.labor_cost_calc_detail.push(data);
            });
            this.searchDataCalcProcess(this.searched_datas);
        //   }else {
        //     alert(result.message);
        //     return;
        //   }
        // } catch (error) {
        //   if (prevURL !== window.location.href) return;
        //   alert(error);
        //   return;
        // }

      }else {
        // 계산
        // 입력 데이터 기준 데이터 동기화
        this.labor_cost_list = this.labor_cost_list.map(item => {
          if (this.labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL'))){
            item.no = this.labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).no;
            item.man_per_day = this.labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).man_per_day;
            item.surcharge_ratio = this.labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).surcharge_ratio;
          }else {
            isValid = false;
          }

          if (isValid && this.labor_occupation_list.find(x=> x.name == item.occupation)){
            item.adjustment_ratio = this.labor_occupation_list.find(x=> x.name == item.occupation).adjustment_ratio;
            item.unit_price = this.labor_occupation_list.find(x=> x.name == item.occupation).unit_price;
          }else {
            isValid = false;
          }

          if (isValid){
            item.man_per_hour = parseFloat((item.man_per_day * item.surcharge_ratio * item.adjustment_ratio).toFixed(3));
            item.total_amount = (item.man_per_hour * item.unit_price * item.quantity).toFixed(0);
          }

          return item;
        });
        if (!isValid){
          alert('양식이 잘못되었습니다.');
          return;
        }

        // 수량 0행 존재 확인 후, 선택에 따라 모두 삭제
        let isConfirm = false;
        for (let i = this.labor_cost_list.length - 1; i >= 0; i--) {
          if (!this.labor_cost_list[i].quantity || this.labor_cost_list[i].quantity == 0){
            if (i === 0 && this.labor_cost_list.length === 1){
              alert('최소 한 개의 행은 수량이 입력되어야 합니다.');
              return;
            }
            if (!isConfirm){
              if (confirm('수량이 없는 행이 존재합니다.\n수량이 없는 행을 삭제하시겠습니까?')){
                isConfirm = true;
              }else {
                return;
              }
            }
            this.labor_cost_list.splice(i, 1);
          }
        }

        // 중복 데이터(공종, 규격, 직종) 존재 검사
        for (let i = 0; i < this.labor_cost_list.length; i++) {
          const laborDataI = this.labor_cost_list[i];
          for (let j = i+1; j < this.labor_cost_list.length; j++) {
            const laborDataJ = this.labor_cost_list[j];
            if (laborDataI.name === laborDataJ.name
                && laborDataI.type === laborDataJ.type
                && laborDataI.occupation === laborDataJ.occupation){
                  alert(`중복 데이터가 존재합니다.\n${laborDataI.no}\n${laborDataI.name} / ${laborDataI.type} / ${laborDataI.occupation}`);
                  return;
                }
          }
        }

        // 품번 기준 정렬
        this.labor_cost_list.sort((a,b) => a.no.localeCompare(b.no));

        this.origin_labor_cost_list = this.labor_cost_list;
      }

      this.dialog_calculate_labor = false;
    },

    async surveyCostNumEditSave() {
      // 유효성 검사
      const validate = this.$refs.surveyCostForm.validate();
      if(validate) {
        
        // const prevURL = window.location.href;
        // try {
        //   const result = await mux.Server.put({path:'/api/product-cost/survey-cost-num', data: this.calc_cost_detail_data});
        //   if (prevURL !== window.location.href) return;
        //   if (result.code === 0){
            this.origin_calc_cost_detail_data = this.calc_cost_detail_data;
            this.clickedProductCost.employment_insurance_num = this.calc_cost_detail_data_employment_insurance.cost_num;
            this.clickedProductCost.tool_rent_fee_num = this.calc_cost_detail_data_tool_rent_fee.cost_num;
            this.clickedProductCost.transportation_fee_num = this.calc_cost_detail_data_transportation_fee.cost_num;
            this.clickedProductCost.industrial_accident_num = this.calc_cost_detail_data_industrial_accident.cost_num;
            this.clickedProductCost.taxes_dues_num = this.calc_cost_detail_data_taxes_dues.cost_num;
            this.clickedProductCost.welfare_benefits_num = this.calc_cost_detail_data_welfare_benefits.cost_num;
            this.clickedProductCost.retirement_num = this.calc_cost_detail_data_retirement.cost_num;
            this.clickedProductCost.expendables_num = this.calc_cost_detail_data_expendables.cost_num;
            this.clickedProductCost.industrial_safety_num = this.calc_cost_detail_data_industrial_safety.cost_num;
            this.clickedProductCost.normal_maintenance_fee_num = this.calc_cost_detail_data_normal_maintenance_fee.cost_num;
            this.clickedProductCost.profite_num = this.calc_cost_detail_data_profite.cost_num;
            this.searched_datas.product_cost = this.searched_datas.product_cost.map(x=> {
              if (x.cost_calc_code === this.clickedProductCost.cost_calc_code){
                return this.clickedProductCost;
              }else {
                return x;
              }
            });
      
            this.searchDataCalcProcess(this.searched_datas);
            
            this.edit_survey_cost_num_disabled = true;
        //   }else {
        //     alert(result.message);
        //     return;
        //   }
        // } catch (error) {
        //   if (prevURL !== window.location.href) return;
        //   alert(error);
        //   return;
        // }
      }

    },

    async save() {
      if (this.calc_cost_detail_data_product_cost2.belong_data.length === 0){
        alert('제품을 불러와야 합니다.');
        return;
      }
      if (this.calc_cost_detail_data_direct_labor2.belong_data.length === 0 || this.calc_cost_detail_data_direct_labor2.belong_data[0].cost_list === ''){
        alert('직접 노무비를 산출해야 합니다.');
        return;
      }
      const validate = this.$refs.surveyCostForm2.validate();
      if(validate){
        // const prevURL = window.location.href;
        // try {
        //   const result = await mux.Server.post({path:'/api/product-cost/', data: this.calc_cost_detail_data2});
        //   if (prevURL !== window.location.href) return;
        //   if (result.code === 0){
            alert('저장되었습니다.');
        //   }else {
        //     alert(result.message);
        //     return;
        //   }
        // }catch (error) {
        //   if (prevURL !== window.location.href) return;
        //   alert(error);
        //   return;
        // }
      }
    },

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
#print_labor_cost p {font-weight: bold;}
#print_labor_cost table{margin-top: 10px;}
#print_labor_cost table td,
#print_labor_cost table th{white-space: normal;}
#print_labor_cost table td,
#print_labor_cost table th{white-space: normal; padding: 5px 10px; font-size:7px!important}
.print_labor_cost_dnone{display: none;}
</style>
