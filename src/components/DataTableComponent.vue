<template>
  <v-row>
    <v-col cols="12">
      <v-row>
        <v-col v-if="allGroupToggleBtn"
          cols="12"
          sm="6"
        >
          <v-btn
            v-if="button_toggle"
            color="default"
            elevation="1"
            small
            class="mr-2 "
            @click="closeAll"
          >{{ closeAllGroupText ? closeAllGroupText : '전체 접기' }}</v-btn>
          <v-btn
            v-if="!button_toggle"
            color="default"
            elevation="1"
            small
            class="mr-2 "
            @click="openAll"
          >{{ openAllGroupText ? openAllGroupText : '전체 펼치기' }}</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table
            :dense="dense"
            :value="selected_data"
            @input="updateSelectedData"
            :headers="addedHeaders"
            :items="items"
            :item-key="itemKey"
            :class="tableClass ? tableClass : 'elevation-1'"
            :show-select="showSelect || showSelectChildren"
            :search="search"
            :sort-by="sortBy"
            :group-by="groupBy"
            v-model="selected_data"
            :style="tableStyle ? tableStyle : ''"
            :hide-default-footer="hideDefaultFooter"
            :disable-pagination="disablePagination"
            :disable-sort="disableSort"
          >
            <template v-slot:[`group.header`]="{ group, headers, toggle, isOpen }">
              <td :colspan="headers.length" @click="toggle"  style="cursor: pointer;">
                  <v-btn small icon :ref="group" :data-open="isOpen">
                      <v-icon>{{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                  {{ group }}
              </td>
              <td v-if="editableGroup || deletableGroup">
                <v-icon v-if="editableGroup"
                  small
                  @click="editGroupItem(group)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon v-if="deletableGroup"
                  small
                  @click="deleteGroupItem(group)"
                >
                  mdi-delete
                </v-icon>
              </td>
            </template>

            <template v-slot:item="{ index, item, select, isSelected, expand }">
              <tr  @click="clickTr(item)">
                <td v-if="approval" align="center">
                  <v-menu
                    v-if="item.approval_phase == '미승인' || item.approval_phase == '미확인'"
                    :close-on-content-click="false"
                    :nudge-width="200"
                    offset-x
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip
                        class="ma-2"
                        small
                        :color="item.approval_phase == '미확인' ? 'default' : 'amber lighten-4'"
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ item.approval_phase }}
                      </v-chip>
                    </template>

                    <v-card class="pa-0">
                      <v-list class="pa-0">
                        <v-list-item class="pa-0">
                          <v-list-item-content class="pa-3">
                            <v-radio-group
                              v-model="approve_radio"
                              dense
                              hide-details
                              row
                              class="mt-0"
                            >
                              <v-radio
                                :label="item.approval_phase == '미승인'? '승인' : '확인'"
                                :value=true
                              ></v-radio>
                              <v-radio
                                label="반려"
                                :value=false
                              ></v-radio>
                              <v-btn
                                small
                                :color="approve_radio ? 'primary' : 'error' "
                                @click="changeApprovalPhase(item, approve_radio, reject_reason)"
                              >
                                저장
                              </v-btn>
                            </v-radio-group>
                            <v-text-field
                              v-if="!approve_radio"
                              v-model="reject_reason"
                              dense
                              hide-details
                              filled
                              label="사유"
                            ></v-text-field>
                            <!-- <v-list-item-title class="mt-4 font-weight-bold ">
                              {{ approve_radio ? (item.approval_phase == '미승인'? '승인' : '확인') : '반려' }} 하시겠습니까?
                              <v-btn
                                small
                                :color="approve_radio ? 'primary' : 'error' "
                              >
                                {{ approve_radio ? (item.approval_phase == '미승인'? '승인' : '확인') : '반려' }}
                              </v-btn>
                            </v-list-item-title> -->
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-menu>
                  <v-menu
                    v-else-if="item.approval_phase == '승인'"
                    :close-on-content-click="false"
                    :max-width="160"
                    offset-x
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip
                        class="ma-2"
                        small
                        color="primary"
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ item.approval_phase }}
                      </v-chip>
                    </template>

                    <v-card class="pa-0">
                      <v-list class="pa-0">
                        <v-list-item class="pa-0">
                          <v-list-item-content class="pa-3">
                            <v-list-item-subtitle>승인일 : {{ item.approved_date }}</v-list-item-subtitle>
                            <v-btn
                              small
                              color="success"
                              @click="confirmationDialogOpen(item)"

                            >{{ approval == 'inbound' ? '확인서' : '요청서' }}</v-btn>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                    <ModalDialogComponent
                      v-if="approval == 'inbound'"
                      :dialog-value="confirmationDialog"
                      max-width="900px"
                      title-class="display-none"
                      text-class="pb-0"
                      :persistent="true"
                    >
                      <InboundApproveComponent
                      :inbound-data="item"
                      :belong-data="inbound_approve_belong"
                      :belong-files="inbound_approve_files"
                      ref="inboundApproveComponent"
                      />
                      <div style="position: sticky; bottom: 60px;">
                        <p style="text-align: right;">
                          <v-menu offset-x>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                color="primary"
                                fab
                                x-small
                                elevation="1"
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon small>mdi-content-save</v-icon>
                              </v-btn>
                            </template>
                            <v-list>
                              <v-list-item
                                dense
                                @click="printInboundApprove('입고확인서')"
                              >
                                <v-list-item-title>PDF</v-list-item-title>
                              </v-list-item>
                              <v-list-item
                                dense
                                @click="printInboundApprove()"
                              >
                                <v-list-item-title>출력</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </p>
                        <p style="text-align: right;">
                          <v-btn
                            fab
                            color="blue-grey darken-1"
                            x-small
                            class="white--text"
                            elevation="1"
                            @click="confirmationDialog=false"
                          >
                            <v-icon> mdi-close-thick </v-icon>
                          </v-btn>
                        </p>
                      </div>
                    </ModalDialogComponent>
                    <ModalDialogComponent
                      v-else-if="approval == 'ship'"
                      :dialog-value="confirmationDialog"
                      max-width="900px"
                      title-class="display-none"
                      :persistent="true"
                    >
                      <ShipApproveComponent
                        :ship-data="item"
                        :belong-data="ship_approve_belong"
                        :belong-files="ship_approve_files"
                        ref="shipApproveComponent"
                      />
                      <div style="position: sticky; bottom: 60px;">
                        <p style="text-align: right;">
                          <v-menu offset-x>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                color="primary"
                                fab
                                x-small
                                elevation="1"
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon small>mdi-content-save</v-icon>
                              </v-btn>
                            </template>
                            <v-list>
                              <v-list-item
                                dense
                                @click="printShipApprove('출고요청서')"
                              >
                                <v-list-item-title>PDF</v-list-item-title>
                              </v-list-item>
                              <v-list-item
                                dense
                                @click="printShipApprove()"
                              >
                                <v-list-item-title>출력</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </p>
                        <p style="text-align: right;">
                          <v-btn
                            fab
                            color="blue-grey darken-1"
                            x-small
                            class="white--text"
                            elevation="1"
                            @click="confirmationDialog=false"
                          >
                            <v-icon> mdi-close-thick </v-icon>
                          </v-btn>
                        </p>
                      </div>
                    </ModalDialogComponent>
                  </v-menu>
                  <v-menu
                    v-else-if="item.approval_phase == '반려'"
                    open-on-hover
                    :close-on-content-click="false"
                    :nudge-width="150"
                    offset-x
                  >
                    <template v-slot:activator="{ on, attrs }">

                      <v-chip
                        class="ma-2"
                        small
                        color="error"
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ item.approval_phase }}
                      </v-chip>
                    </template>

                    <v-card class="pa-0">
                      <v-list class="pa-0">
                        <v-list-item class="pa-0">
                          <v-list-item-content class="pa-3">
                            <v-list-item-subtitle class="error--text font-weight-black">[ 반려사유 ]</v-list-item-subtitle>
                            <v-list-item-title>{{ item.rejecter }} : {{ item.reject_reason }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-menu>
                </td>
                <td v-if="!showSelect && showSelectChildren"></td>
                <td v-if="showSelect">
                  <v-checkbox dense hide-details class="mt-0 pt-0"
                    v-model="selected_data" :value="item" @input="select(!isSelected)"
                  ></v-checkbox>
                </td>
                <td v-for="(header,id) in headers" :class="Object.keys(item).includes(header.value) && (!groupBy || header.value !== groupBy) ? 'text-center' : 'text-right'" :key="index+'_'+id"
                @click="childrenKey && item[childrenKey] && item[childrenKey].length > 0 ? toggleExpanded(item, expand) : null">
                  <v-btn small icon color="default"
                    v-if="item[childrenKey] && item[childrenKey].length > 0
                          && !Object.keys(item[childrenKey][0]).includes(header.value)
                          && id+1 < headers.length
                          && Object.keys(item[childrenKey][0]).includes(headers[id+1].value)">
                    <v-icon> {{ expanded.includes(item) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                  {{ Object.keys(item).includes(header.value) && (!groupBy || header.value !== groupBy) ? item[header.value] : '' }}
                </td>
                <td v-if="stockNumInfo || itemNumInfo" align="center">
                  <p v-if="stockNumInfo" class="my-2">
                    <v-chip
                      class="mr-2"
                      color="yellow lighten-4"
                      small
                    >총 재고 : {{ item.total_stock }}</v-chip>
                    <v-chip
                      class="mr-2"
                      color="yellow lighten-4"
                      small
                    >재고 총액 : {{ item.total_stock * item.unit_price }}</v-chip>
                  </p>
                  <p v-if="itemNumInfo" class="my-2">
                    <v-chip
                      class="mr-2"
                      color="yellow lighten-4"
                      small
                    >필요수량 : {{ item.num }}</v-chip>
                    <v-chip
                      class="mr-2"
                      color="yellow lighten-4"
                      small
                    >금액 : {{ item.num * item.unit_price }}</v-chip>
                  </p>
                </td>
                <td v-if="showItemDetails" align="center">
                  <v-icon
                    @click="detailItem(item)"
                  >
                    mdi-magnify
                  </v-icon>
                </td>
                <td v-if="editable || deletable" align="center">
                  <v-icon v-if="editable"
                    small
                    @click="editItem(item)"
                    class="mr-2"
                  >
                    mdi-pencil
                  </v-icon>
                  <v-icon v-if="deletable"
                    small
                    @click="deleteItem(item)"
                  >
                    mdi-delete
                  </v-icon>
                </td>
                <td v-if="showPhoto" align="center">
                  <v-menu
                    v-if="item.thumbnail"
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
                              <v-img
                                alt="Pionelectric Logo"
                                class="shrink mr-2"
                                contain
                                :src="imageBinary(item.thumbnail)"
                                transition="scale-transition"
                                width="350"
                              />
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-menu>
                </td>

                <td v-if="showFiles" align="center">
                  <v-menu
                    :close-on-content-click="false"
                    :nudge-width="100"
                    offset-x
                    v-if="!item.files == ''"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        small
                        v-bind="attrs"
                        v-on="on"
                        @click="getFileName(item.files)"
                      >
                        mdi-download-box
                      </v-icon>
                    </template>

                    <v-card class="pa-0">
                      <v-list class="pa-0">
                          <v-chip
                              v-for="(files, i) in files_list"
                              :key="i"
                              class="ma-2"
                              color="success"
                              :href="'https://mkorbucket-public.s3.ap-northeast-2.amazonaws.com/'+files"
                              :download="files"
                            >
                                {{ files }}
                            </v-chip>
                      </v-list>
                    </v-card>
                  </v-menu>
                </td>

                <td v-if="showAuthority" align="left">
                  <v-menu
                    :close-on-content-click="false"
                    :nudge-width="100"
                    offset-x
                  >
                    <template v-slot:activator="{ on, attrs }">

                      <v-chip
                        class="ma-1"
                        color="default"
                        style="display:table"
                        small
                          v-bind="attrs"
                          v-on="on"
                        @click="item.authCheck = item.authority"
                      >
                        <v-icon
                          small
                        >
                          mdi-pencil
                        </v-icon>
                      </v-chip>
                    </template>

                    <v-card class="pa-0">
                      <v-list class="pa-3">
                        <v-checkbox
                          v-for="(select_authority, i) in authority_list"
                          :key="i"
                          v-model="item.authCheck"
                          dense
                          hide-details
                          :label="select_authority"
                          :value="select_authority"
                        ></v-checkbox>
                        <v-btn
                          small
                          color="primary"
                          class="mt-3"
                          @click="saveUserAuthority"
                        >저장</v-btn>
                      </v-list>
                    </v-card>
                  </v-menu>
                  <v-chip
                    class="ma-1"
                    color="primary"
                    style="display:table"
                    small
                    v-for="(auth, i) in item.authority"
                    :key="i"
                  >
                      {{ auth }}
                  </v-chip>
                </td>
              </tr>
            </template>

            <template v-if="childrenKey" v-slot:expanded-item = "{ index, item, select, isSelected }">
              <tr v-for="(data,idx) in item[childrenKey]" :key="index+'_'+idx" style="background-color: #efefef;" v-show="expanded.includes(item)">
                <td v-if="showSelect && !showSelectChildren"></td>
                <td v-if="showSelectChildren">
                  <v-checkbox dense hide-details class="mt-0 pt-0"
                    v-model="selected_data" :value="data" @input="select(!isSelected)"
                  ></v-checkbox>
                </td>
                <td v-for="(header,id) in headers" class="text-center" :key="index+'_'+idx+'_'+id">
                  {{ Object.keys(data).includes(header.value) ? data[header.value] : '' }}
                </td>
                <td v-if="editableBelong || deletableBelong">
                  <v-icon v-if="editableBelong"
                    small
                    @click="editBelongItem(item)"
                  >
                    mdi-pencil
                  </v-icon>
                  <v-icon v-if="deletableBelong"
                    small
                    @click="deleteBelongItem(item)"
                  >
                    mdi-delete
                  </v-icon>
                </td>
                <td v-if="stockNumInfoBelong || itemNumInfoBelong" align="center">
                  <p v-if="stockNumInfoBelong" class="my-2">
                    <v-chip
                      class="mr-2"
                      color="white"
                      small
                    >총 재고 : {{ data.total_stock }}</v-chip>
                    <v-chip
                      class="mr-2"
                      color="white"
                      small
                    >재고 총액 : {{ data.total_stock * data.unit_price }}</v-chip>
                  </p>
                  <p v-if="itemNumInfoBelong" class="my-2">
                    <v-chip
                      class="mr-2"
                      color="white"
                      small
                    >필요수량 : {{ data.num }}</v-chip>
                    <v-chip
                      class="mr-2 white"
                      small
                    >금액 : {{ data.num * data.unit_price }}</v-chip>
                  </p>
                </td>
                <td v-if="showItemDetails" align="center">
                  <v-icon
                    @click="detailItem(item.belong_data[idx])"
                  >
                    mdi-magnify
                  </v-icon>
                </td>
                <td v-if="notEditableBelong"></td>
                <td v-if="showPhoto" align="center">
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
                              <v-img
                                alt="Pionelectric Logo"
                                class="shrink mr-2"
                                contain
                                :src="imageBinary(data.thumbnail)"
                                transition="scale-transition"
                                width="150"
                              />
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-menu>
                </td>
              </tr>
            </template>

          </v-data-table>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>


/**
 * @file DataTableComponent.vue
 * @description 데이터테이블 컴포넌트
 *
 * @typedef {Object} props
 * @property {Array} headers - 테이블 헤더 배열 ex) [ {text: '부제품', align: 'center', value: 'product_type'}, {text: '관리코드', align: 'center', value: 'product_code'} ]
 * @property {Array} items - 테이블 아이템 데이터 배열
 * @property {Array} itemBelong - 하위 데이터 배열
 * @property {String} itemKey - 아이템 키
 * @property {String} [groupBy] - 그룹핑할 헤더 value(default:undefined)
 * @property {String} [childrenKey] - 하위 그룹 객체 key(default:'')
 * @property {Boolean} [allGroupToggleBtn] - 모든 그룹 토글 버튼 생성 여부(default:false)
 * @property {Boolean} [groupDefaultOpen] - 모든 그룹 기본 펼침 여부(default:false)
 * @property {String} [closeAllGroupText] - 모든 그룹 닫기 버튼 텍스트(default:전체 접기)
 * @property {String} [openAllGroupText] - 모든 그룹 펼치기 버튼 텍스트(default:전체 펼치기)
 * @property {Boolean} [dense] - 줄간격 줄임 여부(default:false)
 * @property {String} [tableClass] - 테이블 스타일 클래스(default:elevation-1)
 * @property {Boolean} [showSelect] - 체크박스 사용 여부(default:false)
 * @property {Boolean} [showSelectChildren] - 하위 객체 체크박스 사용 여부(default:false)
 * @property {String} [search] - 검색창 기본 value(default:undefined)
 * @property {String} [sortBy] - 정렬할 헤더 value(default:undefined)
 * @property {Boolean} [editableGroup] - 그룹 편집 버튼 여부(default:false)
 * @property {Boolean} [deletableGroup] - 그룹 삭제 버튼 여부(default:false)
 * @property {Boolean} [editable] - 항목 편집 버튼 여부(default:false)
 * @property {Boolean} [deletable] - 항목 삭제 버튼 여부(default:false)
 * @property {Boolean} [editableDialog] - 항목 편집 버튼 여부(default:false)
 * @property {Boolean} [deletableDialog] - 항목 삭제 버튼 여부(default:false)
 * @property {Function} editableDialogClick - 항목 편집 버튼 여부(default:false)
 * @property {Function} deletableDialogClick - 항목 삭제 버튼 여부(default:false)
 * @property {Boolean} [editableBelong] - 내부 항목 편집 버튼 여부(default:false)
 * @property {Boolean} [deletableBelong] - 내부 항목 삭제 버튼 여부(default:false)
 * @property {Boolean} [notEditableBelong] - 편집 및 삭제 컬럼 여부(default:false)
 * @property {Boolean} [showPhoto] - 자재 사진 노출 여부(default:false)
 * @property {String} [approval] - 승인 노출 여부(default:undefined)
 * @property {Boolean} [showFiles] - 첨부파일 노출 여부(default:false)
 * @property {Boolean} [showAuthority] - 권한 설정 여부(default:false)
 * @property {Boolean} [showItemDetails] - 자재 상세 내역 노출 여부(default:false)
 * @property {Boolean} [stockNumInfo] - 자재 수량 정보 노출 여부(default:false)
 * @property {Boolean} [itemNumInfo] - 필요 수량 정보 노출 여부(default:false)
 * @property {Boolean} [stockNumInfoBelong] - 내부 항목 자재 수량 정보 노출 여부(default:false)
 * @property {Boolean} [itemNumInfoBelong] - 내부 항목 필요 수량 정보 노출 여부(default:false)
 * @property {String} [tableStyle] - 테이블 style(default:'')
 * @property {Boolean} [hideDefaultFooter] - 기본 footer 숨기기 여부(default:false)
 * @property {Boolean} [disablePagination] - 페이징 방지 여부(default:false)
 * @property {Boolean} [disableSort] - 정렬 방지 여부(default:false)
 *
 *
 * @emits input
 * @emits deleteGroup
 * @emits editGroup
 * @emits delete
 * @emits edit
 * @emits deleteBelong
 * @emits editBelong
 * @emits clickTr
 */


import ModalDialogComponent from "@/components/ModalDialogComponent";
import InboundApproveComponent from "@/components/InboundApproveComponent";
import ShipApproveComponent from "@/components/ShipApproveComponent";
import mux from "@/mux";

export default {
  props: {
    allGroupToggleBtn: Boolean,
    groupDefaultOpen: Boolean,
    closeAllGroupText: String,
    openAllGroupText: String,
    dense: Boolean,
    headers: Array,
    items: Array,
    itemBelong: Array,
    itemKey: String,
    tableClass: String,
    showSelect: Boolean,
    showSelectChildren: Boolean,
    search: String,
    sortBy: String,
    groupBy: String,
    childrenKey: String,
    editableGroup: Boolean,
    deletableGroup: Boolean,
    editable: Boolean,
    deletable: Boolean,
    editableDialog: Boolean,
    deletableDialog: Boolean,
    editableDialogClick: Function,
    deletableDialogClick: Function,
    editableBelong: Boolean,
    deletableBelong: Boolean,
    notEditableBelong: Boolean,
    showPhoto: Boolean,
    approval: String,
    showFiles: Boolean,
    showAuthority: Boolean,
    showItemDetails: Boolean,
    stockNumInfo: Boolean,
    itemNumInfo: Boolean,
    stockNumInfoBelong: Boolean,
    itemNumInfoBelong: Boolean,
    tableStyle: String,
    hideDefaultFooter: Boolean,
    disablePagination: Boolean,
    disableSort: Boolean,
    value: {
      type: null,
      default: () => []
    }
  },
  components:{
    ModalDialogComponent,
    InboundApproveComponent,
    ShipApproveComponent,
  },
  data() {
    return {
      button_toggle: false,
      selected_data: this.value.slice(),
      addedHeaders: [],
      expanded: [],
      files_list:[],
      inbound_approve_belong: [],
      inbound_approve_files: [],
      ship_approve_belong: [],
      //authority_list:['관리자', '노무비정보관리', '원가계산', '입고승인', '출고승인'],
      authority_list:[],
      authority_list_info:[],
      approve_radio: true,
      reject_reason: '',
      confirmationDialog: false,
    };
  },
  async mounted() {
    this.addedHeaders = this.headers.map((obj)=>{
          return obj;
    }).filter(element => element);
    if (this.stockNumInfo || this.itemNumInfo || this.stockNumInfoBelong || this.itemNumInfoBelong ){
      this.addedHeaders.push({ text: '수량', align: 'center', value: 'details', sortable: false });
    }
    if (this.showItemDetails){
      this.addedHeaders.push({ text: '상세', align: 'center', value: 'details', sortable: false });
    }
    if (this.editableGroup || this.deletableGroup
    || this.editable || this.deletable
    || this.editableBelong || this.deletableBelong){
      this.addedHeaders.push({ text: '편집', align: 'center', value: 'edit', sortable: false });
    }
    if (this.showPhoto){
      this.addedHeaders.push({ text: '사진', align: 'center', value: 'product_photo', sortable: false });
    }
    if (this.showFiles){
      this.addedHeaders.push({ text: '첨부', align: 'center', value: 'files', sortable: false });
    }
    if (this.showAuthority){
      this.addedHeaders.push({ text: '권한', align: 'center', value: 'authority', sortable: false });
    }
    if (this.approval){
      this.addedHeaders.unshift({ text: '승인', align: 'center', value: 'approval', sortable: false });
    }
    if (this.groupBy){
      this.addedHeaders.unshift({ text: this.headers.find(x=>x.value === this.groupBy).text, align: 'center', value: ''});
    }

    if (this.groupDefaultOpen){
      this.openAll();
    }else {
      this.closeAll();
    }
  },
  watch: {
    value(newValue) {
      this.selected_data = newValue.slice();
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    async initialize () {
      if (this.showAuthority){
        const prevURL = window.location.href;
        try {
          let result = await mux.Server.get({path: '/api/admin/groups/'});
          if (prevURL !== window.location.href) return;
          // console.log('result :>> ', result);
          //alert(result.message);
          // 성공시
          if (result.code == 0){
            this.authority_list_info = result;
            this.authority_list = result.data.map(x=>x.group_alias);
          }
        } catch (error) {
          if (prevURL !== window.location.href) return;
          alert(error);
        }
      }
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
    saveUserAuthority(){
      this.$emit("changeAuthority", this.authority_list);
      // this.authority_list : 이 값은 현재 등록되어 있는 모든 그룹 리스트 (array)
      // 실제 여기서는 this.authority_list 값은 의미가 없고, 권한 설정(pencil 클릭) 박스에서 등록된 그룹 리스트에서 check된
      // 그룹 리스트와 해당 row에 사용자 정보를 가져와야 함.
      // 해당 emit는 AuthorizationPage component로 전달 됨.
      // AuthrizationPage component에서 rest api를 호출하여 선택된 사용자의 변경된 그룹 리스트를 업데이트 함.
    },
    updateSelectedData(newValue) {
      this.$emit('input', newValue);
    },
    deleteGroupItem(item) {
      this.$emit("deleteGroup", item);
    },
    editGroupItem(item) {
      this.$emit("editGroup", item);
    },
    deleteItem(item) {
      this.$emit("delete", item);
    },
    editItem(item) {
      this.$emit("edit", item);
    },
    deleteBelongItem(item) {
      this.$emit("deleteBelong", item);
    },
    editBelongItem(item) {
      this.$emit("editBelong", item);
    },
    clickTr(item){
      this.$emit("clickTr", item);
    },
    detailItem(item){
      this.$emit("itemDetials", item);
    },
    changeApprovalPhase(item, change, reason){
      this.$emit("setApprovalPhase", item, change, reason);
    },
    closeAll () {
        Object.keys(this.$refs).forEach(k => {
            if (this.$refs[k] && this.$refs[k].$attrs['data-open']) {
                this.$refs[k].$el.click()
            }
        })
        this.button_toggle = false;
    },
    openAll () {
        Object.keys(this.$refs).forEach(k => {
            if (this.$refs[k] && !this.$refs[k].$attrs['data-open']) {
                this.$refs[k].$el.click()
            }
        })
        this.button_toggle = true;
    },

    toggleExpanded(item, expand) {
      expand(true);
      if (this.expanded.includes(item)){
        const index = this.expanded.indexOf(item);
        this.expanded.splice(index, 1);
      } else {
        this.expanded.push(item);
      }
    },
    getFileName(item){
      let files_array = item.split(',');
      this.files_list = files_array;
    },
    confirmationDialogOpen(item){
      let belong_datas = item.belong_data
      let belong_files = item.files ? item.files.split(',') : '';
      this.inbound_approve_belong = [];
      this.ship_approve_belong = [];
      this.inbound_approve_files = belong_files;
      belong_datas.forEach(data =>{
        this.inbound_approve_belong.push(data);
        this.ship_approve_belong.push(data);
      })
      this.confirmationDialog = true;
    },
    printInboundApprove(fileName){
      setTimeout(async () => {
        if (fileName){
          mux.Util.downloadPDF(this.$refs.inboundApproveComponent, fileName);
        }else {
          mux.Util.print(this.$refs.inboundApproveComponent);
        }
      }, 500);
    },
    printShipApprove(fileName){
      setTimeout(async () => {
        if (fileName){
          mux.Util.downloadPDF(this.$refs.shipApproveComponent, fileName);
        }else {
          mux.Util.print(this.$refs.shipApproveComponent);
        }
      }, 500);
    },
  },
};
</script>
<style>
  td, th {
    white-space: nowrap;
  }
</style>
