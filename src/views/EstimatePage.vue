
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
                                    : item.click === 'pdf' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcEstimateCard, 'edit_survey_cost_data', '견적서') : ''"
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
                          <img
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
                            <v-col cols="12" sm="10" class="font-weight-bold">{{ clickedProductCost.company_name ? clickedProductCost.company_name : '' }}</v-col>
                            <v-col cols="12" sm="2">귀하</v-col>
                          </v-row>
                          <table style=" border-spacing: 0px; width: 100%;" class="mt-1">
                            <tr class="text-body-1">
                              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">발행일</td>
                              <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.issue_date ? mux.Date.format(clickedProductCost.issue_date, 'yyyy-MM-dd') : '' }}</td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">용역명</td>
                              <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.service_name ? clickedProductCost.service_name : '' }}</td>
                            </tr>
                            <tr>
                              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">용역기간</td>
                              <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.service_period ? clickedProductCost.service_period : '' }}</td>
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
                              <td class="estimate_info" >{{ clickedProductCost.given_name ? clickedProductCost.given_name : '' }}</td>
                              <td class="estimate_info estimate_title text-center" >연락처</td>
                              <td class="estimate_info">{{ clickedProductCost.office_phone_number ? clickedProductCost.office_phone_number : '' }}</td>
                            </tr>
                          </table>
                        </v-col>
                        <v-col cols="12" sm="12" class="pt-0">
                          <table style=" border-spacing: 0px; width: 100%;" class="mb-5">
                            <tr>
                              <td class="estimate_price_info estimate_price_title text-center">일금</td>
                              <td class="estimate_price_info"><span class="font-weight-bold">{{ !total_cost || isNaN(total_cost) ? '' : mux.Number.toKorean(total_cost, ' 원정') }} </span>{{ !total_cost || isNaN(total_cost) ? '' : `(￦ ${mux.Number.withComma(total_cost)})` }} <span style="font-size:11px" class="pl-10">* 부가가치세(VAT) 별도</span></td>
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
                        :show-grand-childs-parent-index-arr="[0, 1]"
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
                              && !clickedProductCost.approved_date
                              && clickedProductCost.is_last_confirmation
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
                        <p class="text-h6 font-weight-bold py-2 px-4" style="background-color: #E3F2FD;" >견적서 정보</p>
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

                        <p class="text-h6 font-weight-bold py-2 px-4 mt-12" style="background-color: #E3F2FD;" >첨부</p>
                        <v-row
                          v-if="edit_estimate_info_disabled"
                        >
                          <v-col cols="12" sm="4">
                            <p class="font-weight-bold primary--text mb-0">▼ 승인서</p>
                            <!-- <div style="width:100%; background-color: #ccc; min-height:300px"></div> -->
                            <v-img
                              v-if="clickedProductCost.approval_file"
                              alt="thumbnail"
                              class="shrink mr-2"
                              contain
                              :src="mux.Util.imageBinary(clickedProductCost.approval_thumbnail)"
                              transition="scale-transition"
                              width="350"
                              @click="download('estimate/approval', clickedProductCost.approval_file.replace(clickedProductCost.approval_file.split('_')[0]+'_'+clickedProductCost.approval_file.split('_')[1]+'_', ''), clickedProductCost.approval_file.split('_')[0]+'_'+clickedProductCost.approval_file.split('_')[1]+'_')"
                              style="cursor: pointer;"
                            />
                          </v-col>
                          <v-col cols="12" sm="4">
                            <p class="font-weight-bold primary--text mb-0">▼ 도면</p>
                            <!-- <div style="width:100%; background-color: #ccc; min-height:300px"></div> -->
                            <v-img
                              v-if="clickedProductCost.blueprint_file"
                              alt="thumbnail"
                              class="shrink mr-2"
                              contain
                              :src="mux.Util.imageBinary(clickedProductCost.blueprint_thumbnail)"
                              transition="scale-transition"
                              width="350"
                              @click="download('estimate/blueprint', clickedProductCost.blueprint_file.replace(clickedProductCost.blueprint_file.split('_')[0]+'_'+clickedProductCost.blueprint_file.split('_')[1]+'_', ''), clickedProductCost.blueprint_file.split('_')[0]+'_'+clickedProductCost.blueprint_file.split('_')[1]+'_')"
                              style="cursor: pointer;"
                            />
                          </v-col>
                          <v-col cols="12" sm="4">
                            <p class="font-weight-bold primary--text mb-0">▼ 기타 첨부</p>
                            <div v-if="clickedProductCost.etc_files">
                              <v-chip
                                v-for="(file, i) in clickedProductCost.etc_files.split('/')"
                                :key="i"
                                color="grey lighten-2"
                                class="ma-2"
                                @click="download('estimate/etc', file.replace(file.split('_')[0]+'_'+file.split('_')[1]+'_', ''), file.split('_')[0]+'_'+file.split('_')[1]+'_')"
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
                              :inputs="estimateFilesInputs"
                            >
                            </InputsFormComponent>
                          </v-col>
                        </v-row>
                      </v-form>
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
                            @click="edit_survey_cost_num_disabled = true; during_edit = false"
                          >
                            <v-icon
                              small
                            >mdi-undo-variant</v-icon>
                          </v-btn>
                          <v-btn
                            v-if="clickedProductCost.creater && clickedProductCost.creater === $cookies.get($configJson.cookies.id.key)
                              && !clickedProductCost.approved_date
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
                            @click="clickedProductCost.estimate_type === '재료비' ? dialog_search_product = true : dialog_payment = true"
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
                          :preventButton="true"
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
                            v-if="clickedProductCost.creater && clickedProductCost.creater === $cookies.get($configJson.cookies.id.key)
                              && !clickedProductCost.approved_date
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
                        :dialog-value="member_dialog2"
                        :persistent="true"
                        @close="close"
                        @setMember = "setMember"
                        @members = "members"
                      >
                      </MemberSearchDialogComponent>
                      <v-chip
                        class="mr-2 mb-4"
                        style="cursor:pointer"
                        v-for="(member, i) in estimate_member_info2"
                        :key="i"
                        :color="member.name ? 'success' : 'default'"
                        @click="selectMemberDialog(i)"
                      >
                        {{ member.type }} : {{ member.name }}
                      </v-chip>
                    </v-card-title>
                    <v-card-text>
                      <v-form ref="estimateInfoForm2">
                        <p class="text-h6 font-weight-bold py-2 px-4 mb-8" style="background-color: #E3F2FD;" >견적서 정보</p>
                        <InputsFormComponent
                          dense
                          clearable
                          :inputs="estimateWriteDefaultInfoInputs"
                          @dateChanged="(date) => writeIssueDate = date"
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
                        <InputsFormComponent
                          dense
                          clearable
                          :inputs="estimateWriteFilesInputs"
                        >
                        </InputsFormComponent>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <!-- 산출내역서 -->
                <v-tab-item>
                  <v-card>
                    <v-card-title>
                      <v-row>
                        <v-col cols="12" sm="10">
                          <p class="text-h5 black--text mb-0 font-weight-black float-left "  style="font-weight: bold;">
                            산출내역서
                          </p>
                          <v-radio-group
                            v-show="false"
                            v-model="estimate_type"
                            class="mt-0 float-left ml-3"
                            row
                          >
                            <v-radio
                              label="재료"
                              value="재료비"
                            ></v-radio>
                            <v-radio
                              label="기술"
                              value="기술료"
                            ></v-radio>
                          </v-radio-group>
                        </v-col>
                      </v-row>

                    </v-card-title>
                    <v-card-text>
                      <v-form ref="surveyCostForm2">
                        <CostTableComponent
                          :headers="survey_cost_headers"
                          :items="calc_cost_detail_data2"
                          item-key="product_code"
                          trStyle="background-color:#efefef; "
                          trClass="font-weight-black estimate_title"
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
                    <v-btn
                      color="grey lighten-4"
                      small
                      class="mr-4 float-right"
                      elevation="1"
                      @click="estimate_cost_dialog = true"
                    >
                      견적 불러오기
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
                      <img
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
                        <v-col cols="12" sm="10" class="font-weight-bold">{{ estimateWriteCompanyInfoInputs.find(x=>x.label === '업체명').value }}</v-col>
                        <v-col cols="12" sm="2">귀하</v-col>
                      </v-row>
                      <table style=" border-spacing: 0px; width: 100%;" class="mt-1">
                        <tr class="text-body-1">
                          <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">발행일</td>
                          <td class="estimate_info" style="border-bottom: 0px;">{{ writeIssueDate }}</td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">용역명</td>
                          <td class="estimate_info" style="border-bottom: 0px;">{{ estimateWriteDefaultInfoInputs2.find(x=>x.label === '용역명').value }}</td>
                        </tr>
                        <tr>
                          <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">용역기간</td>
                          <td class="estimate_info" style="border-bottom: 0px;">{{ estimateWriteDefaultInfoInputs2.find(x=>x.label === '용역기간').value }}</td>
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
                          <td class="estimate_info" >{{ $cookies.get($configJson.cookies.name.key).trim() }}</td>
                          <td class="estimate_info estimate_title text-center" >연락처</td>
                          <td class="estimate_info">{{ $cookies.get($configJson.cookies.office_phone_number.key) }}</td>
                        </tr>
                      </table>
                    </v-col>
                    <v-col cols="12" sm="12" class="pt-0">
                      <table style=" border-spacing: 0px; width: 100%;" class="mb-5">
                        <tr>
                          <td class="estimate_price_info estimate_price_title text-center">일금</td>
                          <td class="estimate_price_info"><span class="font-weight-bold">{{ !total_cost2 || isNaN(total_cost2) ? '' : mux.Number.toKorean(total_cost2, ' 원정') }} </span>{{ !total_cost2 || isNaN(total_cost2) ? '' : `(￦ ${mux.Number.withComma(total_cost2)})` }} <span style="font-size:11px" class="pl-10">* 부가가치세(VAT) 별도</span></td>
                        </tr>
                      </table>
                    </v-col>
                  </v-row>
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
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
      <!-- 노무비 산출 출력 화면 -->
      <div ref="calcLaborCard" style="background-color: white; max-width:800px" v-show="print_labor_table" id="print_labor_cost">
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
                <td align="center">{{ Math.round(item.surcharge_ratio * 100 * 10000000) / 10000000 }}%</td>
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
            <!-- <v-btn
              color="primary"
              fab
              x-small
              elevation="1"
              class="float-right mr-2"
            >
              <v-icon small>mdi-content-save</v-icon>
            </v-btn> -->
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
                      :disabled="
                        tab_main === 0 ? calc_cost_detail_data_product_cost.belong_data.findIndex(x => x.belong_data.find(xx => xx.cost_list === item.complete_product_name)) >= 0
                        : calc_cost_detail_data_product_cost2.belong_data.findIndex(x => x.belong_data.find(xx => xx.cost_list === item.complete_product_name)) >= 0"
                    >추가
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
                              : calc_cost_detail_data_product_cost2.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재')) ? calc_cost_detail_data_product_cost2.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재')).belong_data : []
                            "
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
            </v-tab-item>
          </v-tabs-items>
        </v-container>
      </ModalDialogComponent>

    <!-- 기술료 작성 Modal -->
    <ModalDialogComponent
        :dialog-value="dialog_payment"
        max-width="1000px"
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
                class="float-right white--text"
                elevation="1"
                @click="dialog_payment=false"
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
                              ? calc_cost_detail_data_product_cost.belong_data
                              : calc_cost_detail_data_product_cost2.belong_data"
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
      <ProductCostSearchDialogComponent
        :dialog-value="product_cost_dialog"
        :persistent="true"
        @apply="applyCostLoad"
        @close="closeCostSearchDialog"
      >
      </ProductCostSearchDialogComponent>
      <EstimateCostHistorySearchDialogComponent
        :dialog-value="estimate_cost_dialog"
        :persistent="true"
        @apply="applyEstimateLoad"
        @close="closeCostSearchDialog"
      >
      </EstimateCostHistorySearchDialogComponent>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import DataTableComponent from "@/components/DataTableComponent.vue";
import ProductCostPageConfig from "@/configure/ProductCostPageConfig.json";
import EstimatePageConfig from "@/configure/EstimatePageConfig.json";

import CostTableComponent from "@/components/CostTableComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent";
import MemberSearchDialogComponent from "@/components/MemberSearchDialogComponent";
import ProductCostSearchDialogComponent from "@/components/ProductCostSearchDialogComponent.vue";
import EstimateCostHistorySearchDialogComponent from "@/components/EstimateCostHistorySearchDialogComponent.vue";

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
                ProductCostSearchDialogComponent,
                EstimateCostHistorySearchDialogComponent,
              },

  created () {
    this.initialize()
    this.members()
  },
  watch:{
    clickedProductCost: {
      handler(item){
        if (Object.keys(item).length > 0) {
          this.estimate_member_info[0].name = item.checker;
          this.estimate_member_info[0].user_id = item.checker_id;
          this.estimate_member_info[0].checked_date = item.checked_date;
          this.estimate_member_info[1].name = item.approver;
          this.estimate_member_info[1].user_id = item.approver_id;
          this.estimate_member_info[1].checked_date = item.approved_date;

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
          this.input_inhouse_bid_number.value = item.inhouse_bid_number;
          this.input_company_bid_number.value = item.company_bid_number;
          this.input_due_date.value = item.due_date;
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
    during_edit() {
      this.estimateFilesInputs = JSON.parse(JSON.stringify(EstimatePageConfig.estimateFilesInputs));
    },
    estimate_type(newValue){
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
            text: '작성',
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
      this.estimateSearchCompanyInfoInputs.forEach(input => {
        input.disabled = disable;
      });
      this.estimateSearchDefaultInfoInputs.forEach(input => {
        if (input.label !== '사내 견적번호'){
          input.disabled = disable;
        }
      });
      this.estimateSearchDefaultInfoInputs2.forEach(input => {
        input.disabled = disable;
      });
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
    input_inhouse_bid_number() { return this.estimateSearchDefaultInfoInputs.find(x=>x.label === '사내 견적번호') },
    input_company_bid_number() { return this.estimateSearchDefaultInfoInputs.find(x=>x.label === '기업별 입찰번호') },
    input_due_date() { return this.estimateSearchDefaultInfoInputs2.find(x=>x.label === '납기') },
    input_service_name() { return this.estimateSearchDefaultInfoInputs2.find(x=>x.label === '용역명') },
    input_service_period() { return this.estimateSearchDefaultInfoInputs2.find(x=>x.label === '용역기간') },
    input_remark() { return this.estimateSearchDefaultInfoInputs2.find(x=>x.label === '특이사항') },
    input_company_name() { return this.estimateSearchCompanyInfoInputs.find(x=>x.label === '업체명') },
    input_company_manager() { return this.estimateSearchCompanyInfoInputs.find(x=>x.label === '담당자') },
    input_company_manager_email() { return this.estimateSearchCompanyInfoInputs.find(x=>x.label === '담당자 E-mail') },
    input_company_manager_phone() { return this.estimateSearchCompanyInfoInputs.find(x=>x.label === '담당자 연락처') },
    input_approval_file() { return this.estimateFilesInputs.find(x=>x.column_name === 'approval')},
    input_blueprint_file() { return this.estimateFilesInputs.find(x=>x.column_name === 'blueprint')},
    input_etc_file() { return this.estimateFilesInputs.find(x=>x.column_name === 'files')},

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
    input_inhouse_bid_number2() { return this.estimateWriteDefaultInfoInputs.find(x=>x.label === '사내 견적번호') },
    input_company_bid_number2() { return this.estimateWriteDefaultInfoInputs.find(x=>x.label === '기업별 입찰번호') },
    input_due_date2() { return this.estimateWriteDefaultInfoInputs2.find(x=>x.label === '납기') },
    input_service_name2() { return this.estimateWriteDefaultInfoInputs2.find(x=>x.label === '용역명') },
    input_service_period2() { return this.estimateWriteDefaultInfoInputs2.find(x=>x.label === '용역기간') },
    input_remark2() { return this.estimateWriteDefaultInfoInputs2.find(x=>x.label === '특이사항') },
    input_company_name2() { return this.estimateWriteCompanyInfoInputs.find(x=>x.label === '업체명') },
    input_company_manager2() { return this.estimateWriteCompanyInfoInputs.find(x=>x.label === '담당자') },
    input_company_manager_email2() { return this.estimateWriteCompanyInfoInputs.find(x=>x.label === '담당자 E-mail') },
    input_company_manager_phone2() { return this.estimateWriteCompanyInfoInputs.find(x=>x.label === '담당자 연락처') },
    input_approval_file2() { return this.estimateWriteFilesInputs.find(x=>x.column_name === 'approval')},
    input_blueprint_file2() { return this.estimateWriteFilesInputs.find(x=>x.column_name === 'blueprint')},
    input_etc_file2() { return this.estimateWriteFilesInputs.find(x=>x.column_name === 'files')},
  },

  methods:{
    // eslint-disable-next-line no-unused-vars

    async initialize(){
      this.calc_cost_detail_data2 = EstimatePageConfig.calc_cost_detail_data.map(x => {
        let new_x = JSON.parse(JSON.stringify(x));
        if (new_x.cost_list === '재료비') {
          new_x.costListBtn = {
            text: '작성',
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
      this.estimate_member_info = JSON.parse(JSON.stringify(EstimatePageConfig.estimate_member_info));
      this.estimate_member_info2 = JSON.parse(JSON.stringify(EstimatePageConfig.estimate_member_info));
      this.estimate_member_info2[0].name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
      this.estimate_member_info2[0].email =  this.$cookies.get(this.$configJson.cookies.email.key);
      this.estimate_member_info2[0].user_id =  this.$cookies.get(this.$configJson.cookies.id.key);

      const prevURL = window.location.href;
      try {
        if (prevURL !== window.location.href) return;


        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          "params": [
            {}
          ],
          "script_file_name": "rooting_원가_페이지_진입_24_05_20_10_42_VOT.json",
          "script_file_path": "data_storage_pion\\json_sql\\cost\\원가_페이지_진입_24_05_20_10_43_7F2"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
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
      this.input_inhouse_bid_number.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_due_date.rules = [
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
      this.input_inhouse_bid_number2.rules = [
        v => (!!v) || '필수 입력'
      ];
      this.input_due_date2.rules = [
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

      const currDate = new Date();
      this.estimateWriteDefaultInfoInputs.find(x=>x.label === '사내 견적번호').value = 'PEPQ_' + mux.Date.format(currDate, 'yyMMdd')
      this.clearClicked();
    },
    async searchButton(){
      mux.Util.showLoading();

      let inputs = [];
      this.searchCardInputs.forEach((input) => {
        if (input.value && String(input.value).trim()) {
          inputs.push(String(input.value).trim());
        }else {
          inputs.push("");
        }
      });
      console.log('inputs :>> ', inputs);

      const prevURL = window.location.href;
      let reqURL = '/api/estimate/';
      // approval_phase = '';
      if (inputs[0]){
        reqURL += '?inhouse_bid_number=' + inputs[0];
      }
      if (inputs[1]){
        reqURL += inputs[0] ? '&company_bid_number=' + inputs[1] : '?company_bid_number=' + inputs[1];
      }
      if (inputs[2]){
        reqURL += (inputs[0] || inputs[1]) ? '&company_name=' + inputs[2] : '?company_name=' + inputs[2];
      }
      if (inputs[3]){
        reqURL += (inputs[0] || inputs[1] || inputs[2]) ? '&issue_start_date=' + inputs[3].split(',')[0] : '?issue_start_date=' + inputs[3].split(',')[0];
        reqURL += inputs[3].split(',').length > 1 ? '&issue_end_date=' + inputs[3].split(',')[1] : '&issue_end_date=' + inputs[3].split(',')[0];
      }

      try {
        let result = await mux.Server.get({path: reqURL});
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          const searchResult = result.data;
          // const searchResult = JSON.parse(JSON.stringify(EstimatePageConfig.test_product_cost_data));
          searchResult.confirmation.reverse(); // 최신순으로 정렬
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
          this.clearClicked();
          this.searchDataCalcProcess(searchResult);

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
    applyCostLoad(loadData){
      const estimate = JSON.parse(JSON.stringify(loadData));

      this.calc_cost_detail_data_product_cost2.belong_data = [];
      if (estimate.product_cost_calc_detail){
        let estimateProduct = { cost_num: 1, cost_unit_price: 0 };
        estimate.product_cost_calc_detail.forEach((a,i)=>{
          if (i === 0){
            this.calc_cost_detail_data_product_cost2.belong_data.push({
              "cost_list": "가. 재료",
              "cost_list_colspan": 4,
              "belong_data": []
            });

            estimateProduct.product_code = a.product_code;
            estimateProduct.cost_list = a.product_name;
            estimateProduct.cost_list_sub = a.product_spec;
            estimateProduct.cost_unit = '제품';
            estimateProduct.cost_num_editable = true;
            estimateProduct.allow_one_or_greater = true;
            estimateProduct.cost_unit_price_editable = true;
            estimateProduct.cost_list_sub_editable = true;
            estimateProduct.deletable_row = true;
          }

          estimateProduct.cost_unit_price += Math.round(a.module_num > 0 ? a.module_num * a.module_unit_price : a.material_num * a.material_unit_price);
        });

        this.calc_cost_detail_data_product_cost2.belong_data[0].belong_data.push(estimateProduct);
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

      this.product_cost_dialog = false;
    },
    applyEstimateLoad(loadData){
      const estimate = JSON.parse(JSON.stringify(loadData));

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
      // this.input_inhouse_bid_number2.value = estimate.product_cost[0].inhouse_bid_number;
      this.input_company_bid_number2.value = estimate.product_cost[0].company_bid_number;
      this.input_due_date2.value = estimate.product_cost[0].due_date;
      this.input_service_name2.value = estimate.product_cost[0].service_name;
      this.input_service_period2.value = estimate.product_cost[0].service_period;
      this.input_remark2.value = estimate.product_cost[0].remark;
      this.input_company_name2.value = estimate.product_cost[0].company_name;
      this.input_company_manager2.value = estimate.product_cost[0].company_manager;
      this.input_company_manager_email2.value = estimate.product_cost[0].company_manager_email;
      this.input_company_manager_phone2.value = estimate.product_cost[0].company_manager_phone;

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
    async searchProduct(){
      mux.Util.showLoading();
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
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
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
            data.unit_price = '₩ ' + data.unit_price.toLocaleString();

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
          mux.Util.showAlert(result);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
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
    clickSearchedTr(item) {
      this.clearClicked();

      //item.type이 기술료인지 재료비인지 판단하여 양식 변경
      this.calc_cost_detail_data.shift();
      let payment = {"cost_list": "기술료", "cost_list_colspan": 4, "belong_data": []};
      let material =  {
        "cost_list": "재료비",
        "cost_list_colspan": 4,
        "belong_data": []
      };

      if(item.estimate_type === '기술료'){
        this.calc_cost_detail_data.unshift(payment);
      }else{
        this.calc_cost_detail_data.unshift(material);
      }

      this.edit_buttons_show = true;
      this.clickedProductCost = item;
      if (this.searched_datas.last_confirmation.findIndex(x=>x.cost_calc_code === item.cost_calc_code) > -1){
        this.clickedProductCost.is_last_confirmation = true;
      }

    },
    deleteItem () {
      this.dialogDelete = true;
    },
    async deleteItemConfirm () {
      let sendData = {
        "product_cost_table-delete": [{
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "modifier"
          },
          "data":{},
          "delete_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
          "rollback": "yes"
        }],
        "product_cost_calc_detail_table-delete": [{
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "modifier"
          },
          "data":{},
          "delete_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
          "rollback": "yes"
        }],
        "labor_cost_calc_detail_table-delete": [{
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "modifier"
          },
          "data":{},
          "delete_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
          "rollback": "yes"
        }],
      };

      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: sendData
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
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
          mux.Util.showAlert('삭제되었습니다.', '삭제 완료', 3000);
          this.clearClicked();
          this.closeDelete();
        } else {
          mux.Util.showAlert(result);
          return;
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
        return;
      }
    },
    closeDelete(){
      this.dialogDelete = false;
    },
    clearClicked() {
      this.clearFlag = true;
      this.estimate_member_info = JSON.parse(JSON.stringify(EstimatePageConfig.estimate_member_info));

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
      this.input_inhouse_bid_number.value = '';
      this.input_company_bid_number.value = '';
      this.input_due_date.value = '';
      this.input_service_name.value = '';
      this.input_service_period.value = '';
      this.input_remark.value = '';
      this.input_company_name.value = '';
      this.input_company_manager.value = '';
      this.input_company_manager_email.value = '';
      this.input_company_manager_phone.value = '';
      this.estimateFilesInputs = JSON.parse(JSON.stringify(EstimatePageConfig.estimateFilesInputs));

      this.edit_survey_cost_num_disabled = true;
      this.edit_estimate_info_disabled = true;
      this.edit_buttons_show = false;
      this.during_edit = false;
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

        let new_inhouse_bid_number = '';
        if (this.clickedProductCost.full_created_time === this.clickedProductCost.full_modified_time){
          new_inhouse_bid_number = this.input_inhouse_bid_number.value + '-1';
        }else {
          let splitted_inhouse_bid_number = this.input_inhouse_bid_number.value.split('-');
          let origin_modified_num = splitted_inhouse_bid_number[splitted_inhouse_bid_number.length - 1];
          let new_modified_num = Number(origin_modified_num) + 1;
          splitted_inhouse_bid_number[splitted_inhouse_bid_number.length - 1] = new_modified_num;
          new_inhouse_bid_number = splitted_inhouse_bid_number.join('-');
        }

        const new_cost_calc_code = mux.Date.format(newDate, 'yyyy-MM-dd HH-mm-ss-fff') + '_' + this.$cookies.get(this.$configJson.cookies.id.key);

        // 품번 기준 정렬
        this.labor_cost_data.sort((a,b) => a.no.localeCompare(b.no));

        let sendData = {
          "estimate_confirmation_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{
              "cost_calc_code": new_cost_calc_code,
              "inhouse_bid_number": new_inhouse_bid_number,
              "approval_phase": sendDataCheckedDate === null ? '미확인' : '미승인',
              "checked_date": sendDataCheckedDate,
              "rejecter": '',
              "rejected_date": null,
              "reject_reason": '',
            },
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "yes"
          }],
          "estimate_cost_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "yes"
          }],
          "estimate_cost_calc_detail_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "no"
          }],
          "estimate_construction_detail_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "no"
          }],
          "estimate_labor_cost_calc_detail_table-delete": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{},
            "delete_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "yes"
          }],
          "estimate_labor_cost_calc_detail_table-insert": []
        };
        this.labor_cost_data.forEach(data => {
          data.cost_calc_code = new_cost_calc_code;
          sendData["estimate_labor_cost_calc_detail_table-insert"].push({
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
            targetConfirmation.inhouse_bid_number = new_inhouse_bid_number;

            this.origin_labor_cost_data = this.labor_cost_data;
            this.searched_datas.labor_cost_calc_detail = this.searched_datas.labor_cost_calc_detail.filter(x=>x.cost_calc_code !== this.clickedProductCost.cost_calc_code);
            this.labor_cost_data.forEach(data => {
              this.searched_datas.labor_cost_calc_detail.push(data);
            });
            targetConfirmation.cost_calc_code = new_cost_calc_code;
            this.searched_datas.last_confirmation.find(x=>x.cost_calc_code === this.clickedProductCost.cost_calc_code).cost_calc_code = new_cost_calc_code;

            this.clickedProductCost.modified_time = mux.Date.format(newDate, 'yyyy-MM-dd HH:mm:ss');
            this.clickedProductCost.checked_date = this.estimate_member_info[0].checked_date;
            this.clickedProductCost.approval_phase = sendDataCheckedDate === null ? '미확인' : '미승인';
            this.clickedProductCost.rejecter = '';
            this.clickedProductCost.rejected_date = '';
            this.clickedProductCost.reject_reason = '';
            this.input_inhouse_bid_number.value = new_inhouse_bid_number;
            this.clickedProductCost.inhouse_bid_number = this.input_inhouse_bid_number.value;
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
                    <h2 style="text-align: center; color:#13428a">견적서 ${sendDataCheckedDate === null ? '확인' : '승인'} 요청 알림</h2>
                    <table style="width: 100%;border-spacing: 10px 10px;">
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
                    <a style="color: white; text-decoration:none"href="${prevURL}-search?inhouse_bid_number=${this.clickedProductCost.inhouse_bid_number}&company_bid_number=${this.clickedProductCost.company_bid_number}&company_name=${this.clickedProductCost.company_name}&issue_date=${this.clickedProductCost.issue_date}">
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
                  subject: "견적서 " + (sendDataCheckedDate === null ? '확인' : '승인') + " 요청 알림",
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

        let new_inhouse_bid_number = '';
        if (this.clickedProductCost.full_created_time === this.clickedProductCost.full_modified_time){
          new_inhouse_bid_number = this.input_inhouse_bid_number.value + '-1';
        }else {
          let splitted_inhouse_bid_number = this.input_inhouse_bid_number.value.split('-');
          let origin_modified_num = splitted_inhouse_bid_number[splitted_inhouse_bid_number.length - 1];
          let new_modified_num = Number(origin_modified_num) + 1;
          splitted_inhouse_bid_number[splitted_inhouse_bid_number.length - 1] = new_modified_num;
          new_inhouse_bid_number = splitted_inhouse_bid_number.join('-');
        }

        const new_cost_calc_code = mux.Date.format(newDate, 'yyyy-MM-dd HH-mm-ss-fff') + '_' + this.$cookies.get(this.$configJson.cookies.id.key);

        let sendData = {
          "estimate_confirmation_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{
              "cost_calc_code": new_cost_calc_code,
              "issue_date": this.input_issue_date.value,
              "inhouse_bid_number": new_inhouse_bid_number,
              "company_bid_number": this.input_company_bid_number.value,
              "due_date": this.input_due_date.value,
              "service_name": this.input_service_name.value,
              "service_period": this.input_service_period.value,
              "remark": this.input_remark.value,
              "company_name": this.input_company_name.value,
              "company_manager": this.input_company_manager.value,
              "company_manager_email": this.input_company_manager_email.value,
              "company_manager_phone": this.input_company_manager_phone.value,
              "approval_phase": sendDataCheckedDate === null ? '미확인' : '미승인',
              "checker": this.estimate_member_info[0].name,
              "checker_id": this.estimate_member_info[0].user_id,
              "checked_date": sendDataCheckedDate,
              "approver": this.estimate_member_info[1].name,
              "approver_id": this.estimate_member_info[1].user_id,
              "rejecter": '',
              "rejected_date": null,
              "reject_reason": '',
            },
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "yes"
          }],
          "estimate_cost_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "yes"
          }],
          "estimate_cost_calc_detail_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "no"
          }],
          "estimate_construction_detail_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "no"
          }],
          "estimate_labor_cost_calc_detail_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "yes"
          }]
        };

        sendData.path = '/api/multipart_rest_api/';
        sendData.prefix = new_cost_calc_code + '_';
        sendData.files = [];

        if (this.input_approval_file.value){
          sendData['estimate_confirmation_table-update'][0].data.approval_file = new_cost_calc_code + '_' + this.input_approval_file.value.name;
          sendData['estimate_confirmation_table-update'][0].data.approval_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_approval_file.value, 1, false, 1000, 1000));
          sendData.files.push({
            "column_name": "approval",
            "file": this.input_approval_file.value,
            "name": this.input_approval_file.value.name
          });
        }
        if (this.input_blueprint_file.value){
          sendData['estimate_confirmation_table-update'][0].data.blueprint_file = new_cost_calc_code + '_' + this.input_blueprint_file.value.name;
          sendData['estimate_confirmation_table-update'][0].data.blueprint_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_blueprint_file.value, 1, false, 1000, 1000));
          sendData.files.push({
            "column_name": "blueprint",
            "file": this.input_blueprint_file.value,
            "name": this.input_blueprint_file.value.name
          });
        }
        if (this.input_etc_file.value && this.input_etc_file.value.length > 0){
          sendData['estimate_confirmation_table-update'][0].data.etc_files = this.input_etc_file.value.map(x=>new_cost_calc_code + '_' + x.name).join('/');
          this.input_etc_file.value.forEach(file => {
            sendData.files.push({
              "column_name": "files",
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
            const newApprovalFile = this.estimateFilesInputs.find(x=>x.column_name === 'approval').value;
            const newBlueprintFile = this.estimateFilesInputs.find(x=>x.column_name === 'blueprint').value;
            const newEtcFiles = this.estimateFilesInputs.find(x=>x.column_name === 'files').value;

            let targetConfirmation = this.searched_datas.confirmation.find(item => item.cost_calc_code === this.clickedProductCost.cost_calc_code);
            targetConfirmation.cost_calc_code = new_cost_calc_code;
            this.searched_datas.last_confirmation.find(x=>x.cost_calc_code === this.clickedProductCost.cost_calc_code).cost_calc_code = new_cost_calc_code;
            this.searched_datas.product_cost_calc_detail.forEach(item => {
              if (item.cost_calc_code === this.clickedProductCost.cost_calc_code){
                item.cost_calc_code = new_cost_calc_code;
              }
            });
            this.searched_datas.construction_materials_data.forEach(item => {
              if (item.cost_calc_code === this.clickedProductCost.cost_calc_code){
                item.cost_calc_code = new_cost_calc_code;
              }
            });
            this.searched_datas.labor_cost_calc_detail.forEach(item => {
              if (item.cost_calc_code === this.clickedProductCost.cost_calc_code){
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
            targetConfirmation.inhouse_bid_number = `${this.input_inhouse_bid_number.value}`;
            targetConfirmation.company_bid_number = `${this.input_company_bid_number.value}`;
            targetConfirmation.due_date = `${this.input_due_date.value}`;
            targetConfirmation.service_name = `${this.input_service_name.value}`;
            targetConfirmation.service_period = `${this.input_service_period.value}`;
            targetConfirmation.remark = `${this.input_remark.value}`;
            targetConfirmation.company_name = `${this.input_company_name.value}`;
            targetConfirmation.company_manager = `${this.input_company_manager.value}`;
            targetConfirmation.company_manager_email = `${this.input_company_manager_email.value}`;
            targetConfirmation.company_manager_phone = `${this.input_company_manager_phone.value}`;
            if (newApprovalFile){
              targetConfirmation.approval_file = `${new_cost_calc_code + '_' + newApprovalFile.name}`;
              targetConfirmation.approval_thumbnail = `${mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newApprovalFile, 1, false, 1000, 1000))}`;
            }
            if (newBlueprintFile){
              targetConfirmation.blueprint_file = `${new_cost_calc_code + '_' + newBlueprintFile.name}`;
              targetConfirmation.blueprint_thumbnail = `${mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newBlueprintFile, 1, false, 1000, 1000))}`;
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
            this.input_inhouse_bid_number.value = new_inhouse_bid_number;
            this.clickedProductCost.inhouse_bid_number = this.input_inhouse_bid_number.value;
            this.clickedProductCost.company_bid_number = this.input_company_bid_number.value;
            this.clickedProductCost.due_date = this.input_due_date.value;
            this.clickedProductCost.service_name = this.input_service_name.value;
            this.clickedProductCost.service_period = this.input_service_period.value;
            this.clickedProductCost.remark = this.input_remark.value;
            this.clickedProductCost.company_name = this.input_company_name.value;
            this.clickedProductCost.company_manager = this.input_company_manager.value;
            this.clickedProductCost.company_manager_email = this.input_company_manager_email.value;
            this.clickedProductCost.company_manager_phone = this.input_company_manager_phone.value;

            if (newApprovalFile){
              this.clickedProductCost.approval_file = new_cost_calc_code + '_' + newApprovalFile.name;
              this.clickedProductCost.approval_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newApprovalFile, 1, false, 1000, 1000));
            }
            if (newBlueprintFile){
              this.clickedProductCost.blueprint_file = new_cost_calc_code + '_' + newBlueprintFile.name;
              this.clickedProductCost.blueprint_thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(newBlueprintFile, 1, false, 1000, 1000));
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
                    <h2 style="text-align: center; color:#13428a">견적서 ${sendDataCheckedDate === null ? '확인' : '승인'} 요청 알림</h2>
                    <table style="width: 100%;border-spacing: 10px 10px;">
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
                    <a style="color: white; text-decoration:none"href="${prevURL}-search?inhouse_bid_number=${this.clickedProductCost.inhouse_bid_number}&company_bid_number=${this.clickedProductCost.company_bid_number}&company_name=${this.clickedProductCost.company_name}&issue_date=${this.clickedProductCost.issue_date}">
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
                  subject: "견적서 " + (sendDataCheckedDate === null ? '확인' : '승인') + " 요청 알림",
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

        let new_inhouse_bid_number = '';
        if (this.clickedProductCost.full_created_time === this.clickedProductCost.full_modified_time){
          new_inhouse_bid_number = this.input_inhouse_bid_number.value + '-1';
        }else {
          let splitted_inhouse_bid_number = this.input_inhouse_bid_number.value.split('-');
          let origin_modified_num = splitted_inhouse_bid_number[splitted_inhouse_bid_number.length - 1];
          let new_modified_num = Number(origin_modified_num) + 1;
          splitted_inhouse_bid_number[splitted_inhouse_bid_number.length - 1] = new_modified_num;
          new_inhouse_bid_number = splitted_inhouse_bid_number.join('-');
        }

        const new_cost_calc_code = mux.Date.format(newDate, 'yyyy-MM-dd HH-mm-ss-fff') + '_' + this.$cookies.get(this.$configJson.cookies.id.key);

        let sendData = {
          "estimate_confirmation_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{
              "cost_calc_code": new_cost_calc_code,
              "inhouse_bid_number": new_inhouse_bid_number,
              "approval_phase": sendDataCheckedDate === null ? '미확인' : '미승인',
              "checked_date": sendDataCheckedDate,
              "rejecter": '',
              "rejected_date": null,
              "reject_reason": '',
            },
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "yes"
          }],
          "estimate_cost_table-update": [{
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
          "estimate_cost_calc_detail_table-delete": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{},
            "delete_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "no"
          }],
          "estimate_construction_detail_table-delete": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{},
            "delete_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "no"
          }],
          "estimate_labor_cost_calc_detail_table-update": [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data":{"cost_calc_code": new_cost_calc_code},
            "update_where": {"cost_calc_code": this.clickedProductCost.cost_calc_code},
            "rollback": "yes"
          }],
          "estimate_cost_calc_detail_table-insert": [],
          "estimate_construction_detail_table-insert": [],
        };

        const new_product_cost_calc_detail = [];
        const new_construction_materials_data = [];
        if (this.clickedProductCost.estimate_type === '재료비'){
          const product_cost_materials = this.calc_cost_detail_data_product_cost.belong_data.find(x=>x.cost_list && x.cost_list.includes('재료'));
          if (product_cost_materials){
            product_cost_materials.belong_data.forEach(data => {
              new_product_cost_calc_detail.push(
                {
                  cost_calc_code: new_cost_calc_code,
                  product_code: data.product_code,
                  product_name: data.cost_list,
                  product_spec: data.cost_list_sub,
                  product_num: data.cost_num,
                  product_unit_price: data.cost_unit_price
                }
              );
            });
            new_product_cost_calc_detail.forEach(data => {
              sendData["estimate_cost_calc_detail_table-insert"].push({
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data": data,
                "select_where": {"cost_calc_code": new_cost_calc_code, "product_code": data.product_code},
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
              sendData["estimate_construction_detail_table-insert"].push({
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
            targetConfirmation.inhouse_bid_number = new_inhouse_bid_number;

            this.origin_calc_cost_detail_data = JSON.parse(JSON.stringify(this.calc_cost_detail_data));
            // this.clickedProductCost.product = this.calc_cost_detail_data_product_cost.belong_data[0].cost_list;

            if (this.clickedProductCost.estimate_type === '재료비'){
              const product_cost_materials = this.calc_cost_detail_data_product_cost.belong_data.find(x=>x.cost_list && x.cost_list.includes('재료'));
              this.searched_datas.product_cost_calc_detail = this.searched_datas.product_cost_calc_detail.filter(item => item.cost_calc_code !== this.clickedProductCost.cost_calc_code);
              const new_product_cost_calc_detail = [];
              if (product_cost_materials){
                product_cost_materials.belong_data.forEach(data => {
                  new_product_cost_calc_detail.push(
                    {
                      cost_calc_code: new_cost_calc_code,
                      product_name: data.cost_list,
                      product_spec: data.cost_list_sub,
                      product_num: data.cost_num,
                      product_unit_price: data.cost_unit_price
                    }
                  );
                });
                this.calc_cost_detail_data_product_cost.belong_data = this.calc_cost_detail_data_product_cost.belong_data.filter(x=>!x.cost_list.includes('재료'));
                this.searched_datas.product_cost_calc_detail.push(...new_product_cost_calc_detail);
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
            }else if (this.clickedProductCost.estimate_type === '기술료'){

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
            this.searched_datas.last_confirmation.find(x=>x.cost_calc_code === this.clickedProductCost.cost_calc_code).cost_calc_code = new_cost_calc_code;
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
            this.input_inhouse_bid_number.value = new_inhouse_bid_number;
            this.clickedProductCost.inhouse_bid_number = this.input_inhouse_bid_number.value;
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
                    <h2 style="text-align: center; color:#13428a">견적서 ${sendDataCheckedDate === null ? '확인' : '승인'} 요청 알림</h2>
                    <table style="width: 100%;border-spacing: 10px 10px;">
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
                    <a style="color: white; text-decoration:none"href="${prevURL}-search?inhouse_bid_number=${this.clickedProductCost.inhouse_bid_number}&company_bid_number=${this.clickedProductCost.company_bid_number}&company_name=${this.clickedProductCost.company_name}&issue_date=${this.clickedProductCost.issue_date}">
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
                  subject: "견적서 " + (sendDataCheckedDate === null ? '확인' : '승인') + " 요청 알림",
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

    async save() {
      const validate = this.$refs.estimateInfoForm2.validate();
      if(!validate){
        mux.Util.showAlert('견적서 정보를 정확히 입력하여 주십시오.');
        this.tab_write = 0;
        return;
      }
      if (!this.input_approval_file2.value){
        mux.Util.showAlert('승인서 파일을 첨부해야 합니다.');
        this.tab_write = 0;
        return;
      }
      if (!this.input_blueprint_file2.value){
        mux.Util.showAlert('도면 파일을 첨부해야 합니다.');
        this.tab_write = 0;
        return;
      }
      if (!this.estimate_member_info2[1].user_id){
        mux.Util.showAlert('확인자, 승인자를 선택하여 주십시오.');
        this.tab_write = 0;
        return;
      }

      // 작성 - 산출내역서 탭 강제 로드
      if (!this.$refs.surveyCostForm2 && this.tab_write === 0){
        this.tab_write = 1;
        let refLoadCount = 0
        while(refLoadCount < 50){
          if (this.$refs.surveyCostForm2){
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 100));
          refLoadCount++;
        }
        this.tab_write = 0;
      }
      const validate2 = this.$refs.surveyCostForm2.validate();
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
      const prevURL = window.location.href;
      let sendDataCheckedDate = '';
      if (this.estimate_member_info2[0].user_id === this.$cookies.get(this.$configJson.cookies.id.key)){
        sendDataCheckedDate = mux.Date.format(newDate, 'yyyy-MM-dd HH:mm:ss');
      }else {
        sendDataCheckedDate = null;
      }

      const new_cost_calc_code = mux.Date.format(newDate, 'yyyy-MM-dd HH-mm-ss-fff') + '_' + this.$cookies.get(this.$configJson.cookies.id.key);
      let basic_code =  this.input_inhouse_bid_number2.value;
      let currentCode = await mux.Get.getCurrentInhouseBid(basic_code);
      let new_inhouse_bid_number = '';

      if(currentCode === ''){
        new_inhouse_bid_number = basic_code + '_001';
      }else{
        let calc_current_code = Number(currentCode.split('_')[2]) + 1;
        calc_current_code = ('00' + calc_current_code).slice(-3);
        new_inhouse_bid_number = basic_code + '_' + calc_current_code;
      }

      let sendData = {
        "estimate_confirmation_table-insert": [{
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "creater"
          },
          "data":{
            cost_calc_code: new_cost_calc_code,
            given_name: this.$cookies.get(this.$configJson.cookies.name.key),
            office_phone_number: this.$cookies.get(this.$configJson.cookies.office_phone_number.key),
            estimate_type: '재료비',
            issue_date: this.input_issue_date2.value,
            inhouse_bid_number: new_inhouse_bid_number,
            company_bid_number: this.input_company_bid_number2.value ? this.input_company_bid_number2.value : '',
            due_date: this.input_due_date2.value,
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
            approval_file: new_cost_calc_code + '_' + this.input_approval_file2.value.name,
            approval_thumbnail: mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_approval_file2.value, 1, false, 1000, 1000)),
            blueprint_file: new_cost_calc_code + '_' + this.input_blueprint_file2.value.name,
            blueprint_thumbnail: mux.Util.uint8ArrayToHexString(await mux.Util.getPdfThumbnail(this.input_blueprint_file2.value, 1, false, 1000, 1000)),
            etc_files: this.estimateWriteFilesInputs.find(x=>x.column_name === 'files').value && this.estimateWriteFilesInputs.find(x=>x.column_name === 'files').value.length > 0
            ? this.estimateWriteFilesInputs.find(x=>x.column_name === 'files').value.map(x=>new_cost_calc_code + '_' + x.name).join('/')
            : '',
          },
          "select_where": {"cost_calc_code": new_cost_calc_code},
          "rollback": "yes"
        }],
        "estimate_cost_table-insert": [{
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
            transportation_fee_fomula: this.new_transportation_fee_fomula,
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
        "estimate_cost_calc_detail_table-insert":[],
        "estimate_construction_detail_table-insert":[],
        "estimate_labor_cost_calc_detail_table-insert":[],
      };
      const products = this.calc_cost_detail_data_product_cost2.belong_data.find(x=>x.cost_list && x.cost_list.includes('재료'));
      const construction_materials = this.calc_cost_detail_data_product_cost2.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재'));
      if (products){
        products.belong_data.forEach(data => {
          sendData["estimate_cost_calc_detail_table-insert"].push({
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "creater"
            },
            "data":{
              cost_calc_code: new_cost_calc_code,
              product_code: data.product_code,
              product_name: data.cost_list,
              product_spec: data.cost_list_sub,
              product_num: data.cost_num,
              product_unit_price: data.cost_unit_price,
            },
            "select_where": {"cost_calc_code": new_cost_calc_code, "product_code": data.product_code},
            "rollback": "yes"
          });
        });
      }
      if (construction_materials){
        construction_materials.belong_data.forEach(data => {
          sendData["estimate_construction_detail_table-insert"].push({
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
        sendData["estimate_labor_cost_calc_detail_table-insert"].push({
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

      if (this.input_approval_file2.value){
        sendData.files.push({
          folder: 'estimate/approval',
          file: this.input_approval_file2.value,
          name: this.input_approval_file2.value.name
        });
      }
      if (this.input_blueprint_file2.value){
        sendData.files.push({
          folder: 'estimate/blueprint',
          file: this.input_blueprint_file2.value,
          name: this.input_blueprint_file2.value.name
        });
      }
      if (this.input_etc_file2.value){
        this.input_etc_file2.value.forEach(file => {
          sendData.files.push({
            folder: 'estimate/etc',
            file: file,
            name: file.name
          });
        });
      }

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
                  <h2 style="text-align: center; color:#13428a">견적서 ${sendDataCheckedDate === null ? '확인' : '승인'} 요청 알림</h2>
                  <table style="width: 100%;border-spacing: 10px 10px;">
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
                  <a style="color: white; text-decoration:none"href="${prevURL}-search?inhouse_bid_number=${this.input_inhouse_bid_number2.value}&company_bid_number=${this.input_company_bid_number2.value}&company_name=${this.input_company_name2.value}&issue_date=${this.input_issue_date2.value}">
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
                subject: "견적서 " + (sendDataCheckedDate === null ? '확인' : '승인') + " 요청 알림",
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
        if (this.clickedProductCost.estimate_type === '재료비'){
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
        if (this.estimate_type === '재료비'){
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
        if (this.clickedProductCost.estimate_type === '재료비'){
          this.calc_cost_detail_data_product_cost.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재')).belong_data.splice(index, 1);
        }else {
          this.calc_cost_detail_data_product_cost.belong_data.splice(index, 1);
        }
      }else {
        if (this.estimate_type === '재료비'){
          this.calc_cost_detail_data_product_cost2.belong_data.find(x=>x.cost_list && x.cost_list.includes('공사 자재')).belong_data.splice(index, 1);
        }else {
          this.calc_cost_detail_data_product_cost2.belong_data.splice(index, 1);
        }
      }
    },
  },
  data(){
    return{
      clearFlag: false,
      mux: mux,
      todayDate: '',
      username: '',
      searched_datas: {},
      product_cost_dialog: false,
      estimate_cost_dialog: false,
      edit_estimate_info_disabled: true,
      edit_survey_cost_num_disabled: true,
      edit_buttons_show: true,
      during_edit: false,

      tab_main: null,
      tab_search: null,
      tab_write: null,
      tab_dialog_search_product: null,
      tab_main_items: EstimatePageConfig.tab_main_items,
      dialog_search_product_items: EstimatePageConfig.dialog_search_product_items,
      dialog_search_product: false,
      dialog_calculate_labor: false,
      dialog_payment: false,
      dialog_search_product_data: [],

      member_dialog: false,
      member_dialog2: false,
      member_type_index:0,
      members_list:[],
      members_list2:[],

      labor_list:[],
      labor_occupation_list:[],

      estimate_type: '재료비',
      search_complete_product_code: '',
      search_complete_product_name: '',
      search_product_capacity: '',

      estimate_member_info: JSON.parse(JSON.stringify(EstimatePageConfig.estimate_member_info)),
      estimate_member_info2:JSON.parse(JSON.stringify(EstimatePageConfig.estimate_member_info)),
      save_estimate: EstimatePageConfig.save_estimate,
      content_save_items: EstimatePageConfig.content_save_items,
      search_estimate_headers: EstimatePageConfig.search_estimate_headers,
      survey_cost_headers: EstimatePageConfig.survey_cost_headers,
      labor_cost_headers: EstimatePageConfig.labor_cost_headers,
      labor_list_headers: EstimatePageConfig.labor_list_headers,
      dialog_search_product_headers: EstimatePageConfig.dialog_search_product_headers,
      construction_materials_headers: EstimatePageConfig.construction_materials_headers,

      dialogDelete: false,
      print_labor_table: false,
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


      calc_cost_detail_data: JSON.parse(JSON.stringify(EstimatePageConfig.calc_cost_detail_data)),
      calc_cost_detail_data2: EstimatePageConfig.calc_cost_detail_data.map(x => {
        let new_x = JSON.parse(JSON.stringify(x));
        if (new_x.cost_list === '재료비') {
          new_x.costListBtn = {
            text: '작성',
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

      search_tab_items: EstimatePageConfig.search_tab_items,
      write_tab_items: EstimatePageConfig.write_tab_items,
      searchCardInputs: JSON.parse(JSON.stringify(EstimatePageConfig.searchCardInputs)),
      estimateSearchDefaultInfoInputs: JSON.parse(JSON.stringify(EstimatePageConfig.estimateSearchDefaultInfoInputs)),
      estimateSearchDefaultInfoInputs2: JSON.parse(JSON.stringify(EstimatePageConfig.estimateSearchDefaultInfoInputs2)),
      estimateSearchCompanyInfoInputs: JSON.parse(JSON.stringify(EstimatePageConfig.estimateSearchCompanyInfoInputs)),
      estimateWriteDefaultInfoInputs: JSON.parse(JSON.stringify(EstimatePageConfig.estimateWriteDefaultInfoInputs)),
      estimateWriteDefaultInfoInputs2: JSON.parse(JSON.stringify(EstimatePageConfig.estimateWriteDefaultInfoInputs2)),
      estimateWriteCompanyInfoInputs: JSON.parse(JSON.stringify(EstimatePageConfig.estimateWriteCompanyInfoInputs)),
      estimateFilesInputs: JSON.parse(JSON.stringify(EstimatePageConfig.estimateFilesInputs)),
      estimateWriteFilesInputs: JSON.parse(JSON.stringify(EstimatePageConfig.estimateFilesInputs)),
      search_estimate_data: [],

      writeIssueDate: new Date().toISOString().substr(0, 10),
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
