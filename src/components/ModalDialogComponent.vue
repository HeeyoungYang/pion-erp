<template>
  <v-dialog
  v-model="dialog"
  :max-width="maxWidth ? maxWidth : '500px'"
  :persistent="persistent ? persistent : false"
  @click:outside="persistent ? null : close()">
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" v-bind="attrs" v-on="on"></slot>
    </template>
    <v-card ref="card">
      <v-card-title :class="titleClass ? titleClass : 'blue lighten-5 text-h6 font-weight-black'">
        <span v-if="title">{{ title }}</span>
        <slot name="titleHTML"></slot>
      </v-card-title>
      <v-card-text :class="textClass ? textClass : ''">
        <slot></slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="saveText" color="blue darken-1" text @click="save">{{ saveText }}</v-btn>
        <v-btn v-if="confirmText" color="blue darken-1" text @click="confirm">{{ confirmText }}</v-btn>
        <v-btn v-if="closeText" color="blue darken-1" text @click="close">{{ closeText }}</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * @file ModalDialogComponent.vue
 * @description 모달 다이얼로그 컴포넌트
 *
 * @typedef {Object} props
 * @property {Boolean} dialogValue - 모달 오픈 여부
 * @property {Boolean} [persistent] - 외부 클릭 방지 여부(default:false)
 * @property {String} [maxWidth] - 최대 가로 길이(defalt:500px)
 * @property {String} [title] - 제목 텍스트
 * @property {String} [titleClass] - 제목 클래스
 * @property {String} [textClass] - 본문 클래스
 * @property {String} [saveText] - 저장 버튼 텍스트
 * @property {String} [confirmText] - 확인 버튼 텍스트
 * @property {String} [closeText] - 취소 버튼 텍스트
 *
 * @emits ModalDialogComponent#save
 * @emits ModalDialogComponent#confirm
 * @emits ModalDialogComponent#close
 */
export default {
  props: {
    dialogValue: Boolean,
    persistent: Boolean,
    maxWidth: String,
    title: String,
    titleClass: String,
    textClass: String,
    saveText: String,
    confirmText: String,
    closeText: String
  },
  data() {
    return {
      dialog: this.dialogValue,
      thisfunc: this.thisfunc,
      eventAdded: false
    };
  },
  watch: {
    dialogValue(value) {
      this.dialog = value;
    }
  },
  methods: {
    close() {
      this.$emit("update:dialogValue", false);
      this.$emit("close");
    },
    save() {
      this.$emit("save");
    },
    confirm() {
      this.$emit("confirm");
    }
  }
};
</script>
