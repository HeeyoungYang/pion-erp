<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :purchaseMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <LoadingModalComponent :dialog-value="loading_dialog" hide-overlay></LoadingModalComponent>
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
              <!-- <v-col
                cols="12"
                sm="4"
                lg="3"
                align-self="center"
              >
                <v-radio-group
                  hide-details
                  v-model="code_criterion"
                  class="mt-0"
                  row
                >
                  <v-radio
                    label="프로젝트 기준"
                    value="project"
                  ></v-radio>
                  <v-radio
                    label="발주 기준"
                    value="order"
                  ></v-radio>
                </v-radio-group>
              </v-col> -->
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

          <div>

            <v-radio-group
              v-show="criterion"
              hide-details
              v-model="code_criterion"
              class="mt-7"
              row
            >
              <v-radio
                label="프로젝트 기준"
                value="project"
              ></v-radio>
              <v-radio
                label="발주 기준"
                value="order"
              ></v-radio>
            </v-radio-group>
            <ExpansionPanelComponent
              v-if="code_criterion === 'project'"
              :data="project_code_criterion_data"
              elevation="1"
              class="mt-5"
              multiple>

              <template v-slot:header="{ data }">
                <p
                  class=" mb-0"
                  item-align-center
                >
                  <span class="text-h6 font-weight-black">{{ data.project_code }}</span>
                </p>
              </template>
              <template v-slot:content="{ data }">
                <v-divider class="mb-4"></v-divider>
                <v-row>
                  <v-col
                    cols="12"
                  >
                    <v-btn
                      small
                      color="default"
                      class="mr-2"
                      @click="batchApprovalPhase(data.belong_data)"
                    >일괄 승인</v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <OrderDataTableComponent
                      :headers="project_code_data_headers"
                      :items="data.belong_data"
                      item-key="id"
                      approval
                      dense
                      :loginId="login_info.id"
                      @clickTr="clickApproveData"
                      @setApprovalPhase="setApprovalPhase"
                    />
                  </v-col>
                </v-row>
              </template>
            </ExpansionPanelComponent>
          </div>
          <CardComponent
            v-if="code_criterion === 'order'"
            elevation="1"
            card-class="mt-5"
            text-class="pt-3"
            title-class="d-none"
          >
            <div
              slot="cardText"
            >
              <OrderDataTableComponent
                :headers="project_code_data_headers"
                :items="searched_order_data"
                item-key="code"
                approval
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

    <ModalDialogComponent
      :dialog-value="order_detail_dialog"
      max-width="50%"
      title-class=" "
      :dialog-transition="'slide-x-transition'"
      :dialog-custom="'custom-dialog elevation-0 white'"
      :card-elevation="'0'"
      @close="closeOrderDetail"
    >
    <v-container>
      <v-row>
        <v-col cols="12">

          <v-btn
            v-if="order_form_info.approval_phase === '송금완료'"
            color="success"
            small
            elevation="0"
            @click="completeOrder('구매')"
            class="mr-4"
          >
            구매 완료
          </v-btn>
          <v-btn small color="default" @click="orderPurchase ? orderPurchase = false :orderPurchase = true">발주서 {{ orderPurchase ? '접기' : '펼치기'}}</v-btn>

          <v-menu offset-x
            v-if="orderPurchase && showSaveIcon"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                class="mx-3"
                fab
                x-small
                elevation="1"
                v-bind="attrs"
                v-on="on"
                data-html2canvas-ignore="true"
              >
                <v-icon small>mdi-content-save</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                dense
                @click="printOrder(mux.Date.format(new Date(), 'yyyy-MM-dd') + '_' + order_form_info.company_name + '_발주서')"
              >
                <v-list-item-title>PDF</v-list-item-title>
              </v-list-item>
              <v-list-item
                dense
                @click="printOrder()"
              >
                <v-list-item-title>출력</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn
            v-if="orderPurchase && showEmailIcon"
            color="primary"
            outlined
            elevation="0"
            fab
            x-small
            @click="mailDialog = true"
          >
            <v-icon >mdi-email</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row
        v-if="orderPurchase"
        style="border: 1px solid #c3c3c3;"
          class="pa-4"
      >
        <v-col
          ref="orderForm"
          cols="12"
          sm="12"
        >
          <!-- <orderPurchaseComponent
            ref="orderPurchaseComponent"
          /> -->
          <div>
            <p class="print_doc_title">발주서</p>
            <v-row style="margin-top:15px">
              <v-col cols="12" sm="6">
                <v-img
                  alt="Pionelectric Logo"
                  class="shrink mr-2"
                  contain
                  src="../assets/img/pion_logo.png"
                  transition="scale-transition"
                  style="margin-top:10px; width: 150px;"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <table style="border-spacing: 0;width: 100%; text-align: center;">
                    <tr>
                    <td rowspan="3" class="approve_list_title">결재</td>
                    <td class="approve_list_title approve_list_title_border">작성</td>
                    <td class="approve_list_title approve_list_title_border">확인</td>
                    <td class="approve_list_title approve_list_title_border">승인</td>
                  </tr>
                  <tr>
                    <td class="approve_list_name">{{ order_form_info.given_name }}</td>
                    <td class="approve_list_name">{{ order_form_info.checker }}</td>
                    <td class="approve_list_name">{{ order_form_info.approver }}</td>
                  </tr>
                  <tr>
                    <td class="approve_list_date">{{ order_form_info.created_time }}</td>
                    <td class="approve_list_date">{{ order_form_info.checked_date }}</td>
                    <td class="approve_list_date">{{ order_form_info.approved_date === '' ? '미승인' : order_form_info.approved_date }}</td>
                  </tr>
                </table>
              </v-col>

              <v-col cols="12" sm="12" style="padding-top:0px;padding-bottom:0px">
                <table style="border-spacing: 0px; width: 100%;">
                  <tr class="text-body-1">
                    <td class="order_info order_title text-center" style="border-left:1px solid #b6b6b6">관리번호</td>
                    <td class="order_info">{{ order_form_info.code }}</td>
                    <td class="order_info order_title text-center" >발행일</td>
                    <td class="order_info">{{ order_form_info.order_date === null ? '미발행' : order_form_info.order_date }}</td>
                    <td class="order_info order_title text-center">납기일</td>
                    <td class="order_info">{{ order_form_info.due_date }}</td>
                  </tr>
                </table>
              </v-col>

              <v-col cols="12" sm="6" style="padding-bottom:0px">
                <table style="table-layout: fixed; border-spacing: 0px; width: 100%; ">

                  <tr>
                    <td class="order_info order_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">수신업체</td>
                    <td colspan="3" class="order_info" style="border-bottom: 0px;">{{ order_form_info.company_name }}</td>
                  </tr>
                  <tr class="text-body-1">
                    <td class="order_info order_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">등록번호</td>
                    <td class="order_info" style="WORD-BREAK:break-all; border-bottom: 0px;border-right: 0px;">{{ order_form_info.company_registration_number }}</td>
                    <td class="order_info order_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">대표자</td>
                    <td class="order_info" style="border-bottom: 0px;">{{ order_form_info.company_manager }}</td>
                  </tr>
                  <tr>
                    <td class="order_info order_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">주소</td>
                    <td colspan="3" class="order_info" style="border-bottom: 0px;">{{ order_form_info.company_address }}</td>
                  </tr>
                  <tr class="text-body-1">
                    <td class="order_info order_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">전화</td>
                    <td class="order_info" style="border-bottom: 0px;border-right: 0px;">{{ order_form_info.company_phone }}</td>
                    <td class="order_info order_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">팩스</td>
                    <td class="order_info" style="border-bottom: 0px;">{{ order_form_info.company_fax }}</td>
                  </tr>
                  <tr class="text-body-1">
                    <td class="order_info order_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">결제조건</td>
                    <td class="order_info" style="border-bottom: 0px;border-right: 0px;">{{ order_form_info.payment_terms }}</td>
                    <td class="order_info order_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">프로젝트</td>
                    <td class="order_info" style="border-bottom: 0px;">{{ order_form_info.company_registration_number }}</td>
                  </tr>
                  <tr>
                    <td class="order_info order_title text-center" style="border-left:1px solid #b6b6b6">계좌정보</td>
                    <td colspan="3" class="order_info">{{ order_form_info.account_number }}</td>
                  </tr>
                </table>
              </v-col>
              <v-col cols="12" sm="6" style="position: relative;padding-bottom:0px">
                <v-img
                  alt="직인"
                  contain
                  src="../assets/img/pion_stamp.png"
                  transition="scale-transition"
                  width="30"
                  style="position: absolute; right:25px; top:25px"
                />
                <table style=" border-spacing: 0px; width: 100%;">
                  <tr>
                    <td class="order_info order_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">등록번호</td>
                    <td colspan="3" class="order_info" style="border-bottom: 0px;">851 - 86 - 00038</td>
                  </tr>
                  <tr>
                    <td class="order_info order_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">상호</td>
                    <td class="order_info" style="border-bottom: 0px;">파이온일렉트릭(주)</td>
                    <td class="order_info order_title text-center" style="border-bottom: 0px;">대표자</td>
                    <td class="order_info" style="border-bottom: 0px;">윤광희</td>
                  </tr>
                  <tr>
                    <td class="order_info order_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">주소</td>
                    <td colspan="3" class="order_info" style="border-bottom: 0px;">서울특별시 서대문구 연세로 50, 116호(연세대학교 공학원)</td>
                  </tr>
                  <tr>
                    <td class="order_info order_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">업태</td>
                    <td class="order_info" style="border-bottom: 0px;">제조업</td>
                    <td class="order_info order_title text-center" style="border-bottom: 0px;">종목</td>
                    <td class="order_info" style="border-bottom: 0px;">전력전자기기</td>
                  </tr>
                  <tr>
                    <td class="order_info order_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">대표전화</td>
                    <td class="order_info" style="border-bottom: 0px;">070-5096-4179</td>
                    <td class="order_info order_title text-center" style="border-bottom: 0px;">팩스</td>
                    <td class="order_info" style="border-bottom: 0px;">0505-300-4179</td>
                  </tr>
                  <tr>
                    <td class="order_info order_title text-center" style="border-left:1px solid #b6b6b6">담당자</td>
                    <td class="order_info" >{{ order_form_info.given_name }}</td>
                    <td class="order_info order_title text-center" >연락처</td>
                    <td class="order_info">070-1234-5678</td>
                  </tr>
                </table>
              </v-col>
              <v-col cols="12" sm="12" style="padding-bottom:0px">
                <v-data-table
                  :headers="order_form_headers"
                  :items="order_form_data"
                  group-by="item_code"
                  item-key="item_code"
                  hide-default-footer
                  disable-pagination
                  dense
                  disable-sort
                  style="border:1px solid #ccc"
                >

                  <template v-slot:[`group.header`]="{items}">
                    <th
                      :rowspan="items.length+1"
                      style="background: white;border-right: thin solid rgba(0, 0, 0, 0.12); font-size: 11px;"
                    >
                      {{ checkNo(items[0].item_code) }}
                    </th>
                    <th style="font-size:11px">{{ items[0].name }}</th>
                    <th style="font-size:11px">{{ items[0].spec }}</th>
                    <th style="font-size:11px">{{ items[0].unit_price }}</th>
                    <th style="font-size:11px">{{ items[0].ordered_num }}</th>
                    <th style="font-size:11px">{{ items[0].unit_price * items[0].ordered_num }}</th>
                    <th style="font-size:11px">{{ (items[0].unit_price * items[0].ordered_num)*0.1 }}</th>
                  </template>
                  <template v-slot:item="{ item }">
                    <tr v-if="item.note">
                      <td colspan="6"  style="font-size:11px">
                        {{ item.note }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="mt-6">
          <p class="font-weight-bold primary--text mb-0" style="font-size: 18px;">
            발주 상세 내역
          </p>
          <!-- <DataTableComponent
            :headers="order_detail_headers"
            :items="order_detail_data"
            dense
          /> -->
          <v-data-table
            :headers="order_detail_headers"
            :items="order_detail_data"
            group-by="item_code"
            dense
          >
            <template v-slot:[`group.header`]="{items, isOpen, toggle}">
              <th @click="toggle">
                <v-icon
                  >{{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                </v-icon>
                {{ items[0].item_code }} : {{ items[0].name }} ({{ items[0].spec }})
              </th>
              <th @click="toggle">
                총 {{ calcTotalNum(items) }}개
              </th>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-divider class="my-9"></v-divider>
      <v-row>
        <v-col cols="12">
          <p class="font-weight-bold primary--text mb-0" style="font-size: 18px;">
            발주 업체 관련 첨부
          </p>
        </v-col>
        <v-col cols="12" sm="4">
          <p class="font-weight-bold mb-0">
            ▼ 발주 확인서
            <v-btn
              v-if="order_form_info.approval_phase !== '구매완료' && order_form_info.approval_phase !== '미승인'"
              outlined
              color="primary"
              x-small
              elevation="0"
              class="float-right"
              @click="openUploadFilesDialog('발주 확인서', 'order_confirmation')"
            >
              변경
            </v-btn>
          </p>
          <v-img
            alt="thumbnail"
            class="shrink mr-2"
            contain
            :src="mux.Util.imageBinary(orderConfirmationThumbnail)"
            transition="scale-transition"
            @click="download('order/confirmation', orderConfirmationFile, fileCode+'_')"
            style="cursor: pointer; width: 100%;"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <p class="font-weight-bold mb-0">
            ▼ 사업자 등록증
            <v-btn
              v-if="order_form_info.approval_phase !== '구매완료' && order_form_info.approval_phase !== '미승인'"
              outlined
              color="primary"
              x-small
              elevation="0"
              class="float-right"
              @click="openUploadFilesDialog('사업자 등록증', 'business_registration')"
            >
              변경
            </v-btn>
          </p>
          <v-img
            alt="thumbnail"
            class="shrink mr-2"
            contain
            :src="mux.Util.imageBinary(businessRegistrationThumbnail)"
            transition="scale-transition"
            @click="download('order/registration', businessRegistrationFile, fileCode+'_')"
            style="cursor: pointer; width: 100%;"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <p class="font-weight-bold mb-0">
            ▼ 통장 사본
            <v-btn
              v-if="order_form_info.approval_phase !== '구매완료' && order_form_info.approval_phase !== '미승인'"
              outlined
              color="primary"
              x-small
              elevation="0"
              class="float-right"
              @click="openUploadFilesDialog('통장 사본', 'bankbook')"
            >
              변경
            </v-btn>
          </p>
          <v-img
            alt="thumbnail"
            class="shrink mr-2"
            contain
            :src="mux.Util.imageBinary(bankbookThumbnail)"
            transition="scale-transition"
            @click="download('order/bankbook', bankbookFile, fileCode+'_')"
            style="cursor: pointer; width: 100%;"
          />
        </v-col>
      </v-row>
      <v-divider class="my-4"></v-divider>
      <v-row>
        <v-col cols="12">
          <p class="font-weight-bold primary--text mb-0" style="font-size: 18px;">
            계산서
          </p>
          <v-chip
            :color="firstBillFile === null ? 'grey lighten-2': 'primary'"
            class="ma-2 ml-0"
            @click="firstBillFile !== null ? download('order/bill', firstBillFile, fileCode+'_') : ''"
          >
            1차 계산서 {{ firstBillDate === null ? '' : ' : ' + firstBillDate }}
          </v-chip>
          <v-btn
            v-if="order_form_info.approval_phase === '진행중'"
            outlined
            color="primary"
            x-small
            elevation="0"
            class="mr-6"
            @click="openUploadFilesDialog('1차 계산서', 'first_bill')"
          >
            변경
          </v-btn>
          <v-chip
            :color="secondBillFile === null ? 'grey lighten-2': 'primary'"
            class="ma-2 ml-0"
            @click="secondBillFile !== null ? download('order/bill', secondBillFile, fileCode+'_'): ''"
          >
            2차 계산서 {{ secondBillDate === null ? '' : ' : ' + secondBillDate }}
          </v-chip>
          <v-btn
            v-if="order_form_info.approval_phase === '진행중'"
            outlined
            color="primary"
            x-small
            elevation="0"
            class="mr-6"
            @click="openUploadFilesDialog('2차 계산서', 'second_bill')"
          >
            변경
          </v-btn>

          <v-chip
            :color="thirdBillFile === null ? 'grey lighten-2': 'primary'"
            class="ma-2 ml-0"
            @click="thirdBillFile !== null ? download('order/bill', thirdBillFile, fileCode+'_'): ''"
          >
            3차 계산서 {{ thirdBillDate === null ? '' : ' : ' + thirdBillDate }}
          </v-chip>
          <v-btn
            v-if="order_form_info.approval_phase === '진행중'"
            outlined
            color="primary"
            x-small
            elevation="0"
            @click="openUploadFilesDialog('3차 계산서', 'third_bill')"
          >
            변경
          </v-btn>

        </v-col>
      </v-row>
      <v-divider class="my-4"></v-divider>
      <v-row>
        <v-col cols="12">
          <p class="font-weight-bold primary--text mb-0" style="font-size: 18px;">
            송금 확인증
          </p>
          <v-chip
            :color="firstConfirmFile === null ? 'grey lighten-2': 'primary'"
            class="ma-2 ml-0"
            @click="firstConfirmFile !== null ? download('order/confirm_transfer', firstConfirmFile, fileCode+'_') : ''"
          >
            1차 송금 확인증
          </v-chip>
          <v-btn
            v-if="order_form_info.approval_phase === '진행중'"
            outlined
            color="primary"
            x-small
            elevation="0"
            class="mr-6"
            @click="openUploadFilesDialog('1차 송금 확인증', 'first_confirm_transfer')"
          >
            변경
          </v-btn>

          <v-chip
            :color="secondConfirmFile === null ? 'grey lighten-2': 'primary'"
            class="ma-2 ml-0"
            @click="secondConfirmFile !== null ? download('order/confirm_transfer', secondConfirmFile, fileCode+'_'): ''"
          >
            2차 송금 확인증
          </v-chip>
          <v-btn
            v-if="order_form_info.approval_phase === '진행중'"
            outlined
            color="primary"
            x-small
            elevation="0"
            class="mr-6"
            @click="openUploadFilesDialog('2차 송금 확인증', 'second_confirm_transfer')"
          >
            변경
          </v-btn>

          <v-chip
            :color="thirdConfirmFile === null ? 'grey lighten-2': 'primary'"
            class="ma-2 ml-0"
            @click="thirdConfirmFile !== null ? download('order/confirm_transfer', thirdConfirmFile, fileCode+'_'): ''"
          >
            3차 송금 확인증
          </v-chip>
          <v-btn
            v-if="order_form_info.approval_phase === '진행중'"
            outlined
            color="primary"
            x-small
            elevation="0"
            class="ma-2 ml-0"
            @click="openUploadFilesDialog('3차 송금 확인증', 'third_confirm_transfer')"
          >
            변경
          </v-btn>
          <v-btn
            v-if="order_form_info.approval_phase === '진행중' && firstConfirmFile !== null"
            color="success"
            x-small
            elevation="0"
            @click="completeOrder('송금')"
          >
            송금 완료
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    </ModalDialogComponent>

    <v-dialog
      v-model="mailDialog"
      persistent
      max-width="1000px"
    >
      <v-form ref="mailForm">
        <MailFormComponent
          ref="mailFormComponent"
          v-model="mailData"
          addCardClass="d-none"
          addSystemFiles="order"
          :loginInfo="this.login_info"
        >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="mailDialog = false"
            >
              취소
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="sendOrderMail()"
            >
              발송
            </v-btn>
          </v-card-actions>
        </MailFormComponent>
      </v-form>
    </v-dialog>

    <ModalDialogComponent
      :dialog-value="uploadFilesDialog"
      max-width="550px"
      title-class="display-none"
      text-class="pb-0"
      closeText="취소"
      saveText="저장"
      :persistent="true"
      @close="uploadFilesDialog = false"
      @save="saveNewFile"
    >
      <CardComponent
        elevation="0"
        text-class="pa-0 pt-4"
        title-class="pa-0"
      >
        <div slot="cardTitle">
          <span>파일 변경</span>
        </div>
        <InputsFormComponent
          slot="cardText"
          dense
          clearable
          filled
          hide-details
          :inputs="uploadFilesInputs"
        >
        </InputsFormComponent>
      </CardComponent>
    </ModalDialogComponent>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
// import DataTableComponent from "@/components/DataTableComponent";
import OrderDataTableComponent from "@/components/OrderDataTableComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import LoadingModalComponent from "@/components/LoadingModalComponent.vue";
// import orderPurchaseComponent from "@/components/orderPurchaseComponent.vue";
import MailFormComponent from "@/components/MailFormComponent.vue";
import ExpansionPanelComponent from "@/components/ExpansionPanelComponent.vue";
import OrderSearchPageConfig from "@/configure/OrderSearchPageConfig.json";

import mux from "@/mux";

export default {

  mounted() {

  },
  components: {
                NavComponent,
                // DataTableComponent,
                OrderDataTableComponent,
                ModalDialogComponent,
                CardComponent,
                InputsFormComponent,
                LoadingModalComponent,
                // orderPurchaseComponent,
                MailFormComponent,
                ExpansionPanelComponent,
              },
  data(){
    return{
      mux: mux,
      dates: [],
      showEmailIcon: false,
      showSaveIcon: false,
      criterion: false,
      orderPurchase: false,
      order_detail_dialog: false,
      loading_dialog: false,
      mailDialog: false,
      uploadFilesDialog: false,

      search_by_code: '',
      email_sign:'',
      fileCode: '',
      orderConfirmationThumbnail: '',
      orderConfirmationFile: '',
      businessRegistrationThumbnail: '',
      businessRegistrationFile: '',
      bankbookThumbnail: '',
      bankbookFile: '',
      firstBillFile: '',
      secondBillFile: '',
      thirdBillFile: '',
      firstBillDate: '',
      secondBillDate: '',
      thirdBillDate: '',
      firstConfirmFile:'',
      secondConfirmFile:'',
      thirdConfirmFile:'',
      code_criterion: 'project',

      save_new_file_info:{},
      order_form_info:{},
      uploadFilesInputs: [],
      searched_order_data:[],
      order_form_data:[],
      order_detail_data: [],
      project_code_criterion_data:[],
      order_notes_data:[],
      order_code_criterion_data:[],


      order_form_headers:OrderSearchPageConfig.order_form_headers,
      login_info: OrderSearchPageConfig.login_info,
      searchCardInputs:OrderSearchPageConfig.searchCardInputs,
      project_code_data_headers:OrderSearchPageConfig.project_code_data_headers,
      order_detail_headers:OrderSearchPageConfig.order_detail_headers,
      defaultMailData: OrderSearchPageConfig.default_mail_data,
    }
  },

  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  },
  watch:{
    order_detail_dialog(val){
      val || this.closeOrderDetail()
      this.mailData = JSON.parse(JSON.stringify(this.defaultMailData));
    },
  },
  created () {
    this.initialize()
    const code = this.$route.query.code;
    if (code){
      this.setSearchCardInputs(code);
      this.searchButton();
    }
  },
  methods:{
    async initialize () {
      const prevURL = window.location.href;
      try {
        if (prevURL !== window.location.href) return;
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
      this.email_sign =`<div><p style="color:#255fab; border-bottom:1px solid #255fab; border-top:1px solid #255fab;padding:15px 0px;"><strong>${this.login_info.name} 파이온 일렉트릭㈜ ${this.login_info.department} ${this.login_info.position} / Pion Electric Co., Ltd. </strong></p><p style="border-bottom:1px solid #333333;padding-bottom:20px; font-size:14px;">Home page : www.pionelectric.com<br>E-mail: ${this.login_info.email}  C/P: ${'+82(0)' + this.login_info.phone_number.slice(1)}<br> Tel: ${'+82(0)' + this.login_info.office_phone_number.slice(1)} Fax: +82(0)505-300-4179<br><br> 본사: (03722) 서울특별시 서대문구 연세로 50 연세대학교 공학원 116호<br> Head office: #116, Engineering Research Park, Yonsei University, 50, Yonsei-ro, Seodaemun-gu, Seoul, 03722, Republic of KOREA<br><br> 광명 사무소: (14348) 경기도 광명시 일직로 72  A-1818호<br> Gwangmyeong office: #A-1818, 72, Iljik-ro, Gwangmyeong-si, Gyeonggi-do, Republic of KOREA 14348<br><br> 광주 공장: (47580) 광주광역시 광산구 연산동 1247<br> Gwangju factory: 1247 Yeonsan-dong, Gwangsan-gu, Gwangju, Republic of KOREA 47580<br><br> 보령 공장: (33448) 충청남도 보령시 주교면 관창공단길 266<br> Boryeong factory: 266, Gwanchanggongdan-gil, Jugyo-myeon, Boryeong-si, Chungcheongnam-do, Republic of KOREA 33448<br><br></p> <p style="border-bottom:1px solid #333333;padding-bottom:20px; font-size:14px;"><strong>제품 및 서비스</strong><br> ∙ 고자기장 기반의 산업용 운용기기 (Development of Operating Device for Industrial Applications based on High Magnetic Field)<br> ∙ 광기기 기반의 전력전자 응용기기 (Development of Power Electronics Application Device based on Optical Device)<br> ∙ 신재생 에너지 개발 및 운영 (Development and Operation of Renewable Energy System)<br> ∙ 전력계통 진단 및 해석 (Power System Diagnosis and Analysis)<br> ∙ 전기공사면허</p> </div>`
    },
    // eslint-disable-next-line no-unused-vars

    setSearchCardInputs(code){
      this.search_by_code = code;
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
      this.criterion = true;
      this.order_code_criterion_data = [];
      this.searched_order_data = [];

      let searchCode = this.search_by_code;
      let searchApprovalPhase = this.searchCardInputs.find(x=>x.label === '승인').value;
      if (searchApprovalPhase === 'All')
        searchApprovalPhase = '';
      let searchProjectCode = this.searchCardInputs.find(x=>x.label === '프로젝트 코드').value;
      if (searchProjectCode)
        searchProjectCode = searchProjectCode.trim();
      let searchCompany = this.searchCardInputs.find(x=>x.label === '발주 업체명').value;
        if (searchCompany)
        searchCompany = searchCompany.trim();
      let searchItemCode = this.searchCardInputs.find(x=>x.label === '관리코드').value;
      if (searchItemCode)
      searchItemCode = searchItemCode.trim();
      let searchItemName = this.searchCardInputs.find(x=>x.label === '제품명').value;
      if (searchItemName)
      searchItemName = searchItemName.trim();

      let searchBillDate = this.searchCardInputs.find(x=>x.label === '계산일').value;
      let searchBillStartDate = searchBillDate[0];
      let searchBillEndDate = searchBillDate[1];

      // 발주 기준 검색
      let order_result = [];
      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "order_confirmation_table.code": searchCode ?  searchCode :"",
              "order_confirmation_table.company_name": searchCompany ?  searchCompany :"",
              "order_confirmation_table.approval_phase": searchApprovalPhase ? searchApprovalPhase : "",
              "order_product_table.name": searchItemName ? searchItemName : "",
              "order_product_table.item_code": searchItemCode ? searchItemCode : "",
              "order_product_table.project_code": searchProjectCode ? searchProjectCode :"",
              "order_confirmation_table.third_bill_date_start_date": searchBillStartDate ? searchBillStartDate : "",
              "order_confirmation_table.third_bill_date_end_date": searchBillEndDate ? searchBillEndDate : "",
              "order_confirmation_table.second_bill_date_start_date": searchBillStartDate ? searchBillStartDate : "",
              "order_confirmation_table.second_bill_date_end_date": searchBillEndDate ? searchBillEndDate : "",
              "order_confirmation_table.first_bill_date_start_date": searchBillStartDate ? searchBillStartDate : "",
              "order_confirmation_table.first_bill_date_end_date": searchBillEndDate ? searchBillEndDate : ""
            }
          ],
          "script_file_name": "rooting_발주_데이터_order_product_confirm_fst_검색_24_08_08_09_39_OKJ.json",
          "script_file_path": "data_storage_pion\\json_sql\\order\\발주_데이터_order_product_confirm_fst_검색_24_08_08_09_39_3Q8"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

          if(result.length === 0){
            mux.Util.showAlert('검색 결과가 없습니다.');
          }
          order_result = result.data;

          order_result.forEach(async order => {
            try {
              let note_result = await mux.Server.post({
                path: '/api/common_rest_api/',
                params: [
                  {
                    "order_product_notes_table.code": order.code
                  }
                ],
                "script_file_name": "rooting_발주_데이터_order_prodct_notes_table_검색_24_08_08_09_00_ANX.json",
                "script_file_path": "data_storage_pion\\json_sql\\order\\발주_데이터_order_prodct_notes_table_검색_24_08_08_09_01_4AI"
              });
              if (prevURL !== window.location.href) return;

              if (typeof note_result === 'string'){
                note_result = JSON.parse(note_result);
              }
              if(note_result['code'] == 0 || (typeof note_result['data'] === 'object' && note_result['data']['code'] == 0) || (typeof note_result['response'] === 'object' && typeof note_result['response']['data'] === 'object' && note_result['response']['data']['code'] == 0)){
                //order_product_notes_table 검색
                this.order_notes_data.push(...note_result.data);
              } else {
                mux.Util.showAlert(note_result['failed_info']);
              }
            } catch (error) {
              if (prevURL !== window.location.href) return;
              mux.Util.hideLoading();
              if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
                mux.Util.showAlert(error.response['data']['failed_info'].msg);
              else
                mux.Util.showAlert(error);
            }
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
      //order_product_notes_table 검색
      // this.order_notes_data = OrderSearchPageConfig.test_note_data;

      // 프로젝트 기준 검색
      // this.project_code_criterion_data = OrderSearchPageConfig.test_project_code_criterion_data
      try {
        let project_result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "order_confirmation_table.code": searchCode ?  searchCode :"",
              "order_confirmation_table.company_name": searchCompany ?  searchCompany :"",
              "order_confirmation_table.approval_phase": searchApprovalPhase ? searchApprovalPhase : "",
              "order_product_table.name": searchItemName ? searchItemName : "",
              "order_product_table.item_code": searchItemCode ? searchItemCode : "",
              "order_product_table.project_code": searchProjectCode ? searchProjectCode :"",
              "order_confirmation_table.third_bill_date_start_date": searchBillStartDate ? searchBillStartDate : "",
              "order_confirmation_table.third_bill_date_end_date": searchBillEndDate ? searchBillEndDate : "",
              "order_confirmation_table.second_bill_date_start_date": searchBillStartDate ? searchBillStartDate : "",
              "order_confirmation_table.second_bill_date_end_date": searchBillEndDate ? searchBillEndDate : "",
              "order_confirmation_table.first_bill_date_start_date": searchBillStartDate ? searchBillStartDate : "",
              "order_confirmation_table.first_bill_date_end_date": searchBillEndDate ? searchBillEndDate : ""
            }
          ],
          "script_file_name": "rooting_발주_데이터_order_product_confirm_snd_검색_24_08_09_15_18_5I4.json",
          "script_file_path": "data_storage_pion\\json_sql\\order\\발주_데이터_order_product_confirm_snd_검색_24_08_09_15_19_NQB"
        });
        if (prevURL !== window.location.href) return;

        if (typeof project_result === 'string'){
          project_result = JSON.parse(project_result);
        }
        if(project_result['code'] == 0 || (typeof project_result['data'] === 'object' && project_result['data']['code'] == 0) || (typeof project_result['response'] === 'object' && typeof project_result['response']['data'] === 'object' && project_result['response']['data']['code'] == 0)){

          if(project_result.length === 0){
            mux.Util.showAlert('검색 결과가 없습니다.');
          }
          this.project_code_criterion_data = project_result.data;
        } else {
          mux.Util.showAlert(project_result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.hideLoading();
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }

      this.searched_order_data = order_result;
      order_result.forEach( data => {
        let set_data = [];
        set_data.belong_data = [];
        set_data.code = data.code;
        set_data.company_name = data.company_name;
        set_data.approval_phase = data.approval_phase;
        for(let i=0; i<data.belong_data.length; i++){
          let belong = data.belong_data[i];
          set_data.belong_data.push({
            project_code : belong.project_code,
            created_time: data.created_time,
            given_name: data.given_name,
            approver: data.approver,
            approver_id: data.approver_id,
            approved_date: data.approved_date,
            order_date: data.order_date,
            first_bill_date: data.first_bill_date,
            second_bill_date: data.second_bill_date,
            third_bill_date: data.third_bill_date,
          })
        }

        set_data.belong_data = set_data.belong_data.reduce((prev, now) => {
          if(!prev.some(obj => obj.project_code === now.project_code)){
            prev.push(now);
          }
          return prev;
        }, [])
        this.order_code_criterion_data.push(set_data)
      });


      mux.Util.hideLoading();
    },
    checkNo(item_code){
      let project_code = [];
      this.order_form_data.forEach(data => {
        project_code.push(data.item_code);
      });

      project_code = new Set(project_code);
      project_code = [ ...project_code]

      let idx= 0;
      for(let i=0; i<project_code.length; i++){
        if(project_code[i] === item_code){
          idx = i+1;
        }
      }

      return idx;
    },
    calcTotalNum(item){
      let total = 0;
      item.forEach(data => {
        total += data.ordered_num;
      });
      return total;
    },
    closeOrderDetail(){
      this.order_detail_dialog = false;
    },
    async clickApproveData(item){

      //thumbnail
      // this.orderConfirmationThumbnail = item.order_confirmation_thumbnail
      // this.businessRegistrationThumbnail = item.business_registration_thumbnail
      // this.bankbookThumbnail = item.bankbook_thumbnail

      const prevURL = window.location.href;
      try {
        let thumbnail_result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "order_confirmation_table.code": item.code
            }
          ],
          "script_file_name": "rooting_발주_데이터_thumbnail_검색_24_08_08_09_57_E33.json",
          "script_file_path": "data_storage_pion\\json_sql\\order\\발주_데이터_thumbnail_검색_24_08_08_09_58_Z61"
        });
        if (prevURL !== window.location.href) return;

        if (typeof thumbnail_result === 'string'){
          thumbnail_result = JSON.parse(thumbnail_result);
        }
        if(thumbnail_result['code'] == 0 || (typeof thumbnail_result['data'] === 'object' && thumbnail_result['data']['code'] == 0) || (typeof thumbnail_result['response'] === 'object' && typeof thumbnail_result['response']['data'] === 'object' && thumbnail_result['response']['data']['code'] == 0)){

          let data = thumbnail_result.data[0];

          this.orderConfirmationThumbnail = data.order_confirmation_thumbnail
          this.businessRegistrationThumbnail = data.business_registration_thumbnail
          this.bankbookThumbnail = data.bankbook_thumbnail
        } else {
          mux.Util.showAlert(thumbnail_result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.hideLoading();
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }


      this.fileCode = item.code
      this.orderConfirmationFile = item.order_confirmation_file
      this.businessRegistrationFile = item.business_registration_file
      this.bankbookFile = item.bankbook_file
      this.firstBillFile = item.first_bill
      this.secondBillFile = item.second_bill
      this.thirdBillFile = item.third_bill
      this.firstBillDate = item.first_bill_date
      this.secondBillDate = item.second_bill_date
      this.thirdBillDate = item.third_bill_date
      this.firstConfirmFile = item.first_confirm_transfer
      this.secondConfirmFile = item.second_confirm_transfer
      this.thirdConfirmFile = item.third_confirm_transfer

      this.order_detail_data=[];
      this.order_form_data = [];
      this.order_detail_dialog = true;

      if(item.approval_phase === '승인' || item.approval_phase === '진행중'){
        this.showEmailIcon = true;
      }else{
        this.showEmailIcon = false;
      }
      if(item.approval_phase !== '미승인'){
        this.showSaveIcon = true;
      }else{
        this.showEmailIcon = false;
      }
      this.searched_order_data.forEach(data => {
        if(data.code === item.code){
          this.order_detail_data.push(...data.belong_data);
          this.order_form_info = data;
        }
      });
      let notes = JSON.parse(JSON.stringify(this.order_notes_data))
      notes.forEach(data => {
        if(data.code === item.code){
          this.order_form_data.push(data);
        }
        // else{
        //   this.order_form_data.push(item);
        // }
      });
      this.order_detail_data.forEach(item => {
        if(this.order_form_data.length === 0){
          this.order_form_data.push({
            "code":item.code,
            "item_code":item.item_code,
            "name":item.name,
            "ordered_num":item.ordered_num,
            "spec":item.spec,
            "unit_price":item.unit_price
          });
        }else{
          for(let o=0; o<this.order_form_data.length; o++){
            let order = this.order_form_data[o];
            if(order.item_code === item.item_code && !order.ordered_num){
              order.ordered_num = item.ordered_num;
              order.name = item.name;
              order.spec = item.spec;
              order.unit_price = item.unit_price;
              return;
            }else if(order.item_code === item.item_code && order.ordered_num){
              order.ordered_num += item.ordered_num;
              order.name = item.name;
              order.spec = item.spec;
              order.unit_price = item.unit_price;
              return;
            }
          }
        }
      });
    },

    async batchApprovalPhase(item){
      const currDate = new Date();
      const prevURL = window.location.href;

      let send_data = {};

      send_data.approved_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
      send_data.approval_phase = '승인';

      let sendData = {};
      let update_data = [];

      let content_table = '';
      let mailInfo = [];
      item.forEach(data=>{
        if(data.approval_phase === '미승인'){
          update_data.push({
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data": send_data,
            "update_where": {"code": data.code},
            "rollback": "yes"
          });
          content_table += `
            <tr>
              <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#efefef">${data.company_name}</td>
              <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${data.given_name}</td>
              <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${data.approver}</td>
            </tr>
          `
          mailInfo.push({"mailTo": data.creater, "code": data.code});
        }

      })

      if(update_data.length === 0){
        mux.Util.showAlert('승인할 발주 데이터가 없습니다.');
        return;
      }

      sendData["order_confirmation_table-update"] = update_data;
      console.log("sendData ::: ", sendData);

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
        if(result['code'] == 0){
          item.approval_phase = send_data.approval_phase;
          item.approved_date = send_data.approved_date;
          mux.Util.hideLoading();
          mux.Util.showAlert('발주 승인 완료', '완료', 3000);

          //메일 알림 관련
          for(let m=0; m<mailInfo.length; m++){
            let mailTo = [mailInfo[m].mailTo];
            let mailCode = mailInfo[m].code;

            // 메일 본문 내용
            let content=`
                  <html>
                    <body>
                      <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                        <h2 style="text-align: center; color:#13428a">발주 승인 알림</h2>
                        <table style="width: 100%;border-spacing: 10px 10px;">
                          <thead>
                            <tr>
                              <th style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">발주 업체</th>
                              <th style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">구매 담당자</th>
                              <th style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">승인자</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${content_table}
                          </tbody>
                        </table>
                        <a style="color: white; text-decoration:none"href="${prevURL.substring(0,prevURL.lastIndexOf('/'))}/order-search?code=${mailCode}">
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
                subject: "발주 승인 알림",
                content: content
              });
              if (prevURL !== window.location.href) return;
              if(sendEmailAlam['code'] == 0){
                console.log(sendEmailAlam['message']);
              } else {
                if (prevURL !== window.location.href) return;
                mux.Util.showAlert(sendEmailAlam['failed_info']);
              }
            } catch (error) {
              if (prevURL !== window.location.href) return;
              if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
                mux.Util.showAlert(error.response['data']['failed_info'].msg);
              else
                mux.Util.showAlert(error);
            }
          }
        } else {
          if (prevURL !== window.location.href) return;
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
    },
    async setApprovalPhase(item){
      const currDate = new Date();
      const prevURL = window.location.href;
      let phase;
      let send_data = {};
      let mailTo = [item.creater];

      send_data.approved_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
      send_data.approval_phase = '승인';
      phase = '승인';

      console.log(phase);

      let sendData = {};

      sendData["order_confirmation_table-update"] = [{
        "user_info": {
          "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
          "role": "modifier"
        },
        "data": send_data,
        "update_where": {"code": item.code},
        "rollback": "yes"
      }];
      console.log("sendData ::: ", sendData);

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
        if(result['code'] == 0){
          item.approval_phase = send_data.approval_phase;
          item.approved_date = send_data.approved_date;
          mux.Util.hideLoading();
          mux.Util.showAlert('발주 승인 완료', '완료', 3000);

          // 메일 본문 내용
          let content=`
                <html>
                  <body>
                    <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                      <h2 style="text-align: center; color:#13428a">발주 ${phase} 알림</h2>
                      <table style="width: 100%;border-spacing: 10px 10px;">
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">발주 업체</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.company_name}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">구매 담당자</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.given_name}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">승인자</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.approver}</td>
                        </tr>
                      </table>
                      <a style="color: white; text-decoration:none"href="${prevURL.substring(0,prevURL.lastIndexOf('/'))}/order-search?code=${item.code}">
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
              subject: "발주 "+ phase +" 알림",
              content: content
            });
            if (prevURL !== window.location.href) return;
            if(sendEmailAlam['code'] == 0){
              console.log(sendEmailAlam['message']);
            } else {
              if (prevURL !== window.location.href) return;
              mux.Util.showAlert(sendEmailAlam['failed_info']);
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
              mux.Util.showAlert(error.response['data']['failed_info'].msg);
            else
              mux.Util.showAlert(error);
          }
        } else {
          if (prevURL !== window.location.href) return;
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
    },

    async saveNewFile(){
      let save_info = this.save_new_file_info
      let file_value = this.uploadFilesInputs.find(x=>x.column_name === save_info.column_file).value;
      if(file_value === '' || file_value === null || file_value === undefined){
        mux.Util.showAlert('파일을 선택해주세요');
        return;
      }
      let file_name = file_value.name;
      let file_thumbnail;
      let save_data = {};
      save_data[save_info.column_file] = file_name;

      if(save_info.name === '발주 확인서' || save_info.name === '사업자 등록증' || save_info.name === '통장 사본'){
        const getPdfThumbnail = await mux.Util.getPdfThumbnail(file_value, 1, false);
        file_thumbnail = mux.Util.uint8ArrayToHexString(getPdfThumbnail);
        save_data[save_info.column_thumbnail] = file_thumbnail;
      }else if(save_info.name.includes('계산서')){
        let file_date = this.uploadFilesInputs.find(x=>x.column_name === save_info.column_file+'_date').value;
        if(file_date === '' || file_date === null || file_date === undefined){
          mux.Util.showAlert(save_info.name.replace('계산서', '계산일')+'을 입력해주세요');
          return;
        }else{
        save_data[save_info.column_file+'_date'] = file_date;

        }
      }


      // let file_data = [];
      // file_data.folder = save_info.folder;
      // file_data.file = file_value;
      // file_data.name = file_name;

      mux.Util.showLoading();

      let sendData = {
        "order_confirmation_table-update": [{
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "modifier"
          },
          "data":save_data,
          "update_where": {"code": save_info.code},
          "rollback": "yes"
        }]
      };

      sendData.files = [];
      sendData.files.push({
        folder : save_info.folder,
        file : file_value,
        name : file_name
      })
      sendData.path = '/api/multipart_rest_api/';
      sendData.prefix = save_info.code + '_';

      console.log(sendData);


      const prevURL = window.location.href;
      try {
        let result = await mux.Server.uploadFile(sendData);
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result.data['code'] == 0){
          mux.Util.showAlert('파일이 변경되었습니다', '변경 완료', 3000);
        } else {
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
      this.uploadFilesDialog = false;
      this.save_new_file_info = {};
    },
    async sendOrderMail(){
      const currDate = new Date();

      await this.$refs.mailFormComponent.dispatchEnterKeyToAllCombobox();
      const validate = this.$refs.mailForm.validate();
      if (!validate) return;

      mux.Util.showLoading();
      let mail_data = JSON.parse(JSON.stringify(this.mailData));
      // mail_data.content = mail_data.content.replaceAll("style=\"", "style="").replaceAll(";\"", ";"")

      mail_data.content += this.email_sign

      let sendData = {};
      for (let key in mail_data) {
        if(key === 'content'){
          sendData[key] = '<html><body>' + mail_data.content  + '</body></html>';
        }else{
          sendData[key] = mail_data[key];
        }
      }
      sendData.path = '/api/send_email_extention/';
      sendData.files = [];
      for (let i = 0; i < this.mailData.files.length; i++) {
        const file = this.mailData.files[i];
        sendData.files.push(file);
      }

      let orderFile = null;
      // 발주서 PDF 파일 생성
      if (sendData.order) {
        const order = this.$refs.orderForm;
        try {
          // await mux.Util.downloadPDF(order, 'order');
          orderFile = await mux.Util.getPDF(order, '발주서');
          sendData.files.push(orderFile);
        } catch (error) {
          this.mailDialog = true;
          mux.Util.showAlert('견적서 PDF 파일 생성 중 오류가 발생했습니다.');
          return;
        }
      }
      delete sendData.order;


      // S3에서 찾아서 첨부할 목록
      let attachment = [];

      if (sendData.business_license) {
        attachment.push({folder: 'common', fileName: 'business_license_test.pdf', newName: '사업자등록증.pdf'});
      }
      delete sendData.business_license;

      sendData.attachment = attachment;

      try {
        await mux.Server.sendEmail(sendData);
        mux.Util.showAlert('메일 발송이 완료되었습니다.', '발송 완료', 3000);
        // 발주 단계가 승인일 경우 진행중으로 변경
        if(this.order_form_info.approval_phase === '승인'){
          let updateData = {
            "order_confirmation_table-update": [{
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "modifier"
              },
              "data":{
                "approval_phase": "진행중",
                "order_date": mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss')
              },
              "update_where": {"code": this.order_form_info.code},
              "rollback": "yes"
            }]
          };

          const prevURL = window.location.href;
          try {
            let result = await mux.Server.post({
              path: '/api/common_rest_api/',
              params: updateData
            });
            if (prevURL !== window.location.href) return;

            if (typeof result === 'string'){
              result = JSON.parse(result);
            }
            if(result['code'] == 0){
              this.order_form_info.approval_phase = '진행중';
            } else {
              if (prevURL !== window.location.href) return;
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
        this.mailDialog = false;
      } catch (error) {
        this.mailDialog = true;
        mux.Util.showAlert(error);
      }
      mux.Util.hideLoading();
    },

    openUploadFilesDialog(name, type){
      this.uploadFilesDialog = true;
      this.uploadFilesInputs = [];

      let folder_name = '';
      if(name === '발주 확인서'){
        folder_name = 'order/confirmation';
      }else if(name === '사업자 등록증'){
        folder_name = 'order/registration';
      }else if(name === '통장 사본'){
        folder_name = 'order/bankbook';
      }else if(name.includes('계산서')){
        folder_name = 'order/bill';
      }else if(name.includes('송금 확인증')){
        folder_name = 'order/confirm_transfer';
      }

      this.save_new_file_info.code = this.order_form_data[0].code;
      this.save_new_file_info.name = name;
      this.save_new_file_info.folder = folder_name;
      if(name.includes('계산서')){
        this.save_new_file_info.column_file = type;
        let date_name = name.replace('계산서','계산일')
        this.uploadFilesInputs.push(
          {"label":date_name, "column_name":type+"_date", "type":"dateSingle", "value": type === 'first_bill' ? this.firstBillDate : (type === 'second_bill' ? this.secondBillDate : this.thirdBillDate), "col":"12", "sm":"12", "lg":"12", "menu":""},
          {"label":name, "column_name":type, "type":"file", "col":"12", "sm":"12", "lg":"12", "icon":"", "appendIcon":"mdi-paperclip", "accept":".pdf"},
        )
      }else if(name.includes('송금 확인증')){
        this.save_new_file_info.column_file = type;
        this.uploadFilesInputs.push(
          {"label":name, "column_name":type, "type":"file", "col":"12", "sm":"12", "lg":"12", "icon":"", "appendIcon":"mdi-paperclip", "accept":".pdf"},
        )
      }else{
        this.save_new_file_info.column_file = type+'_file';
        this.save_new_file_info.column_thumbnail = type+'_thumbnail';
        this.uploadFilesInputs.push(
          {"label":name, "column_name":type+'_file', "type":"file", "col":"12", "sm":"12", "lg":"12", "icon":"", "appendIcon":"mdi-paperclip", "accept":".pdf"},
        )
      }
    },


    printOrder(fileName){
      setTimeout(async () => {
        if (fileName){
          mux.Util.downloadPDF(this.$refs.orderForm, fileName);
        }else {
          mux.Util.print(this.$refs.orderForm);
        }
      }, 500);
    },
    async completeOrder(type){
      let confirm;
      if(type === '송금'){
        if(this.firstConfirmFile === ''){
          mux.Util.showAlert('송금 확인증을 1차 이상 등록해주세요.', '확인');
          return;
        }else if(this.secondConfirmFile === '' || this.secondConfirmFile === null){
          confirm = await mux.Util.showConfirm('송금 확인증이 1차만 등록되었습니다.<br>송금 완료 하시겠습니까?<br><br><span class="error--text">※ 송금 완료시 관련 파일 변경은 불가능합니다.</span>', '확인', false, '예', '아니오');

        }else if(this.thirdConfirmFile === '' || this.thirdConfirmFile === null){
          confirm = await mux.Util.showConfirm('송금 확인증이 2차만 등록되었습니다.<br>송금 완료 하시겠습니까?<br><br><span class="error--text">※ 송금 완료시 관련 파일 변경은 불가능합니다.</span>', '확인', false, '예', '아니오');
        }
      }else{
        confirm = await mux.Util.showConfirm('구매 완료 하시겠습니까?<br><span class="error--text">※ 구매 완료시 파일 변경은 불가능합니다.</span>', '확인', false, '예', '아니오');
      }
      if (confirm){
        let sendData = {};

        sendData["order_confirmation_table-update"] = [{
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "modifier"
          },
          "data":{
            "approval_phase": type + "완료"
          },
          "update_where": {"code": this.order_form_info.code},
          "rollback": "yes"
        }];


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
          if(result['code'] == 0){
            mux.Util.showAlert(type + ' 완료 처리되었습니다.', '완료', 3000);
          } else {
            if (prevURL !== window.location.href) return;
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
      }else {
        return;
      }
    }
  },
}
</script>

<style>

</style>

