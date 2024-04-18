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
      @close="closeProductList"
    >
      <v-container>
        <v-row>
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
        <v-row>
          <v-col cols="12" class="pt-0">
            <table style="width:100%">
              <tr>
                <td class="approve_title" style="width:15%">비고</td>
                <td class="approve_text" style="width:85%">
                  {{  ship_info_data.note }}
                </td>
              </tr>
            </table>
          </v-col>
        </v-row>
        <v-row>

          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 시험성적서</p>
            <iframe width="100%" style="height:450px" :src="'https://mkorbucket-public.s3.ap-northeast-2.amazonaws.com/'+ship_info_data.inspection_report"></iframe>
          </v-col>
          <v-col cols="12" sm="4">
            <p class="font-weight-bold primary--text mb-0">▼ 기타 첨부</p>
            <v-chip
             color="grey lighten-2"
             class="ma-2"
              v-for="(file, i) in ship_info_data.files"
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
import ShipSearchPageConfig from "@/configure/ShipSearchPageConfig.json";

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
      ship_info_data:{},
      ship_product_list_data:[],

      searchCardInputs:ShipSearchPageConfig.searchCardInputs,
      ship_approve_headers:ShipSearchPageConfig.ship_approve_headers,
      ship_product_list_headers:ShipSearchPageConfig.ship_product_list_headers,
      ship_approve_data:ShipSearchPageConfig.test_ship_approve_data,
    }
  },

  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  },
  watch:{
    ship_product_list_dialog(val){
      val || this.closeProductList()
    },
  },
  methods:{
    closeProductList(){
      this.ship_product_list_dialog = false;
    },
    clickApproveData(item){
      let belong_datas = item.belong_data
      this.ship_product_list_data = [];
      this.ship_info_data = {};
      belong_datas.forEach(data =>{
        this.ship_product_list_data.push(data);
      })
      this.ship_info_data = {
        inspection_report : item.inspection_report,
        note: item.note,
        files: item.files.split(','),
      }
      this.ship_product_list_dialog = true;
    },
  },
}
</script>
<style lang="">

</style>
