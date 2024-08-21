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
        <p style="width: 100%; text-align: right;">
          <v-icon  @click="close">mdi-close-circle</v-icon>
        </p>
        <InputsFormComponent
          dense
          clearable
          hide-details
          :inputs="searchCardInputs"
          @enter="searchButton"
        >
          <v-col
            cols="12"
            sm="4"
            lg="3"
            align-self="center"
          >
            <v-btn
              small
              color="primary"
              elevation="2"
              @click="searchButton"
            >
              <v-icon>mdi-magnify</v-icon>검색
            </v-btn>
          </v-col>
        </InputsFormComponent>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="members"
          :search="search"
          dense
        >
          <template v-slot:[`item.set`]="{ item }">
            <v-btn x-small color="primary" @click="setEstimate(item)">적용</v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import EstimateSearchDialogConfig from "@/configure/EstimateSearchDialogConfig.json";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
// import mux from "@/mux";
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
    InputsFormComponent
    // DataTableComponent,
  },
  data() {
    return {
      search: '',
      members:[],
      searchCardInputs: EstimateSearchDialogConfig.searchCardInputs,
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
      this.headers = EstimateSearchDialogConfig.table_header;
      this.members = EstimateSearchDialogConfig.test_members
      // let memberList = [];

    },
    close() {
      this.$emit("update:dialogValue", false);
      this.$emit("close");
    },
    setEstimate(item) {
      this.$emit("setEstimate",item);
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

