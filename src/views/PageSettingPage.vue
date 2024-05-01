<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :userMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row justify="center">
        <v-col cols="12" sm="6">
          <LoadingModalComponent :dialog-value="loading_dialog" hide-overlay></LoadingModalComponent>
          <v-card elevation="1">
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
                    >
                  </v-text-field>
                  </p>
                  <ModalDialogComponent
                        :dialog-value="laborDialog"
                        max-width="500px"
                        :title="formLaborTitle"
                        closeText="취소"
                        saveText="저장"
                        :persistent="true"
                        @close="close"
                        @save="uploadLaborItem"
                      >
                        <template v-slot:activator>
                          <v-btn color="primary" outlined class="mb-2 float-right" @click="addPageResource">추가</v-btn>
                        </template>
                        <v-container>
                            <!-- slot="cardText" -->
                          <v-form ref="laborForm">
                            <InputsFormComponent
                              clearable
                              :inputs="registLaborInputs"
                            ></InputsFormComponent>
                          </v-form>
                        </v-container>
                      </ModalDialogComponent>
                </v-col>
              </v-row>
            </v-card-title>
            <!-- <v-data-table
              :headers="headers"
              :items="members"
              :search="search"
            >
            </v-data-table> -->
            <DataTableComponent
              :headers="headers"
              :items="page_resources"
              :search="search"
            >
            </DataTableComponent>

          </v-card>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>

<script>
import mux from "@/mux";
import NavComponent from "@/components/NavComponent";
import DataTableComponent from "@/components/DataTableComponent";
import PageSettingPageConfig from "@/configure/PageSettingPageConfig.json";
import ModalDialogComponent from "@/components/ModalDialogComponent";
import CheckPagePermission from "@/common_js/CheckPagePermission";
import LoadingModalComponent from "@/components/LoadingModalComponent.vue";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=PageSettingPageConfig')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  created () {
    this.initialize()
  },
  methods: {
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    async initialize () {
      this.loading_dialog = true;
      this.headers = PageSettingPageConfig.table_header;
      console.log("PageSettingPageConfig.table_header=", PageSettingPageConfig.table_header);

      let page_resourceList = [];
      const prevURL = window.location.href;
      try {
        let result = await mux.Server.get({path:'/api/admin/page_resources/'});
        if (prevURL !== window.location.href) return;
        if (result.code == 0){
          page_resourceList = result.data.map(data => {
            let page_resource = {};
            page_resource.page_name = data.page_name;
            page_resource.page_alias = data.page_alias
            page_resource.page_url = data.page_url;
            return page_resource;
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
      this.page_resources = page_resourceList.sort((a, b) => b.name.localeCompare(a.name));
      this.loading_dialog = false;
    },
    async addPageResource() {
      // ModalDialogComponent 컴포넌트에, page_name, page_alias, page_url 정보를 추가할 수 있는 다이얼로그 박스 구성 필요
      const prevURL = window.location.href;
      try {

        let page_name = "";
        let page_alias = "";
        let page_url = "";
        let result = await mux.Server.post({
          path:'/api/admin/page_resource/',
          page_name:page_name,
          page_alias:page_alias,
          page_url:page_url
        });
        if (prevURL !== window.location.href) return;
        if (result.code == 0) {
          this.initialize ();
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
    },
  },

  components: {
    NavComponent,
    DataTableComponent,
    LoadingModalComponent,
    ModalDialogComponent,
  },
  data() {
    return {
      loading_dialog: false,
      search: '',
      headers: PageSettingPageConfig.headers,
      page_resources: [],//PageSettingPageConfig.test_members
      groups: [], // 사용하지 않음
    }
  },
}
</script>

<style lang="">

</style>
