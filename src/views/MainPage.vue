<template>
  <div class="main_page">
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent></NavComponent>
    <!-- ▼ 본문 영역 -->
    <v-main class="hero">
      <!-- <div style="height: 100%">
        <video class="bg-video__content" autoplay muted loop>
          <source src="../assets/img/earth_background_video.mp4" type="video/mp4" />
        </video>
      </div> -->
      <ModalDialogComponent
        :dialog-value="first_login_dialog"
        max-width="300px"
        title="비밀번호 변경"
        saveText="저장"
        :persistent="true"
        @close="first_login_dialog=false"
        @save="save"
      >
        <v-row class="mt-3">
          <v-col cols="12">
            <p class="mb-0 error--text">임시 비밀번호로 최초 로그인 시<br>비밀번호 변경이 필요합니다</p>
          </v-col>
          <v-form ref="pwForm">
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
          </v-form>
        </v-row>
      </ModalDialogComponent>
    </v-main>

  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent";

import mux from "@/mux";

export default {
  
  mounted() {
    
    // router.push()로 이동할 때, query로 전달된 key 에 temporary_password 가 있으면, 최초 로그인 시 비밀번호 변경 모달을 띄운다.
    if (this.$route.query.temporary_password) {
      this.first_login_dialog = true;
    }
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    
    save() {
      const validate = this.$refs.pwForm.validate();
      if(!validate) return;

      const prevURL = window.location.href;
      // 비밀번호 변경 저장
      mux.Server.put({
        path: '/api/user/change_first_password/',
        user_name: this.$cookies.get(this.$configJson.cookies.id.key),
        temporary_password: this.$route.query.temporary_password,
        new_password: this.passwords.newPassword,
      }).then((response) => {
        if (prevURL !== window.location.href) return;
        if (response.code == 0) {
          try {
            mux.Server.logIn(
              this.$cookies.get(this.$configJson.cookies.id.key),
              this.passwords.newPassword,
              this.$cookies.get(this.$configJson.cookies.savedID.key) ? true : false
            ).then(() => {
              this.first_login_dialog = false;
              //새로고침하여 페이지 다시 로드
              window.location.reload();
            });
          } catch (error) {
            mux.Server.logOut();
          }
        }else {
          mux.Util.showAlert('비밀번호 변경 실패');
          // console.log('비밀번호 변경 실패:', response);
        }
      // }).catch((error) => {
      }).catch(() => {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert('비밀번호 변경 에러');
        // console.log('비밀번호 변경 에러:', error);
      });
    }
  },
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
.hero {
  background: url('../assets/img/wind_sun.jpg');
  opacity:0.5;
  background-size: cover;
  background-position: center center;
  min-height: 953px;
}
</style>
