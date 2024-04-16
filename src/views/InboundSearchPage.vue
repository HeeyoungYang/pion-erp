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
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <!-- <v-col
              cols="12"
              sm="6"
            >
              <v-card
              elevation="1"
              class="mt-5"
              >
                <v-card-text class=" pt-3">
                  <DataTableComponent
                        :headers="inbound_product_list_headers"
                        :items="inbound_product_list_data"
                        :item-key="product_code"
                        dense
                        show-photo
                        show-files
                  />
                </v-card-text>
              </v-card>
            </v-col> -->
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
      :hide-overlay="true"
      @close="closeProductList"
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <table style="width:100%">
              <tr>
                <td class="approve_title" style="width:15%">프로젝트 코드</td>
                <td class="approve_text" style="width:35%">{{ inbound_info_data.project_code }}</td>
                <td class="approve_title" style="width:15%">입고 위치</td>
                <td class="approve_text" style="width:35%">{{ inbound_info_data.spot }}</td>
              </tr>
              <tr>
                <td class="approve_title" style="width:15%">품질검사결과</td>
                <td class="approve_text" style="width:35%">
                  <p class="mb-0 font-weight-bold">{{ inbound_info_data.quality_inspection }}</p>
                  <p class="mb-0 error--text" v-if="inbound_info_data.quality_inspection == '이상 있음'"> : {{ inbound_info_data.quality_inspection_reason }}</p>
                </td>
                <td class="approve_title" style="width:15%">비고</td>
                <td class="approve_text" style="width:35%">
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
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 수입검사서</p>
            <iframe width="100%" style="height:450px" :src="'https://mkorbucket-public.s3.ap-northeast-2.amazonaws.com/'+inbound_info_data.receiving_inspection"></iframe>
          </v-col>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 시험성적서</p>
            <iframe width="100%" style="height:450px" :src="'https://mkorbucket-public.s3.ap-northeast-2.amazonaws.com/'+inbound_info_data.inspection_report"></iframe>
          </v-col>
          <v-col cols="12" sm="4">
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

export default {
  components: {
                NavComponent,
                DataTableComponent,
                ModalDialogComponent,
                CardComponent,
                InputsFormComponent,
              },
  data(){
    return{
      menu: false,
      dates: [],
      inbound_product_list_dialog: false,

      searchCardInputs:[
        {label:'승인', type:'auto', col:'12', sm:'4', lg:'2', value:'All', list:['All', '승인', '미승인', '반려']},
        {label:'발주번호', col:'12', sm:'4', lg:'2', value: ''},
        {label:'관리코드', col:'12', sm:'4', lg:'2', value: ''},
        {label:'제품명', col:'12', sm:'4', lg:'2', value: ''},
        {label:'제조사', col:'12', sm:'4', lg:'2', value: ''},
        {label:'입고일자', type:'date', range:true, value:[], col:'12', sm:'4', lg:'2'}
      ],

      inbound_approve_headers: [
        { text: '발주번호', align: 'center', value: 'order_code', },
        { text: '신청자', align: 'center', value: 'creater', },
        { text: '구매담당자', align: 'center', value: 'purchasing_pic', },
        { text: '자재담당자', align: 'center', value: 'product_pic', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '입고일자', align: 'center', value: 'inbound_date', },
        { text: '입력방식', align: 'center', value: 'add_data', },
      ],
      inbound_product_list_headers: [
        { text: '종류', align: 'center', value: 'type', },
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '입고수량', align: 'center', value: 'inbound_num', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'product_price', },
      ],
      inbound_approve_data:[
        {
          order_code: 'ORDER231202-001',
          spot:'공장동 1층',
          project_code: '당진 9호기 PJT',
          creater: '윤준수',
          purchasing_pic: '김OO',
          product_pic: '박OO',
          manufacturer: '(주) 엘케이 일레븐',
          inbound_date: '2024-03-12',
          created_time:'2024-03-07',
          add_data: '자재선택',
          approval: '승인',
          approve_date:'2024-03-18',
          approver:'윤광희',
          return_reason:'',
          quality_inspection:'이상 있음',
          quality_inspection_reason:'이상있을 경우 작성한 사유 노출 영역 ',
          receiving_inspection:'2021.10_MKOR_ERP_SYSTEM_MANUAL.pdf',
          inspection_report:'2021.10_MKOR_ERP_SYSTEM_MANUAL.pdf',
          note:'비고 작성한 내용 노출',
          files:'warehouse.jpg,warehouse.jpg,warehouse.jpg',
          belong_data:[
            {
              type:'원부자재',
              classification:'일반',
              product_code: '공장2F_E-09-01',
              name: 'IGBT & SMPS',
              model: '모델1',
              spec: '사양1',
              manufacturer: '파이온일렉트릭',
              inbound_num: 100,
              unit_price: 1,
              product_price: 100,
              files:''
            },
            {
              type:'원부자재',
              classification:'일반',
              product_code: '공장2F_E-09-02',
              name: '쿨링팬',
              model: '모델2',
              spec: '사양2',
              manufacturer: '파이온일렉트릭',
              inbound_num: 10,
              unit_price: 4,
              product_price: 400,
              files:''
            },
            {
              type:'원부자재',
              classification:'일반',
              product_code: '공장2F_E-09-03',
              name: '보호회로',
              model: '모델3',
              spec: '사양3',
              manufacturer: '파이온일렉트릭',
              inbound_num: 15,
              unit_price: 2,
              product_price: 300,
              files:''
            },
          ],
        },
        {
          order_code: 'ORDER240115-002',
          spot:'공장동 2층',
          project_code: '프로젝트코드AAAA',
          creater: '윤준수',
          purchasing_pic: '김OO',
          product_pic: '박OO',
          manufacturer: '(주) 엘케이 일레븐',
          inbound_date: '2024-03-12',
          created_time:'2024-03-07',
          add_data: '자재선택',
          approval: '미승인',
          approve_date:'',
          approver:'',
          return_reason:'',
          quality_inspection:'이상 없음',
          quality_inspection_reason:'',
          receiving_inspection:'2021.10_MKOR_ERP_SYSTEM_MANUAL.pdf',
          inspection_report:'2021.10_MKOR_ERP_SYSTEM_MANUAL.pdf',
          note:'비고 작성한 내용 노출',
          files:'warehouse.jpg',
          belong_data:[
            {
              type:'원부자재',
              classification:'일반',
              product_code: '공장2F_E-09-01',
              name: 'IGBT & SMPS',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              inbound_num: '1',
              pe_number: '',
              unit_price: '',
              product_price: '',
            },
            {
              type:'원부자재',
              classification:'일반',
              product_code: '공장2F_E-09-01',
              name: 'IGBT & SMPS',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              inbound_num: '1',
              pe_number: '',
              unit_price: '',
              product_price: '',
              files:''
            },
            {
              type:'원부자재',
              classification:'일반',
              product_code: '공장2F_E-09-01',
              name: 'IGBT & SMPS',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              inbound_num: '1',
              pe_number: '',
              unit_price: '',
              product_price: '',
            },
          ],
        },
        {
          order_code: 'ORDER231101-003',
          creater: '윤준수',
          spot:'공장동 1층',
          project_code: '프로젝트코드BBBB',
          purchasing_pic: '김OO',
          product_pic: '박OO',
          manufacturer: '(주) 엘케이 일레븐',
          inbound_date: '2024-03-12',
          created_time:'2024-03-07',
          add_data: '자재선택',
          approval: '반려',
          approve_date:'',
          approver:'윤광희',
          return_reason:'반려사유노출영역',
          quality_inspection:'이상 없음',
          quality_inspection_reason:'',
          receiving_inspection:'2021.10_MKOR_ERP_SYSTEM_MANUAL.pdf',
          inspection_report:'2021.10_MKOR_ERP_SYSTEM_MANUAL.pdf',
          note:'비고 작성한 내용 노출',
          files:'',
          belong_data:[
            {
              type:'원부자재',
              classification:'일반',
              product_code: '공장2F_E-09-01',
              name: 'IGBT & SMPS',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              inbound_num: '1',
              pe_number: '',
              unit_price: '',
              product_price: '',
            },
            {
              type:'원부자재',
              classification:'일반',
              product_code: '공장2F_E-09-01',
              name: 'IGBT & SMPS',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              inbound_num: '1',
              pe_number: '',
              unit_price: '',
              product_price: '',
              files:''
            },
            {
              type:'원부자재',
              classification:'일반',
              product_code: '공장2F_E-09-01',
              name: 'IGBT & SMPS',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              inbound_num: '1',
              pe_number: '',
              unit_price: '',
              product_price: '',
              files:''
            },
          ],
        },
      ],
      inbound_info_data:{},
      inbound_product_list_data:[],
      // [
        // {
        //   creater:'윤준수',
        //   created_time:'2024-03-07',
        //   add_data: '자재선택',
        //   type:'원부자재',
        //   classification:'일반',
        //   product_code: '공장2F_E-09-01',
        //   name: 'IGBT & SMPS',
        //   model: '',
        //   spec: '',
        //   manufacturer: '파이온일렉트릭',
        //   inbound_num: '1',
        //   approval: '승인',
        //   pe_number: '',
        //   inbound_date: '2024-03-11',
        //   unit_price: '',
        //   product_price: '',
        //   approve_date:'2024-03-12',
        //   approver:'윤광희',
        //   return_reason:'',
        //   files:'warehouse.jpg,2021.10_MKOR_ERP_SYSTEM_MANUAL.pdf'
        // },
        // {
        //   creater:'윤준수',
        //   created_time:'2024-03-07',
        //   add_data: '직접입력',
        //   type:'반제품',
        //   classification:'일반',
        //   product_code: '공장2F_E-09-02',
        //   name: 'SPD, 퓨즈',
        //   model: '',
        //   spec: '',
        //   manufacturer: '파이온일렉트릭',
        //   inbound_num: '1',
        //   approval: '미승인',
        //   pe_number: '',
        //   inbound_date: '2024-03-11',
        //   unit_price: '',
        //   product_price: '',
        //   approve_date:'',
        //   approver:'',
        //   return_reason:'',
        // },
        // {
        //   creater:'윤준수',
        //   created_time:'2024-03-07',
        //   add_data: '자재선택',
        //   type:'완제품',
        //   classification:'일반',
        //   product_code: '공장2F_E-09-03',
        //   name: '쿨링팬',
        //   model: '',
        //   spec: '',
        //   manufacturer: '파이온일렉트릭',
        //   inbound_num: '1',
        //   approval: '반려',
        //   pe_number: '',
        //   inbound_date: '2024-03-11',
        //   unit_price: '',
        //   product_price: '',
        //   approve_date:'',
        //   approver:'윤광희',
        //   return_reason:'반려사유노출영역',
        // },
      // ],
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
  methods:{
    closeProductList(){
      this.inbound_product_list_dialog = false;
    },
    clickApproveData(item){
      let belong_datas = item.belong_data
      this.inbound_product_list_data = [];
      this.inbound_info_data = {};
      belong_datas.forEach(data =>{
        this.inbound_product_list_data.push(data);
      })
      this.inbound_info_data = {
        project_code:item.project_code,
        spot:item.spot,
        quality_inspection : item.quality_inspection,
        quality_inspection_reason : item.quality_inspection_reason,
        receiving_inspection : item.receiving_inspection,
        inspection_report : item.inspection_report,
        note: item.note,
        files: item.files.split(','),
      }
      this.inbound_product_list_dialog = true;
    },
  },
}
</script>
<style lang="">

</style>
