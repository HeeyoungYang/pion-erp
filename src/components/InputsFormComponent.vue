<template>
  <v-row>
    <v-col v-for="(input, index) in inputs"
    :key="input.label ? input.label : index" :cols="input.cols ? (Number(input.cols) > 12 ? '12' : input.cols) : (numInRow ? String(12 / (numInRow > 12 ? 12 : numInRow)) : '')"
    :sm="input.sm ? input.sm : ''"
    :lg="input.lg ? input.lg : ''">
      <v-text-field v-if="!input.type || input.type === 'text'"
        v-model="input.value"
        :dense="dense"
        :hide-details="hideDetails"
        :clearable="input.clearable === undefined ? (clearable ? clearable : false) : input.clearable"
        :filled="input.filled === undefined ? (filled ? filled : false) : input.filled"
        :outlined="input.outlined === undefined ? (outlined ? outlined : false) : input.outlined"
        :prepend-icon="input.icon"
        :label="input.label"
        :disabled="input.disabled">
      </v-text-field>
      <v-select v-else-if="input.type === 'combo' || input.type === 'select'"
        v-model="input.value"
        :dense="dense"
        :hide-details="hideDetails"
        :items="input.list"
        :clearable="input.clearable === undefined ? (clearable ? clearable : false) : input.clearable"
        :filled="input.filled === undefined ? (filled ? filled : false) : input.filled"
        :outlined="input.outlined === undefined ? (outlined ? outlined : false) : input.outlined"
        :prepend-icon="input.icon"
        :disabled="input.disabled"
        :label="input.label">
      </v-select>
      <v-autocomplete v-else-if="input.type === 'auto' || input.type === 'autocomplete'"
        v-model="input.value"
        :dense="dense"
        :hide-details="hideDetails"
        :items="input.list"
        :clearable="input.clearable === undefined ? (clearable ? clearable : false) : input.clearable"
        :filled="input.filled === undefined ? (filled ? filled : false) : input.filled"
        :outlined="input.outlined === undefined ? (outlined ? outlined : false) : input.outlined"
        :prepend-icon="input.icon"
        :disabled="input.disabled"
        :label="input.label"
      ></v-autocomplete>
      <v-textarea  v-else-if="input.type === 'textarea'"
        v-model="input.value"
        :dense="dense"
        :hide-details="hideDetails"
        :clearable="input.clearable === undefined ? (clearable ? clearable : false) : input.clearable"
        :filled="input.filled === undefined ? (filled ? filled : false) : input.filled"
        :outlined="input.outlined === undefined ? (outlined ? outlined : false) : input.outlined"
        :prepend-icon="input.icon"
        :label="input.label"
        :disabled="input.disabled"
        :rows="input.rows ? input.rows : '1'"
      ></v-textarea>
      <v-file-input v-else-if="input.type === 'file'"
        :small-chips="smallChips"
        :filled="input.filled === undefined ? (filled ? filled : false) : input.filled"
        :outlined="input.outlined === undefined ? (outlined ? outlined : false) : input.outlined"
        :dense="dense"
        :hide-details="hideDetails"
        :prepend-icon="input.icon"
        :append-icon="input.appendIcon"
        :label="input.label"
        :disabled="input.disabled"
      ></v-file-input>
      <v-menu v-else-if="input.type === 'date' || input.type === 'date-picker' || input.type === 'datepicker'"
        :ref="'menu'+index"
        v-model="input.menu"
        :close-on-content-click="false"
        :return-value.sync="input.value"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="dateRangeText"
            :dense="dense"
            :hide-details="hideDetails"
            :clearable="input.clearable === undefined ? (clearable ? clearable : false) : input.clearable"
            :filled="input.filled === undefined ? (filled ? filled : false) : input.filled"
            :outlined="input.outlined === undefined ? (outlined ? outlined : false) : input.outlined"
            :label="input.label"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="input.value"
          no-title
          scrollable
          :range="input.range"
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="input.menu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs['menu'+index][0].save(input.value)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>
    <slot></slot>
  </v-row>
</template>

<script>

/**
 * @file InputsFormComponent.vue
 * @description 인풋 모음 컴포넌트
 * !date 타입 인풋은 한 개만 포함 가능. 두 개째부터는 slot 에 직접 구현!
 * @typedef {Object} props
 * @property {Array} inputs - 인풋 객체 배열
 * ex) [
 *  {col:'12', sm:'4', lg:'3', value:'', icon:'mdi-archive-search', label:'검색', disabled: true},
 *  {type:'auto', value:'All', label:'분류', list:['All', '일반', 'GFM', '전력변환기'], clearable:true, filled:true},
 *  {type:'date', value:[], label:'일자', range:true}
 * ]
 * @property {Number} [numInRow] - 한 줄 출력 인풋 개수 여부(default:0)
 * @property {Boolean} [dense] - 줄간격 줄임 여부(default:false)
 * @property {Boolean} [hideDetails] - 디테일 숨김 여부(default:false)
 * @property {Boolean} [clearable] - 전역 clearable(default:false)
 * @property {Boolean} [filled] - 전역 filled(default:false)
 * @property {Boolean} [smallChips] - 파일 선택 시 chip 사용 여부(default:false)
 */
export default {
  props: {
    inputs: Array,
    numInRow: Number,
    cardClass: String,
    dense: Boolean,
    hideDetails: Boolean,
    clearable: Boolean,
    filled: Boolean,
    smallChips: Boolean
  },
  computed:{
    dateRangeText () {
      return this.inputs.find(x=>x.type === 'date' || x.type === 'date-picker' || x.type === 'datepicker').value.sort().join(' ~ ');
    },
  },
  data() {
    return {
      dates:[]
    };
  },
  watch: {
  },
  methods: {

  }
};
</script>
