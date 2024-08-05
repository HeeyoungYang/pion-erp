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
      @close="closeProductList"
    >
    <v-container>
      <v-row>
        <v-col cols="12">

          <v-btn
            color="success"
            small
            elevation="0"
            @click="completeOrder"
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
                    <td class="order_info">{{ order_form_info.created_time.split(' ')[0] }}</td>
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
                    <td class="order_info" style=" style='WORD-BREAK:break-all; border-bottom: 0px;border-right: 0px;">{{ order_form_info.company_registration_number }}</td>
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
                    <tr>
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
        <v-col cols="12" sm="4" class="pt-0">
          <p class="font-weight-bold mb-0">
            ▼ 발주 확인서
            <v-btn
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
            :color="firstBillFile === '' ? 'grey lighten-2': 'primary'"
            class="ma-2 ml-0"
            @click="firstBillFile !== '' ? download('order/bill', firstBillFile, fileCode+'_') : ''"
          >
            1차 계산서 {{ firstBillDate === '' ? '' : ' : ' + firstBillDate }}
          </v-chip>
          <v-btn
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
            :color="secondBillFile === '' ? 'grey lighten-2': 'primary'"
            class="ma-2 ml-0"
            @click="secondBillFile !== '' ? download('order/bill', secondBillFile, fileCode+'_'): ''"
          >
            2차 계산서 {{ secondBillDate === '' ? '' : ' : ' + secondBillDate }}
          </v-chip>
          <v-btn
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
            :color="thirdBillFile === '' ? 'grey lighten-2': 'primary'"
            class="ma-2 ml-0"
            @click="thirdBillFile !== '' ? download('order/bill', thirdBillFile, fileCode+'_'): ''"
          >
            3차 계산서 {{ thirdBillDate === '' ? '' : ' : ' + thirdBillDate }}
          </v-chip>
          <v-btn
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
            :color="firstConfirmFile === '' ? 'grey lighten-2': 'primary'"
            class="ma-2 ml-0"
            @click="firstConfirmFile !== '' ? download('order/confirm_transfer', firstConfirmFile, fileCode+'_') : ''"
          >
            1차 송금 확인증
          </v-chip>
          <v-btn
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
            :color="secondConfirmFile === '' ? 'grey lighten-2': 'primary'"
            class="ma-2 ml-0"
            @click="secondConfirmFile !== '' ? download('order/confirm_transfer', secondConfirmFile, fileCode+'_'): ''"
          >
            2차 송금 확인증
          </v-chip>
          <v-btn
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
            :color="thirdConfirmFile === '' ? 'grey lighten-2': 'primary'"
            class="ma-2 ml-0"
            @click="thirdConfirmFile !== '' ? download('order/confirm_transfer', thirdConfirmFile, fileCode+'_'): ''"
          >
            3차 송금 확인증
          </v-chip>
          <v-btn
            outlined
            color="primary"
            x-small
            elevation="0"
            @click="openUploadFilesDialog('3차 송금 확인증', 'third_confirm_transfer')"
          >
            변경
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
      <!-- <MailFormComponent
        v-model="files"
        addSystemFiles="order"
        addCardClass="d-none"
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
            @click="test(), mailDialog = false"
          >
            발송
          </v-btn>
        </v-card-actions>
      </MailFormComponent> -->

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
              @click="test()"
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
import CheckPagePermission from "@/common_js/CheckPagePermission";
import mux from "@/mux";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=OrderSearchPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
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
      billNum:3,
      dates: [],
      showEmailIcon: false,
      showSaveIcon: false,
      criterion: false,
      orderPurchase: false,
      order_detail_dialog: false,
      loading_dialog: false,
      mailDialog: false,
      uploadFilesDialog: false,
      tab_search: null,
      setPurchase: false,
      receivingInspectionThumbnail: '',
      inspectionReportThumbnail: '',
      uploadFilesTitle: '',
      code_criterion: 'project',

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

      save_new_file_info:{},
      inbound_info_data:{},
      inbound_product_list_data:[],

      change_approve:{},

      searched_products:[],
      uploadFilesInputs: [],

      order_form_info:{},

      save_order: OrderSearchPageConfig.save_order,
      order_form_headers:OrderSearchPageConfig.order_form_headers,
      purchase_member_info:OrderSearchPageConfig.purchase_member_info,
      login_info: OrderSearchPageConfig.login_info,
      searchCardInputs:OrderSearchPageConfig.searchCardInputs,
      setPurchaseInputs:OrderSearchPageConfig.setPurchaseInputs,
      project_code_data_headers:OrderSearchPageConfig.project_code_data_headers,
      order_code_data_headers:OrderSearchPageConfig.order_code_data_headers,
      order_detail_headers:OrderSearchPageConfig.order_detail_headers,
      bom_list_headers: OrderSearchPageConfig.bom_list_headers,
      bom_list_purchase_headers: OrderSearchPageConfig.bom_list_purchase_headers,
      bom_list_data: OrderSearchPageConfig.bom_list_test_data,
      bom_list_purchase_data: OrderSearchPageConfig.bom_list_purchase_test_data,
      survey_cost_headers: OrderSearchPageConfig.survey_cost_headers,
      labor_cost_headers: OrderSearchPageConfig.labor_cost_headers,
      calc_cost_detail_data: JSON.parse(JSON.stringify(OrderSearchPageConfig.calc_cost_detail_data)),
      // order_approve_data:[],
      searched_order_data:[],
      order_form_data:[],
      order_detail_data: [],
      project_code_criterion_data:[],
      order_notes_data:[],
      order_code_criterion_data:[],
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
      val || this.closeProductList()
      this.mailData = JSON.parse(JSON.stringify(this.defaultMailData));
    },
  },
  created () {
    this.initialize()
    const order_code = this.$route.query.order_code;
    const inbound_date = this.$route.query.inbound_date;
    if (order_code && inbound_date){
      this.setSearchCardInputs(order_code, inbound_date);
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
    },
    // eslint-disable-next-line no-unused-vars
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      // console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    setSearchCardInputs(order_code, inbound_date){
      this.searchCardInputs.find(x=>x.label === '발주번호').value = order_code;
      if (inbound_date.includes(' ~ ')){
        this.searchCardInputs.find(x=>x.label === '입고일자').value = inbound_date.split(' ~ ');
      } else {
        this.searchCardInputs.find(x=>x.label === '입고일자').value = [inbound_date, inbound_date];
      }
    },
    async download(foldername, filename, prefix) {
      this.loading_dialog = true;
      try {
        await mux.Server.downloadFile(foldername, filename, prefix);
      } catch (error) {
        mux.Util.showAlert(error);
      }
      this.loading_dialog = false;
    },


    searchButton(){
      this.loading_dialog = true;
      this.criterion = true;
      this.order_code_criterion_data = [];
      this.searched_order_data = [];
      //order_product_notes_table 검색
      this.order_notes_data = OrderSearchPageConfig.test_note_data;
      // 프로젝트 기준 검색
      this.project_code_criterion_data = OrderSearchPageConfig.test_project_code_criterion_data

      // 발주 기준 검색
      let result = OrderSearchPageConfig.test_order_code_criterion_data;

      this.searched_order_data = result;
      result.forEach( data => {
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


      this.loading_dialog = false;
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
    closeProductList(){
      this.order_detail_dialog = false;
    },
    async clickApproveData(item){


      this.fileCode = item.code
      this.orderConfirmationThumbnail = item.order_confirmation_thumbnail
      this.orderConfirmationFile = item.order_confirmation_file
      this.businessRegistrationThumbnail = item.business_registration_thumbnail
      this.businessRegistrationFile = item.business_registration_file
      this.bankbookThumbnail = item.bankbook_thumbnail
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

      if(item.approval_phase === '승인'){
        this.showEmailIcon = true;
      }
      if(item.approval_phase !== '미승인'){
        this.showSaveIcon = true;
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
      });
      this.order_detail_data.forEach(item => {
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
      });
    },

    async searchItemStock(data){
      const prevURL = window.location.href;
      try {
        data.forEach(async datas => {
          let stock_check = await mux.Server.post({
            path: '/api/common_rest_api/',
            params: [
              {
                "product_table.product_code": datas.product_code,

                "module_table.module_code": datas.product_code,

                "material_table.material_code": datas.product_code,
                "material_table.directly_written": 0,
              }
            ],
            "script_file_name": "rooting_재고_검색_24_05_07_11_46_16P.json",
            "script_file_path": "data_storage_pion\\json_sql\\stock\\1_재고검색\\재고_검색_24_05_07_11_46_H8D"
          });
          if (prevURL !== window.location.href) return;

          if (typeof stock_check === 'string'){
            stock_check = JSON.parse(stock_check);
          }
          if(stock_check['code'] == 0){

            stock_check = stock_check['data'].map(a => {
              if (!a.stock_num){
                a.stock_price = 0;
              }else {
                a.stock_price = Math.round(a.unit_price * a.stock_num)
              }
              return a;
            });

            console.log(stock_check);

            stock_check.forEach(data => {
              this.searched_products.push(data);
            });
          }

        })

      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
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
      let creater = [];

      item.forEach(data=>{
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
        creater.push(data.creater);
      })

      sendData["order_confirmation_table-update"] = update_data;
      console.log("sendData ::: ", sendData);

      try {
        this.loading_dialog = true;
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
          this.loading_dialog = false;
          mux.Util.showAlert('발주 승인 완료', '완료', 3000);

          //메일 알림 관련
          let mailTo = [...new Set(creater)];
          // mailTo.push(creater);

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
                      <a style="color: white; text-decoration:none"href="${prevURL.substring(0,prevURL.lastIndexOf('/'))}/purchase-search?project_code=${item.project_code}">
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
        } else {
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
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
        this.loading_dialog = true;
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
          this.loading_dialog = false;
          mux.Util.showAlert('발주 승인 완료', '완료', 3000);

          //메일 알림 관련
          let mailTo = [item.creater];
          // mailTo.push(creater);

          // 메일 본문 내용
          let content=`
                <html>
                  <body>
                    <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                      <h2 style="text-align: center; color:#13428a">발주 승인 알림</h2>
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
                      <a style="color: white; text-decoration:none"href="${prevURL.substring(0,prevURL.lastIndexOf('/'))}/purchase-search?project_code=${item.project_code}">
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
        } else {
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
    },

    async saveNewFile(){
      let save_info = this.save_new_file_info
      let file_value = this.uploadFilesInputs.find(x=>x.column_name === save_info.column_file).value;
      let file_name = file_value.name;
      let file_thumbnail;
      let save_data = {};
      save_data[save_info.column_file] = file_name;

      if(save_info.name === '발주 확인서' || save_info.name === 'ㅅ사업자 등록증' || save_info.name === '통장 사본'){
        const getPdfThumbnail = await mux.Util.getPdfThumbnail(file_value, 1, false);
        file_thumbnail = mux.Util.uint8ArrayToHexString(getPdfThumbnail);
        save_data[save_info.column_thumbnail] = file_thumbnail;
      }


      // let file_data = [];
      // file_data.folder = save_info.folder;
      // file_data.file = file_value;
      // file_data.name = file_name;

      this.loading_dialog = true;

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
      this.loading_dialog = false;
      this.uploadFilesDialog = false;
      this.save_new_file_info = {};
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
      if(name.includes('계산서') || name.includes('송금 확인증')){
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
    async completeOrder(){
      mux.Util.showAlert('송금 확인증을 1차 이상 등록해주세요.', '확인');
      const confirm = await mux.Util.showConfirm('송금 확인증이 1(혹은 2)차만 등록되었습니다. 구매 완료하시겠습니까?', '구매 완료 확인');
      if (!confirm){
        return;
      }
      mux.Util.showAlert('구매 완료 처리되었습니다.', '완료', 3000);
    }
  },
}
</script>

<style>

</style>

