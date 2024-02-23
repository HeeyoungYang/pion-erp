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
                          </ModalDialogComponent>
                        </v-col>
                      </v-row>
                    </v-banner>
                  </v-col>

                  <!-- ▼ 부서~모바일까지의 계정 정보 input 영역 -->
                  <v-col
                    cols="12"
                    md="6"
                    v-for="userInput in userInput"
                    :key="userInput.label"
                  ><!-- ▼ script에 기입된 userInput의 데이터를 가져와 순서대로 노출. disabled가 기본이며 수정 버튼을 클릭해야 disabled가 해제 됨-->
                    <v-text-field
                      v-model="userInput.data"
                      :prepend-icon="userInput.icon"
                      :label="userInput.label"
                      :disabled="disabledInput"
                    ></v-text-field>
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

export default {
  components: {
                NavComponent,
                ModalDialogComponent,
              },
  data(){
    return{
      disabledInput: true,
      // ▼ 정보 수정 버튼
      showEditButton: true,
      // ▼ 정보 수정 후 저장 버튼
      showSaveButton: false,
      //▼ 비밀번호 변경 Modal
      dialog: false,
      // ▼ 계정 기본 정보
      userInfo: {name: '윤준수', password:'test1234'},
      userInput: [
          {icon: 'mdi-crowd', label: '부서', data: '기획관리'},
          {icon: 'mdi-map-marker-account', label: '직책', data: '매니저'},
          {icon: 'mdi-phone-dial', label: '전화번호', data: '070-1234-1234'},
          {icon: 'mdi-phone-in-talk', label: '내선', data:'123', disabled:true},
          {icon: 'mdi-email-fast', label: '이메일', data: 'yjs@pionelectric.com'},
          {icon: 'mdi-cellphone-text', label: '모바일', data: '010-1234-5678'},
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
        v => !!(v == this.userInfo.password) || '비밀번호를 확인해주세요.',
      ],
    }
  },
  methods: {
    // ▼ 수정버튼 onclick 함수
    editPrivacyInfoFunc(){
      this.disabledInput = false;
      this.showEditButton = false;
      this.showSaveButton = true;
    },
    // ▼ 저장버튼 onclick 함수
    savePrivacyInfoFunc(){
      this.disabledInput = true;
      this.showEditButton = true;
      this.showSaveButton = false;
    },
    save(){
      this.dialog = false;
    }
  },
}
</script>
