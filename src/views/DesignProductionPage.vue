<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :designProductionMenu="true"></NavComponent>

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
                        :items="search_production_data"
                        item-key="estimate_code"
                        deletable
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
                <!-- 원가 계산서 -->
                <v-tab-item>
                  <v-card ref="calcCostCard">
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
                            v-for="(item, index) in save_costs"
                            :key="index"
                            dense
                            @click="item.click === 'print' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data')
                                    : item.click === 'pdf' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data', '원가계산서') : ''"
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
                          <p style="font-weight: bold; font-size: 30px;" class="mb-0">수주 확인서
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
                              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">프로젝트명</td>
                              <td class="estimate_info" style="border-bottom: 0px;"></td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">프로젝트기간</td>
                              <td class="estimate_info" style="border-bottom: 0px;"></td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title text-center" style="border-left:1px solid #b6b6b6">유효기간</td>
                              <td class="estimate_info"></td>
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

                <!-- 설계 정보 -->
                <v-tab-item>
                  <v-card>
                    <v-card-title>
                      <v-row>
                        <v-col v-show="edit_buttons_show" cols="12" sm="12">
                          <v-btn
                            v-if="!edit_production_files"
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right dont_print"
                            elevation="0"
                            data-html2canvas-ignore="true"
                            @click="edit_production_files = true"
                          >
                            <v-icon
                              small
                            >mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            v-if="edit_production_files"
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right"
                            elevation="0"
                            @click="edit_production_files = false"
                          >
                            <v-icon
                              small
                            >mdi-check</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-title>
                    <v-card-text v-if="!edit_production_files">
                      <p class="text-h6 font-weight-bold py-2 px-4" style="background-color: #E3F2FD;" >설계 정보</p>
                      <InputsFormComponent
                        dense
                        clearable
                        :inputs="estimateDefaultInfoInputs"
                      >
                      </InputsFormComponent>

                      <p class="text-h6 font-weight-bold py-2 px-4 mt-12" style="background-color: #E3F2FD;">업체 정보</p>
                      <InputsFormComponent
                        dense
                        clearable
                        :inputs="estimateCompanyInfoInputs"
                      >
                      </InputsFormComponent>

                      <p class="text-h6 font-weight-bold py-2 px-4 mt-12" style="background-color: #E3F2FD;" >상세 도면</p>
                      <v-row>
                        <v-col cols="12" sm="4">
                          <p class="font-weight-bold primary--text mb-0">▼ 배치도</p>
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
                          <p class="font-weight-bold primary--text mb-0">▼ 구조도</p>
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
                          <p class="font-weight-bold primary--text mb-0">▼ 단선도</p>
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
                          <p class="font-weight-bold primary--text mb-0">▼ 삼선도</p>
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
                          <p class="font-weight-bold primary--text mb-0">▼ 회로도</p>
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
                      </v-row>

                      <p class="text-h6 font-weight-bold py-2 px-4 mt-12" style="background-color: #E3F2FD;" >첨부</p>
                      <v-row>
                        <v-col cols="12" sm="4">
                          <p class="font-weight-bold primary--text mb-0">▼ 승인도서</p>
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
                          <p class="font-weight-bold primary--text mb-0">▼ 제작사양서</p>
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
                          <p class="font-weight-bold primary--text mb-0">▼ 기타</p>
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
                    </v-card-text>

                    <v-card-text v-else>
                      <v-row>
                        <v-col cols="12">
                          <p class="text-h6 font-weight-bold py-2 px-4" style="background-color: #E3F2FD;" >첨부 수정</p>
                          <InputsFormComponent
                            dense
                            clearable
                            :inputs="blueprintDetailInputs"
                          >
                          </InputsFormComponent>
                        </v-col>
                      </v-row>
                      <v-divider class="my-4"></v-divider>
                      <InputsFormComponent
                        dense
                        clearable
                        :inputs="estimateFilesInputs"
                      >

                      </InputsFormComponent>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <!-- BOM LIST -->
                <v-tab-item>
                  <v-card>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" sm="12">
                          <v-btn
                            v-if="!editable_bom_list"
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right"
                            elevation="0"
                            data-html2canvas-ignore="true"
                            @click="editable_bom_list ? editable_bom_list = false : editable_bom_list = true"
                          >
                            <v-icon
                              small
                            >mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            v-if="editable_bom_list"
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right"
                            elevation="0"
                          >
                            <v-icon
                              small
                            >mdi-check</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="12" sm="12" v-if="!editable_bom_list">
                          <v-data-table
                            v-model="selected_items_for_product_data"
                            :headers="product_item_setting_headers"
                            :items="search_items_for_product_data"
                            item-key="_code"
                            dense
                          ></v-data-table>
                        </v-col>
                        <v-col cols="12" sm="12" v-else>
                          <v-data-table
                            dense
                            :headers="dialog_product_details_headers"
                            :items="dialog_search_product_data"
                            item-key="product_code"
                            class="elevation-1"
                          >
                            <template v-slot:[`item.actions`]>

                              <v-icon
                                @click="dialog_bom_detail = true"
                              >mdi-magnify</v-icon>
                            </template>
                            <template v-slot:[`item.cancle`]>

                              <v-icon
                                color="grey"
                                small
                              >mdi-minus-thick</v-icon>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <!-- 구매요청내역 -->
                <v-tab-item>
                  <v-card>

                    <v-card-title>
                      <v-row>
                        <v-col v-show="edit_buttons_show" cols="12" sm="12">
                          <v-btn
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right dont_print"
                            elevation="0"
                            data-html2canvas-ignore="true"
                            @click="dialog_edit_purchase_requested = true"
                          >
                            <v-icon
                              small
                            >mdi-pencil</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-title>
                    <v-card-text>
                      <DataTableComponent
                        :headers="purchase_requested_headers"
                        :items="purchase_requested_data"
                        item-key="item_code"
                        dense
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
                          <p class="text-h5 black--text mb-0 font-weight-black"  style="font-weight: bold;">산출내역서</p>
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
            <v-col cols="12" :sm="production_steppers !== 3 ? 5 : 12">
              <v-stepper v-model="production_steppers">
                <v-stepper-header>
                  <template v-for="n in production_step">
                    <v-stepper-step
                      :key="`${n}-step`"
                      :complete="production_steppers > n"
                      :step="n"
                    >
                      <!-- {{ n ===  1 ? '관련 자재 선택' : '견적 정보 입력'}} -->
                      {{ write_tab_items[n-1] }}
                    </v-stepper-step>

                    <v-divider
                      v-if="n !== production_step"
                      :key="n"
                    ></v-divider>
                  </template>
                </v-stepper-header>

                <v-stepper-items>
                  <v-stepper-content
                    v-for="n in production_step"
                    :key="`${n}-content`"
                    :step="n"
                  >
                  <!-- 설계 정보 입력 -->
                    <div v-if="n === 1">
                      <v-chip
                        class="mr-2 mb-3"
                        style="cursor:pointer"
                        v-for="(member, i) in approval_member_info"
                        :key="i"
                        :color="member.name ? 'success' : 'default'"
                        @click="selectMemberDialog(i)"
                      >
                        {{ member.type }} : {{ member.name }}
                      </v-chip>
                      <p class="text-h6 font-weight-bold py-2 px-4" style="background-color: #E3F2FD;" >설계 정보</p>
                      <InputsFormComponent
                        dense
                        clearable
                        :inputs="estimateDefaultInfoInputs"
                      >

                      </InputsFormComponent>

                      <p class="text-h6 font-weight-bold py-2 px-4 mt-12" style="background-color: #E3F2FD;">업체 정보</p>
                      <InputsFormComponent
                        dense
                        clearable
                        :inputs="estimateCompanyInfoInputs"
                      >
                      </InputsFormComponent>
                      <p class="text-h6 font-weight-bold py-2 px-4 mt-12" style="background-color: #E3F2FD;" >첨부</p>
                      <v-row>
                        <v-col cols="12">
                          <v-btn
                            v-if="!blueprint_inputs_show"
                            @click="blueprint_inputs_show = true"
                            class="mb-3"
                            x-small
                            color="primary"
                          >상세 도면 첨부</v-btn>
                          <InputsFormComponent
                            dense
                            clearable
                            :inputs="blueprintDetailInputs"
                            v-if="blueprint_inputs_show"
                          >
                          <v-col cols="12" sm="4">
                            <v-btn
                              @click="blueprint_inputs_show = false"
                              class="mb-3 white--text"
                              x-small
                              color="grey"
                            >상세 도면 닫기</v-btn>
                          </v-col>
                          </InputsFormComponent>
                        </v-col>
                      </v-row>
                      <v-divider class="my-4"></v-divider>
                      <InputsFormComponent
                        dense
                        clearable
                        :inputs="estimateFilesInputs"
                      >

                      </InputsFormComponent>
                      <v-btn
                        small
                        color="success"
                        class="mt-5 elevation-0"
                        @click="production_steppers = 2"
                      >
                        다음 ▶
                      </v-btn>
                    </div>
                  <!-- BOM LIST 작성 -->
                    <div v-if="n === 2">

                      <span class="font-weight-black primary--text text-h6 mr-2">완제품 조회</span>
                      <v-btn
                        x-small
                        @click="!bom_product_search ? bom_product_search = true : bom_product_search = false"
                      >
                        {{ !bom_product_search ? '펼치기' : '접기' }}
                      </v-btn>

                      <InputsFormComponent
                        dense
                        clearable
                        hide-details
                        filled
                        :inputs="bomProductSearchInputs"
                        v-if="bom_product_search"
                        class="mt-3"
                      >
                        <v-col
                          cols="6"
                          sm="4"
                          lg="3"
                          align-self="center"
                        >
                          <v-btn
                            color="primary"
                            elevation="2"
                            small
                            @click="searchProduct"
                          >
                            <v-icon>mdi-magnify</v-icon>검색
                          </v-btn>
                        </v-col>
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
                              >선택
                              </v-btn>
                            </template>
                          </v-data-table>
                        </v-col>
                      </InputsFormComponent>
                      <v-divider class="my-7"></v-divider>

                      <p class="font-weight-black primary--text text-h6 mb-0">선택 구성</p>
                      <v-data-table
                        dense
                        :headers="dialog_product_details_headers"
                        :items="dialog_search_product_data"
                        item-key="product_code"
                        class="elevation-1"
                      >
                        <template v-slot:[`item.actions`]>

                          <v-icon
                            @click="dialog_bom_detail = true"
                          >mdi-magnify</v-icon>
                        </template>
                        <template v-slot:[`item.cancle`]>

                          <v-icon
                            color="grey"
                            small
                          >mdi-minus-thick</v-icon>
                        </template>
                      </v-data-table>
                      <v-btn
                        small
                        color="grey lighten-2"
                        class="mt-5 mr-2 elevation-0"
                        @click="production_steppers = 1"
                      >
                        ◀ 이전
                      </v-btn>
                      <v-btn
                        small
                        color="success"
                        class="mt-5 elevation-0"
                        @click="production_steppers = 3"
                      >
                        다음 ▶
                      </v-btn>
                    </div>
                  <!-- 구매 요청 작성 -->
                    <div  v-if="n === 3" >
                      <v-row>
                        <v-col cols="12" sm="12">
                          <p class="text-h6 primary--text mb-0 font-weight-bold float-left mr-2">추가 선택</p>
                          <v-btn
                            color="success"
                            class="float-right"
                            small
                            elevation="0"
                            @click="searchPreOdered('search')"
                          >
                            선주문 내역
                          </v-btn>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <v-checkbox
                            hide-details
                            class="mt-0 mr-4 float-left"
                            label="필요수량 > 재고수량"
                          ></v-checkbox>
                          <v-checkbox
                            hide-details
                            class="mt-0 mr-4 float-left"
                            label="필요수량 ≤ 재고수량"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <DataTableComponent
                            :headers="bom_list_headers"
                            :items="bom_list_data"
                            item-key="product_code"
                            children-key="belong_data"
                            dense
                            tableClass="elevation-0"
                            addToTable
                            addBelongToTable
                            @addDataToTable="addShipData"
                          />
                        </v-col>
                      </v-row>
                      <v-divider class="my-6"></v-divider>
                      <v-row>
                        <v-col cols="12" sm="12" >
                          <p class="mb-5">
                            <span class="text-h6 primary--text font-weight-bold">구매 요청</span>
                          </p>
                          <v-autocomplete
                            v-model="select_purchase_manager"
                            :items="purchasers"
                            label="구매 담당자"
                            dense
                            clearable
                            hide-details
                            style="width:200px"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <v-data-table
                            :headers="bom_list_purchase_headers"
                            :items="bom_list_purchase_data"
                            group-by="product_code"
                            item-key="item_code"
                            dense
                          >
                          <template v-slot:[`group.header`]="{items, isOpen, toggle}">
                            <th colspan="12">
                              <v-icon @click="toggle"
                                >{{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                              </v-icon>
                              {{ items[0].product_code }}
                            </th>
                            <th>
                              <v-icon
                                color="grey"
                                small
                                @click="deleteItem(items[0].product_code)"
                              >mdi-minus-thick</v-icon>
                            </th>
                          </template>
                          <template v-slot:[`item.purchase_num`] = "{ item }">
                            <v-text-field
                              dense
                              hide-details
                              v-model="item.purchase_num"
                              style="width:100px;font-size: 0.775rem !important;"
                              filled
                            ></v-text-field>
                          </template>
                          <template v-slot:[`item.estimate`] = "{ item }">
                            <div  style="max-width: 160px;">
                              <v-checkbox
                                label="미선택"
                                color="primary"
                                hide-details
                                class="float-left mr-3 mt-0"
                                v-model="item.estimate"
                              ></v-checkbox>
                              <v-btn
                                color="primary"
                                class="float-left"
                                x-small
                                elevation="0"
                                @click="estimateDialog = true"
                              >
                                견적서
                              </v-btn>
                              <v-btn
                                color="success"
                                class="float-left"
                                x-small
                                elevation="0"
                                @click="searchPreOdered('select')"
                              >
                                선주문
                              </v-btn>
                            </div>
                          </template>
                          <template v-slot:[`item.cancle`] = "{ index }">
                            <v-icon
                              color="grey"
                              small
                              @click="deleteItem(index)"
                            >mdi-minus-thick</v-icon>
                          </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                      <v-btn
                        small
                        color="grey lighten-2"
                        class="mt-5 mr-2 elevation-0"
                        @click="production_steppers = 2"
                      >
                        ◀ 이전
                      </v-btn>
                      <v-btn
                        small
                        color="success"
                        class="mt-5 elevation-0"
                        @click="production_steppers = 4"
                      >
                        다음 ▶
                      </v-btn>
                    </div>
                  <!-- 산출내역서 작성 -->
                    <div  v-if="n === 4" >
                      <p class="text-h5 black--text mb-0 font-weight-black"  style="font-weight: bold;">산출내역서</p>
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
                      <v-btn
                        small
                        color="grey lighten-2"
                        class="mt-5 mr-2 elevation-0"
                        @click="production_steppers = 3"
                      >
                        ◀ 이전
                      </v-btn>
                      <v-btn
                        small
                        color="success"
                        class="mt-5 elevation-0"
                        @click="save()"
                      >
                        저장
                      </v-btn>
                    </div>
                  </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
            </v-col>
            <v-col cols="12" sm="7" v-if="production_steppers !== 3">
              <v-card style="position: fixed; max-width:920px">
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-btn
                      color="grey lighten-4"
                      small
                      class="mr-4 float-right"
                      elevation="1"
                      @click="estimate_dialog = true"
                    >
                    생산 의뢰 내역
                    </v-btn>
                  </v-col>
                </v-row>
                <v-card-title>
                  <v-row
                    class="px-3"
                    style="background: #efefef;"
                  >
                    <v-col align-self="center" cols="12" sm="10">
                      <p style="font-weight: bold; font-size: 30px;" class="mb-0">수주 확인서
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
                          <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">프로젝트명</td>
                          <td class="estimate_info" style="border-bottom: 0px;"></td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">프로젝트기간</td>
                          <td class="estimate_info" style="border-bottom: 0px;"></td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title text-center" style="border-left:1px solid #b6b6b6">유효기간</td>
                          <td class="estimate_info"></td>
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


    <!-- BOM LIST 상세 Modal -->
    <ModalDialogComponent
      :dialog-value="dialog_bom_detail"
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
          <v-col cols="12" sm="12">
            <p class="font-weight-black primary--text text-h6 mb-0 float-left">자재 검색</p>
            <v-btn
              fab
              color="blue-grey darken-1"
              x-small
              class="float-right white--text ml-2"
              elevation="1"
              @click="dialog_bom_detail=false"
            >
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
            <v-btn
              color="primary"
              fab
              x-small
              elevation="1"
              class="float-right ml-2"
            >
              <v-icon small>mdi-content-save</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" sm="12">
            <v-col cols="12">
              <InputsFormComponent
                dense
                filled
                clearable
                hide-details
                :inputs="productSearchItemInputs"
                @enter="searchItem"
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
                    class="mr-2"
                    small
                    @click="searchItem"
                  >
                    검색
                  </v-btn>
                  <v-btn
                    color="success"
                    elevation="2"
                    class="mr-2"
                    small
                    @click="addItems"
                  >
                    추가
                  </v-btn>
                  <v-btn color="default" small @click="set_material_search = false" v-if="set_material_search">
                    자재 선택 닫기
                  </v-btn>
                </v-col>
              </InputsFormComponent>
            </v-col>
            <v-col cols="12">
              <!-- <DataTableComponent
                v-model="selected_items_for_product_data"
                :headers="product_search_item_headers"
                :items="search_items_for_product_data"
                item-key="_code"
                show-select
                dense
              /> -->

              <v-data-table
                v-model="selected_items_for_product_data"
                :headers="product_search_item_headers"
                :items="search_items_for_product_data"
                item-key="_code"
                show-select
                dense
              ></v-data-table>
            </v-col>
          </v-col>
          <v-col cols="12" sm="12">

            <p class="font-weight-black primary--text text-h6 mb-2">
              TEST-01 구성 자재
              <v-btn
                small
                class="ml-2"
                @click="addItemSetting"
              >입력 행 +</v-btn>
            </p>

            <v-data-table
              v-model="selected_items_for_product_data"
              :headers="product_item_setting_headers"
              :items="setting_item_data"
              item-key="_code"
              dense
              disable-sort
            >
              <template v-slot:item = "{ item }">
                <tr>
                  <td class="text-center">
                    <v-text-field
                      v-if="item.data_type === 'added'"
                      v-model="item.type"
                      dense
                      hide-details
                      filled
                      style="width:200px; font-size:12px">
                    </v-text-field>
                    {{ item.data_type === 'selected' ? item.type : '' }}
                  </td>
                  <td class="text-center">
                    <v-text-field
                      v-if="item.data_type === 'added'"
                      v-model="item.classification"
                      dense
                      hide-details
                      filled
                      style="width:200px; font-size:12px">
                    </v-text-field>
                    {{ item.data_type === 'selected' ? item.classification : '' }}
                  </td>
                  <td class="text-center">
                    <v-text-field
                      v-if="item.data_type === 'added'"
                      v-model="item.product_code"
                      dense
                      hide-details
                      filled
                      style="width:200px; font-size:12px">
                    </v-text-field>
                    {{ item.data_type === 'selected' ? item.product_code : '' }}
                  </td>
                  <td class="text-center">
                    <v-text-field
                      v-if="item.data_type === 'added'"
                      v-model="item.name"
                      dense
                      hide-details
                      filled
                      style="width:200px; font-size:12px">
                    </v-text-field>
                    {{ item.data_type === 'selected' ? item.name : '' }}
                  </td>
                  <td class="text-center">
                    <v-text-field
                      v-if="item.data_type === 'added'"
                      v-model="item.model"
                      dense
                      hide-details
                      filled
                      style="width:200px; font-size:12px">
                    </v-text-field>
                    {{ item.data_type === 'selected' ? item.model : '' }}
                  </td>
                  <td class="text-center">
                    <v-text-field
                      v-if="item.data_type === 'added'"
                      v-model="item.spec"
                      dense
                      hide-details
                      filled
                      style="width:200px; font-size:12px">
                    </v-text-field>
                    {{ item.data_type === 'selected' ? item.spec : '' }}
                  </td>
                  <td class="text-center">
                    <v-text-field
                      v-if="item.data_type === 'added'"
                      v-model="item.manufacturer"
                      dense
                      hide-details
                      filled
                      style="width:200px; font-size:12px">
                    </v-text-field>
                    {{ item.data_type === 'selected' ? item.manufacturer : '' }}
                  </td>
                  <td class="text-center">
                    <v-text-field
                      v-if="item.data_type === 'added'"
                      v-model="item.unit_price"
                      dense
                      hide-details
                      filled
                      style="width:200px; font-size:12px">
                    </v-text-field>
                    {{ item.data_type === 'selected' ? item.unit_price : '' }}
                  </td>
                  <td class="text-center">
                    <v-icon
                      color="grey"
                      small
                    >
                      mdi-minus-thick
                    </v-icon>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </ModalDialogComponent>

    <!-- 공사자재 Modal -->
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
          <v-col cols="12" sm="12">
            <v-btn
              fab
              color="blue-grey darken-1"
              x-small
              class="float-right white--text ml-2"
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
              class="float-right ml-2"
            >
              <v-icon small>mdi-content-save</v-icon>
            </v-btn>
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

      <!-- 구매요청내역 수정 모달 -->
      <ModalDialogComponent
        :dialog-value="dialog_edit_purchase_requested"
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
            <v-col cols="12" sm="12">
              <p class="text-h6 primary--text mb-0 font-weight-bold float-left mr-2">추가 선택</p>
              <v-btn
                color="default"
                small
                elevation="0"
                @click="searchPreOdered('search')"
              >
                선주문 내역
              </v-btn>
              <v-btn
                color="default"
                small
                class="mr-2 float-right"
                elevation="2"
                @click="dialog_edit_purchase_requested =false"
              >
                닫기
              </v-btn>
              <v-btn
                color="success"
                small
                class="mr-2 float-right"
                elevation="2"
              >
                저장
              </v-btn>
            </v-col>
            <v-col cols="12" sm="12">
              <v-checkbox
                hide-details
                class="mt-0 mr-4 float-left"
                label="필요수량 > 재고수량"
              ></v-checkbox>
              <v-checkbox
                hide-details
                class="mt-0 mr-4 float-left"
                label="필요수량 ≤ 재고수량"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" sm="12">
              <DataTableComponent
                :headers="bom_list_headers"
                :items="bom_list_data"
                item-key="product_code"
                children-key="belong_data"
                dense
                tableClass="elevation-0"
                addToTable
                addBelongToTable
                @addDataToTable="addShipData"
              />
            </v-col>
          </v-row>
          <v-divider class="my-6"></v-divider>
          <v-row>
            <v-col
              cols="12"
            ><span class="font-weight-black primary--text text-h6 mr-4">구매 요청 내역 수정</span>
            </v-col>
            <v-col cols="12" sm="12">
              <v-autocomplete
                v-model="select_purchase_manager"
                :items="purchasers"
                label="구매 담당자"
                dense
                clearable
                filled
                class="mb-4"
                hide-details
                style="width:200px"
              ></v-autocomplete>
              <v-data-table
                :headers="bom_list_purchase_headers"
                :items="bom_list_purchase_data"
                group-by="product_code"
                item-key="item_code"
                dense
              >
              <template v-slot:[`group.header`]="{items, isOpen, toggle}">
                <th colspan="12">
                  <v-icon @click="toggle"
                    >{{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                  </v-icon>
                  {{ items[0].product_code }}
                </th>
                <th>
                  <v-icon
                    color="grey"
                    small
                    @click="deleteItem(items[0].product_code)"
                  >mdi-minus-thick</v-icon>
                </th>
              </template>
              <template v-slot:[`item.purchase_num`] = "{ item }">
                <v-text-field
                  dense
                  hide-details
                  v-model="item.purchase_num"
                  style="width:100px;font-size: 0.775rem !important;"
                  filled
                ></v-text-field>
              </template>
              <template v-slot:[`item.estimate`] = "{ item }">
                <div  style="max-width: 160px;">
                  <v-checkbox
                    label="미선택"
                    color="primary"
                    hide-details
                    class="float-left mr-3 mt-0"
                    v-model="item.estimate"
                  ></v-checkbox>
                  <v-btn
                    color="primary"
                    class="float-left"
                    x-small
                    elevation="0"
                    @click="estimateDialog = true"
                  >
                    견적서
                  </v-btn>
                  <v-btn
                    color="success"
                    class="float-left"
                    x-small
                    elevation="0"
                    @click="searchPreOdered('select')"
                  >
                    선주문
                  </v-btn>
                </div>
              </template>
              <template v-slot:[`item.cancle`] = "{ index }">
                <v-icon
                  color="grey"
                  small
                  @click="deleteItem(index)"
                >mdi-minus-thick</v-icon>
              </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </ModalDialogComponent>
      <ModalDialogComponent
        :dialog-value="pre_ordered_dialog"
        max-width="900px"
        title-class="display-none"
        text-class="pb-0"
        closeText="닫기"
        :persistent="true"
        @close="pre_ordered_dialog = false"
      >
        <CardComponent
          elevation="0"
          text-class="pa-0 pt-4"
          title-class="pa-0"
        >
          <div slot="cardTitle">
            <span>주문 내역</span>
          </div>
          <div slot="cardText">
            <v-row>
              <v-col cols="12">
                <InputsFormComponent
                  dense
                  clearable
                  filled
                  hide-details
                  :inputs="searchPurchaseInputs"
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
                  >
                    <v-icon>mdi-magnify</v-icon>검색
                  </v-btn>
                </v-col>
                </InputsFormComponent>
              </v-col>
              <v-col cols="12">
                <v-data-table
                  :headers="purchase_detail_headers"
                  :items="purchase_detail_data"
                  :item-key="purchase_detail_data.product_code"
                  group-by="estimate_company"
                  dense
                >

                  <template v-slot:[`group.header`]="{items, isOpen, toggle}">
                    <th  @click="toggle" colspan="10">
                      <v-icon
                      >
                        {{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                      </v-icon>
                      {{ items[0].estimate_company }}
                    </th>
                  </template>
                  <template v-slot:[`item.select_purchase`] = "{ item }">
                    <v-btn
                      color="success"
                      x-small
                      elevation="0"
                      @click="selectPurchase(item)"
                    >
                      선택
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </div>
        </CardComponent>
      </ModalDialogComponent>
      <v-dialog
        v-model="estimateDialog"
        persistent
        max-width="1000px"
      >
        <v-stepper v-model="estimate_steppers">
          <v-stepper-header>
            <template v-for="n in estimated_step">
              <v-stepper-step
                :key="`${n}-step`"
                :complete="estimate_steppers > n"
                :step="n"
                editable
              >
                {{ n ===  1 ? '관련 자재 선택' : '견적 정보 입력'}}
              </v-stepper-step>

              <v-divider
                v-if="n !== estimated_step"
                :key="n"
              ></v-divider>
            </template>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content
              v-for="n in estimated_step"
              :key="`${n}-content`"
              :step="n"
            >
              <div v-if="n === 1">
                <v-row>
                  <v-col cols="12">
                    <v-data-table
                      v-model="selected_estimate_data"
                      :headers="bom_list_headers"
                      :items="bom_list_purchase_data"
                      item-key="product_code"
                      dense
                      show-select
                    ></v-data-table>
                  </v-col>
                </v-row>
                <v-btn
                  color="primary"
                  @click="estimate_steppers = 2"
                >
                  다음 ▶
                </v-btn>

                <v-btn
                  text
                  color="error"
                  @click="estimateDialog = false"
                >
                  취소
                </v-btn>
              </div>
              <div v-if="n === 2">
                <v-card class="elevation-0">
                  <v-card-text>
                    <v-row>
                      <v-col cols="12">
                        <v-btn
                          x-small
                          color="primary"
                          @click="!show_selected_estimate_data ? show_selected_estimate_data = true :  show_selected_estimate_data = false"
                        >관련 자재</v-btn>
                      </v-col>
                      <v-col cols="12" v-if="show_selected_estimate_data">
                        <v-data-table
                        style="border:1px solid #c0c0c0"
                          :headers="bom_list_headers"
                          :items="selected_estimate_data"
                          item-key="product_code"
                          dense
                        ></v-data-table>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" sm="12">
                        <InputsFormComponent
                          dense
                          clearable
                          filled
                          hide-details
                          :inputs="setPurchaseInputs"
                        >
                          <v-col cols="12" sm="4">
                            <v-btn
                              color="success"
                              @click="test(), estimateDialog = false"
                            >
                              저장
                            </v-btn>
                          </v-col>
                        </InputsFormComponent>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <v-card class="elevation-0">
                  <v-card-text>
                    <v-btn
                      color="primary"
                      @click="estimate_steppers = 1"
                    >
                      ◀ 이전
                    </v-btn>
                    <v-btn
                      text
                      color="error"
                      @click="estimateDialog = false"
                    >
                      취소
                    </v-btn>

                  </v-card-text>
                </v-card>
              </div>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-dialog>

      <EstimateSearchDialogComponent
        :dialog-value="estimate_dialog"
        :persistent="true"
        @close="closEstimateSearch"
      >
      </EstimateSearchDialogComponent>

      <MemberSearchDialogComponent
        :dialog-value="member_dialog"
        :persistent="true"
        @close="close"
        @setMember = "setMember"
        @members = "members"
      >
      </MemberSearchDialogComponent>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import DataTableComponent from "@/components/DataTableComponent.vue";
import DesignProductionPageConfig from "@/configure/DesignProductionPageConfig.json";

import CostTableComponent from "@/components/CostTableComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent";
import MemberSearchDialogComponent from "@/components/MemberSearchDialogComponent";
import EstimateSearchDialogComponent from "@/components/EstimateSearchDialogComponent";
import mux from "@/mux";

export default {
  
  mounted() {
    
  },
  components: {
                NavComponent,
                InputsFormComponent,
                CardComponent,
                DataTableComponent,
                CostTableComponent,
                ModalDialogComponent,
                EstimateSearchDialogComponent,
                MemberSearchDialogComponent,
              },

  created () {
    this.initialize()
  },

  methods:{
    // eslint-disable-next-line no-unused-vars
    
    async initialize(){
      const prevURL = window.location.href;
      try {
        if (prevURL !== window.location.href) return;
        this.approval_member_info[0].name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.approval_member_info[0].email = this.$cookies.get(this.$configJson.cookies.email.key);
        this.approval_member_info[0].id = this.$cookies.get(this.$configJson.cookies.id.key);
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }

      // 구매담당자 리스트업 (설계 > 작성 > 구매요청 step > 구매담당자 선택을 위함)
      try {
        const result = await mux.Server.get({path:'/api/admin/users/'});
        if (prevURL !== window.location.href) return;
        if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          result.data.Users.map(data => {
            if(data.Attributes.find(x=>x.Name === 'custom:department').Value === '기획관리부'){
              this.purchasers.push((data.Attributes.find(x=>x.Name === 'given_name') ? data.Attributes.find(x=>x.Name === 'given_name').Value : '') + '(' + data.Username + ')');
            }
          });

        }else {
          mux.Util.hideLoading();
          mux.Util.showAlert(result.message);
          return;
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.hideLoading();
        mux.Util.showAlert(error);
        return;
      }


    },
    async searchButton(){
      mux.Util.showLoading();
      this.search_production_data = DesignProductionPageConfig.test_production_data
      mux.Util.hideLoading();
    },
    test(){
      // console.log('test');
      // mux.Server.uploadFile({path: '/', folder:'somefolder', file: this.files[0]});
      mux.Server.uploadFile({path: '/', folder:'somefolder', files: this.files});
    },
    closEstimateSearch(){
      this.estimate_dialog = false;
    },
    addItemSetting(){
      this.setting_item_data.push(
        {
          "type":"",
          "classification":"",
          "product_code":"",
          "name":"",
          "model":"",
          "spec":"",
          "manufacturer":"",
          "unit_price":"",
          "data_type": "added"
        }
      )
    },

    selectMemberDialog(idx){
      this.member_type_index = idx
      this.member_dialog = true;
    },
    setMember(item){
      this.approval_member_info[this.member_type_index].name = item.name.trim()
      this.approval_member_info[this.member_type_index].user_id = item.user_id
      this.close();
    },
    members(data){
      this.members_list=data;
    },
    close(){
      this.member_dialog = false;
    },

    searchPreOdered(type){
      let headers = this.purchase_detail_headers
      let index = headers.findIndex(e => e.text === '선택');
      if(type === 'search'){
        if(index !== -1){
          headers.splice(index, 1);
        }
      }else{
        if(index === -1){
          headers.unshift({ "text": "선택", "align": "start", "value": "select_purchase"});
        }
      }
      this.pre_ordered_dialog = true;
    },
  },
  data(){
    return{
      purchasers: [],
      select_purchase_manager: '',
      production_steppers: 1,
      production_step: 4,
      estimate_steppers: 1,
      estimated_step: 2,

      estimate_dialog: false,
      edit_survey_cost_num_disabled: true,
      edit_buttons_show: true,
      editable_bom_list: false,

      tab_main: null,
      tab_search: null,
      tab_dialog_search_product: null,
      tab_main_items: DesignProductionPageConfig.tab_main_items,
      dialog_search_product_items: DesignProductionPageConfig.dialog_search_product_items,
      dialog_search_product: false,
      dialog_bom_detail: false,
      dialog_calculate_labor: false,
      dialog_edit_purchase_requested: false,
      blueprint_inputs_show: false,
      bom_product_search: false,
      pre_ordered_dialog: false,
      estimateDialog: false,
      show_selected_estimate_data: false,
      edit_production_files: false,
      member_dialog: false,
      member_type_index:0,
      members_list:[],


      approval_member_info: DesignProductionPageConfig.approval_member_info,
      save_costs: DesignProductionPageConfig.save_costs,
      search_estimate_headers: DesignProductionPageConfig.search_estimate_headers,
      survey_cost_headers: DesignProductionPageConfig.survey_cost_headers,
      labor_cost_headers: DesignProductionPageConfig.labor_cost_headers,
      labor_list_headers: DesignProductionPageConfig.labor_list_headers,
      dialog_product_details_headers: DesignProductionPageConfig.dialog_product_details_headers,
      dialog_search_product_headers: DesignProductionPageConfig.dialog_search_product_headers,
      construction_materials_headers: DesignProductionPageConfig.construction_materials_headers,
      purchase_detail_headers: DesignProductionPageConfig.purchase_detail_headers,
      purchase_requested_headers: DesignProductionPageConfig.purchase_requested_headers,
      bom_list_headers: DesignProductionPageConfig.bom_list_headers,
      bom_list_purchase_headers: DesignProductionPageConfig.bom_list_purchase_headers,

      dialog_search_product_data: DesignProductionPageConfig.dialog_search_product_test_data,
      product_search_item_headers: DesignProductionPageConfig.product_search_item_headers,
      product_item_setting_headers: DesignProductionPageConfig.product_item_setting_headers,
      setting_item_data: DesignProductionPageConfig.setting_item_test_data,
      purchase_detail_data: DesignProductionPageConfig.test_purchase_detail_data,
      bom_list_data: DesignProductionPageConfig.bom_list_test_data,
      bom_list_purchase_data: DesignProductionPageConfig.bom_list_purchase_test_data,

      construction_materials_data: JSON.parse(JSON.stringify(DesignProductionPageConfig.construction_materials_data)),
      calc_cost_detail_data: JSON.parse(JSON.stringify(DesignProductionPageConfig.calc_cost_detail_data)),
      calc_cost_detail_data2: DesignProductionPageConfig.calc_cost_detail_data.map(x => {
        if (x.cost_list === '재료비') {
          x.belong_data[1].costListBtn = {
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
      purchase_requested_data: [],
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

      search_tab_items: DesignProductionPageConfig.search_tab_items,
      write_tab_items: DesignProductionPageConfig.write_tab_items,
      searchCardInputs: DesignProductionPageConfig.searchCardInputs,
      productSearchItemInputs: DesignProductionPageConfig.productSearchItemInputs,
      estimateDefaultInfoInputs: DesignProductionPageConfig.estimateDefaultInfoInputs,
      estimateCompanyInfoInputs: DesignProductionPageConfig.estimateCompanyInfoInputs,
      estimateFilesInputs: DesignProductionPageConfig.estimateFilesInputs,
      blueprintDetailInputs: DesignProductionPageConfig.blueprintDetailInputs,
      bomProductSearchInputs: DesignProductionPageConfig.bomProductSearchInputs,
      searchPurchaseInputs: DesignProductionPageConfig.searchPurchaseInputs,
      setPurchaseInputs: DesignProductionPageConfig.setPurchaseInputs,
      search_production_data: [],
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
