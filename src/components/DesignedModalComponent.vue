<template>
  <ModalDialogComponent
    :dialog-value="dialog"
    :max-width="option[optionValue].maxWidth"
    :title-class="option[optionValue].titleClass"
    :text-class="option[optionValue].textClass"
    :dialog-transition="option[optionValue].dialogTransition"
    :dialog-custom="option[optionValue].dialogCustom"
    :card-elevation="option[optionValue].cardElevation"
    :hide-overlay="option[optionValue].hideOverlay"
    :persistent="option[optionValue].persistent"
    :title="this.title"
    :closeText="option[optionValue].closeText"
    :saveText="option[optionValue].saveText"
    @close="close"
    @save="save"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" v-bind="attrs" v-on="on"></slot>
    </template>
    <slot name="titleHTML"></slot>
    <slot></slot>
  </ModalDialogComponent>
</template>

<script>
import ModalDialogComponent from "@/components/ModalDialogComponent";

/**
 * @file DesignedModalComponent.vue
 * @description 사전 디자인 적용된 모달 다이얼로그 컴포넌트
 *
 * @typedef {Object} props
 * @property {Boolean} dialogValue - 모달 오픈 여부
 * @property {String} optionValue - !종류 선택! right, normal, small, smaller
 * @property {String} [title] - 제목
 * @property {String} [saveText] - 저장 버튼 텍스트
 * @property {String} [closeText] - 닫기 버튼 텍스트
 * @property {String} [confirmText] - 확인 버튼 텍스트
 *
 * @emits ModalDialogComponent#save
 * @emits ModalDialogComponent#confirm
 * @emits ModalDialogComponent#close
 */
export default {
  components: {
    ModalDialogComponent
  },
  props: {
    dialogValue: Boolean,
    optionValue: String,
    title: String,
    saveText: String,
    closeText: String,
    confirmText: String
  },
  computed:{

  },
  data() {
    return {
      dialog: this.dialogValue,
      option: {
        right: {
          maxWidth:"1000px",
          titleClass:" ",
          dialogTransition:"slide-x-transition",
          dialogCustom:"custom-dialog elevation-0 white",
          cardElevation:"0",
          hideOverlay:true,
          persistent:true
        },
        normal: {
          maxWidth:"500px",
          closeText:this.closeText,
          saveText:this.saveText,
          persistent:true
        },
        small:{
          maxWidth:"350px",
          titleClass:"text-body-1 font-weight-black",
          textClass:"text-body-2",
          persistent:true,
          closeText:this.closeText,
          saveText:this.saveText
        },
        smaller: {
          maxWidth:"300px",
          closeText:this.closeText,
          saveText:this.saveText,
          persistent:true
        }
      }
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
