

<template>
  <v-card>
    <v-card-text>
      <v-row class="py-3">
        <v-col cols="12">
            <v-text-field
              label="받는 사람"
              required

              dense
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="참조"

              dense
              hide-details
              required
            ></v-text-field>
          </v-col>
      </v-row>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text class="mt-6">
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="제목"
            required
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <vue-editor v-model="content" :editor-toolbar="customToolbar" id="email_editor"/>
        </v-col>
        <v-col cols="12">
          <v-file-input
            @change="fileChanged"
            placeholder="파일 선택"
            hide-details
            dense
            multiple
            prepend-icon="mdi-paperclip"
          >
            <template v-slot:selection="{ text }">
              <v-chip
                small
                label
                color="primary"
              >
                {{ text }}
              </v-chip>
            </template>
          </v-file-input>
        </v-col>
      </v-row>
    </v-card-text>
    <slot></slot>

  </v-card>
</template>

<script>

export default {
  methods: {
    fileChanged(file) {
      // 파일이 변경되면 부모 컴포넌트로 파일 정보를 전달
      this.$emit('input', file);
    }
  },
  components: {
  },
  data(){
    return{
      content:
      `



<p style="color:#255fab; border-bottom:1px solid #255fab; border-top:1px solid #255fab;padding:15px 0px"><strong>윤준수
파이온 일렉트릭㈜ 기획관리부 대리 / Pion Electric Co., Ltd. Administration Department Staff</strong></p>
<p style="border-bottom:1px solid #333333;padding-bottom:20px; font-size:14px;">Home page : www.pionelectric.com
E-mail: yjs@pionelectric.com      C/P: +82(0)10-8939-4179
Tel: +82(0)70-5096-4179    Fax: +82(0)505-300-4179

본사: (03722) 서울특별시 서대문구 연세로 50 연세대학교 공학원 116호
Head office: #116, Engineering Research Park, Yonsei University, 50, Yonsei-ro, Seodaemun-gu, Seoul, 03722, Republic of KOREA
광명 사무소: (14348) 경기도 광명시 일직로 72  A-1818호
Gwangmyeong office: #A-1818, 72, Iljik-ro, Gwangmyeong-si, Gyeonggi-do, Republic of KOREA 14348
광주 공장: (47580) 광주광역시 광산구 연산동 1247
Gwangju factory: 1247 Yeonsan-dong, Gwangsan-gu, Gwangju, Republic of KOREA 47580
보령 공장: (33448) 충청남도 보령시 주교면 관창공단길 266
Boryeong factory: 266, Gwanchanggongdan-gil, Jugyo-myeon, Boryeong-si, Chungcheongnam-do, Republic of KOREA 33448
</p>
<p style="border-bottom:1px solid #333333;padding-bottom:20px; font-size:14px;"><strong>제품 및 서비스</strong>
∙ 고자기장 기반의 산업용 운용기기 (Development of Operating Device for Industrial Applications based on High Magnetic Field)
∙ 광기기 기반의 전력전자 응용기기 (Development of Power Electronics Application Device based on Optical Device)
∙ 신재생 에너지 개발 및 운영 (Development and Operation of Renewable Energy System)
∙ 전력계통 진단 및 해석 (Power System Diagnosis and Analysis)
∙ 전기공사면허</p>`,
    }
  },
}
</script>
<style>
#email_editor {
    height: 400px;
  }
</style>
