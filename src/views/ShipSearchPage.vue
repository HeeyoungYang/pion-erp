<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productMenu="true" :shipMenu="true"></NavComponent>

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
                    :headers="ship_approve_headers"
                    :items="ship_approve_data"
                    item-key="product_code"
                    approval="ship"
                    dense
                    show-files
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
                        :headers="ship_product_list_headers"
                        :items="ship_product_list_data"
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
      :dialog-value="ship_product_list_dialog"
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
              @click="ship_product_list_dialog = false"
            >
              <v-icon>mdi-close-thick</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12">
            <DataTableComponent
              :headers="ship_product_list_headers"
              :items="ship_product_list_data"
              item-key="product_code"
              dense
              show-photo
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
      ship_product_list_dialog: false,

      searchCardInputs:[
        {label:'승인', type:'auto', col:'12', sm:'4', lg:'2', value:'All', list:['All', '승인', '미승인', '반려']},
        {label:'프로젝트', col:'12', sm:'4', lg:'2', value: ''},
        {label:'관리코드', col:'12', sm:'4', lg:'2', value: ''},
        {label:'제품명', col:'12', sm:'4', lg:'2', value: ''},
        {label:'출고 요청일', type:'date', range:true, value:[], col:'12', sm:'4', lg:'2'}
      ],

      ship_approve_headers: [
        { text: '신청자', align: 'center', value: 'creater', },
        { text: '작성일', align: 'center', value: 'created_time', },
        { text: '프로젝트', align: 'center', value: 'project', },
        { text: '출고요청일', align: 'center', value: 'ship_date', },
        { text: '출고목적', align: 'center', value: 'purpose', },
      ],
      ship_product_list_headers: [
        { text: '종류', align: 'center', value: 'type', },
        { text: '분류', align: 'center', value: 'classification', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'name', },
        { text: '모델명', align: 'center', value: 'model', },
        { text: '사양', align: 'center', value: 'spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '출고수량', align: 'center', value: 'ship_num', },
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '총액', align: 'center', value: 'product_price', },
      ],
      ship_approve_data:[
        {
          project: '당진 9호기 PJT',
          creater: '윤준수',
          ship_date: '2024-03-12',
          created_time:'2024-03-07',
          approval: '승인',
          approve_date:'2024-03-18',
          approver:'윤광희',
          return_reason:'',
          receiving_inspection:'',
          inspection_report:'시험성적서파일명.pdf',
          note:'비고 작성한 내용 노출',
          warehouse:'광주공장',
          ship_place:'',
          purpose:'TSC밸브 수리',
          files:'warehouse.jpg,2021.10_MKOR_ERP_SYSTEM_MANUAL.pdf',
          belong_data:[
            {
              type:'원부자재',
              classification:'일반',
              product_code: '공장2F_E-09-01',
              name: 'IGBT & SMPS',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              ship_num: '1',
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
              ship_num: '1',
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
              ship_num: '1',
              pe_number: '',
              unit_price: '',
              product_price: '',
            },
          ],
        },
        {
          project: '당진 9호기 PJT',
          creater: '윤준수',
          ship_date: '2024-03-12',
          created_time:'2024-03-07',
          approval: '미승인',
          approve_date:'',
          approver:'',
          return_reason:'',
          receiving_inspection:'',
          inspection_report:'시험성적서파일명.pdf',
          note:'비고 작성한 내용 노출',
          warehouse:'광주공장',
          ship_place:'',
          purpose:'TSC밸브 수리',
          files:'warehouse.jpg,2021.10_MKOR_ERP_SYSTEM_MANUAL.pdf',
          belong_data:[
            {
              type:'원부자재',
              classification:'일반',
              product_code: '공장2F_E-09-01',
              name: 'IGBT & SMPS',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              ship_num: '1',
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
              ship_num: '1',
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
              ship_num: '1',
              pe_number: '',
              unit_price: '',
              product_price: '',
            },
          ],
        },
        {
          project: '당진 9호기 PJT',
          creater: '윤준수',
          ship_date: '2024-03-12',
          created_time:'2024-03-07',
          approval: '반려',
          approve_date:'',
          approver:'윤광희',
          return_reason:'반려사유노출영역',
          receiving_inspection:'',
          inspection_report:'시험성적서파일명.pdf',
          note:'비고 작성한 내용 노출',
          warehouse:'광주공장',
          ship_place:'',
          purpose:'TSC밸브 수리',
          files:'warehouse.jpg,2021.10_MKOR_ERP_SYSTEM_MANUAL.pdf',
          belong_data:[
            {
              type:'원부자재',
              classification:'일반',
              product_code: '공장2F_E-09-01',
              name: 'IGBT & SMPS',
              model: '',
              spec: '',
              manufacturer: '파이온일렉트릭',
              ship_num: '1',
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
              ship_num: '1',
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
              ship_num: '1',
              pe_number: '',
              unit_price: '',
              product_price: '',
              files:''
            },
          ],
        },
      ],
      ship_product_list_data:[],
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
      this.ship_product_list_data = [];
      belong_datas.forEach(data =>{
        this.ship_product_list_data.push(data);
      })
      this.ship_product_list_dialog = true;
    },
  },
}
</script>
<style lang="">

</style>
