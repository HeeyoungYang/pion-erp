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
            :show-select="showSelect"
            :search="search"
            :sort-by="sortBy"
            :group-by="groupBy"
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

            <template v-slot:item="{ item, expand, isExpanded }">
              <tr>
                <td v-for="(header,id) in headers" :class="Object.keys(item).includes(header.value) && (!groupBy || header.value !== groupBy) ? 'text-center' : 'text-right'" :key="id"
                @click="item.belong_data && item.belong_data.length > 0 ? expand(!isExpanded) : null">
                  <v-btn small icon color="default"
                    v-if="item.belong_data && item.belong_data.length > 0
                          && !Object.keys(item.belong_data[0]).includes(header.value)
                          && id+1 < headers.length
                          && Object.keys(item.belong_data[0]).includes(headers[id+1].value)">
                    <v-icon> {{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                  {{ Object.keys(item).includes(header.value) && (!groupBy || header.value !== groupBy) ? item[header.value] : '' }}
                </td>
                <td v-if="editable || deletable">
                  <v-icon v-if="editable"
                    small
                    @click="editItem(item)"
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
              </tr>
            </template>

            <template v-slot:expanded-item = "{item}">
              <tr v-for="(data,index) in item.belong_data" :key="index" style="background-color: #efefef;">
                <td v-for="(header,id) in headers" class="text-center" :key="id">
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
 * @property {Array} items - 테이블 아이템 데이터 배열(내부 토글 행 사용시 Key: belong_data) ex) [ {product_type: 'PCS Ass', product_name: '원자재1', belong_data: [{product_name: '원자재1-1'}, {product_name: '원자재1-2'}] }, {product_type: 'PCS Ass', product_name: '원자재1'} ]
 * @property {String} itemKey - 아이템 키
 * @property {String} [groupBy] - 그룹핑할 헤더 value(default:undefined)
 * @property {Boolean} [allGroupToggleBtn] - 모든 그룹 토글 버튼 생성 여부(default:false)
 * @property {Boolean} [groupDefaultOpen] - 모든 그룹 기본 펼침 여부(default:false)
 * @property {String} [closeAllGroupText] - 모든 그룹 닫기 버튼 텍스트(default:전체 접기)
 * @property {String} [openAllGroupText] - 모든 그룹 펼치기 버튼 텍스트(default:전체 펼치기)
 * @property {Boolean} [dense] - 줄간격 줄임 여부(default:false)
 * @property {String} [tableClass] - 테이블 스타일 클래스(default:elevation-1)
 * @property {Boolean} [showSelect] - 체크박스 사용 여부(default:false)
 * @property {String} [search] - 검색창 기본 value(default:undefined)
 * @property {String} [sortBy] - 정렬할 헤더 value(default:undefined)
 * @property {Boolean} [editableGroup] - 그룹 편집 버튼 여부(default:false)
 * @property {Boolean} [deletableGroup] - 그룹 삭제 버튼 여부(default:false)
 * @property {Boolean} [editable] - 항목 편집 버튼 여부(default:false)
 * @property {Boolean} [deletable] - 항목 삭제 버튼 여부(default:false)
 * @property {Boolean} [editableBelong] - 내부 항목 편집 버튼 여부(default:false)
 * @property {Boolean} [deletableBelong] - 내부 항목 삭제 버튼 여부(default:false)
 *
 * @emits ModalDialogComponent#save
 * @emits ModalDialogComponent#confirm
 * @emits ModalDialogComponent#close
 */
export default {
  props: {
    allGroupToggleBtn: Boolean,
    groupDefaultOpen: Boolean,
    closeAllGroupText: String,
    openAllGroupText: String,
    dense: Boolean,
    headers: Array,
    items: Array,
    itemKey: String,
    tableClass: String,
    showSelect: Boolean,
    search: String,
    sortBy: String,
    groupBy: String,
    editableGroup: Boolean,
    deletableGroup: Boolean,
    editable: Boolean,
    deletable: Boolean,
    editableBelong: Boolean,
    deletableBelong: Boolean,
    value: {
      type: null,
      default: () => []
    }
  },
  data() {
    return {
      button_toggle: false,
      selected_data: this.value.slice(),
      addedHeaders: []
    };
  },
  mounted() {
    this.addedHeaders = this.headers.map((obj)=>{
          return obj;
    }).filter(element => element);
    if (this.editableGroup || this.deletableGroup
    || this.editable || this.deletable
    || this.editableBelong || this.deletableBelong){
      this.addedHeaders.push({ text: '편집', align: 'center', value: 'edit' });
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
  methods: {
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
  }
};
</script>
