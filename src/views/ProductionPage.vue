<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productionMenu="true"></NavComponent>

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
                    :headers="search_production_headers"
                    :items="search_production_data"
                    item-key="estimate_code"
                    @clickTr="productionDetail"
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
            v-if="show_detail"
          >
            <v-row slot="cardTitle">
              <v-chip
                v-if="!edit_data"
                class="font-weight-bold mr-4"
                color="primary"
              >
                생산 완료
              </v-chip>
              <v-btn
                v-if="!edit_data"
                color="grey lighten-2"
                fab
                x-small
                elevation="0"
                @click="edit_data = true"
              >
                <v-icon
                  small
                >mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                v-if="edit_data"
                color="grey lighten-2"
                class="mr-2"
                small
                elevation="0"
                @click="edit_data = false"
              >
                진행사항 저장
              </v-btn>
              <v-btn
                v-if="edit_data"
                color="primary"
                small
                elevation="0"
                @click="edit_data = false"
              >
                승인 요청
              </v-btn>
            </v-row>
            <div slot="cardText"
              v-if="!edit_data"
            >
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
            <div slot="cardText"
              v-else
            >
              <v-checkbox
                hide-details
                class="my-2"
                label="생산 완료"
              ></v-checkbox>

              <InputsFormComponent
                dense
                clearable
                filled
                hide-details
                :inputs="editDataInputs"
              />
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
import ProductionPageConfig from "@/configure/ProductionPageConfig.json";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=ProductionPage')],
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
      // this.search_production_data = ProductionPageConfig.test_estimate_data
    },
    searchButton(){
      this.loading_dialog = true;
      this.search_production_data = ProductionPageConfig.test_production_data;
      this.loading_dialog = false;
    },
    productionDetail(){
      this.show_detail = true;
    }
  },
  data(){
    return{
      edit_data : false,
      show_detail: false,
      searchCardInputs: ProductionPageConfig.searchCardInputs,
      editDataInputs: ProductionPageConfig.editDataInputs,
      search_production_headers: ProductionPageConfig.search_production_headers,
      search_production_data: []
    }
  }
}
</script>
