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
            title-class="mb-0 font-weight-black"
            divider-class="mb-3"
          >
            <div slot="cardTitle">
              <span>자재 선택</span>
            </div>
            <InputsFormComponent
              slot="cardText"
              dense
              clearable
              filled
              hide-details
              :inputs="searchCardInputs"
              v-if="select_product"
            >
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
                  v-model="product_ship_data"
                  :headers="product_search_headers"
                  :items="product_search_data"
                  item-key="product_code"
                  show-select
                  show-photo
                  />
              </v-col>
            </InputsFormComponent>
          </CardComponent>


          <CardComponent
            elevation="1"
            card-class="mt-5"
            text-class=" pt-3"
            title-class="mb-0 font-weight-black"
            divider-class="mb-3"
          >
            <div slot="cardTitle">
              출고 정보 입력
            </div>
            <InputsFormComponent
              slot="cardText"
              dense
              clearable
              filled
              hide-details
              :inputs="shipCardInputs"
            >
              <v-col cols="12" sm="4" lg="4" align-self="center">
                <v-btn
                  small
                  color="success"
                >
                  출고 승인 요청
                </v-btn>
              </v-col>
              <v-col
                cols="12"
              >
                <v-data-table
                  dense
                  :headers="product_ship_headers"
                  :items="product_ship_data"
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
                          v-model="item.product_ship_num"
                        >
                        </v-text-field>
                      </td>
                      <td align="center">{{  item.product_model }}</td>
                      <td align="center">{{  item.product_spec }}</td>
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
                          v-model="item.product_ship_num"
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
            </InputsFormComponent>
          </CardComponent>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import DataTableComponent from "@/components/DataTableComponent";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import CardComponent from "@/components/CardComponent.vue";

export default {
  components: {
                NavComponent,
                DataTableComponent,
                InputsFormComponent,
                CardComponent,
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
      product_ship_date: '2024-03-11',
      product_type_list: ['All', '원부자재', '반제품', '완제품'],
      product_classification_list: ['All', '일반', 'GFM', '전력변환기'],
      product_condition_list: ['All', 'G', 'B'],
      dates: [],
      menu: false,


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



      shipCardInputs:[
        {label:'프로젝트', col:'12', sm:'4', lg:'2', value: ''},
        {label:'출고(반출)요청일', type:'date', range:true, value:[], col:'12', sm:'4', lg:'2'},
        {label:'출고처', col:'12', sm:'4', lg:'2', value: ''},
        {label:'출하장소', col:'12', sm:'4', lg:'2', value: ''},
        {label:'출고목적', col:'12', sm:'4', lg:'4', value: ''},
        {label:'시험성적서', type:'file', col:'12', sm:'4', lg:'2', value: '', icon:'', appendIcon:'mdi-paperclip', smallChips:true,},
        {label:'비고', type:'textarea', col:'12', sm:'4', lg:'6', value: ''},
      ],


      product_ship_headers: [
        { text: '종류', align: 'center', value: 'product_type', },
        { text: '분류', align: 'center', value: 'product_classification', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '출고수량', align: 'center', value: 'product_ship_num', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '단가', align: 'center', value: 'unit_price', },
        { text: '사진', align: 'center', value: 'photo', },
      ],

      product_ship_data: [],
      product_ship_data_added: [],

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
