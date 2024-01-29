<template>
  <div>
  <v-row justify="center">
    <v-col
      cols="12"
      md="4"
    >
      <v-card
      elevation="1"
      class="mt-6"
      >
        <v-row justify="center"
          style="padding: 45px 0px 40px;">
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
          <v-col
            cols="12"
            md="9"
          >
            <v-text-field
              label="아이디"
              required
              filled
            ></v-text-field>
            <v-text-field
              label="비밀번호"
              type="password"
              required
              filled
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="9"
            style="padding-top: 0px"
          >

            <router-link to="/home">
              <v-btn
                block
                style="padding: 25px 0px;"
                color="primary"
                class="text-h6 font-weight-black"
              >
                로그인
              </v-btn>
            </router-link>
          </v-col>
          <v-col
            cols="12"
            md="9"
          >
            <v-checkbox
              v-model="checkbox"
              label="아이디 저장"
              class="float-left mt-0"
            ></v-checkbox>
            <v-dialog
              v-model="dialog"
              persistent
              max-width="300px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  color="primary"
                  class="float-right body-2">
                  비밀번호 찾기
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">임시 비밀번호</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        class="pb-0">
                        <v-text-field
                          label="성함"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        class="pt-0">
                        <v-text-field
                          label="Email"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <p class="text-caption text-center">이메일로 임시 비밀번호가 발급됩니다</p>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="dialog = false"
                  >
                    닫기
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="dialog = false"
                  >
                    발급
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- <v-btn
              outlined
              color="primary"
              class="float-right body-2">
              비밀번호 찾기
            </v-btn> -->
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>

  </div>
</template>
<script>
export default {
  data(){
    return{
        dialog: false,
        checkbox: true,
    }
  }

}
</script>
<style>
</style>
