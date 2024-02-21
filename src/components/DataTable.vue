<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :search="search"
    :sort-by="headerValue"
    class="elevation-1"
  >
    <template v-slot:[`item.${actionsSlotName}`]="{ item }">
      <slot :name="actionsSlotName" :item="item"></slot>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    headers: Array,
    items: Array,
    search: String,
    headerValue: String,
    actionsSlotName: String
  },
  data() {
    return {
    };
  },
  watch: {

  },
  methods: {

  }
};
</script>
