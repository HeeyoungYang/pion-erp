<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productionMenu="true"></NavComponent>

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
              @enter="searchButton"
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
                  <ProductionDataTableComponent
                    :headers="production_data_headers"
                    :items="approval_datas"
                    item-key="code"
                    approval
                    dense
                    :loginId="login_info.id"
                    @clickTr="clickApproveData"
                    @setApprovalPhase="setApprovalPhase"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-main>


    <ModalDialogComponent
      :dialog-value="production_detail_dialog"
      max-width="50%"
      title-class=" "
      :dialog-transition="'slide-x-transition'"
      :dialog-custom="'custom-dialog elevation-0 white'"
      :card-elevation="'0'"
      @close="closeProductList"
    >
      <v-container>
        <v-row class="mb-4">
          <v-col cols="12" sm="12">
            <v-chip
              class="font-weight-bold mr-4"
              :color="production_details.status === '생산 완료' ? 'primary' : 'default'"
            >
              {{ production_details.status === '생산 완료' ? '생산 완료' : '생산 미완료' }}
            </v-chip>
            <v-btn
              small
              color="success"
            >
              입고 승인 요청
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 자체시험</p>
            <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(production_details.self_test_thumbnail)"
              transition="scale-transition"
              width="100%"
              @click="download('production/self_test', production_details.self_test_file, production_details.code+'_')"
              style="cursor: pointer;"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 공장시험</p>
            <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(production_details.factory_test_thumbnail)"
              transition="scale-transition"
              width="100%"
              @click="download('production/self_test', production_details.factory_test_file, production_details.code+'_')"
              style="cursor: pointer;"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 현장시험</p>
            <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(production_details.field_test_thumbnail)"
              transition="scale-transition"
              width="100%"
              @click="download('production/self_test', production_details.field_test_file, production_details.code+'_')"
              style="cursor: pointer;"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 시운전</p>
            <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(production_details.trial_run_thumbnail)"
              transition="scale-transition"
              width="100%"
              @click="download('production/self_test', production_details.trial_run_file, production_details.code+'_')"
              style="cursor: pointer;"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 전자세금계산서</p>
            <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(production_details.tax_invoice_thumbnail)"
              transition="scale-transition"
              width="100%"
              @click="download('production/self_test', production_details.tax_invoice_file, production_details.code+'_')"
              style="cursor: pointer;"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 하자보증증권 </p>
            <v-img
              alt="thumbnail"
              class="shrink mr-2"
              contain
              :src="mux.Util.imageBinary(production_details.defect_warranty_thumbnail)"
              transition="scale-transition"
              width="100%"
              @click="download('production/self_test', production_details.defect_warranty_file, production_details.code+'_')"
              style="cursor: pointer;"
            />
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
import ProductionDataTableComponent from "@/components/ProductionDataTableComponent.vue";
import LoadingModalComponent from "@/components/LoadingModalComponent.vue";
import ModalDialogComponent from "@/components/ModalDialogComponent.vue";
import ProductionSearchPageConfig from "@/configure/ProductionSearchPageConfig.json";
import mux from "@/mux";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=ProductionPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  components: {
                NavComponent,
                CardComponent,
                ProductionDataTableComponent,
                InputsFormComponent,
                LoadingModalComponent,
                ModalDialogComponent
              },

  created () {
    this.initialize()
  },

  watch:{
    production_detail_dialog(val){
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
      this.production_detail_dialog = true;
      this.production_details = ProductionSearchPageConfig.test_production_datas[0];
    },
    closeProductList(){
      this.production_detail_dialog = false;
    },
    searchButton(){
      this.loading_dialog = true;
      this.approval_datas = ProductionSearchPageConfig.test_approval_datas;
      this.loading_dialog = false;
    },
  },
  data(){
    return{
      mux: mux,
      loading_dialog : false,
      production_detail_dialog: false,
      searchCardInputs: ProductionSearchPageConfig.searchCardInputs,
      login_info: ProductionSearchPageConfig.login_info,
      production_data_headers: ProductionSearchPageConfig.production_data_headers,
      approval_datas: [],
      production_details:{},
    }
  }
}
</script>
