<template>

  <v-row>
    <v-col cols="12">
      <v-data-table
        :dense="dense"
        :headers="headers"
        :items="items"
        :item-key="itemKey"
        :class="tableClass ? tableClass : ''"
        :show-select="showSelect"
        :search="search"
        :sort-by="sortBy"
        :group-by="groupBy"
        :style="tableStyle ? tableStyle : ''"
        :hide-default-footer="hideDefaultFooter"
        :disable-pagination="disablePagination"
        :disable-sort="disableSort"
      >
        <template v-slot:[`group.header`]="{items, isOpen, toggle}">
          <th  @click="toggle" colspan="10">
            <v-icon
            >
              {{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
            {{ items[0].project_code }}
          </th>
        </template>
        <template v-slot:[`item.check_others`] = "{ item }">
          <v-icon
            v-if="item.exclamation === true"
            color="error"
            class="mr-2"
            x-small
            style="background: #ffedb4; border-radius: 50px; padding: 4px; cursor: pointer;"
            @click="checkOtherPurchase(item, item.project_code, item.id)"
          >
            mdi-exclamation-thick
          </v-icon>
        </template>
      </v-data-table>
    </v-col>
    <v-col cols="12"
      class="mt-7"
      v-show="showOthers"
    >
      <p>{{ check_item }}</p>
      <v-data-table
        :dense="dense"
        :headers="otherHeaders"
        :items="otherItems"
        :item-key="itemKey"
        :group-by="groupBy"
      >
        <template v-slot:[`group.header`]="{items, isOpen, toggle}">
          <th  @click="toggle" colspan="9">
            <v-icon
            >
              {{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
            {{ items[0].project_code }}
          </th>
          <th>
            <v-icon
              color="primary"
              class="mr-2"
              x-small
              style="background: #e4e4e4; border-radius: 50px; padding: 4px; cursor: pointer;"
              @click="addToList('일괄', items, items[0].project_code)"
            >
              mdi-plus-thick
            </v-icon>
            <v-icon
              color="error"
              class="mr-2"
              x-small
              style="background: #e4e4e4; border-radius: 50px; padding: 4px; cursor: pointer;"
              @click="subtractToList('일괄', items)"
            >
              mdi-minus-thick
            </v-icon>
          </th>
        </template>
        <template v-slot:[`item.check_others`] = "{ item }">

          <v-icon
              color="primary"
              class="mr-2"
              x-small
              style="background: #e4e4e4; border-radius: 50px; padding: 4px; cursor: pointer;"
              @click="addToList('개별', item)"
            >
              mdi-plus-thick
            </v-icon>
          <v-icon
            color="error"
            class="mr-2"
            x-small
            style="background: #e4e4e4; border-radius: 50px; padding: 4px; cursor: pointer;"
            @click="subtractToList('개별', item.id)"
          >
            mdi-minus-thick
          </v-icon>
        </template>
      </v-data-table>
      <!-- <v-data-table
        :dense="dense"
        :headers="otherHeaders"
        :items="otherItems"
        :item-key="itemKey"
        :show-select="showSelectOthers"
        :search="search"
        :sort-by="sortBy"
        :style="tableStyle ? tableStyle : ''"
        :hide-default-footer="hideDefaultFooter"
        :disable-pagination="disablePagination"
        :disable-sort="disableSort"
      >
        <template v-slot:[`item.check_others`] = "{ item }">
          <v-icon
            v-if="item.purchase_estimate !== '완료'"
            color="error"
            class="mr-2"
            x-small
            style="background: #ffedb4; border-radius: 50px; padding: 4px; cursor: pointer;"
            @click="checkOtherPurchase(item, items[0].project_code)"
          >
            mdi-exclamation-thick
          </v-icon>
        </template>
      </v-data-table> -->
    </v-col>
  </v-row>
</template>

<script>


/**
 * @file PurchaseDetailTableComponent.vue
 * @description 구매관련 데이터테이블 컴포넌트
 *
 * @typedef {Object} props
 * @property {Array} headers - 테이블 헤더 배열 ex) [ {text: '부제품', align: 'center', value: 'product_type'}, {text: '관리코드', align: 'center', value: 'product_code'} ]
 * @property {Array} items - 테이블 아이템 데이터 배열
 * @property {Array} otherHeaders - 테이블 헤더 배열 ex) [ {text: '부제품', align: 'center', value: 'product_type'}, {text: '관리코드', align: 'center', value: 'product_code'} ]
 * @property {Array} otherItems - 테이블 아이템 데이터 배열
 * @property {Array} itemBelong - 하위 데이터 배열
 * @property {String} itemKey - 아이템 키
 * @property {String} [groupBy] - 그룹핑할 헤더 value(default:undefined)
 * @property {String} [childrenKey] - 하위 그룹 객체 key(default:'')
 * @property {Boolean} [dense] - 줄간격 줄임 여부(default:false)
 * @property {String} [tableClass] - 테이블 스타일 클래스(default:elevation-1)
 * @property {Boolean} [showOthers] - 추가 조회 데이터(수주 혹은 타 구매내역) 노출 여부
 * @property {Boolean} [showSelect] - 체크박스 사용 여부(default:false)
 * @property {Boolean} [showSelectOthers] - 체크박스 사용 여부(default:false)
 * @property {String} [search] - 검색창 기본 value(default:undefined)
 * @property {String} [sortBy] - 정렬할 헤더 value(default:undefined)
 * @property {String} [tableStyle] - 테이블 style(default:'')
 * @property {Boolean} [hideDefaultFooter] - 기본 footer 숨기기 여부(default:false)
 * @property {Boolean} [disablePagination] - 페이징 방지 여부(default:false)
 * @property {Boolean} [disableSort] - 정렬 방지 여부(default:false)
 * @property {Boolean} [addable] - 항목 추가 버튼 여부(default:false)
 * @property {Boolean} [deletable] - 항목 삭제 버튼 여부(default:false)
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



export default {
  props: {
    dense: Boolean,
    headers: Array,
    items: Array,
    otherHeaders: Array,
    otherItems: Array,
    itemBelong: Array,
    itemKey: String,
    tableClass: String,
    showOthers: Boolean,
    showSelect: Boolean,
    showSelectOthers: Boolean,
    search: String,
    sortBy: String,
    groupBy: String,
    childrenKey: String,
    tableStyle: String,
    hideDefaultFooter: Boolean,
    disablePagination: Boolean,
    disableSort: Boolean,
    addable: Boolean,
    deletable: Boolean,
    value: {
      type: null,
      default: () => []
    }
  },
  components:{
  },
  data() {
    return {
      show_others: false,
      check_item: '',
      // selected_data: this.value.slice(),
    };
  },
  mounted() {
  },
  watch: {
    // value(newValue) {
    //   this.selected_data = newValue.slice();
    // }
  },
  methods: {
    addItem(item, index) {
      this.$emit("add", item, index);
    },
    deleteItem(index) {
      this.$emit("delete", index);
    },
    checkOtherPurchase(item, project_code, id) {
      this.check_item = item.type + ' : ' + item.item_code;
      this.$emit("checkOthers", item, project_code, id);
    },
    addToList(type, item, project_code) {
      this.$emit("addList", type, item, project_code);
    },
    subtractToList(type, items) {
      this.$emit("subtractList", type, items);
    },
    calcTotal(item){
      let total = Number(item.num ? item.unit_price.replace(/,/g,'').replace(/₩ /g,'') * item.num.replace(/,/g,'') :  0).toLocaleString();
      return total;
    },
    addUnitPrice(){
      this.$emit("calcUnitPrice");
    }
  },
};
</script>
<style>
  td, th {
    white-space: nowrap;
  }
</style>
