<template>
  <v-row justify="center">
    <v-col
      cols="10"
      sm="6"
      md="6"
      lg="4"
    >
      <v-card
      elevation="1"
      class="mt-6"
      >
        <v-row justify="center"
          style="padding: 45px 0px 40px;">
          <!-- ▼ LOGO 영역 -->
          <v-col
            cols="12"
            md="9"
          >
            <v-img
              alt="Pionelectric Logo"
              class="shrink mr-2"
              contain
              src="../assets/img/pion_logo.png"
              transition="scale-transition"
              width="150"
              style="left: 50%; margin-left: -75px!important;"
            />
          </v-col>
          <!-- ▼ 아이디 및 비밀번호 input box -->
          <v-col
            cols="12"
            md="9"
          >
            <v-form ref="loginForm">
              <v-text-field
                id="idField"
                label="아이디"
                filled
                :value="idValue"
                :rules="idRules"
                @keyup.enter="login"
              ></v-text-field>
              <v-text-field
                id="pwField"
                label="비밀번호"
                type="password"
                filled
                :rules="passwordRules"
                @keyup.enter="login"
              ></v-text-field>
            </v-form>
          </v-col>
          <!-- ▼ 로그인 버튼. 클릭 시 /home으로 이동 -->
          <v-col
            cols="12"
            md="9"
            style="padding-top: 0px"
          >

            <!-- <router-link to="/home"> -->
              <v-btn
                block
                style="padding: 25px 0px;"
                color="primary"
                class="text-h6 font-weight-black"
                @click="login"
              >
                로그인
              </v-btn>
            <!-- </router-link> -->
          </v-col>
          <v-col
            cols="12"
            md="9"
          >
            <!-- ▼ 아이디 저장 체크박스 -->
            <v-checkbox
              v-model="checkbox"
              label="아이디 저장"
              class="float-left mt-0"
            ></v-checkbox>
            <!-- ▼ 비밀번호 찾기 관련 Dialog(모달)  -->
            <v-dialog
              v-model="newPasswordDialog"
              persistent
              max-width="300px"
            >
              <template v-slot:activator="{ on, attrs }">
                <!-- ▼ 비밀번호 찾기 버튼 -->
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  color="primary"
                  class="float-right body-2">
                  비밀번호 찾기
                </v-btn>
              </template>
              <!-- ▼ 비밀번호 찾기 (확인코드 발급) 모달 창 -->
              <v-card v-if="!setPassword">
                <p class="text-center text-h6 font-weight-black mt-5 mb-0 primary--text">비밀번호 재설정</p>
                <p class="text-caption text-center mt-3">아이디를 기입해주세요.<br>사용자 메일로 확인코드를 발송합니다.</p>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        class="pb-0">
                        <v-form ref="forgotForm">
                          <v-text-field
                            label="ID"
                            v-model="userID"
                            :rules="idRules"
                          ></v-text-field>
                        </v-form>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="newPasswordDialog = false"
                  >
                    닫기
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="reissuePasswordFunc()"
                  >
                    발급
                  </v-btn>
                </v-card-actions>
              </v-card>
              <v-card v-if="setPassword">
                <p class="text-center text-h6 font-weight-black mt-5 mb-0 primary--text">비밀번호 재설정</p>
                <p class="text-caption text-center mt-3">발급된 확인코드와 <br> 새 비밀번호를 입력해주세요</p>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        class="pb-0">
                        <v-form ref="setPasswordForm">
                          <v-text-field
                            label="확인코드"
                            v-model="verificationCode"
                            :rules="codeRules"
                          ></v-text-field>
                          <v-text-field
                            label="새 비밀번호"
                            type="password"
                            v-model="setNewPassword"
                            :rules="passwordRules"
                          ></v-text-field>
                        </v-form>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="closeSetPassword"
                  >
                    닫기
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="setNewPasswordFunc()"
                  >
                    변경
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import mux from '@/mux';
import Vue from 'vue';
export default {
  mounted(){
    console.log('Vue.$cookies.keys() :>> ', Vue.$cookies.keys());
  },
  data(){
    return{
        newPasswordDialog: false,
        setPassword: false,
        userID:'',
        verificationCode:'',
        setNewPassword:'',
        checkbox: Vue.$cookies.keys().includes(this.$configJson.cookies.savedID),
        idValue: Vue.$cookies.keys().includes(this.$configJson.cookies.savedID) ? Vue.$cookies.get(this.$configJson.cookies.savedID) : '',
        idRules: [
          v => !!v || '아이디 입력',
        ],
        passwordRules: [
          v => !!v || '비밀번호 입력',
          v => !!(v &&  /^(?=.*[a-zA-z])(?=.*[0-9]).{8,16}$/.test(v) ) || '영문 + 숫자, 8자 이상 16자 이하',
        ],
        codeRules: [
          v => !!v || '확인코드 입력',
        ],
    }
  },
  methods: {
    // ▼ 비밀번호 재발급 함수
    reissuePasswordFunc(){
      const validate = this.$refs.forgotForm.validate();
      if(!validate) return;
      
      mux.Server.post({
        path:'/api/user/forgot_password/', user_name:this.userID
      }).then(result => {
        if(result.code == 0){
          alert("사용자 메일로 확인코드가 발송되었습니다!");
          this.setPassword = true;
        }else{
          alert("아이디를 확인해주세요.");
        }
      }).catch(err => {
        console.error('err :>> ', err);
        alert('아이디를 확인해주세요.');
      });
    },
    setNewPasswordFunc(){
      const validate = this.$refs.setPasswordForm.validate();
      if(!validate) return;

      mux.Server.post({
        path:'/api/user/change_password_using_confirm_code/', user_name:this.userID, confirm_code:this.verificationCode, new_password:this.setNewPassword
      }).then(result => {
        if(result.code == 0){
          alert("비밀번호 변경이 완료되었습니다!");
          this.newPasswordDialog = false;
          this.setPassword = false;
          this.idValue = this.userID + '';
          this.userID = '';
          this.verificationCode = '';
          this.setNewPassword = '';
        }else{
          alert("확인코드를 확인해주세요.");
        }
      }).catch(err => {
        console.error('err :>> ', err);
        alert('확인코드를 확인해주세요.');
      });
    },
    closeSetPassword(){
      this.setPassword = false;
      this.newPasswordDialog = false;
    },
    async login(){
      const id = document.getElementById('idField').value;
      const pw = document.getElementById('pwField').value;

      // if(id == ''){
      //   alert('아이디를 입력하세요.')
      //   return;
      // }else if(pw == ''){
      //   alert('비밀번호를 입력하세요.')
      //   return;
      // }

      const validate = this.$refs.loginForm.validate();
      if(validate){
        mux.Server.post({
          path:'/api/user/login/', user_name:id, password:pw
        }).then(result => {
          console.log('result :>> ', result);
          const fullName = (result.data.family_name ? result.data.family_name : '') + (result.data.given_name ? result.data.given_name : '');
          Vue.$cookies.set(this.$configJson.cookies.name, fullName, '1h');
          Vue.$cookies.set(this.$configJson.cookies.id, id, '100y');
          if (this.checkbox){
            Vue.$cookies.set(this.$configJson.cookies.savedID, id, '100y');
          }else {
            Vue.$cookies.remove(this.$configJson.cookies.savedID);
          }
          result.data.path = '/home';
          mux.Server.move(result.data);
        }).catch(err => {
          console.error('err :>>>>> ', err);
          switch (err.message) {
            // case 'password':
            //   alert('비밀번호 오류');
            //   break;
            // case 'id':
            //   alert('존재하지 않는 아이디');
            //   break;

            default:
              alert('아이디 또는 비밀번호를 확인해주세요.');
              break;
          }
        });
      }
    }
  },

}
</script>
<style>
</style>
