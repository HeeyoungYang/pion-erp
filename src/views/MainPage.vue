<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <p>Home</p>
      <ModalDialogComponent
        :dialog-value="first_login_dialog"
        max-width="300px"
        title="비밀번호 변경"
        closeText="취소"
        saveText="저장"
        :persistent="true"
        @close="first_login_dialog=false"
        @save="save"
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
    </v-main>

  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent";

export default {
  components: {
                NavComponent,
                ModalDialogComponent,
              },
  data(){
    return {
      first_login_dialog:false,
      // ▼ 비밀번호 변경
      passwords:{
        currentPassword:'',
        newPassword: '',
        newPasswordCheck: '',
      },
      // ▼ 비밀번호 변경 유효성 검사
      passwordRules: [
        v => !!v || '비밀번호 입력',
        v => !!(v &&  /^(?=.*[a-zA-z])(?=.*[0-9]).{8,16}$/.test(v) ) || '영문 + 숫자, 8자 이상 16자 이하',
      ],
      // ▼ 새 비밀번호와 새 비밀번호 확인의 일치 여부
      checkPasswordRules: [
        v => !!(v == this.passwords.newPassword) || '새 비밀번호와 일치하지 않습니다.',
      ],
      // ▼ 실제 현 비밀번호와 사용자가 입력한 현재 비밀번호 일치 여부
      checkCurrentPasswordRules: [
        v => !!(v == this.userInfo.password) || '비밀번호를 확인해주세요.',
      ],
    }
  }
}

</script>
<style>

</style>
