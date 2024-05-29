<template>
  <v-dialog
  v-model="dialog"
  :max-width="maxWidth ? maxWidth : '50%'"
  :persistent="persistent ? persistent : false"
  :transition="dialogTransition ? dialogTransition : ''"
  :content-class="dialogCustom ? dialogCustom : ''"
  @click:outside="persistent ? null : close()">
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" v-bind="attrs" v-on="on"></slot>
    </template>
    <v-card elevation="0">
      <v-card-title style="width:100%;">
        <v-row>
          <v-col cols="12">
            <p class="float-left text-h6 font-weight-black mb-0">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                dense
                single-line
                hide-details
              ></v-text-field>
            </p>
            <v-icon class="float-right" @click="close">mdi-close-circle</v-icon>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="members"
          :search="search"
          dense
        >
          <template v-slot:[`item.set`]="{ item }">
            <v-btn x-small color="primary" @click="setMember(item)">적용</v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import MemberSearchDialogConfig from "@/configure/MemberSearchDialogConfig.json";
import mux from "@/mux";
// import DataTableComponent from "@/components/DataTableComponent";
/**
 * @file ModalDialogComponent.vue
 * @description 모달 다이얼로그 컴포넌트
 *
 * @typedef {Object} props
 * @property {Boolean} dialogValue - 모달 오픈 여부
 * @property {Boolean} [persistent] - 외부 클릭 방지 여부(default:false)
 * @property {Boolean} [fullscreen] - 외부 클릭 방지 여부(default:false)
 * @property {Boolean} [hideOverlay] - 외부 클릭 방지 여부(default:false)
 * @property {String} [maxWidth] - 최대 가로 길이(defalt:500px)
 * @property {String} [dialogTransition] - 모달 오픈 방식 (슬라이드 등) (defalt:'')
 * @property {String} [dialogCustom] - 모달 커스텀 css (defalt:'')
 * @property {String} [cardElevation] - 카드 그림자 설정 (defalt:'2')
 * @property {String} [title] - 제목 텍스트
 * @property {String} [titleClass] - 제목 클래스
 * @property {String} [textClass] - 본문 클래스
 * @property {String} [saveText] - 저장 버튼 텍스트
 * @property {String} [confirmText] - 확인 버튼 텍스트
 * @property {String} [closeText] - 취소 버튼 텍스트
 *
 * @emits ModalDialogComponent#save
 * @emits ModalDialogComponent#confirm
 * @emits ModalDialogComponent#close
 */
export default {
  props: {
    dialogValue: Boolean,
    persistent: Boolean,
    fullscreen: Boolean,
    hideOverlay: Boolean,
    maxWidth: String,
    dialogTransition: String,
    cardElevation: String,
    dialogCustom: String,
    title: String,
    titleClass: String,
    textClass: String,
    saveText: String,
    confirmText: String,
    closeText: String
  },
  components:{
    // DataTableComponent,
  },
  data() {
    return {
      search: '',
      members:[],
      dialog: this.dialogValue,
      thisfunc: this.thisfunc,
      eventAdded: false,
      headers:[],
    };
  },
  watch: {
    dialogValue(value) {
      this.dialog = value;
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    async initialize () {
      this.headers = MemberSearchDialogConfig.table_header;
      // this.members = MemberSearchDialogConfig.test_members
      // let memberList = [];
      const prevURL = window.location.href;
      try {
        const result = await mux.Server.get({path:'/api/admin/users/'});
        if (prevURL !== window.location.href) return;
        if (result.code == 0){
          this.members = result.data.Users.map(data => {
            let user = {};
            user.user_id = data.Username;
            user.name = (data.Attributes.find(x=>x.Name === 'family_name') ? data.Attributes.find(x=>x.Name === 'family_name').Value : '') + (data.Attributes.find(x=>x.Name === 'given_name') ? data.Attributes.find(x=>x.Name === 'given_name').Value : '');
            user.email = data.Attributes.find(x=>x.Name === 'email') ? data.Attributes.find(x=>x.Name === 'email').Value : '';
            user.phone_number = data.Attributes.find(x=>x.Name === 'phone_number') ? mux.Number.formatPhoneNumber(data.Attributes.find(x=>x.Name === 'phone_number').Value) : '';
            user.office_phone_number = data.Attributes.find(x=>x.Name === 'custom:office_phone_number') ? mux.Number.formatTelNumber(data.Attributes.find(x=>x.Name === 'custom:office_phone_number').Value) : '';
            user.office_internal_number = data.Attributes.find(x=>x.Name === 'custom:internal_number') ? data.Attributes.find(x=>x.Name === 'custom:internal_number').Value : '';
            user.position = data.Attributes.find(x=>x.Name === 'custom:position') ? data.Attributes.find(x=>x.Name === 'custom:position').Value : '';
            user.department = data.Attributes.find(x=>x.Name === 'custom:department') ? data.Attributes.find(x=>x.Name === 'custom:department').Value : '';
            return user;
          });

        }else {
          this.loading_dialog = false;
          alert(result.message);
          return;
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        alert(error);
        return;
      }

      const userPosition = this.$cookies.get(this.$configJson.cookies.position.key);
      if (userPosition !== 'master'){
        this.members = this.members.filter(data => data.position !== 'master');
      }

      this.members = this.members.sort((a, b) => a.name.localeCompare(b.name));

      this.$emit("members",this.members)
    },
    close() {
      this.$emit("update:dialogValue", false);
      this.$emit("close");
    },
    setMember(item) {
      this.$emit("setMember",item);
    },
    save() {
      this.$emit("save");
    },
    confirm() {
      this.$emit("confirm");
    }
  }
};
</script>

