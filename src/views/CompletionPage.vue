<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :completionMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row class=" mt-5">
        <v-col cols="12" sm="5">
          <CardComponent
            elevation="1"
            text-class=" pt-3"
            title-class="d-none"
          >
            <div slot="cardText">
              <InputsFormComponent
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
                  lg="3"
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
              <v-row>
                <v-col
                  cols="12"
                >
                  <DataTableComponent
                    dense
                    :headers="search_estimate_headers"
                    :items="search_estimate_data"
                    item-key="estimate_code"
                  />
                </v-col>
              </v-row>
            </div>
          </CardComponent>
        </v-col>
        <v-col cols="12" sm="7">
          <CardComponent
            elevation="1"
            text-class=" pt-3"
          >
          <v-ro slot="cardTitle">
            <v-chip class="font-weight-bold mr-4" color="primary">
              준공 완료
            </v-chip>
            <v-btn
              color="grey lighten-2"
              fab
              x-small
              elevation="0"
              data-html2canvas-ignore="true"
            >
              <v-icon
                small
              >mdi-pencil</v-icon>
            </v-btn>
          </v-ro>
          <div slot="cardText">
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
          </div>
          </CardComponent>

        </v-col>
      </v-row>
    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import CheckPagePermission from "@/common_js/CheckPagePermission";
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import DataTableComponent from "@/components/DataTableComponent.vue";
import CompletionPageConfig from "@/configure/CompletionPageConfig.json";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=CompletionPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  components: {
                NavComponent,
                CardComponent,
                DataTableComponent,
                InputsFormComponent
              },

  created () {
    this.initialize()
  },

  methods:{
    // eslint-disable-next-line no-unused-vars
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      // console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    initialize(){
      // this.search_estimate_data = CompletionPageConfig.test_estimate_data
    },
  },
  data(){
    return{

      searchCardInputs: CompletionPageConfig.searchCardInputs,
      search_estimate_headers: CompletionPageConfig.search_estimate_headers,
    }
  }
}
</script>
