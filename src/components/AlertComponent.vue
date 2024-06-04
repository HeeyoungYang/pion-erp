<template>
  <v-overlay :value="visible" absolute :opacity="timeout == 0 ? 0.7 : 0">
    <v-dialog v-model="visible" max-width="400" :persistent="timeout == 0">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <span v-if="timeout" style="color: grey; font-size: small;" class="ml-2">{{ countdown }}초 후 자동으로 닫힙니다.</span>
          <v-btn color="primary" text @click="close">확인</v-btn>
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
      default: '알림'
    },
    message: {
      type: String,
      required: true
    },
    timeout: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      visible: false,
      countdown: this.timeout ? Math.ceil(this.timeout / 1000) : 0,
      timer: null,
      countdownTimer: null
    };
  },
  methods: {
    show() {
      this.visible = true;
      if (this.timeout) {
        this.startTimer();
      }
    },
    close() {
      this.visible = false;
      clearTimeout(this.timer);
      clearInterval(this.countdownTimer);
    },
    startTimer() {
      this.timer = setTimeout(() => {
        this.close();
      }, this.timeout);
      this.startCountdown();
    },
    startCountdown() {
      this.countdownTimer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.countdownTimer);
        }
      }, 1000);
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    clearInterval(this.countdownTimer);
  }
};
</script>

<style scoped>
.ml-2 {
  margin-left: 8px;
}
</style>
