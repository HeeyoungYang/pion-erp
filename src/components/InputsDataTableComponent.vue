<template>

  <v-row>
    <v-col cols="12">
      <v-data-table
        :dense="dense"
        :headers="headers"
        :items="items"
        :item-key="itemKey"
        :class="tableClass ? tableClass : 'elevation-1'"
        :show-select="showSelect"
        :search="search"
        :sort-by="sortBy"
        :style="tableStyle ? tableStyle : ''"
        :hide-default-footer="hideDefaultFooter"
        :disable-pagination="disablePagination"
        :disable-sort="disableSort"
      >
        <template v-slot:[`item.num`] = "{ item }">
          <v-text-field
            dense
            hide-details
            v-model="item.num"
            style="width:100px;font-size: 0.775rem !important;"
            filled
            :oninput="!item.num ? '' : item.num = item.num.replace(/^0+|\D+/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')"
          ></v-text-field>
        </template>
        <template v-slot:[`item.item_price`] = "{ item }">
          {{  Number(item.num ? item.unit_price.replace(/,/g,'') * item.num.replace(/,/g,'') :  0).toLocaleString() }}
        </template>
        <template v-slot:[`item.edit_item`]="{ item, index }">
          <v-icon
            v-if="addable"
            color="primary"
            small
            @click="addItem(item, index)"
          >mdi-plus-thick</v-icon>
          <v-icon
            v-if="deletable"
            color="grey"
            small
            @click="deleteItem(index)"
          >mdi-minus-thick</v-icon>
        </template>

      </v-data-table>
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
    itemBelong: Array,
    itemKey: String,
    tableClass: String,
    showSelect: Boolean,
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
  },
};
</script>
<style>
  td, th {
    white-space: nowrap;
  }
</style>
