<template>
  <v-row>
    <v-col cols="12">
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
            v-model="selected_data"
            :style="tableStyle ? tableStyle : ''"
            :hide-default-footer="hideDefaultFooter"
            :disable-pagination="disablePagination"
            :disable-sort="disableSort"
          >

            <template v-slot:item="{ index, item, select, isSelected, expand }">
              <tr  @click="clickTr(item)">
                <td align="center">
                  <!-- 확인 또는 승인자가 아닐 경우 노출되는 단순  chip -->
                  <v-chip
                    v-if="(item.approval_phase == '미확인' && item.checker_id !== userID) || (item.approval_phase == '미승인'&& item.approver_id !== userID)"
                    class="ma-2"
                    small
                    :color="item.approval_phase == '미확인' ? 'default' : 'amber lighten-4'"
                  >
                    {{ item.approval_phase }}
                  </v-chip>

                  <v-chip
                    v-if="item.approval_phase == '승인'"
                    class="ma-2"
                    small
                    color="primary"
                  >
                    {{ item.approval_phase }}
                  </v-chip>
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
                  <!-- 확인 또는 승인자에 해당될 경우 노출되는 list형 chip -->
                  <v-menu
                    v-if="(item.approval_phase == '미확인' && item.checker_id == userID) || (item.approval_phase == '미승인' && item.approver_id == userID)"
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
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-menu>

                </td>
                <td v-if="approval && item.given_name">{{ item.given_name }}</td>
                <td v-if="approval && item.checker">
                  {{ item.checker }}
                  <v-icon
                    :color="item.checked_date ? 'success' : (item.rejected_date && item.rejecter === item.checker ? 'error' : 'grey lighten-1')"
                  > mdi-circle-medium </v-icon>
                </td>
                <td v-if="approval && item.approver">
                  {{ item.approver }}
                  <v-icon
                    :color="item.approved_date ? 'success' : (item.rejected_date && item.rejecter === item.approver ? 'error' : 'grey lighten-1')"
                  > mdi-circle-medium </v-icon>
                </td>
                <td v-if="!showSelect && showSelectChildren"></td>
                <td v-if="showSelect">
                  <v-checkbox dense hide-details class="mt-0 pt-0"
                    v-model="selected_data" :value="item" @input="select(!isSelected)"
                  ></v-checkbox>
                </td>
                <td v-for="(header,id) in headers" :class="Object.keys(item).includes(header.value) && (!groupBy || header.value !== groupBy) ? 'text-' + header.align : 'text-center'" :key="index+'_'+id"
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
 * @property {Boolean} [dense] - 줄간격 줄임 여부(default:false)
 * @property {String} [tableClass] - 테이블 스타일 클래스(default:elevation-1)
 * @property {Boolean} [showSelect] - 체크박스 사용 여부(default:false)
 * @property {Boolean} [showSelectChildren] - 하위 객체 체크박스 사용 여부(default:false)
 * @property {String} [search] - 검색창 기본 value(default:undefined)
 * @property {String} [sortBy] - 정렬할 헤더 value(default:undefined)
 * @property {Boolean} [approval] - 승인 노출 여부(default:undefined)
 * @property {Boolean} [showFiles] - 첨부파일 노출 여부(default:false)
 * @property {Boolean} [showItemDetails] - 자재 상세 내역 노출 여부(default:false)
 * @property {Boolean} [stockNumInfo] - 자재 수량 정보 노출 여부(default:false)
 * @property {Boolean} [moduleStockPriceInfo] - 자재 수량 정보 노출 여부(default:false)
 * @property {Boolean} [stockPriceInfo] - 자재 수량 정보 노출 여부(default:false)
 * @property {Boolean} [itemNumInfo] - 필요 수량 정보 노출 여부(default:false)
 * @property {Boolean} [itemPriceInfo] - 필요 수량 정보 노출 여부(default:false)
 * @property {Boolean} [stockNumInfoBelong] - 내부 항목 자재 수량 정보 노출 여부(default:false)
 * @property {Boolean} [stockPriceInfoBelong] - 내부 항목 자재 금액 정보 노출 여부(default:false)
 * @property {Boolean} [itemNumInfoBelong] - 내부 항목 필요 수량 정보 노출 여부(default:false)
 * @property {Boolean} [itemPriceInfoBelong] - 내부 항목 필요 수량 정보 노출 여부(default:false)
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


import mux from "@/mux";

export default {
  props: {
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
    approval: Boolean,
    showFiles: Boolean,
    showItemDetails: Boolean,
    stockNumInfo: Boolean,
    itemNumInfo: Boolean,
    moduleStockPriceInfo: Boolean,
    stockPriceInfo: Boolean,
    itemPriceInfo: Boolean,
    stockNumInfoBelong: Boolean,
    stockPriceInfoBelong: Boolean,
    itemNumInfoBelong: Boolean,
    itemPriceInfoBelong: Boolean,
    tableStyle: String,
    hideDefaultFooter: Boolean,
    disablePagination: Boolean,
    disableSort: Boolean,
    loginId: String,
    value: {
      type: null,
      default: () => []
    }
  },
  components:{
  },
  data() {
    return {
      mux: mux,
      button_toggle: false,
      selected_data: this.value.slice(),
      addedHeaders: [],
      expanded: [],
      files_list:[],
      inbound_approve_belong: [],
      inbound_approve_files: [],
      ship_approve_belong: [],
      ship_approve_files: [],
      //authority_list:['관리자', '노무비정보관리', '원가계산', '입고승인', '출고승인'],
      authority_list:[],
      authority_list_info:[],
      approve_radio: true,
      reject_reason: '',
      confirmationDialog: false,
      userID:'',
    };
  },
  async mounted() {
    this.addedHeaders = this.headers.map((obj)=>{
          return obj;
    }).filter(element => element);
    if (this.stockNumInfo || this.itemNumInfo || this.stockNumInfoBelong || this.itemNumInfoBelong ){
      this.addedHeaders.push({ text: '수량', align: 'start', value: 'details', sortable: false });
    }
    if (this.stockPriceInfo || this.itemPriceInfo || this.stockPriceInfoBelong || this.itemPriceInfoBelong || this.moduleStockPriceInfo ){
      this.addedHeaders.push({ text: '금액', align: 'start', value: 'details', sortable: false });
    }
    if (this.showItemDetails){
      this.addedHeaders.push({ text: '상세', align: 'center', value: 'details', sortable: false });
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
    if (this.reshipment){
      this.addedHeaders.push({ text: '', align: 'center', value: 'reshipment', sortable: false });
    }
    if (this.addToTable || this.exceptFromTable || this.addBelongToTable){
      this.addedHeaders.unshift({ text: '', align: 'center', value: 'addToTable', sortable: false });
    }
    if (this.approval){
      this.addedHeaders.unshift({ text: '승인', align: 'start', value: 'approver', sortable: false });
      this.addedHeaders.unshift({ text: '확인', align: 'start', value: 'checker', sortable: false });
      this.addedHeaders.unshift({ text: '신청자', align: 'start', value: 'given_name', sortable: false });
      this.addedHeaders.unshift({ text: '단계', align: 'center', value: 'approval', sortable: false });
    }
    if (this.groupBy){
      this.addedHeaders.unshift({ text: this.headers.find(x=>x.value === this.groupBy).text, align: 'center', value: ''});
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
      this.userID = this.loginId
      console.log(this.userID);
    },
    updateSelectedData(newValue) {
      this.$emit('input', newValue);
    },
    clickTr(item){
      this.$emit("clickTr", item);
    },
    changeApprovalPhase(item, change, reason){
      this.$emit("setApprovalPhase", item, change, reason);
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
  },
};
</script>
<style>
  td, th {
    white-space: nowrap;
  }
</style>
