<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent ></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row justify="center">
        <v-col cols="12" sm="12">
            <!--iframe id="experience-container" :src="iframeSrc" width="100%" height="700"> </iframe-->
            <!--iframe src="http://www.naver.com" width="100%" height="700"> </iframe-->
            <iframe
                width="100%" height="700"
                src="https://ap-northeast-2.quicksight.aws.amazon.com/sn/embed/share/accounts/475675695041/dashboards/b8c36ecf-ab64-433f-95e9-f1b72bbb0bdc?directory_alias=quicksight-sung-hee">
            </iframe>
            <div id="experience-container"></div>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios';
//import AWS from 'aws-sdk';
//import { QuickSightClient, GenerateEmbedUrlForAnonymousUserCommand } from "@aws-sdk/client-quicksight";

import NavComponent from "@/components/NavComponent";
import CheckPagePermission from "@/common_js/CheckPagePermission";
// import mux from "@/mux";
import { createEmbeddingContext } from 'amazon-quicksight-embedding-sdk';

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=DashboardPage')],
  async mounted() {
      this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
      //this.loadingDashboard();
  },
  components: {
                NavComponent,
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
      // this.search_estimate_data = EstimatePageConfig.test_estimate_data

    },
    errorCallback(error) {
        // 오류 처리 로직
        console.error('An error occurred:', error.message);
        // 필요한 경우 추가적인 오류 처리
    },
    generateEmbedUrlForAnonymousUserCallback(result) {
        // 성공적으로 생성된 임베드 URL 처리 로직
        console.log('Embed URL generated successfully:', JSON.parse(result.body).EmbedUrl);
        // 필요한 경우 추가적인 성공 처리
    },
    async loadingDashboard(){
        try {
          const response = await axios.get('https://i66x939r37.execute-api.ap-northeast-2.amazonaws.com/test/anonymous-embed-sample?mode=getUrl');
          const embeddingDashboardUrl = response.data.EmbedUrl;
          this.iframeSrc = embeddingDashboardUrl;

          const embeddingContext = await createEmbeddingContext();

          const containerDiv = document.getElementById("experience-container");

          const frameOptions = {
              url: embeddingDashboardUrl,
              container: containerDiv,
              height: "700",
              width: "100%",
              onChange: (changeEvent, metadata) => {
                  console.log('Context received a change', changeEvent, metadata);
                  switch (changeEvent.eventName) {
                      case 'FRAME_MOUNTED': {
                          console.log("Do something when the experience frame is mounted.");
                          break;
                      }
                      case 'FRAME_LOADED': {
                          console.log("Do something when the experience frame is loaded.");
                          break;
                      }
                  }
              },
          };
          const contentOptions = {
              sheetOptions: {
                  singleSheet: true,
              },
              attributionOptions: {
                  overlayContent: false,
              },
          };
          // Embedding a dashboard experience
          await embeddingContext.embedDashboard(frameOptions, contentOptions);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    },
  },
  data(){
    return{
      embeddedDashboardUrl: "",
      iframeSrc: "",
    }
  },
}
</script>
