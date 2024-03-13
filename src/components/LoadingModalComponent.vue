<template>
  <div>
    <ModalDialogComponent
      :dialog-value="first_login_dialog"
      max-width="300px"
      :persistent="true"
    >
      <v-row class="mt-3">
        <v-col cols="12">
          <p class="mb-0 error--text">임시 비밀번호로 최초 로그인 시<br>비밀번호 변경이 필요합니다</p>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="passwords.newPassword"
            label="새 비밀번호"
            :rules="passwordRules"
            type="password"
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="passwords.newPasswordCheck"
            label="새 비밀번호 확인"
            :rules="checkPasswordRules"
            type="password"
            dense
          ></v-text-field>
        </v-col>
      </v-row>
    </ModalDialogComponent>
  </div>
</template>
<script>
import ModalDialogComponent from "@/components/ModalDialogComponent";

export default {
  components: {
              ModalDialogComponent,
              },
  data(){
    return {
    }
  }
}

</script>
<style>

</style>
