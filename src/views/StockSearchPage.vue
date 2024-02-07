<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :stockMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row justify="center">
        <v-col
          cols="12"
          sm="11"
        >
          <v-card
          elevation="1"
          >

            <v-card-text class=" pt-3">
              <v-row>
                <v-col
                  cols="12"
                  sm="2"
                >
                  <v-autocomplete
                    v-model="product_type"
                    :items="product_type_list"
                    dense
                    clearable
                    filled
                    hide-details
                    label="제품 분류"
                  ></v-autocomplete>
                </v-col>
                <v-col
                  cols="12"
                  sm="2"
                >
                  <v-text-field
                    v-model="product_code"
                    dense
                    clearable
                    filled
                    hide-details
                    label="관리코드"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="2"
                >
                  <v-text-field
                    v-model="product_name"
                    dense
                    clearable
                    filled
                    hide-details
                    label="제품명"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="2"
                >
                  <v-text-field
                    v-model="product_model"
                    dense
                    clearable
                    filled
                    hide-details
                    label="모델명"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="3"
                >
                  <v-checkbox
                    v-model="stock_more_0"
                    label="재고 > 0"
                  ></v-checkbox>
                </v-col>
                <v-col
                  cols="12"
                  sm="1"
                  align-self="center"
                >
                  <v-btn
                    color="primary"
                    elevation="2"
                  >
                    <v-icon>mdi-magnify</v-icon>검색
                  </v-btn>
                </v-col>
              </v-row>

              <v-row>

              </v-row>
            </v-card-text>
          </v-card>

          <v-card
          elevation="1"
          class="mt-5"
          >
            <v-card-text class=" pt-3">
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-data-table
                    dense
                    :headers="headers"
                    :items="desserts"
                    item-key="name"
                    class="elevation-1"
                  ></v-data-table>
                </v-col>
              </v-row>

              <v-row>

              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";

export default {
  components: {
                NavComponent,
              },
  data(){
    return{
      product_type:'',
      product_code: '',
      product_name: '',
      product_model: '',
      stock_more_0: true,
      product_type_list: ['일반', 'GFM', '전력변환기'],

      headers: [
        { text: '분류', align: 'center', value: 'product_type', },
        { text: '관리코드', align: 'center', value: 'product_code', },
        { text: '제품명', align: 'center', value: 'product_name', },
        { text: '모델명', align: 'center', value: 'product_model', },
        { text: '사양', align: 'center', value: 'product_spec', },
        { text: '제조사', align: 'center', value: 'manufacturer', },
        { text: '수량', align: 'center', value: 'product_num', },
        { text: '상태', align: 'center', value: 'product_condition', },
        { text: 'PE No.', align: 'center', value: 'pe_number', },
        { text: '입고일자', align: 'center', value: 'inbound_date', },
      ],


      desserts: [
        {
          product_type:'일반',
          product_code: '공장2F_E-09-02_PN-AF_SVG-001',
          product_name: '제품1',
          product_model: '모델A',
          product_spec: '690V 100A',
          manufacturer: '제조사AA',
          product_num: '3',
          product_condition: 'G',
          pe_number: 'PE240207-001',
          inbound_date: '2024-02-07',
        },
        {
          product_type:'GFM',
          product_code: '공장2F_E-09-02_PN-AF_SVG-002',
          product_name: '제품2',
          product_model: '모델B',
          product_spec: '480V 100A',
          manufacturer: '제조사AA',
          product_num: '2',
          product_condition: 'G',
          pe_number: 'PE240207-002',
          inbound_date: '2024-02-07',
        },
        {
          product_type:'전력변환기',
          product_code: '공장2F_E-09-02_PN-AF_SVG-003',
          product_name: '제품3',
          product_model: '모델C',
          product_spec: '690V 100A',
          manufacturer: '제조사AA',
          product_num: '5',
          product_condition: 'G',
          pe_number: 'PE240207-003',
          inbound_date: '2024-02-07',
        },
        {
          product_type:'일반',
          product_code: '공장2F_E-09-02_PN-AF_SVG-004',
          product_name: '제품4',
          product_model: '모델D',
          product_spec: '480V 100A',
          manufacturer: '제조사AA',
          product_num: '1',
          product_condition: 'G',
          pe_number: 'PE240207-004',
          inbound_date: '2024-02-07',
        },
      ],
    }
  },
}
</script>
<style lang="">

</style>
