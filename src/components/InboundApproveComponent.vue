
<template >
  <v-container>
    <div ref="inboundApproveForm">
      <p class="print_doc_title">입고 확인서</p>
      <v-row style="margin-top:15px">
        <v-col cols="6" style="padding-bottom: 0px;">
          <v-img
            alt="Pionelectric Logo"
            class="shrink mr-2"
            contain
            src="../assets/img/pion_logo.png"
            transition="scale-transition"
            style="margin-top:10px; width: 150px;"
          />
        </v-col>
        <v-col cols="6" style="padding-bottom: 0px;">
          <table style="border-spacing: 0;width: 100%; text-align: center;">
              <tr>
              <td rowspan="3" class="approve_list_title">결재</td>
              <td class="approve_list_title approve_list_title_border">작성</td>
              <td class="approve_list_title approve_list_title_border">확인</td>
              <td class="approve_list_title approve_list_title_border">승인</td>
            </tr>
            <tr>
              <td class="approve_list_name">{{  inboundData.given_name }}</td>
              <td class="approve_list_name">{{  inboundData.checker }}</td>
              <td class="approve_list_name">{{  inboundData.approver }}</td>
            </tr>
            <tr>
              <td class="approve_list_date">{{  inboundData.created_time }}</td>
              <td class="approve_list_date">{{  inboundData.checked_date }}</td>
              <td class="approve_list_date">{{  inboundData.approved_date }}</td>
            </tr>
          </table>
          <p style="text-align: center; font-size:11px; margin-top:5px; margin-bottom: 0px;">아래와 같이 입고를 요청합니다. 검토 후 결제를 바랍니다.</p>
        </v-col>
        <v-col cols="12" style="padding-top:0px">
          <p class="doc_list_title">개요</p>
          <table class="doc_table">
            <tr>
              <td class="approve_title">작성일</td>
              <td class="approve_text">{{ inboundData.created_time}}</td>
              <td class="approve_title">구매담당자</td>
              <td class="approve_text">{{inboundData.purchase_manager}}</td>
            </tr>
            <tr>
              <td class="approve_title">입고일자</td>
              <td class="approve_text">{{ inboundData.inbound_date}}</td>
              <td class="approve_title">자재담당자</td>
              <td class="approve_text">{{inboundData.material_manager}}</td>
            </tr>
            <tr>
              <td class="approve_title">업체명</td>
              <td class="approve_text">(주)파이온 일렉트릭</td>
              <td class="approve_title">프로젝트 코드</td>
              <td class="approve_text">{{inboundData.project_code}}</td>
            </tr>
          </table>
          <p class="doc_list_title" style="margin-top:20px">내용</p>
          <table class="doc_detail_table">
            <thead>
                <tr>
                  <th class="approve_title">품명</th>
                  <th class="approve_title">규격(사양)</th>
                  <th class="approve_title">수량</th>
                  <th class="approve_title">제조사</th>
                </tr>
              </thead>
              <tbody>
                <tr
                class="approve_text"
                  v-for="(dta, i) in belongData"
                  :key="i"
                >
                  <td class="approve_text">{{ dta.name }}</td>
                  <td class="approve_text">{{ dta.spec }}</td>
                  <td class="approve_text">{{ dta.inbound_num }}</td>
                  <td class="approve_text">{{ dta.manufacturer }}</td>
                </tr>
              </tbody>
          </table>
          <table class="doc_table">
            <tr>
              <td class="approve_title">품질검사결과</td>
              <td class="approve_text">
                <p style="margin-bottom:0px; font-weight:bold">{{ inboundData.abnormal_reason == '' ? '이상 없음' : '이상 있음' }}</p>
                <p style="margin-bottom:0px; color:red" v-if="inboundData.abnormal_reason != ''"> : {{ inboundData.abnormal_reason }}</p>
              </td>
            </tr>
            <tr>
              <td class="approve_title">수입검사서</td>
              <td class="approve_text">
                {{ inboundData.receiving_inspection ? '■ 유   □무' : '□ 유   ■무' }}
              </td>
            </tr>
            <tr>
              <td class="approve_title">시험성적서</td>
              <td class="approve_text">
                {{ inboundData.inspection_report ? '■ 유   □무' : '□ 유   ■무' }}
              </td>
            </tr>
            <tr>
              <td class="approve_title">비고</td>
              <td class="approve_text">{{ inboundData.note }}</td>
            </tr>
          </table>
          <p class="doc_list_title" style="margin-top:28px">붙임</p>
          <div style="border:1px solid #ccc; padding:16px 20px; font-size: 12px;">
                <p class="mb-0" v-for="(file, i) in belongFiles" :key="i">{{ i+1 }}. {{ file }}</p>
          </div>
        </v-col>
      </v-row>
    </div>

    <div style="position: sticky; bottom: 60px;">
      <p style="text-align: right;">
        <v-menu offset-x>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              fab
              x-small
              elevation="1"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon small>mdi-content-save</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              dense
              @click="printInboundApprove('입고확인서')"
            >
              <v-list-item-title>PDF</v-list-item-title>
            </v-list-item>
            <v-list-item
              dense
              @click="printInboundApprove()"
            >
              <v-list-item-title>출력</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </p>
      <p style="text-align: right;">
        <v-btn
          fab
          color="blue-grey darken-1"
          x-small
          class="white--text"
          elevation="1"
          @click="confirmationDialog=false"
        >
          <v-icon> mdi-close-thick </v-icon>
        </v-btn>
      </p>
    </div>
  </v-container>

</template>

<script>
/**
 * @file InboundApproveComponent.vue
 * @description 입고확인서 컴포넌트
 *
 * @typedef {Object} props
 * @property {Array} inboundData - 데이터 배열
 * @property {Array} belongData - 데이터 배열
 * @property {Array} belongFiles - 데이터 배열
**/
import mux from "@/mux";
export default {
  props: {
    inboundData: Array,
    belongData: Array,
    belongFiles: Array,
  },
  methods: {
    printInboundApprove(fileName){
      setTimeout(async () => {
        if (fileName){
          mux.Util.downloadPDF(this.$refs.inboundApproveForm, fileName);
        }else {
          mux.Util.print(this.$refs.inboundApproveForm);
        }
      }, 500);
    },
  },
  components: {
  },
  data(){
    return{
      mux: mux,
      content_save_items: [
        {title:'출력', click:'print'},
        {title:'PDF', click:'pdf'},
      ],
      // approve_data : this.inboundData,
      // approve_headers: []
    }
  },
}
</script>
<style>

</style>
