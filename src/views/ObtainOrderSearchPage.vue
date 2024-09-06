<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :salesMenu="true" :obtainOrderMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row justify="center">
        <v-col
          cols="12"
          sm="11"
        >
          <CardComponent
            elevation="1"
            text-class=" pt-3"
            title-class="d-none"
          >
            <InputsFormComponent
              slot="cardText"
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
                lg="2"
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
          </CardComponent>

          <CardComponent
            elevation="1"
            card-class="mt-5"
            text-class=" pt-3"
            title-class="d-none"
          >
            <div slot="cardText">
              <EstimateDataTableComponent
                :headers="estimate_approve_headers"
                :items="estimate_approve_data"
                item-key="product_code"
                :approval="true"
                dense
                :loginId="login_info.id"
                @clickTr="clickApproveData"
                @setApprovalPhase="setApprovalPhase"
              />
            </div>
          </CardComponent>
        </v-col>
      </v-row>
    </v-main>

    <!-- 행 클릭 시 노출되는 모달 -->
    <ModalDialogComponent
      :dialog-value="estimate_product_list_dialog"
      max-width="50%"
      title-class=" "
      :dialog-transition="'slide-x-transition'"
      :dialog-custom="'custom-dialog elevation-0 white'"
      :card-elevation="'0'"
      @close="closeProductList"
    >

    <v-row>
        <v-col cols="12" sm="5">
          <v-combobox
            label="version"
            filled
            v-model="version"
            :items="versions"
          ></v-combobox>
        </v-col>
      </v-row>
      <v-tabs
        v-model="tab_search"
        background-color="transparent"
        class="tab_search"
      >
        <v-tab
          v-for="sub_item in (clickedProductCost.obtain_file
                              ? search_tab_items.filter(item => item !== 'BOM LIST' && item !== '구매 요청 내역')
                              : search_tab_items.filter(item => item !== '수주서' && item !== '생산 의뢰서'))"
          :key="sub_item"
        >
          {{ sub_item }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab_search" class="pb-1">
        <!-- 수주서 미리보기 -->
        <v-tab-item v-if="clickedProductCost.obtain_file" key="수주서">
          <v-card ref="calcCostCard" style="border: 1px solid #ccc;" elevation="0">
            <v-card-text>
              <div style="width:100%; background-color: #ccc; min-height:700px">
                {{ clickedProductCost.obtain_file ? '' : '※ 수주서 PDF 미리보기 영역' }}
                <v-img
                  v-if="clickedProductCost.obtain_file"
                  alt="thumbnail"
                  class="shrink mr-2"
                  contain
                  :src="mux.Util.imageBinary(clickedProductCost.obtain_thumbnail)"
                  transition="scale-transition"
                  width="100%"
                  @click="download('obtain/obtain', clickedProductCost.obtain_file.replace(clickedProductCost.obtain_file.split('_')[0]+'_'+clickedProductCost.obtain_file.split('_')[1]+'_', ''), clickedProductCost.obtain_file.split('_')[0]+'_'+clickedProductCost.obtain_file.split('_')[1]+'_')"
                  style="cursor: pointer;"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <!-- 수주 확인서 -->
        <v-tab-item key="수주 확인서">
          <v-card ref="calcCostCard" style="border: 1px solid #ccc;" elevation="0">
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
                  v-for="(item, index) in save_confirmation"
                  :key="index"
                  dense
                  @click="item.click === 'print' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data')
                          : item.click === 'pdf' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data', '원가계산서') : ''"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-card-title style="max-width: 868.5px;">
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
            <v-card-text style="max-width: 868.5px;">
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
                      <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">{{ clickedProductCost.obtain_type === '용역' ? '용역명' : '프로젝트명' }}</td>
                      <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.service_name ? clickedProductCost.service_name : '' }}</td>
                    </tr>
                    <tr>
                      <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">{{ clickedProductCost.obtain_type === '용역' ? '용역기간' : '프로젝트기간' }}</td>
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
                :show-childs-parent-index-arr="show_childs_parent_index_arr"
                :show-grand-childs-parent-index-arr="show_grand_childs_parent_index_arr"
                class="cost_table_border"
              />
            </v-card-text>
          </v-card>
          <v-row v-if="clickedProductCost.obtain_file" class="mt-3">
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
                @click="download('obtain/blueprint', clickedProductCost.blueprint_file.replace(clickedProductCost.blueprint_file.split('_')[0]+'_'+clickedProductCost.blueprint_file.split('_')[1]+'_', ''), clickedProductCost.blueprint_file.split('_')[0]+'_'+clickedProductCost.blueprint_file.split('_')[1]+'_')"
                style="cursor: pointer;"
              />
            </v-col>
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
                @click="download('obtain/approval', clickedProductCost.approval_file.replace(clickedProductCost.approval_file.split('_')[0]+'_'+clickedProductCost.approval_file.split('_')[1]+'_', ''), clickedProductCost.approval_file.split('_')[0]+'_'+clickedProductCost.approval_file.split('_')[1]+'_')"
                style="cursor: pointer;"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <p class="font-weight-bold primary--text mb-0">▼ 수주서</p>
              <!-- <div style="width:100%; background-color: #ccc; min-height:300px"></div> -->
              <v-img
                v-if="clickedProductCost.obtain_file"
                alt="thumbnail"
                class="shrink mr-2"
                contain
                :src="mux.Util.imageBinary(clickedProductCost.obtain_thumbnail)"
                transition="scale-transition"
                width="350"
                @click="download('obtain/obtain', clickedProductCost.obtain_file.replace(clickedProductCost.obtain_file.split('_')[0]+'_'+clickedProductCost.obtain_file.split('_')[1]+'_', ''), clickedProductCost.obtain_file.split('_')[0]+'_'+clickedProductCost.obtain_file.split('_')[1]+'_')"
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
                  @click="download('obtain/etc', file.replace(file.split('_')[0]+'_'+file.split('_')[1]+'_', ''), file.split('_')[0]+'_'+file.split('_')[1]+'_')"
                >
                  {{ file.replace(file.split('_')[0]+'_'+file.split('_')[1]+'_', '') }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
          <v-row v-if="!clickedProductCost.obtain_file" class="mt-3">
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
          <v-divider v-if="!clickedProductCost.obtain_file" class="mt-7"></v-divider>
          <v-row v-if="!clickedProductCost.obtain_file" class="mt-3">
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
        </v-tab-item>
        <!-- BOM List -->
        <v-tab-item v-if="!clickedProductCost.obtain_file" key="BOM LIST">
          <v-card ref="calcCostCard" style="border: 1px solid #ccc;" class="pa-4 elevation-0">
            <v-row>
              <v-col cols="12" sm="12">
                <DataTableComponent
                  :headers="bom_list_headers"
                  :items="bom_list_data"
                  item-key="product_code"
                  children-key="belong_data"
                  dense
                  tableClass="elevation-0"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-tab-item>
        <!-- 구매요청내역 -->
        <v-tab-item v-if="!clickedProductCost.obtain_file" key="구매 요청 내역">
          <v-card style="border: 1px solid #ccc;" class="pa-4 elevation-0">
            <v-data-table
              :headers="purchase_detail_headers"
              :items="purchase_detail_data"
              item-key="product_code"
              dense
              class="elevation-0"
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td v-for="header in purchase_detail_headers" :key="header.text">
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
          </v-card>
        </v-tab-item>
        <!-- 산출내역서 -->
        <v-tab-item key="산출내역서">
          <v-card ref="calcDetailCard" style="border: 1px solid #ccc;" elevation="0">
            <v-card-title>
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
                    v-for="(item, index) in save_confirmation"
                    :key="index"
                    dense
                    @click="item.click === 'print' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data')
                            : item.click === 'excel' ? mux.Excel.downloadTable(survey_cost_headers, calc_cost_detail_data, '산출내역서')
                            : item.click === 'pdf' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcDetailCard, 'edit_survey_cost_data', '산출내역서') : ''"
                  >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-title>
            <v-card-text>
              <v-form ref="surveyCostForm">
                <CostTableComponent
                  :headers="survey_cost_headers"
                  :items="calc_cost_detail_data"
                  item-key="product_code"
                  trStyle="background-color:#efefef; "
                  trClass="font-weight-black estimate_title"
                  :cost-num-edit-disabled="true"
                  class="cost_table_border print_cost_table"
                >
                </CostTableComponent>
              </v-form>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <!-- 노무비 산출 -->
        <v-tab-item key="노무비 산출">
          <v-card ref="calcLaborCard" style="border: 1px solid #ccc;" elevation="0">
            <v-card-title>
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
                    v-for="(item, index) in save_estimates"
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
        <!-- 생산 의뢰서 -->
        <v-tab-item key="생산 의뢰서" v-if="clickedProductCost.obtain_file
                    && searched_datas.last_confirmation
                    && searched_datas.last_confirmation.find(item => item.cost_calc_code === clickedProductCost.cost_calc_code)">
          <v-card style="border: 1px solid #ccc;" elevation="0">
            <v-menu
              v-if="clickedProductCost.approved_date
              && clickedProductCost.creater === login_info.id"
              offset-y
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  fab
                  x-small
                  class="mr-3 dont_print"
                  elevation="0"
                  v-bind="attrs"
                  v-on="on"
                  data-html2canvas-ignore="true"
                >
                  <v-icon
                    small
                  >mdi-email</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-combobox
                      ref="toCombobox"
                      label="담당자"
                      required
                      v-model="selectDesigner"
                      :items="designer_list"
                      dense
                      hide-selected
                      small-chips
                      :disabled="clickedProductCost.send_production_request"
                      ></v-combobox>
                    <v-btn
                      small
                      @click="sendProductionRequestMail"
                      :disabled="clickedProductCost.send_production_request"
                    >발송</v-btn>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
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
                  v-for="(item, index) in save_confirmation"
                  :key="index"
                  dense
                  @click="item.click === 'print' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data')
                          : item.click === 'pdf' ? costDetailPrintOrPDF('calc_cost_detail_data', $refs.calcCostCard, 'edit_survey_cost_data', '생산의뢰서') : ''"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-card-title>
              <v-row
                class="px-3"
                style="background: #efefef;"
              >
                <v-col align-self="center" cols="12" sm="12">
                  <p style="font-weight: bold; font-size: 30px;text-align: center;" class="mb-0 py-3">생산 의뢰서
                  </p>
                </v-col>
                <!-- <v-col align-self="center" cols="12" sm="2">
                  <v-img
                    alt="Pionelectric Logo"
                    class="float-right"
                    contain
                    src="../assets/img/pion_logo.png"
                    transition="scale-transition"
                    width="140"
                    style="margin-top:10px"
                  />
                </v-col> -->
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row class="mt-5" justify="space-between">
                <v-col cols="12" sm="12" class="pb-0">
                  <p class="mb-0 font-weight-bold">설계 담당자 : {{ clickedProductCost.send_production_request ? clickedProductCost.send_production_request : '' }}</p>
                </v-col>
                <v-col align-self="center" cols="12" sm="6" class="pb-0">
                  <table style=" border-spacing: 0px; width: 100%;" class="mt-1">
                    <tr class="text-body-1">
                      <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">업체명</td>
                      <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.company_name ? clickedProductCost.company_name : '' }}</td>
                    </tr>
                    <tr class="text-body-1">
                      <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">업체 담당자</td>
                      <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.company_manager ? clickedProductCost.company_manager : '' }}</td>
                    </tr>
                    <tr class="text-body-1">
                      <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">프로젝트 코드</td>
                      <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.project_code ? clickedProductCost.project_code : '' }}</td>
                    </tr>
                    <tr class="text-body-1">
                      <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">{{ clickedProductCost.obtain_type === '용역' ? '용역명' : '프로젝트명' }}</td>
                      <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.service_name ? clickedProductCost.service_name : '' }}</td>
                    </tr>
                    <tr>
                      <td class="estimate_info estimate_title text-center" style="border-left:1px solid #b6b6b6">{{ clickedProductCost.obtain_type === '용역' ? '용역기간' : '프로젝트기간' }}</td>
                      <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.service_period ? clickedProductCost.service_period : '' }}</td>
                    </tr>
                  </table>
                </v-col>
                <v-col align-self="center" cols="12" sm="6" class="pb-0">
                  <table style=" border-spacing: 0px; width: 100%;" class="mt-1">
                    <tr>
                      <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">사내 견적번호</td>
                      <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.inhouse_bid_number ? clickedProductCost.inhouse_bid_number : '' }}</td>
                    </tr>
                    <tr>
                      <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">기업 입찰번호</td>
                      <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.company_bid_number ? clickedProductCost.company_bid_number : '' }}</td>
                    </tr>
                    <tr>
                      <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">납기일</td>
                      <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.due_date ? clickedProductCost.due_date : '' }}</td>
                    </tr>
                    <tr>
                      <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">인도조건</td>
                      <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.delivery_condition ? clickedProductCost.delivery_condition : '' }}</td>
                    </tr>
                    <tr>
                      <td class="estimate_info estimate_title text-center" style="border-left:1px solid #b6b6b6">특이사항</td>
                      <td class="estimate_info" style="border-bottom: 0px;">{{ clickedProductCost.remark ? clickedProductCost.remark : '' }}</td>
                    </tr>
                  </table>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-data-table
                    dense
                    :headers="production_request_headers"
                    :items="searched_datas.product_cost_calc_detail ? searched_datas.product_cost_calc_detail.filter(item => item.cost_calc_code === clickedProductCost.cost_calc_code) : []"
                    hide-default-footer
                    disable-pagination
                    disable-sort
                  ></v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </ModalDialogComponent>

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
import DataTableComponent from "@/components/DataTableComponent";
import EstimateDataTableComponent from "@/components/EstimateDataTableComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import CostTableComponent from "@/components/CostTableComponent.vue";
import ObtainOrderSearchPageConfig from "@/configure/ObtainOrderSearchPageConfig.json";

import mux from "@/mux";

export default {

  mounted() {

  },
  components: {
                NavComponent,
                DataTableComponent,
                EstimateDataTableComponent,
                ModalDialogComponent,
                CardComponent,
                InputsFormComponent,
                CostTableComponent,
              },
  data(){
    return{
      mux: mux,
      searched_datas: {},
      dates: [],
      estimate_product_list_dialog: false,
      clickedProductCost: {},
      relatedClickedProductCost: [],
      tab_search: null,
      receivingInspectionThumbnail: '',
      inspectionReportThumbnail: '',
      estimate_checkbox:{
        product:true,
        labor_cost:true,
        expense:true,
        general_management:true,
        profit:true
      },
      show_childs_parent_index_arr: [0],
      show_grand_childs_parent_index_arr: [0, 1],

      change_approve:{},

      searched_products:[],

      save_confirmation: ObtainOrderSearchPageConfig.save_confirmation,
      login_info: ObtainOrderSearchPageConfig.login_info,
      searchCardInputs:ObtainOrderSearchPageConfig.searchCardInputs,
      estimate_approve_headers:ObtainOrderSearchPageConfig.estimate_approve_headers,
      survey_cost_headers: ObtainOrderSearchPageConfig.survey_cost_headers,
      bom_list_headers: ObtainOrderSearchPageConfig.bom_list_headers,
      bom_list_data: [],
      purchase_detail_headers: ObtainOrderSearchPageConfig.purchase_detail_headers,
      purchase_detail_data: [],
      search_tab_items: ObtainOrderSearchPageConfig.search_tab_items,
      labor_cost_headers: ObtainOrderSearchPageConfig.labor_cost_headers,
      labor_cost_data: [],
      merged_labor_cost_data: [],
      calc_cost_detail_data: JSON.parse(JSON.stringify(ObtainOrderSearchPageConfig.calc_cost_detail_data)),
      estimate_detail_data: [],
      estimate_approve_data:[],

      print_labor_table: false,

      versions:['수주 원본'], // '1차 수주 설계', '2차 수주 설계' ...
      version: '수주 원본',
      production_request_headers: ObtainOrderSearchPageConfig.production_request_headers,
      selectDesigner: '',
      member_list: [],
      designer_list: [],

      estimatedDialog: false,
      estimate_company: '',
      purchaseEstimateThumbnail: '',
      purchaseEstimateFile: '',
      purchaseEstimateCode: ''
    }
  },

  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
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

    // input_issue_date() { return this.estimateSearchDefaultInfoInputs.find(x=>x.label === '발행일') },
    // input_inhouse_bid_number() { return this.estimateSearchDefaultInfoInputs.find(x=>x.label === '사내 견적번호') },
    // input_company_bid_number() { return this.estimateSearchDefaultInfoInputs.find(x=>x.label === '기업별 입찰번호') },
    // input_due_date() { return this.estimateSearchDefaultInfoInputs2.find(x=>x.label === '납기') },
    // input_service_name() { return this.estimateSearchDefaultInfoInputs2.find(x=>x.label === '용역명') },
    // input_service_period() { return this.estimateSearchDefaultInfoInputs2.find(x=>x.label === '용역기간') },
    // input_remark() { return this.estimateSearchDefaultInfoInputs2.find(x=>x.label === '특이사항') },
    // input_company_name() { return this.estimateSearchCompanyInfoInputs.find(x=>x.label === '업체명') },
    // input_company_manager() { return this.estimateSearchCompanyInfoInputs.find(x=>x.label === '담당자') },
    // input_company_manager_email() { return this.estimateSearchCompanyInfoInputs.find(x=>x.label === '담당자 E-mail') },
    // input_company_manager_phone() { return this.estimateSearchCompanyInfoInputs.find(x=>x.label === '담당자 연락처') },
    // input_approval_file() { return this.estimateFilesInputs.find(x=>x.column_name === 'approval')},
    // input_blueprint_file() { return this.estimateFilesInputs.find(x=>x.column_name === 'blueprint')},
    // input_etc_file() { return this.estimateFilesInputs.find(x=>x.column_name === 'files')},
  },
  watch:{
    estimate_product_list_dialog(val){
      val || this.closeProductList()
    },
    clickedProductCost: {
      handler(item){
        if (Object.keys(item).length > 0) {
          // this.estimate_member_info[0].name = item.checker;
          // this.estimate_member_info[0].user_id = item.checker_id;
          // this.estimate_member_info[0].checked_date = item.checked_date;
          // this.estimate_member_info[1].name = item.approver;
          // this.estimate_member_info[1].user_id = item.approver_id;
          // this.estimate_member_info[1].checked_date = item.approved_date;
          this.bom_list_data = [];
          this.purchase_detail_data = [];
          if (!item.obtain_file){
            if (this.searched_datas.product_cost_calc_detail.filter(x=>x.cost_calc_code === item.cost_calc_code).length > 0){
              this.bom_list_data = [
                  ...this.searched_datas.product_cost_calc_detail.filter(x=>x.cost_calc_code === item.cost_calc_code).map((a) => {
                    a.type = '완제품';
                    a.classification = a.product_classification;
                    // a.product_code = a.product_code;
                    a.name = a.product_name;
                    a.model = a.product_model;
                    a.spec = a.product_spec;
                    // a.manufacturer = a.manufacturer;
                    a.unit_price = a.product_unit_price;
                    a.item_num = a.product_num;
                    a.belong_data = [
                      ...a.belong_data.map((b) => {
                        b.type = b.module_type;
                        b.classification = b.module_classification;
                        b.product_code = b.module_code;
                        b.name = b.module_name;
                        b.model = b.module_model;
                        b.spec = b.module_spec;
                        b.manufacturer = b.module_manufacturer;
                        b.unit_price = b.module_unit_price;
                        b.item_num = b.module_num;
                        return b;
                      })
                    ];
                    return a;
                  })
                ];
            }

            if (this.searched_datas.purchase_detail_data.filter(x=>x.cost_calc_code === item.cost_calc_code).length > 0){
              this.purchase_detail_data = [
                  ...this.searched_datas.purchase_detail_data.filter(x=>x.cost_calc_code === item.cost_calc_code).map((a) => {
                    let item_num = 0;

                    item_num = Math.round(Number(this.bom_list_data.find(x=>x.belong_data.find(y=>y.product_code === a.item_code)).belong_data.find(y=>y.product_code === a.item_code).item_num) * Number(this.bom_list_data.find(x=>x.belong_data.find(y=>y.product_code === a.item_code)).item_num));

                    a.item_num = item_num;

                    a.purchase_estimate_file = a.purchase_estimate_file ? a.purchase_estimate_file : '';
                    a.purchase_estimate_thumbnail = a.purchase_estimate_thumbnail ? a.purchase_estimate_thumbnail : '';
                    return a;
                  })
                ];
            }
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

          // this.input_issue_date.value = item.issue_date;
          // this.input_inhouse_bid_number.value = item.inhouse_bid_number;
          // this.input_company_bid_number.value = item.company_bid_number;
          // this.input_due_date.value = item.due_date;
          // this.input_service_name.value = item.service_name;
          // this.input_service_period.value = item.service_period;
          // this.input_remark.value = item.remark;
          // this.input_company_name.value = item.company_name;
          // this.input_company_manager.value = item.company_manager;
          // this.input_company_manager_email.value = item.company_manager_email;
          // this.input_company_manager_phone.value = item.company_manager_phone;

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

        // 비연동 견적서 테이블 데이터 복사
        this.estimate_detail_data = [];
        this.estimate_detail_data = JSON.parse(JSON.stringify(this.calc_cost_detail_data));
        // this.total_labor_cost
        this.estimate_detail_data.find(x=>x.cost_list === '노무비').cost_unit_price = this.total_labor_cost;
        this.estimate_detail_data.find(x=>x.cost_list === '노무비').cost_num = this.total_labor_cost === 0 ? 0 : 1;
        // this.total_expense_fee
        this.estimate_detail_data.find(x=>x.cost_list === '경비').cost_unit_price = this.total_expense_fee;
        this.estimate_detail_data.find(x=>x.cost_list === '경비').cost_num = this.total_expense_fee === 0 ? 0 : 1;
      },
      deep: true // 객체 내부 속성 변경 감지
    },

    version(version){
      if (version === '수주 원본'){
        this.clickedProductCost = this.relatedClickedProductCost[0];
      }else {
        this.clickedProductCost = this.relatedClickedProductCost[Number(version.replace('차 수주 설계', ''))];
      }
    },

  },
  created () {
    this.initialize()
    const project_code = this.$route.query.project_code;
    const inhouse_bid_number = this.$route.query.inhouse_bid_number;
    const company_bid_number = this.$route.query.company_bid_number;
    const company_name = this.$route.query.company_name;
    const issue_date = this.$route.query.issue_date;
    // const created_time = this.$route.query.created_time;
    if (project_code && inhouse_bid_number && company_bid_number && company_name && issue_date){
      this.setSearchCardInputs(project_code, inhouse_bid_number, company_bid_number, company_name, issue_date);
      this.searchButton();
    }
  },
  methods:{
    async initialize () {
      const prevURL = window.location.href;
      try {
        // console.log('사용자 계정 정보 가졍오기');
        // let result = await mux.Server.get({
        //   path: '/api/user/',
        // });

        this.login_info.name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.login_info.email = this.$cookies.get(this.$configJson.cookies.email.key);
        this.login_info.id = this.$cookies.get(this.$configJson.cookies.id.key);
        this.login_info.position = this.$cookies.get(this.$configJson.cookies.position.key);
        this.login_info.department = this.$cookies.get(this.$configJson.cookies.department.key);
        this.login_info.office_phone_number = this.$cookies.get(this.$configJson.cookies.office_phone_number.key);
        this.login_info.phone_number = this.$cookies.get(this.$configJson.cookies.phone_number.key);
        console.log(this.login_info)
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }
      this.searchCardInputs = JSON.parse(JSON.stringify(this.searchCardInputs));

      let allMembers = [];
      try {
        const result = await mux.Server.get({path:'/api/admin/users/'});
        if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          allMembers = result.data.Users.map(data => {
            let user = {};
            user.user_id = data.Username;
            user.name = (data.Attributes.find(x=>x.Name === 'given_name') ? data.Attributes.find(x=>x.Name === 'given_name').Value : '');
            user.email = data.Attributes.find(x=>x.Name === 'email') ? data.Attributes.find(x=>x.Name === 'email').Value : '';
            user.phone_number = data.Attributes.find(x=>x.Name === 'phone_number') ? mux.Number.formatPhoneNumber(data.Attributes.find(x=>x.Name === 'phone_number').Value) : '';
            user.office_phone_number = data.Attributes.find(x=>x.Name === 'custom:office_phone_number') ? mux.Number.formatTelNumber(data.Attributes.find(x=>x.Name === 'custom:office_phone_number').Value) : '';
            user.office_internal_number = data.Attributes.find(x=>x.Name === 'custom:internal_number') ? data.Attributes.find(x=>x.Name === 'custom:internal_number').Value : '';
            user.position = data.Attributes.find(x=>x.Name === 'custom:position') ? data.Attributes.find(x=>x.Name === 'custom:position').Value : '';
            user.department = data.Attributes.find(x=>x.Name === 'custom:department') ? data.Attributes.find(x=>x.Name === 'custom:department').Value : '';
            return user;
          });

        }else {
          console.error('send email error: 사용자 정보를 가져올 수 없습니다.');
        }

        const userPosition = this.$cookies.get(this.$configJson.cookies.position.key);
        if (userPosition !== 'master'){
          allMembers = allMembers.filter(data => data.position !== 'master' && !data.name.includes('TEST '));
        }
        allMembers = allMembers.sort((a, b) => (a.department + '-' + a.name + '-' + a.position).localeCompare(b.department + '-' + b.name + '-' + b.position));
      } catch (error) {
        console.error('send email error: 사용자 정보를 가져올 수 없습니다.');
      }

      if (allMembers.length === 0) {
        console.error('send email error: 사용자 정보가 없습니다.');
      }else {
        this.member_list = allMembers;
        this.designer_list = allMembers.filter(x=>x.department === '기획관리부').map(a=>a.department + '-' + a.name + '-' + a.position);
      }
    },
    // eslint-disable-next-line no-unused-vars

    setSearchCardInputs(project_code, inhouse_bid_number, company_bid_number, company_name, issue_date){
      this.searchCardInputs.find(x=>x.label === '프로젝트 코드').value = project_code;
      this.searchCardInputs.find(x=>x.label === '사내 견적번호').value = inhouse_bid_number;
      this.searchCardInputs.find(x=>x.label === '기업별 입찰번호').value = company_bid_number;
      this.searchCardInputs.find(x=>x.label === '업체명').value = company_name;
      if (issue_date.includes(' ~ ')){
        this.searchCardInputs.find(x=>x.label === '발행일').value = issue_date.split(' ~ ');
      } else {
        this.searchCardInputs.find(x=>x.label === '발행일').value = [issue_date, issue_date];
      }
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
    async download(foldername, filename, prefix) {
      mux.Util.showLoading();
      try {
        await mux.Server.downloadFile(foldername, filename, prefix);
      } catch (error) {
        mux.Util.showAlert(error);
      }
      mux.Util.hideLoading();
    },
    async searchButton(){
      mux.Util.showLoading();

      let inputs = [];
      this.searchCardInputs.forEach((input) => {
        if (input.value && String(input.value).trim()) {
          let inputValue = String(input.value).trim();
          if (inputValue === 'All'){
            inputValue = "";
          }
          inputs.push(inputValue);
        }else {
          inputs.push("");
        }
      });
      console.log('inputs :>> ', inputs);

      const prevURL = window.location.href;
      let reqURL = '/api/obtain-order/';
      // send_production_request_id = '';
      if (inputs[0]){
        reqURL += '?approval_phase=' + inputs[0];
      }
      if (inputs[1]){
        reqURL += inputs[0] ? '&project_code=' + inputs[1] : '?project_code=' + inputs[1];
      }
      if (inputs[2]){
        reqURL += (inputs[0] || inputs[1]) ? '&inhouse_bid_number=' + inputs[2] : '?inhouse_bid_number=' + inputs[2];
      }
      if (inputs[3]){
        reqURL += (inputs[0] || inputs[1] || inputs[2]) ? '&company_bid_number=' + inputs[3] : '?company_bid_number=' + inputs[3];
      }
      if (inputs[4]){
        reqURL += (inputs[0] || inputs[1] || inputs[2] || inputs[3]) ? '&company_name=' + inputs[4] : '?company_name=' + inputs[4];
      }
      if (inputs[5]){
        reqURL += (inputs[0] || inputs[1] || inputs[2] || inputs[3] || inputs[4]) ? '&issue_start_date=' + inputs[5].split(',')[0] : '?issue_start_date=' + inputs[5].split(',')[0];
        reqURL += inputs[5].split(',').length > 1 ? '&issue_end_date=' + inputs[5].split(',')[1] : '&issue_end_date=' + inputs[5].split(',')[0];
      }

      try {
        let result = await mux.Server.get({path: reqURL});
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          const searchResult = result.data;
          // const searchResult = JSON.parse(JSON.stringify(ObtainOrderSearchPageConfig.test_estimate_approve_data));

          // 이력 제거 후 실제 데이터만 남기기
          searchResult.confirmation = searchResult.confirmation.filter(x=> searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
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
          searchResult.product_cost = searchResult.product_cost.filter(x=> searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          searchResult.labor_cost_calc_detail = searchResult.labor_cost_calc_detail.filter(x=> searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          searchResult.product_cost_calc_detail = searchResult.product_cost_calc_detail.filter(x=> searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          searchResult.construction_materials_data = searchResult.construction_materials_data.filter(x=> searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));

          // 최신 순으로 정렬
          searchResult.confirmation.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));

          let reqURL2 = '/api/design-production-search/';
          // approval_phase = '';
          if (inputs[1]){
            reqURL2 += '?project_code=' + inputs[1];
          }
          if (inputs[2]){
            reqURL2 += (inputs[1]) ? '&inhouse_bid_number=' + inputs[2] : '?inhouse_bid_number=' + inputs[2];
          }
          if (inputs[3]){
            reqURL2 += (inputs[1] || inputs[2]) ? '&company_bid_number=' + inputs[3] : '?company_bid_number=' + inputs[3];
          }
          if (inputs[4]){
            reqURL2 += (inputs[1] || inputs[2] || inputs[3]) ? '&company_name=' + inputs[4] : '?company_name=' + inputs[4];
          }
          if (inputs[5]){
            reqURL2 += (inputs[1] || inputs[2] || inputs[3] || inputs[4]) ? '&issue_start_date=' + inputs[5].split(',')[0] : '?issue_start_date=' + inputs[5].split(',')[0];
            reqURL2 += inputs[5].split(',').length > 1 ? '&issue_end_date=' + inputs[5].split(',')[1] : '&issue_end_date=' + inputs[5].split(',')[0];
          }

          try {
            let result2 = await mux.Server.get({path: reqURL2});
            if (prevURL !== window.location.href) return;

            if (typeof result2 === 'string'){
              result2 = JSON.parse(result2);
            }
            if(result2['code'] == 0 || (typeof result2['data'] === 'object' && result2['data']['code'] == 0) || (typeof result2['response'] === 'object' && typeof result2['response']['data'] === 'object' && result2['response']['data']['code'] == 0)){
              const searchDesignResult = result2.data;
              // const searchDesignResult = JSON.parse(JSON.stringify(ObtainOrderSearchPageConfig.test_design_data));
              // 오래된 순으로 정렬
              searchDesignResult.confirmation.sort((a, b) => new Date(a.created_time) - new Date(b.created_time));
              const uniqueDesignConfirmation = [];
              const designConfirmationMap = new Map();

              searchDesignResult.confirmation.forEach(item => {
                const code = item.cost_calc_code;
                const time = new Date(item.modified_time).getTime();

                if (!designConfirmationMap.has(code) || time > designConfirmationMap.get(code)) {
                  designConfirmationMap.set(code, time);
                }
              });
              designConfirmationMap.forEach((time, code) => {
                const item = searchDesignResult.confirmation.find(item => item.cost_calc_code === code && new Date(item.modified_time).getTime() === time);
                uniqueDesignConfirmation.push(item);
              });
              searchDesignResult.confirmation = uniqueDesignConfirmation;

              // 설계 이력 추가하기
              searchResult.design_confirmation = searchDesignResult.confirmation;
              if (searchDesignResult.product_cost && searchDesignResult.product_cost.length > 0){
                searchResult.product_cost = [...searchResult.product_cost, ...searchDesignResult.product_cost];
              }
              if (searchDesignResult.labor_cost_calc_detail && searchDesignResult.labor_cost_calc_detail.length > 0){
                searchResult.labor_cost_calc_detail = [...searchResult.labor_cost_calc_detail, ...searchDesignResult.labor_cost_calc_detail];
              }
              if (searchDesignResult.product_cost_calc_detail && searchDesignResult.product_cost_calc_detail.length > 0){
                searchResult.product_cost_calc_detail = [...searchResult.product_cost_calc_detail, ...searchDesignResult.product_cost_calc_detail];
              }
              if (searchDesignResult.construction_materials_data && searchDesignResult.construction_materials_data.length > 0){
                searchResult.construction_materials_data = [...searchResult.construction_materials_data, ...searchDesignResult.construction_materials_data];
              }

              searchResult.purchase_detail_data = searchDesignResult.purchase_detail_data;

              this.searchDataCalcProcess(searchResult);

            }else{
              mux.Util.showAlert(result2);
            }

          } catch (error) {
            if (prevURL !== window.location.href) return;
            mux.Util.showAlert(error);
          }

        }else{
          mux.Util.showAlert(result);
        }

      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }

      mux.Util.hideLoading();
    },
    searchDataCalcProcess(searchResult, isFirst){
      const productTotalCost = {};
      searchResult.product_cost_calc_detail.forEach(a=>{
        if ((a.product_num && !a.product_unit_price) && a.belong_data && a.belong_data.length > 0){
          a.product_unit_price = 0;
          for (let i = 0; i < a.belong_data.length; i++) {
            const belongData = a.belong_data[i];

            if ((belongData.module_num && !belongData.module_unit_price) && belongData.belong_data && belongData.belong_data.length > 0){
              belongData.module_unit_price = 0;
              for (let i = 0; i < belongData.belong_data.length; i++) {
                const belongBelongData = belongData.belong_data[i];
                if (belongBelongData.material_num && belongBelongData.material_unit_price){
                  belongData.module_unit_price += belongBelongData.material_num * belongBelongData.material_unit_price;
                }
              }
              belongData.module_unit_price = Math.round(belongData.module_unit_price / belongData.module_num);
            }

            if (belongData.module_num && belongData.module_unit_price){
              a.product_unit_price += belongData.module_num * belongData.module_unit_price;
            }
          }
          a.product_unit_price = Math.round(a.product_unit_price / a.product_num);
        }

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

        if (searchResult.design_confirmation){
          searchResult.design_confirmation.forEach(confirmation => {
            if (confirmation.cost_calc_code === info.cost_calc_code){
              Object.keys(confirmation).forEach(key=> {
                if (key === 'created_time'){
                  confirmation[key] = mux.Date.format(confirmation[key], 'yyyy-MM-dd');
                }
                info[key] = confirmation[key];
              });
            }
          });
        }

        return info;
      });


      this.estimate_approve_data = productCostArr.filter(x=>searchResult.last_confirmation.find(xx=>xx.cost_calc_code === x.cost_calc_code));
      this.searched_datas = searchResult;
    },
    getCalcProcessedData(searchResult, costCalcCode){
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

      let info = searchResult.product_cost.find(x=>x.cost_calc_code === costCalcCode);
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

      if (info.created_time){
        info.full_created_time = info.created_time + "";
        info.created_time = mux.Date.format(info.created_time, 'yyyy-MM-dd');
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

      if (searchResult.design_confirmation){
        searchResult.design_confirmation.forEach(confirmation => {
          if (confirmation.cost_calc_code === info.cost_calc_code){
            Object.keys(confirmation).forEach(key=> {
              if (key === 'created_time'){
                confirmation[key] = mux.Date.format(confirmation[key], 'yyyy-MM-dd');
              }
              info[key] = confirmation[key];
            });
          }
        });
      }

      return info;

    },
    closeProductList(){
      this.estimate_product_list_dialog = false;
      this.clickedProductCost = {};
      this.show_childs_parent_index_arr = [0];
      this.show_grand_childs_parent_index_arr = [0, 1];
      Object.keys(this.estimate_checkbox).forEach(key => {
        this.estimate_checkbox[key] = true;
      });
    },
    async clickApproveData(item){
      this.clickedProductCost = {};
      this.clickedProductCost = item;
      this.estimate_product_list_dialog = true;

      this.versions = ['수주 원본'];
      this.version = '수주 원본';
      this.relatedClickedProductCost = [this.clickedProductCost];
      this.searched_datas.design_confirmation.forEach(confirmation => {
        if (confirmation.obtain_cost_calc_code === item.cost_calc_code){
          this.relatedClickedProductCost.push(this.getCalcProcessedData(this.searched_datas, confirmation.cost_calc_code));
          this.versions.push(`${this.versions.length}차 수주 설계`);
        }
      });

      // 수정 필요함. 수주 수정 이력이 아닌 설계가 수정된 것을 보여줘야 함
      // this.searched_datas.product_cost_calc_detail.forEach(a=>{
      //   if (a.origin_id === item.origin_id){
      //     this.versions.push(`${this.versions.length}차 수주 설계`);
      //   }
      // });
    },
    async setApprovalPhase(item, change, reason){
      console.log(item, change, reason);

      let new_approval_phase = '';
      let new_checked_date = null;
      let new_approved_date = null;
      let new_rejecter = '';
      let new_rejected_date = null;
      let new_reject_reason = '';

      if (change === true){
        if (item.approval_phase === '미확인'){
          new_approval_phase = '미승인';
          new_checked_date = mux.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        }else if (item.approval_phase === '미승인'){
          new_approval_phase = '승인';
          new_approved_date = mux.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        }

      }

      if (change === false){
        new_approval_phase = '반려';
        new_rejecter = this.login_info.name;
        new_rejected_date = mux.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        new_reject_reason = reason.trim();
        if(new_reject_reason === ''){
          mux.Util.showAlert('반려 사유 필수 기입');
          return;
        }
      }

      let sendData = {
        "obtain_confirmation_table-update": [{
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "modifier"
          },
          "data":{
            "approval_phase": new_approval_phase,
            "approved_date": new_approved_date,
            "rejecter": new_rejecter,
            "rejected_date": new_rejected_date,
            "reject_reason": new_reject_reason,
          },
          "update_where": {"cost_calc_code": item.cost_calc_code},
          "rollback": "yes"
        }],
      };

      if (new_approval_phase === '미승인'){
        sendData["obtain_confirmation_table-update"][0].data.checked_date = new_checked_date;
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

          item.approval_phase = new_approval_phase;
          item.approved_date = new_approved_date ? new_approved_date : '';
          item.rejecter = new_rejecter;
          item.rejected_date = new_rejected_date ? new_rejected_date : '';
          item.reject_reason = new_reject_reason;
          if (new_approval_phase === '미승인'){
            item.checked_date = new_checked_date;
          }

          this.searched_datas.confirmation.forEach(confirmation => {
            if (confirmation.cost_calc_code === item.cost_calc_code){
              confirmation.approval_phase = item.approval_phase;
              confirmation.checked_date = item.checked_date;
              confirmation.approved_date = item.approved_date;
              confirmation.rejecter = item.rejecter;
              confirmation.rejected_date = item.rejected_date;
              confirmation.reject_reason = item.reject_reason;
            }
          });

          //메일 알림 관련
          let mailTo = [];
          let creater = this.$cookies.get(this.$configJson.cookies.id.key);
          let reject_info;
          if(item.approval_phase === '미승인'){
            mailTo.push(creater);
            mailTo.push(item.approver_id);
          }else if(item.approval_phase === '승인'){
            mailTo.push(creater);
            if(creater !== item.checker_id){
              mailTo.push(item.checker_id);
            }
          }else if(item.approval_phase === '반려' && !item.checked_date){
            mailTo.push(creater);
            reject_info=`
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려자</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.rejecter}</td>
              </tr>
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려일</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.rejected_date}</td>
              </tr>
            `
          }else if(item.approval_phase === '반려' && item.checked_date){
            mailTo.push(creater);
            mailTo.push(item.checker_id);
            reject_info=`
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려자</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.rejecter}</td>
              </tr>
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려일</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.rejected_date}</td>
              </tr>
            `
          }

          // 메일 본문 내용
          let content=`
          <html>
            <body>
              <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                <h2 style="text-align: center; color:#13428a">수주 ${item.approval_phase === '미승인' ? '확인' : item.approval_phase} 처리 알림</h2>
                <table style="width: 100%;border-spacing: 10px 10px;">
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.project_code}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">사내 견적번호</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.inhouse_bid_number}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">발행일</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.issue_date}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.given_name}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">확인자</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.checker}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">승인자</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.approver}</td>
                  </tr>
                  ${reject_info ? reject_info : ''}
                </table>
                <a style="color: white; text-decoration:none"${prevURL}?project_code=${item.project_code}&inhouse_bid_number=${item.inhouse_bid_number}&company_bid_number=${item.company_bid_number}&company_name=${item.company_name}&issue_date=${item.issue_date}">
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
              subject: "수주 " + (item.approval_phase === '미승인' ? '확인' : item.approval_phase) + " 처리 알림",
              content: content
            });
            if (prevURL !== window.location.href) return;
            if(sendEmailAlam['code'] == 0 || (typeof sendEmailAlam['data'] === 'object' && sendEmailAlam['data']['code'] == 0) || (typeof sendEmailAlam['response'] === 'object' && typeof sendEmailAlam['response']['data'] === 'object' && sendEmailAlam['response']['data']['code'] == 0)){
              mux.Util.showAlert('저장되었습니다.', '저장 완료', 3000);
            } else {
              if (prevURL !== window.location.href) return;
              console.log('알림 메일 전송에 실패-sendEmailAlam :>> ', sendEmailAlam);
              mux.Util.showAlert('저장되었으나 알림 메일 전송에 실패하였습니다.', '저장 완료');
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            console.log('알림 메일 전송에 실패-error :>> ', error);
            mux.Util.showAlert('저장되었으나 알림 메일 전송에 실패하였습니다.', '저장 완료');
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
    async sendProductionRequestMail(){
      if (!this.selectDesigner || this.selectDesigner.split('-').length !== 3){
        mux.Util.showAlert('담당자를 선택해주세요.');
        return;
      }
      const selectDesignerInfo = this.member_list.find(member => member.department + '-' + member.name + '-' + member.position === this.selectDesigner);
      if (!selectDesignerInfo){
        mux.Util.showAlert('담당자 정보가 없습니다.');
        return;
      }

      const requestedDate = mux.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');

      const item = this.clickedProductCost;

      let sendData = {
        "obtain_confirmation_table-update": [{
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "modifier"
          },
          "data":{
            "send_production_request": selectDesignerInfo.name,
            "send_production_request_id": selectDesignerInfo.user_id,
            "send_production_requested_date": requestedDate,
          },
          "update_where": {"cost_calc_code": item.cost_calc_code},
          "rollback": "yes"
        }],
      };

      // if (new_approval_phase === '미승인'){
      //   sendData["estimate_confirmation_table-update"][0].data.checked_date = new_checked_date;
      // }

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

          item.send_production_request = selectDesignerInfo.name;
          item.send_production_request_id = selectDesignerInfo.user_id
          item.send_production_requested_date = requestedDate;

          this.searched_datas.confirmation.forEach(confirmation => {
            if (confirmation.cost_calc_code === item.cost_calc_code){
              confirmation.send_production_request = selectDesignerInfo.name;
              confirmation.send_production_request_id = selectDesignerInfo.user_id
              confirmation.send_production_requested_date = requestedDate;
            }
          });
          //메일 알림 관련
          let mailTo = [selectDesignerInfo.user_id];

          let productsTr = '';
          this.searched_datas.product_cost_calc_detail.filter(product => product.cost_calc_code === item.cost_calc_code).forEach(product => {
            productsTr += `
              <tr>
                <td style="color: black; border-bottom:1px solid #ccc; text-align:center">${product.product_code}</td>
                <td style="color: black; border-bottom:1px solid #ccc; text-align:center">${product.product_name}</td>
                <td style="color: black; border-bottom:1px solid #ccc; text-align:center">${product.product_model === null ?  '': product.product_model}</td>
                <td style="color: black; border-bottom:1px solid #ccc; text-align:center">${product.product_spec}</td>
                <td style="color: black; border-bottom:1px solid #ccc; text-align:center">${product.manufacturer === null ?  '': product.manufacturer}</td>
              </tr>
            `
          });
          const content = `
          <html>
            <body>
              <div style="width: 820px; border:1px solid #ccc; background:white; padding:20px">
                <div style="background:#efefef; padding: 20px;text-align:center">
                  <p style="color: black; font-weight: bold; font-size: 30px;display:inline" class="mb-0">생산 의뢰서</p>
                </div>

                <p style="color: black; margin-top: 40px;font-weight: bold;">설계 담당자 : ${selectDesignerInfo.name}</p>

                <div>
                  <table  style="width:400px; display: inline-block; margin-right: 10px; border-spacing: 0px;">
                    <tr>
                      <td style="color: black; width:120px;border:1px solid #ccc; border-right:0px; border-bottom:0px; font-size:13px; padding:5px 10px; font-weight:bold; background-color: #efefef;text-align: center;">업체명</td>
                      <td style="color: black; width:280px; border:1px solid #ccc; font-size:13px; border-bottom:0px; padding:5px 10px;">${item.company_name}</td>
                    </tr>
                    <tr>
                      <td style="color: black; width:120px;border:1px solid #ccc; border-right:0px; border-bottom:0px; font-size:13px; padding:5px 10px; font-weight:bold; background-color: #efefef;text-align: center;">업체 담당자</td>
                        <td style="color: black; width:280px; border:1px solid #ccc; font-size:13px; border-bottom:0px; padding:5px 10px;">${item.company_manager}</td>
                    </tr>
                    <tr>
                      <td style="color: black; width:120px;border:1px solid #ccc; border-right:0px; border-bottom:0px; font-size:13px; padding:5px 10px; font-weight:bold; background-color: #efefef;text-align: center;">프로젝트 코드</td>
                      <td style="color: black; width:280px; border:1px solid #ccc; font-size:13px; border-bottom:0px; padding:5px 10px;">${item.project_code}</td>
                    </tr>
                    <tr>
                      <td style="color: black; width:120px;border:1px solid #ccc; border-right:0px; border-bottom:0px; font-size:13px; padding:5px 10px; font-weight:bold; background-color: #efefef;text-align: center;">${item.obtain_type === '용역' ? '용역명' : '프로젝트명'}</td>
                      <td style="color: black; width:280px; border:1px solid #ccc; font-size:13px; border-bottom:0px; padding:5px 10px;">${item.service_name}</td>
                    </tr>
                    <tr>
                      <td style="color: black; width:120px;border:1px solid #ccc; border-right:0px; font-size:13px; padding:5px 10px; font-weight:bold; background-color: #efefef;text-align: center;">${item.obtain_type === '용역' ? '용역기간' : '프로젝트기간'}</td>
                      <td style="color: black; width:280px; border:1px solid #ccc; font-size:13px; padding:5px 10px;">${item.service_period}</td>
                    </tr>
                  </table>

                  <table  style="width:400px; display: inline-block; border-spacing: 0px;">
                    <tr>
                      <td style="color: black; width:120px;border:1px solid #ccc; border-right:0px; border-bottom:0px; font-size:13px; padding:5px 10px; font-weight:bold; background-color: #efefef;text-align: center;">사내 견적번호</td>
                      <td style="color: black; width:280px; border:1px solid #ccc; font-size:13px; border-bottom:0px; padding:5px 10px;">${item.inhouse_bid_number}</td>
                    </tr>
                    <tr>
                      <td style="color: black; width:120px;border:1px solid #ccc; border-right:0px; border-bottom:0px; font-size:13px; padding:5px 10px; font-weight:bold; background-color: #efefef;text-align: center;">기업 입찰번호</td>
                        <td style="color: black; width:280px; border:1px solid #ccc; font-size:13px; border-bottom:0px; padding:5px 10px;">${item.company_bid_number}</td>
                    </tr>
                    <tr>
                      <td style="color: black; width:120px;border:1px solid #ccc; border-right:0px; border-bottom:0px; font-size:13px; padding:5px 10px; font-weight:bold; background-color: #efefef;text-align: center;">납기일</td>
                      <td style="color: black; width:280px; border:1px solid #ccc; font-size:13px; border-bottom:0px; padding:5px 10px;">${item.due_date}</td>
                    </tr>
                    <tr>
                      <td style="color: black; width:120px;border:1px solid #ccc; border-right:0px; border-bottom:0px; font-size:13px; padding:5px 10px; font-weight:bold; background-color: #efefef;text-align: center;">인도조건</td>
                      <td style="color: black; width:280px; border:1px solid #ccc; font-size:13px; border-bottom:0px; padding:5px 10px;">${item.delivery_condition}</td>
                    </tr>
                    <tr>
                      <td style="color: black; width:120px;border:1px solid #ccc; border-right:0px; font-size:13px; padding:5px 10px; font-weight:bold; background-color: #efefef;text-align: center;">특이사항</td>
                      <td style="color: black; width:280px; border:1px solid #ccc; font-size:13px; padding:5px 10px;">${item.remark}</td>
                    </tr>
                  </table>
                </div>

                <div style="margin-top:10px">
                  <table style="border-spacing: 0px; width:100%">
                    <thead style="font-size:13px; background:#E3F2FD">
                      <tr>
                        <th style="color: black; padding:10px 0px;">제품코드</th>
                        <th style="color: black; padding:10px 0px;">제품명</th>
                        <th style="color: black; padding:10px 0px;">모델명</th>
                        <th style="color: black; padding:10px 0px;">사양</th>
                        <th style="color: black; padding:10px 0px;">제조사</th>
                      </tr>
                    </thead>
                    <tbody style="font-size:13px;">
                      ${productsTr}
                    </tbody>
                  </table>
                </div>
                <div style="text-align:center;margin-top: 25px; margin-bottom: 40px;">
                  <a style="color: white; text-decoration:none"href="${prevURL}?project_code=${item.project_code}&inhouse_bid_number=${item.inhouse_bid_number}&company_bid_number=${item.company_bid_number}&company_name=${item.company_name}&issue_date=${item.issue_date}"">
                    <span style="cursor:pointer; background: #13428a;color: white;font-weight: bold;padding: 13px;border-radius: 40px;font-size: 16px;text-align: center;">확인하기</span>
                  </a>
                </div>
              </div>
            </body>
          </html>`;

          try {

            let sendEmailAlam = await mux.Server.post({
              path: '/api/send_email/',
              to_addrs: mailTo,
              subject: `생산 의뢰서 - ${item.service_name}(${item.project_code})`,
              content: content
            });
            if (prevURL !== window.location.href) return;
            if(sendEmailAlam['code'] == 0 || (typeof sendEmailAlam['data'] === 'object' && sendEmailAlam['data']['code'] == 0) || (typeof sendEmailAlam['response'] === 'object' && typeof sendEmailAlam['response']['data'] === 'object' && sendEmailAlam['response']['data']['code'] == 0)){
              mux.Util.showAlert('저장되었습니다.', '저장 완료', 3000);
            } else {
              if (prevURL !== window.location.href) return;
              console.log('알림 메일 전송에 실패-sendEmailAlam :>> ', sendEmailAlam);
              mux.Util.showAlert('저장되었으나 알림 메일 전송에 실패하였습니다.', '저장 완료');
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            console.log('알림 메일 전송에 실패-error :>> ', error);
            mux.Util.showAlert('저장되었으나 알림 메일 전송에 실패하였습니다.', '저장 완료');
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

    estiamteDialog(item){
      this.estimatedDialog = true;
      this.estimate_company = item.purchase_estimate_company;
      this.purchaseEstimateThumbnail = item.purchase_estimate_thumbnail;
      this.purchaseEstimateFile = item.purchase_estimate_file;
      this.purchaseEstimateCode = item.code;
    },

    // async searchItemStock(data){
    //   const prevURL = window.location.href;
    //   try {
    //     data.forEach(async datas => {
    //       let stock_check = await mux.Server.post({
    //         path: '/api/common_rest_api/',
    //         params: [
    //           {
    //             "product_table.product_code": datas.product_code,

    //             "module_table.module_code": datas.product_code,

    //             "material_table.material_code": datas.product_code,
    //             "material_table.directly_written": 0,
    //           }
    //         ],
    //         "script_file_name": "rooting_재고_검색_24_05_07_11_46_16P.json",
    //         "script_file_path": "data_storage_pion\\json_sql\\stock\\1_재고검색\\재고_검색_24_05_07_11_46_H8D"
    //       });
    //       if (prevURL !== window.location.href) return;

    //       if (typeof stock_check === 'string'){
    //         stock_check = JSON.parse(stock_check);
    //       }
    //       if(stock_check['code'] == 0){

    //         stock_check = stock_check['data'].map(a => {
    //           if (!a.stock_num){
    //             a.stock_price = 0;
    //           }else {
    //             a.stock_price = Math.round(a.unit_price * a.stock_num)
    //           }
    //           return a;
    //         });

    //         console.log(stock_check);

    //         stock_check.forEach(data => {
    //           this.searched_products.push(data);
    //         });
    //       }

    //     })

    //   } catch (error) {
    //     if (prevURL !== window.location.href) return;
    //     this.loading_dialog = false;
    //     if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
    //       mux.Util.showAlert(error.response['data']['failed_info'].msg);
    //     else
    //       mux.Util.showAlert(error);
    //   }
    // },


    //////////////////////////////
  //   function copyElementWithMinimalStyles(selector) {
  //   function getAllStyles(element) {
  //       const computedStyles = window.getComputedStyle(element);
  //       const defaultStyles = getDefaultStyles(element);
  //       let styleString = '';

  //       for (let i = 0; i < computedStyles.length; i++) {
  //           const prop = computedStyles[i];
  //           const value = computedStyles.getPropertyValue(prop);
  //           if (value !== defaultStyles[prop]) {
  //               styleString += `${prop}: ${value}; `;
  //           }
  //       }
  //       return styleString;
  //   }

  //   function getDefaultStyles(element) {
  //       const defaultStyles = {};
  //       const iframe = document.createElement('iframe');
  //       document.body.appendChild(iframe);
  //       const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  //       const testElement = iframeDoc.createElement(element.tagName);
  //       iframeDoc.body.appendChild(testElement);
  //       const computedStyles = window.getComputedStyle(testElement);

  //       for (let i = 0; i < computedStyles.length; i++) {
  //           const prop = computedStyles[i];
  //           defaultStyles[prop] = computedStyles.getPropertyValue(prop);
  //       }

  //       document.body.removeChild(iframe);
  //       return defaultStyles;
  //   }

  //   function cloneElementWithStyles(element) {
  //       const clone = element.cloneNode(true);
  //       const elements = Array.from(clone.querySelectorAll('*'));
  //       const originalElements = Array.from(element.querySelectorAll('*'));

  //       elements.forEach((el, i) => {
  //           el.setAttribute('style', getAllStyles(originalElements[i]));
  //           el.removeAttribute('class');
  //       });

  //       clone.setAttribute('style', getAllStyles(element));
  //       clone.removeAttribute('class');
  //       return clone;
  //   }

  //   const elementToCopy = document.querySelector(selector);
  //   if (!elementToCopy) {
  //       console.error('Element not found');
  //       return;
  //   }

  //   const cloneWithStyles = cloneElementWithStyles(elementToCopy);

  //   const tempDiv = document.createElement('div');
  //   tempDiv.appendChild(cloneWithStyles);
  //   document.body.appendChild(tempDiv);

  //   // HTML을 텍스트 형식으로 가져오기
  //   const htmlToCopy = tempDiv.innerHTML;

  //   // 임시 텍스트 영역 생성
  //   const textarea = document.createElement('textarea');
  //   textarea.value = htmlToCopy;
  //   document.body.appendChild(textarea);

  //   // 텍스트 영역의 내용을 선택하고 복사
  //   textarea.select();
  //   document.execCommand('copy');

  //   // 임시 요소 제거
  //   document.body.removeChild(textarea);
  //   document.body.removeChild(tempDiv);

  //   console.log('Element and its minimal styles copied to clipboard!');
  // }

  // // 사용 방법 (예: .my-element 클래스를 가진 요소 복사)
  // copyElementWithMinimalStyles('#inspire > div.v-dialog__content.v-dialog__content--active > div > div > div.v-card__text > div.v-window.pb-1.v-item-group.theme--light.v-tabs-items > div > div.v-window-item.v-window-item--active > div');
  },
}
</script>

<style lang="">

</style>


