
<!--
  * 견적서 조회
    1. 원가 페이지 > 계산서 > 재료비는 완제품 하나에 대한 재료(반제품, 원부자재)가 리스트업 되었으나 재료비 > 가. 재료 는 원가와 다르게 완제품이 리스트업 되며 완제품 별 사양이 보여야 함 (spec)

      No. | 항목         | 단위 | 수량 | 단가 | 합계
      1   | 재료비       |
          | 가. 재료     |
          |   완제품 A   | 제품 | 1    | 100 | 100
          |   사양: SPEC123-01111
          |   완제품 B   | 제품 | 1    | 200 | 200
          |   사양: SPEC123-022222
      ...

 -->



<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :salesMenu="true" :estimateMenu="true"></NavComponent>

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
        <!-- 조회 탭 -->
        <v-tab-item>
          <v-row class=" mt-5">
            <v-col cols="12" sm="5">
              <CardComponent
                elevation="1"
                text-class=" pt-3"
                title-class="d-none"
              >
                <div slot="cardText">
                  <InputsFormComponent
                    dense
                    clearable
                    filled
                    hide-details
                    :inputs="searchCardInputs"
                    @enter="searchButton"
                  >
                    <v-col
                      cols="12"
                      sm="4"
                      lg="3"
                      align-self="center"
                    >
                      <v-btn
                        color="primary"
                        elevation="2"
                        @click="searchButton"
                      >
                        <v-icon>mdi-magnify</v-icon>검색
                      </v-btn>
                    </v-col>
                  </InputsFormComponent>
                  <v-row>
                    <v-col
                      cols="12"
                    >
                      <DataTableComponent
                        dense
                        :headers="search_estimate_headers"
                        :items="search_estimate_data"
                        item-key="estimate_code"
                      />
                    </v-col>
                  </v-row>
                </div>
              </CardComponent>
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
                <!-- 견적서 -->
                <v-tab-item>
                  <v-card ref="calcEstimateCard">
                    <div style="text-align: right;">
                      <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                            color="success"
                            fab
                            x-small
                            class="dont_print"
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
                            v-for="(item, index) in save_estimate"
                            :key="index"
                            dense
                            @click="item.click === 'print' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcEstimateCard, 'edit_survey_cost_data')
                                    : item.click === 'pdf' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcEstimateCard, 'edit_survey_cost_data', '원가계산서') : ''"
                          >
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                    <v-card-title>
                      <v-row
                        class="px-3"
                        style="background: #efefef;"
                      >
                        <v-col align-self="center" cols="12" sm="10">
                          <p style="font-weight: bold; font-size: 30px;" class="mb-0">견적서
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
                            style="margin-top:10px"
                          />
                        </v-col>
                      </v-row>
                    </v-card-title>
                    <v-card-text>
                      <v-row class="mt-5" justify="space-between">
                        <v-col align-self="center" cols="12" sm="5" class="pb-0">
                          <v-row style="border-bottom:1px solid #b4b4b4; font-size: 15px;" class="mb-4">
                            <v-col cols="12" sm="10" class="font-weight-bold">업체A</v-col>
                            <v-col cols="12" sm="2">귀하</v-col>
                          </v-row>
                          <table style=" border-spacing: 0px; width: 100%;" class="mt-1">
                            <tr class="text-body-1">
                              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">발행일</td>
                              <td class="estimate_info" style="border-bottom: 0px;">2024-05-29</td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">용역명</td>
                              <td class="estimate_info" style="border-bottom: 0px;"></td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">용역기간</td>
                              <td class="estimate_info" style="border-bottom: 0px;"></td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title text-center" style="border-left:1px solid #b6b6b6">유효기간</td>
                              <td class="estimate_info"> 발행일로부터 30일 이내 </td>
                            </tr>
                          </table>
                          <p style=" font-size: 12px;" class="mt-3 text-center font-weight-bold">하기와 같이 견적 드립니다.</p>
                        </v-col>
                        <v-col align-self="center" cols="12" sm="6" style="position: relative;" class="pb-0">
                          <v-img
                            alt="직인"
                            contain
                            src="../assets/img/pion_stamp.png"
                            transition="scale-transition"
                            width="40"
                            style="position: absolute; right:25px; top:25px"
                          />
                          <table style=" border-spacing: 0px; width: 100%;" class="mt-1">
                            <tr>
                              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">등록번호</td>
                              <td colspan="3" class="estimate_info" style="border-bottom: 0px;">851 - 86 - 00038</td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">상호</td>
                              <td class="estimate_info" style="border-bottom: 0px;">파이온일렉트릭(주)</td>
                              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;">대표자</td>
                              <td class="estimate_info" style="border-bottom: 0px;">윤광희</td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">주소</td>
                              <td colspan="3" class="estimate_info" style="border-bottom: 0px;">서울특별시 서대문구 연세로 50, 116호 (연세대학교 공학원)</td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">업태</td>
                              <td class="estimate_info" style="border-bottom: 0px;">제조업</td>
                              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;">종목</td>
                              <td class="estimate_info" style="border-bottom: 0px;">전력전자기기</td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">대표전화</td>
                              <td class="estimate_info" style="border-bottom: 0px;">070-5096-4179</td>
                              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;">팩스</td>
                              <td class="estimate_info" style="border-bottom: 0px;">0505-300-4179</td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title text-center" style="border-left:1px solid #b6b6b6">담당자</td>
                              <td class="estimate_info" >OOO</td>
                              <td class="estimate_info estimate_title text-center" >연락처</td>
                              <td class="estimate_info">070-1234-5678</td>
                            </tr>
                          </table>
                        </v-col>
                        <v-col cols="12" sm="12" class="pt-0">
                          <table style=" border-spacing: 0px; width: 100%;" class="mb-5">
                            <tr>
                              <td class="estimate_price_info estimate_price_title text-center">일금</td>
                              <td class="estimate_price_info"><span class="font-weight-bold">일천일백만 원정 </span>(￦ 11,000,000) <span style="font-size:11px" class="pl-10">* 부가가치세(VAT) 별도</span></td>
                            </tr>
                          </table>
                        </v-col>
                      </v-row>
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

                <!-- 기본 정보 -->
                <v-tab-item>
                  <v-card>
                    <v-card-title>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-chip
                            class="mr-2 mb-4"
                            style="cursor:pointer"
                            v-for="(member, i) in estimate_member_info"
                            :key="i"
                            :color="member.name ? 'success' : 'default'"
                          >
                            {{ member.type }} : {{ member.name }}
                          </v-chip>
                        </v-col>
                        <v-col v-show="edit_buttons_show" cols="12" sm="6">

                          <!-- <v-btn
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
                          </v-btn> -->

                          <v-btn
                            v-show="!edit_estimate_info"
                            color="error"
                            fab
                            x-small
                            class="float-right dont_print"
                            elevation="0"
                            data-html2canvas-ignore="true"
                            @click="editEstimateInfo(true)"
                          >
                            <v-icon
                              small
                            >mdi-undo-variant</v-icon>
                          </v-btn>
                          <v-btn
                            v-if="edit_estimate_info"
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right dont_print"
                            elevation="0"
                            data-html2canvas-ignore="true"
                            @click="editEstimateInfo(false)"
                          >
                            <v-icon
                              small
                            >mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            v-if="!edit_estimate_info"
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
                      <p class="text-h6 font-weight-bold py-2 px-4" style="background-color: #E3F2FD;" >견적서 정보</p>
                      <InputsFormComponent
                        dense
                        clearable
                        :inputs="estimateSearchDefaultInfoInputs"
                      >
                      </InputsFormComponent>

                      <p class="text-h6 font-weight-bold py-2 px-4 mt-12" style="background-color: #E3F2FD;">업체 정보</p>
                      <InputsFormComponent
                        dense
                        clearable
                        :inputs="estimateSearchCompanyInfoInputs"
                      >
                      </InputsFormComponent>

                      <p class="text-h6 font-weight-bold py-2 px-4 mt-12" style="background-color: #E3F2FD;" >첨부</p>
                      <v-row
                        v-if="edit_estimate_info"
                      >
                        <v-col cols="12" sm="4">
                          <p class="font-weight-bold primary--text mb-0">▼ 승인서</p>
                          <div style="width:100%; background-color: #ccc; min-height:300px"></div>
                          <!-- <v-img
                            alt="thumbnail"
                            class="shrink mr-2"
                            contain
                            :src="mux.Util.imageBinary(receivingInspectionThumbnail)"
                            transition="scale-transition"
                            width="350"
                            @click="download('inbound/receiving_inspection', inbound_info_data.receiving_inspection_file, inbound_info_data.code+'_')"
                            style="cursor: pointer;"
                          /> -->
                        </v-col>
                        <v-col cols="12" sm="4">
                          <p class="font-weight-bold primary--text mb-0">▼ 도면</p>
                            <v-chip
                              color="grey lighten-2"
                              class="ma-2"
                            >
                              도면파일명
                            </v-chip>
                        </v-col>
                        <v-col cols="12" sm="4">
                          <p class="font-weight-bold primary--text mb-0">▼ 기타 첨부</p>
                          <v-chip
                            color="grey lighten-2"
                            class="ma-2"
                          >
                            기타첨부파일.pdf
                          </v-chip>
                          <v-chip
                            color="grey lighten-2"
                            class="ma-2"
                          >
                            기타첨부파일2.xlsx
                          </v-chip>
                        </v-col>
                      </v-row>
                      <v-row
                        v-else
                      >
                        <v-col cols="12">
                          <InputsFormComponent
                            dense
                            clearable
                            :inputs="estimateFilesInputs"
                          >
                          </InputsFormComponent>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <!-- 산출내역서 -->
                <v-tab-item>
                  <v-card ref="calcDetailCard">
                    <v-card-title>
                      <v-row>
                        <v-col cols="12" sm="9">
                          <p class="text-h5 black--text mb-0 font-weight-black"  style="font-weight: bold;">산출내역서</p>
                        </v-col>

                        <v-col v-show="edit_buttons_show" cols="12" sm="3">
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

                          <v-btn
                            v-if="!edit_survey_cost_num_disabled"
                            color="grey"
                            small
                            class="mr-3 float-right dont_print white--text"
                            elevation="0"
                            data-html2canvas-ignore="true"
                            @click="dialog_search_product = true"
                          >
                            재료 수정
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
                          trClass="font-weight-black estimate_title"
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
                          <p class="text-h5 font-weight-black black--text mb-0">노무비 산출</p>
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
                            <td align="center">{{ Math.round(item.surcharge_ratio * 100 * 10000000) / 10000000 }}%</td>
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
        <!-- 작성 탭 -->
        <v-tab-item>
          <v-row class=" mt-5">
            <v-col cols="12" sm="5">
              <v-tabs
                v-model="tab_write"
                background-color="transparent"
                class="tab_search"
              >
                <v-tab
                  v-for="sub_item in write_tab_items"
                  :key="sub_item"
                >
                  {{ sub_item }}
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab_write" class="pb-1">
                <!-- 기본 정보 -->
                <v-tab-item>
                  <v-card>
                    <v-card-title>
                      <MemberSearchDialogComponent
                        :dialog-value="member_dialog"
                        :persistent="true"
                        @close="close"
                        @setMember = "setMember"
                        @members = "members"
                      >
                      </MemberSearchDialogComponent>
                      <v-chip
                        class="mr-2 mb-4"
                        style="cursor:pointer"
                        v-for="(member, i) in estimate_member_info"
                        :key="i"
                        :color="member.name ? 'success' : 'default'"
                        @click="selectMemberDialog(i)"
                      >
                        {{ member.type }} : {{ member.name }}
                      </v-chip>
                    </v-card-title>
                    <v-card-text>
                      <p class="text-h6 font-weight-bold py-2 px-4 mb-8" style="background-color: #E3F2FD;" >견적서 정보</p>
                      <InputsFormComponent
                        dense
                        clearable
                        :inputs="estimateWriteDefaultInfoInputs"
                      >
                      </InputsFormComponent>

                      <p class="text-h6 font-weight-bold py-2 px-4 mt-12" style="background-color: #E3F2FD;">업체 정보</p>
                      <InputsFormComponent
                        dense
                        clearable
                        :inputs="estimateWriteCompanyInfoInputs"
                      >
                      </InputsFormComponent>
                      <p class="text-h6 font-weight-bold py-2 px-4 mt-12" style="background-color: #E3F2FD;" >첨부</p>
                      <InputsFormComponent
                        dense
                        clearable
                        :inputs="estimateFilesInputs"
                      >
                      </InputsFormComponent>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <!-- 산출내역서 -->
                <v-tab-item>
                  <v-card ref="calcDetailCard">
                    <v-card-title>
                      <v-row>
                        <v-col cols="12" sm="10">
                          <p class="text-h5 black--text mb-0 font-weight-black"  style="font-weight: bold;">산출내역서</p>
                        </v-col>
                      </v-row>

                    </v-card-title>
                    <v-card-text>
                      <v-form ref="surveyCostForm">
                        <CostTableComponent
                          :headers="survey_cost_headers"
                          :items="calc_cost_detail_data2"
                          item-key="product_code"
                          trStyle="background-color:#efefef; "
                          trClass="font-weight-black estimate_title"
                          :cost-num-edit-disabled="edit_survey_cost_num_disabled"
                          class="cost_table_border print_cost_table"
                        >
                        </CostTableComponent>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-col>
            <v-col cols="12" sm="7">
              <v-card style="position: fixed; max-width:920px">
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-btn
                      color="primary"
                      small
                      class="float-right"
                      elevation="1"
                      @click="save()"
                    >
                      저장
                    </v-btn>
                    <v-btn
                      color="grey lighten-4"
                      small
                      class="mr-4 float-right"
                      elevation="1"
                      @click="product_cost_dialog = true"
                    >
                      원가 불러오기
                    </v-btn>
                  </v-col>
                </v-row>
                <v-card-title>
                  <v-row
                    class="px-3"
                    style="background: #efefef;"
                  >
                    <v-col align-self="center" cols="12" sm="10">
                      <p style="font-weight: bold; font-size: 30px;" class="mb-0">견적서
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
                        style="margin-top:10px"
                      />
                    </v-col>
                  </v-row>
                </v-card-title>
                <v-card-text>
                  <v-row class="mt-5" justify="space-between">
                    <v-col align-self="center" cols="12" sm="5" class="pb-0">
                      <v-row style="border-bottom:1px solid #b4b4b4; font-size: 15px;" class="mb-4">
                        <v-col cols="12" sm="10" class="font-weight-bold">업체A</v-col>
                        <v-col cols="12" sm="2">귀하</v-col>
                      </v-row>
                      <table style=" border-spacing: 0px; width: 100%;" class="mt-1">
                        <tr class="text-body-1">
                          <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">발행일</td>
                          <td class="estimate_info" style="border-bottom: 0px;">2024-05-29</td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">용역명</td>
                          <td class="estimate_info" style="border-bottom: 0px;"></td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">용역기간</td>
                          <td class="estimate_info" style="border-bottom: 0px;"></td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title text-center" style="border-left:1px solid #b6b6b6">유효기간</td>
                          <td class="estimate_info"> 발행일로부터 30일 이내 </td>
                        </tr>
                      </table>
                      <p style=" font-size: 12px;" class="mt-3 text-center font-weight-bold">하기와 같이 견적 드립니다.</p>
                    </v-col>
                    <v-col align-self="center" cols="12" sm="6" style="position: relative;" class="pb-0">
                      <v-img
                        alt="직인"
                        contain
                        src="../assets/img/pion_stamp.png"
                        transition="scale-transition"
                        width="40"
                        style="position: absolute; right:25px; top:25px"
                      />
                      <table style=" border-spacing: 0px; width: 100%;" class="mt-1">
                        <tr>
                          <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">등록번호</td>
                          <td colspan="3" class="estimate_info" style="border-bottom: 0px;">851 - 86 - 00038</td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">상호</td>
                          <td class="estimate_info" style="border-bottom: 0px;">파이온일렉트릭(주)</td>
                          <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;">대표자</td>
                          <td class="estimate_info" style="border-bottom: 0px;">윤광희</td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">주소</td>
                          <td colspan="3" class="estimate_info" style="border-bottom: 0px;">서울특별시 서대문구 연세로 50, 116호 (연세대학교 공학원)</td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">업태</td>
                          <td class="estimate_info" style="border-bottom: 0px;">제조업</td>
                          <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;">종목</td>
                          <td class="estimate_info" style="border-bottom: 0px;">전력전자기기</td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">대표전화</td>
                          <td class="estimate_info" style="border-bottom: 0px;">070-5096-4179</td>
                          <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;">팩스</td>
                          <td class="estimate_info" style="border-bottom: 0px;">0505-300-4179</td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title text-center" style="border-left:1px solid #b6b6b6">담당자</td>
                          <td class="estimate_info" >OOO</td>
                          <td class="estimate_info estimate_title text-center" >연락처</td>
                          <td class="estimate_info">070-1234-5678</td>
                        </tr>
                      </table>
                    </v-col>
                    <v-col cols="12" sm="12" class="pt-0">
                      <table style=" border-spacing: 0px; width: 100%;" class="mb-5">
                        <tr>
                          <td class="estimate_price_info estimate_price_title text-center">일금</td>
                          <td class="estimate_price_info"><span class="font-weight-bold">일천일백만 원정 </span>(￦ 11,000,000) <span style="font-size:11px" class="pl-10">* 부가가치세(VAT) 별도</span></td>
                        </tr>
                      </table>
                    </v-col>
                  </v-row>
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
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>

    </v-main>

    <div class="text-center" v-if="tab_main === 0">
      <v-btn
        color="success"
        elevation="1"
        small
        style="position: fixed; right: 20px; bottom: 20px;"
        :href="`https://www.kpi.or.kr/www/`"
        target="_blank"
      >
        물가정보 바로가기
      </v-btn>
    </div>


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
            <v-btn
              fab
              color="blue-grey darken-1"
              x-small
              class="float-right white--text"
              elevation="1"
              @click="dialog_search_product=false"
            >
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
            <v-btn
              color="primary"
              fab
              x-small
              elevation="1"
              class="float-right mr-2"
            >
              <v-icon small>mdi-content-save</v-icon>
            </v-btn>
          <!-- 모달 내용 구성 -->
          <v-tabs
            v-model="tab_dialog_search_product"
            background-color="transparent"
          >
            <v-tab
              v-for="item in dialog_search_product_items"
              :key="item"
            >
              {{ item }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab_dialog_search_product" class="pb-1">
            <v-tab-item>
              <v-row class="mt-3">
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
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-btn
                    color="success"
                    elevation="1"
                    small
                    class="ml-2 float-right"
                    :href="`https://www.kpi.or.kr/www/`"
                    target="_blank"
                  >
                    물가정보 바로가기
                  </v-btn>
                  <v-btn
                    small
                    elevation="1"
                    class=" float-right"
                    color="default"
                  >
                    행 추가
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-data-table
                    dense
                    :headers="construction_materials_headers"
                    :items="construction_materials_data"
                    hide-default-footer
                    disable-pagination
                    item-key="construction_materials"
                    class="elevation-1"
                  >
                    <template v-slot:item>
                      <tr>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            filled
                            style="width:200px"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            filled
                            style="width:200px"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">
                          <v-text-field
                            dense
                            hide-details
                            filled
                            style="width:200px"
                          >
                          </v-text-field>
                        </td>
                        <td align="center">
                          0000
                        </td>
                        <td align="center">
                          <v-icon small color="default" style="cursor:pointer" @click="deleteInboundDataRow(index)">mdi-minus-thick</v-icon>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
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
                    <td align="center">{{ tab_main === 0 ? (labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')) ? Math.round(labor_data.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).surcharge_ratio * 100 * 10000000) / 10000000 + '%' : '') : (labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')) ? Math.round(labor_list.find(x=> x.name == item.name && x.type == item.type && (x.occupation == item.occupation || x.occupation === 'ALL')).surcharge_ratio * 100 * 10000000) / 10000000 + '%' : '') }}</td>
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
      <ProductCostSearchDialogComponent
        :dialog-value="product_cost_dialog"
        :persistent="true"
        @close="closeProductCostSearch"
      >
      </ProductCostSearchDialogComponent>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import DataTableComponent from "@/components/DataTableComponent.vue";
import EstimatePageConfig from "@/configure/EstimatePageConfig.json";
import CheckPagePermission from "@/common_js/CheckPagePermission";
import CostTableComponent from "@/components/CostTableComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent";
import MemberSearchDialogComponent from "@/components/MemberSearchDialogComponent";
import ProductCostSearchDialogComponent from "@/components/ProductCostSearchDialogComponent.vue";

import mux from "@/mux";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=EstimatePage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  components: {
                NavComponent,
                MemberSearchDialogComponent,
                InputsFormComponent,
                CardComponent,
                DataTableComponent,
                CostTableComponent,
                ModalDialogComponent,
                ProductCostSearchDialogComponent,
              },

  created () {
    this.initialize()
    this.members()
  },

  methods:{
    // eslint-disable-next-line no-unused-vars
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      // console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    initialize(){
      // this.search_estimate_data = EstimatePageConfig.test_estimate_data
      const prevURL = window.location.href;
      try {
        if (prevURL !== window.location.href) return;
        this.estimate_member_info[0].name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.estimate_member_info[0].email =  this.$cookies.get(this.$configJson.cookies.email.key);
        this.estimate_member_info[0].user_id =  this.$cookies.get(this.$configJson.cookies.id.key);
        this.login_id =  this.$cookies.get(this.$configJson.cookies.id.key);
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }
    },
    async searchButton(){
      this.loading_dialog = true;
      this.search_estimate_data = EstimatePageConfig.test_estimate_data
      this.loading_dialog = false;
    },
    test(){
      // console.log('test');
      // mux.Server.uploadFile({path: '/', folder:'somefolder', file: this.files[0]});
      mux.Server.uploadFile({path: '/', folder:'somefolder', files: this.files});
    },
    closeProductCostSearch(){
      this.product_cost_dialog = false;
    },
    selectMemberDialog(idx){
      this.member_type_index = idx
      this.member_dialog = true;
    },
    setMember(item){
      this.estimate_member_info[this.member_type_index].name = item.name.trim()
      this.estimate_member_info[this.member_type_index].user_id = item.user_id
      this.close();
    },
    members(data){
      this.members_list=data;
    },
    close(){
      this.member_dialog = false;
    },
    editEstimateInfo(type){
      this.edit_estimate_info = type;
      this.estimateSearchCompanyInfoInputs.forEach(input => {
        input.disabled = type;
      });
      this.estimateSearchDefaultInfoInputs.forEach(input => {
        input.disabled = type;
      });

    },
    async searchProduct(){
      this.loading_dialog = true;
      const product_code = this.search_complete_product_code ? this.search_complete_product_code.trim() : "";
      const product_name = this.search_complete_product_name ? this.search_complete_product_name.trim() : "";
      const product_capacity = this.search_product_capacity ? this.search_product_capacity.trim() : "";
      // console.log(`${product_code} / ${product_name} / ${product_capacity}`);

      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          "params": [
              {
                "product_table.product_code": product_code,
                "product_table.name": product_name,
                "product_table.spec": product_capacity
              }
          ],
          "script_file_name": "rooting_완제품_검색_24_05_16_13_52_1IN.json",
          "script_file_path": "data_storage_pion\\json_sql\\stock\\10_완제품_검색\\완제품_검색_24_05_16_13_53_MZJ"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0){
          this.dialog_search_product_data = result['data'];
          this.dialog_search_product_data.forEach(data =>{
            data.product_code = data.code;
            delete data.code;
            data.complete_product_name = data.name;
            delete data.name;
            data.product_model = data.model;
            delete data.model;
            data.product_spec = data.spec;
            delete data.spec;
            data.unit_price = data.unit_price.toLocaleString();

            if(data.belong_data){
              let total_unit_price = 0;
              for(let b=0; b<data.belong_data.length; b++){
                data.belong_data[b].cost_list = data.belong_data[b].name;
                data.belong_data[b].cost_unit = 'SET';
                data.belong_data[b].cost_num = data.belong_data[b].num;
                data.belong_data[b].cost_unit_price = data.belong_data[b].unit_price;
                total_unit_price += data.belong_data[b].unit_price * data.belong_data[b].num;

                if(data.belong_data[b].belong_data){
                  delete data.belong_data[b].belong_data;
                }
              }
              data.unit_price = '₩ ' + Number(total_unit_price).toLocaleString();
            }
          })
        }else{
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        // console.error(error);
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
      this.loading_dialog = false;
    },
  },
  data(){
    return{
      product_cost_dialog: false,
      edit_estimate_info: true,
      edit_survey_cost_num_disabled: true,
      edit_buttons_show: true,

      tab_main: null,
      tab_search: null,
      tab_write: null,
      tab_dialog_search_product: null,
      tab_main_items: EstimatePageConfig.tab_main_items,
      dialog_search_product_items: EstimatePageConfig.dialog_search_product_items,
      dialog_search_product: false,
      dialog_calculate_labor: false,
      dialog_search_product_data: [],

      member_dialog: false,
      member_type_index:0,
      members_list:[],

      labor_list:[],
      labor_occupation_list:[],


      search_complete_product_code: '',
      search_complete_product_name: '',
      search_product_capacity: '',

      estimate_member_info:EstimatePageConfig.estimate_member_info,
      save_estimate: EstimatePageConfig.save_estimate,
      content_save_items: EstimatePageConfig.content_save_items,
      search_estimate_headers: EstimatePageConfig.search_estimate_headers,
      survey_cost_headers: EstimatePageConfig.survey_cost_headers,
      labor_cost_headers: EstimatePageConfig.labor_cost_headers,
      labor_list_headers: EstimatePageConfig.labor_list_headers,
      dialog_search_product_headers: EstimatePageConfig.dialog_search_product_headers,
      construction_materials_headers: EstimatePageConfig.construction_materials_headers,




      construction_materials_data: JSON.parse(JSON.stringify(EstimatePageConfig.construction_materials_data)),
      calc_cost_detail_data: JSON.parse(JSON.stringify(EstimatePageConfig.calc_cost_detail_data)),
      calc_cost_detail_data2: EstimatePageConfig.calc_cost_detail_data.map(x => {
        if (x.cost_list === '재료비') {
          x.costListBtn = {
            text: '작성',
            click: ()=>{this.dialog_search_product = true}
          }
        }else if (x.cost_list === '노무비') {
          x.belong_data[0].costListBtn = {
            text: '산출',
            click: ()=>{this.dialog_calculate_labor = true}
          }
        }
        return x;
      }),

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

      search_tab_items: EstimatePageConfig.search_tab_items,
      write_tab_items: EstimatePageConfig.write_tab_items,
      searchCardInputs: EstimatePageConfig.searchCardInputs,
      estimateSearchDefaultInfoInputs: EstimatePageConfig.estimateSearchDefaultInfoInputs,
      estimateSearchCompanyInfoInputs: EstimatePageConfig.estimateSearchCompanyInfoInputs,
      estimateWriteDefaultInfoInputs: EstimatePageConfig.estimateWriteDefaultInfoInputs,
      estimateWriteCompanyInfoInputs: EstimatePageConfig.estimateWriteCompanyInfoInputs,
      estimateFilesInputs: EstimatePageConfig.estimateFilesInputs,
      search_estimate_data: [],
    }
  },
}
</script>
<style>
.estimate_info{border:1px solid #b6b6b6; padding: 2px 15px; font-size: 11px; border-left: 0px;}
.estimate_title{background-color: #efefef; font-weight: bold;}
.estimate_price_info{border-top:3px solid #b6b6b6; border-bottom:3px solid #b6b6b6; padding: 5px 15px; font-size: 16px; border-left: 0px;}
.estimate_price_title{background-color: #efefef; font-weight: bold;}

</style>
