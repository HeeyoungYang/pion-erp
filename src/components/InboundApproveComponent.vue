
<template >
  <v-container>
    <div>
      <p class="text-center text-h4 font-weight-bold black--text pb-8 mb-8" style="border-bottom:1px solid #ccc">입고 확인서</p>
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
              <td style="border:1px solid #b7b7b7; border-left: 0px; border-bottom: 0px;" class="text-h6 font-weight-bold">{{  inboundData.checker }}</td>
              <td style="border:1px solid #b7b7b7; border-left: 0px; border-bottom: 0px;" class="text-h6 font-weight-bold">{{  inboundData.approver }}</td>
            </tr>
            <tr>
              <td style="border:1px solid #b7b7b7; border-left: 0px;">{{  inboundData.created_time }}</td>
              <td style="border:1px solid #b7b7b7; border-left: 0px;">{{  inboundData.checked_date }}</td>
              <td style="border:1px solid #b7b7b7; border-left: 0px;">{{  inboundData.approved_date }}</td>
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
          <p class="mb-2 mt-7 text-h6 font-weight-black">내용</p>
          <v-simple-table dense class="mb-3" style="border-bottom:1px solid #cccccc; border-radius:0px;">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center approve_title" style="border-right:0px; border-bottom:0px">품명</th>
                  <th class="text-center approve_title" style="border-right:0px; border-bottom:0px">규격(사양)</th>
                  <th class="text-center approve_title" style="border-right:0px; border-bottom:0px">수량</th>
                  <th class="text-center approve_title" style="border-bottom:0px">제조사</th>
                </tr>
              </thead>
              <tbody>
                <tr
                class="approve_text"
                  v-for="(dta, i) in belongData"
                  :key="i"
                >
                  <td class="text-center approve_text" style="border-right:0px; border-bottom:0px">{{ dta.name }}</td>
                  <td class="text-center approve_text" style="border-right:0px; border-bottom:0px">{{ dta.spec }}</td>
                  <td class="text-center approve_text" style="border-right:0px; border-bottom:0px">{{ dta.inbound_num }}</td>
                  <td class="text-center approve_text" style="border-bottom:0px">{{ dta.manufacturer }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <table style="width:100%">
            <tr>
              <td class="approve_title" style="width: 130px;">품질검사결과</td>
              <td class="approve_text">
                <p class="mb-0 font-weight-bold">{{ inboundData.abnormal_reason == '' ? '이상 없음' : '이상 있음' }}</p>
                <p class="mb-0 error--text" v-if="inboundData.abnormal_reason != ''"> : {{ inboundData.abnormal_reason }}</p>
              </td>
            </tr>
            <tr>
              <td class="approve_title" style="width: 130px;">수입검사서</td>
              <td class="approve_text">
                {{ inboundData.receiving_inspection ? '■ 유   □무' : '□ 유   ■무' }}
              </td>
            </tr>
            <tr>
              <td class="approve_title" style="width: 130px;">시험성적서</td>
              <td class="approve_text">
                {{ inboundData.inspection_report ? '■ 유   □무' : '□ 유   ■무' }}
              </td>
            </tr>
            <tr>
              <td class="approve_title" style="width: 130px;">비고</td>
              <td class="approve_text">{{ inboundData.note }}</td>
            </tr>
          </table>
          <p class="mb-2 mt-7 text-h6 font-weight-black">붙임</p>
          <div style="border:1px solid #ccc" class="px-5 py-4">
                <p class="mb-0" v-for="(file, i) in belongFiles" :key="i">{{ i+1 }}. {{ file }}</p>
          </div>
        </v-col>
      </v-row>
    </div>
    <div>

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
export default {
  props: {
    inboundData: Array,
    belongData: Array,
    belongFiles: Array,
  },
  methods: {
  },
  components: {
  },
  data(){
    return{
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
