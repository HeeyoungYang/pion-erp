<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :backDataMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row justify="center">
        <v-col cols="12" sm="11">
          <v-tabs
            v-model="tab_main"
            background-color="transparent"
          >
            <v-tab
              v-for="item in tab_items"
              :key="item"
            >
              {{ item }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab_main" class="pb-1">
            <!-- ▼ 원부자재 정보 -->
            <v-tab-item>
              <v-row justify="center">
                <v-col cols="12">
                  <v-card
                  elevation="1"
                  >

                    <v-card-text class=" pt-3">
                      <v-row>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-autocomplete
                            v-model="material_classification"
                            :items="classification_list"
                            dense
                            clearable
                            filled
                            hide-details
                            label="분류"
                          ></v-autocomplete>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-autocomplete
                            v-model="material_condition"
                            :items="condition_list"
                            dense
                            clearable
                            filled
                            hide-details
                            label="상태"
                          ></v-autocomplete>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-text-field
                            v-model="material_code"
                            dense
                            clearable
                            filled
                            hide-details
                            label="관리코드"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-text-field
                            v-model="material_name"
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
                            v-model="material_model"
                            dense
                            clearable
                            filled
                            hide-details
                            label="모델명"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-text-field
                            v-model="material_spec"
                            dense
                            clearable
                            filled
                            hide-details
                            label="사양"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-text-field
                            v-model="material_manufacturer"
                            dense
                            clearable
                            filled
                            hide-details
                            label="제조사"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="dates"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="dateRangeText"
                                dense
                                clearable
                                filled
                                hide-details
                                label="입고일자"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="material_inbound_dates"
                              no-title
                              scrollable
                              range
                            >
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                color="primary"
                                @click="menu = false"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.menu.save(material_inbound_dates)"
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                          offset-lg="9"
                        >
                          <v-row>
                            <v-col
                              cols="6"
                              sm="6"
                              lg="6"
                            >
                              <v-checkbox
                                v-model="material_stock_more_0"
                                label="재고 > 0"
                              ></v-checkbox>
                            </v-col>
                            <v-col
                              cols="6"
                              sm="6"
                              lg="6"
                              align-self="center"
                            >
                              <v-btn
                                color="primary"
                                elevation="2"
                                style="float:right"
                              >
                                <v-icon>mdi-magnify</v-icon>검색
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>

                      <v-row>

                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <v-card elevation="1">
                    <v-card-title style="width:100%;">
                      <v-row>
                        <v-col
                          cols="12"
                          sm="6"
                          align-self="center"
                        >
                          <v-chip
                            class="mr-2"
                            color="indigo"
                            text-color="white"
                          >
                            총 금액 :
                          </v-chip>
                        </v-col>

                        <v-col
                          cols="12"
                          sm="6"
                          align-self="center"
                        >
                          <v-btn color="primary" small outlined class="mb-2 float-right" @click="dialog_excel = true">엑셀 업로드</v-btn>
                          <v-btn color="success" small class="mb-2 mr-2 float-right" @click="material_dialog = true">등록</v-btn>
                          <!-- ▼ 엑셀 업로드 Modal -->
                          <ModalDialogComponent
                            :dialog-value="dialog_excel"
                            title-class="white"
                            max-width="70%"
                            :dialog-transition="'slide-x-transition'"
                            :dialog-custom="'custom-dialog elevation-0 white'"
                            :card-elevation="'0'"
                            :hide-overlay="true"
                            :persistent="true"
                          >
                            <v-container>
                              <v-row>
                                <v-col
                                  cols="12"
                                  sm="8"
                                >
                                  <v-file-input
                                    small-chips
                                    filled
                                    dense
                                    hide-details
                                    label="엑셀 불러오기"
                                  ></v-file-input>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="4"
                                  align-self="center"
                                >
                                <v-btn color="primary" small class="mr-2" @click="save">양식</v-btn>
                                <v-btn color="success" small class="mr-2" @click="save">등록</v-btn>
                                <v-btn color="default" small class="mr-2" @click="close">취소</v-btn>
                                </v-col>
                                <v-col cols="12">
                                  <DataTableComponent
                                    :headers="material_headers"
                                    dense
                                  />
                                </v-col>
                              </v-row>
                            </v-container>
                          </ModalDialogComponent>

                          <!-- 원부자재 등록 Modal -->
                            <ModalDialogComponent
                              :dialog-value="material_dialog"
                              max-width="30%"
                              title-class=" "
                              :dialog-transition="'slide-x-transition'"
                              :dialog-custom="'custom-dialog elevation-0 white'"
                              :card-elevation="'0'"
                              :hide-overlay="true"
                              :persistent="true"
                            >
                              <v-container>
                                <!-- 모달 내용 구성 -->
                                <v-row>
                                  <v-col
                                    cols="12"
                                  >
                                    <v-btn
                                      color="success"
                                      small
                                      class="mr-2"
                                      elevation="2"
                                      @click="save"
                                    >
                                      저장
                                    </v-btn>
                                    <v-btn
                                      color="default"
                                      small
                                      class="mr-2"
                                      elevation="2"
                                      @click="close"
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
                                  <v-col
                                    cols="12"
                                    sm="6"
                                  >
                                    <v-text-field
                                      v-model="editedMaterialItem.product_classification"
                                      label="분류"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                  >
                                    <v-text-field
                                      v-model="editedMaterialItem.material_code"
                                      label="관리코드"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                  >
                                    <v-text-field
                                      v-model="editedMaterialItem.product_name"
                                      label="자재명"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                  >
                                    <v-text-field
                                      v-model="editedMaterialItem.product_model"
                                      label="모델명"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                  >
                                    <v-text-field
                                      v-model="editedMaterialItem.product_spec"
                                      label="사양"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                  >
                                    <v-text-field
                                      v-model="editedMaterialItem.manufacturer"
                                      label="제조사"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                  >
                                    <v-text-field
                                      v-model="editedMaterialItem.product_num"
                                      label="재고 수량"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                  >
                                    <v-text-field
                                      v-model="editedMaterialItem.product_condition"
                                      label="재고 상태"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                  >
                                    <v-text-field
                                      v-model="editedMaterialItem.pe_number"
                                      label="PE No."
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                  >
                                    <v-text-field
                                      v-model="editedMaterialItem.inbound_date"
                                      label="입고일자"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                  >
                                    <v-text-field
                                      v-model="editedMaterialItem.unit_price"
                                      label="단가"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                  >
                                  <v-file-input
                                    small-chips
                                    label="사진"
                                  ></v-file-input>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </ModalDialogComponent>
                        </v-col>
                      </v-row>
                    </v-card-title>

                    <v-divider></v-divider>
                    <v-data-table
                      :headers="material_headers"
                      :items="material_data"
                      actionsSlotName="actions"
                      :edited-item="editedMaterialItem"
                    >
                      <template v-slot:[`item.actions`]="{ item }">
                        <!-- ▼ 수정 아이콘(연필) -->
                        <v-icon small class="mr-2" @click="editItem(item, 'product')">mdi-pencil</v-icon>
                        <!-- ▼ 삭제 아이콘(휴지통) -->
                        <v-icon small @click="deleteItem(item, 'product')">mdi-delete</v-icon>
                      </template>
                    </v-data-table>
                    <ModalDialogComponent
                      :dialog-value="material_dialog_delete"
                      max-width="350px"
                      title-class="text-body-1 font-weight-black"
                      text-class="text-body-2"
                      save-text="삭제"
                      close-text="취소"
                      @save="deleteItemConfirm('product')"
                      @close="closeDelete"
                    >
                      <template v-slot:titleHTML>
                        <p class="mb-0">{{ editedMaterialItem.material_code }}</p>
                        <p class="red--text">자재를 삭제하시겠습니까?</p>
                      </template>
                      삭제 시 복구 불가능합니다.
                    </ModalDialogComponent>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>

            <!-- ▼ 반제품 정보 -->
            <v-tab-item>
              <v-row justify="center">
                <v-col
                  cols="12"
                  sm="12"
                >
                  <v-card
                  elevation="1"
                  >

                    <v-card-text class=" pt-3">
                      <v-row>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-autocomplete
                            v-model="module_classification"
                            :items="classification_list"
                            dense
                            clearable
                            filled
                            hide-details
                            label="분류"
                          ></v-autocomplete>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-autocomplete
                            v-model="module_condition"
                            :items="condition_list"
                            dense
                            clearable
                            filled
                            hide-details
                            label="상태"
                          ></v-autocomplete>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-text-field
                            v-model="module_code"
                            dense
                            clearable
                            filled
                            hide-details
                            label="관리코드"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-text-field
                            v-model="module_name"
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
                            v-model="module_model"
                            dense
                            clearable
                            filled
                            hide-details
                            label="모델명"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-text-field
                            v-model="module_spec"
                            dense
                            clearable
                            filled
                            hide-details
                            label="사양"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-text-field
                            v-model="module_manufacturer"
                            dense
                            clearable
                            filled
                            hide-details
                            label="제조사"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                        >
                          <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="dates"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="dateRangeText"
                                dense
                                clearable
                                filled
                                hide-details
                                label="입고일자"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="dates"
                              no-title
                              scrollable
                              range
                            >
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                color="primary"
                                @click="menu = false"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.menu.save(dates)"
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          lg="3"
                          offset-lg="9"
                        >
                          <v-row>
                            <v-col
                              cols="6"
                              sm="6"
                              lg="6"
                            >
                              <v-checkbox
                                v-model="stock_more_0"
                                label="재고 > 0"
                              ></v-checkbox>
                            </v-col>
                            <v-col
                              cols="6"
                              sm="6"
                              lg="6"
                              align-self="center"
                            >
                              <v-btn
                                color="primary"
                                elevation="2"
                              >
                                <v-icon>mdi-magnify</v-icon>검색
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                  <v-card
                  elevation="1"
                  class="mt-5"
                  >
                    <v-card-text class=" pt-3">
                      <v-row>
                        <v-col
                          cols="12"
                          sm="6"
                          align-self="center"
                        >
                          <v-chip
                            class="mr-2"
                            color="indigo"
                            text-color="white"
                          >
                            총 재고 :
                          </v-chip>
                          <v-chip
                            color="indigo"
                            text-color="white"
                          >
                            총 금액 :
                          </v-chip>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          align-self="center"
                        >
                          <v-btn color="success" small class="mr-2 float-right" @click="module_dialog = true">등록</v-btn>

                          <!-- 반제품 등록 Modal -->
                          <ModalDialogComponent
                            :dialog-value="module_dialog"
                            max-width="70%"
                            title-class=" "
                            :dialog-transition="'slide-x-transition'"
                            :dialog-custom="'custom-dialog elevation-0 white'"
                            :card-elevation="'0'"
                            :hide-overlay="true"
                            :persistent="true"
                          >
                            <v-container>
                              <!-- 모달 내용 구성 -->
                              <v-row>
                                <v-col
                                  cols="12"
                                >
                                  <p class="text-h6 font-weight-black float-left mb-0">반제품 정보 입력</p>
                                  <v-btn
                                    color="success"
                                    small
                                    class="ml-4 float-left"
                                    elevation="2"
                                    @click="save"
                                  >
                                    저장
                                  </v-btn>
                                  <v-btn
                                    color="default"
                                    small
                                    class="ml-2 float-left"
                                    elevation="2"
                                    @click="close"
                                  >
                                    닫기
                                  </v-btn>
                                </v-col>
                              </v-row>

                              <v-row>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.product_classification"
                                    label="분류"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.material_code"
                                    label="관리코드"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.product_name"
                                    label="자재명"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.product_model"
                                    label="모델명"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.product_spec"
                                    label="사양"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.manufacturer"
                                    label="제조사"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.product_num"
                                    label="재고 수량"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.product_condition"
                                    label="재고 상태"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.pe_number"
                                    label="PE No."
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.inbound_date"
                                    label="입고일자"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.unit_price"
                                    label="단가"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                <v-file-input
                                  dense
                                  hide-details
                                  filled
                                  small-chips
                                  label="사진"
                                ></v-file-input>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="12">
                                  <v-btn color="primary" small @click="module_set_material_search = true" v-if="!module_set_material_search">원부자재 선택</v-btn>
                                  <v-btn color="primary" small @click="module_set_material_search = false" v-if="module_set_material_search">선택 닫기</v-btn>
                                </v-col>
                              </v-row>
                              <v-row v-if="module_set_material_search" style="background: #efefef;">
                                <v-col cols="9">
                                  <p class="text-h6 font-weight-black mb-0">원부자재 리스트</p>
                                </v-col>
                                <v-col cols="3">
                                  <v-text-field
                                    v-model="material_search"
                                    append-icon="mdi-magnify"
                                    label="Search"
                                    dense
                                    single-line
                                    hide-details
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                  <DataTableComponent
                                    :headers="module_set_material_headers"
                                    :items="module_set_material_data"
                                    :search="material_search"
                                    show-select
                                  />
                                </v-col>
                              </v-row>
                              <v-divider class="my-7"></v-divider>
                              <v-row>
                                <v-col cols="9" class="pb-0">
                                  <p class="text-h6 font-weight-black mb-0">선택 원부자재</p>
                                </v-col>
                                <v-col cols="12">
                                  <DataTableComponent
                                    :headers="module_set_material_headers"
                                    :items="module_set_material_data"
                                  />
                                </v-col>
                              </v-row>
                            </v-container>
                          </ModalDialogComponent>
                        </v-col>
                        <v-col
                          cols="12"
                        >
                          <DataTableComponent
                              :headers="module_headers"
                              :items="module_data"
                              :item-key="module_data.module_code"
                              hide-default-footer
                              disable-pagination
                              children-key="belong_data"
                              table-style=""
                              editable
                              deletable
                              notEditableBelong
                              @edit="module_dialog = true"
                              @delete="deleteItem"
                          />
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>

            <!-- ▼ 완제품 정보 -->
            <v-tab-item>
              <v-row justify="center">
                <v-col
                  cols="12"
                  sm="12"
                >
                <v-card
                  elevation="1"
                >

                  <v-card-text class=" pt-3">
                    <v-row>
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
                          v-model="search_complete_product_capacity"
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
                        >
                          <v-icon>mdi-magnify</v-icon>검색
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <div>
                  <ExpansionPanelComponent
                    :data="complete_product_data"
                    elevation="1"
                    class="mt-5"
                    multiple>

                    <template v-slot:header="{ data }">
                      <p
                        class="text-h6 font-weight-black mb-0"
                        item-align-center
                      >
                        {{ data.complete_product_name }} ({{ data.product_capacity }})
                        <span
                          class="text-body-1 font-weight-bold black--text ml-2"
                          item-align-center
                        >
                          : {{ data.complete_product_code }}
                        </span>
                      </p>

                    </template>
                    <template v-slot:content="{ data }">
                      <v-divider class="mb-4"></v-divider>
                      <v-row>
                        <v-col
                          cols="12"
                          sm="6"
                          align-self="center"
                        >
                          <v-chip
                            color="indigo"
                            text-color="white"
                          >
                            총 금액 :
                          </v-chip>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          align-self="center"
                        >
                          <v-btn color="blue-grey darken-1" small class="mr-2 float-right white--text" @click="complete_product_dialog_delete = true">완제품 삭제</v-btn>
                          <v-btn color="primary" small class="mr-2 float-right" @click="complete_product_dialog = true">수정</v-btn>
                          <v-btn color="success" small class="mr-2 float-right" @click="complete_product_dialog = true">등록</v-btn>

                          <!-- 완제품 등록 Modal -->
                          <ModalDialogComponent
                            :dialog-value="complete_product_dialog"
                            max-width="70%"
                            title-class=" "
                            :dialog-transition="'slide-x-transition'"
                            :dialog-custom="'custom-dialog elevation-0 white'"
                            :card-elevation="'0'"
                            :hide-overlay="true"
                            :persistent="true"
                          >
                            <v-container>
                              <!-- 모달 내용 구성 -->
                              <v-row>
                                <v-col
                                  cols="12"
                                >
                                  <p class="text-h6 font-weight-black float-left mb-0">완제품 정보 입력</p>
                                  <v-btn
                                    color="success"
                                    small
                                    class="ml-4 float-left"
                                    elevation="2"
                                    @click="save"
                                  >
                                    저장
                                  </v-btn>
                                  <v-btn
                                    color="default"
                                    small
                                    class="ml-2 float-left"
                                    elevation="2"
                                    @click="close"
                                  >
                                    닫기
                                  </v-btn>
                                </v-col>
                              </v-row>

                              <v-row>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.product_classification"
                                    label="분류"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.material_code"
                                    label="완제품 코드"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.product_name"
                                    label="완제품명"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.product_model"
                                    label="모델명"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.product_spec"
                                    label="사양"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.manufacturer"
                                    label="제조사"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.product_num"
                                    label="재고 수량"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.product_condition"
                                    label="재고 상태"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.pe_number"
                                    label="PE No."
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.inbound_date"
                                    label="입고일자"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                  <v-text-field
                                    dense
                                    hide-details
                                    filled
                                    v-model="editedMaterialItem.unit_price"
                                    label="단가"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="3"
                                >
                                <v-file-input
                                  dense
                                  hide-details
                                  filled
                                  small-chips
                                  label="사진"
                                ></v-file-input>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="12">
                                  <v-btn color="primary" small @click="module_set_material_search = true" v-if="!module_set_material_search">반제품/원부자재 선택</v-btn>
                                  <v-btn color="primary" small @click="module_set_material_search = false" v-if="module_set_material_search">선택 닫기</v-btn>
                                </v-col>
                              </v-row>
                              <v-row v-if="module_set_material_search" style="background: #efefef;">
                                <v-col cols="12" sm="2">
                                  <v-select
                                    dense
                                    hide-details
                                    :items="['반제품', '원부자재']"
                                    v-model="select_product_type"
                                  ></v-select>
                                </v-col>
                                <v-col cols="12" sm="7">
                                  <p class="text-h6 font-weight-black mb-0">리스트</p>
                                </v-col>
                                <v-col cols="12" sm="3">
                                  <v-text-field
                                    v-model="material_search"
                                    append-icon="mdi-magnify"
                                    label="Search"
                                    dense
                                    single-line
                                    hide-details
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                  <DataTableComponent
                                    :headers="module_set_material_headers"
                                    :items="module_set_material_data"
                                    :search="material_search"
                                    show-select
                                  />
                                </v-col>
                              </v-row>
                              <v-divider class="my-7"></v-divider>
                              <v-row>
                                <v-col cols="9" class="pb-0">
                                  <p class="text-h6 font-weight-black mb-0">선택 자재</p>
                                </v-col>
                                <v-col cols="12">
                                  <DataTableComponent
                                    :headers="module_set_material_headers"
                                    :items="module_set_material_data"
                                  />
                                </v-col>
                              </v-row>
                            </v-container>
                          </ModalDialogComponent>

                          <!-- 완제품 삭제 Dialog -->
                          <ModalDialogComponent
                            :dialog-value="complete_product_dialog_delete"
                            max-width="500px"
                            title-class="text-body-1 font-weight-black"
                            text-class="text-body-2"
                            save-text="삭제"
                            close-text="취소"
                            @save="deleteItemConfirm('product')"
                            @close="closeDelete"
                          >
                            <template v-slot:titleHTML>
                              <p class="mb-0">{{ complete_product_data.complete_product_code }}</p>
                              <p class="red--text">완제품을 삭제하시겠습니까?</p>
                            </template>
                            삭제 시 복구 불가능합니다.
                          </ModalDialogComponent>
                        </v-col>
                        <v-col
                          cols="12"
                        >
                        <DataTableComponent
                            :headers="complete_product_headers"
                            :items="data.product_info"
                            :item-key="data.product_info.complete_product_code"
                            hide-default-footer
                            disable-pagination
                            children-key="belong_data"
                            table-style=""
                          />
                        </v-col>
                      </v-row>
                    </template>
                  </ExpansionPanelComponent>
                </div>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>

<script>
import NavComponent from "@/components/NavComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent";
import DataTableComponent from "@/components/DataTableComponent.vue";
import ExpansionPanelComponent from "@/components/ExpansionPanelComponent.vue";

export default {
  components: {
    NavComponent,
    ModalDialogComponent,
    DataTableComponent,
    ExpansionPanelComponent,
  },
  data() {
    return {
      tab_main: null,
      tab_items:['원부자재 정보', '반제품 정보', '완제품 정보'],
      dialog_excel: false,

      material_search: '',

      material_dialog: false,
      material_dialog_delete: false,

      module_dialog: false,
      module_dialog_delete: false,

      complete_product_dialog: false,
      complete_product_dialog_delete: false,

      select_product_type: '반제품',
      classification_list: ['All', '일반', 'GFM', '전력변환기'],
      condition_list: ['All', 'G', 'B'],

      material_classification:'All',
      material_code: '',
      material_name: '',
      material_model: '',
      material_spec: '',
      material_manufacturer: '',
      material_condition: 'All',
      material_inbound_date: '2024-03-11',
      material_stock_more_0: true,
      material_inbound_dates: [],
      module_set_material_search: false,

      module_classification:'All',
      module_code: '',
      module_name: '',
      module_model: '',
      module_spec: '',
      module_manufacturer: '',
      module_condition: 'All',
      module_inbound_date: '2024-03-11',
      module_stock_more_0: true,

      menu: false,
      material_headers: [
        { text: '분류', align: 'center', value: 'product_classification', },
        { text: '관리코드', align: 'center', value: 'material_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '재고', align: 'center', value: 'product_num', },
        { text: '상태', align: 'center', value: 'product_condition', },
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '입고일자', align: 'center', value: 'inbound_date', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'stock_price', },
        { text: '', align: 'center', value: 'actions', },
      ],
      material_data: [],
      editedMaterialIndex: -1,
      editedMaterialItem: {
        product_classification:'',
        material_code: '',
        product_name: '',
        product_model: '',
        product_spec: '',
        manufacturer: '',
        product_num: '',
        product_condition: '',
        pe_number: '',
        inbound_date: '',
        unit_price: '',
      },
      defaultMaterialItem: {
        product_classification:'',
        material_code: '',
        product_name: '',
        product_model: '',
        product_spec: '',
        manufacturer: '',
        product_num: '',
        product_condition: '',
        pe_number: '',
        inbound_date: '',
        unit_price: '',
      },

      module_headers: [
        { text: '', align: 'center', value: '', },
        { text: '분류', align: 'center', value: 'product_classification', },
        { text: '관리코드', align: 'center', value: 'module_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '필요수량', align: 'center', value: 'material_num', },
        { text: '재고', align: 'center', value: 'product_num', },
        { text: '상태', align: 'center', value: 'product_condition', },
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '입고일자', align: 'center', value: 'inbound_date', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'stock_price', },
      ],

      module_set_material_headers: [
        { text: '분류', align: 'center', value: 'product_classification', },
        { text: '관리코드', align: 'center', value: 'material_code', },
        { text: '자재명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '필요수량', align: 'center', value: 'material_num', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'stock_price', },
      ],

      complete_product_headers: [
        { text: '', align: 'center', value: '', },
        { text: '제품코드', align: 'center', value: 'complete_product_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '필요수량', align: 'center', value: 'product_num', },
        { text: '재고', align: 'center', value: 'stock_num', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'product_price', },
      ],
      module_set_material_data:[],
      module_data: [
        {
          product_classification: 'GFM',
          module_code: '공장2F_E-01-01',
          product_name: 'PCS Ass`Y',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          product_num: '1',
          material_num: '',
          stock_num: '',
          product_condition: '',
          pe_number: '',
          inbound_date: '',
          unit_price: '',
          product_price: '',
          belong_data:[
            {
              product_classification: 'GFM',
              module_code: '공장2F_E-09-01',
              product_name: 'IGBT & SMPS',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '10',
              material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              product_classification: 'GFM',
              module_code: '공장2F_E-09-02',
              product_name: 'SPD, 퓨즈',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '10',
              material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              product_classification: 'GFM',
              module_code: '공장2F_E-09-03',
              product_name: '쿨링팬',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '10',
              material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              product_classification: 'GFM',
              module_code: '공장2F_E-09-04',
              product_name: '보호회로',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '10',
              material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              product_classification: 'GFM',
              module_code: '공장2F_E-09-05',
              product_name: '리액터',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '10',
              material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              product_classification: 'GFM',
              module_code: '공장2F_E-09-06',
              product_name: 'MCCB',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '10',
              material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              product_classification: 'GFM',
              module_code: '공장2F_E-09-07',
              product_name: 'EMC',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '10',
              material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              product_classification: 'GFM',
              module_code: '공장2F_E-09-08',
              product_name: 'DC Capacitor',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '10',
              material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              product_classification: 'GFM',
              module_code: '공장2F_E-09-09',
              product_name: '외함 및 기구',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '10',
              material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
          ]
        },
        {
          product_classification: 'GFM',
          module_code: '공장2F_E-02-01',
          product_name: '제어기 Ass`Y',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          product_num: '1',
          material_num: '',
          stock_num: '',
          product_condition: '',
          pe_number: '',
          inbound_date: '',
          unit_price: '',
          product_price: '',
          belong_data:
          [
            {
              product_classification: 'GFM',
              module_code: '공장2F_E-09-11',
              product_name: '제어기(LK11)',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '10',
              material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              product_classification: 'GFM',
              module_code: '공장2F_E-09-12',
              product_name: '인터페이스보드',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '10',
              material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              product_classification: 'GFM',
              module_code: '공장2F_E-09-13',
              product_name: 'SMPS(15VDC)',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '10',
              material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              product_classification: 'GFM',
              module_code: '공장2F_E-09-14',
              product_name: 'SMPS Bracket',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '10',
              material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              product_classification: 'GFM',
              module_code: '공장2F_E-09-15',
              product_name: 'HMI PC',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '10',
              material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              product_classification: 'GFM',
              module_code: '공장2F_E-09-16',
              product_name: 'PLC',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '10',
              material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              product_classification: 'GFM',
              module_code: '공장2F_E-09-17',
              product_name: '통신케이블',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '10',
              material_num: '1',
              stock_num: '',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
          ]
        },
      ],
      complete_product_data: [
        {
          complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1',
          complete_product_name: 'ESS GFM용 PCS',
          product_capacity: '380VAC 500kW',
          id:'380vac_500kW',
          button_toggle:true,
          product_info: [
            {
              complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01',
              product_name: 'PCS Ass`Y',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '1',
              stock_num: '10',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
              belong_data:[
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-01',
                  product_name: 'IGBT & SMPS',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '10',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-04',
                  product_name: 'SPD, 퓨즈',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '10',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-05',
                  product_name: '쿨링팬',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '10',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-06',
                  product_name: '보호회로',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '10',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-07',
                  product_name: '리액터',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '10',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-08',
                  product_name: 'MCCB',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '10',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-09',
                  product_name: 'EMC',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '10',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-10',
                  product_name: 'DC Capacitor',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '10',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-11',
                  product_name: '외함 및 기구',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '10',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
              ]
            },
            {
              complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02',
              product_name: '제어기 Ass`Y',
              product_model: '',
              product_spec: '',
              manufacturer: '파이온일렉트릭',
              product_num: '1',
              stock_num: '10',
              product_condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
              belong_data:
              [
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-01',
                  product_name: '제어기(LK11)',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '10',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-02',
                  product_name: '인터페이스보드',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '10',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-03',
                  product_name: 'SMPS(15VDC)',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '10',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-04',
                  product_name: 'SMPS Bracket',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '10',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-05',
                  product_name: 'HMI PC',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '10',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-06',
                  product_name: 'PLC',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '10',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  complete_product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-07',
                  product_name: '통신케이블',
                  product_model: '',
                  product_spec: '',
                  manufacturer: '파이온일렉트릭',
                  product_num: '1',
                  stock_num: '10',
                  product_condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
              ]
            },
          ],
        },
      ],
    }
  },

  computed: {
    formTitle () {
      return this.editedMaterialIndex === -1 ? '등록' : '수정'
    },
    formDisabled () {
      return this.editedMaterialIndex === -1 ? false : true
    },
    dateRangeText () {
      return this.material_inbound_dates.join(' ~ ')
    },
  },

  watch: {
    material_dialog (val) {
      val || this.close()
    },
    material_dialog_delete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    openDialog(){
      this.module_dialog = true
    },
    initialize () {
      this.material_data = [
      {
          product_classification:'일반',
          material_code: '공장2F_E-09-01',
          product_name: 'IGBT & SMPS',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          product_num: '1',
          product_condition: 'G',
          pe_number: '',
          inbound_date: '2024-03-11',
          unit_price: '',
          product_price: '',
        },
        {
          product_classification:'일반',
          material_code: '공장2F_E-09-02',
          product_name: 'SPD, 퓨즈',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          product_num: '1',
          product_condition: 'G',
          pe_number: '',
          inbound_date: '2024-03-11',
          unit_price: '',
          product_price: '',
        },
        {
          product_classification:'일반',
          material_code: '공장2F_E-09-03',
          product_name: '쿨링팬',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          product_num: '1',
          product_condition: 'G',
          pe_number: '',
          inbound_date: '2024-03-11',
          unit_price: '',
          product_price: '',
        },
        {
          product_classification:'일반',
          material_code: '공장2F_E-09-05',
          product_name: '보호회로',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          product_num: '1',
          product_condition: 'G',
          pe_number: '',
          inbound_date: '2024-03-11',
          unit_price: '',
          product_price: '',
        },
        {
          product_classification:'일반',
          material_code: '공장2F_E-09-06',
          product_name: '리액터',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          product_num: '1',
          product_condition: 'G',
          pe_number: '',
          inbound_date: '2024-03-11',
          unit_price: '',
          product_price: '',
        },
        {
          product_classification:'일반',
          material_code: '공장2F_E-09-07',
          product_name: 'MCCB',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          product_num: '1',
          product_condition: 'G',
          pe_number: '',
          inbound_date: '2024-03-11',
          unit_price: '',
          product_price: '',
        },
      ]
    },

    editItem (item, type) {
      if(type == 'product'){
        this.editedMaterialIndex = this.material_data.indexOf(item)
        this.editedMaterialItem = Object.assign({}, item)
      }
      this.material_dialog = true
    },

    deleteItem (item, type) {
      if(type == 'product'){
        this.editedMaterialIndex = this.material_data.indexOf(item)
        this.editedMaterialItem = Object.assign({}, item)
      }
      this.material_dialog_delete = true
    },

    deleteItemConfirm (type) {
      if(type == 'product'){
        this.material_data.splice(this.editedMaterialIndex, 1)
      }
      this.closeDelete()
    },

    close () {
      this.material_dialog = false
      this.module_dialog = false
      this.complete_product_dialog = false
      this.dialog_excel = false
      this.$nextTick(() => {
        this.editedMaterialItem = Object.assign({}, this.defaultMaterialItem)
        this.editedMaterialIndex = -1
      })
    },

    closeDelete () {
      this.material_dialog_delete = false
      this.module_dialog_delete = false
      this.complete_product_dialog_delete = false
      this.dialog_excel = false
      this.$nextTick(() => {
        this.editedMaterialItem = Object.assign({}, this.defaultMaterialItem)
        this.editedMaterialIndex = -1
      })
    },

    save () {
      if (this.editedMaterialIndex > -1) {
        Object.assign(this.material_data[this.editedMaterialIndex], this.editedMaterialItem)
      } else {
        this.material_data.push(this.editedMaterialItem)
      }
      this.close()
    },
  },
}
</script>

<style lang="">

</style>
