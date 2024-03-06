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
                    <v-data-table
                      dense
                      :headers="search_cost_headers"
                      :items="search_cost_data"
                      item-key="product_code"
                      class="elevation-1"
                    ></v-data-table>
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
                      <v-data-table
                        dense
                        :headers="survey_cost_headers"
                        :items="survey_cost_data"
                        :hide-default-footer="true"
                        item-key="product_code"
                        class="elevation-1 survey_cost_list"
                        disable-sort
                      >

                        <template v-slot:item="{ item }">
                          <tr >
                            <td align="center">1</td>
                            <td colspan="4">재료비</td>
                            <td>0,000,000</td>
                          </tr>
                          <tr style="background-color:#efefef">
                            <td></td>
                            <td>{{ item.cost_list }}</td>
                            <td>{{ item.cost_list }}</td>
                            <td>{{ item.cost_list }}</td>
                            <td>{{ item.cost_list }}</td>
                            <td>{{ item.cost_list }}</td>
                          </tr>
                          <tr style="background-color:#efefef">
                            <td></td>
                            <td>{{ item.cost_list }}</td>
                            <td>{{ item.cost_list }}</td>
                            <td>{{ item.cost_list }}</td>
                            <td>{{ item.cost_list }}</td>
                            <td>{{ item.cost_list }}</td>
                          </tr>
                          <tr >
                            <td align="center">2</td>
                            <td>노무비</td>
                            <td>식</td>
                            <td>1</td>
                            <td>220,290,071</td>
                            <td>220,290,071</td>
                          </tr>
                          <tr >
                            <td align="center">3</td>
                            <td>경비</td>
                            <td>식</td>
                            <td>1</td>
                            <td>34,885,831</td>
                            <td>34,885,831</td>
                          </tr>

                          <tr >
                            <td align="center">4</td>
                            <td>일반관리비</td>
                            <td>식</td>
                            <td>1</td>
                            <td>15,310,554</td>
                            <td>15,310,554</td>
                          </tr>
                          <tr >
                            <td align="center">5</td>
                            <td>이윤</td>
                            <td>식</td>
                            <td>1</td>
                            <td>40,572,968</td>
                            <td>40,572,968</td>
                          </tr>
                          <tr class="font-weight-black amber lighten-5">
                            <td colspan="5" style="font-size: 15px;">합계 (TOTAL)</td>
                            <td style="font-size: 15px;">311,059,424</td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <!-- 산출내역서 -->
                <v-tab-item>
                  <v-card>
                    <v-card-title>
                      <v-row>
                        <v-col cols="12" sm="11">
                          <p class="text-h5 font-weight-black black--text mb-0">ESS GFM용 PCS (380VAC 500kW) 산출내역서</p>
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
                            >mdi-pencil</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>

                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        dense
                        :headers="survey_cost_headers"
                        :items="calculation_data"
                        :hide-default-footer="true"
                        item-key="product_code"
                        class="elevation-1 survey_cost_list"
                        disable-sort
                      >

                        <template v-slot:item="{ item }">
                          <tr class="font-weight-black info_title">
                            <td>1</td>
                            <td colspan="4">재료비</td>
                            <td>0,000,000</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td>{{ item.cost_list }}</td>
                            <td>{{ item.cost_list }}</td>
                            <td>{{ item.cost_list }}</td>
                            <td>{{ item.cost_list }}</td>
                            <td>{{ item.cost_list }}</td>
                          </tr>
                          <tr class="font-weight-black info_title">
                            <td>2</td>
                            <td colspan="4">노무비</td>
                            <td>220,290,071</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td colspan="4">가. 직접 노무비</td>
                            <td>196,336,962</td>
                          </tr>
                          <tr v-for="(labor, idx) in item.direct_labor_calculation" :key="idx">
                            <td></td>
                            <td style="padding-left:40px;">{{ labor.labor_name }}</td>
                            <td>식</td>
                            <td>{{ labor.labor_num }}</td>
                            <td>{{ labor.labor_unit_price }}</td>
                            <td>{{ labor.labor_unit_price }}</td>
                          </tr>

                          <tr>
                            <td></td>
                            <td>나. 간접 노무비</td>
                            <td>식</td>
                            <td>1</td>
                            <td></td>
                            <td>{{ item.indirect_labor_amount }}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td style="padding-left:40px;" colspan="5">- (직접노무비) X {{ item.indirect_labor_rate }}%</td>
                          </tr>
                          <tr class="font-weight-black info_title">
                            <td>3.</td>
                            <td colspan="4">경비</td>
                            <td>34,885,831</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td>가. 고용보험료</td>
                            <td>식</td>
                            <td>1</td>
                            <td></td>
                            <td>{{ item.employment_insurance_amount }}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td style="padding-left:40px;" colspan="5">- (노무비) X {{ item.employment_insurance_rate }}%</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td>나. 공구손료</td>
                            <td>식</td>
                            <td>1</td>
                            <td></td>
                            <td>{{ item.tool_rent_fee_amount }}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td style="padding-left:40px;" colspan="5">- (직접노무비) X {{ item.tool_rent_fee_rate }}%</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td>다. 여비교통 통신비</td>
                            <td>식</td>
                            <td>1</td>
                            <td></td>
                            <td>{{ item.transportation_fee_amount }}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td style="padding-left:40px;" colspan="5">- (노무비) X {{ item.transportation_fee_rate }}%</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td>라. 산재보험료</td>
                            <td>식</td>
                            <td>1</td>
                            <td></td>
                            <td>{{ item.industrial_accident_amount }}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td style="padding-left:40px;" colspan="5">- (노무비) X {{ item.industrial_accident_rate }}%</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td>마. 세금과공과</td>
                            <td>식</td>
                            <td>1</td>
                            <td></td>
                            <td>{{ item.taxes_dues_amount }}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td style="padding-left:40px;" colspan="5">- (노무비) X {{ item.taxes_dues_rate }}%</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td>바. 복리후생비</td>
                            <td>식</td>
                            <td>1</td>
                            <td></td>
                            <td>{{ item.welfare_benefits_amount }}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td style="padding-left:40px;" colspan="5">- (노무비) X {{ item.welfare_benefits_rate }}%</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td>사. 퇴직공제 부금비</td>
                            <td>식</td>
                            <td>1</td>
                            <td></td>
                            <td>{{ item.retirement_amount }}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td style="padding-left:40px;" colspan="5">- (직접노무비) X {{ item.retirement_rate }}%</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td>아. 소모품비</td>
                            <td>식</td>
                            <td>1</td>
                            <td></td>
                            <td>{{ item.expendables_amount }}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td style="padding-left:40px;" colspan="5">- (노무비) X {{ item.expendables_rate }}%</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td>자. 산업안전보건관리비</td>
                            <td>식</td>
                            <td>1</td>
                            <td></td>
                            <td>{{ item.industrial_safety_amount }}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td style="padding-left:40px;" colspan="5">- ((직접 노무비) X {{ item.industrial_safety_rate1 }}% X {{ item.industrial_safety_rate2 }})</td>
                          </tr>
                          <tr class="font-weight-black info_title">
                            <td></td>
                            <td>일반관리비</td>
                            <td>식</td>
                            <td>1</td>
                            <td></td>
                            <td>{{ item.normal_maintenance_fee_amount }}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td style="padding-left:40px;" colspan="5">- (재료비+노무비+경비) X {{ item.normal_maintenance_fee_rate }}%</td>
                          </tr>
                          <tr class="font-weight-black info_title">
                            <td></td>
                            <td>이윤</td>
                            <td>식</td>
                            <td>1</td>
                            <td></td>
                            <td>{{ item.profite_amount }}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td style="padding-left:40px;" colspan="5">- (노무비+경비+일반관리비) X {{ item.profite_rate }} %</td>
                          </tr>
                          <tr class="font-weight-black amber lighten-5">
                            <td colspan="5" style="font-size: 15px;">합계 (TOTAL)</td>
                            <td style="font-size: 15px;">311,059,424</td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <!-- 노무비 산출 -->
                <v-tab-item>
                  <v-card>
                    <v-card-title>
                      <v-row>
                        <v-col cols="12" sm="11">
                          <p class="text-h5 font-weight-black black--text mb-0">ESS GFM용 PCS (380VAC 500kW) 노무비 산출</p>
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
                        class="elevation-1"
                        disable-sort
                      >
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
            <v-col cols="12" sm="6">
              <v-card>
                <v-card-title>
                  <v-row>
                    <v-col cols="12" sm="11">
                          <p class="text-h5 font-weight-black black--text mb-0">산출내역서</p>
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
                  <v-data-table
                    dense
                    :headers="survey_cost_headers"
                    :items="calculation_data"
                    :hide-default-footer="true"
                    item-key="product_code"
                    class="elevation-1 survey_cost_list"
                    disable-sort
                  >

                    <template v-slot:item="{ item }">
                      <tr class="font-weight-black info_title">
                        <td>1</td>
                        <td colspan="4">재료비
                          <v-btn
                            color="primary"
                            x-small
                            class="ml-3"
                            elevation="0"
                            @click="dialog_search_product = true"
                          >제품 불러오기
                          </v-btn>
                        </td>
                        <td>000</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr class="font-weight-black info_title">
                        <td>2</td>
                        <td colspan="4">노무비
                          <v-btn
                            color="primary"
                            x-small
                            class="ml-3"
                            elevation="0"
                            @click="dialog_calculate_labor = true"
                          >산출
                          </v-btn>
                        </td>
                        <td>000</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td colspan="4">가. 직접 노무비</td>
                        <td>000</td>
                      </tr>
                      <tr v-for="(labor, idx) in item.direct_labor_calculation" :key="idx">
                        <td></td>
                        <td style="padding-left:40px;">{{ labor.labor_name }}</td>
                        <td>식</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>나. 간접 노무비</td>
                        <td>식</td>
                        <td></td>
                        <td></td>
                        <td>000</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style="padding-left:40px;" colspan="5">- (직접노무비) X {{ item.indirect_labor_rate }}%</td>
                      </tr>
                      <tr class="font-weight-black info_title">
                        <td>3.</td>
                        <td colspan="4">경비</td>
                        <td>000</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>가. 고용보험료</td>
                        <td>식</td>
                        <td>
                          <v-text-field
                            dense
                            style="max-width: 100px;"
                            :rules="expensesNumRules"
                            type="number"
                          ></v-text-field>
                        </td>
                        <td>000</td>
                        <td>000</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style="padding-left:40px;" colspan="5">- (노무비) X {{ item.employment_insurance_rate }}%</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>나. 공구손료</td>
                        <td>식</td>
                        <td>
                          <v-text-field
                            dense
                            style="max-width: 100px;"
                            :rules="expensesNumRules"
                            type="number"
                          ></v-text-field>
                        </td>
                        <td>000</td>
                        <td>000</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style="padding-left:40px;" colspan="5">- (직접노무비) X {{ item.tool_rent_fee_rate }}%</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>다. 여비교통 통신비</td>
                        <td>식</td>
                        <td>
                          <v-text-field
                            dense
                            style="max-width: 100px;"
                            :rules="expensesNumRules"
                            type="number"
                          ></v-text-field>
                        </td>
                        <td>000</td>
                        <td>000</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style="padding-left:40px;" colspan="5">- (노무비) X {{ item.transportation_fee_rate }}%</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>라. 산재보험료</td>
                        <td>식</td>
                        <td>
                          <v-text-field
                            dense
                            style="max-width: 100px;"
                            :rules="expensesNumRules"
                            type="number"
                          ></v-text-field>
                        </td>
                        <td>000</td>
                        <td>000</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style="padding-left:40px;" colspan="5">- (노무비) X {{ item.industrial_accident_rate }}%</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>마. 세금과공과</td>
                        <td>식</td>
                        <td>
                          <v-text-field
                            dense
                            style="max-width: 100px;"
                            :rules="expensesNumRules"
                            type="number"
                          ></v-text-field>
                        </td>
                        <td>000</td>
                        <td>000</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style="padding-left:40px;" colspan="5">- (노무비) X {{ item.taxes_dues_rate }}%</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>바. 복리후생비</td>
                        <td>식</td>
                        <td>
                          <v-text-field
                            dense
                            style="max-width: 100px;"
                            :rules="expensesNumRules"
                            type="number"
                          ></v-text-field>
                        </td>
                        <td>000</td>
                        <td>000</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style="padding-left:40px;" colspan="5">- (노무비) X {{ item.welfare_benefits_rate }}%</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>사. 퇴직공제 부금비</td>
                        <td>식</td>
                        <td>
                          <v-text-field
                            dense
                            style="max-width: 100px;"
                            :rules="expensesNumRules"
                            type="number"
                          ></v-text-field>
                        </td>
                        <td>000</td>
                        <td>000</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style="padding-left:40px;" colspan="5">- (직접노무비) X {{ item.retirement_rate }}%</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>아. 소모품비</td>
                        <td>식</td>
                        <td>
                          <v-text-field
                            dense
                            style="max-width: 100px;"
                            :rules="expensesNumRules"
                            type="number"
                          ></v-text-field>
                        </td>
                        <td>000</td>
                        <td>000</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style="padding-left:40px;" colspan="5">- (노무비) X {{ item.expendables_rate }}%</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>자. 산업안전보건관리비</td>
                        <td>식</td>
                        <td>
                          <v-text-field
                            dense
                            style="max-width: 100px;"
                            :rules="expensesNumRules"
                            type="number"
                          ></v-text-field>
                        </td>
                        <td>000</td>
                        <td>000</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style="padding-left:40px;" colspan="5">- ((직접 노무비) X {{ item.industrial_safety_rate1 }}% X {{ item.industrial_safety_rate2 }})</td>
                      </tr>
                      <tr class="font-weight-black info_title">
                        <td></td>
                        <td>일반관리비</td>
                        <td>식</td>
                        <td>
                          <v-text-field
                            dense
                            style="max-width: 100px;"
                            :rules="profiteMaintenanceFeeNumRules"
                            type="number"
                          ></v-text-field>
                        </td>
                        <td>000</td>
                        <td>000</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style="padding-left:40px;" colspan="5">- (재료비+노무비+경비) X {{ item.normal_maintenance_fee_rate }}%</td>
                      </tr>
                      <tr class="font-weight-black info_title">
                        <td></td>
                        <td>이윤</td>
                        <td>식</td>
                        <td>
                          <v-text-field
                            dense
                            style="max-width: 100px;"
                            :rules="profiteMaintenanceFeeNumRules"
                            type="number"
                          ></v-text-field>
                        </td>
                        <td>000</td>
                        <td>000</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style="padding-left:40px;" colspan="5">- (노무비+경비+일반관리비) X {{ item.profite_rate }} %</td>
                      </tr>
                      <tr class="font-weight-black amber lighten-5">
                        <td colspan="5" style="font-size: 15px;">합계 (TOTAL)</td>
                        <td style="font-size: 15px;">000</td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6">
              <v-card style="position: fixed; min-width:800px">
                <v-card-title>
                  <v-row>
                    <v-col align-self="center" cols="12" sm="10">
                      <p class="text-h5 font-weight-black black--text mb-3">ESS GFM용 PCS (380VAC 500kW)<br>
                        <table style="  border-spacing: 0px;" class="mt-1">
                          <tr class="text-body-1">
                            <td class="cost_search_info info_title" style="border-left:1px solid #b6b6b6">작성자</td>
                            <td class="cost_search_info"></td>
                            <td class="cost_search_info info_title">작성일</td>
                            <td class="cost_search_info"></td>
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
                  <v-data-table
                    dense
                    :headers="survey_cost_headers"
                    :items="survey_cost_data"
                    :hide-default-footer="true"
                    item-key="product_code"
                    class="elevation-1 survey_cost_list"
                    disable-sort
                  >

                    <template v-slot:item="{ item }">
                      <tr >
                        <td align="center">1</td>
                        <td colspan="4">재료비</td>
                        <td></td>
                      </tr>
                      <tr style="background-color:#efefef">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{{ item.test }}</td>
                      </tr>
                      <tr >
                        <td align="center">2</td>
                        <td>노무비</td>
                        <td>식</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr >
                        <td align="center">3</td>
                        <td>경비</td>
                        <td>식</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>

                      <tr >
                        <td align="center">4</td>
                        <td>일반관리비</td>
                        <td>식</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr >
                        <td align="center">5</td>
                        <td>이윤</td>
                        <td>식</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr class="font-weight-black amber lighten-5">
                        <td colspan="5" style="font-size: 15px;">합계 (TOTAL)</td>
                        <td style="font-size: 15px;">311,059,424</td>
                      </tr>
                    </template>
                  </v-data-table>
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
            ><span class="font-weight-black primary--text text-h6 mr-4">제품 불러오기</span>

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
                @click="dialog_search_product =false"
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
                :headers="dialog_search_product_headers"
                :items="dialog_search_product_data"
                item-key="product_code"
                class="elevation-1"
              >
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  color="primary"
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
        max-width="80%"
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
            <v-col cols="12">
              <v-data-table
                dense
                :headers="labor_cost_headers"
                :items="labor_cost_data"
                hide-default-footer
                disable-pagination
                class="elevation-1 labor_cost_list"
                disable-sort
              >
                <template v-slot:item="{ item }">
                  <tr>
                    <td align="center">{{ item.no }}</td>
                    <td align="center">{{ item.contract_name }}</td>
                    <td align="center">{{ item.contract_type }}</td>
                    <td align="center">{{ item.occupation }}</td>
                    <td align="center">{{ item.man_day }}</td>
                    <td align="center">{{ item.surcharge_rate }}</td>
                    <td align="center">{{ item.design_adjustment_rate }}</td>
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

export default {
  components: {
                NavComponent,
                ModalDialogComponent,
              },
  data(){
    return{
        tab_main: null,
        tab_search: null,
        tab_calculate: null,
        dialog_search_product: false,
        dialog_calculate_labor: false,
        product_name:'',
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
          { text: 'No.', align: 'center', value: 'cost_list', },
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
          { text: '설계조정률', align: 'center', value: 'design_adjustment_rate', },
          { text: '공량(M/H)', align: 'center', value: 'man_hour', },
          { text: '단가(M/D)', align: 'center', value: 'man_day_unit_price', },
          { text: '수량', align: 'center', value: 'quantity', },
          { text: '금액', align: 'center', value: 'total_amount', },
          { text: '공정별 금액', align: 'center', value: 'no_total_amount', },
        ],
        dialog_search_product_headers:[
          { text: '', align: 'center', value:'actions'},
          { text: '제품명', align: 'center', value: 'finished_product_name', },
          { text: '부제품', align: 'center', value: 'product_type', },
          { text: '관리코드', align: 'center', value: 'product_code', },
          { text: '자재명', align: 'center', value: 'product_name', },
          { text: '모델명', align: 'center', value: 'product_model', },
          { text: '사양', align: 'center', value: 'product_spec', },
          { text: '제조사', align: 'center', value: 'manufacturer', },
          { text: '필요수량', align: 'center', value: 'product_num', },
          { text: '단가', align: 'center', value: 'unit_price', },
          { text: '총액', align: 'center', value: 'product_price', },
        ],
        dialog_search_product_data:[
          {finished_product_name:'제품A',product_type:'a',product_code:'a',product_name:'a',product_model:'a',product_spec:'a',manufacturer:'a',product_num:'a',unit_price:'a',product_price:'a'},
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
            cost_list: '제품A',
            cost_unit: '2024-02-29',
            cost_num: '김OO',
            cost_unit_price: '1000,000',
            cost_total: 'ttttt'
          },
        ],

        calculation_data: [
          {
            direct_labor_calculation:[
              {labor_name:'고압케이블 포설',labor_num:'1',labor_unit_price:'103,530,425',},
              {labor_name:'저압케이블 포설',labor_num:'1',labor_unit_price:'20,639,191',},
              {labor_name:'전력케이블 단말처리', labor_num:'1', labor_unit_price:'5,953,998',},
              {labor_name:'Cubicle 설치', labor_num:'1', labor_unit_price:'5,953,998',},
              {labor_name:'전기실 전원 케이블 포설', labor_num:'1', labor_unit_price:'5,992,473',},
              {labor_name:'케이블 트레이', labor_num:'1', labor_unit_price:'9,096,841',},
              {labor_name:'통신케이블 포설', labor_num:'1', labor_unit_price:'639,015',},
            ],
            indirect_labor_rate:'12.2',
            indirect_labor_amount:'23,953,109',

            employment_insurance_rate:'1.01',
            employment_insurance_amount:'2,224,929',

            tool_rent_fee_rate:'3',
            tool_rent_fee_amount:'5,890,108',

            transportation_fee_rate:'0.418',
            transportation_fee_amount:'920,812',

            industrial_accident_rate:'3.7',
            industrial_accident_amount:'8,150,732',

            taxes_dues_rate:'0.13',
            taxes_dues_amount:'286,377',

            welfare_benefits_rate:'2.397',
            welfare_benefits_amount:'5,280,353',

            retirement_rate:'2.3',
            retirement_amount:'4,515,750',

            expendables_rate:'1.479',
            expendables_amount:'3,258,090',

            industrial_safety_rate1:'1.85',
            industrial_safety_rate2:'1.2',
            industrial_safety_amount:'4,358,680',

            normal_maintenance_fee_rate:'6',
            normal_maintenance_fee_amount:'15,310,554',

            profit_rate:'15',
            profite_amount:'40,572,968',
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
            design_adjustment_rate:'1.0000',
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
            design_adjustment_rate:'1.0000',
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
            design_adjustment_rate:'1.0000',
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
            design_adjustment_rate:'1.0000',
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
            design_adjustment_rate:'1.0000',
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
            design_adjustment_rate:'1.0000',
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
            design_adjustment_rate:'1.0000',
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
            design_adjustment_rate:'1.0000',
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
            design_adjustment_rate:'1.0000',
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
            design_adjustment_rate:'1.0000',
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
            design_adjustment_rate:'1.0000',
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
            design_adjustment_rate:'1.0000',
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
            design_adjustment_rate:'1.0000',
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
            design_adjustment_rate:'1.0000',
            man_hour:'1.410',
            man_day_unit_price:'161,858',
            quantity:'2.8',
            total_amount:'639,015',
            no_total_amount:'639,015',
          },
        ],
        profiteMaintenanceFeeNumRules: [
          v => !!v || '0~1 소수점 네자리',
          v => v<=1  || '최소0 최대1',
          v => !!(v && /^(?=.{1,6}$)/.test(v) ) || '최대 소수점 네자리',
        ],
        expensesNumRules: [
          v => !!v || '최소0 최대1',
          v => v<=1  || '최소0 최대1',
          v => !!(v && /^(?=.{1,1}$)/.test(v) ) || '최소0 최대1',
        ],
    }
  },

  methods: {
    addCostList(){
      this.dialog_search_product = false;
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
.survey_cost_list th,
.labor_cost_list th{border-right: 1px solid #b6b6b6;}
.survey_cost_list thead th:first-child{width: 35px;}
.survey_cost_list thead th:last-child,
.survey_cost_list tbody td:last-child,
.labor_cost_list thead th:last-child,
.labor_cost_list tbody td:last-child{border-right: 0px;}
.survey_cost_list td,
.labor_cost_list td{border-right: 1px solid #b6b6b6; }
.labor_cost_list{text-align: center;}
.labor_cost_list table{min-width: 90rem!important;}
</style>
