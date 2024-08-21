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
                            :headers="set_bom_list_headers"
                            :items="searched_product_data"
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
                        @click="nextStep(n)"
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
                            :headers="search_product_headers"
                            :items="searched_product_data"
                            item-key="product_code"
                            class="elevation-1"
                          >
                            <template v-slot:[`item.actions`]="{ item }">
                              <v-btn
                                color="success"
                                x-small
                                class="ml-3"
                                elevation="0"
                                @click="addBomList(item)"
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
                        :headers="set_bom_list_headers"
                        :items="set_bom_list_data"
                        item-key="product_code"
                        class="elevation-1"
                      >
                        <template v-slot:[`item.actions`]="{ item }">

                          <v-icon
                            @click="showBomDetail(item)"
                          >mdi-magnify</v-icon>
                        </template>
                        <template v-slot:[`item.product_num`] = "{ item }">
                          <v-text-field
                            dense
                            hide-details
                            v-model="item.product_num"
                            style="width:100px;font-size: 0.775rem !important;"
                            filled
                            :oninput="!item.product_num ? 0 : item.product_num = item.product_num.replace(/^0+|\D+/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')"
                          ></v-text-field>
                        </template>
                        <template v-slot:[`item.cancle`] = "{ index }">
                          <v-icon
                            color="grey"
                            small
                            @click="deleteItem(set_bom_list_data, index)"
                          >mdi-minus-thick</v-icon>
                        </template>
                      </v-data-table>
                      <v-btn
                        small
                        color="grey lighten-2"
                        class="mt-5 mr-2 elevation-0"
                        @click="previousStep(n)"
                      >
                        ◀ 이전
                      </v-btn>
                      <v-btn
                        small
                        color="success"
                        class="mt-5 elevation-0"
                        @click="nextStep(n)"
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
                          <DataTableComponent
                            :headers="bom_list_headers"
                            :items="bom_list_data"
                            item-key="product_code"
                            children-key="belong_data"
                            dense
                            tableClass="elevation-0"
                            addToTable
                            addBelongToTable
                            @addDataToTable="addProductData"
                            @addBelongToTable="addBelongData"
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
                                @click="cancleItem(items[0].product_code, false)"
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
                              :oninput="!item.purchase_num ? 0 : item.purchase_num = item.purchase_num.replace(/^0+|\D+/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')"
                            ></v-text-field>
                          </template>
                          <template v-slot:[`item.estimate`] = "{ item }">
                            <div  style="max-width: 160px;">
                              <v-checkbox
                                label="미선택"
                                color="primary"
                                hide-details
                                class="float-left mr-3 mt-0 pt-0"
                                v-model="item.purchase_estimate_check"
                                @click="clickDontSelect(item.product_code, item.item_code)"
                              ></v-checkbox>
                              <v-btn
                                :color="item.purchase_estimate_company === '' ?'grey' : 'primary' "
                                :class="item.purchase_estimate_company === '' ? 'float-left white--text':'float-left mr-3'"
                                x-small
                                elevation="0"
                                @click="estimateDialog(item)"
                              >
                                견적서
                              </v-btn>
                              <v-btn
                                :color="!item.belong_data ?'grey' : 'success' "
                                :class="!item.belong_data ? 'float-left white--text':'float-left mr-3'"
                                class="float-left"
                                x-small
                                elevation="0"
                                @click="searchPreOdered('select', item)"
                              >
                                선주문
                              </v-btn>
                            </div>
                          </template>
                          <template v-slot:[`item.cancle`] = "{ item }">
                            <v-icon
                              color="grey"
                              small
                              @click="cancleItem(item.product_code, item.item_code)"
                            >mdi-minus-thick</v-icon>
                          </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                      <v-btn
                        small
                        color="grey lighten-2"
                        class="mt-5 mr-2 elevation-0"
                        @click="previousStep(n)"
                      >
                        ◀ 이전
                      </v-btn>
                      <v-btn
                        small
                        color="success"
                        class="mt-5 elevation-0"
                        @click="nextStep(n)"
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
                        @click="saveData()"
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
              @click="colseBomDetail"
            >
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
            <v-btn
              color="primary"
              fab
              x-small
              elevation="1"
              class="float-right ml-2"
              @click="saveBomDetail"
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

            <p class="mb-2">
              <span class="font-weight-black primary--text text-h6">{{ item_setting_product_code }} 구성 자재</span>
              <v-btn
                small
                class="ml-2 mr-5"
                @click="addItemSetting"
              >입력 행 +</v-btn>
              <span>*하단 표의 필요 수량은 완제품 1개를 만드는데 필요한 수량입니다.</span>
            </p>

            <v-data-table
              v-model="selected_items_for_product_data"
              :headers="product_item_setting_headers"
              :items="setting_item_data"
              item-key="item_code"
              dense
              disable-sort
            >
              <template v-slot:item = "{ item, index }">
                <tr>
                  <td class="text-center">
                    <v-text-field
                      v-if="item.data_type === 'written'"
                      v-model="item.type"
                      dense
                      hide-details
                      filled
                      style="width:200px; font-size:12px">
                    </v-text-field>
                    {{ item.data_type !== 'written' ? item.type : '' }}
                  </td>
                  <td class="text-center">
                    <v-text-field
                      v-if="item.data_type === 'written'"
                      v-model="item.classification"
                      dense
                      hide-details
                      filled
                      style="width:200px; font-size:12px">
                    </v-text-field>
                    {{ item.data_type !== 'written' ? item.classification : '' }}
                  </td>
                  <td class="text-center">
                    <v-text-field
                      v-if="item.data_type === 'written'"
                      v-model="item.item_code"
                      dense
                      hide-details
                      filled
                      style="width:200px; font-size:12px">
                    </v-text-field>
                    {{ item.data_type !== 'written' ? item.item_code : '' }}
                  </td>
                  <td class="text-center">
                    <v-text-field
                      v-if="item.data_type === 'written'"
                      v-model="item.name"
                      dense
                      hide-details
                      filled
                      style="width:200px; font-size:12px">
                    </v-text-field>
                    {{ item.data_type !== 'written' ? item.name : '' }}
                  </td>
                  <td class="text-center">
                    <v-text-field
                      v-if="item.data_type === 'written'"
                      v-model="item.model"
                      dense
                      hide-details
                      filled
                      style="width:200px; font-size:12px">
                    </v-text-field>
                    {{ item.data_type !== 'written' ? item.model : '' }}
                  </td>
                  <td class="text-center">
                    <v-text-field
                      v-if="item.data_type === 'written'"
                      v-model="item.spec"
                      dense
                      hide-details
                      filled
                      style="width:200px; font-size:12px">
                    </v-text-field>
                    {{ item.data_type !== 'written' ? item.spec : '' }}
                  </td>
                  <td class="text-center">
                    <v-text-field
                      v-if="item.data_type === 'written'"
                      v-model="item.manufacturer"
                      dense
                      hide-details
                      filled
                      style="width:200px; font-size:12px">
                    </v-text-field>
                    {{ item.data_type !== 'written' ? item.manufacturer : '' }}
                  </td>
                  <td class="text-center">
                    <v-text-field
                      v-if="item.data_type === 'written'"
                      v-model="item.unit_price"
                      dense
                      hide-details
                      filled
                      style="width:200px; font-size:12px">
                    </v-text-field>
                    {{ item.data_type !== 'written' ? item.unit_price : '' }}
                  </td>
                  <td class="text-center">
                    <v-text-field
                      v-model="item.num"
                      dense
                      hide-details
                      filled
                      style="width:100px; font-size:12px">
                    </v-text-field>
                  </td>
                  <td class="text-center">
                    <v-icon
                      color="grey"
                      small
                      @click="deleteItem(setting_item_data, index)"
                    >mdi-minus-thick</v-icon>
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
                    @click="cancleItem(items[0].product_code, false)"
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
                    @click="unestimatedMailDialog = true"
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
              <template v-slot:[`item.cancle`] = "{ item }">
                <v-icon
                  color="grey"
                  small
                  @click="cancleItem(item.product_code, item.item_code)"
                >mdi-minus-thick</v-icon>
              </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </ModalDialogComponent>
      <ModalDialogComponent
        :dialog-value="pre_ordered_dialog"
        max-width="80%"
        title-class="display-none"
        text-class="pb-0"
        closeText="닫기"
        :persistent="true"
        @close="closePreOrderDialog"
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
                    @click="searchPurchaseData"
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
                  group-by="purchase_estimate_company"
                  dense
                >

                  <template v-slot:[`group.header`]="{items, isOpen, toggle}">
                    <th  @click="toggle" colspan="11">
                      <v-icon
                      >
                        {{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                      </v-icon>
                      {{ items[0].purchase_estimate_company }}
                    </th>
                  </template>
                  <template v-slot:[`item.select_purchase`] = "{ item }">
                    <!-- <v-btn
                      color="success"
                      x-small
                      elevation="0"
                      @click="selectPurchase(item)"
                    >
                      선택
                    </v-btn> -->
                    <v-menu
                      offset-y
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="success"
                          x-small
                          elevation="0"
                          v-bind="attrs"
                          v-on="on"
                        >
                          선택
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content style="width: 150px;">
                            <v-text-field
                              v-model="pre_order_set_num"
                              dense
                              hide-details
                              filled
                              label="사용 수량"
                            ></v-text-field>
                            <v-btn
                              small
                              color="primary"
                              class="mt-4"
                              @click="selectPurchase(item)"
                            >적용</v-btn>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </div>
        </CardComponent>
      </ModalDialogComponent>
      <v-dialog
        v-model="unestimatedMailDialog"
        persistent
        max-width="1000px"
      >
      <v-stepper v-model="unestimated_steppers">
          <v-stepper-header>
            <template v-for="n in unestimated_step">
              <v-stepper-step
                :key="`${n}-step`"
                :complete="unestimated_steppers > n"
                :step="n"
                editable
              >
                {{ n ===  1 ? '관련 자재 선택' : '견적 등록'}}
              </v-stepper-step>

              <v-divider
                v-if="n !== unestimated_step"
                :key="n"
              ></v-divider>
            </template>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content
              v-for="n in unestimated_step"
              :key="`${n}-content`"
              :step="n"
            >
              <div v-if="n === 1">
                <v-row>
                  <v-col cols="12">
                    <DataTableComponent
                      v-model="selected_unestimated_data"
                      :headers="selected_unestimated_headers"
                      :items="bom_list_need_estiamte_data"
                      :item-key="add_data_type === '완제품자재' ? 'item_id' : 'item_code'"
                      table-class="elevation-0"
                      show-select
                      dense
                    />
                  </v-col>
                </v-row>
                <v-btn
                  color="primary"
                  @click="unestimated_steppers = 2"
                >
                  다음 ▶
                </v-btn>

                <v-btn
                  text color="error"
                  @click="closeUnestimatedMailDialog"
                >
                  취소
                </v-btn>
              </div>
              <div v-if="n === 2">
                <v-card class="elevation-0">
                  <v-card-text class="pb-0">
                    <v-row>
                      <v-col cols="12">
                        <v-btn
                          x-small
                          color="primary"
                          @click="!show_selected_unestimated_data ? show_selected_unestimated_data = true :  show_selected_unestimated_data = false"
                        >관련 자재</v-btn>
                      </v-col>
                      <v-col cols="12" v-if="show_selected_unestimated_data">
                        <v-data-table
                        style="border:1px solid #c0c0c0"
                          :headers="selected_unestimated_headers"
                          :items="selected_unestimated_data"
                          :item-key="add_data_type === '완제품자재' ? 'item_id' : 'item_code'"
                          dense
                        ></v-data-table>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <CardComponent
                  title-class="d-none"
                  class="elevation-0"
                >
                  <div slot="cardText">
                    <v-form
                      ref="estimateForm"
                    >
                      <InputsFormComponent
                        dense
                        clearable
                        filled
                        hide-details
                        :inputs="estimateInfoInputs"
                      ></InputsFormComponent>
                    </v-form>
                  </div>
                </CardComponent>

                <v-card class="elevation-0">
                  <v-card-text>
                    <v-btn
                      color="primary"
                      @click="unestimated_steppers = 1"
                    >
                      ◀ 이전
                    </v-btn>
                    <v-btn
                      color="success"
                      @click="savePurchaseEstimate"
                    >
                      저장
                    </v-btn>

                    <v-btn
                      text
                      color="error"
                      @click="closeUnestimatedMailDialog"
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


  watch: {
    select_purchase_manager(val){
      if(val !== null) {
        let user_id = val.split('(')[1].split(')')[0];
        let user_name = val.split('(')[0];
        this.purchase_member_info[1].name = user_name;
        this.purchase_member_info[1].user_id =  user_id;
      }else{
        this.purchase_member_info[1].name = '';
        this.purchase_member_info[1].user_id =  '';
      }
    }
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
        this.purchase_member_info[0].name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.purchase_member_info[0].email =  this.$cookies.get(this.$configJson.cookies.email.key);
        this.purchase_member_info[0].user_id =  this.$cookies.get(this.$configJson.cookies.id.key);
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
      this.estimateInfoInputs = JSON.parse(JSON.stringify(this.estimateInfoInputs));
      mux.Rules.rulesSet(this.estimateInfoInputs);
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


    async searchButton(){
      mux.Util.showLoading();
      this.search_production_data = DesignProductionPageConfig.test_production_data
      mux.Util.hideLoading();
    },
    async searchProduct() {
      mux.Util.showLoading();

      let searchProductCode = this.bomProductSearchInputs.find(x=>x.label === '제품코드').value;
      if (!searchProductCode)
        searchProductCode = '%';
      let searchName = this.bomProductSearchInputs.find(x=>x.label === '제품명').value;
      if (searchName)
        searchName = searchName.trim();
      let searchSpec = this.bomProductSearchInputs.find(x=>x.label === '사양').value;
      if (searchSpec)
        searchSpec = searchSpec.trim();


      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          "params": [
              {
                "product_table.name": searchName ? searchName : "",
                "product_table.product_code": searchProductCode ? searchProductCode : "",
                "product_table.spec": searchSpec ? searchSpec : ""
              }
          ],
          "script_file_name": "rooting_완제품_검색_24_05_16_13_52_1IN.json",
          "script_file_path": "data_storage_pion\\json_sql\\stock\\10_완제품_검색\\완제품_검색_24_05_16_13_53_MZJ"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          if(result['data'].length === 0){
            mux.Util.showAlert('검색 결과가 없습니다.');
          }
          this.searched_product_data = result['data'];
          this.searched_product_data.forEach(data =>{
            data.product_code = data.code;
            delete data.code;
            let stock_calc = 0;
            if (data.spot_stock){
              for(let d=0; d<data.spot_stock.length; d++){
                if (typeof data.spot_stock[d].stock_num === 'number'){
                  stock_calc += data.spot_stock[d].stock_num;
                }
              }
            }
            data.total_stock = stock_calc

            if(data.belong_data){
              for(let b=0; b<data.belong_data.length; b++){
                data.belong_data[b].product_code = data.product_code;
                data.belong_data[b].item_code = data.belong_data[b].code;
                delete data.belong_data[b].code;


                // let total_item_unit_price = 0;
                // data.belong_data[b].unit_price = '₩ '+ Number(data.belong_data[b].unit_price).toLocaleString()
                if(data.belong_data[b].belong_data){
                  delete data.belong_data[b].belong_data;
                }
                  data.belong_data[b].unit_price = '₩ '+ Number(data.belong_data[b].unit_price).toLocaleString()
              }
              console.log(JSON.stringify(data.belong_data) )
              data.belong_data.sort((a, b) => a.item_code.localeCompare(b.item_code));
            }


            if (typeof data.unit_price === 'number'){
              data.item_price = data.unit_price * data.total_stock
              let total_unit_price = 0;
              if(data.belong_data){
                for(let b=0; b<data.belong_data.length; b++){
                  total_unit_price += (data.belong_data[b].unit_price).replace(/,/g,'').replace(/₩ /g,'') * data.belong_data[b].num;
                }
                data.total_stock_price = '₩ '+ Number(data.total_stock * total_unit_price).toLocaleString();
                data.unit_price = '₩ '+ Number(total_unit_price).toLocaleString()
              }else{
                data.unit_price = '₩ '+ Number(data.unit_price).toLocaleString()
              }
            }else {
              data.item_price = 0;
            }


            if (data.belong_data && this.pricePermission){
              data.belong_data.push({
                item_code: '총 재료비',
                unit_price: '',
                total_stock: 0,
                stock_price: '',
                num_price: data.unit_price
              })
            }
            // this.total_stock_num += data.total_stock
            // this.total_stock_price += data.item_price
          })
        }else{
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.hideLoading();
        // console.error(error);
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
      mux.Util.hideLoading();
      // this.product_data = ProductSearchPageConfig.test_product_data;
    },

    async searchItem() {
      mux.Util.showLoading();

      let searchType;
      let searchClassification;
      let searchProductCode;
      let searchProductName ;
      let searchModelName;
      let searchProductSpec;
      let searchManufacturer;
      let searchStockMoreZero = '';

      searchType = this.productSearchItemInputs.find(x=>x.label === '종류').value;
      searchClassification = this.productSearchItemInputs.find(x=>x.label === '분류').value;
      if (searchClassification === 'All')
        searchClassification = '%';
      searchProductCode = this.productSearchItemInputs.find(x=>x.label === '관리코드').value;
      searchProductName = this.productSearchItemInputs.find(x=>x.label === '제품명').value;
      searchModelName = this.productSearchItemInputs.find(x=>x.label === '모델명').value;
      searchProductSpec = this.productSearchItemInputs.find(x=>x.label === '사양').value;
      searchManufacturer = this.productSearchItemInputs.find(x=>x.label === '제조사').value;


      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "product_table.classification": searchClassification ? searchClassification : "",
              "product_table.manufacturer": searchManufacturer ? searchManufacturer : "",
              "product_table.model": searchModelName ? searchModelName : "",
              "product_table.name": searchProductName ? searchProductName : "",
              "product_table.product_code": searchProductCode ? searchProductCode : "",
              "product_table.spec": searchProductSpec ? searchProductSpec : "",
              "product_table.type": searchType ? searchType : "",

              "module_table.classification": searchClassification ? searchClassification : "",
              "module_table.manufacturer": searchManufacturer ? searchManufacturer : "",
              "module_table.model": searchModelName ? searchModelName : "",
              "module_table.name": searchProductName ? searchProductName : "",
              "module_table.module_code": searchProductCode ? searchProductCode : "",
              "module_table.spec": searchProductSpec ? searchProductSpec : "",
              "module_table.type": searchType ? searchType : "",

              "material_table.classification": searchClassification ? searchClassification : "",
              "material_table.manufacturer": searchManufacturer ? searchManufacturer : "",
              "material_table.model": searchModelName ? searchModelName : "",
              "material_table.name": searchProductName ? searchProductName : "",
              "material_table.material_code": searchProductCode ? searchProductCode : "",
              "material_table.spec": searchProductSpec ? searchProductSpec : "",
              "material_table.type": searchType ? searchType : "",
              "material_table.directly_written": 0,

              "stock_table.conditions": "",
              "stock_table.stock_num": searchStockMoreZero
            }
          ],
          "script_file_name": "rooting_재고_검색_24_05_07_11_46_16P.json",
          "script_file_path": "data_storage_pion\\json_sql\\stock\\1_재고검색\\재고_검색_24_05_07_11_46_H8D"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          if(result['data'].length === 0){
            mux.Util.showAlert('검색 결과가 없습니다.');
          }
          result = result['data'].map(a => {
            if (!a.stock_num){
              a.stock_price = 0;
            }else {
              a.stock_price = Math.round(a.unit_price * a.stock_num)
            }
            return a;
          });
          let product_data_arr = [];
          result.forEach(data => {
            // data.unit_price = '₩ '+ Number(data.unit_price).toLocaleString();
            // product_data_arr.push(data);
            let isExist = false;
            if (data.type !== '완제품'){
              for (let i = 0; i < product_data_arr.length; i++) {
                if (product_data_arr[i]._code === data._code) {
                  if (data.stock_num){
                    if (product_data_arr[i].spot_stock !== undefined){
                      product_data_arr[i].spot_stock.push({product_code: data._code, spot: data.spot, stock_num: data.stock_num, conditions: data.conditions, stock_price: Math.round(data.unit_price * data.stock_num)});
                    }else {
                      product_data_arr[i].spot_stock = [{product_code: data._code, spot: data.spot, stock_num: data.stock_num, conditions: data.conditions, stock_price: Math.round(data.unit_price * data.stock_num)}];
                    }
                  }
                  isExist = true;
                  break;
                }
              }
              if (!isExist) {
                if (data.stock_num){
                  data.spot_stock = [{product_code: data._code, spot: data.spot, stock_num: data.stock_num, conditions: data.conditions, stock_price: Math.round(data.unit_price * data.stock_num)}];
                }
                data.unit_price = '₩ '+ Number(data.unit_price).toLocaleString();
                product_data_arr.push(data);
              }
            }
          });

          this.search_items_for_product_data = product_data_arr;
          this.selected_items_for_product_data = []
        }else{
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(result['failed_info']);
        }

      } catch (error) {
        if (prevURL !== window.location.href) return;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
      mux.Util.hideLoading();
    },
    addItems(){
      let product_code = this.setting_item_data[0].product_code;
      let selected = this.selected_items_for_product_data;
      selected.forEach(data => {
        data.data_type = 'added';
        data.product_code = product_code;
        data.item_code = data._code;
        data.num = 0;
        delete data._code;
      })
      this.setting_item_data.push(...selected);

      selected = [];
    },
    addItemSetting(){
      this.setting_item_data.push(
        {
          "type":"",
          "classification":"",
          "item_code":"",
          "name":"",
          "model":"",
          "spec":"",
          "manufacturer":"",
          "unit_price":"",
          "data_type": "written"
        }
      )
    },
    closEstimateSearch(){
      this.estimate_dialog = false;
    },

    closeUnestimatedMailDialog(){
      this.unestimatedMailDialog = false;
      this.unestimated_steppers = 1;
      this.estimateInfoInputs.forEach(input => {
        input.value = '';
        if(input.type === 'file'){
          input.value.name = '';
        }
      });
    },
    showBomDetail(item){
      item.belong_data.forEach(data =>{
        data.data_type = 'selected'
        data.product_code = item.product_code
      })
      this.setting_item_data = JSON.parse(JSON.stringify(item.belong_data));
      this.dialog_bom_detail = true;
      this.item_setting_product_code = item.product_code
    },
    previousStep(step){
      this.production_steppers = step-1;
    },
    async nextStep(step){
      if(step === 2){
        // 사용가능수량 검색 및 적용
        await this.setPurchaseRequest(step);
      }else if(step === 3){
        // 유효성 검사 및 데이터 정리
        await this.checkPurchaseRequest(step);
      }else{
        this.production_steppers = step+1;
      }
    },
    async setPurchaseRequest(step){
      let bom_data = JSON.parse(JSON.stringify(this.set_bom_list_data));
      let product_code_for_search = [];
      for(let bom=0; bom<bom_data.length; bom++){
        let data = bom_data[bom];
        if(data.product_num < 1){
          mux.Util.showAlert('완제품 수량을 확인해주세요.');
          return;
        }else{
          for(let i=0; i<data.belong_data.length; i++){
            product_code_for_search.push(data.belong_data[i].product_code);
            product_code_for_search.push(data.belong_data[i].item_code);
          }
        }
      }

      console.log(product_code_for_search);

      const set = new Set(product_code_for_search);
      const set_for_search = [...set];
      const prevURL = window.location.href;

      let usable_num_searched = [];

      mux.Util.showLoading();
      for(let i=0; i<set_for_search.length; i++){
        let code = set_for_search[i];
        try {
          let result = await mux.Server.post({
            path: '/api/common_rest_api/',
            params: [
              {
                "product_table.product_code": code,
                "module_table.module_code": code,
                "material_table.material_code": code
              }
            ],
            "script_file_name": "rooting_재고_검색_24_05_07_11_46_16P.json",
            "script_file_path": "data_storage_pion\\json_sql\\stock\\1_재고검색\\재고_검색_24_05_07_11_46_H8D"
          });
          if (prevURL !== window.location.href) return;

          if (typeof result === 'string'){
            result = JSON.parse(result);
          }
          if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){


            result = result['data'].map(a => {
              if (!a.stock_num){
                a.stock_price = 0;
              }else {
                a.stock_price = Math.round(a.unit_price * a.stock_num)
              }
              return a;
            });

            result.forEach(data => {
              if(data.usable_num === null){
                data.usable_num = 0;
              }
              usable_num_searched.push({product_code: data._code, usable_num: data.usable_num});
            })

          } else {
            mux.Util.showAlert(result['failed_info']);
          }
        } catch (error) {
          if (prevURL !== window.location.href) return;
          mux.Util.hideLoading();
          if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
            mux.Util.showAlert(error.response['data']['failed_info'].msg);
          else
            mux.Util.showAlert(error);
        }
      }
      usable_num_searched = usable_num_searched.reduce((prev, now) => {
        if(!prev.some(obj => obj.product_code === now.product_code)){
          prev.push(now);
        }
        return prev;
      }, [])

      bom_data.forEach(bom =>{
        bom.num = bom.product_num;
        bom.usable_num = usable_num_searched.find(x=>x.product_code === bom.product_code).usable_num;
        for(let i=0; i<bom.belong_data.length; i++){
          let belong_data = bom.belong_data[i];
          belong_data.num = belong_data.num * bom.num;
          belong_data.usable_num = usable_num_searched.find(x=>x.product_code === belong_data.item_code).usable_num;
        }
      })
      console.log(bom_data);

      //필요 수량이 사용 가능 수량보다 클 경우 bom_list_purchase_data에 추가
      bom_data.forEach(data =>{
        for(let bd=0; bd<data.belong_data.length; bd++){
          let belong_data = data.belong_data[bd];
          if(belong_data.usable_num < belong_data.num){
            belong_data.purchase_estimate_check = false;
            belong_data.purchase_estimate_company = '';
            belong_data.purchase_estimate_file_name = '';
            belong_data.purchase_estimate_thumbnail = '';
            belong_data.purchase_num = 0;
            this.bom_list_purchase_data.push(belong_data);
          }
        }
      })
      this.bom_list_data = bom_data;
      this.production_steppers = step+1;
      mux.Util.hideLoading();
    },
    async checkPurchaseRequest(step){

      let confirmation_data = {};
      let member_input = this.purchase_member_info;

      //confirmation_data에 cost_calc_code와 project_code 정보 추가 필요

      // 구매 요청할 내역이 있을 경우
      if(this.bom_list_purchase_data.length > 0){
        //구매 담당자가 설정되었는지 확인
        if(this.select_purchase_manager === ''){
          mux.Util.showAlert('구매 담당자를 선택해주세요.');
          return;
        }else{
          confirmation_data.approval_phase = '요청';
          member_input.forEach(mem => {
            if(mem.type === '확인'){
              confirmation_data.checker = mem.name;
              confirmation_data.checker_id = mem.user_id;
            }else if(mem.type === '승인'){
              confirmation_data.approver = mem.name;
              confirmation_data.approver_id = mem.user_id;
            }
          })
        }

        for(let i=0; i<this.bom_list_purchase_data.length; i++){
          let data = this.bom_list_purchase_data[i];
          if(data.purchase_num === ''){
            data.purchase_num = 0;
          }
          // 미선택 선택, 견적서 첨부, 선주문 첨부 중 하나가 설정되었는지 확인
          if(!data.purchase_estimate_check && data.purchase_estimate_company === '' && !data.belong_data){
            mux.Util.showAlert(data.item_code + '의 견적/주문 항목을 확안해주세요.<br> 미선택, 견적서, 선주문 중 택 1');
            return;
          }

          if(data.belong_data){// 선주문을 선택한 경우
            // 구매 요청 수량을 추가 기입하였는지 확인
            if(data.purchase_num > 0){
              let message = `선주문 사용 수량 ${data.belong_data[0].purchase_set_num}개에
              추가로 ${data.purchase_num}개를 구매 요청 하시겠습니까?
              아니오 선택 시 구매 요청 수량은 0이 됩니다.`

              const confirm = await mux.Util.showConfirm(message, '구매 요청 확인', false, '예', '아니오');
              if (!confirm){
                data.purchase_num = 0;
              }
            }
            // 선주문한 수량이 필요수량-사용가능수량 보다 많은지 확인
            if( data.num - data.usable_num > Number(data.belong_data[0].purchase_set_num) + Number(data.purchase_num)){
              mux.Util.showAlert(
                `필요수량 및 사용 가능 수량 대비
                선주문 사용 수량과 구매 요청 수량이 부족합니다.

                · 필요 수량 : ${data.num}
                · 사용 가능 수량 : ${data.usable_num}
                · 선주문 수량 : ${data.belong_data[0].purchase_num}
                · 선주문 사용 수량 : ${data.belong_data[0].purchase_set_num}
                · 구매 요청 수량 : ${data.purchase_num}`
              );
              return;
            }
          }else{ // 선주문을 선택하지 않은 경우
            // 구매요청 수량이  0 이상인지
            if(data.purchase_num < 1){
              mux.Util.showAlert(data.item_code + '의 구매 요청 수량을 입력해주세요.');
              return;
            }

            // 구매 요청 수량이 필요수량-사용가능수량 보다 많은지 확인
            if (data.num - data.usable_num > Number(data.purchase_num)){
              mux.Util.showAlert(
                  `필요수량 및 사용 가능 수량 대비
                  구매 요청 수량이 부족합니다.

                  · 필요 수량 : ${data.num}
                  · 사용 가능 수량 : ${data.usable_num}
                  · 구매 요청 수량 : ${data.purchase_num}`
                );
              return;
            }
          }
        }
      }
      this.purchase_confirmation_data.push(confirmation_data);
      this.production_steppers = step+1;

    },
    addBomList(item){
      item.product_num = 0;
      this.set_bom_list_data.push(item);
    },
    saveBomDetail(){
      let product_code = this.setting_item_data[0].product_code;
      for(let i=0; i<this.setting_item_data.length; i++){
        if(this.setting_item_data[i].num < 1){
          mux.Util.showAlert('필요 수량을 확인해주세요.');
          return;
        }
      }
      this.set_bom_list_data.forEach(data =>{
        if(data.product_code === product_code){
          data.belong_data = this.setting_item_data;
        }
      })
      this.dialog_bom_detail = false;
    },
    colseBomDetail(){
      this.setting_item_data = [];
      this.search_items_for_product_data = [];
      this.selected_items_for_product_data = [];
      this.productSearchItemInputs.forEach(input => {
        if(input.label !== '종류')
          input.value = '';
      });
      this.dialog_bom_detail=false
    },
    addProductData(item){
      if(item.belong_data){
        item.belong_data.forEach(data => {
          data.purchase_estimate_check = false;
          data.purchase_estimate_company = '';
          data.purchase_estimate_file_name = '';
          data.purchase_estimate_thumbnail = '';
          data.purchase_num = 0;
        })
        this.bom_list_purchase_data = this.bom_list_purchase_data.filter(param => param.product_code != item.product_code);
        this.bom_list_purchase_data.push(...item.belong_data);
      }
    },
    addBelongData(item, idx){
      if(this.bom_list_purchase_data.length === 0){
        item.belong_data[idx].purchase_estimate_check = false;
        item.belong_data[idx].purchase_estimate_company = '';
        item.belong_data[idx].purchase_estimate_file_name = '';
        item.belong_data[idx].purchase_estimate_thumbnail = '';
        item.belong_data[idx].purchase_num = 0;
        this.bom_list_purchase_data.push(item.belong_data[idx]);
      }else{
        let add_data = {};
        for(let i=0; i<this.bom_list_purchase_data.length; i++){
          if(this.bom_list_purchase_data[i].product_code === item.product_code && this.bom_list_purchase_data[i].item_code === item.belong_data[idx].item_code){
            mux.Util.showAlert('이미 추가된 제품입니다.');
            return;
          }else{
            item.belong_data[idx].purchase_estimate_check = false;
            item.belong_data[idx].purchase_estimate_company = '';
            item.belong_data[idx].purchase_estimate_file_name = '';
            item.belong_data[idx].purchase_estimate_thumbnail = '';
            item.belong_data[idx].purchase_num = 0;
            add_data=item.belong_data[idx];
          }
        }
        this.bom_list_purchase_data.push(add_data);
      }
    },

    cancleItem(product_code, item_code){
      if(item_code === false){
        this.bom_list_purchase_data = this.bom_list_purchase_data.filter(param => param.product_code != product_code);
      }else if(product_code === false){
        this.bom_list_purchase_items_data = this.bom_list_purchase_items_data.filter(param => param.item_code != item_code);
      }else{
        this.bom_list_purchase_data.forEach((data, index) => {
          if(data.product_code === product_code && data.item_code === item_code){
            this.bom_list_purchase_data.splice(index, 1);
          }
        })
      }
    },

    deleteItem(table, idx){
      if(table.length === 1){
        mux.Util.showAlert('행이 한 개 이상 존재해야 합니다.');
        return;
      }else{
        table.splice(idx, 1);
      }
    },
    async clickDontSelect(product_code, item_code){
      let bom_data  = this.bom_list_purchase_data;

      for(let i=0; i<bom_data.length; i++){
        if(bom_data[i].product_code === product_code && bom_data[i].item_code === item_code){
          if(bom_data[i].purchase_estimate_company !== ''){
            const confirm = await mux.Util.showConfirm('미선택 체크 시 적용한 견적서는 초기화됩니다.  ', '선택 확인');
              if (!confirm){
                return;
              }
            bom_data[i].purchase_estimate_company = '';
            bom_data[i].purchase_estimate_file_name = '';
            bom_data[i].purchase_estimate_thumbnail = '';
          }
          if(bom_data[i].belong_data){
            const confirm = await mux.Util.showConfirm('미선택 체크 시 적용한 선택한 선주문 내역은 초기화됩니다.  ', '선택 확인');
              if (!confirm){
                bom_data[i].purchase_estimate_check = false;
                return;
              }
            delete bom_data[i].belong_data;
          }
        }

      }
      this.selected_unestimated_data = []
    },
    async estimateDialog(item){
      let bom_data = this.bom_list_purchase_data;

      this.bom_list_need_estiamte_data = [];
      this.selected_unestimated_data = [];

      for(let i=0; i<bom_data.length; i++){
        if(bom_data[i].product_code === item.product_code && bom_data[i].item_code === item.item_code){
          if(bom_data[i].purchase_estimate_check){
            const confirm = mux.Util.showAlert('미선택이 체크되어 있습니다. <br> 체크 해제 후 출하 선택이 가능합니다.', '선택 확인');
            if (!confirm){
              return;
            }
            return;
          }
          if(bom_data[i].belong_data){
            const confirm = await mux.Util.showConfirm('견적서를 설정하려면 선택한 선주문 내역은 초기화됩니다.  ', '선택 확인');
              if (!confirm){
                return;
              }
            delete bom_data[i].belong_data;
          }
          this.unestimatedMailDialog = true;
          this.selected_unestimated_data.push(item);
          this.bom_list_need_estiamte_data.push(item);
        }else{
          if(!bom_data[i].purchase_estimate_check && !bom_data[i].belong_data){
            this.bom_list_need_estiamte_data.push(bom_data[i]);
          }
        }
      }
    },
    async searchPreOdered(type, item){
      let headers = this.purchase_detail_headers
      let index = headers.findIndex(e => e.text === '선택');

      if(type === 'search'){
        if(index !== -1){
          headers.splice(index, 1);
        }
      }else{
        let item_code = item.item_code;
        let product_code = item.product_code;
        this.pre_ordered_product_code = product_code;

        if(item.purchase_estimate_check){
          const confirm = mux.Util.showAlert('미선택이 체크되어 있습니다. <br> 체크 해제 후 선주문 선택이 가능합니다.', '선택 확인');
          if (!confirm){
            return;
          }
          return;
        }else{
          if(index === -1){
            headers.unshift({ "text": "선택", "align": "start", "value": "select_purchase"});
          }
          this.searchPurchaseInputs.find(x=>x.label === '관리코드').value = item_code;
        }

        if(item.purchase_estimate_company !== ''){
          const confirm = await mux.Util.showConfirm('선주문 내역을 선택하려면 적용한 견적서는 초기화됩니다.  ', '선택 확인');
          if (!confirm){
            return;
          }
          item.purchase_estimate_company = '';
          item.purchase_estimate_file_name = '';
          item.purchase_estimate_thumbnail = '';
          this.searchPurchaseInputs.find(x=>x.label === '관리코드').value = item_code;
        }
      }

      await this.searchPurchaseData();
      this.pre_ordered_dialog = true;
    },
    selectPurchase(item){
      if(this.pre_order_set_num < 1){
        mux.Util.showAlert('사용할 수량을 입력해주세요.');
        return;
      }else if(this.pre_order_set_num > item.purchase_num){
        mux.Util.showAlert('사용할 수량이 선주문 수량보다 많습니다.');
        return;
      }else{
        item.purchase_set_num = Number(this.pre_order_set_num);
      }
      this.bom_list_purchase_data.forEach(data => {
        if(data.product_code === this.pre_ordered_product_code && data.item_code === item.item_code){
          data.belong_data = [];
          data.belong_data.push(item);
        }
      })
      this.closePreOrderDialog();
    },
    closePreOrderDialog(){
      this.searchPurchaseInputs.forEach(data => {
        data.value = '';
      })
      this.purchase_detail_data = [];
      this.pre_ordered_dialog = false
      this.pre_order_set_num = 0;
    },
    async searchPurchaseData(){
      mux.Util.showLoading();
      let searchCompany = this.searchPurchaseInputs.find(x=>x.label === '구매 업체명').value;
        if (searchCompany)
        searchCompany = searchCompany.trim();
      let searchItemCode = this.searchPurchaseInputs.find(x=>x.label === '관리코드').value;
      if (searchItemCode)
      searchItemCode = searchItemCode.trim();
      let searchItemName = this.searchPurchaseInputs.find(x=>x.label === '제품명').value;
      if (searchItemName)
      searchItemName = searchItemName.trim();

      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "purchase_product_table.name": searchItemName ? searchItemName : "",
              "purchase_product_table.item_code": searchItemCode ? searchItemCode : "",
              "purchase_product_table.purchase_estimate_company": searchCompany ? searchCompany : ""
            }
          ],
          "script_file_name": "rooting_구매요청_검색_24_08_08_11_45_79G.json",
          "script_file_path": "data_storage_pion\\json_sql\\purchase\\구매요청_검색_24_08_08_11_45_QAW"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

          if(result.length === 0){
            mux.Util.showAlert('검색 결과가 없습니다.');
          }
          let searched_data = result.data.filter(data => data.cost_calc_code === '' || data.cost_calc_code === null);

          let set_purchase_data = [];
          searched_data.forEach(data =>{
            for(let i=0; i<data.belong_data.length; i++){
              let belong_data = data.belong_data[i];
              if(belong_data.purchase_estimate_phase === '미요청'){
                belong_data.purchase_estimate_company = '*견적서 미요청';
              }
              Object.assign(belong_data, data);
              delete belong_data.belong_data
              set_purchase_data.push(belong_data);
            }
          })
          console.log(set_purchase_data);
          this.purchase_detail_data = set_purchase_data;
        } else {
          mux.Util.showAlert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.hideLoading();
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
      mux.Util.hideLoading();
    },
    async savePurchaseEstimate(){
      let selected_data = this.selected_unestimated_data;
      let estimate_info = this.estimateInfoInputs;
      let product_data = this.bom_list_purchase_data;


      const validate = this.$refs.estimateForm[0].validate();
      if(validate){
        let estimate_company = estimate_info.find(x=>x.column_name === 'purchase_estimate_company').value
        let estimate_file_value = estimate_info.find(x=>x.column_name === 'purchase_estimate_file').value;
        let estimate_file_name = estimate_file_value.name;
        const getPdfThumbnail = await mux.Util.getPdfThumbnail(estimate_file_value, 1, false);
        let estimate_file_thumbnail = mux.Util.uint8ArrayToHexString(getPdfThumbnail);
        let estimate_thumbnail_img = mux.Util.imageBinary(estimate_file_thumbnail);

        selected_data.forEach(selected => {
          for(let i=0; i<product_data.length; i++){
            if(selected.item_code === product_data[i].item_code){
              product_data[i].purchase_estimate_company = estimate_company;
              product_data[i].purchase_estimate_file_value = estimate_file_value;
              product_data[i].purchase_estimate_file_name = estimate_file_name;
              product_data[i].purchase_estimate_thumbnail = estimate_file_thumbnail;
              product_data[i].purchase_estimate_thumbnail_img = estimate_thumbnail_img;
            }
          }
        })
        product_data.push();
        this.closeUnestimatedMailDialog()
      }
    },
    async saveData(){
      // BOM LIST
      this.saveBomListData();

      // 구매 요청
      this.savePurchaseData();

    },
    saveBomListData(){
      // BOM LIST(design_cost_calc_detail_table) : bom_list_data
      let sendData = {};
      let bom_insert = [];
      this.bom_list_data.forEach(data => {
        for(let i=0; i<data.belong_data.length; i++){
          bom_insert.push({
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "creater"
            },
            "data": {
              "cost_calc_code": "",
              "product_classification": data.classification,
              "product_code": data.product_code,
              "product_name": data.name,
              "product_model": data.model,
              "product_spec": data.spec,
              "manufacturer": data.manufacturer,
              "product_num": data.num,
              "item_type": data.belong_data[i].type,
              "item_classification": data.belong_data[i].classification,
              "item_code": data.belong_data[i].item_code,
              "item_name": data.belong_data[i].name,
              "item_model": data.belong_data[i].model,
              "item_spec": data.belong_data[i].spec,
              "item_manufacturer": data.belong_data[i].manufacturer,
              "item_unit_price": data.belong_data[i].unit_price,
              "item_num": data.belong_data[i].num
            },
            "select_where": {"cost_calc_code": "", "product_code": data.product_code, "item_code": data.belong_data[i].item_code},
            "rollback": "yes"
          })
        }
      })
      sendData['design_cost_calc_detail_table'] = bom_insert;
      console.log("sendData BOM : ", sendData);
    },
    savePurchaseData(){
      // DB의 purchase_confirmation_table = purchase_confirmation_data
      // DB의 purchase_product_table = bom_list_purchase_data
      const currDate = new Date();
      let sendData = {};
      let purchase_confirmation_insert = [];
      let purchase_product_insert = [];
      let purchase_confirmation_update = [];
      let purchase_product_update = [];
      let purchase_code = 'PEPR_' + mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss.fff') + '-' + this.$cookies.get(this.$configJson.cookies.id.key);

      this.bom_list_purchase_data.forEach(data => {
        if(data.belong_data){ //선주문일 경우
          let belong_data = data.belong_data[0];
          // 선주문 수량과 선주문 사용 수량이 동일할 경우 기존 선주문 데이터의 project_code, cost_calc_code, note만 update
          if(belong_data.purchase_num === belong_data.purchase_set_num){
            purchase_confirmation_update.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "modifier"
              },
              "data":{
                "project_code": "",
                "cost_calc_code": "",
                "note": belong_data.note + ' :: 프로젝트 코드와 연결 완료(' + belong_data.purchase_set_num + '개)'
              },
              "update_where": {"id": belong_data.id },
              "rollback": "yes"
            })
          }else{// 다를 경우 기존 선주문 데이터의 선주문 수량 update 및 구매 요청에 데이터 복사 & 선주문 사용 수량 설정
            purchase_confirmation_insert.push({
              "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data":{
                  "code" : belong_data.code +'-'+ mux.Date.format(currDate, 'yyyyMMdd HH:mm:ss'),
                  "cost_calc_code" : data.cost_calc_code ,
                  "project_code" : data.project_code ,
                  "approval_phase": belong_data.approval_phase,
                  "checker" : belong_data.checker,
                  "checker_id" : belong_data.checker_id,
                  "checked_date" : belong_data.checked_date,
                  "approver" : belong_data.approver,
                  "approver_id" : belong_data.approver_id
                },
                "select_where": {"code": belong_data.code +'-'+ mux.Date.format(currDate, 'yyyyMMdd HH:mm:ss')},
                "rollback": "yes"
            })

            purchase_product_update.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "modifier"
              },
              "data":{
                "purchase_num": belong_data.purchase_num - belong_data.purchase_set_num,
              },
              "update_where": {"code": belong_data.code, "product_code": belong_data.product_code, "item_code": belong_data.item_code },
              "rollback": "yes"
            })
            purchase_product_insert.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "code" : belong_data.code +'-'+ mux.Date.format(currDate, 'yyyyMMdd HH:mm:ss'),
                "type" : belong_data.type,
                "classification" : belong_data.classification,
                "product_code" : belong_data.product_code,
                "item_code" : belong_data.item_code,
                "name" : belong_data.name,
                "model" : belong_data.model,
                "spec" : belong_data.spec,
                "manufacturer" : belong_data.manufacturer,
                "unit_price" : belong_data.unit_price,
                "purchase_num" : belong_data.purchase_set_num,
                "purchase_estimate_phase" : belong_data.purchase_estimate_company === '' ? '미요청' : '완료',
                "purchase_estimate_company" : belong_data.purchase_estimate_company,
                "purchase_estimate_file" : belong_data.purchase_estimate_file_name,
                "purchase_estimate_thumbnail" : belong_data.purchase_estimate_thumbnail,
              },
              "select_where": {"code": belong_data.code +'-'+ mux.Date.format(currDate, 'yyyyMMdd HH:mm:ss'), "product_code": data.product_code, "item_code": data.item_code},
              "rollback": "yes"
            })
          }

          // 선주문을 연결했지만 구매 요청 수량을 입력하여 추가 구매 요청을 하는 경우
          if(data.purchase_num > 0){
            purchase_confirmation_insert.push({
              "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data":{
                  "code" : purchase_code,
                  "cost_calc_code" : data.cost_calc_code ,
                  "project_code" : data.project_code ,
                  "approval_phase": data.approval_phase,
                  "checker" : data.checker,
                  "checker_id" : data.checker_id,
                  "checked_date" : mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss'),
                  "approver" : data.approver,
                  "approver_id" : data.approver_id
                },
                "select_where": {"code": purchase_code},
                "rollback": "yes"
            })
            purchase_product_insert.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "code" : purchase_code,
                "type" : data.type,
                "classification" : data.classification,
                "product_code" : data.product_code,
                "item_code" : data.item_code,
                "name" : data.name,
                "model" : data.model,
                "spec" : data.spec,
                "manufacturer" : data.manufacturer,
                "unit_price" : data.unit_price,
                "purchase_num" : data.purchase_num,
                "purchase_estimate_phase" : data.purchase_estimate_company === '' ? '미요청' : '완료',
                "purchase_estimate_company" : data.purchase_estimate_company,
                "purchase_estimate_file" : data.purchase_estimate_file_name,
                "purchase_estimate_thumbnail" : data.purchase_estimate_thumbnail,
              },
              "select_where": {"code": purchase_code, "product_code": data.product_code, "item_code": data.item_code},
              "rollback": "yes"
            })
          }
        }else{ // 미선택 혹은 견적서 첨부일 경우
          this.purchase_confirmation_data.forEach(data => {
            purchase_confirmation_insert.push({
              "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data":{
                  "code" : purchase_code,
                  "cost_calc_code" : data.cost_calc_code ,
                  "project_code" : data.project_code ,
                  "approval_phase": data.approval_phase,
                  "checker" : data.checker,
                  "checker_id" : data.checker_id,
                  "checked_date" : mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss'),
                  "approver" : data.approver,
                  "approver_id" : data.approver_id
                },
                "select_where": {"code": purchase_code},
                "rollback": "yes"
            })
          })

          purchase_product_insert.push({
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "creater"
          },
          "data":{
            "code" : purchase_code,
            "type" : data.type,
            "classification" : data.classification,
            "product_code" : data.product_code,
            "item_code" : data.item_code,
            "name" : data.name,
            "model" : data.model,
            "spec" : data.spec,
            "manufacturer" : data.manufacturer,
            "unit_price" : data.unit_price,
            "purchase_num" : data.purchase_num,
            "purchase_estimate_phase" : data.purchase_estimate_company === '' ? '미요청' : '완료',
            "purchase_estimate_company" : data.purchase_estimate_company,
            "purchase_estimate_file" : data.purchase_estimate_file_name,
            "purchase_estimate_thumbnail" : data.purchase_estimate_thumbnail,
          },
          "select_where": {"code": purchase_code, "product_code": data.product_code, "item_code": data.item_code},
          "rollback": "yes"
        })
        }
      })

      sendData["purchase_confirmation_table-insert"] = purchase_confirmation_insert;
      sendData["purchase_confirmation_table-update"] = purchase_confirmation_update;
      sendData["purchase_product_table-insert"] = purchase_product_insert;
      sendData["purchase_product_table-update"] = purchase_product_update;

      console.log("sendData 구매 : ", sendData);
    }
  },
  data(){
    return{
      purchasers: [],
      select_purchase_manager: '',
      pre_ordered_product_code: '',
      production_steppers: 1,
      production_step: 4,
      unestimated_steppers: 1,
      unestimated_step: 2,
      pre_order_set_num: 0,

      estimate_dialog: false,
      edit_survey_cost_num_disabled: true,
      edit_buttons_show: true,
      editable_bom_list: false,

      tab_main: null,
      tab_search: null,
      tab_main_items: DesignProductionPageConfig.tab_main_items,
      dialog_search_product: false,
      dialog_bom_detail: false,
      dialog_calculate_labor: false,
      dialog_edit_purchase_requested: false,
      blueprint_inputs_show: false,
      bom_product_search: false,
      pre_ordered_dialog: false,
      unestimatedMailDialog: false,
      show_selected_unestimated_data: false,
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
      set_bom_list_headers: DesignProductionPageConfig.set_bom_list_headers,
      search_product_headers: DesignProductionPageConfig.search_product_headers,
      construction_materials_headers: DesignProductionPageConfig.construction_materials_headers,
      purchase_detail_headers: DesignProductionPageConfig.purchase_detail_headers,
      purchase_requested_headers: DesignProductionPageConfig.purchase_requested_headers,
      bom_list_headers: DesignProductionPageConfig.bom_list_headers,
      bom_list_purchase_headers: DesignProductionPageConfig.bom_list_purchase_headers,

      searched_product_data: [],
      purchase_confirmation_data: [],
      search_items_for_product_data: [],
      set_bom_list_data: DesignProductionPageConfig.set_bom_list_test_data,
      product_search_item_headers: DesignProductionPageConfig.product_search_item_headers,
      product_item_setting_headers: DesignProductionPageConfig.product_item_setting_headers,
      setting_item_data: [],
      purchase_detail_data: [],
      bom_list_data: [],
      bom_list_purchase_data: [],
      selected_unestimated_data:[],
      bom_list_need_estiamte_data:[],

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
      selected_unestimated_headers: DesignProductionPageConfig.selected_unestimated_headers,
      estimateInfoInputs:DesignProductionPageConfig.estimateInfoInputs,
      search_production_data: [],
      purchase_member_info:DesignProductionPageConfig.purchase_member_info,
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
