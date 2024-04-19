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
import CheckPagePermission from "@/common_js/CheckPagePermission";
import mux from "@/mux";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=MainPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
    // router.push()로 이동할 때, query로 전달된 key 에 temporary_password 가 있으면, 최초 로그인 시 비밀번호 변경 모달을 띄운다.
    if (this.$route.query.temporary_password) {
      this.first_login_dialog = true;
    }
  },
  methods: {
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    save() {
      const validate = this.$refs.pwForm.validate();
      if(!validate) return;

      // 비밀번호 변경 저장
      console.log('this.$configJson.cookies.id :>> ', this.$configJson.cookies.id);
      console.log('this.$route.query.temporary_password :>> ', this.$route.query.temporary_password);
      console.log('this.passwords.newPassword :>> ', this.passwords.newPassword);
      mux.Server.put({
        path: '/api/user/change_first_password/',
        user_name: this.$cookies.get(this.$configJson.cookies.id),
        temporary_password: this.$route.query.temporary_password,
        new_password: this.passwords.newPassword,
      }).then((response) => {
        if (response.code == 0) {
          alert(response.message);
          this.first_login_dialog = false;
        }else {
          alert('비밀번호 변경 실패');
          console.log('비밀번호 변경 실패:', response);
        }
      }).catch((error) => {
        alert('비밀번호 변경 에러');
        console.log('비밀번호 변경 에러:', error);
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
