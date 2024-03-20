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
          <InputsCardComponent
            elevation="1"
            text-class=" pt-3"
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
          </InputsCardComponent>

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
                    approval
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
      :persistent="true"
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-btn
              x-small
              fab
              color="blue-grey darken-1"
              class="float-right elevation-0 white--text"
              @click="inbound_product_list_dialog = false"
            >
              <v-icon>mdi-close-thick</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12">
            <DataTableComponent
              :headers="inbound_product_list_headers"
              :items="inbound_product_list_data"
              item-key="product_code"
              dense
              show-photo
              show-files
            />
          </v-col>
        </v-row>
      </v-container>
    </ModalDialogComponent>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import DataTableComponent from "@/components/DataTableComponent";
import InputsCardComponent from "@/components/InputsCardComponent.vue";
import ModalDialogComponent from "@/components/ModalDialogComponent.vue";

export default {
  components: {
                NavComponent,
                DataTableComponent,
                InputsCardComponent,
                ModalDialogComponent,
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
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'product_price', },
      ],
      inbound_approve_data:[
        {
          order_code: 'ORDER231202-001',
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
          receiving_inspection:'',
          inspection_report:'시험성적서파일명.pdf',
          note:'비고 작성한 내용 노출',
          inbound_files:'세금계산서.pdf,거래명세표.pdf',
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
              files:'warehouse.jpg,2021.10_MKOR_ERP_SYSTEM_MANUAL.pdf'
            },
          ],
        },
        {
          order_code: 'ORDER240115-002',
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
          receiving_inspection:'',
          inspection_report:'',
          note:'비고 작성한 내용 노출',
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
              files:'warehouse.jpg,2021.10_MKOR_ERP_SYSTEM_MANUAL.pdf'
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
              files:'warehouse.jpg,2021.10_MKOR_ERP_SYSTEM_MANUAL.pdf'
            },
          ],
        },
        {
          order_code: 'ORDER231101-003',
          creater: '윤준수',
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
          receiving_inspection:'',
          inspection_report:'',
          note:'비고 작성한 내용 노출',
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
              files:'warehouse.jpg,2021.10_MKOR_ERP_SYSTEM_MANUAL.pdf'
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
  methods:{
    clickApproveData(item){
      let belong_datas = item.belong_data
      this.inbound_product_list_data = [];
      belong_datas.forEach(data =>{
        this.inbound_product_list_data.push(data);
      })
      this.inbound_product_list_dialog = true;
    },
  },
}
</script>
<style lang="">

</style>
