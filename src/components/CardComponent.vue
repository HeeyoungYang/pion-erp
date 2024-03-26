<template>
  <v-card :elevation="elevation ? elevation : ''" :class="cardClass ? cardClass : ''" >
    <v-card-title  :class="titleClass ? titleClass : ''">
      <slot name="cardTitle"></slot>
    </v-card-title>
    <v-divider :class="dividerClass ? dividerClass : 'd-none'"></v-divider>
    <v-card-text :class="textClass ? textClass : ''">
      <slot name="cardText"></slot>
    </v-card-text>
  </v-card>
</template>

<script>

/**
 * @file CardComponent.vue
 * @description 카드 컴포넌트
 *
 * @typedef {Object} props
 * @property {String} [elevation] - v-card elevation(default:'')
 * @property {String} [textClass] - v-card-text 클래스(default:'')
 * @property {String} [titleClass] - v-card-title 클래스(default:'')
 * @property {String} [dividerClass] - v-divider 클래스(default:'d-none')
 * @property {String} [cardClass] - v-card 클래스(default:'')
 */
export default {
  props: {
    elevation: String,
    textClass: String,
    titleClass: String,
    dividerClass: String,
    cardClass: String,
  },
  computed:{
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
