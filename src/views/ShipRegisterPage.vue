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
                  item-key="product_info"
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
                  item-key="product_info"
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
                          filled
                          type="number"
                          style="max-width:150px"
                          v-model="item.product_ship_num"
                          @click="check_stock_num = item.stock_num"
                          :rules="shipNumRules"
                        >
                        </v-text-field>
                      </td>
                      <td align="center">{{  item.product_model }}</td>
                      <td align="center">{{  item.product_spec }}</td>
                      <td align="center">{{  item.manufacturer }}</td>
                      <td align="center">{{  item.spot }}</td>
                      <td align="center">{{  item.stock_num }}</td>
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
import ShipRegisterPageConfig from "@/configure/ShipRegisterPageConfig.json";
import CheckPagePermission from "@/common_js/CheckPagePermission";

export default {
  mixins: [CheckPagePermission('http://192.168.0.26:8081/api/check_page_permission?page_name=ShipRegisterPage')],
  components: {
                NavComponent,
                DataTableComponent,
                InputsFormComponent,
                CardComponent,
              },
  mounted(){
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
    // this.closeAll()
  },
  data(){
    return{
      add_self: false,
      select_product: true,
      dates: [],
      menu: false,
      check_stock_num:0,

      product_ship_data: [],
      product_ship_data_added: [],
      shipNumRules: [
        v => !!v || '출하 수량 입력',
        v => !!( v <= this.check_stock_num) || '출하 수량 > 재고 수량',
      ],

      searchCardInputs:ShipRegisterPageConfig.searchCardInputs,
      shipCardInputs:ShipRegisterPageConfig.shipCardInputs,
      product_ship_headers:ShipRegisterPageConfig.product_ship_headers,
      product_search_headers:ShipRegisterPageConfig.product_search_headers,
      product_search_data:ShipRegisterPageConfig.test_product_search_data,
    }
  },

  methods: {
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
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
