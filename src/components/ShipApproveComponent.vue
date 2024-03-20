
<template >
  <v-container>
    <p class="text-center text-h4 font-weight-bold black--text pb-8 mb-8" style="border-bottom:1px solid #ccc">출고 요청서</p>
    <v-row class="mt-3">
      <v-col cols="6">
        <v-img
          alt="Pionelectric Logo"
          class="shrink mr-2"
          contain
          src="../assets/img/pion_logo.png"
          transition="scale-transition"
          width="150"
        />
      </v-col>
      <v-col cols="6">
        <table style="border-spacing: 0;width: 100%; text-align: center;">
            <tr>
            <td rowspan="3" style="border:1px solid #b7b7b7!important" class="blue lighten-5">결재</td>
            <td style="border:1px solid #b7b7b7!important; border-left: 0px; border-bottom: 0px;" class="blue lighten-5">작성</td>
            <td style="border:1px solid #b7b7b7!important; border-left: 0px; border-bottom: 0px;" class="blue lighten-5">확인</td>
            <td style="border:1px solid #b7b7b7!important; border-left: 0px; border-bottom: 0px;" class="blue lighten-5">승인</td>
          </tr>
          <tr>
            <td style="border:1px solid #b7b7b7; border-left: 0px; border-bottom: 0px; height:50px" class="text-h6 font-weight-bold">{{  shipData.creater }}</td>
            <td style="border:1px solid #b7b7b7; border-left: 0px; border-bottom: 0px;" class="text-h6 font-weight-bold">{{  shipData.creater }}</td>
            <td style="border:1px solid #b7b7b7; border-left: 0px; border-bottom: 0px;" class="text-h6 font-weight-bold">{{  shipData.approver }}</td>
          </tr>
          <tr>
            <td style="border:1px solid #b7b7b7; border-left: 0px;">{{  shipData.created_time }}</td>
            <td style="border:1px solid #b7b7b7; border-left: 0px;">{{  shipData.created_time }}</td>
            <td style="border:1px solid #b7b7b7; border-left: 0px;">{{  shipData.approve_date }}</td>
          </tr>
        </table>
        <p class="text-center">아래와 같이 출고를 요청합니다. 검토 후 결제를 바랍니다.</p>
      </v-col>
      <v-col cols="12">
        <p class="mb-2 text-h6 font-weight-black">요청내용</p>
        <table style="width:100%">
          <tr>
            <td class="approve_title">작성일</td>
            <td class="approve_text">{{ shipData.created_time}}</td>
            <td class="approve_title">작성자</td>
            <td class="approve_text">{{ shipData.creater}}</td>
          </tr>
          <tr>
            <td class="approve_title">프로젝트</td>
            <td class="approve_text">{{ shipData.project}}</td>
            <td class="approve_title">출고(반출)요청일</td>
            <td class="approve_text">{{ shipData.ship_date}}</td>
          </tr>
          <tr>
            <td class="approve_title">출고처</td>
            <td class="approve_text">{{ shipData.warehouse}}</td>
            <td class="approve_title">출하장소</td>
            <td class="approve_text">{{ shipData.ship_place}}</td>
          </tr>
          <tr>
            <td class="approve_title">출고목적</td>
            <td class="approve_text">{{ shipData.purpose}}</td>
            <td class="approve_title">시험성적서</td>
            <td class="approve_text">
              {{ shipData.inspection_report ? '■ 유   □무' : '□ 유   ■무' }}
            </td>
          </tr>
          <tr>
            <td class="approve_title">품목코드 및 수량</td>
            <td class="approve_text" colspan="3">
              <p class="mb-0" v-for="(dta, i) in belongData" :key="i">{{ i+1 }}. {{ dta.product_code }} : {{ dta.ship_num }}EA </p>
            </td>
          </tr>
          <tr>
            <td class="approve_title">품목명</td>
            <td class="approve_text" colspan="3">
              <p class="mb-0" v-for="(dta, i) in belongData" :key="i">{{ i+1 }}. {{ dta.name }}</p>
            </td>
          </tr>
          <tr>
            <td class="approve_title">비고</td>
            <td class="approve_text" colspan="3">{{  shipData.note }}</td>
          </tr>
        </table>

      </v-col>
    </v-row>
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
