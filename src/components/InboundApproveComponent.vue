
<template >
  <v-container>
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
            <td style="border:1px solid #b7b7b7; border-left: 0px; border-bottom: 0px; height:50px" class="text-h6 font-weight-bold">{{  inboundData.creater }}</td>
            <td style="border:1px solid #b7b7b7; border-left: 0px; border-bottom: 0px;" class="text-h6 font-weight-bold">{{  inboundData.creater }}</td>
            <td style="border:1px solid #b7b7b7; border-left: 0px; border-bottom: 0px;" class="text-h6 font-weight-bold">{{  inboundData.approver }}</td>
          </tr>
          <tr>
            <td style="border:1px solid #b7b7b7; border-left: 0px;">{{  inboundData.created_time }}</td>
            <td style="border:1px solid #b7b7b7; border-left: 0px;">{{  inboundData.created_time }}</td>
            <td style="border:1px solid #b7b7b7; border-left: 0px;">{{  inboundData.approve_date }}</td>
          </tr>
        </table>
        <p class="text-center">아래와 같이 입고를 요청합니다. 검토 후 결제를 바랍니다.</p>
      </v-col>
      <v-col cols="12">
        <p class="mb-2 text-h6 font-weight-black">개요</p>
        <table style="width:100%">
          <tr>
            <td class="approve_title">작성일</td>
            <td class="approve_text">{{ inboundData.created_time}}</td>
            <td class="approve_title">구매담당자</td>
            <td class="approve_text">유대현 차장</td>
          </tr>
          <tr>
            <td class="approve_title">입고일자</td>
            <td class="approve_text">{{ inboundData.inbound_date}}</td>
            <td class="approve_title">자재담당자</td>
            <td class="approve_text">김민기 사원</td>
          </tr>
          <tr>
            <td class="approve_title">업체명</td>
            <td class="approve_text">(주)파이온 일렉트릭</td>
            <td class="approve_title">프로젝트 코드</td>
            <td class="approve_text">당진 9호기 PJT</td>
          </tr>
        </table>
        <p class="mb-2 mt-7 text-h6 font-weight-black">내용</p>
        <table style="width:100%">
          <tr>
            <td class="approve_title" style="width: 130px;">업체명</td>
            <td class="approve_text">{{ inboundData.manufacturer}}</td>
          </tr>
          <tr>
            <td class="approve_title" style="width: 130px;">품명</td>
            <td class="approve_text">{{ inboundData.name}}</td>
          </tr>
          <tr>
            <td class="approve_title" style="width: 130px;">사양</td>
            <td class="approve_text">{{ inboundData.spec}}</td>
          </tr>
          <tr>
            <td class="approve_title" style="width: 130px;">수량</td>
            <td class="approve_text">{{ inboundData.inbound_num}}</td>
          </tr>
          <tr>
            <td class="approve_title" style="width: 130px;">품질검사결과</td>
            <td class="approve_text"></td>
          </tr>
          <tr>
            <td class="approve_title" style="width: 130px;">수입검사서</td>
            <td class="approve_text"></td>
          </tr>
          <tr>
            <td class="approve_title" style="width: 130px;">시험성적서</td>
            <td class="approve_text"></td>
          </tr>
          <tr>
            <td class="approve_title" style="width: 130px;">비고</td>
            <td class="approve_text"></td>
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
 * @property {Array} inboundData - 데이터 배열
**/
export default {
  props: {
    inboundData: Array,
  },
  methods: {
  },
  components: {
  },
  data(){
    return{
      // approve_data : this.inboundData,
      // approve_headers: []
    }
  },
}
</script>
<style>
</style>
