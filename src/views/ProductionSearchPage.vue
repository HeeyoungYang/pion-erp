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
    async setApprovalPhase(item, change, reason){
      const currDate = new Date();
      let phase;
      let send_data = {};
      let send_data_belong = {};
      send_data.code = item.code;
      // 현 승인 상태에 따른 필요 정보 정리
      if(item.approval_phase === '미확인'){
        if(change === true){
          send_data.checked_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
          send_data.approval_phase = '미승인';
          phase = '확인';
        }else{
          if(reason === ''){
            mux.Util.showAlert('반려 사유 필수 기입');
            return;
          }else{
            send_data.reject_reason = reason;
            send_data.rejecter = this.login_info.name;
            send_data.rejected_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
            send_data.approval_phase = '반려';
            phase = '확인 반려';
          }
        }
      }else if(item.approval_phase === '미승인'){
        if(change === true){
          send_data.approved_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
          send_data.approval_phase = '승인';
          send_data_belong = item.belong_data
          console.log(send_data_belong);
          phase = '승인';
        }else{
          if(reason === ''){
            mux.Util.showAlert('반려 사유 필수 기입');
            return;
          }else{
            send_data.reject_reason = reason;
            send_data.rejecter = this.login_info.name;
            send_data.rejected_date = mux.Date.format(currDate, 'yyyy-MM-dd HH:mm:ss');
            send_data.approval_phase = '반려';
            phase = '승인 반려';
          }
        }
      }

      console.log(phase + ' : ' + JSON.stringify(send_data));
      let sendData = {
        "production_confirmation_table-update": [{
          "user_info": {
            "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
            "role": "modifier"
          },
          "data":send_data,
          "update_where": {"code": item.code},
          "rollback": "yes"
        }]
      };

      mux.Util.showLoading();

      const prevURL = window.location.href;
      try {
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: sendData
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0){
          item.approval_phase = send_data.approval_phase;
          switch (item.approval_phase) {
            case '미승인':
              item.checked_date = send_data.checked_date;
              break;
            case '반려':
              item.reject_reason = send_data.reject_reason;
              item.rejecter = send_data.rejecter;
              item.rejected_date = send_data.rejected_date;
              break;
            case '승인':
              item.approved_date = send_data.approved_date;
              break;

            default:
              break;
          }
          this.loading_dialog = false;
          mux.Util.showAlert('생산 ' + phase + ' 완료', '완료', 3000);

          //메일 알림 관련
          let mailTo = [];
          let reject_info;
          if(phase === '확인'){
            mailTo.push(item.creater);
            mailTo.push(item.approver_id);
          }else if(phase === '승인'){
            mailTo.push(item.creater);
            if(item.creater !== item.checker_id){
              mailTo.push(item.checker_id);
            }
          }else if(phase === '확인 반려'){
            mailTo.push(item.creater);
            reject_info=`
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려자</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${send_data.rejecter}</td>
              </tr>
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려일</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${send_data.rejected_date}</td>
              </tr>
            `
          }else if(phase === '승인 반려'){
            mailTo.push(item.creater);
            mailTo.push(item.checker_id);
            reject_info=`
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려자</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${send_data.rejecter}</td>
              </tr>
              <tr>
                <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">반려일</td>
                <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${send_data.rejected_date}</td>
              </tr>
            `
          }

          // 메일 본문 내용
          let content=`
          <html>
            <body>
              <div style="width: 600px; border:1px solid #aaaaaa; padding:30px 40px">
                <h2 style="text-align: center; color:#13428a">생산 ${phase} 처리 알림</h2>
                <table style="width: 100%;border-spacing: 10px 10px;">
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">프로젝트 코드</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.project_code}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">사내 입찰번호</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.inhouse_bid_number}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">기업별 입찰번호</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.company_bid_number}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">업체</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.company_name}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">신청자</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.given_name}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">확인자</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.checker}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold; font-size:18px; padding:10px; text-align:center; background:#cae3eccc">승인자</td>
                    <td style="font-size:18px; padding-left:20px; border:1px solid #b8b8b8cc">${item.approver}</td>
                  </tr>
                  ${reject_info ? reject_info : ''}
                </table>
                <a style="color: white; text-decoration:none"href="${prevURL}?project_code=${item.project_code}&inhouse_bid_number=${item.inhouse_bid_number}&company_bid_number=${item.company_bid_number}&company_name=${item.company_name}">
                  <p style="cursor:pointer; background: #13428a;color: white;font-weight: bold;padding: 13px;border-radius: 40px;font-size: 16px;text-align: center;margin-top: 25px; margin-bottom: 40px;">
                    확인하기
                  </p>
                </a>
              </div>
            </body>
          </html>
          `;


          try {
            let sendEmailAlam = await mux.Server.post({
              path: '/api/send_email/',
              to_addrs: mailTo,
              subject: "생산 " + phase + " 처리 알림",
              content: content
            });
            if (prevURL !== window.location.href) return;
            if(sendEmailAlam['code'] == 0){
              console.log(sendEmailAlam['message']);
            } else {
              if (prevURL !== window.location.href) return;
              mux.Util.showAlert(sendEmailAlam['failed_info']);
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
              mux.Util.showAlert(error.response['data']['failed_info'].msg);
            else
              mux.Util.showAlert(error);
          }
        } else {
          if (prevURL !== window.location.href) return;
          mux.Util.showAlert(result['failed_info']);
        }
      } catch (error) {
        if (prevURL !== window.location.href) return;
        this.loading_dialog = false;
        if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
          mux.Util.showAlert(error.response['data']['failed_info'].msg);
        else
          mux.Util.showAlert(error);
      }
      mux.Util.hideLoading();
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
