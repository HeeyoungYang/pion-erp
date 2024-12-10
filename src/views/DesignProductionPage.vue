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
                        :items="search_estimate_data"
                        item-key="estimate_code"
                        @clickTr="clickSearchedTr"
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
                <!-- 수주 확인서 -->
                <v-tab-item>
                  <v-card >
                    <div style="text-align: right;margin-bottom:10px">
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
                            @click="item.click === 'print' ? estimatePrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data')
                                    : item.click === 'pdf' ? estimatePrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data', '수주확인서') : ''"
                          >
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                    <div ref="calcCostCard">
                      <div
                        class="estimate_top"
                      >
                        <p>수주 확인서</p>
                        <img
                          alt="Pionelectric Logo"
                          class="float-right"
                          contain
                          src="../assets/img/pion_logo.png"
                          transition="scale-transition"
                          width="140"
                        />
                      </div>

                      <div class="estimate_content">
                        <div style="width:40%; float:left;">
                          <table style="border-spacing: 0px; width: 100%; margin-bottom:10px">
                            <tr>
                              <td  style="border-bottom:2px solid #b4b4b4; font-size: 15px; padding: 0px 10px 5px 10px;" >
                                <p style="font-weight:bold;display: inline-block; float: left; margin-bottom: 0px;">{{ clickedProductCost.company_name ? clickedProductCost.company_name : '' }}</p>
                                <p style="display: inline-block; float:right; margin-bottom:0px">귀하</p>
                              </td>
                            </tr>
                          </table>
                          <table style=" border-spacing: 0px; width: 100%;">
                            <tr>
                              <td class="estimate_info estimate_title" style="border-bottom: 0px;border-left:thin solid rgba(0, 0, 0, 0.12)">
                                <span style="display: block;margin-top:-2px">
                                  발행일
                                </span>
                              </td>
                              <td class="estimate_info" style="border-bottom: 0px;">
                                <span style="display: block;margin-top:-2px">
                                  {{ clickedProductCost.issue_date ? mux.Date.format(clickedProductCost.issue_date, 'yyyy-MM-dd') : '' }}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title" style="border-bottom: 0px;border-left:thin solid rgba(0, 0, 0, 0.12)">
                                <span style="display: block;margin-top:-2px">
                                  {{ clickedProductCost.obtain_type === '용역' ? '용역명' : '프로젝트명' }}
                                </span>
                              </td>
                              <td class="estimate_info" style="border-bottom: 0px;">
                                <span style="display: block;margin-top:-2px">
                                  {{ clickedProductCost.service_name ? clickedProductCost.service_name : '' }}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title" style="border-bottom: 0px;border-left:thin solid rgba(0, 0, 0, 0.12)">
                                <span style="display: block;margin-top:-2px">
                                  {{ clickedProductCost.obtain_type === '용역' ? '용역기간' : '프로젝트기간' }}
                                </span>
                              </td>
                              <td class="estimate_info" style="border-bottom: 0px;">
                                <span style="display: block;margin-top:-2px">
                                  {{ clickedProductCost.service_period ? clickedProductCost.service_period : '' }}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title" style="border-left:thin solid rgba(0, 0, 0, 0.12)">
                                <span style="display: block;margin-top:-2px">
                                  유효기간
                                </span>
                              </td>
                              <td class="estimate_info">
                                <span style="display: block;margin-top:-2px">
                                  발행일로부터 30일 이내
                                </span>
                              </td>
                            </tr>
                          </table>
                        </div>
                        <div style="width:50%; position:relative; float:right;">
                          <v-img
                            alt="직인"
                            contain
                            src="../assets/img/pion_stamp.png"
                            transition="scale-transition"
                            width="40"
                            style="position: absolute; right:10px; top:25px"
                          />
                          <table style=" border-spacing: 0px; width: 100%;">
                            <tr>
                              <td class="estimate_info estimate_title" style="border-bottom: 0px;border-left:thin solid rgba(0, 0, 0, 0.12)">
                                <span style="display: block;margin-top:-2px">
                                  등록번호
                                </span>
                              </td>
                              <td colspan="3" class="estimate_info" style="border-bottom: 0px;">
                                <span style="display: block;margin-top:-2px">
                                  851 - 86 - 00038
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title" style="border-bottom: 0px;border-left:thin solid rgba(0, 0, 0, 0.12)">
                                <span style="display: block;margin-top:-2px">
                                  상호
                                </span>
                              </td>
                              <td class="estimate_info" style="border-bottom: 0px;">
                                <span style="display: block;margin-top:-2px">
                                  파이온일렉트릭(주)
                                </span>
                              </td>
                              <td class="estimate_info estimate_title" style="border-bottom: 0px;">
                                <span style="display: block;margin-top:-2px">
                                  대표자
                                </span>
                              </td>
                              <td class="estimate_info" style="border-bottom: 0px;">
                                <span style="display: block;margin-top:-2px">
                                  윤광희
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title" style="border-bottom: 0px;border-left:thin solid rgba(0, 0, 0, 0.12)">
                                <span style="display: block;margin-top:-2px">
                                  주소
                                </span>
                              </td>
                              <td colspan="3" class="estimate_info" style="border-bottom: 0px;">
                                <span style="display: block;margin-top:-2px">
                                  서울특별시 서대문구 연세로 50, 116호 (연세대학교 공학원)
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title" style="border-bottom: 0px;border-left:thin solid rgba(0, 0, 0, 0.12)">
                                <span style="display: block;margin-top:-2px">
                                  업태
                                </span>
                              </td>
                              <td class="estimate_info" style="border-bottom: 0px;">
                                <span style="display: block;margin-top:-2px">
                                  제조업
                                </span>
                              </td>
                              <td class="estimate_info estimate_title" style="border-bottom: 0px;">
                                <span style="display: block;margin-top:-2px">
                                  종목
                                </span>
                              </td>
                              <td class="estimate_info" style="border-bottom: 0px;">
                                <span style="display: block;margin-top:-2px">
                                  전력전자기기
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title" style="border-bottom: 0px;border-left:thin solid rgba(0, 0, 0, 0.12)">
                                <span style="display: block;margin-top:-2px">
                                  대표전화
                                </span>
                              </td>
                              <td class="estimate_info" style="border-bottom: 0px;">
                                <span style="display: block;margin-top:-2px">
                                  070-5096-4179
                                </span>
                              </td>
                              <td class="estimate_info estimate_title" style="border-bottom: 0px;">
                                <span style="display: block;margin-top:-2px">
                                  팩스
                                </span>
                              </td>
                              <td class="estimate_info" style="border-bottom: 0px;">
                                <span style="display: block;margin-top:-2px">
                                  0505-300-4179
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title" style="border-left:thin solid rgba(0, 0, 0, 0.12)">
                                <span style="display: block;margin-top:-2px">
                                  담당자
                                </span>
                              </td>
                              <td class="estimate_info" >
                                <span style="display: block;margin-top:-2px">
                                  {{ clickedProductCost.given_name ? clickedProductCost.given_name : '' }}
                                </span>
                              </td>
                              <td class="estimate_info estimate_title" >
                                <span style="display: block;margin-top:-2px">
                                  연락처
                                </span>
                              </td>
                              <td class="estimate_info">
                                <span style="display: block;margin-top:-2px">
                                  {{ clickedProductCost.office_phone_number ? clickedProductCost.office_phone_number : '' }}
                                </span>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                      <div class="estimate_content" style="margin-top:10px">
                        <div>
                          <p style=" font-size: 11px;margin-top:5px;font-weight:bold;margin-bottom:0px">하기와 같이 견적 드립니다.</p>
                          <table style=" border-spacing: 0px; width: 100%; margin: 5px 0px 15px">
                            <tr>
                              <td class="estimate_price_info estimate_price_title" style="width: 94px;">
                                <span class="mt-1" style="display:block; margin-top:-2px;">
                                  일금
                                </span>
                              </td>
                              <td class="estimate_price_info">
                                <span class="mt-1" style="font-weight:bold; display:block; margin-top:-2px;float:left">{{ !total_cost || isNaN(total_cost) ? '' : mux.Number.toKorean(total_cost, ' 원정') }} </span>
                                <span class="mt-1" style="display:block; margin-top:-2px;float:left">{{ !total_cost || isNaN(total_cost) ? '' : `(￦ ${mux.Number.withComma(total_cost)})` }}</span>
                                <span class="mt-2" style="font-size:11px; padding-left:30px;display:block; margin-top:3px;float:left">* 부가가치세(VAT) 별도</span></td>
                            </tr>
                          </table>
                        </div>
                        <CostTableComponent
                          :headers="survey_cost_headers"
                          :items="calc_cost_detail_data"
                          item-key="product_code"
                          :childTrStyle="'background-color:#efefef'"
                          prevent-editable
                          prevent-button
                          hide-children
                          :show-childs-parent-index-arr="[0]"
                          :show-grand-childs-parent-index-arr="[0, 1]"
                          class="cost_table_border"
                        />
                      </div>
                    </div>
                  </v-card>
                </v-tab-item>

                <!-- 설계 정보 -->
                <v-tab-item>
                  <v-card>
                    <v-card-title>
                      <v-row>
                        <v-col cols="12" sm="6">
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
                            @click="!edit_estimate_info_disabled ? selectMemberDialog(i) : ''"
                          >
                            {{ member.type }} : {{ member.name }}
                          </v-chip>
                        </v-col>

                        <v-col v-show="edit_buttons_show" cols="12" sm="6">
                          <v-btn
                            v-show="!edit_estimate_info_disabled"
                            color="error"
                            fab
                            x-small
                            class="float-right dont_print"
                            elevation="0"
                            data-html2canvas-ignore="true"
                            @click="edit_estimate_info_disabled = true; during_edit = false"
                          >
                            <v-icon
                              small
                            >mdi-undo-variant</v-icon>
                          </v-btn>
                          <v-btn
                            v-if="clickedProductCost.creater && clickedProductCost.creater === $cookies.get($configJson.cookies.id.key)
                              && (!clickedProductCost.approved_date || clickedProductCost.rejected_date)
                              && clickedProductCost.is_last_design_confirmation
                              && edit_estimate_info_disabled && !during_edit"
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right dont_print"
                            elevation="0"
                            data-html2canvas-ignore="true"
                            @click="edit_estimate_info_disabled = false; during_edit = true"
                          >
                            <v-icon
                              small
                            >mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            v-if="!edit_estimate_info_disabled"
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right dont_print"
                            elevation="0"
                            data-html2canvas-ignore="true"
                            @click="estimateInfoEditSave"
                          >
                            <v-icon
                              small
                            >mdi-check</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-title>
                    <v-card-text>
                      <v-form ref="estimateInfoForm">
                        <p class="text-h6 font-weight-bold py-2 px-4" style="background-color: #E3F2FD;" >설계 정보</p>
                        <InputsFormComponent
                            dense
                            clearable
                            :inputs="estimateSearchDefaultInfoInputs"
                          >
                          </InputsFormComponent>
                          <InputsFormComponent
                            dense
                            clearable
                            :inputs="estimateSearchDefaultInfoInputs2"
                          >
                        </InputsFormComponent>

                        <p class="text-h6 font-weight-bold py-2 px-4 mt-12" style="background-color: #E3F2FD;">업체 정보</p>
                        <InputsFormComponent
                          dense
                          clearable
                          :inputs="estimateSearchCompanyInfoInputs"
                        >
                        </InputsFormComponent>

                        <p class="text-h6 font-weight-bold py-2 px-4 mt-12" style="background-color: #E3F2FD;" >상세 도면</p>
                        <v-row
                          v-if="edit_estimate_info_disabled"
                        >
                          <v-col cols="12" sm="4">
                            <p class="font-weight-bold primary--text mb-0">▼ 배치도</p>
                            <!-- <div style="width:100%; background-color: #ccc; min-height:300px"></div> -->
                            <v-img
                                v-if="clickedProductCost.layout_file"
                                alt="thumbnail"
                                class="shrink mr-2"
                                contain
                                :src="mux.Util.imageBinary(clickedProductCost.layout_thumbnail)"
                                transition="scale-transition"
                                width="350"
                                @click="download('design/layout', clickedProductCost.layout_file.replace(clickedProductCost.layout_file.split('_')[0]+'_'+clickedProductCost.layout_file.split('_')[1]+'_', ''), clickedProductCost.layout_file.split('_')[0]+'_'+clickedProductCost.layout_file.split('_')[1]+'_')"
                                style="cursor: pointer;"
                              />
                          </v-col>
                          <v-col cols="12" sm="4">
                            <p class="font-weight-bold primary--text mb-0">▼ 구조도</p>
                            <!-- <div style="width:100%; background-color: #ccc; min-height:300px"></div> -->
                            <v-img
                                v-if="clickedProductCost.structure_file"
                                alt="thumbnail"
                                class="shrink mr-2"
                                contain
                                :src="mux.Util.imageBinary(clickedProductCost.structure_thumbnail)"
                                transition="scale-transition"
                                width="350"
                                @click="download('design/structure', clickedProductCost.structure_file.replace(clickedProductCost.structure_file.split('_')[0]+'_'+clickedProductCost.structure_file.split('_')[1]+'_', ''), clickedProductCost.structure_file.split('_')[0]+'_'+clickedProductCost.structure_file.split('_')[1]+'_')"
                                style="cursor: pointer;"
                              />
                          </v-col>
                          <v-col cols="12" sm="4">
                            <p class="font-weight-bold primary--text mb-0">▼ 단선도</p>
                            <!-- <div style="width:100%; background-color: #ccc; min-height:300px"></div> -->
                            <v-img
                                v-if="clickedProductCost.single_line_file"
                                alt="thumbnail"
                                class="shrink mr-2"
                                contain
                                :src="mux.Util.imageBinary(clickedProductCost.single_line_thumbnail)"
                                transition="scale-transition"
                                width="350"
                                @click="download('design/single_line', clickedProductCost.single_line_file.replace(clickedProductCost.single_line_file.split('_')[0]+'_'+clickedProductCost.single_line_file.split('_')[1]+'_', ''), clickedProductCost.single_line_file.split('_')[0]+'_'+clickedProductCost.single_line_file.split('_')[1]+'_')"
                                style="cursor: pointer;"
                              />
                          </v-col>
                          <v-col cols="12" sm="4">
                            <p class="font-weight-bold primary--text mb-0">▼ 삼선도</p>
                            <!-- <div style="width:100%; background-color: #ccc; min-height:300px"></div> -->
                            <v-img
                                v-if="clickedProductCost.trilinear_file"
                                alt="thumbnail"
                                class="shrink mr-2"
                                contain
                                :src="mux.Util.imageBinary(clickedProductCost.trilinear_thumbnail)"
                                transition="scale-transition"
                                width="350"
                                @click="download('design/trilinear', clickedProductCost.trilinear_file.replace(clickedProductCost.trilinear_file.split('_')[0]+'_'+clickedProductCost.trilinear_file.split('_')[1]+'_', ''), clickedProductCost.trilinear_file.split('_')[0]+'_'+clickedProductCost.trilinear_file.split('_')[1]+'_')"
                                style="cursor: pointer;"
                              />
                          </v-col>
                          <v-col cols="12" sm="4">
                            <p class="font-weight-bold primary--text mb-0">▼ 회로도</p>
                            <!-- <div style="width:100%; background-color: #ccc; min-height:300px"></div> -->
                            <v-img
                                v-if="clickedProductCost.circuit_file"
                                alt="thumbnail"
                                class="shrink mr-2"
                                contain
                                :src="mux.Util.imageBinary(clickedProductCost.circuit_thumbnail)"
                                transition="scale-transition"
                                width="350"
                                @click="download('design/circuit', clickedProductCost.circuit_file.replace(clickedProductCost.circuit_file.split('_')[0]+'_'+clickedProductCost.circuit_file.split('_')[1]+'_', ''), clickedProductCost.circuit_file.split('_')[0]+'_'+clickedProductCost.circuit_file.split('_')[1]+'_')"
                                style="cursor: pointer;"
                              />
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

                        <p class="text-h6 font-weight-bold py-2 px-4 mt-12" style="background-color: #E3F2FD;" >첨부</p>
                        <v-row v-if="edit_estimate_info_disabled">
                          <v-col cols="12" sm="4">
                            <p class="font-weight-bold primary--text mb-0">▼ 승인도서</p>
                            <!-- <div style="width:100%; background-color: #ccc; min-height:300px"></div> -->
                            <v-img
                                v-if="clickedProductCost.approval_file"
                                alt="thumbnail"
                                class="shrink mr-2"
                                contain
                                :src="mux.Util.imageBinary(clickedProductCost.approval_thumbnail)"
                                transition="scale-transition"
                                width="350"
                                @click="download('design/approval', clickedProductCost.approval_file.replace(clickedProductCost.approval_file.split('_')[0]+'_'+clickedProductCost.approval_file.split('_')[1]+'_', ''), clickedProductCost.approval_file.split('_')[0]+'_'+clickedProductCost.approval_file.split('_')[1]+'_')"
                                style="cursor: pointer;"
                              />
                          </v-col>
                          <v-col cols="12" sm="4">
                            <p class="font-weight-bold primary--text mb-0">▼ 제작사양서</p>
                            <!-- <div style="width:100%; background-color: #ccc; min-height:300px"></div> -->
                            <v-img
                                v-if="clickedProductCost.build_sheet_file"
                                alt="thumbnail"
                                class="shrink mr-2"
                                contain
                                :src="mux.Util.imageBinary(clickedProductCost.build_sheet_thumbnail)"
                                transition="scale-transition"
                                width="350"
                                @click="download('design/build_sheet', clickedProductCost.build_sheet_file.replace(clickedProductCost.build_sheet_file.split('_')[0]+'_'+clickedProductCost.build_sheet_file.split('_')[1]+'_', ''), clickedProductCost.build_sheet_file.split('_')[0]+'_'+clickedProductCost.build_sheet_file.split('_')[1]+'_')"
                                style="cursor: pointer;"
                              />
                          </v-col>
                          <v-col cols="12" sm="4">
                            <p class="font-weight-bold primary--text mb-0">▼ 기타</p>
                            <div v-if="clickedProductCost.etc_files">
                                <v-chip
                                  v-for="(file, i) in clickedProductCost.etc_files.split('/')"
                                  :key="i"
                                  color="grey lighten-2"
                                  class="ma-2"
                                  @click="download('design/etc', file.replace(file.split('_')[0]+'_'+file.split('_')[1]+'_', ''), file.split('_')[0]+'_'+file.split('_')[1]+'_')"
                                >
                                  {{ file.replace(file.split('_')[0]+'_'+file.split('_')[1]+'_', '') }}
                                </v-chip>
                              </div>
                          </v-col>
                        </v-row>
                        <v-row
                          v-else
                        >
                          <v-col cols="12">
                            <InputsFormComponent
                              dense
                              clearable
                              :inputs="estimateFilesInputs2"
                            >
                            </InputsFormComponent>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <!-- BOM LIST -->
                <v-tab-item>
                  <v-card>
                    <v-card-text>
                      <v-row>
                        <v-col v-show="edit_buttons_show" cols="12" sm="12">
                          <v-btn
                            v-if="clickedProductCost.creater && clickedProductCost.creater === $cookies.get($configJson.cookies.id.key)
                              && (!clickedProductCost.approved_date || clickedProductCost.rejected_date)
                              && clickedProductCost.is_last_design_confirmation
                              && !editable_bom_list && !during_edit"
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right dont_print"
                            elevation="0"
                            data-html2canvas-ignore="true"
                            @click="editable_bom_list = true; during_edit = true; set_bom_list_data_copy = JSON.parse(JSON.stringify(set_bom_list_data))"
                          >
                            <v-icon
                              small
                            >mdi-pencil</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="12" sm="12" v-if="!editable_bom_list">
                          <DataTableComponent
                            :headers="set_bom_list_headers"
                            :items="set_bom_list_data"
                            item-key="product_code"
                            children-key="belong_data"
                            dense
                            tableClass="elevation-0"
                          />
                        </v-col>
                        <v-col cols="12" sm="12" v-else>
                          <span class="font-weight-black primary--text text-h6 mr-2">완제품 조회</span>
                          <v-btn
                            x-small
                            @click="!bom_product_search ? bom_product_search = true : bom_product_search = false"
                          >
                            {{ !bom_product_search ? '펼치기' : '접기' }}
                          </v-btn>

                          <v-btn
                            v-show="editable_bom_list"
                            color="error"
                            fab
                            x-small
                            class="float-right dont_print"
                            elevation="0"
                            data-html2canvas-ignore="true"
                            @click="editable_bom_list = false; during_edit = false"
                          >
                            <v-icon
                              small
                            >mdi-undo-variant</v-icon>
                          </v-btn>
                          <v-btn
                            v-if="editable_bom_list"
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right dont_print"
                            elevation="0"
                            data-html2canvas-ignore="true"
                            @click="saveEditData"
                          >
                            <v-icon
                              small
                            >mdi-check</v-icon>
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
                                    :disabled="set_bom_list_data_copy.some(data => data.product_code === item.product_code)"
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
                            :items="set_bom_list_data_copy"
                            item-key="product_code"
                            class="elevation-1"
                          >
                            <template v-slot:[`item.actions`]="{ item }">

                              <v-icon
                                @click="showBomDetail(item)"
                              >mdi-magnify</v-icon>
                            </template>
                            <template v-slot:[`item.product_num`] = "{ item, index }">
                              <v-text-field
                                dense
                                hide-details
                                v-model="item.product_num"
                                style="width:100px;font-size: 0.775rem !important;"
                                filled
                                @input="set_bom_list_data_copy.splice(index, 1, item)"
                              ></v-text-field>
                            </template>
                            <template v-slot:[`item.cancle`] = "{ index }">
                              <v-icon
                                color="grey"
                                small
                                @click="deleteItem(set_bom_list_data_copy, index)"
                              >mdi-minus-thick</v-icon>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <!-- 구매 요청 내역 -->
                <v-tab-item>
                  <v-card>
                    <v-card-title>
                      <v-row>
                        <v-col v-show="edit_buttons_show" cols="12" sm="12">
                          <v-btn
                            v-if="clickedProductCost.creater && clickedProductCost.creater === $cookies.get($configJson.cookies.id.key)
                              && (!clickedProductCost.approved_date || clickedProductCost.rejected_date)
                              && clickedProductCost.is_last_design_confirmation
                              && !during_edit"
                            color="primary"
                            fab
                            x-small
                            class="mr-3 float-right dont_print"
                            elevation="0"
                            data-html2canvas-ignore="true"
                            @click="editPurchaseList"
                          >
                            <v-icon
                              small
                            >mdi-pencil</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-title>
                    <v-card-text>
                      <!-- <DataTableComponent
                        :headers="purchase_requested_headers"
                        :items="bom_list_purchase_data"
                        item-key="item_code"
                        dense
                      /> -->
                      <v-data-table
                        :headers="purchase_requested_headers"
                        :items="bom_list_purchase_data"
                        item-key="product_code"
                        dense
                        class="elevation-0"
                      >
                        <template v-slot:item="{ item }">
                          <tr>
                            <td v-for="header in purchase_requested_headers" :key="header.text">
                              {{ header.value == 'estimate' ? '' : item[header.value] }}
                              <v-icon
                                v-if="header.value == 'estimate' && item.purchase_estimate_file"
                                color="primary"
                                small
                                @click="estiamteDialog(item)"
                              >mdi-file</v-icon>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <!-- 산출내역서 -->
                <v-tab-item>
                  <v-card class="pt-9">
                    <div v-show="edit_buttons_show" style="position: absolute; right: 25px; top: 38px;">
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
                        @click="edit_survey_cost_num_disabled = true; during_edit = false"
                      >
                        <v-icon
                          small
                        >mdi-undo-variant</v-icon>
                      </v-btn>
                      <v-btn
                        v-if="clickedProductCost.creater && clickedProductCost.creater === $cookies.get($configJson.cookies.id.key)
                          && (!clickedProductCost.approved_date || clickedProductCost.rejected_date)
                          && clickedProductCost.is_last_design_confirmation
                          && edit_survey_cost_num_disabled && !during_edit"
                        color="primary"
                        fab
                        x-small
                        class="mr-3 float-right dont_print"
                        elevation="0"
                        data-html2canvas-ignore="true"
                        @click="edit_survey_cost_num_disabled = false; during_edit = true"
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
                        @click="clickedProductCost.obtain_type !== '기술료' ? dialog_search_product = true : dialog_payment = true"
                      >
                        공사 자재 수정
                      </v-btn>
                    </div>
                    <div ref="calcDetailCard">
                      <h3 style="font-weight: black; font-size: 23px; margin-bottom:40px">산출내역서</h3>
                      <v-form ref="surveyCostForm">
                        <CostTableComponent
                          :headers="survey_cost_headers"
                          :items="calc_cost_detail_data"
                          item-key="product_code"
                          trStyle="background-color:#efefef; "
                          trClass="font-weight-black cost_table_tr"
                          :cost-num-edit-disabled="edit_survey_cost_num_disabled"
                          class="cost_table_border print_cost_table"
                        >
                        </CostTableComponent>
                      </v-form>
                    </div>
                  </v-card>
                </v-tab-item>

                <!-- 노무비 산출 -->
                <v-tab-item>
                  <v-card class="pt-9">
                    <div v-show="edit_buttons_show" style="position: absolute; right: 25px; top: 38px;">
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
                        v-if="clickedProductCost.creater && clickedProductCost.creater === $cookies.get($configJson.cookies.id.key)
                          && (!clickedProductCost.approved_date || clickedProductCost.rejected_date)
                          && clickedProductCost.is_last_design_confirmation
                          && !during_edit"
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
                    </div>
                    <div ref="printLaborTable">
                      <h3 style="font-weight: black; font-size: 23px; margin-bottom:40px">노무비 산출</h3>
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
                    </div>
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
                        v-for="(member, i) in estimate_member_info2"
                        :key="i"
                        :color="member.name ? 'success' : 'default'"
                        @click="selectMemberDialog(i)"
                      >
                        {{ member.type }} : {{ member.name }}
                      </v-chip>
                        <v-form ref="estimateInfoForm2">
                        <p class="text-h6 font-weight-bold py-2 px-4" style="background-color: #E3F2FD;" >설계 정보</p>
                        <InputsFormComponent
                          dense
                          clearable
                          :inputs="estimateWriteDefaultInfoInputs"
                        >
                        </InputsFormComponent>
                        <InputsFormComponent
                          dense
                          clearable
                          :inputs="estimateWriteDefaultInfoInputs2"
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
                              :inputs="estimateWriteFilesInputs"
                              v-show="blueprint_inputs_show"
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
                          :inputs="estimateWriteFilesInputs2"
                        >

                        </InputsFormComponent>
                      </v-form>
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
                            :items="searched_product_data2"
                            item-key="product_code"
                            class="elevation-1"
                          >
                            <template v-slot:[`item.actions`]="{ item }">
                              <v-btn
                                color="success"
                                x-small
                                class="ml-3"
                                elevation="0"
                                :disabled="set_bom_list_data2.some(data => data.product_code === item.product_code)"
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
                        :items="set_bom_list_data2"
                        item-key="product_code"
                        class="elevation-1"
                      >
                        <template v-slot:[`item.actions`]="{ item }">

                          <v-icon
                            @click="showBomDetail(item)"
                          >mdi-magnify</v-icon>
                        </template>
                        <template v-slot:[`item.product_num`] = "{ item, index }">
                          <v-text-field
                            dense
                            hide-details
                            v-model="item.product_num"
                            style="width:100px;font-size: 0.775rem !important;"
                            filled
                            @input="set_bom_list_data2.splice(index, 1, item)"
                          ></v-text-field>
                        </template>
                        <template v-slot:[`item.cancle`] = "{ index }">
                          <v-icon
                            color="grey"
                            small
                            @click="deleteItem(set_bom_list_data2, index)"
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
                            :items="bom_list_data2"
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
                            v-model="select_purchase_manager2"
                            :items="JSON.parse(JSON.stringify(purchasers))"
                            label="구매 담당자"
                            dense
                            clearable
                            hide-details
                            style="width:200px"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <v-data-table
                            :headers="bom_list_purchase_headers2"
                            :items="bom_list_purchase_data2"
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
                              type="number"
                              dense
                              hide-details
                              v-model="item.purchase_num"
                              style="width:100px;font-size: 0.775rem !important;"
                              filled
                              :oninput="!item.purchase_num ? item.purchase_num = 0 : item.purchase_num = item.purchase_num"
                            ></v-text-field>
                          </template>
                          <template v-slot:[`item.estimate`] = "{ item }">
                            <div  style="max-width: 160px;">
                              <v-checkbox
                                label="미선택"
                                color="primary"
                                hide-details
                                class="float-left mt-0 pt-0"
                                v-model="item.purchase_estimate_check"
                                @click="clickDontSelect(item.product_code, item.item_code)"
                              ></v-checkbox>
                              <v-btn
                                :color="item.purchase_estimate_company === '' ?'grey' : 'primary' "
                                :class="item.purchase_estimate_company === '' ? 'float-right white--text':'float-right'"
                                x-small
                                elevation="0"
                                @click="estimateDialog(item)"
                              >
                                견적서
                              </v-btn>
                              <v-btn
                                :color="!item.belong_data ?'grey' : 'success' "
                                :class="!item.belong_data ? 'float-right white--text':'float-right'"
                                class="float-right"
                                x-small
                                elevation="0"
                                @click="searchPreOdered('select', item)"
                              >
                                선주문
                              </v-btn>
                              <v-menu
                                v-if="item.purchase_estimate_company !== ''"
                                open-on-hover
                                top
                                offset-y
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-chip
                                    v-bind="attrs"
                                    v-on="on"
                                    small
                                    class="primary--text mb-0 float-left"
                                    style="width:100%"
                                  >견적서 : {{ item.purchase_estimate_company }}
                                  </v-chip>
                                </template>

                                <v-list>
                                  <v-list-item>
                                    <v-list-item-content>
                                      <v-img
                                        alt="thumbnail"
                                        class="shrink mr-2"
                                        contain
                                        :src="item.purchase_estimate_thumbnail_img"
                                        transition="scale-transition"
                                        width="600"
                                      />
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-list>
                              </v-menu>
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
                      <h3 style="font-weight: black; font-size: 23px; margin-bottom:10px">산출내역서</h3>
                      <v-form ref="surveyCostForm2">
                        <CostTableComponent
                          :headers="survey_cost_headers"
                          :items="calc_cost_detail_data2"
                          item-key="product_code"
                          trStyle="background-color:#efefef; "
                          trClass="font-weight-black cost_table_tr"
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
              <!-- <v-card style="position: fixed; max-width:920px"> -->
              <v-card>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-btn
                      v-if="production_steppers === 1"
                      color="grey lighten-4"
                      small
                      class="mr-4 float-right"
                      elevation="1"
                      @click="estimate_cost_dialog = true"
                    >
                    생산 의뢰 내역
                    </v-btn>
                  </v-col>
                </v-row>
                <v-card-text>
                  <div
                    class="estimate_top"
                  >
                    <p>수주 확인서</p>
                    <img
                      alt="Pionelectric Logo"
                      class="float-right"
                      contain
                      src="../assets/img/pion_logo.png"
                      transition="scale-transition"
                      width="140"
                    />
                  </div>
                  <div class="estimate_content">
                    <div style="width:40%; float:left;">
                      <table style="border-spacing: 0px; width: 100%; margin-bottom:10px">
                        <tr>
                          <td  style="border-bottom:2px solid #b4b4b4; font-size: 15px; padding: 0px 10px 5px 10px;" >
                            <p style="font-weight:bold;display: inline-block; float: left; margin-bottom: 0px;">{{ estimateWriteCompanyInfoInputs.find(x=>x.label === '업체명').value }}</p>
                            <p style="display: inline-block; float:right; margin-bottom:0px">귀하</p>
                          </td>
                        </tr>
                      </table>
                      <table style=" border-spacing: 0px; width: 100%;">
                        <tr>
                          <td class="estimate_info estimate_title" style="border-bottom: 0px;border-left:thin solid rgba(0, 0, 0, 0.12)">
                            <span style="display: block;margin-top:-2px">
                              발행일
                            </span>
                          </td>
                          <td class="estimate_info" style="border-bottom: 0px;">
                            <span style="display: block;margin-top:-2px">
                              {{ writeIssueDate }}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title" style="border-bottom: 0px;border-left:thin solid rgba(0, 0, 0, 0.12)">
                            <span style="display: block;margin-top:-2px">
                              {{ type_obtain === '용역' ? '용역명' : '프로젝트명' }}
                            </span>
                          </td>
                          <td class="estimate_info" style="border-bottom: 0px;">
                            <span style="display: block;margin-top:-2px">
                              {{ input_service_name2.value }}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title" style="border-bottom: 0px;border-left:thin solid rgba(0, 0, 0, 0.12)">
                            <span style="display: block;margin-top:-2px">
                              {{ type_obtain === '용역' ? '용역기간' : '프로젝트기간' }}
                            </span>
                          </td>
                          <td class="estimate_info" style="border-bottom: 0px;">
                            <span style="display: block;margin-top:-2px">
                              {{ input_service_period2.value }}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title" style="border-left:thin solid rgba(0, 0, 0, 0.12)">
                            <span style="display: block;margin-top:-2px">
                              유효기간
                            </span>
                          </td>
                          <td class="estimate_info">
                            <span style="display: block;margin-top:-2px">
                              발행일로부터 30일 이내
                            </span>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div style="width:50%; position:relative; float:right;">
                      <v-img
                        alt="직인"
                        contain
                        src="../assets/img/pion_stamp.png"
                        transition="scale-transition"
                        width="40"
                        style="position: absolute; right:10px; top:25px"
                      />
                      <table style=" border-spacing: 0px; width: 100%;">
                        <tr>
                          <td class="estimate_info estimate_title" style="border-bottom: 0px;border-left:thin solid rgba(0, 0, 0, 0.12)">
                            <span style="display: block;margin-top:-2px">
                              등록번호
                            </span>
                          </td>
                          <td colspan="3" class="estimate_info" style="border-bottom: 0px;">
                            <span style="display: block;margin-top:-2px">
                              851 - 86 - 00038
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title" style="border-bottom: 0px;border-left:thin solid rgba(0, 0, 0, 0.12)">
                            <span style="display: block;margin-top:-2px">
                              상호
                            </span>
                          </td>
                          <td class="estimate_info" style="border-bottom: 0px;">
                            <span style="display: block;margin-top:-2px">
                              파이온일렉트릭(주)
                            </span>
                          </td>
                          <td class="estimate_info estimate_title" style="border-bottom: 0px;">
                            <span style="display: block;margin-top:-2px">
                              대표자
                            </span>
                          </td>
                          <td class="estimate_info" style="border-bottom: 0px;">
                            <span style="display: block;margin-top:-2px">
                              윤광희
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title" style="border-bottom: 0px;border-left:thin solid rgba(0, 0, 0, 0.12)">
                            <span style="display: block;margin-top:-2px">
                              주소
                            </span>
                          </td>
                          <td colspan="3" class="estimate_info" style="border-bottom: 0px;">
                            <span style="display: block;margin-top:-2px">
                              서울특별시 서대문구 연세로 50, 116호 (연세대학교 공학원)
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title" style="border-bottom: 0px;border-left:thin solid rgba(0, 0, 0, 0.12)">
                            <span style="display: block;margin-top:-2px">
                              업태
                            </span>
                          </td>
                          <td class="estimate_info" style="border-bottom: 0px;">
                            <span style="display: block;margin-top:-2px">
                              제조업
                            </span>
                          </td>
                          <td class="estimate_info estimate_title" style="border-bottom: 0px;">
                            <span style="display: block;margin-top:-2px">
                              종목
                            </span>
                          </td>
                          <td class="estimate_info" style="border-bottom: 0px;">
                            <span style="display: block;margin-top:-2px">
                              전력전자기기
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title" style="border-bottom: 0px;border-left:thin solid rgba(0, 0, 0, 0.12)">
                            <span style="display: block;margin-top:-2px">
                              대표전화
                            </span>
                          </td>
                          <td class="estimate_info" style="border-bottom: 0px;">
                            <span style="display: block;margin-top:-2px">
                              070-5096-4179
                            </span>
                          </td>
                          <td class="estimate_info estimate_title" style="border-bottom: 0px;">
                            <span style="display: block;margin-top:-2px">
                              팩스
                            </span>
                          </td>
                          <td class="estimate_info" style="border-bottom: 0px;">
                            <span style="display: block;margin-top:-2px">
                              0505-300-4179
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title" style="border-left:thin solid rgba(0, 0, 0, 0.12)">
                            <span style="display: block;margin-top:-2px">
                              담당자
                            </span>
                          </td>
                          <td class="estimate_info" >
                            <span style="display: block;margin-top:-2px">
                              {{ $cookies.get($configJson.cookies.name.key).trim() }}
                            </span>
                          </td>
                          <td class="estimate_info estimate_title" >
                            <span style="display: block;margin-top:-2px">
                              연락처
                            </span>
                          </td>
                          <td class="estimate_info">
                            <span style="display: block;margin-top:-2px">
                              {{ $cookies.get($configJson.cookies.office_phone_number.key) }}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                  <div class="estimate_content" style="margin-top:10px">
                    <div>
                      <p style=" font-size: 11px;margin-top:5px;font-weight:bold;margin-bottom:0px">하기와 같이 견적 드립니다.</p>
                      <table style=" border-spacing: 0px; width: 100%; margin: 5px 0px 15px">
                        <tr>
                          <td class="estimate_price_info estimate_price_title" style="width: 94px;">
                            <span class="mt-1" style="display:block; margin-top:-2px;">
                              일금
                            </span>
                          </td>
                          <td class="estimate_price_info">
                            <span class="mt-1" style="font-weight:bold; display:block; margin-top:-2px;float:left">{{ !total_cost2 || isNaN(total_cost2) ? '' : mux.Number.toKorean(total_cost2, ' 원정') }} </span>
                            <span class="mt-1" style="display:block; margin-top:-2px;float:left">{{ !total_cost2 || isNaN(total_cost2) ? '' : `(￦ ${mux.Number.withComma(total_cost2)})` }} </span>
                            <span class="mt-2" style="font-size:11px; padding-left:30px;display:block; margin-top:3px;float:left">* 부가가치세(VAT) 별도</span></td>
                        </tr>
                      </table>
                    </div>
                    <CostTableComponent
                      :headers="survey_cost_headers"
                      :items="calc_cost_detail_data2"
                      item-key="product_code"
                      :childTrStyle="'background-color:#efefef'"
                      prevent-editable
                      prevent-button
                      hide-children
                      :show-childs-parent-index-arr="[0]"
                      :show-grand-childs-parent-index-arr="[0, 1]"
                      class="cost_table_border"
                    />
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
      <!-- 노무비 산출 출력 화면 -->
      <!-- <v-row v-if="print_labor_table" justify="center">
        <v-col
          cols="12"
          sm="11"
        >
          <v-card ref="printLaborTable" style="padding:0px" elevation="0">
            <v-card-title>
            </v-card-title>
            <v-card-text>
              <h3 style="font-weight: black; font-size: 23px; margin-bottom:10px">{{ clickedProductCost.product_name ? clickedProductCost.product_name : '' }} 노무비 산출</h3>
              <v-data-table
                dense
                :headers="labor_cost_headers"
                :items="labor_cost_data"
                hide-default-footer
                disable-pagination
                style="border:thin solid rgba(0, 0, 0, 0.12)"
                class="elevation-1 labor_cost_list no-scroll"
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
        </v-col>
      </v-row> -->
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

            <v-form ref="itemSettingForm">
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
                      <v-autocomplete
                        v-if="item.data_type === 'written'"
                        v-model="item.type"
                        :items="type_list"
                        dense
                        hide-details
                        filled
                        :rules="defaultRules"
                        style="width:150px; font-size:12px">
                      </v-autocomplete>
                      {{ item.data_type !== 'written' ? item.type : '' }}
                    </td>
                    <td class="text-center">
                      <v-autocomplete
                        v-if="item.data_type === 'written'"
                        v-model="item.classification"
                        :items="classification_list.slice(1)"
                        dense
                        hide-details
                        filled
                        :rules="defaultRules"
                        style="width:150px; font-size:12px">
                      </v-autocomplete>
                      {{ item.data_type !== 'written' ? item.classification : '' }}
                    </td>
                    <td align="center">
                      {{ item.item_code }}
                    </td>
                    <td class="text-center">
                      <v-text-field
                        v-if="item.data_type === 'written'"
                        v-model="item.name"
                        dense
                        hide-details
                        filled
                        :rules="defaultRules"
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
                        :rules="defaultRules"
                        style="width:200px; font-size:12px">
                      </v-text-field>
                      {{ item.data_type !== 'written' ? item.spec : '' }}
                    </td>
                    <td class="text-center">
                      <v-autocomplete
                        v-if="item.data_type === 'written'"
                        v-model="item.manufacturer"
                        :items="manufacturer_list"
                        dense
                        hide-details
                        filled
                        :rules="defaultRules"
                        style="width:150px; font-size:12px">
                      </v-autocomplete>
                      {{ item.data_type !== 'written' ? item.manufacturer : '' }}
                    </td>
                    <td class="text-center">
                      <v-text-field
                        v-if="item.data_type === 'written'"
                        v-model="item.unit_price"
                        type="number"
                        dense
                        hide-details
                        filled
                        :rules="defaultRules"
                        style="width:200px; font-size:12px">
                      </v-text-field>
                      {{ item.data_type !== 'written' ? item.unit_price : '' }}
                    </td>
                    <td class="text-center">
                      <v-text-field
                        v-model="item.num"
                        type="number"
                        dense
                        hide-details
                        filled
                        :rules="defaultRules"
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
            </v-form>
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
              class=" float-right mr-2"
              color="default"
              @click="addDatas"
            >
              행 추가
            </v-btn>
          </v-col>
          <v-col cols="12" sm="12">
            <v-data-table
              dense
              :headers="construction_materials_headers"
              :items="tab_main === 0
                            ? calc_cost_detail_data_product_cost.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재')) ? calc_cost_detail_data_product_cost.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재')).belong_data : []
                            : calc_cost_detail_data_product_cost2.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재')) ? calc_cost_detail_data_product_cost2.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재')).belong_data : []"
              hide-default-footer
              disable-pagination
              item-key="construction_materials"
              class="elevation-1"
            >
              <template v-slot:item="{ item, index }">
                <tr>
                  <td align="center">
                    <v-text-field
                      v-model="item.cost_list"
                      dense
                      hide-details
                      filled
                      style="width:200px"
                    >
                    </v-text-field>
                  </td>
                  <td align="center">
                    <v-text-field
                      v-model="item.cost_num"
                      dense
                      hide-details
                      filled
                      type="number"
                      style="width:200px"
                    >
                    </v-text-field>
                  </td>
                  <td align="center">
                    <v-text-field
                      v-model="item.cost_unit_price"
                      dense
                      hide-details
                      filled
                      type="number"
                      style="width:200px"
                    >
                    </v-text-field>
                  </td>
                  <td align="center">
                    {{ item.cost_num * item.cost_unit_price }}
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
              @click="saveEditData"
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
              :items="JSON.parse(JSON.stringify(purchasers))"
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
              :items="bom_list_purchase_data_copy"
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
                type="number"
                dense
                hide-details
                v-model="item.purchase_num"
                style="width:100px;font-size: 0.775rem !important;"
                filled
                :oninput="!item.purchase_num ? item.purchase_num = 0 : item.purchase_num = item.purchase_num"
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
                  class="float-right white--text"
                  x-small
                  elevation="0"
                  @click="estimateDialog(item)"
                >
                  견적서
                </v-btn>
                <v-btn
                  :color="item.code.includes('PRE') ?'success' : 'grey' "
                  class="float-right white--text"
                  x-small
                  elevation="0"
                  @click="searchPreOdered('select', item)"
                >
                  선주문
                </v-btn>
                <v-menu
                  v-if="item.purchase_estimate_company !== ''"
                  open-on-hover
                  top
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      v-bind="attrs"
                      v-on="on"
                      small
                      class="primary--text mb-0 float-left"
                      style="width:100%"
                    >견적서 : {{ item.purchase_estimate_company }}
                    </v-chip>
                  </template>

                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-img
                          alt="thumbnail"
                          class="shrink mr-2"
                          contain
                          :src="mux.Util.imageBinary(item.purchase_estimate_thumbnail)"
                          transition="scale-transition"
                          width="600"
                        />
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
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

    <ObtainCostSearchDialogComponent
      :dialog-value="estimate_cost_dialog"
      :persistent="true"
      @apply="applyEstimateLoad"
      @close="closeCostSearchDialog"
    >
    </ObtainCostSearchDialogComponent>

    <MemberSearchDialogComponent
      :dialog-value="member_dialog2"
      :persistent="true"
      @close="close"
      @setMember = "setMember"
      @members = "members"
    >
    </MemberSearchDialogComponent>

    <ModalDialogComponent
      :dialog-value="estimatedDialog"
      max-width="600px"
      title-class="display-none"
      text-class="pb-0"
      closeText="닫기"
      :persistent="true"
      @close="estimatedDialog = false"
    >
      <CardComponent
        elevation="0"
        text-class="pa-0 pt-4"
        title-class="pa-0 font-weight-black "
      >
        <div slot="cardTitle">
          <span>{{ estimate_company + ' 견적' }}</span>
        </div>
        <div slot="cardText">
          <v-row>
            <v-col cols="12">
              <v-img
                alt="thumbnail"
                class="shrink mr-2"
                contain
                :src="mux.Util.imageBinary(purchaseEstimateThumbnail)"
                transition="scale-transition"
                @click="download('purchase/purchase_estimate', purchaseEstimateFile, purchaseEstimateCode+'_')"
                style="cursor: pointer; width: 100%;"
              />
            </v-col>
          </v-row>
        </div>
      </CardComponent>
    </ModalDialogComponent>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import DataTableComponent from "@/components/DataTableComponent.vue";
import ProductCostPageConfig from "@/configure/ProductCostPageConfig.json";
import DesignProductionPageConfig from "@/configure/DesignProductionPageConfig.json";

import CostTableComponent from "@/components/CostTableComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent";
import MemberSearchDialogComponent from "@/components/MemberSearchDialogComponent";
import ObtainCostSearchDialogComponent from "@/components/ObtainCostSearchDialogComponent";
import mux from "@/mux";

export default {

  mounted() {

  },
  components: {
                NavComponent,
                MemberSearchDialogComponent,
                InputsFormComponent,
                CardComponent,
                DataTableComponent,
                CostTableComponent,
                ModalDialogComponent,
                ObtainCostSearchDialogComponent,
              },

  created () {
    this.initialize()
    this.members()
  },

  watch: {
    clickedProductCost: {
      handler(item){
        if (Object.keys(item).length > 0) {
          this.estimate_member_info[0].name = item.checker;
          this.estimate_member_info[0].user_id = item.checker_id;
          this.estimate_member_info[0].checked_date = item.checked_date;
          this.estimate_member_info[1].name = item.approver;
          this.estimate_member_info[1].user_id = item.approver_id;
          this.estimate_member_info[1].checked_date = item.approved_date;

          this.set_bom_list_data = [];
          this.bom_list_purchase_data = [];
          if (this.searched_datas.product_cost_calc_detail.filter(x=>x.cost_calc_code === item.cost_calc_code).length > 0){
            this.set_bom_list_data = [
                ...this.searched_datas.product_cost_calc_detail.filter(x=>x.cost_calc_code === item.cost_calc_code).map((a) => {
                  a.type = '완제품';
                  a.classification = a.product_classification;
                  // a.product_code = a.product_code;
                  a.name = a.product_name;
                  a.model = a.product_model;
                  a.spec = a.product_spec;
                  // a.manufacturer = a.manufacturer;
                  a.unit_price = a.product_unit_price;
                  a.num = a.product_num;
                  a.belong_data = [
                    ...a.belong_data.map((b) => {
                      b.type = b.module_type;
                      b.classification = b.module_classification;
                      b.item_code = b.module_code;
                      b.product_code = b.item_code;
                      b.name = b.module_name;
                      b.model = b.module_model;
                      b.spec = b.module_spec;
                      b.manufacturer = b.module_manufacturer;
                      b.unit_price = b.module_unit_price;
                      b.num = b.module_num;
                      b.product_num = b.num;
                      b.item_num = b.product_num;
                      b.usable_num = b.module_usable_num;
                      return b;
                    })
                  ];
                  return a;
                })
              ];
          }

          if (this.searched_datas.purchase_detail_data.filter(x=>x.cost_calc_code === item.cost_calc_code).length > 0){
            this.bom_list_purchase_data = [
                ...this.searched_datas.purchase_detail_data.filter(x=>x.cost_calc_code === item.cost_calc_code).map((a) => {
                  let item_num = 0;
                  let usable_num = 0;

                  item_num = Math.round(Number(this.set_bom_list_data.find(x=>x.belong_data.find(y=>y.product_code === a.item_code)).belong_data.find(y=>y.product_code === a.item_code).num) * Number(this.set_bom_list_data.find(x=>x.belong_data.find(y=>y.product_code === a.item_code)).num));
                  usable_num = this.set_bom_list_data.find(x=>x.belong_data.find(y=>y.product_code === a.item_code)).belong_data.find(y=>y.product_code === a.item_code).usable_num;

                  a.num = item_num;
                  a.usable_num = usable_num;

                  a.purchase_estimate_check = a.purchase_estimate_code ? false : ( a.code.includes('PRE') ? false : true);
                  a.purchase_estimate_file = a.purchase_estimate_file ? a.purchase_estimate_file : '';
                  a.purchase_estimate_thumbnail = a.purchase_estimate_thumbnail ? a.purchase_estimate_thumbnail : '';
                  return a;
                })
              ];
          }

          this.labor_cost_data = this.searched_datas.labor_cost_calc_detail.filter(x=>x.cost_calc_code === item.cost_calc_code);
          this.calc_cost_detail_data_product_cost.belong_data = [];
          if (this.searched_datas.product_cost_calc_detail.filter(x=>x.cost_calc_code === item.cost_calc_code).length > 0){
            this.calc_cost_detail_data_product_cost.belong_data.push({
              "cost_list": "가. 재료",
              "cost_list_colspan": 4,
              "belong_data": this.searched_datas.product_cost_calc_detail.filter(x=>x.cost_calc_code === item.cost_calc_code).map((a) => {
                a.cost_list = a.product_name;
                a.cost_list_sub = a.product_spec;
                a.cost_num = a.product_num;
                a.cost_unit_price = a.product_unit_price;
                a.cost_unit = '제품';
                a.cost_num_editable = true;
                a.allow_one_or_greater = true;
                a.cost_unit_price_editable = true;
                a.cost_list_sub_editable = true;
                a.deletable_row = true;
                return a;
              })
            });
          }
          if (this.searched_datas.construction_materials_data.filter(x=>x.cost_calc_code === item.cost_calc_code).length > 0) {
            this.calc_cost_detail_data_product_cost.belong_data.push({
              "cost_list": `${this.calc_cost_detail_data_product_cost.belong_data.length > 0 ? '나' : '가'}. 공사 자재`,
              "cost_list_colspan": 4,
              "belong_data": this.searched_datas.construction_materials_data.filter(x=>x.cost_calc_code === item.cost_calc_code).map((a) => {
                a.cost_list = a.construction_materials;
                a.cost_num = a.construction_materials_num;
                a.cost_unit_price = a.construction_materials_unit_price;
                a.cost_unit = '개';
                a.cost_num_editable = true;
                a.allow_one_or_greater = true;
                a.cost_unit_price_editable = true;
                a.deletable_row = true;
                return a;
              })
            });
          }
          // if (this.searched_datas.technical_fee_data.filter(x=>x.cost_calc_code === item.cost_calc_code).length > 0) {
          //   this.calc_cost_detail_data_product_cost.belong_data = this.searched_datas.technical_fee_data.filter(x=>x.cost_calc_code === item.cost_calc_code).map((a) => {
          //     a.cost_list = a.technical_fee;
          //     a.cost_num = a.technical_fee_num;
          //     a.cost_unit_price = a.technical_fee_unit_price;
          //     a.cost_unit = '건';
          //     a.belong_data = [];
          //     a.cost_num_editable = true;
          //     a.allow_one_or_greater = true;
          //     a.cost_unit_price_editable = true;
          //     a.deletable_row = true;
          //     return a;
          //   });
          // }
          // set num
          this.calc_cost_detail_data_employment_insurance.cost_num = item.employment_insurance_num;
          this.calc_cost_detail_data_tool_rent_fee.cost_num = item.tool_rent_fee_num;
          this.calc_cost_detail_data_transportation_fee.cost_num = item.transportation_fee_num;
          this.calc_cost_detail_data_industrial_accident.cost_num = item.industrial_accident_num;
          this.calc_cost_detail_data_taxes_dues.cost_num = item.taxes_dues_num;
          this.calc_cost_detail_data_welfare_benefits.cost_num = item.welfare_benefits_num;
          this.calc_cost_detail_data_retirement.cost_num = item.retirement_num;
          this.calc_cost_detail_data_expendables.cost_num = item.expendables_num;
          this.calc_cost_detail_data_industrial_safety.cost_num = item.industrial_safety_num;
          this.calc_cost_detail_data_normal_maintenance_fee.cost_num = item.normal_maintenance_fee_num;
          this.calc_cost_detail_data_profite.cost_num = item.profite_num;
          // set formula
          this.calc_cost_detail_data_indirect_labor.belong_data[0].cost_list = ' - ' + item.indirect_labor_formula;
          this.calc_cost_detail_data_employment_insurance.belong_data[0].cost_list = ' - ' + item.employment_insurance_formula;
          this.calc_cost_detail_data_tool_rent_fee.belong_data[0].cost_list = ' - ' + item.tool_rent_fee_formula;
          this.calc_cost_detail_data_transportation_fee.belong_data[0].cost_list = ' - ' + item.transportation_fee_formula;
          this.calc_cost_detail_data_industrial_accident.belong_data[0].cost_list = ' - ' + item.industrial_accident_formula;
          this.calc_cost_detail_data_taxes_dues.belong_data[0].cost_list = ' - ' + item.taxes_dues_formula;
          this.calc_cost_detail_data_welfare_benefits.belong_data[0].cost_list = ' - ' + item.welfare_benefits_formula;
          this.calc_cost_detail_data_retirement.belong_data[0].cost_list = ' - ' + item.retirement_formula;
          this.calc_cost_detail_data_expendables.belong_data[0].cost_list = ' - ' + item.expendables_formula;
          this.calc_cost_detail_data_industrial_safety.belong_data[0].cost_list = ' - ' + item.industrial_safety_formula;
          this.calc_cost_detail_data_normal_maintenance_fee.belong_data[0].cost_list = ' - ' + item.normal_maintenance_fee_formula;
          this.calc_cost_detail_data_profite.belong_data[0].cost_list = ' - ' + item.profite_formula;

          this.input_issue_date.value = item.issue_date;
          this.input_project_code.value = item.project_code;
          this.input_inhouse_bid_number.value = item.inhouse_bid_number;
          this.input_company_bid_number.value = item.company_bid_number;
          this.input_due_date.value = item.due_date;
          this.input_delivery_condition.value = item.delivery_condition;
          this.input_service_name.value = item.service_name;
          this.input_service_period.value = item.service_period;
          this.input_remark.value = item.remark;
          this.input_company_name.value = item.company_name;
          this.input_company_manager.value = item.company_manager;
          this.input_company_manager_email.value = item.company_manager_email;
          this.input_company_manager_phone.value = item.company_manager_phone;

          this.origin_calc_cost_detail_data = JSON.parse(JSON.stringify(this.calc_cost_detail_data));
          this.calc_cost_detail_data = this.origin_calc_cost_detail_data;
        }
      },
      deep: true
    },
    calc_cost_detail_data_product_cost: {
      handler(new_calc_cost_detail_data_product_cost){
        let belongs = new_calc_cost_detail_data_product_cost.belong_data;
        for (let i = belongs.length-1; i >= 0; i--) {
          const belong = belongs[i];
          if (belong.belong_data.length === 0) {
            belongs.splice(i, 1);
          }
        }
        if (belongs.length === 1 && belongs[0].cost_list === '나. 공사 자재') {
          belongs[0].cost_list = '가. 공사 자재';
        }else if (belongs.length === 2 && belongs[1].cost_list === '가. 공사 자재') {
          belongs[1].cost_list = '나. 공사 자재';
        }
      },
      deep: true
    },
    calc_cost_detail_data_product_cost2: {
      handler(new_calc_cost_detail_data_product_cost){
        let belongs = new_calc_cost_detail_data_product_cost.belong_data;
        for (let i = belongs.length-1; i >= 0; i--) {
          const belong = belongs[i];
          if (belong.belong_data.length === 0) {
            belongs.splice(i, 1);
          }
        }
        if (belongs.length === 1 && belongs[0].cost_list === '나. 공사 자재') {
          belongs[0].cost_list = '가. 공사 자재';
        }else if (belongs.length === 2 && belongs[1].cost_list === '가. 공사 자재') {
          belongs[1].cost_list = '나. 공사 자재';
        }
      },
      deep: true
    },
    set_bom_list_data: {
      handler(new_set_bom_list_data){
        let old_set_bom_list_data = this.previous_set_bom_list_data;

        if (new_set_bom_list_data.length === 0){
          let products_group_index = this.calc_cost_detail_data_product_cost.belong_data.findIndex(x => x.cost_list === '가. 재료');
          if (products_group_index > -1) {
            this.calc_cost_detail_data_product_cost.belong_data.splice(products_group_index, 1);
          }
          let constructions_group_index = this.calc_cost_detail_data_product_cost.belong_data.findIndex(x => x.cost_list === '나. 공사 자재');
          if (constructions_group_index > -1) {
            this.calc_cost_detail_data_product_cost.belong_data[constructions_group_index].cost_list = '가. 공사 자재';
          }
        }else {
          let products_group_index = this.calc_cost_detail_data_product_cost.belong_data.findIndex(x => x.cost_list === '가. 재료');
          if (products_group_index === -1) {
            this.calc_cost_detail_data_product_cost.belong_data.unshift({
              "cost_list": "가. 재료",
              "cost_list_colspan": 4,
              "belong_data": []
            });
          }
          this.calc_cost_detail_data_product_cost.belong_data[0].belong_data = JSON.parse(JSON.stringify(new_set_bom_list_data.map((a) => {
            let old_item = old_set_bom_list_data.find(x => x.product_code === a.product_code);
            let unit_price_changed = false;
            if (this.editable_bom_list && old_item){
              if (a.belong_data && a.belong_data.length > 0){
                a.belong_data.forEach((b) => {
                  if (old_item.belong_data && old_item.belong_data.length > 0){
                    let old_belong = old_item.belong_data.find(x => x.item_code === b.item_code);
                    if (old_belong){
                      if (old_belong.num !== b.num){
                        unit_price_changed = true; // 수정 시 BOM LIST 에서 선택된 완제품 내부 자재의 수량이 변경되면 완제품 단가도 맞춰서 계산되어 변경
                        b.cost_num = b.num;
                      }
                    }else {
                      unit_price_changed = true; // 수정 시 BOM LIST 에서 선택된 완제품 내부 자재에 없던 자재가 생기면 완제품 단가도 맞춰서 계산되어 변경
                    }
                  }
                });
              }
              if (old_item.belong_data && old_item.belong_data.length > 0){
                old_item.belong_data.forEach((b) => {
                  if (a.belong_data && a.belong_data.length > 0){
                    let belong = a.belong_data.find(x => x.item_code === b.item_code);
                    if (!belong){
                      unit_price_changed = true; // 수정 시 BOM LIST 에서 선택된 완제품 내부 자재에 있던 자재가 삭제되면 완제품 단가도 맞춰서 계산되어 변경
                    }
                  }
                });
              }
            }

            if (unit_price_changed){
              if (a.belong_data && a.belong_data.length > 0){
                a.cost_unit_price = a.belong_data.reduce((acc, cur) => {
                  if (typeof cur.unit_price !== 'number'){
                    if (cur.unit_price){
                      cur.unit_price = Number(cur.unit_price.replace(/,/g, '').replace('₩ ', '').trim());
                    }else {
                      cur.unit_price = 0;
                    }
                  }
                  if (typeof cur.num !== 'number'){
                    if (cur.num){
                      cur.num = Number(cur.num.replace(/,/g, '').trim());
                    }else {
                      cur.num = 0;
                    }
                  }
                  return acc + cur.unit_price * cur.num;
                }, 0);
              }else {
                a.cost_unit_price = 0;
              }
            }else {
              a.cost_unit_price = typeof a.unit_price === 'number' ? a.unit_price : a.unit_price ? Number(a.unit_price.replace(/,/g, '').replace('₩ ', '').trim()) : 0;
            }

            a.unit_price = a.cost_unit_price;
            a.cost_list = a.name;
            a.cost_list_sub = a.spec;
            a.cost_num = a.product_num;
            a.cost_unit = '제품';
            a.cost_num_editable = false;
            a.allow_one_or_greater = true;
            a.cost_unit_price_editable = true;
            a.cost_list_sub_editable = false;
            a.deletable_row = false;
            return a;
          })));

          let constructions_group_index = this.calc_cost_detail_data_product_cost.belong_data.findIndex(x => x.cost_list === '가. 공사 자재');
          if (constructions_group_index > -1) {
            this.calc_cost_detail_data_product_cost.belong_data[constructions_group_index].cost_list = '나. 공사 자재';
          }
        }
        this.calc_cost_detail_data_product_cost.belong_data.push({
          "cost_list": `${this.calc_cost_detail_data_product_cost.belong_data.length > 0 ? '나' : '가'}. 공사 자재`,
          "cost_list_colspan": 4,
          "belong_data": []
        });

        this.previous_set_bom_list_data = JSON.parse(JSON.stringify(new_set_bom_list_data));
      },
      deep: true
    },
    set_bom_list_data_copy: {
      handler(new_set_bom_list_data){
        let old_set_bom_list_data = this.previous_set_bom_list_data_copy;

        if (new_set_bom_list_data.length !== 0){
          new_set_bom_list_data.forEach((a) => {
            let old_item = old_set_bom_list_data.find(x => x.product_code === a.product_code);
            let unit_price_changed = false;
            if (this.editable_bom_list && old_item){
              if (a.belong_data && a.belong_data.length > 0){
                a.belong_data.forEach((b) => {
                  if (old_item.belong_data && old_item.belong_data.length > 0){
                    let old_belong = old_item.belong_data.find(x => x.item_code === b.item_code);
                    if (old_belong){
                      if (old_belong.num !== b.num){
                        unit_price_changed = true; // 수정 시 BOM LIST 에서 선택된 완제품 내부 자재의 수량이 변경되면 완제품 단가도 맞춰서 계산되어 변경
                        b.cost_num = b.num;
                      }
                    }else {
                      unit_price_changed = true; // 수정 시 BOM LIST 에서 선택된 완제품 내부 자재에 없던 자재가 생기면 완제품 단가도 맞춰서 계산되어 변경
                    }
                  }
                });
              }
              if (old_item.belong_data && old_item.belong_data.length > 0){
                old_item.belong_data.forEach((b) => {
                  if (a.belong_data && a.belong_data.length > 0){
                    let belong = a.belong_data.find(x => x.item_code === b.item_code);
                    if (!belong){
                      unit_price_changed = true; // 수정 시 BOM LIST 에서 선택된 완제품 내부 자재에 있던 자재가 삭제되면 완제품 단가도 맞춰서 계산되어 변경
                    }
                  }
                });
              }
            }

            if (unit_price_changed){
              if (a.belong_data && a.belong_data.length > 0){
                a.cost_unit_price = a.belong_data.reduce((acc, cur) => {
                  if (typeof cur.unit_price !== 'number'){
                    if (cur.unit_price){
                      cur.unit_price = Number(cur.unit_price.replace(/,/g, '').replace('₩ ', '').trim());
                    }else {
                      cur.unit_price = 0;
                    }
                  }
                  if (typeof cur.num !== 'number'){
                    if (cur.num){
                      cur.num = Number(cur.num.replace(/,/g, '').trim());
                    }else {
                      cur.num = 0;
                    }
                  }
                  return acc + cur.unit_price * cur.num;
                }, 0);
              }else {
                a.cost_unit_price = 0;
              }
            }else {
              a.cost_unit_price = typeof a.unit_price === 'number' ? a.unit_price : a.unit_price ? Number(a.unit_price.replace(/,/g, '').replace('₩ ', '').trim()) : 0;
            }

            a.unit_price = a.cost_unit_price;
            a.cost_list = a.name;
            a.cost_list_sub = a.spec;
            a.cost_num = a.product_num;
            a.cost_unit = '제품';
            a.cost_num_editable = false;
            a.allow_one_or_greater = true;
            a.cost_unit_price_editable = true;
            a.cost_list_sub_editable = false;
            a.deletable_row = false;
            return a;
          });
        }

        this.previous_set_bom_list_data_copy = JSON.parse(JSON.stringify(new_set_bom_list_data));
      },
      deep: true
    },
    set_bom_list_data2: {
      handler(new_set_bom_list_data2){
        let old_set_bom_list_data2 = this.previous_set_bom_list_data2;

        if (new_set_bom_list_data2.length === 0){
          let products_group_index = this.calc_cost_detail_data_product_cost2.belong_data.findIndex(x => x.cost_list === '가. 재료');
          if (products_group_index > -1) {
            this.calc_cost_detail_data_product_cost2.belong_data.splice(products_group_index, 1);
          }
          let constructions_group_index = this.calc_cost_detail_data_product_cost2.belong_data.findIndex(x => x.cost_list === '나. 공사 자재');
          if (constructions_group_index > -1) {
            this.calc_cost_detail_data_product_cost2.belong_data[constructions_group_index].cost_list = '가. 공사 자재';
          }
        }else {
          let products_group_index = this.calc_cost_detail_data_product_cost2.belong_data.findIndex(x => x.cost_list === '가. 재료');
          if (products_group_index === -1) {
            this.calc_cost_detail_data_product_cost2.belong_data.unshift({
              "cost_list": "가. 재료",
              "cost_list_colspan": 4,
              "belong_data": []
            });
          }
          this.calc_cost_detail_data_product_cost2.belong_data[0].belong_data = JSON.parse(JSON.stringify(new_set_bom_list_data2.map((a) => {
            let old_item = old_set_bom_list_data2.find(x => x.product_code === a.product_code);
            let unit_price_changed = false;
            if (old_item){
              if (a.belong_data && a.belong_data.length > 0){
                a.belong_data.forEach((b) => {
                  if (old_item.belong_data && old_item.belong_data.length > 0){
                    let old_belong = old_item.belong_data.find(x => x.item_code === b.item_code);
                    if (old_belong){
                      if (old_belong.num !== b.num){
                        unit_price_changed = true; // 작성 시 BOM LIST 에서 선택된 완제품 내부 자재의 수량이 변경되면 완제품 단가도 맞춰서 계산되어 변경
                        b.cost_num = b.num;
                      }
                    }else {
                      unit_price_changed = true; // 작성 시 BOM LIST 에서 선택된 완제품 내부 자재에 없던 자재가 생기면 완제품 단가도 맞춰서 계산되어 변경
                    }
                  }
                });
              }
              if (old_item.belong_data && old_item.belong_data.length > 0){
                old_item.belong_data.forEach((b) => {
                  if (a.belong_data && a.belong_data.length > 0){
                    let belong = a.belong_data.find(x => x.item_code === b.item_code);
                    if (!belong){
                      unit_price_changed = true; // 작성 시 BOM LIST 에서 선택된 완제품 내부 자재에 있던 자재가 삭제되면 완제품 단가도 맞춰서 계산되어 변경
                    }
                  }
                });
              }
            }

            if (unit_price_changed){
              if (a.belong_data && a.belong_data.length > 0){
                a.cost_unit_price = a.belong_data.reduce((acc, cur) => {
                  if (typeof cur.unit_price !== 'number'){
                    if (cur.unit_price){
                      cur.unit_price = Number(cur.unit_price.replace(/,/g, '').replace('₩ ', '').trim());
                    }else {
                      cur.unit_price = 0;
                    }
                  }
                  if (typeof cur.num !== 'number'){
                    if (cur.num){
                      cur.num = Number(cur.num.replace(/,/g, '').trim());
                    }else {
                      cur.num = 0;
                    }
                  }
                  return acc + cur.unit_price * cur.num;
                }, 0);
              }else {
                a.cost_unit_price = 0;
              }
            }else {
              a.cost_unit_price = typeof a.unit_price === 'number' ? a.unit_price : a.unit_price ? Number(a.unit_price.replace(/,/g, '').replace('₩ ', '').trim()) : 0;
            }

            a.unit_price = a.cost_unit_price;
            a.cost_list = a.name;
            a.cost_list_sub = a.spec;
            a.cost_num = a.product_num;
            a.cost_unit = '제품';
            a.cost_num_editable = false;
            a.allow_one_or_greater = true;
            a.cost_unit_price_editable = true;
            a.cost_list_sub_editable = false;
            a.deletable_row = false;
            return a;
          })));
          console.log(this.calc_cost_detail_data_product_cost2.belong_data[0]);
          let constructions_group_index = this.calc_cost_detail_data_product_cost2.belong_data.findIndex(x => x.cost_list === '가. 공사 자재');
          if (constructions_group_index > -1) {
            this.calc_cost_detail_data_product_cost2.belong_data[constructions_group_index].cost_list = '나. 공사 자재';
          }
        }
        this.calc_cost_detail_data_product_cost2.belong_data.push({
          "cost_list": `${this.calc_cost_detail_data_product_cost2.belong_data.length > 0 ? '나' : '가'}. 공사 자재`,
          "cost_list_colspan": 4,
          "belong_data": []
        });

        this.previous_set_bom_list_data2 = JSON.parse(JSON.stringify(new_set_bom_list_data2));
      },
      deep: true
    },
    during_edit() {
      this.estimateFilesInputs = JSON.parse(JSON.stringify(DesignProductionPageConfig.estimateFilesInputs));
      this.estimateFilesInputs2 = JSON.parse(JSON.stringify(DesignProductionPageConfig.estimateFilesInputs2));
    },
    obtain_type(newValue){
      this.calc_cost_detail_data2.shift();
      let payment = {"cost_list": "기술료", "cost_list_colspan": 4, "belong_data": []};
      let material =  {
          "cost_list": "재료비",
          "cost_list_colspan": 4,
          "belong_data": []
        };
      if(newValue === '기술료'){
        this.calc_cost_detail_data2.unshift(payment);
      }else{
        this.calc_cost_detail_data2.unshift(material);
      }
      this.calc_cost_detail_data2.map(x => {
        if (x.cost_list === '재료비' || x.cost_list === '기술료') {
          x.costListBtn = {
            text: '공사자재',
            click: ()=>{x.cost_list === '재료비' ? this.dialog_search_product = true : this.dialog_payment = true}
          }
        }
        return x;
      })
    },
    // 노무비 Dialog show and hide
    async dialog_calculate_labor(show) {
      if(this.tab_main === 0){
        if(show){
          if (!this.clickedProductCost || !this.clickedProductCost.created_time) {
            mux.Util.showAlert('산출할 제품을 선택해주세요.');
            this.dialog_calculate_labor = false;
            return;
          }
          mux.Util.showLoading();

          const prevURL = window.location.href;
          try {
            let result = await mux.Server.post({
              path: '/api/common_rest_api/',
              "params": [
                {
                  "labor_current_unit_price_history_table.modified_time": this.clickedProductCost.full_created_time,
                  "labor_cost_history_table.modified_time": this.clickedProductCost.full_created_time
                }
              ],
              "script_file_name": "rooting_노무비_산출_24_05_22_11_48_XIM.json",
              "script_file_path": "data_storage_pion\\json_sql\\cost\\노무비_산출_24_05_22_11_48_WAO"
            });
            if (prevURL !== window.location.href) return;

            if (typeof result === 'string'){
              result = JSON.parse(result);
            }
            if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
              const searchResult = result.data;

              this.labor_data = ProductCostPageConfig.labor_data; // 모달 진입시 history 에서 해당 시점 기준 데이터를 받아와 적용 필요
              this.labor_occupation_data = ProductCostPageConfig.labor_occupation_data; // 모달 진입시 history 에서 해당 시점 기준 데이터를 받아와 적용 필요

              this.labor_data = searchResult.labor_cost_history;
              this.labor_occupation_list = searchResult.labor_current_unit_price_history.map(x => {
                x.name = x.occupation;
                delete x.occupation;
                return x;
              });
            }else{
              mux.Util.showAlert(result);
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            mux.Util.hideLoading();
            mux.Util.showAlert(error);
          }
          mux.Util.hideLoading();

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
    edit_estimate_info_disabled(disable) {
      // this.estimateSearchCompanyInfoInputs.forEach(input => {
      //   input.disabled = disable;
      // });
      // this.estimateSearchDefaultInfoInputs.forEach(input => {
      //   if (input.label !== '프로젝트 코드' && input.label !== '사내 견적번호'){
      //     input.disabled = disable;
      //   }
      // });
      // this.estimateSearchDefaultInfoInputs2.forEach(input => {
      //   input.disabled = disable;
      // });
      if(disable){
        this.clickedProductCost = this.origin_clickedProductCost;
        this.clickedProductCost = this.search_estimate_data.find(x=>x.cost_calc_code === this.clickedProductCost.cost_calc_code);
      }else {
        this.origin_clickedProductCost = JSON.parse(JSON.stringify(this.clickedProductCost));
      }
      if (this.clearFlag){
        this.clickedProductCost = {};
        this.clearFlag = false;
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
    },
    select_purchase_manager2(val){
      if(val !== null) {
        let user_id = val.split('(')[1].split(')')[0];
        let user_name = val.split('(')[0];
        this.purchase_member_info2[1].name = user_name;
        this.purchase_member_info2[1].user_id =  user_id;
      }else{
        this.purchase_member_info2[1].name = '';
        this.purchase_member_info2[1].user_id =  '';
      }
    },
    tab_main(val){
      if(val === 0){
        this.bom_list_headers = DesignProductionPageConfig.bom_list_headers.filter(x=>x.text !== '사용 가능 수량')
      }else{
        this.bom_list_headers = JSON.parse(JSON.stringify(DesignProductionPageConfig.bom_list_headers));
      }
    }
  },

  computed: {
    total_cost(){
      return this.total_product_cost + this.total_labor_cost + this.total_expense_fee + this.normal_maintenance_fee + this.profite;
    },
    total_product_cost(){
      if (!this.calc_cost_detail_data_product_cost.belong_data || this.calc_cost_detail_data_product_cost.belong_data.length === 0) return 0;
      if (this.calc_cost_detail_data_product_cost.belong_data[0].belong_data && this.calc_cost_detail_data_product_cost.belong_data[0].belong_data.length !== 0){
        return this.calc_cost_detail_data_product_cost.belong_data.reduce((aa,bb)=>{
          return aa + bb.belong_data.reduce((a,b)=>{
            return a + Math.round(b.cost_unit_price * b.cost_num);
          }, 0)
        }, 0);
      }else {
        return this.calc_cost_detail_data_product_cost.belong_data.reduce((a,b)=>{
          return a + Math.round(b.cost_unit_price * b.cost_num);
        }, 0)
      }
    },
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

    calc_cost_detail_data_product_cost(){ return this.calc_cost_detail_data.find(x=>x.cost_list==='재료비' || x.cost_list==='기술료')},
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

    input_issue_date() { return this.estimateSearchDefaultInfoInputs.find(x=>x.label === '발행일') },
    input_project_code() { return this.estimateSearchDefaultInfoInputs.find(x=>x.label === '프로젝트 코드') },
    input_inhouse_bid_number() { return this.estimateSearchDefaultInfoInputs.find(x=>x.label === '사내 견적번호') },
    input_company_bid_number() { return this.estimateSearchDefaultInfoInputs.find(x=>x.label === '기업별 입찰번호') },
    input_due_date() { return this.estimateSearchDefaultInfoInputs2.find(x=>x.label === '납기') },
    input_delivery_condition() { return this.estimateSearchDefaultInfoInputs2.find(x=>x.label === '인도조건') },
    input_service_name() { return this.estimateSearchDefaultInfoInputs2.find(x=>x.label === '프로젝트/용역 명') },
    input_service_period() { return this.estimateSearchDefaultInfoInputs2.find(x=>x.label === '프로젝트/용역 기간') },
    input_remark() { return this.estimateSearchDefaultInfoInputs2.find(x=>x.label === '특이사항') },
    input_company_name() { return this.estimateSearchCompanyInfoInputs.find(x=>x.label === '업체명') },
    input_company_manager() { return this.estimateSearchCompanyInfoInputs.find(x=>x.label === '담당자') },
    input_company_manager_email() { return this.estimateSearchCompanyInfoInputs.find(x=>x.label === '담당자 E-mail') },
    input_company_manager_phone() { return this.estimateSearchCompanyInfoInputs.find(x=>x.label === '담당자 연락처') },
    input_layout_file() { return this.estimateFilesInputs.find(x=>x.column_name === 'layout')},
    input_structure_file() { return this.estimateFilesInputs.find(x=>x.column_name === 'structure')},
    input_single_line_file() { return this.estimateFilesInputs.find(x=>x.column_name === 'single_line')},
    input_trilinear_file() { return this.estimateFilesInputs.find(x=>x.column_name === 'trilinear')},
    input_circuit_file() { return this.estimateFilesInputs.find(x=>x.column_name === 'circuit')},
    input_approval_file() { return this.estimateFilesInputs2.find(x=>x.column_name === 'approval')},
    input_build_sheet_file() { return this.estimateFilesInputs2.find(x=>x.column_name === 'build_sheet')},
    input_etc_file() { return this.estimateFilesInputs2.find(x=>x.column_name === 'files')},

    total_cost2(){
      return this.total_product_cost2 + this.total_labor_cost2 + this.total_expense_fee2 + this.normal_maintenance_fee2 + this.profite2;
    },
    total_product_cost2(){
      if (!this.calc_cost_detail_data_product_cost2.belong_data || this.calc_cost_detail_data_product_cost2.belong_data.length === 0) return 0;
      if (this.calc_cost_detail_data_product_cost2.belong_data[0].belong_data && this.calc_cost_detail_data_product_cost2.belong_data[0].belong_data.length !== 0){
        return this.calc_cost_detail_data_product_cost2.belong_data.reduce((aa,bb)=>{
          return aa + bb.belong_data.reduce((a,b)=>{
            return a + Math.round(b.cost_unit_price * b.cost_num);
          }, 0)
        }, 0);
      }else {
        return this.calc_cost_detail_data_product_cost2.belong_data.reduce((a,b)=>{
          return a + Math.round(b.cost_unit_price * b.cost_num);
        }, 0)
      }
    },
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

    calc_cost_detail_data_product_cost2(){ return this.calc_cost_detail_data2.find(x=>x.cost_list==='재료비' || x.cost_list==='기술료')},
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

    input_issue_date2() { return this.estimateWriteDefaultInfoInputs.find(x=>x.label === '발행일') },
    input_project_code2() { return this.estimateWriteDefaultInfoInputs.find(x=>x.label === '프로젝트 코드') },
    input_inhouse_bid_number2() { return this.estimateWriteDefaultInfoInputs.find(x=>x.label === '사내 견적번호') },
    input_company_bid_number2() { return this.estimateWriteDefaultInfoInputs.find(x=>x.label === '기업별 입찰번호') },
    input_due_date2() { return this.estimateWriteDefaultInfoInputs2.find(x=>x.label === '납기') },
    input_delivery_condition2() { return this.estimateWriteDefaultInfoInputs2.find(x=>x.label === '인도조건') },
    input_service_name2() { return this.estimateWriteDefaultInfoInputs2.find(x=>x.label === '프로젝트/용역 명') },
    input_service_period2() { return this.estimateWriteDefaultInfoInputs2.find(x=>x.label === '프로젝트/용역 기간') },
    input_remark2() { return this.estimateWriteDefaultInfoInputs2.find(x=>x.label === '특이사항') },
    input_company_name2() { return this.estimateWriteCompanyInfoInputs.find(x=>x.label === '업체명') },
    input_company_manager2() { return this.estimateWriteCompanyInfoInputs.find(x=>x.label === '담당자') },
    input_company_manager_email2() { return this.estimateWriteCompanyInfoInputs.find(x=>x.label === '담당자 E-mail') },
    input_company_manager_phone2() { return this.estimateWriteCompanyInfoInputs.find(x=>x.label === '담당자 연락처') },
    input_layout_file2() { return this.estimateWriteFilesInputs.find(x=>x.column_name === 'layout')},
    input_structure_file2() { return this.estimateWriteFilesInputs.find(x=>x.column_name === 'structure')},
    input_single_line_file2() { return this.estimateWriteFilesInputs.find(x=>x.column_name === 'single_line')},
    input_trilinear_file2() { return this.estimateWriteFilesInputs.find(x=>x.column_name === 'trilinear')},
    input_circuit_file2() { return this.estimateWriteFilesInputs.find(x=>x.column_name === 'circuit')},
    input_approval_file2() { return this.estimateWriteFilesInputs2.find(x=>x.column_name === 'approval')},
    input_build_sheet_file2() { return this.estimateWriteFilesInputs2.find(x=>x.column_name === 'build_sheet')},
    input_etc_file2() { return this.estimateWriteFilesInputs2.find(x=>x.column_name === 'files')}
  },

  methods:{
    // eslint-disable-next-line no-unused-vars

    async initialize(){
      this.calc_cost_detail_data2 = DesignProductionPageConfig.calc_cost_detail_data.map(x => {
        let new_x = JSON.parse(JSON.stringify(x));
        if (new_x.cost_list === '재료비') {
          new_x.costListBtn = {
            text: '공사자재',
            click: ()=>{this.dialog_search_product = true}
          }
        }else if (new_x.cost_list === '노무비') {
          new_x.belong_data[0].costListBtn = {
            text: '산출',
            click: ()=>{this.dialog_calculate_labor = true}
          }
        }
        return new_x;
      });
      this.estimate_member_info = JSON.parse(JSON.stringify(DesignProductionPageConfig.estimate_member_info));
      this.estimate_member_info2 = JSON.parse(JSON.stringify(DesignProductionPageConfig.estimate_member_info));
      this.estimate_member_info2[0].name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
      this.estimate_member_info2[0].email =  this.$cookies.get(this.$configJson.cookies.email.key);
      this.estimate_member_info2[0].user_id =  this.$cookies.get(this.$configJson.cookies.id.key);

      const prevURL = window.location.href;
      try {
        if (prevURL !== window.location.href) return;


        let resultBasic = await mux.Server.getPionBasicInfo();
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          "params": [
            {}
          ],
          "script_file_name": "rooting_원가_페이지_진입_24_05_20_10_42_VOT.json",
          "script_file_path": "data_storage_pion\\json_sql\\cost\\원가_페이지_진입_24_05_20_10_43_7F2"
        });
        if (prevURL !== window.location.href) return;

        if (typeof resultBasic === 'string'){
          resultBasic = JSON.parse(resultBasic);
        }
        if (typeof result === 'string'){
          result = JSON.parse(result);
        }

        this.classification_list = resultBasic.classification;
        this.manufacturer_list = resultBasic.manufacturer;
        mux.List.addProductBasicInfoLists(this.productSearchItemInputs, this.classification_list, this.manufacturer_list, true);
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          const searchResult = result.data;

          this.new_indirect_labor_ratio = searchResult.cost_ratio.find(x=> x.type === '간접 노무비').ratio;
          this.new_indirect_labor_formula = searchResult.cost_ratio.find(x=> x.type === '간접 노무비').formula;
          this.new_employment_insurance_ratio = searchResult.cost_ratio.find(x=> x.type === '고용보험료').ratio;
          this.new_employment_insurance_formula = searchResult.cost_ratio.find(x=> x.type === '고용보험료').formula;
          this.new_tool_rent_fee_ratio = searchResult.cost_ratio.find(x=> x.type === '공구손료').ratio;
          this.new_tool_rent_fee_formula = searchResult.cost_ratio.find(x=> x.type === '공구손료').formula;
          this.new_transportation_fee_ratio = searchResult.cost_ratio.find(x=> x.type === '여비교통 통신비').ratio;
          this.new_transportation_fee_formula = searchResult.cost_ratio.find(x=> x.type === '여비교통 통신비').formula;
          this.new_industrial_accident_ratio = searchResult.cost_ratio.find(x=> x.type === '산재보험료').ratio;
          this.new_industrial_accident_formula = searchResult.cost_ratio.find(x=> x.type === '산재보험료').formula;
          this.new_taxes_dues_ratio = searchResult.cost_ratio.find(x=> x.type === '세금과공과').ratio;
          this.new_taxes_dues_formula = searchResult.cost_ratio.find(x=> x.type === '세금과공과').formula;
          this.new_welfare_benefits_ratio = searchResult.cost_ratio.find(x=> x.type === '복리후생비').ratio;
          this.new_welfare_benefits_formula = searchResult.cost_ratio.find(x=> x.type === '복리후생비').formula;
          this.new_retirement_ratio = searchResult.cost_ratio.find(x=> x.type === '퇴직공제 부금비').ratio;
          this.new_retirement_formula = searchResult.cost_ratio.find(x=> x.type === '퇴직공제 부금비').formula;
          this.new_expendables_ratio = searchResult.cost_ratio.find(x=> x.type === '소모품비').ratio;
          this.new_expendables_formula = searchResult.cost_ratio.find(x=> x.type === '소모품비').formula;
          this.new_industrial_safety_ratio = searchResult.cost_ratio.find(x=> x.type === '산업안전보건관리비').ratio;
          this.new_industrial_safety_formula = searchResult.cost_ratio.find(x=> x.type === '산업안전보건관리비').formula;
          this.new_normal_maintenance_fee_ratio = searchResult.cost_ratio.find(x=> x.type === '일반관리비').ratio;
          this.new_normal_maintenance_fee_formula = searchResult.cost_ratio.find(x=> x.type === '일반관리비').formula;
          this.new_profite_ratio = searchResult.cost_ratio.find(x=> x.type === '이윤').ratio;
          this.new_profite_formula = searchResult.cost_ratio.find(x=> x.type === '이윤').formula;

          this.labor_list = searchResult.labor_cost;

          this.labor_occupation_list = searchResult.labor_current_unit_price.map(x => {
            x.name = x.occupation;
            delete x.occupation;
            return x;
          });
        }else{
          mux.Util.showAlert(result);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }

      this.input_issue_date.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_project_code.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_inhouse_bid_number.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_due_date.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_delivery_condition.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_service_name.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_service_period.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_company_name.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_company_manager.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_company_manager_email.rules = [
        v => (!!v) || '필수 입력',
        v => /.+@.+\..+/.test(v) || '이메일 형식 확인'
      ];
      this.input_company_manager_phone.rules = [
        v => (!!v) || '필수 입력',
        v => /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/.test(v) || '번호 형식 확인(ex : 010-1234-5678)'
      ];
      this.input_issue_date2.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_project_code2.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_inhouse_bid_number2.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_due_date2.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_delivery_condition2.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_service_name2.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_service_period2.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_company_name2.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_company_manager2.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_company_manager_email2.rules = [
        v => (!!v) || '필수 입력',
        v => /.+@.+\..+/.test(v) || '이메일 형식 확인'
      ];
      this.input_company_manager_phone2.rules = [
        v => (!!v) || '필수 입력',
        v => /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/.test(v) || '번호 형식 확인(ex : 010-1234-5678)'
      ];


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

      this.clearClicked();

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
    async searchButton(inputList, new_cost_calc_code){
      mux.Util.showLoading();

      let inputs = [];
      if (Array.isArray(inputList)){
        inputs = inputList;
      }else {
        this.searchCardInputs.forEach((input) => {
          if (input.value && String(input.value).trim()) {
            inputs.push(String(input.value).trim());
          }else {
            inputs.push("");
          }
        });
        console.log('inputs :>> ', inputs);
        this.lastSearchInputs = JSON.parse(JSON.stringify(inputs));
      }

      const prevURL = window.location.href;
      let reqURL = '/api/design-production-search/';
      // approval_phase = '';
      if (inputs[0]){
        reqURL += '?project_code=' + inputs[0];
      }
      if (inputs[1]){
        reqURL += inputs[0] ? '&inhouse_bid_number=' + inputs[1] : '?inhouse_bid_number=' + inputs[1];
      }
      if (inputs[2]){
        reqURL += (inputs[0] || inputs[1]) ? '&company_bid_number=' + inputs[2] : '?company_bid_number=' + inputs[2];
      }
      if (inputs[3]){
        reqURL += (inputs[0] || inputs[1] || inputs[2]) ? '&company_name=' + inputs[3] : '?company_name=' + inputs[3];
      }
      if (inputs[4]){
        reqURL += (inputs[0] || inputs[1] || inputs[2] || inputs[3]) ? '&issue_start_date=' + inputs[4].split(',')[0] : '?issue_start_date=' + inputs[4].split(',')[0];
        reqURL += inputs[4].split(',').length > 1 ? '&issue_end_date=' + inputs[4].split(',')[1] : '&issue_end_date=' + inputs[4].split(',')[0];
      }

      try {
        let result = await mux.Server.get({path: reqURL});
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          const searchResult = result.data;
          // const searchResult = JSON.parse(JSON.stringify(DesignProductionPageConfig.test_design_data));

          // 로그인한 계정이 경영진이나, 관리자 권한, master권한이 아닐 경우 작성자가 본인인 데이터만 필터링
          const permission_group_ids = this.$cookies.get(this.$configJson.cookies.permission_group_ids.key).split(',');
          if(this.$cookies.get(this.$configJson.cookies.department.key) !== '경영진'
             && !permission_group_ids.includes('1') //관리자 권한
             && !permission_group_ids.includes('11') //master 권한
          ){
            for (const key in searchResult) {
              if (Array.isArray(searchResult[key])) {
                searchResult[key] = searchResult[key].filter(item => item.cost_calc_code.includes(this.$cookies.get(this.$configJson.cookies.id.key)));
              }
            }
          }

          searchResult.confirmation.reverse(); // 최신순으로 정렬
          // 이력 제거 후 실제 데이터만 남기기
          searchResult.confirmation = searchResult.confirmation.filter(x=> searchResult.last_design_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          const uniqueConfirmation = [];
          const confirmationMap = new Map();

          searchResult.confirmation.forEach(item => {
            const code = item.cost_calc_code;
            const time = new Date(item.modified_time).getTime();

            if (!confirmationMap.has(code) || time > confirmationMap.get(code)) {
              confirmationMap.set(code, time);
            }
          });
          confirmationMap.forEach((time, code) => {
            const item = searchResult.confirmation.find(item => item.cost_calc_code === code && new Date(item.modified_time).getTime() === time);
            uniqueConfirmation.push(item);
          });
          searchResult.confirmation = uniqueConfirmation;
          searchResult.product_cost = searchResult.product_cost.filter(x=> searchResult.last_design_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          searchResult.labor_cost_calc_detail = searchResult.labor_cost_calc_detail.filter(x=> searchResult.last_design_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          searchResult.product_cost_calc_detail = searchResult.product_cost_calc_detail.filter(x=> searchResult.last_design_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          searchResult.construction_materials_data = searchResult.construction_materials_data.filter(x=> searchResult.last_design_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          this.clearClicked();
          this.searchDataCalcProcess(searchResult);

          if (new_cost_calc_code){
            let clickedIndex = this.search_estimate_data.findIndex(x => x.cost_calc_code === new_cost_calc_code);
            if (clickedIndex !== -1){
              this.clickSearchedTr(this.search_estimate_data[clickedIndex]);
            }
          }

        }else{
          mux.Util.showAlert(result);
        }

      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.hideLoading();
        mux.Util.showAlert(error);
      }

      mux.Util.hideLoading();
    },
    async download(foldername, filename, prefix) {
      mux.Util.showLoading();
      try {
        await mux.Server.downloadFile(foldername, filename, prefix);
      } catch (error) {
        mux.Util.showAlert(error);
      }
      mux.Util.hideLoading();
    },
    test(){
      // console.log('test');
      // mux.Server.uploadFile({path: '/', folder:'somefolder', file: this.files[0]});
      mux.Server.uploadFile({path: '/', folder:'somefolder', files: this.files});
    },
    // applyCostLoad(loadData){
    //   const estimate = JSON.parse(JSON.stringify(loadData));

    //   this.calc_cost_detail_data_product_cost2.belong_data = [];
    //   if (estimate.product_cost_calc_detail){
    //     let estimateProduct = { cost_num: 1, cost_unit_price: 0 };
    //     estimate.product_cost_calc_detail.forEach((a,i)=>{
    //       if (i === 0){
    //         this.calc_cost_detail_data_product_cost2.belong_data.push({
    //           "cost_list": "가. 재료",
    //           "cost_list_colspan": 4,
    //           "belong_data": []
    //         });

    //         estimateProduct.product_code = a.product_code;
    //         estimateProduct.cost_list = a.product_name;
    //         estimateProduct.cost_list_sub = a.product_spec;
    //         estimateProduct.cost_unit = '제품';
    //         estimateProduct.cost_num_editable = true;
    //         estimateProduct.allow_one_or_greater = true;
    //         estimateProduct.cost_unit_price_editable = true;
    //         estimateProduct.cost_list_sub_editable = true;
    //         estimateProduct.deletable_row = true;
    //       }

    //       estimateProduct.cost_unit_price += Math.round(a.module_num > 0 ? a.module_num * a.module_unit_price : a.material_num * a.material_unit_price);
    //     });

    //     this.calc_cost_detail_data_product_cost2.belong_data[0].belong_data.push(estimateProduct);
    //   }
    //   this.labor_cost_list = estimate.labor_cost_calc_detail;

    //   // set num
    //   this.calc_cost_detail_data_employment_insurance2.cost_num = estimate.product_cost[0].employment_insurance_num;
    //   this.calc_cost_detail_data_tool_rent_fee2.cost_num = estimate.product_cost[0].tool_rent_fee_num;
    //   this.calc_cost_detail_data_transportation_fee2.cost_num = estimate.product_cost[0].transportation_fee_num;
    //   this.calc_cost_detail_data_industrial_accident2.cost_num = estimate.product_cost[0].industrial_accident_num;
    //   this.calc_cost_detail_data_taxes_dues2.cost_num = estimate.product_cost[0].taxes_dues_num;
    //   this.calc_cost_detail_data_welfare_benefits2.cost_num = estimate.product_cost[0].welfare_benefits_num;
    //   this.calc_cost_detail_data_retirement2.cost_num = estimate.product_cost[0].retirement_num;
    //   this.calc_cost_detail_data_expendables2.cost_num = estimate.product_cost[0].expendables_num;
    //   this.calc_cost_detail_data_industrial_safety2.cost_num = estimate.product_cost[0].industrial_safety_num;
    //   this.calc_cost_detail_data_normal_maintenance_fee2.cost_num = estimate.product_cost[0].normal_maintenance_fee_num;
    //   this.calc_cost_detail_data_profite2.cost_num = estimate.product_cost[0].profite_num;

    //   this.product_cost_dialog = false;
    // },
    async applyEstimateLoad(loadData){
      mux.Util.showLoading();
      const estimate = JSON.parse(JSON.stringify(loadData));

      // 완제품 내부 구성 가져오기
      let searchProductCodeArr = [];
      estimate.product_cost_calc_detail.forEach((a)=> {
        if (!searchProductCodeArr.includes(a.product_code)){
          searchProductCodeArr.push(a.product_code);
        }
      });
      if (searchProductCodeArr.length > 0){
        const prevURL = window.location.href;
        try {
          let result = await mux.Server.post({
            path: '/api/common_rest_api/',
            "params": [
                {
                  "product_table.product_code": '' // 다중 조건 검색으로 searchProductCodeArr 여야 함.
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
              mux.Util.showAlert('의뢰 내역에 알 수 없는 제품이 포함되어 있습니다.');
              return;
            }
            for (let i = 0; i < searchProductCodeArr.length; i++) {
              const code = searchProductCodeArr[i];
              if (!result['data'].find(x=>x.code === code)){
                mux.Util.showAlert('의뢰 내역에 알 수 없는 제품이 포함되어 있습니다.');
                return;
              }
            }

            this.searched_product_data2 = result['data'];
            this.searched_product_data2.forEach(data =>{
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
            });

            this.set_bom_list_data2 = [];
            for(let i=0; i<estimate.product_cost_calc_detail.length; i++){
              const data = estimate.product_cost_calc_detail[i];
              const target = this.searched_product_data2.find(a => a.product_code === data.product_code);
              if (!target){
                mux.Util.showAlert('의뢰 내역에 알 수 없는 제품이 포함되어 있습니다.');
                return;
              }
              target.unit_price = data.product_unit_price;
              target.product_num = data.product_num;
              this.addBomList(target);
            }
          }else{
            if (prevURL !== window.location.href) return;
            mux.Util.showAlert(result);
            return;
          }
        } catch (error) {
          if (prevURL !== window.location.href) return;
          mux.Util.hideLoading();
          // console.error(error);
          mux.Util.showAlert(error);
          return;
        }
      }

      this.calc_cost_detail_data_product_cost2.belong_data = [];
      if (estimate.product_cost_calc_detail){
        estimate.product_cost_calc_detail.forEach((a,i)=>{
          if (i === 0){
            this.calc_cost_detail_data_product_cost2.belong_data.push({
              "cost_list": "가. 재료",
              "cost_list_colspan": 4,
              "belong_data": []
            });
          }
          this.calc_cost_detail_data_product_cost2.belong_data[0].belong_data.push({
            product_code: a.product_code,
            cost_list: a.product_name,
            cost_list_sub: a.product_spec,
            cost_num: a.product_num,
            cost_unit_price: a.product_unit_price,
            cost_unit: '제품',
            cost_num_editable: true,
            allow_one_or_greater: true,
            cost_unit_price_editable: true,
            cost_list_sub_editable: true,
            deletable_row: true
          });
        });
      }
      if (estimate.construction_materials_data){
        estimate.construction_materials_data.forEach((a,i)=>{
          if (i === 0){
            this.calc_cost_detail_data_product_cost2.belong_data.push({
              "cost_list": `${this.calc_cost_detail_data_product_cost2.belong_data.length > 0 ? '나' : '가'}. 공사 자재`,
              "cost_list_colspan": 4,
              "belong_data": []
            });
          }
          this.calc_cost_detail_data_product_cost2.belong_data[this.calc_cost_detail_data_product_cost2.belong_data.length-1].belong_data.push({
            cost_list: a.construction_materials,
            cost_num: a.construction_materials_num,
            cost_unit_price: a.construction_materials_unit_price,
            cost_unit: '개',
            cost_num_editable: true,
            allow_one_or_greater: true,
            cost_unit_price_editable: true,
            cost_list_sub_editable: true,
            deletable_row: true
          });
        });
      }
      this.labor_cost_list = estimate.labor_cost_calc_detail;

      // set num
      this.calc_cost_detail_data_employment_insurance2.cost_num = estimate.product_cost[0].employment_insurance_num;
      this.calc_cost_detail_data_tool_rent_fee2.cost_num = estimate.product_cost[0].tool_rent_fee_num;
      this.calc_cost_detail_data_transportation_fee2.cost_num = estimate.product_cost[0].transportation_fee_num;
      this.calc_cost_detail_data_industrial_accident2.cost_num = estimate.product_cost[0].industrial_accident_num;
      this.calc_cost_detail_data_taxes_dues2.cost_num = estimate.product_cost[0].taxes_dues_num;
      this.calc_cost_detail_data_welfare_benefits2.cost_num = estimate.product_cost[0].welfare_benefits_num;
      this.calc_cost_detail_data_retirement2.cost_num = estimate.product_cost[0].retirement_num;
      this.calc_cost_detail_data_expendables2.cost_num = estimate.product_cost[0].expendables_num;
      this.calc_cost_detail_data_industrial_safety2.cost_num = estimate.product_cost[0].industrial_safety_num;
      this.calc_cost_detail_data_normal_maintenance_fee2.cost_num = estimate.product_cost[0].normal_maintenance_fee_num;
      this.calc_cost_detail_data_profite2.cost_num = estimate.product_cost[0].profite_num;

      this.input_issue_date2.value = estimate.product_cost[0].issue_date;
      this.input_project_code2.value = estimate.product_cost[0].project_code;
      this.input_inhouse_bid_number2.value = estimate.product_cost[0].inhouse_bid_number;
      this.input_company_bid_number2.value = estimate.product_cost[0].company_bid_number;
      this.input_due_date2.value = estimate.product_cost[0].due_date;
      this.input_delivery_condition2.value = estimate.product_cost[0].delivery_condition;
      this.input_service_name2.value = estimate.product_cost[0].service_name;
      this.input_service_period2.value = estimate.product_cost[0].service_period;
      this.input_remark2.value = estimate.product_cost[0].remark;
      this.input_company_name2.value = estimate.product_cost[0].company_name;
      this.input_company_manager2.value = estimate.product_cost[0].company_manager;
      this.input_company_manager_email2.value = estimate.product_cost[0].company_manager_email;
      this.input_company_manager_phone2.value = estimate.product_cost[0].company_manager_phone;

      this.loaded_obtain_cost_calc_code = estimate.product_cost[0].cost_calc_code;

      mux.Util.hideLoading();
      this.estimate_cost_dialog = false;
    },
    closeCostSearchDialog(){
      this.product_cost_dialog = false;
      this.estimate_cost_dialog = false;
    },
    selectMemberDialog(idx){
      this.member_type_index = idx
      if (this.tab_main === 0){
        this.member_dialog = true;
      }else {
        this.member_dialog2 = true;
      }
    },
    setMember(item){
      if (this.tab_main === 0){
        this.estimate_member_info[this.member_type_index].name = item.name.trim();
        this.estimate_member_info[this.member_type_index].user_id = item.user_id;
        this.estimate_member_info[this.member_type_index].email = item.email;
      }else {
        this.estimate_member_info2[this.member_type_index].name = item.name.trim();
        this.estimate_member_info2[this.member_type_index].user_id = item.user_id;
        this.estimate_member_info2[this.member_type_index].email = item.email;
      }
      this.close();
    },
    members(data){
      if (this.tab_main === 0){
        this.members_list=data;
      }else {
        this.members_list2=data;
      }
    },
    close(){
      this.member_dialog = false;
      this.member_dialog2 = false;
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

          if (this.tab_main === 0){
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
            });
          }else {
            this.searched_product_data2 = result['data'];
            this.searched_product_data2.forEach(data =>{
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
            });
          }
        }else{
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(result);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.hideLoading();
        // console.error(error);
        mux.Util.showAlert(error);
      }
      mux.Util.hideLoading();
    },
    searchDataCalcProcess(searchResult, isFirst){
      const productTotalCost = {};
      searchResult.product_cost_calc_detail.forEach(a=>{
        if (!productTotalCost[a.cost_calc_code]){
          productTotalCost[a.cost_calc_code] = Math.round(a.product_num && a.product_unit_price ? a.product_num * a.product_unit_price : a.module_num && a.module_unit_price ? a.module_num * a.module_unit_price : a.material_num && a.material_unit_price ? a.material_num * a.material_unit_price : 0);
        }else {
          productTotalCost[a.cost_calc_code] += Math.round(a.product_num && a.product_unit_price ? a.product_num * a.product_unit_price : a.module_num && a.module_unit_price ? a.module_num * a.module_unit_price : a.material_num && a.material_unit_price ? a.material_num * a.material_unit_price : 0);
        }
      });
      searchResult.construction_materials_data.forEach(a=>{
        if (!productTotalCost[a.cost_calc_code]){
          productTotalCost[a.cost_calc_code] = Math.round(a.construction_materials_num * a.construction_materials_unit_price);
        }else {
          productTotalCost[a.cost_calc_code] += Math.round(a.construction_materials_num * a.construction_materials_unit_price);
        }
      });
      // searchResult.technical_fee_data.forEach(a=>{
      //   if (!productTotalCost[a.cost_calc_code]){
      //     productTotalCost[a.cost_calc_code] = Math.round(a.technical_fee_num * a.technical_fee_unit_price);
      //   }else {
      //     productTotalCost[a.cost_calc_code] += Math.round(a.technical_fee_num * a.technical_fee_unit_price);
      //   }
      // });
      const directLaborCost = {};
      searchResult.labor_cost_calc_detail.forEach(a=>{
        if (!directLaborCost[a.cost_calc_code]){
          directLaborCost[a.cost_calc_code] = Math.round(a.unit_price * a.quantity * a.man_per_hour);
        }else {
          directLaborCost[a.cost_calc_code] += Math.round(a.unit_price * a.quantity * a.man_per_hour);
        }
      });

      const productCostArr = searchResult.product_cost.map((info)=> {
        const productTotalCostInfo = productTotalCost[info.cost_calc_code] ? productTotalCost[info.cost_calc_code] : 0;
        const directLaborCostInfo = directLaborCost[info.cost_calc_code];

        let indirectLaborUnitPrice = Math.round(directLaborCostInfo * info.indirect_labor_ratio);
        const indirectLaborCost = Math.round(indirectLaborUnitPrice * info.indirect_labor_num);
        const totalLaborCost = directLaborCostInfo + indirectLaborCost;
        let employmentInsuranceUnitPrice = Math.round(totalLaborCost * info.employment_insurance_ratio);
        const employmentInsuranceCost = Math.round(employmentInsuranceUnitPrice * info.employment_insurance_num);
        let toolRentFeeUnitPrice = Math.round(directLaborCostInfo * info.tool_rent_fee_ratio);
        const toolRentFeeCost = Math.round(toolRentFeeUnitPrice * info.tool_rent_fee_num);
        let transportationFeeUnitPrice = Math.round(totalLaborCost * info.transportation_fee_ratio);
        const transportationFeeCost = Math.round(transportationFeeUnitPrice * info.transportation_fee_num);
        let industrialAccidentUnitPrice = Math.round(totalLaborCost * info.industrial_accident_ratio);
        const industrialAccidentCost = Math.round(industrialAccidentUnitPrice * info.industrial_accident_num);
        let taxesDuesUnitPrice = Math.round(totalLaborCost * info.taxes_dues_ratio);
        const taxesDuesCost = Math.round(taxesDuesUnitPrice * info.taxes_dues_num);
        let welfareBenefitsUnitPrice = Math.round(totalLaborCost * info.welfare_benefits_ratio);
        const welfareBenefitsCost = Math.round(welfareBenefitsUnitPrice * info.welfare_benefits_num);
        let retirementUnitPrice = Math.round(directLaborCostInfo * info.retirement_ratio);
        const retirementCost = Math.round(retirementUnitPrice * info.retirement_num);
        let expendablesUnitPrice = Math.round(totalLaborCost * info.expendables_ratio);
        const expendablesCost = Math.round(expendablesUnitPrice * info.expendables_num);
        let industrialSafetyUnitPrice = Math.round(directLaborCostInfo * info.industrial_safety_ratio);
        const industrialSafetyCost = Math.round(industrialSafetyUnitPrice * info.industrial_safety_num);
        const totalExpenseFeeCost = employmentInsuranceCost + toolRentFeeCost + transportationFeeCost + industrialAccidentCost + taxesDuesCost + welfareBenefitsCost + retirementCost + expendablesCost + industrialSafetyCost;
        let normalMaintenanceFeeUnitPrice = Math.round((productTotalCostInfo + totalLaborCost + totalExpenseFeeCost) * info.normal_maintenance_fee_ratio);
        const normalMaintenanceFeeCost = Math.round(normalMaintenanceFeeUnitPrice * info.normal_maintenance_fee_num);
        let profiteUnitPrice = Math.round((totalLaborCost + totalExpenseFeeCost + normalMaintenanceFeeCost) * info.profite_ratio);
        const profiteCost = Math.round(profiteUnitPrice * info.profite_num);

        const allTotalCost = productTotalCostInfo + totalLaborCost + totalExpenseFeeCost + normalMaintenanceFeeCost + profiteCost;
        info.cost_total_amount = mux.Number.withComma(allTotalCost);
        if (isFirst){
          info.product_name += '('+info.product_spec+')';
        }
        if (info.created_time){
          info.full_created_time = info.created_time + "";
          info.created_time = mux.Date.format(info.created_time, 'yyyy-MM-dd');
        }
        if (info.modified_time){
          info.full_modified_time = info.modified_time + "";
          info.modified_time = mux.Date.format(info.modified_time, 'yyyy-MM-dd');
        }

        searchResult.confirmation.forEach(confirmation => {
          if (confirmation.cost_calc_code === info.cost_calc_code){
            Object.keys(confirmation).forEach(key=> {
              if (key === 'created_time'){
                confirmation[key] = mux.Date.format(confirmation[key], 'yyyy-MM-dd');
              }
              info[key] = confirmation[key];
            });
          }
        });

        return info;
      });


      this.search_estimate_data = productCostArr;
      this.searched_datas = searchResult;
    },
    addCostList(item){
      // this.dialog_search_product = false;
      // this.dialog_selected_product_data = item;
      if (this.tab_main === 0){ // 조회 탭
        if (!this.calc_cost_detail_data_product_cost.belong_data.find(x=>x.cost_list.includes('재료'))){
          this.calc_cost_detail_data_product_cost.belong_data.unshift({
            "cost_list": "가. 재료",
            "cost_list_colspan": 4,
            "belong_data": []
          });
        }
        this.calc_cost_detail_data_product_cost.belong_data[0].belong_data.push({
          product_code: item.product_code,
          cost_list: item.complete_product_name,
          cost_list_sub: item.product_spec,
          cost_num: 1,
          cost_unit_price: Number(item.unit_price.replaceAll('₩', '').replaceAll(',', '')),
          cost_unit: '제품',
          cost_num_editable: true,
          allow_one_or_greater: true,
          cost_unit_price_editable: true,
          cost_list_sub_editable: true,
          deletable_row: true
        });
      }else { // 작성 탭
        if (!this.calc_cost_detail_data_product_cost2.belong_data.find(x=>x.cost_list.includes('재료'))){
          this.calc_cost_detail_data_product_cost2.belong_data.unshift({
            "cost_list": "가. 재료",
            "cost_list_colspan": 4,
            "belong_data": []
          });
        }
        this.calc_cost_detail_data_product_cost2.belong_data[0].belong_data.push({
          product_code: item.product_code,
          cost_list: item.complete_product_name,
          cost_list_sub: item.product_spec,
          cost_num: 1,
          cost_unit_price: Number(item.unit_price.replaceAll('₩', '').replaceAll(',', '')),
          cost_unit: '제품',
          cost_num_editable: true,
          allow_one_or_greater: true,
          cost_unit_price_editable: true,
          cost_list_sub_editable: true,
          deletable_row: true
        });
      }
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
        mux.Util.showAlert('모든 행을 삭제할 수 없습니다.');
        return;
      }

      target_labor_cost.splice(idx, 1);
    },
    clickSearchedTr(item){

      this.clearClicked();

      //item.type이 기술료인지 재료비인지 판단하여 양식 변경
      this.calc_cost_detail_data.shift();
      let payment = {"cost_list": "기술료", "cost_list_colspan": 4, "belong_data": []};
      let material =  {
        "cost_list": "재료비",
        "cost_list_colspan": 4,
        "belong_data": []
      };

      if(item.obtain_type === '기술료'){
        this.calc_cost_detail_data.unshift(payment);
      }else{
        this.calc_cost_detail_data.unshift(material);
      }

      this.edit_buttons_show = true;
      this.clickedProductCost = item;
      if (this.searched_datas.last_design_confirmation.findIndex(x=>x.cost_calc_code === item.cost_calc_code) > -1){
        this.clickedProductCost.is_last_design_confirmation = true;
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

    clearClicked() {
      this.clearFlag = true;
      this.estimate_member_info = JSON.parse(JSON.stringify(DesignProductionPageConfig.estimate_member_info));

      this.calc_cost_detail_data_product_cost.belong_data = [];
      // 조회 - 직접 노무비 리스트 적용
      this.calc_cost_detail_data_direct_labor.belong_data = [];
      // 조회 - 간접 노무비 적용
      this.calc_cost_detail_data_indirect_labor.cost_unit_price = 0;
      this.calc_cost_detail_data_indirect_labor.cost_num = 1;
      // 조회 - 고용보험료 적용
      this.calc_cost_detail_data_employment_insurance.cost_unit_price = 0;
      this.calc_cost_detail_data_employment_insurance.cost_num = 1;
      // 조회 - 공구손료 적용
      this.calc_cost_detail_data_tool_rent_fee.cost_unit_price = 0;
      this.calc_cost_detail_data_tool_rent_fee.cost_num = 1;
      // 조회 - 여비교통 통신비 적용
      this.calc_cost_detail_data_transportation_fee.cost_unit_price = 0;
      this.calc_cost_detail_data_transportation_fee.cost_num = 1;
      // 조회 - 산재보험료 적용
      this.calc_cost_detail_data_industrial_accident.cost_unit_price = 0;
      this.calc_cost_detail_data_industrial_accident.cost_num = 1;
      // 조회 - 세금과공과 적용
      this.calc_cost_detail_data_taxes_dues.cost_unit_price = 0;
      this.calc_cost_detail_data_taxes_dues.cost_num = 1;
      // 조회 - 복리후생비 적용
      this.calc_cost_detail_data_welfare_benefits.cost_unit_price = 0;
      this.calc_cost_detail_data_welfare_benefits.cost_num = 1;
      // 조회 - 퇴직공제 부금비 적용
      this.calc_cost_detail_data_retirement.cost_unit_price = 0;
      this.calc_cost_detail_data_retirement.cost_num = 1;
      // 조회 - 소모품비 적용
      this.calc_cost_detail_data_expendables.cost_unit_price = 0;
      this.calc_cost_detail_data_expendables.cost_num = 1;
      // 조회 - 산업안전보건관리비 적용
      this.calc_cost_detail_data_industrial_safety.cost_unit_price = 0;
      this.calc_cost_detail_data_industrial_safety.cost_num = 1;

      // 조회 - 일반관리비 적용
      this.calc_cost_detail_data_normal_maintenance_fee.cost_unit_price = 0;
      this.calc_cost_detail_data_normal_maintenance_fee.cost_num = 1;
      // 조회 - 이윤 적용
      this.calc_cost_detail_data_profite.cost_unit_price = 0;
      this.calc_cost_detail_data_profite.cost_num = 1;

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

      this.input_issue_date.value = '';
      this.input_project_code.value = '';
      this.input_inhouse_bid_number.value = '';
      this.input_company_bid_number.value = '';
      this.input_due_date.value = '';
      this.input_delivery_condition.value = '';
      this.input_service_name.value = '';
      this.input_service_period.value = '';
      this.input_remark.value = '';
      this.input_company_name.value = '';
      this.input_company_manager.value = '';
      this.input_company_manager_email.value = '';
      this.input_company_manager_phone.value = '';
      this.estimateFilesInputs = JSON.parse(JSON.stringify(DesignProductionPageConfig.estimateFilesInputs));
      this.estimateFilesInputs2 = JSON.parse(JSON.stringify(DesignProductionPageConfig.estimateFilesInputs2));

      this.edit_survey_cost_num_disabled = true;
      this.edit_estimate_info_disabled = true;
      this.editable_bom_list = false;
      this.edit_buttons_show = false;
      this.during_edit = false;
      this.set_bom_list_data = [];
      this.bom_list_purchase_data = [];
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
    async printLaborCost(fileName){
      // this.print_labor_table = true;

      // let navClicked = false;
      // if (!document.querySelector(".v-navigation-drawer--close")){
      //   document.querySelector(".v-app-bar__nav-icon").dispatchEvent(new Event('click'));
      //   navClicked = true;
      // }
      if (!this.$refs.printLaborTable){
        let refLoadCount = 0
        while(refLoadCount < 50){
          if (this.$refs.printLaborTable){
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 100));
          refLoadCount++;
        }
      }

      setTimeout(async () => {
        if (fileName){
          await mux.Util.downloadPDF(this.$refs.printLaborTable, {fileName, rowCountPerPage: 37, mmWidth: 500, isLandscape: true});

          // if (navClicked) {
          //   document.querySelector(".v-app-bar__nav-icon").dispatchEvent(new Event('click'));
          // }
          // this.print_labor_table = false;
        }else {
          await mux.Util.print(this.$refs.printLaborTable, {rowCountPerPage: 37, mmWidth: 500, isLandscape: true});

          // if (navClicked) {
          //   document.querySelector(".v-app-bar__nav-icon").dispatchEvent(new Event('click'));
          // }
          // this.print_labor_table = false;
        }
      }, 500);

    },

    // 파일명 인자 있을 경우 PDF download, 없을 경우 print
    async estimatePrintOrPDF(itemsThisKeyStr, element, editableVarThisKeyStr, fileName) {
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
          await mux.Util.downloadPDF(element, {fileName, hasTotalRow: true});
        }else {
          await mux.Util.print(element, {hasTotalRow: true});
        }
        this[editableVarThisKeyStr] = !this[editableVarThisKeyStr];

        this[itemsThisKeyStr] = originItems;
      }, 1000);


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
          await mux.Util.downloadPDF(element, {fileName, rowCountPerPage: 34, hasTotalRow: true});
        }else {
          await mux.Util.print(element, {rowCountPerPage: 34, hasTotalRow: true});
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
          mux.Util.showAlert('양식이 잘못되었습니다.');
          return;
        }

        // 수량 0행 존재 확인 후, 선택에 따라 모두 삭제
        let isConfirm = false;
        for (let i = this.labor_cost_data.length - 1; i >= 0; i--) {
          if (!this.labor_cost_data[i].quantity || this.labor_cost_data[i].quantity == 0){
            if (i === 0 && this.labor_cost_data.length === 1){
              mux.Util.showAlert('최소 한 개의 행은 수량이 입력되어야 합니다.');
              return;
            }
            if (!isConfirm){
              isConfirm = await mux.Util.showConfirm('수량이 없는 행이 존재합니다.\n수량이 없는 행을 삭제하시겠습니까?');
              if (!isConfirm){
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
                  mux.Util.showAlert(`중복 데이터가 존재합니다.\n${laborDataI.no}\n${laborDataI.name} / ${laborDataI.type} / ${laborDataI.occupation}`);
                  return;
                }
          }
        }

        let isRejected = false;
        if (this.clickedProductCost.rejected_date){
          isRejected = true;
        }
        let needReConfirm = false;
        if (this.estimate_member_info[0].user_id !== this.$cookies.get(this.$configJson.cookies.id.key) && this.estimate_member_info[0].checked_date){
          if (!await mux.Util.showConfirm('확인 절차가 다시 진행됩니다. 수정하시겠습니까?')){
            return;
          }
          needReConfirm = true;
        }

        const newDate = new Date();

        let sendDataCheckedDate = '';
        if (this.estimate_member_info[0].user_id === this.$cookies.get(this.$configJson.cookies.id.key)){
          sendDataCheckedDate = mux.Date.format(newDate, 'yyyy-MM-dd HH:mm:ss');
        }else {
          sendDataCheckedDate = null;
        }

        const new_cost_calc_code = mux.Date.format(newDate, 'yyyy-MM-dd HH-mm-ss-fff') + '_' + this.$cookies.get(this.$configJson.cookies.id.key);

        // 품번 기준 정렬
        this.labor_cost_data.sort((a,b) => a.no.localeCompare(b.no));

        let sendData = {
          "design_confirmation_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{
              "cost_calc_code": new_cost_calc_code,
              "approval_phase": sendDataCheckedDate === null ? '미확인' : '미승인',
              "checked_date": sendDataCheckedDate,
              "rejecter": '',
              "rejected_date": null,
              "reject_reason": '',
            },
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "yes"
          }],
          "design_cost_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "yes"
          }],
          "design_cost_calc_detail_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "no"
          }],
          "design_construction_detail_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "no"
          }],
          "design_labor_cost_calc_detail_table-delete": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{},
            "delete_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "yes"
          }],
          "purchase_confirmation_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "no"
          }],
          "design_labor_cost_calc_detail_table-insert": []
        };
        this.labor_cost_data.forEach(data => {
          data.cost_calc_code = new_cost_calc_code;
          sendData["design_labor_cost_calc_detail_table-insert"].push({
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "creater"
            },
            "data": data,
            "select_where": {"cost_calc_code": new_cost_calc_code, "name": data.name, "type": data.type, "occupation": data.occupation},
            "rollback": "yes"
          });
        });

        const prevURL = window.location.href;
        try {
          mux.Util.showLoading();

          let result = await mux.Server.post({
            path: '/api/common_rest_api/',
            params: sendData
          });
          if (prevURL !== window.location.href) return;

          if (typeof result === 'string'){
            result = JSON.parse(result);
          }
          if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

            this.estimate_member_info[0].checked_date = sendDataCheckedDate !== null ? sendDataCheckedDate : '';
            let targetConfirmation = this.searched_datas.confirmation.find(item => item.cost_calc_code === this.clickedProductCost.cost_calc_code);
            targetConfirmation.modified_time = mux.Date.format(newDate, 'yyyy-MM-dd HH:mm:ss');
            targetConfirmation.checked_date = `${this.estimate_member_info[0].checked_date}`;
            targetConfirmation.approval_phase = sendDataCheckedDate === null ? '미확인' : '미승인';
            targetConfirmation.rejecter = '';
            targetConfirmation.rejected_date = '';
            targetConfirmation.reject_reason = '';

            this.origin_labor_cost_data = this.labor_cost_data;
            this.searched_datas.labor_cost_calc_detail = this.searched_datas.labor_cost_calc_detail.filter(x=>x.cost_calc_code !== this.clickedProductCost.cost_calc_code);
            this.labor_cost_data.forEach(data => {
              this.searched_datas.labor_cost_calc_detail.push(data);
            });
            targetConfirmation.cost_calc_code = new_cost_calc_code;
            this.searched_datas.last_design_confirmation.find(x=>x.cost_calc_code === this.clickedProductCost.cost_calc_code).cost_calc_code = new_cost_calc_code;

            this.clickedProductCost.modified_time = mux.Date.format(newDate, 'yyyy-MM-dd HH:mm:ss');
            this.clickedProductCost.checked_date = this.estimate_member_info[0].checked_date;
            this.clickedProductCost.approval_phase = sendDataCheckedDate === null ? '미확인' : '미승인';
            this.clickedProductCost.rejecter = '';
            this.clickedProductCost.rejected_date = '';
            this.clickedProductCost.reject_reason = '';
            this.clickedProductCost.cost_calc_code = new_cost_calc_code;

            this.searchDataCalcProcess(this.searched_datas);

            if (isRejected || needReConfirm){
              //메일 알림 관련
              let mailTo = [];
              // let creater = this.$cookies.get(this.$configJson.cookies.id.key);
              if(sendDataCheckedDate === null){
                mailTo.push(this.clickedProductCost.checker_id);
              }else {
                mailTo.push(this.clickedProductCost.approver_id);
              }

              // 메일 본문 내용
              let content=`
              <html>
                <body>
                  <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                    <h2 style="text-align: center; color:#13428a">설계 ${sendDataCheckedDate === null ? '확인' : '승인'} 요청 알림</h2>
                    <table style="width: 100%;border-spacing: 10px 10px;">
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.project_code}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">사내 견적번호</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.inhouse_bid_number}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">발행일</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.issue_date}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.given_name}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">확인자</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.checker}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">승인자</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.approver}</td>
                      </tr>
                    </table>
                    <a style="color: white; text-decoration:none"href="${prevURL}-search?project_code=${this.clickedProductCost.project_code}&inhouse_bid_number=${this.clickedProductCost.inhouse_bid_number}&company_bid_number=${this.clickedProductCost.company_bid_number}&company_name=${this.clickedProductCost.company_name}&issue_date=${this.clickedProductCost.issue_date}">
                      <p style="cursor:pointer; background: #13428a;color: white;font-weight: bold;padding: 13px;border-radius: 40px;font-size: 16px;text-align: center;margin-top: 25px; margin-bottom: 40px;">
                        확인하기
                      </p>
                    </a>
                  </div>
                </body>
              </html>
              `;

              try {
                let sendEmailAlam = await mux.Server.post({
                  path: '/api/send_email/',
                  to_addrs: mailTo,
                  subject: "설계 " + (sendDataCheckedDate === null ? '확인' : '승인') + " 요청 알림",
                  content: content
                });
                if (prevURL !== window.location.href) return;
                if(sendEmailAlam['code'] == 0 || (typeof sendEmailAlam['data'] === 'object' && sendEmailAlam['data']['code'] == 0) || (typeof sendEmailAlam['response'] === 'object' && typeof sendEmailAlam['response']['data'] === 'object' && sendEmailAlam['response']['data']['code'] == 0)){
                  mux.Util.showAlert('수정되었습니다.', '수정 완료', 3000);
                } else {
                  if (prevURL !== window.location.href) return;
                  console.log('알림 메일 전송에 실패-sendEmailAlam :>> ', sendEmailAlam);
                  mux.Util.showAlert('수정되었으나 알림 메일 전송에 실패하였습니다.', '수정 완료');
                }
              } catch (error) {
                if (prevURL !== window.location.href) return;
                console.log('알림 메일 전송에 실패-error :>> ', error);
                mux.Util.showAlert('수정되었으나 알림 메일 전송에 실패하였습니다.', '수정 완료');
              }
            }else {
              mux.Util.showAlert('수정되었습니다.', '수정 완료', 3000);
            }

          } else {
            if (prevURL !== window.location.href) return;
            mux.Util.showAlert(result);
          }
        } catch (error) {
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(error);
        }
        mux.Util.hideLoading();

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
          mux.Util.showAlert('양식이 잘못되었습니다.');
          return;
        }

        // 수량 0행 존재 확인 후, 선택에 따라 모두 삭제
        let isConfirm = false;
        for (let i = this.labor_cost_list.length - 1; i >= 0; i--) {
          if (!this.labor_cost_list[i].quantity || this.labor_cost_list[i].quantity == 0){
            if (i === 0 && this.labor_cost_list.length === 1){
              mux.Util.showAlert('최소 한 개의 행은 수량이 입력되어야 합니다.');
              return;
            }
            if (!isConfirm){
              isConfirm = await mux.Util.showConfirm('수량이 없는 행이 존재합니다.\n수량이 없는 행을 삭제하시겠습니까?');
              if (!isConfirm){
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
                  mux.Util.showAlert(`중복 데이터가 존재합니다.\n${laborDataI.no}\n${laborDataI.name} / ${laborDataI.type} / ${laborDataI.occupation}`);
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

    async estimateInfoEditSave() {
      // 유효성 검사
      const validate = this.$refs.estimateInfoForm.validate();
      if(validate) {

        let fileNames = [];
        if (this.input_layout_file.value) {
          fileNames.push(this.input_layout_file.value.name);
        }
        if (this.input_structure_file.value) {
          fileNames.push(this.input_structure_file.value.name);
        }
        if (this.input_single_line_file.value) {
          fileNames.push(this.input_single_line_file.value.name);
        }
        if (this.input_trilinear_file.value) {
          fileNames.push(this.input_trilinear_file.value.name);
        }
        if (this.input_circuit_file.value) {
          fileNames.push(this.input_circuit_file.value.name);
        }
        if (this.input_approval_file.value) {
          fileNames.push(this.input_approval_file.value.name);
        }
        if (this.input_build_sheet_file.value) {
          fileNames.push(this.input_build_sheet_file.value.name);
        }
        if (Array.isArray(this.input_etc_file.value)){
          for (let i = 0; i < this.input_etc_file.value.length; i++){
            fileNames.push(this.input_etc_file.value[i].name);
          }
        }
        // 파일명 중복 체크
        fileNames.sort();
        for (let i = 0; i < fileNames.length - 1; i++){
          if (fileNames[i] === fileNames[i + 1]){
            mux.Util.showAlert('중복되는 이름의 파일을 첨부할 수 없습니다.');
            return;
          }
        }

        let isRejected = false;
        if (this.origin_clickedProductCost.rejected_date){
          isRejected = true;
        }
        let needReConfirm = false;
        if (this.estimate_member_info[0].user_id !== this.$cookies.get(this.$configJson.cookies.id.key) && this.estimate_member_info[0].checked_date){
          if (!await mux.Util.showConfirm('확인 절차가 다시 진행됩니다. 수정하시겠습니까?')){
            return;
          }
          needReConfirm = true;
        }

        const newDate = new Date();

        let sendDataCheckedDate = '';
        if (this.estimate_member_info[0].user_id === this.$cookies.get(this.$configJson.cookies.id.key)){
          sendDataCheckedDate = mux.Date.format(newDate, 'yyyy-MM-dd HH:mm:ss');
        }else {
          sendDataCheckedDate = null;
        }

        const new_cost_calc_code = mux.Date.format(newDate, 'yyyy-MM-dd HH-mm-ss-fff') + '_' + this.$cookies.get(this.$configJson.cookies.id.key);

        let sendData = {
          "design_confirmation_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{
              "cost_calc_code": new_cost_calc_code,
              // "issue_date": this.input_issue_date.value,
              // "company_bid_number": this.input_company_bid_number.value,
              // "due_date": this.input_due_date.value,
              // "delivery_condition": this.input_delivery_condition.value,
              // "service_name": this.input_service_name.value,
              // "service_period": this.input_service_period.value,
              // "remark": this.input_remark.value,
              // "company_name": this.input_company_name.value,
              // "company_manager": this.input_company_manager.value,
              // "company_manager_email": this.input_company_manager_email.value,
              // "company_manager_phone": this.input_company_manager_phone.value,
              "approval_phase": sendDataCheckedDate === null ? '미확인' : '미승인',
              "approved_date": null,
              "checker": this.estimate_member_info[0].name,
              "checker_id": this.estimate_member_info[0].user_id,
              "checked_date": sendDataCheckedDate,
              "approver": this.estimate_member_info[1].name,
              "approver_id": this.estimate_member_info[1].user_id,
              "rejecter": '',
              "rejected_date": null,
              "reject_reason": '',
            },
            "update_where": {"cost_calc_code": this.origin_clickedProductCost.cost_calc_code},
            "rollback": "yes"
          }],
          "design_cost_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.origin_clickedProductCost.cost_calc_code},
            "rollback": "yes"
          }],
          "design_cost_calc_detail_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.origin_clickedProductCost.cost_calc_code},
            "rollback": "no"
          }],
          "design_construction_detail_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.origin_clickedProductCost.cost_calc_code},
            "rollback": "no"
          }],
          "design_labor_cost_calc_detail_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.origin_clickedProductCost.cost_calc_code},
            "rollback": "yes"
          }],
          "purchase_confirmation_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.origin_clickedProductCost.cost_calc_code},
            "rollback": "no"
          }],
        };

        sendData.path = '/api/multipart_rest_api/';
        sendData.prefix = new_cost_calc_code + '_';
        sendData.files = [];

        if (this.input_layout_file.value){
          sendData['design_confirmation_table-update'][0].data.layout_file = new_cost_calc_code + '_' + this.input_layout_file.value.name;
          sendData['design_confirmation_table-update'][0].data.layout_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_layout_file.value, 1, false, 1000, 1000));
          sendData.files.push({
            "folder": "design/layout",
            "file": this.input_layout_file.value,
            "name": this.input_layout_file.value.name
          });
        }
        if (this.input_structure_file.value){
          sendData['design_confirmation_table-update'][0].data.structure_file = new_cost_calc_code + '_' + this.input_structure_file.value.name;
          sendData['design_confirmation_table-update'][0].data.structure_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_structure_file.value, 1, false, 1000, 1000));
          sendData.files.push({
            "folder": "design/structure",
            "file": this.input_structure_file.value,
            "name": this.input_structure_file.value.name
          });
        }
        if (this.input_single_line_file.value){
          sendData['design_confirmation_table-update'][0].data.single_line_file = new_cost_calc_code + '_' + this.input_single_line_file.value.name;
          sendData['design_confirmation_table-update'][0].data.single_line_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_single_line_file.value, 1, false, 1000, 1000));
          sendData.files.push({
            "folder": "design/single_line",
            "file": this.input_single_line_file.value,
            "name": this.input_single_line_file.value.name
          });
        }
        if (this.input_trilinear_file.value){
          sendData['design_confirmation_table-update'][0].data.trilinear_file = new_cost_calc_code + '_' + this.input_trilinear_file.value.name;
          sendData['design_confirmation_table-update'][0].data.trilinear_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_trilinear_file.value, 1, false, 1000, 1000));
          sendData.files.push({
            "folder": "design/trilinear",
            "file": this.input_trilinear_file.value,
            "name": this.input_trilinear_file.value.name
          });
        }
        if (this.input_circuit_file.value){
          sendData['design_confirmation_table-update'][0].data.circuit_file = new_cost_calc_code + '_' + this.input_circuit_file.value.name;
          sendData['design_confirmation_table-update'][0].data.circuit_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_circuit_file.value, 1, false, 1000, 1000));
          sendData.files.push({
            "folder": "design/circuit",
            "file": this.input_circuit_file.value,
            "name": this.input_circuit_file.value.name
          });
        }
        if (this.input_approval_file.value){
          sendData['design_confirmation_table-update'][0].data.approval_file = new_cost_calc_code + '_' + this.input_approval_file.value.name;
          sendData['design_confirmation_table-update'][0].data.approval_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_approval_file.value, 1, false, 1000, 1000));
          sendData.files.push({
            "folder": "design/approval",
            "file": this.input_approval_file.value,
            "name": this.input_approval_file.value.name
          });
        }
        if (this.input_build_sheet_file.value){
          sendData['design_confirmation_table-update'][0].data.build_sheet_file = new_cost_calc_code + '_' + this.input_build_sheet_file.value.name;
          sendData['design_confirmation_table-update'][0].data.build_sheet_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_build_sheet_file.value, 1, false, 1000, 1000));
          sendData.files.push({
            "folder": "design/build_sheet",
            "file": this.input_build_sheet_file.value,
            "name": this.input_build_sheet_file.value.name
          });
        }
        if (this.input_etc_file.value && this.input_etc_file.value.length > 0){
          sendData['design_confirmation_table-update'][0].data.etc_files = this.input_etc_file.value.map(x=>new_cost_calc_code + '_' + x.name).join('/');
          this.input_etc_file.value.forEach(file => {
            sendData.files.push({
              "folder": "design/files",
              "file": file,
              "name": file.name
            });
          });
        }

        const prevURL = window.location.href;
        try {
          mux.Util.showLoading();
          let result = await mux.Server.uploadFile(sendData);
          if (prevURL !== window.location.href) return;

          if (typeof result === 'string'){
            result = JSON.parse(result);
          }
          if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

            this.estimate_member_info[0].checked_date = sendDataCheckedDate !== null ? sendDataCheckedDate : '';
            const newLayoutFile = this.estimateFilesInputs.find(x=>x.column_name === 'layout').value;
            const newStructureFile = this.estimateFilesInputs.find(x=>x.column_name === 'structure').value;
            const newSingleLineFile = this.estimateFilesInputs.find(x=>x.column_name === 'single_line').value;
            const newTrilinearFile = this.estimateFilesInputs.find(x=>x.column_name === 'trilinear').value;
            const newCircuitFile = this.estimateFilesInputs.find(x=>x.column_name === 'circuit').value;
            const newApprovalFile = this.estimateFilesInputs2.find(x=>x.column_name === 'approval').value;
            const newBuildSheetFile = this.estimateFilesInputs2.find(x=>x.column_name === 'build_sheet').value;
            const newEtcFiles = this.estimateFilesInputs2.find(x=>x.column_name === 'files').value;

            let targetConfirmation = this.searched_datas.confirmation.find(item => item.cost_calc_code === this.origin_clickedProductCost.cost_calc_code);
            targetConfirmation.cost_calc_code = new_cost_calc_code;
            this.searched_datas.last_design_confirmation.find(x=>x.cost_calc_code === this.origin_clickedProductCost.cost_calc_code).cost_calc_code = new_cost_calc_code;
            this.searched_datas.product_cost_calc_detail.forEach(item => {
              if (item.cost_calc_code === this.origin_clickedProductCost.cost_calc_code){
                item.cost_calc_code = new_cost_calc_code;
              }
            });
            this.searched_datas.construction_materials_data.forEach(item => {
              if (item.cost_calc_code === this.origin_clickedProductCost.cost_calc_code){
                item.cost_calc_code = new_cost_calc_code;
              }
            });
            this.searched_datas.labor_cost_calc_detail.forEach(item => {
              if (item.cost_calc_code === this.origin_clickedProductCost.cost_calc_code){
                item.cost_calc_code = new_cost_calc_code;
              }
            });
            targetConfirmation.modified_time = mux.Date.format(newDate, 'yyyy-MM-dd HH:mm:ss');
            targetConfirmation.checked_date = `${this.estimate_member_info[0].checked_date}`;
            targetConfirmation.checker = `${this.estimate_member_info[0].name}`;
            targetConfirmation.checker_id = `${this.estimate_member_info[0].user_id}`;
            targetConfirmation.approver = `${this.estimate_member_info[1].name}`;
            targetConfirmation.approver_id = `${this.estimate_member_info[1].user_id}`;
            targetConfirmation.approval_phase = sendDataCheckedDate === null ? '미확인' : '미승인';
            targetConfirmation.rejecter = '';
            targetConfirmation.rejected_date = '';
            targetConfirmation.reject_reason = '';
            targetConfirmation.issue_date = `${this.input_issue_date.value}`;
            targetConfirmation.company_bid_number = `${this.input_company_bid_number.value}`;
            targetConfirmation.due_date = `${this.input_due_date.value}`;
            targetConfirmation.delivery_condition = `${this.input_delivery_condition.value}`;
            targetConfirmation.service_name = `${this.input_service_name.value}`;
            targetConfirmation.service_period = `${this.input_service_period.value}`;
            targetConfirmation.remark = `${this.input_remark.value}`;
            targetConfirmation.company_name = `${this.input_company_name.value}`;
            targetConfirmation.company_manager = `${this.input_company_manager.value}`;
            targetConfirmation.company_manager_email = `${this.input_company_manager_email.value}`;
            targetConfirmation.company_manager_phone = `${this.input_company_manager_phone.value}`;
            if (newLayoutFile){
              targetConfirmation.layout_file = `${new_cost_calc_code + '_' + newLayoutFile.name}`;
              targetConfirmation.layout_thumbnail = `${mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newLayoutFile, 1, false, 1000, 1000))}`;
            }
            if (newStructureFile){
              targetConfirmation.structure_file = `${new_cost_calc_code + '_' + newStructureFile.name}`;
              targetConfirmation.structure_thumbnail = `${mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newStructureFile, 1, false, 1000, 1000))}`;
            }
            if (newSingleLineFile){
              targetConfirmation.single_line_file = `${new_cost_calc_code + '_' + newSingleLineFile.name}`;
              targetConfirmation.single_line_thumbnail = `${mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newSingleLineFile, 1, false, 1000, 1000))}`;
            }
            if (newTrilinearFile){
              targetConfirmation.trilinear_file = `${new_cost_calc_code + '_' + newTrilinearFile.name}`;
              targetConfirmation.trilinear_thumbnail = `${mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newTrilinearFile, 1, false, 1000, 1000))}`;
            }
            if (newCircuitFile){
              targetConfirmation.circuit_file = `${new_cost_calc_code + '_' + newCircuitFile.name}`;
              targetConfirmation.circuit_thumbnail = `${mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newCircuitFile, 1, false, 1000, 1000))}`;
            }
            if (newApprovalFile){
              targetConfirmation.approval_file = `${new_cost_calc_code + '_' + newApprovalFile.name}`;
              targetConfirmation.approval_thumbnail = `${mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newApprovalFile, 1, false, 1000, 1000))}`;
            }
            if (newBuildSheetFile){
              targetConfirmation.build_sheet_file = `${new_cost_calc_code + '_' + newBuildSheetFile.name}`;
              targetConfirmation.build_sheet_thumbnail = `${mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newBuildSheetFile, 1, false, 1000, 1000))}`;
            }
            if (newEtcFiles && newEtcFiles.length > 0){
              targetConfirmation.etc_files = `${newEtcFiles.map(x=>new_cost_calc_code + '_' + x.name).join('/')}`;
            }

            this.clickedProductCost.modified_time = mux.Date.format(newDate, 'yyyy-MM-dd HH:mm:ss');
            this.clickedProductCost.checked_date = this.estimate_member_info[0].checked_date;
            this.clickedProductCost.checker = this.estimate_member_info[0].name;
            this.clickedProductCost.checker_id = this.estimate_member_info[0].user_id;
            this.clickedProductCost.approver = this.estimate_member_info[1].name;
            this.clickedProductCost.approver_id = this.estimate_member_info[1].user_id;
            this.clickedProductCost.approval_phase = sendDataCheckedDate === null ? '미확인' : '미승인';
            this.clickedProductCost.rejecter = '';
            this.clickedProductCost.rejected_date = '';
            this.clickedProductCost.reject_reason = '';

            this.clickedProductCost.issue_date = this.input_issue_date.value;
            this.clickedProductCost.company_bid_number = this.input_company_bid_number.value;
            this.clickedProductCost.due_date = this.input_due_date.value;
            this.clickedProductCost.delivery_condition = this.input_delivery_condition.value;
            this.clickedProductCost.service_name = this.input_service_name.value;
            this.clickedProductCost.service_period = this.input_service_period.value;
            this.clickedProductCost.remark = this.input_remark.value;
            this.clickedProductCost.company_name = this.input_company_name.value;
            this.clickedProductCost.company_manager = this.input_company_manager.value;
            this.clickedProductCost.company_manager_email = this.input_company_manager_email.value;
            this.clickedProductCost.company_manager_phone = this.input_company_manager_phone.value;

            if (newLayoutFile){
              this.clickedProductCost.layout_file = new_cost_calc_code + '_' + newLayoutFile.name;
              this.clickedProductCost.layout_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newLayoutFile, 1, false, 1000, 1000));
            }
            if (newStructureFile){
              this.clickedProductCost.structure_file = new_cost_calc_code + '_' + newStructureFile.name;
              this.clickedProductCost.structure_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newStructureFile, 1, false, 1000, 1000));
            }
            if (newSingleLineFile){
              this.clickedProductCost.single_line_file = new_cost_calc_code + '_' + newSingleLineFile.name;
              this.clickedProductCost.single_line_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newSingleLineFile, 1, false, 1000, 1000));
            }
            if (newTrilinearFile){
              this.clickedProductCost.trilinear_file = new_cost_calc_code + '_' + newTrilinearFile.name;
              this.clickedProductCost.trilinear_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newTrilinearFile, 1, false, 1000, 1000));
            }
            if (newCircuitFile){
              this.clickedProductCost.circuit_file = new_cost_calc_code + '_' + newCircuitFile.name;
              this.clickedProductCost.circuit_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newCircuitFile, 1, false, 1000, 1000));
            }
            if (newApprovalFile){
              this.clickedProductCost.approval_file = new_cost_calc_code + '_' + newApprovalFile.name;
              this.clickedProductCost.approval_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newApprovalFile, 1, false, 1000, 1000));
            }
            if (newBuildSheetFile){
              this.clickedProductCost.build_sheet_file = new_cost_calc_code + '_' + newBuildSheetFile.name;
              this.clickedProductCost.build_sheet_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newBuildSheetFile, 1, false, 1000, 1000));
            }
            if (newEtcFiles && newEtcFiles.length > 0){
              this.clickedProductCost.etc_files = newEtcFiles.map(x=>new_cost_calc_code + '_' + x.name).join('/');
            }

            this.clickedProductCost.cost_calc_code = new_cost_calc_code;

            this.origin_clickedProductCost = this.clickedProductCost;
            this.edit_estimate_info_disabled = true;
            this.during_edit = false;

            if (isRejected || needReConfirm){
              //메일 알림 관련
              let mailTo = [];
              // let creater = this.$cookies.get(this.$configJson.cookies.id.key);
              if(sendDataCheckedDate === null){
                mailTo.push(this.clickedProductCost.checker_id);
              }else {
                mailTo.push(this.clickedProductCost.approver_id);
              }

              // 메일 본문 내용
              let content=`
              <html>
                <body>
                  <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                    <h2 style="text-align: center; color:#13428a">설계 ${sendDataCheckedDate === null ? '확인' : '승인'} 요청 알림</h2>
                    <table style="width: 100%;border-spacing: 10px 10px;">
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.project_code}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">사내 견적번호</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.inhouse_bid_number}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">발행일</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.issue_date}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.given_name}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">확인자</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.checker}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">승인자</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.approver}</td>
                      </tr>
                    </table>
                    <a style="color: white; text-decoration:none"href="${prevURL}-search?project_code=${this.clickedProductCost.project_code}&inhouse_bid_number=${this.clickedProductCost.inhouse_bid_number}&company_bid_number=${this.clickedProductCost.company_bid_number}&company_name=${this.clickedProductCost.company_name}&issue_date=${this.clickedProductCost.issue_date}">
                      <p style="cursor:pointer; background: #13428a;color: white;font-weight: bold;padding: 13px;border-radius: 40px;font-size: 16px;text-align: center;margin-top: 25px; margin-bottom: 40px;">
                        확인하기
                      </p>
                    </a>
                  </div>
                </body>
              </html>
              `;

              try {
                let sendEmailAlam = await mux.Server.post({
                  path: '/api/send_email/',
                  to_addrs: mailTo,
                  subject: "설계 " + (sendDataCheckedDate === null ? '확인' : '승인') + " 요청 알림",
                  content: content
                });
                if (prevURL !== window.location.href) return;
                if(sendEmailAlam['code'] == 0 || (typeof sendEmailAlam['data'] === 'object' && sendEmailAlam['data']['code'] == 0) || (typeof sendEmailAlam['response'] === 'object' && typeof sendEmailAlam['response']['data'] === 'object' && sendEmailAlam['response']['data']['code'] == 0)){
                  mux.Util.showAlert('수정되었습니다.', '수정 완료', 3000);
                } else {
                  if (prevURL !== window.location.href) return;
                  console.log('알림 메일 전송에 실패-sendEmailAlam :>> ', sendEmailAlam);
                  mux.Util.showAlert('수정되었으나 알림 메일 전송에 실패하였습니다.', '수정 완료');
                }
              } catch (error) {
                if (prevURL !== window.location.href) return;
                console.log('알림 메일 전송에 실패-error :>> ', error);
                mux.Util.showAlert('수정되었으나 알림 메일 전송에 실패하였습니다.', '수정 완료');
              }
            }else {
              mux.Util.showAlert('수정되었습니다.', '수정 완료', 3000);
            }

          } else {
            if (prevURL !== window.location.href) return;
            mux.Util.showAlert(result);
          }
        } catch (error) {
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(error);
        }
        mux.Util.hideLoading();

      }

    },

    async surveyCostNumEditSave() {
      // 유효성 검사
      const validate = this.$refs.surveyCostForm.validate();
      if(validate) {

        let isRejected = false;
        if (this.clickedProductCost.rejected_date){
          isRejected = true;
        }
        let needReConfirm = false;
        if (this.estimate_member_info[0].user_id !== this.$cookies.get(this.$configJson.cookies.id.key) && this.estimate_member_info[0].checked_date){
          if (!await mux.Util.showConfirm('확인 절차가 다시 진행됩니다. 수정하시겠습니까?')){
            return;
          }
          needReConfirm = true;
        }

        const newDate = new Date();

        let sendDataCheckedDate = '';
        if (this.estimate_member_info[0].user_id === this.$cookies.get(this.$configJson.cookies.id.key)){
          sendDataCheckedDate = mux.Date.format(newDate, 'yyyy-MM-dd HH:mm:ss');
        }else {
          sendDataCheckedDate = null;
        }

        const new_cost_calc_code = mux.Date.format(newDate, 'yyyy-MM-dd HH-mm-ss-fff') + '_' + this.$cookies.get(this.$configJson.cookies.id.key);

        let sendData = {
          "design_confirmation_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{
              "cost_calc_code": new_cost_calc_code,
              "approval_phase": sendDataCheckedDate === null ? '미확인' : '미승인',
              "checked_date": sendDataCheckedDate,
              "rejecter": '',
              "rejected_date": null,
              "reject_reason": '',
            },
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "yes"
          }],
          "design_cost_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{
              "cost_calc_code": new_cost_calc_code,
              "employment_insurance_num": this.calc_cost_detail_data_employment_insurance.cost_num,
              "tool_rent_fee_num": this.calc_cost_detail_data_tool_rent_fee.cost_num,
              "transportation_fee_num": this.calc_cost_detail_data_transportation_fee.cost_num,
              "industrial_accident_num": this.calc_cost_detail_data_industrial_accident.cost_num,
              "taxes_dues_num": this.calc_cost_detail_data_taxes_dues.cost_num,
              "welfare_benefits_num": this.calc_cost_detail_data_welfare_benefits.cost_num,
              "retirement_num": this.calc_cost_detail_data_retirement.cost_num,
              "expendables_num": this.calc_cost_detail_data_expendables.cost_num,
              "industrial_safety_num": this.calc_cost_detail_data_industrial_safety.cost_num,
              "normal_maintenance_fee_num": this.calc_cost_detail_data_normal_maintenance_fee.cost_num,
              "profite_num": this.calc_cost_detail_data_profite.cost_num,
            },
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "yes"
          }],
          // "design_cost_calc_detail_table-delete": [{
          //   "user_info": {
          //     "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
          //     "role": "modifier"
          //   },
          //   "data":{},
          //   "delete_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
          //   "rollback": "no"
          // }],
          "design_construction_detail_table-delete": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{},
            "delete_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "no"
          }],
          "design_labor_cost_calc_detail_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "yes"
          }],
          "purchase_confirmation_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "no"
          }],
          // "design_cost_calc_detail_table-insert": [],
          "design_cost_calc_detail_table-update": [],
          "design_construction_detail_table-insert": [],
        };

        const new_product_cost_calc_detail = {};
        const new_construction_materials_data = [];
        if (this.clickedProductCost.obtain_type !== '기술료'){
          const product_cost_materials = this.calc_cost_detail_data_product_cost.belong_data.find(x=>x.cost_list && x.cost_list.includes('재료'));
          if (product_cost_materials){
            product_cost_materials.belong_data.forEach(data => {
              new_product_cost_calc_detail[data.product_code] = {
                cost_calc_code: new_cost_calc_code,
                // product_code: data.product_code,
                // product_name: data.cost_list,
                // product_spec: data.cost_list_sub,
                // product_num: data.cost_num,
                product_unit_price: data.cost_unit_price
              };
            });
            Object.keys(new_product_cost_calc_detail).forEach(key => {
              const data = new_product_cost_calc_detail[key];
              sendData["design_cost_calc_detail_table-update"].push({
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data": data,
                "update_where": {"cost_calc_code":  this.clickedProductCost.cost_calc_code, "product_code": key},
                "rollback": "yes"
              });
            });
          }

          const product_cost_construction_materials = this.calc_cost_detail_data_product_cost.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재'));
          if (product_cost_construction_materials){
            product_cost_construction_materials.belong_data.forEach(data => {
              new_construction_materials_data.push(
                {
                  cost_calc_code: new_cost_calc_code,
                  construction_materials: data.cost_list,
                  construction_materials_num: data.cost_num,
                  construction_materials_unit_price: data.cost_unit_price,
                }
              );
            });
            new_construction_materials_data.forEach(data => {
              sendData["design_construction_detail_table-insert"].push({
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data": data,
                "select_where": {"cost_calc_code": "!JUST_INSERT!"},
                "rollback": "no"
              });
            });
          }
        }

        const prevURL = window.location.href;
        try {
          mux.Util.showLoading();

          let result = await mux.Server.post({
            path: '/api/common_rest_api/',
            params: sendData
          });
          if (prevURL !== window.location.href) return;

          if (typeof result === 'string'){
            result = JSON.parse(result);
          }
          if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
            this.estimate_member_info[0].checked_date = sendDataCheckedDate !== null ? sendDataCheckedDate : '';
            let targetConfirmation = this.searched_datas.confirmation.find(item => item.cost_calc_code === this.clickedProductCost.cost_calc_code);
            targetConfirmation.modified_time = mux.Date.format(newDate, 'yyyy-MM-dd HH:mm:ss');
            targetConfirmation.checked_date = `${this.estimate_member_info[0].checked_date}`;
            targetConfirmation.approval_phase = sendDataCheckedDate === null ? '미확인' : '미승인';
            targetConfirmation.rejecter = '';
            targetConfirmation.rejected_date = '';
            targetConfirmation.reject_reason = '';

            this.origin_calc_cost_detail_data = JSON.parse(JSON.stringify(this.calc_cost_detail_data));
            // this.clickedProductCost.product = this.calc_cost_detail_data_product_cost.belong_data[0].cost_list;

            if (this.clickedProductCost.obtain_type !== '기술료'){
              const product_cost_materials = this.calc_cost_detail_data_product_cost.belong_data.find(x=>x.cost_list && x.cost_list.includes('재료'));
              // this.searched_datas.product_cost_calc_detail = this.searched_datas.product_cost_calc_detail.filter(item => item.cost_calc_code !== this.clickedProductCost.cost_calc_code);
              const new_product_cost_calc_detail = [];
              if (product_cost_materials){
                product_cost_materials.belong_data.forEach(data => {
                  new_product_cost_calc_detail.push(
                    {
                      product_code: data.product_code,
                      product_unit_price: data.cost_unit_price
                    }
                  );
                });
                // this.calc_cost_detail_data_product_cost.belong_data = this.calc_cost_detail_data_product_cost.belong_data.filter(x=>!x.cost_list.includes('재료'));
                this.searched_datas.product_cost_calc_detail = this.searched_datas.product_cost_calc_detail.map(item => {
                  if (item.cost_calc_code === this.clickedProductCost.cost_calc_code){
                    item.cost_calc_code = new_cost_calc_code;
                  }
                  new_product_cost_calc_detail.forEach(data => {
                    if (item.product_code === data.product_code){
                      item.product_unit_price = data.product_unit_price;
                    }
                  });
                  return item;
                });
              }

              const product_cost_construction_materials = this.calc_cost_detail_data_product_cost.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재'));
              this.searched_datas.construction_materials_data = this.searched_datas.construction_materials_data.filter(item => item.cost_calc_code !== this.clickedProductCost.cost_calc_code);
              const new_construction_materials_data = [];
              if (product_cost_construction_materials){
                product_cost_construction_materials.belong_data.forEach(data => {
                  new_construction_materials_data.push(
                    {
                      cost_calc_code: new_cost_calc_code,
                      construction_materials: data.cost_list,
                      construction_materials_num: data.cost_num,
                      construction_materials_unit_price: data.cost_unit_price,
                    }
                  );
                });
                this.calc_cost_detail_data_product_cost.belong_data = this.calc_cost_detail_data_product_cost.belong_data.filter(x=>!x.cost_list.includes('공사 자재'));
                this.searched_datas.construction_materials_data.push(...new_construction_materials_data);
              }
            }else if (this.clickedProductCost.obtain_type === '기술료'){

              this.searched_datas.technical_fee_data = this.searched_datas.technical_fee_data.filter(item => item.cost_calc_code !== this.clickedProductCost.cost_calc_code);
              const new_technical_fee_data = [];
              this.calc_cost_detail_data_product_cost.belong_data.forEach(data => {
                new_technical_fee_data.push(
                  {
                    cost_calc_code: new_cost_calc_code,
                    technical_fee: data.cost_list,
                    technical_fee_num: data.cost_num,
                    technical_fee_unit_price: data.cost_unit_price,
                  }
                );
              });
              this.calc_cost_detail_data_product_cost.belong_data = [];
              this.searched_datas.technical_fee_data.push(...new_technical_fee_data);
            }

            targetConfirmation.cost_calc_code = new_cost_calc_code;
            this.searched_datas.last_design_confirmation.find(x=>x.cost_calc_code === this.clickedProductCost.cost_calc_code).cost_calc_code = new_cost_calc_code;
            this.searched_datas.labor_cost_calc_detail.forEach(item => {
              if (item.cost_calc_code === this.clickedProductCost.cost_calc_code){
                item.cost_calc_code = new_cost_calc_code;
              }
            });

            this.clickedProductCost.modified_time = mux.Date.format(newDate, 'yyyy-MM-dd HH:mm:ss');
            this.clickedProductCost.checked_date = this.estimate_member_info[0].checked_date;
            this.clickedProductCost.approval_phase = sendDataCheckedDate === null ? '미확인' : '미승인';
            this.clickedProductCost.rejecter = '';
            this.clickedProductCost.rejected_date = '';
            this.clickedProductCost.reject_reason = '';
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
            this.clickedProductCost.cost_calc_code = new_cost_calc_code;

            this.searchDataCalcProcess(this.searched_datas);

            this.edit_survey_cost_num_disabled = true;
            this.during_edit = false;

            if (isRejected || needReConfirm){
              //메일 알림 관련
              let mailTo = [];
              // let creater = this.$cookies.get(this.$configJson.cookies.id.key);
              if(sendDataCheckedDate === null){
                mailTo.push(this.clickedProductCost.checker_id);
              }else {
                mailTo.push(this.clickedProductCost.approver_id);
              }

              // 메일 본문 내용
              let content=`
              <html>
                <body>
                  <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                    <h2 style="text-align: center; color:#13428a">설계 ${sendDataCheckedDate === null ? '확인' : '승인'} 요청 알림</h2>
                    <table style="width: 100%;border-spacing: 10px 10px;">
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.project_code}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">사내 견적번호</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.inhouse_bid_number}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">발행일</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.issue_date}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.given_name}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">확인자</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.checker}</td>
                      </tr>
                      <tr>
                        <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">승인자</td>
                        <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.approver}</td>
                      </tr>
                    </table>
                    <a style="color: white; text-decoration:none"href="${prevURL}-search?project_code=${this.clickedProductCost.project_code}&inhouse_bid_number=${this.clickedProductCost.inhouse_bid_number}&company_bid_number=${this.clickedProductCost.company_bid_number}&company_name=${this.clickedProductCost.company_name}&issue_date=${this.clickedProductCost.issue_date}">
                      <p style="cursor:pointer; background: #13428a;color: white;font-weight: bold;padding: 13px;border-radius: 40px;font-size: 16px;text-align: center;margin-top: 25px; margin-bottom: 40px;">
                        확인하기
                      </p>
                    </a>
                  </div>
                </body>
              </html>
              `;

              try {
                let sendEmailAlam = await mux.Server.post({
                  path: '/api/send_email/',
                  to_addrs: mailTo,
                  subject: "설계 " + (sendDataCheckedDate === null ? '확인' : '승인') + " 요청 알림",
                  content: content
                });
                if (prevURL !== window.location.href) return;
                if(sendEmailAlam['code'] == 0 || (typeof sendEmailAlam['data'] === 'object' && sendEmailAlam['data']['code'] == 0) || (typeof sendEmailAlam['response'] === 'object' && typeof sendEmailAlam['response']['data'] === 'object' && sendEmailAlam['response']['data']['code'] == 0)){
                  mux.Util.showAlert('수정되었습니다.', '수정 완료', 3000);
                } else {
                  if (prevURL !== window.location.href) return;
                  console.log('알림 메일 전송에 실패-sendEmailAlam :>> ', sendEmailAlam);
                  mux.Util.showAlert('수정되었으나 알림 메일 전송에 실패하였습니다.', '수정 완료');
                }
              } catch (error) {
                if (prevURL !== window.location.href) return;
                console.log('알림 메일 전송에 실패-error :>> ', error);
                mux.Util.showAlert('수정되었으나 알림 메일 전송에 실패하였습니다.', '수정 완료');
              }
            }else {
              mux.Util.showAlert('수정되었습니다.', '수정 완료', 3000);
            }

          } else {
            if (prevURL !== window.location.href) return;
            mux.Util.showAlert(result);
          }
        } catch (error) {
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(error);
        }
        mux.Util.hideLoading();

      }

    },

    // async surveyCostNumEditSave() {
    //   // 유효성 검사
    //   const validate = this.$refs.surveyCostForm.validate();
    //   if(validate) {

    //     let isRejected = false;
    //     if (this.clickedProductCost.rejected_date){
    //       isRejected = true;
    //     }
    //     let needReConfirm = false;
    //     if (this.estimate_member_info[0].user_id !== this.$cookies.get(this.$configJson.cookies.id.key) && this.estimate_member_info[0].checked_date){
    //       if (!await mux.Util.showConfirm('확인 절차가 다시 진행됩니다. 수정하시겠습니까?')){
    //         return;
    //       }
    //       needReConfirm = true;
    //     }

    //     const newDate = new Date();

    //     let sendDataCheckedDate = '';
    //     if (this.estimate_member_info[0].user_id === this.$cookies.get(this.$configJson.cookies.id.key)){
    //       sendDataCheckedDate = mux.Date.format(newDate, 'yyyy-MM-dd HH:mm:ss');
    //     }else {
    //       sendDataCheckedDate = null;
    //     }

    //     const new_cost_calc_code = mux.Date.format(newDate, 'yyyy-MM-dd HH-mm-ss-fff') + '_' + this.$cookies.get(this.$configJson.cookies.id.key);

    //     let sendData = {
    //       "design_confirmation_table-update": [{
    //         "user_info": {
    //           "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
    //           "role": "modifier"
    //         },
    //         "data":{
    //           "cost_calc_code": new_cost_calc_code,
    //           "approval_phase": sendDataCheckedDate === null ? '미확인' : '미승인',
    //           "checked_date": sendDataCheckedDate,
    //           "rejecter": '',
    //           "rejected_date": null,
    //           "reject_reason": '',
    //         },
    //         "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
    //         "rollback": "yes"
    //       }],
    //       "design_cost_table-update": [{
    //         "user_info": {
    //           "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
    //           "role": "modifier"
    //         },
    //         "data":{
    //           "cost_calc_code": new_cost_calc_code,
    //           "employment_insurance_num": this.calc_cost_detail_data_employment_insurance.cost_num,
    //           "tool_rent_fee_num": this.calc_cost_detail_data_tool_rent_fee.cost_num,
    //           "transportation_fee_num": this.calc_cost_detail_data_transportation_fee.cost_num,
    //           "industrial_accident_num": this.calc_cost_detail_data_industrial_accident.cost_num,
    //           "taxes_dues_num": this.calc_cost_detail_data_taxes_dues.cost_num,
    //           "welfare_benefits_num": this.calc_cost_detail_data_welfare_benefits.cost_num,
    //           "retirement_num": this.calc_cost_detail_data_retirement.cost_num,
    //           "expendables_num": this.calc_cost_detail_data_expendables.cost_num,
    //           "industrial_safety_num": this.calc_cost_detail_data_industrial_safety.cost_num,
    //           "normal_maintenance_fee_num": this.calc_cost_detail_data_normal_maintenance_fee.cost_num,
    //           "profite_num": this.calc_cost_detail_data_profite.cost_num,
    //         },
    //         "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
    //         "rollback": "yes"
    //       }],
    //       "design_cost_calc_detail_table-delete": [{
    //         "user_info": {
    //           "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
    //           "role": "modifier"
    //         },
    //         "data":{},
    //         "delete_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
    //         "rollback": "no"
    //       }],
    //       "design_construction_detail_table-delete": [{
    //         "user_info": {
    //           "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
    //           "role": "modifier"
    //         },
    //         "data":{},
    //         "delete_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
    //         "rollback": "no"
    //       }],
    //       "design_labor_cost_calc_detail_table-update": [{
    //         "user_info": {
    //           "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
    //           "role": "modifier"
    //         },
    //         "data":{"cost_calc_code": new_cost_calc_code},
    //         "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
    //         "rollback": "yes"
    //       }],
    //       "purchase_confirmation_table-update": [{
    //         "user_info": {
    //           "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
    //           "role": "modifier"
    //         },
    //         "data":{"cost_calc_code": new_cost_calc_code},
    //         "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
    //         "rollback": "no"
    //       }],
    //       "design_cost_calc_detail_table-insert": [],
    //       "design_construction_detail_table-insert": [],
    //     };

    //     const new_product_cost_calc_detail = [];
    //     const new_construction_materials_data = [];
    //     if (this.clickedProductCost.obtain_type !== '기술료'){
    //       const product_cost_materials = this.calc_cost_detail_data_product_cost.belong_data.find(x=>x.cost_list && x.cost_list.includes('재료'));
    //       if (product_cost_materials){
    //         product_cost_materials.belong_data.forEach(data => {
    //           new_product_cost_calc_detail.push(
    //             {
    //               cost_calc_code: new_cost_calc_code,
    //               product_code: data.product_code,
    //               product_name: data.cost_list,
    //               product_spec: data.cost_list_sub,
    //               product_num: data.cost_num,
    //               product_unit_price: data.cost_unit_price
    //             }
    //           );
    //         });
    //         new_product_cost_calc_detail.forEach(data => {
    //           sendData["design_cost_calc_detail_table-insert"].push({
    //             "user_info": {
    //               "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
    //               "role": "creater"
    //             },
    //             "data": data,
    //             "select_where": {"cost_calc_code": new_cost_calc_code, "product_code": data.product_code},
    //             "rollback": "yes"
    //           });
    //         });
    //       }

    //       const product_cost_construction_materials = this.calc_cost_detail_data_product_cost.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재'));
    //       if (product_cost_construction_materials){
    //         product_cost_construction_materials.belong_data.forEach(data => {
    //           new_construction_materials_data.push(
    //             {
    //               cost_calc_code: new_cost_calc_code,
    //               construction_materials: data.cost_list,
    //               construction_materials_num: data.cost_num,
    //               construction_materials_unit_price: data.cost_unit_price,
    //             }
    //           );
    //         });
    //         new_construction_materials_data.forEach(data => {
    //           sendData["design_construction_detail_table-insert"].push({
    //             "user_info": {
    //               "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
    //               "role": "creater"
    //             },
    //             "data": data,
    //             "select_where": {"cost_calc_code": "!JUST_INSERT!"},
    //             "rollback": "no"
    //           });
    //         });
    //       }
    //     }

    //     const prevURL = window.location.href;
    //     try {
    //       mux.Util.showLoading();

    //       let result = await mux.Server.post({
    //         path: '/api/common_rest_api/',
    //         params: sendData
    //       });
    //       if (prevURL !== window.location.href) return;

    //       if (typeof result === 'string'){
    //         result = JSON.parse(result);
    //       }
    //       if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
    //         this.estimate_member_info[0].checked_date = sendDataCheckedDate !== null ? sendDataCheckedDate : '';
    //         let targetConfirmation = this.searched_datas.confirmation.find(item => item.cost_calc_code === this.clickedProductCost.cost_calc_code);
    //         targetConfirmation.modified_time = mux.Date.format(newDate, 'yyyy-MM-dd HH:mm:ss');
    //         targetConfirmation.checked_date = `${this.estimate_member_info[0].checked_date}`;
    //         targetConfirmation.approval_phase = sendDataCheckedDate === null ? '미확인' : '미승인';
    //         targetConfirmation.rejecter = '';
    //         targetConfirmation.rejected_date = '';
    //         targetConfirmation.reject_reason = '';

    //         this.origin_calc_cost_detail_data = JSON.parse(JSON.stringify(this.calc_cost_detail_data));
    //         // this.clickedProductCost.product = this.calc_cost_detail_data_product_cost.belong_data[0].cost_list;

    //         if (this.clickedProductCost.obtain_type !== '기술료'){
    //           const product_cost_materials = this.calc_cost_detail_data_product_cost.belong_data.find(x=>x.cost_list && x.cost_list.includes('재료'));
    //           this.searched_datas.product_cost_calc_detail = this.searched_datas.product_cost_calc_detail.filter(item => item.cost_calc_code !== this.clickedProductCost.cost_calc_code);
    //           const new_product_cost_calc_detail = [];
    //           if (product_cost_materials){
    //             product_cost_materials.belong_data.forEach(data => {
    //               new_product_cost_calc_detail.push(
    //                 {
    //                   cost_calc_code: new_cost_calc_code,
    //                   product_name: data.cost_list,
    //                   product_spec: data.cost_list_sub,
    //                   product_num: data.cost_num,
    //                   product_unit_price: data.cost_unit_price
    //                 }
    //               );
    //             });
    //             this.calc_cost_detail_data_product_cost.belong_data = this.calc_cost_detail_data_product_cost.belong_data.filter(x=>!x.cost_list.includes('재료'));
    //             this.searched_datas.product_cost_calc_detail.push(...new_product_cost_calc_detail);
    //           }

    //           const product_cost_construction_materials = this.calc_cost_detail_data_product_cost.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재'));
    //           this.searched_datas.construction_materials_data = this.searched_datas.construction_materials_data.filter(item => item.cost_calc_code !== this.clickedProductCost.cost_calc_code);
    //           const new_construction_materials_data = [];
    //           if (product_cost_construction_materials){
    //             product_cost_construction_materials.belong_data.forEach(data => {
    //               new_construction_materials_data.push(
    //                 {
    //                   cost_calc_code: new_cost_calc_code,
    //                   construction_materials: data.cost_list,
    //                   construction_materials_num: data.cost_num,
    //                   construction_materials_unit_price: data.cost_unit_price,
    //                 }
    //               );
    //             });
    //             this.calc_cost_detail_data_product_cost.belong_data = this.calc_cost_detail_data_product_cost.belong_data.filter(x=>!x.cost_list.includes('공사 자재'));
    //             this.searched_datas.construction_materials_data.push(...new_construction_materials_data);
    //           }
    //         }else if (this.clickedProductCost.obtain_type === '기술료'){

    //           this.searched_datas.technical_fee_data = this.searched_datas.technical_fee_data.filter(item => item.cost_calc_code !== this.clickedProductCost.cost_calc_code);
    //           const new_technical_fee_data = [];
    //           this.calc_cost_detail_data_product_cost.belong_data.forEach(data => {
    //             new_technical_fee_data.push(
    //               {
    //                 cost_calc_code: new_cost_calc_code,
    //                 technical_fee: data.cost_list,
    //                 technical_fee_num: data.cost_num,
    //                 technical_fee_unit_price: data.cost_unit_price,
    //               }
    //             );
    //           });
    //           this.calc_cost_detail_data_product_cost.belong_data = [];
    //           this.searched_datas.technical_fee_data.push(...new_technical_fee_data);
    //         }

    //         targetConfirmation.cost_calc_code = new_cost_calc_code;
    //         this.searched_datas.last_design_confirmation.find(x=>x.cost_calc_code === this.clickedProductCost.cost_calc_code).cost_calc_code = new_cost_calc_code;
    //         this.searched_datas.labor_cost_calc_detail.forEach(item => {
    //           if (item.cost_calc_code === this.clickedProductCost.cost_calc_code){
    //             item.cost_calc_code = new_cost_calc_code;
    //           }
    //         });

    //         this.clickedProductCost.modified_time = mux.Date.format(newDate, 'yyyy-MM-dd HH:mm:ss');
    //         this.clickedProductCost.checked_date = this.estimate_member_info[0].checked_date;
    //         this.clickedProductCost.approval_phase = sendDataCheckedDate === null ? '미확인' : '미승인';
    //         this.clickedProductCost.rejecter = '';
    //         this.clickedProductCost.rejected_date = '';
    //         this.clickedProductCost.reject_reason = '';
    //         this.clickedProductCost.employment_insurance_num = this.calc_cost_detail_data_employment_insurance.cost_num;
    //         this.clickedProductCost.tool_rent_fee_num = this.calc_cost_detail_data_tool_rent_fee.cost_num;
    //         this.clickedProductCost.transportation_fee_num = this.calc_cost_detail_data_transportation_fee.cost_num;
    //         this.clickedProductCost.industrial_accident_num = this.calc_cost_detail_data_industrial_accident.cost_num;
    //         this.clickedProductCost.taxes_dues_num = this.calc_cost_detail_data_taxes_dues.cost_num;
    //         this.clickedProductCost.welfare_benefits_num = this.calc_cost_detail_data_welfare_benefits.cost_num;
    //         this.clickedProductCost.retirement_num = this.calc_cost_detail_data_retirement.cost_num;
    //         this.clickedProductCost.expendables_num = this.calc_cost_detail_data_expendables.cost_num;
    //         this.clickedProductCost.industrial_safety_num = this.calc_cost_detail_data_industrial_safety.cost_num;
    //         this.clickedProductCost.normal_maintenance_fee_num = this.calc_cost_detail_data_normal_maintenance_fee.cost_num;
    //         this.clickedProductCost.profite_num = this.calc_cost_detail_data_profite.cost_num;
    //         this.clickedProductCost.cost_calc_code = new_cost_calc_code;

    //         this.searchDataCalcProcess(this.searched_datas);

    //         this.edit_survey_cost_num_disabled = true;
    //         this.during_edit = false;

    //         if (isRejected || needReConfirm){
    //           //메일 알림 관련
    //           let mailTo = [];
    //           // let creater = this.$cookies.get(this.$configJson.cookies.id.key);
    //           if(sendDataCheckedDate === null){
    //             mailTo.push(this.clickedProductCost.checker_id);
    //           }else {
    //             mailTo.push(this.clickedProductCost.approver_id);
    //           }

    //           // 메일 본문 내용
    //           let content=`
    //           <html>
    //             <body>
    //               <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
    //                 <h2 style="text-align: center; color:#13428a">설계 ${sendDataCheckedDate === null ? '확인' : '승인'} 요청 알림</h2>
    //                 <table style="width: 100%;border-spacing: 10px 10px;">
    //                   <tr>
    //                     <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
    //                     <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.project_code}</td>
    //                   </tr>
    //                   <tr>
    //                     <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">사내 견적번호</td>
    //                     <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.inhouse_bid_number}</td>
    //                   </tr>
    //                   <tr>
    //                     <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">발행일</td>
    //                     <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.issue_date}</td>
    //                   </tr>
    //                   <tr>
    //                     <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
    //                     <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.given_name}</td>
    //                   </tr>
    //                   <tr>
    //                     <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">확인자</td>
    //                     <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.checker}</td>
    //                   </tr>
    //                   <tr>
    //                     <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">승인자</td>
    //                     <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.approver}</td>
    //                   </tr>
    //                 </table>
    //                 <a style="color: white; text-decoration:none"href="${prevURL}-search?project_code=${this.clickedProductCost.project_code}&inhouse_bid_number=${this.clickedProductCost.inhouse_bid_number}&company_bid_number=${this.clickedProductCost.company_bid_number}&company_name=${this.clickedProductCost.company_name}&issue_date=${this.clickedProductCost.issue_date}">
    //                   <p style="cursor:pointer; background: #13428a;color: white;font-weight: bold;padding: 13px;border-radius: 40px;font-size: 16px;text-align: center;margin-top: 25px; margin-bottom: 40px;">
    //                     확인하기
    //                   </p>
    //                 </a>
    //               </div>
    //             </body>
    //           </html>
    //           `;

    //           try {
    //             let sendEmailAlam = await mux.Server.post({
    //               path: '/api/send_email/',
    //               to_addrs: mailTo,
    //               subject: "설계 " + (sendDataCheckedDate === null ? '확인' : '승인') + " 요청 알림",
    //               content: content
    //             });
    //             if (prevURL !== window.location.href) return;
    //             if(sendEmailAlam['code'] == 0 || (typeof sendEmailAlam['data'] === 'object' && sendEmailAlam['data']['code'] == 0) || (typeof sendEmailAlam['response'] === 'object' && typeof sendEmailAlam['response']['data'] === 'object' && sendEmailAlam['response']['data']['code'] == 0)){
    //               mux.Util.showAlert('수정되었습니다.', '수정 완료', 3000);
    //             } else {
    //               if (prevURL !== window.location.href) return;
    //               console.log('알림 메일 전송에 실패-sendEmailAlam :>> ', sendEmailAlam);
    //               mux.Util.showAlert('수정되었으나 알림 메일 전송에 실패하였습니다.', '수정 완료');
    //             }
    //           } catch (error) {
    //             if (prevURL !== window.location.href) return;
    //             console.log('알림 메일 전송에 실패-error :>> ', error);
    //             mux.Util.showAlert('수정되었으나 알림 메일 전송에 실패하였습니다.', '수정 완료');
    //           }
    //         }else {
    //           mux.Util.showAlert('수정되었습니다.', '수정 완료', 3000);
    //         }

    //       } else {
    //         if (prevURL !== window.location.href) return;
    //         mux.Util.showAlert(result);
    //       }
    //     } catch (error) {
    //       if (prevURL !== window.location.href) return;
    //       mux.Util.showAlert(error);
    //     }
    //     mux.Util.hideLoading();

    //   }

    // },

    async save() {
      // const validate = this.$refs.estimateInfoForm2.validate();
      // if(!validate){
      //   mux.Util.showAlert('견적서 정보를 정확히 입력하여 주십시오.');
      //   this.tab_write = 0;
      //   return;
      // }
      // if (!this.input_layout_file2.value
      //     && !this.input_structure_file2.value
      //     && !this.input_single_line_file2.value
      //     && !this.input_trilinear_file2.value
      //     && !this.input_circuit_file2.value){
      //   mux.Util.showAlert('상세 도면을 1개 이상 첨부해야 합니다.');
      //   this.tab_write = 0;
      //   return;
      // }

      // // 작성 - 산출내역서 탭 강제 로드
      // if (!this.$refs.surveyCostForm2 && this.tab_write === 0){
      //   this.tab_write = 1;
      //   let refLoadCount = 0
      //   while(refLoadCount < 50){
      //     if (this.$refs.surveyCostForm2){
      //       break;
      //     }
      //     await new Promise(resolve => setTimeout(resolve, 100));
      //     refLoadCount++;
      //   }
      //   this.tab_write = 0;
      // }
      const validate2 = this.$refs.surveyCostForm2[0].validate();
      if(!validate2) {
        mux.Util.showAlert('산출내역서 정보를 정확히 입력하여 주십시오.');
        this.tab_write = 1;
        return;
      }
      if (this.calc_cost_detail_data_product_cost2.belong_data.length === 0){
        mux.Util.showAlert('재료비 항목이 없습니다.');
        this.tab_write = 1;
        return;
      }
      if (this.calc_cost_detail_data_direct_labor2.belong_data.length === 0 || this.calc_cost_detail_data_direct_labor2.belong_data[0].cost_list === ''){
        mux.Util.showAlert('직접 노무비를 산출해야 합니다.');
        this.tab_write = 1;
        return;
      }

      mux.Util.showLoading();

      const newDate = new Date();

      let sendDataCheckedDate = '';
      if (this.estimate_member_info2[0].user_id === this.$cookies.get(this.$configJson.cookies.id.key)){
        sendDataCheckedDate = mux.Date.format(newDate, 'yyyy-MM-dd HH:mm:ss');
      }else {
        sendDataCheckedDate = null;
      }

      const new_cost_calc_code = mux.Date.format(newDate, 'yyyy-MM-dd HH-mm-ss-fff') + '_' + this.$cookies.get(this.$configJson.cookies.id.key);
      let sendData = {
        "design_confirmation_table-insert": [{
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "creater"
          },
          "data":{
            obtain_cost_calc_code: this.loaded_obtain_cost_calc_code,
            cost_calc_code: new_cost_calc_code,
            given_name: this.$cookies.get(this.$configJson.cookies.name.key),
            office_phone_number: this.$cookies.get(this.$configJson.cookies.office_phone_number.key),
            obtain_type: this.type_obtain,
            issue_date: this.input_issue_date2.value,
            project_code: this.input_project_code2.value,
            inhouse_bid_number: this.input_inhouse_bid_number2.value,
            company_bid_number: this.input_company_bid_number2.value ? this.input_company_bid_number2.value : '',
            due_date: this.input_due_date2.value,
            delivery_condition: this.input_delivery_condition2.value,
            service_name: this.input_service_name2.value,
            service_period: this.input_service_period2.value,
            remark: this.input_remark2.value ? this.input_remark2.value : '',
            company_name: this.input_company_name2.value,
            company_manager: this.input_company_manager2.value,
            company_manager_email: this.input_company_manager_email2.value,
            company_manager_phone: this.input_company_manager_phone2.value,
            approval_phase: sendDataCheckedDate === null ? '미확인' : '미승인',
            checker: this.estimate_member_info2[0].name,
            checker_id: this.estimate_member_info2[0].user_id,
            checked_date: sendDataCheckedDate,
            approver: this.estimate_member_info2[1].name,
            approver_id: this.estimate_member_info2[1].user_id,
            layout_file: this.input_layout_file2.value ? new_cost_calc_code + '_' + this.input_layout_file2.value.name : '',
            layout_thumbnail: this.input_layout_file2.value ? mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_layout_file2.value, 1, false, 1000, 1000)) : '',
            structure_file: this.input_structure_file2.value ? new_cost_calc_code + '_' + this.input_structure_file2.value.name : '',
            structure_thumbnail: this.input_structure_file2.value ? mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_structure_file2.value, 1, false, 1000, 1000)) : '',
            single_line_file: this.input_single_line_file2.value ? new_cost_calc_code + '_' + this.input_single_line_file2.value.name : '',
            single_line_thumbnail: this.input_single_line_file2.value ? mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_single_line_file2.value, 1, false, 1000, 1000)) : '',
            trilinear_file: this.input_trilinear_file2.value ? new_cost_calc_code + '_' + this.input_trilinear_file2.value.name : '',
            trilinear_thumbnail: this.input_trilinear_file2.value ? mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_trilinear_file2.value, 1, false, 1000, 1000)) : '',
            circuit_file: this.input_circuit_file2.value ? new_cost_calc_code + '_' + this.input_circuit_file2.value.name : '',
            circuit_thumbnail: this.input_circuit_file2.value ? mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_circuit_file2.value, 1, false, 1000, 1000)) : '',
            approval_file: this.input_approval_file2.value ? new_cost_calc_code + '_' + this.input_approval_file2.value.name : '',
            approval_thumbnail: this.input_approval_file2.value ? mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_approval_file2.value, 1, false, 1000, 1000)) : '',
            build_sheet_file: this.input_build_sheet_file2.value ? new_cost_calc_code + '_' + this.input_build_sheet_file2.value.name : '',
            build_sheet_thumbnail: this.input_build_sheet_file2.value ? mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_build_sheet_file2.value, 1, false, 1000, 1000)) : '',
            etc_files: this.input_etc_file2.value && this.input_etc_file2.value.length > 0
            ? this.input_etc_file2.value.map(x=>new_cost_calc_code + '_' + x.name).join('/')
            : '',
          },
          "select_where": {"cost_calc_code": new_cost_calc_code},
          "rollback": "yes"
        }],
        "design_cost_table-insert": [{
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "creater"
          },
          "data":{
            cost_calc_code: new_cost_calc_code,
            indirect_labor_num: this.calc_cost_detail_data_indirect_labor2.cost_num,
            indirect_labor_ratio: this.new_indirect_labor_ratio,
            indirect_labor_formula: this.new_indirect_labor_formula,
            employment_insurance_num: this.calc_cost_detail_data_employment_insurance2.cost_num,
            employment_insurance_ratio: this.new_employment_insurance_ratio,
            employment_insurance_formula: this.new_employment_insurance_formula,
            tool_rent_fee_num: this.calc_cost_detail_data_tool_rent_fee2.cost_num,
            tool_rent_fee_ratio: this.new_tool_rent_fee_ratio,
            tool_rent_fee_formula: this.new_tool_rent_fee_formula,
            transportation_fee_num: this.calc_cost_detail_data_transportation_fee2.cost_num,
            transportation_fee_ratio: this.new_transportation_fee_ratio,
            transportation_fee_formula: this.new_transportation_fee_formula,
            industrial_accident_num: this.calc_cost_detail_data_industrial_accident2.cost_num,
            industrial_accident_ratio: this.new_industrial_accident_ratio,
            industrial_accident_formula: this.new_industrial_accident_formula,
            taxes_dues_num: this.calc_cost_detail_data_taxes_dues2.cost_num,
            taxes_dues_ratio: this.new_taxes_dues_ratio,
            taxes_dues_formula: this.new_taxes_dues_formula,
            welfare_benefits_num: this.calc_cost_detail_data_welfare_benefits2.cost_num,
            welfare_benefits_ratio: this.new_welfare_benefits_ratio,
            welfare_benefits_formula: this.new_welfare_benefits_formula,
            retirement_num: this.calc_cost_detail_data_retirement2.cost_num,
            retirement_ratio: this.new_retirement_ratio,
            retirement_formula: this.new_retirement_formula,
            expendables_num: this.calc_cost_detail_data_expendables2.cost_num,
            expendables_ratio: this.new_expendables_ratio,
            expendables_formula: this.new_expendables_formula,
            industrial_safety_num: this.calc_cost_detail_data_industrial_safety2.cost_num,
            industrial_safety_ratio: this.new_industrial_safety_ratio,
            industrial_safety_formula: this.new_industrial_safety_formula,
            normal_maintenance_fee_num: this.calc_cost_detail_data_normal_maintenance_fee2.cost_num,
            normal_maintenance_fee_ratio: this.new_normal_maintenance_fee_ratio,
            normal_maintenance_fee_formula: this.new_normal_maintenance_fee_formula,
            profite_num: this.calc_cost_detail_data_profite2.cost_num,
            profite_ratio: this.new_profite_ratio,
            profite_formula: this.new_profite_formula,
          },
          "select_where": {"cost_calc_code": new_cost_calc_code},
          "rollback": "yes"
        }],
        "design_cost_calc_detail_table-insert":[],
        "design_construction_detail_table-insert":[],
        "design_labor_cost_calc_detail_table-insert":[]
      };
      const products = this.calc_cost_detail_data_product_cost2.belong_data.find(x=>x.cost_list && x.cost_list.includes('재료'));
      const construction_materials = this.calc_cost_detail_data_product_cost2.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재'));
      if (products){
        products.belong_data.forEach(data => {
          if (data.belong_data && data.belong_data.length > 0){
            data.belong_data.forEach(subData => {
              sendData["design_cost_calc_detail_table-insert"].push({
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data": {
                  cost_calc_code: new_cost_calc_code,
                  product_classification: data.classification,
                  product_code: data.product_code,
                  product_name: data.cost_list,
                  product_model: data.model,
                  product_spec: data.cost_list_sub,
                  manufacturer: data.manufacturer,
                  product_num: data.cost_num,
                  product_unit_price: data.cost_unit_price,
                  item_type: subData.type,
                  item_classification: subData.classification,
                  item_code: subData.item_code,
                  item_name: subData.name,
                  item_model: subData.model,
                  item_spec: subData.spec,
                  item_manufacturer: subData.manufacturer,
                  item_unit_price: typeof subData.unit_price === 'number' ? subData.unit_price : subData.unit_price ? Number(subData.unit_price.replace(/,/g, '').replace('₩ ', '').trim()) : 0,
                  item_num: subData.num
                },
                "select_where": {"cost_calc_code": new_cost_calc_code, "item_code": subData.item_code},
                "rollback": "yes"
              });
            });
          }else {
            // 완제품 내부 자재 구성이 없는 경우가 발생하면 안됨
          }
        });
      }
      if (construction_materials){
        construction_materials.belong_data.forEach(data => {
          sendData["design_construction_detail_table-insert"].push({
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "creater"
            },
            "data":{
              cost_calc_code: new_cost_calc_code,
              construction_materials: data.cost_list,
              construction_materials_num: data.cost_num,
              construction_materials_unit_price: data.cost_unit_price,
            },
            "select_where": {"cost_calc_code": "!JUST_INSERT!"},
            "rollback": "no"
          });
        });
      }
      this.labor_cost_list.forEach(data => {
        sendData["design_labor_cost_calc_detail_table-insert"].push({
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "creater"
          },
          "data": {
            cost_calc_code: new_cost_calc_code,
            no: data.no,
            name: data.name,
            type: data.type,
            occupation: data.occupation,
            man_per_day: data.man_per_day,
            surcharge_ratio: data.surcharge_ratio,
            adjustment_ratio: data.adjustment_ratio,
            man_per_hour: data.man_per_hour,
            unit_price: data.unit_price,
            quantity: data.quantity
          },
          "select_where": {"cost_calc_code": new_cost_calc_code, "name": data.name, "type": data.type, "occupation": data.occupation},
          "rollback": "yes"
        });
      });

      sendData.path = '/api/multipart_rest_api/';
      sendData.prefix = new_cost_calc_code + '_';
      sendData.files = [];

      let purchaseSendData = await this.savePurchaseData(false);
      for (let i = 0; i < Object.keys(purchaseSendData).length; i++) {
        const key = Object.keys(purchaseSendData)[i];
        if (key === 'files'){
          sendData.files.push(...purchaseSendData[key]);
        }else {
          sendData[key] = purchaseSendData[key];
          if (key === 'purchase_confirmation_table-insert' || key === 'purchase_confirmation_table-update'){
            sendData[key].forEach(item => {
              item.data.cost_calc_code = new_cost_calc_code;
              item.data.project_code = this.input_project_code2.value;
            });
          }
        }
      }

      if (this.input_layout_file2.value){
        sendData.files.push({
          folder: 'design/layout',
          file: this.input_layout_file2.value,
          name: this.input_layout_file2.value.name
        });
      }
      if (this.input_structure_file2.value){
        sendData.files.push({
          folder: 'design/structure',
          file: this.input_structure_file2.value,
          name: this.input_structure_file2.value.name
        });
      }
      if (this.input_single_line_file2.value){
        sendData.files.push({
          folder: 'design/single_line',
          file: this.input_single_line_file2.value,
          name: this.input_single_line_file2.value.name
        });
      }
      if (this.input_trilinear_file2.value){
        sendData.files.push({
          folder: 'design/trilinear',
          file: this.input_trilinear_file2.value,
          name: this.input_trilinear_file2.value.name
        });
      }
      if (this.input_circuit_file2.value){
        sendData.files.push({
          folder: 'design/circuit',
          file: this.input_circuit_file2.value,
          name: this.input_circuit_file2.value.name
        });
      }
      if (this.input_approval_file2.value){
        sendData.files.push({
          folder: 'design/approval',
          file: this.input_approval_file2.value,
          name: this.input_approval_file2.value.name
        });
      }
      if (this.input_build_sheet_file2.value){
        sendData.files.push({
          folder: 'design/build_sheet',
          file: this.input_build_sheet_file2.value,
          name: this.input_build_sheet_file2.value.name
        });
      }
      if (this.input_etc_file2.value){
        this.input_etc_file2.value.forEach(file => {
          sendData.files.push({
            folder: 'design/etc',
            file: file,
            name: file.name
          });
        });
      }

      console.log(sendData);

      const prevURL = window.location.href;
      try {
        // let result = await mux.Server.post({
        //   path: '/api/common_rest_api/',
        //   params: sendData
        // });
        let result = await mux.Server.uploadFile(sendData);
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }

        if (result.code === undefined && result.data !== undefined && result.data.code !== undefined){
          result = result.data;
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

          //메일 알림 관련
          let mailTo = [];
            // let creater = this.$cookies.get(this.$configJson.cookies.id.key);
            if(sendDataCheckedDate === null){
              mailTo.push(this.estimate_member_info2[0].user_id);
            }else {
              mailTo.push(this.estimate_member_info2[1].user_id);
            }

            // 메일 본문 내용
            let content=`
            <html>
              <body>
                <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                  <h2 style="text-align: center; color:#13428a">설계 ${sendDataCheckedDate === null ? '확인' : '승인'} 요청 알림</h2>
                  <table style="width: 100%;border-spacing: 10px 10px;">
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.input_project_code2.value}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">사내 견적번호</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.input_inhouse_bid_number2.value}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">발행일</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.input_issue_date2.value}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.$cookies.get(this.$configJson.cookies.name.key)}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">확인자</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.estimate_member_info2[0].name}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">승인자</td>
                      <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.estimate_member_info2[1].name}</td>
                    </tr>
                  </table>
                  <a style="color: white; text-decoration:none"href="${prevURL}-search?project_code=${this.input_project_code2.value}&inhouse_bid_number=${this.input_inhouse_bid_number2.value}&company_bid_number=${this.input_company_bid_number2.value}&company_name=${this.input_company_name2.value}&issue_date=${this.input_issue_date2.value}">
                    <p style="cursor:pointer; background: #13428a;color: white;font-weight: bold;padding: 13px;border-radius: 40px;font-size: 16px;text-align: center;margin-top: 25px; margin-bottom: 40px;">
                      확인하기
                    </p>
                  </a>
                </div>
              </body>
            </html>
            `;

            try {
              let sendEmailAlam = await mux.Server.post({
                path: '/api/send_email/',
                to_addrs: mailTo,
                subject: "설계 " + (sendDataCheckedDate === null ? '확인' : '승인') + " 요청 알림",
                content: content
              });
              if (prevURL !== window.location.href) return;
              if(sendEmailAlam['code'] == 0 || (typeof sendEmailAlam['data'] === 'object' && sendEmailAlam['data']['code'] == 0) || (typeof sendEmailAlam['response'] === 'object' && typeof sendEmailAlam['response']['data'] === 'object' && sendEmailAlam['response']['data']['code'] == 0)){
                mux.Util.showAlert('등록되었습니다.', '등록 완료', 3000);
              } else {
                if (prevURL !== window.location.href) return;
                console.log('알림 메일 전송에 실패-sendEmailAlam :>> ', sendEmailAlam);
                mux.Util.showAlert('등록되었으나 알림 메일 전송에 실패하였습니다.', '등록 완료');
              }
            } catch (error) {
              if (prevURL !== window.location.href) return;
              console.log('알림 메일 전송에 실패-error :>> ', error);
              mux.Util.showAlert('등록되었으나 알림 메일 전송에 실패하였습니다.', '등록 완료');
            }
        } else {
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(result);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }

      mux.Util.hideLoading();
    },
    addDatas(){
      if (this.tab_main === 0){
        if (this.clickedProductCost.obtain_type !== '기술료'){
          if (!this.calc_cost_detail_data_product_cost.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재'))){
            this.calc_cost_detail_data_product_cost.belong_data.push(
              {
                "cost_list": `${this.calc_cost_detail_data_product_cost.belong_data.length > 0 ? '나' : '가'}. 공사 자재`,
                "cost_list_colspan": 4,
                "belong_data": []
              }
            );
          }
          this.calc_cost_detail_data_product_cost.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재')).belong_data.push(
            {
              cost_calc_code: this.clickedProductCost.cost_calc_code,
              cost_list: '',
              cost_num: '',
              cost_unit_price: '',
              cost_unit: '개',
              cost_num_editable: true,
              allow_one_or_greater: true,
              cost_unit_price_editable: true,
              deletable_row: true
            }
          );
        }else {
          this.calc_cost_detail_data_product_cost.belong_data.push(
            {
              cost_calc_code: this.clickedProductCost.cost_calc_code,
              cost_list: '',
              cost_num: '',
              cost_unit_price: '',
              cost_unit: '건',
              cost_num_editable: true,
              allow_one_or_greater: true,
              cost_unit_price_editable: true,
              deletable_row: true
            }
          );
        }
      }else {
        if (this.obtain_type !== '기술료'){
          if (!this.calc_cost_detail_data_product_cost2.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재'))){
            this.calc_cost_detail_data_product_cost2.belong_data.push(
              {
                "cost_list": `${this.calc_cost_detail_data_product_cost2.belong_data.length > 0 ? '나' : '가'}. 공사 자재`,
                "cost_list_colspan": 4,
                "belong_data": []
              }
            );
          }
          this.calc_cost_detail_data_product_cost2.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재')).belong_data.push(
            {
              cost_list: '',
              cost_num: '',
              cost_unit_price: '',
              cost_unit: '개',
              cost_num_editable: true,
              allow_one_or_greater: true,
              cost_unit_price_editable: true,
              deletable_row: true
            }
          );
        }else {
          this.calc_cost_detail_data_product_cost2.belong_data.push(
            {
              cost_list: '',
              cost_num: '',
              cost_unit_price: '',
              cost_unit: '건',
              cost_num_editable: true,
              allow_one_or_greater: true,
              cost_unit_price_editable: true,
              deletable_row: true
            }
          );
        }
      }
    },
    deleteInboundDataRow(index){
      if (this.tab_main === 0){
        if (this.clickedProductCost.obtain_type !== '기술료'){
          this.calc_cost_detail_data_product_cost.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재')).belong_data.splice(index, 1);
        }else {
          this.calc_cost_detail_data_product_cost.belong_data.splice(index, 1);
        }
      }else {
        if (this.obtain_type !== '기술료'){
          this.calc_cost_detail_data_product_cost2.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재')).belong_data.splice(index, 1);
        }else {
          this.calc_cost_detail_data_product_cost2.belong_data.splice(index, 1);
        }
      }
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
          mux.Util.showAlert(result);
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
    async saveEditData(){
      if(this.tab_search === 2){

        await this.setPurchaseRequest(false);
        mux.Util.showAlert('구매 요청 내역으로 이동합니다.', '확인', 2000);
        this.tab_search = 3;
        // this.dialog_edit_purchase_requested = true
        this.editPurchaseList();
      }else if(this.tab_search ===3){

        let test = await this.checkPurchaseRequest(false);
        if(test){
          const confirm = await mux.Util.showConfirm('수정한 내용을 최종 업데이트 하시겠습니까?', '확인', false, '업데이트', '취소');
          if (confirm){
            let isRejected = false;
            if (this.clickedProductCost.rejected_date){
              isRejected = true;
            }
            let needReConfirm = false;
            if (this.estimate_member_info[0].user_id !== this.$cookies.get(this.$configJson.cookies.id.key) && this.estimate_member_info[0].checked_date){
              if (!await mux.Util.showConfirm('확인 절차가 다시 진행됩니다. 수정하시겠습니까?')){
                return;
              }
              needReConfirm = true;
            }

            const newDate = new Date();

            let sendDataCheckedDate = '';
            if (this.estimate_member_info[0].user_id === this.$cookies.get(this.$configJson.cookies.id.key)){
              sendDataCheckedDate = mux.Date.format(newDate, 'yyyy-MM-dd HH:mm:ss');
            }else {
              sendDataCheckedDate = null;
            }

            const new_cost_calc_code = mux.Date.format(newDate, 'yyyy-MM-dd HH-mm-ss-fff') + '_' + this.$cookies.get(this.$configJson.cookies.id.key);

            let sendData = {
              "design_confirmation_table-update": [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data":{
                  "cost_calc_code": new_cost_calc_code,
                  "approval_phase": sendDataCheckedDate === null ? '미확인' : '미승인',
                  "checked_date": sendDataCheckedDate,
                  "rejecter": '',
                  "rejected_date": null,
                  "reject_reason": '',
                },
                "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
                "rollback": "yes"
              }],
              "design_cost_table-update": [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data":{"cost_calc_code": new_cost_calc_code},
                "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
                "rollback": "yes"
              }],
              "design_construction_detail_table-update": [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data":{"cost_calc_code": new_cost_calc_code},
                "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
                "rollback": "no"
              }],
              "design_labor_cost_calc_detail_table-update": [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data":{"cost_calc_code": new_cost_calc_code},
                "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
                "rollback": "no"
              }],
              "files": []
            };

            if (this.editable_bom_list){ // BOM LIST 수정 후 구매 요청 내역 수정이라면
              // this.set_bom_list_data_copy 기준 수정 내용 업데이트 진행
              console.log('this.set_bom_list_data_copy :>> ', this.set_bom_list_data_copy);

              if (this.set_bom_list_data.length > 0){
                sendData['design_cost_calc_detail_table-delete'] = [{
                  "user_info": {
                    "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                    "role": "modifier"
                  },
                  "data": {
                    "cost_calc_code": new_cost_calc_code
                  },
                  "delete_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
                  "rollback": "no"
                }];
              }

              sendData['design_cost_calc_detail_table-insert'] = [];
              this.set_bom_list_data_copy.forEach(data => {
                data.belong_data.forEach(belong_data => {
                  sendData['design_cost_calc_detail_table-insert'].push({
                    "user_info": {
                      "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                      "role": "modifier"
                    },
                    "data": {
                      "cost_calc_code": new_cost_calc_code,
                      "product_classification": data.classification,
                      "product_code": data.product_code,
                      "product_name": data.cost_list,
                      "product_model": data.model,
                      "product_spec": data.cost_list_sub,
                      "manufacturer": data.manufacturer,
                      "product_num": data.cost_num,
                      "product_unit_price": data.cost_unit_price,
                      "item_type": belong_data.type,
                      "item_classification": belong_data.classification,
                      "item_code": belong_data.item_code,
                      "item_name": belong_data.name,
                      "item_model": belong_data.model,
                      "item_spec": belong_data.spec,
                      "item_manufacturer": belong_data.manufacturer,
                      "item_unit_price": typeof belong_data.unit_price === 'number' ? belong_data.unit_price : belong_data.unit_price ? Number(belong_data.unit_price.replace(/,/g, '').replace('₩ ', '').trim()) : 0,
                      "item_num": belong_data.num
                    },
                    "select_where": {"cost_calc_code": new_cost_calc_code, "product_code": data.product_code, "item_code": belong_data.item_code },
                    "rollback": "yes"
                  });
                });
              });
            }else {
              sendData["design_cost_calc_detail_table-update"] = [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data":{"cost_calc_code": new_cost_calc_code},
                "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
                "rollback": "no"
              }]
            }

            // this.bom_list_purchase_data_copy 기준 수정 내용 업데이트 진행
            console.log('this.bom_list_purchase_data_copy :>> ', this.bom_list_purchase_data_copy);
            if (this.bom_list_purchase_data.length > 0){
              sendData['purchase_confirmation_table-delete'] = [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data": {
                  "cost_calc_code": new_cost_calc_code
                },
                "delete_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
                "rollback": "no"
              }];

              sendData['purchase_product_table-delete'] = [];
              sendData['purchase_product_table-update'] = [];
              this.bom_list_purchase_data.forEach(data => {
                if(!data.code.includes('PRE')){
                  sendData['purchase_product_table-delete'].push({
                    "user_info": {
                      "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                      "role": "modifier"
                    },
                    "data": {
                      "cost_calc_code": new_cost_calc_code
                    },
                    "delete_where": { code: data.code, product_code: data.product_code, item_code: data.item_code },
                    "rollback": "no"
                  });
                }else{
                  sendData['purchase_product_table-update'].push({
                    "user_info": {
                      "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                      "role": "modifier"
                    },
                    "data": {
                      "code": data.code.split('_PRE')[0]
                    },
                    "update_where": { code: data.code, product_code: data.product_code, item_code: data.item_code },
                    "rollback": "yes"
                  });
                }
              });
            }

            let purchaseSendData = await this.savePurchaseData(true);
            for (let i = 0; i < Object.keys(purchaseSendData).length; i++) {
              const key = Object.keys(purchaseSendData)[i];
              if (key === 'files'){
                sendData.files.push(...purchaseSendData[key]);
              }else {
                sendData[key] = purchaseSendData[key];
                if (key === 'purchase_confirmation_table-insert' || key === 'purchase_confirmation_table-update'){
                  sendData[key].forEach(item => {
                    item.data.cost_calc_code = new_cost_calc_code;
                    item.data.project_code = this.input_project_code.value;
                  });
                }
              }
            }

            sendData.path = '/api/multipart_rest_api/';
            sendData.prefix = new_cost_calc_code + '_';

            const prevURL = window.location.href;
            try {
              let result = await mux.Server.uploadFile(sendData);
              if (prevURL !== window.location.href) return;

              if (typeof result === 'string'){
                result = JSON.parse(result);
              }

              if (result.code === undefined && result.data !== undefined && result.data.code !== undefined){
                result = result.data;
              }
              if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

                if (isRejected || needReConfirm){
                  //메일 알림 관련
                  let mailTo = [];
                  // let creater = this.$cookies.get(this.$configJson.cookies.id.key);
                  if(sendDataCheckedDate === null){
                    mailTo.push(this.clickedProductCost.checker_id);
                  }else {
                    mailTo.push(this.clickedProductCost.approver_id);
                  }

                  // 메일 본문 내용
                  let content=`
                  <html>
                    <body>
                      <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                        <h2 style="text-align: center; color:#13428a">설계 ${sendDataCheckedDate === null ? '확인' : '승인'} 요청 알림</h2>
                        <table style="width: 100%;border-spacing: 10px 10px;">
                          <tr>
                            <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                            <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.project_code}</td>
                          </tr>
                          <tr>
                            <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">사내 견적번호</td>
                            <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.inhouse_bid_number}</td>
                          </tr>
                          <tr>
                            <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">발행일</td>
                            <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.issue_date}</td>
                          </tr>
                          <tr>
                            <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                            <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.given_name}</td>
                          </tr>
                          <tr>
                            <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">확인자</td>
                            <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.checker}</td>
                          </tr>
                          <tr>
                            <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">승인자</td>
                            <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.clickedProductCost.approver}</td>
                          </tr>
                        </table>
                        <a style="color: white; text-decoration:none"href="${prevURL}-search?project_code=${this.clickedProductCost.project_code}&inhouse_bid_number=${this.clickedProductCost.inhouse_bid_number}&company_bid_number=${this.clickedProductCost.company_bid_number}&company_name=${this.clickedProductCost.company_name}&issue_date=${this.clickedProductCost.issue_date}">
                          <p style="cursor:pointer; background: #13428a;color: white;font-weight: bold;padding: 13px;border-radius: 40px;font-size: 16px;text-align: center;margin-top: 25px; margin-bottom: 40px;">
                            확인하기
                          </p>
                        </a>
                      </div>
                    </body>
                  </html>
                  `;

                  try {
                    let sendEmailAlam = await mux.Server.post({
                      path: '/api/send_email/',
                      to_addrs: mailTo,
                      subject: "설계 " + (sendDataCheckedDate === null ? '확인' : '승인') + " 요청 알림",
                      content: content
                    });
                    if (prevURL !== window.location.href) return;
                    if(sendEmailAlam['code'] == 0 || (typeof sendEmailAlam['data'] === 'object' && sendEmailAlam['data']['code'] == 0) || (typeof sendEmailAlam['response'] === 'object' && typeof sendEmailAlam['response']['data'] === 'object' && sendEmailAlam['response']['data']['code'] == 0)){
                      mux.Util.showAlert('수정되었습니다.', '수정 완료', 3000);
                    } else {
                      if (prevURL !== window.location.href) return;
                      console.log('알림 메일 전송에 실패-sendEmailAlam :>> ', sendEmailAlam);
                      mux.Util.showAlert('수정되었으나 알림 메일 전송에 실패하였습니다.', '수정 완료');
                    }
                  } catch (error) {
                    if (prevURL !== window.location.href) return;
                    console.log('알림 메일 전송에 실패-error :>> ', error);
                    mux.Util.showAlert('수정되었으나 알림 메일 전송에 실패하였습니다.', '수정 완료');
                  }
                }else {
                  mux.Util.showAlert('수정되었습니다.', '수정 완료', 3000);
                }

                this.editable_bom_list = false;
                this.dialog_edit_purchase_requested = false;
                this.during_edit = false;

                // 화면 적용을 위해 재검색 및 클릭 이벤트 실행
                this.searchButton(this.lastSearchInputs, new_cost_calc_code);

              } else {
                if (prevURL !== window.location.href) return;
                mux.Util.showAlert(result);
              }
            } catch (error) {
              if (prevURL !== window.location.href) return;
              mux.Util.showAlert(error);
            }

            mux.Util.hideLoading();
          }
        }

      }
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
      let added=0;
      for(let i=0; i<this.setting_item_data.length; i++){
        if(this.setting_item_data[i].data_type === 'written'){
          added ++;
        }
      }
      this.setting_item_data.push(
        {
          "type":"",
          "classification":"",
          "product_code": this.item_setting_product_code,
          "item_code": '임시코드-'+ ('000' + (added + 1)).slice(-4),
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
      this.estimate_cost_dialog = false;
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
    async previousStep(step){
      if (step === 3 && !await mux.Util.showConfirm('작성 내용이 초기화 됩니다. \n이전 단계로 이동하시겠습니까?', '확인', false, '이동', '취소')){
        return;
      }
      this.production_steppers = step-1;
    },
    async nextStep(step){
      if (step === 1){
        this.validateDesignInfo(step);
      }else if(step === 2){
        // 사용가능수량 검색 및 적용
        await this.setPurchaseRequest(step);
      }else if(step === 3){
        // 유효성 검사 및 데이터 정리
        await this.checkPurchaseRequest(step);
      }else{
        this.production_steppers = step+1;
      }
    },
    validateDesignInfo(step){
      if (!this.estimate_member_info2[1].user_id){
        mux.Util.showAlert('확인자, 승인자를 선택하여 주십시오.');
        return;
      }
      if (!this.input_issue_date2.value || !this.input_project_code2.value || !this.input_inhouse_bid_number2.value){
        mux.Util.showAlert('생산 의뢰 내역을 불러오지 않았습니다.');
        return;
      }
      if (
        !this.input_layout_file2.value
        && !this.input_structure_file2.value
        && !this.input_single_line_file2.value
        && !this.input_trilinear_file2.value
        && !this.input_circuit_file2.value
      ){
        mux.Util.showAlert('상세 도면을 1개 이상 첨부해야 합니다.');
        return;
      }
      let fileNames = [];
      if (this.input_layout_file2.value) {
        fileNames.push(this.input_layout_file2.value.name);
      }
      if (this.input_structure_file2.value) {
        fileNames.push(this.input_structure_file2.value.name);
      }
      if (this.input_single_line_file2.value) {
        fileNames.push(this.input_single_line_file2.value.name);
      }
      if (this.input_trilinear_file2.value) {
        fileNames.push(this.input_trilinear_file2.value.name);
      }
      if (this.input_circuit_file2.value) {
        fileNames.push(this.input_circuit_file2.value.name);
      }
      if (this.input_approval_file2.value) {
        fileNames.push(this.input_approval_file2.value.name);
      }
      if (this.input_build_sheet_file2.value) {
        fileNames.push(this.input_build_sheet_file2.value.name);
      }
      if (Array.isArray(this.input_etc_file2.value)){
        for (let i = 0; i < this.input_etc_file2.value.length; i++){
          fileNames.push(this.input_etc_file2.value[i].name);
        }
      }
      // 파일명 중복 체크
      fileNames.sort();
      for (let i = 0; i < fileNames.length - 1; i++){
        if (fileNames[i] === fileNames[i + 1]){
          mux.Util.showAlert('중복되는 이름의 파일을 첨부할 수 없습니다.');
          return;
        }
      }
      this.production_steppers = step+1;
    },
    async setPurchaseRequest(step){
      let bom_data = null;
      if (step){
        bom_data = JSON.parse(JSON.stringify(this.set_bom_list_data2));
      }else {
        bom_data = JSON.parse(JSON.stringify(this.set_bom_list_data_copy));
      }
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
            mux.Util.showAlert(result);
            mux.Util.hideLoading();
            return;
          }
        } catch (error) {
          if (prevURL !== window.location.href) return;
          mux.Util.hideLoading();
          mux.Util.showAlert(error);
          return;
        }
      }

      let set_usable_num = [];
      usable_num_searched.forEach(data =>{
        if(set_usable_num.length === 0){
          set_usable_num.push(data);
        }else if(set_usable_num.some(x=>x.product_code === data.product_code)){
          set_usable_num.find(x=>x.product_code === data.product_code).usable_num += data.usable_num;
        }else {
          set_usable_num.push(data);
        }
      })
      // usable_num_searched = usable_num_searched.reduce((prev, now) => {
      //   if(!prev.some(obj => obj.product_code === now.product_code)){
      //     prev.push(now);
      //   }
      //   return prev;
      // }, [])

      bom_data.forEach(bom =>{
        bom.num = bom.product_num;
        bom.usable_num = set_usable_num.some(x=>x.product_code === bom.product_code) ? set_usable_num.find(x=>x.product_code === bom.product_code).usable_num : 0;
        for(let i=0; i<bom.belong_data.length; i++){
          let belong_data = bom.belong_data[i];
          belong_data.num = belong_data.num * bom.num;
          belong_data.usable_num = set_usable_num.some(x=>x.product_code === belong_data.item_code) ? set_usable_num.find(x=>x.product_code === belong_data.item_code).usable_num : 0;
        }
      })
      console.log(bom_data);

      //필요 수량이 사용 가능 수량보다 클 경우 bom_list_purchase_data에 추가
      if (step){
        this.bom_list_purchase_data2 = [];
      }else {
        this.bom_list_purchase_data_copy = [];
      }

      bom_data.forEach(data =>{
        for(let bd=0; bd<data.belong_data.length; bd++){
          let belong_data = data.belong_data[bd];
          if(belong_data.usable_num < belong_data.num){
            belong_data.purchase_estimate_check = false;
            belong_data.purchase_estimate_company = '';
            belong_data.purchase_estimate_file_name = '';
            belong_data.purchase_estimate_thumbnail = '';
            belong_data.purchase_num = 0;
            belong_data.code = '';
            if (step){
              this.bom_list_purchase_data2.push(belong_data);
            }else {
              this.bom_list_purchase_data_copy.push(belong_data);
            }
          }
        }
      })
      if (step){
        this.bom_list_data2 = bom_data;
      }else {
        this.bom_list_data = bom_data;
      }
      if(step){
        this.production_steppers = step+1;
      }
      mux.Util.hideLoading();

    },
    async checkPurchaseRequest(step){

      let confirmation_data = {};

      if (step){

        // 구매 요청할 내역이 있을 경우
        if(this.bom_list_purchase_data2.length > 0){
          //구매 담당자가 설정되었는지 확인
          if(this.select_purchase_manager2 === ''){
            mux.Util.showAlert('구매 담당자를 선택해주세요.');
            return;
          }else{
            confirmation_data.approval_phase = '설계미승인';
            this.purchase_member_info2.forEach(mem => {
              if(mem.type === '확인'){
                confirmation_data.checker = mem.name;
                confirmation_data.checker_id = mem.user_id;
              }else if(mem.type === '승인'){
                confirmation_data.approver = mem.name;
                confirmation_data.approver_id = mem.user_id;
              }
            })
          }

          for(let i=0; i<this.bom_list_purchase_data2.length; i++){
            let data = this.bom_list_purchase_data2[i];
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
              if( data.num - data.usable_num > 0 && data.num - data.usable_num > Number(data.belong_data[0].purchase_set_num) + Number(data.purchase_num)){
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
              if (data.num - data.usable_num > 0 && data.num - data.usable_num > Number(data.purchase_num)){
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
            data.approval_phase = confirmation_data.approval_phase;
            data.checker = this.$cookies.get(this.$configJson.cookies.name.key);
            data.checker_id = this.$cookies.get(this.$configJson.cookies.id.key);
            data.approver = confirmation_data.approver;
            data.approver_id = confirmation_data.approver_id;
          }
        }

        this.production_steppers = step+1;
      }else{

        // 구매 요청할 내역이 있을 경우
        if(this.bom_list_purchase_data_copy.length > 0){
          //구매 담당자가 설정되었는지 확인
          if(this.select_purchase_manager === ''){
            mux.Util.showAlert('구매 담당자를 선택해주세요.');
            return;
          }else{
            confirmation_data.approval_phase = '설계미승인';
            this.purchase_member_info.forEach(mem => {
              if(mem.type === '확인'){
                confirmation_data.checker = mem.name;
                confirmation_data.checker_id = mem.user_id;
              }else if(mem.type === '승인'){
                confirmation_data.approver = mem.name;
                confirmation_data.approver_id = mem.user_id;
              }
            })
          }

          for(let i=0; i<this.bom_list_purchase_data_copy.length; i++){
            let data = this.bom_list_purchase_data_copy[i];
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
              if( data.num - data.usable_num > 0 && data.num - data.usable_num > Number(data.belong_data[0].purchase_set_num) + Number(data.purchase_num)){
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
              if (data.num - data.usable_num > 0 && data.num - data.usable_num > Number(data.purchase_num)){
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
            data.approval_phase = confirmation_data.approval_phase;
            data.checker = confirmation_data.checker ? confirmation_data.checker : this.$cookies.get(this.$configJson.cookies.name.key);
            data.checker_id = confirmation_data.checker ? confirmation_data.checker_id : this.$cookies.get(this.$configJson.cookies.id.key);
            data.approver = confirmation_data.approver;
            data.approver_id = confirmation_data.approver_id;
          }
        }

        return true;
      }

    },
    editPurchaseList(){
      this.bom_list_purchase_data_copy = JSON.parse(JSON.stringify(this.bom_list_purchase_data));
      this.dialog_edit_purchase_requested = true;

      this.bom_list_purchase_data_copy.forEach(async data => {
        if(data.code.includes('PRE')){
          const prevURL = window.location.href;
          try {
            let result = await mux.Server.post({
              path: '/api/common_rest_api/',
              params: [
                {
                  "purchase_confirmation_table.code": data.code
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

              let searched_data = result.data;

              let set_purchase_data = [];
              searched_data.forEach(data =>{
                for(let i=0; i<data.belong_data.length; i++){
                  let belong_data = data.belong_data[i];
                  if(belong_data.purchase_estimate_phase === '미요청'){
                    belong_data.purchase_estimate_company = '*견적서 미요청';
                  }
                  belong_data.product_id = belong_data.id
                  Object.assign(belong_data, data);
                  delete belong_data.belong_data
                  set_purchase_data.push(belong_data);
                }
              })
              data.belong_data = set_purchase_data;
            } else {
              mux.Util.showAlert(result);
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
      })
    },
    addBomList(item){
      if (!Object.keys(item).includes('product_num')){
        item.product_num = 0;
      }
      if (this.tab_main === 0){
        this.set_bom_list_data_copy.push(JSON.parse(JSON.stringify(item)));
      }else {
        this.set_bom_list_data2.push(item);
      }
    },
    saveBomDetail(){

      const validate = this.$refs.itemSettingForm.validate();
      if (!validate){
        mux.Util.showAlert('필수 입력 항목을 확인해주세요.');
        return;
      }
      let product_code = this.setting_item_data[0].product_code;
      let item_code_list = [];
      for(let i=0; i<this.setting_item_data.length; i++){
        if(item_code_list.includes(this.setting_item_data[i].item_code)){
          mux.Util.showAlert('중복된 품목이 있습니다.');
          return;
        }else {
          item_code_list.push(this.setting_item_data[i].item_code);
        }
        if(this.setting_item_data[i].num < 1){
          mux.Util.showAlert('필요 수량을 확인해주세요.');
          return;
        }
      }
      if (this.tab_main === 0){
        this.set_bom_list_data_copy.forEach(data =>{
          if(data.product_code === product_code){
            data.belong_data = this.setting_item_data;
          }
        });
      }else {
        this.set_bom_list_data2.forEach(data =>{
          if(data.product_code === product_code){
            data.belong_data = this.setting_item_data;
          }
        });
      }
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
          data.code = '';
        })
        if (this.tab_main === 0){
          this.bom_list_purchase_data_copy = this.bom_list_purchase_data_copy.filter(param => param.product_code != item.product_code);
          this.bom_list_purchase_data_copy.push(...item.belong_data);
        }else {
          this.bom_list_purchase_data2 = this.bom_list_purchase_data2.filter(param => param.product_code != item.product_code);
          this.bom_list_purchase_data2.push(...item.belong_data);
        }
      }
    },
    addBelongData(item, idx){
      if (this.tab_main === 0){
        if(this.bom_list_purchase_data_copy.length === 0){
          item.belong_data[idx].purchase_estimate_check = false;
          item.belong_data[idx].purchase_estimate_company = '';
          item.belong_data[idx].purchase_estimate_file_name = '';
          item.belong_data[idx].purchase_estimate_thumbnail = '';
          item.belong_data[idx].purchase_num = 0;
          item.belong_data[idx].code = '';
          this.bom_list_purchase_data_copy.push(item.belong_data[idx]);
        }else{
          let add_data = {};
          for(let i=0; i<this.bom_list_purchase_data_copy.length; i++){
            if(this.bom_list_purchase_data_copy[i].product_code === item.product_code && this.bom_list_purchase_data_copy[i].item_code === item.belong_data[idx].item_code){
              mux.Util.showAlert('이미 추가된 제품입니다.');
              return;
            }else{
              item.belong_data[idx].purchase_estimate_check = false;
              item.belong_data[idx].purchase_estimate_company = '';
              item.belong_data[idx].purchase_estimate_file_name = '';
              item.belong_data[idx].purchase_estimate_thumbnail = '';
              item.belong_data[idx].purchase_num = 0;
              item.belong_data[idx].code = '';
              add_data=item.belong_data[idx];
            }
          }
          this.bom_list_purchase_data_copy.push(add_data);
        }
      }else {
        if(this.bom_list_purchase_data2.length === 0){
          item.belong_data[idx].purchase_estimate_check = false;
          item.belong_data[idx].purchase_estimate_company = '';
          item.belong_data[idx].purchase_estimate_file_name = '';
          item.belong_data[idx].purchase_estimate_thumbnail = '';
          item.belong_data[idx].purchase_num = 0;
          item.belong_data[idx].code = '';
          this.bom_list_purchase_data2.push(item.belong_data[idx]);
        }else{
          let add_data = {};
          for(let i=0; i<this.bom_list_purchase_data2.length; i++){
            if(this.bom_list_purchase_data2[i].product_code === item.product_code && this.bom_list_purchase_data2[i].item_code === item.belong_data[idx].item_code){
              mux.Util.showAlert('이미 추가된 제품입니다.');
              return;
            }else{
              item.belong_data[idx].purchase_estimate_check = false;
              item.belong_data[idx].purchase_estimate_company = '';
              item.belong_data[idx].purchase_estimate_file_name = '';
              item.belong_data[idx].purchase_estimate_thumbnail = '';
              item.belong_data[idx].purchase_num = 0;
              item.belong_data[idx].code = '';
              add_data=item.belong_data[idx];
            }
          }
          this.bom_list_purchase_data2.push(add_data);
        }
      }
    },

    cancleItem(product_code, item_code){
      if (this.tab_main === 0){
        if(item_code === false){
          this.bom_list_purchase_data_copy = this.bom_list_purchase_data_copy.filter(param => param.product_code != product_code);
        }else if(product_code === false){
          // this.bom_list_purchase_items_data = this.bom_list_purchase_items_data.filter(param => param.item_code != item_code);
        }else{
          this.bom_list_purchase_data_copy.forEach((data, index) => {
            if(data.product_code === product_code && data.item_code === item_code){
              this.bom_list_purchase_data_copy.splice(index, 1);
            }
          })
        }
      }else {
        if(item_code === false){
          this.bom_list_purchase_data2 = this.bom_list_purchase_data2.filter(param => param.product_code != product_code);
        }else if(product_code === false){
          // this.bom_list_purchase_items_data2 = this.bom_list_purchase_items_data2.filter(param => param.item_code != item_code);
        }else{
          this.bom_list_purchase_data2.forEach((data, index) => {
            if(data.product_code === product_code && data.item_code === item_code){
              this.bom_list_purchase_data2.splice(index, 1);
            }
          })
        }
      }
    },


    async clickDontSelect(product_code, item_code){
      let bom_data;
      if (this.tab_main === 0){
        bom_data  = this.bom_list_purchase_data_copy;
      }else {
        bom_data  = this.bom_list_purchase_data2;
      }

      for(let i=0; i<bom_data.length; i++){
        if(bom_data[i].product_code === product_code && bom_data[i].item_code === item_code){
          if(bom_data[i].purchase_estimate_company !== ''){
            const confirm = await mux.Util.showConfirm('미선택 체크 시 적용한 견적서는 초기화됩니다.  ', '선택 확인');
              if (!confirm){
                return;
              }
            bom_data[i].purchase_estimate_company = '';
            bom_data[i].purchase_estimate_file_value = null;
            bom_data[i].purchase_estimate_file_name = '';
            bom_data[i].purchase_estimate_thumbnail = '';
            bom_data[i].purchase_estimate_thumbnail_img = '';
            bom_data[i].code = '';
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
      let bom_data = null;
      if (this.tab_main === 0){
        bom_data = this.bom_list_purchase_data_copy;
      }else {
        bom_data = this.bom_list_purchase_data2;
      }

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
          item.purchase_estimate_file_value = '';
          item.purchase_estimate_file_name = '';
          item.purchase_estimate_thumbnail = '';
          item.purchase_estimate_thumbnail_img = '';
          item.code = '';
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

      if (this.tab_main === 0){
        this.bom_list_purchase_data_copy.forEach(data => {
          if(data.product_code === this.pre_ordered_product_code && data.item_code === item.item_code){
            data.belong_data = [];
            data.belong_data.push(item);
          }
        });
      }else {
        this.bom_list_purchase_data2.forEach(data => {
          if(data.product_code === this.pre_ordered_product_code && data.item_code === item.item_code){
            data.belong_data = [];
            data.belong_data.push(item);
          }
        });
      }
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
          let searched_data = result.data.filter(data => (data.cost_calc_code === '' || data.cost_calc_code === null) && data.approval_phase !== '반려');

          let set_purchase_data = [];
          searched_data.forEach(data =>{
            for(let i=0; i<data.belong_data.length; i++){
              let belong_data = data.belong_data[i];
              if(belong_data.purchase_estimate_phase === '미요청'){
                belong_data.purchase_estimate_company = '*견적서 미요청';
              }
              belong_data.product_id = belong_data.id
              Object.assign(belong_data, data);
              delete belong_data.belong_data
              set_purchase_data.push(belong_data);
            }
          })
          console.log(set_purchase_data);
          this.purchase_detail_data = set_purchase_data;
        } else {
          mux.Util.showAlert(result);
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
      let product_data;
      if (this.tab_main === 0){
        product_data = this.bom_list_purchase_data_copy;
      }else {
        product_data = this.bom_list_purchase_data2;
      }


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
            if(selected.product_code === product_data[i].product_code && selected.item_code === product_data[i].item_code){
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
    // async saveData(){
    //   // BOM LIST
    //   this.saveBomListData();

    //   // 구매 요청
    //   this.savePurchaseData();

    // },
    // saveBomListData(){
    //   // BOM LIST(design_cost_calc_detail_table) : bom_list_data2
    //   let sendData = {};
    //   let bom_insert = [];
    //   this.bom_list_data2.forEach(data => {
    //     for(let i=0; i<data.belong_data.length; i++){
    //       bom_insert.push({
    //         "user_info": {
    //           "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
    //           "role": "creater"
    //         },
    //         "data": {
    //           "cost_calc_code": "",
    //           "product_classification": data.classification,
    //           "product_code": data.product_code,
    //           "product_name": data.name,
    //           "product_model": data.model,
    //           "product_spec": data.spec,
    //           "manufacturer": data.manufacturer,
    //           "product_num": data.num,
    //           "item_type": data.belong_data[i].type,
    //           "item_classification": data.belong_data[i].classification,
    //           "item_code": data.belong_data[i].item_code,
    //           "item_name": data.belong_data[i].name,
    //           "item_model": data.belong_data[i].model,
    //           "item_spec": data.belong_data[i].spec,
    //           "item_manufacturer": data.belong_data[i].manufacturer,
    //           "item_unit_price": data.belong_data[i].unit_price,
    //           "item_num": data.belong_data[i].num
    //         },
    //         "select_where": {"cost_calc_code": "", "product_code": data.product_code, "item_code": data.belong_data[i].item_code},
    //         "rollback": "yes"
    //       })
    //     }
    //   })
    //   sendData['design_cost_calc_detail_table'] = bom_insert;
    //   console.log("sendData BOM : ", sendData);
    // },
    async savePurchaseData(isUpdate){
      // DB의 purchase_product_table = bom_list_purchase_data
      const currDate = new Date();
      let sendData = {};
      let purchase_confirmation_insert = [];
      let purchase_product_insert = [];
      let purchase_confirmation_update = [];
      let purchase_product_update = [];
      let files = [];

      let set_code = 'PEPR_' + mux.Date.format(currDate, 'yyMMdd') + '_';
      let currentCode = await this.searchCurrentCode(set_code);
      // let purchase_code = 'PEPR_' + mux.Date.format(currDate, 'yyyy-MM-dd HH-mm-ss-fff') + '-' + this.$cookies.get(this.$configJson.cookies.id.key);
      let purchase_code = '';
      if(currentCode === ''){
        purchase_code = set_code + '001';
      }else{
        let calc_current_code = Number(currentCode.split('_')[2]) + 1;
        calc_current_code = ('00' + calc_current_code).slice(-3);
        purchase_code = set_code + calc_current_code;
      }

      let confirmation_inserted = false;

      let purchase_data = null;
      if (isUpdate){
        purchase_data = this.bom_list_purchase_data_copy;
      }else {
        purchase_data = this.bom_list_purchase_data2;
      }

      for(let pd=0; pd<purchase_data.length; pd++){
        let data = purchase_data[pd]
        if(data.belong_data){ //선주문일 경우
          let belong_data = data.belong_data[0];

          let set_pre_order_code = belong_data.code + '_PRE_';
          let findCurrentCode = await this.searchCurrentCode(set_pre_order_code);
          // let purchase_code = 'PEPR_' + mux.Date.format(currDate, 'yyyy-MM-dd HH-mm-ss-fff') + '-' + this.$cookies.get(this.$configJson.cookies.id.key);
          let new_pre_order_code = '';
          if(findCurrentCode === ''){
            new_pre_order_code = set_pre_order_code + '001';
          }else{
            let calc_current_code = Number(findCurrentCode.split('_')[2]) + 1;
            calc_current_code = ('00' + calc_current_code).slice(-3);
            new_pre_order_code = set_pre_order_code + calc_current_code;
          }
          purchase_confirmation_insert.push({
            "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "code" : new_pre_order_code,
                "cost_calc_code" : '',
                "project_code" : '',
                "approval_phase": belong_data.approval_phase,
                "checker" : belong_data.checker,
                "checker_id" : belong_data.checker_id,
                "checked_date" : belong_data.checked_date,
                "approver" : belong_data.approver,
                "approver_id" : belong_data.approver_id,
                "approved_date" : belong_data.approved_date,
                "note" : '기존 선주문 연결 건 (' + belong_data.code + ')'
              },
              "select_where": {"code": new_pre_order_code},
              "rollback": "yes"
          })
          // 선주문 수량과 선주문 사용 수량이 동일할 경우 기존 선주문 데이터의 project_code, cost_calc_code, note만 update
          if(belong_data.purchase_num === belong_data.purchase_set_num){
            purchase_product_update.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "modifier"
              },
              "data":{
                "code": new_pre_order_code,
              },
              "update_where": {"id": belong_data.product_id },
              "rollback": "yes"
            })
          }else{// 다를 경우 기존 선주문 데이터의 선주문 수량 update 및 구매 요청에 데이터 복사 & 선주문 사용 수량 설정
            // purchase_confirmation_insert.push({
            //   "user_info": {
            //       "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            //       "role": "creater"
            //     },
            //     "data":{
            //       "code" : belong_data.code +'-'+ mux.Date.format(currDate, 'yyyyMMdd HH:mm:ss'),
            //       "cost_calc_code" : '',
            //       "project_code" : data.project_code ,
            //       "approval_phase": belong_data.approval_phase,
            //       "checker" : belong_data.checker,
            //       "checker_id" : belong_data.checker_id,
            //       "checked_date" : belong_data.checked_date,
            //       "approver" : belong_data.approver,
            //       "approver_id" : belong_data.approver_id
            //     },
            //     "select_where": {"code": belong_data.code +'-'+ mux.Date.format(currDate, 'yyyyMMdd HH:mm:ss')},
            //     "rollback": "yes"
            // })

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
                "code" : new_pre_order_code,
                "type" : belong_data.type,
                "classification" : belong_data.classification,
                "product_code" : belong_data.product_code,
                "item_code" : belong_data.item_code,
                "name" : belong_data.name,
                "model" : belong_data.model,
                "spec" : belong_data.spec,
                "manufacturer" : belong_data.manufacturer,
                "unit_price" : typeof belong_data.unit_price === 'number' ? belong_data.unit_price : belong_data.unit_price ? Number(belong_data.unit_price.replace(/,/g, '').replace('₩ ', '').trim()) : 0,
                "purchase_num" : belong_data.purchase_set_num,
                "purchase_estimate_phase" : belong_data.purchase_estimate_company === '' ? '미요청' : '완료',
                "purchase_estimate_company" : belong_data.purchase_estimate_company,
                "purchase_estimate_file" : belong_data.purchase_estimate_file_name,
                "purchase_estimate_thumbnail" : belong_data.purchase_estimate_thumbnail,
              },
              "select_where": {"code": new_pre_order_code, "product_code": data.product_code, "item_code": data.item_code},
              "rollback": "yes"
            })
          }

          // 선주문을 연결했지만 구매 요청 수량을 입력하여 추가 구매 요청을 하는 경우
          if(data.purchase_num > 0){
            if (!confirmation_inserted){
              purchase_confirmation_insert.push({
                "user_info": {
                    "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                    "role": "creater"
                  },
                  "data":{
                    "code" : purchase_code,
                    "cost_calc_code" : '',
                    "project_code" : '' ,
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
              confirmation_inserted = true;
            }
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
                "unit_price" : typeof data.unit_price === 'number' ? data.unit_price : data.unit_price ? Number(data.unit_price.replace(/,/g, '').replace('₩ ', '').trim()) : 0,
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
          if (!confirmation_inserted){
            purchase_confirmation_insert.push({
              "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data":{
                  "code" : purchase_code,
                  "cost_calc_code" : '',
                  "project_code" : '' ,
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
            confirmation_inserted = true;
          }

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
              "unit_price" : typeof data.unit_price === 'number' ? data.unit_price : data.unit_price ? Number(data.unit_price.replace(/,/g, '').replace('₩ ', '').trim()) : 0,
              "purchase_num" : data.purchase_num,
              "purchase_estimate_phase" : data.purchase_estimate_company === '' ? '미요청' : '완료',
              "purchase_estimate_code" : data.purchase_estimate_company === '' ? '' : data.purchase_estimate_company + '_' + mux.Date.format(currDate, 'yyyy-MM-dd HH-mm-ss-fff') + '_' + this.$cookies.get(this.$configJson.cookies.id.key),
              "purchase_estimate_company" : data.purchase_estimate_company,
              "purchase_estimate_file" : data.purchase_estimate_file_name,
              "purchase_estimate_thumbnail" : data.purchase_estimate_thumbnail,
            },
            "select_where": {"code": purchase_code, "product_code": data.product_code, "item_code": data.item_code},
            "rollback": "yes"
          })

          if (data.purchase_estimate_company){
            files.push({
              "folder": "purchase/purchase_estimate",
              "file": data.purchase_estimate_file_value,
              "prefix": purchase_code + '_',
              "name": data.purchase_estimate_file_name
            });
          }
        }
      }
      // purchase_data.forEach(async data => {
      // })

      sendData["purchase_confirmation_table-insert"] = purchase_confirmation_insert;
      sendData["purchase_confirmation_table-update"] = purchase_confirmation_update;
      sendData["purchase_product_table-insert"] = purchase_product_insert;
      sendData["purchase_product_table-update"] = purchase_product_update;
      sendData["files"] = files;

      console.log("sendData 구매 : ", sendData);
      return sendData;
    },

    estiamteDialog(item){
      this.estimatedDialog = true;
      this.estimate_company = item.purchase_estimate_company;
      this.purchaseEstimateThumbnail = item.purchase_estimate_thumbnail;
      this.purchaseEstimateFile = item.purchase_estimate_file;
      this.purchaseEstimateCode = item.code;
    },

    async searchCurrentCode(code){
      const prevURL = window.location.href;
      // let code = 'PEPR_' + mux.Date.format(currDate, 'yyyy-MM-dd HH-mm-ss-fff') + '-' + this.$cookies.get(this.$configJson.cookies.id.key);
      // let code = 'PEPR_' + mux.Date.format(currDate, 'yyMMdd') + '_';
      let current_code = '';
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "purchase_confirmation_table.code": code
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

          let searched = result.data;
          // 정렬
          if(searched.length > 0){
            searched.sort((a,b) => a.code.localeCompare(b.code));
            current_code = searched[searched.length-1].code;
          } else {
            current_code = '';
          }
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
      return current_code;
    },

  },
  data(){
    return{
      clearFlag: false,
      type_obtain: '프로젝트',
      mux: mux,
      todayDate: '',
      username: '',
      searched_datas: {},
      product_cost_dialog: false,
      purchasers: [],
      select_purchase_manager: '',
      select_purchase_manager2: '',
      pre_ordered_product_code: '',
      production_steppers: 1,
      production_step: 4,
      unestimated_steppers: 1,
      unestimated_step: 2,
      pre_order_set_num: 0,

      estimate_cost_dialog: false,
      edit_estimate_info_disabled: true,
      edit_survey_cost_num_disabled: true,
      edit_buttons_show: true,
      during_edit: false,
      editable_bom_list: false,

      tab_main: null,
      tab_search: null,
      tab_write: null,
      tab_dialog_search_product: null,
      tab_main_items: DesignProductionPageConfig.tab_main_items,
      dialog_search_product_items: DesignProductionPageConfig.dialog_search_product_items,
      dialog_search_product: false,
      dialog_bom_detail: false,
      dialog_payment: false,
      dialog_search_product_data: [],
      dialog_calculate_labor: false,
      dialog_edit_purchase_requested: false,
      blueprint_inputs_show: false,
      bom_product_search: false,
      pre_ordered_dialog: false,
      unestimatedMailDialog: false,
      show_selected_unestimated_data: false,
      edit_production_files: false,
      member_dialog: false,
      member_dialog2: false,
      member_type_index:0,
      members_list:[],
      members_list2:[],

      labor_list:[],
      labor_occupation_list:[],

      obtain_type: '프로젝트',
      search_complete_product_code: '',
      search_complete_product_name: '',
      search_product_capacity: '',

      type_list: DesignProductionPageConfig.type_list,
      estimate_member_info: JSON.parse(JSON.stringify(DesignProductionPageConfig.estimate_member_info)),
      estimate_member_info2: JSON.parse(JSON.stringify(DesignProductionPageConfig.estimate_member_info)),
      content_save_items: DesignProductionPageConfig.content_save_items,
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
      bom_list_purchase_headers2: DesignProductionPageConfig.bom_list_purchase_headers2,

      // print_labor_table: false,
      editedIndex: -1,
      save_costs: ProductCostPageConfig.save_costs,
      labor_selectable: [],
      labor_occupation_selectable: [],

      labor_data:[],

      calculate_tab_items: ProductCostPageConfig.calculate_tab_items,
      search_cost_headers: ProductCostPageConfig.search_cost_headers,
      dialog_labor_cost_headers: ProductCostPageConfig.dialog_labor_cost_headers,

      dialog_selected_product_data:{},
      search_cost_data: [

      ],

      searched_product_data: [],
      searched_product_data2: [],
      search_items_for_product_data: [],
      set_bom_list_data: [],
      set_bom_list_data_copy: [],
      set_bom_list_data2: [],
      previous_set_bom_list_data: [],
      previous_set_bom_list_data_copy: [],
      previous_set_bom_list_data2: [],
      product_search_item_headers: DesignProductionPageConfig.product_search_item_headers,
      product_item_setting_headers: DesignProductionPageConfig.product_item_setting_headers,
      setting_item_data: [],
      purchase_detail_data: [],
      bom_list_data: [],
      bom_list_data2: [],
      bom_list_purchase_data: [],
      bom_list_purchase_data_copy: [],
      bom_list_purchase_data2: [],
      selected_unestimated_data:[],
      bom_list_need_estiamte_data:[],
      classification_list:[],
      manufacturer_list: [],

      calc_cost_detail_data: JSON.parse(JSON.stringify(DesignProductionPageConfig.calc_cost_detail_data)),
      calc_cost_detail_data2: DesignProductionPageConfig.calc_cost_detail_data.map(x => {
        let new_x = JSON.parse(JSON.stringify(x));
        if (new_x.cost_list === '재료비') {
          new_x.costListBtn = {
            text: '공사자재',
            click: ()=>{this.dialog_search_product = true}
          }
        }else if (new_x.cost_list === '노무비') {
          new_x.belong_data[0].costListBtn = {
            text: '산출',
            click: ()=>{this.dialog_calculate_labor = true}
          }
        }
        return new_x;
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
      merged_labor_cost_list: [],

      clickedProductCost: {},
      origin_clickedProductCost: {},
      origin_calc_cost_detail_data: [],

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

      search_tab_items: DesignProductionPageConfig.search_tab_items,
      write_tab_items: DesignProductionPageConfig.write_tab_items,
      searchCardInputs: JSON.parse(JSON.stringify(DesignProductionPageConfig.searchCardInputs)),
      estimateSearchDefaultInfoInputs: JSON.parse(JSON.stringify(DesignProductionPageConfig.estimateSearchDefaultInfoInputs)),
      estimateSearchDefaultInfoInputs2: JSON.parse(JSON.stringify(DesignProductionPageConfig.estimateSearchDefaultInfoInputs2)),
      estimateSearchCompanyInfoInputs: JSON.parse(JSON.stringify(DesignProductionPageConfig.estimateSearchCompanyInfoInputs)),
      estimateWriteDefaultInfoInputs: JSON.parse(JSON.stringify(DesignProductionPageConfig.estimateWriteDefaultInfoInputs)),
      estimateWriteDefaultInfoInputs2: JSON.parse(JSON.stringify(DesignProductionPageConfig.estimateWriteDefaultInfoInputs2)),
      estimateWriteCompanyInfoInputs: JSON.parse(JSON.stringify(DesignProductionPageConfig.estimateWriteCompanyInfoInputs)),
      estimateFilesInputs: JSON.parse(JSON.stringify(DesignProductionPageConfig.estimateFilesInputs)),
      estimateFilesInputs2: JSON.parse(JSON.stringify(DesignProductionPageConfig.estimateFilesInputs2)),
      estimateWriteFilesInputs: JSON.parse(JSON.stringify(DesignProductionPageConfig.estimateWriteFilesInputs)),
      estimateWriteFilesInputs2: JSON.parse(JSON.stringify(DesignProductionPageConfig.estimateWriteFilesInputs2)),
      search_estimate_data: [],

      writeIssueDate: new Date().toISOString().substr(0, 10),

      productSearchItemInputs: DesignProductionPageConfig.productSearchItemInputs,
      estimateDefaultInfoInputs: DesignProductionPageConfig.estimateDefaultInfoInputs,
      // estimateCompanyInfoInputs: DesignProductionPageConfig.estimateCompanyInfoInputs,
      bomProductSearchInputs: DesignProductionPageConfig.bomProductSearchInputs,
      searchPurchaseInputs: DesignProductionPageConfig.searchPurchaseInputs,
      selected_unestimated_headers: DesignProductionPageConfig.selected_unestimated_headers,
      estimateInfoInputs:DesignProductionPageConfig.estimateInfoInputs,
      purchase_member_info:DesignProductionPageConfig.purchase_member_info,
      purchase_member_info2:DesignProductionPageConfig.purchase_member_info,

      estimatedDialog: false,
      estimate_company: '',
      purchaseEstimateThumbnail: '',
      purchaseEstimateFile: '',
      purchaseEstimateCode: '',

      loaded_obtain_cost_calc_code: '',
      lastSearchInputs: [],

      defaultRules: [
        v => (!!v) || '필수 입력'
      ],
    }
  },
}
</script>
<style>

</style>
