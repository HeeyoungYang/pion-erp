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
            text-class="pt-3"
            title-class="d-none"
          >
            <div
              slot="cardText"
            >
              <PurchaseDataTableComponent
                :headers="purchase_headers"
                :items="purchase_data"
                item-key="product_code"
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
      :dialog-value="purchase_detail_dialog"
      max-width="70%"
      title-class=" "
      :dialog-transition="'slide-x-transition'"
      :dialog-custom="'custom-dialog elevation-0 white'"
      :card-elevation="'0'"
      @close="closeProductList"
    >
    <v-container>
      <v-tabs
        v-model="tab_search"
        background-color="transparent"
        class="tab_search"
      >
        <v-btn
          v-if="tab_search === 0 && show_request_estimate_button"
          color="success"
          small
          style="position: absolute;right: 0px;"
          :disabled="clicked_tr_phase === '진행중' ? false : true"
          @click="estiamteDialog"
        >
          견적 요청
        </v-btn>
        <v-tab
          v-for="sub_item in search_tab_items"
          :key="sub_item"
        >
          {{ sub_item }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab_search" class="pb-1">
        <!-- 요청 내역 -->
        <v-tab-item>
          <v-row>
            <v-col cols="12">
              <PurchaseDetailTableComponent
                :headers="purchase_detail_headers"
                :items="purchase_detail_data"
                :other-headers="other_obtain_headers"
                :other-items="other_obtain_data"
                :item-key="purchase_detail_data.product_code"
                @checkOthers="checkOthers"
                dense
              >
              </PurchaseDetailTableComponent>
            </v-col>
          </v-row>
        </v-tab-item>
        <!-- 견적 완료 -->
        <v-tab-item>
          <v-row>
            <v-col cols="12">
              <v-data-table
                :headers="purchase_order_headers"
                :items="purchase_detail_data"
                :item-key="purchase_detail_data.product_code"
                group-by="purchase_estimate_company"
                dense
              >

                <template v-slot:[`group.header`]="{items, isOpen, toggle}">
                  <th  @click="toggle" colspan="7">
                    <v-icon
                    >
                      {{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                    </v-icon>
                    {{ items[0].purchase_estimate_company }}
                  </th>
                  <th>
                    <v-icon
                      v-if="items[0].purchase_estimate_phase === '완료'"
                      color="primary"
                      small
                      @click="estiamteDialog('added_estimate', items[0].ordered_date, items)"
                    >mdi-file</v-icon>
                    <v-icon
                      v-if="items[0].purchase_estimate_phase === '요청'"
                      color="default"
                      small
                      :disabled="clicked_tr_phase === '진행중' ? false : true"
                      @click="estiamteDialog(false, false, items)"
                    >mdi-file</v-icon>
                  </th>
                  <th>
                    <v-btn
                      v-if="items[0].ordered_date === '' && items[0].purchase_estimate_phase === '완료'"
                      color="success"
                      x-small
                      :disabled="clicked_tr_phase === '진행중' ? false : true"
                      @click="orderRequest(items)"
                    >발주 요청</v-btn>
                    <span v-else>{{ items[0].ordered_date }}</span>
                  </th>
                </template>
                <!-- <template v-slot:[`item.purchase_estimate`] = "{ item }">
                  <td>
                    <v-icon
                      v-if="item.purchase_estimate_phase === '미요청'"
                      color="default"
                      small
                      :disabled="clicked_tr_phase === '진행중' ? false : true"
                      @click="estiamteDialog"
                    >mdi-file</v-icon>
                  </td>
                </template> -->
              </v-data-table>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
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
              {{ n ===  1 ? '관련 자재 선택' : (n ===  2 ? '구매 요청 내역 확인' : '견적 요청')}}
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
                    :headers="purchase_detail_headers"
                    :items="purchase_detail_data.filter(data => data.purchase_estimate_phase !== '완료')"
                    table-class="elevation-0"
                    item-key="id"
                    show-select
                    dense
                  />
                </v-col>
              </v-row>
              <v-btn
                color="primary"
                @click="nextUnestimatedStep(n, 'estimate')"
              >
                다음 ▶
              </v-btn>

              <v-btn text color="error"
              @click="closePurchaseEstiamtedDialog">
                취소
              </v-btn>
            </div>
            <div v-if="n === 2">
              <v-row>
                <v-col cols="12">
                  <PurchaseDetailTableComponent
                    :headers="selected_unestimated_headers"
                    :items="selected_estimate_request_list_data"
                    :other-headers="selected_unestimated_headers"
                    :other-items="check_other_purchase_data"
                    group-by="project_code"
                    @checkOthers="checkOthers"
                    @addList="addList"
                    @subtractList="subtractList"
                    dense
                  >
                  </PurchaseDetailTableComponent>
                  <!-- <v-data-table
                    :headers="selected_unestimated_headers"
                    :items="selected_unestimated_data"
                    group-by="project_code"
                    dense
                  >

                    <template v-slot:[`group.header`]="{items, isOpen, toggle}">
                      <th  @click="toggle" colspan="8">
                        <v-icon
                        >
                          {{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                        </v-icon>
                        {{ items[0].project_code }}
                      </th>
                    </template>
                  </v-data-table> -->
                </v-col>
              </v-row>
              <v-btn
                color="primary"
                @click="nextUnestimatedStep(n, 'estimate')"
              >
                다음 ▶
              </v-btn>

              <v-btn text color="error"
              @click="closePurchaseEstiamtedDialog">
                취소
              </v-btn>
            </div>
            <div v-if="n === 3">
              <v-card class="elevation-0">
                <v-card-text class="pa-0">
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
                        :headers="purchase_detail_headers"
                        :items="selected_estimate_request_list_data"
                        item-key="product_code"
                        dense
                      ></v-data-table>
                    </v-col>
                    <v-col cols="12">
                      <v-radio-group
                        v-model="unestimated_request"
                        row
                      >
                        <v-radio
                          label="메일 발송"
                          value="mailed"
                        ></v-radio>
                        <v-radio
                          label="요청 완료"
                          value="requested"
                        ></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    filled
                    label="견적 요청 업체"
                    v-model="estimate_request_company"
                  />
                </v-col>
              </v-row>
              <v-form
                ref="mailForm"
                v-if="unestimated_request === 'mailed'"
              >
                <MailFormComponent
                  ref="mailFormComponent"
                  v-model="mailData"
                  addCardClass="d-none"
                  addSystemFiles="purchase"
                  :loginInfo="login_info"
                >
                </MailFormComponent>
              </v-form>
              <v-divider v-if="unestimated_request === 'requested'"></v-divider>
              <v-card class="elevation-0">
                <v-card-text>
                  <v-btn
                    color="primary"
                    @click="unestimated_steppers = 2"
                  >
                    ◀ 이전
                  </v-btn>
                  <v-btn
                    color="success"
                    @click="saveEstimateRequest"
                  >
                    {{ unestimated_request === 'mailed' ? '발송' : '저장' }}
                  </v-btn>
                  <v-btn
                    text
                    color="error"
                    @click="closePurchaseEstiamtedDialog"
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
    <v-dialog
      v-model="setEstimateDialog"
      persistent
      max-width="1000px"
    >
      <v-stepper v-model="set_estimate_steppers">
        <v-stepper-header>
          <template v-for="n in set_estimate_step">
            <v-stepper-step
              :key="`${n}-step`"
              :complete="set_estimate_steppers > n"
              :step="n"
              editable
            >
              {{ n ===  1 ? '견적 품목' : '견적 등록' }}
            </v-stepper-step>

            <v-divider
              v-if="n !== set_estimate_step"
              :key="n"
            ></v-divider>
          </template>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content
            v-for="n in set_estimate_step"
            :key="`${n}-content`"
            :step="n"
          >
            <div v-if="n === 1">
              <v-row>
                <v-col cols="12">
                  <PurchaseDetailTableComponent
                    :headers="selected_unestimated_headers.filter(header => header.value !== 'check_others')"
                    :items="selected_estimate_request_list_data"
                    group-by="project_code"
                    dense
                  >
                  </PurchaseDetailTableComponent>
                </v-col>
              </v-row>
              <v-btn
                color="primary"
                @click="nextSetEstimateStep(n)"
              >
                다음 ▶
              </v-btn>

              <v-btn text color="error"
              @click="closePurchaseEstiamtedDialog">
                취소
              </v-btn>
            </div>
            <div v-if="n === 2">
              <CardComponent
                title-class="d-none"
                class="elevation-0"
              >
                <InputsFormComponent
                  slot="cardText"
                  dense
                  clearable
                  filled
                  hide-details
                  :inputs="estimateInfoInputs"
                />
              </CardComponent>

              <v-divider v-if="unestimated_request === 'requested'"></v-divider>
              <v-card class="elevation-0">
                <v-card-text>
                  <v-btn
                    color="primary"
                    @click="set_estimate_steppers = 1"
                  >
                    ◀ 이전
                  </v-btn>
                  <v-btn
                    color="success"
                    @click="saveEstimate"
                  >
                    저장
                  </v-btn>
                  <v-btn
                    text
                    color="error"
                    @click="closePurchaseEstiamtedDialog"
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
          <span>{{ !edit_purchase_estimate ? '업체명AA 견적' : '견적서 수정' }}</span>
          <v-btn
            v-if="!edit_purchase_estimate && check_editable_purchase_estimate"
            color="primary"
            fab
            x-small
            class="ml-3"
            elevation="0"
            :disabled="clicked_tr_phase === '진행중' ? false : true"
            @click="edit_purchase_estimate = true"
          >
            <v-icon
              small
            >mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="edit_purchase_estimate && check_editable_purchase_estimate"
            color="primary"
            fab
            x-small
            class="ml-3"
            elevation="0"
            @click="edit_purchase_estimate = false"
          >
            <v-icon
              small
            >mdi-check</v-icon>
          </v-btn>
          <v-btn
            v-if="edit_purchase_estimate && check_editable_purchase_estimate"
            color="error"
            fab
            x-small
            class="ml-3"
            elevation="0"
            @click="edit_purchase_estimate = false"
          >
            <v-icon
              small
            >mdi-undo-variant</v-icon>
          </v-btn>
        </div>
        <div slot="cardText">
          <v-row v-if="!edit_purchase_estimate">
            <v-col cols="12">
              <div style="width:100%; background-color: #ccc; min-height:300px"></div>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col cols="12">
              <InputsFormComponent
                dense
                clearable
                filled
                hide-details
                :inputs="estimateInfoInputs"
              />
            </v-col>
          </v-row>
        </div>
      </CardComponent>
    </ModalDialogComponent>

    <!-- <ModalDialogComponent
      :dialog-value="orderRequestDialog"
      max-width="90%"
      title-class="display-none"
      text-class="pb-0"
      :persistent="true"
    > -->

    <v-dialog
      v-model="orderRequestDialog"
      content-class="elevation-0 overflow_visible"
      persistent
      max-width="90%"
    >
      <v-row>
        <v-col cols="12" sm="6">
          <v-stepper v-model="order_steppers">
            <v-stepper-header>
              <template v-for="n in order_step">
                <v-stepper-step
                  :key="`${n}-step`"
                  :complete="order_steppers > n"
                  :step="n"
                  editable
                >
                  {{ n ===  1 ? '발주 기본 정보' : '발주 자재 정보'}}
                </v-stepper-step>

                <v-divider
                  v-if="n !== order_step"
                  :key="n"
                ></v-divider>
              </template>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content
                v-for="n in order_step"
                :key="`${n}-content`"
                :step="n"
              >
                <div v-if="n === 1">
                  <v-row class="mb-3">
                    <v-col cols="12">
                      <v-chip
                        class="mr-2"
                        style="cursor:pointer"
                        v-for="(member, i) in purchase_member_info"
                        :key="i"
                        :color="member.name ? 'success' : 'default'"
                        @click="selectMemberDialog(i)"
                      >
                        {{ member.type }} : {{ member.name }}
                      </v-chip>
                    </v-col>
                    <v-col cols="12">
                      <InputsFormComponent
                        slot="cardText"
                        dense
                        clearable
                        filled
                        hide-details
                        :inputs="orderRequestInfoInputs"
                      >
                        <v-col cols="12" sm="4" align-self="center">
                          <v-btn
                            color="primary"
                            @click="nextUnestimatedStep(n, 'order')"
                          >
                            다음 ▶
                          </v-btn>

                          <v-btn
                            text
                            color="error"
                            @click="orderRequestDialog = false"
                          >
                            취소
                          </v-btn>
                        </v-col>
                      </InputsFormComponent>
                    </v-col>
                  </v-row>
                </div>
                <div v-if="n === 2">
                  <v-row>
                    <v-col cols="12">
                      <orderPurchaseComponent
                        ref="orderPurchaseComponent"
                      />
                      <v-data-table
                        :headers="order_request_headers"
                        :items="order_request_data"
                        item-key="product_code"
                        dense
                      >
                        <template v-slot:item="{ item }">
                          <tr>
                            <td>
                              <!-- <v-icon
                                color="error"
                                class="mr-2"
                                x-small
                                style="background: #ffedb4; border-radius: 50px; padding: 4px; cursor: pointer;"
                              >
                                mdi-exclamation-thick
                              </v-icon> -->
                              {{ item.product_code }}
                            </td>
                            <td>
                              <v-text-field
                                v-model="item.name"
                                filled
                                dense
                                hide-details
                                style="font-size: 13px;"
                              ></v-text-field>
                            </td>
                            <td>
                              <v-text-field
                                v-model="item.spec"
                                filled
                                dense
                                hide-details
                                style="font-size: 13px;"
                              ></v-text-field>
                            </td>
                            <td>
                              <v-text-field
                                v-model="item.unit_price"
                                filled
                                dense
                                hide-details
                                style="font-size: 13px;"
                              ></v-text-field>
                            </td>
                            <!-- <td>
                              <v-text-field
                                v-model="item.purchase_num"
                                filled
                                dense
                                hide-details
                                style="font-size: 13px;"
                              ></v-text-field>
                            </td> -->
                            <td>{{ item.purchase_num }}</td>
                            <td>{{ item.purchase_num * item.unit_price }}</td>
                            <td>{{ (item.purchase_num * item.unit_price)*0.1 }}</td>
                            <td>
                              <v-text-field
                                v-model="item.note"
                                filled
                                dense
                                hide-details
                                style="font-size: 13px;"
                              ></v-text-field>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                  <v-card class="elevation-0">
                    <v-card-text>
                      <v-btn
                        color="primary"
                        @click="orderRequestDialog = false"
                      >
                        요청
                      </v-btn>
                      <v-btn
                        text
                        color="error"
                        @click="orderRequestDialog = false"
                      >
                        취소
                      </v-btn>

                    </v-card-text>
                  </v-card>
                </div>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-col>
        <v-col cols="12" sm="6">
          <!-- mux iframesrc 반영 -->
          <iframe width="100%" style="height: 100%;" src="/forms/테스트용.pdf#toolbar=0&navpanes=0&scrollbar=0"></iframe>
        </v-col>
      </v-row>
    </v-dialog>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import DataTableComponent from "@/components/DataTableComponent";
import PurchaseDataTableComponent from "@/components/PurchaseDataTableComponent";
import PurchaseDetailTableComponent from "@/components/PurchaseDetailTableComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import LoadingModalComponent from "@/components/LoadingModalComponent.vue";
import MailFormComponent from "@/components/MailFormComponent.vue";
import orderPurchaseComponent from "@/components/orderPurchaseComponent.vue";
import PurchaseSearchPageConfig from "@/configure/PurchaseSearchPageConfig.json";
import CheckPagePermission from "@/common_js/CheckPagePermission";
import mux from "@/mux";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=PurchaseSearchPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  components: {
                NavComponent,
                DataTableComponent,
                PurchaseDataTableComponent,
                PurchaseDetailTableComponent,
                ModalDialogComponent,
                CardComponent,
                InputsFormComponent,
                LoadingModalComponent,
                MailFormComponent,
                orderPurchaseComponent,
              },
  data(){
    return{
      mux: mux,
      dates: [],
      unestimated_steppers: 1,
      unestimated_step: 3,
      set_estimate_steppers: 1,
      set_estimate_step: 2,
      order_steppers: 1,
      order_step: 2,
      tab_search: null,
      unestimated_request:'mailed',
      clicked_tr_phase: '',
      show_request_estimate_button: false,
      orderRequestDialog: false,
      purchase_detail_dialog: false,
      loading_dialog: false,
      unestimatedMailDialog: false,
      setEstimateDialog: false,
      estimatedDialog: false,
      show_selected_unestimated_data: false,
      edit_purchase_estimate: false,
      check_editable_purchase_estimate: false,
      receivingInspectionThumbnail: '',
      inspectionReportThumbnail: '',
      email_sign:'',
      estimate_request_company: '',

      inbound_info_data:{},

      change_approve:{},

      searched_products:[],
      selected_unestimated_data:[],
      selected_estimate_request_list_data:[],

      order_request_data:[],
      search_other_purchase_data:[],
      check_other_purchase_data:[],

      defaultMailData: PurchaseSearchPageConfig.default_mail_data,
      search_tab_items: PurchaseSearchPageConfig.search_tab_items,
      purchase_member_info:PurchaseSearchPageConfig.purchase_member_info,
      login_info: PurchaseSearchPageConfig.login_info,
      searchCardInputs:PurchaseSearchPageConfig.searchCardInputs,
      estimateInfoInputs:PurchaseSearchPageConfig.estimateInfoInputs,
      orderRequestInfoInputs:PurchaseSearchPageConfig.orderRequestInfoInputs,
      setPurchaseInputs:PurchaseSearchPageConfig.setPurchaseInputs,
      purchase_headers:PurchaseSearchPageConfig.purchase_headers,
      purchase_detail_headers:PurchaseSearchPageConfig.purchase_detail_headers,
      other_obtain_headers:PurchaseSearchPageConfig.other_obtain_headers,
      other_purchase_headers:PurchaseSearchPageConfig.other_purchase_headers,
      selected_unestimated_headers:PurchaseSearchPageConfig.selected_unestimated_headers,
      purchase_order_headers:PurchaseSearchPageConfig.purchase_order_headers,
      order_request_headers:PurchaseSearchPageConfig.order_request_headers,
      bom_list_headers: PurchaseSearchPageConfig.bom_list_headers,
      bom_list_purchase_headers: PurchaseSearchPageConfig.bom_list_purchase_headers,
      bom_list_data: PurchaseSearchPageConfig.bom_list_test_data,
      bom_list_purchase_data: PurchaseSearchPageConfig.bom_list_purchase_test_data,
      purchase_data:[],
      purchase_detail_data:[],
      other_obtain_data:[]
    }
  },

  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  },
  watch:{
    purchase_detail_dialog(val){
      val || this.closeProductList()
      this.mailData = JSON.parse(JSON.stringify(this.defaultMailData));
    },
    unestimated_step(val){
      if (this.unestimated_steppers > val) {
        this.unestimated_steppers = val
      }
    },
    set_estimate_step(val){
      if (this.set_estimate_steppers > val) {
        this.set_estimate_steppers = val
      }
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
        // console.log('사용자 계정 정보 가졍오기');
        // let result = await mux.Server.get({
        //   path: '/api/user/',
        // });
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
      this.estimateInfoInputs = JSON.parse(JSON.stringify(this.estimateInfoInputs));
      this.estimateInfoInpuorderRequestInfoInputsts = JSON.parse(JSON.stringify(this.orderRequestInfoInputs));
      this.email_sign =`<div><p style="color:#255fab; border-bottom:1px solid #255fab; border-top:1px solid #255fab;padding:15px 0px;"><strong>${this.login_info.name} 파이온 일렉트릭㈜ ${this.login_info.department} ${this.login_info.position} / Pion Electric Co., Ltd. </strong></p><p style="border-bottom:1px solid #333333;padding-bottom:20px; font-size:14px;">Home page : www.pionelectric.com<br>E-mail: ${this.login_info.email}  C/P: ${'+82(0)' + this.login_info.phone_number.slice(1)}<br> Tel: ${'+82(0)' + this.login_info.office_phone_number.slice(1)} Fax: +82(0)505-300-4179<br><br> 본사: (03722) 서울특별시 서대문구 연세로 50 연세대학교 공학원 116호<br> Head office: #116, Engineering Research Park, Yonsei University, 50, Yonsei-ro, Seodaemun-gu, Seoul, 03722, Republic of KOREA<br><br> 광명 사무소: (14348) 경기도 광명시 일직로 72  A-1818호<br> Gwangmyeong office: #A-1818, 72, Iljik-ro, Gwangmyeong-si, Gyeonggi-do, Republic of KOREA 14348<br><br> 광주 공장: (47580) 광주광역시 광산구 연산동 1247<br> Gwangju factory: 1247 Yeonsan-dong, Gwangsan-gu, Gwangju, Republic of KOREA 47580<br><br> 보령 공장: (33448) 충청남도 보령시 주교면 관창공단길 266<br> Boryeong factory: 266, Gwanchanggongdan-gil, Jugyo-myeon, Boryeong-si, Chungcheongnam-do, Republic of KOREA 33448<br><br></p> <p style="border-bottom:1px solid #333333;padding-bottom:20px; font-size:14px;"><strong>제품 및 서비스</strong><br> ∙ 고자기장 기반의 산업용 운용기기 (Development of Operating Device for Industrial Applications based on High Magnetic Field)<br> ∙ 광기기 기반의 전력전자 응용기기 (Development of Power Electronics Application Device based on Optical Device)<br> ∙ 신재생 에너지 개발 및 운영 (Development and Operation of Renewable Energy System)<br> ∙ 전력계통 진단 및 해석 (Power System Diagnosis and Analysis)<br> ∙ 전기공사면허</p> </div>`
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

    nextUnestimatedStep (step, type) {
      if(type === 'estimate'){
        if(step === 1 && this.selected_unestimated_data.length === 0){
          mux.Util.showAlert('견적을 요청할 자재를 선택해주세요.');
          return;
        }else if(step === 1 && this.selected_unestimated_data.length !== 0){
          //선택한 자재가 다른 구매요청에 있는지 확인 (발주요청하지 않은 데이터만)
          let searched_data = PurchaseSearchPageConfig.test_purchase_data;
          this.selected_unestimated_data.forEach(item => {
            for(let i=0; i<searched_data.length; i++){
              let data = searched_data[i];
              for(let j=0; j<data.belong_data.length; j++){
                let belong = data.belong_data[j];
                if(belong.item_code === item.item_code && belong.project_code !== item.project_code){
                  item.exclamation = true
                }
              }
            }
            // item.exclamation = true
          });
          this.search_other_purchase_data = searched_data
          this.selected_estimate_request_list_data = this.selected_unestimated_data


        }
        this.unestimated_steppers = step + 1
      }
      else{
        this.order_steppers = step + 1
      }
    },

    nextSetEstimateStep (step) {
      this.set_estimate_steppers = step + 1
    },

    checkOthers(item, project_code){
      this.check_other_purchase_data = [];
      let searched_others = this.search_other_purchase_data;

      searched_others.forEach(searched => {
        if(project_code !== searched.project_code){
          for(let i=0; i<searched.belong_data.length; i++){
            let belong = searched.belong_data[i];
            if(belong.item_code === item.item_code){
              belong.project_code = searched.project_code;
              belong.product_code = searched.product_code;
              this.check_other_purchase_data.push(belong);
            }
          }
        }
      });
    },
    addList(item, project_code){
      let selected_project_codes = [];
      for(let i=0; i<this.selected_estimate_request_list_data.length; i++){
        let data = this.selected_estimate_request_list_data[i];
        selected_project_codes.push(data.project_code);
      }

      selected_project_codes = [...new Set(selected_project_codes)];
      if (selected_project_codes.includes(project_code)) {
        mux.Util.showAlert('이미 추가된 프로젝트입니다.');
        return;
      } else {
        this.selected_estimate_request_list_data.push(...item);
      }
    },
    subtractList(project_code){
      console.log(project_code);
      let filtered = this.selected_estimate_request_list_data.filter(data => data.project_code !== project_code);
      this.selected_estimate_request_list_data = filtered
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


    async searchButton(){
      this.loading_dialog = true;
      this.purchase_data = PurchaseSearchPageConfig.test_purchase_data
      for(let i=0; i<this.purchase_data.length; i++){
        let check_unestimated = 0;
        let check_unordered = 0;
        let data = this.purchase_data[i];
        data.belong_data.forEach(belongs => {
          if(belongs.purchase_estimate_phase === '미요청'){
            belongs.purchase_estimate_company = '*견적서 미요청';
          }
          if(belongs.purchase_estimate_phase !== '완료'){
            check_unestimated++;
          }
          if(belongs.ordered_date === ''){
            check_unordered++;
          }
        });
        if(check_unestimated === 0)
          data.purchase_estimate = '완료'
        else
          data.purchase_estimate = check_unestimated + '건 미완료';

        if(check_unordered === 0)
          data.order_situation = '완료'
        else
          data.order_situation = check_unordered + '건 미발주';
      }
      this.loading_dialog = false;
    },
    closeProductList(){
      this.purchase_detail_dialog = false;
    },
    closePurchaseEstiamtedDialog(){
      this.unestimatedMailDialog = false;
      this.unestimated_steppers = 1;
      this.setEstimateDialog = false;
      this.set_estimate_steppers = 1;
      this.selected_unestimated_data =[];
    },
    orderRequest(item){
      this.order_request_data = item
      this.orderRequestDialog = true;
    },
    async clickApproveData(item){
      this.clicked_tr_phase = item.approval_phase;
      this.purchase_detail_data = item.belong_data;
      this.purchase_detail_data.forEach(data =>{
        data.project_code = item.project_code;
      })
      let unestimated = 0;
      for(let i=0; i<item.belong_data.length; i++){
        if(item.belong_data[i].purchase_estimate !== '완료'){
          unestimated++;
        }
      }
      if(unestimated === 0){
        this.show_request_estimate_button = false;
      }else{
        this.show_request_estimate_button = true;
      }
      this.purchase_detail_dialog = true;
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
    // async setApprovalPhase(item, change, reason){
    async setApprovalPhase(item){
      console.log(item);
      const currDate = new Date();
      const prevURL = window.location.href;
      let phase;
      let send_data = {};

      send_data.approved_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
      send_data.approval_phase = '진행중';
      phase = '진행';

      console.log(phase);

      let sendData = {};

      sendData["purchase_confirmation_table-update"] = [{
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
        let resultInbound = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: sendData
        });
        if (prevURL !== window.location.href) return;

        if (typeof resultInbound === 'string'){
          resultInbound = JSON.parse(resultInbound);
        }
        if(resultInbound['code'] == 0){
          item.approval_phase = send_data.approval_phase;
          item.approved_date = send_data.approved_date;
          this.loading_dialog = false;
          mux.Util.showAlert('구매 요청 확인 완료', '완료', 3000);

          //메일 알림 관련
          let creater = this.$cookies.get(this.$configJson.cookies.id.key);
          let mailTo = [creater];
          // mailTo.push(creater);

          // 메일 본문 내용
          let content=`
                <html>
                  <body>
                    <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                      <h2 style="text-align: center; color:#13428a">구매 요청 건 진행 알림</h2>
                      <table style="width: 100%;border-spacing: 10px 10px;">
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.project_code === '' ? '-' : item.project_code}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">비고</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.note === '' ? '-' : item.note}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.$cookies.get(this.$configJson.cookies.name.key).trim()}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">구매담당자</td>
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
              subject: "구매 요청 건 진행 알림",
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
          mux.Util.showAlert(resultInbound['failed_info']);
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
    async changePurchaseEstimatePhase(){
      // 견적 상태 변경
      const prevURL = window.location.href;
      const currDate = new Date();
      let sendData = {};
      let update_data = [];

      this.selected_unestimated_data.forEach(data => {
        update_data.push({
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "modifier"
          },
          "data":{
            "purchase_estimate_phase": "요청",
            "purchase_estimate_company": this.estimate_request_company,
            "purchase_estimate_code": this.estimate_request_company + '/' + mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss.fff') + '/' + this.$cookies.get(this.$configJson.cookies.id.key),
          },
          "update_where": {"id": data.id },
          "rollback": "yes"
        });
      });


      sendData["purchase_product_table-update"] = update_data;

      try {
        // selected_unestimated_data
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: sendData
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0){
          // console.log('result :>> ', result);
          mux.Util.showAlert(this.unestimated_request === 'mailed' ? '견적 요청 메일이 발송되었습니다' : '미요청에서 요청으로 변경되었습니다.', '완료', 3000);
          mux.Util.hideLoading();
          this.closePurchaseEstiamtedDialog();
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
    },

    async saveEstimateRequest(){

      if(this.estimate_request_company === ''){
        mux.Util.showAlert('견적 요청 업체를 입력해주세요.');
        return;
      }

      mux.Util.showLoading();
      if(this.unestimated_request === 'mailed'){
        await this.$refs.mailFormComponent[0].dispatchEnterKeyToAllCombobox();
        const validate = this.$refs.mailForm[0].validate();
        if (!validate) return;

        let mail_data = JSON.parse(JSON.stringify(this.mailData));
        mail_data.content += this.email_sign
        let sendMailData = {};
        for (let key in mail_data) {
          if(key === 'content'){
            sendMailData[key] = '<html><body>' + mail_data.content  + '</body></html>';
          }else{
            sendMailData[key] = mail_data[key];
          }
        }
        sendMailData.path = '/api/send_email_extention/';
        sendMailData.files = [];
        for (let i = 0; i < this.mailData.files.length; i++) {
          const file = this.mailData.files[i];
          sendMailData.files.push(file);
        }
        try {
          await mux.Server.sendEmail(sendMailData);
          this.changePurchaseEstimatePhase();
        } catch (error) {
          mux.Util.showAlert(error);
        }
      }else{
        this.changePurchaseEstimatePhase();
      }
    },
    async saveEstimate(){
      const currDate = new Date();
      const prevURL = window.location.href;

      for(let i=0; i<this.estimateInfoInputs.length; i++){
        let input = this.estimateInfoInputs[i];
        if(input.value === ''|| input.value === null  || !input.value){
          mux.Util.showAlert(input.label + '를 입력해주세요.');
          return;
        }
      }
      mux.Util.showLoading();

      let estimate_company = this.estimateInfoInputs.find(x=>x.label === '견적 확정 업체').value;
      let estimate_file_value = this.estimateInfoInputs.find(x=>x.label === '견적서 첨부').value;
      let estimate_file_name = estimate_file_value.name;
      const getPdfThumbnail = await mux.Util.getPdfThumbnail(estimate_file_value, 1, false);
      let estimate_file_thumbnail = mux.Util.uint8ArrayToHexString(getPdfThumbnail);

      let estimate_code = this.selected_estimate_request_list_data[0].purchase_estimate_code;

      let sendData = {};

      sendData["purchase_product_table-update"] = [{
        "user_info": {
          "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
          "role": "modifier"
        },
        "data":{
          "purchase_estimate_phase": "완료",
          "purchase_estimate_company": estimate_company,
          "purchase_estimate_code": estimate_company + '/' + mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss.fff') + '/' + this.$cookies.get(this.$configJson.cookies.id.key),
          "purchase_estimate_file": estimate_file_name,
          "purchase_estimate_thumbnail": estimate_file_thumbnail
        },
        "update_where": {"purchase_estimate_code": estimate_code},
        "rollback": "yes"
      }];
      console.log("sendData ::: ", sendData);
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
          // console.log('result :>> ', result);
          mux.Util.showAlert('견적서가 등록되었습니다.', '완료', 3000);
          this.closePurchaseEstiamtedDialog();
          mux.Util.hideLoading();
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


    },
    estiamteDialog(type, order, item){
      this.selected_estimate_request_list_data = [];
      if(this.tab_search === 0){
        this.unestimatedMailDialog = true;
        this.purchase_detail_data.forEach(data => {
          data.exclamation = false;
        });
      }
      else{
        if(type === 'added_estimate'){
          this.estimatedDialog = true;
          if(order !== ""){
            this.check_editable_purchase_estimate = false;
          }else{
            this.check_editable_purchase_estimate = true;
          }
        }else{
          this.setEstimateDialog = true;
          // this.selected_estimate_request_list_data = item;

          //동일한 purchase_estimate_code를 가진 데이터 불러오기
          let searched_data = PurchaseSearchPageConfig.test_purchase_data;
          for(let i=0; i<searched_data.length; i++){
            let data = searched_data[i];
            for(let j=0; j<data.belong_data.length; j++){
              let belong = data.belong_data[j];
              belong.project_code = data.project_code;
              belong.product_code = data.product_code;
              if(belong.purchase_estimate_code === item[0].purchase_estimate_code){
                this.selected_estimate_request_list_data.push(belong);
              }
            }
          }
          this.estimateInfoInputs.find(x=>x.label === '견적 확정 업체').value = item[0].purchase_estimate_company;
          console.log(item)
        }
      }
    },
  },
}
</script>

<style>

</style>


