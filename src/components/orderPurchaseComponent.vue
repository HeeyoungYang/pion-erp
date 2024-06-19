
<template >
  <v-container>
    <div style="position:relative">
      <p class="print_doc_title">발주서</p>
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
              <td class="approve_list_name">양희영</td>
              <td class="approve_list_name">양희영</td>
              <td class="approve_list_name">윤준수</td>
            </tr>
            <tr>
              <td class="approve_list_date">2024-00-00</td>
              <td class="approve_list_date">2024-00-00</td>
              <td class="approve_list_date">2024-00-00</td>
            </tr>
          </table>
        </v-col>

        <v-col cols="12" sm="12" class="pb-0">
          <table style=" border-spacing: 0px; width: 100%;" class="mt-1">
            <tr class="text-body-1">
              <td class="estimate_info estimate_title text-center" style="border-left:1px solid #b6b6b6">관리번호</td>
              <td class="estimate_info">PE-20240425-001</td>
              <td class="estimate_info estimate_title text-center" >발행일</td>
              <td class="estimate_info">2024-00-00</td>
              <td class="estimate_info estimate_title text-center">납기일</td>
              <td class="estimate_info">2024-00-00</td>
            </tr>
          </table>
        </v-col>

        <v-col align-self="center" cols="12" sm="6" class="pb-0">
          <table style=" border-spacing: 0px; width: 100%;" class="mt-1">
            <tr class="text-body-1">
              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">수신업체</td>
              <td class="estimate_info" style="border-bottom: 0px;border-right: 0px;">AAAAA</td>
              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">대표자</td>
              <td class="estimate_info" style="border-bottom: 0px;">AAAAA</td>
            </tr>
            <tr>
              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">등록번호</td>
              <td colspan="3" class="estimate_info" style="border-bottom: 0px;"></td>
            </tr>
            <tr>
              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">주소</td>
              <td colspan="3" class="estimate_info" style="border-bottom: 0px;"></td>
            </tr>
            <tr class="text-body-1">
              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">전화</td>
              <td class="estimate_info" style="border-bottom: 0px;border-right: 0px;">AAAAA</td>
              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">팩스</td>
              <td class="estimate_info" style="border-bottom: 0px;">AAAAA</td>
            </tr>
            <tr class="text-body-1">
              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">결제조건</td>
              <td class="estimate_info" style="border-bottom: 0px;border-right: 0px;">AAAAA</td>
              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">프로젝트</td>
              <td class="estimate_info" style="border-bottom: 0px;">AAAAA</td>
            </tr>
            <tr>
              <td class="estimate_info estimate_title text-center" style="border-left:1px solid #b6b6b6">계좌정보</td>
              <td colspan="3" class="estimate_info"></td>
            </tr>
          </table>
        </v-col>
        <v-col align-self="center" cols="12" sm="6" style="position: relative;" class="pb-0">
          <v-img
            alt="직인"
            contain
            src="../assets/img/pion_stamp.png"
            transition="scale-transition"
            width="40"
            style="position: absolute; right:25px; top:25px"
          />
          <table style=" border-spacing: 0px; width: 100%;" class="mt-1">
            <tr>
              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">등록번호</td>
              <td colspan="3" class="estimate_info" style="border-bottom: 0px;">851 - 86 - 00038</td>
            </tr>
            <tr>
              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">상호</td>
              <td class="estimate_info" style="border-bottom: 0px;">파이온일렉트릭(주)</td>
              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;">대표자</td>
              <td class="estimate_info" style="border-bottom: 0px;">윤광희</td>
            </tr>
            <tr>
              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">주소</td>
              <td colspan="3" class="estimate_info" style="border-bottom: 0px;">서울특별시 서대문구 연세로 50, 116호 (연세대학교 공학원)</td>
            </tr>
            <tr>
              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">업태</td>
              <td class="estimate_info" style="border-bottom: 0px;">제조업</td>
              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;">종목</td>
              <td class="estimate_info" style="border-bottom: 0px;">전력전자기기</td>
            </tr>
            <tr>
              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;border-left:1px solid #b6b6b6">대표전화</td>
              <td class="estimate_info" style="border-bottom: 0px;">070-5096-4179</td>
              <td class="estimate_info estimate_title text-center" style="border-bottom: 0px;">팩스</td>
              <td class="estimate_info" style="border-bottom: 0px;">0505-300-4179</td>
            </tr>
            <tr>
              <td class="estimate_info estimate_title text-center" style="border-left:1px solid #b6b6b6">담당자</td>
              <td class="estimate_info" >OOO</td>
              <td class="estimate_info estimate_title text-center" >연락처</td>
              <td class="estimate_info">070-1234-5678</td>
            </tr>
          </table>
        </v-col>
        <!-- <v-col align-self="center" cols="12" sm="12" class="pb-0">

          <table style=" border-spacing: 0px; width: 100%;" class="mt-1">
            <tr class="text-body-1">
              <td class="estimate_info estimate_title text-center" style="border-left:1px solid #b6b6b6">담당자 확인</td>
              <td class="estimate_info">PE-20240425-001</td>
              <td class="estimate_info estimate_title text-center" >비고</td>
              <td class="estimate_info">2024-00-00</td>
            </tr>
          </table>
        </v-col> -->
        <v-col cols="12">
          <table class="doc_detail_table">
            <thead>
                <tr>
                  <th class="approve_title">순번</th>
                  <th class="approve_title">품명</th>
                  <th class="approve_title">규격</th>
                  <th class="approve_title">단가</th>
                  <th class="approve_title">수량</th>
                  <th class="approve_title">공급가액</th>
                  <th class="approve_title">부가세</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="approve_text">1</td>
                  <td class="approve_text"></td>
                  <td class="approve_text"></td>
                  <td class="approve_text"></td>
                  <td class="approve_text"></td>
                  <td class="approve_text"></td>
                  <td class="approve_text"></td>
                </tr>
                <tr>
                  <td class="approve_text">2</td>
                  <td class="approve_text"></td>
                  <td class="approve_text"></td>
                  <td class="approve_text"></td>
                  <td class="approve_text"></td>
                  <td class="approve_text"></td>
                  <td class="approve_text"></td>
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
 * @file orderPurchaseComponent.vue
 * @description 입고확인서 컴포넌트
 *
 * @typedef {Object} props
**/
export default {
  props: {
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
