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
            v-if="select_product"
          >
            <v-card-title  slot="cardTitle" style="border-bottom: 1px solid #ccc" class="mb-3 font-weight-black">
              <span>자재 선택</span>
              <v-btn
                small
                color="success"
                class="mr-2 ml-4"
                @click="addProductInboundData"
              >
                직접 입력형 전환
              </v-btn>
            </v-card-title>
            <v-col
              cols="12"
              sm="4"
              lg="3"
              align-self="center"
            >
              <v-btn
                color="primary"
                elevation="2"
              >
                <v-icon>mdi-magnify</v-icon>검색
              </v-btn>
            </v-col>
            <v-col cols="12">
              <DataTableComponent
                dense
                v-model="product_inbound_data"
                :headers="product_search_headers"
                :items="product_search_data"
                item-key="product_code"
                show-select
                show-photo
                />
            </v-col>
          </InputsCardComponent>


          <InputsCardComponent
            elevation="1"
            card-class="mt-5"
            text-class=" pt-3"
            dense
            clearable
            filled
            hide-details
            :inputs="inboundCardInputs"
          >
            <v-card-title  slot="cardTitle" style="border-bottom: 1px solid #ccc" class="mb-3 font-weight-black">
              입고 정보 입력
            </v-card-title>
            <v-col cols="12" sm="4" lg="2" align-self="center">
              <v-radio-group
                dense
                hide-details
                class="mt-0"
                v-model="something_wrong_radio"
                row
              >
                <v-radio
                  label="이상 없음"
                  value="이상 없음"
                  @click="something_wrong = false"
                ></v-radio>
                <v-radio
                  label="이상 있음"
                  value="이상 있음"
                  class="mr-0"
                  @click="something_wrong = true"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" sm="4" lg="4" v-if="something_wrong">
              <v-text-field
                dense
                hide-details
                filled
                label="사유"
                v-model="something_wrong_reason"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" lg="4" align-self="center">
              <v-btn
                small
                color="default"
                class="mr-2 ml-4"
                @click="addProductInboundData"
                v-if="add_self"
              >
                행 추가
              </v-btn>
              <v-btn
                v-if="add_self"
                small
                color="error"
                class="mr-2"
                @click="addProductInboundDataCancle"
              >
                직접 입력형 취소
              </v-btn>
              <v-btn
                small
                color="success"
              >
                입고 승인 요청
              </v-btn>
            </v-col>
            <v-col
              cols="12"
            >
              <v-data-table
                dense
                :headers="product_inbound_headers"
                :items="product_inbound_data"
                item-key="product_code"
                class="elevation-1"
              >
                <template v-slot:item="{ item }">
                  <tr v-if="!add_self">
                    <td align="center">{{  item.product_type }}</td>
                    <td align="center">{{  item.product_classification }}</td>
                    <td align="center">{{  item.product_code }}</td>
                    <td align="center">{{  item.product_name }}</td>
                    <td align="center">
                      <v-text-field
                        dense
                        hide-details
                        filled
                        type="number"
                        style="max-width:150px"
                        v-model="item.product_inbound_num"
                      >
                      </v-text-field>
                    </td>
                    <td align="center">{{  item.product_model }}</td>
                    <td align="center">
                      <v-text-field
                        dense
                        hide-details
                        filled
                        style="max-width:200px"
                        v-model="item.product_spec"
                      >
                      </v-text-field>
                    </td>
                    <td align="center">{{  item.manufacturer }}</td>
                    <td align="center">{{  item.pe_number }}</td>
                    <td align="center">{{  item.unit_price }}</td>
                    <td align="center">{{  item.photo }}</td>
                  </tr>
                  <tr v-else-if="add_self">
                    <td align="center">
                      <v-autocomplete
                        v-model="item.product_classification"
                        :items="product_type_list.slice(1)"
                        dense
                        filled
                        hide-details
                        style="width:150px"
                      ></v-autocomplete>
                    </td>
                    <td align="center">
                      <v-autocomplete
                        v-model="item.product_type"
                        :items="product_classification_list.slice(1)"
                        dense
                        filled
                        hide-details
                        style="width:150px"
                      ></v-autocomplete>
                    </td>
                    <td align="center">
                      <v-text-field
                        dense
                        hide-details
                        filled
                        v-model="item.product_code"
                        style="width:200px"
                      >
                      </v-text-field>
                    </td>
                    <td align="center">
                      <v-text-field
                        dense
                        hide-details
                        filled
                        v-model="item.product_name"
                        style="width:150px"
                      >
                      </v-text-field>
                    </td>
                    <td align="center">
                      <v-text-field
                        dense
                        hide-details
                        filled
                        type="number"
                        v-model="item.product_inbound_num"
                        style="width:150px"
                      >

                      </v-text-field>
                    </td>
                    <td align="center">
                      <v-text-field
                        dense
                        hide-details
                        filled
                        v-model="item.product_model"
                        style="width:150px"
                      >
                      </v-text-field>
                    </td>
                    <td align="center">
                      <v-text-field
                        dense
                        hide-details
                        filled
                        v-model="item.product_spec"
                        style="width:150px"
                      >
                      </v-text-field>
                    </td>
                    <td align="center">
                      <v-text-field
                        dense
                        hide-details
                        filled
                        v-model="item.manufacturer"
                        style="width:150px"
                      >
                      </v-text-field>
                    </td>
                    <td align="center">
                      <v-text-field
                        dense
                        hide-details
                        filled
                        v-model="item.pe_number"
                        style="width:150px"
                      >
                      </v-text-field>
                    </td>
                    <td align="center">
                      <v-text-field
                        dense
                        hide-details
                        filled
                        type="number"
                        v-model="item.unit_price"
                        style="width:150px"
                      >

                      </v-text-field>
                    </td>
                    <td align="center">
                      <v-file-input
                        small-chips
                        filled
                        dense
                        hide-details
                        v-model="item.photo"
                      ></v-file-input>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </InputsCardComponent>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import DataTableComponent from "@/components/DataTableComponent";
import InputsCardComponent from "@/components/InputsCardComponent.vue";

export default {
  components: {
                NavComponent,
                DataTableComponent,
                InputsCardComponent,
              },
  data(){
    return{
      add_self: false,
      select_product: true,
      product_type:'All',
      product_classification:'All',
      product_code: '',
      product_name: '',
      product_model: '',
      product_spec: '',
      product_manufacturer: '',
      product_condition: 'All',
      product_inbound_date: '2024-03-11',
      product_type_list: ['All', '원부자재', '반제품', '완제품'],
      product_classification_list: ['All', '일반', 'GFM', '전력변환기'],
      product_condition_list: ['All', 'G', 'B'],
      dates: [],
      menu: false,
      something_wrong_radio: '이상 없음',
      something_wrong:false,
      something_wrong_reason:'',


      searchCardInputs:[
        {label:'종류', type:'auto', col:'12', sm:'4', lg:'2', value:'All', list:['All', '원부자재', '반제품', '완제품']},
        {label:'분류', type:'auto', list:['All', '일반', 'GFM', '전력변환기'], value:'All', col:'12', sm:'4', lg:'2'},
        {label:'상태', type:'auto', col:'12', sm:'4', lg:'2', value:'All', list:['All', 'G', 'B']},
        {label:'관리코드', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제품명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'모델명', col:'12', sm:'4', lg:'3', value: ''},
        {label:'사양', col:'12', sm:'4', lg:'3', value: ''},
        {label:'제조사', col:'12', sm:'4', lg:'3', value: ''},
        // {label:'일자', type:'date', range:true, value:[], col:'12', sm:'4', lg:'3'}
      ],



      inboundCardInputs:[
        {label:'발주서 번호', col:'12', sm:'4', lg:'2', value: ''},
        {label:'구매담당자', type:'auto', col:'12', sm:'4', lg:'2', value:'', list:['김OO', '최OO', '이OO', '박OO']},
        {label:'자재담당자', type:'auto', col:'12', sm:'4', lg:'2', value:'', list:['김OO', '최OO', '이OO', '박OO']},
        {label:'입고일자', type:'date', range:true, value:[], col:'12', sm:'4', lg:'2'},
        {label:'프로젝트 코드', col:'12', sm:'4', lg:'2', value: ''},
        {label:'수입검사서', type:'file', col:'12', sm:'4', lg:'2', value: '', icon:'', appendIcon:'mdi-paperclip', smallChips:true,},
        {label:'시험성적서', type:'file', col:'12', sm:'4', lg:'2', value: '', icon:'', appendIcon:'mdi-paperclip', smallChips:true,},
        {label:'기타', type:'file', col:'12', sm:'4', lg:'4', value: '', icon:'', appendIcon:'mdi-paperclip', smallChips:true,},
        {label:'비고', type:'textarea', col:'12', sm:'4', lg:'6', value: ''},
      ],


      product_inbound_headers: [
        { text: '종류', align: 'center', value: 'product_type', },
        { text: '분류', align: 'center', value: 'product_classification', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '입고수량', align: 'center', value: 'product_inbound_num', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '규격', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '사진', align: 'center', value: 'photo', },
      ],

      product_inbound_data: [],
      product_inbound_data_added: [],

      product_search_headers: [
        { text: '종류', align: 'center', value: 'product_type', },
        { text: '분류', align: 'center', value: 'product_classification', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '단가', align: 'center', value: 'unit_price', },
      ],

      product_search_data: [
        {
          product_type:'원부자재',
          product_classification:'일반',
          product_code: '공장2F_E-09-01',
          product_name: 'IGBT & SMPS',
          product_model: '',
          product_spec: '111',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          photo:'',
        },
        {
          product_type:'원부자재',
          product_classification:'일반',
          product_code: '공장2F_E-09-02',
          product_name: 'SPD, 퓨즈',
          product_model: '',
          product_spec: '2222',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          photo:'',
        },
        {
          product_type:'원부자재',
          product_classification:'일반',
          product_code: '공장2F_E-09-03',
          product_name: '쿨링팬',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          photo:'',
        },
        {
          product_type:'원부자재',
          product_classification:'일반',
          product_code: '공장2F_E-09-04',
          product_name: '보호회로',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          photo:'',
        },
        {
          product_type:'원부자재',
          product_classification:'일반',
          product_code: '공장2F_E-09-05',
          product_name: '리액터',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          photo:'',
        },
        {
          product_type:'원부자재',
          product_classification:'일반',
          product_code: '공장2F_E-09-06',
          product_name: 'MCCB',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          photo:'',
        },
        {
          product_type:'반제품',
          product_classification:'일반',
          product_code: '공장2F_E-09-07',
          product_name: 'PCS Ass`Y',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          photo:'',
        },
        {
          product_type:'반제품',
          product_classification:'일반',
          product_code: '공장2F_E-09-08',
          product_name: '제어기 Ass`Y',
          product_model: '',
          product_spec: '',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          photo:'',
        },
        {
          product_type:'완제품',
          product_classification:'일반',
          product_code: 'P-ESS-PC-380V500K60H-RT-24-R1',
          product_name: 'ESS GFM용 PCS',
          product_model: '',
          product_spec: '380VAC 500kW',
          manufacturer: '파이온일렉트릭',
          pe_number: '',
          unit_price: '',
          photo:'',
        },
      ],
    }
  },

  methods: {
    addProductInboundData(){
      if(this.add_self == false){
        alert('직접 입력형으로 전환되며 위에서 선택한 자재는 선택 해제됩니다. ');
        this.product_inbound_data = [];
        this.select_product = false;
      }
      this.add_self = true;
      this.product_inbound_data.push({
          product_type:'',
          product_classification:'',
          product_code: '',
          product_name: '',
          product_model: '',
          product_spec: '',
          manufacturer: '',
          pe_number: '',
          unit_price: '',
          product_price: '',
          registe_type: '직접입력',
        });
    },
    addProductInboundDataCancle(){
      if(this.add_self == true){
        alert('자재 선택형으로 전환되며 아래 작성된 내용은 초기화됩니다.');
        this.product_inbound_data = [];
        this.select_product = true;
      }
      this.add_self = false;
    },
  },

  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  },
}
</script>
<style lang="">

</style>
