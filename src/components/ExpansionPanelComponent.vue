<template>
  <div>
    <v-expansion-panels
      :elevation="elevation ? elevation : '1'"
      :class="panelsClass ? panelsClass : 'mt-5'"
      :multiple="multiple"
    >
      <v-expansion-panel
        v-for="(panelData, index) in data "
        :key="index"
      >
        <v-expansion-panel-header :class="headerClass ? headerClass : 'font-weight-black primary--text text-h6'">
          <slot name="header" :data="panelData"></slot>
          <span v-if="!$slots.header">{{ panelData.header }}</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <slot name="content" :data="panelData"></slot>
          <div v-if="!$slots.content && panelData.content" v-html="panelData.content"></div>
          <slot :data="panelData"></slot>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>

/**
 * @file ExpansionPanelComponent.vue
 * @description 토글 확장 패널 컴포넌트
 *
 * @typedef {Object} props
 * @property {Array} data - 패널 데이터 객체 배열
 * @property {String} [elevation] - 높이(default:'1')
 * @property {String} [panelsClass] - v-expansion-panels 클래스(default:'mt-5')
 * @property {Boolean} [multiple] - 복수 펼치기 허용 여부(default:false)
 * @property {String} [headerClass] - v-expansion-panel-header 클래스(default:'font-weight-black primary--text text-h6')
 */
export default {
  props: {
    data: Array,
    elevation: String,
    panelsClass: String,
    multiple: Boolean,
    headerClass: String
  },
  computed:{

  },
  data() {
    return {
      
    };
  },
  watch: {
    // dialogValue(value) {
    //   this.dialog = value;
    // }
  },
  methods: {

  }
}
</script>
