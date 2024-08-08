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
                      :dialog-value="dialog"
                      max-width="400px"
                      :title="formTitle"
                      closeText="취소"
                      saveText="저장"
                      :persistent="true"
                      @close="close"
                      @save="uploadPageResource"
                    >
                      <template v-slot:activator>
                        <v-btn color="primary" outlined class="mb-2 float-right" @click="addPageResource">추가</v-btn>
                      </template>
                      <v-container>
                          <!-- slot="cardText" -->
                        <v-form ref="resourceForm">
                          <InputsFormComponent
                            clearable
                            :inputs="registPageSettingInputs"
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
              editable
              deletable
              @edit="editPageResource"
              @delete="deletePageResource"
            >
            </DataTableComponent>
            <ModalDialogComponent
              :dialog-value="dialogDelete"
              max-width="300px"
              title-class="text-body-1 font-weight-black"
              text-class="text-body-2"
              save-text="삭제"
              close-text="취소"
              @save="deletePageResourceConfirm"
              @close="closeDelete"
            >
              <template v-slot:titleHTML>
                <p class="mb-0">{{ editedItem.page_alias }} 페이지를</p>
                <p class="red--text">삭제하시겠습니까?</p>
              </template>
              삭제 시 복구가 불가능합니다.
            </ModalDialogComponent>

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
import InputsFormComponent from "@/components/InputsFormComponent.vue";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=PageSettingPageConfig')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  created () {
    this.initialize()
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '페이지 등록' : '페이지 수정'
    },
    formDisabled () {
      return this.editedIndex === -1 ? false : true
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      // console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    async initialize () {
      mux.Util.showLoading();
      this.headers = PageSettingPageConfig.table_header;
      this.page_resources = [];

      // console.log("PageSettingPageConfig.table_header=", PageSettingPageConfig.table_header);

      let page_resourceList = [];
      const prevURL = window.location.href;
      try {
        let result = await mux.Server.get({path:'/api/admin/page_resources/'});
        if (prevURL !== window.location.href) return;
        if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          if( result.data.length > 0) {
            page_resourceList = result.data.map(data => {
              let page_resource = {};
              page_resource.page_name = data.page_name;
              page_resource.page_alias = data.page_alias
              page_resource.page_url = data.page_url;
              return page_resource;
            });
          }
        }else {
          mux.Util.hideLoading();
          mux.Util.showAlert(result.message);
          return;
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.hideLoading();
        mux.Util.showAlert(error);
        return;
      }
      this.page_resources = page_resourceList.sort(
        (a, b) => b.page_name.localeCompare(a.page_name));
      mux.Util.hideLoading();
    },
    addPageResource(item){
      this.editedLaborIndex = this.page_resources.indexOf(item)
      let resource_input = this.registPageSettingInputs;
      mux.Rules.rulesSet(resource_input);
      resource_input.forEach(data =>{
        if(data.column_name == 'page_name'){
          data.disabled = false
        }
        data.value = '';
      })
      this.dialog = true;
    },
    editPageResource(item){
      this.editedIndex = this.page_resources.indexOf(item)
      let resource_input = this.registPageSettingInputs;
      mux.Rules.rulesSet(resource_input);
      resource_input.forEach(data =>{
        for(let i=0; i<Object.keys(item).length; i++){
          if(data.column_name == Object.keys(item)[i]){
            data.value = Object.values(item)[i];
          }
        }
        if(data.column_name == 'page_name'){
          data.disabled = true
        }
      })
      this.dialog = true
    },
    async uploadPageResource() {
      let resource_input = this.registPageSettingInputs;
      let item = this.editedItem;

      const validate = this.$refs.resourceForm.validate();
      if(validate){
        resource_input.forEach(data =>{
          for(let i=0; i<Object.keys(item).length; i++){
            if(data.column_name == Object.keys(item)[i]){
              item[Object.keys(item)[i]] = data.value;
            }
          }
        })
        const prevURL = window.location.href;
        try {
          let page_name = item.page_name;
          let page_alias = item.page_alias;
          let page_url = item.page_url;
          // console.log("page_name : "+page_name + ", page_alias : " +page_alias+ ", page_url : " +page_url)

          let result;
          if(this.editedIndex === -1){ // Page Resource 추가
            result = await mux.Server.post({
              path:'/api/admin/page_resource/',
              page_name:page_name,
              page_alias:page_alias,
              page_url:page_url
            });
          }else{ // Page Resource 수정
            result = await mux.Server.put({
              path:'/api/admin/page_resource/',
              page_name:page_name,
              page_alias:page_alias,
              page_url:page_url
            });
          }
          if (prevURL !== window.location.href) return;
          if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)) {
            this.close();
            this.initialize ();
          }else {
            mux.Util.hideLoading();
            mux.Util.showAlert(result.message);
            return;
          }
        } catch (error) {
          if (prevURL !== window.location.href) return;
          mux.Util.hideLoading();
          mux.Util.showAlert(error);
          return;
        }
      }
    },
    deletePageResource(item){
      this.editedIndex = this.page_resources.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    async deletePageResourceConfirm(){
      // console.log('페이지 삭제 : ' + JSON.stringify(this.editedItem.page_name));
      this.page_resources.splice(this.editedIndex, 1)

      const prevURL = window.location.href;
      try {

        let page_name = this.editedItem.page_name;
        // console.log("page_name : "+page_name)

        let result = await mux.Server.delete(`/api/admin/page_resource/?page_name=${page_name}`);
        if (prevURL !== window.location.href) return;
        if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)) {
          this.initialize ();
        }else {
          mux.Util.hideLoading();
          mux.Util.showAlert(result.message);
          return;
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.hideLoading();
        mux.Util.showAlert(error);
        return;
      }

      this.closeDelete()
    },
    close () {
      mux.Util.hideLoading();
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  },

  components: {
    NavComponent,
    DataTableComponent,
    LoadingModalComponent,
    ModalDialogComponent,
    InputsFormComponent,
  },


  data() {
    return {
      loading_dialog: false,
      dialog: false,
      dialogDelete: false,
      search: '',
      headers: PageSettingPageConfig.headers,
      registPageSettingInputs: PageSettingPageConfig.registPageSettingInputs,
      page_resources: [],//PageSettingPageConfig.test_members
      groups: [], // 사용하지 않음

      editedIndex: -1,
      editedItem: PageSettingPageConfig.editedItem,
      defaultItem: PageSettingPageConfig.defaultItem,
    }
  },
}
</script>

<style lang="">

</style>
