

<template>
  <v-card>
    <v-card-text>
      <v-row class="py-3">
        <v-col cols="12">
            <v-text-field
              label="받는 사람"
              required
              v-model="mailData.to"
              dense
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="참조"
              v-model="mailData.cc"
              dense
              hide-details
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="숨은 참조"
              v-model="mailData.bcc"
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
            v-model="mailData.subject"
            hide-details
          ></v-text-field>
          <v-checkbox
            label="견적서"
            v-model="mailData.estimate"
            color="primary"
            hide-details
            class="float-left mr-3"
          ></v-checkbox>
          <v-checkbox
            label="산출내역서"
            v-model="mailData.specification"
            color="primary"
            hide-details
            class="float-left mr-3"
          ></v-checkbox>
          <v-checkbox
            label="노무비 산출"
            v-model="mailData.labor"
            color="primary"
            hide-details
            class="float-left mr-3"
          ></v-checkbox>
          <v-checkbox
            label="도면"
            v-model="mailData.drawing"
            color="primary"
            hide-details
            class="float-left mr-3"
          ></v-checkbox>
          <v-checkbox
            label="승인서"
            v-model="mailData.approval"
            color="primary"
            hide-details
            class="float-left mr-3"
          ></v-checkbox>
          <v-checkbox
            label="기타첨부"
            v-model="mailData.etc"
            color="primary"
            hide-details
            class="float-left mr-3"
          ></v-checkbox>
          <v-checkbox
            label="사업자등록증"
            v-model="mailData.business_license"
            color="primary"
            hide-details
            class="float-left mr-3"
          ></v-checkbox>
        </v-col>
        <v-col cols="12">
          <vue-editor v-model="mailData.content" :editor-toolbar="customToolbar" id="email_editor"/>
        </v-col>
        <v-col cols="12">
          <v-file-input

            v-model="mailData.files"
            placeholder="추가 첨부"
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
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          to: '',
          cc: '',
          bcc: '',
          subject: '',
          estimate: false,
          specification: false,
          labor: false,
          drawing: false,
          approval: false,
          etc: false,
          business_license: false,
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
          files: []

        }
      }
    }
  },
  created() {
    this.mailData = this.value
  },
  methods: {

  },
  watch: {
    value: {
      handler: function (val) {
        this.mailData = val;
      },
      deep: true
    },
    mailData: {
      handler: function (val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  components: {
  },
  data(){
    return{
      mailData: {},
    }
  },
}
</script>
<style>
#email_editor {
    height: 400px;
  }
</style>
