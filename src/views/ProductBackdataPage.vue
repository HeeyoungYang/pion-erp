<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :backDataMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <LoadingModalComponent :dialog-value="loading_dialog" hide-overlay></LoadingModalComponent>
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
                      @enter="searchMaterial"
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
                              @click="searchMaterial"
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
                                  v-if="materialImg"
                                >
                                  <!-- v-if="this.registMaterialInputs[this.registMaterialInputs.length-1].value" -->
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
                                              :src="materialImg"
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
                            <p class="mb-0 mr-2">{{ tab_main==0 ? editRegistMaterial.item_code : (tab_main==1 ? editRegistModule.item_code : (tab_main==2 ? editRegistProduct.item_code : '')) }}</p>
                            <p class="mb-0 red--text">자재를 삭제하시겠습니까?</p>
                          </template>
                          기본 정보 및 재고 정보가 모두 삭제됩니다.
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
                      @enter="searchModule"
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
                              @click="searchModule"
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
                                              :src="moduleImg"
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
                                  </v-col>
                                </InputsFormComponent>
                              </v-col>
                              <v-col cols="12">
                              <DataTableComponent
                                dense
                                v-model="selected_material_for_module_data"
                                :headers="module_search_material_headers"
                                :items="search_material_for_module_data"
                                item-key="_code"
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
                      @enter="searchProduct"
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
                          @click="searchProduct"
                          class="mr-2"
                        >
                          <v-icon>mdi-magnify</v-icon>검색
                        </v-btn>
                        <v-btn color="success" @click="registProductItem">등록</v-btn>
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
                            v-if="data.thumbnail"
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
                                        :src="data.thumbnail"
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
                              v-if="data.belong_data"
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
                  <!-- 완제품 등록 Modal -->
                  <ModalDialogComponent
                    :dialog-value="product_dialog"
                    max-width="70%"
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
                                        :src="productImg"
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
                            hide-details
                            :inputs="productSearchMaterialModuleInputs"
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
                          <DataTableComponent
                            v-model="selected_items_for_product_data"
                            :headers="product_search_item_headers"
                            :items="search_items_for_product_data"
                            item-key="_code"
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
import LoadingModalComponent from "@/components/LoadingModalComponent.vue";
import ProductBackDataPageConfig from "@/configure/ProductBackDataPageConfig.json";
import mux from "@/mux";
import CheckPagePermission from "@/common_js/CheckPagePermission";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=ProductBackdataPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  components: {
    NavComponent,
    ModalDialogComponent,
    DataTableComponent,
    InputsDataTableComponent,
    LoadingModalComponent,
    ExpansionPanelComponent,
    CardComponent,
    InputsFormComponent,
  },
  data() {
    return {
      mux: mux,
      materialImg: '',
      moduleImg: '',
      productImg: '',
      menu: false,
      editedIndex: -1,
      deleteItemList:{},
      excel_photos: [],
      //manufacturer_list:[],
      manufacturer_list: ProductBackDataPageConfig.test_manufacturer_list,
      classification_list:[],

      //tabs
      tab_main: null,
      tab_items:ProductBackDataPageConfig.tab_items,

      //Dialog
      dialog_excel: false,
      loading_dialog: false,
      material_dialog: false,
      delete_dialog: false,
      module_dialog: false,
      product_dialog: false,
      product_dialog_delete: false,
      detail_dialog: false,

      //원부자재 정보
      material_stock_more_0: true,
      material_total_stock_num: 0,
      material_total_stock_price: 0,
      registMaterialSpotInputs: [],
      searchMaterialCardInputs:ProductBackDataPageConfig.searchMaterialCardInputs,
      registMaterialInputs:ProductBackDataPageConfig.registMaterialInputs,
      material_headers: ProductBackDataPageConfig.material_headers,
      material_excel_headers: ProductBackDataPageConfig.material_excel_headers,
      editRegistMaterial: ProductBackDataPageConfig.editRegistMaterial,
      defaultMaterialItem: ProductBackDataPageConfig.defaultMaterialItem,
      material_data: [],
      material_excel_upload_data: [],


      //반제품 정보
      module_stock_more_0: true,
      module_total_stock_num: 0,
      module_total_stock_price: 0,
      registModuleSpotInputs:[],
      module_set_material_data:[],
      selected_material_for_module_data:[],
      searchModuleCardInputs:ProductBackDataPageConfig.searchModuleCardInputs,
      registModuleInputs:ProductBackDataPageConfig.registModuleInputs,
      moduleSearchMaterialInputs:ProductBackDataPageConfig.moduleSearchMaterialInputs,
      editRegistModule: ProductBackDataPageConfig.editRegistModule,
      module_headers:ProductBackDataPageConfig.module_headers,
      module_search_material_headers:ProductBackDataPageConfig.module_search_material_headers,
      module_set_material_headers: ProductBackDataPageConfig.module_set_material_headers,
      search_material_for_module_data:[],
      module_data:[],
      // module_data:ProductBackDataPageConfig.test_module_data,
      // search_material_for_module_data:ProductBackDataPageConfig.test_search_material_for_module_data,


      //완제품 정보
      registProductSpotInputs:[],
      set_material_search: false,
      product_set_items_data:[],
      selected_items_for_product_data: [],
      searchProductCardInputs:ProductBackDataPageConfig.searchProductCardInputs,
      registProductInputs:ProductBackDataPageConfig.registProductInputs,
      productSearchMaterialModuleInputs:ProductBackDataPageConfig.productSearchMaterialModuleInputs,
      editRegistProduct:ProductBackDataPageConfig.editRegistProduct,
      // editRegistProductStock: [],
      product_headers:ProductBackDataPageConfig.product_headers,
      product_search_item_headers:ProductBackDataPageConfig.product_search_item_headers,
      product_set_items_headers:ProductBackDataPageConfig.product_set_items_headers,
      search_items_for_product_data:ProductBackDataPageConfig.search_items_for_product_data,
      product_data: [],
      // product_data: ProductBackDataPageConfig.test_product_data,


      // 상세내역 정보
      stockDetails:[],
      inboundDetails:[],
      stock_detail_header:ProductBackDataPageConfig.stock_detail_header,
      inbound_detail_header:ProductBackDataPageConfig.inbound_detail_header,
    }
  },

  computed: {
    registMaterialInputsPhoto() {
      return this.registMaterialInputs.find(x=>x.label === '사진');
    },
    registModuleInputsPhoto() {
      return this.registModuleInputs.find(x=>x.label === '사진');
    },
    registProductInputsPhoto() {
      return this.registProductInputs.find(x=>x.label === '사진');
    },
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
    registMaterialInputsPhoto: {
      handler: async function (newInput) {
        if (newInput.value) {
          this.materialImg = mux.Util.binaryToURL(await mux.Util.resizeImageToBinary(newInput.value, 500, 500));
        }else {
          this.materialImg = '';
        }
      },
      deep: true
    },
    registModuleInputsPhoto: {
      handler: async function (newInput) {
        if (newInput.value) {
          this.moduleImg = mux.Util.binaryToURL(await mux.Util.resizeImageToBinary(newInput.value, 500, 500));
        }else {
          this.moduleImg = '';
        }
      },
      deep: true
    },
    registProductInputsPhoto: {
      handler: async function (newInput) {
        if (newInput.value) {
          this.productImg = mux.Util.binaryToURL(await mux.Util.resizeImageToBinary(newInput.value, 500, 500));
        }else {
          this.productImg = '';
        }
      },
      deep: true
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    // eslint-disable-next-line no-unused-vars
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      // console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    openDialog(){
      this.module_dialog = true
    },
    async initialize () {
      this.material_data = []
      // this.manufacturer_list = ProductBackDataPageConfig.test_manufacturer_list;
      // this.classification_list = ProductBackDataPageConfig.test_classification_list;
      const prevURL = window.location.href;
      try {
        let result = await mux.Server.getPionBasicInfo();
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }

        this.classification_list = result.classification;
        this.manufacturer_list = result.manufacturer;
        // this.spot_list = result.spot;

      } catch (error) {
        if (prevURL !== window.location.href) return;
        alert(error);
      }
      mux.List.addProductBasicInfoLists(this.searchMaterialCardInputs, this.classification_list, this.manufacturer_list, true);
      this.searchMaterialCardInputs = JSON.parse(JSON.stringify(this.searchMaterialCardInputs));
      mux.List.addProductBasicInfoLists(this.searchModuleCardInputs, this.classification_list, this.manufacturer_list, true);
      this.searchModuleCardInputs = JSON.parse(JSON.stringify(this.searchModuleCardInputs));
      mux.List.addProductBasicInfoLists(this.moduleSearchMaterialInputs, this.classification_list, this.manufacturer_list, true);
      this.moduleSearchMaterialInputs = JSON.parse(JSON.stringify(this.moduleSearchMaterialInputs));
      mux.List.addProductBasicInfoLists(this.productSearchMaterialModuleInputs, this.classification_list, this.manufacturer_list, true);
      this.productSearchMaterialModuleInputs = JSON.parse(JSON.stringify(this.productSearchMaterialModuleInputs));

      mux.List.addProductBasicInfoLists(this.registMaterialInputs, this.classification_list, this.manufacturer_list, false);
      this.registMaterialInputs = JSON.parse(JSON.stringify(this.registMaterialInputs));
      mux.List.addProductBasicInfoLists(this.registModuleInputs, this.classification_list, this.manufacturer_list, false);
      this.registModuleInputs = JSON.parse(JSON.stringify(this.registModuleInputs));
      mux.List.addProductBasicInfoLists(this.registProductInputs, this.classification_list, this.manufacturer_list, false);
      this.registProductInputs = JSON.parse(JSON.stringify(this.registProductInputs));

      // this.material_data = ProductBackDataPageConfig.test_material_data
    },

    async searchItem() {
      let searchType;
      let searchClassification;
      let searchProductCode;
      let searchProductName ;
      let searchModelName;
      let searchProductSpec;
      let searchManufacturer;
      let searchStockMoreZero = '';

      if(this.tab_main == 1){
        searchType = '원부자재'
        searchClassification = this.moduleSearchMaterialInputs.find(x=>x.label === '분류').value;
        if (searchClassification === 'All')
          searchClassification = '%';
        searchProductCode = this.moduleSearchMaterialInputs.find(x=>x.label === '관리코드').value;
        searchProductName = this.moduleSearchMaterialInputs.find(x=>x.label === '제품명').value;
        searchModelName = this.moduleSearchMaterialInputs.find(x=>x.label === '모델명').value;
        searchProductSpec = this.moduleSearchMaterialInputs.find(x=>x.label === '사양').value;
        searchManufacturer = this.moduleSearchMaterialInputs.find(x=>x.label === '제조사').value;
      }else {
        searchType = this.productSearchMaterialModuleInputs.find(x=>x.label === '종류').value;
        searchClassification = this.productSearchMaterialModuleInputs.find(x=>x.label === '분류').value;
        if (searchClassification === 'All')
          searchClassification = '%';
        searchProductCode = this.productSearchMaterialModuleInputs.find(x=>x.label === '관리코드').value;
        searchProductName = this.productSearchMaterialModuleInputs.find(x=>x.label === '제품명').value;
        searchModelName = this.productSearchMaterialModuleInputs.find(x=>x.label === '모델명').value;
        searchProductSpec = this.productSearchMaterialModuleInputs.find(x=>x.label === '사양').value;
        searchManufacturer = this.productSearchMaterialModuleInputs.find(x=>x.label === '제조사').value;
      }

      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/sample_rest_api/',
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
        if(result['code'] == 0){
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
                product_data_arr.push(data);
              }
            }
          });

          if(this.tab_main == 1){
            this.search_material_for_module_data = product_data_arr;
            this.selected_material_for_module_data = []
          }else{
            this.search_items_for_product_data = product_data_arr;
            this.selected_items_for_product_data = []
          }

          this.product_data.forEach(data =>{
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
            }else {
              data.item_price = 0;
            }
            this.total_stock_num += data.total_stock
            this.total_stock_price += data.item_price
          })
        }else{
          if (prevURL !== window.location.href) return;
          alert(result['failed_info']);
        }

      } catch (error) {
        if (prevURL !== window.location.href) return;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          alert(error.response['data']['failed_info'].msg);
        else
          alert(error);
      }

      // if(this.tab_main == 1){
      //   this.search_material_for_module_data = ProductBackDataPageConfig.test_search_material_for_module_data;
      // }else{
      //   this.search_items_for_product_data = ProductBackDataPageConfig.test_search_items_for_product_data;
      // }


    },
    imageBinary(thumbnail){
      if(thumbnail){
        try {
          let imgURL = mux.Util.binaryToURL(mux.Util.hexToUint8Array(thumbnail));
          return imgURL
        } catch{
          return '';
        }
      }
    },
    async searchMaterial() {
      //검색 시 총 재고, 총 금액 초기화
      this.loading_dialog = true;
      this.material_total_stock_num = 0;
      this.material_total_stock_price = 0;

      let searchStockMoreZero = '';

      let searchType = '원부자재';
      let searchClassification = this.searchMaterialCardInputs.find(x=>x.label === '분류').value;
      if (searchClassification === 'All')
        searchClassification = '%';

      let searchConditions = this.searchMaterialCardInputs.find(x=>x.label === '상태').value;
      if (searchConditions === 'All')
        searchConditions = '';

      let searchProductCode = this.searchMaterialCardInputs.find(x=>x.label === '관리코드').value;
      if (searchProductCode)
        searchProductCode = searchProductCode.trim();

      let searchProductName = this.searchMaterialCardInputs.find(x=>x.label === '제품명').value;
      if (searchProductName)
        searchProductName = searchProductName.trim();

      let searchModelName = this.searchMaterialCardInputs.find(x=>x.label === '모델명').value;
      if (searchModelName)
        searchModelName = searchModelName.trim();

      let searchProductSpec = this.searchMaterialCardInputs.find(x=>x.label === '사양').value;
      if (searchProductSpec)
        searchProductSpec = searchProductSpec.trim();

      let searchManufacturer = this.searchMaterialCardInputs.find(x=>x.label === '제조사').value;

      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/sample_rest_api/',
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

              "stock_table.conditions": searchConditions ? searchConditions : "",
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
        if(result['code'] == 0){
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
                product_data_arr.push(data);
              }
            }
          });

          this.material_data = product_data_arr;
          // this.material_data = ProductBackDataPageConfig.test_material_data;

          this.material_data.forEach(data =>{
            data.item_code = data._code;
            delete data._code;
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
            }else {
              data.item_price = 0;
            }
            this.material_total_stock_num += data.total_stock
            this.material_total_stock_price += data.item_price
          })
          // console.log(this.material_data)
        }else{
          if (prevURL !== window.location.href) return;
          alert(result['failed_info']);
        }

      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          alert(error.response['data']['failed_info'].msg);
        else
          alert(error);
      }
        this.loading_dialog = false;
    },
    registMaterialItem(){
      this.materialImg = ''
      let material_input = this.registMaterialInputs;
      mux.Rules.rulesSet(material_input);

      material_input.forEach(data =>{
        if(data.column_name == 'item_code'){
          data.disabled = false
        }
        data.value = '';
      })
      this.material_dialog = true
    },
    async registMaterialExcel(){
      if(this.material_excel_upload_data.length == 0){
        alert("업로드할 엑셀을 선택해주세요")
        return;
      }

      //material_excel_upload_data : 불러온 엑셀 데이터
      const type = '원부자재';

      let thumbnail_dict = {};
      for (let i = 0; i < this.excel_photos.length; i++) {
        const file = this.excel_photos[i];
        thumbnail_dict[file.name] = mux.Util.uint8ArrayToHexString(await mux.Util.resizeImageToBinary(file, 500, 500));
      }

      let noPhoto = false;
      let duplicateSpot = false;
      let material_info_arr = [];
      let stock_data = [];
      for (let i = 0; i < this.material_excel_upload_data.length; i++) {
        const row = this.material_excel_upload_data[i];
        if (row.photo && !thumbnail_dict[row.photo]) {
          noPhoto = true;
          break;
        }
        if (material_info_arr.find(x => x.data.material_code === row.item_code)) {
          if (material_info_arr.find(x => x.data.material_code === row.item_code).data.photo == "") {
            material_info_arr.find(x => x.data.material_code === row.item_code).data.photo = row.item_code + ".png";
            material_info_arr.find(x => x.data.material_code === row.item_code).data.thumbnail = thumbnail_dict[row.photo];
          }
        }else {
          material_info_arr.push({
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "creater"
            },
            "data":{
              "type": type,
              "classification": row.classification,
              "material_code": row.item_code,
              "name": row.name,
              "model": row.model,
              "spec": row.spec,
              "manufacturer": row.manufacturer,
              "unit_price": row.unit_price,
              "photo": row.photo ? row.item_code + ".png" : "",
              "thumbnail": row.photo ? thumbnail_dict[row.photo] : ""
            },
            "ignore_where": {"material_code": row.item_code}
          });
        }
        if (stock_data.find(x => x.data.product_code === row.item_code && x.data.spot === row.spot)) {
          duplicateSpot = true;
          break;
        }else {
          stock_data.push({
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "creater"
            },
            "data":{
              "conditions": row.conditions,
              "product_code": row.item_code,
              "spot": row.spot,
              "stock_num": row.stock_num,
              "type": type
            },
            "select_where": {"product_code": this.editRegistMaterial.item_code, "spot": row.spot}
          });
        }
      }
      if (noPhoto){
        alert('엑셀에 등록된 사진이 첨부되지 않았습니다.');
        return;
      }
      if (duplicateSpot){
        alert('엑셀에 중복된 위치가 존재합니다.');
        return;
      }

      let sendData = {
        "material_table-insert": material_info_arr,
        "stock_table-insert": stock_data
      };

      this.loading_dialog = true;
      const prevURL = window.location.href;

      try {
        let result = await mux.Server.post({
          path: '/api/sample_rest_api/',
          params: sendData
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0){
          // console.log('result :>> ', result);
          alert('원부자재 등록이 완료되었습니다');
        } else {
          if (prevURL !== window.location.href) return;
          alert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          alert(error.response['data']['failed_info'].msg);
        else
          alert(error);
      }
      this.loading_dialog = false;
      this.close();
    },
    editMaterialItem (item) {
      this.editedIndex = this.material_data.indexOf(item)
      let material_input = this.registMaterialInputs;
      mux.Rules.rulesSet(material_input);
      // let stock_spot_arr = this.material_data.filter(datas => datas.item_code === item.item_code);
      let stock_spot_arr = item.spot_stock;
      let spot_input = this.registMaterialSpotInputs;

      this.materialImg = this.imageBinary(item.thumbnail);
      if (stock_spot_arr){
        for(let i=0; i<stock_spot_arr.length; i++){
          spot_input.push({label:'위치'+[i+1], column_name:'spot', type:'auto', list:['공장동 1층', '공장동 2층', '세종 사무실'], col:'12', sm:'4', lg:'4', value: stock_spot_arr[i].spot},)
          spot_input.push( {label:'재고수량'+[i+1], text_type:'number', column_name:'stock_num', col:'12', sm:'4', lg:'4', value: stock_spot_arr[i].stock_num},)
          spot_input.push( {label:'재고상태'+[i+1], list:['G', 'B'], type:'auto', column_name:'conditions', col:'12', sm:'4', lg:'4', value: stock_spot_arr[i].conditions},)
        }
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
      stock_item = [];
      const validate = this.$refs.materialForm.validate();
      if(validate){
        let stock_spot_arr=[];
        let stock_num_arr=[];
        let stock_conditions_arr=[];
        for(let i = 0; i < stock_input.length; i++){
          if(stock_input[i].column_name == 'spot'){
            stock_spot_arr.push(stock_input[i].value ? stock_input[i].value : '');
          }else if(stock_input[i].column_name == 'stock_num'){
            stock_num_arr.push(stock_input[i].value ? stock_input[i].value : 0);
          }else if(stock_input[i].column_name == 'conditions'){
            stock_conditions_arr.push(stock_input[i].value ? stock_input[i].value : '');
          }
        }

        for(let x=0; x<stock_spot_arr.length; x++){
          if(stock_spot_arr[x] === '' && stock_num_arr[x] === 0 && stock_conditions_arr[x] === ''){
            continue
          }else{
            stock_item.push({spot:stock_spot_arr[x], stock_num:stock_num_arr[x], conditions:stock_conditions_arr[x]});
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

        let thumbnail = '';
        if (this.materialImg){
          thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.urlToBinary(this.materialImg));
        }
        if(this.editedIndex === -1){ // editedIndex가 -1이면 등록
          let sendData = {
            "material_table-insert": [{
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "material_code": this.editRegistMaterial.item_code,
                "classification": this.editRegistMaterial.classification,
                "manufacturer": this.editRegistMaterial.manufacturer,
                "model": this.editRegistMaterial.model,
                "name": this.editRegistMaterial.name,
                "photo": thumbnail ? this.editRegistMaterial.item_code + ".png" : "",
                "spec": this.editRegistMaterial.spec,
                "thumbnail": thumbnail,
                "type": this.editRegistMaterial.type,
                "unit_price": this.editRegistMaterial.unit_price
              },
              "select_where": {"material_code": this.editRegistMaterial.item_code}
            }]
          };

          let stock_data = [];
          stock_item.forEach(data =>{
            stock_data.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "conditions": data.conditions,
                "product_code": this.editRegistMaterial.item_code,
                "spot": data.spot,
                "stock_num": data.stock_num,
                "type": this.editRegistMaterial.type
              },
              "select_where": {"product_code": this.editRegistMaterial.item_code, "spot": data.spot}
            });
          });
          sendData["stock_table-insert"] = stock_data;

          const prevURL = window.location.href;
          try {
            let result = await mux.Server.post({
              path: '/api/sample_rest_api/',
              params: sendData
            });
            if (prevURL !== window.location.href) return;

            if (typeof result === 'string'){
              result = JSON.parse(result);
            }
            if(result['code'] == 0){
              // console.log('result :>> ', result);
              alert('원부자재 등록이 완료되었습니다');
            } else {
              if (prevURL !== window.location.href) return;
              alert(result['failed_info']);
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
              alert(error.response['data']['failed_info'].msg);
            else
              alert(error);
          }
        }else{// 아니라면 수정
          let sendData = {
            "material_table-update": [{
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "modifier"
              },
              "data":{
                "material_code": this.editRegistMaterial.item_code,
                "classification": this.editRegistMaterial.classification,
                "manufacturer": this.editRegistMaterial.manufacturer,
                "model": this.editRegistMaterial.model,
                "name": this.editRegistMaterial.name,
                "photo": thumbnail ? this.editRegistMaterial.item_code + ".png" : "",
                "spec": this.editRegistMaterial.spec,
                "thumbnail": thumbnail,
                "type": this.editRegistMaterial.type,
                "unit_price": this.editRegistMaterial.unit_price
              },
              "update_where": {"material_code": this.editRegistMaterial.item_code}
            }]
          };

          sendData["stock_table-delete"] = [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data": {},
            "delete_where": {"product_code": this.editRegistMaterial.item_code}
          }];

          let stock_data = [];
          stock_item.forEach(data =>{
            stock_data.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "conditions": data.conditions,
                "product_code": this.editRegistMaterial.item_code,
                "spot": data.spot,
                "stock_num": data.stock_num,
                "type": this.editRegistMaterial.type
              },
              "select_where": {"product_code": "!JUST_INSERT!"}
            });
          });
          sendData["stock_table-insert"] = stock_data;

          const prevURL = window.location.href;
          try {
            let result = await mux.Server.post({
              path: '/api/sample_rest_api/',
              params: sendData
            });
            if (prevURL !== window.location.href) return;

            if (typeof result === 'string'){
              result = JSON.parse(result);
            }
            if(result['code'] == 0){
              // console.log('result :>> ', result);
              alert('원부자재 수정이 완료되었습니다');
            } else {
              if (prevURL !== window.location.href) return;
              alert(result['failed_info']);
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
              alert(error.response['data']['failed_info'].msg);
            else
              alert(error);
          }
        }
        // console.log('원부자재 데이터 : ' + JSON.stringify(this.editRegistMaterial));
      }

      //editRegistMaterial를 전달 Back으로 전달



      // let files = this.$refs.material_photo.$refs.input.files;
      // if (files.length > 0){
      //   // 업로드할 때, 이미지 파일을 리사이징하고 바이너리 데이터 생성(백엔드로 전달해 DB에 저장할 데이터)
      //   const thumbnailBuffer = await mux.Util.resizeImageToBinary(files[0], 500, 500);

      //   // // 업로드할 때, 원본도 AWS S3 버킷에 업로드해야 함.
      //   // mux.Server.uploadFile(reqObj);

      //   // 출력할 때, 바이너리 데이터를 img src 에 적용(백엔드로 받은 데이터)
      //   this.testImg = mux.Util.binaryToURL(thumbnailBuffer);
      // }
    },


    async searchModule() {
      //검색 시 총 재고, 총 금액 초기화
      this.module_total_stock_num = 0;
      this.module_total_stock_price = 0;

      this.loading_dialog = true;

      // this.module_data = ProductBackDataPageConfig.test_module_data;

      let searchClassification = this.searchModuleCardInputs.find(x=>x.label === '분류').value;
      if (searchClassification === 'All')
        searchClassification = '%';
      let searchConditions = this.searchModuleCardInputs.find(x=>x.label === '상태').value;
      if (searchConditions === 'All')
        searchConditions = '';
      let searchModuleCode = this.searchModuleCardInputs.find(x=>x.label === '관리코드').value;
      if (searchModuleCode)
        searchModuleCode = searchModuleCode.trim();

      let searchName = this.searchModuleCardInputs.find(x=>x.label === '제품명').value;
      if (searchName)
        searchName = searchName.trim();

      let searchModel = this.searchModuleCardInputs.find(x=>x.label === '모델명').value;
      if (searchModel)
        searchModel = searchModel.trim();

      let searchSpec = this.searchModuleCardInputs.find(x=>x.label === '사양').value;
      if (searchSpec)
        searchSpec = searchSpec.trim();

      let searchManufacturer = this.searchModuleCardInputs.find(x=>x.label === '제조사').value;
      let searchStockMoreZero = '';

      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/sample_rest_api/',
          "params": [
                {
                    "module_table.classification": searchClassification ? searchClassification : "",
                    "module_table.manufacturer": searchManufacturer ? searchManufacturer : "",
                    "module_table.model": searchModel ? searchModel : "",
                    "module_table.module_code": searchModuleCode ? searchModuleCode : "",
                    "module_table.name": searchName ? searchName : "",
                    "module_table.spec": searchSpec ? searchSpec : "",
                    // "material_table.classification": "",
                    // "material_table.manufacturer": "",
                    // "material_table.material_code": "",
                    // "material_table.model": "",
                    // "material_table.name": "",
                    // "material_table.spec": "",
                    "stock_table.conditions": searchConditions ? searchConditions : "",
                    "stock_table.stock_num": searchStockMoreZero
                }
            ],
            "script_file_name": "rooting_반제품_검색_24_05_01_12_50_9BS.json",
            "script_file_path": "data_storage_pion\\json_sql\\stock\\6_반제품_검색\\반제품_검색_24_05_01_12_50_CZR"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0){
          this.module_data = result['data'].filter(data=>(!this.module_stock_more_0 || (data.spot_stock && data.spot_stock.length > 0 && data.spot_stock.find(x=>x.stock_num > 0)) ));

          this.module_data.forEach(data =>{
            data.item_code = data.code;
            delete data.code;

            if(data.belong_data){
              for(let b=0; b<data.belong_data.length; b++){
                data.belong_data[b].item_code = data.belong_data[b].code;
                delete data.belong_data[b].code;
              }
            }
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
            }else {
              data.item_price = 0;
            }
            this.module_total_stock_num += data.total_stock
            this.module_total_stock_price += data.item_price
          })
        }else{
          if (prevURL !== window.location.href) return;
          alert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          alert(error.response['data']['failed_info'].msg);
        else
          alert(error);
      }
      this.loading_dialog = false;
    },
    registModuleItem(){
      let module_input = this.registModuleInputs;
      mux.Rules.rulesSet(module_input);
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
      mux.Rules.rulesSet(module_input);
      // let stock_spot_arr = this.module_data.filter(datas => datas.item_code === item.item_code);
      let stock_spot_arr = item.spot_stock;
      let spot_input = this.registModuleSpotInputs;
      // alert (JSON.stringify(stock_spot_arr));

      if (stock_spot_arr){
        for(let i=0; i<stock_spot_arr.length; i++){
          spot_input.push({label:'위치'+[i+1], column_name:'spot', type:'auto', list:['공장동 1층', '공장동 2층', '세종 사무실'], col:'12', sm:'4', lg:'4', value: stock_spot_arr[i].spot},)
          spot_input.push( {label:'재고수량'+[i+1], text_type:'number', column_name:'stock_num', col:'12', sm:'4', lg:'4', value: stock_spot_arr[i].stock_num},)
          spot_input.push( {label:'재고상태'+[i+1], list:['G', 'B'], type:'auto', column_name:'conditions', col:'12', sm:'4', lg:'4', value: stock_spot_arr[i].conditions},)
        }
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
      if(item.belong_data && item.belong_data.length > 0){
        for(let d=0; d<item.belong_data.length; d++){
          this.module_set_material_data.push(item.belong_data[d])
        }
      }
      // this.module_set_material_data= item.belong_data
      this.module_dialog = true;
    },
    async uploadModule(){
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
        let stock_conditions_arr=[];
        for(let i = 0; i < stock_input.length; i++){
          if(stock_input[i].column_name == 'spot'){
            stock_spot_arr.push(stock_input[i].value ? stock_input[i].value : '');
          }else if(stock_input[i].column_name == 'stock_num'){
            stock_num_arr.push(stock_input[i].value ? stock_input[i].value : 0);
          }else if(stock_input[i].column_name == 'conditions'){
            stock_conditions_arr.push(stock_input[i].value ? stock_input[i].value : '');
          }
        }

        for(let x=0; x<stock_spot_arr.length; x++){
          if(stock_spot_arr[x] === '' && stock_num_arr[x] === 0 && stock_conditions_arr[x] === ''){
            continue
          }else{
            stock_item.push({spot:stock_spot_arr[x], stock_num:stock_num_arr[x], conditions:stock_conditions_arr[x]});
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
          item.belong_data.push({material_code: material.item_code, material_num: material.num});
        })

        this.editRegistModule.type = '반제품'

        let thumbnail = '';
        if (this.moduleImg){
          thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.urlToBinary(this.moduleImg));
        }

        if(this.editedIndex === -1){ // editedIndex가 -1이면 등록
          let sendData = {
            "module_table-insert": [{
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "module_code": this.editRegistModule.item_code,
                "classification": this.editRegistModule.classification,
                "manufacturer": this.editRegistModule.manufacturer,
                "model": this.editRegistModule.model,
                "name": this.editRegistModule.name,
                "photo": thumbnail ? this.editRegistModule.item_code + ".png" : "",
                "spec": this.editRegistModule.spec,
                "thumbnail": thumbnail,
                "type": this.editRegistModule.type,
                "unit_price": this.editRegistModule.unit_price
              },
              "select_where": {"module_code": this.editRegistModule.item_code}
            }]
          };

          let stock_data = [];
          stock_item.forEach(data =>{
            stock_data.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "conditions": data.conditions,
                "product_code": this.editRegistModule.item_code,
                "spot": data.spot,
                "stock_num": data.stock_num,
                "type": this.editRegistModule.type
              },
              "select_where": {"product_code": this.editRegistModule.item_code, "spot": data.spot}
            });
          });
          sendData["stock_table-insert"] = stock_data;

          let module_material_data = [];
          this.module_set_material_data.forEach(data =>{
            module_material_data.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "module_code": this.editRegistModule.item_code,
                "material_code": data.item_code,
                "material_num": data.num
              },
              "select_where": {"module_code": this.editRegistModule.item_code, "material_code": data.item_code}
            });
          });
          sendData["module_material_table-insert"] = module_material_data;

          const prevURL = window.location.href;
          try {
            let result = await mux.Server.post({
              path: '/api/sample_rest_api/',
              params: sendData
            });
            if (prevURL !== window.location.href) return;

            if (typeof result === 'string'){
              result = JSON.parse(result);
            }
            if(result['code'] == 0){
              // console.log('result :>> ', result);
              alert('반제품 등록이 완료되었습니다');
            } else {
              if (prevURL !== window.location.href) return;
              alert(result['failed_info']);
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
              alert(error.response['data']['failed_info'].msg);
            else
              alert(error);
          }
        }else{// 아니라면 수정
          let sendData = {
            "module_table-update": [{
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "modifier"
              },
              "data":{
                "module_code": this.editRegistModule.item_code,
                "classification": this.editRegistModule.classification,
                "manufacturer": this.editRegistModule.manufacturer,
                "model": this.editRegistModule.model,
                "name": this.editRegistModule.name,
                "photo": thumbnail ? this.editRegistModule.item_code + ".png" : "",
                "spec": this.editRegistModule.spec,
                "thumbnail": thumbnail,
                "type": this.editRegistModule.type,
                "unit_price": this.editRegistModule.unit_price
              },
              "update_where": {"module_code": this.editRegistModule.item_code}
            }]
          };

          sendData["stock_table-delete"] = [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data": {},
            "delete_where": {"product_code": this.editRegistModule.item_code}
          }];

          let stock_data = [];
          stock_item.forEach(data =>{
            stock_data.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "conditions": data.conditions,
                "product_code": this.editRegistModule.item_code,
                "spot": data.spot,
                "stock_num": data.stock_num,
                "type": this.editRegistModule.type
              },
              "select_where": {"product_code": "!JUST_INSERT!"}
            });
          });
          sendData["stock_table-insert"] = stock_data;

          sendData["module_material_table-delete"] = [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data": {},
            "delete_where": {"module_code": this.editRegistModule.item_code}
          }];

          let module_material_data = [];
          this.module_set_material_data.forEach(data =>{
            module_material_data.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "module_code": this.editRegistModule.item_code,
                "material_code": data.item_code,
                "material_num": data.num
              },
              "select_where": {"module_code": "!JUST_INSERT!"}
            });
          });
          sendData["module_material_table-insert"] = module_material_data;

          const prevURL = window.location.href;
          try {
            let result = await mux.Server.post({
              path: '/api/sample_rest_api/',
              params: sendData
            });
            if (prevURL !== window.location.href) return;

            if (typeof result === 'string'){
              result = JSON.parse(result);
            }
            if(result['code'] == 0){
              // console.log('result :>> ', result);
              alert('반제품 수정이 완료되었습니다');
            } else {
              if (prevURL !== window.location.href) return;
              alert(result['failed_info']);
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
              alert(error.response['data']['failed_info'].msg);
            else
              alert(error);
          }
        }

        // console.log('반제품 데이터 : ' + JSON.stringify(this.editRegistModule));
      }
    },

    async searchProduct() {
      // this.product_data = ProductBackDataPageConfig.test_product_data;


      this.loading_dialog = true;

      let searchProductCode = this.searchProductCardInputs.find(x=>x.label === '제품코드').value;
      if (!searchProductCode)
        searchProductCode = '%';
      let searchName = this.searchProductCardInputs.find(x=>x.label === '제품명').value;
      if (searchName)
        searchName = searchName.trim();
      let searchSpec = this.searchProductCardInputs.find(x=>x.label === '사양').value;
      if (searchSpec)
        searchSpec = searchSpec.trim();
      // let searchStockMoreZero = '';

      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/sample_rest_api/',
          "params": [
              {
                "product_table.name": searchName ? searchName : "",
                "product_table.product_code": searchProductCode ? searchProductCode : "",
                "product_table.spec": searchSpec ? searchSpec : ""
              }
          ],
          "script_file_name": "rooting_완제품_검색_24_05_01_12_44_A0W.json",
          "script_file_path": "data_storage_pion\\json_sql\\stock\\10_완제품_검색\\완제품_검색_24_05_01_12_45_GC6"
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0){
          this.product_data = result['data'];

          this.product_data.forEach(data =>{
            data.item_code = data.code;
            delete data.code;

            if(data.belong_data){
              for(let b=0; b<data.belong_data.length; b++){
                data.belong_data[b].item_code = data.belong_data[b].code;
                delete data.belong_data[b].code;
                if(data.belong_data[b].belong_data){
                  for(let c=0; c<data.belong_data[b].belong_data.length; c++){
                    data.belong_data[b].belong_data[c].item_code = data.belong_data[b].belong_data[c].code;
                    delete data.belong_data[b].belong_data[c].code;
                  }
                }
              }
            }
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
            }else {
              data.item_price = 0;
            }
            // this.total_stock_num += data.total_stock
            // this.total_stock_price += data.item_price
          })
        }else{
          if (prevURL !== window.location.href) return;
          alert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          alert(error.response['data']['failed_info'].msg);
        else
          alert(error);
      }
      this.loading_dialog = false;
    },

    registProductItem(){
      let product_input = this.registProductInputs;
      mux.Rules.rulesSet(product_input);
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
      mux.Rules.rulesSet(product_input);
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

      if (spot){
        for(let i=0; i<spot.length; i++){
          spot_input.push({label:'위치'+[i+1], column_name:'spot', type:'auto', list:['공장동 1층', '공장동 2층', '세종 사무실'], col:'12', sm:'4', lg:'4', value: spot[i].spot},)
          spot_input.push( {label:'재고수량'+[i+1], text_type:'number', column_name:'stock_num', col:'12', sm:'4', lg:'4', value: spot[i].stock_num},)
          spot_input.push( {label:'재고상태'+[i+1], list:['G', 'B'], type:'auto', column_name:'conditions', col:'12', sm:'4', lg:'4', value: spot[i].conditions},)
        }
      }
      if (item.belong_data){
        for(let d=0; d<item.belong_data.length; d++){
          this.product_set_items_data.push(item.belong_data[d])
        }
      }
      this.product_dialog = true;
    },

    async uploadProduct(){
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
        let stock_conditions_arr=[];
        for(let i = 0; i < stock_input.length; i++){
          if(stock_input[i].column_name == 'spot'){
            stock_spot_arr.push(stock_input[i].value ? stock_input[i].value : '');
          }else if(stock_input[i].column_name == 'stock_num'){
            stock_num_arr.push(stock_input[i].value ? stock_input[i].value : 0);
          }else if(stock_input[i].column_name == 'conditions'){
            stock_conditions_arr.push(stock_input[i].value ? stock_input[i].value : '');
          }
        }

        for(let x=0; x<stock_spot_arr.length; x++){
          if(stock_spot_arr[x] === '' && stock_num_arr[x] === 0 && stock_conditions_arr[x] === ''){
            continue
          }else{
            stock_item.push({spot:stock_spot_arr[x], stock_num:stock_num_arr[x], conditions:stock_conditions_arr[x]});
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
            item.belong_data.push({type:items.type, material_code: items.item_code, material_num: items.num});
          }else if(items.type == '반제품'){
            item.belong_data.push({type:items.type, module_code: items.item_code, module_num: items.num});
          }
        })

        this.editRegistProduct.type = '완제품'
        let thumbnail = '';
        if (this.productImg){
          thumbnail = mux.Util.uint8ArrayToHexString(await mux.Util.urlToBinary(this.productImg));
        }

        if(this.editedIndex === -1){ // editedIndex가 -1이면 등록
          let sendData = {
            "product_table-insert": [{
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "product_code": this.editRegistProduct.item_code,
                "classification": this.editRegistProduct.classification,
                "manufacturer": this.editRegistProduct.manufacturer,
                "model": this.editRegistProduct.model,
                "name": this.editRegistProduct.name,
                "photo": thumbnail ? this.editRegistProduct.item_code + ".png" : "",
                "spec": this.editRegistProduct.spec,
                "thumbnail": thumbnail,
                "type": this.editRegistProduct.type,
                "unit_price": this.editRegistProduct.unit_price
              },
              "select_where": {"product_code": this.editRegistProduct.item_code}
            }]
          };

          let stock_data = [];
          stock_item.forEach(data =>{
            stock_data.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "conditions": data.conditions,
                "product_code": this.editRegistProduct.item_code,
                "spot": data.spot,
                "stock_num": data.stock_num,
                "type": this.editRegistProduct.type
              },
              "select_where": {"product_code": this.editRegistProduct.item_code, "spot": data.spot}
            });
          });
          sendData["stock_table-insert"] = stock_data;

          let product_module_data = [];
          this.product_set_items_data.forEach(data =>{
            if(data.type == '반제품'){
              product_module_data.push({
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data":{
                  "product_code": this.editRegistProduct.item_code,
                  "module_code": data.item_code,
                  "module_num": data.num
                },
                "select_where": {"product_code": this.editRegistProduct.item_code, "module_code": data.item_code}
              });
            }
          });
          sendData["product_module_table-insert"] = product_module_data;

          let product_material_data = [];
          this.product_set_items_data.forEach(data =>{
            if(data.type == '원부자재'){
              product_material_data.push({
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data":{
                  "product_code": this.editRegistProduct.item_code,
                  "material_code": data.item_code,
                  "material_num": data.num
                },
                "select_where": {"product_code": this.editRegistProduct.item_code, "material_code": data.item_code}
              });
            }
          });
          sendData["product_material_table-insert"] = product_material_data;

          const prevURL = window.location.href;
          try {
            let result = await mux.Server.post({
              path: '/api/sample_rest_api/',
              params: sendData
            });
            if (prevURL !== window.location.href) return;

            if (typeof result === 'string'){
              result = JSON.parse(result);
            }
            if(result['code'] == 0){
              // console.log('result :>> ', result);
              alert('완제품 등록이 완료되었습니다');
            } else {
              if (prevURL !== window.location.href) return;
              alert(result['failed_info']);
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
              alert(error.response['data']['failed_info'].msg);
            else
              alert(error);
          }
        }else{// 아니라면 수정
          let sendData = {
            "product_table-update": [{
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "modifier"
              },
              "data":{
                "product_code": this.editRegistProduct.item_code,
                "classification": this.editRegistProduct.classification,
                "manufacturer": this.editRegistProduct.manufacturer,
                "model": this.editRegistProduct.model,
                "name": this.editRegistProduct.name,
                "photo": thumbnail ? this.editRegistProduct.item_code + ".png" : "",
                "spec": this.editRegistProduct.spec,
                "thumbnail": thumbnail,
                "type": this.editRegistProduct.type,
                "unit_price": this.editRegistProduct.unit_price
              },
              "update_where": {"product_code": this.editRegistProduct.item_code}
            }]
          };

          sendData["stock_table-delete"] = [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data": {},
            "delete_where": {"product_code": this.editRegistProduct.item_code}
          }];

          let stock_data = [];
          stock_item.forEach(data =>{
            stock_data.push({
              "user_info": {
                "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                "role": "creater"
              },
              "data":{
                "conditions": data.conditions,
                "product_code": this.editRegistProduct.item_code,
                "spot": data.spot,
                "stock_num": data.stock_num,
                "type": this.editRegistProduct.type
              },
              "select_where": {"product_code": "!JUST_INSERT!"}
            });
          });
          sendData["stock_table-insert"] = stock_data;

          sendData["product_module_table-delete"] = [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data": {},
            "delete_where": {"product_code": this.editRegistProduct.item_code}
          }];

          let product_module_data = [];
          this.product_set_items_data.forEach(data =>{
            if(data.type == '반제품'){
              product_module_data.push({
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data":{
                  "product_code": this.editRegistProduct.item_code,
                  "module_code": data.item_code,
                  "module_num": data.num
                },
                "select_where": {"product_code": "!JUST_INSERT!"}
              });
            }
          });
          sendData["product_module_table-insert"] = product_module_data;

          sendData["product_material_table-delete"] = [{
            "user_info": {
              "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
              "role": "modifier"
            },
            "data": {},
            "delete_where": {"product_code": this.editRegistProduct.item_code}
          }];

          let product_material_data = [];
          this.product_set_items_data.forEach(data =>{
            if(data.type == '원부자재'){
              product_material_data.push({
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "creater"
                },
                "data":{
                  "product_code": this.editRegistProduct.item_code,
                  "material_code": data.item_code,
                  "material_num": data.num
                },
                "select_where": {"product_code": "!JUST_INSERT!"}
              });
            }
          });
          sendData["product_material_table-insert"] = product_material_data;

          const prevURL = window.location.href;
          try {
            let result = await mux.Server.post({
              path: '/api/sample_rest_api/',
              params: sendData
            });
            if (prevURL !== window.location.href) return;

            if (typeof result === 'string'){
              result = JSON.parse(result);
            }
            if(result['code'] == 0){
              // console.log('result :>> ', result);
              alert('완제품 수정이 완료되었습니다');
            } else {
              if (prevURL !== window.location.href) return;
              alert(result['failed_info']);
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
              alert(error.response['data']['failed_info'].msg);
            else
              alert(error);
          }
        }
        // console.log('완제품 데이터 : ' + JSON.stringify(this.editRegistProduct));
      }
    },

    addItems(){
      let check_duplicate=[];
      let set_item;
      let selected_item;
      if(this.tab_main == 1){
        set_item = this.module_set_material_data;
        selected_item = this.selected_material_for_module_data;
      }else{
        set_item = this.product_set_items_data;
        selected_item = this.selected_items_for_product_data;
      }
      set_item.forEach(item => {
        for(let d=0; d<selected_item.length; d++){
          if(item.item_code === selected_item[d]._code){
            check_duplicate.push(item.item_code);
          }
        }
      })
      if(check_duplicate.length > 0){
        let duplicate = JSON.stringify(check_duplicate).replace( "[",'').replace( "]",'');
        alert(duplicate + '은(는) 이미 추가된 제품입니다.')
        return
      }else{
        selected_item.forEach(data =>{
          data.item_code = data._code
          set_item.push(data);
        })
        this.selected_material_for_module_data = []
        this.selected_items_for_product_data = []
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
      spot_input.push( {label:'재고상태'+[length], list:['G', 'B'], type:'auto', column_name:'conditions', col:'12', sm:'4', lg:'4', value:''},)

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

    async deleteItemConfirm () {
      this.deleteItemList = {};
      this.deleteItemList.modifier = this.$cookies.get(this.$configJson.cookies.id.key);
      if(this.tab_main == 0){
        this.deleteItemList.material_code = this.editRegistMaterial.item_code;
        // console.log('원부자재 삭제 : ' + JSON.stringify(this.deleteItemList));

        const prevURL = window.location.href;
        try {
          let result = await mux.Server.post({
            path: '/api/sample_rest_api/',
            params: {
              "product_material_table-cancel": [{
                "data": {},
                "cancel_where": {"material_code": this.deleteItemList.material_code}
              }],
              "module_material_table-cancel": [{
                "data": {},
                "cancel_where": {"material_code": this.deleteItemList.material_code}
              }],
              "material_table-delete": [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data": {},
                "delete_where": {"material_code": this.deleteItemList.material_code}
              }],
              "stock_table-delete": [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data": {},
                "delete_where": {"product_code": this.deleteItemList.material_code, "type": "원부자재"}
              }],
            }
          });
          if (prevURL !== window.location.href) return;

          if (typeof result === 'string'){
            result = JSON.parse(result);
          }
          if(result['code'] == 0){
            // console.log('result :>> ', result);
            alert('삭제가 완료되었습니다');
            this.material_data.splice(this.editedIndex, 1)
          } else {
            if (prevURL !== window.location.href) return;
            alert(result['failed_info']);
          }
        } catch (error) {
          if (prevURL !== window.location.href) return;
          if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
            alert(error.response['data']['failed_info'].msg);
          else
            alert(error);
        }
      }else if(this.tab_main == 1){
        this.deleteItemList.module_code = this.editRegistModule.item_code;
        // console.log('반제품 삭제 : ' + JSON.stringify(this.deleteItemList));

        const prevURL = window.location.href;
        try {
          let result = await mux.Server.post({
            path: '/api/sample_rest_api/',
            params: {
              "product_module_table-cancel": [{
                "data": {},
                "cancel_where": {"module_code": this.deleteItemList.module_code}
              }],
              "module_table-delete": [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data": {},
                "delete_where": {"module_code": this.deleteItemList.module_code}
              }],
              "stock_table-delete": [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data": {},
                "delete_where": {"product_code": this.deleteItemList.module_code, "type": "반제품"}
              }],
              "module_material_table-delete": [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data": {},
                "delete_where": {"module_code": this.deleteItemList.module_code}
              }]
            }
          });
          if (prevURL !== window.location.href) return;

          if (typeof result === 'string'){
            result = JSON.parse(result);
          }
          if(result['code'] == 0){
            // console.log('result :>> ', result);
            alert('삭제가 완료되었습니다');
            this.module_data.splice(this.editedIndex, 1)
          } else {
            if (prevURL !== window.location.href) return;
            alert(result['failed_info']);
          }
        } catch (error) {
          if (prevURL !== window.location.href) return;
          if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
            alert(error.response['data']['failed_info'].msg);
          else
            alert(error);
        }
      }else if(this.tab_main == 2){
        this.deleteItemList.product_code = this.editRegistProduct.item_code;
        // console.log('완제품 삭제 : ' + JSON.stringify(this.deleteItemList));

        const prevURL = window.location.href;
        try {
          let result = await mux.Server.post({
            path: '/api/sample_rest_api/',
            params: {
              "product_table-delete": [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data": {},
                "delete_where": {"product_code": this.deleteItemList.product_code}
              }],
              "stock_table-delete": [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data": {},
                "delete_where": {"product_code": this.deleteItemList.product_code, "type": "완제품"}
              }],
              "product_module_table-delete": [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data": {},
                "delete_where": {"product_code": this.deleteItemList.product_code}
              }],
              "product_material_table-delete": [{
                "user_info": {
                  "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
                  "role": "modifier"
                },
                "data": {},
                "delete_where": {"product_code": this.deleteItemList.product_code}
              }]
            }
          });
          if (prevURL !== window.location.href) return;

          if (typeof result === 'string'){
            result = JSON.parse(result);
          }
          if(result['code'] == 0){
            // console.log('result :>> ', result);
            alert('삭제가 완료되었습니다');
            this.product_data.splice(this.editedIndex, 1)
          } else {
            if (prevURL !== window.location.href) return;
            alert(result['failed_info']);
          }
        } catch (error) {
          if (prevURL !== window.location.href) return;
          if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
            alert(error.response['data']['failed_info'].msg);
          else
            alert(error);
        }
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
      this.search_material_for_module_data = [];
      this.search_items_for_product_data = [];
      this.set_material_search = false;
      let search_input;
      if(this.tab_main == 1){
        search_input = this.moduleSearchMaterialInputs;
      }else{
        search_input = this.productSearchMaterialModuleInputs;
      }
      search_input.forEach(input => {
        if(input.label == '분류'){
          input.value = 'All'
        }else{
          input.value = ''
        }
      })
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
  },
}
</script>

<style lang="">

</style>
