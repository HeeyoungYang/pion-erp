<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row justify="center">
        <v-col
          cols="12"
          sm="6"
        >
          <v-card
          elevation="1"
          >
            <v-form>
              <v-container>
                <v-row>
                  <!-- ▼ 계정 이름 및 비밀번호 변경, 정보 수정 아이콘 노출 영역 -->
                  <v-col
                    cols="12"
                    md="12"
                  >
                    <v-banner
                      rounded
                      color="blue lighten-5"
                    >
                      <v-row>
                        <v-col
                        xs="6">
                          <!-- ▼ 계정 이름 -->
                          <span class="mr-2 font-weight-black text-h6">{{ userInfo.name }}</span>
                        </v-col>
                        <v-col
                        xs="6">
                          <!-- ▼ 수정 아이콘(연필) 클릭 시 노출되는 저장 아이콘(체크) -->
                          <v-btn
                            color="primary"
                            fab
                            x-small
                            class="float-right"
                            elevation="0"
                            v-show="showSaveButton"
                            @click="savePrivacyInfoFunc()"
                          >
                            <v-icon
                              small
                            >mdi-check-circle</v-icon>
                          </v-btn>
                          <!-- ▼ 수정 아이콘(연필). 클릭 시 부서~모바일 inputbox의 disabled 해제 -->
                          <v-btn
                            color="default"
                            fab
                            x-small
                            class="mr-2 float-right"
                            elevation="0"
                            v-show="showEditButton"
                            @click="editPrivacyInfoFunc()"
                          >
                            <v-icon
                              small
                            >mdi-pencil</v-icon>
                          </v-btn>
                          <!-- ▼ 비밀번호 변경 관련 Dialog(모달) -->
                          <ModalDialogComponent
                            :dialog-value="dialog"
                            max-width="300px"
                            title="비밀번호 변경"
                            closeText="취소"
                            saveText="저장"
                            :persistent="true"
                            @close="dialog=false"
                            @save="save"
                          >
                            <template v-slot:activator>
                              <!-- ▼ 계정 추가 버튼 -->
                              <v-btn color="default" x-small fab class="mr-2 float-right" elevation="0" @click="dialog = true">
                                <v-icon>mdi-lock-alert</v-icon>
                              </v-btn>
                            </template>
                              <v-form ref="passwordForm">
                                <v-row class="mt-3">
                                  <v-col cols="12">
                                    <v-text-field
                                      v-model="passwords.currentPassword"
                                      label="현재 비밀번호"
                                      :rules="checkCurrentPasswordRules"
                                      type="password"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12">
                                    <v-text-field
                                      v-model="passwords.newPassword"
                                      label="새 비밀번호"
                                      :rules="passwordRules"
                                      type="password"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12">
                                    <v-text-field
                                      v-model="passwords.newPasswordCheck"
                                      label="새 비밀번호 확인"
                                      :rules="checkPasswordRules"
                                      type="password"
                                    ></v-text-field>
                                  </v-col>
                                </v-row>
                              </v-form>
                          </ModalDialogComponent>
                        </v-col>
                      </v-row>
                    </v-banner>
                  </v-col>

                  <!-- ▼ 부서~모바일까지의 계정 정보 input 영역 -->
                  <v-col
                    cols="12"
                  >
                    <v-form ref="myInfoForm">
                      <InputsFormComponent
                        clearable
                        :inputs="userInputs"
                      ></InputsFormComponent>
                    </v-form>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card>

        </v-col>
      </v-row>
    </v-main>
  </div>

</template>
<style>
.theme--light.v-input--is-disabled input{color:black;}
</style>
<script>
import NavComponent from "@/components/NavComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import mux from "@/mux";
import CheckPagePermission from "@/common_js/CheckPagePermission";

export default {
  mixins: [CheckPagePermission('http://192.168.0.26:8081/api/check_page_permission?page_name=MyPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  components: {
                NavComponent,
                ModalDialogComponent,
                InputsFormComponent,
              },
  data(){
    return{
      // disabledInput: true,
      // ▼ 정보 수정 버튼
      showEditButton: true,
      // ▼ 정보 수정 후 저장 버튼
      showSaveButton: false,
      //▼ 비밀번호 변경 Modal
      dialog: false,
      // ▼ 계정 기본 정보
      userInfo: {name: '윤준수', password:'test1234'},
      userInputs:[
        {icon: 'mdi-crowd', column_name:'department', label: '부서', value: '기획관리', col:'12', sm:'6', lg:'6', disabled:true},
        {icon: 'mdi-map-marker-account', column_name:'position', label: '직책', value: '매니저', col:'12', sm:'6', lg:'6', disabled:true},
        {icon: 'mdi-phone-dial', column_name:'phone', label: '전화번호', value: '070-1234-1234', col:'12', sm:'6', lg:'6', disabled:true,
        rules: [
          v => !!v || '전화번호 입력',
          v => !!(v &&  /^\d{2,3}-\d{3,4}-\d{4}$/.test(v) ) || '번호 형식 확인(ex : 070-1234-5678)',
        ]},
        {icon: 'mdi-phone-in-talk', column_name:'extension', label: '내선', value:'123', col:'12', sm:'6', lg:'6', disabled:true,
        rules: [
          v => !!v || '내선번호 입력',
          v => !!(v &&  /[0-9]$/.test(v) ) || '숫자만 입력',
        ]},
        {icon: 'mdi-email-fast', column_name:'email', label: '이메일', value: 'yjs@pionelectric.com', col:'12', sm:'6', lg:'6', disabled:true,
        rules: [
          v => !!v || '이메일 입력',
        v => !!(v &&  /^[A-Za-z0-9_\\.\\-]+@pionelectric.com+/.test(v) ) || '이메일 형식 확인(@pionelectric.com)',
        ]},
        {icon: 'mdi-cellphone-text', column_name:'mobile', label: '모바일', value: '010-1234-5678', col:'12', sm:'6', lg:'6', disabled:true,
        rules: [
          v => !!v || '휴대전화번호 입력',
          v => !!(v &&  /^\d{3}-\d{3,4}-\d{4}$/.test(v) ) || '번호 형식 확인(ex : 010-1234-5678)',
        ]},
      ],
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
        v => !!v || '비밀번호 입력',
        v => !!(v &&  /^(?=.*[a-zA-z])(?=.*[0-9]).{8,16}$/.test(v) ) || '영문 + 숫자, 8자 이상 16자 이하',
      ],
    }
  },
  methods: {
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },

    // ▼ 수정버튼 onclick 함수
    editPrivacyInfoFunc(){
      this.userInputs.forEach(data =>{
        if(data.column_name == 'department' || data.column_name == 'position'){
          data.disabled = true
        } else{
          data.disabled = false
        }
      })
      this.showEditButton = false;
      this.showSaveButton = true;
    },
    // ▼ 저장버튼 onclick 함수
    async savePrivacyInfoFunc(){
      const validate = this.$refs.myInfoForm.validate();
      if(validate){
        // try {
        //   console.log('this.userInputs :>> ', this.userInputs);
        //   let result = await mux.Server.post({
        //     path: '/api/???/???',
        //     user_name: this.$configJson.cookies.id,
        //     given_name: ???,
        //     family_name: '',
        //     phone_number: this.userInputs.find(x=>x.column_name === 'mobile').value
        //   });
        //   console.log('result :>> ', result);
        //   // alert('저장이 완료되었습니다.')
        //   alert(result.message);
        //   // 성공시 다이얼로그 닫기
        //   if (result.code == 0){
        //     this.dialog = false;
        //   }
        // } catch (error) {
        //   alert(error);
        // }

        this.userInputs.forEach(data =>{
          data.disabled = true
        })
        this.showEditButton = true;
        this.showSaveButton = false;
      }
    },
    async save(){
      const validate = this.$refs.passwordForm.validate();
      if(validate){
        try {
          console.log('this.passwords :>> ', this.passwords);
          let result = await mux.Server.post({
            path: '/api/user/change_password/',
            old_password: this.passwords.currentPassword,
            new_password: this.passwords.newPassword
          });
          console.log('result :>> ', result);
          // alert('비밀번호 변경이 완료되었습니다.');
          alert(result.message);
          // 성공시 다이얼로그 닫기
          if (result.code == 0){
            this.dialog = false;
          }
        } catch (error) {
          alert(error);
        }
        this.dialog = false;
      }

    }
  },
}
</script>
