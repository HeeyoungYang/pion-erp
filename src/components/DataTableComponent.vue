<template>
  <v-data-table
    :dense="dense"
    :value="selected_data"
    @input="updateSelectedData"
    :headers="headers"
    :items="items"
    :item-key="itemKey"
    :class="tableClass ? tableClass : 'elevation-1'"
    :show-select="showSelect">
  </v-data-table>
</template>

<script>
export default {
  props: {
    dense: Boolean,
    headers: Array,
    items: Array,
    itemKey: String,
    tableClass: String,
    showSelect: Boolean,
    value: {
      type: null,
      default: () => []
    }
  },
  data() {
    return {
      selected_data: this.value.slice()
    };
  },
  methods: {
    updateSelectedData(newValue) {
      this.$emit('input', newValue);
    }
  },
  watch: {
    value(newValue) {
      this.selected_data = newValue.slice();
    }
  }
};
</script>