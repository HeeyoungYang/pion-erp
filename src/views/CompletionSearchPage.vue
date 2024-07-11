<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :completionMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <LoadingModalComponent :dialog-value="loading_dialog" hide-overlay></LoadingModalComponent>
      <v-row justify="center">
        <v-col
          cols="12"
          sm="11"
        >
          <CardComponent
            elevation="1"
            text-class=" pt-3"
            title-class="d-none"
          >
            <InputsFormComponent
              slot="cardText"
              dense
              clearable
              filled
              hide-details
              :inputs="searchCardInputs"
            >
              <v-col
                cols="12"
                sm="4"
                lg="2"
                align-self="center"
              >
                <v-btn
                  color="primary"
                  elevation="2"
                  @click="searchButton"
                >
                  <v-icon>mdi-magnify</v-icon>검색
                </v-btn>
              </v-col>
            </InputsFormComponent>
          </CardComponent>

          <v-row>
            <v-col
              cols="12"
              sm="12"
            >
              <v-card
              elevation="1"
              class="mt-5"
              >
                <v-card-text class=" pt-3">
                  <DataTableComponent
                    :headers="completion_data_headers"
                    :items="completion_datas"
                    item-key="product_code"
                    approval="inbound"
                    dense
                    :loginId="login_info.id"
                    @clickTr="clickApproveData"
                    @setApprovalPhase="setApprovalPhase"
                    @cancleApprove="cancleApprove"
                    @setCanclePhase="setCanclePhase"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-main>


    <ModalDialogComponent
      :dialog-value="completion_detail_dialog"
      max-width="50%"
      title-class=" "
      :dialog-transition="'slide-x-transition'"
      :dialog-custom="'custom-dialog elevation-0 white'"
      :card-elevation="'0'"
      @close="closeProductList"
    >
      <v-container>
        <v-chip
          class="font-weight-bold mb-4"
          color="primary"
        >
          생산 완료
        </v-chip>
        <v-row>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 자체시험</p>
            <div style="width:100%; background-color: #ccc; min-height:300px"></div>
            <!-- <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(receivingInspectionThumbnail)"
              transition="scale-transition"
              width="350"
              @click="download('inbound/receiving_inspection', inbound_info_data.receiving_inspection_file, inbound_info_data.code+'_')"
              style="cursor: pointer;"
            /> -->
          </v-col>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 공장시험</p>
            <div style="width:100%; background-color: #ccc; min-height:300px"></div>
            <!-- <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(receivingInspectionThumbnail)"
              transition="scale-transition"
              width="350"
              @click="download('inbound/receiving_inspection', inbound_info_data.receiving_inspection_file, inbound_info_data.code+'_')"
              style="cursor: pointer;"
            /> -->
          </v-col>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 현장시험</p>
            <div style="width:100%; background-color: #ccc; min-height:300px"></div>
            <!-- <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(receivingInspectionThumbnail)"
              transition="scale-transition"
              width="350"
              @click="download('inbound/receiving_inspection', inbound_info_data.receiving_inspection_file, inbound_info_data.code+'_')"
              style="cursor: pointer;"
            /> -->
          </v-col>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 시운전</p>
            <div style="width:100%; background-color: #ccc; min-height:300px"></div>
            <!-- <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(receivingInspectionThumbnail)"
              transition="scale-transition"
              width="350"
              @click="download('inbound/receiving_inspection', inbound_info_data.receiving_inspection_file, inbound_info_data.code+'_')"
              style="cursor: pointer;"
            /> -->
          </v-col>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 전자세금계산서</p>
            <div style="width:100%; background-color: #ccc; min-height:300px"></div>
            <!-- <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(receivingInspectionThumbnail)"
              transition="scale-transition"
              width="350"
              @click="download('inbound/receiving_inspection', inbound_info_data.receiving_inspection_file, inbound_info_data.code+'_')"
              style="cursor: pointer;"
            /> -->
          </v-col>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 하자보증증권 </p>
            <div style="width:100%; background-color: #ccc; min-height:300px"></div>
            <!-- <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(receivingInspectionThumbnail)"
              transition="scale-transition"
              width="350"
              @click="download('inbound/receiving_inspection', inbound_info_data.receiving_inspection_file, inbound_info_data.code+'_')"
              style="cursor: pointer;"
            /> -->
          </v-col>

        </v-row>
      </v-container>
    </ModalDialogComponent>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import CheckPagePermission from "@/common_js/CheckPagePermission";
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import DataTableComponent from "@/components/DataTableComponent.vue";
import LoadingModalComponent from "@/components/LoadingModalComponent.vue";
import ModalDialogComponent from "@/components/ModalDialogComponent.vue";
import CompletionSearchPageConfig from "@/configure/CompletionSearchPageConfig.json";
import mux from "@/mux";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=CompletionPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  components: {
                NavComponent,
                CardComponent,
                DataTableComponent,
                InputsFormComponent,
                LoadingModalComponent,
                ModalDialogComponent
              },

  created () {
    this.initialize()
  },

  watch:{
    completion_detail_dialog(val){
      val || this.closeProductList()
    },
  },
  methods:{
    // eslint-disable-next-line no-unused-vars
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      // console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    async initialize () {
      const prevURL = window.location.href;
      try {
        if (prevURL !== window.location.href) return;
        this.login_info.name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.login_info.email = this.$cookies.get(this.$configJson.cookies.email.key);
        this.login_info.id = this.$cookies.get(this.$configJson.cookies.id.key);
        this.login_info.position = this.$cookies.get(this.$configJson.cookies.position.key);
        this.login_info.department = this.$cookies.get(this.$configJson.cookies.department.key);
        this.login_info.office_phone_number = this.$cookies.get(this.$configJson.cookies.office_phone_number.key);
        this.login_info.phone_number = this.$cookies.get(this.$configJson.cookies.phone_number.key);
        console.log(this.login_info)
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.showAlert(error);
      }
      this.searchCardInputs = JSON.parse(JSON.stringify(this.searchCardInputs));
    },
    clickApproveData(){
      this.completion_detail_dialog = true;
    },
    closeProductList(){
      this.completion_detail_dialog = false;
    },
  },
  data(){
    return{
      loading_dialog : false,
      completion_detail_dialog: false,
      searchCardInputs: CompletionSearchPageConfig.searchCardInputs,
      login_info: CompletionSearchPageConfig.login_info,
      completion_data_headers: CompletionSearchPageConfig.completion_data_headers,
      completion_datas: CompletionSearchPageConfig.test_completion_datas,
    }
  }
}
</script>
