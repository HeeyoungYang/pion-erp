<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productMenu="true" :inboundMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
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
                    :headers="inbound_approve_headers"
                    :items="inbound_approve_data"
                    item-key="product_code"
                    approval="inbound"
                    dense
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
      :dialog-value="inbound_product_list_dialog"
      max-width="70%"
      title-class=" "
      :dialog-transition="'slide-x-transition'"
      :dialog-custom="'custom-dialog elevation-0 white'"
      :card-elevation="'0'"
      @close="closeProductList"
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <table style="width:100%">
              <tr>
                <td class="approve_title" style="width:10%">프로젝트 코드</td>
                <td class="approve_text" style="width:15%">{{ inbound_info_data.project_code }}</td>
                <td class="approve_title" style="width:10%">품질검사결과</td>
                <td class="approve_text" style="width:25%">
                  <p class="mb-0 font-weight-bold">{{ inbound_info_data.abnormal_reason == '' ? '이상 없음' : '이상 있음' }}</p>
                  <p class="mb-0 error--text" v-if="inbound_info_data.abnormal_reason != ''"> : {{ inbound_info_data.abnormal_reason }}</p>
                </td>
                <td class="approve_title" style="width:10%">비고</td>
                <td class="approve_text" style="width:30%">
                  {{  inbound_info_data.note }}
                </td>
              </tr>
            </table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <DataTableComponent
              :headers="inbound_product_list_headers"
              :items="inbound_product_list_data"
              item-key="product_code"
              dense
              show-photo
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4" v-if="inbound_info_data.receiving_inspection">
            <p class="font-weight-bold primary--text mb-0">▼ 수입검사서</p>
            <iframe width="100%" style="height:450px" :src="'https://mkorbucket-public.s3.ap-northeast-2.amazonaws.com/'+inbound_info_data.receiving_inspection"></iframe>
          </v-col>
          <v-col cols="12" sm="4" v-if="inbound_info_data.inspection_report">
            <p class="font-weight-bold primary--text mb-0">▼ 시험성적서</p>
            <iframe width="100%" style="height:450px" :src="'https://mkorbucket-public.s3.ap-northeast-2.amazonaws.com/'+inbound_info_data.inspection_report"></iframe>
          </v-col>
          <v-col cols="12" sm="4" v-if="inbound_info_data.files">
            <p class="font-weight-bold primary--text mb-0">▼ 기타 첨부</p>
            <v-chip
             color="grey lighten-2"
             class="ma-2"
              v-for="(file, i) in inbound_info_data.files"
              :key="i"
              :src="'https://mkorbucket-public.s3.ap-northeast-2.amazonaws.com/'+file"
            >
              {{ file }}
            </v-chip>
          </v-col>
        </v-row>
      </v-container>
    </ModalDialogComponent>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import DataTableComponent from "@/components/DataTableComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import InboundSearchPageConfig from "@/configure/InboundSearchPageConfig.json";
import CheckPagePermission from "@/common_js/CheckPagePermission";
import mux from "@/mux";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=InboundSearchPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
  },
  components: {
                NavComponent,
                DataTableComponent,
                ModalDialogComponent,
                CardComponent,
                InputsFormComponent,
              },
  data(){
    return{
      today:'',
      dates: [],
      inbound_product_list_dialog: false,

      inbound_info_data:{},
      inbound_product_list_data:[],

      change_approve:{},

      searchCardInputs:InboundSearchPageConfig.searchCardInputs,
      inbound_approve_headers:InboundSearchPageConfig.inbound_approve_headers,
      inbound_product_list_headers:InboundSearchPageConfig.inbound_product_list_headers,
      inbound_approve_data:[],
    }
  },

  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  },
  watch:{
    inbound_product_list_dialog(val){
      val || this.closeProductList()
    },
  },
  created () {
    this.initialize()
  },
  methods:{
    async initialize () {
      this.today = new Date();
      const prevURL = window.location.href;
      try {
        console.log('사용자 계정 정보 가졍오기');
        let result = await mux.Server.get({
          path: '/api/user/',
        });
        if (prevURL !== window.location.href) return;
        console.log('result :>> ', result);
        // this.login_info.name = (result.data.UserAttributes.find(attr => attr.Name === 'given_name').Value).trim();
        // this.login_info.email = result.data.UserAttributes.find(attr => attr.Name === 'email').Value;
        this.login_info.name = this.$cookies.get(this.$configJson.cookies.name.key).trim();
        this.login_info.email = this.$cookies.get(this.$configJson.cookies.email.key);
      } catch (error) {
        if (prevURL !== window.location.href) return;
        alert(error);
      }
    },
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    searchButton(){
      this.inbound_approve_data = InboundSearchPageConfig.test_inbound_approve_data
    },
    closeProductList(){
      this.inbound_product_list_dialog = false;
    },
    clickApproveData(item){
      let belong_datas = item.belong_data
      this.inbound_product_list_data = [];
      this.inbound_info_data = {};
      belong_datas.forEach(data =>{
        data.inbound_price = data.unit_price * data.inbound_num;
        this.inbound_product_list_data.push(data);
      })
      let file_name = item.files.split(',');
      if(!file_name[0]){
        file_name = ""
      }
      this.inbound_info_data = {
        project_code:item.project_code,
        spot:item.spot,
        abnormal_reason : item.abnormal_reason,
        receiving_inspection : item.receiving_inspection,
        inspection_report : item.inspection_report,
        note: item.note,
        files: file_name,
      }
      this.inbound_product_list_dialog = true;
    },
    setApprovalPhase(item, change, reason){
      this.change_approve={};
      if(item.approval_phase === '미확인'){
        if(change === true){
          this.change_approve.code = item.code;
          this.change_approve.checked_date = mux.Date.format(this.today, 'yyyy-MM-dd');
          this.change_approve.approval_phase = '미승인';
        }else{
          if(reason === ''){
            alert('반려 사유 필수 기입');
          }else{
            this.change_approve.code = item.code;
            this.change_approve.reject_reason = reason;
            this.change_approve.rejecter = this.login_info.name;
            this.change_approve.rejected_date = mux.Date.format(this.today, 'yyyy-MM-dd');
          this.change_approve.approval_phase = '반려';
          }
        }
      }else if(item.approval_phase === '미승인'){
        if(change === true){
          this.change_approve.code = item.code;
          this.change_approve.approved_date = mux.Date.format(this.today, 'yyyy-MM-dd');
          this.change_approve.approval_phase = '승인';
        }else{
          if(reason === ''){
            alert('반려 사유 필수 기입');
          }else{
            this.change_approve.code = item.code;
            this.change_approve.reject_reason = reason;
            this.change_approve.rejecter = this.login_info.name;
            this.change_approve.rejected_date = mux.Date.format(this.today, 'yyyy-MM-dd');
          this.change_approve.approval_phase = '반려';
          }
        }
      }
    }
  },
}
</script>
<style lang="">

</style>
