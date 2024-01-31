<template>
  <div>
    <TheNav></TheNav>
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
                  <!-- 계정 이름 및 비밀번호 변경, 정보 수정 아이콘 노출 영역 -->
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
                          <span class="mr-2 font-weight-black text-h6">{{ userInfo.name }}</span>
                        </v-col>
                        <v-col
                        xs="6">
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
                          <!-- 비밀번호 변경 관련 -->
                          <v-dialog
                            v-model="dialog"
                            persistent
                            max-width="300px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                color="default"
                                fab
                                x-small
                                class="mr-2 float-right"
                                elevation="0"
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon
                                  small
                                >mdi-lock-alert</v-icon>
                              </v-btn>
                            </template>
                            <!-- 비밀번호 변경 모달 -->
                            <v-card>
                              <v-card-title class=" blue lighten-5">
                                <div class="font-weight-black text-6">비밀번호 변경</div>
                              </v-card-title>
                              <v-card-text>
                                <v-container>
                                  <v-row>
                                    <v-col cols="12">
                                      <v-text-field
                                        v-model="passwords.currentPassword"
                                        label="현재 비밀번호"
                                        :rules="checkCurrentPasswordRules"
                                        type="password"
                                        required
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                      <v-text-field
                                        v-model="passwords.newPassword"
                                        label="새 비밀번호"
                                        :rules="passwordRules"
                                        type="password"
                                        required
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                      <v-text-field
                                        v-model="passwords.newPasswordCheck"
                                        label="새 비밀번호 확인"
                                        :rules="checkPasswordRules"
                                        type="password"
                                        required
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="blue darken-1"
                                  text
                                  @click="dialog = false"
                                >
                                  저장
                                </v-btn>
                                <v-btn
                                  color="blue darken-1"
                                  text
                                  @click="dialog = false"
                                >
                                  닫기
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </v-col>
                      </v-row>
                    </v-banner>
                  </v-col>

                  <!-- 이름 외 계정 정보 input 영역 -->
                  <v-col
                    cols="12"
                    md="6"
                    v-for="userInput in userInput"
                    :key="userInput.label"
                  >

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
import TheNav from "@/components/TheNav";

export default {
  components: {
                TheNav,
              },
  data(){
    return{
      disabledInput: true,
      //정보 수정 버튼
      showEditButton: true,
      //정보 수정 저장 버튼
      showSaveButton: false,
      //modal
      dialog:false,
      //계정 기본 정보
      userInfo: {name: '윤준수', password:'test1234'},
      userInput: [
          {icon: 'mdi-crowd', label: '부서', data: '기획관리'},
          {icon: 'mdi-map-marker-account', label: '직책', data: '매니저'},
          {icon: 'mdi-phone-dial', label: '전화번호', data: '070-1234-1234'},
          {icon: 'mdi-phone-in-talk', label: '내선', data:'123', disabled:true},
          {icon: 'mdi-email-fast', label: '이메일', data: 'yjs@pionelectric.com'},
          {icon: 'mdi-cellphone-text', label: '모바일', data: '010-1234-5678'},
      ],
      //비밀번호 변경
      passwords:{
        currentPassword:'',
        newPassword: '',
        newPasswordCheck: '',
      },
      //비밀번호 변경 유효성 검사
      passwordRules: [
        v => !!v || '비밀번호 입력',
        v => !!(v &&  /^(?=.*[a-zA-z])(?=.*[0-9]).{8,16}$/.test(v) ) || '영문 + 숫자, 8자 이상 16자 이하',
      ],
      //새 비밀번호와 새 비밀번호 확인의 일치 여부
      checkPasswordRules: [
        v => !!(v == this.passwords.newPassword) || '새 비밀번호와 일치하지 않습니다.',
      ],
      //실제 현 비밀번호와 사용자가 입력한 현재 비밀번호 일치 여부
      checkCurrentPasswordRules: [
        v => !!(v == this.userInfo.password) || '비밀번호를 확인해주세요.',
      ],
    }
  },
  methods: {
    editPrivacyInfoFunc(){
      this.disabledInput = false;
      this.showEditButton = false;
      this.showSaveButton = true;
    },
    savePrivacyInfoFunc(){
      this.disabledInput = true;
      this.showEditButton = true;
      this.showSaveButton = false;
    }
  },
}
</script>
<style lang="">

</styl>
