<template>
  <v-row>
    <v-col v-for="(input, index) in inputs"
    :key="input.label ? input.label : index" :cols="input.cols ? (Number(input.cols) > 12 ? '12' : input.cols) : (numInRow ? String(12 / (numInRow > 12 ? 12 : numInRow)) : '')"
    :sm="input.sm ? input.sm : ''"
    :lg="input.lg ? input.lg : ''"
    :class="col_class">
      <v-text-field v-if="!input.type || input.type === 'text'"
        v-model="input.value"
        :type="input.text_type"
        :dense="dense"
        :hide-details="hideDetails"
        :clearable="input.clearable === undefined ? (clearable ? clearable : false) : input.clearable"
        :filled="input.filled === undefined ? (filled ? filled : false) : input.filled"
        :outlined="input.outlined === undefined ? (outlined ? outlined : false) : input.outlined"
        :prepend-icon="input.icon"
        :label="input.label"
        :disabled="input.disabled"
        :suffix="input.suffix"
        :rules="input.rules"
        @keyup="textKeyUp(input.column_name, input.value)"
        @keyup.enter="enterKeyup">
      </v-text-field>

      <v-text-field v-else-if="input.type === 'number_comma'"
        v-model="input.value"
        :oninput="input.value = input.value ? typeof input.value === 'number' ? (input.value+'').replace(/^0+|\D+/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') : input.value.replaceAll(',', '').replace(/^0+|\D+/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') : ''"
        :type="input.text_type"
        :dense="dense"
        :hide-details="hideDetails"
        :clearable="input.clearable === undefined ? (clearable ? clearable : false) : input.clearable"
        :filled="input.filled === undefined ? (filled ? filled : false) : input.filled"
        :outlined="input.outlined === undefined ? (outlined ? outlined : false) : input.outlined"
        :prepend-icon="input.icon"
        :label="input.label"
        :disabled="input.disabled"
        :suffix="input.suffix"
        :rules="input.rules"
        @keyup.enter="enterKeyup">
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
        :rules="input.rules"
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
        :rules="input.rules"
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
        :rules="input.rules"
        :rows="input.rows ? input.rows : '1'"
      ></v-textarea>
      <v-file-input v-else-if="input.type === 'file'"
        :ref="input.ref ? input.ref : 'file' + input.accept + index"
        v-model="input.value"
        :small-chips="smallChips"
        :multiple="input.multiple === undefined ? (multiple ? multiple : false) : input.multiple"
        :filled="input.filled === undefined ? (filled ? filled : false) : input.filled"
        :outlined="input.outlined === undefined ? (outlined ? outlined : false) : input.outlined"
        :dense="dense"
        :hide-details="hideDetails"
        :hide-input="input.hide_input"
        :prepend-icon="input.icon"
        :append-icon="input.appendIcon"
        :label="input.label"
        :rules="input.rules"
        :disabled="input.disabled"
        :accept="input.accept"
        @change="input.accept ?
        input.accept.includes('jpg') ? mux.Util.checkTypeImage($event, $refs[input.ref ? input.ref : 'file' + input.accept + index][0]) :
        input.accept.includes('pdf') ? mux.Util.checkTypePdf($event, $refs[input.ref ? input.ref : 'file' + input.accept + index][0]) :
        input.accept.includes('xlsx') ? mux.Util.checkTypeExcel($event, $refs[input.ref ? input.ref : 'file' + input.accept + index][0]) :  ''
        : ''"
      ></v-file-input>

      <v-menu v-else-if="input.type === 'dateSingle'"
        v-model="input.menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="dateSingleText"
            :dense="dense"
            :rules="input.rules"
            :disabled="input.disabled"
            :hide-details="hideDetails"
            :clearable="input.clearable === undefined ? (clearable ? clearable : false) : input.clearable"
            :filled="input.filled === undefined ? (filled ? filled : false) : input.filled"
            :outlined="input.outlined === undefined ? (outlined ? outlined : false) : input.outlined"
            :label="input.label"
            readonly
            v-bind="attrs"
            v-on="on"
            @click:clear="dateSingleText = null"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="dateSingleText"
          @input="input.menu = false"
        ></v-date-picker>
      </v-menu>
      <v-menu v-else-if="input.type === 'dateRange'"
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
            :disabled="input.disabled"
            readonly
            v-bind="attrs"
            v-on="on"
            @click:clear="input.value = []"
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
import mux from '@/mux';


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
 * @property {String} [col_class] - v-col 별 css class
 * @property {Boolean} [dense] - 줄간격 줄임 여부(default:false)
 * @property {Boolean} [hideDetails] - 디테일 숨김 여부(default:false)
 * @property {Boolean} [clearable] - 전역 clearable(default:false)
 * @property {Boolean} [multiple] - 전역 multiple(default:false)
 * @property {Boolean} [filled] - 전역 filled(default:false)
 * @property {Boolean} [outlined] - 전역 outlined(default:false)
 * @property {Boolean} [smallChips] - 파일 선택 시 chip 사용 여부(default:false)
 */
export default {
  props: {
    inputs: Array,
    numInRow: Number,
    cardClass: String,
    col_class: String,
    dense: Boolean,
    hideDetails: Boolean,
    clearable: Boolean,
    multiple: Boolean,
    filled: Boolean,
    outlined: Boolean,
    smallChips: Boolean
  },
  computed:{
      dateRangeText () {
        return this.inputs.find(x=>x.type === 'dateRange').value.sort().join(' ~ ');
      },
      dateSingleText: {
        get() {
          if (this.inputs.find(x=>x.type === 'dateSingle').value) {
            return this.inputs.find(x=>x.type === 'dateSingle').value;
          }else {
            this.inputs.find(x=>x.type === 'dateSingle').value = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
            return this.inputs.find(x=>x.type === 'dateSingle').value;
          }
        },
        set(value) {
          if (this.inputs.find(x => x.type === 'dateSingle')) {
            this.inputs.find(x => x.type === 'dateSingle').value = value;
          }
        }
      },
    },
  data() {
    return {
      mux: mux,
      dates:[]
    };
  },
  watch: {
    inputs: {
      handler: function (val) {
        if (val.find(x=>x.type === 'dateSingle') && val.find(x=>x.type === 'dateSingle').value.length > 0) {
          this.$emit('dateChanged', val.find(x=>x.type === 'dateSingle').value);
        }else if (val.find(x=>x.type === 'dateRange') && val.find(x=>x.type === 'dateRange').value.length > 0) {
          this.$emit('dateRangeChanged', val.find(x=>x.type === 'dateRange').value);
        }
      },
      deep: true
    }
  },
  methods: {
    enterKeyup() {
      this.$emit('enter');
    },
    textKeyUp(column_name, value) {
      this.$emit('textFieldKeyup',column_name, value);
    }
  }
};
</script>
