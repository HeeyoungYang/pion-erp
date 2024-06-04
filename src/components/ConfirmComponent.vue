<template>
  <v-overlay :value="visible" absolute :opacity="0.7">
    <v-dialog v-model="visible" max-width="400" persistent>
      <v-card :elevation="'2'">
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>
          {{ message }}
          <div v-if="useInput && typeof useInput === 'boolean'" class="mt-4">
            <v-text-field v-model="userInput" label="입력"></v-text-field>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="confirm">확인</v-btn>
          <v-btn color="secondary" text @click="cancel">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-overlay>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '확인'
    },
    message: {
      type: String,
      required: true
    },
    useInput: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      userInput: ''
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    confirm() {
      let result = true;
      if (this.useInput) {
        result = this.userInput.trim();
      }
      this.close(result);
    },
    cancel() {
      this.close(false);
    },
    close(value) {
      this.visible = false;
      this.$emit('close', value);
    }
  }
};
</script>

<style scoped>
.mt-4 {
  margin-top: 16px;
}
</style>
