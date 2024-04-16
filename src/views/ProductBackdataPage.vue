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
                      @enter="searchMaterialButton"
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
                  <CardComponent
                    elevation="1"
                    text-class=" pt-3"
                    divider-class="mb-3"
                  >
                    <v-row slot="cardTitle">
                      <v-col
                        cols="12"
                        sm="6"
                        align-self="center"
                      >
                        <v-chip
                          class="mr-2"
                          color="indigo"
                          text-color="white"
                          small
                        >
                          총 재고 : {{ material_total_stock_num }}
                        </v-chip>
                        <v-chip
                          class="mr-2"
                          color="indigo"
                          text-color="white"
                          small
                        >
                          총 금액 : {{ material_total_stock_price }}
                        </v-chip>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="6"
                        align-self="center"
                      >
                        <v-btn color="primary" small outlined class="mb-2 float-right" @click="dialog_excel = true">엑셀 업로드</v-btn>
                        <v-btn color="success" small class="mb-2 mr-2 float-right" @click="registMaterialItem">등록</v-btn>
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
                                  accept=".xlsx, .xls"
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
                                  append-icon="mdi-image-edit"
                                  accept=".png, .jpg, .jpeg"
                                  v-model="excel_photos"
                                ></v-file-input>
                              </v-col>
                              <v-col
                                cols="12"
                                sm="4"
                                align-self="center"
                              >
                                <v-btn color="primary" small class="mr-2" href="/forms/원부자재_엑셀업로드_양식.xlsx" download >양식</v-btn>
                                <v-btn color="success" small class="mr-2" @click="registMaterialExcel">등록</v-btn>
                                <v-btn color="default" small class="mr-2" @click="close">취소</v-btn>
                              </v-col>
                              <v-col cols="12">
                                <p class="error--text mb-0">※ 선택한 사진의 파일명과 엑셀 내 기입한 사진명은 꼭 일치해야합니다.</p>
                                <p class="error--text">※ 분류, 위치, 제조사는 꼭 시스템에 등록된 항목으로 기입해주세요.</p>
                                <DataTableComponent
                                  :headers="material_excel_headers"
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
                            max-width="60%"
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
                              <v-form ref="materialForm">
                                <InputsFormComponent
                                  clearable
                                  :inputs="registMaterialInputs"
                                >
                                  <!-- <v-col cols="12" sm="6" align-self="center" v-if="this.registMaterialInputs[this.registMaterialInputs.length-1].value" class="offset-sm-6">
                                    <v-img
                                      alt="Pionelectric Logo"
                                      class="shrink mr-2"
                                      contain
                                      src="https://mkorbucket-public.s3.ap-northeast-2.amazonaws.com/warehouse.jpg"
                                      transition="scale-transition"
                                    />
                                  </v-col> -->

                                <v-menu
                                  open-on-hover
                                  :close-on-content-click="false"
                                  :nudge-width="100"
                                  offset-x
                                  v-if="this.registMaterialInputs[this.registMaterialInputs.length-1].value"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-col cols="12" sm="1" align-self="center">
                                      <v-icon
                                        v-bind="attrs"
                                        v-on="on"
                                      >
                                        mdi-image-multiple-outline
                                      </v-icon>
                                    </v-col>
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
                                </InputsFormComponent>
                              </v-form>
                              <v-divider class="my-7"></v-divider>
                              <v-row>
                                <v-col cols="3" class="pb-0">
                                  <p class="text-h6 font-weight-black mb-0">
                                    위치 및 재고 설정
                                    <v-icon small color="primary" class="mr-3" style="cursor:pointer" @click="addSpotInputs('material')">mdi-plus-thick</v-icon>
                                    <v-icon small color="default" style="cursor:pointer" @click="deleteSpotInputs('material')">mdi-minus-thick</v-icon>
                                  </p>
                                </v-col>
                                <v-col cols="9">
                                  <InputsFormComponent
                                    dense
                                    clearable
                                    filled
                                    col_class="py-0"
                                    :inputs="registMaterialSpotInputs"
                                  ></InputsFormComponent>
                                </v-col>
                              </v-row>
                            </v-container>
                          </ModalDialogComponent>
                      </v-col>
                    </v-row>
                    <v-row slot="cardText">
                      <v-col cols="12">
                        <DataTableComponent
                          :headers="material_headers"
                          :items="material_data"
                          show-photo
                          show-item-details
                          editable
                          deletable
                          dense
                          stockNumInfo
                          @edit="editMaterialItem"
                          @delete="deleteItem"
                          @itemDetials="detailInfoItem"
                        />
                        <ModalDialogComponent
                          :dialog-value="delete_dialog"
                          max-width="350px"
                          title-class="text-body-1 font-weight-black"
                          text-class="text-body-2"
                          save-text="삭제"
                          close-text="취소"
                          @save="deleteItemConfirm"
                          @close="closeDelete"
                        >
                          <template v-slot:titleHTML>
                            <p class="mb-0">{{ tab_main==0 ? editRegistMaterial.item_code : (tab_main==1 ? editRegistModule.item_code : (tab_main==2 ? editRegistProduct.item_code : '')) }}</p>
                            <p class="red--text">자재를 삭제하시겠습니까?</p>
                          </template>
                          삭제 시 복구 불가능합니다.
                        </ModalDialogComponent>
                      </v-col>
                    </v-row>
                  </CardComponent>
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
                      @enter="searchMaterialButton"
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
                            >
                              <v-icon>mdi-magnify</v-icon>검색
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </InputsFormComponent>
                  </CardComponent>


                  <CardComponent
                    elevation="1"
                    text-class=" pt-3"
                    divider-class="mb-3"
                    card-class="mt-5"
                  >
                    <v-row slot="cardTitle">
                      <v-col
                        cols="12"
                        sm="6"
                        align-self="center"
                      >
                        <v-chip
                          class="mr-2"
                          color="indigo"
                          text-color="white"
                          small
                        >
                          반제품 총 재고 : {{ module_total_stock_num }}
                        </v-chip>
                        <v-chip
                          color="indigo"
                          text-color="white"
                          small
                        >
                          반제품 총 금액 : {{ module_total_stock_price }}
                        </v-chip>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        align-self="center"
                      >
                        <v-btn color="success" small class="mr-2 float-right" @click="registModuleItem">등록</v-btn>

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
                                  @click="uploadModule"
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

                            <v-form ref="moduleForm" class="mt-3">
                              <InputsFormComponent
                                dense
                                clearable
                                filled
                                col_class="py-0"
                                :inputs="registModuleInputs"
                              >
                                <v-menu
                                  open-on-hover
                                  :close-on-content-click="false"
                                  :nudge-width="100"
                                  offset-x
                                  v-if="this.registModuleInputs[this.registModuleInputs.length-1].value"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-col cols="12" sm="1">
                                      <v-icon
                                        v-bind="attrs"
                                        v-on="on"
                                      >
                                        mdi-image-multiple-outline
                                      </v-icon>
                                    </v-col>
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
                              </InputsFormComponent>
                            </v-form>
                            <v-divider class="my-7"></v-divider>
                            <v-row>
                              <v-col cols="3" class="pb-0">
                                <p class="text-h6 font-weight-black mb-0">
                                  반제품 위치 및 재고 설정
                                  <v-icon small color="primary" class="mr-3" style="cursor:pointer" @click="addSpotInputs('module')">mdi-plus-thick</v-icon>
                                  <v-icon small color="default" style="cursor:pointer" @click="deleteSpotInputs('module')">mdi-minus-thick</v-icon>
                                </p>
                              </v-col>
                              <v-col cols="9">
                                <InputsFormComponent
                                  dense
                                  clearable
                                  filled
                                  col_class="py-0"
                                  :inputs="registModuleSpotInputs"
                                ></InputsFormComponent>
                              </v-col>
                            </v-row>
                            <v-divider class="my-7"></v-divider>
                            <v-row>
                              <v-col cols="12" class="pb-0">
                                <p class="text-h6 font-weight-black mb-0">선택 원부자재
                                  <v-btn color="primary" x-small @click="set_material_search = true" v-if="!set_material_search">원부자재 선택</v-btn>
                                  <v-btn color="primary" x-small @click="set_material_search = false" v-if="set_material_search">선택 닫기</v-btn>
                                  <v-btn x-small color="error" class="ml-4" @click="resetData('module')">비우기</v-btn>
                                </p>
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
                                      @enter="searchMaterialButton"
                                    >
                                      검색
                                    </v-btn>
                                    <v-btn
                                      color="success"
                                      elevation="2"
                                      class="mr-2"
                                      small
                                      @click="addItemsToModule"
                                    >
                                      추가
                                    </v-btn>
                                  </v-col>
                                </InputsFormComponent>
                              </v-col>
                              <v-col cols="12">
                              <DataTableComponent
                                dense
                                v-model="selected_material_for_module_data"
                                :headers="module_search_material_headers"
                                :items="search_material_for_module_data"
                                item-key="item_code"
                                show-select
                              />
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12">
                                <!-- <DataTableComponent
                                  :headers="module_set_material_headers"
                                  :items="module_set_material_data"
                                  item-key="item_code"
                                  item-num-input
                                  dense
                                ></DataTableComponent> -->
                                <InputsDataTableComponent
                                  :headers="module_set_material_headers"
                                  :items="module_set_material_data"
                                  item-key="item_code"
                                  dense
                                  deletable
                                  @delete="deleteBelongItem"
                                ></InputsDataTableComponent>
                              </v-col>
                            </v-row>
                          </v-container>
                        </ModalDialogComponent>
                      </v-col>
                    </v-row>
                    <v-row slot="cardText">
                      <v-col
                        cols="12"
                      >
                        <DataTableComponent
                            :headers="module_headers"
                            :items="module_data"
                            :item-key="module_data.item_code"
                            hide-default-footer
                            disable-pagination
                            children-key="belong_data"
                            table-style=""
                            editable
                            deletable
                            dense
                            notEditableBelong
                            @edit="editModuleItem"
                            @delete="deleteItem"
                            show-photo
                            stockNumInfo
                            itemNumInfoBelong
                            show-item-details
                            @itemDetials="detailInfoItem"
                        />
                      </v-col>
                    </v-row>
                  </CardComponent>
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
                      @enter="searchMaterialButton"
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
                            : {{ data.item_code }}
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
                                mdi-image-edit
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
                              class="mr-2"
                              color="indigo"
                              text-color="white"
                              small
                              v-for="(stock, idx) in data.spot_stock"
                              :key="idx"
                            >
                              {{ stock.spot }} : {{ stock.stock_num }}개
                            </v-chip>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            align-self="center"
                          >
                            <v-btn color="blue-grey darken-1" small class="mr-2 float-right white--text" @click="deleteItem(data)">완제품 삭제</v-btn>
                            <v-btn color="primary" small class="mr-2 float-right" @click="editProductItem(data)">수정</v-btn>
                            <v-btn color="success" small class="mr-2 float-right" @click="registProductItem">등록</v-btn>

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
                                      @click="uploadProduct"
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
                                <v-form ref="productForm" class="mt-3">
                                  <InputsFormComponent
                                    dense
                                    clearable
                                    filled
                                    col_class="py-0"
                                    :inputs="registProductInputs"
                                  >
                                    <v-menu
                                      open-on-hover
                                      :close-on-content-click="false"
                                      :nudge-width="100"
                                      offset-x
                                    >
                                      <!-- v-if="this.registProductInputs[this.registProductInputs.length-1].value" -->
                                      <template v-slot:activator="{ on, attrs }">
                                        <v-col cols="12" sm="1">
                                          <v-icon
                                            v-bind="attrs"
                                            v-on="on"
                                          >
                                            mdi-image-multiple-outline
                                          </v-icon>
                                        </v-col>
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
                                  </InputsFormComponent>
                                </v-form>
                                <v-divider class="my-7"></v-divider>
                                <v-row>
                                  <v-col cols="3" class="pb-0">
                                    <p class="text-h6 font-weight-black mb-0">
                                      완제품 위치 및 재고 설정
                                      <v-icon small color="primary" class="mr-3" style="cursor:pointer" @click="addSpotInputs('product')">mdi-plus-thick</v-icon>
                                      <v-icon small color="default" style="cursor:pointer" @click="deleteSpotInputs('product')">mdi-minus-thick</v-icon>
                                    </p>
                                  </v-col>
                                  <v-col cols="9">
                                    <InputsFormComponent
                                      dense
                                      clearable
                                      filled
                                      col_class="py-0"
                                      :inputs="registProductSpotInputs"
                                    ></InputsFormComponent>
                                  </v-col>
                                </v-row>
                                <v-divider class="my-7"></v-divider>
                                <v-row>
                                  <v-col cols="9" class="pb-0">
                                    <p class="text-h6 font-weight-black mb-0">
                                      자재 리스트
                                      <v-btn color="primary" class="ml-4" x-small @click="set_material_search = true" v-if="!set_material_search">자재 선택</v-btn>
                                      <v-btn color="primary" x-small @click="set_material_search = false" v-if="set_material_search">선택 닫기</v-btn>
                                      <v-btn x-small color="default" class="ml-2" @click="resetData('product')">비우기</v-btn>
                                    </p>
                                  </v-col>
                                </v-row>

                                <v-row v-if="set_material_search" style="background: #efefef;" class="mt-7">
                                  <v-col cols="12">
                                    <p class="text-h6 font-weight-black mb-0">자재 검색</p>
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
                                          @enter="searchMaterialButton"
                                        >
                                          검색
                                        </v-btn>
                                        <v-btn
                                          color="success"
                                          elevation="2"
                                          class="mr-2"
                                          small
                                          @click="addItemsToProduct"
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
                                    <DataTableComponent
                                      v-model="selected_items_for_product_data"
                                      :headers="product_search_item_headers"
                                      :items="search_items_for_product_data"
                                      item-key="item_code"
                                      show-select
                                      dense
                                    />
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12">
                                    <InputsDataTableComponent
                                      :headers="product_set_items_headers"
                                      :items="product_set_items_data"
                                      item-key="item_code"
                                      dense
                                      deletable
                                      @delete="deleteBelongItem"
                                    ></InputsDataTableComponent>
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
                                <p class="mb-0">{{ data.item_code }}</p>
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
                              :items="data.belong_data"
                              :item-key="data.belong_data.item_code"
                              hide-default-footer
                              disable-pagination
                              children-key="belong_data"
                              table-style=""
                              show-photo
                              dense
                              itemNumInfo
                              itemNumInfoBelong
                              show-item-details
                              @itemDetials="detailInfoItem"
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
      <ModalDialogComponent
      :dialog-value="detail_dialog"
      max-width="50%"
      title-class="display-none"
      :dialog-transition="'slide-x-transition'"
      :dialog-custom="'custom-dialog elevation-0 white'"
      :card-elevation="'0'"
      :hide-overlay="true"
      @close="closeDetail"
      >
        <v-row>
          <v-col cols="12" sm="6">
            <p class="text-h6 font-weight-bold primary--text">재고 정보</p>
            <DataTableComponent
              :headers="stock_detail_header"
              :items="stockDetails"
              hide-default-footer
              disable-pagination
              dense
            />
          </v-col>
          <v-col cols="12" sm="6">
            <p class="text-h6 font-weight-bold primary--text">입고 정보</p>
            <DataTableComponent
              :headers="inbound_detail_header"
              :items="inboundDetails"
              hide-default-footer
              disable-pagination
              dense
            />
          </v-col>
        </v-row>
      </ModalDialogComponent>
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
import InputsDataTableComponent from "@/components/InputsDataTableComponent.vue";
import mux from "@/mux";

export default {
  components: {
    NavComponent,
    ModalDialogComponent,
    DataTableComponent,
    InputsDataTableComponent,
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

      material_dialog: false,
      delete_dialog: false,

      module_dialog: false,

      product_dialog: false,
      product_dialog_delete: false,

      detail_dialog: false,

      material_stock_more_0: true,

      material_total_stock_num: 0,
      material_total_stock_price: 0,
      module_total_stock_num: 0,
      module_total_stock_price: 0,

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
      registMaterialInputs:[
        {label:'분류', column_name:'classification', type:'auto', list:['일반', 'GFM', '전력변환기'], value:'', col:'12', sm:'3', lg:'3',
          rules: [
            v => !!v || '분류 입력',
          ]
        },
        {label:'관리코드', column_name:'item_code',  col:'12', sm:'3', lg:'3', value: '',
        rules: [
            v => !!v || '관리코드 입력',
          ]
        },
        {label:'자재명', column_name:'name',  col:'12', sm:'3', lg:'3', value: '',
          rules: [
            v => !!v || '자재명 입력',
          ]
        },
        {label:'모델명', column_name:'model',  col:'12', sm:'3', lg:'3', value: '',},
        {label:'사양', column_name:'spec', col:'12', sm:'3', lg:'3', value: '',
          rules: [
            v => !!v || '사양 입력',
          ]
        },
        {label:'제조사', column_name:'manufacturer', type:'auto', list:['라온코리아', '액트솔루션', '옵토마린', '성민우텍'], col:'12', sm:'3', lg:'3', value: '',
          rules: [
            v => !!v || '제조사 선택',
          ]
        },
        {label:'단가', text_type:'number', column_name:'unit_price', col:'12', sm:'3', lg:'3', value: '',
          rules: [
            v => !!v || '단가 입력(숫자)',
          ]
        },
        // {label:'위치', column_name:'spot', type:'auto', list:['공장동 1층', '공장동 2층', '세종 사무실'], col:'12', sm:'6', lg:'6', value: '',
        // rules: [
        //     v => !!v || '위치 선택',
        //   ]
        // },
        // {label:'재고수량', text_type:'number', column_name:'stock_num', col:'12', sm:'6', lg:'6', value: '',
        //   rules: [
        //     v => !!v || '재고수량 입력(숫자)',
        //   ]
        // },
        // {label:'재고상태', column_name:'condition', type:'auto', col:'12', sm:'6', lg:'6', value:'', list:['G', 'B'],
        //   rules: [
        //     v => !!v || '재고상태 선택',
        //   ]
        // },
        {label:'사진', column_name:'photo', type:'file', col:'12', sm:'1', lg:'1', value: '', hide_input:true, icon:'mdi-image-edit' },
      ],
      registMaterialSpotInputs: [],
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
      registModuleInputs:[
        {label:'분류', column_name:'classification', type:'auto', list:['일반', 'GFM', '전력변환기'], value:'', col:'12', sm:'3', lg:'3',
          rules: [
            v => !!v || '분류 선택',
          ]
        },
        {label:'관리코드', column_name:'item_code',  col:'12', sm:'3', lg:'3', value: '',
          rules: [
            v => !!v || '관리코드 입력',
          ]
        },
        {label:'자재명', column_name:'name',  col:'12', sm:'3', lg:'3', value: '',
          rules: [
            v => !!v || '자재명 입력',
          ]
        },
        {label:'모델명', column_name:'model',  col:'12', sm:'3', lg:'3', value: ''},
        {label:'사양', column_name:'spec', col:'12', sm:'3', lg:'3', value: '',
          rules: [
            v => !!v || '사양 입력',
          ]
        },
        {label:'제조사', column_name:'manufacturer', type:'auto', list:['라온코리아', '액트솔루션', '옵토마린', '성민우텍'], col:'12', sm:'3', lg:'3', value: '',
          rules: [
            v => !!v || '제조사 선택',
          ]
        },
        // {label:'위치', column_name:'spot', type:'auto', list:['공장동 1층', '공장동 2층', '세종 사무실'], col:'12', sm:'3', lg:'3', value: '',
        // rules: [
        //     v => !!v || '위치 선택',
        //   ]
        // },
        // {label:'재고수량', text_type:'number', column_name:'stock_num', col:'12', sm:'3', lg:'3', value: '',
        //   rules: [
        //     v => !!v || '재고수량 입력(숫자)',
        //   ]
        // },
        // {label:'재고상태', column_name:'condition', type:'auto', col:'12', sm:'3', lg:'3', value:'', list:['G', 'B'],
        //   rules: [
        //     v => !!v || '재고상태 선택',
        //   ]
        // },
        {label:'단가', text_type:'number', column_name:'unit_price', col:'12', sm:'3', lg:'3', value: '',
          rules: [
            v => !!v || '단가 입력(숫자)',
          ]
        },
        {label:'사진', column_name:'photo', type:'file', col:'12', sm:'1', lg:'1', value: '', hide_input:true, icon:'mdi-image-edit',},
      ],
      registModuleSpotInputs:[],
      moduleSearchMaterialInputs:[
        {label:'분류', type:'auto', list:['All', '일반', 'GFM', '전력변환기'], value:'All', col:'12', sm:'4', lg:'3',},
        {label:'관리코드', col:'12', sm:'4', lg:'3', value: '',},
        {label:'제품명', col:'12', sm:'4', lg:'3', value: '',},
        {label:'모델명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'사양', col:'12', sm:'4', lg:'3', value: '',},
        {label:'제조사', col:'12', sm:'4', lg:'3', value: '',},
      ],
      searchProductCardInputs:[
        {label:'제품코드', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제품명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'사양', col:'12', sm:'4', lg:'3', value: ''},
      ],
      registProductInputs:[
        {label:'분류', column_name:'classification', type:'auto', list:['일반', 'GFM', '전력변환기'], value:'', col:'12', sm:'3', lg:'3',
          rules: [
            v => !!v || '분류 선택',
          ]
        },
        {label:'완제품코드', column_name:'item_code',  col:'12', sm:'3', lg:'3', value: '',
          rules: [
            v => !!v || '완제품 코드 입력',
          ]
        },
        {label:'완제품명', column_name:'name',  col:'12', sm:'3', lg:'3', value: '',
          rules: [
            v => !!v || '완제품명 입력',
          ]
        },
        {label:'모델명', column_name:'model',  col:'12', sm:'3', lg:'3', value: ''},
        {label:'사양', column_name:'spec', col:'12', sm:'3', lg:'3', value: '',
          rules: [
            v => !!v || '사양 입력',
          ]
        },
        {label:'제조사', column_name:'manufacturer', type:'auto', list:['라온코리아', '액트솔루션', '옵토마린', '성민우텍'], col:'12', sm:'3', lg:'3', value: '',
          rules: [
            v => !!v || '제조사 선택',
          ]
        },
        // {label:'재고수량', text_type:'number', column_name:'stock_num', col:'12', sm:'3', lg:'3', value: '',
        //   rules: [
        //     v => !!v || '재고수량 입력(숫자)',
        //   ]
        // },
        // {label:'재고상태', column_name:'condition', type:'auto', col:'12', sm:'3', lg:'3', value:'', list:['G', 'B'],
        //   rules: [
        //     v => !!v || '재고 상태 선택',
        //   ]
        // },
        {label:'단가', text_type:'number', column_name:'unit_price', col:'12', sm:'3', lg:'3', value: '',
          rules: [
            v => !!v || '단가 입력(숫자)',
          ]
        },
        {label:'사진', column_name:'photo', type:'file', col:'12', sm:'1', lg:'1', value: '', hide_input:true, icon:'mdi-image-edit',},
      ],
      registProductSpotInputs:[],
      // registProductSpotInputs:[
      //   {label:'위치', column_name:'spot', type:'auto', list:['공장동 1층', '공장동 2층', '세종 사무실'], col:'12', sm:'3', lg:'3', value: ''},
      //   {label:'재고수량', text_type:'number', column_name:'stock_num', col:'12', sm:'3', lg:'3', value: ''},
      // ],
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
      excel_photos: [],
      material_headers: [
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: 'item_code', },
        { text: '제품명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '단가', align: 'center', value: 'unit_price', },
      ],
      material_excel_headers: [
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: 'item_code', },
        { text: '위치', align: 'center', value: 'spot', },
        { text: '제품명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '재고', align: 'center', value: 'stock_num', },
        { text: '상태', align: 'center', value: 'condition', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '사진', align: 'center', value: 'photo', },
      ],
      material_data: [],
      material_excel_upload_data: [],
      editedIndex: -1,
      editRegistMaterial: {
        type:'원부자재',
        classification:'',
        item_code: '',
        name: '',
        model: '',
        spec: '',
        manufacturer: '',
        // spot:'',
        // stock_num: '',
        // condition: '',
        inbound_date: '',
        unit_price: '',
        spot_stock:[],
        photo:'',
      },
      defaultMaterialItem: {
        classification:'',
        item_code: '',
        name: '',
        model: '',
        spec: '',
        manufacturer: '',
        // spot:'',
        // stock_num: '',
        // condition: '',
        inbound_date: '',
        unit_price: '',
        spot_stock:[],
        photo:'',
      },
      editRegistModule: {
        type:'반제품',
        classification:'',
        item_code: '',
        name: '',
        model: '',
        spec: '',
        manufacturer: '',
        // spot: '',
        // stock_num: '',
        // condition: '',
        unit_price: '',
        photo: '',
        thumbnail: null,
        spot_stock:[],
        belong_data:[]
      },

      editRegistProduct: {
        type: '완제품',
        classification : '',
        item_code : '',
        name : '',
        model : '',
        spec : '',
        manufacturer : '',
        // spot: '',
        // stock_num : 0,
        // condition : '',
        unit_price : 0,
        photo: '',
        thumbnail : null,
        spot_stock:[],
        belong_data:[]
      },
      // editRegistProductStock: [],
      deleteItemList:{},
      module_headers: [
        { text: '', align: 'center', value: '', },
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: 'item_code', },
        { text: '제품명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '단가', align: 'center', value: 'unit_price', },
      ],

      module_search_material_headers: [
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: 'item_code', },
        { text: '자재명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '단가', align: 'center', value: 'unit_price', },
      ],
      module_set_material_headers: [
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: 'item_code', },
        { text: '자재명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '필요수량', align: 'center', value: 'item_num', sortable: false},
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'item_price', },
        { text: '제외', align: 'center', value: 'edit_item', sortable: false},
      ],
      module_set_material_data:[],
      search_material_for_module_data:[
        {
          classification:'일반',
          item_code: '공장2F_E-09-1111',
          name: '원부자재1111',
          model: '모델1111',
          spec: '스펙1111',
          manufacturer: '파이온일렉트릭',
          unit_price: '1',
        },
        {
          classification:'일반',
          item_code: '공장2F_E-09-2222',
          name: '원부자재2222',
          model: '모델2222',
          spec: '스펙2222',
          manufacturer: '파이온일렉트릭',
          unit_price: '2',
        },
        {
          classification:'일반',
          item_code: '공장2F_E-09-3333',
          name: '원부자재3333',
          model: '모델3333',
          spec: '스펙3333',
          manufacturer: '파이온일렉트릭',
          unit_price: '3',
        },
      ],
      selected_material_for_module_data:[],

      product_headers: [
        { text: '', align: 'center', value: '', },
        { text: '제품코드', align: 'center', value: 'product_item_code', },
        { text: '제품명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '단가', align: 'center', value: 'unit_price', },
        // { text: '필요수량', align: 'center', value: 'item_num', },
        // { text: '총액', align: 'center', value: 'product_price', },
        // { text: '총 재고', align: 'center', value: 'total_stock', },
      ],
      product_search_item_headers: [
        { text: '종류', align: 'center', value: 'type', },
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: 'item_code', },
        { text: '자재명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '단가', align: 'center', value: 'unit_price', },
      ],
      product_set_items_headers: [
        { text: '종류', align: 'center', value: 'type', },
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: 'item_code', },
        { text: '자재명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '필요수량', align: 'center', value: 'item_num', sortable: false},
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'item_price', },
        { text: '제외', align: 'center', value: 'edit_item', sortable: false },
      ],
      product_set_items_data:[],
      search_items_for_product_data:[
        {
          type:'원부자재',
          classification: 'GFM',
          item_code: '공장2F_E-09-01',
          name: 'IGBT & SMPS',
          model: '원부자재모델1',
          spec: '원부자재사양1',
          manufacturer: '파이온일렉트릭',
          unit_price: '111',
        },
        {
          type:'원부자재',
          classification: 'GFM',
          item_code: '공장2F_E-09-02',
          name: 'SPD, 퓨즈',
          model: '원부자재모델2',
          spec: '원부자재사양2',
          manufacturer: '파이온일렉트릭',
          unit_price: '222',
        },
        {
          type:'반제품',
          classification: 'GFM',
          item_code: '공장2F_E-29-01',
          name: 'IGBT & SMPS',
          model: '반제품모델1',
          spec: '반제품사양1',
          manufacturer: '파이온일렉트릭',
          unit_price: '333',
        },
        {
          type:'반제품',
          classification: 'GFM',
          item_code: '공장2F_E-29-02',
          name: 'SPD, 퓨즈',
          model: '반제품모델2',
          spec: '반제품사양2',
          manufacturer: '파이온일렉트릭',
          unit_price: '444',
        },
      ],
      selected_items_for_product_data: [],

      module_data: [
        {
          classification: 'GFM',
          item_code: 'PE-반제품-01',
          name: 'PCS Ass`Y',
          model: '반제품모델1',
          spec: '반제품스펙1',
          manufacturer: '파이온일렉트릭',
          item_num: '',
          total_stock: 100,
          unit_price: 2,
          item_price: 100,
          photo: 'testt.jpg',
          spot_stock:[
            {spot: '공장동 1층', stock_num: 40, condition: 'G'},
            {spot: '공장동 2층', stock_num: 60, condition: 'G'},
          ],
          belong_data:[
            {
              classification: 'GFM',
              item_code: 'PE-원부자재-01',
              name: 'IGBT & SMPS',
              model: '원부자재모델1',
              spec: '원부자재사양1',
              manufacturer: '파이온일렉트릭',
              item_num: 400,
              total_stock: 1000,
              unit_price: 3,
              item_price: 1000,
              spot_stock:[
                {spot: '세종사무실', stock_num: 1000, condition: 'G'},
              ],
            },
            {
              classification: 'GFM',
              item_code: 'PE-원부자재-02',
              name: 'SPD, 퓨즈',
              model: '원부자재모델2',
              spec: '원부자재사양2',
              manufacturer: '파이온일렉트릭',
              item_num: 200,
              total_stock: 100,
              unit_price: 4,
              item_price: 900,
              spot_stock:[
                {spot: '세종사무실', stock_num: 450, condition: 'G'},
                {spot: '공장동 1층', stock_num: 450, condition: 'G'},
              ],
            },
          ]
        },
        {
          classification: 'GFM',
          item_code: 'PE-반제품-02',
          name: '제어기 Ass`Y',
          model: '반제품모델2',
          spec: '반제품스펙2',
          manufacturer: '파이온일렉트릭',
          item_num: '',
          total_stock: 120,
          unit_price: 1,
          item_price: 120,
          photo: 'testt.jpg',
          spot_stock:[
            {spot: '공장동 1층', stock_num: 50, condition: 'G'},
            {spot: '공장동 2층', stock_num: 70, condition: 'G'},
          ],
          belong_data:[]
        },
      ],
      product_data: [
        {
          item_code: 'P-ESS-PC-380V500K60H-RT-24-R1',
          classification: 'GFM',
          model: '완제품모델1',
          manufacturer: '제조사2',
          name: 'ESS GFM용 PCS',
          spec: '380VAC 500kW',
          unit_price: '1000',
          photo:'productphoto.jpg',
          spot_stock: [
            {spot:'공장동 2층', stock_num:'4', condition: 'G'},
            {spot:'공장동 1층', stock_num:'2', condition: 'G'},
          ],
          belong_data: [
            {
              type:'반제품',
              classification: 'GFM',
              product_item_code:'P-ESS-PC-380V500K60H-RT-24-R1-01',
              item_code: 'PE-반제품-01',
              name: 'PCS Ass`Y',
              model: '반제품모델1',
              spec: '반제품스펙1',
              manufacturer: '파이온일렉트릭',
              item_num: '1',
              total_stock: 100,
              unit_price: 2,
              item_price: 100,
              spot_stock:[
                {spot: '공장동 1층', stock_num: 40, condition: 'G'},
                {spot: '공장동 2층', stock_num: 60, condition: 'G'},
              ],
              belong_data:[
                {
                  product_item_code:'P-ESS-PC-380V500K60H-RT-24-R1-01-01',
                  item_code: '원부자재01_001',
                  name: 'IGBT & SMPS',
                  model: '원부자재모델1',
                  spec: '원부자재사양1',
                  manufacturer: '파이온일렉트릭',
                  item_num: 400,
                  total_stock: 1000,
                  unit_price: 3,
                  spot_stock:[
                    {spot: '세종사무실', stock_num: 1000, condition: 'G'},
                  ],
                },
                {
                  product_item_code:'P-ESS-PC-380V500K60H-RT-24-R1-01-02',
                  item_code: '원부자재01_002',
                  name: 'SPD, 퓨즈',
                  model: '원부자재모델2',
                  spec: '원부자재사양2',
                  manufacturer: '파이온일렉트릭',
                  item_num: 200,
                  total_stock: 100,
                  unit_price: 4,
                  spot_stock:[
                    {spot: '세종사무실', stock_num: 450, condition: 'G'},
                    {spot: '공장동 1층', stock_num: 450, condition: 'G'},
                  ],
                },
              ]
            },
            {
              product_item_code:'P-ESS-PC-380V500K60H-RT-24-R1-02',
              item_code:'반제품02_002',
              classification: '일반',
              type:'반제품',
              name: '제어기 Ass`Y',
              model: '반제품모델2',
              spec: '반제품스펙2',
              manufacturer: '파이온일렉트릭',
              item_num: '1',
              total_stock: 120,
              unit_price: 1,
              item_price: 120,
              spot_stock:[
                {spot: '공장동 1층', stock_num: 50, condition: 'G'},
                {spot: '공장동 2층', stock_num: 70, condition: 'G'},
              ],
              belong_data:[]
            },
          ],
        },
      ],
      stock_detail_header:[
        { text: '위치', align: 'center', value: 'spot', },
        { text: '수량', align: 'center', value: 'stock_num', },
        { text: '상태', align: 'center', value: 'condition', },
      ],
      inbound_detail_header:[
        { text: '위치', align: 'center', value: 'spot', },
        { text: '수량', align: 'center', value: 'inbound_num', },
        { text: '입고일자', align: 'center', value: 'inbound_date', },
      ],
      stockDetails:[],
      inboundDetails:[],
    }
  },

  computed: {
  },

  watch: {
    formDisabled () {
      return this.editedIndex === -1 ? false : true
    },
    material_dialog (val) {
      val || this.close()
    },
    delete_dialog (val) {
      val || this.closeDelete()
    },
    detail_dialog (val) {
      val || this.closeDetail()
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
          classification:'일반',
          item_code: '공장2F_E-09-01',
          name: 'IGBT & SMPS',
          model: '모델1',
          spec: '사양1',
          manufacturer: '파이온일렉트릭',
          total_stock: 100,
          inbound_date: '2024-03-11',
          unit_price: 1,
          stock_price: 100,
          spot_stock:[
            {spot: '공장동 1층', stock_num: 40, condition: 'G'},
            {spot: '공장동 2층', stock_num: 60, condition: 'G'},
          ],
          photo:'photoName'
        },
        {
          classification:'일반',
          item_code: '공장2F_E-09-02',
          name: '쿨링팬',
          model: '모델2',
          spec: '사양2',
          manufacturer: '파이온일렉트릭',
          total_stock: 40,
          inbound_date: '2024-03-11',
          unit_price: 1,
          stock_price: 40,
          spot_stock:[
            {spot: '공장동 1층', stock_num: 30, condition: 'G'},
            {spot: '공장동 2층', stock_num: 10, condition: 'G'},
          ],
          photo:'photoName'
        },
        {
          classification:'일반',
          item_code: '공장2F_E-09-03',
          name: 'SPD, 퓨즈',
          model: '',
          spec: '사양3',
          manufacturer: '파이온일렉트릭',
          total_stock: 1200,
          inbound_date: '2024-03-14',
          unit_price: 2,
          stock_price: 2400,
          spot_stock:[
            {spot: '공장동 1층', stock_num: 600, condition: 'G'},
            {spot: '공장동 2층', stock_num: 100, condition: 'G'},
            {spot: '세종사무실', stock_num: 500, condition: 'G'},
          ],
          photo:'photoName'
        },
        // {
        //   classification:'일반',
        //   item_code: '공장2F_E-09-03',
        //   name: '쿨링팬',
        //   model: '',
        //   spec: '',
        //   manufacturer: '파이온일렉트릭',
        //   item_num: '1',
        //   condition: 'G',
        //   inbound_date: '2024-03-11',
        //   unit_price: '',
        //   product_price: '',
        // },
        // {
        //   classification:'일반',
        //   item_code: '공장2F_E-09-05',
        //   name: '보호회로',
        //   model: '',
        //   spec: '',
        //   manufacturer: '파이온일렉트릭',
        //   item_num: '1',
        //   condition: 'G',
        //   inbound_date: '2024-03-11',
        //   unit_price: '',
        //   product_price: '',
        // },
        // {
        //   classification:'일반',
        //   item_code: '공장2F_E-09-06',
        //   name: '리액터',
        //   model: '',
        //   spec: '',
        //   manufacturer: '파이온일렉트릭',
        //   item_num: '1',
        //   condition: 'G',
        //   inbound_date: '2024-03-11',
        //   unit_price: '',
        //   product_price: '',
        // },
        // {
        //   classification:'일반',
        //   item_code: '공장2F_E-09-07',
        //   name: 'MCCB',
        //   model: '',
        //   spec: '',
        //   manufacturer: '파이온일렉트릭',
        //   item_num: '1',
        //   condition: 'G',
        //   inbound_date: '2024-03-11',
        //   unit_price: '',
        //   product_price: '',
        // },
      ]
    },
    registMaterialItem(){
      let material_input = this.registMaterialInputs;
      material_input.forEach(data =>{
        if(data.column_name == 'item_code'){
          data.disabled = false
        }
        data.value = '';
      })
      this.material_dialog = true
    },
    registMaterialExcel(){
      if(this.material_excel_upload_data.length == 0){
        alert("업로드할 엑셀을 선택해주세요")
      }
      //material_excel_upload_data : 불러온 엑셀 데이터
    },
    editMaterialItem (item) {
      this.editedIndex = this.material_data.indexOf(item)
      let material_input = this.registMaterialInputs;
      // let stock_spot_arr = this.material_data.filter(datas => datas.item_code === item.item_code);
      let stock_spot_arr = item.spot_stock;
      let spot_input = this.registMaterialSpotInputs;

      for(let i=0; i<stock_spot_arr.length; i++){
        spot_input.push({label:'위치'+[i+1], column_name:'spot', type:'auto', list:['공장동 1층', '공장동 2층', '세종 사무실'], col:'12', sm:'4', lg:'4', value: stock_spot_arr[i].spot},)
        spot_input.push( {label:'재고수량'+[i+1], text_type:'number', column_name:'stock_num', col:'12', sm:'4', lg:'4', value: stock_spot_arr[i].stock_num},)
        spot_input.push( {label:'재고상태'+[i+1], list:['G', 'B'], type:'auto', column_name:'condition', col:'12', sm:'4', lg:'4', value: stock_spot_arr[i].condition},)
      }

      material_input.forEach(data =>{
        if(data.column_name == 'item_code'){
          data.disabled = true
        }
        for(let i=0; i<Object.keys(item).length; i++){
          if(data.column_name == Object.keys(item)[i]){
            data.value = Object.values(item)[i];
          }
        }
      })
      this.material_dialog = true
    },

    async uploadMaterial () {
      // 저장버튼 클릭 시 registMaterialInputs의 value를 editRegistMaterial에 전달
      // 수정, 등록 둘 다 editRegistMaterial 요청, editedIndex에 따라 구분
      let material_input = this.registMaterialInputs;
      let item = this.editRegistMaterial;
      let stock_input = this.registMaterialSpotInputs;
      let stock_item = this.editRegistMaterial.spot_stock;
      const validate = this.$refs.materialForm.validate();
      if(validate){
        let stock_spot_arr=[];
        let stock_num_arr=[];
        let stock_condition_arr=[];
        for(let i = 0; i < stock_input.length; i++){
          if(stock_input[i].column_name == 'spot'){
            stock_spot_arr.push(stock_input[i].value ? stock_input[i].value : '');
          }else if(stock_input[i].column_name == 'stock_num'){
            stock_num_arr.push(stock_input[i].value ? stock_input[i].value : 0);
          }else if(stock_input[i].column_name == 'condition'){
            stock_condition_arr.push(stock_input[i].value ? stock_input[i].value : '');
          }
        }

        for(let x=0; x<stock_spot_arr.length; x++){
          if(stock_spot_arr[x] === '' && stock_num_arr[x] === 0 && stock_condition_arr[x] === ''){
            continue
          }else{
            stock_item.push({spot:stock_spot_arr[x], stock_num:stock_num_arr[x], condition:stock_condition_arr[x]});
          }
        }
        material_input.forEach(data =>{
          for(let i=0; i<Object.keys(item).length; i++){
            if(data.column_name == Object.keys(item)[i]){
              item[Object.keys(item)[i]] = data.value;
            }
          }
        })
        this.editRegistMaterial.type = '원부자재'
        if(this.editedIndex === -1){ // editedIndex가 -1이면 등록
          this.editRegistMaterial.creater = 'user_id';
          alert('원부자재 등록이 완료되었습니다');
        }else{// 아니라면 수정
          this.editRegistMaterial.modifier = 'user_id';
          alert('원부자재 수정이 완료되었습니다');
        }
        console.log('원부자재 데이터 : ' + JSON.stringify(this.editRegistMaterial));
      }

      //editRegistMaterial를 전달 Back으로 전달



      // let files = this.$refs.material_photo.$refs.input.files;
      // if (files.length > 0){
      //   // 업로드할 때, 이미지 파일을 리사이징하고 바이너리 데이터 생성(백엔드로 전달해 DB에 저장할 데이터)
      //   const thumbnailBuffer = await mux.Util.resizeImageToBinary(files[0], 300, 300);

      //   // // 업로드할 때, 원본도 AWS S3 버킷에 업로드해야 함.
      //   // mux.Server.uploadFile(reqObj);

      //   // 출력할 때, 바이너리 데이터를 img src 에 적용(백엔드로 받은 데이터)
      //   this.testImg = mux.Util.binaryToURL(thumbnailBuffer);
      // }
    },

    registModuleItem(){
      let module_input = this.registModuleInputs;
      module_input.forEach(data =>{
        if(data.column_name == 'item_code'){
          data.disabled = false
        }
        data.value = '';
      })
      this.module_set_material_data = [];
      this.module_dialog = true
    },

    editModuleItem(item){
      this.editedIndex = this.module_data.indexOf(item)
      let module_input = this.registModuleInputs;
      // let stock_spot_arr = this.module_data.filter(datas => datas.item_code === item.item_code);
      let stock_spot_arr = item.spot_stock;
      let spot_input = this.registModuleSpotInputs;
      // alert (JSON.stringify(stock_spot_arr));


      for(let i=0; i<stock_spot_arr.length; i++){
        spot_input.push({label:'위치'+[i+1], column_name:'spot', type:'auto', list:['공장동 1층', '공장동 2층', '세종 사무실'], col:'12', sm:'4', lg:'4', value: stock_spot_arr[i].spot},)
        spot_input.push( {label:'재고수량'+[i+1], text_type:'number', column_name:'stock_num', col:'12', sm:'4', lg:'4', value: stock_spot_arr[i].stock_num},)
        spot_input.push( {label:'재고상태'+[i+1], list:['G', 'B'], type:'auto', column_name:'condition', col:'12', sm:'4', lg:'4', value: stock_spot_arr[i].condition},)
      }

      module_input.forEach(data =>{
        if(data.column_name == 'item_code'){
          data.disabled = true
        }
        for(let i=0; i<Object.keys(item).length; i++){
          if(data.column_name == Object.keys(item)[i]){
            data.value = Object.values(item)[i];
          }
        }
      })
      if(item.belong_data.length > 0){
        for(let d=0; d<item.belong_data.length; d++){
          this.module_set_material_data.push(item.belong_data[d])
        }
      }
      // this.module_set_material_data= item.belong_data
      this.module_dialog = true;
    },
    addItemsToModule(){
      this.selected_material_for_module_data.forEach(data =>{
        this.module_set_material_data.push(data);
      })
      this.selected_material_for_module_data = []
    },
    uploadModule(){
      // 저장버튼 클릭 시 registModuleInputs value를 editRegistModule에 전달
      // 수정, 등록 둘 다 editRegistModule에 요청, editedIndex에 따라 구분
      let module_input = this.registModuleInputs;
      let item = this.editRegistModule;
      let stock_input = this.registModuleSpotInputs;
      let stock_item = this.editRegistModule.spot_stock;
      const validate = this.$refs.moduleForm.validate();
      if(validate){
        let stock_spot_arr=[];
        let stock_num_arr=[];
        let stock_condition_arr=[];
        for(let i = 0; i < stock_input.length; i++){
          if(stock_input[i].column_name == 'spot'){
            stock_spot_arr.push(stock_input[i].value ? stock_input[i].value : '');
          }else if(stock_input[i].column_name == 'stock_num'){
            stock_num_arr.push(stock_input[i].value ? stock_input[i].value : 0);
          }else if(stock_input[i].column_name == 'condition'){
            stock_condition_arr.push(stock_input[i].value ? stock_input[i].value : '');
          }
        }

        for(let x=0; x<stock_spot_arr.length; x++){
          if(stock_spot_arr[x] === '' && stock_num_arr[x] === 0 && stock_condition_arr[x] === ''){
            continue
          }else{
            stock_item.push({spot:stock_spot_arr[x], stock_num:stock_num_arr[x], condition:stock_condition_arr[x]});
          }
        }

        module_input.forEach(data =>{
          for(let i=0; i<Object.keys(item).length; i++){
            if(data.column_name == Object.keys(item)[i]){
              item[Object.keys(item)[i]] = data.value;
            }
          }
        })
        this.module_set_material_data.forEach(material =>{
          item.belong_data.push({material_code: material.item_code, material_num: material.item_num});
        })

        this.editRegistModule.type = '반제품'
        if(this.editedIndex === -1){ // editedIndex가 -1이면 등록
          this.editRegistModule.creater = 'user_id';
          alert('반제품 등록이 완료되었습니다');
        }else{// 아니라면 수정
          this.editRegistModule.modifier = 'user_id';
          alert('반제품 수정이 완료되었습니다');
        }

        console.log('반제품 데이터 : ' + JSON.stringify(this.editRegistModule));
      }
    },

    registProductItem(){
      let product_input = this.registProductInputs;
      product_input.forEach(data =>{
        if(data.column_name == 'item_code'){
          data.disabled = false
        }
        data.value = '';
      })
      this.product_set_items_data = [];
      this.product_dialog = true;
    },

    editProductItem(item){
      this.editedIndex = this.product_data.indexOf(item)
      let product_input = this.registProductInputs;
      let spot_input = this.registProductSpotInputs;
      let spot = item.spot_stock
      product_input.forEach(data =>{
        if(data.column_name == 'item_code'){
          data.disabled = true
        }
        for(let i=0; i<Object.keys(item).length; i++){
          if(data.column_name == Object.keys(item)[i]){
            data.value = Object.values(item)[i];
          }
        }
      })

      for(let i=0; i<spot.length; i++){
        spot_input.push({label:'위치'+[i+1], column_name:'spot', type:'auto', list:['공장동 1층', '공장동 2층', '세종 사무실'], col:'12', sm:'4', lg:'4', value: spot[i].spot},)
        spot_input.push( {label:'재고수량'+[i+1], text_type:'number', column_name:'stock_num', col:'12', sm:'4', lg:'4', value: spot[i].stock_num},)
        spot_input.push( {label:'재고상태'+[i+1], list:['G', 'B'], type:'auto', column_name:'condition', col:'12', sm:'4', lg:'4', value: spot[i].condition},)
      }
      for(let d=0; d<item.belong_data.length; d++){
        this.product_set_items_data.push(item.belong_data[d])
      }
      this.product_dialog = true;
    },
    addItemsToProduct(){
      this.selected_items_for_product_data.forEach(data =>{
        this.product_set_items_data.push(data);
      })
      this.selected_items_for_product_data = []
    },

    uploadProduct(){
      // 수정, 등록 둘 다 editRegistProduct에 요청, editedIndex에 따라 구분
      // 저장버튼 클릭 시 registProductInputs value를 editRegistProduct에 전달
      let product_input = this.registProductInputs;
      let item = this.editRegistProduct;
      let stock_input = this.registProductSpotInputs;
      let stock_item = this.editRegistProduct.spot_stock;

      const validate = this.$refs.productForm.validate();
      if(validate){

        let stock_spot_arr=[];
        let stock_num_arr=[];
        let stock_condition_arr=[];
        for(let i = 0; i < stock_input.length; i++){
          if(stock_input[i].column_name == 'spot'){
            stock_spot_arr.push(stock_input[i].value ? stock_input[i].value : '');
          }else if(stock_input[i].column_name == 'stock_num'){
            stock_num_arr.push(stock_input[i].value ? stock_input[i].value : 0);
          }else if(stock_input[i].column_name == 'condition'){
            stock_condition_arr.push(stock_input[i].value ? stock_input[i].value : '');
          }
        }

        for(let x=0; x<stock_spot_arr.length; x++){
          if(stock_spot_arr[x] === '' && stock_num_arr[x] === 0 && stock_condition_arr[x] === ''){
            continue
          }else{
            stock_item.push({spot:stock_spot_arr[x], stock_num:stock_num_arr[x], condition:stock_condition_arr[x]});
          }
        }

        product_input.forEach(data =>{
          for(let i=0; i<Object.keys(item).length; i++){
            if(data.column_name == Object.keys(item)[i]){
              item[Object.keys(item)[i]] = data.value;
            }
          }
        })

        this.product_set_items_data.forEach(items =>{
          if(items.type == '원부자재'){
            item.belong_data.push({type:items.type, material_code: items.item_code, material_num: items.item_num});
          }else if(items.type == '반제품'){
            item.belong_data.push({type:items.type, module_code: items.item_code, module_num: items.item_num});
          }
        })

        this.editRegistProduct.type = '완제품'
        if(this.editedIndex === -1){ // editedIndex가 -1이면 등록
          this.editRegistProduct.creater = 'user_id';
          alert('완제품 등록이 완료되었습니다');

        }else{// 아니라면 수정
          this.editRegistProduct.modifier = 'user_id';
          alert('완제품 수정이 완료되었습니다');
        }
        console.log('완제품 데이터 : ' + JSON.stringify(this.editRegistProduct));
      }
    },

    detailInfoItem(item){
      this.detail_dialog = true;
      this.stockDetails = item.spot_stock
    },

    addSpotInputs(type){
      let spot_input
      if(type === 'material'){
        spot_input = this.registMaterialSpotInputs
      }else if(type === 'module'){
        spot_input = this.registModuleSpotInputs
      }else if(type === 'product'){
        spot_input = this.registProductSpotInputs
      }
      let length;
      if(spot_input.length == 0){
        length = 1
      }else {
        length = (spot_input.length/3)+1
      }
      spot_input.push({label:'위치'+[length], column_name:'spot', type:'auto', list:['공장동 1층', '공장동 2층', '세종 사무실'], col:'12', sm:'4', lg:'4', value:''},)
      spot_input.push( {label:'재고수량'+[length], text_type:'number', column_name:'stock_num', col:'12', sm:'4', lg:'4', value:''},)
      spot_input.push( {label:'재고상태'+[length], list:['G', 'B'], type:'auto', column_name:'condition', col:'12', sm:'4', lg:'4', value:''},)

    },

    deleteSpotInputs(type){
      let spot_input
      if(type === 'material'){
        spot_input = this.registMaterialSpotInputs
      }else if(type === 'module'){
        spot_input = this.registModuleSpotInputs
      }else if(type === 'product'){
        spot_input = this.registProductSpotInputs
      }

      spot_input.splice(spot_input.length-3,3)
      if(spot_input.length == 0){
        alert('완제품 위치 및 재고 설정란이 모두 삭제되었습니다.')
      }
    },

    deleteBelongItem(idx){
      if(this.tab_main == 1){
      this.module_set_material_data.splice(idx, 1);
      }else if (this.tab_main == 2){
      this.product_set_items_data.splice(idx, 1);
      }
    },
    deleteItem (item) {
      if(this.tab_main == 0){
        this.editedIndex = this.material_data.indexOf(item)
        this.editRegistMaterial = Object.assign({}, item)
      }else if(this.tab_main == 1){
        this.editedIndex = this.module_data.indexOf(item)
        this.editRegistModule  = Object.assign({}, item)
      }else if(this.tab_main == 2){
        this.editedIndex = this.product_data.indexOf(item)
        this.editRegistProduct  = Object.assign({}, item)
      }
      this.delete_dialog = true
    },

    deleteItemConfirm () {
      this.deleteItemList = {};
      this.deleteItemList.modifier = 'user_id';
      if(this.tab_main == 0){
        this.deleteItemList.material_code = this.editRegistMaterial.item_code;
        console.log('원부자재 삭제 : ' + JSON.stringify(this.deleteItemList));
        this.material_data.splice(this.editedIndex, 1)
      }else if(this.tab_main == 1){
        this.deleteItemList.module_code = this.editRegistModule.item_code;
        console.log('반제품 삭제 : ' + JSON.stringify(this.deleteItemList));
        this.module_data.splice(this.editedIndex, 1)
      }else if(this.tab_main == 2){
        this.deleteItemList.product_code = this.editRegistProduct.item_code;
        console.log('완제품 삭제 : ' + JSON.stringify(this.deleteItemList));
        this.product_data.splice(this.editedIndex, 1)
      }

      // 삭제 요청 = this.deleteItemList

      this.closeDelete()
    },

    close () {
      this.material_dialog = false
      this.module_dialog = false
      this.product_dialog = false
      this.dialog_excel = false
      this.module_set_material_data = [];
      this.product_set_items_data = [];
      this.registProductSpotInputs = [];
      this.registModuleSpotInputs = [];
      this.registMaterialSpotInputs = [];
      this.$nextTick(() => {
        this.editRegistMaterial = Object.assign({}, this.defaultMaterialItem)
        this.editedIndex = -1
      })
    },
    closeDelete () {
      this.delete_dialog = false
      this.dialog_excel = false
      this.$nextTick(() => {
        this.editRegistMaterial = Object.assign({}, this.defaultMaterialItem)
        this.editedIndex = -1
      })
    },
    closeDetail () {
      this.detail_dialog = false
    },
    resetData(type){
      if(type == 'module'){
        this.module_set_material_data = [];
        this.selected_material_for_module_data = [];
      }else if(type == 'product'){
        this.product_set_items_data = [];
        this.selected_items_for_product_data = [];
      }
    },

    loadExcelFile(event) {
      if(event){
        const file = event;
        const headers = this.material_excel_headers; // 헤더 정보
        const items = this.material_excel_upload_data; // 테이블 내용 정보
        mux.Excel.open(file, headers, items);
      }
    },

    async searchMaterialButton() {
      // alert(this.searchCardInputs.find(x=>x.label === '일자').value.sort());

      let searchClassification = this.searchMaterialCardInputs.find(x=>x.label === '분류').value;
      if (searchClassification === 'All')
      searchClassification = '';
      let searchCondition = this.searchMaterialCardInputs.find(x=>x.label === '상태').value;
      if (searchCondition === 'All')
        searchCondition = '';
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
                  "key": "item_code",
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

      this.material_data.forEach(data =>{
        this.material_total_stock_num += data.total_stock
        this.material_total_stock_price += data.stock_price
      })
    },
  },
}
</script>

<style lang="">

</style>
