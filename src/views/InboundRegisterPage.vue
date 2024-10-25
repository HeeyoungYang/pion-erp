<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productMenu="true" :inboundMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <LoadingModalComponent :dialog-value="loading_dialog" hide-overlay></LoadingModalComponent>

      <v-row justify="center">
        <v-col
          cols="12"
          sm="11"
        >
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
              <CardComponent
                elevation="1"
                text-class=" pt-3"
                title-class="text-body-1"
              >
                <!-- <div slot="cardTitle">※ 구매 내역 입고 탭은 개발중입니다.</div> -->
                <InputsFormComponent
                  slot="cardText"
                  dense
                  clearable
                  filled
                  hide-details
                  :inputs="searchOrderCardInputs"
                  @enter="searchOrder"
                >
                  <v-col
                    cols="12"
                    sm="4"
                    lg="3"
                    align-self="center"
                  >
                    <v-btn
                      color="primary"
                      class="mr-2"
                      elevation="2"
                      @click="searchOrder"
                    >
                      <v-icon>mdi-magnify</v-icon>검색
                    </v-btn>
                    <v-btn
                      color="default"
                      elevation="2"
                      @click="addItems"
                    >추가</v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-data-table
                      class="elevation-1"
                      dense
                      v-model="selected_order_data"
                      :headers="pricePermission ? order_search_headers : order_search_headers.filter(x => x.value !== 'unit_price')"
                      :items="order_search_data"
                      item-key="id"
                      show-select
                      />
                  </v-col>
                </InputsFormComponent>
              </CardComponent>

              <CardComponent
                elevation="1"
                card-class="mt-5"
                text-class=" pt-3"
                title-class="mb-0 font-weight-black"
                divider-class="mb-3"
              >
                <div slot="cardTitle">
                  입고 정보 입력
                </div>
                <div slot="cardText">

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
                    v-for="(member, i) in inbound_member_info"
                    :key="i"
                    :color="member.name ? 'success' : 'default'"
                    @click="selectMemberDialog(i)"
                  >
                    {{ member.type }} : {{ member.name }}
                  </v-chip>
                  <v-form ref="inboundForm">
                    <InputsFormComponent
                      dense
                      clearable
                      filled
                      hide-details
                      :inputs="inboundOrderedCardInfoInputs"
                      @dateChanged = "dateChangedImport"
                    >
                      <v-col cols="12" sm="4" lg="2" align-self="center">
                        <v-radio-group
                          dense
                          hide-details
                          class="mt-0"
                          v-model="something_wrong_radio"
                          row
                        >
                          <v-radio
                            label="이상 없음"
                            value="이상 없음"
                            @click="something_wrong = false"
                          ></v-radio>
                          <v-radio
                            label="이상 있음"
                            value="이상 있음"
                            class="mr-0"
                            @click="something_wrong = true"
                          ></v-radio>
                        </v-radio-group>
                      </v-col>
                      <v-col cols="12" sm="4" lg="4" v-if="something_wrong">
                        <v-text-field
                          dense
                          hide-details
                          filled
                          label="사유"
                          v-model="something_wrong_reason"
                          :rules="[v => !!v || '사유 입력']"
                        ></v-text-field>
                      </v-col>
                    </InputsFormComponent>
                  </v-form>
                  <v-divider class="my-5"></v-divider>
                  <v-row>
                    <v-col cols="12" sm="2" lg="2" align-self="center">
                      <v-autocomplete
                        v-model="set_spot_selected"
                        :items="spot_list"
                        label="위치"
                        dense
                        clearable
                        hide-details
                        style="width:200px"
                        v-if="product_inbound_data.length > 0"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" lg="6" align-self="center">
                      <v-btn
                        small
                        color="primary"
                        class="mr-2"
                        @click="setSpotAtOnce"
                        v-if="product_inbound_data.length > 0"
                      >
                        일괄 적용
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="4" lg="4" align-self="center">
                      <v-btn
                        small
                        color="success"
                        class=" float-right"
                        @click="inboundApprovalRequest"
                      >
                        입고 승인 요청
                      </v-btn>
                    </v-col>
                    <v-col
                      cols="12"
                    >
                      <v-data-table
                        dense
                        :headers="pricePermission ? ordered_inbound_headers : ordered_inbound_headers.filter(x => x.value !== 'unit_price')"
                        :items="product_inbound_data"
                        hide-default-footer
                        disable-pagination
                        item-key="id"
                        class="elevation-1"
                      >
                        <template v-slot:item="{ item, index }">
                          <tr>
                            <td align="center">{{ item.order_code }}</td>
                            <td align="center">{{ item.project_code }}</td>
                            <td align="center">{{ item.type }}</td>
                            <td align="center">{{ item.classification }}</td>
                            <td align="left"
                              v-if="item.item_code.includes('임시코드')"
                            >
                              <v-radio-group
                                v-if="item.type === '반제품'"
                                v-model="item.code_type"
                                hide-details
                                row
                                style="width: 220px;"
                              >
                                <v-radio
                                  label="분류형"
                                  value="with_type"
                                ></v-radio>
                                <v-radio
                                  label="모델형"
                                  value="with_model"
                                ></v-radio>
                              </v-radio-group>
                              <p>[ {{ item.item_code }} ] {{ item.new_item_code }}</p>
                            </td>
                            <td align="center"
                              v-else
                            >{{ item.item_code }}</td>
                            <td align="center">{{ item.name }}</td>
                            <td align="center">{{ item.inbound_num }}</td>
                            <td
                              align="center"
                            >
                              <v-autocomplete
                                v-model="item.spot"
                                :items="spot_list"
                                dense
                                filled
                                hide-details
                                style="width:150px"
                              ></v-autocomplete>
                            </td>
                            <td align="center">
                              <v-text-field
                                dense
                                hide-details
                                filled
                                style="width:150px"
                                v-model="item.spec"
                              >
                              </v-text-field>
                              발주 사양 : {{ item.order_spec }}
                            </td>
                            <td align="center"
                              v-if="item.item_code.includes('임시코드')"
                            >
                              <v-text-field
                                  dense
                                  hide-details
                                  filled
                                  style="width:150px"
                                  v-model="item.model"
                                >
                                </v-text-field>
                            </td>
                            <td align="center" v-else>{{  item.model }}</td>
                            <td align="center">
                              <v-autocomplete
                                v-model="item.manufacturer"
                                :items="manufacturer_list"
                                dense
                                hide-details
                                filled
                                style="width:150px"
                              ></v-autocomplete>
                              발주업체 : {{ item.company_name }}
                            </td>
                            <td v-if="pricePermission" align="center">{{  item.unit_price }}</td>
                            <td align="center">
                              <v-icon small color="default" style="cursor:pointer" @click="deleteInboundDataRow(index)">mdi-minus-thick</v-icon>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </div>
              </CardComponent>

            </v-tab-item>
            <v-tab-item>
              <CardComponent
                elevation="1"
                text-class=" pt-3"
                title-class="mb-0 font-weight-black"
                divider-class="mb-3"
                v-if="add_self === '자재선택'"
              >
                <div slot="cardTitle">
                  <span>자재 선택</span>
                  <v-btn
                    small
                    outlined
                    color="primary"
                    class="mr-2 ml-4"
                    @click="addProductInboundData"
                  >
                    직접 입력형 전환
                  </v-btn>
                  <v-btn
                    small
                    outlined
                    color="primary"
                    @click="restockData"
                  >
                    재입고
                  </v-btn>
                </div>
                <InputsFormComponent
                  slot="cardText"
                  dense
                  clearable
                  filled
                  hide-details
                  :inputs="searchCardInputs"
                  @enter="searchProduct"
                  v-if="select_product"
                >
                  <v-col
                    cols="12"
                    sm="4"
                    lg="3"
                    align-self="center"
                  >
                    <v-btn
                      color="primary"
                      class="mr-2"
                      elevation="2"
                      @click="searchProduct"
                    >
                      <v-icon>mdi-magnify</v-icon>검색
                    </v-btn>
                    <v-btn
                      color="default"
                      elevation="2"
                      @click="addItems"
                    >추가</v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-data-table
                      class="elevation-1"
                      dense
                      v-model="selected_product_data"
                      :headers="pricePermission ? product_search_headers : product_search_headers.filter(x => x.value !== 'unit_price')"
                      :items="product_search_data"
                      item-key="_code"
                      show-select
                      />
                  </v-col>
                </InputsFormComponent>
              </CardComponent>


              <CardComponent
                elevation="1"
                text-class=" pt-3"
                title-class="mb-0 font-weight-black"
                divider-class="mb-3"
                v-if="add_self === '재입고'"
              >
                <div slot="cardTitle">
                  <span>출고 승인 내역 선택</span>
                  <v-btn
                    small
                    outlined
                    class="mr-2 ml-4"
                    color="error"
                    @click="restockDataCancle"
                  >
                    재입고 취소
                  </v-btn>
                </div>
                <InputsFormComponent
                  slot="cardText"
                  dense
                  clearable
                  filled
                  hide-details
                  :inputs="searchShipCardInputs"
                  @enter="searchShipData"
                >
                  <v-col
                    cols="12"
                    sm="4"
                    lg="3"
                    align-self="center"
                  >
                    <v-btn
                      color="primary"
                      class="mr-2"
                      elevation="2"
                      @click="searchShipData"
                    >
                      <v-icon>mdi-magnify</v-icon>검색
                    </v-btn>
                    <v-btn
                      color="default"
                      elevation="2"
                      @click="addItems"
                    >추가</v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-data-table
                      class="elevation-1"
                      dense
                      v-model="selected_ship_data"
                      :headers="ship_search_headers"
                      :items="ship_search_data"
                      item-key="table_code"
                      show-select
                      />
                  </v-col>
                </InputsFormComponent>
              </CardComponent>


              <CardComponent
                elevation="1"
                card-class="mt-5"
                text-class=" pt-3"
                title-class="mb-0 font-weight-black"
                divider-class="mb-3"
              >
                <div slot="cardTitle">
                  입고 정보 입력
                </div>
                <div slot="cardText">

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
                    v-for="(member, i) in inbound_member_info"
                    :key="i"
                    :color="member.name ? 'success' : 'default'"
                    @click="selectMemberDialog(i)"
                  >
                    {{ member.type }} : {{ member.name }}
                  </v-chip>
                  <v-form ref="inboundForm">
                    <InputsFormComponent
                      dense
                      clearable
                      filled
                      hide-details
                      :inputs="add_self === '재입고' ? restockCardInfoInputs : inboundCardInfoInputs"
                      @dateChanged = "dateChangedImport"
                    >
                      <v-col cols="12" sm="4" lg="2" align-self="center" v-if="add_self !== '재입고'">
                        <v-radio-group
                          dense
                          hide-details
                          class="mt-0"
                          v-model="something_wrong_radio"
                          row
                        >
                          <v-radio
                            label="이상 없음"
                            value="이상 없음"
                            @click="something_wrong = false"
                          ></v-radio>
                          <v-radio
                            label="이상 있음"
                            value="이상 있음"
                            class="mr-0"
                            @click="something_wrong = true"
                          ></v-radio>
                        </v-radio-group>
                      </v-col>
                      <v-col cols="12" sm="4" lg="4" v-if="something_wrong">
                        <v-text-field
                          dense
                          hide-details
                          filled
                          label="사유"
                          v-model="something_wrong_reason"
                          :rules="[v => !!v || '사유 입력']"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="1" v-if="add_self==='재입고'" align-self="center">
                        <v-btn
                          small
                          color="success"
                          class=" float-right"
                          @click="restockApprovalRequest"
                        >
                          재입고 승인 요청
                        </v-btn>
                      </v-col>
                    </InputsFormComponent>
                  </v-form>
                  <v-divider class="my-5"></v-divider>
                  <v-row>
                    <v-col cols="12" sm="2" lg="2" align-self="center">
                      <v-autocomplete
                        v-model="set_spot_selected"
                        :items="spot_list"
                        label="위치"
                        dense
                        clearable
                        hide-details
                        style="width:200px"
                        v-if="product_inbound_data.length > 0 && add_self !== '재입고'"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" lg="6" align-self="center">
                      <v-btn
                        small
                        color="primary"
                        class="mr-2"
                        @click="setSpotAtOnce"
                        v-if="product_inbound_data.length > 0 && add_self !== '재입고'"
                      >
                        일괄 적용
                      </v-btn>
                      <v-btn
                        small
                        color="default"
                        class="mr-2"
                        @click="addProductInboundData"
                        v-if="add_self === '직접기입'"
                      >
                        행 추가
                      </v-btn>

                    </v-col>
                    <v-col cols="12" sm="4" lg="4" align-self="center"
                        v-if="add_self !== '재입고'"
                    >
                      <v-btn
                        small
                        color="success"
                        class=" float-right"
                        @click="inboundApprovalRequest"
                      >
                        입고 승인 요청
                      </v-btn>
                      <v-btn
                        v-if="add_self === '직접기입'"
                        small
                        color="error"
                        class="mr-2 float-right"
                        @click="addProductInboundDataCancle"
                      >
                        직접 입력형 취소
                      </v-btn>
                    </v-col>
                    <v-col
                      cols="12"
                    >
                      <v-data-table
                        dense
                        :headers="pricePermission || add_self === '직접기입' ? product_inbound_headers : product_inbound_headers.filter(x => x.value !== 'unit_price')"
                        :items="product_inbound_data"
                        hide-default-footer
                        disable-pagination
                        item-key="_code"
                        class="elevation-1"
                      >
                        <template v-slot:item="{ item, index }">
                          <tr v-if="add_self === '자재선택' || add_self === '재입고'">
                            <td align="center">{{ item.type }}</td>
                            <td align="center">{{ item.classification }}</td>
                            <td align="center">{{ item._code }}</td>
                            <td align="center">{{ item.name }}</td>
                            <td align="center">
                              <v-text-field
                                dense
                                hide-details
                                filled
                                style="max-width:150px"
                                v-model="item.inbound_num"
                                :oninput="!item.inbound_num ? '' : item.inbound_num = item.inbound_num.replace(/^0+|\D+/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')"
                              >
                              </v-text-field>
                              <p class="my-2" v-if="add_self === '재입고'"> 출고수량 : {{ item.ship_num }}</p>
                            </td>
                            <td
                              align="center"
                              v-if="add_self === '자재선택'"
                            >
                              <v-autocomplete
                                v-model="item.spot"
                                :items="spot_list"
                                dense
                                filled
                                hide-details
                                style="width:150px"
                              ></v-autocomplete>
                            </td>
                            <td align="center" v-if="add_self === '재입고'">{{  item.spot  }}</td>
                            <td align="center">{{  item.spec  }}</td>
                            <td align="center">{{  item.model }}</td>
                            <td align="center">{{  item.manufacturer }}</td>
                            <td v-if="pricePermission" align="center">{{  item.unit_price }}</td>
                            <td align="center" style="min-width: 160px;">
                              <v-checkbox
                                v-if="item.type !== '원부자재'"
                                label="미선택"
                                color="primary"
                                hide-details
                                class="float-left mr-3 mt-0"
                                v-model="item.dont_select_ship"
                                @click="clickDontSelectShip(index)"
                              ></v-checkbox>
                              <v-btn
                                v-if="item.type !== '원부자재'"
                                color="primary"
                                class="float-left"
                                fab
                                x-small
                                elevation="0"
                                @click="selectShipData(item, index)"
                              >
                                <v-icon style="cursor:pointer">mdi-magnify</v-icon>
                              </v-btn>

                            </td>
                            <td align="center">
                              <v-icon small color="default" style="cursor:pointer" @click="deleteInboundDataRow(index)">mdi-minus-thick</v-icon>
                            </td>
                          </tr>
                          <tr v-else-if="add_self === '직접기입'">
                            <td align="center">
                              <v-autocomplete
                                v-model="item.type"
                                :items="type_list"
                                dense
                                filled
                                hide-details
                                style="width:150px"
                                @change="changeType(item)"
                              ></v-autocomplete>
                            </td>
                            <td align="center">
                              <v-autocomplete
                                v-model="item.classification"
                                :items="classification_list.slice(1)"
                                dense
                                filled
                                hide-details
                                style="width:150px"
                                :disabled="item.type === '' ? true : false"
                                @change="setCode(item)"
                              ></v-autocomplete>
                            </td>
                            <td align="center">
                              <v-radio-group
                                v-if="item.type === '반제품'"
                                v-model="item.code_type"
                                hide-details
                                row
                                @change="setCode(item)"
                              >
                                <v-radio
                                  label="분류형"
                                  value="with_type"
                                ></v-radio>
                                <v-radio
                                  label="모델형"
                                  value="with_model"
                                ></v-radio>
                              </v-radio-group>
                              <v-text-field
                                dense
                                hide-details
                                v-model="item._code"
                                style="width:200px"
                                disabled
                              >
                              </v-text-field>
                            </td>
                            <td align="center">
                              <v-text-field
                                dense
                                hide-details
                                filled
                                v-model="item.name"
                                style="width:150px"
                                :disabled="item.type === '' ? true : false"
                              >
                              </v-text-field>
                            </td>
                            <td align="center">
                              <v-text-field
                                dense
                                hide-details
                                filled
                                v-model="item.inbound_num"
                                style="width:150px"
                                :disabled="item.type === '' ? true : false"
                                @keyup="calcUnitPrice(item)"
                                :oninput="!item.inbound_num ? '' : item.inbound_num = item.inbound_num.replace(/^0+|\D+/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')"
                              >

                              </v-text-field>
                            </td>
                            <td align="center">
                              <v-autocomplete
                                v-model="item.spot"
                                :items="spot_list"
                                dense
                                filled
                                :disabled="item.type === '' ? true : false"
                                hide-details
                                style="width:150px"
                              ></v-autocomplete>
                            </td>
                            <td align="center">
                              <v-text-field
                                dense
                                hide-details
                                filled
                                :disabled="item.type === '' ? true : false"
                                v-model="item.spec"
                                style="width:150px"
                                @change="setCode(item)"
                              >
                              </v-text-field>
                            </td>
                            <td align="center">
                              <v-text-field
                                dense
                                hide-details
                                filled
                                :disabled="item.type === '' ? true : false"
                                v-model="item.model"
                                style="width:150px"
                                @change="setCode(item)"
                              >
                              </v-text-field>
                            </td>
                            <td align="center">
                              <!-- <v-text-field
                                dense
                                hide-details
                                filled
                                v-model="item.manufacturer"
                                style="width:150px"
                              > -->
                              <v-autocomplete
                                v-model="item.manufacturer"
                                :items="manufacturer_list"
                                dense
                                :disabled="item.type === '' ? true : false"
                                hide-details
                                filled
                                style="width:150px"
                                @change="setCode(item)"
                              ></v-autocomplete>

                              <!-- </v-text-field> -->
                            </td>
                            <td align="center">
                              <v-text-field
                                dense
                                hide-details
                                filled
                                :disabled="item.type === '' ? true : false"
                                v-model="item.unit_price"
                                style="width:150px"
                                :oninput="!item.unit_price ? '' : item.unit_price = item.unit_price.replace(/^0+|\D+/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')"
                              >
                              </v-text-field>
                            </td>
                            <td align="center" style="min-width: 160px;">
                              <v-checkbox
                                v-if="item.type !== '원부자재'"
                                label="미선택"
                                color="primary"
                                hide-details
                                class="float-left mr-3 mt-0"
                                v-model="item.dont_select_ship"
                                @click="clickDontSelectShip(index)"
                              ></v-checkbox>
                              <v-btn
                                v-if="item.type !== '원부자재'"
                                color="primary"
                                class="float-left"
                                fab
                                x-small
                                elevation="0"
                                @click="selectShipData(item, index)"
                              >
                                <v-icon style="cursor:pointer">mdi-magnify</v-icon>
                              </v-btn>

                              <!-- <v-icon v-if="item.type !== '원부자재'" color="default" style="cursor:pointer" @click="selectShipData(item, index)">mdi-magnify</v-icon> -->
                            </td>
                            <td align="center">
                              <v-icon small color="default" style="cursor:pointer" @click="deleteInboundDataRow(index)">mdi-minus-thick</v-icon>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </div>
              </CardComponent>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>

      <!-- 출하데이터 조회 Modal -->
      <ModalDialogComponent
        :dialog-value="ship_dialog"
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
              cols="6"
            >
              <p class="text-h6 font-weight-black float-left mb-0">출하 정보 검색</p>
            </v-col>
            <v-col
              cols="6"
            >
              <p class="text-h6 font-weight-black float-left mb-0">선택 출하 정보</p>
              <v-btn
                color="blue-grey darken-1"
                x-small
                class="mr-2 float-right white--text"
                elevation="2"
                @click="close"
                fab
              >
                <v-icon> mdi-close-thick </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="6">
              <InputsFormComponent
                dense
                filled
                clearable
                hide-details
                :inputs="searchShipaDataInputs"
                @enter="searchShipData"
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
                    @click="searchShipData"
                  >
                    검색
                  </v-btn>
                </v-col>
              </InputsFormComponent>
            </v-col>
            <v-col cols="6">
              <v-btn
                color="success"
                small
                class="ml-2 float-left"
                elevation="2"
                @click="applyToInboundData"
              >
                저장
              </v-btn>
            </v-col>
            <v-col cols="6">
              <DataTableComponent
                :headers="ship_search_headers"
                :items="ship_search_data"
                :item-key="ship_search_data.code"
                children-key="belong_data"
                dense
                addToTable
                @addDataToTable="addShipData"
              />
            <!-- <v-data-table
              :headers="ship_search_headers"
              :items="ship_search_data"
              item-key="_code"
              show-select
              dense
            ></v-data-table> -->
            </v-col>
            <v-col cols="6">
              <DataTableComponent
                :headers="ship_search_headers"
                :items="ship_selected_data"
                item-key="code"
                hide-default-footer
                disable-pagination
                children-key="belong_data"
                dense
                exceptFromTable
                @exceptDataToTable="exceptShipData"
              />
            <!-- <v-data-table
              :headers="ship_search_headers"
              :items="ship_search_data"
              item-key="_code"
              show-select
              dense
            ></v-data-table> -->
            </v-col>
          </v-row>

        </v-container>
      </ModalDialogComponent>
    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import DataTableComponent from "@/components/DataTableComponent";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import ModalDialogComponent from "@/components/ModalDialogComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import MemberSearchDialogComponent from "@/components/MemberSearchDialogComponent.vue";
import LoadingModalComponent from "@/components/LoadingModalComponent.vue";
import InboundRegisterPageConfig from "@/configure/InboundRegisterPageConfig.json";

import mux from "@/mux";

export default {

  mounted() {

  },
  components: {
                NavComponent,
                DataTableComponent,
                InputsFormComponent,
                CardComponent,
                MemberSearchDialogComponent,
                LoadingModalComponent,
                ModalDialogComponent,
              },
  data(){
    return{
      tab_main: null,
      tab_main_items: InboundRegisterPageConfig.tab_main_items,

      login_id:'',
      stock_more_0: false,
      member_dialog: false,
      loading_dialog: false,
      ship_dialog: false,
      add_self: '발주입고',
      select_product: true,
      inbound_index:-1,
      inbound_date_set:'',
      dates: [],
      members_list:[],
      manufacturer_list:[],
      classification_list:[],
      spot_list: [],
      menu: false,
      something_wrong:false,
      something_wrong_reason:'',
      set_spot_selected: '',
      something_wrong_radio: '이상 없음',
      selected_product_data:[],
      selected_ship_data:[],
      selected_order_data:[],
      product_inbound_data: [],
      product_inbound_data_added: [],
      member_type_index:0,
      receiving_inspection_value:'',
      inspection_report_value:'',
      files_value:[],
      type_list:InboundRegisterPageConfig.type_list,
      inbound_member_info:InboundRegisterPageConfig.inbound_member_info,
      inbound_confirmation_data: InboundRegisterPageConfig.inbound_confirmation_data,
      searchCardInputs:InboundRegisterPageConfig.searchCardInputs,
      searchOrderCardInputs:InboundRegisterPageConfig.searchOrderCardInputs,
      searchShipCardInputs:InboundRegisterPageConfig.searchShipCardInputs,
      inboundCardInfoInputs:InboundRegisterPageConfig.inboundCardInfoInputs,
      inboundOrderedCardInfoInputs:InboundRegisterPageConfig.inboundOrderedCardInfoInputs,
      restockCardInfoInputs:InboundRegisterPageConfig.restockCardInfoInputs,
      ordered_inbound_headers:InboundRegisterPageConfig.ordered_inbound_headers,
      product_inbound_headers:InboundRegisterPageConfig.product_inbound_headers,
      product_restock_headers:InboundRegisterPageConfig.product_restock_headers,
      product_search_headers:InboundRegisterPageConfig.product_search_headers,
      searchShipaDataInputs:InboundRegisterPageConfig.searchShipaDataInputs,
      ship_search_headers:InboundRegisterPageConfig.ship_search_headers,
      order_search_headers:InboundRegisterPageConfig.order_search_headers,
      product_search_data:[],
      ship_search_data:[],
      order_search_data:[],
      ship_selected_data:[]
    }
  },
  watch: {

    tab_main(val){
      if(val === 0){
        this.inbound_member_info = InboundRegisterPageConfig.inbound_member_info.filter(x=>x.type !== '구매담당자');
        this.add_self = '발주입고';
        this.product_inbound_data = [];
        this.set_spot_selected = '';
      }else{
        this.inbound_member_info = JSON.parse(JSON.stringify(InboundRegisterPageConfig.inbound_member_info));
        this.add_self = '자재선택';
        this.product_inbound_data = [];
        this.set_spot_selected = '';
      }
    },
  },
  created () {
    this.initialize()
    this.members()
  },
  methods: {
    async initialize () {

      // this.manufacturer_list = InboundRegisterPageConfig.test_manufacturer_list;
      // this.classification_list = InboundRegisterPageConfig.test_classification_list;
      // this.spot_list = InboundRegisterPageConfig.test_spot_list;
      const prevURL = window.location.href;
      try {
        let result = await mux.Server.getPionBasicInfo();
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }

        this.classification_list = result.classification;
        this.manufacturer_list = result.manufacturer;
        this.spot_list = result.spot;

      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }

      mux.List.addProductBasicInfoLists(this.searchCardInputs, this.classification_list, this.manufacturer_list, true);
      this.searchCardInputs = JSON.parse(JSON.stringify(this.searchCardInputs));
      this.inboundCardInfoInputs = JSON.parse(JSON.stringify(this.inboundCardInfoInputs));
      this.restockCardInfoInputs = JSON.parse(JSON.stringify(this.restockCardInfoInputs));
      mux.Rules.rulesSet(this.inboundCardInfoInputs);
      mux.Rules.rulesSet(this.restockCardInfoInputs);

      try {
        // console.log('사용자 계정 정보 가졍오기');
        // let result = await mux.Server.get({
        //   path: '/api/user/',
        // });
        if (prevURL !== window.location.href) return;
        // console.log('result :>> ', result);
        this.inbound_member_info[0].name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.inbound_member_info[0].email =  this.$cookies.get(this.$configJson.cookies.email.key);
        this.inbound_member_info[0].user_id =  this.$cookies.get(this.$configJson.cookies.id.key);
        this.login_id =  this.$cookies.get(this.$configJson.cookies.id.key);
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }

      // 수주 기준 프로젝트 코드 가져오기
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "obtain_confirmation_table.approval_phase": "승인"
            }
          ],
          "script_file_name": "rooting_수주_정보_검색_24_08_08_13_53_89S.json",
          "script_file_path": "data_storage_pion\\json_sql\\obtain\\수주_정보_검색_24_08_08_13_54_EFQ"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

          if(result['data'].length === 0){
            mux.Util.showAlert('검색 결과가 없습니다.');
          }

          let project_codes = [];
          result.data.obtain_confirmation.forEach(data => {
            project_codes.push(data.project_code);
          });

          let set = new Set(project_codes);
          project_codes = [...set];


          this.inboundCardInfoInputs.find(x=>x.column_name === 'project_code').list = project_codes;
          // result.data.obtain_cost_calc_detail;
        } else {
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
    async searchOrder(){
      mux.Util.showLoading();
      this.order_search_data = [];

      let searchCompany = this.searchOrderCardInputs.find(x=>x.label === '발주 업체명').value;
        if (searchCompany)
        searchCompany = searchCompany.trim();
      let searchItemCode = this.searchOrderCardInputs.find(x=>x.label === '관리코드').value;
      if (searchItemCode)
      searchItemCode = searchItemCode.trim();
      let searchItemName = this.searchOrderCardInputs.find(x=>x.label === '제품명').value;
      if (searchItemName)
      searchItemName = searchItemName.trim();

      let order_result = [];
      let ordered_data = [];
      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "order_confirmation_table.company_name": searchCompany ?  searchCompany :"",
              "order_product_table.name": searchItemName ? searchItemName : "",
              "order_product_table.item_code": searchItemCode ? searchItemCode : "",
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

          let result_data = result.data.filter(x=>x.approval_phase !== '미승인')

          result_data.forEach(data => {
            for(let i=0; i<data.belong_data.length; i++){
              let belong = data.belong_data[i];

              if(belong.inbound_code === null){
                belong.code = data.code;
                belong.spot = '';
                belong.company_name = data.company_name;
                belong.given_name = data.given_name;
                belong.unit_price = '₩ '+ Number(belong.unit_price).toLocaleString()
                belong.ordered_num = Number(belong.ordered_num).toLocaleString()
                order_result.push(belong);
              }
            }
          })

          order_result.forEach(async order_item => {
            if(!order_item.item_code.includes('임시코드')){

              try {
                let item_result = await mux.Server.post({
                  path: '/api/common_rest_api/',
                  params: [
                    {
                      "product_table.product_code": order_item.item_code,
                      "module_table.module_code": order_item.item_code,
                      "material_table.material_code": order_item.item_code,
                    }
                  ],
                  "script_file_name": "rooting_재고_검색_24_05_07_11_46_16P.json",
                  "script_file_path": "data_storage_pion\\json_sql\\stock\\1_재고검색\\재고_검색_24_05_07_11_46_H8D"
                });
                if (prevURL !== window.location.href) return;

                if (typeof item_result === 'string'){
                  item_result = JSON.parse(item_result);
                }
                if(item_result['code'] == 0){
                  let item = item_result.data[0];
                  order_item.type = item.type;
                  order_item.classification = item.classification;
                  order_item.name = item.name;
                  order_item.model = item.model;
                  order_item.spec = item.spec;
                }
              } catch (error) {
                if (prevURL !== window.location.href) return;
                if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
                  mux.Util.showAlert(error.response['data']['failed_info'].msg);
                else
                  mux.Util.showAlert(error);
              }
            }
            ordered_data.push(order_item);
          })

        this.order_search_data = ordered_data;
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

      console.log('order_result: ' + JSON.stringify(ordered_data) )
      mux.Util.hideLoading();
    },
    async searchProduct(){
      mux.Util.showLoading();

      // this.product_search_data = InboundRegisterPageConfig.test_product_search_data

      let searchType = this.searchCardInputs.find(x=>x.label === '종류').value;
      if (searchType === 'All')
        searchType = '%';
      let searchClassification = this.searchCardInputs.find(x=>x.label === '분류').value;
      if (searchClassification === 'All')
        searchClassification = '%';
      let searchProductCode = this.searchCardInputs.find(x=>x.label === '관리코드').value;
      if (searchProductCode)
      searchProductCode = searchProductCode.trim();

      let searchProductName = this.searchCardInputs.find(x=>x.label === '제품명').value;
      if (searchProductName)
      searchProductName = searchProductName.trim();

      let searchModelName = this.searchCardInputs.find(x=>x.label === '모델명').value;
      if (searchModelName)
      searchModelName = searchModelName.trim();

      let searchProductSpec = this.searchCardInputs.find(x=>x.label === '사양').value;
      if (searchProductSpec)
      searchProductSpec = searchProductSpec.trim();

      let searchManufacturer = this.searchCardInputs.find(x=>x.label === '제조사').value;
      if (searchManufacturer)
      searchManufacturer = searchManufacturer.trim();

      let searchStockMoreZero = '';

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
            let isExist = false;
            if (!this.stock_more_0 || (data.stock_num && data.stock_num > 0)){
              for (let i = 0; i < product_data_arr.length; i++) {
                if (product_data_arr[i]._code === data._code) {
                  if (data.stock_num){
                    if (product_data_arr[i].spot_stock !== undefined){
                      product_data_arr[i].spot_stock.push({_code: data._code, spot: data.spot, stock_num: data.stock_num, conditions: data.conditions, stock_price: Math.round(data.unit_price * data.stock_num)});
                    }else {
                      product_data_arr[i].spot_stock = [{_code: data._code, spot: data.spot, stock_num: data.stock_num, conditions: data.conditions, stock_price: Math.round(data.unit_price * data.stock_num)}];
                    }
                  }
                  isExist = true;
                  break;
                }
              }
              if (!isExist) {
                if (data.stock_num){
                  data.spot_stock = [{_code: data._code, spot: data.spot, stock_num: data.stock_num, conditions: data.conditions, stock_price: Math.round(data.unit_price * data.stock_num)}];
                }
                product_data_arr.push(data);
              }
            }
          });
          this.product_search_data = product_data_arr;

          this.product_search_data.forEach(data =>{
            let stock_calc = 0;
            if (data.spot_stock){
              for(let d=0; d<data.spot_stock.length; d++){
                if (typeof data.spot_stock[d].stock_num === 'number'){
                  stock_calc += data.spot_stock[d].stock_num;
                }
              }
            }
            data.total_stock = stock_calc
            if (typeof data.unit_price === 'number'){
              data.item_price = data.unit_price * data.total_stock
              data.unit_price = '₩ '+ Number(data.unit_price).toLocaleString()
            }else {
              data.item_price = 0;
            }
            this.total_stock_num += data.total_stock
            this.total_stock_price += data.item_price
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


      mux.Util.hideLoading();
    },
    // eslint-disable-next-line no-unused-vars

    // changeManufacturer(item){
    //   if(item.item_code.includes('임시코드') && item.type === '반제품'){
    //     let manudacturer = item.manufacturer.split('-');
    //     item.new_item_code = item.new_item_code + '-' + manudacturer[manudacturer.length-1];
    //   }
    // },
    addItems(){
      let check_code = '';
      let check_duplicate=[];
      let set_item = this.product_inbound_data;
      let selected_item;

      if(this.add_self === '발주입고'){
        selected_item = this.selected_order_data
        check_code = 'item_code'
      }else if(this.add_self === '재입고'){
        selected_item = this.selected_ship_data
        check_code = 'table_code'
      }else{
        selected_item  = this.selected_product_data;
        check_code = '_code'
      }

      set_item.forEach(item => {
        for(let d=0; d<selected_item.length; d++){

          if(this.add_self === '발주입고'){
            if(item.item_code === selected_item[d][check_code]){
              check_duplicate.push(item.item_code);
            }
            item.manufacturer = selected_item[d].company_name;
          }else if(this.add_self === '재입고'){
            if(item.table_code === selected_item[d][check_code]){
              check_duplicate.push(selected_item[d].product_code);
            }
          }else{
            if(item.item_code === selected_item[d][check_code]){
              check_duplicate.push(item.item_code);
            }
          }
        }
      })
      if(check_duplicate.length > 0){
        let duplicate = JSON.stringify(check_duplicate).replace( "[",'').replace( "]",'');
        mux.Util.showAlert(duplicate + '은(는) 이미 추가된 제품입니다.')
        return
      }else{
        selected_item.forEach(data =>{
          if(this.add_self === '발주입고'){
            data.dont_select_ship = false;
            data.order_code = data.code;
            data.inbound_num = data.ordered_num;
            data.order_spec = data.spec;
            data.code_type = 'with_type';
            data.spec = '000V 000kW 00Hz 0Level';
            if(data.item_code.includes('임시코드')){
              let classification = data.classification.split('-');
              data.new_item_code = 'PE-' + classification[classification.length-1];
            }
          }else if(this.add_self === '재입고'){
            data._code = data.product_code
            data.unit_price =  '₩ ' + Number(data.unit_price).toLocaleString()
          }else{
            data.dont_select_ship = false;
            data.item_code = data._code
          }
          set_item.push(data);
        })
        this.selected_order_data = []
        this.selected_product_data = []
        this.selected_ship_data = []
      }
    },
    async clickDontSelectShip(index){
      if(this.product_inbound_data[index].belong_data.length > 0){
        const confirm = await mux.Util.showConfirm('미선택 체크 시 선택한 출하내역은 초기화됩니다.  ', '선택 확인');
          if (!confirm){
            return;
          }
        this.product_inbound_data[index].belong_data = [];
      }
    },

    async addProductInboundData(){
      this.selected_ship_data = [];
      this.ship_search_data = [];
      if(this.add_self == '자재선택'){
        const confirm = await mux.Util.showConfirm('직접 입력형으로 전환되며, \n위에서 선택한 자재는 선택 해제됩니다. ', '전환 확인');
        if (!confirm){
          return;
        }
        this.product_inbound_data = [];
        this.select_product = false;
      }
      // if(this.product_inbound_headers.length !== 12){
      //   this.product_inbound_headers.splice(this.product_inbound_headers.length-1, 0, { "text": "출하선택", "align": "center", "value": "ship_select"})
      // }

      this.add_self = '직접기입';
      this.product_inbound_data.push({
        type:'',
        classification:'',
        code_type: 'with_type',
        _code: 'PE-',
        name: '',
        inbound_num: '',
        spot: '',
        spec: '',
        model: '',
        manufacturer: '',
        unit_price: '',
        registe_type: '직접입력',
      });
    },
    async addProductInboundDataCancle(){
      if(this.add_self == '직접기입'){
        const confirm = await mux.Util.showConfirm('자재 선택형으로 전환되며, \n아래 작성된 내용은 초기화됩니다.', '전환 확인');
        if (!confirm){
          return;
        }
        this.product_inbound_data = [];
        this.select_product = true;
      }

      // let ship_select = this.product_inbound_headers.findIndex(obj => obj.text === '출하선택');
      // this.product_inbound_headers.splice(ship_select,1)
      this.add_self = '자재선택';
    },
    setSpotAtOnce(){
      this.product_inbound_data.forEach(data =>{
        data.spot = this.set_spot_selected
      })
    },
    async restockData(){
      this.selected_ship_data = [];
      this.ship_search_data = [];
      if(this.add_self == '자재선택'){
        const confirm = await mux.Util.showConfirm('재입고형으로 전환되며, \n위에서 선택한 자재는 선택 해제됩니다. ', '전환 확인');
        if (!confirm){
          return;
        }
        this.product_inbound_data = [];
        this.select_product = false;
      }
      this.add_self = '재입고';

    },
    async restockDataCancle(){
      const confirm = await mux.Util.showConfirm('자재 선택형으로 전환되며, \n아래 작성된 내용은 초기화됩니다.', '전환 확인');
      if (!confirm){
        return;
      }
      this.product_inbound_data = [];
      this.select_product = true;

      this.add_self = '자재선택';
    },
    async inboundApprovalRequest(){
      let inbound_input = [];
      if(this.add_self === '발주입고'){
        inbound_input = this.inboundOrderedCardInfoInputs;
      }else{
        inbound_input = this.inboundCardInfoInputs;
      }
      let member_input = this.inbound_member_info;
      let item = this.inbound_confirmation_data;
      let success = true;
      let order_code_arr = [];
      const validate = this.$refs.inboundForm.validate();
      if(validate){
        this.files_value = [];
        inbound_input.forEach(data => {
          for(let i=0; i<Object.keys(item).length; i++){
            if(data.column_name == Object.keys(item)[i]){
              if(data.type == 'file'){
                if(data.value){
                  if(data.column_name === 'files'){
                    for(let f=0; f<data.value.length; f++){
                      if(f === 0){
                        item[Object.keys(item)[i]] = data.value[f].name
                      }else{
                        item[Object.keys(item)[i]] = item[Object.keys(item)[i]]+"/"+data.value[f].name
                      }
                      this.files_value.push(data.value[f])
                    }
                  }else if(data.column_name === 'receiving_inspection'){
                    this.receiving_inspection_value = data.value
                    item[Object.keys(item)[i]] = data.value.name;
                  }else if(data.column_name === 'inspection_report'){
                    this.inspection_report_value = data.value
                    item[Object.keys(item)[i]] = data.value.name;
                  }
                }else{
                  item[Object.keys(item)[i]] = '';
                }
              }else{
                item[Object.keys(item)[i]] = data.value;
              }
            }
          }
        })
        const currDate = new Date();
        item.inbound_date = (this.inbound_date_set === "" ? mux.Date.format(currDate, 'yyyy-MM-dd') : this.inbound_date_set);
        item.creater = this.login_id;
        item.code = item.order_code + ":" + mux.Date.format(currDate, 'yyyy-MM-dd HH-mm-ss-fff');
        if(this.add_self === '직접기입'){
          item.add_data = "직접기입형"
        }else if(this.add_self === '자재선택'){
          item.add_data = "선택형"
        }else if(this.add_self === '재입고'){
          item.add_data = "재입고"
        }else if(this.add_self === '발주입고'){
          item.add_data = "발주입고"
        }


        let receiving_inspection_thumbnail = 'NULL';
        let inspection_report_thumbnail = 'NULL';
        if(this.receiving_inspection_value){
          const getPdfThumbnail = await mux.Util.getPdfThumbnail(this.receiving_inspection_value, 1, false, 1000, 1000);
          receiving_inspection_thumbnail = mux.Util.uint8ArrayToHexString(getPdfThumbnail);
        }
        if(this.inspection_report_value){
          const getPdfThumbnail = await mux.Util.getPdfThumbnail(this.inspection_report_value, 1, false, 1000, 1000);
          inspection_report_thumbnail = mux.Util.uint8ArrayToHexString(getPdfThumbnail);
        }

        console.log(item);

        let empty_member = [];
        member_input.forEach(mem => {
          if(!mem.user_id){
            empty_member.push(mem.type)
          }else{
            if(mem.type === '확인'){
              item.checker = mem.name;
              item.checker_id = mem.user_id;
              if(item.checker_id == this.login_id){
                item.approval_phase = '미승인';
              }else{
                item.approval_phase = '미확인';
              }
            }else if(mem.type === '승인'){
              item.approver = mem.name;
              item.approver_id = mem.user_id;
            }else if(mem.type === '구매담당자'){
              item.purchase_manager = mem.name + '-' + mem.user_id;
            }else if(mem.type === '자재담당자'){
              item.material_manager = mem.name + '-' + mem.user_id;
            }
          }
        })

        if(empty_member.length > 0){
          mux.Util.showAlert(empty_member+"를 선택해주세요.");
          return success = false;
        }

        let inbound_product_data = this.product_inbound_data
        if(inbound_product_data.length === 0){
          mux.Util.showAlert('자재를 선택해주세요.');
          return success = false;
        }else{
          let ship_belog = [];
          let ship_belog_product = [];

          if(this.add_self === '발주입고'){
            for(let d = 0; d < inbound_product_data.length; d++){
              if(inbound_product_data[d].spot == '' || inbound_product_data[d].spot == null){
                mux.Util.showAlert('입고장소 필수 입력');
                return success = false;
              }
            }
          }else if(this.add_self === '자재선택'){
            for(let d = 0; d < inbound_product_data.length; d++){
              if(inbound_product_data[d].inbound_num == '' || inbound_product_data[d].spec == '' || inbound_product_data[d].spot == ''){
                mux.Util.showAlert('입고수량, 입고장소, 규격 필수 입력');
                return success = false;
              }else if(inbound_product_data[d].inbound_num == 0){
                mux.Util.showAlert('입고수량은 0보다 커야합니다.');
                return success = false;
              }else if(inbound_product_data[d].type !== '원부자재' && !inbound_product_data[d].dont_select_ship && !inbound_product_data[d].belong_data){
                mux.Util.showAlert(inbound_product_data[d]._code + '의 출하 내역을 선택해주세요');
                return success = false;
              }
              if(inbound_product_data[d].belong_data){
                for(let s=0; s<inbound_product_data[d].belong_data.length; s++){
                  inbound_product_data[d].belong_data[s].belong_data.forEach(b => {
                    ship_belog.push({"product_code":b.product_code, "ship_num": b.ship_num});
                    // ship_belog_product.push({"product_code" : b.product_code, "total_ship_num" : 0});
                    ship_belog_product.push(b.product_code);
                  })
                }
                let set = new Set(ship_belog_product);
                let ship_belog_product_unique = [...set];

                let total_ship_data = [];
                ship_belog_product_unique.forEach(ship => {
                  let total_ship_num = 0;
                  for(let sbp=0; sbp<ship_belog.length; sbp++){
                    if(ship === ship_belog[sbp].product_code){
                      total_ship_num += ship_belog[sbp].ship_num;
                    }
                  }
                  total_ship_data.push({"product_code" : ship, "total_ship_num" : total_ship_num});
                })
                console.log('total_ship_data : ' + JSON.stringify(total_ship_data));

                for(let ts=0; ts<total_ship_data.length; ts++){
                  if(!Number.isInteger(total_ship_data[ts].total_ship_num / inbound_product_data[d].inbound_num)){
                    mux.Util.showAlert(inbound_product_data[d]._code + '에 연결된 출고수량과<br>기입한 입고수량을 확인해주세요.<br><br> - 입고수량 : ' + inbound_product_data[d].inbound_num + '<br> - 출고 정보 : ' + total_ship_data[ts].product_code + '/' + total_ship_data[ts].total_ship_num + '개')
                    return success=false;
                  }
                }
              }
            }


          }else if(this.add_self === '직접기입'){
            inbound_product_data.forEach(data => {
              for(let add = 0; add < Object.keys(data).length; add++){
                if(Object.keys(data)[add] != 'model' && Object.values(data)[add] === ''){
                  mux.Util.showAlert('모델을 제외한 모든 정보가 기입되어야 합니다.');
                  return success = false;
                }
                if(Object.keys(data)[add] === 'type' && Object.values(data)[add] !== '원부자재' && !data.dont_select_ship && !data.belong_data){
                  mux.Util.showAlert(data._code + '출하 내역을 선택해주세요');
                  return success = false;
                }
              }
              if(data.belong_data){

                for(let s=0; s<data.belong_data.length; s++){
                  data.belong_data[s].belong_data.forEach(b => {
                    ship_belog.push({"product_code":b.product_code, "ship_num": b.ship_num});
                    // ship_belog_product.push({"product_code" : b.product_code, "total_ship_num" : 0});
                    ship_belog_product.push(b.product_code);
                  })
                }
                let set = new Set(ship_belog_product);
                let ship_belog_product_unique = [...set];

                let total_ship_data = [];
                ship_belog_product_unique.forEach(ship => {
                  let total_ship_num = 0;
                  for(let sbp=0; sbp<ship_belog.length; sbp++){
                    if(ship === ship_belog[sbp].product_code){
                      total_ship_num += ship_belog[sbp].ship_num;
                    }
                  }
                  total_ship_data.push({"product_code" : ship, "total_ship_num" : total_ship_num});
                })
                console.log('total_ship_data : ' + JSON.stringify(total_ship_data));

                for(let ts=0; ts<total_ship_data.length; ts++){
                  if(!Number.isInteger(total_ship_data[ts].total_ship_num / data.inbound_num)){
                    mux.Util.showAlert(data._code + '에 연결된 출고수량과<br>기입한 입고수량을 확인해주세요.<br><br> - 입고수량 : ' + data.inbound_num + '<br> - 출고 정보 : ' + total_ship_data[ts].product_code + '/' + total_ship_data[ts].total_ship_num + '개')
                    return success=false;
                  }
                }
              }
            })
          }
        }

        if(success == true){
          mux.Util.showLoading();
          let sendData = {};
          if(this.add_self === '발주입고'){
            let set_confirmation_data = [];
            let confirmation_data = []
            let product_data = []
            inbound_product_data.forEach((data, index) => {
              order_code_arr.push(data.order_code);
              let confirm_code = data.order_code + ":" + mux.Date.format(currDate, 'yyyy-MM-dd HH-mm-ss-fff') + '_' + index;
              set_confirmation_data.push({
                "code" : confirm_code,
                "inbound_date": this.inbound_confirmation_data.inbound_date,
                "order_code" : data.order_code,
                "project_code" : data.project_code,
                "purchase_manager" : data.given_name + '-' + data.creater,
                "material_manager" : this.inbound_confirmation_data.material_manager,
                "abnormal_reason" : this.inbound_confirmation_data.abnormal_reason,
                "approval_phase": this.inbound_confirmation_data.approval_phase,
                "checker" : this.inbound_confirmation_data.checker,
                "checker_id" : this.inbound_confirmation_data.checker_id,
                // "checked_date" : this.inbound_confirmation_data.checked_date,
                "approver" : this.inbound_confirmation_data.approver,
                "approver_id" : this.inbound_confirmation_data.approver_id,
                "receiving_inspection_file" : this.inbound_confirmation_data.receiving_inspection,
                "receiving_inspection_thumbnail" : receiving_inspection_thumbnail,
                "inspection_report_file" : this.inbound_confirmation_data.inspection_report,
                "inspection_report_thumbnail" : inspection_report_thumbnail,
                "files" : this.inbound_confirmation_data.files,
                "note" : this.inbound_confirmation_data.note,
                "add_data": this.inbound_confirmation_data.add_data
              })
            })
            set_confirmation_data = set_confirmation_data.reduce((prev, now) => {
              if(!prev.some(obj => obj.order_code === now.order_code && obj.project_code === now.project_code)){
                prev.push(now);
              }
              return prev;
            }, [])
            console.log(set_confirmation_data);

            set_confirmation_data.forEach(set => {

              if(set.approval_phase === '미승인'){
                set.checked_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
              }
              confirmation_data.push({
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data": set,
                "select_where": {"code": set.code},
                "rollback": "yes"
              })
              for(let p=0; p<inbound_product_data.length; p++){
                let inbound_data = inbound_product_data[p];
                if(set.order_code === inbound_data.order_code && set.project_code === inbound_data.project_code){
                  product_data.push({
                    "user_info": {
                      "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                      "role": "creater"
                    },
                    "data":{
                      "code" : set.code,
                      "type" : inbound_data.type,
                      "classification" : inbound_data.classification,
                      "product_code" : inbound_data.item_code.includes('임시코드') ? inbound_data.new_item_code+'('+inbound_data.item_code+')' : inbound_data.item_code,
                      "name" : inbound_data.name,
                      "inbound_num" : inbound_data.inbound_num.replace(/,/g,''),
                      "spot" : inbound_data.spot,
                      "spec" : inbound_data.spec,
                      "model" : inbound_data.model,
                      "manufacturer" : inbound_data.manufacturer,
                      "unit_price" : inbound_data.unit_price.replace(/,/g,'').replace(/₩ /g,''),
                      "ship_code" : '미선택',
                    },
                    "select_where": {"code": set.code},
                    "rollback": "yes"
                  })
                }
              }
            })

            sendData["inbound_confirmation_table-insert"] = confirmation_data;
            sendData["inbound_product_table-insert"] = product_data;
          }else{
            sendData = {
              "inbound_confirmation_table-insert": [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data":{
                  "code" : this.inbound_confirmation_data.code,
                  "inbound_date": this.inbound_confirmation_data.inbound_date,
                  "order_code" : this.inbound_confirmation_data.order_code,
                  "project_code" : this.inbound_confirmation_data.project_code,
                  "purchase_manager" : this.inbound_confirmation_data.purchase_manager,
                  "material_manager" : this.inbound_confirmation_data.material_manager,
                  "abnormal_reason" : this.inbound_confirmation_data.abnormal_reason,
                  "approval_phase": this.inbound_confirmation_data.approval_phase,
                  "checker" : this.inbound_confirmation_data.checker,
                  "checker_id" : this.inbound_confirmation_data.checker_id,
                  // "checked_date" : this.inbound_confirmation_data.checked_date,
                  "approver" : this.inbound_confirmation_data.approver,
                  "approver_id" : this.inbound_confirmation_data.approver_id,
                  "receiving_inspection_file" : this.inbound_confirmation_data.receiving_inspection,
                  "receiving_inspection_thumbnail" : receiving_inspection_thumbnail,
                  "inspection_report_file" : this.inbound_confirmation_data.inspection_report,
                  "inspection_report_thumbnail" : inspection_report_thumbnail,
                  "files" : this.inbound_confirmation_data.files,
                  "note" : this.inbound_confirmation_data.note,
                  "add_data": this.inbound_confirmation_data.add_data
                },
                "select_where": {"code": this.inbound_confirmation_data.code},
                "rollback": "yes"
              }]
            };
            if(sendData["inbound_confirmation_table-insert"][0].data.approval_phase === '미승인'){
              sendData["inbound_confirmation_table-insert"][0].data.checked_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
            }

            let product_data = [];
            let update_ship_data = [];
            inbound_product_data.forEach(data =>{
              let inbound_unit_price;
              if(this.add_self === '직접기입'){
                inbound_unit_price = data.unit_price.replace(/,/g,'');
              }else{
                inbound_unit_price = data.unit_price.replace(/,/g,'').replace(/₩ /g,'')
              }

              let ship_code_info;
              if(data.dont_select_ship){
                ship_code_info = '미선택'
              }else{
                if(data.ship_code) {
                  ship_code_info = data.ship_code;  // data.ship_code가 undefined일 경우 ship_code_info에 undefined가 들어가서 오류 발생
                  let ship = data.ship_code.split('/');
                  //ship_code가 있을 경우 ship_confirmation_table update

                  for(let i = 0; i < ship.length; i++){
                    update_ship_data.push({
                      "user_info": {
                        "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                        "role": "modifier"
                      },
                      "data": {
                        "inbound_code": this.inbound_confirmation_data.code
                      },
                      "update_where": {"code": ship[i]},
                      "rollback": "yes"
                    });
                  }
                }
              }
              product_data.push({
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data":{
                  "code" : this.inbound_confirmation_data.code,
                  "type" : data.type,
                  "classification" : data.classification,
                  "product_code" : data._code,
                  "name" : data.name,
                  "inbound_num" : data.inbound_num.replace(/,/g,''),
                  "spot" : data.spot,
                  "spec" : data.spec,
                  "model" : data.model,
                  "manufacturer" : data.manufacturer,
                  "unit_price" : inbound_unit_price,
                  "ship_code" : data.type === '원부자재' ? '미선택' : ship_code_info,
                },
                "select_where": {"code": this.inbound_confirmation_data.code, "product_code": data._code},
                "rollback": "yes"
              });
            });
            sendData["inbound_product_table-insert"] = product_data;
            sendData["ship_confirmation_table-update"] = update_ship_data;
          }
          // console.log('입고 정보 : ' + JSON.stringify(item));
          // console.log('입고 제품 : ' + JSON.stringify(inbound_product_data));

          sendData.path = '/api/multipart_rest_api/';
          sendData.prefix = this.inbound_confirmation_data.code + '_';
          sendData.files = [];
          if (this.inbound_confirmation_data.receiving_inspection) {
            sendData.files.push({
              folder: 'inbound/receiving_inspection',
              file: this.receiving_inspection_value,
              name: this.inbound_confirmation_data.receiving_inspection
            });
          }
          if (this.inbound_confirmation_data.inspection_report) {
            sendData.files.push({
              folder: 'inbound/inspection_report',
              file: this.inspection_report_value,
              name: this.inbound_confirmation_data.inspection_report
            });
          }
          if (this.inbound_confirmation_data.files && this.files_value.length > 0) {
            for (let i = 0; i < this.files_value.length; i++) {
              const file = this.files_value[i];
              sendData.files.push({
                folder: 'inbound/files',
                file: file,
                name: this.inbound_confirmation_data.files.split('/')[i]
              });
            }
          }


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
            if(result.data['code'] == 0){
              // console.log('result :>> ', result);
              mux.Util.showAlert('입고 승인 요청이 완료되었습니다', '요청 완료', 3000);

              //메일 알림 관련
              let mailTo = [];
              let phase;
              if(item.approval_phase === '미확인'){
                mailTo.push(item.checker_id);
                phase = '확인'
              }else if(item.approval_phase === '미승인'){
                mailTo.push(item.approver_id);
                phase = '승인'
              }

              // 메일 본문 내용
              let order_code_list = '';
              if(this.add_self === '발주입고'){
                order_code_arr = [...new Set(order_code_arr)];
                for(let code = 0; code < order_code_arr.length; code++){
                  order_code_list += order_code_arr[code] + '<br>';
                }
              }
              let content=`
                <html>
                  <body>
                    <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                      <h2 style="text-align: center; color:#13428a">입고 ${phase} 요청 알림</h2>
                      <table style="width: 100%;border-spacing: 10px 10px;">
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">발주 번호</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.add_self === '발주입고' ? order_code_list : item.order_code}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">입고 일자</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.inbound_date}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.$cookies.get(this.$configJson.cookies.name.key).trim()}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">확인자</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.checker}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">승인자</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.approver}</td>
                        </tr>
                      </table>
                      <a style="color: white; text-decoration:none"href="${prevURL.substring(0,prevURL.lastIndexOf('/'))}/inbound-search?order_code=${this.add_self === '발주입고' ? '' : item.order_code}&inbound_date=${item.inbound_date}">
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
                  subject: "입고 " + phase + " 요청 알림",
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

              this.receiving_inspection_value = '';
              this.inspection_report_value = '';
              this.files_value = [];
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
        }
      }
    },
    async restockApprovalRequest(){
      let restock_input = this.restockCardInfoInputs;
      let member_input = this.inbound_member_info;
      let item = this.inbound_confirmation_data;
      let success = true;
      const validate = this.$refs.inboundForm.validate();
      if(validate){
        this.files_value = [];
        restock_input.forEach(data => {
          for(let i=0; i<Object.keys(item).length; i++){
            item[Object.keys(item)[i]] = data.value;
          }
        })
        const currDate = new Date();
        item.inbound_date = (this.inbound_date_set === "" ? mux.Date.format(currDate, 'yyyy-MM-dd') : this.inbound_date_set);
        item.creater = this.login_id;
        item.code = "재입고:" + mux.Date.format(currDate, 'yyyy-MM-dd HH-mm-ss-fff');
        item.add_data = "재입고"

        // let receiving_inspection_thumbnail = 'NULL';
        // let inspection_report_thumbnail = 'NULL';
        // if(this.receiving_inspection_value){
        //   const getPdfThumbnail = await mux.Util.getPdfThumbnail(this.receiving_inspection_value, 1, false, 1000, 1000);
        //   receiving_inspection_thumbnail = mux.Util.uint8ArrayToHexString(getPdfThumbnail);
        // }
        // if(this.inspection_report_value){
        //   const getPdfThumbnail = await mux.Util.getPdfThumbnail(this.inspection_report_value, 1, false, 1000, 1000);
        //   inspection_report_thumbnail = mux.Util.uint8ArrayToHexString(getPdfThumbnail);
        // }

        console.log(item);

        let empty_member = [];
        member_input.forEach(mem => {
          if(!mem.user_id){
            empty_member.push(mem.type)
          }else{
            if(mem.type === '확인'){
              item.checker = mem.name;
              item.checker_id = mem.user_id;
              if(item.checker_id == this.login_id){
                item.approval_phase = '미승인';
              }else{
                item.approval_phase = '미확인';
              }
            }else if(mem.type === '승인'){
              item.approver = mem.name;
              item.approver_id = mem.user_id;
            }else if(mem.type === '구매담당자'){
              item.purchase_manager = mem.name + '-' + mem.user_id;
            }else if(mem.type === '자재담당자'){
              item.material_manager = mem.name + '-' + mem.user_id;
            }
          }
        })

        if(empty_member.length > 0){
          mux.Util.showAlert(empty_member+"를 선택해주세요.");
          return success = false;
        }

        let inbound_product_data = this.product_inbound_data
        if(inbound_product_data.length === 0){
          mux.Util.showAlert('자재를 선택해주세요.');
          return success = false;
        }else{
          for(let d = 0; d < inbound_product_data.length; d++){
            if(inbound_product_data[d].inbound_num == ''){
              mux.Util.showAlert('입고수량 필수 입력');
              return success = false;
            }else if(inbound_product_data[d].inbound_num > inbound_product_data[d].ship_num){
              mux.Util.showAlert('입고수량은 출고 수량보다 작아야합니다.');
              return success = false;
            }
          }
        }




        if(success == true){
          mux.Util.showLoading();

          let sendData = {
            "inbound_confirmation_table-insert": [{
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "code" : this.inbound_confirmation_data.code,
                "inbound_date": this.inbound_confirmation_data.inbound_date,
                // "order_code" : this.inbound_confirmation_data.order_code ? this.inbound_confirmation_data.order_code : '',
                // "project_code" : this.inbound_confirmation_data.project_code ? this.inbound_confirmation_data.project_code : '',
                "purchase_manager" : this.inbound_confirmation_data.purchase_manager,
                "material_manager" : this.inbound_confirmation_data.material_manager,
                // "abnormal_reason" : this.inbound_confirmation_data.abnormal_reason ? this.inbound_confirmation_data.abnormal_reason : '',
                "approval_phase": this.inbound_confirmation_data.approval_phase,
                "checker" : this.inbound_confirmation_data.checker,
                "checker_id" : this.inbound_confirmation_data.checker_id,
                "approver" : this.inbound_confirmation_data.approver,
                "approver_id" : this.inbound_confirmation_data.approver_id,
                // "receiving_inspection_file" : this.inbound_confirmation_data.receiving_inspection ?  this.inbound_confirmation_data.receiving_inspection : '',
                // "receiving_inspection_thumbnail" : receiving_inspection_thumbnail,
                // "inspection_report_file" : this.inbound_confirmation_data.inspection_report ? this.inbound_confirmation_data.inspection_report : '',
                // "inspection_report_thumbnail" : inspection_report_thumbnail,
                // "files" : this.inbound_confirmation_data.files ? this.inbound_confirmation_data.files : '',
                "note" : this.inbound_confirmation_data.note,
                "add_data": this.inbound_confirmation_data.add_data
              },
              "select_where": {"code": this.inbound_confirmation_data.code},
              "rollback": "yes"
            }]
          };
          if(sendData["inbound_confirmation_table-insert"][0].data.approval_phase === '미승인'){
            sendData["inbound_confirmation_table-insert"][0].data.checked_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
          }

          let product_data = [];
          inbound_product_data.forEach(data =>{
            product_data.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "code" : this.inbound_confirmation_data.code,
                "type" : data.type,
                "classification" : data.classification,
                "product_code" : data._code,
                "name" : data.name,
                "inbound_num" : data.inbound_num.replace(/,/g,''),
                "spot" : data.spot,
                "spec" : data.spec,
                "model" : data.model,
                "manufacturer" : data.manufacturer,
                "unit_price" : data.unit_price.replace(/,/g,'').replace(/₩ /g,''),
                "ship_code" : data.ship_code,
              },
              "select_where": {"code": this.inbound_confirmation_data.code, "product_code": data._code},
              "rollback": "yes"
            });
          });
          sendData["inbound_product_table-insert"] = product_data;

          // sendData.path = '/api/multipart_rest_api/';
          // sendData.prefix = this.inbound_confirmation_data.code + '_';
          // sendData.files = [];
          // if (this.inbound_confirmation_data.receiving_inspection) {
          //   sendData.files.push({
          //     folder: 'inbound/receiving_inspection',
          //     file: this.receiving_inspection_value,
          //     name: this.inbound_confirmation_data.receiving_inspection
          //   });
          // }
          // if (this.inbound_confirmation_data.inspection_report) {
          //   sendData.files.push({
          //     folder: 'inbound/inspection_report',
          //     file: this.inspection_report_value,
          //     name: this.inbound_confirmation_data.inspection_report
          //   });
          // }
          // if (this.inbound_confirmation_data.files && this.files_value.length > 0) {
          //   for (let i = 0; i < this.files_value.length; i++) {
          //     const file = this.files_value[i];
          //     sendData.files.push({
          //       folder: 'inbound/files',
          //       file: file,
          //       name: this.inbound_confirmation_data.files.split('/')[i]
          //     });
          //   }
          // }


          const prevURL = window.location.href;
          try {
            let result = await mux.Server.post({
              path: '/api/common_rest_api/',
              params: sendData
            });
            // let result = await mux.Server.uploadFile(sendData);
            if (prevURL !== window.location.href) return;

            if (typeof result === 'string'){
              result = JSON.parse(result);
            }
            if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
              // console.log('result :>> ', result);
              mux.Util.showAlert('재입고 승인 요청이 완료되었습니다', '요청 완료', 3000);

              //메일 알림 관련
              let mailTo = [];
              let phase;
              if(item.approval_phase === '미확인'){
                mailTo.push(item.checker_id);
                phase = '확인'
              }else if(item.approval_phase === '미승인'){
                mailTo.push(item.approver_id);
                phase = '승인'
              }

              // 메일 본문 내용
              let content=`
                <html>
                  <body>
                    <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                      <h2 style="text-align: center; color:#13428a">재입고 ${phase} 요청 알림</h2>
                      <table style="width: 100%;border-spacing: 10px 10px;">
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">사유</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.note}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">입고 일자</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.inbound_date}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${this.$cookies.get(this.$configJson.cookies.name.key).trim()}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">확인자</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.checker}</td>
                        </tr>
                        <tr>
                          <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">승인자</td>
                          <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.approver}</td>
                        </tr>
                      </table>
                      <a style="color: white; text-decoration:none"href="${prevURL.substring(0,prevURL.lastIndexOf('/'))}/inbound-search?order_code=${item.order_code}&inbound_date=${item.inbound_date}">
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
                  subject: "재입고 " + phase + " 요청 알림",
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

              // this.receiving_inspection_value = '';
              // this.inspection_report_value = '';
              // this.files_value = [];
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
        }
      }
    },
    deleteInboundDataRow(idx){
      if(this.product_inbound_data.length === 1){
        mux.Util.showAlert('행이 한 개 이상 존재해야 합니다.')
      }else{
        this.product_inbound_data.splice(idx, 1);
      }
    },
    selectMemberDialog(idx){
      this.member_type_index = idx
      this.member_dialog = true;
    },
    setMember(item){
      this.inbound_member_info[this.member_type_index].name = item.name.trim()
      this.inbound_member_info[this.member_type_index].user_id = item.user_id
      this.close();
    },
    members(data){
      this.members_list=data;
    },
    dateChangedImport(item){
      this.inbound_date_set = item
    },
    close(){
      this.member_dialog = false;
      this.ship_dialog = false
      this.ship_search_data = [];
      this.ship_selected_data = [];
    },
    async selectShipData(item, index){
      if(this.product_inbound_data[index].dont_select_ship){
        const confirm = await mux.Util.showConfirm('미선택이 체크되어 있습니다. <br> 체크 해제 후 출하 선택이 가능합니다.', '선택 확인');
        if (!confirm){
          return;
        }
        return;
      }
      this.ship_dialog = true;
      this.inbound_index = index;
      if(item.belong_data){
        this.ship_selected_data = item.belong_data
      }
    },
    async searchShipData(){

      mux.Util.showLoading();
      let dataInputs
      if(this.add_self === '재입고'){
        dataInputs = this.searchShipCardInputs
      }else{
        dataInputs = this.searchShipaDataInputs
      }

      let searchProjectCode = dataInputs.find(x=>x.label === '프로젝트').value;
      if (searchProjectCode)
      searchProjectCode = searchProjectCode.trim();

      let searchProductCode = dataInputs.find(x=>x.label === '관리코드') ? dataInputs.find(x=>x.label === '관리코드').value : "";
      if (searchProductCode)
      searchProductCode = searchProductCode.trim();

      let searchProductName = dataInputs.find(x=>x.label === '제품명') ? dataInputs.find(x=>x.label === '제품명').value : "";
      if (searchProductName)
      searchProductName = searchProductName.trim();

      let searchPurpose = dataInputs.find(x=>x.label === '출고목적').value;
      if (searchPurpose)
      searchPurpose = searchPurpose.trim();

      let searchShipDate = dataInputs.find(x=>x.label === '출고 요청일') ? dataInputs.find(x=>x.label === '출고 요청일').value : "";
      let searchShipStartDate;
        let searchShipEndDate;
      if(searchShipDate === ''){
        searchShipStartDate = "";
        searchShipEndDate = "";
      }else{
        searchShipStartDate = searchShipDate[0];
        searchShipEndDate = searchShipDate[1];
      }
      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            {
              "ship_confirmation_table.approval_phase": "",
              "ship_confirmation_table.ship_date_start_date": searchShipStartDate ? searchShipStartDate : "",
              "ship_confirmation_table.ship_date_end_date": searchShipEndDate ? searchShipEndDate : "",
              "ship_product_table.product_code": searchProductCode ? searchProductCode : "",
              "ship_product_table.name": searchProductName ?  searchProductName : "",
              "ship_confirmation_table.project_code": searchProjectCode ? searchProjectCode : "",
              "ship_confirmation_table.purpose": searchPurpose ? searchPurpose : ""
            }
          ],
          "script_file_name": "rooting_출하_검색_24_06_07_10_09_W4U.json",
          "script_file_path": "data_storage_pion\\json_sql\\ship\\출하_검색_24_06_07_10_09_F1C"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          let ship_data_arr = [];
          if(this.add_self === '재입고'){
            result.data.forEach(datas =>{
              if(datas.approval_phase === '승인' || datas.approval_phase === '추가 승인'){
                for(let d=0; d<datas.belong_data.length; d++){
                  datas.belong_data[d].purpose=datas.purpose;
                  datas.belong_data[d].ship_date=datas.ship_date;
                  datas.belong_data[d].project_code=datas.project_code;
                  datas.belong_data[d].table_code=datas.code+'/'+datas.belong_data[d].product_code+'/'+datas.belong_data[d].spot;
                  ship_data_arr.push(datas.belong_data[d]);
                }
              }
            })
          }else{
            result.data.forEach(datas =>{
              if(datas.approval_phase === '승인' || datas.approval_phase === '추가 승인'){
                for(let d=0; d<datas.belong_data.length; d++){
                  datas.belong_data[d].purpose="";
                  datas.belong_data[d].ship_date="";
                }
                  ship_data_arr.push(datas);
              }
            })
          }
          this.ship_search_data  = ship_data_arr.reverse(); // 최신순으로 정렬
        }else{
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
      // this.ship_search_data = InboundRegisterPageConfig.test_ship_search_data;
    },
    addShipData(item){
      for(let i=0; i<this.ship_selected_data.length; i++){
        if(this.ship_selected_data[i].code === item.code){
          mux.Util.showAlert("이미 추가한 데이터입니다.");
          return;
        }
      }
      this.ship_selected_data.push(item)
    },
    exceptShipData(index){
      this.ship_selected_data.splice(index,1);
    },
    applyToInboundData(){
      let unit_price = 0;
      this.product_inbound_data[this.inbound_index].belong_data = [];
      this.ship_selected_data.forEach((data, index) => {
      this.product_inbound_data[this.inbound_index].belong_data.push(data);
        if(index === 0){
          this.product_inbound_data[this.inbound_index].ship_code = data.code
        }else{
          this.product_inbound_data[this.inbound_index].ship_code = this.product_inbound_data[this.inbound_index].ship_code + "/" + data.code
        }
        for(let i=0; i<data.belong_data.length; i++){
          unit_price += data.belong_data[i].unit_price * data.belong_data[i].ship_num;
        }
      })
      if(this.product_inbound_data[this.inbound_index].inbound_num){
        this.product_inbound_data[this.inbound_index].unit_price = Number(unit_price / this.product_inbound_data[this.inbound_index].inbound_num).toLocaleString();
      }
      this.product_inbound_data[this.inbound_index].dont_select_ship = false;
      this.close();
    },
    calcUnitPrice(item){
      if(item.belong_data){
        let unit_price = 0;
        item.belong_data.forEach(data => {
          for(let i=0; i<data.belong_data.length; i++){
            unit_price += data.belong_data[i].unit_price * data.belong_data[i].ship_num;
          }
        })
        item.unit_price = Number(unit_price / item.inbound_num).toLocaleString();
      }
    },
    changeType(item){
      if(item.type === '원부자재'){
        item.spec = '';
        item._code = 'PE-';
      } else if(item.type === '반제품'){
        item.spec = '000V 000kW 00Hz 0Level'
        let classification = item.classification.split('-');
        let model = item.model.replace(/ /g,'_');
        let manufacturer = item.manufacturer.split('-');
        let v_info = item.spec.split(' ');
        let spec = v_info[0] + v_info[1].replace('kW','K') + v_info[2].replace('Hz','H') + v_info[3].replace('Level','L');
        if(item.code_type === 'with_type'){
          item._code = 'PE-' + classification[classification.length-1] + '-' + manufacturer[manufacturer.length-1] + '-' + spec;
        }else if(item.code_type === 'with_model'){
          item._code = 'PE-' + model + '-' + manufacturer[manufacturer.length-1] + '-' + spec;
        }
      }
      else if(item.type === '완제품'){
        item.spec = '000V 000kW 00Hz 0Level'
        let model = item.model.replace(/ /g,'_');
        let v_info = item.spec.split(' ');
        let spec = v_info[0] + v_info[1].replace('kW','K') + v_info[2].replace('Hz','H') + v_info[3].replace('Level','L');

        item._code = 'PE-' + model + '-' + spec;
      }

      // else{
      //   item.spec = '000V 000kW 00Hz 0Level'
      //   item._code = 'PE-';
      // }
    },
    setCode(item){
      if(item.type === '원부자재'){
        let classification = item.classification.split('-');
        item._code = 'PE-' + classification[classification.length-1];
      }
      else if(item.type === '반제품'){
        let classification = item.classification.split('-');
        let model = item.model.replace(/ /g,'_');
        let manufacturer = item.manufacturer.split('-');
        let v_info = item.spec.split(' ');
        let spec = v_info[0] + v_info[1].replace('kW','K') + v_info[2].replace('Hz','H') + v_info[3].replace('Level','L');
        if(item.code_type === 'with_type'){
          item._code = 'PE-' + classification[classification.length-1] + '-' + manufacturer[manufacturer.length-1] + '-' + spec;
        }else if(item.code_type === 'with_model'){
          item._code = 'PE-' + model + '-' + manufacturer[manufacturer.length-1] + '-' + spec;
        }
      }
      else if(item.type === '완제품'){
        let model = item.model.replace(/ /g,'_');
        let v_info = item.spec.split(' ');
        let spec = v_info[0] + v_info[1].replace('kW','K') + v_info[2].replace('Hz','H') + v_info[3].replace('Level','L');

        item._code = 'PE-' + model + '-' + spec;
      }
    },
  },

  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
    pricePermission(){
      const permission_group_ids = this.$cookies.get(this.$configJson.cookies.permission_group_ids.key).split(',');
      if (permission_group_ids.some(id => this.$configJson.pricePermissionGroupIds.includes(id))){
        return true;
      }else {
        return false;
      }
    }
  },
}
</script>
<style lang="">

</style>
