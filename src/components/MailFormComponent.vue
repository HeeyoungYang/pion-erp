

<template>
  <v-container class="pa-1">
    <v-card  :class="addCardClass ? addCardClass : ''">
      <slot name="addCard"></slot>
    </v-card>
    <v-card  :class="mailCardClass ? mailCardClass : ''">
      <v-card-title  :class="titleClass ? titleClass : ''">
        <slot name="cardTitle"></slot>
      </v-card-title>
      <v-card-text>
        <v-row class="py-3">
          <v-col cols="12">
            <v-combobox
              ref="toCombobox"
              label="받는 사람"
              required
              v-model="mailData.to"
              :items="toOptions"
              :rules="[toValidationRule]"
              @keyup="onKeyup"
              @keydown="onKeydown"
              dense
              hide-selected
              multiple
              small-chips
              ></v-combobox>
            </v-col>
            <v-col cols="12">
              <v-combobox
                ref="ccCombobox"
                label="참조"
                v-model="mailData.cc"
                :items="ccOptions"
                :rules="[ccValidationRule]"
                @keyup="onKeyup"
                @keydown="onKeydown"
                dense
                hide-selected
                multiple
                small-chips
                ></v-combobox>
            </v-col>
            <v-col cols="12">
              <v-combobox
                ref="bccCombobox"
                label="숨은 참조"
                v-model="mailData.bcc"
                :items="bccOptions"
                :rules="[bccValidationRule]"
                @keyup="onKeyup"
                @keydown="onKeydown"
                dense
                hide-selected
                multiple
                small-chips
                ></v-combobox>
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
          </v-col>
          <v-col cols="12" v-if="addSystemFiles === 'estimate'">
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
              v-model="mailData.blueprint"
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
          <v-col cols="12" v-if="addSystemFiles === 'order'">
            <v-checkbox
              label="발주서"
              v-model="mailData.estimate"
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
            <div>
              <div class="pa-7" style="border:1px solid #ccc; height: 200px; overflow-x: scroll;">
                <p style="color:#255fab; border-bottom:1px solid #255fab; border-top:1px solid #255fab;padding:15px 0px"><strong>{{ loginInfo.name }}
                파이온 일렉트릭㈜ {{ loginInfo.department }} {{ loginInfo.position }} / Pion Electric Co., Ltd.</strong></p>
                <p style="border-bottom:1px solid #333333;padding-bottom:20px; font-size:14px;">Home page : www.pionelectric.com<br>
                E-mail: {{ loginInfo.email }}      C/P: +82(0){{ loginInfo.phone_number.slice(1) }}<br>
                Tel: +82(0){{ loginInfo.office_phone_number.slice(1) }}    Fax: +82(0)505-300-4179<br><br>

                본사: (03722) 서울특별시 서대문구 연세로 50 연세대학교 공학원 116호<br>
                Head office: #116, Engineering Research Park, Yonsei University, 50, Yonsei-ro, Seodaemun-gu, Seoul, 03722, Republic of KOREA<br><br>
                광명 사무소: (14348) 경기도 광명시 일직로 72  A-1818호<br>
                Gwangmyeong office: #A-1818, 72, Iljik-ro, Gwangmyeong-si, Gyeonggi-do, Republic of KOREA 14348<br><br>
                광주 공장: (47580) 광주광역시 광산구 연산동 1247<br>
                Gwangju factory: 1247 Yeonsan-dong, Gwangsan-gu, Gwangju, Republic of KOREA 47580<br><br>
                보령 공장: (33448) 충청남도 보령시 주교면 관창공단길 266<br>
                Boryeong factory: 266, Gwanchanggongdan-gil, Jugyo-myeon, Boryeong-si, Chungcheongnam-do, Republic of KOREA 33448<br><br>
                </p>
                <p style="border-bottom:1px solid #333333;padding-bottom:20px; font-size:14px;"><strong>제품 및 서비스</strong><br>
                ∙ 고자기장 기반의 산업용 운용기기 (Development of Operating Device for Industrial Applications based on High Magnetic Field)<br>
                ∙ 광기기 기반의 전력전자 응용기기 (Development of Power Electronics Application Device based on Optical Device)<br>
                ∙ 신재생 에너지 개발 및 운영 (Development and Operation of Renewable Energy System)<br>
                ∙ 전력계통 진단 및 해석 (Power System Diagnosis and Analysis)<br>
                ∙ 전기공사면허</p>
              </div>
            </div>
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
  </v-container>
</template>

<script>
import mux from '@/mux';

/**
 * @file MailFormComponent.vue
 * @description 메일 발송 컴포넌트
 *
 * @typedef {Object} props
 * @property {String} [addSystemFiles] - 첨부파일 체크박스 사용 여부 및 종류 (default:false)
 * @property {String} [titleClass] - v-card-title 클래스(default:'')
 * @property {String} [loginInfo] - v-card-title 클래스(default:'')
 * @property {String} [mailCardClass] - mail card 영역 관련 클래스(default:'')
 * @property {String} [addCardClass] - mail card 상단 card 영역 관련 클래스(default:'')
 * @property {Array} [toItems] - 받는 사람 목록(default:[])
 * @property {Array} [ccItems] - 참조 목록(default:[])
 * @property {Array} [bccItems] - 숨은 참조 목록(default:[])
 * @property {Boolean} [disableAllMembers] - 모든 멤버 사용 금지 여부(default:false)
 * @property {Boolean} [disableToAllMembers] - 받는 사람 모든 멤버 사용 금지 여부(default:false)
 * @property {Boolean} [disableCcAllMembers] - 참조 모든 멤버 사용 금지 여부(default:false)
 * @property {Boolean} [disableBccAllMembers] - 숨은 참조 모든 멤버 사용 금지 여부(default:false)
 *
 */
export default {
  props: {
    addSystemFiles: String,
    titleClass: String,
    mailCardClass: String,
    addCardClass: String,
    loginInfo: String,
    toItems: {
      type: Array,
      default: () => []
    },
    ccItems: {
      type: Array,
      default: () => []
    },
    bccItems: {
      type: Array,
      default: () => []
    },
    disableAllMembers: {
      type: Boolean,
      default: false
    },
    disableToAllMembers: {
      type: Boolean,
      default: false
    },
    disableCcAllMembers: {
      type: Boolean,
      default: false
    },
    disableBccAllMembers: {
      type: Boolean,
      default: false
    },
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
          blueprint: false,
          approval: false,
          etc: false,
          business_license: false,
          content:
          `<div>
            <p style="color:#255fab; border-bottom:1px solid #255fab; border-top:1px solid #255fab;padding:15px 0px"><strong>윤준수
            파이온 일렉트릭㈜ 기획관리부 대리 / Pion Electric Co., Ltd. Administration Department Staff</strong></p>
            <p style="border-bottom:1px solid #333333;padding-bottom:20px; font-size:14px;">Home page : www.pionelectric.com<br>
            E-mail: yjs@pionelectric.com      C/P: +82(0)10-8939-4179<br>
            Tel: +82(0)70-5096-4179    Fax: +82(0)505-300-4179<br>

            본사: (03722) 서울특별시 서대문구 연세로 50 연세대학교 공학원 116호<br>
            Head office: #116, Engineering Research Park, Yonsei University, 50, Yonsei-ro, Seodaemun-gu, Seoul, 03722, Republic of KOREA<br>
            광명 사무소: (14348) 경기도 광명시 일직로 72  A-1818호<br>
            Gwangmyeong office: #A-1818, 72, Iljik-ro, Gwangmyeong-si, Gyeonggi-do, Republic of KOREA 14348<br>
            광주 공장: (47580) 광주광역시 광산구 연산동 1247<br>
            Gwangju factory: 1247 Yeonsan-dong, Gwangsan-gu, Gwangju, Republic of KOREA 47580<br>
            보령 공장: (33448) 충청남도 보령시 주교면 관창공단길 266<br>
            Boryeong factory: 266, Gwanchanggongdan-gil, Jugyo-myeon, Boryeong-si, Chungcheongnam-do, Republic of KOREA 33448<br>
            </p>
            <p style="border-bottom:1px solid #333333;padding-bottom:20px; font-size:14px;"><strong>제품 및 서비스</strong><br>
            ∙ 고자기장 기반의 산업용 운용기기 (Development of Operating Device for Industrial Applications based on High Magnetic Field)<br>
            ∙ 광기기 기반의 전력전자 응용기기 (Development of Power Electronics Application Device based on Optical Device)<br>
            ∙ 신재생 에너지 개발 및 운영 (Development and Operation of Renewable Energy System)<br>
            ∙ 전력계통 진단 및 해석 (Power System Diagnosis and Analysis)<br>
            ∙ 전기공사면허</p>
          </div>`,
          files: []

        }
      }
    }
  },
  async created() {
    this.mailData = this.value

    if (!this.disableAllMembers || !this.disableToAllMembers || !this.disableCcAllMembers || !this.disableBccAllMembers) {
      let allMembers = [];
      try {
        const result = await mux.Server.get({path:'/api/admin/users/'});
        if (result.code == 0){
          allMembers = result.data.Users.map(data => {
            let user = {};
            user.user_id = data.Username;
            user.name = (data.Attributes.find(x=>x.Name === 'given_name') ? data.Attributes.find(x=>x.Name === 'given_name').Value : '');
            user.email = data.Attributes.find(x=>x.Name === 'email') ? data.Attributes.find(x=>x.Name === 'email').Value : '';
            user.phone_number = data.Attributes.find(x=>x.Name === 'phone_number') ? mux.Number.formatPhoneNumber(data.Attributes.find(x=>x.Name === 'phone_number').Value) : '';
            user.office_phone_number = data.Attributes.find(x=>x.Name === 'custom:office_phone_number') ? mux.Number.formatTelNumber(data.Attributes.find(x=>x.Name === 'custom:office_phone_number').Value) : '';
            user.office_internal_number = data.Attributes.find(x=>x.Name === 'custom:internal_number') ? data.Attributes.find(x=>x.Name === 'custom:internal_number').Value : '';
            user.position = data.Attributes.find(x=>x.Name === 'custom:position') ? data.Attributes.find(x=>x.Name === 'custom:position').Value : '';
            user.department = data.Attributes.find(x=>x.Name === 'custom:department') ? data.Attributes.find(x=>x.Name === 'custom:department').Value : '';
            return user;
          });

        }else {
          console.error('send email error: 사용자 정보를 가져올 수 없습니다.');
        }

        const userPosition = this.$cookies.get(this.$configJson.cookies.position.key);
        if (userPosition !== 'master'){
          allMembers = allMembers.filter(data => data.position !== 'master' && !data.name.includes('TEST '));
        }
        allMembers = allMembers.sort((a, b) => (a.department + '-' + a.name + '-' + a.position).localeCompare(b.department + '-' + b.name + '-' + b.position));
      } catch (error) {
        console.error('send email error: 사용자 정보를 가져올 수 없습니다.');
      }

      if (allMembers.length === 0) {
        console.error('send email error: 사용자 정보가 없습니다.');
      }else {

        if (this.toItems.length === 0 && (!this.disableAllMembers && !this.disableToAllMembers)) {
          this.toOptions = allMembers.map(member => member.department + '-' + member.name + '-' + member.position);
        }
        if (this.ccItems.length === 0 && (!this.disableAllMembers && !this.disableCcAllMembers)) {
          this.ccOptions = allMembers.map(member => member.department + '-' + member.name + '-' + member.position);
        }
        if (this.bccItems.length === 0 && (!this.disableAllMembers && !this.disableBccAllMembers)) {
          this.bccOptions = allMembers.map(member => member.department + '-' + member.name + '-' + member.position);
        }

      }
    }
  },
  methods: {
    onKeydown(event) {
      const delimiters = [',', '/', ' '];
      if (delimiters.includes(event.key)) {
        event.preventDefault();
      }
    },
    onKeyup(event) {
      const delimiters = [',', '/', ' '];
      const inputEl = event.target;

      if (delimiters.includes(event.key)) {

        event.preventDefault();

        const enterEvent = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          charCode: 13,
          which: 13
        });

        inputEl.dispatchEvent(enterEvent);

        // for (let i = 0; i < this.mailData[key].length; i++) {
        //   for (let j = 0; j < delimiters.length; j++) {
        //     const delimiter = delimiters[j];
        //     this.mailData[key][i] = this.mailData[key][i].replaceAll(delimiter, '');
        //   }
        // }
      }
    },

    dispatchEnterKeyToAllCombobox() {
      return new Promise((resolve) => {
        const enterEvent = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          charCode: 13,
          which: 13
        });
        const toCombobox = this.$refs.toCombobox.$el.querySelector('input');
        toCombobox.dispatchEvent(enterEvent);
        const ccCombobox = this.$refs.ccCombobox.$el.querySelector('input');
        ccCombobox.dispatchEvent(enterEvent);
        const bccCombobox = this.$refs.bccCombobox.$el.querySelector('input');
        bccCombobox.dispatchEvent(enterEvent);
        resolve();
      });
    }
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
    },
    toItems: {
      handler: function (val) {
        this.toOptions = val;
      },
      deep: true
    },
    ccItems: {
      handler: function (val) {
        this.ccOptions = val;
      },
      deep: true
    },
    bccItems: {
      handler: function (val) {
        this.bccOptions = val;
      },
      deep: true
    }
  },
  components: {
  },
  data(){
    return{
      mailData: {},
      toOptions: this.toItems,
      ccOptions: this.ccItems,
      bccOptions: this.bccItems,
      emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      toValidationRule: value => {
        if (!value) return true;
        return value.every(val => this.toOptions.includes(val) || this.emailRegex.test(val)) || '멤버를 선택하거나 이메일 주소를 입력해주세요.';
      },
      ccValidationRule: value => {
        if (!value) return true;
        return value.every(val => this.ccOptions.includes(val) || this.emailRegex.test(val)) || '멤버를 선택하거나 이메일 주소를 입력해주세요.';
      },
      bccValidationRule: value => {
        if (!value) return true;
        return value.every(val => this.bccOptions.includes(val) || this.emailRegex.test(val)) || '멤버를 선택하거나 이메일 주소를 입력해주세요.';
      },
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ["bold", "italic", "underline", "strike"], // toggled buttons
        [
          { align: "" },
          { align: "center" },
          { align: "right" },
          { align: "justify" }
        ],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        // ["link", "image", "video"],
        ["clean"] // remove formatting button
      ],
    }
  },
}
</script>
<style>
#email_editor {
    height: 400px;
  }
</style>
