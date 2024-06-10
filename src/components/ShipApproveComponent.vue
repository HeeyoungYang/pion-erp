
<template >
  <v-container>
    <div style="position:relative">
      <p class="print_doc_title" style="border-bottom:1px solid #ccc">출고 요청서</p>
      <v-row style="margin-top:15px">
        <v-col cols="6">
          <v-img
            alt="Pionelectric Logo"
            class="shrink mr-2"
            contain
            src="../assets/img/pion_logo.png"
            transition="scale-transition"
            style="margin-top:10px; width: 150px;"
          />
        </v-col>
        <v-col cols="6">
          <table style="border-spacing: 0;width: 100%; text-align: center;">
              <tr>
              <td rowspan="3" class="approve_list_title">결재</td>
              <td class="approve_list_title approve_list_title_border">작성</td>
              <td class="approve_list_title approve_list_title_border">확인</td>
              <td class="approve_list_title approve_list_title_border">승인</td>
            </tr>
            <tr>
              <td class="approve_list_name">{{  shipData.given_name }}</td>
              <td  class="approve_list_name">{{  shipData.checker }}</td>
              <td  class="approve_list_name">{{  shipData.approver }}</td>
            </tr>
            <tr>
              <td class="approve_list_date">{{  shipData.created_time }}</td>
              <td class="approve_list_date">{{  shipData.checked_date }}</td>
              <td class="approve_list_date">{{  shipData.approved_date }}</td>
            </tr>
          </table>
          <p style="text-align: center; font-size:11px; margin-top:5px">아래와 같이 출고를 요청합니다. 검토 후 결제를 바랍니다.</p>
        </v-col>
        <v-col cols="12">
          <p class="doc_list_title">요청내용</p>
          <table class="doc_table">
            <tr>
              <td class="approve_title">작성일</td>
              <td class="approve_text">{{ shipData.created_time}}</td>
              <td class="approve_title">작성자</td>
              <td class="approve_text">{{ shipData.given_name}}</td>
            </tr>
            <tr>
              <td class="approve_title">프로젝트</td>
              <td class="approve_text">{{ shipData.project_code}}</td>
              <td class="approve_title">출고(반출)요청일</td>
              <td class="approve_text">{{ shipData.ship_date}}</td>
            </tr>
            <tr>
              <td class="approve_title">출고목적</td>
              <td class="approve_text">{{ shipData.purpose}}</td>
              <td class="approve_title">출하장소</td>
              <td class="approve_text">{{ shipData.ship_place}}</td>
            </tr>
            <tr v-if="shipData.approval_phase === '승인'">
              <td class="approve_title">시험성적서</td>
              <td class="approve_text" colspan="3">
                {{ shipData.inspection_report ? '■ 유   □무' : '□ 유   ■무' }}
              </td>
            </tr>
            <tr>
              <td class="approve_title">{{ shipData.approval_phase === '승인' ? '비고' : '추가 사유' }}</td>
              <td class="approve_text" colspan="3">{{  shipData.note }}</td>
            </tr>
          </table>
          <table class="doc_detail_table" style="margin-top:10px">
            <thead>
                <tr>
                  <th class="approve_title">품명</th>
                  <th class="approve_title">품목코드</th>
                  <th class="approve_title">위치</th>
                  <th class="approve_title">수량</th>
                </tr>
              </thead>
              <tbody>
                <tr
                class="approve_text"
                  v-for="(dta, i) in belongData"
                  :key="i"
                >
                  <td class="approve_text">{{ dta.name }}</td>
                  <td class="approve_text">{{ dta.product_code }}</td>
                  <td class="approve_text">{{ dta.spot }}</td>
                  <td class="approve_text">{{ dta.ship_num }}</td>
                </tr>
              </tbody>
          </table>

        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
/**
 * @file InboundApproveComponent.vue
 * @description 입고확인서 컴포넌트
 *
 * @typedef {Object} props
 * @property {Array} shipData - 데이터 배열
 * @property {Array} belongData - 데이터 배열
 * @property {Array} belongFiles - 데이터 배열
**/
export default {
  props: {
    shipData: Array,
    belongData: Array,
    belongFiles: Array,
  },
  methods: {
  },
  components: {
  },
  data(){
    return{
      // approve_data : this.shipData,
      // approve_headers: []
    }
  },
}
</script>
<style>
</style>
