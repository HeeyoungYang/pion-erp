<template>
  <v-row>
    <v-col cols="12">
      <v-row>
        <v-col v-if="!hideToggleBtn"
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
          >{{ closeAllText ? closeAllText : '전체 접기' }}</v-btn>
          <v-btn
            v-if="!button_toggle"
            color="default"
            elevation="1"
            small
            class="mr-2 "
            @click="openAll"
          >{{ openAllText ? openAllText : '전체 펼치기' }}</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table
            :dense="dense"
            :value="selected_data"
            @input="updateSelectedData"
            :headers="headers"
            :items="items"
            :item-key="itemKey"
            :class="tableClass ? tableClass : 'elevation-1'"
            :show-select="showSelect"
            :search="search"
            :sort-by="headerValue"
            :group-by="groupBy"
          >
            <template v-slot:[`group.header`]="{ group, headers, toggle, isOpen }">
              <td :colspan="headers.length-1" @click="toggle"  style="cursor: pointer;">
                  <v-btn small icon :ref="group" :data-open="isOpen">
                      <v-icon>{{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                  {{ group }}
              </td>
              <td v-if="editable">
                <v-icon
                  small
                  @click="editItem(item)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  small
                  @click="deleteItem(item)"
                >
                  mdi-delete
                </v-icon>
              </td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    hideToggleBtn: Boolean,
    defaultOpen: Boolean,
    closeAllText: String,
    openAllText: String,
    dense: Boolean,
    headers: Array,
    items: Array,
    itemKey: String,
    tableClass: String,
    showSelect: Boolean,
    search: String,
    headerValue: String,
    groupBy: String,
    editable: Boolean,
    actionsSlotName: String,
    value: {
      type: null,
      default: () => []
    }
  },
  data() {
    return {
      button_toggle: false,
      selected_data: this.value.slice()
    };
  },
  mounted() {
    if (this.defaultOpen){
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
    deleteItem(item) {
      this.$emit("delete", item);
    },
    editItem(item) {
      this.$emit("edit", item);
    },
    closeAll () {
        Object.keys(this.$refs).forEach(k => {
            console.log(this.$refs[k])
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
