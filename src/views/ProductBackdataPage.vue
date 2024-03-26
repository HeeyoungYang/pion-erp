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
                      :inputs="searchMaterialCardInputs"
                    >
                      <v-col
                        cols="12"
                        sm="4"
                        lg="3"
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
                              @click="searchMaterialButton"
                            >
                              <v-icon>mdi-magnify</v-icon>검색
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </InputsFormComponent>
                  </CardComponent>
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
                                  sm="4"
                                >
                                  <v-file-input
                                    small-chips
                                    filled
                                    dense
                                    hide-details
                                    label="엑셀 불러오기"
                                    prepend-icon=""
                                    append-icon="mdi-paperclip"
                                    @change="loadExcelFile"
                                  ></v-file-input>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="4"
                                >
                                  <v-file-input
                                    filled
                                    dense
                                    hide-details
                                    multiple
                                    label="사진 첨부(.jpg, .png, .jpeg)"
                                    prepend-icon=""
                                    append-icon="mdi-image"
                                    accept=".png, .jpg, .jpeg"
                                    @change="loadExcelFile"
                                  ></v-file-input>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="4"
                                  align-self="center"
                                >
                                <v-btn color="primary" small class="mr-2" href="/forms/원부자재_엑셀업로드_양식.xlsx" download >양식</v-btn>
                                <v-btn color="success" small class="mr-2" @click="save">등록</v-btn>
                                <v-btn color="default" small class="mr-2" @click="close">취소</v-btn>
                                </v-col>
                                <v-col cols="12">
                                  <DataTableComponent
                                    :headers="material_headers"
                                    :items="material_excel_upload_data"
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
                                      @click="uploadMaterial"
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

                                <InputsFormComponent
                                  clearable
                                  :filled="false"
                                  :outlined="false"
                                  :inputs="registMaterialInputs"
                                >

                                <v-col cols="12" sm="2">
                                  <v-menu
                                    open-on-hover
                                    :close-on-content-click="false"
                                    :nudge-width="100"
                                    offset-x
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <div
                                        v-bind="attrs"
                                        v-on="on"
                                      >
                                        <v-file-input
                                          dense
                                          hide-details
                                          filled
                                          label=" "
                                          v-model="editedMaterialItem.photo"
                                          hide-input
                                          prepend-icon="mdi-image"
                                          accept=".png, .jpg, .jpeg"
                                        ></v-file-input>
                                      </div>
                                    </template>

                                    <v-card class="pa-0">
                                      <v-list class="pa-0">
                                        <v-list-item class="pa-0">
                                          <v-list-item-content class="pa-3">
                                            <v-list-item-subtitle>
                                              자재 이미지
                                            </v-list-item-subtitle>
                                          </v-list-item-content>
                                        </v-list-item>
                                      </v-list>
                                    </v-card>
                                  </v-menu>
                                </v-col>
                                </InputsFormComponent>
                              </v-container>
                            </ModalDialogComponent>
                        </v-col>
                      </v-row>
                    </v-card-title>

                    <v-divider></v-divider>

                    <DataTableComponent
                      :headers="material_headers"
                      :items="material_data"
                      show-photo
                      editable
                      deletable
                      dense
                      @edit="editItem"
                      @delete="deleteItem"
                    />
                    <ModalDialogComponent
                      :dialog-value="material_dialog_delete"
                      max-width="350px"
                      title-class="text-body-1 font-weight-black"
                      text-class="text-body-2"
                      save-text="삭제"
                      close-text="취소"
                      @save="deleteItemConfirm"
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
                      :inputs="searchModuleCardInputs"
                    >
                      <v-col
                        cols="12"
                        sm="4"
                        lg="3"
                      >
                        <v-row>
                          <v-col
                            cols="6"
                            sm="6"
                            lg="6"
                          >
                            <v-checkbox
                              v-model="module_stock_more_0"
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
                              @click="searchButton"
                            >
                              <v-icon>mdi-magnify</v-icon>검색
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </InputsFormComponent>
                  </CardComponent>

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
                          <v-btn color="success" small class="mr-2 float-right" @click="registModule">등록</v-btn>

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
                                    v-model="newModuleItem.classification"
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
                                    v-model="newModuleItem.module_code"
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
                                    v-model="newModuleItem.name"
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
                                    v-model="newModuleItem.model"
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
                                    v-model="newModuleItem.spec"
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
                                    v-model="newModuleItem.manufacturer"
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
                                    v-model="newModuleItem.stock_num"
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
                                    v-model="newModuleItem.condition"
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
                                    v-model="newModuleItem.pe_number"
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
                                    v-model="newModuleItem.unit_price"
                                    label="단가"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="1"
                                >

                                <v-menu
                                    open-on-hover
                                    :close-on-content-click="false"
                                    :nudge-width="100"
                                    offset-x
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <div
                                        v-bind="attrs"
                                        v-on="on"
                                      >
                                        <v-file-input
                                          dense
                                          hide-details
                                          filled
                                          label=" "
                                          v-model="newModuleItem.photo"
                                          hide-input
                                          prepend-icon="mdi-image"
                                          accept=".png, .jpg, .jpeg"
                                        ></v-file-input>
                                      </div>
                                    </template>

                                    <v-card class="pa-0">
                                      <v-list class="pa-0">
                                        <v-list-item class="pa-0">
                                          <v-list-item-content class="pa-3">
                                            <v-list-item-subtitle>
                                              <v-img
                                                alt="Pionelectric Logo"
                                                class="shrink mr-2"
                                                contain
                                                src="https://mkorbucket-public.s3.ap-northeast-2.amazonaws.com/warehouse.jpg"
                                                transition="scale-transition"
                                              />
                                            </v-list-item-subtitle>
                                          </v-list-item-content>
                                        </v-list-item>
                                      </v-list>
                                    </v-card>
                                  </v-menu>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="12">
                                  <v-btn color="primary" small @click="set_material_search = true" v-if="!set_material_search">원부자재 선택</v-btn>
                                </v-col>
                              </v-row>
                              <v-row v-if="set_material_search" style="background: #efefef;">
                                <v-col cols="9">
                                  <p class="text-h6 font-weight-black mb-0">원부자재 리스트</p>
                                </v-col>
                                <v-col cols="12">
                                  <InputsFormComponent
                                    dense
                                    clearable
                                    hide-details
                                    :inputs="moduleSearchMaterialInputs"
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
                                        @click="searchButton"
                                      >
                                        검색
                                      </v-btn>
                                      <v-btn color="default" small @click="set_material_search = false" v-if="set_material_search">
                                        원부자재 선택 닫기
                                      </v-btn>
                                    </v-col>
                                  </InputsFormComponent>
                                </v-col>
                                <v-col cols="12">
                                  <DataTableComponent
                                    :headers="module_search_material_headers"
                                    :items="search_material_for_module_data"
                                    :v-model="module_set_material_data"
                                    show-select
                                    dense
                                  />
                                </v-col>
                              </v-row>
                              <v-divider class="my-7"></v-divider>
                              <v-row>
                                <v-col cols="12" class="pb-0">
                                  <p class="text-h6 font-weight-black mb-0">선택 원부자재 <v-btn x-small color="error" class="ml-4" @click="resetData('module')">비우기</v-btn></p>
                                </v-col>
                                <v-col cols="12">
                                  <!-- <DataTableComponent
                                    :headers="module_set_material_headers"
                                    :items="module_set_material_data"
                                    dense
                                  /> -->
                                  <v-data-table
                                    :headers="module_set_material_headers"
                                    :items="module_set_material_data"
                                    item-key="module_code"
                                    dense
                                  >
                                    <template v-slot:item="{ item }">
                                      <tr>
                                        <td align="center">{{ item.classification }}</td>
                                        <td align="center">{{ item.module_code }}</td>
                                        <td align="center">{{ item.name }}</td>
                                        <td align="center">{{ item.model }}</td>
                                        <td align="center">{{ item.spec }}</td>
                                        <td align="center">{{ item.manufacturer }}</td>
                                        <td align="center">
                                          <v-text-field
                                            dense
                                            hide-details
                                            v-model="item.material_num"
                                            style="width:100px;font-size: 0.775rem !important;"
                                            type="number"
                                            filled
                                          ></v-text-field>
                                        </td>
                                        <td align="center">{{ item.unit_price }}</td>
                                        <td align="center">{{ item.unit_price * item.material_num }}</td>
                                      </tr>
                                    </template>
                                  </v-data-table>
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
                              dense
                              notEditableBelong
                              @edit="editModule"
                              @delete="deleteItem"
                              show-photo
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
                      :inputs="searchProductCardInputs"
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
                  </CardComponent>

                  <div>
                    <ExpansionPanelComponent
                      :data="product_data"
                      elevation="1"
                      class="mt-5"
                      multiple>

                      <template v-slot:header="{ data }">
                        <p
                          class="text-h6 font-weight-black mb-0"
                          item-align-center
                        >
                          {{ data.name }} ({{ data.spec }})
                          <span
                            class="text-body-1 font-weight-bold black--text ml-2"
                            item-align-center
                          >
                            : {{ data.product_code }}
                          </span>
                          <v-menu
                            open-on-hover
                            :close-on-content-click="false"
                            :nudge-width="100"
                            offset-x
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                small
                                v-bind="attrs"
                                v-on="on"
                              >
                                mdi-image
                              </v-icon>
                            </template>

                            <v-card class="pa-0">
                              <v-list class="pa-0">
                                <v-list-item class="pa-0">
                                  <v-list-item-content class="pa-3">
                                    <v-list-item-subtitle>
                                      제품이미지영역
                                      <v-img
                                        alt="Pionelectric Logo"
                                        class="shrink mr-2"
                                        contain
                                        :src="testImg ? testImg : ''"
                                        transition="scale-transition"
                                        width="150"
                                      />
                                    </v-list-item-subtitle>
                                  </v-list-item-content>
                                </v-list-item>
                              </v-list>
                            </v-card>
                          </v-menu>
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
                            <v-btn color="blue-grey darken-1" small class="mr-2 float-right white--text" @click="product_dialog_delete = true">완제품 삭제</v-btn>
                            <v-btn color="primary" small class="mr-2 float-right" @click="editProduct(data)">수정</v-btn>
                            <v-btn color="success" small class="mr-2 float-right" @click="registProduct">등록</v-btn>

                            <!-- 완제품 등록 Modal -->
                            <ModalDialogComponent
                              :dialog-value="product_dialog"
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
                                      v-model="newProductItem.classification"
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
                                      v-model="newProductItem.product_code"
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
                                      v-model="newProductItem.name"
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
                                      v-model="newProductItem.model"
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
                                      v-model="newProductItem.spec"
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
                                      v-model="newProductItem.manufacturer"
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
                                      v-model="newProductItem.stock_num"
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
                                      v-model="newProductItem.condition"
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
                                      v-model="newProductItem.pe_number"
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
                                      v-model="newProductItem.unit_price"
                                      label="단가"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="1"
                                  >
                                    <v-menu
                                      open-on-hover
                                      :close-on-content-click="false"
                                      :nudge-width="100"
                                      offset-x
                                    >
                                      <template v-slot:activator="{ on, attrs }">
                                        <div
                                          v-bind="attrs"
                                          v-on="on"
                                        >
                                          <v-file-input
                                            dense
                                            hide-details
                                            filled
                                            label=" "
                                            v-model="newProductItem.photo"
                                            hide-input
                                            prepend-icon="mdi-image"
                                            accept=".png, .jpg, .jpeg"
                                          ></v-file-input>
                                        </div>
                                      </template>

                                      <v-card class="pa-0">
                                        <v-list class="pa-0">
                                          <v-list-item class="pa-0">
                                            <v-list-item-content class="pa-3">
                                              <v-list-item-subtitle>
                                                <v-img
                                                  alt="Pionelectric Logo"
                                                  class="shrink mr-2"
                                                  contain
                                                  src="https://mkorbucket-public.s3.ap-northeast-2.amazonaws.com/warehouse.jpg"
                                                  transition="scale-transition"
                                                />
                                              </v-list-item-subtitle>
                                            </v-list-item-content>
                                          </v-list-item>
                                        </v-list>
                                      </v-card>
                                    </v-menu>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12">
                                    <v-btn color="primary" small @click="set_material_search = true" v-if="!set_material_search">자재 선택</v-btn>
                                    <v-btn color="primary" small @click="set_material_search = false" v-if="set_material_search">선택 닫기</v-btn>
                                  </v-col>
                                </v-row>
                                <v-row v-if="set_material_search" style="background: #efefef;">
                                  <v-col cols="12">
                                    <p class="text-h6 font-weight-black mb-0">자재 리스트</p>
                                  </v-col>
                                  <v-col cols="12">
                                    <InputsFormComponent
                                      dense
                                      clearable
                                      filled
                                      hide-details
                                      :inputs="productSearchMaterialModuleInputs"
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
                                          @click="searchButton"
                                        >
                                          검색
                                        </v-btn>
                                        <v-btn color="default" small @click="set_material_search = false" v-if="set_material_search">
                                          자재 선택 닫기
                                        </v-btn>
                                      </v-col>
                                    </InputsFormComponent>
                                  </v-col>
                                  <v-col cols="12">
                                    <DataTableComponent
                                      :headers="product_search_material_headers"
                                      :items="search_material_for_product_data"
                                      :v-model="product_set_material_data"
                                      show-select
                                      dense
                                    />
                                  </v-col>
                                </v-row>
                                <v-divider class="my-7"></v-divider>
                                <v-row>
                                  <v-col cols="9" class="pb-0">
                                    <p class="text-h6 font-weight-black mb-0">선택 자재 <v-btn x-small color="error" class="ml-4" @click="resetData('product')">비우기</v-btn></p>
                                  </v-col>
                                  <v-col cols="12">
                                    <!-- <DataTableComponent
                                      :headers="product_set_material_headers"
                                      :items="product_set_material_data"
                                      dense
                                    /> -->
                                    <v-data-table
                                      :headers="product_set_material_headers"
                                      :items="product_set_material_data"
                                      item-key="product_code"
                                      dense
                                    >
                                      <template v-slot:item="{ item }">
                                        <tr>
                                          <td align="center">{{ item.type }}</td>
                                          <td align="center">{{ item.classification }}</td>
                                          <td align="center">{{ item.product_code }}</td>
                                          <td align="center">{{ item.name }}</td>
                                          <td align="center">{{ item.model }}</td>
                                          <td align="center">{{ item.spec }}</td>
                                          <td align="center">{{ item.manufacturer }}</td>
                                          <td align="center">
                                            <v-text-field
                                              dense
                                              hide-details
                                              v-model="item.module_material_num"
                                              style="width:100px;font-size: 0.775rem !important;"
                                              type="number"
                                              filled
                                            ></v-text-field>
                                          </td>
                                          <td align="center">{{ item.unit_price }}</td>
                                          <td align="center">{{ item.unit_price * item.module_material_num }}</td>
                                        </tr>
                                      </template>
                                    </v-data-table>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </ModalDialogComponent>

                            <!-- 완제품 삭제 Dialog -->
                            <ModalDialogComponent
                              :dialog-value="product_dialog_delete"
                              max-width="500px"
                              title-class="text-body-1 font-weight-black"
                              text-class="text-body-2"
                              save-text="삭제"
                              close-text="취소"
                              @save="deleteItemConfirm"
                              @close="closeDelete"
                            >
                              <template v-slot:titleHTML>
                                <p class="mb-0">{{ product_data.product_code }}</p>
                                <p class="red--text">완제품을 삭제하시겠습니까?</p>
                              </template>
                              삭제 시 복구 불가능합니다.
                            </ModalDialogComponent>
                          </v-col>
                          <v-col
                            cols="12"
                          >
                          <DataTableComponent
                              :headers="product_headers"
                              :items="data.product_info"
                              :item-key="data.product_info.product_code"
                              hide-default-footer
                              disable-pagination
                              children-key="belong_data"
                              table-style=""
                              show-photo
                              dense
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
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import mux from "@/mux";

export default {
  components: {
    NavComponent,
    ModalDialogComponent,
    DataTableComponent,
    ExpansionPanelComponent,
    CardComponent,
    InputsFormComponent,
  },
  data() {
    return {
      mux: mux,
      testImg: '',
      tab_main: null,
      tab_items:['원부자재 정보', '반제품 정보', '완제품 정보'],
      dialog_excel: false,

      material_search: '',
      upload_excel_file: '',

      material_dialog: false,
      material_dialog_delete: false,

      module_dialog: false,
      module_dialog_delete: false,

      product_dialog: false,
      product_dialog_delete: false,

      select_product_type: '반제품',

      material_stock_more_0: true,
      registMaterialInputs:[
        {label:'분류', type:'auto', list:['All', '일반', 'GFM', '전력변환기'], value:'All', col:'12', sm:'6', lg:'6'},
        {label:'관리코드', col:'12', sm:'6', lg:'6', value: ''},
        {label:'자재명', col:'12', sm:'6', lg:'6', value: ''},
        {label:'모델명', col:'12', sm:'6', lg:'6', value: ''},
        {label:'사양', col:'12', sm:'6', lg:'6', value: ''},
        {label:'제조사', col:'12', sm:'6', lg:'6', value: ''},
        {label:'재고수량', col:'12', sm:'6', lg:'6', value: ''},
        {label:'재고상태', type:'auto', col:'12', sm:'6', lg:'6', value:'All', list:['All', 'G', 'B']},
        {label:'PE No.', col:'12', sm:'6', lg:'6', value: ''},
        {label:'단가', col:'12', sm:'6', lg:'6', value: ''},
      ],
      searchMaterialCardInputs:[
        {label:'분류', type:'auto', list:['All', '일반', 'GFM', '전력변환기'], value:'All', col:'12', sm:'4', lg:'3'},
        {label:'상태', type:'auto', col:'12', sm:'4', lg:'3', value:'All', list:['All', 'G', 'B']},
        {label:'관리코드', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제품명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'모델명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'사양', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제조사', col:'12', sm:'4', lg:'3', value: ''},
        // {label:'일자', type:'date', range:true, value:[], col:'12', sm:'4', lg:'3'}
      ],
      module_stock_more_0: true,
      searchModuleCardInputs:[
        {label:'분류', type:'auto', list:['All', '일반', 'GFM', '전력변환기'], value:'All', col:'12', sm:'4', lg:'3'},
        {label:'상태', type:'auto', col:'12', sm:'4', lg:'3', value:'All', list:['All', 'G', 'B']},
        {label:'관리코드', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제품명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'모델명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'사양', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제조사', col:'12', sm:'4', lg:'3', value: ''},
        // {label:'일자', type:'date', range:true, value:[], col:'12', sm:'4', lg:'3'}
      ],
      moduleSearchMaterialInputs:[
        {label:'분류', type:'auto', list:['All', '일반', 'GFM', '전력변환기'], value:'All', col:'12', sm:'4', lg:'3'},
        {label:'관리코드', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제품명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'모델명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'사양', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제조사', col:'12', sm:'4', lg:'3', value: ''},
        // {label:'일자', type:'date', range:true, value:[], col:'12', sm:'4', lg:'3'}
      ],
      searchProductCardInputs:[
        {label:'제품코드', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제품명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'사양', col:'12', sm:'4', lg:'3', value: ''},
      ],
      productSearchMaterialModuleInputs:[
        {label:'종류', type:'auto', list:['All', '원부자재', '반제품'], value:'All', col:'12', sm:'4', lg:'3'},
        {label:'분류', type:'auto', list:['All', '일반', 'GFM', '전력변환기'], value:'All', col:'12', sm:'4', lg:'3'},
        {label:'관리코드', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제품명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'모델명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'사양', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제조사', col:'12', sm:'4', lg:'3', value: ''},
        // {label:'일자', type:'date', range:true, value:[], col:'12', sm:'4', lg:'3'}
      ],
      set_material_search: false,

      menu: false,
      material_headers: [
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: 'material_code', },
        { text: '제품명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '재고', align: 'center', value: 'stock_num', },
        { text: '상태', align: 'center', value: 'condition', },
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'stock_price', },
      ],
      material_data: [],
      material_excel_upload_data: [],
      editedMaterialIndex: -1,
      editedMaterialItem: {
        classification:'',
        material_code: '',
        name: '',
        model: '',
        spec: '',
        manufacturer: '',
        stock_num: '',
        condition: '',
        pe_number: '',
        inbound_date: '',
        unit_price: '',
      },
      defaultMaterialItem: {
        classification:'',
        material_code: '',
        name: '',
        model: '',
        spec: '',
        manufacturer: '',
        stock_num: '',
        condition: '',
        pe_number: '',
        inbound_date: '',
        unit_price: '',
      },
      newModuleItem: {
        classification:'',
        module_code: '',
        name: '',
        model: '',
        spec: '',
        manufacturer: '',
        stock_num: '',
        condition: '',
        pe_number: '',
        unit_price: '',
        photo: '',
      },

      newProductItem: {
        classification:'',
        product_code: '',
        name: '',
        model: '',
        spec: '',
        manufacturer: '',
        stock_num: '',
        condition: '',
        pe_number: '',
        unit_price: '',
        photo: '',
      },
      module_headers: [
        { text: '', align: 'center', value: '', },
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: 'module_code', },
        { text: '제품명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '필요수량', align: 'center', value: 'material_num', },
        { text: '재고', align: 'center', value: 'stock_num', },
        { text: '상태', align: 'center', value: 'condition', },
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'stock_price', },
      ],

      module_search_material_headers: [
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: 'material_code', },
        { text: '자재명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'stock_price', },
      ],
      module_set_material_headers: [
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: 'module_code', },
        { text: '자재명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '필요수량', align: 'center', value: 'material_num', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'stock_price', },
      ],
      module_set_material_data:[],
      search_material_for_module_data:[],

      product_headers: [
        { text: '', align: 'center', value: '', },
        { text: '제품코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '필요수량', align: 'center', value: 'module_material_num', },
        { text: '재고', align: 'center', value: 'stock_num', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'product_price', },
      ],
      product_search_material_headers: [
        { text: '종류', align: 'center', value: 'type', },
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: 'material_code', },
        { text: '자재명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'stock_price', },
      ],
      product_set_material_headers: [
        { text: '종류', align: 'center', value: 'type', },
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '자재명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '필요수량', align: 'center', value: 'material_num', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'stock_price', },
      ],
      product_set_material_data:[],
      search_material_for_product_data:[],
      module_data: [
        {
          classification: 'GFM',
          module_code: '공장2F_E-01-01',
          name: 'PCS Ass`Y',
          model: '',
          spec: '',
          manufacturer: '파이온일렉트릭',
          material_num: '',
          stock_num: '10',
          condition: '',
          pe_number: '',
          inbound_date: '',
          unit_price: '',
          product_price: '',
          belong_data:[
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-01',
              name: 'IGBT & SMPS',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-02',
              name: 'SPD, 퓨즈',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-03',
              name: '쿨링팬',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-04',
              name: '보호회로',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-05',
              name: '리액터',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-06',
              name: 'MCCB',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-07',
              name: 'EMC',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-08',
              name: 'DC Capacitor',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-09',
              name: '외함 및 기구',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
          ]
        },
        {
          classification: 'GFM',
          module_code: '공장2F_E-02-01',
          name: '제어기 Ass`Y',
          model: '',
          spec: '',
          manufacturer: '파이온일렉트릭',
          material_num: '',
          stock_num: '10',
          condition: '',
          pe_number: '',
          inbound_date: '',
          unit_price: '',
          product_price: '',
          belong_data:
          [
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-11',
              name: '제어기(LK11)',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-12',
              name: '인터페이스보드',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-13',
              name: 'SMPS(15VDC)',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-14',
              name: 'SMPS Bracket',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-15',
              name: 'HMI PC',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-16',
              name: 'PLC',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
            {
              classification: 'GFM',
              module_code: '공장2F_E-09-17',
              name: '통신케이블',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
            },
          ]
        },
      ],
      product_data: [
        {
          product_code: 'P-ESS-PC-380V500K60H-RT-24-R1',
          classification: 'GFM',
          model: '완제품모델1',
          manufacturer: '제조사2',
          name: 'ESS GFM용 PCS',
          spec: '380VAC 500kW',
          unit_price: '1000',
          stock_num: '1',
          condition: 'G',
          pe_number: 'PE240101-001',
          id:'380vac_500kW',
          button_toggle:true,
          product_info: [
            {
              type:'반제품',
              classification: '일반',
              product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01',
              name: 'PCS Ass`Y',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              module_material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
              belong_data:[
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-01',
                  name: 'IGBT & SMPS',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '10',
                  condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-04',
                  name: 'SPD, 퓨즈',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '10',
                  condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-05',
                  name: '쿨링팬',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '10',
                  condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-06',
                  name: '보호회로',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '10',
                  condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-07',
                  name: '리액터',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '10',
                  condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-08',
                  name: 'MCCB',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '10',
                  condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-09',
                  name: 'EMC',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '10',
                  condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-10',
                  name: 'DC Capacitor',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '10',
                  condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-01-11',
                  name: '외함 및 기구',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '10',
                  condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
              ]
            },
            {
              product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02',
              classification: '일반',
              type:'반제품',
              name: '제어기 Ass`Y',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              module_material_num: '1',
              stock_num: '10',
              condition: '',
              pe_number: '',
              inbound_date: '',
              unit_price: '',
              product_price: '',
              belong_data:
              [
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-01',
                  name: '제어기(LK11)',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '10',
                  condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-02',
                  name: '인터페이스보드',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '10',
                  condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-03',
                  name: 'SMPS(15VDC)',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '10',
                  condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-04',
                  name: 'SMPS Bracket',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '10',
                  condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-05',
                  name: 'HMI PC',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '10',
                  condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-06',
                  name: 'PLC',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '10',
                  condition: '',
                  pe_number: '',
                  inbound_date: '',
                  unit_price: '',
                  product_price: '',
                },
                {
                  product_code: 'P-ESS-PC-380V500K60H-RT-24-R1-02-07',
                  name: '통신케이블',
                  model: '',
                  spec: '',
                  manufacturer: '파이온일렉트릭',
                  module_material_num: '1',
                  stock_num: '10',
                  condition: '',
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
      // {
      //     classification:'일반',
      //     material_code: '공장2F_E-09-01',
      //     name: 'IGBT & SMPS',
      //     model: '',
      //     spec: '',
      //     manufacturer: '파이온일렉트릭',
      //     product_num: '1',
      //     condition: 'G',
      //     pe_number: '',
      //     inbound_date: '2024-03-11',
      //     unit_price: '',
      //     product_price: '',
      //   },
      //   {
      //     classification:'일반',
      //     material_code: '공장2F_E-09-02',
      //     name: 'SPD, 퓨즈',
      //     model: '',
      //     spec: '',
      //     manufacturer: '파이온일렉트릭',
      //     product_num: '1',
      //     condition: 'G',
      //     pe_number: '',
      //     inbound_date: '2024-03-11',
      //     unit_price: '',
      //     product_price: '',
      //   },
      //   {
      //     classification:'일반',
      //     material_code: '공장2F_E-09-03',
      //     name: '쿨링팬',
      //     model: '',
      //     spec: '',
      //     manufacturer: '파이온일렉트릭',
      //     product_num: '1',
      //     condition: 'G',
      //     pe_number: '',
      //     inbound_date: '2024-03-11',
      //     unit_price: '',
      //     product_price: '',
      //   },
      //   {
      //     classification:'일반',
      //     material_code: '공장2F_E-09-05',
      //     name: '보호회로',
      //     model: '',
      //     spec: '',
      //     manufacturer: '파이온일렉트릭',
      //     product_num: '1',
      //     condition: 'G',
      //     pe_number: '',
      //     inbound_date: '2024-03-11',
      //     unit_price: '',
      //     product_price: '',
      //   },
      //   {
      //     classification:'일반',
      //     material_code: '공장2F_E-09-06',
      //     name: '리액터',
      //     model: '',
      //     spec: '',
      //     manufacturer: '파이온일렉트릭',
      //     product_num: '1',
      //     condition: 'G',
      //     pe_number: '',
      //     inbound_date: '2024-03-11',
      //     unit_price: '',
      //     product_price: '',
      //   },
      //   {
      //     classification:'일반',
      //     material_code: '공장2F_E-09-07',
      //     name: 'MCCB',
      //     model: '',
      //     spec: '',
      //     manufacturer: '파이온일렉트릭',
      //     product_num: '1',
      //     condition: 'G',
      //     pe_number: '',
      //     inbound_date: '2024-03-11',
      //     unit_price: '',
      //     product_price: '',
      //   },
      ]
    },

    editItem (item) {
      this.editedMaterialIndex = this.material_data.indexOf(item)
      this.editedMaterialItem = Object.assign({}, item)
      this.material_dialog = true
    },

    deleteItem (item) {
        this.editedMaterialIndex = this.material_data.indexOf(item)
        this.editedMaterialItem = Object.assign({}, item)
      this.material_dialog_delete = true
    },

    deleteItemConfirm () {
        this.material_data.splice(this.editedMaterialIndex, 1)
      this.closeDelete()
    },

    close () {
      this.material_dialog = false
      this.module_dialog = false
      this.product_dialog = false
      this.dialog_excel = false
      this.$nextTick(() => {
        this.editedMaterialItem = Object.assign({}, this.defaultMaterialItem)
        this.editedMaterialIndex = -1
      })
    },
    closeDelete () {
      this.material_dialog_delete = false
      this.module_dialog_delete = false
      this.product_dialog_delete = false
      this.dialog_excel = false
      this.$nextTick(() => {
        this.editedMaterialItem = Object.assign({}, this.defaultMaterialItem)
        this.editedMaterialIndex = -1
      })
    },
    resetData(type){
      if(type == 'module'){
        this.module_set_material_data = [];
      }else if(type == 'product'){
        this.product_set_material_data = [];
      }
    },

    save () {
      if (this.editedMaterialIndex > -1) {
        Object.assign(this.material_data[this.editedMaterialIndex], this.editedMaterialItem)
      } else {
        this.material_data.push(this.editedMaterialItem)
      }
      this.close()
    },

    registModule(){
      this.module_dialog = true;
      this.module_set_material_data = [];
      this.newModuleItem.classification = '';
      this.newModuleItem.module_code = '';
      this.newModuleItem.name = '';
      this.newModuleItem.model = '';
      this.newModuleItem.spec = '';
      this.newModuleItem.manufacturer = '';
      this.newModuleItem.stock_num = '';
      this.newModuleItem.condition = '';
      this.newModuleItem.pe_number = '';
      this.newModuleItem.unit_price = '';
      this.newModuleItem.photo = '';
    },

    editModule(item){
      this.module_dialog = true;
      this.newModuleItem.classification = item.classification;
      this.newModuleItem.module_code = item.module_code;
      this.newModuleItem.name = item.name;
      this.newModuleItem.model = item.model;
      this.newModuleItem.spec = item.spec;
      this.newModuleItem.manufacturer = item.manufacturer;
      this.newModuleItem.stock_num = item.stock_num;
      this.newModuleItem.condition = item.condition;
      this.newModuleItem.pe_number = item.pe_number;
      this.newModuleItem.unit_price = item.unit_price;
      this.newModuleItem.photo = item.photo;
      this.module_set_material_data = item.belong_data;
    },

    registProduct(){
      this.product_dialog = true;
      this.product_set_material_data = [];
      this.newProductItem.classification = '';
      this.newProductItem.product_code = '';
      this.newProductItem.name = '';
      this.newProductItem.model = '';
      this.newProductItem.spec = '';
      this.newProductItem.manufacturer = '';
      this.newProductItem.stock_num = '';
      this.newProductItem.condition = '';
      this.newProductItem.pe_number = '';
      this.newProductItem.unit_price = '';
      this.newProductItem.photo = '';
    },
    editProduct(item){
      this.product_dialog = true
      this.newProductItem.classification = item.classification;
      this.newProductItem.product_code = item.product_code;
      this.newProductItem.name = item.name;
      this.newProductItem.model = item.model;
      this.newProductItem.spec = item.spec;
      this.newProductItem.manufacturer = item.manufacturer;
      this.newProductItem.stock_num = item.stock_num;
      this.newProductItem.condition = item.condition;
      this.newProductItem.pe_number = item.pe_number;
      this.newProductItem.unit_price = item.unit_price;
      this.newProductItem.photo = item.photo;
      this.product_set_material_data = item.product_info;
    },

    async uploadMaterial () {
      let files = this.$refs.material_photo.$refs.input.files;
      if (files.length > 0){
        // 업로드할 때, 이미지 파일을 리사이징하고 바이너리 데이터 생성(백엔드로 전달해 DB에 저장할 데이터)
        const thumbnailBuffer = await mux.Util.resizeImageToBinary(files[0], 300, 300);

        // // 업로드할 때, 원본도 AWS S3 버킷에 업로드해야 함.
        // mux.Server.uploadFile(reqObj);

        // 출력할 때, 바이너리 데이터를 img src 에 적용(백엔드로 받은 데이터)
        this.testImg = mux.Util.binaryToURL(thumbnailBuffer);
      }
    },

    loadExcelFile(event) {
      if(event){
        const file = event;
        const headers = this.material_headers; // 헤더 정보
        const items = this.material_excel_upload_data; // 테이블 내용 정보
        mux.Excel.open(file, headers, items);
      }
    },


    async searchMaterialButton() {
      // alert(this.searchCardInputs.find(x=>x.label === '일자').value.sort());

      let searchClassification = this.searchMaterialCardInputs.find(x=>x.label === '분류').value;
      if (searchClassification === 'All')
      searchClassification = '%';
      let searchCondition = this.searchMaterialCardInputs.find(x=>x.label === '상태').value;
      if (searchCondition === 'All')
        searchCondition = '%';
      let searchMaterialCode = this.searchMaterialCardInputs.find(x=>x.label === '관리코드').value;
      let searchName = this.searchMaterialCardInputs.find(x=>x.label === '제품명').value;
      let searchModel = this.searchMaterialCardInputs.find(x=>x.label === '모델명').value;
      let searchSpec = this.searchMaterialCardInputs.find(x=>x.label === '사양').value;
      let searchManufacturer = this.searchMaterialCardInputs.find(x=>x.label === '제조사').value;

      try {
        let result = await mux.Server.post({
          path: '/api/sample_rest_api/',
          "query_info":{
            "script_file_name":"rooting_material_table_stock_table_root_json_2024_03_18_17_49_52.json",
            "params": [
              {
                  "key": "manufacturer",
                  "type":"string",
                  "value": searchManufacturer
              },
              {
                  "key": "spec",
                  "type":"string",
                  "value": searchSpec
              },
              {
                  "key": "model",
                  "type":"string",
                  "value": searchModel
              },
              {
                  "key": "name",
                  "type":"string",
                  "value": searchName
              },
              {
                  "key": "material_code",
                  "type":"string",
                  "value": searchMaterialCode
              },
              {
                  "key": "condition",
                  "type":"string",
                  "value": searchCondition
              },
              {
                  "key": "classification",
                  "type":"string",
                  "value": searchClassification
              }
            ]
          }
        });

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        this.material_data = result;

      } catch (error) {
        alert(error);
      }

    },
  },
}
</script>

<style lang="">

</style>
